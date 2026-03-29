const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const args = new Set(process.argv.slice(2));
const runLiveChecks = args.has('--live');

const backendBaseUrl = process.env.FOD_BACKEND_URL || 'http://127.0.0.1:3002';
const dbApiBaseUrl = process.env.FOD_DB_API_URL || 'http://127.0.0.1:3010/api/v1';

let passCount = 0;
let failCount = 0;
let warnCount = 0;

const logPass = (message) => {
  passCount += 1;
  console.log(`[PASS] ${message}`);
};

const logFail = (message) => {
  failCount += 1;
  console.log(`[FAIL] ${message}`);
};

const logWarn = (message) => {
  warnCount += 1;
  console.log(`[WARN] ${message}`);
};

const pathExists = (relativePath) => fs.existsSync(path.join(ROOT, relativePath));

const readJson = (relativePath) => {
  const fullPath = path.join(ROOT, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
};

const readText = (relativePath) => {
  const fullPath = path.join(ROOT, relativePath);
  return fs.readFileSync(fullPath, 'utf8');
};

const listFiles = (relativePath, extension = null) => {
  const fullPath = path.join(ROOT, relativePath);
  if (!fs.existsSync(fullPath)) return [];
  return fs
    .readdirSync(fullPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => (extension ? name.toLowerCase().endsWith(extension) : true));
};

const listDirs = (relativePath) => {
  const fullPath = path.join(ROOT, relativePath);
  if (!fs.existsSync(fullPath)) return [];
  return fs
    .readdirSync(fullPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
};

const checkRequiredPath = (relativePath, label = relativePath) => {
  if (pathExists(relativePath)) {
    logPass(`${label} exists`);
  } else {
    logFail(`${label} is missing`);
  }
};

const checkJsonFile = (relativePath, label = relativePath) => {
  try {
    readJson(relativePath);
    logPass(`${label} is valid JSON`);
  } catch (error) {
    logFail(`${label} is not valid JSON (${error.message})`);
  }
};

const checkTextFile = (relativePath, label = relativePath) => {
  try {
    const text = readText(relativePath);
    if (text.trim().length > 0) {
      logPass(`${label} has content`);
    } else {
      logWarn(`${label} is empty`);
    }
  } catch (error) {
    logFail(`${label} could not be read (${error.message})`);
  }
};

const runFilesystemChecks = () => {
  console.log('FOD Healthcheck');
  console.log('='.repeat(32));
  console.log('');
  console.log('Filesystem checks');
  console.log('-'.repeat(32));

  [
    'README.md',
    'frontend/index.html',
    'mobile-version/index.html',
    'backend/server.js',
    'db-api/playersinfo-index.json',
    'db-api/history-data',
    'db-api/comps-teamplayers-info',
    'news',
    'images',
    'shared/card-prices.json'
  ].forEach((relativePath) => checkRequiredPath(relativePath));

  checkJsonFile('package.json', 'root package.json');
  checkJsonFile('db-api/playersinfo-index.json', 'players info index');
  checkTextFile('frontend/js/modules/news.js', 'desktop news module');
  checkTextFile('mobile-version/js/modules/renderMobileViews.js', 'mobile views module');

  const historyDirs = listDirs('db-api/history-data');
  if (historyDirs.length >= 10) {
    logPass(`history-data contains ${historyDirs.length} competition folders`);
  } else {
    logFail(`history-data looks incomplete (${historyDirs.length} folders found)`);
  }

  const playerCompDirs = listDirs('db-api/comps-teamplayers-info');
  if (playerCompDirs.length >= 3) {
    logPass(`comps-teamplayers-info contains ${playerCompDirs.length} competition folders`);
  } else {
    logFail(`comps-teamplayers-info looks incomplete (${playerCompDirs.length} folders found)`);
  }

  const premierCsvs = listFiles('db-api/comps-teamplayers-info/premier-league', '.csv');
  if (premierCsvs.length >= 15) {
    logPass(`Premier League player info has ${premierCsvs.length} CSV files`);
  } else {
    logFail(`Premier League player info looks incomplete (${premierCsvs.length} CSV files found)`);
  }

  const newsFolders = listDirs('news');
  if (newsFolders.length >= 5) {
    logPass(`news folder contains ${newsFolders.length} article folders`);
  } else {
    logWarn(`news folder has only ${newsFolders.length} article folders`);
  }

  try {
    const rootPackage = readJson('package.json');
    if (rootPackage.scripts?.healthcheck) {
      logPass('root package.json includes a healthcheck script');
    } else {
      logFail('root package.json is missing the healthcheck script');
    }
  } catch (error) {
    logFail(`could not inspect root package.json (${error.message})`);
  }
};

const fetchJsonSafe = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = null;
  }
  return { response, text, json: parsed };
};

const checkHttpText = async (url, marker, label) => {
  try {
    const response = await fetch(url, { redirect: 'follow' });
    const text = await response.text();
    if (!response.ok) {
      logFail(`${label} returned HTTP ${response.status}`);
      return;
    }
    const markerFoundInText = marker ? text.includes(marker) : true;
    const markerFoundInUrl = marker ? String(response.url || '').includes(marker) : true;
    if (marker && !markerFoundInText && !markerFoundInUrl) {
      logFail(`${label} responded but marker "${marker}" was not found`);
      return;
    }
    logPass(`${label} responded correctly`);
  } catch (error) {
    logFail(`${label} did not respond (${error.message})`);
  }
};

const runLiveRouteChecks = async () => {
  console.log('');
  console.log('Live route checks');
  console.log('-'.repeat(32));

  await checkHttpText(`${backendBaseUrl}/`, 'frontend/index.html', 'Backend root redirect');
  await checkHttpText(`${backendBaseUrl}/frontend/index.html`, 'id="nav-news"', 'Desktop app entry');
  await checkHttpText(`${backendBaseUrl}/mobile`, 'mobile-version/index.html', 'Mobile redirect');
  await checkHttpText(`${backendBaseUrl}/mobile-version/index.html`, 'mobile-view-home', 'Mobile app entry');
  await checkHttpText(`${backendBaseUrl}/news/salah/text/info`, 'Klopp believes Salah', 'News text route');

  try {
    const { response, json } = await fetchJsonSafe(`${backendBaseUrl}/api/health`);
    if (!response.ok) {
      logFail(`Backend API health returned HTTP ${response.status}`);
    } else if (json?.ok === true) {
      logPass('Backend API health responded with ok=true');
    } else {
      logFail('Backend API health responded, but JSON payload was unexpected');
    }
  } catch (error) {
    logFail(`Backend API health did not respond (${error.message})`);
  }

  try {
    const { response, json } = await fetchJsonSafe(`${dbApiBaseUrl}/health`);
    if (!response.ok) {
      logFail(`DB API health returned HTTP ${response.status}`);
    } else if (json?.status === 'ok') {
      logPass('DB API health responded with status=ok');
    } else {
      logFail('DB API health responded, but JSON payload was unexpected');
    }
  } catch (error) {
    logFail(`DB API health did not respond (${error.message})`);
  }

  try {
    const { response, json } = await fetchJsonSafe(`${backendBaseUrl}/db-api/playersinfo-index.json`);
    if (!response.ok) {
      logFail(`players info index route returned HTTP ${response.status}`);
    } else if (json && typeof json === 'object') {
      logPass('players info index route returned valid JSON');
    } else {
      logFail('players info index route responded, but JSON payload was invalid');
    }
  } catch (error) {
    logFail(`players info index route did not respond (${error.message})`);
  }
};

const printSummary = () => {
  console.log('');
  console.log('Summary');
  console.log('-'.repeat(32));
  console.log(`Pass: ${passCount}`);
  console.log(`Warn: ${warnCount}`);
  console.log(`Fail: ${failCount}`);

  if (failCount === 0) {
    console.log('');
    console.log('Healthcheck passed.');
  } else {
    console.log('');
    console.log('Healthcheck found issues.');
  }
};

const main = async () => {
  runFilesystemChecks();
  if (runLiveChecks) {
    await runLiveRouteChecks();
  } else {
    console.log('');
    console.log('Live route checks skipped. Run `npm run healthcheck:live` when the app is running.');
  }
  printSummary();
  process.exitCode = failCount > 0 ? 1 : 0;
};

main().catch((error) => {
  logFail(`healthcheck crashed (${error.message})`);
  printSummary();
  process.exitCode = 1;
});
