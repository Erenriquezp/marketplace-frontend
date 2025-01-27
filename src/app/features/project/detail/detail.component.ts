import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  imports: [CommonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  project: unknown;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.params['id'];
    // Simula cargar datos del proyecto desde el backend
    this.project = {
      id: projectId,
      title: 'Sitio Web',
      description: 'Desarrollar un sitio web moderno y responsivo.',
      budget: 500,
      deadline: '2025-02-10',
    };
  }
}
