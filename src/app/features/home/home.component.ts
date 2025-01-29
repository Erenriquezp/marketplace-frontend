import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule,MatCardModule, MatButtonModule, MatGridListModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title = 'Bienvenido al Marketplace';
  categories = [
    {
      name: 'Desarrollo Web',
      description: 'Encuentra freelancers para crear sitios web y aplicaciones.',
      imageUrl: '/assets/images/categorias/programming-background-collage.jpg'
    },
    {
      name: 'Diseño Gráfico',
      description: 'Diseñadores expertos en branding, logos y contenido visual.',
      imageUrl: '/assets/images/categorias/workplace-2230698_1280.jpg'
    },
    {
      name: 'Marketing Digital',
      description: 'Profesionales en SEO, redes sociales y estrategias de marketing.',
      imageUrl: '/assets/images/categorias/pexels-serpstat-177219-572056.jpg'
    }
  ];

  freelancers = [
    {
      id: 1,
      name: 'John Doe',
      profession: 'Desarrollador Web',
      imageUrl: 'assets/images/jennie-kim-blackpink-beautiful-korean-girl-uhdpaper.com-4K-8.1262.jpg'
    },
    {
      id: 2,
      name: 'Jane Smith',
      profession: 'Diseñadora Gráfica',
      imageUrl: 'assets/images/lalisaa-balckpink.jpg'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      profession: 'Especialista en Marketing Digital',
      imageUrl: 'assets/images/rose-blackpink.jpg'
    }
  ];
}
