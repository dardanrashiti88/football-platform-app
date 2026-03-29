const competitionService = require('../services/competitionService');

async function listCompetitions(req, res, next) {
  try {
    const competitions = await competitionService.listCompetitions();
    res.json({ data: competitions });
  } catch (error) {
    next(error);
  }
}

async function getCompetition(req, res, next) {
  try {
    const competition = await competitionService.getCompetition(req.params.competitionId);
    res.json({ data: competition });
  } catch (error) {
    next(error);
  }
}

async function getCompetitionTeams(req, res, next) {
  try {
    const teams = await competitionService.getCompetitionTeams(req.params.competitionId);
    res.json({ data: teams });
  } catch (error) {
    next(error);
  }
}

async function getCompetitionMatches(req, res, next) {
  try {
    const matches = await competitionService.getCompetitionMatches(req.params.competitionId, {
      stage: req.query.stage,
      teamId: req.query.teamId,
      matchday: req.query.matchday,
    });
    res.json({ data: matches });
  } catch (error) {
    next(error);
  }
}

async function getCompetitionStandings(req, res, next) {
  try {
    const standings = await competitionService.getCompetitionStandings(req.params.competitionId, {
      stage: req.query.stage,
      group: req.query.group,
    });
    res.json({ data: standings });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCompetitions,
  getCompetition,
  getCompetitionTeams,
  getCompetitionMatches,
  getCompetitionStandings,
};
