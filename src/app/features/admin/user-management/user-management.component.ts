import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-management',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  newUser: User = { id: 0, username: '', password: '', email: '', phoneNumber: '', wallet: 0, roles: [], profilePictureUrl: '', isActive: true, createdAt: '', updatedAt: '', products: [] };
  editingUser: User | null = null;
  loading = false;
  errorMessage: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Cargar todos los usuarios
  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers()
      .pipe(
        catchError((error) => {
          console.error(error);
          this.errorMessage = 'Failed to load users';
          this.loading = false;
          return of([]); // Return an empty array on error
        })
      )
      .subscribe((data) => {
        this.users = data;
        this.loading = false;
      });
  }


  // Crear un usuario
  addUser(): void {
    this.userService.createUser(this.newUser).subscribe((user) => {
      this.users.push(user);
      this.newUser = { id: 0, username: '', password: '', email: '', phoneNumber: '', wallet: 0, roles: [], profilePictureUrl: '', isActive: true, createdAt: '', updatedAt: '', products: [] }; // Reset form
    });
  }

  // Editar un usuario
  editUser(user: User): void {
    this.editingUser = { ...user }; // Copia del usuario para edición
  }

  // Guardar cambios en un usuario
  saveUser(): void {
    if (this.editingUser) {
      this.userService
        .updateUser(this.editingUser.id!, this.editingUser)
        .subscribe((updatedUser) => {
          const index = this.users.findIndex((u) => u.id === updatedUser.id);
          this.users[index] = updatedUser;
          this.editingUser = null; // Salir del modo edición
        });
    }
  }

  // Eliminar un usuario
  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter((user) => user.id !== id);
    });
  }
}
