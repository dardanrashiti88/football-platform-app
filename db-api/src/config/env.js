const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');

module.exports = {
  ROOT_DIR,
  PORT: Number(process.env.PORT || 3010),
  API_BASE_PATH: process.env.API_BASE_PATH || '/api/v1',
  CACHE_TTL_MS: Number(process.env.CACHE_TTL_MS || 30000),
  COMPETITIONS_DIR: path.join(ROOT_DIR, 'data', 'competitions'),
};
