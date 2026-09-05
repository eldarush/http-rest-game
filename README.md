# REST Quest

An interactive web game for learning HTTP and REST API concepts.

## Overview
Built with Node.js and Express, this project illustrates client-server communication using real HTTP requests.
- **REST Endpoints**: CRUD operations for products catalog (`GET`, `POST`, `PUT`, `DELETE`).
- **Query & Route Parameters**: Filter by category and sort by price.
- **SSR Views**: EJS templates for the game client and `/schemas` documentation page.
- **In-Memory Store**: Data stored in memory (no external database).
- **Validation**: Server-side request validation checking method, path, and payload for each stage.

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
