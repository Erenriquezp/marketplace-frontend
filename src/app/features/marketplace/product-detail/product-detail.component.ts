import { Component, OnInit } from '@angular/core';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product!: Product;

  ngOnInit(): void {
    // Aquí podrías cargar el producto desde un servicio.
    this.product = {
      id: 1,
      name: 'Producto Ejemplo',
      description: 'Una descripción detallada del producto.',
      price: 100.0,
      fileUrl: 'https://via.placeholder.com/400',
    };
  }
}
