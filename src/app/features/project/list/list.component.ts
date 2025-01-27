import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  projects = [
    { id: 1, title: 'Sitio Web', budget: 500, deadline: '2025-02-10' },
    { id: 2, title: 'Aplicación Móvil', budget: 1000, deadline: '2025-03-01' },
  ];
}
