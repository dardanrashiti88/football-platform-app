const { createApp } = require('./app');
const { PORT, API_BASE_PATH } = require('./config/env');

const app = createApp();

app.listen(PORT, () => {
  console.log(`FODR DB API running on port ${PORT}`);
  console.log(`Base path: ${API_BASE_PATH}`);
});
