import { User } from './user.model';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string; // Categoría del producto
  tags: string[]; // Etiquetas asociadas al producto
  fileUrl: string; // URL del archivo relacionado
  isActive: boolean; // Indica si el producto está activo
  createdAt: string; // Fecha de creación (ISO string)
  updatedAt: string; // Fecha de última actualización (ISO string)
  user: User; // Usuario asociado al producto
}