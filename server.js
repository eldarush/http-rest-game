const express = require('express');
const path = require('path');
const store = require('./data/store');
const productsRouter = require('./routes/products');
const schemasRouter = require('./routes/schemas');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter);
app.use('/schemas', schemasRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', productsCount: store.products.length });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
