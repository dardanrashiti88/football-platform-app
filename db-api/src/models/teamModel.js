function normalizeTeam(raw) {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    shortName: raw.shortName || raw.short_name || raw.name,
    country: raw.country || null,
    logo: raw.logo || raw.logo_url || null,
  };
}

module.exports = { normalizeTeam };
