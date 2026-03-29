function getHealth(req, res) {
  res.json({
    status: 'ok',
    service: 'fodr-db-api',
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };
