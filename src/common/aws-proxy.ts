import { SQS, DynamoDB, S3 } from 'aws-sdk'
import { IParamResolver } from './params-resolver';

export class AwsProxy implements IAwsProxy {

    private ddb: AWS.DynamoDB | undefined;
    private sqs: AWS.SQS | undefined;
    private s3: AWS.S3 | undefined;

    private paramResolver: IParamResolver;

    constructor(paramResolver: IParamResolver) {
        this.paramResolver = paramResolver;
    }

    SQS = () : AWS.SQS => {
        if (!this.sqs) {
            this.sqs = new SQS({
                region: this.paramResolver.currentRegion()
            });
        }
        return this.sqs;
    }

    DDB = () : AWS.DynamoDB => {
        if (!this.ddb) {
            this.ddb = new DynamoDB({
                region: this.paramResolver.currentRegion()
            });
        }
        return this.ddb;
    }

    S3 = () : AWS.S3 => {
        if (!this.s3) {
            this.s3 = new S3({
                region: this.paramResolver.currentRegion()
            });
        }
        return this.s3;
    }
}

export interface IAwsProxy {
    SQS(): AWS.SQS;
    DDB(): AWS.DynamoDB;
    S3(): AWS.S3;
}