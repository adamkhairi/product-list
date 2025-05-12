import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ProductListComponent} from './components/product-list/product-list.component';

@Component({
  selector: 'app-root',
  imports: [ProductListComponent],
  template: '<app-product-list></app-product-list>',
  styleUrl: './app.component.css'
})
export class AppComponent {}
