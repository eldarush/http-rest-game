const stages = [
  {
    id: 1,
    title: "Catalog Overview",
    description: "The store needs to display all products in the catalog. Send a GET request to fetch the complete list.",
    hint: "Send GET to /api/products without extra parameters.",
    validate: (req) => {
      if (req.method !== 'GET') return { passed: false, message: 'Expected GET method' };
      if (req.path !== '/api/products') return { passed: false, message: 'Path must be /api/products' };
      if (Object.keys(req.query).length > 0) return { passed: false, message: 'Do not include query parameters for this stage' };
      return { passed: true, message: 'Success! You retrieved the full product catalog.' };
    }
  },
  {
    id: 2,
    title: "Single Item Lookup",
    description: "A customer selected product #2. Retrieve only the details for product with ID 2 using a Route Parameter.",
    hint: "Send GET /api/products/2",
    validate: (req) => {
      if (req.method !== 'GET') return { passed: false, message: 'Expected GET method' };
      if (req.path !== '/api/products/2') return { passed: false, message: 'Expected route parameter: /api/products/2' };
      return { passed: true, message: 'Great job! You retrieved product #2 via route parameter.' };
    }
  },
  {
    id: 3,
    title: "Category Filtering",
    description: "Filter the catalog to display only items from the 'books' category using a Query Parameter.",
    hint: "Send GET /api/products?category=books",
    validate: (req) => {
      if (req.method !== 'GET') return { passed: false, message: 'Expected GET method' };
      if (req.path !== '/api/products') return { passed: false, message: 'Base path must be /api/products' };
      if (req.query.category?.toLowerCase() !== 'books') return { passed: false, message: 'Query parameter ?category=books is required' };
      return { passed: true, message: 'Filtered correctly! Only books are displayed.' };
    }
  },
  {
    id: 4,
    title: "Filter & Sort Combined",
    description: "List all 'books' sorted by price in ascending order. Combine multiple Query Parameters in your request.",
    hint: "Send GET /api/products?category=books&sort=price",
    validate: (req) => {
      if (req.method !== 'GET') return { passed: false, message: 'Expected GET method' };
      if (req.path !== '/api/products') return { passed: false, message: 'Base path must be /api/products' };
      if (req.query.category?.toLowerCase() !== 'books' || req.query.sort?.toLowerCase() !== 'price') {
        return { passed: false, message: 'Must include both query params: category=books and sort=price' };
      }
      return { passed: true, message: 'Excellent! Combined multiple query parameters successfully.' };
    }
  },
  {
    id: 5,
    title: "Add New Product",
    description: "Add a new product to the catalog: 'Mechanical Keyboard' in category 'electronics' for $89. Send a JSON Request Body.",
    hint: "Send POST /api/products with body: {\"name\":\"Mechanical Keyboard\",\"category\":\"electronics\",\"price\":89,\"inStock\":true}",
    validate: (req) => {
      if (req.method !== 'POST') return { passed: false, message: 'Expected POST method' };
      if (req.path !== '/api/products') return { passed: false, message: 'Path must be /api/products' };
      if (!req.body || !req.body.name || !req.body.category || req.body.price === undefined) {
        return { passed: false, message: 'Request body must contain name, category, and price' };
      }
      if (req.body.category.toLowerCase() !== 'electronics' || Number(req.body.price) !== 89) {
        return { passed: false, message: 'Verify body values: category electronics, price 89' };
      }
      return { passed: true, message: 'Resource created with 201 Created!' };
    }
  },
  {
    id: 6,
    title: "Update Inventory Price",
    description: "Product #1 is going on sale. Update its price to 119.99 using an HTTP PUT request with a route parameter and a JSON body.",
    hint: "Send PUT /api/products/1 with body: {\"price\":119.99}",
    validate: (req) => {
      if (req.method !== 'PUT' && req.method !== 'PATCH') return { passed: false, message: 'Expected PUT or PATCH method' };
      if (req.path !== '/api/products/1') return { passed: false, message: 'Expected route parameter: /api/products/1' };
      if (!req.body || req.body.price === undefined || Number(req.body.price) !== 119.99) {
        return { passed: false, message: 'Request body must set price to 119.99' };
      }
      return { passed: true, message: 'Success! Product #1 price updated in server memory.' };
    }
  },
  {
    id: 7,
    title: "Remove Discontinued Item",
    description: "Product #3 has been discontinued. Send an HTTP DELETE request to remove it from the catalog.",
    hint: "Send DELETE /api/products/3",
    validate: (req) => {
      if (req.method !== 'DELETE') return { passed: false, message: 'Expected DELETE method' };
      if (req.path !== '/api/products/3') return { passed: false, message: 'Expected route parameter: /api/products/3' };
      return { passed: true, message: 'Deleted! Item removed from server memory.' };
    }
  },
  {
    id: 8,
    title: "Related Reviews",
    description: "Show all customer reviews written for product #1. Use the nested relationship route between products and reviews.",
    hint: "Send GET /api/products/1/reviews",
    validate: (req) => {
      if (req.method !== 'GET') return { passed: false, message: 'Expected GET method' };
      if (req.path !== '/api/products/1/reviews') return { passed: false, message: 'Expected nested route: /api/products/1/reviews' };
      return { passed: true, message: 'Nice! You followed the product-to-reviews relationship.' };
    }
  },
  {
    id: 9,
    title: "Handling Missing Resources",
    description: "A customer requested product #999, which does not exist. Send the request and inspect the error the server returns.",
    hint: "Send GET /api/products/999 and check for a 404 Not Found status code.",
    validate: (req) => {
      if (req.method !== 'GET') return { passed: false, message: 'Expected GET method' };
      if (req.path !== '/api/products/999') return { passed: false, message: 'Expected path /api/products/999' };
      return { passed: true, message: 'Correct! The server returned 404 Not Found for a missing resource.' };
    }
  },
  {
    id: 10,
    title: "Post a New Review",
    description: "Add a review for product #1 from author 'Alice' with a rating of 5. Combine a nested route parameter with a JSON request body.",
    hint: "Send POST /api/products/1/reviews with body: {\"author\":\"Alice\",\"rating\":5,\"comment\":\"Top notch!\"}",
    validate: (req) => {
      if (req.method !== 'POST') return { passed: false, message: 'Expected POST method' };
      if (req.path !== '/api/products/1/reviews') return { passed: false, message: 'Expected nested route: /api/products/1/reviews' };
      if (!req.body || !req.body.author || req.body.rating === undefined) {
        return { passed: false, message: 'Request body must contain author and rating' };
      }
      if (req.body.author.trim() !== 'Alice' || Number(req.body.rating) !== 5) {
        return { passed: false, message: 'Verify body values: author Alice, rating 5' };
      }
      return { passed: true, message: 'Congratulations! You completed all 10 REST challenges!' };
    }
  }
];

module.exports = stages;
