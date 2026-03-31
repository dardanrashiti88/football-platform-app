import { showHome, isViewVisible } from '../core/views.js';
import { setStatsAccent } from './stats.js';

const PREMIER_STANDINGS_URL = new URL('../../../db-api/data/competitions/premier-league/standings.json', import.meta.url);
const PREMIER_TEAMS_URL = new URL('../../../db-api/data/competitions/premier-league/teams.json', import.meta.url);

const BUNDESLIGA_STANDINGS_URL = new URL('../../../db-api/data/competitions/bundesliga/standings.json', import.meta.url);
const BUNDESLIGA_TEAMS_URL = new URL('../../../db-api/data/competitions/bundesliga/teams.json', import.meta.url);

const SERIEA_STANDINGS_URL = new URL('../../../db-api/data/competitions/serie-a/standings.json', import.meta.url);
const SERIEA_TEAMS_URL = new URL('../../../db-api/data/competitions/serie-a/teams.json', import.meta.url);

const LALIGA_STANDINGS_URL = new URL('../../../db-api/data/competitions/la-liga/standings.json', import.meta.url);
const LALIGA_TEAMS_URL = new URL('../../../db-api/data/competitions/la-liga/teams.json', import.meta.url);

const LIGUE1_STANDINGS_URL = new URL('../../../db-api/data/competitions/ligue-1/standings.json', import.meta.url);
const LIGUE1_TEAMS_URL = new URL('../../../db-api/data/competitions/ligue-1/teams.json', import.meta.url);

const UCL_STANDINGS_URL = new URL('../../../db-api/data/competitions/champions-league/standings.json', import.meta.url);
const UCL_TEAMS_URL = new URL('../../../db-api/data/competitions/champions-league/teams.json', import.meta.url);

const PREMIER_HISTORY_BASE_URL = new URL('../../../db-api/history-data/premier-league-table-history/', import.meta.url);
const CHAMPIONSHIP_HISTORY_BASE_URL = new URL('../../../db-api/history-data/ELFchampionship-league-table-history/', import.meta.url);
const BUNDESLIGA_HISTORY_BASE_URL = new URL('../../../db-api/history-data/bundesliga-table-history/', import.meta.url);
const SERIEA_HISTORY_BASE_URL = new URL('../../../db-api/history-data/serieA-table-history/', import.meta.url);
const LALIGA_HISTORY_BASE_URL = new URL('../../../db-api/history-data/laliga-table-history/', import.meta.url);
const LIGUE1_HISTORY_BASE_URL = new URL('../../../db-api/history-data/ligue1-table-history/', import.meta.url);
const UCL_HISTORY_BASE_URL = new URL('../../../db-api/history-data/champions-league-table-history/', import.meta.url);
const EUROPA_HISTORY_BASE_URL = new URL('../../../db-api/history-data/europa-league-table-history/', import.meta.url);
const CONFERENCE_HISTORY_BASE_URL = new URL('../../../db-api/history-data/conference-league-table-history/', import.meta.url);
const WORLDCUP_GROUPS_URL = new URL('../../../db-api/history-data/worldcup-table-history/season-2026.csv', import.meta.url);

const PREMIER_TEAM_LOGOS = {
  'afc-bournemouth': new URL('../../../images/Teams-logos/Premier-league/bournemouth.svg', import.meta.url).href,
  arsenal: new URL('../../../images/Teams-logos/Premier-league/arsenal.svg', import.meta.url).href,
  'aston-villa': new URL('../../../images/Teams-logos/Premier-league/astonvilla.svg', import.meta.url).href,
  brentford: new URL('../../../images/Teams-logos/Premier-league/brentford.svg', import.meta.url).href,
  'brighton-and-hove-albion': new URL('../../../images/Teams-logos/Premier-league/brighton.svg', import.meta.url).href,
  burnley: new URL('../../../images/Teams-logos/Premier-league/burnley.svg', import.meta.url).href,
  chelsea: new URL('../../../images/Teams-logos/Premier-league/chelsea.svg', import.meta.url).href,
  'crystal-palace': new URL('../../../images/Teams-logos/Premier-league/crystalpalace.svg', import.meta.url).href,
  everton: new URL('../../../images/Teams-logos/Premier-league/everton.svg', import.meta.url).href,
  fulham: new URL('../../../images/Teams-logos/Premier-league/fulham.svg', import.meta.url).href,
  'leeds-united': new URL('../../../images/Teams-logos/Premier-league/leeds.svg', import.meta.url).href,
  liverpool: new URL('../../../images/Teams-logos/Premier-league/liverpool.svg', import.meta.url).href,
  'manchester-city': new URL('../../../images/Teams-logos/Premier-league/mancity.svg', import.meta.url).href,
  'manchester-united': new URL('../../../images/Teams-logos/Premier-league/Manu.svg', import.meta.url).href,
  'newcastle-united': new URL('../../../images/Teams-logos/Premier-league/newcastle.svg', import.meta.url).href,
  'nottingham-forest': new URL('../../../images/Teams-logos/Premier-league/forest.svg', import.meta.url).href,
  sunderland: new URL('../../../images/Teams-logos/Premier-league/sunderland.svg', import.meta.url).href,
  'tottenham-hotspur': new URL('../../../images/Teams-logos/Premier-league/tottenham.svg', import.meta.url).href,
  'west-ham-united': new URL('../../../images/Teams-logos/Premier-league/westham.svg', import.meta.url).href,
  'wolverhampton-wanderers': new URL('../../../images/Teams-logos/Premier-league/wolves.svg', import.meta.url).href
};

const CHAMPIONSHIP_TEAM_LOGOS = {
  birmingham: new URL('../../../images/Teams-logos/EFLchampionship/birmingham.png', import.meta.url).href,
  'birmingham-city': new URL('../../../images/Teams-logos/EFLchampionship/birmingham.png', import.meta.url).href,
  'birmingham-city-fc': new URL('../../../images/Teams-logos/EFLchampionship/birmingham.png', import.meta.url).href,
  blackburn: new URL('../../../images/Teams-logos/EFLchampionship/blackburn rovers.png', import.meta.url).href,
  'blackburn-rovers': new URL('../../../images/Teams-logos/EFLchampionship/blackburn rovers.png', import.meta.url)
    .href,
  'blackburn-rovers-fc': new URL('../../../images/Teams-logos/EFLchampionship/blackburn rovers.png', import.meta.url)
    .href,
  'bristol-city': new URL('../../../images/Teams-logos/EFLchampionship/bristolcity.png', import.meta.url).href,
  'bristol-city-fc': new URL('../../../images/Teams-logos/EFLchampionship/bristolcity.png', import.meta.url).href,
  charlton: new URL('../../../images/Teams-logos/EFLchampionship/charlton.png', import.meta.url).href,
  'charlton-athletic': new URL('../../../images/Teams-logos/EFLchampionship/charlton.png', import.meta.url).href,
  'charlton-athletic-fc': new URL('../../../images/Teams-logos/EFLchampionship/charlton.png', import.meta.url).href,
  coventry: new URL('../../../images/Teams-logos/EFLchampionship/coventry city.png', import.meta.url).href,
  'coventry-city': new URL('../../../images/Teams-logos/EFLchampionship/coventry city.png', import.meta.url).href,
  'coventry-city-fc': new URL('../../../images/Teams-logos/EFLchampionship/coventry city.png', import.meta.url).href,
  derby: new URL('../../../images/Teams-logos/EFLchampionship/derbycounty.png', import.meta.url).href,
  'derby-county': new URL('../../../images/Teams-logos/EFLchampionship/derbycounty.png', import.meta.url).href,
  'derby-county-fc': new URL('../../../images/Teams-logos/EFLchampionship/derbycounty.png', import.meta.url).href,
  hull: new URL('../../../images/Teams-logos/EFLchampionship/hullcity.png', import.meta.url).href,
  'hull-city': new URL('../../../images/Teams-logos/EFLchampionship/hullcity.png', import.meta.url).href,
  'hull-city-afc': new URL('../../../images/Teams-logos/EFLchampionship/hullcity.png', import.meta.url).href,
  ipswich: new URL('../../../images/Teams-logos/EFLchampionship/ipswichtown.png', import.meta.url).href,
  'ipswich-town': new URL('../../../images/Teams-logos/EFLchampionship/ipswichtown.png', import.meta.url).href,
  'ipswich-town-fc': new URL('../../../images/Teams-logos/EFLchampionship/ipswichtown.png', import.meta.url).href,
  leicester: new URL('../../../images/Teams-logos/EFLchampionship/leicestercity.png', import.meta.url).href,
  'leicester-city': new URL('../../../images/Teams-logos/EFLchampionship/leicestercity.png', import.meta.url).href,
  'leicester-city-fc': new URL('../../../images/Teams-logos/EFLchampionship/leicestercity.png', import.meta.url).href,
  middlesbrough: new URL('../../../images/Teams-logos/EFLchampionship/middlesbrough.png', import.meta.url).href,
  'middlesbrough-fc': new URL('../../../images/Teams-logos/EFLchampionship/middlesbrough.png', import.meta.url).href,
  millwall: new URL('../../../images/Teams-logos/EFLchampionship/millwall.png', import.meta.url).href,
  'millwall-fc': new URL('../../../images/Teams-logos/EFLchampionship/millwall.png', import.meta.url).href,
  'norwich-city': new URL('../../../images/Teams-logos/EFLchampionship/norwich.png', import.meta.url).href,
  'norwich-city-fc': new URL('../../../images/Teams-logos/EFLchampionship/norwich.png', import.meta.url).href,
  norwich: new URL('../../../images/Teams-logos/EFLchampionship/norwich.png', import.meta.url).href,
  oxford: new URL('../../../images/Teams-logos/EFLchampionship/oxfordunited.png', import.meta.url).href,
  'oxford-united': new URL('../../../images/Teams-logos/EFLchampionship/oxfordunited.png', import.meta.url).href,
  'oxford-united-fc': new URL('../../../images/Teams-logos/EFLchampionship/oxfordunited.png', import.meta.url).href,
  portsmouth: new URL('../../../images/Teams-logos/EFLchampionship/portsmouth.png', import.meta.url).href,
  'portsmouth-fc': new URL('../../../images/Teams-logos/EFLchampionship/portsmouth.png', import.meta.url).href,
  preston: new URL('../../../images/Teams-logos/EFLchampionship/prestonnorthend.png', import.meta.url).href,
  'preston-north-end': new URL('../../../images/Teams-logos/EFLchampionship/prestonnorthend.png', import.meta.url).href,
  'preston-north-end-fc': new URL('../../../images/Teams-logos/EFLchampionship/prestonnorthend.png', import.meta.url)
    .href,
  qpr: new URL('../../../images/Teams-logos/EFLchampionship/queenparkrangers.png', import.meta.url).href,
  'queens-park-rangers': new URL('../../../images/Teams-logos/EFLchampionship/queenparkrangers.png', import.meta.url)
    .href,
  'queens-park-rangers-fc': new URL('../../../images/Teams-logos/EFLchampionship/queenparkrangers.png', import.meta.url)
    .href,
  'sheffield-united': new URL('../../../images/Teams-logos/EFLchampionship/sheffieldunited.png', import.meta.url).href,
  'sheffield-united-fc': new URL('../../../images/Teams-logos/EFLchampionship/sheffieldunited.png', import.meta.url).href,
  'sheffield-weds': new URL('../../../images/Teams-logos/EFLchampionship/sheffieldwednesday.png', import.meta.url).href,
  'sheffield-wednesday': new URL('../../../images/Teams-logos/EFLchampionship/sheffieldwednesday.png', import.meta.url)
    .href,
  'sheffield-wednesday-fc': new URL('../../../images/Teams-logos/EFLchampionship/sheffieldwednesday.png', import.meta.url)
    .href,
  southampton: new URL('../../../images/Teams-logos/EFLchampionship/southampton.png', import.meta.url).href,
  'southampton-fc': new URL('../../../images/Teams-logos/EFLchampionship/southampton.png', import.meta.url).href,
  stoke: new URL('../../../images/Teams-logos/EFLchampionship/stroke.png', import.meta.url).href,
  'stoke-city': new URL('../../../images/Teams-logos/EFLchampionship/stroke.png', import.meta.url).href,
  'stoke-city-fc': new URL('../../../images/Teams-logos/EFLchampionship/stroke.png', import.meta.url).href,
  swansea: new URL('../../../images/Teams-logos/EFLchampionship/swanseacity.png', import.meta.url).href,
  'swansea-city': new URL('../../../images/Teams-logos/EFLchampionship/swanseacity.png', import.meta.url).href,
  'swansea-city-afc': new URL('../../../images/Teams-logos/EFLchampionship/swanseacity.png', import.meta.url).href,
  watford: new URL('../../../images/Teams-logos/EFLchampionship/watford.png', import.meta.url).href,
  'watford-fc': new URL('../../../images/Teams-logos/EFLchampionship/watford.png', import.meta.url).href,
  'west-brom': new URL('../../../images/Teams-logos/EFLchampionship/westbromwich albion.png', import.meta.url).href,
  'west-bromwich-albion': new URL('../../../images/Teams-logos/EFLchampionship/westbromwich albion.png', import.meta.url)
    .href,
  'west-bromwich-albion-fc': new URL(
    '../../../images/Teams-logos/EFLchampionship/westbromwich albion.png',
    import.meta.url
  ).href,
  wrexham: new URL('../../../images/Teams-logos/EFLchampionship/wrexham.png', import.meta.url).href,
  'wrexham-afc': new URL('../../../images/Teams-logos/EFLchampionship/wrexham.png', import.meta.url).href
};

const BUNDESLIGA_TEAM_LOGOS = {
  augsburg: new URL('../../../images/Teams-logos/bundesliga/augsburg.svg', import.meta.url).href,
  'b-monchengladbach': new URL('../../../images/Teams-logos/bundesliga/monchengladbach.svg', import.meta.url).href,
  'bayer-leverkusen': new URL('../../../images/Teams-logos/bundesliga/leverkusen.svg', import.meta.url).href,
  'bayern-munich': new URL('../../../images/Teams-logos/bundesliga/bayern.svg', import.meta.url).href,
  dortmund: new URL('../../../images/Teams-logos/bundesliga/borussia.svg', import.meta.url).href,
  'eintracht-frankfurt': new URL('../../../images/Teams-logos/bundesliga/frankfurt.svg', import.meta.url).href,
  'fc-koln': new URL('../../../images/Teams-logos/bundesliga/cologne.svg', import.meta.url).href,
  freiburg: new URL('../../../images/Teams-logos/bundesliga/freiburg.svg', import.meta.url).href,
  'hamburger-sv': new URL('../../../images/Teams-logos/bundesliga/hamburg.svg', import.meta.url).href,
  heidenheim: new URL('../../../images/Teams-logos/bundesliga/heidenheim.svg', import.meta.url).href,
  hoffenheim: new URL('../../../images/Teams-logos/bundesliga/hoffenheim.svg', import.meta.url).href,
  mainz: new URL('../../../images/Teams-logos/bundesliga/mainz.svg', import.meta.url).href,
  'rb-leipzig': new URL('../../../images/Teams-logos/bundesliga/rb leipzig.svg', import.meta.url).href,
  'st-pauli': new URL('../../../images/Teams-logos/bundesliga/stpauli.svg', import.meta.url).href,
  stuttgart: new URL('../../../images/Teams-logos/bundesliga/stuttgart.svg', import.meta.url).href,
  'union-berlin': new URL('../../../images/Teams-logos/bundesliga/unionberlin.svg', import.meta.url).href,
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
  lens: new URL('../../../images/Teams-logos/Ligue-1/ecc223ea-c63a-4ccc-8d1e-845e9cda0363.png', import.meta.url).href,
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
  'athletic-bilbao': new URL('../../../images/Teams-logos/champions-league/alteticobilbao.png', import.meta.url).href,
  'atletico-madrid': new URL('../../../images/Teams-logos/champions-league/atletiko.png', import.meta.url).href,
  barcelona: new URL('../../../images/Teams-logos/champions-league/barcelona.png', import.meta.url).href,
  'bayer-leverkusen': new URL('../../../images/Teams-logos/champions-league/leverkusen.png', import.meta.url).href,
  'bayern-munich': new URL('../../../images/Teams-logos/champions-league/bayern.png', import.meta.url).href,
  benfica: new URL('../../../images/Teams-logos/champions-league/benfica.png', import.meta.url).href,
  'bodo-glimt': new URL('../../../images/Teams-logos/champions-league/doboglimt.png', import.meta.url).href,
  'borussia-dortmund': new URL('../../../images/Teams-logos/champions-league/borusia.png', import.meta.url).href,
  chelsea: new URL('../../../images/Teams-logos/champions-league/chelsea.png', import.meta.url).href,
  'club-brugge': new URL('../../../images/Teams-logos/champions-league/brugge.png', import.meta.url).href,
  'eintracht-frankfurt': new URL('../../../images/Teams-logos/champions-league/franfurt.png', import.meta.url).href,
  'fc-copenhagen': new URL('../../../images/Teams-logos/champions-league/kobenhavn.png', import.meta.url).href,
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

const EUROPA_TEAM_LOGOS = {
  'as-roma': new URL('../../../images/Teams-logos/Europa-league/Roma.png', import.meta.url).href,
  'aston-villa': new URL('../../../images/Teams-logos/Europa-league/AstonVilla.png', import.meta.url).href,
  bologna: new URL('../../../images/Teams-logos/Europa-league/bologna.png', import.meta.url).href,
  'celta-de-vigo': new URL('../../../images/Teams-logos/Europa-league/celta.png', import.meta.url).href,
  celtic: new URL('../../../images/Teams-logos/Europa-league/celtic.png', import.meta.url).href,
  'dinamo-zagreb': new URL('../../../images/Teams-logos/Europa-league/gnkdinamo.png', import.meta.url).href,
  'fc-basel': new URL('../../../images/Teams-logos/Europa-league/basel.png', import.meta.url).href,
  'fc-midtjylland': new URL('../../../images/Teams-logos/Europa-league/Midtjylland.png', import.meta.url).href,
  'fc-porto': new URL('../../../images/Teams-logos/Europa-league/Porto.png', import.meta.url).href,
  'fc-salzburg': new URL('../../../images/Teams-logos/Europa-league/salzburg.png', import.meta.url).href,
  'fc-utrecht': new URL('../../../images/Teams-logos/Europa-league/utrecht.png', import.meta.url).href,
  fcsb: new URL('../../../images/Teams-logos/Europa-league/fcsb.png', import.meta.url).href,
  fenerbahe: new URL('../../../images/Teams-logos/Europa-league/fenderbache.png', import.meta.url).href,
  ferencvros: new URL('../../../images/Teams-logos/Europa-league/ferencvaros.png', import.meta.url).href,
  feyenoord: new URL('../../../images/Teams-logos/Europa-league/feyenoord.png', import.meta.url).href,
  'glasgow-rangers': new URL('../../../images/Teams-logos/Europa-league/rangers.png', import.meta.url).href,
  'go-ahead-eagles': new URL('../../../images/Teams-logos/Europa-league/go ahead eagles.png', import.meta.url).href,
  'lille-osc': new URL('../../../images/Teams-logos/Europa-league/lille.png', import.meta.url).href,
  'ludogorets-razgrad': new URL('../../../images/Teams-logos/Europa-league/ludogorets.png', import.meta.url).href,
  'maccabi-telaviv': new URL('../../../images/Teams-logos/Europa-league/m.tel-aviv.png', import.meta.url).href,
  'malm-ff': new URL('../../../images/Teams-logos/Europa-league/malmo.png', import.meta.url).href,
  'nottingham-forest': new URL('../../../images/Teams-logos/Europa-league/forest.png', import.meta.url).href,
  'ogc-nice': new URL('../../../images/Teams-logos/Europa-league/nice.png', import.meta.url).href,
  'olympique-lyon': new URL('../../../images/Teams-logos/Europa-league/Lyon.png', import.meta.url).href,
  'paok-thessaloniki': new URL('../../../images/Teams-logos/Europa-league/paok.png', import.meta.url).href,
  panathinaikos: new URL('../../../images/Teams-logos/Europa-league/panathinaikos.png', import.meta.url).href,
  'racing-genk': new URL('../../../images/Teams-logos/Europa-league/genk.png', import.meta.url).href,
  'real-betis': new URL('../../../images/Teams-logos/Europa-league/Real Betis.png', import.meta.url).href,
  'red-star-belgrade': new URL('../../../images/Teams-logos/Europa-league/cvena zvesta.png', import.meta.url).href,
  'sc-freiburg': new URL('../../../images/Teams-logos/Europa-league/Freiburg.png', import.meta.url).href,
  'sk-brann-bergen': new URL('../../../images/Teams-logos/Europa-league/brann.png', import.meta.url).href,
  'sporting-braga': new URL('../../../images/Teams-logos/Europa-league/Braga.png', import.meta.url).href,
  'sturm-graz': new URL('../../../images/Teams-logos/Europa-league/strum graz.png', import.meta.url).href,
  'vfb-stuttgart': new URL('../../../images/Teams-logos/Europa-league/stuttgard.png', import.meta.url).href,
  'viktoria-plzen': new URL('../../../images/Teams-logos/Europa-league/viktoria plzen.png', import.meta.url).href,
  'young-boys': new URL('../../../images/Teams-logos/Europa-league/yungboys.png', import.meta.url).href
};

const CONFERENCE_TEAM_LOGOS = {
  aberdeen: new URL('../../../images/Teams-logos/conference-league/berdeen.png', import.meta.url).href,
  'aek-athens': new URL('../../../images/Teams-logos/conference-league/AEK Athens.png', import.meta.url).href,
  'aek-larnaca': new URL('../../../images/Teams-logos/conference-league/AEK Larnaca.png', import.meta.url).href,
  'az-alkmaar': new URL('../../../images/Teams-logos/conference-league/AZ Alkmaar.png', import.meta.url).href,
  'bk-hcken': new URL('../../../images/Teams-logos/conference-league/Hacken.png', import.meta.url).href,
  breidablik: new URL('../../../images/Teams-logos/conference-league/breioablik.png', import.meta.url).href,
  'crystal-palace': new URL('../../../images/Teams-logos/conference-league/Crystal Palace.png', import.meta.url).href,
  'dynamo-kyiv': new URL('../../../images/Teams-logos/conference-league/dynamo Kyiv.png', import.meta.url).href,
  'fc-drita': new URL('../../../images/Teams-logos/conference-league/Drita.png', import.meta.url).href,
  fiorentina: new URL('../../../images/Teams-logos/conference-league/fiorentina.png', import.meta.url).href,
  'fc-noah': new URL('../../../images/Teams-logos/conference-league/Noah.png', import.meta.url).href,
  'fsv-mainz-05': new URL('../../../images/Teams-logos/conference-league/Mainz.png', import.meta.url).href,
  'hamrun-spartans': new URL('../../../images/Teams-logos/conference-league/Hamrun Spartans.png', import.meta.url).href,
  'jagiellonia-bialystok': new URL('../../../images/Teams-logos/conference-league/jagiellonia.png', import.meta.url).href,
  'kups-kuopio': new URL('../../../images/Teams-logos/conference-league/KuPS Kuopio.png', import.meta.url).href,
  'lausanne-sports': new URL('../../../images/Teams-logos/conference-league/Lausanne-Sport.png', import.meta.url).href,
  'lech-poznan': new URL('../../../images/Teams-logos/conference-league/Lech Poznan.png', import.meta.url).href,
  'legia-warsaw': new URL('../../../images/Teams-logos/conference-league/Legia Warszawa.png', import.meta.url).href,
  'lincoln-red-imps': new URL('../../../images/Teams-logos/conference-league/L. Red Imps.png', import.meta.url).href,
  'nk-celje': new URL('../../../images/Teams-logos/conference-league/Celje.png', import.meta.url).href,
  'nk-rijeka': new URL('../../../images/Teams-logos/conference-league/rijeka.png', import.meta.url).href,
  'omonia-nicosia': new URL('../../../images/Teams-logos/conference-league/Omonoia.png', import.meta.url).href,
  'rakw-czestochowa': new URL('../../../images/Teams-logos/conference-league/Rakow.png', import.meta.url).href,
  'rapid-wien': new URL('../../../images/Teams-logos/conference-league/SK Rapid.png', import.meta.url).href,
  'rayo-vallecano': new URL('../../../images/Teams-logos/conference-league/Raya Vallecano.png', import.meta.url).href,
  'rc-strasbourg': new URL('../../../images/Teams-logos/conference-league/Strasbourg.png', import.meta.url).href,
  samsunspor: new URL('../../../images/Teams-logos/conference-league/Samsunspor.png', import.meta.url).href,
  'shakhtar-donetsk': new URL('../../../images/Teams-logos/conference-league/shakhtar.png', import.meta.url).href,
  'shamrock-rovers': new URL('../../../images/Teams-logos/conference-league/Shamrock Rovers.png', import.meta.url).href,
  'shkendija-tetovo': new URL('../../../images/Teams-logos/conference-league/shendija.png', import.meta.url).href,
  shelbourne: new URL('../../../images/Teams-logos/conference-league/Shelbourne.png', import.meta.url).href,
  'sigma-olomouc': new URL('../../../images/Teams-logos/conference-league/Sigma Olomouc.png', import.meta.url).href,
  'slovan-bratislava': new URL('../../../images/Teams-logos/conference-league/S. Bratislava.png', import.meta.url).href,
  'sparta-praha': new URL('../../../images/Teams-logos/conference-league/Sparta Praha.png', import.meta.url).href,
  'universitatea-craiova': new URL('../../../images/Teams-logos/conference-league/U. Craiova.png', import.meta.url).href,
  'zrinjski-mostar': new URL('../../../images/Teams-logos/conference-league/Zrinjski.png', import.meta.url).href
};

const WORLDCUP_FLAG_LOGOS = {
  algeria: new URL('../../../images/Flags/algeria.png', import.meta.url).href,
  argentina: new URL('../../../images/Flags/argentina.png', import.meta.url).href,
  australia: new URL('../../../images/Flags/AUS.png', import.meta.url).href,
  austria: new URL('../../../images/Flags/austria.jpg', import.meta.url).href,
  belgium: new URL('../../../images/Flags/belgium.png', import.meta.url).href,
  brazil: new URL('../../../images/Flags/brazil.png', import.meta.url).href,
  canada: new URL('../../../images/Flags/canada.png', import.meta.url).href,
  colombia: new URL('../../../images/Flags/colombia.png', import.meta.url).href,
  croatia: new URL('../../../images/Flags/croatia.png', import.meta.url).href,
  curaao: new URL('../../../images/Flags/CUW.png', import.meta.url).href,
  ecuador: new URL('../../../images/Flags/ecuador.png', import.meta.url).href,
  egypt: new URL('../../../images/Flags/Egypt.svg', import.meta.url).href,
  england: new URL('../../../images/Flags/england.png', import.meta.url).href,
  france: new URL('../../../images/Flags/france.png', import.meta.url).href,
  germany: new URL('../../../images/Flags/germany.png', import.meta.url).href,
  ghana: new URL('../../../images/Flags/ghana.jpg', import.meta.url).href,
  haiti: new URL('../../../images/Flags/HAI.png', import.meta.url).href,
  'ivory-coast': new URL('../../../images/Flags/CIV.png', import.meta.url).href,
  jordan: new URL('../../../images/Flags/jordan.png', import.meta.url).href,
  mexico: new URL('../../../images/Flags/mexico.png', import.meta.url).href,
  morocco: new URL('../../../images/Flags/morocco.jpg', import.meta.url).href,
  netherlands: new URL('../../../images/Flags/netherlands.png', import.meta.url).href,
  'new-zealand': new URL('../../../images/Flags/NZL.png', import.meta.url).href,
  norway: new URL('../../../images/Flags/norway.png', import.meta.url).href,
  panama: new URL('../../../images/Flags/panama.png', import.meta.url).href,
  paraguay: new URL('../../../images/Flags/PAR.png', import.meta.url).href,
  portugal: new URL('../../../images/Flags/portugal.png', import.meta.url).href,
  qatar: new URL('../../../images/Flags/QAT.png', import.meta.url).href,
  scotland: new URL('../../../images/Flags/scotland.png', import.meta.url).href,
  senegal: new URL('../../../images/Flags/senegal.png', import.meta.url).href,
  'south-africa': new URL('../../../images/Flags/RSA.png', import.meta.url).href,
  'south-korea': new URL('../../../images/Flags/korea.jpg', import.meta.url).href,
  spain: new URL('../../../images/Flags/spain.png', import.meta.url).href,
  switzerland: new URL('../../../images/Flags/swis.png', import.meta.url).href,
  tunisia: new URL('../../../images/Flags/TUN.png', import.meta.url).href,
  usa: new URL('../../../images/Flags/USA.png', import.meta.url).href,
  uzbekistan: new URL('../../../images/Flags/uzbekistan.png', import.meta.url).href,
  'uefa-path-a-winner': new URL('../../../images/Flags/Flag_of_Europe.svg.webp', import.meta.url).href,
  'uefa-path-b-winner': new URL('../../../images/Flags/Flag_of_Europe.svg.webp', import.meta.url).href,
  'uefa-path-c-winner': new URL('../../../images/Flags/Flag_of_Europe.svg.webp', import.meta.url).href,
  'uefa-path-d-winner': new URL('../../../images/Flags/Flag_of_Europe.svg.webp', import.meta.url).href
};

export const getLogoSrc = (competitionId, teamId) => {
  if (competitionId === 'premier-league-2025-2026') return PREMIER_TEAM_LOGOS[teamId];
  if (competitionId === 'efl-championship-2025-2026') return CHAMPIONSHIP_TEAM_LOGOS[teamId];
  if (competitionId === 'bundesliga-2025-2026') return BUNDESLIGA_TEAM_LOGOS[teamId];
  if (competitionId === 'serie-a-2025-2026') return SERIEA_TEAM_LOGOS[teamId];
  if (competitionId === 'la-liga-2025-2026') return LALIGA_TEAM_LOGOS[teamId];
  if (competitionId === 'ligue-1-2025-2026') return LIGUE1_TEAM_LOGOS[teamId];
  if (competitionId === 'champions-league-2025-2026') return UCL_TEAM_LOGOS[teamId];
  if (competitionId === 'europa-league-2025-2026') return EUROPA_TEAM_LOGOS[teamId];
  if (competitionId === 'conference-league-2025-2026') return CONFERENCE_TEAM_LOGOS[teamId];
  return null;
};

const buildFormBoxes = (form = []) =>
  form
    .slice(0, 5)
    .map((result) => {
      const outcome = String(result || '').toUpperCase();
      if (outcome === 'W') return '<span class="form-box win"></span>';
      if (outcome === 'L') return '<span class="form-box loss"></span>';
      return '<span class="form-box draw"></span>';
    })
    .join('');

const buildTableRow = ({ entry, team, competitionId, showLogoFallback = true }) => {
  const logo = getLogoSrc(competitionId, entry.teamId);
  const teamLabel = team?.shortName || team?.name || entry.teamName || entry.teamId;
  const rankLabel = Number.isFinite(entry.rank) ? entry.rank : '';
  const logoMarkup = logo
    ? `<img src="${logo}" alt="${teamLabel}" loading="lazy" decoding="async" />`
    : showLogoFallback
      ? `<span class="team-logo-fallback" aria-hidden="true">${teamLabel.slice(0, 2).toUpperCase()}</span>`
      : `<span class="team-logo-placeholder" aria-hidden="true"></span>`;

  return `
    <div class="table-row">
      <div class="row-team">
        <span class="row-rank">${rankLabel}</span>
        ${logoMarkup}
        <span>${teamLabel}</span>
      </div>
      <span class="row-stat">${entry.matchesPlayed}</span>
      <span class="row-stat">${entry.wins}</span>
      <span class="row-stat">${entry.draws}</span>
      <span class="row-stat">${entry.losses}</span>
      <span class="row-stat">${entry.goalDifference}</span>
      <span class="row-stat">${entry.points}</span>
      <div class="row-form">${buildFormBoxes(entry.form)}</div>
    </div>
  `;
};

const leagueSeasonCache = new Map();

const SEASON_OPTIONS = (() => {
  const options = [{ value: 'live', label: '2025/26 (Live)', kind: 'live', startYear: 2025 }];
  for (let startYear = 2024; startYear >= 1993; startYear -= 1) {
    const endYear = startYear + 1;
    const code = `${String(startYear).slice(-2).padStart(2, '0')}${String(endYear).slice(-2).padStart(2, '0')}`;
    const label = `${startYear}/${String(endYear).slice(-2).padStart(2, '0')}`;
    options.push({ value: code, label, kind: 'history', startYear });
  }
  return options;
})();

const getSeasonStorageKey = (leagueKey) => `fodr-${String(leagueKey || 'league')}-season`;

const setTableMessage = (tableBody, message) => {
  if (!tableBody) return;
  tableBody.innerHTML = `<div class="table-row empty"><span>${message}</span></div>`;
};

const safeStorageGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage write failures (private mode, quota, etc.).
  }
};

export const normalizeTeamKey = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\butd\b/g, 'united')
    .replace(/[^a-z0-9 ]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const slugifyTeamId = (value) => normalizeTeamKey(value).replace(/ /g, '-');

export const buildTeamsByAlias = (teams = [], extraAliases = null) => {
  const byAlias = new Map();

  teams.forEach((team) => {
    const aliases = [
      ...(Array.isArray(team.aliases) ? team.aliases : []),
      team.name,
      team.shortName,
      team.slug,
      team.id
    ].filter(Boolean);

    aliases.forEach((alias) => {
      byAlias.set(normalizeTeamKey(alias), team.id);
    });
  });

  if (extraAliases && typeof extraAliases === 'object') {
    Object.entries(extraAliases).forEach(([alias, teamId]) => {
      if (!alias || !teamId) return;
      byAlias.set(normalizeTeamKey(alias), teamId);
    });
  }

  return byAlias;
};

export const parseWorldcupGroupsCsv = (csvText) => {
  const lines = String(csvText || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) return [];

  const groups = new Map();

  for (let i = 1; i < lines.length; i += 1) {
    const cols = lines[i].split(',');
    const stage = String(cols[2] || '').trim().toLowerCase();
    const groupName = String(cols[3] || '').trim();
    if (stage !== 'group stage' || !groupName) continue;

    const groupTeams = groups.get(groupName) || [];
    [String(cols[6] || '').trim(), String(cols[8] || '').trim()]
      .filter(Boolean)
      .forEach((teamName) => {
        if (!groupTeams.includes(teamName)) {
          groupTeams.push(teamName);
        }
      });

    groups.set(groupName, groupTeams);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([groupName, teams]) => ({ groupName, teams }));
};

const getWorldcupFlagSrc = (teamName) => {
  const teamId = slugifyTeamId(teamName);
  return WORLDCUP_FLAG_LOGOS[teamId] || null;
};

export const buildWorldcupFlagMarkup = (teamName) => {
  const flag = getWorldcupFlagSrc(teamName);
  if (flag) {
    return `<img class="worldcup-group-flag" src="${flag}" alt="${teamName}" loading="lazy" decoding="async" />`;
  }

  const fallback = String(teamName || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return `<span class="worldcup-group-flag-fallback" aria-hidden="true">${fallback || '?'}</span>`;
};

const hydrateWorldcupGroups = async () => {
  const card = document.querySelector('.league-table-card.worldcup');
  const tableBody = card?.querySelector('.table-body');
  if (!tableBody) return;

  setTableMessage(tableBody, 'Loading World Cup groups...');

  try {
    const response = await fetch(WORLDCUP_GROUPS_URL);
    if (!response.ok) throw new Error('Unable to load World Cup groups.');

    const csvText = await response.text();
    const groups = parseWorldcupGroupsCsv(csvText);

    if (!groups.length) {
      setTableMessage(tableBody, 'No World Cup groups found.');
      return;
    }

    tableBody.innerHTML = `
      <div class="worldcup-groups-grid">
        ${groups
          .map(
            ({ groupName, teams }) => `
              <section class="worldcup-group-card">
                <div class="worldcup-group-title">${groupName}</div>
                <div class="worldcup-group-list">
                  ${teams
                    .map(
                      (teamName) => `
                        <div class="worldcup-group-team">
                          ${buildWorldcupFlagMarkup(teamName)}
                          <span class="worldcup-group-team-name">${teamName}</span>
                        </div>
                      `
                    )
                    .join('')}
                </div>
              </section>
            `
          )
          .join('')}
      </div>
    `;
  } catch (error) {
    console.warn('Unable to load World Cup groups.', error);
    setTableMessage(tableBody, 'Unable to load World Cup groups.');
  }
};

const parseFootballDataDate = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return null;

  const parts = raw.split('/');
  if (parts.length < 3) return null;

  const [dd, mm, yyRaw] = parts;
  const day = Number.parseInt(dd, 10);
  const month = Number.parseInt(mm, 10);
  const yearPart = Number.parseInt(yyRaw, 10);
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(yearPart)) return null;

  const year =
    String(yyRaw).length >= 4 ? yearPart : yearPart >= 90 ? 1900 + yearPart : 2000 + yearPart;
  return new Date(Date.UTC(year, month - 1, day));
};

export const parseSeasonFixturesCsv = (csvText) => {
  const lines = String(csvText || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const indexOf = (name) => headers.findIndex((h) => h === name);

  const matches = [];

  const idxDate = indexOf('Date');
  const idxHomeTeam = indexOf('HomeTeam');
  const idxAwayTeam = indexOf('AwayTeam');
  const idxFthg = indexOf('FTHG');
  const idxFtag = indexOf('FTAG');
  const idxFtr = indexOf('FTR');

  const hasFootballDataHeaders =
    idxHomeTeam !== -1 && idxAwayTeam !== -1 && idxFthg !== -1 && idxFtag !== -1;

  if (hasFootballDataHeaders) {
    for (let i = 1; i < lines.length; i += 1) {
      const cols = lines[i].split(',');
      const homeTeamName = String(cols[idxHomeTeam] || '').trim();
      const awayTeamName = String(cols[idxAwayTeam] || '').trim();
      if (!homeTeamName || !awayTeamName) continue;

      const homeGoals = Number.parseInt(String(cols[idxFthg] ?? '').trim(), 10);
      const awayGoals = Number.parseInt(String(cols[idxFtag] ?? '').trim(), 10);
      if (!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) continue;

      const ftrRaw = String(idxFtr >= 0 ? cols[idxFtr] : '').trim().toUpperCase();
      const result =
        ftrRaw === 'H' || ftrRaw === 'D' || ftrRaw === 'A'
          ? ftrRaw
          : homeGoals > awayGoals
            ? 'H'
            : homeGoals < awayGoals
              ? 'A'
              : 'D';

      matches.push({
        date: idxDate >= 0 ? parseFootballDataDate(cols[idxDate]) : null,
        homeTeamName,
        awayTeamName,
        homeGoals,
        awayGoals,
        result
      });
    }
  } else {
    // Some competitions (Europa/Conference qualifiers, cups) come in a two-legged "tie" CSV format.
    const idxTieRound = indexOf('Round');
    const idxTieHome = indexOf('Home Team');
    const idxTieAway = indexOf('Away Team');
    const idxLeg1 = indexOf('Leg 1 Score');
    const idxLeg2 = indexOf('Leg 2 Score');

    const parseLegScore = (value) => {
      const raw = String(value || '').trim();
      if (!raw) return null;
      const match = raw.match(/(\d+)\s*[-–]\s*(\d+)/);
      if (!match) return null;
      const homeGoals = Number.parseInt(match[1], 10);
      const awayGoals = Number.parseInt(match[2], 10);
      if (!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) return null;
      return { homeGoals, awayGoals };
    };

    if (idxTieHome === -1 || idxTieAway === -1 || idxLeg1 === -1) return [];

    const base = Date.UTC(2000, 0, 1);
    const dayMs = 24 * 60 * 60 * 1000;
    let matchIndex = 0;

    for (let i = 1; i < lines.length; i += 1) {
      const cols = lines[i].split(',');
      const round = idxTieRound >= 0 ? String(cols[idxTieRound] || '').trim() : null;
      const homeTeamName = String(cols[idxTieHome] || '').trim();
      const awayTeamName = String(cols[idxTieAway] || '').trim();
      if (!homeTeamName || !awayTeamName) continue;

      const leg1 = parseLegScore(cols[idxLeg1]);
      const leg2 = idxLeg2 >= 0 ? parseLegScore(cols[idxLeg2]) : null;

      if (leg1) {
        const result =
          leg1.homeGoals > leg1.awayGoals ? 'H' : leg1.homeGoals < leg1.awayGoals ? 'A' : 'D';
        matches.push({
          date: new Date(base + matchIndex * dayMs),
          round,
          homeTeamName,
          awayTeamName,
          homeGoals: leg1.homeGoals,
          awayGoals: leg1.awayGoals,
          result
        });
        matchIndex += 1;
      }

      if (leg2) {
        // Most sources store the second-leg score as "teamA-teamB" (same order as the row).
        // To show a realistic second leg, flip the home/away teams and invert the score.
        const homeGoals = leg2.awayGoals;
        const awayGoals = leg2.homeGoals;
        const result = homeGoals > awayGoals ? 'H' : homeGoals < awayGoals ? 'A' : 'D';
        matches.push({
          date: new Date(base + matchIndex * dayMs),
          round,
          homeTeamName: awayTeamName,
          awayTeamName: homeTeamName,
          homeGoals,
          awayGoals,
          result
        });
        matchIndex += 1;
      }
    }
  }

  // Most files are already ordered by date, but sorting makes "form" deterministic.
  matches.sort((a, b) => {
    const da = a.date ? a.date.getTime() : 0;
    const db = b.date ? b.date.getTime() : 0;
    return da - db;
  });

  return matches;
};

export const buildStandingsFromMatches = (matches, { teamsById, teamsByAlias, pointsForWin = 3 }) => {
  const rowsByTeamId = new Map();

  const resolveTeamId = (rawName) => {
    const key = normalizeTeamKey(rawName);
    return teamsByAlias.get(key) || slugifyTeamId(rawName);
  };

  const ensureRow = (teamId, rawName) => {
    if (rowsByTeamId.has(teamId)) return rowsByTeamId.get(teamId);
    const team = teamsById.get(teamId);
    const row = {
      teamId,
      teamName: team?.name || String(rawName || teamId),
      rank: null,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      _formHistory: []
    };
    rowsByTeamId.set(teamId, row);
    return row;
  };

  matches.forEach((match) => {
    const homeId = resolveTeamId(match.homeTeamName);
    const awayId = resolveTeamId(match.awayTeamName);

    const home = ensureRow(homeId, match.homeTeamName);
    const away = ensureRow(awayId, match.awayTeamName);

    home.matchesPlayed += 1;
    away.matchesPlayed += 1;

    home.goalsFor += match.homeGoals;
    home.goalsAgainst += match.awayGoals;
    away.goalsFor += match.awayGoals;
    away.goalsAgainst += match.homeGoals;

    if (match.result === 'H') {
      home.wins += 1;
      home.points += pointsForWin;
      home._formHistory.push('W');

      away.losses += 1;
      away._formHistory.push('L');
    } else if (match.result === 'A') {
      away.wins += 1;
      away.points += pointsForWin;
      away._formHistory.push('W');

      home.losses += 1;
      home._formHistory.push('L');
    } else {
      home.draws += 1;
      home.points += 1;
      home._formHistory.push('D');

      away.draws += 1;
      away.points += 1;
      away._formHistory.push('D');
    }
  });

  const rows = Array.from(rowsByTeamId.values()).map((row) => {
    row.goalDifference = row.goalsFor - row.goalsAgainst;
    row.form = row._formHistory.slice(-5).reverse();
    delete row._formHistory;
    return row;
  });

  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return String(a.teamName).localeCompare(String(b.teamName));
  });

  rows.forEach((row, idx) => {
    row.rank = idx + 1;
  });

  return rows;
};

const hydrateLeagueTableWithHistory = async ({ key, competitionId, standingsUrl, teamsUrl, history }) => {
  const card = document.querySelector(`.league-table-card.${key}`);
  const tableBody = card?.querySelector('.table-body');
  if (!tableBody) return;

  const seasonSelect = card?.querySelector('.season-select');

  try {
    const seasonOptions = (() => {
      if (!history || typeof history.seasonOptions !== 'function') return SEASON_OPTIONS;
      const filtered = history.seasonOptions(SEASON_OPTIONS);
      return Array.isArray(filtered) && filtered.length ? filtered : SEASON_OPTIONS;
    })();

    let teams = [];
    if (teamsUrl) {
      try {
        const teamsResponse = await fetch(teamsUrl);
        if (teamsResponse.ok) {
          const payload = await teamsResponse.json();
          teams = Array.isArray(payload) ? payload : [];
        }
      } catch (error) {
        console.warn(`Unable to load ${competitionId} teams.`, error);
      }
    }
    const teamsById = new Map(teams.map((team) => [team.id, team]));
    const teamsByAlias = buildTeamsByAlias(teams, history?.aliases);

    if (seasonSelect) {
      seasonSelect.innerHTML = seasonOptions.map((opt) => `<option value="${opt.value}">${opt.label}</option>`).join(
        ''
      );
    }

    const storageKey = getSeasonStorageKey(key);
    const stored = seasonSelect ? safeStorageGet(storageKey) : null;
    const defaultSeason = stored && seasonOptions.some((opt) => opt.value === stored) ? stored : 'live';
    if (seasonSelect) seasonSelect.value = defaultSeason;

    const renderSeason = async (seasonValue) => {
      const option = seasonOptions.find((opt) => opt.value === seasonValue) || null;

      if (seasonSelect) seasonSelect.disabled = true;
      setTableMessage(tableBody, 'Loading season...');

      try {
        const computeStandingsFromHistory = async (seasonCode, { optionOverride = null, useCache = true } = {}) => {
          if (!history) return [];
          const optionForPoints = optionOverride;
          const cacheKey = `${key}::${seasonCode}`;
          if (useCache && leagueSeasonCache.has(cacheKey)) {
            return leagueSeasonCache.get(cacheKey);
          }

          const pointsForWin =
            typeof history.pointsForWin === 'function' ? history.pointsForWin(optionForPoints?.startYear) : 3;
          const file =
            typeof history.fileForSeason === 'function' ? history.fileForSeason(seasonCode) : `season-${seasonCode}.csv`;
          const csvUrl = history.baseUrl ? new URL(file, history.baseUrl) : new URL(file, import.meta.url);
          const csvResponse = await fetch(csvUrl);
          if (!csvResponse.ok) throw new Error(`Unable to load ${optionForPoints?.label || seasonCode}.`);
          const csvText = await csvResponse.text();
          let matches = parseSeasonFixturesCsv(csvText);
          if (typeof history.filterMatches === 'function') {
            matches = history.filterMatches(matches, {
              key,
              competitionId,
              seasonCode,
              option: optionForPoints
            });
          }
          const computed = buildStandingsFromMatches(matches, { teamsById, teamsByAlias, pointsForWin });
          if (useCache) leagueSeasonCache.set(cacheKey, computed);
          return computed;
        };

        let standings = null;

        if (seasonValue === 'live') {
          try {
            if (!standingsUrl) throw new Error('Live standings not configured.');
            const standingsResponse = await fetch(standingsUrl);
            if (!standingsResponse.ok) throw new Error('Unable to load live standings.');
            standings = await standingsResponse.json();
          } catch (error) {
            // If there is no live standings feed, fall back to computing from the 25/26 history CSV.
            if (!history) throw error;

            const liveMeta = seasonOptions.find((opt) => opt.value === 'live') || null;
            const liveStart = liveMeta?.startYear ?? 2025;
            const liveCode = `${String(liveStart).slice(-2).padStart(2, '0')}${String(liveStart + 1)
              .slice(-2)
              .padStart(2, '0')}`;
            standings = await computeStandingsFromHistory(liveCode, { optionOverride: liveMeta, useCache: false });
          }
        } else if (!history) {
          if (!standingsUrl) throw new Error('Standings feed not configured.');
          const standingsResponse = await fetch(standingsUrl);
          if (!standingsResponse.ok) throw new Error('Unable to load standings.');
          standings = await standingsResponse.json();
        } else {
          standings = await computeStandingsFromHistory(seasonValue, { optionOverride: option, useCache: true });
        }

        if (!Array.isArray(standings) || standings.length === 0) {
          setTableMessage(tableBody, 'No standings found for this season.');
          return;
        }

        const sorted = [...standings].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
        tableBody.innerHTML = sorted
          .map((entry) =>
            buildTableRow({
              entry,
              team: teamsById.get(entry.teamId),
              competitionId,
              showLogoFallback: false
            })
          )
          .join('');

        if (seasonSelect) safeStorageSet(storageKey, seasonValue);
      } catch (error) {
        console.warn(`Unable to render ${competitionId} season.`, error);
        setTableMessage(tableBody, 'Unable to load this season.');
      } finally {
        if (seasonSelect) seasonSelect.disabled = false;
      }
    };

    if (seasonSelect && !seasonSelect.dataset.bound) {
      seasonSelect.dataset.bound = 'true';
      seasonSelect.addEventListener('change', () => {
        renderSeason(seasonSelect.value);
      });
    }

    await renderSeason(defaultSeason);
  } catch (error) {
    console.warn(`Unable to hydrate ${competitionId} standings.`, error);
    setTableMessage(tableBody, 'Unable to load standings.');
    if (seasonSelect) seasonSelect.disabled = false;
  }
};

const hydrateLeagueTables = async () => {
  const leagueConfigs = [
    {
      key: 'premier',
      competitionId: 'premier-league-2025-2026',
      standingsUrl: PREMIER_STANDINGS_URL,
      teamsUrl: PREMIER_TEAMS_URL,
      history: {
        baseUrl: PREMIER_HISTORY_BASE_URL,
        fileForSeason: (code) => (code === '2425' ? 'filtered_data 2425.csv' : `season-${code}.csv`),
        pointsForWin: () => 3
      }
    },
    {
      key: 'championship',
      competitionId: 'efl-championship-2025-2026',
      standingsUrl: null,
      teamsUrl: null,
      history: {
        baseUrl: CHAMPIONSHIP_HISTORY_BASE_URL,
        // Championship history files are stored as `0304.csv`, `0405.csv`, ..., `2526.csv`.
        fileForSeason: (code) => `${code}.csv`,
        seasonOptions: (options) =>
          (options || []).filter((opt) => opt?.value === 'live' || (opt?.kind === 'history' && opt.startYear >= 2003)),
        pointsForWin: () => 3
      }
    },
    {
      key: 'bundesliga',
      competitionId: 'bundesliga-2025-2026',
      standingsUrl: BUNDESLIGA_STANDINGS_URL,
      teamsUrl: BUNDESLIGA_TEAMS_URL,
      history: {
        baseUrl: BUNDESLIGA_HISTORY_BASE_URL,
        fileForSeason: (code) => `season-${code}.csv`,
        pointsForWin: (startYear) => (Number(startYear) >= 1995 ? 3 : 2),
        aliases: { "M'gladbach": 'b-monchengladbach' }
      }
    },
    {
      key: 'seriea',
      competitionId: 'serie-a-2025-2026',
      standingsUrl: SERIEA_STANDINGS_URL,
      teamsUrl: SERIEA_TEAMS_URL,
      history: {
        baseUrl: SERIEA_HISTORY_BASE_URL,
        fileForSeason: (code) => `season-${code}.csv`,
        pointsForWin: (startYear) => (Number(startYear) >= 1994 ? 3 : 2)
      }
    },
    {
      key: 'laliga',
      competitionId: 'la-liga-2025-2026',
      standingsUrl: LALIGA_STANDINGS_URL,
      teamsUrl: LALIGA_TEAMS_URL,
      history: {
        baseUrl: LALIGA_HISTORY_BASE_URL,
        fileForSeason: (code) => `season-${code}.csv`,
        pointsForWin: (startYear) => (Number(startYear) >= 1995 ? 3 : 2),
        aliases: { Sociedad: 'real-sociedad', 'Ath Madrid': 'atl-madrid' }
      }
    },
    {
      key: 'ligue1',
      competitionId: 'ligue-1-2025-2026',
      standingsUrl: LIGUE1_STANDINGS_URL,
      teamsUrl: LIGUE1_TEAMS_URL,
      history: {
        baseUrl: LIGUE1_HISTORY_BASE_URL,
        fileForSeason: (code) => `season-${code}.csv`,
        pointsForWin: (startYear) => (Number(startYear) >= 1994 ? 3 : 2),
        aliases: { 'Paris SG': 'psg' }
      }
    },
    {
      key: 'ucl',
      competitionId: 'champions-league-2025-2026',
      standingsUrl: UCL_STANDINGS_URL,
      teamsUrl: UCL_TEAMS_URL,
      history: {
        baseUrl: UCL_HISTORY_BASE_URL,
        fileForSeason: (code) => `season-${code}.csv`,
        pointsForWin: () => 3,
        filterMatches: (matches, { option }) => {
          const startYear = option?.startYear;
          const stage = Number(startYear) >= 2024 ? 'league stage' : 'group stage';
          return (matches || []).filter((match) => String(match?.round || '').trim().toLowerCase() === stage);
        }
      }
    },
    {
      key: 'europa',
      competitionId: 'europa-league-2025-2026',
      standingsUrl: null,
      teamsUrl: null,
      history: {
        baseUrl: EUROPA_HISTORY_BASE_URL,
        fileForSeason: (code) => `season-${code}.csv`,
        pointsForWin: () => 3,
        filterMatches: (matches, { option }) => {
          const startYear = option?.startYear;
          const stage = Number(startYear) >= 2024 ? 'league stage' : 'group stage';
          return (matches || []).filter((match) => String(match?.round || '').trim().toLowerCase() === stage);
        }
      }
    },
    {
      key: 'conference',
      competitionId: 'conference-league-2025-2026',
      standingsUrl: null,
      teamsUrl: null,
      history: {
        baseUrl: CONFERENCE_HISTORY_BASE_URL,
        fileForSeason: (code) => `season-${code}.csv`,
        pointsForWin: () => 3,
        filterMatches: (matches, { option }) => {
          const startYear = option?.startYear;
          const stage = Number(startYear) >= 2024 ? 'league stage' : 'group stage';
          return (matches || []).filter((match) => String(match?.round || '').trim().toLowerCase() === stage);
        }
      }
    }
  ];

  await Promise.all(leagueConfigs.map((config) => hydrateLeagueTableWithHistory(config)));
  await hydrateWorldcupGroups();
};

export const initLeagues = () => {
  const leagueCards = document.querySelectorAll('.league-card');
  const leagueTableCards = document.querySelectorAll('.league-table-card');
  const leagueTabs = document.querySelectorAll('.sidebar-item[data-league]');
  const leagueGrid = document.querySelector('.league-grid');

  const reorderLeagues = (leagueId) => {
    if (!leagueId) return;
    const cards = Array.from(leagueCards);
    cards.forEach((card) => card.classList.remove('is-hidden'));

    if (!leagueGrid) return;
    const activeCard = cards.find((card) => card.dataset.league === leagueId);
    if (!activeCard) return;
    leagueGrid.prepend(activeCard);
  };

  const reorderLeagueTables = (leagueId) => {
    if (!leagueId) return;
    const cards = Array.from(leagueTableCards);
    if (!cards.length) return;
    const tablesGrid = document.querySelector('.tables-grid');
    if (!tablesGrid) return;
    const activeCard = cards.find((card) => card.dataset.league === leagueId);
    if (!activeCard) return;
    tablesGrid.prepend(activeCard);
  };

  leagueTabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('.sidebar-slot-edit')) return;
      const leagueId = tab.dataset.league;
      if (!leagueId) return;
      leagueTabs.forEach((item) => item.classList.remove('active'));
      tab.classList.add('active');

      const leaguesVisible = isViewVisible('leagues');
      const statsVisible = isViewVisible('stats');
      const quizVisible = isViewVisible('quiz');
      const newsVisible = isViewVisible('news');
      const cardgameVisible = isViewVisible('cardgame');
      const playersVisible = isViewVisible('players');

      if (!leaguesVisible && !statsVisible && !quizVisible && !newsVisible && !cardgameVisible && !playersVisible) {
        showHome();
      }

      reorderLeagues(leagueId);
      reorderLeagueTables(leagueId);
      setStatsAccent(leagueId);
    });
  });

  hydrateLeagueTables();
};
