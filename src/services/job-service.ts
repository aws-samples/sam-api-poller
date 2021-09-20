import * as uuid from 'uuid';
import { DynamoDB } from 'aws-sdk';
import { IAwsProxy } from '../common/aws-proxy';
import { TaskState, JobSummary, RequestMetadata, PollerTask } from '../common/models'
import { IParamResolver } from '../common/params-resolver';

export class JobService {

    private awsProxy: IAwsProxy;
    private paramResolver: IParamResolver;

    constructor(awsProxy: IAwsProxy, paramResolver: IParamResolver) {
        this.awsProxy = awsProxy;
        this.paramResolver = paramResolver;
    }

    private calculateTimeToLive = (): string => {
        return `${Math.floor(Date.now() / 1000) + 3000}`;
    }

    createPollerTasks = (jobId: string, metadata: RequestMetadata): PollerTask[] => {
        const ttl = this.calculateTimeToLive();
        const tasks: PollerTask[] = [];

        let index: number = 0;
        while (index < metadata.TotalRecordsToBeLoaded) {
            tasks.push({
                request: {
                    StartAt: index,
                    Count: metadata.MaxRecordsPerPage,
                    BaseUrl: metadata.BaseUrl
                },
                jobId: jobId,
                taskId: uuid.v1(),
                ttl: ttl
            });
            index += metadata.MaxRecordsPerPage;
        }
        return tasks;
    }

    logTaskProgressAsync = async (jobId: string, taskId: string, state: TaskState): Promise<void> => {

        let items: any[] = [];

        const ttl = Math.floor(Date.now() / 1000) + 3000;

        items.push({
            PutRequest: {
                Item: {
                    'JobId': { "S": jobId },
                    'TaskId': { "S": taskId },
                    'State': { "S": state },
                    'TimeToLive': { "N": `${ttl}` }
                }
            }
        });

        const ddbTableName = this.paramResolver.tasksDdbTableName();

        const params: AWS.DynamoDB.BatchWriteItemInput = {
            RequestItems: {
                [ddbTableName]: items
            }
        };

        await this.awsProxy.DDB().batchWriteItem(params).promise();
    }

    getJobSummaryAsync = async (jobId: string): Promise<JobSummary> => {

        const ddbTableName = this.paramResolver.tasksDdbTableName();

        const queryParams: DynamoDB.QueryInput = {
            TableName: ddbTableName,
            KeyConditionExpression: 'JobId = :v1',
            ExpressionAttributeValues: {
                ':v1': {
                    S: jobId
                }
            },
            Select: 'ALL_ATTRIBUTES'
        };

        const queryResult = await this.awsProxy.DDB().query(queryParams).promise();

        if (!queryResult.Items) {
            throw new Error("Task not found!");
        }

        const jobSummary = {
            Started: queryResult.Items.filter(i => i.State.S === TaskState.Started).length,
            PayloadSaved: queryResult.Items.filter(i => i.State.S === TaskState.PayloadSaved).length,
            Enqueued: queryResult.Items.filter(i => i.State.S === TaskState.Enqueued).length,
            SuccessfullyCompleted: queryResult.Items.filter(i => i.State.S === TaskState.Complete).length,
            FailedToComplete: queryResult.Items.filter(i => i.State.S === TaskState.Failed).length,
            Total: queryResult.Items.length
        };

        return jobSummary;
    }
}