import axios from 'axios';

import { PagedRequest, RequestMetadata } from '../common/models';
import { retriableErrorFactory } from '../common/retriable-poller-error';

export class PayloadProxyService {
    
    constructor() {
    }

    getMetadataAsync = async (url: string) : Promise<RequestMetadata> =>  {
        const result = await this.executeRequestAsync({
            BaseUrl: url,
            StartAt: 0,
            Count: 1
        });

        return {
            BaseUrl: url,
            MaxRecordsPerPage: result.maxRecordsPerPage,
            TotalRecordsToBeLoaded: result.totalRecords
        };
    }

    getPayloadAsync = async (request: PagedRequest) : Promise<any> =>  {
        return await this.executeRequestAsync(request);
    }

    private executeRequestAsync = async (request: PagedRequest) : Promise<any> => {
        try {
            const result = await axios.get(request.BaseUrl, {
                headers: {
                    'cache-control': 'no-cache',
                    'content-type': 'text/plain'
                },
                params: {
                    'startAt': request.StartAt,
                    'count': request.Count
                }
            });

            return result.data;
        } catch (err) {
            console.log('Error', JSON.stringify(err));
            // we are considering this error intermittent and will want to retry it
            throw retriableErrorFactory.retriablePollerError(err);
        }
    }  
}