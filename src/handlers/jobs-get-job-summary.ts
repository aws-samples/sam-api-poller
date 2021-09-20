import { AwsProxy } from '../common/aws-proxy';
import { ParamResolver } from '../common/params-resolver';
import {JobService} from '../services/job-service'

const paramResolver = new ParamResolver();
const awsProxy = new AwsProxy(paramResolver);
const taskService = new JobService(awsProxy, paramResolver);

const getJobId = (event: any): string => {

    if (event.pathParameters && event.pathParameters.jobId) {
        return event.pathParameters.jobId;
    }

    if (event.queryStringParameters && event.queryStringParameters.jobId) {
        return event.queryStringParameters.jobId;
    }

    throw new Error("Job Id cannot be empty");
}

export const handler = async (event: any) => {
    const result = await taskService.getJobSummaryAsync(getJobId(event));
    return result;
}