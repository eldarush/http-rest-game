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
  }
];

module.exports = stages;
