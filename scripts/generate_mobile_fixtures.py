from __future__ import annotations

import csv
import json
import re
import unicodedata
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'mobile-version' / 'data' / 'fixtures.json'
NOW = datetime(2026, 3, 27, 12, 0, 0, tzinfo=timezone.utc)

STOPWORDS = {
    'fc', 'cf', 'ac', 'afc', 'as', 'ssc', 'ud', 'rc', 'sc', 'sv', 'club', 'de', 'la', 'le', 'the',
    'and', 'hove', 'hotspur', 'athletic'
}

TEAM_CODE_OVERRIDES = {
    'liverpool': 'LIV',
    'barcelona': 'BAR',
    'real-madrid': 'RMA',
    'atl-madrid': 'ATM',
    'atletico-madrid': 'ATM',
    'juventus': 'JUV',
    'manchester-city': 'MNC',
    'manchester-united': 'MNU',
    'man-city': 'MNC',
    'man-united': 'MNU',
    'tottenham': 'TOT',
    'spurs': 'TOT',
    'newcastle': 'NEW',
    'west-ham': 'WHU',
    'brighton': 'BHA',
}

ENGLISH_TEAM_ID_ALIASES = {
    'man-city': 'manchester-city',
    'man-united': 'manchester-united',
    'newcastle': 'newcastle-united',
    'tottenham': 'tottenham-hotspur',
    'spurs': 'tottenham-hotspur',
    'west-ham': 'west-ham-united',
    'brighton': 'brighton-and-hove-albion',
    'wolves': 'wolverhampton-wanderers',
    'nottm-forest': 'nottingham-forest',
    'qpr': 'queens-park-rangers',
    'west-brom': 'west-bromwich-albion',
    'swansea': 'swansea-city',
    'oxford-utd': 'oxford-united',
    'sheffield-weds': 'sheffield-wednesday',
}

COMP_CONFIG = {
    'premier': {
        'comp_id': 'premier-league-2025-2026',
        'teams_json': ROOT / 'db-api' / 'data' / 'competitions' / 'premier-league' / 'teams.json',
        'matches_json': ROOT / 'db-api' / 'data' / 'competitions' / 'premier-league' / 'matches.json',
        'logo_dir': ROOT / 'images' / 'Teams-logos' / 'Premier-league',
        'logo_prefix': '/images/Teams-logos/Premier-league',
        'labels': {'left': 'Played', 'right': 'Upcoming'},
    },
    'bundesliga': {
        'comp_id': 'bundesliga-2025-2026',
        'teams_json': ROOT / 'db-api' / 'data' / 'competitions' / 'bundesliga' / 'teams.json',
        'matches_json': ROOT / 'db-api' / 'data' / 'competitions' / 'bundesliga' / 'matches.json',
        'logo_dir': ROOT / 'images' / 'Teams-logos' / 'bundesliga',
        'logo_prefix': '/images/Teams-logos/bundesliga',
        'labels': {'left': 'Played', 'right': 'Upcoming'},
    },
    'seriea': {
        'comp_id': 'serie-a-2025-2026',
        'teams_json': ROOT / 'db-api' / 'data' / 'competitions' / 'serie-a' / 'teams.json',
        'matches_json': ROOT / 'db-api' / 'data' / 'competitions' / 'serie-a' / 'matches.json',
        'logo_dir': ROOT / 'images' / 'Teams-logos' / 'serie-a',
        'logo_prefix': '/images/Teams-logos/serie-a',
        'labels': {'left': 'Played', 'right': 'Upcoming'},
    },
    'laliga': {
        'comp_id': 'la-liga-2025-2026',
        'teams_json': ROOT / 'db-api' / 'data' / 'competitions' / 'la-liga' / 'teams.json',
        'matches_json': ROOT / 'db-api' / 'data' / 'competitions' / 'la-liga' / 'matches.json',
        'logo_dir': ROOT / 'images' / 'Teams-logos' / 'laliga',
        'logo_prefix': '/images/Teams-logos/laliga',
        'labels': {'left': 'Played', 'right': 'Upcoming'},
    },
    'ligue1': {
        'comp_id': 'ligue-1-2025-2026',
        'teams_json': ROOT / 'db-api' / 'data' / 'competitions' / 'ligue-1' / 'teams.json',
        'matches_json': ROOT / 'db-api' / 'data' / 'competitions' / 'ligue-1' / 'matches.json',
        'logo_dir': ROOT / 'images' / 'Teams-logos' / 'Ligue-1',
        'logo_prefix': '/images/Teams-logos/Ligue-1',
        'labels': {'left': 'Played', 'right': 'Upcoming'},
    },
    'ucl': {
        'comp_id': 'champions-league-2025-2026',
        'teams_json': ROOT / 'db-api' / 'data' / 'competitions' / 'champions-league' / 'teams.json',
        'matches_json': ROOT / 'db-api' / 'data' / 'competitions' / 'champions-league' / 'matches.json',
        'logo_dir': ROOT / 'images' / 'Teams-logos' / 'champions-league',
        'logo_prefix': '/images/Teams-logos/champions-league',
        'labels': {'left': 'Played', 'right': 'Upcoming'},
    },
    'championship': {
        'comp_id': 'efl-championship-2025-2026',
        'csv': ROOT / 'db-api' / 'history-data' / 'ELFchampionship-league-table-history' / 'season-2526.csv',
        'logo_dir': ROOT / 'images' / 'Teams-logos' / 'EFLchampionship',
        'logo_prefix': '/images/Teams-logos/EFLchampionship',
        'labels': {'left': 'Played', 'right': 'Upcoming'},
    },
    'facup': {
        'comp_id': 'fa-cup-2025-2026',
        'csv': ROOT / 'db-api' / 'history-data' / 'facup-league-table-history' / 'season-2526.csv',
        'logo_dir': ROOT / 'images' / 'Teams-logos' / 'Premier-league',
        'logo_prefix': '/images/Teams-logos/Premier-league',
        'labels': {'left': 'Round', 'right': 'Next'},
    },
    'carabaocup': {
        'comp_id': 'carabao-cup-2025-2026',
        'csv': ROOT / 'db-api' / 'history-data' / 'carabao-table-history' / 'season-2526.csv',
        'logo_dir': ROOT / 'images' / 'Teams-logos' / 'Premier-league',
        'logo_prefix': '/images/Teams-logos/Premier-league',
        'labels': {'left': 'Round', 'right': 'Next'},
    },
    'europa': {
        'comp_id': 'europa-league-2025-2026',
        'csv': ROOT / 'db-api' / 'history-data' / 'europa-league-table-history' / 'season-2526.csv',
        'logo_dir': ROOT / 'images' / 'Teams-logos' / 'Europa-league',
        'logo_prefix': '/images/Teams-logos/Europa-league',
        'labels': {'left': 'Leg 1', 'right': 'Leg 2'},
    },
    'conference': {
        'comp_id': 'conference-league-2025-2026',
        'csv': ROOT / 'db-api' / 'history-data' / 'conference-league-table-history' / 'season-2526.csv',
        'logo_dir': ROOT / 'images' / 'Teams-logos' / 'conference-league',
        'logo_prefix': '/images/Teams-logos/conference-league',
        'labels': {'left': 'Leg 1', 'right': 'Leg 2'},
    },
    'worldcup': {
        'comp_id': 'worldcup-2026',
        'csv': ROOT / 'db-api' / 'history-data' / 'worldcup-table-history' / 'season-2026.csv',
        'logo_dir': ROOT / 'images' / 'Flags',
        'logo_prefix': '/images/Flags',
        'labels': {'left': 'Groups', 'right': 'Kick Off'},
    },
}

LOGO_ALIASES = {
    'premier': {
        'manchestercity': 'mancity',
        'manchesterunited': 'manu',
        'wolverhamptonwanderers': 'wolves',
        'brightonandhovealbion': 'brighton',
        'astonvilla': 'astonvilla',
        'afcbournemouth': 'bournemouth',
        'westhamunited': 'westham',
        'nottinghamforest': 'forest',
    },
    'championship': {
        'blackburnrovers': 'blackburnrovers',
        'bristolcity': 'bristolcity',
        'coventrycity': 'coventrycity',
        'hullcity': 'hullcity',
        'ipswichtown': 'ipswichtown',
        'leicestercity': 'leicestercity',
        'oxfordunited': 'oxfordunited',
        'prestonnorthend': 'prestonnorthend',
        'queensparkrangers': 'queenparkrangers',
        'sheffieldunited': 'sheffieldunited',
        'sheffieldwednesday': 'sheffieldwednesday',
        'stokecity': 'stroke',
        'swanseacity': 'swanseacity',
        'westbromwichalbion': 'westbromwichalbion',
        'charltonathletic': 'charlton',
        'birminghamcity': 'birmingham',
        'derbycounty': 'derbycounty',
    },
    'bundesliga': {
        'bmonchengladbach': 'monchengladbach',
        'bayerleverkusen': 'leverkusen',
        'borussiadortmund': 'borussia',
        'eintrachtfrankfurt': 'frankfurt',
        'fckoln': 'cologne',
        'rb-leipzig': 'rbleipzig',
        'rbleipzig': 'rbleipzig',
        'stpauli': 'stpauli',
        'werderbremen': 'werder',
    },
    'seriea': {
        'acmilan': 'milan',
        'asroma': 'roma',
    },
    'laliga': {
        'athbilbao': 'athletic',
        'atlmadrid': 'atletico',
        'realmadrid': 'realmadrid',
        'realsociedad': 'realsociedad',
        'celtavigo': 'celtavigo',
        'rayovallecano': 'rayovallecano',
        'deportivoalaves': 'deportivo',
        'rcdespanyoldebarcelona': 'ecdespanyoldebarcelona',
    },
    'ligue1': {
        'angerssco': 'angerssco',
        'parisfc': 'parisfc',
        'psg': 'psg',
        'lehavre': 'havre',
        'losc': 'losc',
        'olympiquelyonnais': 'lyon',
        'olympiquemarseille': 'marseille',
        'staderennais': 'rennais',
    },
    'ucl': {
        'realmadrid': 'realmadrid',
        'bayernmu':'bayern',
        'bayernmnchen':'bayern',
        'bayernmunich':'bayern',
        'atleticomadrid':'atletiko',
        'athleticbilbao':'alteticobilbao',
        'borussiadortmund':'borusia',
        'eintrachtfrankfurt':'franfurt',
        'fccopenhagen':'kobenhavn',
        'manchestercity':'mancity',
        'newcastleunited':'newcastle',
        'tottenhamhotspur':'sprus',
        'bodoglimt':'doboglimt',
        'sportingcp':'sporting',
        'unionsg':'64125',
        'kairatalmaty':'79970',
        'olympiacos':'2610',
        'slaviaprague':'52498',
    },
    'europa': {
        'asroma': 'roma',
        'astonvilla': 'astonvilla',
        'fcbasel': 'basel',
        'fcmidtjylland': 'midtjylland',
        'fcporto': 'porto',
        'fcsalzburg': 'salzburg',
        'fcutrecht': 'utrecht',
        'glasgowrangers': 'rangers',
        'goaheadeagles': 'goaheadeagles',
        'lilleosc': 'lille',
        'ludogoretsrazgrad': 'ludogorets',
        'maccabitelaviv': 'mtelaviv',
        'malmff': 'malmo',
        'ogcnice': 'nice',
        'olympiquelyon': 'lyon',
        'paokthessaloniki': 'paok',
        'racinggenk': 'genk',
        'realbetis': 'realbetis',
        'redstarbelgrade': 'cvenazvesta',
        'scfreiburg': 'freiburg',
        'skbrannbergen': 'brann',
        'sportingbraga': 'braga',
        'sturmgraz': 'strumgraz',
        'vfbstuttgart': 'stuttgard',
        'viktoriaplzen': 'viktoriaplzen',
        'youngboys': 'yungboys',
    },
    'conference': {
        'aekathens': 'aekathens',
        'aeklarnaca': 'aeklarnaca',
        'azalkmaar': 'azalkmaar',
        'bkhcken': 'hacken',
        'fcdrita': 'drita',
        'fcnoah': 'noah',
        'fsvmainz05': 'mainz',
        'hamrunspartans': 'hamrunspartans',
        'kupskuopio': 'kupskuopio',
        'lausannesports': 'lausannesport',
        'lechpoznan': 'lechpoznan',
        'legiawarsaw': 'legiawarszawa',
        'lincolnredimps': 'lredimps',
        'nkcelje': 'celje',
        'nkrijeka': 'rijeka',
        'omonianicosia': 'omonoia',
        'rakwczestochowa': 'rakow',
        'rapidwien': 'skrapid',
        'rayovallecano': 'rayavallecano',
        'rcstrasbourg': 'strasbourg',
        'shamrockrovers': 'shamrockrovers',
        'shkendijatetovo': 'shendija',
        'sigmaolomouc': 'sigmaolomouc',
        'slovanbratislava': 'sbratislava',
        'spartapraha': 'spartapraha',
        'universitateacraiova': 'ucraiova',
        'zrinjskimostar': 'zrinjski',
        'crystalpalace': 'crystalpalace',
        'dynamokyiv': 'dynamokyiv',
        'jagielloniabialystok': 'jagiellonia',
    },
    'worldcup': {
        'southafrica': 'rsa',
        'southkorea': 'korea',
        'switzerland': 'swis',
        'usa': 'usa',
        'qatar': 'qat',
    },
}


@dataclass
class LogoMatcher:
    files: list[tuple[str, str]]
    alias_map: dict[str, str]

    def resolve(self, *values: str) -> str | None:
        candidates = []
        for value in values:
            if not value:
                continue
            norm = normalize_key(value)
            stripped = remove_stopwords(norm)
            if norm:
                candidates.append(norm)
            if stripped and stripped != norm:
                candidates.append(stripped)
        seen = set()
        candidates = [c for c in candidates if not (c in seen or seen.add(c))]
        if not candidates:
            return None

        by_name = {name: rel for name, rel in self.files}
        for candidate in candidates:
            alias = self.alias_map.get(candidate)
            if alias and alias in by_name:
                return by_name[alias]
            if candidate in by_name:
                return by_name[candidate]

        best_rel = None
        best_score = -1
        for candidate in candidates:
            for stem, rel in self.files:
                score = fuzzy_score(candidate, stem)
                if score > best_score:
                    best_score = score
                    best_rel = rel
        return best_rel if best_score >= 3 else None


def normalize_text(value: str) -> str:
    text = unicodedata.normalize('NFKD', str(value or ''))
    text = ''.join(ch for ch in text if not unicodedata.combining(ch))
    return text


def normalize_key(value: str) -> str:
    value = normalize_text(value).lower().replace('&', 'and')
    value = value.replace('utd', 'united')
    value = re.sub(r'[^a-z0-9]+', '', value)
    return value


def remove_stopwords(value: str) -> str:
    if not value:
        return ''
    text = normalize_text(value).lower().replace('&', 'and')
    tokens = re.split(r'[^a-z0-9]+', text)
    tokens = [token for token in tokens if token and token not in STOPWORDS]
    return ''.join(tokens)


def fuzzy_score(query: str, stem: str) -> int:
    if not query or not stem:
        return 0
    if query == stem:
        return 100
    if stem in query:
        return 60 + len(stem)
    if query in stem:
        return 50 + len(query)

    q_tokens = split_words(query)
    s_tokens = split_words(stem)
    if not q_tokens or not s_tokens:
        return 0
    overlap = len(set(q_tokens) & set(s_tokens))
    prefix = sum(1 for token in s_tokens if any(q.startswith(token) or token.startswith(q) for q in q_tokens))
    return overlap * 10 + prefix * 3


def split_words(value: str) -> list[str]:
    raw = normalize_text(value).lower().replace('&', 'and')
    return [token for token in re.split(r'[^a-z0-9]+', raw) if token and token not in STOPWORDS]


def load_logo_matcher(comp_key: str) -> LogoMatcher:
    config = COMP_CONFIG[comp_key]
    files = []
    for path in sorted(config['logo_dir'].glob('*')):
        if path.is_dir():
            continue
        rel = f"{config['logo_prefix']}/{path.name}"
        files.append((normalize_key(path.stem), rel))
    return LogoMatcher(files, LOGO_ALIASES.get(comp_key, {}))


def load_json(path: Path):
    return json.loads(path.read_text())


def format_time(iso_or_dt: str | datetime | None) -> str:
    if not iso_or_dt:
        return 'TBD'
    if isinstance(iso_or_dt, datetime):
        dt = iso_or_dt
    else:
        raw = str(iso_or_dt).replace('Z', '+00:00')
        try:
            dt = datetime.fromisoformat(raw)
        except ValueError:
            return 'TBD'
    return dt.strftime('%H:%M')


def build_team_code(team_id: str, name: str) -> str:
    if team_id in TEAM_CODE_OVERRIDES:
        return TEAM_CODE_OVERRIDES[team_id]
    words = split_words(name)
    if not words:
        base = normalize_text(name).strip() or team_id or 'TM'
        return base[:3].upper()
    explicit = next((word for word in words if len(word) == 3 and word.isupper()), None)
    if explicit:
        return explicit
    if len(words) == 1:
        return words[0][:3].upper()
    if len(words) >= 3:
        return f"{words[0][0]}{words[1][0]}{words[2][0]}".upper()
    first, second = words[:2]
    if len(first) <= 3:
        code = f"{first}{second[0]}".upper()
        if len(code) < 3:
            code = f"{code}{second[1:3-len(code)+1]}".upper()
        return code[:3]
    return f"{first[0]}{second[:2]}".upper()


def fixture_state(match_date: datetime | None, status: str | None, home_score, away_score) -> str:
    if status == 'completed':
        return 'played'
    if home_score is not None and away_score is not None:
        return 'played'
    if match_date and match_date <= NOW:
        return 'played'
    return 'upcoming'


def build_fixture_entry(
    home: dict,
    away: dict,
    state: str,
    score: str,
    home_logo: str | None,
    away_logo: str | None,
    meta: str | None = None,
    *,
    fixture_id: str | None = None,
    competition_id: str | None = None,
):
    return {
        'id': fixture_id,
        'competitionId': competition_id,
        'state': state,
        'score': score,
        'meta': meta or ('FT' if state == 'played' else ''),
        'home': {
            'short': build_team_code(home['id'], home['shortName']),
            'name': home['name'],
            'logo': home_logo,
        },
        'away': {
            'short': build_team_code(away['id'], away['shortName']),
            'name': away['name'],
            'logo': away_logo,
        },
    }


def interleave_played_upcoming(fixtures: list[dict]) -> list[dict]:
    played = [f for f in fixtures if f['state'] == 'played']
    upcoming = [f for f in fixtures if f['state'] != 'played']
    rows = max(len(played), len(upcoming))
    combined = []
    for idx in range(rows):
        if idx < len(played):
            combined.append(played[idx])
        if idx < len(upcoming):
            combined.append(upcoming[idx])
    return combined


def get_visible_labels(items: list, active, count: int, formatter) -> list[str]:
    if not items:
        return []
    try:
        active_index = items.index(active)
    except ValueError:
        active_index = 0
    if len(items) <= count:
        return [formatter(item) for item in items]
    start = max(0, min(active_index - 1, len(items) - count))
    return [formatter(item) for item in items[start:start + count]]


def hydrate_league_json(comp_key: str) -> dict:
    config = COMP_CONFIG[comp_key]
    teams = load_json(config['teams_json'])
    matches = load_json(config['matches_json'])
    logo_matcher = load_logo_matcher(comp_key)
    teams_by_id = {team['id']: team for team in teams}
    by_matchday = defaultdict(list)
    for match in matches:
        by_matchday[int(match['matchday'])].append(match)
    matchdays = sorted(by_matchday)
    upcoming = sorted((m for m in matches if m.get('status') != 'completed'), key=lambda m: m['matchDate'])
    active = int(upcoming[0]['matchday']) if upcoming else matchdays[-1]
    day_matches = sorted(by_matchday[active], key=lambda m: m['matchDate'])
    fixtures = []
    for match in day_matches:
        home = teams_by_id[match['homeTeamId']]
        away = teams_by_id[match['awayTeamId']]
        state = 'played' if match.get('status') == 'completed' else 'upcoming'
        score = f"{match['homeScore']}-{match['awayScore']}" if state == 'played' else format_time(match['matchDate'])
        fixtures.append(build_fixture_entry(
            {'id': home['id'], 'name': home['name'], 'shortName': home.get('shortName') or home['name']},
            {'id': away['id'], 'name': away['name'], 'shortName': away.get('shortName') or away['name']},
            state,
            score,
            logo_matcher.resolve(home['id'], home['name'], *(home.get('aliases') or [])),
            logo_matcher.resolve(away['id'], away['name'], *(away.get('aliases') or [])),
            fixture_id=match['id'],
            competition_id=config['comp_id'],
        ))
    return {
        'matchdays': get_visible_labels(matchdays, active, 4, lambda item: f"MW{item}"),
        'labels': config['labels'],
        'fixtures': interleave_played_upcoming(fixtures),
    }


def get_ucl_round_key(match: dict) -> str:
    stage = match.get('stage')
    if stage == 'league':
        return f"R{match['matchday']}"
    stage_map = {
        'playoff': 'PO',
        'round_of_16': 'R16',
        'quarter_final': 'QF',
        'semi_final': 'SF',
        'final': 'F',
    }
    return stage_map.get(stage, str(stage or ''))


def hydrate_ucl() -> dict:
    config = COMP_CONFIG['ucl']
    teams = load_json(config['teams_json'])
    matches = load_json(config['matches_json'])
    teams_by_id = {team['id']: team for team in teams}
    rounds = []
    round_map = {}
    for match in matches:
        key = get_ucl_round_key(match)
        if key not in round_map:
            round_map[key] = []
            rounds.append(key)
        round_map[key].append(match)
    order_map = {key: idx for idx, key in enumerate(rounds)}
    rounds = sorted(rounds, key=lambda key: order_map[key])
    upcoming = sorted((m for m in matches if m.get('status') != 'completed'), key=lambda m: m['matchDate'])
    active = get_ucl_round_key(upcoming[0]) if upcoming else rounds[-1]
    logo_matcher = load_logo_matcher('ucl')
    fixtures = []
    for match in sorted(round_map[active], key=lambda m: m['matchDate']):
        home = teams_by_id[match['homeTeamId']]
        away = teams_by_id[match['awayTeamId']]
        state = 'played' if match.get('status') == 'completed' else 'upcoming'
        score = f"{match['homeScore']}-{match['awayScore']}" if state == 'played' else format_time(match['matchDate'])
        fixtures.append(build_fixture_entry(
            {'id': home['id'], 'name': home['name'], 'shortName': home.get('shortName') or home['name']},
            {'id': away['id'], 'name': away['name'], 'shortName': away.get('shortName') or away['name']},
            state,
            score,
            logo_matcher.resolve(home['id'], home['name'], *(home.get('aliases') or [])),
            logo_matcher.resolve(away['id'], away['name'], *(away.get('aliases') or [])),
            fixture_id=match['id'],
            competition_id=config['comp_id'],
        ))
    return {
        'matchdays': get_visible_labels(rounds, active, 4, lambda item: item),
        'labels': config['labels'],
        'fixtures': interleave_played_upcoming(fixtures),
    }


def parse_csv(path: Path) -> list[dict]:
    with path.open(newline='') as handle:
        return list(csv.DictReader(handle))


def parse_score_pair(value: str | None):
    raw = str(value or '').strip()
    match = re.search(r'(\d+)\s*[-–]\s*(\d+)', raw)
    if not match:
        return None
    return int(match.group(1)), int(match.group(2))


def parse_cup_date(value: str | None) -> datetime | None:
    raw = str(value or '').strip()
    if not raw:
        return None
    for fmt in ('%b %d %Y', '%b %d %Y %H:%M', '%d/%m/%y', '%d/%m/%Y'):
        try:
            return datetime.strptime(raw, fmt).replace(tzinfo=timezone.utc)
        except ValueError:
            continue
    try:
        return datetime.fromisoformat(raw.replace('Z', '+00:00'))
    except ValueError:
        return None


def pick_cup_round_closest(round_map: dict[str, list[dict]]) -> str:
    best_upcoming = None
    best_past = None
    for round_key, matches in round_map.items():
        stamps = [m['matchDateObj'] for m in matches if m.get('matchDateObj')]
        if not stamps:
            continue
        min_dt = min(stamps)
        max_dt = max(stamps)
        if min_dt <= NOW <= max_dt:
            return round_key
        if min_dt > NOW:
            if not best_upcoming or min_dt < best_upcoming[1]:
                best_upcoming = (round_key, min_dt)
        if max_dt < NOW:
            if not best_past or max_dt > best_past[1]:
                best_past = (round_key, max_dt)
    return (best_upcoming or best_past or (next(iter(round_map)), None))[0]


def english_team_logo(comp_key: str, matcher: LogoMatcher, team_id: str, name: str) -> str | None:
    resolved = ENGLISH_TEAM_ID_ALIASES.get(team_id, team_id)
    return matcher.resolve(resolved, team_id, name)


def hydrate_english_cup(comp_key: str) -> dict:
    config = COMP_CONFIG[comp_key]
    rows = parse_csv(config['csv'])
    matcher = load_logo_matcher('premier')
    championship_matcher = load_logo_matcher('championship')
    round_map = defaultdict(list)
    round_order = []
    match_index = 0
    for row in rows:
        round_key = (row.get('Round') or '').strip()
        home_name = (row.get('Home Team') or '').strip()
        away_name = (row.get('Away Team') or '').strip()
        if not round_key or not home_name or not away_name:
            continue
        if round_key not in round_map:
            round_order.append(round_key)
        home_score = row.get('Home Score')
        away_score = row.get('Away Score')
        h = int(home_score) if str(home_score or '').strip().isdigit() else None
        a = int(away_score) if str(away_score or '').strip().isdigit() else None
        round_slug = normalize_slug(round_key) or 'round'
        match_id = (
            ('facup' if comp_key == 'facup' else 'carabao')
            + f"-{round_slug}-{normalize_slug(home_name)}-vs-{normalize_slug(away_name)}-{match_index}"
        )
        match_index += 1
        round_map[round_key].append({
            'round': round_key,
            'home': home_name,
            'away': away_name,
            'homeScore': h,
            'awayScore': a,
            'matchDateObj': parse_cup_date(row.get('Date')),
            'id': match_id,
        })
    active = pick_cup_round_closest(round_map)
    fixtures = []
    for row in sorted(round_map[active], key=lambda item: item['matchDateObj'] or NOW):
        state = fixture_state(row['matchDateObj'], None, row['homeScore'], row['awayScore'])
        score = f"{row['homeScore']}-{row['awayScore']}" if state == 'played' else format_time(row['matchDateObj'])
        home = {'id': normalize_slug(row['home']), 'name': row['home'], 'shortName': row['home']}
        away = {'id': normalize_slug(row['away']), 'name': row['away'], 'shortName': row['away']}
        home_logo = english_team_logo(comp_key, matcher, home['id'], home['name']) or english_team_logo(comp_key, championship_matcher, home['id'], home['name'])
        away_logo = english_team_logo(comp_key, matcher, away['id'], away['name']) or english_team_logo(comp_key, championship_matcher, away['id'], away['name'])
        fixtures.append(
            build_fixture_entry(
                home,
                away,
                state,
                score,
                home_logo,
                away_logo,
                active,
                fixture_id=row['id'],
                competition_id=config['comp_id'],
            )
        )
    return {
        'matchdays': get_visible_labels(round_order, active, 4, english_round_label),
        'labels': config['labels'],
        'fixtures': interleave_played_upcoming(fixtures),
    }


def english_round_label(round_name: str) -> str:
    lower = round_name.lower()
    if 'preliminary' in lower:
        return 'PR'
    if ('first' in lower or '1st' in lower) and 'round' in lower:
        return 'R1'
    if ('second' in lower or '2nd' in lower) and 'round' in lower:
        return 'R2'
    if ('third' in lower or '3rd' in lower) and 'round' in lower:
        return 'R3'
    if ('fourth' in lower or '4th' in lower) and 'round' in lower:
        return 'R4'
    if ('fifth' in lower or '5th' in lower) and 'round' in lower:
        return 'R5'
    if 'quarter' in lower:
        return 'QF'
    if 'semi' in lower and 'leg' in lower:
        return 'SF'
    if 'semi' in lower:
        return 'SF'
    if lower == 'final':
        return 'FIN'
    return round_name[:4].upper()


def pick_most_advanced_uefa_round(rounds: Iterable[str]) -> str | None:
    def score_round(value: str) -> int:
        lower = value.lower()
        if lower == 'final' or ' final' in lower:
            return 900
        if 'semi' in lower:
            return 800
        if 'quarter' in lower:
            return 700
        if 'round of 16' in lower:
            return 600
        if 'knockout' in lower:
            return 550
        if 'league' in lower:
            return 500
        if 'play-off' in lower:
            return 400
        if '3rd' in lower and 'qual' in lower:
            return 300
        if '2nd' in lower and 'qual' in lower:
            return 200
        if '1st' in lower and 'qual' in lower:
            return 100
        return 0
    best = None
    for round_key in rounds:
        if best is None or score_round(round_key) >= score_round(best):
            best = round_key
    return best


def uefa_round_label(round_name: str) -> str:
    lower = round_name.lower()
    if '1st' in lower and 'qual' in lower:
        return 'Q1'
    if '2nd' in lower and 'qual' in lower:
        return 'Q2'
    if '3rd' in lower and 'qual' in lower:
        return 'Q3'
    if 'play-off' in lower:
        return 'PO'
    if 'league' in lower:
        return 'LP'
    if 'round of 16' in lower:
        return 'R16'
    if 'quarter' in lower:
        return 'QF'
    if 'semi' in lower:
        return 'SF'
    if lower == 'final':
        return 'F'
    return round_name[:4].upper()


def hydrate_two_leg_uefa(comp_key: str) -> dict:
    config = COMP_CONFIG[comp_key]
    rows = parse_csv(config['csv'])
    matcher = load_logo_matcher(comp_key)
    round_map = defaultdict(list)
    round_order = []
    for row in rows:
        round_key = (row.get('Round') or '').strip()
        home = (row.get('Home Team') or '').strip()
        away = (row.get('Away Team') or '').strip()
        if not round_key or not home or not away:
            continue
        if round_key not in round_map:
            round_order.append(round_key)
        leg1 = parse_score_pair(row.get('Leg 1 Score'))
        leg2 = parse_score_pair(row.get('Leg 2 Score'))
        round_map[round_key].append((home, away, leg1, leg2))
    preferred = next((round_key for round_key in round_order if 'round of 16' in round_key.lower()), None)
    active = preferred or pick_most_advanced_uefa_round(round_order)
    fixtures = []
    for home_name, away_name, leg1, leg2 in round_map.get(active, []):
        home = {'id': normalize_slug(home_name), 'name': home_name, 'shortName': home_name}
        away = {'id': normalize_slug(away_name), 'name': away_name, 'shortName': away_name}
        home_logo = matcher.resolve(home['id'], home['name'])
        away_logo = matcher.resolve(away['id'], away['name'])
        round_slug = normalize_slug(active) or 'round'
        base_id = f"{comp_key}-{round_slug}-{home['id']}-vs-{away['id']}"
        if leg1:
            fixtures.append(
                build_fixture_entry(
                    home,
                    away,
                    'played',
                    f'{leg1[0]}-{leg1[1]}',
                    home_logo,
                    away_logo,
                    'Leg 1',
                    fixture_id=f'{base_id}-leg1',
                    competition_id=config['comp_id'],
                )
            )
        if leg2:
            fixtures.append(
                build_fixture_entry(
                    away,
                    home,
                    'played',
                    f'{leg2[0]}-{leg2[1]}',
                    away_logo,
                    home_logo,
                    'Leg 2',
                    fixture_id=f'{base_id}-leg2',
                    competition_id=config['comp_id'],
                )
            )
    return {
        'matchdays': get_visible_labels(round_order, active, 4, uefa_round_label),
        'labels': config['labels'],
        'fixtures': fixtures,
    }


def hydrate_championship() -> dict:
    config = COMP_CONFIG['championship']
    rows = parse_csv(config['csv'])
    matcher = load_logo_matcher('championship')
    fixtures = []
    for index, row in enumerate(rows[:8]):
        home_name = (row.get('HomeTeam') or '').strip()
        away_name = (row.get('AwayTeam') or '').strip()
        if not home_name or not away_name:
            continue
        h = int(row['FTHG']) if str(row.get('FTHG') or '').strip().isdigit() else None
        a = int(row['FTAG']) if str(row.get('FTAG') or '').strip().isdigit() else None
        home = {'id': normalize_slug(home_name), 'name': home_name, 'shortName': home_name}
        away = {'id': normalize_slug(away_name), 'name': away_name, 'shortName': away_name}
        fixture_id = f"championship-1-{home['id']}-vs-{away['id']}-{index}"
        fixtures.append(build_fixture_entry(
            home,
            away,
            'played' if h is not None and a is not None else 'upcoming',
            f'{h}-{a}' if h is not None and a is not None else 'TBD',
            matcher.resolve(home['id'], home['name']),
            matcher.resolve(away['id'], away['name']),
            'MW1',
            fixture_id=fixture_id,
            competition_id=config['comp_id'],
        ))
    return {
        'matchdays': ['MW1', 'MW2', 'MW3', 'MW4'],
        'labels': config['labels'],
        'fixtures': fixtures,
    }


def parse_worldcup_datetime(row: dict) -> tuple[datetime | None, str | None]:
    tournament = str(row.get('Tournament') or '').strip()
    date_raw = str(row.get('Date') or '').strip()
    time_raw = str(row.get('Time') or '').strip()
    year_match = re.search(r'(\d{4})', tournament)
    if not year_match or not date_raw:
        return None, None
    year = int(year_match.group(1))
    date_parts = date_raw.split()
    if len(date_parts) < 3:
        return None, None
    month_map = {'jan':1,'feb':2,'mar':3,'apr':4,'may':5,'jun':6,'jul':7,'aug':8,'sep':9,'oct':10,'nov':11,'dec':12}
    month = month_map.get(date_parts[1][:3].lower())
    day = int(re.sub(r'\D', '', date_parts[2])) if re.sub(r'\D', '', date_parts[2]) else None
    tm = re.search(r'(\d{1,2}):(\d{2})', time_raw)
    tz = re.search(r'UTC\s*([+-]\d+)', time_raw)
    if not month or day is None or not tm:
        return None, None
    hour = int(tm.group(1))
    minute = int(tm.group(2))
    offset = int(tz.group(1)) if tz else 0
    local_dt = datetime(year, month, day, hour, minute, tzinfo=timezone.utc)
    dt = local_dt - timedelta(hours=offset)
    return dt, row.get('Group')


def hydrate_worldcup() -> dict:
    config = COMP_CONFIG['worldcup']
    rows = parse_csv(config['csv'])
    matcher = load_logo_matcher('worldcup')
    by_group = defaultdict(list)
    group_order = []
    match_index = 0
    for row in rows:
        home_name = (row.get('Team1') or '').strip()
        away_name = (row.get('Team2') or '').strip()
        group = (row.get('Group') or '').strip()
        if not home_name or not away_name or not group:
            continue
        if group not in by_group:
            group_order.append(group)
        dt, _ = parse_worldcup_datetime(row)
        round_slug = normalize_slug(group) or 'round'
        match_id = f'worldcup-{round_slug}-{normalize_slug(home_name)}-vs-{normalize_slug(away_name)}-{match_index}'
        match_index += 1
        by_group[group].append((home_name, away_name, row, dt, match_id))
    active = group_order[0] if group_order else 'Group A'
    fixtures = []
    for home_name, away_name, row, dt, match_id in by_group.get(active, []):
        home = {'id': normalize_slug(home_name), 'name': home_name, 'shortName': home_name}
        away = {'id': normalize_slug(away_name), 'name': away_name, 'shortName': away_name}
        score_pair = parse_score_pair(row.get('Score1'))
        state = 'played' if score_pair and dt and dt <= NOW else 'upcoming'
        score = f'{score_pair[0]}-{score_pair[1]}' if state == 'played' else format_time(dt)
        fixtures.append(build_fixture_entry(
            home,
            away,
            state,
            score,
            matcher.resolve(home['id'], home['name']),
            matcher.resolve(away['id'], away['name']),
            active,
            fixture_id=match_id,
            competition_id=config['comp_id'],
        ))
    return {
        'matchdays': [f'GRP {group.split()[-1]}' for group in group_order[:4]],
        'labels': config['labels'],
        'fixtures': fixtures,
    }


def normalize_slug(value: str) -> str:
    text = normalize_text(value).lower().replace('&', 'and')
    text = text.replace('utd', 'united')
    text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')
    return text


def generate() -> dict:
    data = {
        'premier': hydrate_league_json('premier'),
        'championship': hydrate_championship(),
        'facup': hydrate_english_cup('facup'),
        'carabaocup': hydrate_english_cup('carabaocup'),
        'seriea': hydrate_league_json('seriea'),
        'laliga': hydrate_league_json('laliga'),
        'bundesliga': hydrate_league_json('bundesliga'),
        'ligue1': hydrate_league_json('ligue1'),
        'ucl': hydrate_ucl(),
        'europa': hydrate_two_leg_uefa('europa'),
        'conference': hydrate_two_leg_uefa('conference'),
        'worldcup': hydrate_worldcup(),
    }
    return data


def main() -> None:
    data = generate()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(data, indent=2))
    print(f'Wrote {OUTPUT.relative_to(ROOT)}')
    for key, value in data.items():
        print(f"{key}: {len(value.get('fixtures', []))} fixtures")


if __name__ == '__main__':
    main()
