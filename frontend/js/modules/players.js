const PREMIER_TEAMS_URL = new URL(
  '../../../db-api/data/competitions/premier-league/teams.json',
  import.meta.url
);
const PREMIER_PLAYERS_URL = new URL(
  '../../../db-api/data/competitions/premier-league/players.json',
  import.meta.url
);

const SERIEA_TEAMS_URL = new URL(
  '../../../db-api/data/competitions/serie-a/teams.json',
  import.meta.url
);
const SERIEA_PLAYERS_URL = new URL(
  '../../../db-api/data/competitions/serie-a/players.json',
  import.meta.url
);

const LALIGA_TEAMS_URL = new URL(
  '../../../db-api/data/competitions/la-liga/teams.json',
  import.meta.url
);
const LALIGA_PLAYERS_URL = new URL(
  '../../../db-api/data/competitions/la-liga/players.json',
  import.meta.url
);

const BUNDESLIGA_TEAMS_URL = new URL(
  '../../../db-api/data/competitions/bundesliga/teams.json',
  import.meta.url
);
const BUNDESLIGA_PLAYERS_URL = new URL(
  '../../../db-api/data/competitions/bundesliga/players.json',
  import.meta.url
);

const LIGUE1_TEAMS_URL = new URL(
  '../../../db-api/data/competitions/ligue-1/teams.json',
  import.meta.url
);
const LIGUE1_PLAYERS_URL = new URL(
  '../../../db-api/data/competitions/ligue-1/players.json',
  import.meta.url
);

const VS_DESIGN_URL = new URL('../../../images/assets/vsdesing.png', import.meta.url);
const TROPHY_IMAGES = {
  faCup: new URL('../../../images/trophies-photos/faCUP-removebg-preview.png', import.meta.url),
  communityShield: new URL('../../../images/trophies-photos/community_shield-removebg-preview.png', import.meta.url),
  uefaSupercup: new URL('../../../images/trophies-photos/uefasupercup-removebg-preview.png', import.meta.url),
  premierLeague: new URL('../../../images/trophies-photos/prem-removebg-preview.png', import.meta.url),
  premierLeagueOld: new URL('../../../images/trophies-photos/prem-old-removebg-preview.png', import.meta.url),
  carabaoCup: new URL('../../../images/trophies-photos/carabao-removebg-preview.png', import.meta.url),
  championsLeague: new URL('../../../images/trophies-photos/championsleague-removebg-preview.png', import.meta.url),
  clubWorldCup: new URL('../../../images/trophies-photos/clubwc-removebg-preview.png', import.meta.url),
  conferenceLeague: new URL('../../../images/trophies-photos/conference-removebg-preview.png', import.meta.url)
};

const UCL_TEAMS_URL = new URL(
  '../../../db-api/data/competitions/champions-league/teams.json',
  import.meta.url
);
const UCL_PLAYERS_URL = new URL(
  '../../../db-api/data/competitions/champions-league/players.json',
  import.meta.url
);

const PREMIER_STANDINGS_URL = new URL(
  '../../../db-api/data/competitions/premier-league/standings.json',
  import.meta.url
);
const SERIEA_STANDINGS_URL = new URL(
  '../../../db-api/data/competitions/serie-a/standings.json',
  import.meta.url
);
const LALIGA_STANDINGS_URL = new URL(
  '../../../db-api/data/competitions/la-liga/standings.json',
  import.meta.url
);
const BUNDESLIGA_STANDINGS_URL = new URL(
  '../../../db-api/data/competitions/bundesliga/standings.json',
  import.meta.url
);
const LIGUE1_STANDINGS_URL = new URL(
  '../../../db-api/data/competitions/ligue-1/standings.json',
  import.meta.url
);
const UCL_STANDINGS_URL = new URL(
  '../../../db-api/data/competitions/champions-league/standings.json',
  import.meta.url
);

const PLAYERSINFO_INDEX_URL = new URL(
  '../../../db-api/playersinfo-index.json',
  import.meta.url
);

const PREMIER_MATCHES_URL = new URL(
  '../../../db-api/data/competitions/premier-league/matches.json',
  import.meta.url
);
const SERIEA_MATCHES_URL = new URL(
  '../../../db-api/data/competitions/serie-a/matches.json',
  import.meta.url
);
const LALIGA_MATCHES_URL = new URL(
  '../../../db-api/data/competitions/la-liga/matches.json',
  import.meta.url
);
const BUNDESLIGA_MATCHES_URL = new URL(
  '../../../db-api/data/competitions/bundesliga/matches.json',
  import.meta.url
);
const LIGUE1_MATCHES_URL = new URL(
  '../../../db-api/data/competitions/ligue-1/matches.json',
  import.meta.url
);
const UCL_MATCHES_URL = new URL(
  '../../../db-api/data/competitions/champions-league/matches.json',
  import.meta.url
);
const FACUP_MATCHES_URL = new URL(
  '../../../db-api/history-data/facup-league-table-history/season-2526.csv',
  import.meta.url
);
const CARABAO_MATCHES_URL = new URL(
  '../../../db-api/history-data/carabao-table-history/season-2526.csv',
  import.meta.url
);
const CHAMPIONSHIP_MATCHES_URL = new URL(
  '../../../db-api/history-data/ELFchampionship-league-table-history/season-2526.csv',
  import.meta.url
);
const EUROPA_MATCHES_URL = new URL(
  '../../../db-api/history-data/europa-league-table-history/season-2425.csv',
  import.meta.url
);
const CONFERENCE_MATCHES_URL = new URL(
  '../../../db-api/history-data/conference-league-table-history/season-2425.csv',
  import.meta.url
);
const WORLDCUP_MATCHES_URL = new URL(
  '../../../db-api/history-data/worldcup-table-history/season-2026.csv',
  import.meta.url
);

const PREMIER_TEAM_LOGOS = {
  'afc-bournemouth': new URL('../../../images/Teams-logos/Premier-league/bournemouth.svg', import.meta.url)
    .href,
  arsenal: new URL('../../../images/Teams-logos/Premier-league/arsenal.svg', import.meta.url).href,
  'aston-villa': new URL('../../../images/Teams-logos/Premier-league/astonvilla.svg', import.meta.url).href,
  brentford: new URL('../../../images/Teams-logos/Premier-league/brentford.svg', import.meta.url).href,
  'brighton-and-hove-albion': new URL('../../../images/Teams-logos/Premier-league/brighton.svg', import.meta.url)
    .href,
  burnley: new URL('../../../images/Teams-logos/Premier-league/burnley.svg', import.meta.url).href,
  chelsea: new URL('../../../images/Teams-logos/Premier-league/chelsea.svg', import.meta.url).href,
  'crystal-palace': new URL('../../../images/Teams-logos/Premier-league/crystalpalace.svg', import.meta.url)
    .href,
  everton: new URL('../../../images/Teams-logos/Premier-league/everton.svg', import.meta.url).href,
  fulham: new URL('../../../images/Teams-logos/Premier-league/fulham.svg', import.meta.url).href,
  'leeds-united': new URL('../../../images/Teams-logos/Premier-league/leeds.svg', import.meta.url).href,
  liverpool: new URL('../../../images/Teams-logos/Premier-league/liverpool.svg', import.meta.url).href,
  'manchester-city': new URL('../../../images/Teams-logos/Premier-league/mancity.svg', import.meta.url).href,
  'manchester-united': new URL('../../../images/Teams-logos/Premier-league/Manu.svg', import.meta.url).href,
  'newcastle-united': new URL('../../../images/Teams-logos/Premier-league/newcastle.svg', import.meta.url).href,
  'nottingham-forest': new URL('../../../images/Teams-logos/Premier-league/forest.svg', import.meta.url)
    .href,
  sunderland: new URL('../../../images/Teams-logos/Premier-league/sunderland.svg', import.meta.url).href,
  'tottenham-hotspur': new URL('../../../images/Teams-logos/Premier-league/tottenham.svg', import.meta.url)
    .href,
  'west-ham-united': new URL('../../../images/Teams-logos/Premier-league/westham.svg', import.meta.url).href,
  'wolverhampton-wanderers': new URL('../../../images/Teams-logos/Premier-league/wolves.svg', import.meta.url)
    .href
};

const CHAMPIONSHIP_TEAM_LOGOS = {
  'birmingham-city': new URL('../../../images/Teams-logos/EFLchampionship/birmingham.png', import.meta.url).href,
  'blackburn-rovers': new URL(
    '../../../images/Teams-logos/EFLchampionship/blackburn rovers.png',
    import.meta.url
  ).href,
  'bristol-city': new URL('../../../images/Teams-logos/EFLchampionship/bristolcity.png', import.meta.url).href,
  'charlton-athletic': new URL('../../../images/Teams-logos/EFLchampionship/charlton.png', import.meta.url)
    .href,
  'coventry-city': new URL(
    '../../../images/Teams-logos/EFLchampionship/coventry city.png',
    import.meta.url
  ).href,
  'derby-county': new URL('../../../images/Teams-logos/EFLchampionship/derbycounty.png', import.meta.url).href,
  'hull-city': new URL('../../../images/Teams-logos/EFLchampionship/hullcity.png', import.meta.url).href,
  'ipswich-town': new URL('../../../images/Teams-logos/EFLchampionship/ipswichtown.png', import.meta.url)
    .href,
  'leicester-city': new URL(
    '../../../images/Teams-logos/EFLchampionship/leicestercity.png',
    import.meta.url
  ).href,
  middlesbrough: new URL('../../../images/Teams-logos/EFLchampionship/middlesbrough.png', import.meta.url)
    .href,
  millwall: new URL('../../../images/Teams-logos/EFLchampionship/millwall.png', import.meta.url).href,
  'norwich-city': new URL('../../../images/Teams-logos/EFLchampionship/norwich.png', import.meta.url).href,
  'oxford-united': new URL('../../../images/Teams-logos/EFLchampionship/oxfordunited.png', import.meta.url)
    .href,
  portsmouth: new URL('../../../images/Teams-logos/EFLchampionship/portsmouth.png', import.meta.url).href,
  'preston-north-end': new URL(
    '../../../images/Teams-logos/EFLchampionship/prestonnorthend.png',
    import.meta.url
  ).href,
  'queens-park-rangers': new URL(
    '../../../images/Teams-logos/EFLchampionship/queenparkrangers.png',
    import.meta.url
  ).href,
  'sheffield-united': new URL(
    '../../../images/Teams-logos/EFLchampionship/sheffieldunited.png',
    import.meta.url
  ).href,
  'sheffield-wednesday': new URL(
    '../../../images/Teams-logos/EFLchampionship/sheffieldwednesday.png',
    import.meta.url
  ).href,
  southampton: new URL('../../../images/Teams-logos/EFLchampionship/southampton.png', import.meta.url).href,
  'stoke-city': new URL('../../../images/Teams-logos/EFLchampionship/stroke.png', import.meta.url).href,
  'swansea-city': new URL('../../../images/Teams-logos/EFLchampionship/swanseacity.png', import.meta.url)
    .href,
  watford: new URL('../../../images/Teams-logos/EFLchampionship/watford.png', import.meta.url).href,
  'west-bromwich-albion': new URL(
    '../../../images/Teams-logos/EFLchampionship/westbromwich albion.png',
    import.meta.url
  ).href,
  wrexham: new URL('../../../images/Teams-logos/EFLchampionship/wrexham.png', import.meta.url).href
};

const ENGLISH_TEAM_LOGOS = {
  ...PREMIER_TEAM_LOGOS,
  ...CHAMPIONSHIP_TEAM_LOGOS
};

const EUROPA_TEAM_LOGOS = {
  AstonVilla: new URL('../../../images/Teams-logos/Europa-league/AstonVilla.png', import.meta.url).href,
  Braga: new URL('../../../images/Teams-logos/Europa-league/Braga.png', import.meta.url).href,
  Freiburg: new URL('../../../images/Teams-logos/Europa-league/Freiburg.png', import.meta.url).href,
  Lyon: new URL('../../../images/Teams-logos/Europa-league/Lyon.png', import.meta.url).href,
  Midtjylland: new URL('../../../images/Teams-logos/Europa-league/Midtjylland.png', import.meta.url).href,
  Porto: new URL('../../../images/Teams-logos/Europa-league/Porto.png', import.meta.url).href,
  'Real Betis': new URL('../../../images/Teams-logos/Europa-league/Real Betis.png', import.meta.url).href,
  Roma: new URL('../../../images/Teams-logos/Europa-league/Roma.png', import.meta.url).href,
  basel: new URL('../../../images/Teams-logos/Europa-league/basel.png', import.meta.url).href,
  bologna: new URL('../../../images/Teams-logos/Europa-league/bologna.png', import.meta.url).href,
  brann: new URL('../../../images/Teams-logos/Europa-league/brann.png', import.meta.url).href,
  celta: new URL('../../../images/Teams-logos/Europa-league/celta.png', import.meta.url).href,
  celtic: new URL('../../../images/Teams-logos/Europa-league/celtic.png', import.meta.url).href,
  'cvena zvesta': new URL('../../../images/Teams-logos/Europa-league/cvena zvesta.png', import.meta.url)
    .href,
  fcsb: new URL('../../../images/Teams-logos/Europa-league/fcsb.png', import.meta.url).href,
  fenderbache: new URL('../../../images/Teams-logos/Europa-league/fenderbache.png', import.meta.url).href,
  ferencvaros: new URL('../../../images/Teams-logos/Europa-league/ferencvaros.png', import.meta.url)
    .href,
  feyenoord: new URL('../../../images/Teams-logos/Europa-league/feyenoord.png', import.meta.url).href,
  forest: new URL('../../../images/Teams-logos/Europa-league/forest.png', import.meta.url).href,
  genk: new URL('../../../images/Teams-logos/Europa-league/genk.png', import.meta.url).href,
  gnkdinamo: new URL('../../../images/Teams-logos/Europa-league/gnkdinamo.png', import.meta.url).href,
  'go ahead eagles': new URL(
    '../../../images/Teams-logos/Europa-league/go ahead eagles.png',
    import.meta.url
  ).href,
  lille: new URL('../../../images/Teams-logos/Europa-league/lille.png', import.meta.url).href,
  ludogorets: new URL('../../../images/Teams-logos/Europa-league/ludogorets.png', import.meta.url)
    .href,
  'm.tel-aviv': new URL('../../../images/Teams-logos/Europa-league/m.tel-aviv.png', import.meta.url)
    .href,
  malmo: new URL('../../../images/Teams-logos/Europa-league/malmo.png', import.meta.url).href,
  nice: new URL('../../../images/Teams-logos/Europa-league/nice.png', import.meta.url).href,
  panathinaikos: new URL('../../../images/Teams-logos/Europa-league/panathinaikos.png', import.meta.url)
    .href,
  paok: new URL('../../../images/Teams-logos/Europa-league/paok.png', import.meta.url).href,
  rangers: new URL('../../../images/Teams-logos/Europa-league/rangers.png', import.meta.url).href,
  salzburg: new URL('../../../images/Teams-logos/Europa-league/salzburg.png', import.meta.url).href,
  'strum graz': new URL('../../../images/Teams-logos/Europa-league/strum graz.png', import.meta.url)
    .href,
  stuttgard: new URL('../../../images/Teams-logos/Europa-league/stuttgard.png', import.meta.url).href,
  utrecht: new URL('../../../images/Teams-logos/Europa-league/utrecht.png', import.meta.url).href,
  'viktoria plzen': new URL(
    '../../../images/Teams-logos/Europa-league/viktoria plzen.png',
    import.meta.url
  ).href,
  yungboys: new URL('../../../images/Teams-logos/Europa-league/yungboys.png', import.meta.url).href
};

const CONFERENCE_TEAM_LOGOS = {
  'AEK Athens': new URL('../../../images/Teams-logos/conference-league/AEK Athens.png', import.meta.url)
    .href,
  'AEK Larnaca': new URL('../../../images/Teams-logos/conference-league/AEK Larnaca.png', import.meta.url)
    .href,
  'AZ Alkmaar': new URL('../../../images/Teams-logos/conference-league/AZ Alkmaar.png', import.meta.url).href,
  Celje: new URL('../../../images/Teams-logos/conference-league/Celje.png', import.meta.url).href,
  'Crystal Palace': new URL('../../../images/Teams-logos/conference-league/Crystal Palace.png', import.meta.url)
    .href,
  Drita: new URL('../../../images/Teams-logos/conference-league/Drita.png', import.meta.url).href,
  Hacken: new URL('../../../images/Teams-logos/conference-league/Hacken.png', import.meta.url).href,
  'Hamrun Spartans': new URL(
    '../../../images/Teams-logos/conference-league/Hamrun Spartans.png',
    import.meta.url
  ).href,
  'KuPS Kuopio': new URL('../../../images/Teams-logos/conference-league/KuPS Kuopio.png', import.meta.url)
    .href,
  'L. Red Imps': new URL('../../../images/Teams-logos/conference-league/L. Red Imps.png', import.meta.url)
    .href,
  'Lausanne-Sport': new URL(
    '../../../images/Teams-logos/conference-league/Lausanne-Sport.png',
    import.meta.url
  ).href,
  'Lech Poznan': new URL('../../../images/Teams-logos/conference-league/Lech Poznan.png', import.meta.url)
    .href,
  'Legia Warszawa': new URL(
    '../../../images/Teams-logos/conference-league/Legia Warszawa.png',
    import.meta.url
  ).href,
  Mainz: new URL('../../../images/Teams-logos/conference-league/Mainz.png', import.meta.url).href,
  Noah: new URL('../../../images/Teams-logos/conference-league/Noah.png', import.meta.url).href,
  Omonoia: new URL('../../../images/Teams-logos/conference-league/Omonoia.png', import.meta.url).href,
  Rakow: new URL('../../../images/Teams-logos/conference-league/Rakow.png', import.meta.url).href,
  'Raya Vallecano': new URL(
    '../../../images/Teams-logos/conference-league/Raya Vallecano.png',
    import.meta.url
  ).href,
  'S. Bratislava': new URL(
    '../../../images/Teams-logos/conference-league/S. Bratislava.png',
    import.meta.url
  ).href,
  'SK Rapid': new URL('../../../images/Teams-logos/conference-league/SK Rapid.png', import.meta.url)
    .href,
  Samsunspor: new URL('../../../images/Teams-logos/conference-league/Samsunspor.png', import.meta.url)
    .href,
  'Shamrock Rovers': new URL(
    '../../../images/Teams-logos/conference-league/Shamrock Rovers.png',
    import.meta.url
  ).href,
  Shelbourne: new URL('../../../images/Teams-logos/conference-league/Shelbourne.png', import.meta.url)
    .href,
  'Sigma Olomouc': new URL(
    '../../../images/Teams-logos/conference-league/Sigma Olomouc.png',
    import.meta.url
  ).href,
  'Sparta Praha': new URL('../../../images/Teams-logos/conference-league/Sparta Praha.png', import.meta.url)
    .href,
  Strasbourg: new URL('../../../images/Teams-logos/conference-league/Strasbourg.png', import.meta.url)
    .href,
  'U. Craiova': new URL('../../../images/Teams-logos/conference-league/U. Craiova.png', import.meta.url)
    .href,
  Zrinjski: new URL('../../../images/Teams-logos/conference-league/Zrinjski.png', import.meta.url).href,
  berdeen: new URL('../../../images/Teams-logos/conference-league/berdeen.png', import.meta.url).href,
  breioablik: new URL('../../../images/Teams-logos/conference-league/breioablik.png', import.meta.url)
    .href,
  'dynamo Kyiv': new URL(
    '../../../images/Teams-logos/conference-league/dynamo Kyiv.png',
    import.meta.url
  ).href,
  fiorentina: new URL('../../../images/Teams-logos/conference-league/fiorentina.png', import.meta.url)
    .href,
  jagiellonia: new URL('../../../images/Teams-logos/conference-league/jagiellonia.png', import.meta.url)
    .href,
  rijeka: new URL('../../../images/Teams-logos/conference-league/rijeka.png', import.meta.url).href,
  shakhtar: new URL('../../../images/Teams-logos/conference-league/shakhtar.png', import.meta.url).href,
  shendija: new URL('../../../images/Teams-logos/conference-league/shendija.png', import.meta.url).href
};

const BUNDESLIGA_TEAM_LOGOS = {
  augsburg: new URL('../../../images/Teams-logos/bundesliga/augsburg.svg', import.meta.url).href,
  'b-monchengladbach': new URL('../../../images/Teams-logos/bundesliga/monchengladbach.svg', import.meta.url)
    .href,
  'bayer-leverkusen': new URL('../../../images/Teams-logos/bundesliga/leverkusen.svg', import.meta.url)
    .href,
  'bayern-munich': new URL('../../../images/Teams-logos/bundesliga/bayern.svg', import.meta.url).href,
  dortmund: new URL('../../../images/Teams-logos/bundesliga/borussia.svg', import.meta.url).href,
  'eintracht-frankfurt': new URL('../../../images/Teams-logos/bundesliga/frankfurt.svg', import.meta.url)
    .href,
  'fc-koln': new URL('../../../images/Teams-logos/bundesliga/cologne.svg', import.meta.url).href,
  freiburg: new URL('../../../images/Teams-logos/bundesliga/freiburg.svg', import.meta.url).href,
  'hamburger-sv': new URL('../../../images/Teams-logos/bundesliga/hamburg.svg', import.meta.url).href,
  heidenheim: new URL('../../../images/Teams-logos/bundesliga/heidenheim.svg', import.meta.url).href,
  hoffenheim: new URL('../../../images/Teams-logos/bundesliga/hoffenheim.svg', import.meta.url).href,
  mainz: new URL('../../../images/Teams-logos/bundesliga/mainz.svg', import.meta.url).href,
  'rb-leipzig': new URL('../../../images/Teams-logos/bundesliga/rb leipzig.svg', import.meta.url)
    .href,
  'st-pauli': new URL('../../../images/Teams-logos/bundesliga/stpauli.svg', import.meta.url).href,
  stuttgart: new URL('../../../images/Teams-logos/bundesliga/stuttgart.svg', import.meta.url).href,
  'union-berlin': new URL('../../../images/Teams-logos/bundesliga/unionberlin.svg', import.meta.url)
    .href,
  'werder-bremen': new URL('../../../images/Teams-logos/bundesliga/werder.svg', import.meta.url).href,
  wolfsburg: new URL('../../../images/Teams-logos/bundesliga/wolfsburg.svg', import.meta.url).href
};

const LALIGA_TEAM_LOGOS = {
  alaves: new URL('../../../images/Teams-logos/laliga/deportivo.png', import.meta.url).href,
  'ath-bilbao': new URL('../../../images/Teams-logos/laliga/athletic.png', import.meta.url).href,
  'atl-madrid': new URL('../../../images/Teams-logos/laliga/atletico.png', import.meta.url).href,
  barcelona: new URL('../../../images/Teams-logos/laliga/barcelona.png', import.meta.url).href,
  betis: new URL('../../../images/Teams-logos/laliga/betis.png', import.meta.url).href,
  'celta-vigo': new URL('../../../images/Teams-logos/laliga/celtavigo.png', import.meta.url).href,
  elche: new URL('../../../images/Teams-logos/laliga/elche.png', import.meta.url).href,
  espanyol: new URL('../../../images/Teams-logos/laliga/ecdespanyoldebarcelona.png', import.meta.url).href,
  getafe: new URL('../../../images/Teams-logos/laliga/getafe.png', import.meta.url).href,
  girona: new URL('../../../images/Teams-logos/laliga/girona.png', import.meta.url).href,
  levante: new URL('../../../images/Teams-logos/laliga/levante.png', import.meta.url).href,
  mallorca: new URL('../../../images/Teams-logos/laliga/marcolla.png', import.meta.url).href,
  osasuna: new URL('../../../images/Teams-logos/laliga/osasuna.png', import.meta.url).href,
  oviedo: new URL('../../../images/Teams-logos/laliga/oviedo.png', import.meta.url).href,
  'rayo-vallecano': new URL('../../../images/Teams-logos/laliga/rayovallecano.png', import.meta.url).href,
  'real-madrid': new URL('../../../images/Teams-logos/laliga/real-madrid.png', import.meta.url).href,
  'real-sociedad': new URL('../../../images/Teams-logos/laliga/real-sociedad.png', import.meta.url).href,
  sevilla: new URL('../../../images/Teams-logos/laliga/sevilla.png', import.meta.url).href,
  valencia: new URL('../../../images/Teams-logos/laliga/valencia.png', import.meta.url).href,
  villarreal: new URL('../../../images/Teams-logos/laliga/villarreal.png', import.meta.url).href
};

const LIGUE1_TEAM_LOGOS = {
  angers: new URL('../../../images/Teams-logos/Ligue-1/angers sco.png', import.meta.url).href,
  auxerre: new URL('../../../images/Teams-logos/Ligue-1/auxerre.png', import.meta.url).href,
  brest: new URL('../../../images/Teams-logos/Ligue-1/brest.png', import.meta.url).href,
  'le-havre': new URL('../../../images/Teams-logos/Ligue-1/havre.png', import.meta.url).href,
  lens: new URL('../../../images/Teams-logos/Ligue-1/ecc223ea-c63a-4ccc-8d1e-845e9cda0363.png', import.meta.url)
    .href,
  lille: new URL('../../../images/Teams-logos/Ligue-1/losc.png', import.meta.url).href,
  lorient: new URL('../../../images/Teams-logos/Ligue-1/lorient.png', import.meta.url).href,
  lyon: new URL('../../../images/Teams-logos/Ligue-1/lyon.png', import.meta.url).href,
  marseille: new URL('../../../images/Teams-logos/Ligue-1/marseille.png', import.meta.url).href,
  metz: new URL('../../../images/Teams-logos/Ligue-1/metz.png', import.meta.url).href,
  monaco: new URL('../../../images/Teams-logos/Ligue-1/monaco.png', import.meta.url).href,
  nantes: new URL('../../../images/Teams-logos/Ligue-1/nantes.png', import.meta.url).href,
  nice: new URL('../../../images/Teams-logos/Ligue-1/nice.png', import.meta.url).href,
  'paris-fc': new URL('../../../images/Teams-logos/Ligue-1/parisfc.png', import.meta.url).href,
  psg: new URL('../../../images/Teams-logos/Ligue-1/psg.png', import.meta.url).href,
  rennes: new URL('../../../images/Teams-logos/Ligue-1/rennais.png', import.meta.url).href,
  strasbourg: new URL('../../../images/Teams-logos/Ligue-1/strasbourg.png', import.meta.url).href,
  toulouse: new URL('../../../images/Teams-logos/Ligue-1/toulouse.png', import.meta.url).href
};

const SERIEA_TEAM_LOGOS = {
  'ac-milan': new URL('../../../images/Teams-logos/serie-a/milan.webp', import.meta.url).href,
  'as-roma': new URL('../../../images/Teams-logos/serie-a/roma.webp', import.meta.url).href,
  atalanta: new URL('../../../images/Teams-logos/serie-a/atalanta.webp', import.meta.url).href,
  bologna: new URL('../../../images/Teams-logos/serie-a/bologna.webp', import.meta.url).href,
  cagliari: new URL('../../../images/Teams-logos/serie-a/cagliari.webp', import.meta.url).href,
  como: new URL('../../../images/Teams-logos/serie-a/como.webp', import.meta.url).href,
  cremonese: new URL('../../../images/Teams-logos/serie-a/cremonese.webp', import.meta.url).href,
  fiorentina: new URL('../../../images/Teams-logos/serie-a/fiorentina.webp', import.meta.url).href,
  genoa: new URL('../../../images/Teams-logos/serie-a/genoa.webp', import.meta.url).href,
  inter: new URL('../../../images/Teams-logos/serie-a/inter.webp', import.meta.url).href,
  juventus: new URL('../../../images/Teams-logos/serie-a/juventus.webp', import.meta.url).href,
  lazio: new URL('../../../images/Teams-logos/serie-a/lazio.webp', import.meta.url).href,
  lecce: new URL('../../../images/Teams-logos/serie-a/lecce.webp', import.meta.url).href,
  napoli: new URL('../../../images/Teams-logos/serie-a/napoli.webp', import.meta.url).href,
  parma: new URL('../../../images/Teams-logos/serie-a/parma.webp', import.meta.url).href,
  pisa: new URL('../../../images/Teams-logos/serie-a/pisa.webp', import.meta.url).href,
  sassuolo: new URL('../../../images/Teams-logos/serie-a/sassuolo.webp', import.meta.url).href,
  torino: new URL('../../../images/Teams-logos/serie-a/torino.webp', import.meta.url).href,
  udinese: new URL('../../../images/Teams-logos/serie-a/udinese.webp', import.meta.url).href,
  verona: new URL('../../../images/Teams-logos/serie-a/verona.webp', import.meta.url).href
};

const UCL_TEAM_LOGOS = {
  ajax: new URL('../../../images/Teams-logos/champions-league/ajax.png', import.meta.url).href,
  arsenal: new URL('../../../images/Teams-logos/champions-league/arsenal.svg', import.meta.url).href,
  atalanta: new URL('../../../images/Teams-logos/champions-league/atalanta.png', import.meta.url).href,
  'athletic-bilbao': new URL('../../../images/Teams-logos/champions-league/alteticobilbao.png', import.meta.url)
    .href,
  'atletico-madrid': new URL('../../../images/Teams-logos/champions-league/atletiko.png', import.meta.url)
    .href,
  barcelona: new URL('../../../images/Teams-logos/champions-league/barcelona.png', import.meta.url).href,
  'bayer-leverkusen': new URL('../../../images/Teams-logos/champions-league/leverkusen.png', import.meta.url)
    .href,
  'bayern-munich': new URL('../../../images/Teams-logos/champions-league/bayern.png', import.meta.url).href,
  benfica: new URL('../../../images/Teams-logos/champions-league/benfica.png', import.meta.url).href,
  'bodo-glimt': new URL('../../../images/Teams-logos/champions-league/doboglimt.png', import.meta.url).href,
  'borussia-dortmund': new URL('../../../images/Teams-logos/champions-league/borusia.png', import.meta.url)
    .href,
  chelsea: new URL('../../../images/Teams-logos/champions-league/chelsea.png', import.meta.url).href,
  'club-brugge': new URL('../../../images/Teams-logos/champions-league/brugge.png', import.meta.url).href,
  'eintracht-frankfurt': new URL('../../../images/Teams-logos/champions-league/franfurt.png', import.meta.url)
    .href,
  'fc-copenhagen': new URL('../../../images/Teams-logos/champions-league/kobenhavn.png', import.meta.url)
    .href,
  galatasaray: new URL('../../../images/Teams-logos/champions-league/galatasaray.png', import.meta.url).href,
  inter: new URL('../../../images/Teams-logos/champions-league/inter.png', import.meta.url).href,
  juventus: new URL('../../../images/Teams-logos/champions-league/juventus.png', import.meta.url).href,
  'kairat-almaty': new URL('../../../images/Teams-logos/champions-league/79970.png', import.meta.url).href,
  liverpool: new URL('../../../images/Teams-logos/champions-league/liverpool.png', import.meta.url).href,
  'manchester-city': new URL('../../../images/Teams-logos/champions-league/mancity.png', import.meta.url).href,
  marseille: new URL('../../../images/Teams-logos/champions-league/marseille.png', import.meta.url).href,
  monaco: new URL('../../../images/Teams-logos/champions-league/monaco.png', import.meta.url).href,
  napoli: new URL('../../../images/Teams-logos/champions-league/napoli.png', import.meta.url).href,
  'newcastle-united': new URL('../../../images/Teams-logos/champions-league/newcastle.png', import.meta.url).href,
  olympiacos: new URL('../../../images/Teams-logos/champions-league/2610.png', import.meta.url).href,
  pafos: new URL('../../../images/Teams-logos/champions-league/2609532.png', import.meta.url).href,
  psg: new URL('../../../images/Teams-logos/champions-league/psg.png', import.meta.url).href,
  psv: new URL('../../../images/Teams-logos/champions-league/psv.png', import.meta.url).href,
  qarabag: new URL('../../../images/Teams-logos/champions-league/qarabag.png', import.meta.url).href,
  'real-madrid': new URL('../../../images/Teams-logos/champions-league/realmadrid.png', import.meta.url).href,
  'slavia-prague': new URL('../../../images/Teams-logos/champions-league/52498.png', import.meta.url).href,
  'sporting-cp': new URL('../../../images/Teams-logos/champions-league/sporting.png', import.meta.url).href,
  'tottenham-hotspur': new URL('../../../images/Teams-logos/champions-league/sprus.png', import.meta.url).href,
  'union-sg': new URL('../../../images/Teams-logos/champions-league/64125.png', import.meta.url).href,
  villarreal: new URL('../../../images/Teams-logos/champions-league/villareal.png', import.meta.url).href
};

const COMPETITION_LOGOS = {
  premier: '../images/comp-logos/Competition=Men_%20Premier%20League,%20Color=Color.webp',
  championship: '../images/comp-logos/EFLchampionship.svg',
  facup: '../images/comp-logos/facup.png',
  carabaocup: '../images/comp-logos/carabao-cup-crest.svg',
  seriea: '../images/comp-logos/seriea-enilive-logo_jssflz.png',
  laliga: '../images/comp-logos/Screenshot%202026-03-02%20155633.png',
  bundesliga: '../images/comp-logos/bundesliga-app.svg',
  ligue1: '../images/comp-logos/ligue-1.png',
  ucl: '../images/comp-logos/Competition=Men_%20Champions%20League,%20Color=Color.webp',
  europa: '../images/comp-logos/europa-league.png',
  conference: '../images/comp-logos/conference-league.svg',
  worldcup: '../images/comp-logos/2026-World-Cup.webp'
};

const FLAG_URLS = {
  england: '../images/Flags/england.png',
  scotland: '../images/Flags/scotland.png',
  spain: '../images/Flags/spain.png',
  france: '../images/Flags/france.png',
  germany: '../images/Flags/germany.png',
  italy: '../images/Flags/italy.png',
  portugal: '../images/Flags/portugal.png',
  netherlands: '../images/Flags/netherlands.png',
  belgium: '../images/Flags/belgium.png',
  brazil: '../images/Flags/brazil.png',
  argentina: '../images/Flags/argentina.png',
  colombia: '../images/Flags/colombia.png',
  croatia: '../images/Flags/croatia.png',
  ecuador: '../images/Flags/ecuador.png',
  ghana: '../images/Flags/ghana.jpg',
  hungary: '../images/Flags/hungary.png',
  norway: '../images/Flags/norway.png',
  sweden: '../images/Flags/sweden.svg',
  switzerland: '../images/Flags/swis.png',
  mexico: '../images/Flags/mexico.png',
  usa: '../images/Flags/USA.png',
  egypt: '../images/Flags/Egypt.svg',
  morocco: '../images/Flags/morocco.jpg',
  senegal: '../images/Flags/senegal.png',
  algeria: '../images/Flags/algeria.png',
  'ivorycoast': '../images/Flags/CIV.png',
  canada: '../images/Flags/canada.png'
};

const POSITION_ORDER = {
  Goalkeeper: 0,
  Defender: 1,
  Midfielder: 2,
  Forward: 3
};

const TEAM_COLORS = {
  'afc-bournemouth': '#7a0b12',
  arsenal: '#b0001a',
  'aston-villa': '#6b1f3b',
  brentford: '#b10d1a',
  'brighton-and-hove-albion': '#0a4aa8',
  burnley: '#6b1e26',
  chelsea: '#0038a8',
  'crystal-palace': '#2d4f8b',
  everton: '#003c88',
  fulham: '#1d1d1d',
  'leeds-united': '#1b1b1b',
  liverpool: '#b0001a',
  'manchester-city': '#2b6d99',
  'manchester-united': '#a40016',
  'newcastle-united': '#202020',
  'nottingham-forest': '#8b1010',
  sunderland: '#a10e1a',
  'tottenham-hotspur': '#1d2d4a',
  'west-ham-united': '#4f1d2d',
  'wolverhampton-wanderers': '#b47b1f'
};

const TEAM_COLOR_PAIRS = {
  'afc-bournemouth': ['#7a0b12', '#111111'],
  arsenal: ['#b0001a', '#f2f2f2'],
  'aston-villa': ['#6b1f3b', '#8bc1e8'],
  brentford: ['#b10d1a', '#f2f2f2'],
  'brighton-and-hove-albion': ['#0a4aa8', '#f2b705'],
  burnley: ['#6b1e26', '#8bc1e8'],
  chelsea: ['#0038a8', '#f2f2f2'],
  'crystal-palace': ['#2d4f8b', '#b0001a'],
  everton: ['#003c88', '#f2f2f2'],
  fulham: ['#101010', '#f2f2f2'],
  'leeds-united': ['#0a4aa8', '#f2b705'],
  liverpool: ['#b0001a', '#f2f2f2'],
  'manchester-city': ['#2b6d99', '#f2f2f2'],
  'manchester-united': ['#a40016', '#111111'],
  'newcastle-united': ['#111111', '#f2f2f2'],
  'nottingham-forest': ['#8b1010', '#f2f2f2'],
  sunderland: ['#a10e1a', '#f2f2f2'],
  'tottenham-hotspur': ['#1d2d4a', '#f2f2f2'],
  'west-ham-united': ['#4f1d2d', '#8bc1e8'],
  'wolverhampton-wanderers': ['#b47b1f', '#111111']
};

const BUNDESLIGA_TEAM_COLORS = {
  'bayern-munich': '#c4122f'
};

const LEAGUE_CONFIGS = {
  premier: {
    competitionId: 'premier-league-2025-2026',
    teamsUrl: PREMIER_TEAMS_URL,
    playersUrl: PREMIER_PLAYERS_URL,
    matchesUrl: PREMIER_MATCHES_URL,
    competitionLabel: 'Premier League',
    teamLogos: PREMIER_TEAM_LOGOS,
    colorPairs: TEAM_COLOR_PAIRS,
    primaryColors: TEAM_COLORS
  },
  championship: {
    competitionId: 'efl-championship-2025-2026',
    matchesUrl: CHAMPIONSHIP_MATCHES_URL,
    matchesFormat: 'csv',
    competitionLabel: 'EFL Championship',
    teamLogos: CHAMPIONSHIP_TEAM_LOGOS,
    teamColumns: ['HomeTeam', 'AwayTeam']
  },
  facup: {
    competitionId: 'fa-cup-2025-2026',
    matchesUrl: FACUP_MATCHES_URL,
    matchesFormat: 'csv',
    competitionLabel: 'FA Cup',
    teamLogos: ENGLISH_TEAM_LOGOS,
    teamColumns: ['Home Team', 'Away Team', 'HomeTeam', 'AwayTeam']
  },
  carabaocup: {
    competitionId: 'carabao-cup-2025-2026',
    matchesUrl: CARABAO_MATCHES_URL,
    matchesFormat: 'csv',
    competitionLabel: 'Carabao Cup',
    teamLogos: ENGLISH_TEAM_LOGOS,
    teamColumns: ['Home Team', 'Away Team', 'HomeTeam', 'AwayTeam']
  },
  seriea: {
    competitionId: 'serie-a-2025-2026',
    teamsUrl: SERIEA_TEAMS_URL,
    playersUrl: SERIEA_PLAYERS_URL,
    matchesUrl: SERIEA_MATCHES_URL,
    competitionLabel: 'Serie A',
    teamLogos: SERIEA_TEAM_LOGOS
  },
  laliga: {
    competitionId: 'la-liga-2025-2026',
    teamsUrl: LALIGA_TEAMS_URL,
    playersUrl: LALIGA_PLAYERS_URL,
    matchesUrl: LALIGA_MATCHES_URL,
    competitionLabel: 'LaLiga',
    teamLogos: LALIGA_TEAM_LOGOS
  },
  bundesliga: {
    competitionId: 'bundesliga-2025-2026',
    teamsUrl: BUNDESLIGA_TEAMS_URL,
    playersUrl: BUNDESLIGA_PLAYERS_URL,
    matchesUrl: BUNDESLIGA_MATCHES_URL,
    competitionLabel: 'Bundesliga',
    teamLogos: BUNDESLIGA_TEAM_LOGOS,
    primaryColors: BUNDESLIGA_TEAM_COLORS
  },
  ligue1: {
    competitionId: 'ligue-1-2025-2026',
    teamsUrl: LIGUE1_TEAMS_URL,
    playersUrl: LIGUE1_PLAYERS_URL,
    matchesUrl: LIGUE1_MATCHES_URL,
    competitionLabel: 'Ligue 1',
    teamLogos: LIGUE1_TEAM_LOGOS
  },
  ucl: {
    competitionId: 'champions-league-2025-2026',
    teamsUrl: UCL_TEAMS_URL,
    playersUrl: UCL_PLAYERS_URL,
    matchesUrl: UCL_MATCHES_URL,
    competitionLabel: 'Champions League',
    teamLogos: UCL_TEAM_LOGOS
  },
  europa: {
    competitionId: 'europa-league-2024-2025',
    matchesUrl: EUROPA_MATCHES_URL,
    matchesFormat: 'csv',
    competitionLabel: 'Europa League',
    teamLogos: EUROPA_TEAM_LOGOS,
    teamColumns: ['Home Team', 'Away Team', 'HomeTeam', 'AwayTeam']
  },
  conference: {
    competitionId: 'conference-league-2024-2025',
    matchesUrl: CONFERENCE_MATCHES_URL,
    matchesFormat: 'csv',
    competitionLabel: 'Conference League',
    teamLogos: CONFERENCE_TEAM_LOGOS,
    teamColumns: ['Home Team', 'Away Team', 'HomeTeam', 'AwayTeam']
  },
  worldcup: {
    competitionId: 'world-cup-2026',
    matchesUrl: WORLDCUP_MATCHES_URL,
    matchesFormat: 'csv',
    competitionLabel: 'World Cup',
    teamColumns: ['Team1', 'Team2']
  }
};

// Some datasets use different teamId slugs than `teams.json` (used for the UI pills).
// Keep an alias map so players still show up for every team without rewriting the data files.
const TEAM_ID_ALIASES = {
  seriea: {
    atalanta: ['atalanta-bc'],
    bologna: ['bologna-fc'],
    cagliari: ['cagliari-calcio'],
    como: ['como-1907'],
    cremonese: ['us-cremonese'],
    fiorentina: ['acf-fiorentina'],
    genoa: ['genoa-cfc'],
    inter: ['inter-milan'],
    lazio: ['lazio-rome'],
    lecce: ['us-lecce'],
    napoli: ['ssc-napoli'],
    parma: ['parma-calcio'],
    pisa: ['pisa-sc'],
    sassuolo: ['sassuolo-calcio'],
    torino: ['torino-fc'],
    udinese: ['udinese-calcio'],
    verona: ['hellas-verona']
  },
  bundesliga: {
    augsburg: ['fc-augsburg'],
    dortmund: ['borussia-dortmund'],
    'b-monchengladbach': ['borussia-monchengladbach'],
    'fc-koln': ['fc-cologne'],
    freiburg: ['sc-freiburg'],
    heidenheim: ['fc-heidenheim'],
    hoffenheim: ['tsg-hoffenheim'],
    mainz: ['fsv-mainz'],
    'st-pauli': ['fc-st-pauli'],
    stuttgart: ['vfb-stuttgart'],
    wolfsburg: ['vfl-wolfsburg']
  },
  laliga: {
    barcelona: ['fc-barcelona'],
    'atl-madrid': ['atletico-madrid'],
    'ath-bilbao': ['athletic-bilbao'],
    betis: ['real-betis'],
    'celta-vigo': ['rc-celta-vigo'],
    getafe: ['getafe-cf'],
    espanyol: ['espanyol-barcelona'],
    osasuna: ['ca-osasuna'],
    girona: ['girona-fc'],
    valencia: ['valencia-cf'],
    sevilla: ['sevilla-fc'],
    elche: ['elche-cf'],
    alaves: ['deportivo-alaves'],
    mallorca: ['rcd-mallorca'],
    levante: ['levante-ud'],
    oviedo: ['real-oviedo'],
    villarreal: ['villarreal-cf']
  }
};

const getTeamIdCandidates = (leagueKey, teamId) => {
  if (!teamId) return [];
  const aliases = TEAM_ID_ALIASES?.[leagueKey]?.[teamId];
  if (!aliases) return [teamId];
  return [teamId, ...(Array.isArray(aliases) ? aliases : [aliases])];
};

const DEFAULT_TEAM_COLOR = '#2a2a2a';
const DEFAULT_TEAM_PAIR = ['#2a2a2a', '#111111'];
const LEAGUE_DEFAULT_COLORS = {
  championship: '#0f4fa8',
  facup: '#c1121f',
  carabaocup: '#117a3a',
  europa: '#f57c00',
  conference: '#00a86b',
  worldcup: '#007a5a'
};

const state = {
  teams: [],
  players: [],
  roster: [],
  fixtures: [],
  fixtureVisibleCount: 10,
  activeTab: 'squad',
  standings: {},
  leagueTeams: {},
  activeTeamId: null,
  activeLeague: 'premier',
  searchTerm: '',
  profileKey: null
};

const leagueCache = new Map();
const rosterCache = new Map();
const fixturesCache = new Map();
const matchesCache = new Map();
const cupMatchesCache = new Map();
const standingsCache = new Map();
const teamsListCache = new Map();
let playersInfoIndex = null;
const colorCache = new Map();
const pendingColorPromises = new Map();

const normalizeString = (value = '') =>
  String(value).toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const normalizeKey = (value = '') => normalizeString(value).replace(/[^a-z0-9]/g, '');
const pageParams = new URLSearchParams(window.location.search);
const requestedLeagueFromPage = pageParams.get('playersLeague');
const requestedTeamFromPage = pageParams.get('playersTeam');
const requestedTeamNameFromPage = pageParams.get('playersTeamName');
const requestedPlayerFromPage = pageParams.get('playersPlayer');

const GLOBAL_TEAM_LOGOS = {
  ...PREMIER_TEAM_LOGOS,
  ...CHAMPIONSHIP_TEAM_LOGOS,
  ...EUROPA_TEAM_LOGOS,
  ...CONFERENCE_TEAM_LOGOS,
  ...SERIEA_TEAM_LOGOS,
  ...LALIGA_TEAM_LOGOS,
  ...BUNDESLIGA_TEAM_LOGOS,
  ...LIGUE1_TEAM_LOGOS,
  ...UCL_TEAM_LOGOS
};
const GLOBAL_TEAM_LOGOS_BY_KEY = Object.entries(GLOBAL_TEAM_LOGOS).reduce((acc, [key, value]) => {
  acc[normalizeKey(key)] = value;
  return acc;
}, {});

const CONFERENCE_TEAM_LOGOS_BY_KEY = Object.entries(CONFERENCE_TEAM_LOGOS).reduce((acc, [key, value]) => {
  acc[normalizeKey(key)] = value;
  return acc;
}, {});

const CONFERENCE_LOGO_ALIASES = {
  aberdeen: 'berdeen',
  breidablik: 'breioablik',
  bkhacken: 'hacken',
  hacken: 'hacken',
  lincolnredimps: 'lredimps',
  lredimps: 'lredimps',
  rayovallecano: 'rayavallecano',
  slovanbratislava: 'sbratislava',
  rapidwien: 'skrapid',
  universitateacraiova: 'ucraiova',
  zrinjskimostar: 'zrinjski',
  shkendija: 'shendija',
  shakhtardonetsk: 'shakhtar',
  acffiorentina: 'fiorentina',
  fiorentina: 'fiorentina',
  hnkrijeka: 'rijeka',
  dinamokyiv: 'dynamokyiv',
  dynamokyiv: 'dynamokyiv',
  fsvmainz05: 'mainz',
  mainz05: 'mainz',
  fcnoah: 'noah',
  omonia: 'omonoia',
  rakowczestochowa: 'rakow',
  jagielloniabialystok: 'jagiellonia',
  lausannesport: 'lausannesport',
  kups: 'kupskuopio',
  kupskuopio: 'kupskuopio',
  kuopsk: 'kupskuopio'
};

const stripClubPrefixes = (value = '') =>
  String(value)
    .replace(/\b(fc|fk|bk|sc|ac|pfc|pfk|nk|ks|as|cd|cr|ss|cf|gnk|hjk)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

const getConferenceLogo = (name = '', id = '') => {
  const candidates = [name, id, stripClubPrefixes(name), stripClubPrefixes(id)].filter(Boolean);
  for (const candidate of candidates) {
    const key = normalizeKey(candidate);
    const aliasKey = CONFERENCE_LOGO_ALIASES[key] || key;
    const logo = CONFERENCE_TEAM_LOGOS_BY_KEY[aliasKey] || CONFERENCE_TEAM_LOGOS_BY_KEY[key];
    if (logo) return logo;
  }
  return null;
};

const PHOTO_STRATEGY_OVERRIDES = {
  'premier:liverpool': 'name'
};

const getPhotoStrategy = (leagueKey, teamId, entry) =>
  entry?.photoStrategy || PHOTO_STRATEGY_OVERRIDES[`${leagueKey}:${teamId}`] || 'index';

const buildPhotoNameLookup = (photos = []) => {
  const lookup = new Map();
  photos.forEach((path) => {
    const filename = String(path || '').split('/').pop() || '';
    const base = filename.replace(/\.[^.]+$/, '');
    if (!base || /^[0-9]+$/.test(base)) return;
    lookup.set(normalizeKey(base), path);
  });
  return lookup;
};

const getNameParts = (name = '') => {
  const parts = normalizeString(name).split(' ').filter(Boolean);
  return {
    first: parts[0] || '',
    last: parts[parts.length - 1] || ''
  };
};

const normalizePhotoMap = (map) => {
  if (!map || typeof map !== 'object') return {};
  const normalized = {};
  Object.entries(map).forEach(([key, value]) => {
    normalized[normalizeKey(key)] = value;
  });
  return normalized;
};

const findPhotoBySubstring = (playerKey, lookup) => {
  if (!lookup) return null;
  let bestPath = null;
  let bestLen = 0;
  for (const [photoKey, path] of lookup.entries()) {
    if (!photoKey || photoKey.length < 4) continue;
    if (playerKey.includes(photoKey) || photoKey.includes(playerKey)) {
      if (photoKey.length > bestLen) {
        bestLen = photoKey.length;
        bestPath = path;
      }
    }
  }
  return bestPath;
};

const resolvePlayerPhoto = (playerName, entry, index, leagueKey, teamId, hints) => {
  const key = normalizeKey(playerName);
  const photoMap = normalizePhotoMap(entry?.photoMap || entry?.photosByName || entry?.photoByName);
  if (photoMap[key]) return photoMap[key];
  const strategy = getPhotoStrategy(leagueKey, teamId, entry);
  const photos = entry?.photos || [];
  const lookup = entry?.photoLookup || hints?.photoLookup || buildPhotoNameLookup(photos);
  if (strategy === 'name') {
    const direct = lookup.get(key);
    if (direct) return direct;
  }
  if (strategy === 'none') return null;
  if (lookup && (strategy === 'name' || strategy === 'index')) {
    const { first, last } = getNameParts(playerName);
    const firstKey = normalizeKey(first);
    const lastKey = normalizeKey(last);
    if (lastKey && hints?.lastCounts?.get?.(lastKey) === 1 && lookup.get(lastKey)) {
      return lookup.get(lastKey);
    }
    if (firstKey && hints?.firstCounts?.get?.(firstKey) === 1 && lookup.get(firstKey)) {
      return lookup.get(firstKey);
    }
    const partial = findPhotoBySubstring(key, lookup);
    if (partial) return partial;
  }
  if (strategy === 'name') return null;
  return photos[index] || null;
};

const TEAM_NOISE_WORDS = new Set([
  'ac',
  'afc',
  'as',
  'bc',
  'ca',
  'cf',
  'club',
  'de',
  'fc',
  'fk',
  'rc',
  'sc',
  'ssc',
  'tsg',
  'ud',
  'vfb',
  'fsv'
]);

const expandTeamWord = (word = '') => {
  if (word === 'atl') return 'atletico';
  if (word === 'ath') return 'athletic';
  return word;
};

const buildTeamMatchKeys = (...values) => {
  const keys = new Set();

  values
    .flat()
    .filter(Boolean)
    .forEach((value) => {
      const rawKey = normalizeKey(value);
      if (rawKey) keys.add(rawKey);

      const words = normalizeString(value)
        .split(/[^a-z0-9]+/)
        .map((word) => expandTeamWord(word))
        .filter((word) => word && !TEAM_NOISE_WORDS.has(word) && !/^\d+$/.test(word));

      const compactKey = words.join('');
      if (compactKey) keys.add(compactKey);
    });

  return keys;
};

const isTeamKeyMatch = (left = '', right = '') => {
  if (!left || !right) return false;
  if (left === right) return true;
  const minLength = Math.min(left.length, right.length);
  if (minLength < 5) return false;
  return (
    left.startsWith(right) ||
    left.endsWith(right) ||
    right.startsWith(left) ||
    right.endsWith(left)
  );
};

const playerBelongsToTeam = (player, team) => {
  const teamKeys = buildTeamMatchKeys(team?.id, team?.slug, team?.name, team?.shortName, team?.aliases || []);
  const playerKeys = buildTeamMatchKeys(player?.teamId, player?.teamName);

  for (const playerKey of playerKeys) {
    for (const teamKey of teamKeys) {
      if (isTeamKeyMatch(playerKey, teamKey)) return true;
    }
  }

  return false;
};

const toTitleCase = (value = '') =>
  String(value)
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const extractDisplayNameFromPhoto = (path = '') => {
  const filename = String(path || '').split('/').pop() || '';
  let base = filename.replace(/\.[^.]+$/, '');

  base = base
    .replace(/^2526-motion-/i, '')
    .replace(/^\d{1,3}-/i, '')
    .replace(/^player_official_\d+_\d+_/i, '')
    .replace(/^p\d+_t\d+_\d+_\d+_\d+_?/i, '')
    .replace(/-\d+x\d+$/i, '')
    .replace(/_[a-z0-9]{4,}$/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  if (!base || /\d/.test(base)) return null;

  const normalized = normalizeKey(base);
  if (normalized.length < 3) return null;

  return toTitleCase(base);
};

const buildRosterFromPhotoList = (entry) => {
  const seen = new Set();
  const roster = [];

  (entry?.photos || []).forEach((path) => {
    const name = extractDisplayNameFromPhoto(path);
    if (!name) return;
    const key = normalizeKey(name);
    if (!key || seen.has(key)) return;
    seen.add(key);
    roster.push({
      name,
      position: '',
      number: '',
      nationality: '',
      age: '',
      appearances: '',
      goals: '',
      assists: '',
      minutes: '',
      cleanSheets: '',
      yellow: '',
      red: '',
      homeGrown: '',
      notes: '',
      photo: path
    });
  });

  return roster;
};

const getFixtureCutoffDate = () => {
  const now = new Date();
  const march20 = new Date(now.getFullYear(), 2, 20);
  return now > march20 ? march20 : now;
};

const loadPlayersInfoIndex = async () => {
  if (playersInfoIndex) return playersInfoIndex;
  try {
    const response = await fetch(PLAYERSINFO_INDEX_URL);
    if (response.ok) {
      playersInfoIndex = await response.json();
      return playersInfoIndex;
    }
  } catch (error) {
    console.warn('Unable to load playersinfo index.', error);
  }
  playersInfoIndex = {};
  return playersInfoIndex;
};

const getPlayersInfoEntry = (leagueKey, teamId) => {
  if (!playersInfoIndex) return null;
  return playersInfoIndex?.[leagueKey]?.[teamId] || null;
};

const parsePlayersCsv = (text) => {
  const lines = String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length);
  if (!lines.length) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const parts = lines[i].split(',');
    if (parts.length > headers.length) {
      const fixed = parts.slice(0, headers.length - 1);
      fixed.push(parts.slice(headers.length - 1).join(','));
      parts.length = 0;
      parts.push(...fixed);
    }
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = (parts[idx] || '').trim();
    });
    rows.push(record);
  }
  return rows;
};

const positionGroupFor = (value = '') => {
  const clean = normalizeString(value);
  if (['gk', 'goalkeeper', 'keeper'].includes(clean)) return 'Goalkeepers';
  if (['def', 'defender', 'defence', 'defensive'].includes(clean)) return 'Defenders';
  if (['mid', 'midfielder', 'midfield'].includes(clean)) return 'Midfielders';
  if (['fwd', 'forward', 'attacker', 'striker', 'winger'].includes(clean)) return 'Forwards';
  return 'Other';
};

const clampChannel = (value) => Math.max(0, Math.min(255, value));

const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
};

const rgbToHsl = (r, g, b) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    switch (max) {
      case rNorm:
        hue = ((gNorm - bNorm) / delta) % 6;
        break;
      case gNorm:
        hue = (bNorm - rNorm) / delta + 2;
        break;
      default:
        hue = (rNorm - gNorm) / delta + 4;
    }
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  return { h: hue, s: saturation, l: lightness };
};

const hslToRgb = (h, s, l) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
  } else if (h >= 120 && h < 180) {
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: clampChannel(Math.round((r + m) * 255)),
    g: clampChannel(Math.round((g + m) * 255)),
    b: clampChannel(Math.round((b + m) * 255))
  };
};

const rgbToHex = (r, g, b) =>
  `#${[r, g, b].map((value) => clampChannel(value).toString(16).padStart(2, '0')).join('')}`;

const tameColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return DEFAULT_TEAM_COLOR;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const saturation = Math.min(hsl.s, 0.65);
  const lightness = Math.min(Math.max(hsl.l, 0.18), 0.42);
  const { r, g, b } = hslToRgb(hsl.h, saturation, lightness);
  return rgbToHex(r, g, b);
};

const boostColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return DEFAULT_TEAM_COLOR;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const saturation = Math.max(Math.min(hsl.s, 0.85), 0.7);
  const lightness = Math.min(Math.max(hsl.l, 0.35), 0.55);
  const { r, g, b } = hslToRgb(hsl.h, saturation, lightness);
  return rgbToHex(r, g, b);
};

const stylizeColor = (hex, leagueKey) => (leagueKey === 'premier' ? tameColor(hex) : boostColor(hex));

const extractDominantColor = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        reject(new Error('Canvas not available'));
        return;
      }
      const size = 40;
      canvas.width = size;
      canvas.height = size;
      context.drawImage(image, 0, 0, size, size);
      const { data } = context.getImageData(0, 0, size, size);
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha < 200) continue;
        const rVal = data[i];
        const gVal = data[i + 1];
        const bVal = data[i + 2];
        const avg = (rVal + gVal + bVal) / 3;
        if (avg > 235) continue;
        r += rVal;
        g += gVal;
        b += bVal;
        count += 1;
      }
      if (!count) {
        reject(new Error('No dominant color'));
        return;
      }
      resolve(rgbToHex(Math.round(r / count), Math.round(g / count), Math.round(b / count)));
    };
    image.onerror = () => reject(new Error('Image failed'));
    image.src = url;
  });

const getLeagueConfig = (leagueKey = state.activeLeague) =>
  LEAGUE_CONFIGS[leagueKey] || LEAGUE_CONFIGS.premier;

const buildPairData = (primary, secondary) => {
  const rgb = hexToRgb(primary) || { r: 42, g: 42, b: 42 };
  return { primary, secondary, rgb };
};

const getCachedPair = (leagueKey, teamId) => {
  const config = getLeagueConfig(leagueKey);
  const manual = config.colorPairs?.[teamId];
  if (manual) return buildPairData(manual[0], manual[1]);
  const cached = colorCache.get(`${leagueKey}:${teamId}`);
  if (cached) return cached;
  if (config.primaryColors?.[teamId]) {
    const primary = stylizeColor(config.primaryColors[teamId], leagueKey);
    const rgb = hexToRgb(primary) || { r: 42, g: 42, b: 42 };
    const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
    const secondary = luminance < 0.4 ? '#f2f2f2' : '#111111';
    return buildPairData(primary, secondary);
  }
  return buildPairData(DEFAULT_TEAM_PAIR[0], DEFAULT_TEAM_PAIR[1]);
};

const ensureColorPair = (leagueKey, teamId) => {
  const cacheKey = `${leagueKey}:${teamId}`;
  const config = getLeagueConfig(leagueKey);
  const manual = config.colorPairs?.[teamId];
  if (manual) return Promise.resolve(buildPairData(manual[0], manual[1]));
  if (colorCache.has(cacheKey)) return Promise.resolve(colorCache.get(cacheKey));
  if (pendingColorPromises.has(cacheKey)) return pendingColorPromises.get(cacheKey);

  if (config.primaryColors?.[teamId]) {
    const primary = stylizeColor(config.primaryColors[teamId], leagueKey);
    const rgb = hexToRgb(primary) || { r: 42, g: 42, b: 42 };
    const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
    const secondary = luminance < 0.4 ? '#f2f2f2' : '#111111';
    const pair = buildPairData(primary, secondary);
    colorCache.set(cacheKey, pair);
    return Promise.resolve(pair);
  }

  const logoSrc = config.teamLogos?.[teamId];
  if (!logoSrc) {
    const team = state.teams?.find((item) => item.id === teamId);
    const nameKey = normalizeKey(team?.name || team?.shortName || teamId);
    const fallbackLogo =
      (leagueKey === 'worldcup' ? getFlagUrl(team?.name || teamId) : null) ||
      GLOBAL_TEAM_LOGOS_BY_KEY[nameKey] ||
      null;
    if (!fallbackLogo) {
      const fallback = LEAGUE_DEFAULT_COLORS[leagueKey] || DEFAULT_TEAM_PAIR[0];
      const pair = buildPairData(fallback, DEFAULT_TEAM_PAIR[1]);
      colorCache.set(cacheKey, pair);
      return Promise.resolve(pair);
    }
    const promise = extractDominantColor(fallbackLogo)
      .then((color) => {
        const primary = stylizeColor(color, leagueKey);
        const rgb = hexToRgb(primary) || { r: 42, g: 42, b: 42 };
        const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
        const secondary = luminance < 0.4 ? '#f2f2f2' : '#111111';
        const pair = buildPairData(primary, secondary);
        colorCache.set(cacheKey, pair);
        return pair;
      })
      .catch(() => {
        const pair = buildPairData(DEFAULT_TEAM_PAIR[0], DEFAULT_TEAM_PAIR[1]);
        colorCache.set(cacheKey, pair);
        return pair;
      })
      .finally(() => {
        pendingColorPromises.delete(cacheKey);
      });

    pendingColorPromises.set(cacheKey, promise);
    return promise;
  }

  const promise = extractDominantColor(logoSrc)
    .then((color) => {
      const primary = stylizeColor(color, leagueKey);
      const rgb = hexToRgb(primary) || { r: 42, g: 42, b: 42 };
      const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
      const secondary = luminance < 0.4 ? '#f2f2f2' : '#111111';
      const pair = buildPairData(primary, secondary);
      colorCache.set(cacheKey, pair);
      return pair;
    })
    .catch(() => {
      const pair = buildPairData(DEFAULT_TEAM_PAIR[0], DEFAULT_TEAM_PAIR[1]);
      colorCache.set(cacheKey, pair);
      return pair;
    })
    .finally(() => {
      pendingColorPromises.delete(cacheKey);
    });

  pendingColorPromises.set(cacheKey, promise);
  return promise;
};

const setTeamPillStyle = (pill, pair) => {
  pill.style.setProperty('--team-pill-primary', pair.primary);
  pill.style.setProperty('--team-pill-secondary', pair.secondary);
  pill.style.setProperty(
    '--team-pill-bg',
    `linear-gradient(180deg, ${pair.primary} 0%, #101010 65%, #050505 100%)`
  );
  pill.style.setProperty(
    '--team-pill-border',
    `rgba(${pair.rgb.r}, ${pair.rgb.g}, ${pair.rgb.b}, 0.8)`
  );
};

const setPanelThemeFromPrimary = (panel, primary) => {
  const rgb = hexToRgb(primary) || { r: 42, g: 42, b: 42 };
  panel.style.setProperty('--team-row-bg', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.22)`);
  panel.style.setProperty('--team-row-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`);
  panel.style.setProperty('--team-header-bg', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.32)`);
  panel.style.setProperty('--team-header-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`);
};

const applyTeamTheme = (panel, teamId) => {
  if (!panel || !teamId) return;
  const leagueKey = state.activeLeague;
  const cached = getCachedPair(leagueKey, teamId);
  setPanelThemeFromPrimary(panel, cached.primary);
  panel.style.setProperty('--team-primary', cached.primary);
  panel.style.setProperty('--team-secondary', cached.secondary);
  ensureColorPair(leagueKey, teamId).then((pair) => {
    if (state.activeLeague !== leagueKey || state.activeTeamId !== teamId) return;
    setPanelThemeFromPrimary(panel, pair.primary);
    panel.style.setProperty('--team-primary', pair.primary);
    panel.style.setProperty('--team-secondary', pair.secondary);
  });
};

const fetchJsonCached = async (url) => {
  const key = url?.toString?.() || String(url);
  if (matchesCache.has(key)) return matchesCache.get(key);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${key}`);
  const data = await response.json();
  matchesCache.set(key, data);
  return data;
};

const parseCupCsv = (text) => {
  const lines = String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length);
  if (lines.length <= 1) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const parts = lines[i].split(',');
    if (parts.length > headers.length) {
      const fixed = parts.slice(0, headers.length - 1);
      fixed.push(parts.slice(headers.length - 1).join(','));
      parts.length = 0;
      parts.push(...fixed);
    }
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = (parts[idx] || '').trim();
    });
    rows.push(record);
  }
  return rows;
};

const fetchCupCsvCached = async (url) => {
  const key = url?.toString?.() || String(url);
  if (cupMatchesCache.has(key)) return cupMatchesCache.get(key);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${key}`);
  const text = await response.text();
  const rows = parseCupCsv(text);
  cupMatchesCache.set(key, rows);
  return rows;
};

const slugifyTeamName = (value = '') =>
  normalizeString(value)
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const getRowValue = (row, keys) => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim();
    }
  }
  return '';
};

const buildTeamsFromCsv = async (leagueKey) => {
  const config = getLeagueConfig(leagueKey);
  if (!config?.matchesUrl) return [];
  const rows = await fetchCupCsvCached(config.matchesUrl);
  const columns =
    config.teamColumns && config.teamColumns.length
      ? config.teamColumns
      : ['Home Team', 'HomeTeam', 'Home', 'Away Team', 'AwayTeam', 'Away', 'Team1', 'Team2'];
  const teamsMap = new Map();
  rows.forEach((row) => {
    columns.forEach((col) => {
      const name = row[col];
      if (!name) return;
      const clean = String(name).trim();
      if (!clean) return;
      const id = slugifyTeamName(clean);
      if (!id || teamsMap.has(id)) return;
      teamsMap.set(id, { id, name: clean, shortName: clean });
    });
  });
  return Array.from(teamsMap.values());
};

const parseScoreNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const parseScorePair = (value) => {
  if (!value) return [null, null];
  const match = String(value).match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return [null, null];
  return [Number(match[1]), Number(match[2])];
};

const extractCsvScores = (row) => {
  const homeRaw =
    row['Home Score'] || row.HomeScore || row['HomeScore'] || row.FTHG || row.Score1 || row['Score1'] || '';
  const awayRaw =
    row['Away Score'] || row.AwayScore || row['AwayScore'] || row.FTAG || row.Score2 || row['Score2'] || '';
  const homeScore = parseScoreNumber(homeRaw);
  const awayScore = parseScoreNumber(awayRaw);
  if (homeScore !== null && awayScore !== null) {
    return { homeScore, awayScore };
  }
  const legScore = row['Leg 1 Score'] || row['Leg1Score'] || row['Leg 1'] || '';
  const [legHome, legAway] = parseScorePair(legScore);
  if (legHome !== null && legAway !== null) {
    return { homeScore: legHome, awayScore: legAway };
  }
  return { homeScore: null, awayScore: null };
};

const buildCsvFixtures = async (team, leagueKey) => {
  const config = getLeagueConfig(leagueKey);
  if (!config?.matchesUrl) return [];
  const rows = await fetchCupCsvCached(config.matchesUrl);
  const nameSet = buildTeamNameSet(team);
  const fixtures = [];
  for (const row of rows) {
    const home = getRowValue(row, ['Home Team', 'HomeTeam', 'Home', 'Team1']);
    const away = getRowValue(row, ['Away Team', 'AwayTeam', 'Away', 'Team2']);
    if (!home || !away) continue;
    const homeKey = normalizeKey(home);
    const awayKey = normalizeKey(away);
    if (!nameSet.has(homeKey) && !nameSet.has(awayKey)) continue;
    const { homeScore, awayScore } = extractCsvScores(row);
    const isHome = nameSet.has(homeKey);
    const dateValue = row.Date || row.date || row['Match Date'] || row['MatchDate'] || '';
    const timeValue = row.Time || row.time || '';
    const matchDate = timeValue ? `${dateValue} ${timeValue}` : dateValue;
    fixtures.push({
      competition: config.competitionLabel,
      competitionId: config.competitionId,
      competitionLogo: COMPETITION_LOGOS[leagueKey] || null,
      round: row.Round || row.round || row.Stage || row.stage || row.Group || row.group || '',
      matchDate,
      status: homeScore !== null && awayScore !== null ? 'completed' : 'scheduled',
      teamScore: isHome ? homeScore : awayScore,
      opponentScore: isHome ? awayScore : homeScore,
      homeTeam: home,
      awayTeam: away,
      opponentName: isHome ? away : home,
      opponentLogo: await getLogoByName(leagueKey, isHome ? away : home)
    });
  }
  return fixtures;
};

const toDateSafe = (value) => {
  if (!value) return null;
  const stamp = Date.parse(String(value));
  if (!Number.isFinite(stamp)) return null;
  return new Date(stamp);
};

const buildTeamNameSet = (team) => {
  const names = [team?.name, team?.shortName, team?.id];
  if (Array.isArray(team?.aliases)) names.push(...team.aliases);
  return new Set(names.filter(Boolean).map((name) => normalizeKey(name)));
};

const buildTeamLookup = async (leagueKey) => {
  const cacheKey = `teams:${leagueKey}`;
  if (matchesCache.has(cacheKey)) return matchesCache.get(cacheKey);
  const config = getLeagueConfig(leagueKey);
  if (!config?.teamsUrl) {
    const cached = leagueCache.get(leagueKey);
    if (cached?.teams?.length) {
      const map = new Map();
      cached.teams.forEach((team) => {
        const labels = [team.id, team.slug, team.name, team.shortName];
        if (Array.isArray(team.aliases)) labels.push(...team.aliases);
        labels.filter(Boolean).forEach((label) => {
          map.set(normalizeKey(label), team);
        });
      });
      matchesCache.set(cacheKey, map);
      return map;
    }
    return new Map();
  }
  const response = await fetch(config.teamsUrl);
  if (!response.ok) return new Map();
  const teams = await response.json();
  const map = new Map();
  teams.forEach((team) => {
    const labels = [team.id, team.slug, team.name, team.shortName];
    if (Array.isArray(team.aliases)) labels.push(...team.aliases);
    labels.filter(Boolean).forEach((label) => {
      map.set(normalizeKey(label), team);
    });
  });
  matchesCache.set(cacheKey, map);
  return map;
};

const STANDINGS_URLS = {
  premier: PREMIER_STANDINGS_URL,
  seriea: SERIEA_STANDINGS_URL,
  laliga: LALIGA_STANDINGS_URL,
  bundesliga: BUNDESLIGA_STANDINGS_URL,
  ligue1: LIGUE1_STANDINGS_URL,
  ucl: UCL_STANDINGS_URL
};

const loadStandings = async (leagueKey) => {
  const cacheKey = `standings:${leagueKey}`;
  if (standingsCache.has(cacheKey)) return standingsCache.get(cacheKey);
  const url = STANDINGS_URLS[leagueKey];
  if (!url) return [];
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    standingsCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.warn('Unable to load standings', error);
    return [];
  }
};

const loadTeamsList = async (leagueKey) => {
  const cacheKey = `teams-list:${leagueKey}`;
  if (teamsListCache.has(cacheKey)) return teamsListCache.get(cacheKey);
  const config = getLeagueConfig(leagueKey);
  if (!config?.teamsUrl) {
    const cached = leagueCache.get(leagueKey);
    return cached?.teams || [];
  }
  try {
    const response = await fetch(config.teamsUrl);
    if (!response.ok) return [];
    const data = await response.json();
    teamsListCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.warn('Unable to load teams list', error);
    return [];
  }
};

const resolveOpponentName = (teamId, teamsById, fallback) => {
  if (teamsById?.has?.(teamId)) {
    const team = teamsById.get(teamId);
    return team.shortName || team.name || fallback;
  }
  return fallback;
};

const getLogoForTeam = (team, leagueKey) => {
  if (!team) return null;
  const config = getLeagueConfig(leagueKey);
  if (leagueKey === 'worldcup') {
    return getFlagUrl(team.name || team.shortName || team.id);
  }
  if (leagueKey === 'conference') {
    const conferenceLogo = getConferenceLogo(team.name || team.shortName || team.id, team.id);
    if (conferenceLogo) return conferenceLogo;
  }
  const directLogo = config?.teamLogos?.[team.id] || null;
  if (directLogo) return directLogo;
  const globalLogo = GLOBAL_TEAM_LOGOS_BY_KEY[normalizeKey(team.name || team.shortName || team.id)];
  if (globalLogo) return globalLogo;
  return null;
};

export const getLogoByName = async (leagueKey, name) => {
  const lookup = await buildTeamLookup(leagueKey);
  const team = lookup.get(normalizeKey(name));
  if (team) return getLogoForTeam(team, leagueKey);
  if (leagueKey === 'worldcup') return getFlagUrl(name);
  if (leagueKey === 'conference') {
    const conferenceLogo = getConferenceLogo(name, name);
    if (conferenceLogo) return conferenceLogo;
  }
  return GLOBAL_TEAM_LOGOS_BY_KEY[normalizeKey(name)] || null;
};

const buildLeagueFixtures = async (team, leagueKey) => {
  const config = getLeagueConfig(leagueKey);
  if (!config?.matchesUrl) return [];
  const matches = await fetchJsonCached(config.matchesUrl);
  const teams = state.teams;
  const teamsById = new Map(teams.map((t) => [t.id, t]));
  return matches
    .filter((match) => match.homeTeamId === team.id || match.awayTeamId === team.id)
    .map((match) => {
      const isHome = match.homeTeamId === team.id;
      const opponentId = isHome ? match.awayTeamId : match.homeTeamId;
      const opponent = teamsById.get(opponentId);
      const teamScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;
      return {
        competition: config.competitionLabel,
        competitionId: config.competitionId,
        competitionLogo: COMPETITION_LOGOS[leagueKey] || null,
        matchDate: match.matchDate,
        status: match.status,
        teamScore,
        opponentScore,
        homeTeam: resolveOpponentName(match.homeTeamId, teamsById, ''),
        awayTeam: resolveOpponentName(match.awayTeamId, teamsById, ''),
        opponentLogo: getLogoForTeam(opponent, leagueKey),
        opponentName: opponent?.name || opponent?.shortName || ''
      };
    });
};

const buildUclFixtures = async (team) => {
  const nameSet = buildTeamNameSet(team);
  const matches = await fetchJsonCached(UCL_MATCHES_URL);
  const uclTeams = await buildTeamLookup('ucl');
  const list = [];
  matches.forEach((match) => {
    const homeTeam = uclTeams.get(normalizeKey(match.homeTeamId));
    const awayTeam = uclTeams.get(normalizeKey(match.awayTeamId));
    const homeName = homeTeam?.name || match.homeTeamId;
    const awayName = awayTeam?.name || match.awayTeamId;
    if (!nameSet.has(normalizeKey(homeName)) && !nameSet.has(normalizeKey(awayName))) return;
    const isHome = nameSet.has(normalizeKey(homeName));
    const teamScore = isHome ? match.homeScore : match.awayScore;
    const opponentScore = isHome ? match.awayScore : match.homeScore;
    list.push({
      competition: 'Champions League',
      competitionId: 'champions-league-2025-2026',
      competitionLogo: COMPETITION_LOGOS.ucl,
      matchDate: match.matchDate,
      status: match.status,
      teamScore,
      opponentScore,
      homeTeam: homeName,
      awayTeam: awayName,
      opponentName: isHome ? awayName : homeName,
      opponentLogo: isHome
        ? uclTeams.get(normalizeKey(awayName)) && getLogoForTeam(uclTeams.get(normalizeKey(awayName)), 'ucl')
        : uclTeams.get(normalizeKey(homeName)) && getLogoForTeam(uclTeams.get(normalizeKey(homeName)), 'ucl')
    });
  });
  return list;
};

const buildCupFixtures = async (team, cupName, cupUrl, competitionLabel, competitionLogo) => {
  const rows = await fetchCupCsvCached(cupUrl);
  const nameSet = buildTeamNameSet(team);
  const fixtures = [];
  for (const row of rows) {
    const home = row['Home Team'] || row.Home || row.home || '';
    const away = row['Away Team'] || row.Away || row.away || '';
    if (!home || !away) continue;
    const homeKey = normalizeKey(home);
    const awayKey = normalizeKey(away);
    if (!nameSet.has(homeKey) && !nameSet.has(awayKey)) continue;
    const homeScoreRaw = row['Home Score'] || row['HomeScore'] || row.HomeScore || row.homeScore || '';
    const awayScoreRaw = row['Away Score'] || row['AwayScore'] || row.AwayScore || row.awayScore || '';
    const homeScore = homeScoreRaw === '' ? null : Number(homeScoreRaw);
    const awayScore = awayScoreRaw === '' ? null : Number(awayScoreRaw);
    const isHome = nameSet.has(homeKey);
    fixtures.push({
      competition: competitionLabel,
      competitionId: cupName,
      competitionLogo,
      round: row.Round || row.round || row.Stage || row.stage || '',
      matchDate: row.Date || row.date || '',
      status: homeScoreRaw !== '' || awayScoreRaw !== '' ? 'completed' : 'scheduled',
      teamScore: isHome ? homeScore : awayScore,
      opponentScore: isHome ? awayScore : homeScore,
      homeTeam: home,
      awayTeam: away,
      opponentName: isHome ? away : home,
      opponentLogo: await getLogoByName(state.activeLeague, isHome ? away : home)
    });
  }
  return fixtures;
};

const buildTeamFixtures = async (team, leagueKey) => {
  const cacheKey = `${leagueKey}:${team.id}`;
  if (fixturesCache.has(cacheKey)) return fixturesCache.get(cacheKey);
  const fixtures = [];
  try {
    const config = getLeagueConfig(leagueKey);
    if (config?.matchesFormat === 'csv') {
      fixtures.push(...(await buildCsvFixtures(team, leagueKey)));
    } else {
      fixtures.push(...(await buildLeagueFixtures(team, leagueKey)));
    }
  } catch (error) {
    console.warn('League fixtures unavailable', error);
  }
  if (leagueKey !== 'ucl') {
    try {
      fixtures.push(...(await buildUclFixtures(team)));
    } catch (error) {
      console.warn('UCL fixtures unavailable', error);
    }
  }
  if (leagueKey === 'premier') {
    try {
      fixtures.push(
        ...(await buildCupFixtures(
          team,
          'fa-cup-2025-2026',
          FACUP_MATCHES_URL,
          'FA Cup',
          '../images/comp-logos/facup.png'
        ))
      );
      fixtures.push(
        ...(await buildCupFixtures(
          team,
          'carabao-cup-2025-2026',
          CARABAO_MATCHES_URL,
          'Carabao Cup',
          '../images/comp-logos/carabao-cup-crest.svg'
        ))
      );
    } catch (error) {
      console.warn('Cup fixtures unavailable', error);
    }
  }

  const fullList = fixtures
    .map((fixture) => {
      const dateObj = toDateSafe(fixture.matchDate);
      return { ...fixture, dateObj };
    })
    .sort((a, b) => {
      if (!a.dateObj && !b.dateObj) return 0;
      if (!a.dateObj) return 1;
      if (!b.dateObj) return -1;
      return a.dateObj - b.dateObj;
    });

  fixturesCache.set(cacheKey, fullList);
  return fullList;
};

const buildRosterFromCsv = (rows, entry, leagueKey, teamId) => {
  const photos = entry?.photos || [];
  const photoLookup = buildPhotoNameLookup(photos);
  if (entry) entry.photoLookup = photoLookup;
  const firstCounts = new Map();
  const lastCounts = new Map();
  rows.forEach((row) => {
    const name = row['Player Name'] || row.Player || row.Name || '';
    if (!name) return;
    const { first, last } = getNameParts(name);
    const firstKey = normalizeKey(first);
    const lastKey = normalizeKey(last);
    if (firstKey) firstCounts.set(firstKey, (firstCounts.get(firstKey) || 0) + 1);
    if (lastKey) lastCounts.set(lastKey, (lastCounts.get(lastKey) || 0) + 1);
  });
  const nameHints = { firstCounts, lastCounts, photoLookup };
  const roster = [];
  rows.forEach((row, index) => {
    const name = row['Player Name'] || row.Player || row.Name || '';
    if (!name) return;
    roster.push({
      name,
      position: row.Position || row.Pos || '',
      number: row['Squad Number'] || row.Number || '',
      nationality: row.Nationality || '',
      age: row.Age || '',
      appearances: row.Appearances || '',
      goals: row.Goals || '',
      assists: row.Assists || '',
      minutes: row['Minutes Played'] || row.Minutes || '',
      cleanSheets: row['Clean Sheets'] || '',
      yellow: row['Yellow Cards'] || '',
      red: row['Red Cards'] || '',
      homeGrown: row['Home Grown'] || row['Homegrown'] || '',
      notes: row.Notes || '',
      photo: resolvePlayerPhoto(name, entry, index, leagueKey, teamId, nameHints)
    });
  });
  return roster;
};

const buildRosterFromPlayerList = (players, entry, leagueKey, teamId) => {
  const photos = entry?.photos || [];
  const photoLookup = buildPhotoNameLookup(photos);
  if (entry) entry.photoLookup = photoLookup;
  const firstCounts = new Map();
  const lastCounts = new Map();

  players.forEach((player) => {
    const name = player?.name || '';
    if (!name) return;
    const { first, last } = getNameParts(name);
    const firstKey = normalizeKey(first);
    const lastKey = normalizeKey(last);
    if (firstKey) firstCounts.set(firstKey, (firstCounts.get(firstKey) || 0) + 1);
    if (lastKey) lastCounts.set(lastKey, (lastCounts.get(lastKey) || 0) + 1);
  });

  const nameHints = { firstCounts, lastCounts, photoLookup };

  return players.map((player, index) => ({
    name: player.name,
    position: player.position,
    number: '',
    nationality: player.nationality || '',
    age: '',
    appearances: '',
    goals: '',
    assists: '',
    minutes: '',
    cleanSheets: '',
    yellow: '',
    red: '',
    homeGrown: '',
    notes: '',
    photo: resolvePlayerPhoto(player.name, entry, index, leagueKey, teamId, nameHints)
  }));
};

export const loadRosterForTeam = async (team, leagueKey) => {
  const cacheKey = `${leagueKey}:${team.id}`;
  if (rosterCache.has(cacheKey)) return rosterCache.get(cacheKey);

  await loadPlayersInfoIndex();
  const entry = getPlayersInfoEntry(leagueKey, team.id);
  if (entry?.csv) {
    try {
      const response = await fetch(entry.csv);
      if (response.ok) {
        const text = await response.text();
        const rows = parsePlayersCsv(text);
        const roster = buildRosterFromCsv(rows, entry, leagueKey, team.id);
        rosterCache.set(cacheKey, roster);
        return roster;
      }
    } catch (error) {
      console.warn('Failed to load player CSV', error);
    }
  }

  const fallbackPlayers = state.players.filter((player) => playerBelongsToTeam(player, team));
  const fallback = fallbackPlayers.length
    ? buildRosterFromPlayerList(fallbackPlayers, entry, leagueKey, team.id)
    : buildRosterFromPhotoList(entry);
  rosterCache.set(cacheKey, fallback);
  return fallback;
};

const splitTeamName = (name = '') => {
  const clean = String(name).trim();
  if (!clean) return { left: '', right: '' };
  const parts = clean.split(' ');
  if (parts.length > 1) {
    return { left: parts.slice(0, -1).join(' '), right: parts.slice(-1).join(' ') };
  }
  const mid = Math.floor(clean.length / 2);
  return { left: clean.slice(0, mid), right: clean.slice(mid) };
};

const formatFixtureTime = (dateObj) => {
  if (!dateObj) return 'TBD';
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(dateObj);
};

const formatFixtureDate = (dateObj) => {
  if (!dateObj) return 'TBD';
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }).format(dateObj);
};

const buildLogo = (team) => {
  const leagueKey = state.activeLeague;
  const logoSrc = getLogoForTeam(team, leagueKey);
  if (!logoSrc) return null;
  const logo = document.createElement('img');
  logo.src = logoSrc;
  logo.alt = team.shortName || team.name || team.id;
  return logo;
};

const getInitials = (name = '') => {
  const parts = String(name).trim().split(/\s+/);
  if (!parts.length) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getFlagUrl = (nationality) => {
  const key = normalizeKey(nationality);
  if (!key) return null;
  if (FLAG_URLS[key]) return FLAG_URLS[key];
  if (key === 'ivorycoast' || key === 'cotedivoire') return FLAG_URLS.ivorycoast;
  return null;
};

const createTextElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
};

const buildSquadCardElement = (player) => {
  const number = player.number ? String(player.number) : '';
  const stats = [
    player.appearances ? `APP ${player.appearances}` : null,
    player.goals ? `G ${player.goals}` : null,
    player.assists ? `A ${player.assists}` : null
  ].filter(Boolean);
  const flagUrl = getFlagUrl(player.nationality);
  const card = createTextElement('article', 'squad-card');
  const photo = createTextElement('div', 'squad-photo');
  if (player.photo) {
    const image = document.createElement('img');
    image.src = player.photo;
    image.alt = player.name || '';
    image.loading = 'lazy';
    image.decoding = 'async';
    photo.appendChild(image);
  } else {
    photo.appendChild(createTextElement('span', 'squad-photo-fallback', getInitials(player.name)));
  }

  const info = createTextElement('div', 'squad-info');
  info.appendChild(createTextElement('div', 'squad-name', player.name || '-'));

  const meta = createTextElement('div', 'squad-meta');
  if (flagUrl) {
    const flag = document.createElement('img');
    flag.className = 'squad-flag';
    flag.src = flagUrl;
    flag.alt = player.nationality || '';
    meta.appendChild(flag);
  }
  meta.appendChild(createTextElement('span', '', player.nationality || '-'));
  meta.appendChild(createTextElement('span', '', player.position || '-'));
  info.appendChild(meta);

  if (stats.length) {
    const statsWrap = createTextElement('div', 'squad-stats');
    stats.forEach((stat) => statsWrap.appendChild(createTextElement('span', '', stat)));
    info.appendChild(statsWrap);
  }

  card.append(photo, info);
  if (number) {
    card.appendChild(createTextElement('div', 'squad-number', number));
  }
  return card;
};

const buildSquadColumnElement = (title, players) => {
  const column = createTextElement('div', 'squad-column');
  column.appendChild(createTextElement('div', 'squad-column-title', title));
  const list = createTextElement('div', 'squad-list');
  if (players.length) {
    players.forEach((player) => list.appendChild(buildSquadCardElement(player)));
  } else {
    list.appendChild(createTextElement('div', 'squad-empty', 'No players'));
  }
  column.appendChild(list);
  return column;
};

const buildFixtureCardElement = (fixture, team, index = 0) => {
  const dateObj = fixture.dateObj || toDateSafe(fixture.matchDate);
  const timeText = formatFixtureTime(dateObj);
  const dateText = formatFixtureDate(dateObj);
  const opponent = fixture.opponentName || '';
  const opponentLogo = fixture.opponentLogo;
  const teamLogo = team ? getLogoForTeam(team, state.activeLeague) : null;
  const teamName = team?.shortName || team?.name || '';
  const isTottenham = (value) => normalizeString(value).includes('tottenham');
  const isOpponentTottenham = isTottenham(opponent);
  const isTeamTottenham = team?.id === 'tottenham-hotspur' || isTottenham(teamName);
  const makeAbbr = (value) => {
    const clean = normalizeString(value).replace(/[^a-z0-9 ]/g, '');
    if (!clean) return 'TBD';
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 3) return parts.slice(0, 3).map((p) => p[0]).join('').toUpperCase();
    if (parts.length === 2) {
      const combo = (parts[0][0] + parts[1][0] + parts[1][1]).toUpperCase();
      if (combo.length === 3) return combo;
      return (parts[0][0] + parts[1][0] + (parts[0][1] || '')).toUpperCase().slice(0, 3);
    }
    return clean.slice(0, 3).toUpperCase();
  };
  const opponentLabel = state.activeTab === 'fixtures' ? (opponent || 'TBD') : makeAbbr(opponent);
  const teamLabel = state.activeTab === 'fixtures' ? (teamName || 'TBD') : makeAbbr(teamName);
  const hasScore =
    Number.isFinite(fixture.opponentScore) && Number.isFinite(fixture.teamScore) && fixture.status === 'completed';
  const compKey = `${fixture.competitionId || ''} ${fixture.competition || ''}`.toLowerCase();
  const fixtureTone = compKey.includes('champions') || compKey.includes('ucl')
    ? 'cl'
    : compKey.includes('fa cup') || compKey.includes('fa-cup')
      ? 'fa'
      : 'league';
  const card = createTextElement('div', 'team-fixture-card');

  if (fixture.competitionLogo) {
    const compLogo = document.createElement('img');
    compLogo.className = 'fixture-comp-logo';
    compLogo.src = fixture.competitionLogo;
    compLogo.alt = fixture.competition || '';
    card.appendChild(compLogo);
  }

  const buildFixtureTeam = ({ logoSrc, darkLogo, altText, label, right = false }) => {
    const teamEl = createTextElement('div', `fixture-team${right ? ' right' : ''}`);
    if (logoSrc) {
      const img = document.createElement('img');
      img.src = logoSrc;
      img.alt = altText || '';
      if (darkLogo) img.classList.add('fixture-logo--dark');
      teamEl.appendChild(img);
    } else {
      teamEl.appendChild(createTextElement('span', 'fixture-logo-fallback', getInitials(altText)));
    }
    teamEl.appendChild(createTextElement('span', '', label));
    return teamEl;
  };

  card.appendChild(
    buildFixtureTeam({
      logoSrc: opponentLogo,
      darkLogo: isOpponentTottenham,
      altText: opponent,
      label: opponentLabel
    })
  );

  const vs = createTextElement('div', 'fixture-vs');
  if (hasScore) {
    const score = createTextElement('div', 'fixture-score');
    score.appendChild(createTextElement('span', '', String(fixture.opponentScore)));
    score.appendChild(createTextElement('span', 'score-dash', '-'));
    score.appendChild(createTextElement('span', '', String(fixture.teamScore)));
    vs.appendChild(score);
  } else {
    const vsImg = document.createElement('img');
    vsImg.src = VS_DESIGN_URL;
    vsImg.alt = 'VS';
    vs.appendChild(vsImg);
  }
  card.appendChild(vs);

  card.appendChild(
    buildFixtureTeam({
      logoSrc: teamLogo,
      darkLogo: isTeamTottenham,
      altText: teamName,
      label: teamLabel,
      right: true
    })
  );

  const time = createTextElement('div', `fixture-time fixture-time--${fixtureTone}`);
  time.appendChild(createTextElement('span', 'fixture-clock', timeText));
  time.appendChild(createTextElement('span', 'fixture-date', dateText));
  card.appendChild(time);

  return card;
};

const buildStandingsTableElement = (leagueKey, title, standings, teamsList, highlightId) => {
  if (!standings?.length) {
    return createTextElement('div', 'team-table-empty', 'Table data unavailable.');
  }
  const teamsById = new Map((teamsList || []).map((team) => [team.id, team]));
  const config = getLeagueConfig(leagueKey);
  const compLogo = COMPETITION_LOGOS[leagueKey];
  const card = createTextElement('div', 'team-table-card');
  const leagueClass = normalizeKey(leagueKey);
  if (leagueClass) card.classList.add(`league-${leagueClass}`);

  const titleEl = createTextElement('div', 'team-table-title');
  if (compLogo) {
    const img = document.createElement('img');
    img.src = compLogo;
    img.alt = title;
    titleEl.appendChild(img);
  }
  titleEl.appendChild(createTextElement('span', '', title));
  card.appendChild(titleEl);

  const table = createTextElement('div', 'team-table');
  const header = createTextElement('div', 'team-table-row header');
  [
    ['rank', '#'],
    ['team', 'Team'],
    ['', 'P'],
    ['', 'W'],
    ['', 'D'],
    ['', 'L'],
    ['', 'GF'],
    ['', 'GA'],
    ['', 'GD'],
    ['pts', 'Pts']
  ].forEach(([className, label]) => {
    header.appendChild(createTextElement('div', `team-table-cell${className ? ` ${className}` : ''}`, label));
  });
  table.appendChild(header);

  standings.forEach((row) => {
    const team = teamsById.get(row.teamId);
    const name = team?.shortName || team?.name || row.teamId;
    const logo = team ? getLogoForTeam(team, leagueKey) : config?.teamLogos?.[row.teamId];
    const isTeam = row.teamId === highlightId;
    const rowEl = createTextElement('div', `team-table-row${isTeam ? ' is-team' : ''}`);
    rowEl.appendChild(createTextElement('div', 'team-table-cell rank', row.rank ?? '-'));

    const teamCell = createTextElement('div', 'team-table-cell team');
    if (logo) {
      const img = document.createElement('img');
      img.src = logo;
      img.alt = name || '';
      teamCell.appendChild(img);
    } else {
      teamCell.appendChild(createTextElement('span', 'team-logo-fallback'));
    }
    teamCell.appendChild(createTextElement('span', '', name));
    rowEl.appendChild(teamCell);

    [
      row.matchesPlayed ?? '-',
      row.wins ?? '-',
      row.draws ?? '-',
      row.losses ?? '-',
      row.goalsFor ?? '-',
      row.goalsAgainst ?? '-',
      row.goalDifference ?? '-'
    ].forEach((value) => rowEl.appendChild(createTextElement('div', 'team-table-cell', value)));
    rowEl.appendChild(createTextElement('div', 'team-table-cell pts', row.points ?? '-'));
    table.appendChild(rowEl);
  });

  card.appendChild(table);
  return card;
};

const getCupRoundLabel = (fixtures, competitionLabel) => {
  const list = (fixtures || []).filter(
    (fixture) => normalizeString(fixture.competition) === normalizeString(competitionLabel)
  );
  if (!list.length) return null;
  const sorted = [...list].sort((a, b) => {
    if (!a.dateObj && !b.dateObj) return 0;
    if (!a.dateObj) return 1;
    if (!b.dateObj) return -1;
    return a.dateObj - b.dateObj;
  });
  const latest = sorted[sorted.length - 1];
  return latest.round || latest.stage || latest.competition || null;
};

const renderTeamProfile = (playersGrid) => {
  playersGrid.innerHTML = '';
  const team = state.teams.find((item) => item.id === state.activeTeamId);
  if (!team) {
    const empty = document.createElement('div');
    empty.className = 'players-empty';
    empty.textContent = 'Select a team to view the squad';
    playersGrid.appendChild(empty);
    return;
  }

  const fullName = team.name || team.shortName || '';
  const { left, right } = splitTeamName(fullName);
  const isLongName = fullName.length >= 15 || fullName.split(' ').length >= 3;
  const logo = buildLogo(team);

  const roster = state.roster || [];
  const filteredRoster = roster.filter((player) =>
    normalizeString(player.name).includes(state.searchTerm)
  );
  const groups = {
    Forwards: [],
    Midfielders: [],
    Defenders: [],
    Goalkeepers: [],
    Other: []
  };
  filteredRoster.forEach((player) => {
    const group = positionGroupFor(player.position);
    if (!groups[group]) groups.Other.push(player);
    else groups[group].push(player);
  });

  const squadColumns = [
    buildSquadColumnElement('Forwards', groups.Forwards),
    buildSquadColumnElement('Midfield', groups.Midfielders),
    buildSquadColumnElement('Defense', groups.Defenders),
    buildSquadColumnElement('Goalkeepers', groups.Goalkeepers)
  ];

  const cutoff = getFixtureCutoffDate();
  const upcomingFixtures = (state.fixtures || []).filter(
    (fixture) => !fixture.dateObj || fixture.dateObj >= cutoff
  );
  const fixtureLimit = state.fixtureVisibleCount || 10;
  const fixturesToShow = state.activeTab === 'fixtures'
    ? state.fixtures || []
    : upcomingFixtures.slice(0, fixtureLimit);
  const fixtureNodes = fixturesToShow.length
    ? fixturesToShow.map((fixture, index) => buildFixtureCardElement(fixture, team, index))
    : [createTextElement('div', 'squad-empty', 'Fixtures loading...')];

  const tabConfig = [
    { key: 'squad', label: 'Squad' },
    { key: 'fixtures', label: 'Fixtures' },
    { key: 'history', label: 'History' },
    { key: 'news', label: 'News' },
    { key: 'table', label: 'Table' }
  ];

  const buildTrophyCabinetElement = () => {
    if (team.id !== 'liverpool') {
      return createTextElement('div', 'trophy-empty', 'Trophy cabinet coming soon.');
    }
    const cabinet = createTextElement('div', 'trophy-cabinet');
    const trophyCards = [
      { title: 'FA CUP', image: TROPHY_IMAGES.faCup, alt: 'FA Cup', count: '8' },
      {
        title: 'COMMUNITY SHIELD',
        image: TROPHY_IMAGES.communityShield,
        alt: 'Community Shield',
        count: '16'
      },
      { title: 'UEFA SUPERCUP', image: TROPHY_IMAGES.uefaSupercup, alt: 'UEFA Supercup', count: '4' },
      { title: 'CARABAO CUP', image: TROPHY_IMAGES.carabaoCup, alt: 'Carabao Cup', count: '10' },
      {
        title: 'CHAMPIONS LEAGUE',
        image: TROPHY_IMAGES.championsLeague,
        alt: 'Champions League',
        count: '6'
      },
      { title: 'CLUB WORLD CUP', image: TROPHY_IMAGES.clubWorldCup, alt: 'Club World Cup', count: '1' },
      {
        title: 'CONFERENCE LEAGUE',
        image: TROPHY_IMAGES.conferenceLeague,
        alt: 'Conference League',
        count: '4'
      }
    ];

    trophyCards.forEach((entry) => {
      const card = createTextElement('div', 'trophy-card');
      card.appendChild(createTextElement('div', 'trophy-title', entry.title));
      const img = document.createElement('img');
      img.src = entry.image;
      img.alt = entry.alt;
      card.appendChild(img);
      card.appendChild(createTextElement('div', 'trophy-count', entry.count));
      cabinet.appendChild(card);
    });

    const premier = createTextElement('div', 'trophy-card');
    premier.appendChild(createTextElement('div', 'trophy-title', 'PREMIER LEAGUE'));
    const duo = createTextElement('div', 'trophy-duo');
    [
      [TROPHY_IMAGES.premierLeague, 'Premier League'],
      [TROPHY_IMAGES.premierLeagueOld, 'Premier League (Old)']
    ].forEach(([src, alt]) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      duo.appendChild(img);
    });
    premier.appendChild(duo);
    premier.appendChild(createTextElement('div', 'trophy-count trophy-count-premier', '20'));
    cabinet.insertBefore(premier, cabinet.children[3] || null);

    return cabinet;
  };

  const teamProfile = createTextElement('div', 'team-profile');
  if (isLongName) teamProfile.classList.add('long-name');
  if (state.activeTab === 'fixtures') teamProfile.classList.add('fixtures-view');
  if (state.activeTab === 'history') teamProfile.classList.add('history-view');
  if (state.activeTab === 'table') teamProfile.classList.add('table-view');
  teamProfile.dataset.teamId = team.id;
  teamProfile.dataset.activeTab = state.activeTab;

  const hero = createTextElement('div', 'team-hero');
  const exitButton = createTextElement('button', 'team-exit', 'Exit');
  exitButton.type = 'button';
  exitButton.dataset.action = 'exit-team-profile';
  hero.appendChild(exitButton);

  const heroInner = createTextElement('div', 'team-hero-inner');
  const heroTitle = createTextElement('div', 'team-hero-title');
  heroTitle.appendChild(createTextElement('span', 'team-hero-word', left));
  if (logo) {
    const logoWrap = createTextElement('span', 'team-hero-logo');
    logoWrap.appendChild(logo);
    heroTitle.appendChild(logoWrap);
  }
  heroTitle.appendChild(createTextElement('span', 'team-hero-word', right));
  heroInner.appendChild(heroTitle);
  hero.appendChild(heroInner);
  teamProfile.appendChild(hero);

  const tabs = createTextElement('div', 'team-tabs');
  tabConfig.forEach((tab) => {
    const button = createTextElement('button', `team-tab${state.activeTab === tab.key ? ' active' : ''}`, tab.label);
    button.type = 'button';
    button.dataset.tab = tab.key;
    tabs.appendChild(button);
  });
  teamProfile.appendChild(tabs);

  const appendFixtureList = (container) => {
    fixtureNodes.forEach((node) => container.appendChild(node));
  };

  if (state.activeTab === 'fixtures') {
    const body = createTextElement('div', 'team-body fixtures-only');
    const fixtures = createTextElement('div', 'team-fixtures');
    fixtures.appendChild(createTextElement('div', 'team-fixtures-title', 'Fixtures 25/26'));
    const list = createTextElement('div', 'team-fixtures-list');
    appendFixtureList(list);
    fixtures.appendChild(list);
    body.appendChild(fixtures);
    teamProfile.appendChild(body);
  } else if (state.activeTab === 'history') {
    const body = createTextElement('div', 'team-body history-only');
    body.appendChild(buildTrophyCabinetElement());
    teamProfile.appendChild(body);
  } else if (state.activeTab === 'table') {
    const leagueStandings = state.standings?.[state.activeLeague] || [];
    const leagueTable = buildStandingsTableElement(
      state.activeLeague,
      getLeagueConfig(state.activeLeague)?.competitionLabel || 'League Table',
      leagueStandings,
      state.teams,
      team.id
    );
    const uclInFixtures = (state.fixtures || []).some((fixture) =>
      normalizeString(fixture.competition).includes('champions')
    );
    const uclStandings = state.standings?.ucl || [];
    const uclTable = uclInFixtures
      ? buildStandingsTableElement(
          'ucl',
          'Champions League',
          uclStandings,
          state.leagueTeams?.ucl || [],
          team.id
        )
      : null;
    const faRound = getCupRoundLabel(state.fixtures, 'FA Cup');

    const body = createTextElement('div', 'team-body table-only');
    const tables = createTextElement('div', `team-tables${uclTable ? '' : ' single'}`);
    const leftColumn = createTextElement('div', 'team-table-col');
    leftColumn.appendChild(leagueTable);
    if (faRound) {
      const cupCard = createTextElement('div', 'cup-round-card');
      cupCard.appendChild(createTextElement('div', 'cup-round-title', 'FA Cup'));
      cupCard.appendChild(createTextElement('div', 'cup-round-value', faRound));
      leftColumn.appendChild(cupCard);
    }
    tables.appendChild(leftColumn);
    if (uclTable) {
      const rightColumn = createTextElement('div', 'team-table-col');
      rightColumn.appendChild(uclTable);
      tables.appendChild(rightColumn);
    }
    body.appendChild(tables);
    teamProfile.appendChild(body);
  } else {
    const body = createTextElement('div', 'team-body');
    const squad = createTextElement('div', 'team-squad');
    squadColumns.forEach((column) => squad.appendChild(column));
    body.appendChild(squad);

    const fixtures = document.createElement('aside');
    fixtures.className = 'team-fixtures';
    fixtures.appendChild(createTextElement('div', 'team-fixtures-title', 'Fixtures'));
    const list = createTextElement('div', 'team-fixtures-list');
    appendFixtureList(list);
    if (state.activeTab !== 'fixtures' && upcomingFixtures.length > fixtureLimit) {
      const showMore = createTextElement('button', 'fixtures-show-more', 'Show More');
      showMore.type = 'button';
      showMore.dataset.action = 'fixtures-show-more';
      list.appendChild(showMore);
    }
    fixtures.appendChild(list);
    body.appendChild(fixtures);
    teamProfile.appendChild(body);
  }

  playersGrid.replaceChildren(teamProfile);
};

const buildTeamPill = (team, onSelect) => {
  const pill = document.createElement('button');
  pill.type = 'button';
  pill.className = 'team-pill';
  pill.dataset.teamId = team.id;
  const leagueKey = state.activeLeague;
  const cachedPair = getCachedPair(leagueKey, team.id);
  setTeamPillStyle(pill, cachedPair);
  ensureColorPair(leagueKey, team.id).then((pair) => {
    if (state.activeLeague !== leagueKey) return;
    setTeamPillStyle(pill, pair);
  });
  const displayName = team.shortName || team.name || team.id;
  const isLongName = displayName.length >= 15 || displayName.split(' ').length >= 3;
  if (isLongName) pill.classList.add('is-long');
  const title = document.createElement('div');
  title.className = 'team-pill-title';
  const logo = buildLogo(team);
  const logoWrap = document.createElement('span');
  logoWrap.className = 'team-pill-logo';
  if (logo) logoWrap.appendChild(logo);
  if (leagueKey === 'worldcup') {
    pill.classList.add('is-worldcup');
    const nameSpan = document.createElement('span');
    nameSpan.className = 'team-pill-word';
    nameSpan.textContent = displayName;
    title.append(logoWrap, nameSpan);
  } else {
    const { left, right } = splitTeamName(displayName);
    const leftSpan = document.createElement('span');
    leftSpan.className = 'team-pill-word';
    leftSpan.textContent = left;
    const rightSpan = document.createElement('span');
    rightSpan.className = 'team-pill-word';
    rightSpan.textContent = right;
    title.append(leftSpan, logoWrap, rightSpan);
  }
  pill.appendChild(title);
  pill.addEventListener('click', () => onSelect(team.id));
  return pill;
};

const updateActivePill = (teamRow) => {
  teamRow.querySelectorAll('.team-pill').forEach((pill) => {
    const isActive = pill.dataset.teamId === state.activeTeamId;
    pill.classList.toggle('is-active', isActive);
    pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
};

const buildGroupHeader = (label) => {
  const header = document.createElement('div');
  header.className = 'players-group';
  header.textContent = label;
  return header;
};

const buildPlayerCard = (player) => {
  const row = document.createElement('div');
  row.className = 'player-card';
  const name = document.createElement('span');
  name.className = 'player-card-name';
  name.textContent = player.name;
  const meta = document.createElement('div');
  meta.className = 'player-card-meta';
  const position = document.createElement('span');
  position.textContent = player.position || '-';
  const nationality = document.createElement('span');
  nationality.textContent = player.nationality || '-';
  meta.append(position, nationality);
  row.append(name, meta);

  return row;
};

const sortPlayers = (a, b) => {
  const posA = POSITION_ORDER[a.position] ?? 9;
  const posB = POSITION_ORDER[b.position] ?? 9;
  if (posA !== posB) return posA - posB;
  return a.name.localeCompare(b.name);
};

const renderPlayers = (playersGrid) => {
  renderTeamProfile(playersGrid);
};

const showTeamLanding = (playersGrid) => {
  playersGrid.innerHTML = '<div class="players-empty">Select a team to view the squad</div>';
};

const resolveRequestedTeamId = (teams = [], ...requestedValues) => {
  const normalizedValues = requestedValues
    .flat()
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .map((value) => normalizeKey(value))
    .filter(Boolean);

  if (!normalizedValues.length) return null;

  const match = teams.find((team) => {
    const aliases = [team?.id, team?.name, team?.shortName, ...(Array.isArray(team?.aliases) ? team.aliases : [])]
      .map((value) => normalizeKey(value || ''))
      .filter(Boolean);
    return normalizedValues.some((value) => aliases.includes(value));
  });

  return match?.id || null;
};

const loadTeamProfile = async (teamId, teamRow, playersGrid, panel) => {
  if (!teamId) return;
  state.activeTeamId = teamId;
  updateActivePill(teamRow);
  applyTeamTheme(panel, teamId);
  const team = state.teams.find((item) => item.id === teamId);
  if (!team) return;

  const profileKey = `${state.activeLeague}:${teamId}:${Date.now()}`;
  state.profileKey = profileKey;
  playersGrid.innerHTML = '<div class="players-empty">Loading team...</div>';
  document.querySelector('#players-view')?.classList.add('is-profile');

  try {
    const [roster, fixtures, leagueStandings, uclStandings, uclTeams] = await Promise.all([
      loadRosterForTeam(team, state.activeLeague),
      buildTeamFixtures(team, state.activeLeague),
      loadStandings(state.activeLeague),
      loadStandings('ucl'),
      loadTeamsList('ucl')
    ]);
    if (state.profileKey !== profileKey) return;
    state.roster = roster;
    state.fixtures = fixtures;
    state.standings = { ...state.standings, [state.activeLeague]: leagueStandings, ucl: uclStandings };
    state.leagueTeams = { ...state.leagueTeams, ucl: uclTeams };
    state.fixtureVisibleCount = 10;
    state.activeTab = 'squad';
    if (
      requestedPlayerFromPage &&
      requestedLeagueFromPage === state.activeLeague &&
      String(requestedTeamFromPage || '') === String(teamId)
    ) {
      state.searchTerm = normalizeString(requestedPlayerFromPage);
    }
    renderPlayers(playersGrid);
  } catch (error) {
    console.warn('Unable to load team profile', error);
    playersGrid.innerHTML = '<div class="players-empty">Team data unavailable</div>';
  }
};

const exitTeamProfile = (teamRow, playersGrid) => {
  state.activeTeamId = null;
  state.roster = [];
  state.fixtures = [];
  state.fixtureVisibleCount = 10;
  state.activeTab = 'squad';
  state.standings = {};
  state.leagueTeams = {};
  state.profileKey = null;
  updateActivePill(teamRow);
  document.querySelector('#players-view')?.classList.remove('is-profile');
  showTeamLanding(playersGrid);
};

const renderTeams = (teamRow, playersGrid, panel) => {
  teamRow.innerHTML = '';
  const fragment = document.createDocumentFragment();
  state.teams.forEach((team) => {
    fragment.appendChild(
      buildTeamPill(team, (teamId) => {
        loadTeamProfile(teamId, teamRow, playersGrid, panel);
      })
    );
  });
  teamRow.appendChild(fragment);
  updateActivePill(teamRow);
};

const hydratePlayers = (teamRow, playersGrid, panel, requestedTeamId = null, requestedTeamName = null) => {
  renderTeams(teamRow, playersGrid, panel);
  const teamIdToOpen =
    resolveRequestedTeamId(state.teams, requestedTeamId, requestedTeamName) || state.activeTeamId;
  if (teamIdToOpen) {
    loadTeamProfile(teamIdToOpen, teamRow, playersGrid, panel);
  } else {
    showTeamLanding(playersGrid);
  }
};

const loadLeagueData = async ({
  leagueKey,
  teamRow,
  playersGrid,
  panel,
  searchInput,
  requestedTeamId = null,
  requestedTeamName = null
}) => {
  const config = getLeagueConfig(leagueKey);
  if (!config) return;

  state.activeLeague = leagueKey;
  state.activeTeamId = null;
  state.searchTerm = '';
  state.roster = [];
  state.fixtures = [];
  state.standings = {};
  state.leagueTeams = {};
  state.profileKey = null;
  if (searchInput) searchInput.value = '';

  if (leagueCache.has(leagueKey)) {
    const cached = leagueCache.get(leagueKey);
    state.teams = cached.teams;
    state.players = cached.players;
    state.activeTeamId = null;
    document.querySelector('#players-view')?.classList.remove('is-profile');
    hydratePlayers(teamRow, playersGrid, panel, requestedTeamId, requestedTeamName);
    return;
  }

  try {
    let teams = [];
    if (config.teamsUrl) {
      const teamsResponse = await fetch(config.teamsUrl);
      if (!teamsResponse.ok) throw new Error('Failed to load teams');
      teams = await teamsResponse.json();
    } else if (config.matchesUrl) {
      teams = await buildTeamsFromCsv(leagueKey);
    }

    let players = [];
    try {
      if (config.playersUrl) {
        const playersResponse = await fetch(config.playersUrl);
        if (playersResponse.ok) {
          players = await playersResponse.json();
        }
      }
    } catch (error) {
      players = [];
    }

    state.teams = Array.isArray(teams) ? teams : [];
    state.players = Array.isArray(players)
      ? players.filter((player) => player.competitionId === config.competitionId)
      : [];

    leagueCache.set(leagueKey, { teams: state.teams, players: state.players });

    state.activeTeamId = null;
    document.querySelector('#players-view')?.classList.remove('is-profile');
    hydratePlayers(teamRow, playersGrid, panel, requestedTeamId, requestedTeamName);
  } catch (error) {
    console.warn('Unable to hydrate players for', leagueKey, error);
    playersGrid.innerHTML = '';
    const empty = document.createElement('div');
    empty.className = 'players-empty';
    empty.textContent = 'Players unavailable right now';
    playersGrid.appendChild(empty);
  }
};

export const initPlayers = () => {
  const teamRow = document.querySelector('#players-team-row');
  const playersGrid = document.querySelector('#players-grid');
  const searchInput = document.querySelector('#players-search-input');
  const panel = document.querySelector('.players-panel');
  const leagueTabs = document.querySelectorAll('.sidebar-item[data-league]');

  if (!teamRow || !playersGrid) return;

  loadPlayersInfoIndex();

  const handleSearch = (event) => {
    state.searchTerm = normalizeString(event.target.value);
    if (state.activeTeamId) {
      renderPlayers(playersGrid);
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  leagueTabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('.sidebar-slot-edit')) return;
      const leagueKey = tab.dataset.league;
      if (!leagueKey || !LEAGUE_CONFIGS[leagueKey]) return;
      loadLeagueData({ leagueKey, teamRow, playersGrid, panel, searchInput });
    });
  });

  playersGrid.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const exitBtn = target.closest('[data-action="exit-team-profile"]');
    if (exitBtn) {
      exitTeamProfile(teamRow, playersGrid);
      return;
    }
    const tabBtn = target.closest('.team-tab');
    if (tabBtn && tabBtn.dataset.tab) {
      state.activeTab = tabBtn.dataset.tab;
      renderPlayers(playersGrid);
      return;
    }
    const showMore = target.closest('[data-action="fixtures-show-more"]');
    if (showMore) {
      state.fixtureVisibleCount = Math.min(
        (state.fixtureVisibleCount || 10) + 10,
        state.fixtures?.length || 0
      );
      renderPlayers(playersGrid);
    }
  });

  const initialLeague =
    (requestedLeagueFromPage && LEAGUE_CONFIGS[requestedLeagueFromPage] && requestedLeagueFromPage) ||
    document.querySelector('.sidebar-item.active')?.dataset.league ||
    'premier';
  loadLeagueData({
    leagueKey: initialLeague,
    teamRow,
    playersGrid,
    panel,
    searchInput,
    requestedTeamId: initialLeague === requestedLeagueFromPage ? requestedTeamFromPage : null,
    requestedTeamName: initialLeague === requestedLeagueFromPage ? requestedTeamNameFromPage : null
  });
};
