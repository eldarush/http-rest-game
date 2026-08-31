const express = require('express');
const path = require('path');
const store = require('./data/store');
const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup (EJS SSR)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/products', productsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', productsCount: store.products.length });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
