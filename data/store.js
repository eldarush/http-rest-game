/**
 * In-memory data store.
 * Initialized at server startup; modifications persist during server runtime.
 */
const products = [
  { id: 1, name: "Wireless Noise-Cancelling Headphones", category: "audio", price: 199.99, inStock: true },
  { id: 2, name: "Mechanical Gaming Keyboard", category: "electronics", price: 89.99, inStock: true },
  { id: 3, name: "Ergonomic Desk Chair", category: "furniture", price: 249.50, inStock: false },
  { id: 4, name: "Clean Code: A Handbook of Agile Craftsmanship", category: "books", price: 42.00, inStock: true },
  { id: 5, name: "Designing Data-Intensive Applications", category: "books", price: 54.00, inStock: true }
];

const reviews = [
  { id: 1, productId: 1, author: "Dan", rating: 5, comment: "Superb sound quality and long battery life." },
  { id: 2, productId: 1, author: "Sarah", rating: 4, comment: "Great active noise cancellation." },
  { id: 3, productId: 2, author: "Mike", rating: 5, comment: "Crisp tactile switches, very responsive." },
  { id: 4, productId: 4, author: "Rachel", rating: 5, comment: "Essential reading for clean architecture." }
];

module.exports = {
  products,
  reviews,
  getNextProductId: () => (products.length ? Math.max(...products.map(p => p.id)) + 1 : 1),
  getNextReviewId: () => (reviews.length ? Math.max(...reviews.map(r => r.id)) + 1 : 1)
};
