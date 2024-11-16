export interface Task {
    taskId: number;
    description: string;
    status: 'pendiente' | 'en progreso' | 'completada';
    deadline: string;
}
