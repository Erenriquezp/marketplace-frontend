export interface FreelanceService {
    id?: number;
    name: string; // Nombre del servicio
    description: string; // Descripción detallada
    price: number; // Precio del servicio
    skillsRequired: string[]; // Habilidades requeridas
    skillsString?: string; // Habilidades requeridas (String)
    estimatedDelivery: number; // Tiempo de entrega en días
    userId?: number; // ID del usuario que ofrece el servicio
    isActive?: boolean; // Indica si el servicio está activo
    createdAt?: string; // Fecha de creación (ISO String)
    updatedAt?: string; // Fecha de actualización (ISO String)
  }
  