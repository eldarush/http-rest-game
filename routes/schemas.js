const express = require('express');
const router = express.Router();

const schemas = [
  {
    name: 'Product',
    endpoint: '/api/products',
    description: 'Catalog items available in the store.',
    fields: [
      { name: 'id', type: 'Number', required: true, description: 'Unique identifier' },
      { name: 'name', type: 'String', required: true, description: 'Product title' },
      { name: 'category', type: 'String', required: true, description: 'Category name (e.g. electronics, books)' },
      { name: 'price', type: 'Number', required: true, description: 'Product price in USD' },
      { name: 'inStock', type: 'Boolean', required: false, description: 'Inventory availability flag' }
    ]
  },
  {
    name: 'Review',
    endpoint: '/api/reviews',
    description: 'User ratings and feedback linked to products.',
    fields: [
      { name: 'id', type: 'Number', required: true, description: 'Unique review identifier' },
      { name: 'productId', type: 'Number', required: true, description: 'Referenced Product ID (foreign key)' },
      { name: 'author', type: 'String', required: true, description: 'Reviewer name' },
      { name: 'rating', type: 'Number', required: true, description: 'Rating between 1 and 5' },
      { name: 'comment', type: 'String', required: false, description: 'Feedback text' }
    ]
  }
];

// GET /schemas - Render SSR schema documentation
router.get('/', (req, res) => {
  res.render('schemas', { schemas, activeNav: 'schemas' });
});

module.exports = router;
