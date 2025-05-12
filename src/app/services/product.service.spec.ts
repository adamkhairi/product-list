import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { environment } from '../../environments/environment';
import { Product } from '../models/Product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should fetch products and transform the response correctly', () => {
      const mockProducts = {
        products: [
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
          }
        ],
        total: 2,
        skip: 0,
        limit: 30
      };

      let actualProducts: Product[] = [];
      service.getProducts().subscribe(products => {
        actualProducts = products;
      });

      const req = httpMock.expectOne(`${environment.apiUrl}products`);
      expect(req.request.method).toBe('GET');
      
      req.flush(mockProducts);
      
      expect(actualProducts.length).toBe(2);
      expect(actualProducts).toEqual(mockProducts.products);
      expect(actualProducts[0].id).toBe(1);
      expect(actualProducts[0].title).toBe('iPhone 9');
      expect(actualProducts[1].id).toBe(2);
    });

    it('should handle HTTP errors', () => {
      let actualError: any = null;
      service.getProducts().subscribe({
        next: () => fail('Expected an error, not successful response'),
        error: (error) => {
          actualError = error;
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}products`);
      
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
      
      expect(actualError).not.toBeNull();
      expect(actualError.status).toBe(404);
      expect(actualError.statusText).toBe('Not Found');
    });
  });
});
