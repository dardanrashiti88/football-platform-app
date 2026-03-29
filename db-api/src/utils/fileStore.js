const fs = require('fs/promises');
const path = require('path');

async function readJson(filePath, fallback = null) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT' && fallback !== null) {
      return fallback;
    }
    throw error;
  }
}

async function listDirectories(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

function buildCompetitionFilePath(rootDir, slug, fileName) {
  return path.join(rootDir, slug, fileName);
}

module.exports = {
  readJson,
  listDirectories,
  buildCompetitionFilePath,
};
