# Product List Application

A simple Angular application that displays a product list with search and sort features.
## Features

- Display products in a responsive flexbox layout
- Search products by name, description, category or brand
- Sort products by name (A-Z, Z-A), price (low to high, high to low) and rating

## Screenshots

![Application Screenshot](./Screenshot%202025-05-12%20at%2020-41-55%20ProductList.png)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/adamkhairi/product-list
   cd product-list
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Run the Application

Start the development server:

```
ng serve
```

The application will be available at `http://localhost:4200/`.

## Run Tests

To run the unit tests:

```
ng test
```

## Code Structure

### Components
- **ProductListComponent**: Main component that displays the product grid with search and sort functionality

### Services
- **ProductService**: Handles API communication to fetch product data

### Models
- **Product**: Interface that defines the structure of product data

## API Integration

This application communicates with the dummy JSON API:

- Base URL: `https://dummyjson.com/`
- Products endpoint: `products`

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── product-list/
│   │       ├── product-list.component.ts
│   │       ├── product-list.component.html
│   │       └── product-list.component.css
│   ├── models/
│   │   └── Product.ts
│   └── services/
│       └── product.service.ts
├── environments/
│   └── environment.ts
└── assets/
```
