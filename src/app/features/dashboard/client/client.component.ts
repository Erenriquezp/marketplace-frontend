import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client',
  imports: [CommonModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
})
export class ClientComponent {
  orders = [
    { id: 1, name: 'Producto 1', status: 'Completado' },
    { id: 2, name: 'Producto 2', status: 'Pendiente' },
  ];
}
