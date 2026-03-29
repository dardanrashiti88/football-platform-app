const path = require('path');
const { ROOT_DIR, COMPETITIONS_DIR } = require('./env');

module.exports = {
  ROOT_DIR,
  COMPETITIONS_DIR,
  MIGRATIONS_DIR: path.join(ROOT_DIR, 'database', 'migrations'),
};
