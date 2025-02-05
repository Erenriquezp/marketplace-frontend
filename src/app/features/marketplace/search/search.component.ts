import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FreelanceServiceService } from '../../services/freelance-service.service';
import { Product } from '../../../core/models/product.model';
import { FreelanceService } from '../../../core/models/freelance-service.model';
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
  services: FreelanceService[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0; // Para almacenar el total de elementos
  searchQuery = '';
  searchType: 'products' | 'services' = 'products'; // Estado de búsqueda

  categories = [
    { name: 'Diseño de Sitios Web', imageUrl: '/assets/images/categorias/pexels-designecologist-1779487.jpg' },
    { name: 'Aplicaciones Móviles', imageUrl: '/assets/images/categorias/app-1013616_1280.jpg' },
    { name: 'Marketing Digital', imageUrl: '/assets/images/categorias/pexels-serpstat-177219-572056.jpg' },
    { name: 'Diseño Gráfico', imageUrl: '/assets/images/categorias/workplace-2230698_1280.jpg' },
    { name: 'Diseño de Logotipos', imageUrl: '/assets/images/categorias/logo-be-creative-inspiration-design-concept.jpg' },
    { name: 'Corrección de Textos', imageUrl: '/assets/images/categorias/pexels-iamhogir-17801349.jpg' },
    { name: 'Art', imageUrl: '/assets/images/categorias/5449686.jpg' },
    { name: 'Procesamiento de Datos', imageUrl: '/assets/images/categorias/standard-quality-control-collage-concept.jpg' },
    { name: 'Arquitectura de Software', imageUrl: '/assets/images/categorias/pexels-mikhail-nilov-7988114.jpg' }
  ];
  
  searchCategory = '';
  minPrice?: number;
  maxPrice?: number;
  noResultsFound = false;

  constructor(
    private productService: ProductService,
    private freelanceService: FreelanceServiceService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Cargar productos o servicios según el tipo seleccionado.
   */
  loadData(): void {
    if (this.searchType === 'products') {
      this.loadProducts();
    } else {
      this.loadServices();
    }
  }

  /**
   * Cargar productos con paginación.
   */
  loadProducts(): void {
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.products = response.content;
        this.totalElements = response.totalElements;
      },
      (error) => console.error('Error al cargar productos', error)
    );
  }

  /**
   * Cargar servicios con paginación.
   */
  loadServices(): void {
    this.freelanceService.getFreelanceServices(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.services = response.content;
        this.totalElements = response.totalElements;
      },
      (error) => console.error('Error al cargar servicios freelance', error)
    );
  }

  onSearch(): void {
    this.noResultsFound = true;
  
    if (this.searchType === 'products' && this.searchCategory) {
      this.productService.searchProductsByCategory(this.searchCategory).subscribe({
        next: (results) => {
          this.products = results.content;
          console.log('Resultados encontrados:', results.content.length);
          this.noResultsFound = results.content.length === 0;
          console.log('Resultados:', this.noResultsFound);
          console.log('Resultados:', results);
        },
        error: (error) => console.error('Error en búsqueda de productos:', error),
      });
    } else {
      console.warn('Debe seleccionar una categoría para buscar productos.');
    }
  }

  /**
   * Cambiar tipo de búsqueda (productos o servicios).
   */
  changeSearchType(type: 'products' | 'services'): void {
    this.searchType = type;
    this.onSearch(); // Realizar la búsqueda según el tipo
  }

  /**
   * Cambiar de página en la paginación.
   */
  changePage(page: number): void {
    this.currentPage = page;
    this.loadData();
  }
}
