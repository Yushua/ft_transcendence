export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
}

//you have the status of ready. imagine a changing status
//that i can set any time
export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}