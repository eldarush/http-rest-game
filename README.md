# REST Quest

An interactive web game for learning HTTP and REST API concepts.

## Overview
Built with Node.js and Express, this project illustrates client-server communication using real HTTP requests. The player works through 10 progressive stages, building a real HTTP request in each and inspecting the server's actual response.
- **REST Endpoints**: CRUD operations for two related resources — products and reviews (`GET`, `POST`, `PUT`, `DELETE`).
- **Query & Route Parameters**: Filter by category and sort by price; nested product-to-reviews relationship routes.
- **SSR Views**: EJS templates for the game client and `/schemas` documentation page.
- **In-Memory Store**: Data stored in memory (no external database); create/update/delete persist for the server's lifetime.
- **Server-Side Validation**: Each request carries an `X-Stage-Id` header; the server checks method, path, params, and body against the stage's rules and returns the verdict via response headers. No solution logic lives on the client.

## Running Locally

```bash
npm install
npm start
```
The server will start at `http://localhost:3000`.

### Endpoints
- `GET /` - Main game page
- `GET /schemas` - Resource schemas documentation
- `GET /api/products` - List products (`?category=...&sort=price`)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/reviews` - List all reviews (`?productId=...` to scope to a product)
- `GET /api/products/:id/reviews` - List reviews for a product (nested relationship)
- `POST /api/products/:id/reviews` - Add a review to a product
- `DELETE /api/reviews/:id` - Delete a review

## Authors
Developed jointly by **Eldar Aslanbeily** and **Ofir Hodara** for the Web Application Development course.
