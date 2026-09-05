const express = require('express');
const path = require('path');
const store = require('./data/store');
const productsRouter = require('./routes/products');
const reviewsRouter = require('./routes/reviews');
const schemasRouter = require('./routes/schemas');
const stages = require('./game/stages');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// check stage rules if header is sent
app.use((req, res, next) => {
  const stageIdHeader = req.headers['x-stage-id'];
  if (stageIdHeader) {
    const stageId = parseInt(stageIdHeader, 10);
    const stage = stages.find(s => s.id === stageId);
    if (stage) {
      const result = stage.validate(req);
      res.setHeader('Access-Control-Expose-Headers', 'X-Stage-Passed, X-Stage-Feedback');
      res.setHeader('X-Stage-Passed', result.passed ? 'true' : 'false');
      res.setHeader('X-Stage-Feedback', result.message || '');
    }
  }
  next();
});

app.use('/api/products/:productId/reviews', reviewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/schemas', schemasRouter);

// stage descriptions for frontend
app.get('/api/game/stages', (req, res) => {
  const publicStages = stages.map(s => ({
    id: s.id,
    title: s.title,
    description: s.description,
    hint: s.hint
  }));
  res.status(200).json(publicStages);
});

// main page
app.get('/', (req, res) => {
  res.render('index', { activeNav: 'game' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', productsCount: store.products.length });
});

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.status(404).send('Page Not Found');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
