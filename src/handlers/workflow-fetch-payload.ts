import { PayloadService } from '../services/payload-service';
import { PayloadProxyService } from '../services/payload-proxy-service';
import { AwsProxy } from '../common/aws-proxy';
import { ParamResolver } from '../common/params-resolver';
import { PollerTask } from '../common/models';

const paramResolver = new ParamResolver();
const awsProxy = new AwsProxy(paramResolver);
const payloadService = new PayloadService(awsProxy, paramResolver);

const payloadProxyService = new PayloadProxyService();

export const handler = async (event: any) : Promise<any> => {

    const task: PollerTask = event.task as PollerTask;

    if (!task) {
        console.log('event', event);
        throw new Error("Task cannot be found");
    }

    const payload = await payloadProxyService.getPayloadAsync({
       BaseUrl: task.request.BaseUrl,
       Count: task.request.Count,
       StartAt: task.request.StartAt
    });

    // note that if the payloade size is > 256 KB, you will need to store it in S3 first
    // that's what we are doing
    const storageLocation = await payloadService.savePayloadToS3Async(task.jobId, task.taskId, payload);

    return {
        ...event,
        payloadLocation: {
            ...storageLocation
        }
    };
}