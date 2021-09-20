import { JobService } from '../services/job-service'
import { PayloadService } from '../services/payload-service'
import { PayloadLocation, TaskState } from '../common/models';
import { AwsProxy } from '../common/aws-proxy';
import { ParamResolver } from '../common/params-resolver';

const paramResolver = new ParamResolver();
const awsProxy = new AwsProxy(paramResolver);
const taskService = new JobService(awsProxy, paramResolver);
const payloadService = new PayloadService(awsProxy, paramResolver);

export const handler = async (event: any) => {

    for (let index = 0; index < event.Records.length; index++) {
        const record = event.Records[index];

        const payloadLocation = JSON.parse(record.body).payloadLocation as PayloadLocation;

        // as an example, we are simply deleting the payload from S3
        await payloadService.deletePayloadFromS3Async({
            bucket: payloadLocation.bucket,
            key: payloadLocation.key
        });

        const jobId = record.messageAttributes.jobId.stringValue;
        const taskId = record.messageAttributes.taskId.stringValue;

        await taskService.logTaskProgressAsync(jobId, taskId, TaskState.Complete);
    }

    // since we are returning a success, sqs message will be deleted from the sqs queue
    return {};
}