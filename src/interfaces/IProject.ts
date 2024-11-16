import { Task } from './ITask';
export  interface Project {
    projectId: number;
    name: string;
    startDate: string;
    tasks: Task[];
}