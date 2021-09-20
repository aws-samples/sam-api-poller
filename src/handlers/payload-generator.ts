const totalRecordCount = 10000;
const pageSize = 100;

const delay = (delayMs: number) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayMs);
    });
}

const getRndInteger = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min)) + min;
}

export const handler = async (event: any) => {

    // in 10% cases generate an intermittet error to simulate real world API
    const intermittentError = getRndInteger(0, 10);
    if (intermittentError === 1) {
        throw new Error("Intermittent Error");
    }

    const randomDelay = getRndInteger(0, 1000);

    // we are generating a random delay to simulate a real world API
    await delay(randomDelay);

    const params = {
        startAt: 0,
        count: pageSize
    };

    // taking care of pagination
    if (event.queryStringParameters && event.queryStringParameters.startAt) {
        params.startAt = Number(event.queryStringParameters.startAt)
    }

    if (params.startAt > totalRecordCount) {
        throw new Error("Invalid StartAt");
    }

    if (event.queryStringParameters && event.queryStringParameters.count) {
        const count = Number(event.queryStringParameters.count);
        if (count <= pageSize) {
            params.count = count;
        }
    }

    const payload: any[] = [];

    let maxRecordsToLoad = params.startAt + params.count;
    if (maxRecordsToLoad > totalRecordCount) {
        maxRecordsToLoad = totalRecordCount;
    }
    for (let index = params.startAt; index < maxRecordsToLoad; index++) {
        const element = {
            "id": index,
            "payload": `Sample payload for record "${index}"`
        };
        payload.push(element);
    }
    
    return {
        maxRecordsPerPage: pageSize,
        totalRecords: totalRecordCount,
        payload: payload
    };;
}