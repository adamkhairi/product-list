import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const mockProducts = [
    { 
      id: 1, 
      title: 'iPhone 9', 
      price: 549, 
      description: 'An apple mobile which is nothing like apple',
      category: 'smartphones',
      thumbnail: 'https://i.dummyjson.com/data/products/1/thumbnail.jpg',
      images: ['https://i.dummyjson.com/data/products/1/1.jpg'],
      rating: 4.69,
      stock: 94,
      brand: 'Apple',
      discountPercentage: 12.96
    },
    {
      id: 2,
      title: 'iPhone X',
      price: 899,
      description: 'SIM-Free, Model A19211',
      category: 'smartphones',
      thumbnail: 'https://i.dummyjson.com/data/products/2/thumbnail.jpg',
      images: ['https://i.dummyjson.com/data/products/2/1.jpg'],
      rating: 4.44,
      stock: 34,
      brand: 'Apple'
    },
    {
      id: 3,
      title: 'Samsung Universe 9',
      price: 1249,
      description: 'Samsung\'s new variant',
      category: 'smartphones',
      thumbnail: 'https://i.dummyjson.com/data/products/3/thumbnail.jpg',
      images: ['https://i.dummyjson.com/data/products/3/1.jpg'],
      rating: 4.09,
      stock: 36,
      brand: 'Samsung'
    }
  ];

  beforeEach(async () => {
    // Create a spy for ProductService
    const spy = jasmine.createSpyObj('ProductService', ['getProducts']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatIconModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ProductService, useValue: spy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    productServiceSpy.getProducts.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load products successfully', fakeAsync(() => {
      productServiceSpy.getProducts.and.returnValue(of(mockProducts));
      
      fixture.detectChanges(); // Triggers ngOnInit
      tick(); // Wait for async operations
      
      expect(component.products.length).toBe(3);
      expect(component.filteredProducts.length).toBe(3);
      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBeNull();
    }));

    it('should handle API errors', fakeAsync(() => {
      const errorResponse = new Error('API error');
      productServiceSpy.getProducts.and.returnValue(throwError(() => errorResponse));
      
      fixture.detectChanges(); // Triggers ngOnInit
      tick(); // Wait for async operations
      
      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Failed to load products. Please try again later.');
    }));
  });

  describe('filterProducts', () => {
    beforeEach(() => {
      productServiceSpy.getProducts.and.returnValue(of(mockProducts));
      fixture.detectChanges();
      component.products = mockProducts;
      component.filteredProducts = [...mockProducts];
    });

    it('should filter products by title', () => {
      component.searchTerm = 'iphone';
      component.filterProducts();
      expect(component.filteredProducts.length).toBe(2);
      expect(component.filteredProducts[0].title).toContain('iPhone');
    });

    it('should filter products by brand', () => {
      component.searchTerm = 'samsung';
      component.filterProducts();
      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].brand).toBe('Samsung');
    });

    it('should return all products when search term is empty', () => {
      component.searchTerm = '';
      component.filterProducts();
      expect(component.filteredProducts.length).toBe(3);
    });
  });

  describe('sortProducts', () => {
    beforeEach(() => {
      productServiceSpy.getProducts.and.returnValue(of(mockProducts));
      fixture.detectChanges();
      component.products = mockProducts;
      component.filteredProducts = [...mockProducts];
    });

    it('should sort products by name in ascending order', () => {
      component.sortOrder = 'nameAsc';
      component.sortProducts();
      expect(component.filteredProducts[0].title).toBe('iPhone 9');
      expect(component.filteredProducts[2].title).toBe('Samsung Universe 9');
    });

    it('should sort products by name in descending order', () => {
      component.sortOrder = 'nameDesc';
      component.sortProducts();
      expect(component.filteredProducts[0].title).toBe('Samsung Universe 9');
      expect(component.filteredProducts[2].title).toBe('iPhone 9');
    });

    it('should sort products by price in ascending order', () => {
      component.sortOrder = 'priceAsc';
      component.sortProducts();
      expect(component.filteredProducts[0].price).toBe(549);
      expect(component.filteredProducts[2].price).toBe(1249);
    });

    it('should sort products by price in descending order', () => {
      component.sortOrder = 'priceDesc';
      component.sortProducts();
      expect(component.filteredProducts[0].price).toBe(1249);
      expect(component.filteredProducts[2].price).toBe(549);
    });

    it('should sort products by rating', () => {
      component.sortOrder = 'ratingDesc';
      component.sortProducts();
      expect(component.filteredProducts[0].rating).toBe(4.69);
      expect(component.filteredProducts[2].rating).toBe(4.09);
    });
  });
});
