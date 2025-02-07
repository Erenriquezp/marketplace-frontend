export interface Project {
    id?: number;
    title: string;
    description: string;
    estimatedBudget: number;
    deadline: string;
    clientId?: number; // Se asigna automáticamente en el backend
}
