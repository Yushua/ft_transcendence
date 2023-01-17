export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
}
declare enum TaskStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}
export {};
