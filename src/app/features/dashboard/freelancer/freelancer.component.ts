import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-freelancer',
  imports: [CommonModule],
  templateUrl: './freelancer.component.html',
  styleUrls: ['./freelancer.component.scss',], // Corregido: `styleUrls` en lugar de `styleUrl`
})
export class FreelancerComponent {
  offers = [
    { id: 1, name: 'Servicio 1', status: 'Aceptado' },
    { id: 2, name: 'Servicio 2', status: 'En espera' },
  ];
}
