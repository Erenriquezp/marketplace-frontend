import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public',
  imports: [ CommonModule ],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent {
  userProfile = {
    name: 'Nino',
    bio: 'Desarrollador Fullstack y creador de contenido.',
    avatar: 'https://via.placeholder.com/150',
    skills: ['Angular', 'Node.js', 'UI/UX'],
  };
}