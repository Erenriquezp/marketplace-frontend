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
    { name: 'WordPress', imageUrl: '/assets/images/categorias/pexels-designecologist-1779487.webp' },
    { name: 'Flutter', imageUrl: '/assets/images/categorias/app-1013616_1280.webp' },
    { name: 'Marketing', imageUrl: '/assets/images/categorias/pexels-serpstat-177219-572056.webp' },
    { name: 'Publicidad', imageUrl: '/assets/images/categorias/workplace-2230698_1280.webp' },
    { name: 'Logotipos', imageUrl: '/assets/images/categorias/logo-be-creative-inspiration-design-concept.webp' },
    { name: 'Escritura', imageUrl: '/assets/images/categorias/pexels-iamhogir-17801349.webp' },
    { name: 'Art', imageUrl: '/assets/images/categorias/5449686.webp'},
    { name: 'IA', imageUrl: '/assets/images/categorias/standard-quality-control-collage-concept.webp' },
    { name: 'Optimización Web', imageUrl: '/assets/images/categorias/pexels-mikhail-nilov-7988114.webp' }
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
      (error) => console.error('Error al cargar todos los servicios freelance', error)
    );
  }

  onSearch(): void {
    this.noResultsFound = false;
  
    if (this.searchType === 'products') {
      this.productService.searchProducts(this.searchQuery, this.searchCategory).subscribe({
        next: (results) => {
          this.products = results;
          this.noResultsFound = results.length === 0;
          console.log('Resultados:', results);
        },
        error: (error) => console.error('Error en búsqueda de productos:', error),
      });
    }

    if (this.searchType === 'services') {
      this.freelanceService.searchFreelanceServices(this.searchQuery, this.searchCategory).subscribe({
        next: (results) => {
          this.services = results;
          this.noResultsFound = results.length === 0;
          console.log('Resultados:', results);
        },
        error: (error) => console.error('Error en búsqueda de servicios:', error),
      });
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
