import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = { name: '', description: '', price: 1, category: '', tags: [] };
  editingProduct: Product | null = null;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  isFreelancer = false;
  isLoading = true;
  errorMessage = '';

  constructor(private productService: ProductService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.checkUserRole();
  }

  /**
   * Verifica si el usuario autenticado tiene el rol "ROLE_FREELANCER"
   */
  checkUserRole(): void {
    const roles = this.authService.currentUserValue?.roles || [];
    this.isFreelancer = roles.includes('ROLE_FREELANCER');
  }

  /**
   * Cargar la lista de productos con paginación.
   */
  private loadProducts(): void {
    const userId = this.authService.currentUserValue?.id; // Obtén el ID del usuario autenticado
    if (userId) {
      this.productService.getProductsByUserId(userId).subscribe({
        next: (response) => {
          this.products = response.content;
          this.totalElements = response.totalElements;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar productos del usuario', error);
          this.errorMessage = 'Error al cargar productos.';
          this.isLoading = false;
        },
      });
    } else {
      this.errorMessage = 'No hay un usuario autenticado.';
      this.isLoading = false;
    }
  }

  /**
   * Convertir tags de string a array antes de guardar.
   */
  convertTags(product: Product): void {
    if (product.tagsString) {
      product.tags = product.tagsString.split(',').map(tag => tag.trim());
    } else {
      product.tags = [];
    }
  }

  /**
   * Crear un nuevo producto.
   */
  addProduct(): void {
    if (!this.isFreelancer) {
      console.error('Solo los freelancers pueden publicar productos');
      return;
    }

    this.convertTags(this.newProduct); // Convertir tags antes de enviar

    this.productService.createProduct(this.newProduct).subscribe({
      next: (createdProduct) => {
        if (createdProduct) {
          this.products.push(createdProduct);
          this.newProduct = { name: '', description: '', price: 0, category: '', tags: [] };
        }
      },
      error: (error) => console.error('Error al crear producto', error),
    });
  }

  /**
   * Editar un producto existente.
   */
  editProduct(product: Product): void {
    this.editingProduct = { ...product, tagsString: product.tags ? product.tags.join(', ') : '' };
  }

  /**
   * Guardar los cambios en un producto editado.
   */
  saveProduct(): void {
    if (this.editingProduct) {
      this.convertTags(this.editingProduct); // Convertir tags antes de enviar

      this.productService.updateProduct(this.editingProduct.id!, this.editingProduct).subscribe({
        next: (updatedProduct) => {
          if (updatedProduct) {
            const index = this.products.findIndex((p) => p.id === updatedProduct.id);
            if (index !== -1) {
              this.products[index] = updatedProduct;
            }
          }
          this.editingProduct = null;
        },
        error: (error) => console.error('Error al actualizar producto', error),
      });
    }
  }

  /**
   * Eliminar un producto.
   */
  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter((product) => product.id !== id);
      },
      error: (error) => console.error('Error al eliminar producto', error),
    });
  }

  /**
   * Cambiar de página en la paginación.
   */
  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }
}
