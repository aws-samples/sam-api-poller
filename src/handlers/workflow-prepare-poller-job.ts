import { PollerJob, TaskStateMap } from '../common/models';
import { ParamResolver } from '../common/params-resolver';
import { AwsProxy } from '../common/aws-proxy';
import { PayloadProxyService } from '../services/payload-proxy-service';
import { JobService } from '../services/job-service';

const paramResolver = new ParamResolver();
const awsProxy = new AwsProxy(paramResolver);
const jobService = new JobService(awsProxy, paramResolver);
const payloadProxyService = new PayloadProxyService();

export const handler = async (event: any) : Promise<PollerJob> => {

    const jobId = event.id;
    const metadata = await payloadProxyService.getMetadataAsync(event.detail.url);
    const tasks = jobService.createPollerTasks(jobId, metadata);

    return {
        tasks: tasks,
        taskStateMap: new TaskStateMap()
    };
}