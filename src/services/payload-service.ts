import { IAwsProxy } from '../common/aws-proxy';
import { PayloadLocation } from '../common/models';
import { IParamResolver } from '../common/params-resolver';

export class PayloadService {

    private awsProxy: IAwsProxy;
    private paramResolver: IParamResolver;
    
    constructor(awsProxy: IAwsProxy, paramResolver: IParamResolver) {
        this.awsProxy = awsProxy;
        this.paramResolver = paramResolver;
    }

    savePayloadToS3Async = async (jobId: string, taskId: string, payload: object) : Promise<PayloadLocation> => {

        const bucket = this.paramResolver.payloadBucket();
        const key = `${jobId}/${taskId}.json`;

        await this.awsProxy.S3().putObject({
            Bucket: bucket,
            Key: key,
            StorageClass: "STANDARD",
            Body: JSON.stringify(payload)
        }).promise();

        return {
            bucket: bucket,
            key: key
        };
    }

    deletePayloadFromS3Async = async (payloadLocation: PayloadLocation) : Promise<void> => {

        await this.awsProxy.S3().deleteObject({
            Bucket: payloadLocation.bucket,
            Key: payloadLocation.key
        }).promise();
    }
}