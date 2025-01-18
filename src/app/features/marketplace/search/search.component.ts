import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  products: Product[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0; // Para almacenar el total de productos

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
  
  // Método para cambiar de página
  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts(); // Cargar productos de la nueva página
  }
}
