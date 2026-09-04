const express = require('express');
const path = require('path');
const store = require('./data/store');
const productsRouter = require('./routes/products');
const schemasRouter = require('./routes/schemas');
const stages = require('./game/stages');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup (EJS SSR)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Stage Validation Middleware (evaluates X-Stage-Id header)
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

// Mount routes
app.use('/api/products', productsRouter);
app.use('/schemas', schemasRouter);

// Public API for client to fetch stage scenarios (without revealing solutions)
app.get('/api/game/stages', (req, res) => {
  const publicStages = stages.map(s => ({
    id: s.id,
    title: s.title,
    description: s.description,
    hint: s.hint
  }));
  res.status(200).json(publicStages);
});

// SSR Main Game Page
app.get('/', (req, res) => {
  res.render('index', { activeNav: 'game' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', productsCount: store.products.length });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.status(404).send('Page Not Found');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
