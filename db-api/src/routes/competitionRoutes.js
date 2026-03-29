const express = require('express');
const controller = require('../controllers/competitionController');

const router = express.Router();

router.get('/', controller.listCompetitions);
router.get('/:competitionId/teams', controller.getCompetitionTeams);
router.get('/:competitionId/matches', controller.getCompetitionMatches);
router.get('/:competitionId/standings', controller.getCompetitionStandings);
router.get('/:competitionId', controller.getCompetition);

module.exports = router;
