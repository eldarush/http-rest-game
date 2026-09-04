const express = require('express');
const router = express.Router({ mergeParams: true });
const store = require('../data/store');

// get reviews - all, or scoped to a product via ?productId= or nested route
router.get('/', (req, res) => {
  const routeProductId = req.params.productId ? parseInt(req.params.productId, 10) : null;
  const queryProductId = req.query.productId ? parseInt(req.query.productId, 10) : null;
  const productId = routeProductId || queryProductId;

  if (productId && !store.products.some(p => p.id === productId)) {
    return res.status(404).json({ error: `Product with ID ${productId} not found` });
  }

  const result = productId ? store.reviews.filter(r => r.productId === productId) : store.reviews;
  res.status(200).json(result);
});

// add a review for a product (nested route)
router.post('/', (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const product = store.products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: `Cannot review non-existent product ID ${productId}` });
  }

  const { author, rating, comment } = req.body;
  if (!author || rating === undefined) {
    return res.status(400).json({ error: 'Missing required fields: author, rating' });
  }

  const newReview = {
    id: store.getNextReviewId(),
    productId,
    author: String(author).trim(),
    rating: Number(rating),
    comment: comment ? String(comment).trim() : ''
  };

  store.reviews.push(newReview);
  res.status(201).json(newReview);
});

// delete a review by id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = store.reviews.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Review with ID ${id} not found` });
  }

  const deleted = store.reviews.splice(index, 1)[0];
  res.status(200).json({ message: 'Review deleted successfully', review: deleted });
});

module.exports = router;
