import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = { name: '', description: '', price: 0 };
  editingProduct: Product | null = null;
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

  // Crear un producto
  addProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.loadProducts(); // Recargar la lista de productos
        this.newProduct = { name: '', description: '', price: 0 }; // Reset formulario
      },
      error: (error) => {
        console.error('Error al crear producto', error);
      }
    });
  }

  // Editar un producto
  editProduct(product: Product): void {
    this.editingProduct = { ...product }; // Crear una copia para evitar modificar el original
  }

  // Guardar cambios en un producto
  saveProduct(): void {
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id!, this.editingProduct).subscribe(
        (updatedProduct) => {
          if (updatedProduct) {
            const index = this.products.findIndex((p) => p.id === updatedProduct.id);
            this.products[index] = updatedProduct;
          }
          this.editingProduct = null; // Salir del modo edición
        },
        (error) => {
          console.error('Error al actualizar producto', error);
        }
      );
    }
  }

  // Eliminar un producto
  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter((product) => product.id !== id);
      },
      error: (error) => {
        console.error('Error al eliminar producto', error);
      }
    });
  }

  // Método para cambiar de página
  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts(); // Cargar productos de la nueva página
  }
}