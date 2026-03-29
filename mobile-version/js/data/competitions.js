const asset = (path) => new URL(path, import.meta.url).href;

export const competitions = [
  {
    id: 'premier',
    component: 'prem-box',
    themeClass: 'premier',
    title: 'Premier League',
    flagClass: 'flag-eng',
    logo: asset('../../../images/comp-logos/Competition=Men_ Premier League, Color=Color.webp'),
    matchdays: ['MW1', 'MW2', 'MW3', 'MW4'],
    labels: { left: 'Played', right: 'Upcoming' },
    fixtures: [
      {
        state: 'played',
        score: '2-2',
        meta: 'FT',
        home: { short: 'ARS', name: 'Arsenal', logo: asset('../../../images/Teams-logos/Premier-league/arsenal.svg') },
        away: { short: 'WOL', name: 'Wolves', logo: asset('../../../images/Teams-logos/Premier-league/wolves.svg') }
      },
      {
        state: 'upcoming',
        score: '18:30',
        meta: 'Today',
        home: { short: 'LIV', name: 'Liverpool', logo: asset('../../../images/Teams-logos/Premier-league/liverpool.svg') },
        away: { short: 'CHE', name: 'Chelsea', logo: asset('../../../images/Teams-logos/Premier-league/chelsea.svg') }
      },
      {
        state: 'played',
        score: '1-0',
        meta: 'FT',
        home: { short: 'TOT', name: 'Tottenham', logo: asset('../../../images/Teams-logos/Premier-league/tottenham.svg') },
        away: { short: 'WHU', name: 'West Ham', logo: asset('../../../images/Teams-logos/Premier-league/westham.svg') }
      },
      {
        state: 'upcoming',
        score: '20:00',
        meta: 'Tonight',
        home: { short: 'MCI', name: 'Manchester City', logo: asset('../../../images/Teams-logos/Premier-league/mancity.svg') },
        away: { short: 'NEW', name: 'Newcastle', logo: asset('../../../images/Teams-logos/Premier-league/newcastle.svg') }
      },
      {
        state: 'played',
        score: '2-1',
        meta: 'FT',
        home: { short: 'MUN', name: 'Manchester United', logo: asset('../../../images/Teams-logos/Premier-league/Manu.svg') },
        away: { short: 'EVE', name: 'Everton', logo: asset('../../../images/Teams-logos/Premier-league/everton.svg') }
      },
      {
        state: 'upcoming',
        score: '16:00',
        meta: 'Sun',
        home: { short: 'AVL', name: 'Aston Villa', logo: asset('../../../images/Teams-logos/Premier-league/astonvilla.svg') },
        away: { short: 'BHA', name: 'Brighton', logo: asset('../../../images/Teams-logos/Premier-league/brighton.svg') }
      }
    ]
  },
  {
    id: 'championship',
    component: 'championship-box',
    themeClass: 'championship',
    title: 'EFL Championship',
    flagClass: 'flag-eng',
    logo: asset('../../../images/comp-logos/EFLchampionship.svg'),
    matchdays: ['MW39', 'MW40', 'MW41', 'MW42'],
    labels: { left: 'Played', right: 'Upcoming' },
    fixtures: [
      {
        state: 'played',
        score: '1-1',
        meta: 'FT',
        home: { short: 'BIR', name: 'Birmingham', logo: asset('../../../images/Teams-logos/EFLchampionship/birmingham.png') },
        away: { short: 'IPS', name: 'Ipswich', logo: asset('../../../images/Teams-logos/EFLchampionship/ipswichtown.png') }
      },
      {
        state: 'played',
        score: '2-1',
        meta: 'FT',
        home: { short: 'SOU', name: 'Southampton', logo: asset('../../../images/Teams-logos/EFLchampionship/southampton.png') },
        away: { short: 'WRE', name: 'Wrexham', logo: asset('../../../images/Teams-logos/EFLchampionship/wrexham.png') }
      },
      {
        state: 'played',
        score: '3-1',
        meta: 'FT',
        home: { short: 'STO', name: 'Stoke', logo: asset('../../../images/Teams-logos/EFLchampionship/stroke.png') },
        away: { short: 'DER', name: 'Derby', logo: asset('../../../images/Teams-logos/EFLchampionship/derbycounty.png') }
      },
      {
        state: 'upcoming',
        score: '13:30',
        meta: 'Today',
        home: { short: 'MID', name: 'Middlesbrough', logo: asset('../../../images/Teams-logos/EFLchampionship/middlesbrough.png') },
        away: { short: 'SWA', name: 'Swansea', logo: asset('../../../images/Teams-logos/EFLchampionship/swanseacity.png') }
      },
      {
        state: 'played',
        score: '0-0',
        meta: 'FT',
        home: { short: 'NOR', name: 'Norwich', logo: asset('../../../images/Teams-logos/EFLchampionship/norwich.png') },
        away: { short: 'WAT', name: 'Watford', logo: asset('../../../images/Teams-logos/EFLchampionship/watford.png') }
      },
      {
        state: 'upcoming',
        score: '15:00',
        meta: 'Sat',
        home: { short: 'LEI', name: 'Leicester', logo: asset('../../../images/Teams-logos/EFLchampionship/leicestercity.png') },
        away: { short: 'QPR', name: 'QPR', logo: asset('../../../images/Teams-logos/EFLchampionship/queenparkrangers.png') }
      }
    ]
  },
  {
    id: 'facup',
    component: 'facup-box',
    themeClass: 'facup',
    title: 'FA Cup',
    flagClass: 'flag-eng',
    logo: asset('../../../images/comp-logos/facup.png'),
    matchdays: ['R16', 'QF', 'SF', 'FIN'],
    labels: { left: 'Round', right: 'Next' },
    fixtures: [
      {
        state: 'played',
        score: '1-0',
        meta: 'QF',
        home: { short: 'AVL', name: 'Aston Villa', logo: asset('../../../images/Teams-logos/Premier-league/astonvilla.svg') },
        away: { short: 'CHE', name: 'Chelsea', logo: asset('../../../images/Teams-logos/Premier-league/chelsea.svg') }
      },
      {
        state: 'upcoming',
        score: '17:30',
        meta: 'SF',
        home: { short: 'LIV', name: 'Liverpool', logo: asset('../../../images/Teams-logos/Premier-league/liverpool.svg') },
        away: { short: 'MCI', name: 'Manchester City', logo: asset('../../../images/Teams-logos/Premier-league/mancity.svg') }
      },
      {
        state: 'played',
        score: '2-1',
        meta: 'R16',
        home: { short: 'TOT', name: 'Tottenham', logo: asset('../../../images/Teams-logos/Premier-league/tottenham.svg') },
        away: { short: 'LEE', name: 'Leeds', logo: asset('../../../images/Teams-logos/Premier-league/leeds.svg') }
      },
      {
        state: 'upcoming',
        score: '20:00',
        meta: 'QF',
        home: { short: 'NEW', name: 'Newcastle', logo: asset('../../../images/Teams-logos/Premier-league/newcastle.svg') },
        away: { short: 'BOU', name: 'Bournemouth', logo: asset('../../../images/Teams-logos/Premier-league/bournemouth.svg') }
      },
      {
        state: 'played',
        score: '2-1',
        meta: 'R16',
        home: { short: 'MUN', name: 'Manchester United', logo: asset('../../../images/Teams-logos/Premier-league/Manu.svg') },
        away: { short: 'ARS', name: 'Arsenal', logo: asset('../../../images/Teams-logos/Premier-league/arsenal.svg') }
      },
      {
        state: 'upcoming',
        score: '18:15',
        meta: 'SF',
        home: { short: 'TOT', name: 'Tottenham', logo: asset('../../../images/Teams-logos/Premier-league/tottenham.svg') },
        away: { short: 'AVL', name: 'Aston Villa', logo: asset('../../../images/Teams-logos/Premier-league/astonvilla.svg') }
      }
    ]
  },
  {
    id: 'carabaocup',
    component: 'carabaocup-box',
    themeClass: 'carabaocup',
    title: 'Carabao Cup',
    flagClass: 'flag-eng',
    logo: asset('../../../images/comp-logos/carabao-cup-crest.svg'),
    matchdays: ['QF', 'SF1', 'SF2', 'FIN'],
    labels: { left: 'Round', right: 'Next' },
    fixtures: [
      {
        state: 'played',
        score: '3-2',
        meta: 'QF',
        home: { short: 'MUN', name: 'Manchester United', logo: asset('../../../images/Teams-logos/Premier-league/Manu.svg') },
        away: { short: 'BRE', name: 'Brentford', logo: asset('../../../images/Teams-logos/Premier-league/brentford.svg') }
      },
      {
        state: 'upcoming',
        score: '19:45',
        meta: 'SF1',
        home: { short: 'TOT', name: 'Tottenham', logo: asset('../../../images/Teams-logos/Premier-league/tottenham.svg') },
        away: { short: 'NEW', name: 'Newcastle', logo: asset('../../../images/Teams-logos/Premier-league/newcastle.svg') }
      },
      {
        state: 'played',
        score: '2-0',
        meta: 'QF',
        home: { short: 'ARS', name: 'Arsenal', logo: asset('../../../images/Teams-logos/Premier-league/arsenal.svg') },
        away: { short: 'FUL', name: 'Fulham', logo: asset('../../../images/Teams-logos/Premier-league/fulham.svg') }
      },
      {
        state: 'upcoming',
        score: '20:00',
        meta: 'FIN',
        home: { short: 'LIV', name: 'Liverpool', logo: asset('../../../images/Teams-logos/Premier-league/liverpool.svg') },
        away: { short: 'CHE', name: 'Chelsea', logo: asset('../../../images/Teams-logos/Premier-league/chelsea.svg') }
      },
      {
        state: 'played',
        score: '1-0',
        meta: 'QF',
        home: { short: 'MCI', name: 'Manchester City', logo: asset('../../../images/Teams-logos/Premier-league/mancity.svg') },
        away: { short: 'ARS', name: 'Arsenal', logo: asset('../../../images/Teams-logos/Premier-league/arsenal.svg') }
      },
      {
        state: 'upcoming',
        score: '18:45',
        meta: 'SF2',
        home: { short: 'CHE', name: 'Chelsea', logo: asset('../../../images/Teams-logos/Premier-league/chelsea.svg') },
        away: { short: 'TOT', name: 'Tottenham', logo: asset('../../../images/Teams-logos/Premier-league/tottenham.svg') }
      }
    ]
  },
  {
    id: 'seriea',
    component: 'seriea-box',
    themeClass: 'seriea',
    title: 'Serie A',
    flagClass: 'flag-ita',
    logo: asset('../../../images/comp-logos/seriea-enilive-logo_jssflz.png'),
    matchdays: ['GW27', 'GW28', 'GW29', 'GW30'],
    labels: { left: 'Played', right: 'Upcoming' },
    fixtures: [
      {
        state: 'played',
        score: '2-1',
        meta: 'FT',
        home: { short: 'INT', name: 'Inter', logo: asset('../../../images/Teams-logos/serie-a/inter.webp') },
        away: { short: 'ROM', name: 'Roma', logo: asset('../../../images/Teams-logos/serie-a/roma.webp') }
      },
      {
        state: 'upcoming',
        score: '18:00',
        meta: 'Today',
        home: { short: 'JUV', name: 'Juventus', logo: asset('../../../images/Teams-logos/serie-a/juventus.webp') },
        away: { short: 'NAP', name: 'Napoli', logo: asset('../../../images/Teams-logos/serie-a/napoli.webp') }
      },
      {
        state: 'played',
        score: '1-1',
        meta: 'FT',
        home: { short: 'MIL', name: 'Milan', logo: asset('../../../images/Teams-logos/serie-a/milan.webp') },
        away: { short: 'LAZ', name: 'Lazio', logo: asset('../../../images/Teams-logos/serie-a/lazio.webp') }
      },
      {
        state: 'upcoming',
        score: '20:45',
        meta: 'Tonight',
        home: { short: 'ATA', name: 'Atalanta', logo: asset('../../../images/Teams-logos/serie-a/atalanta.webp') },
        away: { short: 'FIO', name: 'Fiorentina', logo: asset('../../../images/Teams-logos/serie-a/fiorentina.webp') }
      },
      {
        state: 'played',
        score: '2-0',
        meta: 'FT',
        home: { short: 'ROM', name: 'Roma', logo: asset('../../../images/Teams-logos/serie-a/roma.webp') },
        away: { short: 'TOR', name: 'Torino', logo: asset('../../../images/Teams-logos/serie-a/torino.webp') }
      },
      {
        state: 'upcoming',
        score: '15:00',
        meta: 'Sun',
        home: { short: 'COM', name: 'Como', logo: asset('../../../images/Teams-logos/serie-a/como.webp') },
        away: { short: 'UDI', name: 'Udinese', logo: asset('../../../images/Teams-logos/serie-a/udinese.webp') }
      }
    ]
  },
  {
    id: 'laliga',
    component: 'laliga-box',
    themeClass: 'laliga',
    title: 'La Liga',
    flagClass: 'flag-esp',
    logo: asset('../../../images/comp-logos/Screenshot 2026-03-02 155633.png'),
    matchdays: ['R28', 'R29', 'R30', 'R31'],
    labels: { left: 'Played', right: 'Upcoming' },
    fixtures: [
      {
        state: 'played',
        score: '1-0',
        meta: 'FT',
        home: { short: 'ATM', name: 'Atletico', logo: asset('../../../images/Teams-logos/laliga/atletico.png') },
        away: { short: 'BET', name: 'Betis', logo: asset('../../../images/Teams-logos/laliga/betis.png') }
      },
      {
        state: 'upcoming',
        score: '20:00',
        meta: 'Today',
        home: { short: 'BAR', name: 'Barcelona', logo: asset('../../../images/Teams-logos/laliga/barcelona.png') },
        away: { short: 'RSO', name: 'Sociedad', logo: asset('../../../images/Teams-logos/laliga/real-sociedad.png') }
      },
      {
        state: 'played',
        score: '3-1',
        meta: 'FT',
        home: { short: 'RMA', name: 'Real Madrid', logo: asset('../../../images/Teams-logos/laliga/real-madrid.png') },
        away: { short: 'SEV', name: 'Sevilla', logo: asset('../../../images/Teams-logos/laliga/sevilla.png') }
      },
      {
        state: 'upcoming',
        score: '18:30',
        meta: 'Tonight',
        home: { short: 'VIL', name: 'Villarreal', logo: asset('../../../images/Teams-logos/laliga/villarreal.png') },
        away: { short: 'VAL', name: 'Valencia', logo: asset('../../../images/Teams-logos/laliga/valencia.png') }
      },
      {
        state: 'played',
        score: '2-0',
        meta: 'FT',
        home: { short: 'GIR', name: 'Girona', logo: asset('../../../images/Teams-logos/laliga/girona.png') },
        away: { short: 'OSA', name: 'Osasuna', logo: asset('../../../images/Teams-logos/laliga/osasuna.png') }
      },
      {
        state: 'upcoming',
        score: '14:00',
        meta: 'Sun',
        home: { short: 'CEL', name: 'Celta Vigo', logo: asset('../../../images/Teams-logos/laliga/celtavigo.png') },
        away: { short: 'GET', name: 'Getafe', logo: asset('../../../images/Teams-logos/laliga/getafe.png') }
      }
    ]
  },
  {
    id: 'bundesliga',
    component: 'bundesliga-box',
    themeClass: 'bundesliga',
    title: 'Bundesliga',
    flagClass: 'flag-ger',
    logo: asset('../../../images/comp-logos/bundesliga-app.svg'),
    matchdays: ['MW24', 'MW25', 'MW26', 'MW27'],
    labels: { left: 'Played', right: 'Upcoming' },
    fixtures: [
      {
        state: 'played',
        score: '2-0',
        meta: 'FT',
        home: { short: 'BAY', name: 'Bayern', logo: asset('../../../images/Teams-logos/bundesliga/bayern.svg') },
        away: { short: 'FRA', name: 'Frankfurt', logo: asset('../../../images/Teams-logos/bundesliga/frankfurt.svg') }
      },
      {
        state: 'upcoming',
        score: '15:30',
        meta: 'Today',
        home: { short: 'BVB', name: 'Dortmund', logo: asset('../../../images/Teams-logos/bundesliga/borussia.svg') },
        away: { short: 'RBL', name: 'Leipzig', logo: asset('../../../images/Teams-logos/bundesliga/rb leipzig.svg') }
      },
      {
        state: 'played',
        score: '1-1',
        meta: 'FT',
        home: { short: 'LEV', name: 'Leverkusen', logo: asset('../../../images/Teams-logos/bundesliga/leverkusen.svg') },
        away: { short: 'STU', name: 'Stuttgart', logo: asset('../../../images/Teams-logos/bundesliga/stuttgart.svg') }
      },
      {
        state: 'upcoming',
        score: '18:30',
        meta: 'Tonight',
        home: { short: 'WOB', name: 'Wolfsburg', logo: asset('../../../images/Teams-logos/bundesliga/wolfsburg.svg') },
        away: { short: 'BRE', name: 'Werder', logo: asset('../../../images/Teams-logos/bundesliga/werder.svg') }
      },
      {
        state: 'played',
        score: '2-2',
        meta: 'FT',
        home: { short: 'UNI', name: 'Union Berlin', logo: asset('../../../images/Teams-logos/bundesliga/unionberlin.svg') },
        away: { short: 'FRE', name: 'Freiburg', logo: asset('../../../images/Teams-logos/bundesliga/freiburg.svg') }
      },
      {
        state: 'upcoming',
        score: '15:30',
        meta: 'Sat',
        home: { short: 'MAI', name: 'Mainz', logo: asset('../../../images/Teams-logos/bundesliga/mainz.svg') },
        away: { short: 'HOF', name: 'Hoffenheim', logo: asset('../../../images/Teams-logos/bundesliga/hoffenheim.svg') }
      }
    ]
  },
  {
    id: 'ligue1',
    component: 'ligue1-box',
    themeClass: 'ligue1',
    title: 'Ligue 1',
    flagClass: 'flag-fra',
    logo: asset('../../../images/comp-logos/ligue-1.png'),
    matchdays: ['GW26', 'GW27', 'GW28', 'GW29'],
    labels: { left: 'Played', right: 'Upcoming' },
    fixtures: [
      {
        state: 'played',
        score: '4-1',
        meta: 'FT',
        home: { short: 'PSG', name: 'PSG', logo: asset('../../../images/Teams-logos/Ligue-1/psg.png') },
        away: { short: 'LYO', name: 'Lyon', logo: asset('../../../images/Teams-logos/Ligue-1/lyon.png') }
      },
      {
        state: 'upcoming',
        score: '17:00',
        meta: 'Today',
        home: { short: 'MON', name: 'Monaco', logo: asset('../../../images/Teams-logos/Ligue-1/monaco.png') },
        away: { short: 'MAR', name: 'Marseille', logo: asset('../../../images/Teams-logos/Ligue-1/marseille.png') }
      },
      {
        state: 'played',
        score: '1-0',
        meta: 'FT',
        home: { short: 'LIL', name: 'Lille', logo: asset('../../../images/Teams-logos/Ligue-1/losc.png') },
        away: { short: 'NIC', name: 'Nice', logo: asset('../../../images/Teams-logos/Ligue-1/nice.png') }
      },
      {
        state: 'upcoming',
        score: '20:45',
        meta: 'Tonight',
        home: { short: 'REN', name: 'Rennes', logo: asset('../../../images/Teams-logos/Ligue-1/rennais.png') },
        away: { short: 'STR', name: 'Strasbourg', logo: asset('../../../images/Teams-logos/Ligue-1/strasbourg.png') }
      },
      {
        state: 'played',
        score: '2-1',
        meta: 'FT',
        home: { short: 'NAN', name: 'Nantes', logo: asset('../../../images/Teams-logos/Ligue-1/nantes.png') },
        away: { short: 'BRE', name: 'Brest', logo: asset('../../../images/Teams-logos/Ligue-1/brest.png') }
      },
      {
        state: 'upcoming',
        score: '15:00',
        meta: 'Sun',
        home: { short: 'TOU', name: 'Toulouse', logo: asset('../../../images/Teams-logos/Ligue-1/toulouse.png') },
        away: { short: 'HAV', name: 'Le Havre', logo: asset('../../../images/Teams-logos/Ligue-1/havre.png') }
      }
    ]
  },
  {
    id: 'ucl',
    component: 'ucl-box',
    themeClass: 'ucl',
    title: 'Champions League',
    flagClass: 'flag-eur',
    logo: asset('../../../images/comp-logos/Competition=Men_ Champions League, Color=Color.webp'),
    matchdays: ['R16', 'QF', 'SF', 'FIN'],
    labels: { left: 'Played', right: 'Upcoming' },
    fixtures: [
      {
        state: 'played',
        score: '3-1',
        meta: 'FT',
        home: { short: 'RMA', name: 'Real Madrid', logo: asset('../../../images/Teams-logos/champions-league/realmadrid.png') },
        away: { short: 'PSG', name: 'PSG', logo: asset('../../../images/Teams-logos/champions-league/psg.png') }
      },
      {
        state: 'upcoming',
        score: '21:00',
        meta: 'Tonight',
        home: { short: 'BAY', name: 'Bayern', logo: asset('../../../images/Teams-logos/champions-league/bayern.png') },
        away: { short: 'BAR', name: 'Barcelona', logo: asset('../../../images/Teams-logos/champions-league/barcelona.png') }
      },
      {
        state: 'played',
        score: '2-0',
        meta: 'FT',
        home: { short: 'LIV', name: 'Liverpool', logo: asset('../../../images/Teams-logos/champions-league/liverpool.png') },
        away: { short: 'INT', name: 'Inter', logo: asset('../../../images/Teams-logos/champions-league/inter.png') }
      },
      {
        state: 'upcoming',
        score: '21:00',
        meta: 'Tonight',
        home: { short: 'ARS', name: 'Arsenal', logo: asset('../../../images/Teams-logos/champions-league/arsenal.svg') },
        away: { short: 'BEN', name: 'Benfica', logo: asset('../../../images/Teams-logos/champions-league/benfica.png') }
      },
      {
        state: 'played',
        score: '1-1',
        meta: 'FT',
        home: { short: 'ATL', name: 'Atletico', logo: asset('../../../images/Teams-logos/champions-league/atletiko.png') },
        away: { short: 'JUV', name: 'Juventus', logo: asset('../../../images/Teams-logos/champions-league/juventus.png') }
      },
      {
        state: 'upcoming',
        score: '18:45',
        meta: 'Today',
        home: { short: 'CHE', name: 'Chelsea', logo: asset('../../../images/Teams-logos/champions-league/chelsea.png') },
        away: { short: 'PSV', name: 'PSV', logo: asset('../../../images/Teams-logos/champions-league/psv.png') }
      }
    ]
  },
  {
    id: 'europa',
    component: 'europa-box',
    themeClass: 'europa',
    title: 'Europa League',
    flagClass: 'flag-eur',
    logo: asset('../../../images/comp-logos/europa-league.png'),
    matchdays: ['R16', 'QF', 'SF', 'FIN'],
    labels: { left: 'Played', right: 'Upcoming' },
    fixtures: [
      {
        state: 'played',
        score: '2-1',
        meta: 'FT',
        home: { short: 'ROM', name: 'Roma', logo: asset('../../../images/Teams-logos/Europa-league/Roma.png') },
        away: { short: 'POR', name: 'Porto', logo: asset('../../../images/Teams-logos/Europa-league/Porto.png') }
      },
      {
        state: 'upcoming',
        score: '18:45',
        meta: 'Today',
        home: { short: 'LYO', name: 'Lyon', logo: asset('../../../images/Teams-logos/Europa-league/Lyon.png') },
        away: { short: 'BET', name: 'Betis', logo: asset('../../../images/Teams-logos/Europa-league/Real Betis.png') }
      },
      {
        state: 'played',
        score: '1-1',
        meta: 'FT',
        home: { short: 'RAN', name: 'Rangers', logo: asset('../../../images/Teams-logos/Europa-league/rangers.png') },
        away: { short: 'CEL', name: 'Celta', logo: asset('../../../images/Teams-logos/Europa-league/celta.png') }
      },
      {
        state: 'upcoming',
        score: '21:00',
        meta: 'Tonight',
        home: { short: 'VPL', name: 'Plzen', logo: asset('../../../images/Teams-logos/Europa-league/viktoria plzen.png') },
        away: { short: 'FEN', name: 'Fenerbahce', logo: asset('../../../images/Teams-logos/Europa-league/fenderbache.png') }
      },
      {
        state: 'played',
        score: '2-0',
        meta: 'FT',
        home: { short: 'BRA', name: 'Braga', logo: asset('../../../images/Teams-logos/Europa-league/Braga.png') },
        away: { short: 'FRB', name: 'Freiburg', logo: asset('../../../images/Teams-logos/Europa-league/Freiburg.png') }
      },
      {
        state: 'upcoming',
        score: '18:45',
        meta: 'Thu',
        home: { short: 'LIL', name: 'Lille', logo: asset('../../../images/Teams-logos/Europa-league/lille.png') },
        away: { short: 'BOL', name: 'Bologna', logo: asset('../../../images/Teams-logos/Europa-league/bologna.png') }
      }
    ]
  },
  {
    id: 'conference',
    component: 'conference-box',
    themeClass: 'conference',
    title: 'Conference League',
    flagClass: 'flag-eur',
    logo: asset('../../../images/comp-logos/conference-league.svg'),
    matchdays: ['R16', 'QF', 'SF', 'FIN'],
    labels: { left: 'Played', right: 'Upcoming' },
    fixtures: [
      {
        state: 'played',
        score: '2-0',
        meta: 'FT',
        home: { short: 'CPA', name: 'Crystal Palace', logo: asset('../../../images/Teams-logos/conference-league/Crystal Palace.png') },
        away: { short: 'FIO', name: 'Fiorentina', logo: asset('../../../images/Teams-logos/conference-league/fiorentina.png') }
      },
      {
        state: 'upcoming',
        score: '18:45',
        meta: 'Today',
        home: { short: 'ALK', name: 'AZ Alkmaar', logo: asset('../../../images/Teams-logos/conference-league/AZ Alkmaar.png') },
        away: { short: 'LPO', name: 'Lech Poznan', logo: asset('../../../images/Teams-logos/conference-league/Lech Poznan.png') }
      },
      {
        state: 'played',
        score: '1-1',
        meta: 'FT',
        home: { short: 'SPP', name: 'Sparta Praha', logo: asset('../../../images/Teams-logos/conference-league/Sparta Praha.png') },
        away: { short: 'SHA', name: 'Shakhtar', logo: asset('../../../images/Teams-logos/conference-league/shakhtar.png') }
      },
      {
        state: 'upcoming',
        score: '21:00',
        meta: 'Tonight',
        home: { short: 'MAI', name: 'Mainz', logo: asset('../../../images/Teams-logos/conference-league/Mainz.png') },
        away: { short: 'STR', name: 'Strasbourg', logo: asset('../../../images/Teams-logos/conference-league/Strasbourg.png') }
      },
      {
        state: 'played',
        score: '3-1',
        meta: 'FT',
        home: { short: 'LEG', name: 'Legia', logo: asset('../../../images/Teams-logos/conference-league/Legia Warszawa.png') },
        away: { short: 'RAK', name: 'Rakow', logo: asset('../../../images/Teams-logos/conference-league/Rakow.png') }
      },
      {
        state: 'upcoming',
        score: '18:45',
        meta: 'Thu',
        home: { short: 'SAM', name: 'Samsunspor', logo: asset('../../../images/Teams-logos/conference-league/Samsunspor.png') },
        away: { short: 'RAP', name: 'Rapid Wien', logo: asset('../../../images/Teams-logos/conference-league/SK Rapid.png') }
      }
    ]
  },
  {
    id: 'worldcup',
    component: 'worldcup-box',
    themeClass: 'worldcup',
    title: 'World Cup 2026',
    flagClass: '',
    logo: asset('../../../images/comp-logos/2026-World-Cup.webp'),
    matchdays: ['GRP A', 'GRP B', 'GRP C', 'GRP D'],
    labels: { left: 'Groups', right: 'Kick Off' },
    fixtures: [
      {
        state: 'upcoming',
        score: '13:00',
        meta: 'Group A',
        home: { short: 'MEX', name: 'Mexico', logo: asset('../../../images/Flags/mexico.png') },
        away: { short: 'USA', name: 'USA', logo: asset('../../../images/Flags/USA.png') }
      },
      {
        state: 'upcoming',
        score: '16:00',
        meta: 'Group B',
        home: { short: 'ENG', name: 'England', logo: asset('../../../images/Flags/england.png') },
        away: { short: 'BRA', name: 'Brazil', logo: asset('../../../images/Flags/brazil.png') }
      },
      {
        state: 'upcoming',
        score: '19:00',
        meta: 'Group C',
        home: { short: 'ESP', name: 'Spain', logo: asset('../../../images/Flags/spain.png') },
        away: { short: 'FRA', name: 'France', logo: asset('../../../images/Flags/france.png') }
      },
      {
        state: 'upcoming',
        score: '22:00',
        meta: 'Group D',
        home: { short: 'ARG', name: 'Argentina', logo: asset('../../../images/Flags/argentina.png') },
        away: { short: 'POR', name: 'Portugal', logo: asset('../../../images/Flags/portugal.png') }
      },
      {
        state: 'upcoming',
        score: '18:00',
        meta: 'Group E',
        home: { short: 'GER', name: 'Germany', logo: asset('../../../images/Flags/germany.png') },
        away: { short: 'ITA', name: 'Italy', logo: asset('../../../images/Flags/italy.png') }
      },
      {
        state: 'upcoming',
        score: '20:00',
        meta: 'Group F',
        home: { short: 'CAN', name: 'Canada', logo: asset('../../../images/Flags/canada.png') },
        away: { short: 'MOR', name: 'Morocco', logo: asset('../../../images/Flags/morocco.jpg') }
      }
    ]
  }
];
