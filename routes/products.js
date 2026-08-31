const express = require('express');
const router = express.Router();
const store = require('../data/store');

// get all products (optional ?category=... and ?sort=price)
router.get('/', (req, res) => {
  let result = [...store.products];

  if (req.query.category) {
    result = result.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
  }

  if (req.query.sort === 'price') {
    result.sort((a, b) => a.price - b.price);
  }

  res.status(200).json(result);
});

// get single product by id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = store.products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: `Product with ID ${id} not found` });
  }

  res.status(200).json(product);
});

// add new product
router.post('/', (req, res) => {
  const { name, category, price, inStock } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields: name, category, price' });
  }

  const newProduct = {
    id: store.getNextProductId(),
    name: String(name).trim(),
    category: String(category).toLowerCase().trim(),
    price: Number(price),
    inStock: inStock !== undefined ? Boolean(inStock) : true
  };

  store.products.push(newProduct);
  res.status(201).json(newProduct);
});

// update product
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = store.products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: `Product with ID ${id} not found` });
  }

  if (req.body.name !== undefined) product.name = String(req.body.name).trim();
  if (req.body.category !== undefined) product.category = String(req.body.category).toLowerCase().trim();
  if (req.body.price !== undefined) product.price = Number(req.body.price);
  if (req.body.inStock !== undefined) product.inStock = Boolean(req.body.inStock);

  res.status(200).json(product);
});

// delete product
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = store.products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Product with ID ${id} not found` });
  }

  const deleted = store.products.splice(index, 1)[0];
  res.status(200).json({ message: 'Product deleted successfully', product: deleted });
});

module.exports = router;
