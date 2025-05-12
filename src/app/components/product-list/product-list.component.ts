import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { Product } from "../../models/Product";
import { ProductService } from "../../services/product.service";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: "app-product-list",
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: "./product-list.component.html",
  styleUrl: "./product-list.component.css",
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading: boolean = true;
  searchTerm: string = "";
  sortOrder: string = "asc";
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.products = data;
          this.filteredProducts = [...data];
          this.isLoading = false;
          this.sortProducts();
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.errorMessage =
            "Failed to load products. Please try again later.";
        },
      });
  }

  filterProducts(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter((product) =>
      product.title.toLowerCase().includes(term),
    );
    this.sortProducts();
  }

  sortProducts(): void {
    this.filteredProducts.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return this.sortOrder === "asc" ? comparison : -comparison;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
