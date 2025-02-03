import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  products: Product[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0; // Para almacenar el total de productos
  searchQuery = '';
  categories = [
    { name: 'Diseño de Sitios Web', imageUrl: '/assets/images/categorias/pexels-designecologist-1779487.jpg' },
    { name: 'Aplicaciones Móviles', imageUrl: '/assets/images/categorias/app-1013616_1280.jpg' },
    { name: 'Marketing Digital', imageUrl: '/assets/images/categorias/pexels-serpstat-177219-572056.jpg' },
    { name: 'Diseño Gráfico', imageUrl: '/assets/images/categorias/workplace-2230698_1280.jpg' },
    { name: 'Diseño de Logotipos', imageUrl: '/assets/images/categorias/logo-be-creative-inspiration-design-concept.jpg' },
    { name: 'Corrección de Textos', imageUrl: '/assets/images/categorias/pexels-iamhogir-17801349.jpg' },
    { name: 'Traducción', imageUrl: '/assets/images/categorias/5449686.jpg'},
    { name: 'Procesamiento de Datos', imageUrl: '/assets/images/categorias/standard-quality-control-collage-concept.jpg' },
    { name: 'Arquitectura de Software', imageUrl: '/assets/images/categorias/pexels-mikhail-nilov-7988114.jpg' }
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Cargar productos con paginación
  loadProducts(): void {
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.products = response.content; // Asegúrate de acceder a la propiedad 'content'
        this.totalElements = response.totalElements; // Almacena el total de elementos
      },
      (error) => {
        console.error('Error al cargar productos', error);
      }
    );
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.productService.searchProducts(this.searchQuery).subscribe({
        next: (results) => (this.products = results),
        error: (error) => console.error('Error en búsqueda:', error),
      });
    } else {
      this.loadProducts(); // Cargar todos los productos si no hay búsqueda
    }
  }

  // Método para cambiar de página
  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts(); // Cargar productos de la nueva página
  }
}
