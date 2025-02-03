export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string; // Categoría del producto
  tags: string[]; // Etiquetas asociadas al producto
  tagsString?: string; // Se usará en el formulario para convertir a array
  fileUrl?: string; // URL del archivo relacionado
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: number; // Asociamos el producto con el usuario autenticado
}