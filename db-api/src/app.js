const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const { API_BASE_PATH } = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');
const { createMetricsMiddleware, renderMetrics } = require('./monitoring/metrics');

const SERVICE_NAME = 'fod-db-api';

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(createMetricsMiddleware(SERVICE_NAME));

  app.get('/', (req, res) => {
    res.json({
      service: 'fodr-db-api',
      apiBasePath: API_BASE_PATH,
      message: 'Universal football competition API scaffold is running.',
    });
  });
  app.get('/metrics', (req, res) => {
    res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    res.send(renderMetrics(SERVICE_NAME));
  });

  app.use(API_BASE_PATH, apiRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
