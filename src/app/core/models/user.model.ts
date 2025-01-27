export interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  roles: string[]; // Roles del usuario (ejemplo: ['ROLE_FREELANCER'])
  wallet: number; // Saldo en el monedero del usuario
  profilePictureUrl: string; // URL de la foto de perfil
  isActive: boolean; // Indica si el usuario está activo
  createdAt: string; // Fecha de creación (ISO string)
  updatedAt: string; // Fecha de última actualización (ISO string)
}
