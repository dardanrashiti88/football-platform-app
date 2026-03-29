function normalizeCompetition(raw) {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    type: raw.type,
    country: raw.country || null,
    season: raw.season,
    format: raw.format || {
      standings: raw.type === 'league',
      groups: false,
      knockout: raw.type === 'cup',
    },
  };
}

module.exports = { normalizeCompetition };
