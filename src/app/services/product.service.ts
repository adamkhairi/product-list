import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Product } from "../models/Product";
import { environment } from "../../environments/environment";

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = environment.apiUrl + "products";

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<ProductsResponse>(this.apiUrl).pipe(
      map((response: ProductsResponse) => response.products)
    );
  }
}
