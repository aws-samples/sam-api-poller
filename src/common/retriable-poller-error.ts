class RetriablePollerError extends Error {
    /**
     * Represents a poller error that we want to retry
     */
    constructor(message: string, stack: string | undefined) {

        super(message);

        this.stack = stack;

        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class RetriableErrorFactory {

    retriablePollerError = (err: any) : RetriablePollerError => {

        const error = err as Error;

        if (error) {
            return new RetriablePollerError(error.message, error.stack);
        }

        return new RetriablePollerError(JSON.stringify(err), undefined);
    }

}

export const retriableErrorFactory = new RetriableErrorFactory();