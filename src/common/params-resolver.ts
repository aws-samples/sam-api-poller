export interface IParamResolver {
    currentRegion(): string;
    tasksDdbTableName(): string;
    payloadBucket(): string;
}

export class ParamResolver implements IParamResolver {

    currentRegion = () : string => {
        return process.env.AWS_REGION!;
    }

    tasksDdbTableName = () : string => {
        return process.env.TASK_DDB_TABLE!
    }

    payloadBucket = () : string => {
        return process.env.PAYLOAD_BUCKET!;
    }
}