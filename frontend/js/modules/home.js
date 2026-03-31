import { showHome, showMatch } from '../core/views.js';
import { loadRosterForTeam } from './players.js';

const PREMIER_TEAMS_URL = new URL('../../../db-api/data/competitions/premier-league/teams.json', import.meta.url);
const PREMIER_MATCHES_URL = new URL('../../../db-api/data/competitions/premier-league/matches.json', import.meta.url);
const CHAMPIONSHIP_MATCHES_URL = new URL('../../../db-api/history-data/ELFchampionship-league-table-history/season-2526.csv', import.meta.url);
const BUNDESLIGA_TEAMS_URL = new URL('../../../db-api/data/competitions/bundesliga/teams.json', import.meta.url);
const BUNDESLIGA_MATCHES_URL = new URL('../../../db-api/data/competitions/bundesliga/matches.json', import.meta.url);
const SERIEA_TEAMS_URL = new URL('../../../db-api/data/competitions/serie-a/teams.json', import.meta.url);
const SERIEA_MATCHES_URL = new URL('../../../db-api/data/competitions/serie-a/matches.json', import.meta.url);
const LALIGA_TEAMS_URL = new URL('../../../db-api/data/competitions/la-liga/teams.json', import.meta.url);
const LALIGA_MATCHES_URL = new URL('../../../db-api/data/competitions/la-liga/matches.json', import.meta.url);
const UCL_TEAMS_URL = new URL('../../../db-api/data/competitions/champions-league/teams.json', import.meta.url);
const UCL_MATCHES_URL = new URL('../../../db-api/data/competitions/champions-league/matches.json', import.meta.url);
const LIGUE1_TEAMS_URL = new URL('../../../db-api/data/competitions/ligue-1/teams.json', import.meta.url);
const LIGUE1_MATCHES_URL = new URL('../../../db-api/data/competitions/ligue-1/matches.json', import.meta.url);
const EUROPA_TIES_URL = new URL('../../../db-api/history-data/europa-league-table-history/season-2526.csv', import.meta.url);
const CONFERENCE_TIES_URL = new URL('../../../db-api/history-data/conference-league-table-history/season-2526.csv', import.meta.url);
const FACUP_MATCHES_URL = new URL('../../../db-api/history-data/facup-league-table-history/season-2526.csv', import.meta.url);
const CARABAO_MATCHES_URL = new URL('../../../db-api/history-data/carabao-table-history/season-2526.csv', import.meta.url);
const WORLDCUP_MATCHES_URL = new URL('../../../db-api/history-data/worldcup-table-history/season-2026.csv', import.meta.url);
const COMPETITION_LOGOS = {
  'premier-league-2025-2026': new URL(
    '../../../images/comp-logos/Competition=Men_%20Premier%20League,%20Color=Color.webp',
    import.meta.url
  ).href,
  'efl-championship-2025-2026': new URL('../../../images/comp-logos/EFLchampionship.svg', import.meta.url).href,
  'champions-league-2025-2026': new URL(
    '../../../images/comp-logos/Competition=Men_%20Champions%20League,%20Color=Color.webp',
    import.meta.url
  ).href,
  'bundesliga-2025-2026': new URL('../../../images/comp-logos/bundesliga-app.svg', import.meta.url).href,
  'serie-a-2025-2026': new URL('../../../images/comp-logos/seriea-enilive-logo_jssflz.png', import.meta.url).href,
  'ligue-1-2025-2026': new URL('../../../images/comp-logos/ligue-1.png', import.meta.url).href,
  'la-liga-2025-2026': new URL('../../../images/comp-logos/Screenshot%202026-03-02%20155633.png', import.meta.url).href,
  'europa-league-2025-2026': new URL('../../../images/comp-logos/europa-league.png', import.meta.url).href,
  'conference-league-2025-2026': new URL('../../../images/comp-logos/conference-league.svg', import.meta.url).href,
  'fa-cup-2025-2026': new URL('../../../images/comp-logos/facup.png', import.meta.url).href,
  'carabao-cup-2025-2026': new URL('../../../images/comp-logos/carabao-cup-crest.svg', import.meta.url).href,
  'worldcup-2026': new URL('../../../images/comp-logos/2026-World-Cup.webp', import.meta.url).href
};

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
  'blackburn-rovers': new URL('../../../images/Teams-logos/EFLchampionship/blackburn%20rovers.png', import.meta.url)
    .href,
  'bristol-city': new URL('../../../images/Teams-logos/EFLchampionship/bristolcity.png', import.meta.url).href,
  charlton: new URL('../../../images/Teams-logos/EFLchampionship/charlton.png', import.meta.url).href,
  'coventry-city': new URL('../../../images/Teams-logos/EFLchampionship/coventry%20city.png', import.meta.url).href,
  'derby-county': new URL('../../../images/Teams-logos/EFLchampionship/derbycounty.png', import.meta.url).href,
  'hull-city': new URL('../../../images/Teams-logos/EFLchampionship/hullcity.png', import.meta.url).href,
  'ipswich-town': new URL('../../../images/Teams-logos/EFLchampionship/ipswichtown.png', import.meta.url).href,
  'leicester-city': new URL('../../../images/Teams-logos/EFLchampionship/leicestercity.png', import.meta.url).href,
  middlesbrough: new URL('../../../images/Teams-logos/EFLchampionship/middlesbrough.png', import.meta.url).href,
  millwall: new URL('../../../images/Teams-logos/EFLchampionship/millwall.png', import.meta.url).href,
  norwich: new URL('../../../images/Teams-logos/EFLchampionship/norwich.png', import.meta.url).href,
  'norwich-city': new URL('../../../images/Teams-logos/EFLchampionship/norwich.png', import.meta.url).href,
  'oxford-united': new URL('../../../images/Teams-logos/EFLchampionship/oxfordunited.png', import.meta.url).href,
  portsmouth: new URL('../../../images/Teams-logos/EFLchampionship/portsmouth.png', import.meta.url).href,
  'preston-north-end': new URL('../../../images/Teams-logos/EFLchampionship/prestonnorthend.png', import.meta.url)
    .href,
  'queens-park-rangers': new URL(
    '../../../images/Teams-logos/EFLchampionship/queenparkrangers.png',
    import.meta.url
  ).href,
  'sheffield-united': new URL('../../../images/Teams-logos/EFLchampionship/sheffieldunited.png', import.meta.url).href,
  'sheffield-wednesday': new URL(
    '../../../images/Teams-logos/EFLchampionship/sheffieldwednesday.png',
    import.meta.url
  ).href,
  southampton: new URL('../../../images/Teams-logos/EFLchampionship/southampton.png', import.meta.url).href,
  'stoke-city': new URL('../../../images/Teams-logos/EFLchampionship/stroke.png', import.meta.url).href,
  'swansea-city': new URL('../../../images/Teams-logos/EFLchampionship/swanseacity.png', import.meta.url).href,
  watford: new URL('../../../images/Teams-logos/EFLchampionship/watford.png', import.meta.url).href,
  'west-bromwich-albion': new URL(
    '../../../images/Teams-logos/EFLchampionship/westbromwich%20albion.png',
    import.meta.url
  ).href,
  wrexham: new URL('../../../images/Teams-logos/EFLchampionship/wrexham.png', import.meta.url).href
};

const ENGLISH_TEAM_ID_ALIASES = {
  'man-city': 'manchester-city',
  'man-united': 'manchester-united',
  newcastle: 'newcastle-united',
  tottenham: 'tottenham-hotspur',
  spurs: 'tottenham-hotspur',
  'west-ham': 'west-ham-united',
  brighton: 'brighton-and-hove-albion',
  wolves: 'wolverhampton-wanderers',
  'nottm-forest': 'nottingham-forest',
  'qpr': 'queens-park-rangers',
  'west-brom': 'west-bromwich-albion',
  swansea: 'swansea-city',
  'oxford-utd': 'oxford-united',
  'sheffield-weds': 'sheffield-wednesday'
};

const ENGLISH_TEAM_LOGOS = {
  ...PREMIER_TEAM_LOGOS,
  ...CHAMPIONSHIP_TEAM_LOGOS
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

const WORLDCUP_TEAM_LOGOS = {
  argentina: new URL('../../../images/Flags/argentina.png', import.meta.url).href,
  belgium: new URL('../../../images/Flags/belgium.png', import.meta.url).href,
  brazil: new URL('../../../images/Flags/brazil.png', import.meta.url).href,
  egypt: new URL('../../../images/Flags/Egypt.svg', import.meta.url).href,
  england: new URL('../../../images/Flags/england.png', import.meta.url).href,
  france: new URL('../../../images/Flags/france.png', import.meta.url).href,
  germany: new URL('../../../images/Flags/germany.png', import.meta.url).href,
  hungary: new URL('../../../images/Flags/hungary.png', import.meta.url).href,
  italy: new URL('../../../images/Flags/italy.png', import.meta.url).href,
  netherlands: new URL('../../../images/Flags/netherlands.png', import.meta.url).href,
  norway: new URL('../../../images/Flags/norway.png', import.meta.url).href,
  portugal: new URL('../../../images/Flags/portugal.png', import.meta.url).href,
  scotland: new URL('../../../images/Flags/scotland.png', import.meta.url).href,
  senegal: new URL('../../../images/Flags/senegal.png', import.meta.url).href,
  spain: new URL('../../../images/Flags/spain.png', import.meta.url).href,
  sweden: new URL('../../../images/Flags/sweden.svg', import.meta.url).href
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

const premierFixturesState = {
  activeMatchday: null,
  matchdays: [],
  matchesByMatchday: new Map(),
  teamsById: new Map()
};

const championshipFixturesState = {
  activeMatchday: 1,
  matchdays: [1],
  matchesByMatchday: new Map(),
  teamsById: new Map()
};

const bundesligaFixturesState = {
  activeMatchday: null,
  matchdays: [],
  matchesByMatchday: new Map(),
  teamsById: new Map()
};

const serieAFixturesState = {
  activeMatchday: null,
  matchdays: [],
  matchesByMatchday: new Map(),
  teamsById: new Map()
};

const laligaFixturesState = {
  activeMatchday: null,
  matchdays: [],
  matchesByMatchday: new Map(),
  teamsById: new Map()
};

const uclFixturesState = {
  activeRound: null,
  rounds: [],
  matchesByRound: new Map(),
  teamsById: new Map()
};

const ligue1FixturesState = {
  activeMatchday: null,
  matchdays: [],
  matchesByMatchday: new Map(),
  teamsById: new Map()
};

const europaFixturesState = {
  activeRound: null,
  rounds: [],
  tiesByRound: new Map(),
  teamsById: new Map(),
  matchesById: new Map()
};

const conferenceFixturesState = {
  activeRound: null,
  rounds: [],
  tiesByRound: new Map(),
  teamsById: new Map(),
  matchesById: new Map()
};

const facupFixturesState = {
  activeRound: null,
  rounds: [],
  matchesByRound: new Map(),
  teamsById: new Map(),
  matchesById: new Map()
};

const carabaocupFixturesState = {
  activeRound: null,
  rounds: [],
  matchesByRound: new Map(),
  teamsById: new Map(),
  matchesById: new Map()
};

const worldcupFixturesState = {
  activeRound: null,
  rounds: [],
  matchesByRound: new Map(),
  teamsById: new Map(),
  matchesById: new Map()
};

const UCL_STAGE_LABELS = {
  round_of_32: 'R32',
  round_of_16: 'R16',
  quarter_final: 'QF',
  semi_final: 'SF',
  final: 'F'
};

const UCL_STAGE_ORDER = {
  round_of_32: 20,
  round_of_16: 21,
  quarter_final: 22,
  semi_final: 23,
  final: 24
};

const formatKickoff = (matchDate) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(matchDate));

const formatMatchDate = (matchDate) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(matchDate));

const TEAM_CODE_OVERRIDES = {
  liverpool: 'LIV',
  barcelona: 'BAR',
  'real-madrid': 'RMA',
  'atl-madrid': 'ATM',
  'atletico-madrid': 'ATM',
  juventus: 'JUV',
  'manchester-city': 'MNC',
  'manchester-united': 'MNU',
  'man-city': 'MNC',
  'man-united': 'MNU',
  tottenham: 'TOT',
  spurs: 'TOT',
  newcastle: 'NEW',
  'west-ham': 'WHU',
  brighton: 'BHA'
};

const TEAM_CODE_STOPWORDS = new Set([
  'fc',
  'cf',
  'ac',
  'afc',
  'as',
  'ssc',
  'ud',
  'rc',
  'sc',
  'sv',
  'club',
  'de',
  'la',
  'le',
  'the'
]);

const buildTeamCode = (teamName = '') => {
  const cleaned = String(teamName)
    .replace(/[.'’]/g, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(Boolean);
  const filtered = words.filter((word) => !TEAM_CODE_STOPWORDS.has(word.toLowerCase()));
  const list = filtered.length ? filtered : words;

  const explicit = list.find((word) => word.length === 3 && word === word.toUpperCase());
  if (explicit) return explicit.toUpperCase();

  if (list.length === 1) {
    return list[0].slice(0, 3).toUpperCase();
  }

  if (list.length >= 3) {
    return `${list[0][0]}${list[1][0]}${list[2][0]}`.toUpperCase();
  }

  const [first, second] = list;
  if (first.length <= 3) {
    let code = `${first}${second[0]}`.toUpperCase();
    if (code.length < 3) {
      code = `${code}${second.slice(1, 3 - code.length)}`.toUpperCase();
    }
    return code.slice(0, 3).toUpperCase();
  }

  return `${first[0]}${second.slice(0, 2)}`.toUpperCase();
};

const getTeamCode = (team) =>
  TEAM_CODE_OVERRIDES[team.id] || buildTeamCode(team.shortName || team.name || team.id);

const normalizeLooseTeamId = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\butd\b/g, 'united')
    .replace(/[^a-z0-9 ]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/ /g, '-');

const ensureTeamInState = (state, teamName) => {
  const name = String(teamName || '').trim();
  const id = normalizeLooseTeamId(name) || name;
  const existing = state.teamsById.get(id);
  if (existing) return existing;
  const team = { id, name: name || id, shortName: name || id };
  state.teamsById.set(id, team);
  return team;
};

const ensureEuropaTeam = (teamName) => ensureTeamInState(europaFixturesState, teamName);
const ensureConferenceTeam = (teamName) => ensureTeamInState(conferenceFixturesState, teamName);
const ensureFacupTeam = (teamName) => ensureTeamInState(facupFixturesState, teamName);
const ensureCarabaoTeam = (teamName) => ensureTeamInState(carabaocupFixturesState, teamName);
const ensureWorldcupTeam = (teamName) => ensureTeamInState(worldcupFixturesState, teamName);
const ensureChampionshipTeam = (teamName) => ensureTeamInState(championshipFixturesState, teamName);

const getTeamDisplay = (teamId) =>
  premierFixturesState.teamsById.get(teamId) || {
    id: teamId,
    name: teamId,
    shortName: teamId
  };

const getChampionshipTeamDisplay = (teamId) =>
  championshipFixturesState.teamsById.get(teamId) || {
    id: teamId,
    name: teamId,
    shortName: teamId
  };

const getUclTeamDisplay = (teamId) =>
  uclFixturesState.teamsById.get(teamId) || {
    id: teamId,
    name: teamId,
    shortName: teamId
  };

const getBundesligaTeamDisplay = (teamId) =>
  bundesligaFixturesState.teamsById.get(teamId) || {
    id: teamId,
    name: teamId,
    shortName: teamId
  };

const getSerieATeamDisplay = (teamId) =>
  serieAFixturesState.teamsById.get(teamId) || {
    id: teamId,
    name: teamId,
    shortName: teamId
  };

const getLaligaTeamDisplay = (teamId) =>
  laligaFixturesState.teamsById.get(teamId) || {
    id: teamId,
    name: teamId,
    shortName: teamId
  };

const getLigue1TeamDisplay = (teamId) =>
  ligue1FixturesState.teamsById.get(teamId) || {
    id: teamId,
    name: teamId,
    shortName: teamId
  };

const getEuropaTeamDisplay = (teamId) =>
  europaFixturesState.teamsById.get(teamId) || {
    id: teamId,
    name: teamId,
    shortName: teamId
  };

const getConferenceTeamDisplay = (teamId) =>
  conferenceFixturesState.teamsById.get(teamId) || {
    id: teamId,
    name: teamId,
    shortName: teamId
  };

const getFacupTeamDisplay = (teamId) =>
  facupFixturesState.teamsById.get(teamId) || {
    id: teamId,
    name: teamId,
    shortName: teamId
  };

const getCarabaoTeamDisplay = (teamId) =>
  carabaocupFixturesState.teamsById.get(teamId) || {
    id: teamId,
    name: teamId,
    shortName: teamId
  };

const getWorldcupTeamDisplay = (teamId) =>
  worldcupFixturesState.teamsById.get(teamId) || {
    id: teamId,
    name: teamId,
    shortName: teamId
  };

const getTeamForMatch = (match, teamId) => {
  if (match.competitionId === 'efl-championship-2025-2026') {
    return getChampionshipTeamDisplay(teamId);
  }
  if (match.competitionId === 'champions-league-2025-2026') {
    return getUclTeamDisplay(teamId);
  }
  if (match.competitionId === 'bundesliga-2025-2026') {
    return getBundesligaTeamDisplay(teamId);
  }
  if (match.competitionId === 'serie-a-2025-2026') {
    return getSerieATeamDisplay(teamId);
  }
  if (match.competitionId === 'la-liga-2025-2026') {
    return getLaligaTeamDisplay(teamId);
  }
  if (match.competitionId === 'ligue-1-2025-2026') {
    return getLigue1TeamDisplay(teamId);
  }
  if (match.competitionId === 'europa-league-2025-2026') {
    return getEuropaTeamDisplay(teamId);
  }
  if (match.competitionId === 'conference-league-2025-2026') {
    return getConferenceTeamDisplay(teamId);
  }
  if (match.competitionId === 'fa-cup-2025-2026') {
    return getFacupTeamDisplay(teamId);
  }
  if (match.competitionId === 'carabao-cup-2025-2026') {
    return getCarabaoTeamDisplay(teamId);
  }
  if (match.competitionId === 'worldcup-2026') {
    return getWorldcupTeamDisplay(teamId);
  }
  return getTeamDisplay(teamId);
};

const getTeamLogoMap = (competitionId) => {
  if (competitionId === 'premier-league-2025-2026') return PREMIER_TEAM_LOGOS;
  if (competitionId === 'efl-championship-2025-2026') return CHAMPIONSHIP_TEAM_LOGOS;
  if (competitionId === 'champions-league-2025-2026') return UCL_TEAM_LOGOS;
  if (competitionId === 'europa-league-2025-2026') return EUROPA_TEAM_LOGOS;
  if (competitionId === 'conference-league-2025-2026') return CONFERENCE_TEAM_LOGOS;
  if (competitionId === 'bundesliga-2025-2026') return BUNDESLIGA_TEAM_LOGOS;
  if (competitionId === 'serie-a-2025-2026') return SERIEA_TEAM_LOGOS;
  if (competitionId === 'la-liga-2025-2026') return LALIGA_TEAM_LOGOS;
  if (competitionId === 'ligue-1-2025-2026') return LIGUE1_TEAM_LOGOS;
  if (competitionId === 'worldcup-2026') return WORLDCUP_TEAM_LOGOS;
  return null;
};

const getTeamLogoUrl = (team, competitionId) => {
  const logoMap = getTeamLogoMap(competitionId);
  const direct = logoMap ? logoMap[team.id] : null;
  if (direct) return direct;

  if (competitionId === 'fa-cup-2025-2026' || competitionId === 'carabao-cup-2025-2026') {
    const resolvedId = ENGLISH_TEAM_ID_ALIASES[team.id] || team.id;
    return ENGLISH_TEAM_LOGOS[resolvedId] || ENGLISH_TEAM_LOGOS[team.id] || null;
  }

  return null;
};

const buildTeamLogoMarkup = (team, competitionId) => {
  const logo = getTeamLogoUrl(team, competitionId);
  if (logo) {
    return `<img class="team-logo" src="${logo}" alt="${team.name}" loading="lazy" decoding="async" />`;
  }

  return `<span class="team-logo team-logo-fallback" aria-hidden="true">${getTeamCode(team)}</span>`;
};

const buildTeamSideMarkup = (team, competitionId, isRight = false) => `
  <div class="team-side${isRight ? ' right' : ''}">
    ${buildTeamLogoMarkup(team, competitionId)}
    <span class="team-name">${getTeamCode(team)}</span>
  </div>
`;

const getCupRoundCode = (match) => {
  if (!match) return '';
  if (match.competitionId !== 'fa-cup-2025-2026' && match.competitionId !== 'carabao-cup-2025-2026') return '';
  return getEnglishCupRoundLabel(match.matchday) || '';
};

const buildFixtureCardMarkup = (match) => {
  const homeTeam = getTeamForMatch(match, match.homeTeamId);
  const awayTeam = getTeamForMatch(match, match.awayTeamId);
  const isCompleted = match.status === 'completed';
  const roundCode = getCupRoundCode(match);
  const rawMiddleValue = isCompleted ? `${match.homeScore} - ${match.awayScore}` : formatKickoff(match.matchDate);
  const middleValue = roundCode ? `${roundCode} | ${rawMiddleValue}` : rawMiddleValue;
  const middleClass = isCompleted ? 'score' : 'score upcoming-score';
  const descriptor = isCompleted ? middleValue : `Kick-off ${middleValue}`;

  return `
    <button
      class="match-card fixture-card"
      type="button"
      data-match-id="${match.id}"
      data-matchday="${match.matchday}"
      aria-label="${homeTeam.name} vs ${awayTeam.name} - ${descriptor}"
    >
      ${buildTeamSideMarkup(homeTeam, match.competitionId)}
      <span class="${middleClass}">${middleValue}</span>
      ${buildTeamSideMarkup(awayTeam, match.competitionId, true)}
    </button>
  `;
};

const buildGhostCardMarkup = () => '<div class="match-card ghost" aria-hidden="true"></div>';

const findMatchById = (matchId) => {
  if (!matchId) return null;
  const europaMatch = europaFixturesState.matchesById.get(matchId);
  if (europaMatch) return europaMatch;
  const conferenceMatch = conferenceFixturesState.matchesById.get(matchId);
  if (conferenceMatch) return conferenceMatch;
  const facupMatch = facupFixturesState.matchesById.get(matchId);
  if (facupMatch) return facupMatch;
  const carabaoMatch = carabaocupFixturesState.matchesById.get(matchId);
  if (carabaoMatch) return carabaoMatch;
  const worldcupMatch = worldcupFixturesState.matchesById.get(matchId);
  if (worldcupMatch) return worldcupMatch;
  const buckets = [
    ...premierFixturesState.matchesByMatchday.values(),
    ...championshipFixturesState.matchesByMatchday.values(),
    ...bundesligaFixturesState.matchesByMatchday.values(),
    ...serieAFixturesState.matchesByMatchday.values(),
    ...laligaFixturesState.matchesByMatchday.values(),
    ...ligue1FixturesState.matchesByMatchday.values(),
    ...uclFixturesState.matchesByRound.values()
  ];

  for (const group of buckets) {
    const found = group.find((match) => match.id === matchId);
    if (found) return found;
  }
  return null;
};

const getAllHydratedMatches = () => [
  ...premierFixturesState.matchesByMatchday.values(),
  ...championshipFixturesState.matchesByMatchday.values(),
  ...bundesligaFixturesState.matchesByMatchday.values(),
  ...serieAFixturesState.matchesByMatchday.values(),
  ...laligaFixturesState.matchesByMatchday.values(),
  ...ligue1FixturesState.matchesByMatchday.values(),
  ...uclFixturesState.matchesByRound.values(),
  ...[...europaFixturesState.tiesByRound.values()].flatMap((ties) =>
    (ties || []).flatMap((tie) => [tie?.leg1, tie?.leg2].filter(Boolean))
  ),
  ...[...conferenceFixturesState.tiesByRound.values()].flatMap((ties) =>
    (ties || []).flatMap((tie) => [tie?.leg1, tie?.leg2].filter(Boolean))
  ),
  ...facupFixturesState.matchesByRound.values(),
  ...carabaocupFixturesState.matchesByRound.values(),
  ...worldcupFixturesState.matchesByRound.values()
].flat();

const normalizeRouteMatchName = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase();

const findMatchFromRouteParams = ({ matchId, competitionId, homeName, awayName }) => {
  const exactMatch = findMatchById(matchId);
  if (exactMatch) return exactMatch;
  if (!competitionId && !homeName && !awayName) return null;

  const wantedHome = normalizeRouteMatchName(homeName);
  const wantedAway = normalizeRouteMatchName(awayName);

  return (
    getAllHydratedMatches().find((match) => {
      if (competitionId && match.competitionId !== competitionId) return false;

      const homeTeam = getTeamForMatch(match, match.homeTeamId);
      const awayTeam = getTeamForMatch(match, match.awayTeamId);
      const actualHome = normalizeRouteMatchName(homeTeam?.name);
      const actualAway = normalizeRouteMatchName(awayTeam?.name);

      if (wantedHome && wantedAway) {
        return actualHome === wantedHome && actualAway === wantedAway;
      }

      return Boolean(matchId && match.id === matchId);
    }) || null
  );
};

const buildScoreSheetItems = (count) => {
  if (!Number.isFinite(count) || count <= 0) {
    return '<div class="scoresheet-item scoresheet-item--empty">No scorers yet</div>';
  }
  return Array.from({ length: count }, (_, index) => {
    const minute = 12 + index * 18;
    return `
      <div class="scoresheet-item">
        <div class="scoresheet-item-main">
          <span class="scoresheet-bullet"></span>
          <span class="scoresheet-item-player">SCORER TBD</span>
        </div>
        <div class="scoresheet-item-meta">
          <span class="scoresheet-minute">${minute}'</span>
        </div>
      </div>
    `;
  }).join('');
};

const getShortTeamLabel = (team) => {
  const source = String(team?.shortName || team?.name || '').trim();
  if (!source) return 'TEAM';

  const compact = source.replace(/[^A-Za-z0-9]/g, '');
  if (compact.length <= 4) return compact.toUpperCase();

  const words = source.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const initials = words.map((word) => word[0] || '').join('').toUpperCase();
    if (initials.length >= 2 && initials.length <= 4) return initials;
  }

  return compact.slice(0, 4).toUpperCase();
};

const MATCH_COLOR_DEFAULTS = {
  homePrimary: '#d60b16',
  homeSecondary: '#8c0a11',
  awayPrimary: '#5c0a0a',
  awaySecondary: '#3b0707'
};

const TEAM_COLOR_OVERRIDES = {
  'afc-bournemouth': {
    primary: '#7a0019',
    secondary: '#4b0010'
  },
  arsenal: {
    primary: '#c8102e',
    secondary: '#8f0d1a'
  },
  'aston-villa': {
    primary: '#670e36',
    secondary: '#8db3e2'
  },
  brentford: {
    primary: '#d20000',
    secondary: '#9b0000'
  },
  'brighton-and-hove-albion': {
    primary: '#0057b8',
    secondary: '#ffcd00'
  },
  burnley: {
    primary: '#6c1d45',
    secondary: '#99d6ea'
  },
  chelsea: {
    primary: '#034694',
    secondary: '#002f6c'
  },
  'crystal-palace': {
    primary: '#1b458f',
    secondary: '#c4122e'
  },
  everton: {
    primary: '#003399',
    secondary: '#001f5c'
  },
  fulham: {
    primary: '#111111',
    secondary: '#cc0000'
  },
  'leeds-united': {
    primary: '#1d428a',
    secondary: '#ffcd00'
  },
  liverpool: {
    primary: '#c8102e',
    secondary: '#8a0b1c'
  },
  'manchester-city': {
    primary: '#6cabdd',
    secondary: '#1c2c5b'
  },
  'manchester-united': {
    primary: '#da291c',
    secondary: '#f4a300'
  },
  'newcastle-united': {
    primary: '#111111',
    secondary: '#444444'
  },
  'nottingham-forest': {
    primary: '#dd0000',
    secondary: '#8e0000'
  },
  sunderland: {
    primary: '#e41b17',
    secondary: '#b00000'
  },
  'tottenham-hotspur': {
    primary: '#132257',
    secondary: '#0a1230'
  },
  'west-ham-united': {
    primary: '#7a263a',
    secondary: '#1bb1e7'
  },
  'wolverhampton-wanderers': {
    primary: '#fdb913',
    secondary: '#2e2e2e'
  },
  // Bundesliga
  augsburg: {
    primary: '#c8102e',
    secondary: '#007a3d'
  },
  'b-monchengladbach': {
    primary: '#111111',
    secondary: '#007a3d'
  },
  'bayer-leverkusen': {
    primary: '#e30613',
    secondary: '#111111'
  },
  'bayern-munich': {
    primary: '#dc052d',
    secondary: '#8e0022'
  },
  dortmund: {
    primary: '#fde100',
    secondary: '#111111'
  },
  'eintracht-frankfurt': {
    primary: '#111111',
    secondary: '#e1001a'
  },
  'fc-koln': {
    primary: '#c8102e',
    secondary: '#8b0b1c'
  },
  freiburg: {
    primary: '#e2001a',
    secondary: '#111111'
  },
  'hamburger-sv': {
    primary: '#0066b2',
    secondary: '#111111'
  },
  heidenheim: {
    primary: '#c8102e',
    secondary: '#004b8d'
  },
  hoffenheim: {
    primary: '#1e4f9c',
    secondary: '#4aa3df'
  },
  mainz: {
    primary: '#c8102e',
    secondary: '#8b0b1c'
  },
  'rb-leipzig': {
    primary: '#dd0741',
    secondary: '#0b1c3f'
  },
  'st-pauli': {
    primary: '#4e3629',
    secondary: '#a67c52'
  },
  stuttgart: {
    primary: '#e30613',
    secondary: '#b10000'
  },
  'union-berlin': {
    primary: '#d0001a',
    secondary: '#f7d117'
  },
  'werder-bremen': {
    primary: '#1d9053',
    secondary: '#136a3f'
  },
  wolfsburg: {
    primary: '#65b32e',
    secondary: '#2f6b1a'
  },
  // Serie A
  'ac-milan': {
    primary: '#d50032',
    secondary: '#111111'
  },
  'as-roma': {
    primary: '#8e1f2f',
    secondary: '#f9b300'
  },
  atalanta: {
    primary: '#1f4e99',
    secondary: '#111111'
  },
  bologna: {
    primary: '#c8102e',
    secondary: '#14274e'
  },
  cagliari: {
    primary: '#c8102e',
    secondary: '#002d62'
  },
  como: {
    primary: '#0b63ce',
    secondary: '#02325f'
  },
  cremonese: {
    primary: '#d50032',
    secondary: '#777777'
  },
  fiorentina: {
    primary: '#5b2d82',
    secondary: '#3a1b5c'
  },
  genoa: {
    primary: '#c8102e',
    secondary: '#0b1c3f'
  },
  inter: {
    primary: '#00529f',
    secondary: '#111111'
  },
  juventus: {
    primary: '#111111',
    secondary: '#f2f2f2'
  },
  lazio: {
    primary: '#75b5e7',
    secondary: '#1f4a99'
  },
  lecce: {
    primary: '#f4c300',
    secondary: '#d0001a'
  },
  napoli: {
    primary: '#1f65c1',
    secondary: '#0f3d8c'
  },
  parma: {
    primary: '#fcd116',
    secondary: '#003399'
  },
  pisa: {
    primary: '#0b1c3f',
    secondary: '#111111'
  },
  sassuolo: {
    primary: '#00a859',
    secondary: '#111111'
  },
  torino: {
    primary: '#7c2635',
    secondary: '#4b161f'
  },
  udinese: {
    primary: '#111111',
    secondary: '#444444'
  },
  verona: {
    primary: '#fcd116',
    secondary: '#0033a0'
  },
  // Ligue 1
  angers: {
    primary: '#111111',
    secondary: '#444444'
  },
  auxerre: {
    primary: '#0052a5',
    secondary: '#f2f2f2'
  },
  brest: {
    primary: '#d50032',
    secondary: '#8b0b1c'
  },
  'le-havre': {
    primary: '#00a0e0',
    secondary: '#005e88'
  },
  lens: {
    primary: '#d50032',
    secondary: '#f2a900'
  },
  lille: {
    primary: '#d50032',
    secondary: '#132257'
  },
  lorient: {
    primary: '#f47b20',
    secondary: '#111111'
  },
  lyon: {
    primary: '#0033a0',
    secondary: '#c8102e'
  },
  marseille: {
    primary: '#00a1de',
    secondary: '#005e88'
  },
  metz: {
    primary: '#7a263a',
    secondary: '#3b111d'
  },
  monaco: {
    primary: '#ce1126',
    secondary: '#9b0b0f'
  },
  nantes: {
    primary: '#ffd100',
    secondary: '#007a3d'
  },
  nice: {
    primary: '#111111',
    secondary: '#e1001a'
  },
  'paris-fc': {
    primary: '#003a6c',
    secondary: '#a50034'
  },
  psg: {
    primary: '#004170',
    secondary: '#da291c'
  },
  rennes: {
    primary: '#e30613',
    secondary: '#111111'
  },
  strasbourg: {
    primary: '#0096d6',
    secondary: '#e1001a'
  },
  toulouse: {
    primary: '#5a2a82',
    secondary: '#3b1a5c'
  },
  // La Liga
  alaves: {
    primary: '#0057b8',
    secondary: '#0b2a6f'
  },
  'ath-bilbao': {
    primary: '#e1001a',
    secondary: '#9b0b1c'
  },
  'atl-madrid': {
    primary: '#c8102e',
    secondary: '#1f4e99'
  },
  barcelona: {
    primary: '#a50044',
    secondary: '#004d98'
  },
  betis: {
    primary: '#00954c',
    secondary: '#005b2e'
  },
  'celta-vigo': {
    primary: '#6cabdd',
    secondary: '#1b4f9c'
  },
  elche: {
    primary: '#007a3d',
    secondary: '#004b24'
  },
  espanyol: {
    primary: '#0057b8',
    secondary: '#0b2a6f'
  },
  getafe: {
    primary: '#005bac',
    secondary: '#0b2a6f'
  },
  girona: {
    primary: '#c8102e',
    secondary: '#8b0b1c'
  },
  levante: {
    primary: '#7a263a',
    secondary: '#1b4f9c'
  },
  mallorca: {
    primary: '#d50032',
    secondary: '#111111'
  },
  osasuna: {
    primary: '#c8102e',
    secondary: '#001f5c'
  },
  oviedo: {
    primary: '#0057b8',
    secondary: '#0b2a6f'
  },
  'rayo-vallecano': {
    primary: '#e30613',
    secondary: '#8b0b1c'
  },
  'real-madrid': {
    primary: '#e1b760',
    secondary: '#1f4e99'
  },
  'real-sociedad': {
    primary: '#0057b8',
    secondary: '#0b2a6f'
  },
  sevilla: {
    primary: '#d50032',
    secondary: '#8b0b1c'
  },
  valencia: {
    primary: '#111111',
    secondary: '#f7941d'
  },
  villarreal: {
    primary: '#fde100',
    secondary: '#0066b3'
  },
  // Champions League extra ids
  ajax: {
    primary: '#d50032',
    secondary: '#8b0b1c'
  },
  'athletic-bilbao': {
    primary: '#e1001a',
    secondary: '#9b0b1c'
  },
  'atletico-madrid': {
    primary: '#c8102e',
    secondary: '#1f4e99'
  },
  benfica: {
    primary: '#e41b17',
    secondary: '#b00000'
  },
  'bodo-glimt': {
    primary: '#ffd100',
    secondary: '#111111'
  },
  'borussia-dortmund': {
    primary: '#fde100',
    secondary: '#111111'
  },
  'club-brugge': {
    primary: '#0057b8',
    secondary: '#111111'
  },
  'fc-copenhagen': {
    primary: '#0d2c5a',
    secondary: '#d0102a'
  },
  galatasaray: {
    primary: '#e41b17',
    secondary: '#f4c300'
  },
  'kairat-almaty': {
    primary: '#f4c300',
    secondary: '#111111'
  },
  olympiacos: {
    primary: '#e41b17',
    secondary: '#b00000'
  },
  pafos: {
    primary: '#1f4e99',
    secondary: '#0b2a6f'
  },
  psv: {
    primary: '#d50032',
    secondary: '#8b0b1c'
  },
  qarabag: {
    primary: '#111111',
    secondary: '#f47b20'
  },
  'slavia-prague': {
    primary: '#d50032',
    secondary: '#8b0b1c'
  },
  'sporting-cp': {
    primary: '#008c45',
    secondary: '#004b23'
  },
  'union-sg': {
    primary: '#f4c300',
    secondary: '#0033a0'
  }
};

const matchLogoColorCache = new Map();

const clampChannel = (value) => Math.max(0, Math.min(255, Math.round(value)));

const rgbToHex = (r, g, b) =>
  `#${[r, g, b]
    .map((channel) => clampChannel(channel).toString(16).padStart(2, '0'))
    .join('')}`;

const adjustLuminance = (color, factor) => ({
  r: clampChannel(color.r * factor),
  g: clampChannel(color.g * factor),
  b: clampChannel(color.b * factor)
});

const normalizeDominantColor = (color) => {
  const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
  if (luminance < 70) {
    return {
      r: clampChannel(color.r + (255 - color.r) * 0.35),
      g: clampChannel(color.g + (255 - color.g) * 0.35),
      b: clampChannel(color.b + (255 - color.b) * 0.35)
    };
  }
  if (luminance > 170) {
    return adjustLuminance(color, 0.7);
  }
  return color;
};

const extractDominantColor = (image) => {
  const canvas = document.createElement('canvas');
  const size = 32;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(image, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  const buckets = new Map();
  let fallbackR = 0;
  let fallbackG = 0;
  let fallbackB = 0;
  let fallbackCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 60) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    fallbackR += r;
    fallbackG += g;
    fallbackB += b;
    fallbackCount += 1;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max - min;
    if (max < 30) continue;
    if (max > 230 && saturation < 20) continue;

    const step = 24;
    const qr = clampChannel(Math.round(r / step) * step);
    const qg = clampChannel(Math.round(g / step) * step);
    const qb = clampChannel(Math.round(b / step) * step);
    const key = `${qr},${qg},${qb}`;
    const weight = 1 + saturation / 32;
    buckets.set(key, (buckets.get(key) || 0) + weight);
  }

  if (buckets.size) {
    let topKey = null;
    let topScore = -1;
    for (const [key, score] of buckets.entries()) {
      if (score > topScore) {
        topScore = score;
        topKey = key;
      }
    }
    if (topKey) {
      const [r, g, b] = topKey.split(',').map(Number);
      return { r, g, b };
    }
  }

  if (!fallbackCount) return null;
  return {
    r: clampChannel(fallbackR / fallbackCount),
    g: clampChannel(fallbackG / fallbackCount),
    b: clampChannel(fallbackB / fallbackCount)
  };
};

const getLogoColors = (logoUrl) => {
  if (!logoUrl) return Promise.resolve(null);
  if (matchLogoColorCache.has(logoUrl)) {
    return Promise.resolve(matchLogoColorCache.get(logoUrl));
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const dominant = extractDominantColor(image);
      if (!dominant) {
        resolve(null);
        return;
      }
      const normalized = normalizeDominantColor(dominant);
      const secondary = adjustLuminance(normalized, 0.75);
      const payload = {
        primary: rgbToHex(normalized.r, normalized.g, normalized.b),
        secondary: rgbToHex(secondary.r, secondary.g, secondary.b)
      };
      matchLogoColorCache.set(logoUrl, payload);
      resolve(payload);
    };
    image.onerror = () => resolve(null);
    image.src = logoUrl;
  });
};

const applyMatchBoardColors = (matchBoard, matchId, homeTeamId, awayTeamId, homeLogoUrl, awayLogoUrl) => {
  if (!matchBoard) return;
  matchBoard.dataset.matchId = matchId;
  matchBoard.style.setProperty('--home-primary', MATCH_COLOR_DEFAULTS.homePrimary);
  matchBoard.style.setProperty('--home-secondary', MATCH_COLOR_DEFAULTS.homeSecondary);
  matchBoard.style.setProperty('--away-primary', MATCH_COLOR_DEFAULTS.awayPrimary);
  matchBoard.style.setProperty('--away-secondary', MATCH_COLOR_DEFAULTS.awaySecondary);

  const currentMatchId = matchId;
  const homeOverride = homeTeamId ? TEAM_COLOR_OVERRIDES[homeTeamId] : null;
  const awayOverride = awayTeamId ? TEAM_COLOR_OVERRIDES[awayTeamId] : null;

  if (homeOverride) {
    matchBoard.style.setProperty('--home-primary', homeOverride.primary);
    matchBoard.style.setProperty('--home-secondary', homeOverride.secondary);
  } else if (homeLogoUrl) {
    getLogoColors(homeLogoUrl).then((colors) => {
      if (!colors || matchBoard.dataset.matchId !== currentMatchId) return;
      matchBoard.style.setProperty('--home-primary', colors.primary);
      matchBoard.style.setProperty('--home-secondary', colors.secondary);
    });
  }

  if (awayOverride) {
    matchBoard.style.setProperty('--away-primary', awayOverride.primary);
    matchBoard.style.setProperty('--away-secondary', awayOverride.secondary);
  } else if (awayLogoUrl) {
    getLogoColors(awayLogoUrl).then((colors) => {
      if (!colors || matchBoard.dataset.matchId !== currentMatchId) return;
      matchBoard.style.setProperty('--away-primary', colors.primary);
      matchBoard.style.setProperty('--away-secondary', colors.secondary);
    });
  }
};

const normalizeFieldStats = () => {
  const statItems = document.querySelectorAll('.field .player-stats .stat-ga');
  statItems.forEach((item) => {
    if (item.classList.contains('goal')) {
      item.textContent = 'G0';
    } else if (item.classList.contains('assist')) {
      item.textContent = 'A0';
    }
  });
};

const MATCH_LINEUP_LAYOUT = {
  home: [
    { left: 8, top: 50, role: 'GK' },
    { left: 22, top: 22, role: 'DEF' },
    { left: 18, top: 40, role: 'DEF' },
    { left: 18, top: 60, role: 'DEF' },
    { left: 22, top: 80, role: 'DEF' },
    { left: 34, top: 32, role: 'MID' },
    { left: 34, top: 50, role: 'MID' },
    { left: 34, top: 68, role: 'MID' },
    { left: 46, top: 26, role: 'FWD' },
    { left: 46, top: 52, role: 'FWD' },
    { left: 46, top: 78, role: 'FWD' }
  ],
  away: [
    { left: 92, top: 50, role: 'GK' },
    { left: 78, top: 22, role: 'DEF' },
    { left: 82, top: 40, role: 'DEF' },
    { left: 82, top: 60, role: 'DEF' },
    { left: 78, top: 80, role: 'DEF' },
    { left: 66, top: 32, role: 'MID' },
    { left: 66, top: 50, role: 'MID' },
    { left: 66, top: 68, role: 'MID' },
    { left: 54, top: 26, role: 'FWD' },
    { left: 54, top: 52, role: 'FWD' },
    { left: 54, top: 78, role: 'FWD' }
  ]
};

const MATCH_LINEUP_LAYOUT_MOBILE_EMBED = {
  home: [
    { left: 49, top: 94, role: 'GK' },
    { left: 8, top: 82, role: 'DEF' },
    { left: 31, top: 85, role: 'DEF' },
    { left: 61, top: 85, role: 'DEF' },
    { left: 84, top: 82, role: 'DEF' },
    { left: 18, top: 67, role: 'MID' },
    { left: 46, top: 72, role: 'MID' },
    { left: 74, top: 67, role: 'MID' },
    { left: 9, top: 55, role: 'FWD' },
    { left: 46, top: 54, role: 'FWD' },
    { left: 83, top: 55, role: 'FWD' }
  ],
  away: [
    { left: 49, top: 9, role: 'GK' },
    { left: 8, top: 21, role: 'DEF' },
    { left: 31, top: 18, role: 'DEF' },
    { left: 61, top: 18, role: 'DEF' },
    { left: 84, top: 21, role: 'DEF' },
    { left: 18, top: 32, role: 'MID' },
    { left: 46, top: 27, role: 'MID' },
    { left: 74, top: 32, role: 'MID' },
    { left: 9, top: 42, role: 'FWD' },
    { left: 46, top: 41, role: 'FWD' },
    { left: 83, top: 42, role: 'FWD' }
  ]
};

const MATCH_BENCH_SIZE = 7;
const MATCH_LINEUP_LEAGUES = {
  'premier-league-2025-2026': 'premier',
  'fa-cup-2025-2026': 'premier',
  'carabao-cup-2025-2026': 'premier',
  'serie-a-2025-2026': 'seriea',
  'bundesliga-2025-2026': 'bundesliga'
};

let activeMatchLineupRequest = 0;
let activeMatchStatsPanelState = null;

const isMobileMatchEmbedMode = () =>
  typeof document !== 'undefined' && document.body.classList.contains('match-mobile-embed-mode');

const getActiveFieldLineupLayout = () =>
  isMobileMatchEmbedMode() ? MATCH_LINEUP_LAYOUT_MOBILE_EMBED : MATCH_LINEUP_LAYOUT;

const parsePlayerNumber = (value) => {
  const match = String(value || '').match(/\d+/);
  return match ? match[0] : '--';
};

const parseStatNumber = (value) => {
  const match = String(value || '').match(/-?\d+/);
  return match ? Number.parseInt(match[0], 10) : 0;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const hashString = (value) => {
  let hash = 2166136261;
  const input = String(value || '');
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createSeededRandom = (seedValue) => {
  let seed = hashString(seedValue) || 1;
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

const randInt = (random, min, max) => Math.round(min + random() * (max - min));

const getLineupLeagueKey = (competitionId) => MATCH_LINEUP_LEAGUES[competitionId] || null;

const normalizeRosterPosition = (position) => {
  const upper = String(position || '').toUpperCase();
  if (upper.includes('GK')) return 'GK';
  if (upper.includes('DEF') || upper.includes('CB') || upper.includes('LB') || upper.includes('RB') || upper.includes('WB')) {
    return 'DEF';
  }
  if (
    upper.includes('MID') ||
    upper.includes('DM') ||
    upper.includes('CM') ||
    upper.includes('AM') ||
    upper.includes('LM') ||
    upper.includes('RM')
  ) {
    return 'MID';
  }
  if (upper.includes('FWD') || upper.includes('FW') || upper.includes('ST') || upper.includes('CF') || upper.includes('WG')) {
    return 'FWD';
  }
  return 'MID';
};

const getRosterSortScore = (player) =>
  parseStatNumber(player.appearances) * 10000 +
  parseStatNumber(player.minutes) * 10 +
  parseStatNumber(player.goals) * 100 +
  parseStatNumber(player.assists) * 50 +
  (player.photo ? 25 : 0);

const sortRosterPlayers = (roster = []) =>
  [...roster].sort((left, right) => {
    const scoreDiff = getRosterSortScore(right) - getRosterSortScore(left);
    if (scoreDiff !== 0) return scoreDiff;
    return String(left.name || '').localeCompare(String(right.name || ''));
  });

const takePlayers = (source, count, usedNames) => {
  const selected = [];
  for (const player of source) {
    if (selected.length >= count) break;
    const key = String(player.name || '').toLowerCase();
    if (usedNames.has(key)) continue;
    usedNames.add(key);
    selected.push(player);
  }
  return selected;
};

const buildLineupFromRoster = (roster = []) => {
  const ordered = sortRosterPlayers(roster);
  const grouped = {
    GK: ordered.filter((player) => normalizeRosterPosition(player.position) === 'GK'),
    DEF: ordered.filter((player) => normalizeRosterPosition(player.position) === 'DEF'),
    MID: ordered.filter((player) => normalizeRosterPosition(player.position) === 'MID'),
    FWD: ordered.filter((player) => normalizeRosterPosition(player.position) === 'FWD')
  };

  const usedNames = new Set();
  const starters = [
    ...takePlayers(grouped.GK, 1, usedNames),
    ...takePlayers(grouped.DEF, 4, usedNames),
    ...takePlayers(grouped.MID, 3, usedNames),
    ...takePlayers(grouped.FWD, 3, usedNames)
  ];

  const remaining = ordered.filter((player) => !usedNames.has(String(player.name || '').toLowerCase()));
  while (starters.length < 11 && remaining.length) {
    const player = remaining.shift();
    usedNames.add(String(player.name || '').toLowerCase());
    starters.push(player);
  }

  const bench = remaining.slice(0, MATCH_BENCH_SIZE);
  return { starters, bench };
};

const getPlayerDisplayName = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'PLAYER';
  if (parts.length === 1) return parts[0].slice(0, 12).toUpperCase();
  return parts.at(-1).slice(0, 12).toUpperCase();
};

const getPlayerInitials = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map((part) => part[0] || '').join('') || 'PL').toUpperCase();
};

const buildEmptyMatchStats = (lineup = []) =>
  Object.fromEntries(
    lineup.map((player) => [
      player.name,
      {
        rating: null,
        goals: 0,
        assists: 0,
        motm: false
      }
    ])
  );

const getGoalWeight = (player) => {
  const position = normalizeRosterPosition(player.position);
  const seasonGoals = parseStatNumber(player.goals);
  const base =
    position === 'FWD' ? 8 : position === 'MID' ? 4.5 : position === 'DEF' ? 1.8 : 0.2;
  return base + seasonGoals * 0.35;
};

const getAssistWeight = (player) => {
  const position = normalizeRosterPosition(player.position);
  const seasonAssists = parseStatNumber(player.assists);
  const base =
    position === 'MID' ? 7 : position === 'FWD' ? 5.5 : position === 'DEF' ? 2.2 : 0.1;
  return base + seasonAssists * 0.45;
};

const pickWeightedPlayer = (players, weightFn, random) => {
  if (!players.length) return null;
  const weighted = players.map((player) => ({
    player,
    weight: Math.max(0.1, weightFn(player))
  }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let threshold = random() * total;
  for (const item of weighted) {
    threshold -= item.weight;
    if (threshold <= 0) return item.player;
  }
  return weighted.at(-1)?.player || null;
};

const buildTeamMatchStats = (teamKey, lineup, goalsFor, goalsAgainst) => {
  const random = createSeededRandom(teamKey);
  const starters = lineup.filter(Boolean);
  const stats = buildEmptyMatchStats(starters);
  const events = [];

  const scoringPool = starters.filter((player) => normalizeRosterPosition(player.position) !== 'GK');
  for (let goalIndex = 0; goalIndex < goalsFor; goalIndex += 1) {
    const scorer = pickWeightedPlayer(scoringPool, getGoalWeight, random);
    if (!scorer) break;
    stats[scorer.name].goals += 1;

    let assister = null;
    const canAssist = scoringPool.filter((player) => player.name !== scorer.name);
    if (canAssist.length && random() > 0.18) {
      assister = pickWeightedPlayer(canAssist, getAssistWeight, random);
      if (assister) {
        stats[assister.name].assists += 1;
      }
    }

    const minute = clamp(Math.round(7 + random() * 82 + goalIndex * 2), 4, 90);
    events.push({
      scorer: scorer.name,
      assist: assister?.name || null,
      minute
    });
  }

  events.sort((left, right) => left.minute - right.minute);

  starters.forEach((player) => {
    const playerStats = stats[player.name];
    const position = normalizeRosterPosition(player.position);
    let rating = 6.1 + random() * 1.1;

    if (goalsFor > goalsAgainst) rating += 0.35;
    else if (goalsFor < goalsAgainst) rating -= 0.2;
    else rating += 0.08;

    if (position === 'GK' || position === 'DEF') {
      if (goalsAgainst === 0) rating += 0.55;
      else rating -= goalsAgainst * 0.08;
    }

    if (position === 'MID') rating += playerStats.assists * 0.2;
    if (position === 'FWD' && goalsFor === 0) rating -= 0.18;

    rating += playerStats.goals * 0.95;
    rating += playerStats.assists * 0.55;
    playerStats.rating = clamp(Math.round(rating * 10) / 10, 5.8, 9.8);
  });

  return { stats, events };
};

const buildShotProfile = (random, goalsFor, possession, goalsAgainst) => {
  const shots = clamp(Math.round(6 + possession / 8 + goalsFor * 2 + random() * 5 - goalsAgainst * 0.3), 4, 24);
  const maxOnTarget = Math.max(goalsFor, shots - 1);
  const onTarget = clamp(goalsFor + randInt(random, 1, 4), goalsFor, maxOnTarget);
  const remainingAfterOnTarget = Math.max(1, shots - onTarget);
  const offTarget = clamp(
    randInt(random, 1, Math.max(1, remainingAfterOnTarget - 1)),
    1,
    remainingAfterOnTarget
  );
  const blocked = Math.max(0, shots - onTarget - offTarget);
  const bigChances = clamp(goalsFor + randInt(random, 0, 3), 0, onTarget);
  return { shots, shotsOnTarget: onTarget, shotsOffTarget: offTarget, shotsBlocked: blocked, bigChances };
};

const PASS_MAP_LINKS = [
  [0, 2, 1.0],
  [0, 3, 1.0],
  [1, 5, 0.9],
  [2, 5, 1.25],
  [2, 6, 1.15],
  [3, 6, 1.2],
  [4, 7, 0.9],
  [5, 8, 1.0],
  [5, 9, 1.15],
  [6, 9, 1.2],
  [6, 10, 1.0],
  [7, 10, 0.95],
  [8, 9, 0.85],
  [9, 10, 0.85]
];

const getMiniPitchPosition = (side, slot) => {
  const normalizedY = ((slot.top - 22) / (78 - 22)) * 74 + 13;
  if (side === 'home') {
    return {
      x: ((slot.left - 8) / (46 - 8)) * 78 + 11,
      y: normalizedY
    };
  }
  return {
    x: ((92 - slot.left) / (92 - 54)) * 78 + 11,
    y: normalizedY
  };
};

const getMiniPlayerLabel = (player) => {
  const display = getPlayerDisplayName(player?.name || '');
  return display.slice(0, 3).toUpperCase();
};

const getPassRoleWeight = (role) => {
  if (role === 'GK') return 0.72;
  if (role === 'DEF') return 1.02;
  if (role === 'MID') return 1.28;
  return 0.86;
};

const distributeWeightedCounts = (items, total) => {
  if (!items.length) return [];
  if (total <= 0) return items.map(() => 0);

  const weights = items.map((item) => Math.max(0.01, Number(item.weight) || 0.01));
  const rankedIndexes = weights
    .map((weight, index) => ({ weight, index }))
    .sort((left, right) => right.weight - left.weight)
    .map((entry) => entry.index);

  if (total <= items.length) {
    const counts = items.map(() => 0);
    rankedIndexes.slice(0, total).forEach((index) => {
      counts[index] = 1;
    });
    return counts;
  }

  const counts = items.map(() => 1);
  let remaining = total - items.length;
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const rawShares = weights.map((weight) => (remaining * weight) / totalWeight);
  const integerShares = rawShares.map((share) => Math.floor(share));

  integerShares.forEach((share, index) => {
    counts[index] += share;
    remaining -= share;
  });

  const remainderOrder = rawShares
    .map((share, index) => ({ index, fraction: share - integerShares[index] }))
    .sort((left, right) => right.fraction - left.fraction);

  let cursor = 0;
  while (remaining > 0) {
    const nextIndex = remainderOrder[cursor % remainderOrder.length]?.index ?? rankedIndexes[0] ?? 0;
    counts[nextIndex] += 1;
    remaining -= 1;
    cursor += 1;
  }

  return counts;
};

const buildPassMapData = (side, starters = [], completedPasses = 0) => {
  const random = createSeededRandom(`${side}:${completedPasses}:${starters.map((player) => player?.name || '').join('|')}`);
  const layout = MATCH_LINEUP_LAYOUT[side];
  const nodes = starters.slice(0, layout.length).map((player, index) => {
    const slot = layout[index];
    const { x, y } = getMiniPitchPosition(side, slot);
    return {
      id: `${side}-${index}`,
      x,
      y,
      number: parsePlayerNumber(player?.number),
      label: getMiniPlayerLabel(player),
      name: player?.name || '',
      role: normalizeRosterPosition(player?.position),
      shortName: getPlayerDisplayName(player?.name || '')
    };
  });

  if (!nodes.length) {
    return { nodes: [], players: [], defaultPlayerId: null, totalPasses: completedPasses };
  }

  const playerBudgets = nodes.map((node) => ({
    weight: getPassRoleWeight(node.role) * (0.88 + random() * 0.34)
  }));
  const playerPassCounts = distributeWeightedCounts(playerBudgets, Math.max(22, completedPasses));

  const players = nodes.map((node, index) => {
    const playerRandom = createSeededRandom(`${side}:${node.name}:${completedPasses}:targets`);
    const targets = nodes
      .map((targetNode, targetIndex) => {
        if (targetIndex === index) return null;
        const dx = node.x - targetNode.x;
        const dy = node.y - targetNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const progressiveDistance = side === 'home' ? targetNode.x - node.x : node.x - targetNode.x;
        const sameLaneBoost = Math.abs(node.y - targetNode.y) < 18 ? 1.08 : 1;
        const roleBoost =
          node.role === 'MID'
            ? targetNode.role === 'FWD'
              ? 1.12
              : 1.03
            : node.role === 'DEF'
              ? targetNode.role === 'MID'
                ? 1.1
                : 0.98
              : node.role === 'GK'
                ? targetNode.role === 'DEF'
                  ? 1.18
                  : 0.9
                : 1;
        const weight =
          (1 / Math.max(0.7, distance / 18)) *
          (progressiveDistance > 0 ? 1.15 : 0.92) *
          sameLaneBoost *
          roleBoost *
          (0.82 + playerRandom() * 0.34);
        return { targetIndex, weight };
      })
      .filter(Boolean)
      .sort((left, right) => right.weight - left.weight)
      .slice(0, 5);

    const totalPasses = playerPassCounts[index] || 0;
    const targetCounts = distributeWeightedCounts(targets, totalPasses);

    return {
      ...node,
      totalPasses,
      targets: targets.map((target, targetIndex) => {
        const count = targetCounts[targetIndex] || 0;
        return {
          to: nodes[target.targetIndex].id,
          count,
          strokeWidth: clamp(0.28 + count / 60, 0.32, 0.95),
          opacity: clamp(0.12 + count / 150, 0.12, 0.42)
        };
      })
    };
  });

  const defaultPlayerId =
    players
      .slice()
      .sort((left, right) => {
        const roleScore = (role) => {
          if (role === 'MID') return 4;
          if (role === 'FWD') return 3;
          if (role === 'DEF') return 2;
          return 1;
        };
        if (roleScore(right.role) !== roleScore(left.role)) return roleScore(right.role) - roleScore(left.role);
        return right.totalPasses - left.totalPasses;
      })[0]?.id || players[0]?.id || null;

  return { nodes, players, defaultPlayerId, totalPasses: completedPasses };
};

const buildTeamSummaryStats = (seedKey, side, lineup, goalsFor, goalsAgainst, possession) => {
  const random = createSeededRandom(`${seedKey}:${side}:summary`);
  const shotProfile = buildShotProfile(random, goalsFor, possession, goalsAgainst);
  const attemptedPasses = Math.round(240 + possession * 5.2 + randInt(random, 0, 80));
  const passAccuracy = clamp(Math.round(76 + possession * 0.16 + random() * 6), 76, 93);
  const completedPasses = Math.round((attemptedPasses * passAccuracy) / 100);
  const dribbles = clamp(Math.round(5 + random() * 9 + goalsFor), 3, 22);
  const dispossessed = clamp(Math.round(7 + random() * 9 + Math.max(0, 50 - possession) / 8), 4, 22);
  const tackles = clamp(Math.round(10 + random() * 10 + goalsAgainst), 7, 26);
  const interceptions = clamp(Math.round(5 + random() * 8 + goalsAgainst * 0.6), 4, 18);
  const corners = clamp(Math.round(2 + random() * 5 + shotProfile.shots / 6), 1, 12);
  const fouls = clamp(Math.round(7 + random() * 7 + (50 - possession) / 10), 5, 20);
  const xg = Math.max(0.45, goalsFor * 0.74 + shotProfile.shotsOnTarget * 0.21 + random() * 0.8);

  return {
    possession,
    passes: completedPasses,
    passAccuracy,
    shots: shotProfile.shots,
    shotsOnTarget: shotProfile.shotsOnTarget,
    shotsOffTarget: shotProfile.shotsOffTarget,
    shotsBlocked: shotProfile.shotsBlocked,
    bigChances: shotProfile.bigChances,
    corners,
    dribbles,
    dispossessed,
    tackles,
    interceptions,
    fouls,
    xg: Math.round(xg * 100) / 100,
    passMap: buildPassMapData(side, lineup.starters, completedPasses)
  };
};

const MATCH_COMPARISON_METRICS = [
  { key: 'possession', label: 'Possession', format: 'percent' },
  { key: 'passes', label: 'Passes' },
  { key: 'passAccuracy', label: 'Pass Accuracy', format: 'percent' },
  { key: 'shots', label: 'Shots' },
  { key: 'shotsOnTarget', label: 'On Target' },
  { key: 'shotsOffTarget', label: 'Off Target' },
  { key: 'shotsBlocked', label: 'Blocked' },
  { key: 'bigChances', label: 'Big Chances' },
  { key: 'corners', label: 'Corners' },
  { key: 'dribbles', label: 'Dribbles' },
  { key: 'dispossessed', label: 'Dispossessed' },
  { key: 'tackles', label: 'Tackles' },
  { key: 'interceptions', label: 'Interceptions' },
  { key: 'fouls', label: 'Fouls' },
  { key: 'xg', label: 'Expected Goals', format: 'decimal' }
];

const formatComparisonValue = (metric, value) => {
  if (metric.format === 'percent') return `${Math.round(value)}%`;
  if (metric.format === 'decimal') return Number(value).toFixed(2);
  return String(Math.round(value));
};

const buildComparisonRowsMarkup = (summary) =>
  MATCH_COMPARISON_METRICS.map((metric) => {
    const homeValue = Number(summary.home[metric.key] || 0);
    const awayValue = Number(summary.away[metric.key] || 0);
    const total =
      metric.format === 'percent'
        ? 100
        : metric.format === 'decimal'
          ? Math.max(homeValue + awayValue, 0.1)
          : Math.max(homeValue + awayValue, 1);
    const homeWidth = clamp((homeValue / total) * 100, 0, 100);
    const awayWidth = clamp((awayValue / total) * 100, 0, 100);

    return `
      <div class="match-compare-row">
        <span class="match-compare-value match-compare-value--home">${formatComparisonValue(metric, homeValue)}</span>
        <div class="match-compare-middle">
          <span class="match-compare-label">${metric.label}</span>
          <div class="match-compare-bar">
            <span class="match-compare-fill match-compare-fill--home" style="width:${homeWidth}%;"></span>
            <span class="match-compare-fill match-compare-fill--away" style="width:${awayWidth}%;"></span>
          </div>
        </div>
        <span class="match-compare-value match-compare-value--away">${formatComparisonValue(metric, awayValue)}</span>
      </div>
    `;
  }).join('');

const getSelectedPassMapPlayer = (passMap, selectedPlayerId) =>
  (passMap?.players || []).find((player) => player.id === selectedPlayerId) ||
  (passMap?.players || []).find((player) => player.id === passMap?.defaultPlayerId) ||
  (passMap?.players || [])[0] ||
  null;

const buildPassSelectorMarkup = (passMap, side, selectedPlayerId) => {
  const players = passMap?.players || [];
  if (!players.length) {
    return `
      <label class="match-stats-select-wrap">
        <span class="match-stats-select-label">Player</span>
        <select class="match-stats-select" disabled>
          <option>No player data</option>
        </select>
      </label>
    `;
  }

  const selectedId = getSelectedPassMapPlayer(passMap, selectedPlayerId)?.id || '';
  const optionMarkup = players
    .map(
      (player) =>
        `<option value="${player.id}"${player.id === selectedId ? ' selected' : ''}>${player.shortName}</option>`
    )
    .join('');

  return `
    <label class="match-stats-select-wrap" for="match-stats-${side}-player-select">
      <span class="match-stats-select-label">Player</span>
      <select class="match-stats-select" id="match-stats-${side}-player-select">
        ${optionMarkup}
      </select>
    </label>
  `;
};

const buildPassMapMarkup = (passMap = { nodes: [], players: [] }, side = 'home', selectedPlayerId = null) => {
  const selectedPlayer = getSelectedPassMapPlayer(passMap, selectedPlayerId);
  if (!selectedPlayer) {
    return {
      markup: '<div class="match-pass-map-placeholder">No passing data</div>',
      selectedPlayer: null
    };
  }

  const nodeById = new Map((passMap.nodes || []).map((node) => [node.id, node]));
  const targetIdSet = new Set(selectedPlayer.targets.map((target) => target.to));

  const lineMarkup = selectedPlayer.targets
    .map((target) => {
      const from = nodeById.get(selectedPlayer.id);
      const to = nodeById.get(target.to);
      if (!from || !to) return '';
      return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" style="stroke-width:${target.strokeWidth}; opacity:${target.opacity};" />`;
    })
    .join('');

  const nodeMarkup = (passMap.nodes || [])
    .map((node) => {
      const stateClass =
        node.id === selectedPlayer.id
          ? ' is-selected'
          : targetIdSet.has(node.id)
            ? ' is-target'
            : ' is-muted';
      return `
        <div class="pass-map-node pass-map-node--${side}${stateClass}" style="left:${node.x}%; top:${node.y}%;">
          <span class="pass-map-node-dot">${node.number}</span>
          <span class="pass-map-node-label">${node.label}</span>
        </div>
      `;
    })
    .join('');

  return {
    selectedPlayer,
    markup: `
      <div class="match-pass-map-surface">
        <div class="match-pass-pitch" aria-hidden="true">
          <span class="match-pass-pitch-line match-pass-pitch-line--half"></span>
          <span class="match-pass-pitch-circle"></span>
          <span class="match-pass-pitch-spot match-pass-pitch-spot--center"></span>
          <span class="match-pass-pitch-box match-pass-pitch-box--left"></span>
          <span class="match-pass-pitch-box match-pass-pitch-box--right"></span>
          <span class="match-pass-pitch-six match-pass-pitch-six--left"></span>
          <span class="match-pass-pitch-six match-pass-pitch-six--right"></span>
          <span class="match-pass-pitch-spot match-pass-pitch-spot--left"></span>
          <span class="match-pass-pitch-spot match-pass-pitch-spot--right"></span>
        </div>
        <svg class="match-pass-map-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          ${lineMarkup}
        </svg>
        ${nodeMarkup}
      </div>
    `
  };
};

const buildPassBreakdownMarkup = (passMap = { nodes: [] }, selectedPlayer = null) => {
  if (!selectedPlayer) {
    return '<span class="match-pass-target match-pass-target--empty">No pass data</span>';
  }

  const nodeById = new Map((passMap.nodes || []).map((node) => [node.id, node]));
  const targets = (selectedPlayer.targets || [])
    .filter((target) => target.count > 0)
    .sort((left, right) => right.count - left.count)
    .slice(0, 6);

  if (!targets.length) {
    return '<span class="match-pass-target match-pass-target--empty">No completed links</span>';
  }

  return targets
    .map((target) => {
      const recipient = nodeById.get(target.to);
      const recipientName = recipient?.shortName || recipient?.label || 'Team';
      return `
        <span class="match-pass-target">
          <span class="match-pass-target-name">${recipientName}</span>
          <span class="match-pass-target-count">${target.count}</span>
        </span>
      `;
    })
    .join('');
};

const renderMatchStatsShell = (homeTeam, awayTeam, homeLogoUrl, awayLogoUrl) => {
  const homeLogo = document.querySelector('#match-stats-home-logo');
  const awayLogo = document.querySelector('#match-stats-away-logo');
  const homeName = document.querySelector('#match-stats-home-name');
  const awayName = document.querySelector('#match-stats-away-name');

  if (homeLogo) {
    if (homeLogoUrl) homeLogo.src = homeLogoUrl;
    homeLogo.alt = homeTeam?.name || 'Home team';
    homeLogo.style.visibility = homeLogoUrl ? 'visible' : 'hidden';
  }
  if (awayLogo) {
    if (awayLogoUrl) awayLogo.src = awayLogoUrl;
    awayLogo.alt = awayTeam?.name || 'Away team';
    awayLogo.style.visibility = awayLogoUrl ? 'visible' : 'hidden';
  }
  if (homeName) homeName.textContent = getShortTeamLabel(homeTeam);
  if (awayName) awayName.textContent = getShortTeamLabel(awayTeam);
};

const renderMatchStatsPlaceholder = (homeTeam, awayTeam, homeLogoUrl, awayLogoUrl, message) => {
  activeMatchStatsPanelState = null;
  renderMatchStatsShell(homeTeam, awayTeam, homeLogoUrl, awayLogoUrl);
  const compare = document.querySelector('#match-stats-compare');
  const homeMap = document.querySelector('#match-stats-home-map');
  const awayMap = document.querySelector('#match-stats-away-map');
  const homePassCount = document.querySelector('#match-stats-home-pass-count');
  const awayPassCount = document.querySelector('#match-stats-away-pass-count');
  const homePassText = document.querySelector('#match-stats-home-pass-text');
  const awayPassText = document.querySelector('#match-stats-away-pass-text');
  const homeControls = document.querySelector('#match-stats-home-controls');
  const awayControls = document.querySelector('#match-stats-away-controls');
  const homePassBreakdown = document.querySelector('#match-stats-home-pass-breakdown');
  const awayPassBreakdown = document.querySelector('#match-stats-away-pass-breakdown');

  if (homeMap) homeMap.innerHTML = `<div class="match-pass-map-placeholder">${message}</div>`;
  if (awayMap) awayMap.innerHTML = `<div class="match-pass-map-placeholder">${message}</div>`;
  if (compare) compare.innerHTML = `<div class="match-stats-placeholder">${message}</div>`;
  if (homePassCount) homePassCount.textContent = '0';
  if (awayPassCount) awayPassCount.textContent = '0';
  if (homePassText) homePassText.textContent = 'completed passes';
  if (awayPassText) awayPassText.textContent = 'completed passes';
  if (homeControls) homeControls.innerHTML = buildPassSelectorMarkup({ players: [] }, 'home', null);
  if (awayControls) awayControls.innerHTML = buildPassSelectorMarkup({ players: [] }, 'away', null);
  if (homePassBreakdown) homePassBreakdown.innerHTML = '<span class="match-pass-target match-pass-target--empty">No pass data</span>';
  if (awayPassBreakdown) awayPassBreakdown.innerHTML = '<span class="match-pass-target match-pass-target--empty">No pass data</span>';
};

const bindMatchStatsControls = () => {
  const homeSelect = document.querySelector('#match-stats-home-player-select');
  const awaySelect = document.querySelector('#match-stats-away-player-select');

  if (homeSelect) {
    homeSelect.onchange = (event) => {
      if (!activeMatchStatsPanelState) return;
      activeMatchStatsPanelState.selectedHomePlayerId = event.currentTarget.value;
      renderMatchStatsPanel(
        activeMatchStatsPanelState.homeTeam,
        activeMatchStatsPanelState.awayTeam,
        activeMatchStatsPanelState.homeLogoUrl,
        activeMatchStatsPanelState.awayLogoUrl,
        activeMatchStatsPanelState.summary,
        activeMatchStatsPanelState.selectedHomePlayerId,
        activeMatchStatsPanelState.selectedAwayPlayerId
      );
    };
  }

  if (awaySelect) {
    awaySelect.onchange = (event) => {
      if (!activeMatchStatsPanelState) return;
      activeMatchStatsPanelState.selectedAwayPlayerId = event.currentTarget.value;
      renderMatchStatsPanel(
        activeMatchStatsPanelState.homeTeam,
        activeMatchStatsPanelState.awayTeam,
        activeMatchStatsPanelState.homeLogoUrl,
        activeMatchStatsPanelState.awayLogoUrl,
        activeMatchStatsPanelState.summary,
        activeMatchStatsPanelState.selectedHomePlayerId,
        activeMatchStatsPanelState.selectedAwayPlayerId
      );
    };
  }
};

const renderMatchStatsPanel = (
  homeTeam,
  awayTeam,
  homeLogoUrl,
  awayLogoUrl,
  summary,
  selectedHomePlayerId = null,
  selectedAwayPlayerId = null
) => {
  renderMatchStatsShell(homeTeam, awayTeam, homeLogoUrl, awayLogoUrl);

  const compare = document.querySelector('#match-stats-compare');
  const homeMap = document.querySelector('#match-stats-home-map');
  const awayMap = document.querySelector('#match-stats-away-map');
  const homePassCount = document.querySelector('#match-stats-home-pass-count');
  const awayPassCount = document.querySelector('#match-stats-away-pass-count');
  const homePassText = document.querySelector('#match-stats-home-pass-text');
  const awayPassText = document.querySelector('#match-stats-away-pass-text');
  const homeControls = document.querySelector('#match-stats-home-controls');
  const awayControls = document.querySelector('#match-stats-away-controls');
  const homePassBreakdown = document.querySelector('#match-stats-home-pass-breakdown');
  const awayPassBreakdown = document.querySelector('#match-stats-away-pass-breakdown');

  if (!summary) {
    renderMatchStatsPlaceholder(homeTeam, awayTeam, homeLogoUrl, awayLogoUrl, 'Detailed stats after full time');
    return;
  }

  const homeSelectedPlayer =
    selectedHomePlayerId || activeMatchStatsPanelState?.selectedHomePlayerId || summary.home.passMap.defaultPlayerId;
  const awaySelectedPlayer =
    selectedAwayPlayerId || activeMatchStatsPanelState?.selectedAwayPlayerId || summary.away.passMap.defaultPlayerId;

  activeMatchStatsPanelState = {
    homeTeam,
    awayTeam,
    homeLogoUrl,
    awayLogoUrl,
    summary,
    selectedHomePlayerId: homeSelectedPlayer,
    selectedAwayPlayerId: awaySelectedPlayer
  };

  if (compare) {
    compare.innerHTML = `
      <div class="match-stats-title">Match Statistics</div>
      <div class="match-compare-list">
        ${buildComparisonRowsMarkup(summary)}
      </div>
    `;
  }
  if (homeControls) {
    homeControls.innerHTML = buildPassSelectorMarkup(summary.home.passMap, 'home', homeSelectedPlayer);
  }
  if (awayControls) {
    awayControls.innerHTML = buildPassSelectorMarkup(summary.away.passMap, 'away', awaySelectedPlayer);
  }

  const homePassMap = buildPassMapMarkup(summary.home.passMap, 'home', homeSelectedPlayer);
  const awayPassMap = buildPassMapMarkup(summary.away.passMap, 'away', awaySelectedPlayer);

  if (homeMap) homeMap.innerHTML = homePassMap.markup;
  if (awayMap) awayMap.innerHTML = awayPassMap.markup;
  if (homePassCount) homePassCount.textContent = String(homePassMap.selectedPlayer?.totalPasses || 0);
  if (awayPassCount) awayPassCount.textContent = String(awayPassMap.selectedPlayer?.totalPasses || 0);
  if (homePassText) {
    homePassText.textContent = homePassMap.selectedPlayer
      ? `completed by ${homePassMap.selectedPlayer.shortName}`
      : 'completed passes';
  }
  if (awayPassText) {
    awayPassText.textContent = awayPassMap.selectedPlayer
      ? `completed by ${awayPassMap.selectedPlayer.shortName}`
      : 'completed passes';
  }
  if (homePassBreakdown) {
    homePassBreakdown.innerHTML = buildPassBreakdownMarkup(summary.home.passMap, homePassMap.selectedPlayer);
  }
  if (awayPassBreakdown) {
    awayPassBreakdown.innerHTML = buildPassBreakdownMarkup(summary.away.passMap, awayPassMap.selectedPlayer);
  }

  bindMatchStatsControls();
};

const buildMatchStatsPackage = (match, homeLineup, awayLineup) => {
  if (match.status !== 'completed') {
    return {
      home: buildEmptyMatchStats(homeLineup.starters),
      away: buildEmptyMatchStats(awayLineup.starters),
      homeEvents: [],
      awayEvents: [],
      summary: null
    };
  }

  const homeData = buildTeamMatchStats(
    `${match.id}:home:${match.homeScore}-${match.awayScore}`,
    homeLineup.starters,
    Number(match.homeScore) || 0,
    Number(match.awayScore) || 0
  );
  const awayData = buildTeamMatchStats(
    `${match.id}:away:${match.awayScore}-${match.homeScore}`,
    awayLineup.starters,
    Number(match.awayScore) || 0,
    Number(match.homeScore) || 0
  );

  const candidates = [
    ...homeLineup.starters.filter(Boolean).map((player) => ({
      side: 'home',
      name: player.name,
      rating: homeData.stats[player.name]?.rating ?? 0,
      goals: homeData.stats[player.name]?.goals ?? 0,
      assists: homeData.stats[player.name]?.assists ?? 0
    })),
    ...awayLineup.starters.filter(Boolean).map((player) => ({
      side: 'away',
      name: player.name,
      rating: awayData.stats[player.name]?.rating ?? 0,
      goals: awayData.stats[player.name]?.goals ?? 0,
      assists: awayData.stats[player.name]?.assists ?? 0
    }))
  ].sort((left, right) => {
    if (right.rating !== left.rating) return right.rating - left.rating;
    if (right.goals !== left.goals) return right.goals - left.goals;
    if (right.assists !== left.assists) return right.assists - left.assists;
    return left.name.localeCompare(right.name);
  });

  const motm = candidates[0];
  if (motm) {
    if (motm.side === 'home' && homeData.stats[motm.name]) {
      homeData.stats[motm.name].motm = true;
    }
    if (motm.side === 'away' && awayData.stats[motm.name]) {
      awayData.stats[motm.name].motm = true;
    }
  }

  const summaryRandom = createSeededRandom(`${match.id}:summary:possession`);
  const scoreSwing = (Number(match.homeScore) || 0) - (Number(match.awayScore) || 0);
  const homePossession = clamp(Math.round(50 + scoreSwing * 2 + randInt(summaryRandom, -7, 7)), 35, 65);
  const awayPossession = 100 - homePossession;
  const summary = {
    home: buildTeamSummaryStats(
      match.id,
      'home',
      homeLineup,
      Number(match.homeScore) || 0,
      Number(match.awayScore) || 0,
      homePossession
    ),
    away: buildTeamSummaryStats(
      match.id,
      'away',
      awayLineup,
      Number(match.awayScore) || 0,
      Number(match.homeScore) || 0,
      awayPossession
    )
  };

  return {
    home: homeData.stats,
    away: awayData.stats,
    homeEvents: homeData.events,
    awayEvents: awayData.events,
    summary
  };
};

const buildScoresheetMarkup = (events = []) => {
  if (!events.length) {
    return '<div class="scoresheet-item scoresheet-item--empty">No scorers</div>';
  }
  return events
    .map((event) => {
      const assistMarkup = event.assist
        ? `<span class="scoresheet-assist">A: ${getPlayerDisplayName(event.assist)}</span>`
        : '';
      return `
        <div class="scoresheet-item">
          <div class="scoresheet-item-main">
            <span class="scoresheet-bullet"></span>
            <span class="scoresheet-item-player">${getPlayerDisplayName(event.scorer)}</span>
          </div>
          <div class="scoresheet-item-meta">
            ${assistMarkup}
            <span class="scoresheet-minute">${event.minute}'</span>
          </div>
        </div>
      `;
    })
    .join('');
};

const buildScorerBoxesMarkup = (events = [], side = 'home') =>
  events
    .map(
      (event) => `
        <div class="stat-box scorer-box scorer-box--${side}">
          <span class="scorer-name">${getPlayerDisplayName(event.scorer)}</span>
          <span class="goal-text">Goal</span>
        </div>
      `
    )
    .join('');

const renderScorerStrips = (homeEvents = [], awayEvents = []) => {
  const homeStrip = document.querySelector('.stat-strip.left');
  const awayStrip = document.querySelector('.stat-strip.right');
  if (homeStrip) {
    homeStrip.innerHTML = buildScorerBoxesMarkup(homeEvents, 'home');
  }
  if (awayStrip) {
    awayStrip.innerHTML = buildScorerBoxesMarkup(awayEvents, 'away');
  }
};

const getRatingClassName = (matchStats) => {
  const rating = Number(matchStats?.rating);
  if (!Number.isFinite(rating)) return '';
  if (matchStats?.motm) return 'rating-motm';
  if (rating < 6) return 'rating-low';
  if (rating < 7) return 'rating-mid';
  return 'rating-high';
};

const buildPlayerPhotoMarkup = (player) => {
  if (player?.photo) {
    return `<img src="${player.photo}" alt="${player.name}" loading="lazy" />`;
  }
  return `<span class="player-photo-fallback">${getPlayerInitials(player?.name)}</span>`;
};

const buildFieldPlayerMarkup = (player, slot, side, matchStats = null) => {
  if (!player) {
    return `
      <div class="player player--ghost" style="left:${slot.left}%; top:${slot.top}%;">
        <div class="player-photo player-photo--ghost"></div>
      </div>
    `;
  }

  const goals = Number(matchStats?.goals || 0);
  const assists = Number(matchStats?.assists || 0);
  const rating = matchStats?.rating;
  const ratingClassName = getRatingClassName(matchStats);
  const statMarkup =
    rating !== null && rating !== undefined
      ? `
        <div class="match-player-stats">
          <span class="match-player-stat rating ${ratingClassName}">${rating.toFixed(1)}★</span>
          ${goals ? `<span class="match-player-stat goal">G${goals}</span>` : ''}
          ${assists ? `<span class="match-player-stat assist">A${assists}</span>` : ''}
        </div>
      `
      : '';

  return `
    <div class="player player--${side}" style="left:${slot.left}%; top:${slot.top}%;">
      <div class="player-photo">
        ${buildPlayerPhotoMarkup(player)}
      </div>
      <div class="player-chip">
        <span class="player-chip-number">${parsePlayerNumber(player.number)}</span>
        <span class="player-chip-name">${getPlayerDisplayName(player.name)}</span>
      </div>
      ${statMarkup}
    </div>
  `;
};

const buildBenchSlotMarkup = (player, side) => {
  if (!player) {
    return `<div class="bench-slot bench-slot--${side} bench-slot--empty"></div>`;
  }

  return `
    <div class="bench-slot bench-slot--${side}">
      <div class="bench-player">
        <div class="bench-player-photo">
          ${buildPlayerPhotoMarkup(player)}
        </div>
        <div class="bench-player-copy">
          <span class="bench-player-name">${getPlayerDisplayName(player.name)}</span>
        </div>
      </div>
    </div>
  `;
};

const renderEmptyMatchLineups = (message = 'Lineups coming soon') => {
  const field = document.querySelector('.field');
  const homeBench = document.querySelector('.bench-left');
  const awayBench = document.querySelector('.bench-right');
  renderScorerStrips([], []);
  if (field) {
    field.innerHTML = `<div class="field-empty-state">${message}</div>`;
  }
  if (homeBench) {
    homeBench.innerHTML = Array.from({ length: MATCH_BENCH_SIZE }, () =>
      '<div class="bench-slot bench-slot--home bench-slot--empty"></div>'
    ).join('');
  }
  if (awayBench) {
    awayBench.innerHTML = Array.from({ length: MATCH_BENCH_SIZE }, () =>
      '<div class="bench-slot bench-slot--away bench-slot--empty"></div>'
    ).join('');
  }
};

const renderMatchLineups = async (match, homeTeam, awayTeam) => {
  const requestId = ++activeMatchLineupRequest;
  const field = document.querySelector('.field');
  const homeBench = document.querySelector('.bench-left');
  const awayBench = document.querySelector('.bench-right');
  const scoresheetHomeList = document.querySelector('#scoresheet-home-list');
  const scoresheetAwayList = document.querySelector('#scoresheet-away-list');

  if (!field || !homeBench || !awayBench) return;

  const homeLogoUrl = getTeamLogoUrl(homeTeam, match.competitionId);
  const awayLogoUrl = getTeamLogoUrl(awayTeam, match.competitionId);

  const leagueKey = getLineupLeagueKey(match.competitionId);
  if (!leagueKey || !homeTeam || !awayTeam) {
    renderEmptyMatchLineups('Lineups available for Premier League matches');
    if (scoresheetHomeList) scoresheetHomeList.innerHTML = buildScoreSheetItems(0);
    if (scoresheetAwayList) scoresheetAwayList.innerHTML = buildScoreSheetItems(0);
    renderMatchStatsPlaceholder(homeTeam, awayTeam, homeLogoUrl, awayLogoUrl, 'Detailed stats unavailable');
    return;
  }

  field.innerHTML = '<div class="field-empty-state">Loading lineups...</div>';
  homeBench.innerHTML = Array.from({ length: MATCH_BENCH_SIZE }, () =>
    '<div class="bench-slot bench-slot--home bench-slot--empty"></div>'
  ).join('');
  awayBench.innerHTML = Array.from({ length: MATCH_BENCH_SIZE }, () =>
    '<div class="bench-slot bench-slot--away bench-slot--empty"></div>'
  ).join('');
  renderScorerStrips([], []);
  renderMatchStatsPlaceholder(homeTeam, awayTeam, homeLogoUrl, awayLogoUrl, 'Loading stats...');
  if (scoresheetHomeList) scoresheetHomeList.innerHTML = '<div class="scoresheet-item">Loading scorers...</div>';
  if (scoresheetAwayList) scoresheetAwayList.innerHTML = '<div class="scoresheet-item">Loading scorers...</div>';

  try {
    const [homeRoster, awayRoster] = await Promise.all([
      loadRosterForTeam(homeTeam, leagueKey),
      loadRosterForTeam(awayTeam, leagueKey)
    ]);

    if (requestId !== activeMatchLineupRequest) return;

    if (!homeRoster?.length || !awayRoster?.length) {
      renderEmptyMatchLineups('No squad data found for this match');
      if (scoresheetHomeList) scoresheetHomeList.innerHTML = '<div class="scoresheet-item">No scorers</div>';
      if (scoresheetAwayList) scoresheetAwayList.innerHTML = '<div class="scoresheet-item">No scorers</div>';
      renderMatchStatsPlaceholder(homeTeam, awayTeam, homeLogoUrl, awayLogoUrl, 'No detailed stats available');
      return;
    }

    const homeLineup = buildLineupFromRoster(homeRoster);
    const awayLineup = buildLineupFromRoster(awayRoster);
    const matchStats = buildMatchStatsPackage(match, homeLineup, awayLineup);

    const fieldLayout = getActiveFieldLineupLayout();

    field.innerHTML = [
      ...fieldLayout.home.map((slot, index) =>
        buildFieldPlayerMarkup(homeLineup.starters[index], slot, 'home', matchStats.home[homeLineup.starters[index]?.name])
      ),
      ...fieldLayout.away.map((slot, index) =>
        buildFieldPlayerMarkup(awayLineup.starters[index], slot, 'away', matchStats.away[awayLineup.starters[index]?.name])
      )
    ].join('');

    homeBench.innerHTML = Array.from({ length: MATCH_BENCH_SIZE }, (_, index) =>
      buildBenchSlotMarkup(homeLineup.bench[index], 'home')
    ).join('');
    awayBench.innerHTML = Array.from({ length: MATCH_BENCH_SIZE }, (_, index) =>
      buildBenchSlotMarkup(awayLineup.bench[index], 'away')
    ).join('');
    renderScorerStrips(matchStats.homeEvents, matchStats.awayEvents);
    renderMatchStatsPanel(homeTeam, awayTeam, homeLogoUrl, awayLogoUrl, matchStats.summary);
    if (scoresheetHomeList) scoresheetHomeList.innerHTML = buildScoresheetMarkup(matchStats.homeEvents);
    if (scoresheetAwayList) scoresheetAwayList.innerHTML = buildScoresheetMarkup(matchStats.awayEvents);
  } catch (error) {
    console.warn('Unable to render match lineups.', error);
    if (requestId === activeMatchLineupRequest) {
      renderEmptyMatchLineups('Unable to load match lineups');
      if (scoresheetHomeList) scoresheetHomeList.innerHTML = '<div class="scoresheet-item">No scorers</div>';
      if (scoresheetAwayList) scoresheetAwayList.innerHTML = '<div class="scoresheet-item">No scorers</div>';
      renderMatchStatsPlaceholder(homeTeam, awayTeam, homeLogoUrl, awayLogoUrl, 'Unable to load stats');
    }
  }
};

const updateMatchView = (match) => {
  const matchBoard = document.querySelector('.match-board');
  if (!matchBoard) return;

  const homeTeam = getTeamForMatch(match, match.homeTeamId);
  const awayTeam = getTeamForMatch(match, match.awayTeamId);
  const isCompleted = match.status === 'completed';

  const matchScore = document.querySelector('#match-score');
  const matchScoreMeta = document.querySelector('#match-score-meta');
  const matchHomeLogo = document.querySelector('#match-home-logo');
  const matchAwayLogo = document.querySelector('#match-away-logo');
  const matchHomeName = document.querySelector('#match-home-name');
  const matchAwayName = document.querySelector('#match-away-name');
  const matchCompLogo = document.querySelector('#match-comp-logo');

  const scheduleDate = document.querySelector('#match-schedule-date');
  const scheduleTime = document.querySelector('#match-schedule-time');
  const scoresheetHomeLogo = document.querySelector('#scoresheet-home-logo');
  const scoresheetAwayLogo = document.querySelector('#scoresheet-away-logo');
  const scoresheetHomeName = document.querySelector('#scoresheet-home-name');
  const scoresheetAwayName = document.querySelector('#scoresheet-away-name');
  const scoresheetHomeList = document.querySelector('#scoresheet-home-list');
  const scoresheetAwayList = document.querySelector('#scoresheet-away-list');

  const homeLogoUrl = getTeamLogoUrl(homeTeam, match.competitionId);
  const awayLogoUrl = getTeamLogoUrl(awayTeam, match.competitionId);
  const compLogoUrl = COMPETITION_LOGOS[match.competitionId];

  applyMatchBoardColors(matchBoard, match.id, homeTeam?.id, awayTeam?.id, homeLogoUrl, awayLogoUrl);

  if (matchCompLogo && compLogoUrl) {
    matchCompLogo.src = compLogoUrl;
    matchCompLogo.alt = match.competitionId.replace(/-2025-2026$/, '').replace(/-/g, ' ');
  }

  if (matchHomeLogo) {
    if (homeLogoUrl) matchHomeLogo.src = homeLogoUrl;
    matchHomeLogo.alt = homeTeam.name;
    matchHomeLogo.style.visibility = homeLogoUrl ? 'visible' : 'hidden';
  }
  if (matchAwayLogo) {
    if (awayLogoUrl) matchAwayLogo.src = awayLogoUrl;
    matchAwayLogo.alt = awayTeam.name;
    matchAwayLogo.style.visibility = awayLogoUrl ? 'visible' : 'hidden';
  }
  if (matchHomeName) matchHomeName.textContent = homeTeam.shortName || homeTeam.name;
  if (matchAwayName) matchAwayName.textContent = awayTeam.shortName || awayTeam.name;

  if (matchScore) {
    matchScore.textContent = isCompleted ? `${match.homeScore} - ${match.awayScore}` : 'VS';
  }
  if (matchScoreMeta) {
    matchScoreMeta.textContent = isCompleted
      ? 'FT'
      : `${formatMatchDate(match.matchDate)} · ${formatKickoff(match.matchDate)}`;
  }

  if (scheduleDate) scheduleDate.textContent = formatMatchDate(match.matchDate);
  if (scheduleTime) scheduleTime.textContent = formatKickoff(match.matchDate);

  if (scoresheetHomeLogo) {
    if (homeLogoUrl) scoresheetHomeLogo.src = homeLogoUrl;
    scoresheetHomeLogo.alt = homeTeam.name;
    scoresheetHomeLogo.style.visibility = homeLogoUrl ? 'visible' : 'hidden';
  }
  if (scoresheetAwayLogo) {
    if (awayLogoUrl) scoresheetAwayLogo.src = awayLogoUrl;
    scoresheetAwayLogo.alt = awayTeam.name;
    scoresheetAwayLogo.style.visibility = awayLogoUrl ? 'visible' : 'hidden';
  }
  if (scoresheetHomeName) scoresheetHomeName.textContent = getShortTeamLabel(homeTeam);
  if (scoresheetAwayName) scoresheetAwayName.textContent = getShortTeamLabel(awayTeam);
  if (scoresheetHomeList) {
    scoresheetHomeList.innerHTML = isCompleted
      ? '<div class="scoresheet-item">Loading scorers...</div>'
      : buildScoreSheetItems(0);
  }
  if (scoresheetAwayList) {
    scoresheetAwayList.innerHTML = isCompleted
      ? '<div class="scoresheet-item">Loading scorers...</div>'
      : buildScoreSheetItems(0);
  }

  matchBoard.classList.add('match-board--generic');
  matchBoard.classList.remove('match-board--detailed');
  matchBoard.classList.toggle('match-board--completed', isCompleted);
  matchBoard.classList.toggle('match-board--upcoming', !isCompleted);
  renderScorerStrips([], []);
  renderMatchStatsShell(homeTeam, awayTeam, homeLogoUrl, awayLogoUrl);
  normalizeFieldStats();
  renderMatchLineups(match, homeTeam, awayTeam);
};

const getVisiblePremierMatchdays = () => {
  const activeIndex = premierFixturesState.matchdays.indexOf(premierFixturesState.activeMatchday);
  const visibleCount = 8;

  if (activeIndex === -1) return premierFixturesState.matchdays.slice(0, visibleCount);
  if (premierFixturesState.matchdays.length <= visibleCount) return [...premierFixturesState.matchdays];

  const maxStartIndex = premierFixturesState.matchdays.length - visibleCount;
  const startIndex = Math.max(0, Math.min(activeIndex - 3, maxStartIndex));

  return premierFixturesState.matchdays.slice(startIndex, startIndex + visibleCount);
};

const getVisibleBundesligaMatchdays = () => {
  const activeIndex = bundesligaFixturesState.matchdays.indexOf(bundesligaFixturesState.activeMatchday);
  const visibleCount = 8;

  if (activeIndex === -1) return bundesligaFixturesState.matchdays.slice(0, visibleCount);
  if (bundesligaFixturesState.matchdays.length <= visibleCount) return [...bundesligaFixturesState.matchdays];

  const maxStartIndex = bundesligaFixturesState.matchdays.length - visibleCount;
  const startIndex = Math.max(0, Math.min(activeIndex - 3, maxStartIndex));

  return bundesligaFixturesState.matchdays.slice(startIndex, startIndex + visibleCount);
};

const getVisibleSerieAMatchdays = () => {
  const activeIndex = serieAFixturesState.matchdays.indexOf(serieAFixturesState.activeMatchday);
  const visibleCount = 8;

  if (activeIndex === -1) return serieAFixturesState.matchdays.slice(0, visibleCount);
  if (serieAFixturesState.matchdays.length <= visibleCount) return [...serieAFixturesState.matchdays];

  const maxStartIndex = serieAFixturesState.matchdays.length - visibleCount;
  const startIndex = Math.max(0, Math.min(activeIndex - 3, maxStartIndex));

  return serieAFixturesState.matchdays.slice(startIndex, startIndex + visibleCount);
};

const getVisibleLaligaMatchdays = () => {
  const activeIndex = laligaFixturesState.matchdays.indexOf(laligaFixturesState.activeMatchday);
  const visibleCount = 8;

  if (activeIndex === -1) return laligaFixturesState.matchdays.slice(0, visibleCount);
  if (laligaFixturesState.matchdays.length <= visibleCount) return [...laligaFixturesState.matchdays];

  const maxStartIndex = laligaFixturesState.matchdays.length - visibleCount;
  const startIndex = Math.max(0, Math.min(activeIndex - 3, maxStartIndex));

  return laligaFixturesState.matchdays.slice(startIndex, startIndex + visibleCount);
};

const renderPremierMatchdayPills = () => {
  const matchdayRow = document.querySelector('.league-card.premier .matchday-row');
  if (!matchdayRow) return;

  const visibleMatchdays = getVisiblePremierMatchdays();
  matchdayRow.dataset.fixtureSource = 'premier-league';
  matchdayRow.innerHTML = visibleMatchdays
    .map(
      (matchday) => `
        <button
          class="mw-pill${matchday === premierFixturesState.activeMatchday ? ' active' : ''}"
          type="button"
          data-matchday="${matchday}"
        >
          MW${matchday}
        </button>
      `
    )
    .join('');
};

const setChampionshipFixtureLabels = (leftLabel = 'Fixtures', rightLabel = 'More Fixtures') => {
  const labels = document.querySelectorAll('.league-card.championship .fixtures-head span');
  if (labels.length < 2) return;
  labels[0].textContent = leftLabel;
  labels[1].textContent = rightLabel;
};

const renderBundesligaMatchdayPills = () => {
  const matchdayRow = document.querySelector('.league-card.bundesliga .matchday-row');
  if (!matchdayRow) return;

  const visibleMatchdays = getVisibleBundesligaMatchdays();
  matchdayRow.dataset.fixtureSource = 'bundesliga';
  matchdayRow.innerHTML = visibleMatchdays
    .map(
      (matchday) => `
        <button
          class="mw-pill${matchday === bundesligaFixturesState.activeMatchday ? ' active' : ''}"
          type="button"
          data-matchday="${matchday}"
        >
          MW${matchday}
        </button>
      `
    )
    .join('');
};

const renderSerieAMatchdayPills = () => {
  const matchdayRow = document.querySelector('.league-card.seriea .matchday-row');
  if (!matchdayRow) return;

  const visibleMatchdays = getVisibleSerieAMatchdays();
  matchdayRow.dataset.fixtureSource = 'serie-a';
  matchdayRow.innerHTML = visibleMatchdays
    .map(
      (matchday) => `
        <button
          class="mw-pill${matchday === serieAFixturesState.activeMatchday ? ' active' : ''}"
          type="button"
          data-matchday="${matchday}"
        >
          MW${matchday}
        </button>
      `
    )
    .join('');
};

const renderLaligaMatchdayPills = () => {
  const matchdayRow = document.querySelector('.league-card.laliga .matchday-row');
  if (!matchdayRow) return;

  const visibleMatchdays = getVisibleLaligaMatchdays();
  matchdayRow.dataset.fixtureSource = 'la-liga';
  matchdayRow.innerHTML = visibleMatchdays
    .map(
      (matchday) => `
        <button
          class="mw-pill${matchday === laligaFixturesState.activeMatchday ? ' active' : ''}"
          type="button"
          data-matchday="${matchday}"
        >
          MW${matchday}
        </button>
      `
    )
    .join('');
};

const renderPremierFixtures = (matchday = premierFixturesState.activeMatchday) => {
  const matchGrid = document.querySelector('.league-card.premier .match-grid');
  if (!matchGrid) return;

  const selectedMatchday = Number(matchday);
  const fixtures = [...(premierFixturesState.matchesByMatchday.get(selectedMatchday) || [])].sort(
    (left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime()
  );

  if (!fixtures.length) {
    matchGrid.innerHTML = `${buildGhostCardMarkup()}${buildGhostCardMarkup()}`;
    return;
  }

  premierFixturesState.activeMatchday = selectedMatchday;

  const playedMatches = fixtures
    .filter((match) => match.status === 'completed')
    .sort((left, right) => new Date(right.matchDate).getTime() - new Date(left.matchDate).getTime());
  const upcomingMatches = fixtures
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime());
  const rowCount = Math.max(playedMatches.length, upcomingMatches.length);
  const cells = [];

  for (let index = 0; index < rowCount; index += 1) {
    cells.push(playedMatches[index] ? buildFixtureCardMarkup(playedMatches[index]) : buildGhostCardMarkup());
    cells.push(upcomingMatches[index] ? buildFixtureCardMarkup(upcomingMatches[index]) : buildGhostCardMarkup());
  }

  matchGrid.innerHTML = cells.join('');
  renderPremierMatchdayPills();
};

const renderChampionshipFixtures = (matchday = championshipFixturesState.activeMatchday) => {
  const matchGrid = document.querySelector('.league-card.championship .match-grid');
  if (!matchGrid) return;

  const selectedMatchday = Number(matchday);
  const fixtures = [...(championshipFixturesState.matchesByMatchday.get(selectedMatchday) || [])].sort(
    (left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime()
  );
  const visibleFixtures = fixtures.slice(0, 18);
  const leftFixtures = visibleFixtures.slice(0, 9);
  const rightFixtures = visibleFixtures.slice(9, 18);
  const cells = [];

  championshipFixturesState.activeMatchday = selectedMatchday;
  setChampionshipFixtureLabels();

  for (let index = 0; index < 9; index += 1) {
    cells.push(leftFixtures[index] ? buildFixtureCardMarkup(leftFixtures[index]) : buildGhostCardMarkup());
    cells.push(rightFixtures[index] ? buildFixtureCardMarkup(rightFixtures[index]) : buildGhostCardMarkup());
  }

  matchGrid.innerHTML = cells.join('');
};

const renderBundesligaFixtures = (matchday = bundesligaFixturesState.activeMatchday) => {
  const matchGrid = document.querySelector('.league-card.bundesliga .match-grid');
  if (!matchGrid) return;

  const selectedMatchday = Number(matchday);
  const fixtures = [...(bundesligaFixturesState.matchesByMatchday.get(selectedMatchday) || [])].sort(
    (left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime()
  );

  if (!fixtures.length) {
    matchGrid.innerHTML = `${buildGhostCardMarkup()}${buildGhostCardMarkup()}`;
    return;
  }

  bundesligaFixturesState.activeMatchday = selectedMatchday;

  const playedMatches = fixtures
    .filter((match) => match.status === 'completed')
    .sort((left, right) => new Date(right.matchDate).getTime() - new Date(left.matchDate).getTime());
  const upcomingMatches = fixtures
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime());
  const rowCount = Math.max(playedMatches.length, upcomingMatches.length);
  const cells = [];

  for (let index = 0; index < rowCount; index += 1) {
    cells.push(playedMatches[index] ? buildFixtureCardMarkup(playedMatches[index]) : buildGhostCardMarkup());
    cells.push(upcomingMatches[index] ? buildFixtureCardMarkup(upcomingMatches[index]) : buildGhostCardMarkup());
  }

  matchGrid.innerHTML = cells.join('');
  renderBundesligaMatchdayPills();
};

const renderSerieAFixtures = (matchday = serieAFixturesState.activeMatchday) => {
  const matchGrid = document.querySelector('.league-card.seriea .match-grid');
  if (!matchGrid) return;

  const selectedMatchday = Number(matchday);
  const fixtures = [...(serieAFixturesState.matchesByMatchday.get(selectedMatchday) || [])].sort(
    (left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime()
  );

  if (!fixtures.length) {
    matchGrid.innerHTML = `${buildGhostCardMarkup()}${buildGhostCardMarkup()}`;
    return;
  }

  serieAFixturesState.activeMatchday = selectedMatchday;

  const playedMatches = fixtures
    .filter((match) => match.status === 'completed')
    .sort((left, right) => new Date(right.matchDate).getTime() - new Date(left.matchDate).getTime());
  const upcomingMatches = fixtures
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime());
  const rowCount = Math.max(playedMatches.length, upcomingMatches.length);
  const cells = [];

  for (let index = 0; index < rowCount; index += 1) {
    cells.push(playedMatches[index] ? buildFixtureCardMarkup(playedMatches[index]) : buildGhostCardMarkup());
    cells.push(upcomingMatches[index] ? buildFixtureCardMarkup(upcomingMatches[index]) : buildGhostCardMarkup());
  }

  matchGrid.innerHTML = cells.join('');
  renderSerieAMatchdayPills();
};

const renderLaligaFixtures = (matchday = laligaFixturesState.activeMatchday) => {
  const matchGrid = document.querySelector('.league-card.laliga .match-grid');
  if (!matchGrid) return;

  const selectedMatchday = Number(matchday);
  const fixtures = [...(laligaFixturesState.matchesByMatchday.get(selectedMatchday) || [])].sort(
    (left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime()
  );

  if (!fixtures.length) {
    matchGrid.innerHTML = `${buildGhostCardMarkup()}${buildGhostCardMarkup()}`;
    return;
  }

  laligaFixturesState.activeMatchday = selectedMatchday;

  const playedMatches = fixtures
    .filter((match) => match.status === 'completed')
    .sort((left, right) => new Date(right.matchDate).getTime() - new Date(left.matchDate).getTime());
  const upcomingMatches = fixtures
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime());
  const rowCount = Math.max(playedMatches.length, upcomingMatches.length);
  const cells = [];

  for (let index = 0; index < rowCount; index += 1) {
    cells.push(playedMatches[index] ? buildFixtureCardMarkup(playedMatches[index]) : buildGhostCardMarkup());
    cells.push(upcomingMatches[index] ? buildFixtureCardMarkup(upcomingMatches[index]) : buildGhostCardMarkup());
  }

  matchGrid.innerHTML = cells.join('');
  renderLaligaMatchdayPills();
};

const getInitialPremierMatchday = () => {
  const earliestUpcomingMatch = [...premierFixturesState.matchesByMatchday.values()]
    .flat()
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime())[0];

  return earliestUpcomingMatch?.matchday || premierFixturesState.matchdays.at(-1);
};

const getInitialBundesligaMatchday = () => {
  const earliestUpcomingMatch = [...bundesligaFixturesState.matchesByMatchday.values()]
    .flat()
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime())[0];

  return earliestUpcomingMatch?.matchday || bundesligaFixturesState.matchdays.at(-1);
};

const getInitialSerieAMatchday = () => {
  const earliestUpcomingMatch = [...serieAFixturesState.matchesByMatchday.values()]
    .flat()
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime())[0];

  return earliestUpcomingMatch?.matchday || serieAFixturesState.matchdays.at(-1);
};

const getInitialLaligaMatchday = () => {
  const earliestUpcomingMatch = [...laligaFixturesState.matchesByMatchday.values()]
    .flat()
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime())[0];

  return earliestUpcomingMatch?.matchday || laligaFixturesState.matchdays.at(-1);
};

const getVisibleLigue1Matchdays = () => {
  const activeIndex = ligue1FixturesState.matchdays.indexOf(ligue1FixturesState.activeMatchday);
  const visibleCount = 8;

  if (activeIndex === -1) return ligue1FixturesState.matchdays.slice(0, visibleCount);
  if (ligue1FixturesState.matchdays.length <= visibleCount) return [...ligue1FixturesState.matchdays];

  const maxStartIndex = ligue1FixturesState.matchdays.length - visibleCount;
  const startIndex = Math.max(0, Math.min(activeIndex - 3, maxStartIndex));

  return ligue1FixturesState.matchdays.slice(startIndex, startIndex + visibleCount);
};

const renderLigue1MatchdayPills = () => {
  const matchdayRow = document.querySelector('.league-card.ligue1 .matchday-row');
  if (!matchdayRow) return;

  const visibleMatchdays = getVisibleLigue1Matchdays();
  matchdayRow.dataset.fixtureSource = 'ligue-1';
  matchdayRow.innerHTML = visibleMatchdays
    .map(
      (matchday) => `
        <button
          class="mw-pill${matchday === ligue1FixturesState.activeMatchday ? ' active' : ''}"
          type="button"
          data-matchday="${matchday}"
        >
          MW${matchday}
        </button>
      `
    )
    .join('');
};

const renderLigue1Fixtures = (matchday = ligue1FixturesState.activeMatchday) => {
  const matchGrid = document.querySelector('.league-card.ligue1 .match-grid');
  if (!matchGrid) return;

  const selectedMatchday = Number(matchday);
  const fixtures = [...(ligue1FixturesState.matchesByMatchday.get(selectedMatchday) || [])].sort(
    (left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime()
  );

  if (!fixtures.length) {
    matchGrid.innerHTML = `${buildGhostCardMarkup()}${buildGhostCardMarkup()}`;
    return;
  }

  ligue1FixturesState.activeMatchday = selectedMatchday;

  const playedMatches = fixtures
    .filter((match) => match.status === 'completed')
    .sort((left, right) => new Date(right.matchDate).getTime() - new Date(left.matchDate).getTime());
  const upcomingMatches = fixtures
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(right.matchDate).getTime() - new Date(left.matchDate).getTime());
  const rowCount = Math.max(playedMatches.length, upcomingMatches.length);
  const cells = [];

  for (let index = 0; index < rowCount; index += 1) {
    cells.push(playedMatches[index] ? buildFixtureCardMarkup(playedMatches[index]) : buildGhostCardMarkup());
    cells.push(upcomingMatches[index] ? buildFixtureCardMarkup(upcomingMatches[index]) : buildGhostCardMarkup());
  }

  matchGrid.innerHTML = cells.join('');
  renderLigue1MatchdayPills();
};

const getInitialLigue1Matchday = () => {
  const earliestUpcomingMatch = [...ligue1FixturesState.matchesByMatchday.values()]
    .flat()
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime())[0];

  return earliestUpcomingMatch?.matchday || ligue1FixturesState.matchdays.at(-1);
};

const getUclRoundKey = (match) =>
  match.stage === 'league' ? `R${match.matchday}` : UCL_STAGE_LABELS[match.stage] || match.stage;

const buildUclRounds = (matches) => {
  const roundMap = new Map();

  matches.forEach((match) => {
    const roundKey = getUclRoundKey(match);
    const order = match.stage === 'league' ? Number(match.matchday) : UCL_STAGE_ORDER[match.stage] || 99;
    const existing = roundMap.get(roundKey) || { key: roundKey, order, matches: [] };
    existing.matches.push(match);
    existing.order = Math.min(existing.order, order);
    roundMap.set(roundKey, existing);
  });

  return [...roundMap.values()].sort((left, right) => left.order - right.order);
};

const getVisibleUclRounds = () => {
  const activeIndex = uclFixturesState.rounds.findIndex((round) => round.key === uclFixturesState.activeRound);
  const visibleCount = 8;

  if (activeIndex === -1) return uclFixturesState.rounds.slice(0, visibleCount);
  if (uclFixturesState.rounds.length <= visibleCount) return [...uclFixturesState.rounds];

  const maxStartIndex = uclFixturesState.rounds.length - visibleCount;
  const startIndex = Math.max(0, Math.min(activeIndex - 3, maxStartIndex));

  return uclFixturesState.rounds.slice(startIndex, startIndex + visibleCount);
};

const renderUclRoundPills = () => {
  const matchdayRow = document.querySelector('.league-card.ucl .matchday-row');
  if (!matchdayRow) return;

  const visibleRounds = getVisibleUclRounds();
  matchdayRow.dataset.fixtureSource = 'ucl';
  matchdayRow.innerHTML = visibleRounds
    .map(
      (round) => `
        <button
          class="mw-pill${round.key === uclFixturesState.activeRound ? ' active' : ''}"
          type="button"
          data-round="${round.key}"
        >
          ${round.key}
        </button>
      `
    )
    .join('');
};

const renderUclFixtures = (roundKey = uclFixturesState.activeRound) => {
  const matchGrid = document.querySelector('.league-card.ucl .match-grid');
  if (!matchGrid) return;

  const fixtures = [...(uclFixturesState.matchesByRound.get(roundKey) || [])].sort(
    (left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime()
  );

  if (!fixtures.length) {
    matchGrid.innerHTML = `${buildGhostCardMarkup()}${buildGhostCardMarkup()}`;
    return;
  }

  uclFixturesState.activeRound = roundKey;

  const playedMatches = fixtures
    .filter((match) => match.status === 'completed')
    .sort((left, right) => new Date(right.matchDate).getTime() - new Date(left.matchDate).getTime());
  const upcomingMatches = fixtures
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime());
  const rowCount = Math.max(playedMatches.length, upcomingMatches.length);
  const cells = [];

  for (let index = 0; index < rowCount; index += 1) {
    cells.push(playedMatches[index] ? buildFixtureCardMarkup(playedMatches[index]) : buildGhostCardMarkup());
    cells.push(upcomingMatches[index] ? buildFixtureCardMarkup(upcomingMatches[index]) : buildGhostCardMarkup());
  }

  matchGrid.innerHTML = cells.join('');
  renderUclRoundPills();
};

const getInitialUclRound = () => {
  const earliestUpcomingMatch = [...uclFixturesState.matchesByRound.values()]
    .flat()
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime())[0];

  return earliestUpcomingMatch ? getUclRoundKey(earliestUpcomingMatch) : uclFixturesState.rounds.at(-1)?.key;
};

const getEuropaRoundLabel = (roundName) => {
  const raw = String(roundName || '').trim();
  if (!raw) return '';
  const lower = raw.toLowerCase();

  if (lower.includes('1st') && lower.includes('qual')) return 'Q1';
  if (lower.includes('2nd') && lower.includes('qual')) return 'Q2';
  if (lower.includes('3rd') && lower.includes('qual')) return 'Q3';
  if (lower.includes('play-off')) return 'PO';
  if (lower.includes('league')) return 'LP';
  if (lower.includes('round of 16')) return 'R16';
  if (lower.includes('quarter')) return 'QF';
  if (lower.includes('semi')) return 'SF';
  if (lower === 'final') return 'F';

  const parts = raw.split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 3)
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
};

const pickMostAdvancedUefaRound = (rounds = []) => {
  const list = Array.isArray(rounds) ? rounds : [];
  if (!list.length) return null;

  const scoreRound = (value) => {
    const raw = String(value || '').trim();
    const lower = raw.toLowerCase();
    if (!lower) return 0;

    if (lower === 'final' || lower.includes(' final')) return 900;
    if (lower.includes('semi')) return 800;
    if (lower.includes('quarter')) return 700;
    if (lower.includes('round of 16') || lower.includes('round of sixteen')) return 600;
    if (lower.includes('knockout')) return 550;
    if (lower.includes('league')) return 500;
    if (lower.includes('qualifying') && lower.includes('play')) return 400;
    if (lower.includes('3rd') && lower.includes('qual')) return 300;
    if (lower.includes('2nd') && lower.includes('qual')) return 200;
    if (lower.includes('1st') && lower.includes('qual')) return 100;
    return 0;
  };

  return list.reduce((best, roundKey) => {
    if (!best) return roundKey;
    const currentScore = scoreRound(roundKey);
    const bestScore = scoreRound(best);
    if (currentScore !== bestScore) return currentScore > bestScore ? roundKey : best;
    // When scores tie, prefer the later entry in the file (more likely to be later in season).
    return roundKey;
  }, null);
};

const getVisibleEuropaRounds = () => {
  const activeIndex = europaFixturesState.rounds.indexOf(europaFixturesState.activeRound);
  const visibleCount = 4;

  if (activeIndex === -1) return europaFixturesState.rounds.slice(0, visibleCount);
  if (europaFixturesState.rounds.length <= visibleCount) return [...europaFixturesState.rounds];

  const maxStartIndex = europaFixturesState.rounds.length - visibleCount;
  const startIndex = Math.max(0, Math.min(activeIndex - 1, maxStartIndex));
  return europaFixturesState.rounds.slice(startIndex, startIndex + visibleCount);
};

const renderEuropaRoundPills = () => {
  const matchdayRow = document.querySelector('.league-card.europa .matchday-row');
  if (!matchdayRow) return;

  const visibleRounds = getVisibleEuropaRounds();
  matchdayRow.dataset.fixtureSource = 'europa';
  matchdayRow.innerHTML = visibleRounds
    .map((roundKey) => {
      const label = getEuropaRoundLabel(roundKey) || roundKey;
      return `
        <button
          class="mw-pill${roundKey === europaFixturesState.activeRound ? ' active' : ''}"
          type="button"
          data-round="${roundKey}"
        >
          ${label}
        </button>
      `;
    })
    .join('');
};

const renderEuropaFixtures = (roundKey = europaFixturesState.activeRound) => {
  const matchGrid = document.querySelector('.league-card.europa .match-grid');
  if (!matchGrid) return;

  const ties = europaFixturesState.tiesByRound.get(roundKey) || [];
  if (!ties.length) {
    matchGrid.innerHTML = `${buildGhostCardMarkup()}${buildGhostCardMarkup()}`;
    return;
  }

  europaFixturesState.activeRound = roundKey;

  const head = document.querySelector('.league-card.europa .fixtures-head');
  if (head) {
    const spans = head.querySelectorAll('span');
    if (spans[0]) spans[0].textContent = 'Leg 1';
    if (spans[1]) spans[1].textContent = 'Leg 2';
  }

  const cells = [];
  ties.forEach((tie) => {
    cells.push(tie.leg1 ? buildFixtureCardMarkup(tie.leg1) : buildGhostCardMarkup());
    cells.push(tie.leg2 ? buildFixtureCardMarkup(tie.leg2) : buildGhostCardMarkup());
  });

  matchGrid.innerHTML = cells.join('');
  renderEuropaRoundPills();
};

const hydrateEuropaFixtures = async () => {
  const europaCard = document.querySelector('.league-card.europa');
  if (!europaCard) return;

  try {
    const response = await fetch(EUROPA_TIES_URL);
    if (!response.ok) {
      throw new Error(`Europa League fixture request failed (${response.status})`);
    }
    const csvText = await response.text();
    const lines = String(csvText || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) throw new Error('Europa League fixture CSV is empty.');

    const headers = lines[0].split(',').map((h) => h.trim());
    const indexOf = (name) => headers.findIndex((h) => h === name);

    const idxRound = indexOf('Round');
    const idxHome = indexOf('Home Team');
    const idxAway = indexOf('Away Team');
    const idxLeg1 = indexOf('Leg 1 Score');
    const idxLeg2 = indexOf('Leg 2 Score');

    if (idxRound === -1 || idxHome === -1 || idxAway === -1 || idxLeg1 === -1) {
      throw new Error('Europa League fixture CSV headers not recognised.');
    }

    const parseScore = (value) => {
      const raw = String(value || '').trim();
      if (!raw) return null;
      const match = raw.match(/(\d+)\s*[-–]\s*(\d+)/);
      if (!match) return null;
      const homeGoals = Number.parseInt(match[1], 10);
      const awayGoals = Number.parseInt(match[2], 10);
      if (!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) return null;
      return { homeGoals, awayGoals };
    };

    europaFixturesState.rounds = [];
    europaFixturesState.activeRound = null;
    europaFixturesState.tiesByRound.clear();
    europaFixturesState.teamsById.clear();
    europaFixturesState.matchesById.clear();

    const seenRounds = new Set();
    const base = Date.UTC(2025, 6, 1);
    const dayMs = 24 * 60 * 60 * 1000;
    let matchIndex = 0;

    for (let i = 1; i < lines.length; i += 1) {
      const cols = lines[i].split(',');
      const roundKey = String(cols[idxRound] || '').trim();
      const homeTeamName = String(cols[idxHome] || '').trim();
      const awayTeamName = String(cols[idxAway] || '').trim();
      if (!roundKey || !homeTeamName || !awayTeamName) continue;

      if (!seenRounds.has(roundKey)) {
        europaFixturesState.rounds.push(roundKey);
        seenRounds.add(roundKey);
      }

      const homeTeam = ensureEuropaTeam(homeTeamName);
      const awayTeam = ensureEuropaTeam(awayTeamName);

      const leg1Score = parseScore(cols[idxLeg1]);
      const leg2Score = idxLeg2 >= 0 ? parseScore(cols[idxLeg2]) : null;

      const roundSlug = normalizeLooseTeamId(roundKey) || 'round';
      const baseId = `europa-${roundSlug}-${homeTeam.id}-vs-${awayTeam.id}`;

      const leg1Match = leg1Score
        ? {
            id: `${baseId}-leg1`,
            competitionId: 'europa-league-2025-2026',
            matchday: roundKey,
            status: 'completed',
            matchDate: new Date(base + matchIndex * dayMs).toISOString(),
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            homeScore: leg1Score.homeGoals,
            awayScore: leg1Score.awayGoals
          }
        : null;
      if (leg1Match) {
        europaFixturesState.matchesById.set(leg1Match.id, leg1Match);
        matchIndex += 1;
      }

      const leg2Match = leg2Score
        ? {
            id: `${baseId}-leg2`,
            competitionId: 'europa-league-2025-2026',
            matchday: roundKey,
            status: 'completed',
            matchDate: new Date(base + matchIndex * dayMs).toISOString(),
            homeTeamId: awayTeam.id,
            awayTeamId: homeTeam.id,
            homeScore: leg2Score.homeGoals,
            awayScore: leg2Score.awayGoals
          }
        : null;
      if (leg2Match) {
        europaFixturesState.matchesById.set(leg2Match.id, leg2Match);
        matchIndex += 1;
      }

      const bucket = europaFixturesState.tiesByRound.get(roundKey) || [];
      bucket.push({ leg1: leg1Match, leg2: leg2Match });
      europaFixturesState.tiesByRound.set(roundKey, bucket);
    }

    const europaR16 = europaFixturesState.rounds.find((round) => /round of 16/i.test(String(round)));
    europaFixturesState.activeRound = europaR16 || pickMostAdvancedUefaRound(europaFixturesState.rounds);
    renderEuropaFixtures();
    tryOpenMatchFromQuery();
  } catch (error) {
    console.warn('Unable to hydrate Europa League fixtures from history CSV.', error);
  }
};

const getVisibleConferenceRounds = () => {
  const activeIndex = conferenceFixturesState.rounds.indexOf(conferenceFixturesState.activeRound);
  const visibleCount = 4;

  if (activeIndex === -1) return conferenceFixturesState.rounds.slice(0, visibleCount);
  if (conferenceFixturesState.rounds.length <= visibleCount) return [...conferenceFixturesState.rounds];

  const maxStartIndex = conferenceFixturesState.rounds.length - visibleCount;
  const startIndex = Math.max(0, Math.min(activeIndex - 1, maxStartIndex));
  return conferenceFixturesState.rounds.slice(startIndex, startIndex + visibleCount);
};

const renderConferenceRoundPills = () => {
  const matchdayRow = document.querySelector('.league-card.conference .matchday-row');
  if (!matchdayRow) return;

  const visibleRounds = getVisibleConferenceRounds();
  matchdayRow.dataset.fixtureSource = 'conference';
  matchdayRow.innerHTML = visibleRounds
    .map((roundKey) => {
      const label = getEuropaRoundLabel(roundKey) || roundKey;
      return `
        <button
          class="mw-pill${roundKey === conferenceFixturesState.activeRound ? ' active' : ''}"
          type="button"
          data-round="${roundKey}"
        >
          ${label}
        </button>
      `;
    })
    .join('');
};

const renderConferenceFixtures = (roundKey = conferenceFixturesState.activeRound) => {
  const matchGrid = document.querySelector('.league-card.conference .match-grid');
  if (!matchGrid) return;

  const ties = conferenceFixturesState.tiesByRound.get(roundKey) || [];
  if (!ties.length) {
    matchGrid.innerHTML = `${buildGhostCardMarkup()}${buildGhostCardMarkup()}`;
    return;
  }

  conferenceFixturesState.activeRound = roundKey;

  const head = document.querySelector('.league-card.conference .fixtures-head');
  if (head) {
    const spans = head.querySelectorAll('span');
    if (spans[0]) spans[0].textContent = 'Leg 1';
    if (spans[1]) spans[1].textContent = 'Leg 2';
  }

  const cells = [];
  ties.forEach((tie) => {
    cells.push(tie.leg1 ? buildFixtureCardMarkup(tie.leg1) : buildGhostCardMarkup());
    cells.push(tie.leg2 ? buildFixtureCardMarkup(tie.leg2) : buildGhostCardMarkup());
  });

  matchGrid.innerHTML = cells.join('');
  renderConferenceRoundPills();
};

const hydrateConferenceFixtures = async () => {
  const conferenceCard = document.querySelector('.league-card.conference');
  if (!conferenceCard) return;

  try {
    const response = await fetch(CONFERENCE_TIES_URL);
    if (!response.ok) {
      throw new Error(`Conference League fixture request failed (${response.status})`);
    }
    const csvText = await response.text();
    const lines = String(csvText || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) throw new Error('Conference League fixture CSV is empty.');

    const headers = lines[0].split(',').map((h) => h.trim());
    const indexOf = (name) => headers.findIndex((h) => h === name);

    const idxRound = indexOf('Round');
    const idxHome = indexOf('Home Team');
    const idxAway = indexOf('Away Team');
    const idxLeg1 = indexOf('Leg 1 Score');
    const idxLeg2 = indexOf('Leg 2 Score');

    if (idxRound === -1 || idxHome === -1 || idxAway === -1 || idxLeg1 === -1) {
      throw new Error('Conference League fixture CSV headers not recognised.');
    }

    const parseScore = (value) => {
      const raw = String(value || '').trim();
      if (!raw) return null;
      const match = raw.match(/(\d+)\s*[-–]\s*(\d+)/);
      if (!match) return null;
      const homeGoals = Number.parseInt(match[1], 10);
      const awayGoals = Number.parseInt(match[2], 10);
      if (!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) return null;
      return { homeGoals, awayGoals };
    };

    conferenceFixturesState.rounds = [];
    conferenceFixturesState.activeRound = null;
    conferenceFixturesState.tiesByRound.clear();
    conferenceFixturesState.teamsById.clear();
    conferenceFixturesState.matchesById.clear();

    const seenRounds = new Set();
    const base = Date.UTC(2025, 6, 1);
    const dayMs = 24 * 60 * 60 * 1000;
    let matchIndex = 0;

    for (let i = 1; i < lines.length; i += 1) {
      const cols = lines[i].split(',');
      const roundKey = String(cols[idxRound] || '').trim();
      const homeTeamName = String(cols[idxHome] || '').trim();
      const awayTeamName = String(cols[idxAway] || '').trim();
      if (!roundKey || !homeTeamName || !awayTeamName) continue;

      if (!seenRounds.has(roundKey)) {
        conferenceFixturesState.rounds.push(roundKey);
        seenRounds.add(roundKey);
      }

      const homeTeam = ensureConferenceTeam(homeTeamName);
      const awayTeam = ensureConferenceTeam(awayTeamName);

      const leg1Score = parseScore(cols[idxLeg1]);
      const leg2Score = idxLeg2 >= 0 ? parseScore(cols[idxLeg2]) : null;

      const roundSlug = normalizeLooseTeamId(roundKey) || 'round';
      const baseId = `conference-${roundSlug}-${homeTeam.id}-vs-${awayTeam.id}`;

      const leg1Match = leg1Score
        ? {
            id: `${baseId}-leg1`,
            competitionId: 'conference-league-2025-2026',
            matchday: roundKey,
            status: 'completed',
            matchDate: new Date(base + matchIndex * dayMs).toISOString(),
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            homeScore: leg1Score.homeGoals,
            awayScore: leg1Score.awayGoals
          }
        : null;
      if (leg1Match) {
        conferenceFixturesState.matchesById.set(leg1Match.id, leg1Match);
        matchIndex += 1;
      }

      const leg2Match = leg2Score
        ? {
            id: `${baseId}-leg2`,
            competitionId: 'conference-league-2025-2026',
            matchday: roundKey,
            status: 'completed',
            matchDate: new Date(base + matchIndex * dayMs).toISOString(),
            homeTeamId: awayTeam.id,
            awayTeamId: homeTeam.id,
            homeScore: leg2Score.homeGoals,
            awayScore: leg2Score.awayGoals
          }
        : null;
      if (leg2Match) {
        conferenceFixturesState.matchesById.set(leg2Match.id, leg2Match);
        matchIndex += 1;
      }

      const bucket = conferenceFixturesState.tiesByRound.get(roundKey) || [];
      bucket.push({ leg1: leg1Match, leg2: leg2Match });
      conferenceFixturesState.tiesByRound.set(roundKey, bucket);
    }

    const conferenceR16 = conferenceFixturesState.rounds.find((round) => /round of 16/i.test(String(round)));
    conferenceFixturesState.activeRound = conferenceR16 || pickMostAdvancedUefaRound(conferenceFixturesState.rounds);
    renderConferenceFixtures();
    tryOpenMatchFromQuery();
  } catch (error) {
    console.warn('Unable to hydrate Conference League fixtures from history CSV.', error);
  }
};

const getEnglishCupRoundLabel = (roundName) => {
  const raw = String(roundName || '').trim();
  if (!raw) return '';
  const lower = raw.toLowerCase();

  if (lower.includes('preliminary')) return 'PR';
  if ((lower.includes('first') || lower.includes('1st')) && lower.includes('round')) return 'R1';
  if ((lower.includes('second') || lower.includes('2nd')) && lower.includes('round')) return 'R2';
  if ((lower.includes('third') || lower.includes('3rd')) && lower.includes('round')) return 'R3';
  if ((lower.includes('fourth') || lower.includes('4th')) && lower.includes('round')) return 'R4';
  if ((lower.includes('fifth') || lower.includes('5th')) && lower.includes('round')) return 'R5';
  if (lower.includes('quarter')) return 'QF';
  if (lower.includes('semi') && lower.includes('leg')) {
    const legMatch = lower.match(/leg\s*([12])/);
    return legMatch ? `SF${legMatch[1]}` : 'SF';
  }
  if (lower.includes('semi')) return 'SF';
  if (lower === 'final') return 'F';

  const parts = raw.split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 3)
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
};

const pickCupRoundClosestToNow = (matchesByRound, fallbackRounds = []) => {
  const now = Date.now();
  let bestUpcoming = null;
  let bestPast = null;

  const toTs = (value) => {
    const ts = new Date(value).getTime();
    return Number.isFinite(ts) ? ts : null;
  };

  for (const [roundKey, matches] of matchesByRound.entries()) {
    const stamps = (matches || [])
      .map((match) => toTs(match?.matchDate))
      .filter((stamp) => stamp !== null);
    if (!stamps.length) continue;

    const minTs = Math.min(...stamps);
    const maxTs = Math.max(...stamps);

    if (minTs <= now && maxTs >= now) {
      // Round currently in progress (some played, some upcoming).
      return roundKey;
    }

    if (minTs > now) {
      if (!bestUpcoming || minTs < bestUpcoming.ts) {
        bestUpcoming = { roundKey, ts: minTs };
      }
      continue;
    }

    if (maxTs < now) {
      if (!bestPast || maxTs > bestPast.ts) {
        bestPast = { roundKey, ts: maxTs };
      }
    }
  }

  return bestUpcoming?.roundKey || bestPast?.roundKey || fallbackRounds[0] || null;
};

const getVisibleFacupRounds = () => {
  const activeIndex = facupFixturesState.rounds.indexOf(facupFixturesState.activeRound);
  const visibleCount = 4;

  if (activeIndex === -1) return facupFixturesState.rounds.slice(0, visibleCount);
  if (facupFixturesState.rounds.length <= visibleCount) return [...facupFixturesState.rounds];

  const maxStartIndex = facupFixturesState.rounds.length - visibleCount;
  const startIndex = Math.max(0, Math.min(activeIndex - 1, maxStartIndex));
  return facupFixturesState.rounds.slice(startIndex, startIndex + visibleCount);
};

const renderFacupRoundPills = () => {
  const matchdayRow = document.querySelector('.league-card.facup .matchday-row');
  if (!matchdayRow) return;

  const visibleRounds = getVisibleFacupRounds();
  matchdayRow.dataset.fixtureSource = 'facup';
  matchdayRow.innerHTML = visibleRounds
    .map((roundKey) => {
      const label = getEnglishCupRoundLabel(roundKey) || roundKey;
      return `
        <button
          class="mw-pill${roundKey === facupFixturesState.activeRound ? ' active' : ''}"
          type="button"
          data-round="${roundKey}"
        >
          ${label}
        </button>
      `;
    })
    .join('');
};

const renderFacupFixtures = (roundKey = facupFixturesState.activeRound) => {
  const matchGrid = document.querySelector('.league-card.facup .match-grid');
  if (!matchGrid) return;

  const fixtures = [...(facupFixturesState.matchesByRound.get(roundKey) || [])].sort(
    (left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime()
  );

  if (!fixtures.length) {
    matchGrid.innerHTML = `${buildGhostCardMarkup()}${buildGhostCardMarkup()}`;
    return;
  }

  facupFixturesState.activeRound = roundKey;

  const playedMatches = fixtures
    .filter((match) => match.status === 'completed')
    .sort((left, right) => new Date(right.matchDate).getTime() - new Date(left.matchDate).getTime());
  const upcomingMatches = fixtures
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime());
  const rowCount = Math.max(playedMatches.length, upcomingMatches.length);
  const cells = [];

  for (let index = 0; index < rowCount; index += 1) {
    cells.push(playedMatches[index] ? buildFixtureCardMarkup(playedMatches[index]) : buildGhostCardMarkup());
    cells.push(upcomingMatches[index] ? buildFixtureCardMarkup(upcomingMatches[index]) : buildGhostCardMarkup());
  }

  matchGrid.innerHTML = cells.join('');
  renderFacupRoundPills();
};

const hydrateFacupFixtures = async () => {
  const facupCard = document.querySelector('.league-card.facup');
  if (!facupCard) return;

  try {
    const response = await fetch(FACUP_MATCHES_URL);
    if (!response.ok) {
      throw new Error(`FA Cup fixture request failed (${response.status})`);
    }
    const csvText = await response.text();
    const lines = String(csvText || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) throw new Error('FA Cup fixture CSV is empty.');

    const headers = lines[0].split(',').map((h) => h.trim());
    const indexOf = (name) => headers.findIndex((h) => h === name);

    const idxRound = indexOf('Round');
    const idxDate = indexOf('Date');
    const idxHome = indexOf('Home Team');
    const idxAway = indexOf('Away Team');
    const idxHomeScore = indexOf('Home Score');
    const idxAwayScore = indexOf('Away Score');

    if (idxRound === -1 || idxHome === -1 || idxAway === -1) {
      throw new Error('FA Cup fixture CSV headers not recognised.');
    }

    const parseCupDate = (value) => {
      const raw = String(value || '').trim();
      if (!raw) return null;
      const parsed = Date.parse(`${raw} 20:00`);
      if (!Number.isFinite(parsed)) return null;
      return new Date(parsed).toISOString();
    };

    facupFixturesState.rounds = [];
    facupFixturesState.activeRound = null;
    facupFixturesState.matchesByRound.clear();
    facupFixturesState.teamsById.clear();
    facupFixturesState.matchesById.clear();

    const seenRounds = new Set();
    let matchIndex = 0;

    for (let i = 1; i < lines.length; i += 1) {
      const cols = lines[i].split(',');
      const roundKey = String(cols[idxRound] || '').trim();
      const homeTeamName = String(cols[idxHome] || '').trim();
      const awayTeamName = String(cols[idxAway] || '').trim();
      if (!roundKey || !homeTeamName || !awayTeamName) continue;

      if (!seenRounds.has(roundKey)) {
        facupFixturesState.rounds.push(roundKey);
        seenRounds.add(roundKey);
      }

      const homeTeam = ensureFacupTeam(homeTeamName);
      const awayTeam = ensureFacupTeam(awayTeamName);

      const homeScore = idxHomeScore >= 0 ? Number.parseInt(String(cols[idxHomeScore] ?? '').trim(), 10) : NaN;
      const awayScore = idxAwayScore >= 0 ? Number.parseInt(String(cols[idxAwayScore] ?? '').trim(), 10) : NaN;
      const status = Number.isFinite(homeScore) && Number.isFinite(awayScore) ? 'completed' : 'scheduled';

      const roundSlug = normalizeLooseTeamId(roundKey) || 'round';
      const baseId = `facup-${roundSlug}-${homeTeam.id}-vs-${awayTeam.id}-${matchIndex}`;
      matchIndex += 1;

      const match = {
        id: baseId,
        competitionId: 'fa-cup-2025-2026',
        matchday: roundKey,
        status,
        matchDate: idxDate >= 0 ? parseCupDate(cols[idxDate]) || new Date().toISOString() : new Date().toISOString(),
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore: Number.isFinite(homeScore) ? homeScore : null,
        awayScore: Number.isFinite(awayScore) ? awayScore : null
      };

      facupFixturesState.matchesById.set(match.id, match);
      const bucket = facupFixturesState.matchesByRound.get(roundKey) || [];
      bucket.push(match);
      facupFixturesState.matchesByRound.set(roundKey, bucket);
    }

    facupFixturesState.activeRound = pickCupRoundClosestToNow(facupFixturesState.matchesByRound, facupFixturesState.rounds);
    renderFacupFixtures();
    tryOpenMatchFromQuery();
  } catch (error) {
    console.warn('Unable to hydrate FA Cup fixtures from history CSV.', error);
  }
};

const getVisibleCarabaoRounds = () => {
  const activeIndex = carabaocupFixturesState.rounds.indexOf(carabaocupFixturesState.activeRound);
  const visibleCount = 4;

  if (activeIndex === -1) return carabaocupFixturesState.rounds.slice(0, visibleCount);
  if (carabaocupFixturesState.rounds.length <= visibleCount) return [...carabaocupFixturesState.rounds];

  const maxStartIndex = carabaocupFixturesState.rounds.length - visibleCount;
  const startIndex = Math.max(0, Math.min(activeIndex - 1, maxStartIndex));
  return carabaocupFixturesState.rounds.slice(startIndex, startIndex + visibleCount);
};

const renderCarabaoRoundPills = () => {
  const matchdayRow = document.querySelector('.league-card.carabaocup .matchday-row');
  if (!matchdayRow) return;

  const visibleRounds = getVisibleCarabaoRounds();
  matchdayRow.dataset.fixtureSource = 'carabaocup';
  matchdayRow.innerHTML = visibleRounds
    .map((roundKey) => {
      const label = getEnglishCupRoundLabel(roundKey) || roundKey;
      return `
        <button
          class="mw-pill${roundKey === carabaocupFixturesState.activeRound ? ' active' : ''}"
          type="button"
          data-round="${roundKey}"
        >
          ${label}
        </button>
      `;
    })
    .join('');
};

const renderCarabaoFixtures = (roundKey = carabaocupFixturesState.activeRound) => {
  const matchGrid = document.querySelector('.league-card.carabaocup .match-grid');
  if (!matchGrid) return;

  const finalRoundKey = carabaocupFixturesState.rounds[carabaocupFixturesState.rounds.length - 1];
  const isFinalRound = Boolean(finalRoundKey && roundKey === finalRoundKey);
  const roundsToDisplay = isFinalRound ? carabaocupFixturesState.rounds.slice(-4) : [roundKey];

  const fixtures = roundsToDisplay
    .flatMap((key) => carabaocupFixturesState.matchesByRound.get(key) || [])
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime());

  if (!fixtures.length) {
    matchGrid.innerHTML = `${buildGhostCardMarkup()}${buildGhostCardMarkup()}`;
    return;
  }

  carabaocupFixturesState.activeRound = roundKey;

  const playedMatches = fixtures
    .filter((match) => match.status === 'completed')
    .sort((left, right) => new Date(right.matchDate).getTime() - new Date(left.matchDate).getTime());
  const upcomingMatches = fixtures
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime());
  const rowCount = Math.max(playedMatches.length, upcomingMatches.length);
  const cells = [];

  for (let index = 0; index < rowCount; index += 1) {
    cells.push(playedMatches[index] ? buildFixtureCardMarkup(playedMatches[index]) : buildGhostCardMarkup());
    cells.push(upcomingMatches[index] ? buildFixtureCardMarkup(upcomingMatches[index]) : buildGhostCardMarkup());
  }

  matchGrid.innerHTML = cells.join('');
  renderCarabaoRoundPills();
};

const hydrateCarabaoFixtures = async () => {
  const carabaoCard = document.querySelector('.league-card.carabaocup');
  if (!carabaoCard) return;

  try {
    const response = await fetch(CARABAO_MATCHES_URL);
    if (!response.ok) {
      throw new Error(`Carabao Cup fixture request failed (${response.status})`);
    }
    const csvText = await response.text();
    const lines = String(csvText || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) throw new Error('Carabao Cup fixture CSV is empty.');

    const headers = lines[0].split(',').map((h) => h.trim());
    const indexOf = (name) => headers.findIndex((h) => h === name);

    const idxRound = indexOf('Round');
    const idxDate = indexOf('Date');
    const idxHome = indexOf('Home Team');
    const idxAway = indexOf('Away Team');
    const idxHomeScore = indexOf('Home Score');
    const idxAwayScore = indexOf('Away Score');

    if (idxRound === -1 || idxHome === -1 || idxAway === -1) {
      throw new Error('Carabao Cup fixture CSV headers not recognised.');
    }

    const parseCupDate = (value) => {
      const raw = String(value || '').trim();
      if (!raw) return null;
      const parsed = Date.parse(`${raw} 20:00`);
      if (!Number.isFinite(parsed)) return null;
      return new Date(parsed).toISOString();
    };

    carabaocupFixturesState.rounds = [];
    carabaocupFixturesState.activeRound = null;
    carabaocupFixturesState.matchesByRound.clear();
    carabaocupFixturesState.teamsById.clear();
    carabaocupFixturesState.matchesById.clear();

    const seenRounds = new Set();
    let matchIndex = 0;

    for (let i = 1; i < lines.length; i += 1) {
      const cols = lines[i].split(',');
      const roundKey = String(cols[idxRound] || '').trim();
      const homeTeamName = String(cols[idxHome] || '').trim();
      const awayTeamName = String(cols[idxAway] || '').trim();
      if (!roundKey || !homeTeamName || !awayTeamName) continue;

      if (!seenRounds.has(roundKey)) {
        carabaocupFixturesState.rounds.push(roundKey);
        seenRounds.add(roundKey);
      }

      const homeTeam = ensureCarabaoTeam(homeTeamName);
      const awayTeam = ensureCarabaoTeam(awayTeamName);

      const homeScore = idxHomeScore >= 0 ? Number.parseInt(String(cols[idxHomeScore] ?? '').trim(), 10) : NaN;
      const awayScore = idxAwayScore >= 0 ? Number.parseInt(String(cols[idxAwayScore] ?? '').trim(), 10) : NaN;
      const status = Number.isFinite(homeScore) && Number.isFinite(awayScore) ? 'completed' : 'scheduled';

      const roundSlug = normalizeLooseTeamId(roundKey) || 'round';
      const baseId = `carabao-${roundSlug}-${homeTeam.id}-vs-${awayTeam.id}-${matchIndex}`;
      matchIndex += 1;

      const match = {
        id: baseId,
        competitionId: 'carabao-cup-2025-2026',
        matchday: roundKey,
        status,
        matchDate: idxDate >= 0 ? parseCupDate(cols[idxDate]) || new Date().toISOString() : new Date().toISOString(),
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore: Number.isFinite(homeScore) ? homeScore : null,
        awayScore: Number.isFinite(awayScore) ? awayScore : null
      };

      carabaocupFixturesState.matchesById.set(match.id, match);
      const bucket = carabaocupFixturesState.matchesByRound.get(roundKey) || [];
      bucket.push(match);
      carabaocupFixturesState.matchesByRound.set(roundKey, bucket);
    }

    carabaocupFixturesState.activeRound = pickCupRoundClosestToNow(
      carabaocupFixturesState.matchesByRound,
      carabaocupFixturesState.rounds
    );
    renderCarabaoFixtures();
    tryOpenMatchFromQuery();
  } catch (error) {
    console.warn('Unable to hydrate Carabao Cup fixtures from history CSV.', error);
  }
};

const getWorldcupRoundLabel = (roundName) => {
  const raw = String(roundName || '').trim();
  if (!raw) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const stamp = Date.parse(`${raw}T00:00:00Z`);
    if (Number.isFinite(stamp)) {
      return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(new Date(stamp));
    }
  }

  const lower = raw.toLowerCase();
  const matchdayMatch = lower.match(/matchday\s*(\d+)/);

  if (lower.includes('group') && matchdayMatch) return `GS${matchdayMatch[1]}`;
  if (matchdayMatch) return `MD${matchdayMatch[1]}`;

  if (lower.includes('round of 16') || lower.includes('round-of-16') || lower === 'r16') return 'R16';
  if (lower.includes('quarter')) return 'QF';
  if (lower.includes('semi')) return 'SF';
  if (lower === 'final' || lower.includes(' final')) return 'F';

  const parts = raw.split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 3)
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
};

const getVisibleWorldcupRounds = () => {
  const activeIndex = worldcupFixturesState.rounds.indexOf(worldcupFixturesState.activeRound);
  const visibleCount = 4;

  if (activeIndex === -1) return worldcupFixturesState.rounds.slice(0, visibleCount);
  if (worldcupFixturesState.rounds.length <= visibleCount) return [...worldcupFixturesState.rounds];

  const maxStartIndex = worldcupFixturesState.rounds.length - visibleCount;
  const startIndex = Math.max(0, Math.min(activeIndex - 1, maxStartIndex));
  return worldcupFixturesState.rounds.slice(startIndex, startIndex + visibleCount);
};

const renderWorldcupRoundPills = () => {
  const matchdayRow = document.querySelector('.league-card.worldcup .matchday-row');
  if (!matchdayRow) return;

  const visibleRounds = getVisibleWorldcupRounds();
  matchdayRow.dataset.fixtureSource = 'worldcup';
  matchdayRow.innerHTML = visibleRounds
    .map((roundKey) => {
      const label = getWorldcupRoundLabel(roundKey) || roundKey;
      return `
        <button
          class="mw-pill${roundKey === worldcupFixturesState.activeRound ? ' active' : ''}"
          type="button"
          data-round="${roundKey}"
        >
          ${label}
        </button>
      `;
    })
    .join('');
};

const renderWorldcupFixtures = (roundKey = worldcupFixturesState.activeRound) => {
  const matchGrid = document.querySelector('.league-card.worldcup .match-grid');
  if (!matchGrid) return;

  const fixtures = [...(worldcupFixturesState.matchesByRound.get(roundKey) || [])].sort(
    (left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime()
  );

  if (!fixtures.length) {
    matchGrid.innerHTML = `${buildGhostCardMarkup()}${buildGhostCardMarkup()}`;
    return;
  }

  worldcupFixturesState.activeRound = roundKey;

  const playedMatches = fixtures
    .filter((match) => match.status === 'completed')
    .sort((left, right) => new Date(right.matchDate).getTime() - new Date(left.matchDate).getTime());
  const upcomingMatches = fixtures
    .filter((match) => match.status !== 'completed')
    .sort((left, right) => new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime());
  const rowCount = Math.max(playedMatches.length, upcomingMatches.length);
  const cells = [];

  for (let index = 0; index < rowCount; index += 1) {
    cells.push(playedMatches[index] ? buildFixtureCardMarkup(playedMatches[index]) : buildGhostCardMarkup());
    cells.push(upcomingMatches[index] ? buildFixtureCardMarkup(upcomingMatches[index]) : buildGhostCardMarkup());
  }

  matchGrid.innerHTML = cells.join('');
  renderWorldcupRoundPills();
};

const hydrateWorldcupFixtures = async () => {
  const worldcupCard = document.querySelector('.league-card.worldcup');
  if (!worldcupCard) return;

  try {
    const response = await fetch(WORLDCUP_MATCHES_URL);
    if (!response.ok) {
      throw new Error(`World Cup fixture request failed (${response.status})`);
    }
    const csvText = await response.text();
    const lines = String(csvText || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) throw new Error('World Cup fixture CSV is empty.');

    const headers = lines[0].split(',').map((h) => h.trim());
    const indexOf = (name) => headers.findIndex((h) => h === name);

    const idxRound = indexOf('Round');
    const idxDate = indexOf('Date');
    const idxHome = indexOf('Home Team');
    const idxAway = indexOf('Away Team');
    const idxHomeScore = indexOf('Home Score');
    const idxAwayScore = indexOf('Away Score');

    const idxHomeTeam = indexOf('HomeTeam');
    const idxAwayTeam = indexOf('AwayTeam');
    const idxFthg = indexOf('FTHG');
    const idxFtag = indexOf('FTAG');

    const idxTournament = indexOf('Tournament');
    const idxTime = indexOf('Time');
    const idxTeam1 = indexOf('Team1');
    const idxTeam2 = indexOf('Team2');
    const idxScore1 = indexOf('Score1');

    const hasCupHeaders = idxHome !== -1 && idxAway !== -1;
    const hasFootballDataHeaders = idxHomeTeam !== -1 && idxAwayTeam !== -1;
    const hasFifaScheduleHeaders = idxTeam1 !== -1 && idxTeam2 !== -1 && idxDate !== -1;

    if (!hasCupHeaders && !hasFootballDataHeaders && !hasFifaScheduleHeaders) {
      throw new Error('World Cup fixture CSV headers not recognised.');
    }

    const parseWorldcupDate = (value) => {
      const raw = String(value || '').trim();
      if (!raw) return null;

      const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (slashMatch) {
        const day = Number.parseInt(slashMatch[1], 10);
        const month = Number.parseInt(slashMatch[2], 10);
        const yearPart = Number.parseInt(slashMatch[3], 10);
        if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(yearPart)) return null;
        const year =
          slashMatch[3].length >= 4 ? yearPart : yearPart >= 90 ? 1900 + yearPart : 2000 + yearPart;
        return new Date(year, month - 1, day, 20, 0).toISOString();
      }

      const parsedDirect = Date.parse(raw);
      if (Number.isFinite(parsedDirect)) return new Date(parsedDirect).toISOString();

      const parsedWithTime = Date.parse(`${raw} 20:00`);
      if (Number.isFinite(parsedWithTime)) return new Date(parsedWithTime).toISOString();

      return null;
    };

    const parseWorldcupScheduleDateTime = (tournamentValue, dateValue, timeValue) => {
      const tournamentRaw = String(tournamentValue || '').trim();
      const dateRaw = String(dateValue || '').trim();
      const timeRaw = String(timeValue || '').trim();
      if (!dateRaw) return null;

      const yearMatch = tournamentRaw.match(/(\d{4})/);
      const year = yearMatch ? Number.parseInt(yearMatch[1], 10) : null;
      if (!Number.isFinite(year)) return null;

      const parts = dateRaw.split(/\s+/).filter(Boolean);
      const monthRaw = parts.length >= 2 ? parts[parts.length - 2] : null;
      const dayRaw = parts.length >= 1 ? parts[parts.length - 1] : null;
      const day = dayRaw ? Number.parseInt(dayRaw, 10) : NaN;
      if (!monthRaw || !Number.isFinite(day)) return null;

      const monthKey = monthRaw.toLowerCase();
      const months = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11
      };
      const month = months[monthKey];
      if (!Number.isFinite(month)) return null;

      const timeMatch = timeRaw.match(/(\d{1,2})\s*:\s*(\d{2})/);
      const hour = timeMatch ? Number.parseInt(timeMatch[1], 10) : 20;
      const minute = timeMatch ? Number.parseInt(timeMatch[2], 10) : 0;
      if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;

      const tzMatch = timeRaw.match(/UTC\s*([+-]\d{1,2})/i);
      const offsetHours = tzMatch ? Number.parseInt(tzMatch[1], 10) : 0;
      const offsetMinutes = Number.isFinite(offsetHours) ? offsetHours * 60 : 0;

      const localMinutes = hour * 60 + minute;
      const utcMinutes = localMinutes - offsetMinutes;

      const baseUtc = Date.UTC(year, month, day, 0, 0, 0);
      const stamp = baseUtc + utcMinutes * 60 * 1000;
      const iso = Number.isFinite(stamp) ? new Date(stamp).toISOString() : null;
      const localKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      if (!iso) return null;
      return { iso, localKey };
    };

    const parseFtScorePair = (value) => {
      const raw = String(value || '').trim();
      if (!raw) return null;
      const match = raw.match(/(\d+)\s*[-–]\s*(\d+)/);
      if (!match) return null;
      const homeGoals = Number.parseInt(match[1], 10);
      const awayGoals = Number.parseInt(match[2], 10);
      if (!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) return null;
      return { homeGoals, awayGoals };
    };

    worldcupFixturesState.rounds = [];
    worldcupFixturesState.activeRound = null;
    worldcupFixturesState.matchesByRound.clear();
    worldcupFixturesState.teamsById.clear();
    worldcupFixturesState.matchesById.clear();

    const seenRounds = new Set();
    const roundMinTs = new Map();
    let matchIndex = 0;

    for (let i = 1; i < lines.length; i += 1) {
      const cols = lines[i].split(',');

      const homeName = hasCupHeaders
        ? String(cols[idxHome] || '').trim()
        : hasFootballDataHeaders
          ? String(cols[idxHomeTeam] || '').trim()
          : String(cols[idxTeam1] || '').trim();
      const awayName = hasCupHeaders
        ? String(cols[idxAway] || '').trim()
        : hasFootballDataHeaders
          ? String(cols[idxAwayTeam] || '').trim()
          : String(cols[idxTeam2] || '').trim();
      if (!homeName || !awayName) continue;

      let matchDate = new Date().toISOString();
      let localRoundKey = null;

      if (hasFifaScheduleHeaders) {
        const schedule = parseWorldcupScheduleDateTime(cols[idxTournament], cols[idxDate], idxTime >= 0 ? cols[idxTime] : '');
        if (schedule?.iso) {
          matchDate = schedule.iso;
          localRoundKey = schedule.localKey || null;
        }
      } else if (idxDate >= 0) {
        matchDate = parseWorldcupDate(cols[idxDate]) || matchDate;
      }

      const rawRound = idxRound >= 0 ? String(cols[idxRound] || '').trim() : '';
      const roundKey = rawRound || localRoundKey || String(matchDate).slice(0, 10);

      if (!seenRounds.has(roundKey)) {
        worldcupFixturesState.rounds.push(roundKey);
        seenRounds.add(roundKey);
      }

      const ts = new Date(matchDate).getTime();
      if (Number.isFinite(ts)) {
        const currentMin = roundMinTs.get(roundKey);
        if (currentMin === undefined || ts < currentMin) {
          roundMinTs.set(roundKey, ts);
        }
      }

      const homeTeam = ensureWorldcupTeam(homeName);
      const awayTeam = ensureWorldcupTeam(awayName);

      const now = Date.now();
      const matchStamp = new Date(matchDate).getTime();
      const isFuture = Number.isFinite(matchStamp) ? matchStamp > now : false;

      let status = 'scheduled';
      let homeScore = null;
      let awayScore = null;

      if (!isFuture) {
        if (hasFifaScheduleHeaders) {
          const ft = parseFtScorePair(cols[idxScore1]);
          if (ft) {
            status = 'completed';
            homeScore = ft.homeGoals;
            awayScore = ft.awayGoals;
          }
        } else {
          const rawHomeScore = hasCupHeaders ? cols[idxHomeScore] : cols[idxFthg];
          const rawAwayScore = hasCupHeaders ? cols[idxAwayScore] : cols[idxFtag];
          const parsedHome = Number.parseInt(String(rawHomeScore ?? '').trim(), 10);
          const parsedAway = Number.parseInt(String(rawAwayScore ?? '').trim(), 10);
          if (Number.isFinite(parsedHome) && Number.isFinite(parsedAway)) {
            status = 'completed';
            homeScore = parsedHome;
            awayScore = parsedAway;
          }
        }
      }

      const roundSlug = normalizeLooseTeamId(roundKey) || 'round';
      const matchId = `worldcup-${roundSlug}-${homeTeam.id}-vs-${awayTeam.id}-${matchIndex}`;
      matchIndex += 1;

      const match = {
        id: matchId,
        competitionId: 'worldcup-2026',
        matchday: roundKey,
        status,
        matchDate,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore,
        awayScore
      };

      worldcupFixturesState.matchesById.set(match.id, match);
      const bucket = worldcupFixturesState.matchesByRound.get(roundKey) || [];
      bucket.push(match);
      worldcupFixturesState.matchesByRound.set(roundKey, bucket);
    }

    if (worldcupFixturesState.rounds.length > 1) {
      const decorated = worldcupFixturesState.rounds.map((roundKey, index) => ({
        roundKey,
        index,
        ts: roundMinTs.get(roundKey) ?? null
      }));
      decorated.sort((left, right) => {
        if (left.ts === null && right.ts === null) return left.index - right.index;
        if (left.ts === null) return 1;
        if (right.ts === null) return -1;
        if (left.ts !== right.ts) return left.ts - right.ts;
        return left.index - right.index;
      });
      worldcupFixturesState.rounds = decorated.map((item) => item.roundKey);
    }

    worldcupFixturesState.activeRound = pickCupRoundClosestToNow(
      worldcupFixturesState.matchesByRound,
      worldcupFixturesState.rounds
    );
    renderWorldcupFixtures();
    tryOpenMatchFromQuery();
  } catch (error) {
    console.warn('Unable to hydrate World Cup fixtures from history CSV.', error);
  }
};

const hydrateChampionshipFixtures = async () => {
  try {
    const response = await fetch(CHAMPIONSHIP_MATCHES_URL);
    if (!response.ok) {
      throw new Error(`Championship fixture request failed (${response.status})`);
    }

    const csvText = await response.text();
    const lines = String(csvText || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) throw new Error('Championship fixture CSV is empty.');

    const headers = lines[0].split(',').map((header) => header.trim());
    const indexOf = (name) => headers.findIndex((header) => header === name);

    const idxDate = indexOf('Date');
    const idxHome = indexOf('HomeTeam');
    const idxAway = indexOf('AwayTeam');
    const idxHomeScore = indexOf('FTHG');
    const idxAwayScore = indexOf('FTAG');

    if (idxHome === -1 || idxAway === -1) {
      throw new Error('Championship fixture CSV headers not recognised.');
    }

    const parseChampionshipDate = (value) => {
      const raw = String(value || '').trim();
      if (!raw) return null;
      const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (slashMatch) {
        const day = Number.parseInt(slashMatch[1], 10);
        const month = Number.parseInt(slashMatch[2], 10);
        const yearRaw = slashMatch[3];
        const yearNum = Number.parseInt(yearRaw, 10);
        const year = yearRaw.length === 4 ? yearNum : 2000 + yearNum;
        if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return null;
        return new Date(Date.UTC(year, month - 1, day, 15, 0)).toISOString();
      }
      const parsed = Date.parse(raw);
      return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
    };

    const bucket = new Map();
    const matches = [];
    championshipFixturesState.teamsById.clear();

    lines.slice(1).forEach((line, index) => {
      const cols = line.split(',');
      const homeTeamName = String(cols[idxHome] || '').trim();
      const awayTeamName = String(cols[idxAway] || '').trim();
      if (!homeTeamName || !awayTeamName) return;

      const homeTeam = ensureChampionshipTeam(homeTeamName);
      const awayTeam = ensureChampionshipTeam(awayTeamName);
      const homeScore = idxHomeScore >= 0 ? Number.parseInt(String(cols[idxHomeScore] ?? '').trim(), 10) : NaN;
      const awayScore = idxAwayScore >= 0 ? Number.parseInt(String(cols[idxAwayScore] ?? '').trim(), 10) : NaN;

      const match = {
        id: `championship-1-${homeTeam.id}-vs-${awayTeam.id}-${index}`,
        competitionId: 'efl-championship-2025-2026',
        matchday: 1,
        status: Number.isFinite(homeScore) && Number.isFinite(awayScore) ? 'completed' : 'scheduled',
        matchDate: idxDate >= 0 ? parseChampionshipDate(cols[idxDate]) || new Date().toISOString() : new Date().toISOString(),
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore: Number.isFinite(homeScore) ? homeScore : null,
        awayScore: Number.isFinite(awayScore) ? awayScore : null
      };

      matches.push(match);
    });

    bucket.set(1, matches);
    championshipFixturesState.activeMatchday = 1;
    championshipFixturesState.matchesByMatchday = bucket;
    renderChampionshipFixtures(1);
    tryOpenMatchFromQuery();
  } catch (error) {
    console.warn('Unable to hydrate Championship fixtures from history CSV.', error);
  }
};

const hydratePremierLeagueFixtures = async () => {
  const premierCard = document.querySelector('.league-card.premier');
  if (!premierCard) return;

  try {
    const [teamsResponse, matchesResponse] = await Promise.all([
      fetch(PREMIER_TEAMS_URL),
      fetch(PREMIER_MATCHES_URL)
    ]);

    if (!teamsResponse.ok || !matchesResponse.ok) {
      throw new Error(`Premier League data request failed (${teamsResponse.status}/${matchesResponse.status})`);
    }

    const [teams, matches] = await Promise.all([teamsResponse.json(), matchesResponse.json()]);
    premierFixturesState.teamsById = new Map(teams.map((team) => [team.id, team]));

    const matchesByMatchday = matches.reduce((bucket, match) => {
      const matchday = Number(match.matchday);
      const existing = bucket.get(matchday) || [];
      existing.push(match);
      bucket.set(matchday, existing);
      return bucket;
    }, new Map());

    premierFixturesState.matchesByMatchday = matchesByMatchday;
    premierFixturesState.matchdays = [...matchesByMatchday.keys()].sort((left, right) => left - right);
    premierFixturesState.activeMatchday = getInitialPremierMatchday();

    renderPremierFixtures();
    tryOpenMatchFromQuery();
  } catch (error) {
    console.warn('Unable to hydrate Premier League fixtures from db-api seed data.', error);
  }
};

const hydrateSerieAFixtures = async () => {
  const serieaCard = document.querySelector('.league-card.seriea');
  if (!serieaCard) return;

  try {
    const [teamsResponse, matchesResponse] = await Promise.all([fetch(SERIEA_TEAMS_URL), fetch(SERIEA_MATCHES_URL)]);

    if (!teamsResponse.ok || !matchesResponse.ok) {
      throw new Error(`Serie A data request failed (${teamsResponse.status}/${matchesResponse.status})`);
    }

    const [teams, matches] = await Promise.all([teamsResponse.json(), matchesResponse.json()]);
    serieAFixturesState.teamsById = new Map(teams.map((team) => [team.id, team]));

    const matchesByMatchday = matches.reduce((bucket, match) => {
      const matchday = Number(match.matchday);
      const existing = bucket.get(matchday) || [];
      existing.push(match);
      bucket.set(matchday, existing);
      return bucket;
    }, new Map());

    serieAFixturesState.matchesByMatchday = matchesByMatchday;
    serieAFixturesState.matchdays = [...matchesByMatchday.keys()].sort((left, right) => left - right);
    serieAFixturesState.activeMatchday = getInitialSerieAMatchday();

    renderSerieAFixtures();
    tryOpenMatchFromQuery();
  } catch (error) {
    console.warn('Unable to hydrate Serie A fixtures from db-api seed data.', error);
  }
};

const hydrateLaligaFixtures = async () => {
  const laligaCard = document.querySelector('.league-card.laliga');
  if (!laligaCard) return;

  try {
    const [teamsResponse, matchesResponse] = await Promise.all([fetch(LALIGA_TEAMS_URL), fetch(LALIGA_MATCHES_URL)]);

    if (!teamsResponse.ok || !matchesResponse.ok) {
      throw new Error(`LaLiga data request failed (${teamsResponse.status}/${matchesResponse.status})`);
    }

    const [teams, matches] = await Promise.all([teamsResponse.json(), matchesResponse.json()]);
    laligaFixturesState.teamsById = new Map(teams.map((team) => [team.id, team]));

    const matchesByMatchday = matches.reduce((bucket, match) => {
      const matchday = Number(match.matchday);
      const existing = bucket.get(matchday) || [];
      existing.push(match);
      bucket.set(matchday, existing);
      return bucket;
    }, new Map());

    laligaFixturesState.matchesByMatchday = matchesByMatchday;
    laligaFixturesState.matchdays = [...matchesByMatchday.keys()].sort((left, right) => left - right);
    laligaFixturesState.activeMatchday = getInitialLaligaMatchday();

    renderLaligaFixtures();
    tryOpenMatchFromQuery();
  } catch (error) {
    console.warn('Unable to hydrate LaLiga fixtures from db-api seed data.', error);
  }
};

const hydrateBundesligaFixtures = async () => {
  const bundesligaCard = document.querySelector('.league-card.bundesliga');
  if (!bundesligaCard) return;

  try {
    const [teamsResponse, matchesResponse] = await Promise.all([
      fetch(BUNDESLIGA_TEAMS_URL),
      fetch(BUNDESLIGA_MATCHES_URL)
    ]);

    if (!teamsResponse.ok || !matchesResponse.ok) {
      throw new Error(`Bundesliga data request failed (${teamsResponse.status}/${matchesResponse.status})`);
    }

    const [teams, matches] = await Promise.all([teamsResponse.json(), matchesResponse.json()]);
    bundesligaFixturesState.teamsById = new Map(teams.map((team) => [team.id, team]));

    const matchesByMatchday = matches.reduce((bucket, match) => {
      const matchday = Number(match.matchday);
      const existing = bucket.get(matchday) || [];
      existing.push(match);
      bucket.set(matchday, existing);
      return bucket;
    }, new Map());

    bundesligaFixturesState.matchesByMatchday = matchesByMatchday;
    bundesligaFixturesState.matchdays = [...matchesByMatchday.keys()].sort((left, right) => left - right);
    bundesligaFixturesState.activeMatchday = getInitialBundesligaMatchday();

    renderBundesligaFixtures();
    tryOpenMatchFromQuery();
  } catch (error) {
    console.warn('Unable to hydrate Bundesliga fixtures from db-api seed data.', error);
  }
};

const hydrateChampionsLeagueFixtures = async () => {
  const uclCard = document.querySelector('.league-card.ucl');
  if (!uclCard) return;

  try {
    const [teamsResponse, matchesResponse] = await Promise.all([fetch(UCL_TEAMS_URL), fetch(UCL_MATCHES_URL)]);

    if (!teamsResponse.ok || !matchesResponse.ok) {
      throw new Error(`Champions League data request failed (${teamsResponse.status}/${matchesResponse.status})`);
    }

    const [teams, matches] = await Promise.all([teamsResponse.json(), matchesResponse.json()]);
    uclFixturesState.teamsById = new Map(teams.map((team) => [team.id, team]));

    const rounds = buildUclRounds(matches);
    uclFixturesState.rounds = rounds;
    uclFixturesState.matchesByRound = rounds.reduce((bucket, round) => {
      bucket.set(round.key, round.matches);
      return bucket;
    }, new Map());
    uclFixturesState.activeRound = getInitialUclRound();

    renderUclFixtures();
    tryOpenMatchFromQuery();
  } catch (error) {
    console.warn('Unable to hydrate Champions League fixtures from db-api seed data.', error);
  }
};

const hydrateLigue1Fixtures = async () => {
  const ligue1Card = document.querySelector('.league-card.ligue1');
  if (!ligue1Card) return;

  try {
    const [teamsResponse, matchesResponse] = await Promise.all([fetch(LIGUE1_TEAMS_URL), fetch(LIGUE1_MATCHES_URL)]);

    if (!teamsResponse.ok || !matchesResponse.ok) {
      throw new Error(`Ligue 1 data request failed (${teamsResponse.status}/${matchesResponse.status})`);
    }

    const [teams, matches] = await Promise.all([teamsResponse.json(), matchesResponse.json()]);
    ligue1FixturesState.teamsById = new Map(teams.map((team) => [team.id, team]));

    const matchesByMatchday = matches.reduce((bucket, match) => {
      const matchday = Number(match.matchday);
      const existing = bucket.get(matchday) || [];
      existing.push(match);
      bucket.set(matchday, existing);
      return bucket;
    }, new Map());

    ligue1FixturesState.matchesByMatchday = matchesByMatchday;
    ligue1FixturesState.matchdays = [...matchesByMatchday.keys()].sort((left, right) => left - right);
    ligue1FixturesState.activeMatchday = getInitialLigue1Matchday();

    renderLigue1Fixtures();
    tryOpenMatchFromQuery();
  } catch (error) {
    console.warn('Unable to hydrate Ligue 1 fixtures from db-api seed data.', error);
  }
};

const formatBracketDate = (matchDate) => {
  const stamp = Date.parse(String(matchDate || ''));
  if (!Number.isFinite(stamp)) return 'TBD';
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(new Date(stamp));
};

const formatBracketScore = (match) => {
  if (!match) return 'TBD';
  const hasScores = Number.isFinite(match.homeScore) && Number.isFinite(match.awayScore);
  if (match.status === 'completed' && hasScores) {
    const prefix = match.isAggregate ? 'AGG ' : '';
    return `${prefix}${match.homeScore} - ${match.awayScore}`;
  }
  if (match.matchDate) return formatKickoff(match.matchDate);
  return 'TBD';
};

const buildBracketTeamLogoMarkup = (team, competitionId) => {
  const logo = getTeamLogoUrl(team, competitionId);
  if (logo) {
    return `<img class="bracket-logo" src="${logo}" alt="${team.name}" loading="lazy" decoding="async" />`;
  }
  return `<span class="bracket-logo-fallback" aria-hidden="true">${getTeamCode(team)}</span>`;
};

const buildBracketTeamMarkup = (team, competitionId, isRight = false) => `
  <div class="bracket-team${isRight ? ' right' : ''}" title="${team.name}">
    ${buildBracketTeamLogoMarkup(team, competitionId)}
    <span class="bracket-team-code">${getTeamCode(team)}</span>
  </div>
`;

const buildBracketMatchMarkup = (match, { isFinal = false } = {}) => {
  const homeTeam = getTeamForMatch(match, match.homeTeamId);
  const awayTeam = getTeamForMatch(match, match.awayTeamId);
  const dateLine = formatBracketDate(match.matchDate);
  const scoreLine = formatBracketScore(match);

  return `
    <div class="bracket-match${isFinal ? ' is-final' : ''}">
      <div class="bracket-teams">
        ${buildBracketTeamMarkup(homeTeam, match.competitionId)}
        ${buildBracketTeamMarkup(awayTeam, match.competitionId, true)}
      </div>
      <div class="bracket-score">${scoreLine}</div>
      <div class="bracket-meta">${dateLine}</div>
      ${isFinal ? '<span class="bracket-tag">Final</span>' : ''}
    </div>
  `;
};

const makePlaceholderMatch = (competitionId, id, matchday, matchDate = null) => ({
  id,
  competitionId,
  matchday,
  status: 'scheduled',
  matchDate,
  homeTeamId: 'tbd-home',
  awayTeamId: 'tbd-away',
  homeScore: null,
  awayScore: null
});

const findRoundKey = (rounds, predicate) => {
  if (!Array.isArray(rounds)) return null;
  return rounds.find((roundKey) => predicate(String(roundKey || '')));
};

const findRoundWithMatchCount = (state, desiredCount) => {
  if (!state || !Array.isArray(state.rounds)) return null;
  const candidates = state.rounds.filter((roundKey) => (state.matchesByRound.get(roundKey) || []).length === desiredCount);
  return candidates.length ? candidates[candidates.length - 1] : null;
};

const buildCarabaoSemiAggregates = (state) => {
  const leg1Key = findRoundKey(state.rounds, (key) => /semi/i.test(key) && /leg\s*1/i.test(key));
  const leg2Key = findRoundKey(state.rounds, (key) => /semi/i.test(key) && /leg\s*2/i.test(key));
  if (!leg1Key || !leg2Key) return [];

  const legs = [...(state.matchesByRound.get(leg1Key) || []), ...(state.matchesByRound.get(leg2Key) || [])];
  if (!legs.length) return [];

  const tieBuckets = new Map();
  const tieKeyFor = (a, b) => [a, b].sort().join('::');

  for (const match of legs) {
    const key = tieKeyFor(match.homeTeamId, match.awayTeamId);
    const existing = tieBuckets.get(key) || [];
    existing.push(match);
    tieBuckets.set(key, existing);
  }

  const aggregates = [];
  for (const [key, tieLegs] of tieBuckets.entries()) {
    const orderedLegs = [...tieLegs].sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
    const orientation = orderedLegs[orderedLegs.length - 1] || orderedLegs[0];
    if (!orientation) continue;

    const homeId = orientation.homeTeamId;
    const awayId = orientation.awayTeamId;

    const sumGoals = (teamId) =>
      orderedLegs.reduce((total, leg) => {
        if (!Number.isFinite(leg.homeScore) || !Number.isFinite(leg.awayScore)) return total;
        if (leg.homeTeamId === teamId) return total + leg.homeScore;
        if (leg.awayTeamId === teamId) return total + leg.awayScore;
        return total;
      }, 0);

    const matchDate = orientation.matchDate || orderedLegs[0]?.matchDate || null;
    const status = orderedLegs.every((leg) => leg.status === 'completed') ? 'completed' : 'scheduled';

    aggregates.push({
      id: `carabao-semi-${key}`,
      competitionId: 'carabao-cup-2025-2026',
      matchday: 'Semi-final',
      status,
      matchDate,
      homeTeamId: homeId,
      awayTeamId: awayId,
      homeScore: status === 'completed' ? sumGoals(homeId) : null,
      awayScore: status === 'completed' ? sumGoals(awayId) : null,
      isAggregate: true
    });
  }

  return aggregates.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
};

const buildCupBracketData = (cupKey) => {
  const isFacup = cupKey === 'facup';
  const competitionId = isFacup ? 'fa-cup-2025-2026' : 'carabao-cup-2025-2026';
  const state = isFacup ? facupFixturesState : carabaocupFixturesState;

  const roundOf16Key =
    findRoundKey(state.rounds, (key) => (isFacup ? /5th\s*round/i.test(key) || /fifth\s*round/i.test(key) : /fourth\s*round/i.test(key) || /4th\s*round/i.test(key))) ||
    findRoundWithMatchCount(state, 8);

  const quarterFinalKey = findRoundKey(state.rounds, (key) => /quarter/i.test(key));

  const r16Matches = roundOf16Key ? [...(state.matchesByRound.get(roundOf16Key) || [])] : [];
  const qfMatches = quarterFinalKey ? [...(state.matchesByRound.get(quarterFinalKey) || [])] : [];

  const semiMatches = isFacup ? [] : buildCarabaoSemiAggregates(state);
  const finalKey = findRoundKey(state.rounds, (key) => /^final$/i.test(key));
  const finalMatch = finalKey ? (state.matchesByRound.get(finalKey) || [])[0] : null;

  const placeholders = {
    sfLeft: makePlaceholderMatch(competitionId, `${cupKey}-sf-left`, 'Semi-final', isFacup ? '2026-04-25T20:00:00Z' : null),
    sfRight: makePlaceholderMatch(competitionId, `${cupKey}-sf-right`, 'Semi-final', isFacup ? '2026-04-25T20:00:00Z' : null),
    final: makePlaceholderMatch(competitionId, `${cupKey}-final`, 'Final', isFacup ? '2026-05-16T20:00:00Z' : null)
  };

  const orderedSemis = (() => {
    if (semiMatches.length < 2) return [placeholders.sfLeft, placeholders.sfRight];
    const sorted = [...semiMatches].sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
    if (!finalMatch) return sorted.slice(0, 2);
    const homeSemi = sorted.find(
      (semi) => semi.homeTeamId === finalMatch.homeTeamId || semi.awayTeamId === finalMatch.homeTeamId
    );
    if (!homeSemi) return sorted.slice(0, 2);
    const awaySemi = sorted.find((semi) => semi.id !== homeSemi.id);
    return awaySemi ? [homeSemi, awaySemi] : [homeSemi, placeholders.sfRight];
  })();

  const orderedQFs = (() => {
    if (qfMatches.length <= 1) return [...qfMatches];

    const hasRealSemis = orderedSemis.some(
      (semi) => !String(semi.homeTeamId).startsWith('tbd') && !String(semi.awayTeamId).startsWith('tbd')
    );
    if (!hasRealSemis) {
      return [...qfMatches].sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
    }

    const teamToQf = new Map();
    for (const match of qfMatches) {
      teamToQf.set(match.homeTeamId, match);
      teamToQf.set(match.awayTeamId, match);
    }

    const ordered = [];
    const seen = new Set();
    const push = (match) => {
      if (!match || seen.has(match.id)) return;
      seen.add(match.id);
      ordered.push(match);
    };

    for (const semi of orderedSemis) {
      push(teamToQf.get(semi.homeTeamId));
      push(teamToQf.get(semi.awayTeamId));
    }

    for (const match of qfMatches) push(match);
    return ordered.slice(0, 4);
  })();

  const leftQFs = orderedQFs.slice(0, 2);
  const rightQFs = orderedQFs.slice(2, 4);

  const teamToR16 = new Map();
  for (const match of r16Matches) {
    teamToR16.set(match.homeTeamId, match);
    teamToR16.set(match.awayTeamId, match);
  }

  const buildR16For = (qfs) => {
    const ordered = [];
    const seen = new Set();
    const push = (match) => {
      if (!match || seen.has(match.id)) return;
      seen.add(match.id);
      ordered.push(match);
    };
    for (const qf of qfs) {
      push(teamToR16.get(qf.homeTeamId));
      push(teamToR16.get(qf.awayTeamId));
    }
    for (const match of r16Matches) push(match);
    return ordered.slice(0, 4);
  };

  const leftR16 = buildR16For(leftQFs);
  const rightR16 = buildR16For(rightQFs);

  const ensureLength = (list, desired, makeId) => {
    const next = [...list];
    while (next.length < desired) {
      next.push(makePlaceholderMatch(competitionId, makeId(next.length), roundOf16Key || 'Round of 16'));
    }
    return next.slice(0, desired);
  };

  return {
    leftR16: ensureLength(leftR16, 4, (i) => `${cupKey}-r16-left-${i}`),
    rightR16: ensureLength(rightR16, 4, (i) => `${cupKey}-r16-right-${i}`),
    leftQF: ensureLength(leftQFs, 2, (i) => `${cupKey}-qf-left-${i}`),
    rightQF: ensureLength(rightQFs, 2, (i) => `${cupKey}-qf-right-${i}`),
    leftSF: orderedSemis[0] || placeholders.sfLeft,
    rightSF: orderedSemis[1] || placeholders.sfRight,
    final: finalMatch || placeholders.final
  };
};

const buildCupBracketMarkup = (cupKey) => {
  const bracket = buildCupBracketData(cupKey);

  const slot = (match, className, col, row, span = 1, opts) => `
    <div class="bracket-slot ${className}" style="grid-column:${col};grid-row:${row} / span ${span};">
      ${buildBracketMatchMarkup(match, opts)}
    </div>
  `;

  const trophySvg = `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path fill="rgba(255,255,255,0.85)" d="M22 6h20v6h10v8c0 8.4-6.6 15.2-15 15.9A15.9 15.9 0 0 1 36 42v6h8v6H20v-6h8v-6A15.9 15.9 0 0 1 27 35.9C18.6 35.2 12 28.4 12 20v-8h10V6Zm-4 12h-4v2c0 5.2 3.7 9.6 8.6 10.7A16.1 16.1 0 0 1 18 18Zm32 0a16.1 16.1 0 0 1-4.6 12.7C50.3 29.6 54 25.2 54 20v-2h-4Z"/>
    </svg>
  `;

  const finalSlot = `
    <div class="bracket-slot final center" style="grid-column:4;grid-row:1 / span 4;">
      <div class="bracket-center-stack">
        <div class="bracket-trophy" aria-hidden="true">
          ${trophySvg}
          <div class="bracket-champion">Champion</div>
        </div>
        ${buildBracketMatchMarkup(bracket.final, { isFinal: true })}
      </div>
    </div>
  `;

  const cells = [
    ...bracket.leftR16.map((match, idx) => slot(match, 'r16 side-left', 1, idx + 1)),
    slot(bracket.leftQF[0], 'qf side-left', 2, 1, 2),
    slot(bracket.leftQF[1], 'qf side-left', 2, 3, 2),
    slot(bracket.leftSF, 'sf side-left', 3, 1, 4),
    finalSlot,
    slot(bracket.rightSF, 'sf side-right', 5, 1, 4),
    slot(bracket.rightQF[0], 'qf side-right', 6, 1, 2),
    slot(bracket.rightQF[1], 'qf side-right', 6, 3, 2),
    ...bracket.rightR16.map((match, idx) => slot(match, 'r16 side-right', 7, idx + 1))
  ];

  return cells.join('');
};

const openCupOverlay = (cupCard) => {
  const overlay = document.querySelector('#cup-overlay');
  const exitBtn = document.querySelector('#cup-exit');
  const stageLogo = document.querySelector('#cup-stage-logo');
  const stageTitle = document.querySelector('#cup-stage-title');
  const stageSub = document.querySelector('#cup-stage-sub');
  const bracketGrid = document.querySelector('#cup-bracket-grid');
  const bracketScroll = document.querySelector('#cup-bracket-scroll');

  if (!overlay || !bracketGrid || !cupCard) return;

  const cupKey = cupCard.dataset.league || 'facup';
  overlay.dataset.cup = cupKey;

  const styles = window.getComputedStyle(cupCard);
  const bg = styles.backgroundImage || 'none';
  const accent = styles.getPropertyValue('--accent')?.trim() || '#00c07a';
  overlay.style.setProperty('--cup-bg', bg);
  overlay.style.setProperty('--cup-accent', accent);

  const cardLogo = cupCard.querySelector('.league-logo img');
  const cardTitle = cupCard.querySelector('.league-title')?.textContent?.trim();

  if (stageLogo && cardLogo instanceof HTMLImageElement) {
    stageLogo.src = cardLogo.src;
    stageLogo.alt = cardLogo.alt || cardTitle || '';
  }
  if (stageTitle) stageTitle.textContent = cardTitle || (cupKey === 'carabaocup' ? 'Carabao Cup' : 'FA Cup');
  if (stageSub) stageSub.textContent = 'Knockout stage';

  overlay.classList.remove('is-hidden');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cup-overlay-open');

  bracketGrid.innerHTML = buildCupBracketMarkup(cupKey);

  if (exitBtn) {
    exitBtn.focus?.();
  }

  requestAnimationFrame(() => {
    if (!bracketScroll) return;
    const target = (bracketScroll.scrollWidth - bracketScroll.clientWidth) / 2;
    bracketScroll.scrollLeft = Number.isFinite(target) ? target : 0;
  });
};

const closeCupOverlay = () => {
  const overlay = document.querySelector('#cup-overlay');
  if (!overlay) return;
  overlay.classList.add('is-hidden');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cup-overlay-open');
};

let initialMatchOpenAttempted = false;

const tryOpenMatchFromQuery = () => {
  if (initialMatchOpenAttempted) return;
  const params = new URLSearchParams(window.location.search);
  const matchId = params.get('matchId');
  const competitionId = params.get('competitionId');
  const homeName = params.get('homeName');
  const awayName = params.get('awayName');
  if (!matchId && !(competitionId && homeName && awayName)) return;

  let attempts = 0;
  const maxAttempts = 300;
  const timer = window.setInterval(() => {
    attempts += 1;
    const selectedMatch = findMatchFromRouteParams({ matchId, competitionId, homeName, awayName });
    if (selectedMatch) {
      initialMatchOpenAttempted = true;
      window.clearInterval(timer);
      updateMatchView(selectedMatch);
      showMatch();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (attempts >= maxAttempts) {
      window.clearInterval(timer);
    }
  }, 100);
};

export const initHome = () => {
  const leagueView = document.querySelector('.league-view');
  const matchView = document.querySelector('.match-view');
  const matchBack = document.querySelector('#match-back');
  const cupExit = document.querySelector('#cup-exit');
  const cupOverlay = document.querySelector('#cup-overlay');

  leagueView?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const matchdayPill = target.closest('.mw-pill');
    if (matchdayPill) {
      const row = matchdayPill.closest('.matchday-row');
      if (!row) return;

      if (row.dataset.fixtureSource === 'premier-league' && matchdayPill.dataset.matchday) {
        renderPremierFixtures(Number(matchdayPill.dataset.matchday));
        return;
      }

      if (row.dataset.fixtureSource === 'serie-a' && matchdayPill.dataset.matchday) {
        renderSerieAFixtures(Number(matchdayPill.dataset.matchday));
        return;
      }

      if (row.dataset.fixtureSource === 'la-liga' && matchdayPill.dataset.matchday) {
        renderLaligaFixtures(Number(matchdayPill.dataset.matchday));
        return;
      }

      if (row.dataset.fixtureSource === 'bundesliga' && matchdayPill.dataset.matchday) {
        renderBundesligaFixtures(Number(matchdayPill.dataset.matchday));
        return;
      }

      if (row.dataset.fixtureSource === 'ucl' && matchdayPill.dataset.round) {
        renderUclFixtures(matchdayPill.dataset.round);
        return;
      }

      if (row.dataset.fixtureSource === 'europa' && matchdayPill.dataset.round) {
        renderEuropaFixtures(matchdayPill.dataset.round);
        return;
      }

      if (row.dataset.fixtureSource === 'conference' && matchdayPill.dataset.round) {
        renderConferenceFixtures(matchdayPill.dataset.round);
        return;
      }

      if (row.dataset.fixtureSource === 'facup' && matchdayPill.dataset.round) {
        renderFacupFixtures(matchdayPill.dataset.round);
        return;
      }

      if (row.dataset.fixtureSource === 'carabaocup' && matchdayPill.dataset.round) {
        renderCarabaoFixtures(matchdayPill.dataset.round);
        return;
      }

      if (row.dataset.fixtureSource === 'worldcup' && matchdayPill.dataset.round) {
        renderWorldcupFixtures(matchdayPill.dataset.round);
        return;
      }

      if (row.dataset.fixtureSource === 'ligue-1' && matchdayPill.dataset.matchday) {
        renderLigue1Fixtures(Number(matchdayPill.dataset.matchday));
        return;
      }

      row.querySelectorAll('.mw-pill').forEach((pill) => pill.classList.remove('active'));
      matchdayPill.classList.add('active');
      return;
    }

    const cupCard = target.closest('.league-card.is-wide.facup, .league-card.is-wide.carabaocup');
    if (
      cupCard &&
      !target.closest('.fixture-card') &&
      !target.closest('.match-grid') &&
      !target.closest('.matchday-row')
    ) {
      openCupOverlay(cupCard);
      return;
    }

    const fixtureCard = target.closest('.fixture-card');
    if (!fixtureCard) return;

    if (fixtureCard.dataset.matchId) {
      const selectedMatch = findMatchById(fixtureCard.dataset.matchId);
      if (selectedMatch) {
        updateMatchView(selectedMatch);
      }
    }

    showMatch();
    if (matchView) {
      matchView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  if (matchBack) {
    matchBack.addEventListener('click', () => {
      showHome();
    });
  }

  if (cupExit) {
    cupExit.addEventListener('click', closeCupOverlay);
  }

  if (cupOverlay) {
    cupOverlay.addEventListener('click', (event) => {
      if (event.target === cupOverlay) {
        closeCupOverlay();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const overlay = document.querySelector('#cup-overlay');
    if (overlay && !overlay.classList.contains('is-hidden')) {
      closeCupOverlay();
    }
  });

  hydratePremierLeagueFixtures();
  hydrateChampionshipFixtures();
  hydrateSerieAFixtures();
  hydrateLaligaFixtures();
  hydrateBundesligaFixtures();
  hydrateChampionsLeagueFixtures();
  hydrateEuropaFixtures();
  hydrateConferenceFixtures();
  hydrateFacupFixtures();
  hydrateCarabaoFixtures();
  hydrateLigue1Fixtures();
  hydrateWorldcupFixtures();
  tryOpenMatchFromQuery();
};
