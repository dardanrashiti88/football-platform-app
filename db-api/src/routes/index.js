const express = require('express');
const competitionRoutes = require('./competitionRoutes');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/competitions', competitionRoutes);

module.exports = router;
