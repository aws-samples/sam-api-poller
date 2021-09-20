export enum TaskState {
    Started = 'STARTED',
    PayloadSaved = 'PAYLOADSAVED',
    Enqueued = 'ENQUEUED',
    Complete = 'COMPLETE',
    Failed = 'FAILED'
}
export class TaskStateMap {
    Started: TaskState = TaskState.Started;
    PayloadSaved: TaskState = TaskState.PayloadSaved;
    Enqueued: TaskState = TaskState.Enqueued;
    Complete: TaskState = TaskState.Complete;
    Failed: TaskState = TaskState.Failed;
}
export interface JobSummary {
    FailedToComplete: number,
    SuccessfullyCompleted: number,
    Started: number,
    Enqueued: number,
    PayloadSaved: number,
    Total: number
}
export interface Task {
    jobId: string,
    taskId: string,
    ttl: string
}
export interface PollerTask extends Task {
    request: PagedRequest
}
export interface PollerJob {
    tasks: PollerTask[],
    taskStateMap: TaskStateMap
}
export interface RequestMetadata {
    BaseUrl: string,
    MaxRecordsPerPage: number,
    TotalRecordsToBeLoaded: number
}
export interface PagedRequest {
    BaseUrl: string,
    StartAt: number,
    Count: number
}
export interface PayloadLocation {
    bucket: string,
    key: string
}