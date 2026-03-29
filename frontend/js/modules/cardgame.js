import { API_BASE, postJson } from '../core/api.js';
import { storage } from '../core/storage.js';
import { onEvent } from '../core/events.js';
import { registerBeforeViewChange, setStoredView, showCardgame } from '../core/views.js';
import { loadUser, openAuthModal, showAuthMessage } from './auth.js';

const PACK_OPEN_KEY = 'fodrPackOpen';
const PACK_ID_KEY = 'fodrPackId';
const PACK_READY_KEY = 'fodrPackReady';
const PACK_COUNT_KEY = 'fodrPackCount';
const DEFAULT_BALANCE = 12500000000;
const SHARED_CARD_PRICES_URL = '/shared/card-prices.json';

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];
const formatCoins = (value) => `${Number(value || 0).toLocaleString('en-US')} F`;
const formatPlainNumber = (value) => Number(value || 0).toLocaleString('en-US');
const formatCardValue = (value) => `${new Intl.NumberFormat('de-DE').format(Number(value || 0))} F`;
const formatMarketValue = (value) => `${new Intl.NumberFormat('de-DE').format(Number(value || 0))}$`;
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  const diffMs = Date.now() - Number(timestamp);
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
};

const packOpenStage = document.querySelector('#pack-open-stage');
const packCards = [
  {
    card: document.querySelector('#pack-open-card-1'),
    frontImg: document.querySelector('#pack-open-front-img-1'),
    backImg: document.querySelector('#pack-open-back-img-1'),
    data: null,
    resolved: false
  },
  {
    card: document.querySelector('#pack-open-card-2'),
    frontImg: document.querySelector('#pack-open-front-img-2'),
    backImg: document.querySelector('#pack-open-back-img-2'),
    data: null,
    resolved: false
  }
];
const packOpenBack = document.querySelector('#pack-open-back');
const packBuyConfirm = document.querySelector('#pack-buy-confirm');
const packBuyActions = document.querySelector('#pack-buy-actions');
const packBuyYes = document.querySelector('#pack-buy-yes');
const packBuyYesDouble = document.querySelector('#pack-buy-yes-2');
const packBuyNo = document.querySelector('#pack-buy-no');
const packBuys = document.querySelectorAll('.pack-buy');
const packInfoName = document.querySelector('#pack-info-name');
const packInfoNumber = document.querySelector('#pack-info-number');
const packInfoMarket = document.querySelector('#pack-info-market');
const packInfoClub = document.querySelector('#pack-info-club');
const packInfoClubLogo = document.querySelector('#pack-info-club-logo');
const packInfoGoals = document.querySelector('#pack-info-goals');
const packInfoAssists = document.querySelector('#pack-info-assists');
const packInfoCountry = document.querySelector('#pack-info-country');
const packInfoFlag = document.querySelector('#pack-info-flag');
const packInfoAge = document.querySelector('#pack-info-age');
const packInfoCardValue = document.querySelector('#pack-info-card-value');
const packInfoSeason = document.querySelector('#pack-info-season');
const packInfoNote = document.querySelector('#pack-info-note');
const packInfoStatus = document.querySelector('#pack-info-status');
const packInfoSellValue = document.querySelector('#pack-info-sell-value');
const packSaveBtn = document.querySelector('#pack-save');
const packSellBtn = document.querySelector('#pack-sell');
const packDiscardBtn = document.querySelector('#pack-discard');
const cardgameBalanceValue = document.querySelector('#cardgame-balance-value');
const inventoryBtn = document.querySelector('#cardgame-inventory-btn');
const inventoryStage = document.querySelector('#inventory-stage');
const inventoryPanel = document.querySelector('.inventory-panel');
const inventoryHeader = document.querySelector('.inventory-header');
const inventoryFilters = document.querySelector('.inventory-filters');
const inventoryBack = document.querySelector('#inventory-back');
const inventoryList = document.querySelector('#inventory-list');
const inventoryEmpty = document.querySelector('#inventory-empty');
const inventoryFilterSearch = document.querySelector('#inventory-filter-search');
const inventoryFilterMin = document.querySelector('#inventory-filter-min');
const inventoryFilterMax = document.querySelector('#inventory-filter-max');
const inventoryFilterPosition = document.querySelector('#inventory-filter-position');
const inventoryFilterClub = document.querySelector('#inventory-filter-club');
const inventoryFilterSort = document.querySelector('#inventory-filter-sort');
const inventoryFilterApply = document.querySelector('#inventory-filter-apply');
const inventoryFilterReset = document.querySelector('#inventory-filter-reset');
const inventoryDetailStage = document.querySelector('#inventory-detail-stage');
const inventoryDetailBack = document.querySelector('#inventory-detail-back');
const inventoryDetailCardImg = document.querySelector('#inventory-detail-card-img');
const inventoryDetailPanel = document.querySelector('.inventory-detail-panel');
const detailName = document.querySelector('#detail-name');
const detailPrice = document.querySelector('#detail-price');
const detailTeamLogo = document.querySelector('#detail-team-logo');
const detailTeamShort = document.querySelector('#detail-team-short');
const detailFlag = document.querySelector('#detail-flag');
const detailCountry = document.querySelector('#detail-country');
const detailAge = document.querySelector('#detail-age');
const detailPosition = document.querySelector('#detail-position');
const detailRarity = document.querySelector('#detail-rarity');
const detailDate = document.querySelector('#detail-date');
const detailEditionText = document.querySelector('#detail-edition-text');
const detailEditionLogo = document.querySelector('#detail-edition-logo');
const detailEditionBody = document.querySelector('.detail-edition-body');
const detailCardId1 = document.querySelector('#detail-card-id-1');
const detailCardId2 = document.querySelector('#detail-card-id-2');
const detailCardId3 = document.querySelector('#detail-card-id-3');
const detailTrade1 = document.querySelector('#detail-trade-1');
const detailTrade2 = document.querySelector('#detail-trade-2');
const detailTrade3 = document.querySelector('#detail-trade-3');
const detailPack1 = document.querySelector('#detail-pack-1');
const detailPack2 = document.querySelector('#detail-pack-2');
const detailPack3 = document.querySelector('#detail-pack-3');
const detailDescription = document.querySelector('#detail-description');
const detailDashboard = document.querySelector('#detail-dashboard');
const detailCollections = document.querySelector('#detail-collections');
const detailEvent = document.querySelector('#detail-event');
const dashTransactionsPill = document.querySelector('#dash-transactions-pill');
const dashTransactionsCount = document.querySelector('#dash-transactions-count');
const dashTransactionsSub = document.querySelector('#dash-transactions-sub');
const dashTransactionsYear = document.querySelector('#dash-transactions-year');
const dashTransactionsBars = document.querySelector('#dash-transactions-bars');
const dashTransactionsMonths = document.querySelector('#dash-transactions-months');
const dashSuccess = document.querySelector('#dash-success');
const dashFailed = document.querySelector('#dash-failed');
const dashRefunded = document.querySelector('#dash-refunded');
const dashGrossPill = document.querySelector('#dash-gross-pill');
const dashGrossValue = document.querySelector('#dash-gross-value');
const dashGrossPrev = document.querySelector('#dash-gross-prev');
const dashGrossMax = document.querySelector('#dash-gross-max');
const dashGrossAvg = document.querySelector('#dash-gross-avg');
const dashGrossMin = document.querySelector('#dash-gross-min');
const dashGrossPath = document.querySelector('#dash-gross-path');
const dashGrossTooltip = document.querySelector('#dash-gross-tooltip');
const dashNetValue = document.querySelector('#dash-net-value');
const dashNetNow = document.querySelector('#dash-net-now');
const dashNetLast = document.querySelector('#dash-net-last');
const dashNetPath = document.querySelector('#dash-net-path');
const dashSaleList = document.querySelector('#dash-sale-list');
const dashGrossChart = document.querySelector('.dash-card.dash-gross .dash-line-chart');
const dashNetChart = document.querySelector('.dash-card.dash-net .dash-line-chart');
const descSubtitle = document.querySelector('#desc-subtitle');
const descTitle = document.querySelector('#desc-title');
const descLead = document.querySelector('#desc-lead');
const descText = document.querySelector('#desc-text');
const descFacts = document.querySelector('#desc-facts');
const descSeries = document.querySelector('#desc-series');
const descRelease = document.querySelector('#desc-release');
const descPlaystyle = document.querySelector('#desc-playstyle');
const descMotto = document.querySelector('#desc-motto');
const descNickname = document.querySelector('#desc-nickname');
const descSpecial = document.querySelector('#desc-special');
const eventPackImg = document.querySelector('#event-pack-img');
const eventTitle = document.querySelector('#event-title');
const eventCreated = document.querySelector('#event-created');
const eventDesc = document.querySelector('#event-desc');
const eventIncludes = document.querySelector('#event-includes');
const eventTheme = document.querySelector('#event-theme');
const eventDrop = document.querySelector('#event-drop');
const detailSideButtons = document.querySelectorAll('.detail-side-btn');
const shopStage = document.querySelector('#shop-stage');
const shopPanel = document.querySelector('.shop-panel');
const shopHeader = document.querySelector('.shop-header');
const shopGrid = document.querySelector('#shop-grid');
const shopFilters = document.querySelector('.shop-filters');
const shopFilterMin = document.querySelector('#shop-filter-min');
const shopFilterMax = document.querySelector('#shop-filter-max');
const shopFilterEdition = document.querySelector('#shop-filter-edition');
const shopFilterPosition = document.querySelector('#shop-filter-position');
const shopFilterClub = document.querySelector('#shop-filter-club');
const shopFilterCountry = document.querySelector('#shop-filter-country');
const shopFilterSeller = document.querySelector('#shop-filter-seller');
const shopFilterSort = document.querySelector('#shop-filter-sort');
const shopFilterRarityCommon = document.querySelector('#shop-filter-rarity-common');
const shopFilterRarityElite = document.querySelector('#shop-filter-rarity-elite');
const shopFilterRarityUltimate = document.querySelector('#shop-filter-rarity-ultimate');
const shopFilterBuyNow = document.querySelector('#shop-filter-buy-now');
const shopFilterVerified = document.querySelector('#shop-filter-verified');
const shopFilterNew = document.querySelector('#shop-filter-new');
const shopFilterApply = document.querySelector('#shop-filter-apply');
const shopFilterReset = document.querySelector('#shop-filter-reset');
const shopDetailStage = document.querySelector('#shop-detail-stage');
const shopDetailBack = document.querySelector('#shop-detail-back');
const shopDetailCardImg = document.querySelector('#shop-detail-card-img');
const shopDetailSeller = document.querySelector('#shop-detail-seller');
const shopDetailClub = document.querySelector('#shop-detail-club');
const shopDetailName = document.querySelector('#shop-detail-name');
const shopDetailJersey = document.querySelector('#shop-detail-jersey');
const shopDetailEdition = document.querySelector('#shop-detail-edition');
const shopDetailPosition = document.querySelector('#shop-detail-position');
const shopDetailHighest = document.querySelector('#shop-detail-highest');
const shopDetailBuyPrice = document.querySelector('#shop-detail-buy-price');
const shopDetailConfirm = document.querySelector('#shop-detail-confirm');
const shopDetailConfirmYes = document.querySelector('#shop-detail-confirm-yes');
const shopDetailConfirmNo = document.querySelector('#shop-detail-confirm-no');
const cardgameTabs = document.querySelectorAll('.cardgame-tab');
const cardgameView = document.querySelector('#cardgame-view');

const inventoryChannel =
  typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('fodr-inventory') : null;

const notifyInventoryUpdate = () => {
  try {
    inventoryChannel?.postMessage({ type: 'inventory:update', at: Date.now() });
  } catch {
    // ignore broadcast errors
  }
};

let sharedCardPrices = {};

const getPriceKeyParts = (card, fallbackClub = '') => ({
  name: String(card?.card_name || card?.name || '').trim().toLowerCase(),
  club: String(card?.club || fallbackClub || '').trim().toLowerCase()
});

const getSharedCardPriceKey = (card, fallbackClub = '') => {
  const parts = getPriceKeyParts(card, fallbackClub);
  return `${parts.name}::${parts.club}`;
};

const getSharedCardPrice = (card, fallbackClub = '') => {
  const key = getSharedCardPriceKey(card, fallbackClub);
  return sharedCardPrices[key] || null;
};

const getConfiguredCardValue = (card, fallbackValue = 0, fallbackClub = '') => {
  const override = getSharedCardPrice(card, fallbackClub);
  if (Number.isFinite(Number(override?.value))) {
    return Number(override.value);
  }
  return Number(fallbackValue || 0);
};

const getConfiguredCardSellValue = (card, fallbackSell = 0, fallbackClub = '') => {
  const override = getSharedCardPrice(card, fallbackClub);
  if (Number.isFinite(Number(override?.sell))) {
    return Number(override.sell);
  }
  return Number(fallbackSell || 0);
};

const packBackImages = {
  elite: '../images/cards/elite/backpage-card/elite.png',
  liverpool: '../images/cards/liverpool-special/backpage-card/backpage.png',
  ultimate: '../images/cards/ultimate/backpage-card/Ultimate-Backpage.png',
  mancity: '../images/cards/mancity-special/backpage-card/backpage.png',
  brazil: '../images/cards/brazil-special/backpage-card/backpage.png'
};

const clubLogoLiverpool = '../images/Teams-logos/Premier-league/liverpool.svg';
const clubLogoManCity = '../images/Teams-logos/Premier-league/mancity.svg';
const flagColors = {
  egypt: ['#ce1126', '#ffffff', '#000000'],
  netherlands: ['#ae1c28', '#ffffff', '#21468b'],
  england: ['#c8102e', '#ffffff', '#c8102e'],
  sweden: ['#005293', '#fecb00', '#005293'],
  germany: ['#000000', '#dd0000', '#ffce00'],
  portugal: ['#006600', '#ff0000', '#006600'],
  spain: ['#aa151b', '#f1bf00', '#aa151b'],
  brazil: ['#009b3a', '#ffdf00', '#009b3a'],
  france: ['#0055a4', '#ffffff', '#ef4135'],
  senegal: ['#00853f', '#fdef42', '#e31b23'],
  hungary: ['#ce2939', '#ffffff', '#477050'],
  scotland: ['#0065bd', '#ffffff', '#0065bd'],
  belgium: ['#000000', '#ffd90c', '#ef3340'],
  norway: ['#ba0c2f', '#ffffff', '#00205b']
};

const flagImages = {
  egypt: '../images/Flags/Egypt.svg',
  netherlands: '../images/Flags/netherlands.png',
  england: '../images/Flags/england.png',
  sweden: '../images/Flags/sweden.svg',
  germany: '../images/Flags/germany.png',
  portugal: '../images/Flags/portugal.png',
  spain: '../images/Flags/spain.png',
  brazil: '../images/Flags/brazil.png',
  france: '../images/Flags/france.png',
  senegal: '../images/Flags/senegal.png',
  hungary: '../images/Flags/hungary.png',
  scotland: '../images/Flags/scotland.png',
  italy: '../images/Flags/italy.png',
  argentina: '../images/Flags/argentina.png',
  belgium: '../images/Flags/belgium.png',
  norway: '../images/Flags/norway.png'
};

const liverpoolPackCards = [
  {
    img: '../images/cards/liverpool-special/players-card/Salah-final.png',
    name: 'Mohamed Salah',
    position: 'RW',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 11,
    marketValue: 140000000,
    goals: 34,
    assists: 18,
    country: 'Egypt',
    flag: flagColors.egypt,
    age: 34,
    season: '17/18',
    started: '2017',
    value: 4500000,
    sell: 3200000,
    note: 'Elite finisher with blistering pace and deadly left foot.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/VVD.png',
    name: 'Virgil van Dijk',
    position: 'CB',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 4,
    marketValue: 180000000,
    goals: 5,
    assists: 2,
    country: 'Netherlands',
    flag: flagColors.netherlands,
    age: 33,
    season: '18/19',
    started: '2018',
    value: 4200000,
    sell: 3000000,
    note: 'Dominant aerial presence and calm leader at the back.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/Gerrard.png',
    name: 'Steven Gerrard',
    position: 'CM',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 8,
    marketValue: 80000000,
    goals: 24,
    assists: 12,
    country: 'England',
    flag: flagColors.england,
    age: 43,
    season: '05/06',
    started: '1998',
    value: 4800000,
    sell: 3400000,
    note: 'Legendary captain with long-range strikes and clutch moments.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/Isak.png',
    name: 'Alexander Isak',
    position: 'ST',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 9,
    marketValue: 150000000,
    goals: 22,
    assists: 6,
    country: 'Sweden',
    flag: flagColors.sweden,
    age: 26,
    season: '25/26',
    started: '2025',
    value: 12000000,
    sell: 9000000,
    note: 'Smooth striker with elite movement and clinical finishing.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/FlorianWirtz.png',
    name: 'Florian Wirtz',
    position: 'AM',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 10,
    marketValue: 115000000,
    goals: 18,
    assists: 14,
    country: 'Germany',
    flag: flagColors.germany,
    age: 23,
    season: '25/26',
    started: '2025',
    value: 3490000,
    sell: 2900000,
    note: 'Creative playmaker who unlocks defenses with sharp passing.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/Jota.png',
    name: 'Diogo Jota',
    position: 'LW',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 20,
    marketValue: 65000000,
    goals: 16,
    assists: 7,
    country: 'Portugal',
    flag: flagColors.portugal,
    age: 28,
    season: '20/21',
    started: '2020',
    value: 340000,
    sell: 240000,
    note: 'Aggressive presser with great instincts inside the box.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/Alonso.png',
    name: 'Xabi Alonso',
    position: 'CM',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 14,
    marketValue: 70000000,
    goals: 8,
    assists: 10,
    country: 'Spain',
    flag: flagColors.spain,
    age: 43,
    season: '08/09',
    started: '2004',
    value: 360000,
    sell: 250000,
    note: 'Deep-lying playmaker with elite passing range.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/Fabinho.png',
    name: 'Fabinho',
    position: 'CDM',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 5,
    marketValue: 60000000,
    goals: 6,
    assists: 5,
    country: 'Brazil',
    flag: flagColors.brazil,
    age: 31,
    season: '19/20',
    started: '2018',
    value: 330000,
    sell: 230000,
    note: 'Shielding midfielder with smart positioning and tackles.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/Konate.png',
    name: 'Ibrahima Konate',
    position: 'CB',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 5,
    marketValue: 58000000,
    goals: 3,
    assists: 1,
    country: 'France',
    flag: flagColors.france,
    age: 26,
    season: '21/22',
    started: '2021',
    value: 310000,
    sell: 220000,
    note: 'Strong, fast defender who dominates in duels.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/SadioMane.png',
    name: 'Sadio Mane',
    position: 'LW',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 10,
    marketValue: 82000000,
    goals: 25,
    assists: 9,
    country: 'Senegal',
    flag: flagColors.senegal,
    age: 32,
    season: '19/20',
    started: '2016',
    value: 410000,
    sell: 300000,
    note: 'Explosive winger with relentless runs and finishing.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/Szoboslai.png',
    name: 'Dominik Szoboszlai',
    position: 'CM',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 8,
    marketValue: 72000000,
    goals: 9,
    assists: 11,
    country: 'Hungary',
    flag: flagColors.hungary,
    age: 25,
    season: '23/24',
    started: '2023',
    value: 350000,
    sell: 250000,
    note: 'Powerful runner with a rocket of a right foot.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/dalglish.png',
    name: 'Kenny Dalglish',
    position: 'ST',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 7,
    marketValue: 88000000,
    goals: 27,
    assists: 10,
    country: 'Scotland',
    flag: flagColors.scotland,
    age: 73,
    season: '80/81',
    started: '1977',
    value: 470000,
    sell: 330000,
    note: 'Legendary striker with elite movement and composure.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/firmino.png',
    name: 'Roberto Firmino',
    position: 'CF',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 9,
    marketValue: 61000000,
    goals: 17,
    assists: 12,
    country: 'Brazil',
    flag: flagColors.brazil,
    age: 33,
    season: '17/18',
    started: '2015',
    value: 340000,
    sell: 240000,
    note: 'Creative forward who links play and presses hard.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/grav2.png',
    name: 'Ryan Gravenberch',
    position: 'CM',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 38,
    marketValue: 52000000,
    goals: 6,
    assists: 6,
    country: 'Netherlands',
    flag: flagColors.netherlands,
    age: 23,
    season: '23/24',
    started: '2023',
    value: 300000,
    sell: 210000,
    note: 'Smooth midfielder with strength and close control.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/roboo.png',
    name: 'Andrew Robertson',
    position: 'LB',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 26,
    marketValue: 65000000,
    goals: 4,
    assists: 13,
    country: 'Scotland',
    flag: flagColors.scotland,
    age: 31,
    season: '19/20',
    started: '2017',
    value: 320000,
    sell: 220000,
    note: 'Relentless fullback with dangerous crossing.'
  },
  {
    img: '../images/cards/liverpool-special/players-card/trent.png',
    name: 'Trent Alexander-Arnold',
    position: 'RB',
    club: 'Liverpool',
    clubShort: 'LFC',
    clubLogo: clubLogoLiverpool,
    number: 66,
    marketValue: 90000000,
    goals: 8,
    assists: 16,
    country: 'England',
    flag: flagColors.england,
    age: 26,
    season: '19/20',
    started: '2016',
    value: 440000,
    sell: 310000,
    note: 'Playmaking fullback with elite delivery.'
  }
];

const elitePackCards = [
  {
    img: '../images/cards/elite/players-card/isak elite.png',
    name: 'Alexander Isak',
    position: 'ST',
    club: 'Newcastle',
    clubShort: 'NEW',
    clubLogo: null,
    number: 14,
    marketValue: 145000000,
    goals: 27,
    assists: 6,
    country: 'Sweden',
    flag: flagColors.sweden,
    age: 26,
    season: '25/26',
    started: '2022',
    value: 880000,
    sell: 620000,
    note: 'Elite striker card with sharp movement and lethal finishing.'
  },
  {
    img: '../images/cards/elite/players-card/palmer elite.png',
    name: 'Cole Palmer',
    position: 'AM',
    club: 'Chelsea',
    clubShort: 'CHE',
    clubLogo: null,
    number: 20,
    marketValue: 130000000,
    goals: 22,
    assists: 14,
    country: 'England',
    flag: flagColors.england,
    age: 23,
    season: '24/25',
    started: '2023',
    value: 840000,
    sell: 590000,
    note: 'Creative elite card built around control, flair, and final-ball quality.'
  }
];

const mancityPackCards = [
  {
    img: '../images/cards/mancity-special/players-card/Erling.png',
    name: 'Erling Haaland',
    position: 'ST',
    club: 'Manchester City',
    clubShort: 'MCI',
    clubLogo: clubLogoManCity,
    number: 9,
    marketValue: 180000000,
    goals: 38,
    assists: 8,
    country: 'Norway',
    flag: flagColors.norway,
    age: 24,
    season: '24/25',
    started: '2022',
    value: 4900000,
    sell: 3430000,
    note: 'Explosive finisher with elite movement and ruthless box presence.'
  },
  {
    img: '../images/cards/mancity-special/players-card/Rodri.png',
    name: 'Rodri',
    position: 'CDM',
    club: 'Manchester City',
    clubShort: 'MCI',
    clubLogo: clubLogoManCity,
    number: 16,
    marketValue: 130000000,
    goals: 10,
    assists: 9,
    country: 'Spain',
    flag: flagColors.spain,
    age: 28,
    season: '24/25',
    started: '2019',
    value: 4300000,
    sell: 3010000,
    note: 'Midfield controller with composure, passing range, and clutch goals.'
  },
  {
    img: '../images/cards/mancity-special/players-card/debryne.png',
    name: 'Kevin De Bruyne',
    position: 'AM',
    club: 'Manchester City',
    clubShort: 'MCI',
    clubLogo: clubLogoManCity,
    number: 17,
    marketValue: 95000000,
    goals: 14,
    assists: 21,
    country: 'Belgium',
    flag: flagColors.belgium,
    age: 33,
    season: '24/25',
    started: '2015',
    value: 4600000,
    sell: 3220000,
    note: 'Elite creator with laser passing and long-range quality.'
  }
];

const brazilPackCards = [
  {
    img: '../images/cards/brazil-special/players-cards/Ronaldinho.png',
    name: 'Ronaldinho',
    position: 'LW',
    club: 'Brazil',
    clubShort: 'BRA',
    clubLogo: flagImages.brazil,
    number: 11,
    marketValue: 165000000,
    goals: 18,
    assists: 19,
    country: 'Brazil',
    flag: flagColors.brazil,
    age: 26,
    season: '2002',
    started: '1999',
    value: 8300000,
    sell: 5810000,
    note: 'Iconic Brazil special card built on flair, improvisation, and unforgettable street-football magic.'
  }
];

const ultimateShopCards = [
  {
    img: '../images/cards/ultimate/players-card/Ronaldo.png',
    name: 'Ronaldo Nazario',
    position: 'ST',
    club: 'Brazil',
    clubShort: 'BRA',
    clubLogo: null,
    number: 9,
    marketValue: 180000000,
    goals: 8,
    assists: 2,
    country: 'Brazil',
    flag: flagColors.brazil,
    age: 26,
    season: '2002',
    started: '1993',
    value: 12000000,
    sell: 8000000,
    note: 'World Cup 2002 icon with unstoppable pace and finishing.'
  }
];

liverpoolPackCards.forEach((card) => {
  card.packKey = 'liverpool';
});

elitePackCards.forEach((card) => {
  card.packKey = 'elite';
});

mancityPackCards.forEach((card) => {
  card.packKey = 'mancity';
});

brazilPackCards.forEach((card) => {
  card.packKey = 'brazil';
});

ultimateShopCards.forEach((card) => {
  card.packKey = 'ultimate';
});

const shopSellers = ['AnfieldVault', 'IconDealer', 'ScoutHQ', 'LegendsMarket', 'RedLineTrade', 'GoalPostX'];
const marketListings = [...liverpoolPackCards.slice(0, 10), ...ultimateShopCards].map((card, index) => ({
  ...card,
  listingId: `listing-${index + 1}`,
  seller: shopSellers[index % shopSellers.length],
  price: Math.max(150000, Math.round((card.value || 0) * (1.15 + (index % 4) * 0.08))),
  rarity: card.packKey === 'ultimate' ? 'Ultimate' : 'Elite',
  buyNow: index % 2 === 0,
  verified: index % 3 !== 0,
  newListing: index % 4 === 0,
  listedAt: Date.now() - index * 86400000
}));

const packDefinitions = {
  elite: {
    cards: elitePackCards,
    backImg: packBackImages.elite,
    eventTitle: 'Event Pack: Elite Edition',
    eventCreated: 'Created: March 2026',
    eventDesc: 'A focused elite pack built around high-value breakout and star performer cards.',
    eventIncludes: 'Includes: Alexander Isak, Cole Palmer',
    eventTheme: 'Theme: Breakout Stars',
    eventDrop: 'Drop Rate: 1 in 120 for Elite'
  },
  liverpool: {
    cards: liverpoolPackCards,
    backImg: packBackImages.liverpool,
    eventTitle: 'Event Pack: Liverpool Special',
    eventCreated: 'Created: March 2025',
    eventDesc: 'A limited run pack celebrating elite Liverpool stars and iconic moments.',
    eventIncludes: 'Includes: Salah, Van Dijk, Alexander-Arnold, Gerrard, Isak',
    eventTheme: 'Theme: Legends & Modern Icons',
    eventDrop: 'Drop Rate: 1 in 250 for Elite'
  },
  mancity: {
    cards: mancityPackCards,
    backImg: packBackImages.mancity,
    eventTitle: 'Event Pack: Manchester City Special',
    eventCreated: 'Created: March 2026',
    eventDesc: 'A special release focused on Manchester City stars from the modern era.',
    eventIncludes: 'Includes: Erling Haaland, Rodri, Kevin De Bruyne',
    eventTheme: 'Theme: City Control & Firepower',
    eventDrop: 'Drop Rate: 1 in 250 for Elite'
  },
  brazil: {
    cards: brazilPackCards,
    backImg: packBackImages.brazil,
    eventTitle: 'Event Pack: Brazil Special',
    eventCreated: 'Created: March 2026',
    eventDesc: 'A Brazil special release centered on legendary flair, samba football, and iconic street-skill magic.',
    eventIncludes: 'Includes: Ronaldinho',
    eventTheme: 'Theme: Jogo Bonito',
    eventDrop: 'Drop Rate: 1 in 250 for Special'
  },
  ultimate: {
    cards: ultimateShopCards,
    backImg: packBackImages.ultimate,
    eventTitle: 'Event Pack: Ultimate Edition',
    eventCreated: 'Created: May 2025',
    eventDesc: 'A legendary run of icon cards highlighting historic football moments.',
    eventIncludes: 'Includes: Ronaldo Nazario, legends, and historic icons',
    eventTheme: 'Theme: Ultimate Icons',
    eventDrop: 'Drop Rate: 1 in 500 for Icon'
  }
};

const cardCatalog = [...elitePackCards, ...liverpoolPackCards, ...mancityPackCards, ...brazilPackCards, ...ultimateShopCards];
const FULL_COLLECTION_COPIES = 5;
const FORCE_FULL_COLLECTION = false;
const isCardgameEmbedMode = document.body.classList.contains('cardgame-embed-mode');
let inventoryFiltersOpen = false;
let inventoryFilterToggleBtn = null;
let shopFiltersOpen = false;
let shopFilterToggleBtn = null;

const syncInventoryFilterToggleLabel = () => {
  if (!inventoryFilterToggleBtn) return;
  inventoryFilterToggleBtn.textContent = inventoryFiltersOpen ? 'Hide Filters' : 'Show Filters';
};

const setInventoryFiltersOpen = (nextOpen) => {
  inventoryFiltersOpen = Boolean(nextOpen);
  inventoryPanel?.classList.toggle('is-filters-open', inventoryFiltersOpen);
  syncInventoryFilterToggleLabel();
};

const ensureInventoryFilterToggle = () => {
  if (!isCardgameEmbedMode || !inventoryHeader) return;
  if (!inventoryFilterToggleBtn) {
    inventoryFilterToggleBtn = document.createElement('button');
    inventoryFilterToggleBtn.type = 'button';
    inventoryFilterToggleBtn.className = 'inventory-filters-toggle';
    inventoryHeader.appendChild(inventoryFilterToggleBtn);
    inventoryFilterToggleBtn.addEventListener('click', (event) => {
      event.preventDefault();
      setInventoryFiltersOpen(!inventoryFiltersOpen);
    });
  }
  syncInventoryFilterToggleLabel();
};

const syncShopFilterToggleLabel = () => {
  if (!shopFilterToggleBtn) return;
  shopFilterToggleBtn.textContent = shopFiltersOpen ? 'Hide Filters' : 'Show Filters';
};

const setShopFiltersOpen = (nextOpen) => {
  shopFiltersOpen = Boolean(nextOpen);
  shopPanel?.classList.toggle('is-filters-open', shopFiltersOpen);
  syncShopFilterToggleLabel();
};

const ensureShopFilterToggle = () => {
  if (!isCardgameEmbedMode || !shopHeader) return;
  if (!shopFilterToggleBtn) {
    shopFilterToggleBtn = document.createElement('button');
    shopFilterToggleBtn.type = 'button';
    shopFilterToggleBtn.className = 'shop-filters-toggle';
    shopHeader.appendChild(shopFilterToggleBtn);
    shopFilterToggleBtn.addEventListener('click', (event) => {
      event.preventDefault();
      setShopFiltersOpen(!shopFiltersOpen);
    });
  }
  syncShopFilterToggleLabel();
};

const buildFullInventory = () => {
  const createdAt = new Date().toISOString();
  const result = [];
  let counter = 1;
  cardCatalog.forEach((card) => {
    for (let i = 0; i < FULL_COLLECTION_COPIES; i += 1) {
      result.push({
        id: `catalog-${counter}-${i}`,
        card_name: card.name,
        card_position: card.position,
        club: card.club,
        started: card.started,
        card_value: card.value,
        sell_value: card.sell,
        card_note: card.note,
        image: card.img,
        created_at: createdAt,
        acquired_via: 'catalog',
        packKey: card.packKey,
        country: card.country,
        age: card.age,
        season: card.season,
        number: card.number,
        clubShort: card.clubShort,
        clubLogo: card.clubLogo
      });
    }
    counter += 1;
  });
  return result;
};
let inventoryRecords = [];
let inventoryAllRecords = [];
const inventoryById = new Map();

let activeSlotIndex = 0;
let inventoryViewLocked = false;
let packViewLocked = false;
let shopViewLocked = false;
let shopDetailOpen = false;
let inventoryDetailOpen = false;
let activeInventoryDetailCard = null;
let activeInventoryDetailMeta = null;
let activeInventoryDetailValue = null;
let activeShopListing = null;
let pendingPackCost = 0;
let packPurchaseReady = false;
let packOpensRemaining = 0;
let currentPackId = null;

const syncCatalogCardPrices = () => {
  cardCatalog.forEach((card) => {
    card.value = getConfiguredCardValue(card, card.value, card.club);
    card.sell = getConfiguredCardSellValue(card, card.sell, card.club);
  });

  marketListings.forEach((listing) => {
    const currentBase = Number(listing.value || listing.marketValue || 0) || 0;
    const nextBase = getConfiguredCardValue(listing, currentBase, listing.club);
    const nextSell = getConfiguredCardSellValue(
      listing,
      Number(listing.sell || Math.round(currentBase * 0.7)),
      listing.club
    );

    if (Number.isFinite(nextBase) && nextBase > 0) {
      const ratio =
        currentBase > 0 && Number.isFinite(Number(listing.price)) ? Number(listing.price) / currentBase : null;
      listing.value = nextBase;
      listing.marketValue = nextBase;
      if (Number.isFinite(ratio) && ratio > 0) {
        listing.price = Math.max(1, Math.round(nextBase * ratio));
      }
    }

    if (Number.isFinite(nextSell) && nextSell > 0) {
      listing.sell = nextSell;
    }
  });
};

const refreshCardValueViews = () => {
  if (inventoryViewLocked) {
    renderInventory(inventoryRecords.length ? inventoryRecords : inventoryAllRecords);
  }
  if (shopViewLocked) {
    renderShop();
  }
  if (inventoryDetailOpen && activeInventoryDetailCard) {
    openInventoryDetail(activeInventoryDetailCard);
  }
};

const loadSharedCardPrices = async () => {
  try {
    const res = await fetch(`${SHARED_CARD_PRICES_URL}?t=${Date.now()}`, { cache: 'no-store' });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || typeof data !== 'object') return;
    sharedCardPrices = data.cards && typeof data.cards === 'object' ? data.cards : {};
    syncCatalogCardPrices();
    refreshCardValueViews();
  } catch {
    // ignore shared price load errors
  }
};

const setPackState = ({ open, packId, ready }) => {
  if (typeof open === 'boolean') {
    storage.set(PACK_OPEN_KEY, open ? 'true' : 'false');
  }
  if (packId) {
    storage.set(PACK_ID_KEY, packId);
  }
  if (typeof ready === 'boolean') {
    storage.set(PACK_READY_KEY, ready ? 'true' : 'false');
  }
  if (!open) {
    storage.remove(PACK_COUNT_KEY);
  }
};

export const setCardgameBalance = (coins) => {
  if (!cardgameBalanceValue) return;
  const safe = Number.isFinite(coins) ? coins : 0;
  cardgameBalanceValue.textContent = safe.toLocaleString('en-US');
};

export const fetchCardgameBalance = async (userId) => {
  if (!userId) return;
  try {
    const res = await fetch(`${API_BASE}/cardgame/balance/${userId}`);
    const data = await res.json().catch(() => ({}));
    if (res.ok && typeof data.coins === 'number') {
      setCardgameBalance(data.coins);
    }
  } catch (err) {
    console.error('Balance fetch failed:', err);
  }
};

const setPackDisplayCount = (count) => {
  if (!packOpenStage) return;
  const showDouble = count > 1;
  packOpenStage.classList.toggle('is-double', showDouble);
  if (packCards[1]?.card) {
    packCards[1].card.classList.toggle('is-hidden', !showDouble);
  }
};

const resetPackSlots = (packId) => {
  const backImg = packBackImages[packId];
  packCards.forEach((slot) => {
    if (!slot.card) return;
    slot.data = null;
    slot.resolved = false;
    slot.card.classList.remove('is-open', 'is-resolved');
    slot.card.setAttribute('aria-pressed', 'false');
    slot.card.dataset.pack = packId || '';
    if (slot.frontImg && backImg) {
      slot.frontImg.src = backImg;
    }
    if (slot.backImg) {
      slot.backImg.removeAttribute('src');
    }
  });
};

export const openPackStage = (packId) => {
  if (!cardgameView || !packOpenStage) {
    return;
  }
  currentPackId = packId;
  setPackDisplayCount(1);
  resetPackSlots(packId);
  packViewLocked = true;
  cardgameView.classList.add('is-pack-open');
  packOpenStage.classList.remove('is-open');
  packOpenStage.classList.remove('is-hidden');
  activeSlotIndex = 0;
  packPurchaseReady = false;
  packOpensRemaining = 0;
  resetPackInfo();
  if (packBuyConfirm) {
    packBuyConfirm.disabled = false;
    packBuyConfirm.textContent = pendingPackCost
      ? `Buy Pack • ${formatCoins(pendingPackCost)}`
      : 'Buy Pack';
  }
  if (packBuyYes) packBuyYes.disabled = false;
  if (packBuyYesDouble) packBuyYesDouble.disabled = false;
  if (packBuyNo) packBuyNo.disabled = false;
  if (packBuyActions) {
    packBuyActions.classList.add('is-hidden');
  }
  setPackState({ open: true, packId, ready: false });
  if (packInfoStatus) packInfoStatus.textContent = 'Confirm purchase to open this pack.';
};

const exitPackStage = () => {
  if (!cardgameView || !packOpenStage) return;
  packOpenStage.classList.remove('is-open');
  packOpenStage.classList.add('is-hidden');
  packPurchaseReady = false;
  packViewLocked = false;
  packOpensRemaining = 0;
  currentPackId = null;
  setPackDisplayCount(1);
  cardgameView.classList.remove('is-pack-open');
  setPackState({ open: false, ready: false });
  pendingPackCost = 0;
};

const closePackStage = () => {
  exitPackStage();
  showCardgame();
};

const setInventoryRecords = (cards = []) => {
  inventoryAllRecords = [...cards];
  renderInventory(cards);
};

const normalizeInventoryCard = (card, index) => {
  if (!card) return null;
  const resolved = { ...card };
  if (!resolved.id) {
    resolved.id = `inventory-${index + 1}`;
  }
  if (!resolved.card_name && resolved.name) {
    resolved.card_name = resolved.name;
  }
  if (!resolved.card_position && resolved.position) {
    resolved.card_position = resolved.position;
  }
  if (!resolved.card_value && resolved.value) {
    resolved.card_value = resolved.value;
  }
  if (!resolved.sell_value && resolved.sell) {
    resolved.sell_value = resolved.sell;
  }
  if (!resolved.card_note && resolved.note) {
    resolved.card_note = resolved.note;
  }
  if (!resolved.image && resolved.img) {
    resolved.image = resolved.img;
  }
  return resolved;
};

const renderInventory = (cards = []) => {
  if (!inventoryList || !inventoryEmpty) return;
  inventoryList.innerHTML = '';
  const normalizedCards = cards.map((card, index) => normalizeInventoryCard(card, index)).filter(Boolean);
  inventoryRecords = normalizedCards;
  inventoryById.clear();
  normalizedCards.forEach((card) => {
    if (card?.id !== undefined && card?.id !== null) {
      inventoryById.set(String(card.id), card);
    }
  });
  if (!normalizedCards.length) {
    inventoryEmpty.classList.remove('is-hidden');
    return;
  }
  inventoryEmpty.classList.add('is-hidden');
  normalizedCards.forEach((card) => {
    const meta = findCatalogCard(card);
    const baseValue = getConfiguredCardValue(card, Number(card.card_value || meta?.value || 0), card.club || meta?.club);
    const sellValue = getConfiguredCardSellValue(card, Number(card.sell_value || meta?.sell || 0), card.club || meta?.club);
    card.card_value = baseValue;
    card.sell_value = sellValue;
    const liveValue = getLiveCardValue(card, baseValue);
    card.liveValue = liveValue;
    const cardEl = document.createElement('div');
    cardEl.className = 'inventory-card';
    cardEl.dataset.cardId = card.id;
    cardEl.innerHTML = `
      <img src="${card.image}" alt="${card.card_name}" />
      <h4>${card.card_name}</h4>
      <span>${card.card_position || ''} ${card.club ? `• ${card.club}` : ''}</span>
      <span>${formatCoins(liveValue)}</span>
      <button class="inventory-sell" data-card-id="${card.id}" data-sell="${sellValue}">
        Sell for ${formatCoins(sellValue)}
      </button>
    `;
    inventoryList.appendChild(cardEl);
  });
};

const renderShop = (listings = marketListings) => {
  if (!shopGrid) return;
  shopGrid.innerHTML = '';
  listings.forEach((listing) => {
    const listedLabel = formatRelativeTime(listing.listedAt);
    const editionText =
      listing.packKey === 'ultimate'
        ? 'ULTIMATE EDITION'
        : `${(listing.clubShort || listing.club || 'LIV').toUpperCase()} EDITION`;
    const cardEl = document.createElement('div');
    cardEl.className = 'shop-card';
    cardEl.dataset.listingId = listing.listingId;
    cardEl.innerHTML = `
      <div class="shop-card-frame">
        <div class="shop-player-art">
          <img src="${listing.img}" alt="${listing.name}" />
        </div>
      </div>
      <div class="shop-footer">
        <div class="shop-footer-top">
          <div class="shop-footer-name">${listing.name}</div>
          <div class="shop-footer-time">${listedLabel}</div>
        </div>
        <div class="shop-footer-meta">${listing.position || ''} ${listing.club ? `• ${listing.club}` : ''} — ${editionText}</div>
        <div class="shop-footer-seller">Seller: ${listing.seller}</div>
        <div class="shop-footer-actions">
          <div class="shop-price">${formatCoins(listing.price)}</div>
          <button class="shop-buy" type="button">BUY</button>
        </div>
      </div>
    `;
    shopGrid.appendChild(cardEl);
  });
};

const buildInventoryPayloadFromListing = (listing) => {
  if (!listing) return null;
  const baseValue = getConfiguredCardValue(listing, Number(listing.value || listing.marketValue || listing.price || 0), listing.club);
  const sellValue = getConfiguredCardSellValue(listing, Math.round(baseValue * 0.7), listing.club);
  return {
    name: listing.name,
    image: listing.img,
    position: listing.position || null,
    club: listing.club || null,
    started: listing.started || null,
    value: baseValue,
    sell: sellValue,
    note: listing.note || null,
    acquiredVia: 'shop'
  };
};

const removeListingFromShop = (listingId) => {
  const index = marketListings.findIndex((item) => String(item.listingId) === String(listingId));
  if (index === -1) return;
  marketListings.splice(index, 1);
  renderShop(marketListings);
};

const handleShopPurchase = async (listing) => {
  if (!listing) return;
  const user = loadUser();
  if (!user) {
    openAuthModal('login');
    showAuthMessage('Login to buy cards.');
    return;
  }
  const cost = Number(listing.price || 0);
  if (!Number.isFinite(cost) || cost <= 0) return;
  try {
    const purchase = await postJson('/cardgame/purchase', { userId: user.id, cost });
    if (typeof purchase.coins === 'number') {
      setCardgameBalance(purchase.coins);
    }
    const payload = buildInventoryPayloadFromListing(listing);
    if (payload) {
      await postJson('/cardgame/inventory/add', { userId: user.id, card: payload });
      notifyInventoryUpdate();
    }
    removeListingFromShop(listing.listingId);
    if (shopDetailOpen) {
      exitShopDetail();
    }
  } catch (err) {
    alert(err.message || 'Purchase failed.');
  }
};

const getListingHighest = (listing) => {
  if (!listing) return 0;
  if (Number.isFinite(listing.highestPrice)) return listing.highestPrice;
  if (Number.isFinite(listing.marketValue)) return listing.marketValue;
  if (Number.isFinite(listing.value)) return listing.value;
  if (Number.isFinite(listing.price)) return Math.round(listing.price * 2.6);
  return 0;
};

const openShopDetail = (listing) => {
  if (!shopDetailStage || !cardgameView) return;
  if (!listing) return;
  activeShopListing = listing;
  if (shopStage) {
    shopStage.classList.add('is-hidden');
  }
  shopDetailStage.classList.remove('is-hidden');
  cardgameView.classList.add('is-shop-detail');
  cardgameView.classList.add('is-shop-open');
  shopDetailOpen = true;
  shopViewLocked = true;
  setCardgameTabActive('shop');
  setStoredView('shop');

  if (shopDetailCardImg) {
    shopDetailCardImg.src = listing.img || '';
    shopDetailCardImg.alt = listing.name || 'Card';
  }
  if (shopDetailSeller) {
    shopDetailSeller.textContent = listing.seller || 'Seller';
  }
  if (shopDetailClub) {
    const clubShort = listing.clubShort || listing.club || 'LFC';
    shopDetailClub.textContent = clubShort.toUpperCase();
    shopDetailClub.classList.remove('has-logo');
    shopDetailClub.style.backgroundImage = '';
    if (listing.clubLogo) {
      shopDetailClub.classList.add('has-logo');
      shopDetailClub.style.backgroundImage = `url(${listing.clubLogo})`;
    }
  }
  if (shopDetailName) {
    shopDetailName.textContent = (listing.name || 'Player').toUpperCase();
  }
  if (shopDetailJersey) {
    shopDetailJersey.textContent = String(listing.number ?? '');
  }
  if (shopDetailEdition) {
    const editionText =
      listing.packKey === 'ultimate'
        ? 'ULTIMATE EDITION'
        : `${(listing.clubShort || listing.club || 'LIV').toUpperCase()} EDITION`;
    shopDetailEdition.textContent = editionText;
  }
  if (shopDetailPosition) {
    shopDetailPosition.textContent = (listing.position || 'STRIKER').toUpperCase();
  }
  if (shopDetailHighest) {
    shopDetailHighest.textContent = formatCoins(getListingHighest(listing));
  }
  if (shopDetailBuyPrice) {
    shopDetailBuyPrice.textContent = formatCoins(listing.price || 0);
  }
  if (shopDetailConfirm) {
    shopDetailConfirm.classList.add('is-hidden');
  }
};

const exitShopDetail = () => {
  if (!shopDetailStage || !cardgameView) return;
  shopDetailStage.classList.add('is-hidden');
  shopDetailOpen = false;
  activeShopListing = null;
  cardgameView.classList.remove('is-shop-detail');
  if (shopStage && shopViewLocked) {
    shopStage.classList.remove('is-hidden');
  }
};

const findCatalogCard = (card) => {
  if (!card) return null;
  const name = String(card.card_name || card.name || '').toLowerCase();
  const club = String(card.club || '').toLowerCase();
  if (!name) return null;
  const exact = cardCatalog.find(
    (entry) =>
      String(entry.name || '').toLowerCase() === name &&
      (!club || String(entry.club || '').toLowerCase() === club)
  );
  if (exact) return exact;
  return cardCatalog.find((entry) => String(entry.name || '').toLowerCase() === name) || null;
};

const formatShortDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const applyFlag = (el, country) => {
  if (!el) return;
  const key = String(country || '').trim().toLowerCase();
  if (!key) {
    el.style.background = '';
    el.style.backgroundImage = '';
    return;
  }
  if (flagImages[key]) {
    el.style.backgroundImage = `url(${flagImages[key]})`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat = 'no-repeat';
    return;
  }
  const colors = flagColors[key];
  if (colors) {
    const [top, mid, bottom] = colors;
    el.style.backgroundImage = '';
    el.style.background = `linear-gradient(to bottom, ${top} 0 33%, ${mid} 33% 66%, ${bottom} 66% 100%)`;
  }
};

const setDetailPanelMode = (mode) => {
  if (!inventoryDetailPanel) return;
  inventoryDetailPanel.classList.remove('is-dashboard', 'is-description', 'is-collections', 'is-event', 'is-empty');
  if (mode && mode !== 'info') {
    inventoryDetailPanel.classList.add(`is-${mode}`);
  }
};

const setDetailSectionVisibility = (mode) => {
  const showDashboard = mode === 'dashboard';
  const showDescription = mode === 'description';
  const showCollections = mode === 'collections';
  const showEvent = mode === 'event';
  if (detailDashboard) detailDashboard.classList.toggle('is-hidden', !showDashboard);
  if (detailDescription) detailDescription.classList.toggle('is-hidden', !showDescription);
  if (detailCollections) detailCollections.classList.toggle('is-hidden', !showCollections);
  if (detailEvent) detailEvent.classList.toggle('is-hidden', !showEvent);
};

const DASH_STORAGE_PREFIX = 'fodrDashData:';
const CARD_VALUE_PREFIX = 'fodrCardValue:';

const createSeededRng = (seedInput) => {
  let seed = 0;
  const raw = String(seedInput || '');
  for (let i = 0; i < raw.length; i += 1) {
    seed = (seed * 31 + raw.charCodeAt(i)) >>> 0;
  }
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

const loadDashData = (cardId) => {
  if (!cardId) return null;
  const raw = storage.get(`${DASH_STORAGE_PREFIX}${cardId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveDashData = (cardId, data) => {
  if (!cardId) return;
  storage.set(`${DASH_STORAGE_PREFIX}${cardId}`, JSON.stringify(data));
};

const buildLinePath = (values, width = 300, height = 120, padding = 8) => {
  if (!values.length) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : 0;
  const points = values.map((val, index) => {
    const x = step * index;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return [x, y];
  });
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i += 1) {
    d += ` L ${points[i][0]} ${points[i][1]}`;
  }
  return d;
};

const getCardValueKey = (card) => {
  if (card?.id) return `id:${card.id}`;
  const name = String(card?.card_name || card?.name || '').toLowerCase();
  const club = String(card?.club || '').toLowerCase();
  return `${name}-${club}` || 'card';
};

const getLiveCardValue = (card, baseValue) => {
  const key = `${CARD_VALUE_PREFIX}${getCardValueKey(card)}`;
  const todayKey = new Date().toISOString().slice(0, 10);
  const raw = storage.get(key);
  if (raw) {
    try {
      const stored = JSON.parse(raw);
      if (
        stored?.updatedAt === todayKey &&
        Number.isFinite(stored.value) &&
        Number(stored.baseValue) === Number(baseValue)
      ) {
        return stored.value;
      }
    } catch {
      // ignore
    }
  }
  const rng = createSeededRng(`${key}-${todayKey}`);
  const drift = (rng() - 0.5) * 0.08;
  const nextValue = Math.max(1, Math.round((Number(baseValue) || 0) * (1 + drift)));
  storage.set(key, JSON.stringify({ value: nextValue, baseValue: Number(baseValue) || 0, updatedAt: todayKey }));
  return nextValue;
};

const buildHistory = (baseValue, points, volatility, rng) => {
  const history = [];
  let current = baseValue * (1 - volatility * 0.3);
  for (let i = 0; i < points; i += 1) {
    const move = (rng() - 0.5) * volatility;
    current = Math.max(1, current * (1 + move));
    history.push(Math.round(current));
  }
  history[history.length - 1] = Math.round(baseValue);
  return history;
};

const buildDashboardData = (cardId, baseValue) => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const stored = loadDashData(cardId);
  if (stored && stored.updatedAt === todayKey && stored.baseValue === baseValue) {
    return stored;
  }

  const rng = createSeededRng(`${cardId}-${todayKey}`);
  const monthly = Array.from({ length: 12 }, () => Math.max(6, Math.round((baseValue / 1000000) * (0.5 + rng()))));
  const success = monthly.map((count) => Math.round(count * (0.72 + rng() * 0.12)));
  const failed = monthly.map((count, idx) => Math.max(0, Math.round(count * (0.1 + rng() * 0.08))));
  const refunded = monthly.map((count, idx) => Math.max(0, count - success[idx] - failed[idx]));
  const grossHistory = buildHistory(baseValue, 14, 0.12, rng);
  const netHistory = buildHistory(baseValue, 24, 0.06, rng);

  const saleNames = ['AnfieldVault', 'IconDealer', 'ScoutHQ', 'RedLineTrade', 'LFCStore', 'LegendsHub'];
  const sales = Array.from({ length: 30 }, (_, index) => ({
    name: saleNames[index % saleNames.length],
    price: Math.round(baseValue * (0.85 + rng() * 0.35)),
    when: `${Math.max(1, Math.round(rng() * 14))}d ago`
  }));

  const data = {
    updatedAt: todayKey,
    baseValue,
    monthly,
    success,
    failed,
    refunded,
    grossHistory,
    netHistory,
    sales
  };
  saveDashData(cardId, data);
  return data;
};

const renderInventoryDashboard = (card, meta, baseValueOverride) => {
  if (!card) return;
  const explicitBase = Number(baseValueOverride);
  const baseValue = Number.isFinite(explicitBase)
    ? explicitBase
    : getConfiguredCardValue(card, Number(card.card_value ?? meta?.value ?? 0), card.club || meta?.club);
  const data = buildDashboardData(card.id || meta?.name || 'card', baseValue);
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (dashTransactionsYear) dashTransactionsYear.textContent = String(now.getFullYear());
  if (dashTransactionsMonths) {
    dashTransactionsMonths.innerHTML = months.map((m) => `<span>${m}</span>`).join('');
  }

  if (dashTransactionsBars) {
    dashTransactionsBars.innerHTML = '';
    const maxCount = Math.max(...data.monthly);
    data.monthly.forEach((count, index) => {
      const height = Math.max(12, Math.round((count / maxCount) * 100));
      const bar = document.createElement('div');
      bar.className = 'dash-bar';
      bar.dataset.index = String(index);
      bar.dataset.count = String(count);
      bar.dataset.success = String(data.success[index]);
      bar.dataset.failed = String(data.failed[index]);
      bar.dataset.refunded = String(data.refunded[index]);
      bar.innerHTML = `
        <span style="height:${height}%"></span>
        <div class="dash-bar-tooltip">${months[index]} • ${count} sales</div>
      `;
      dashTransactionsBars.appendChild(bar);
    });
  }

  const totalTransactions = data.monthly.reduce((sum, val) => sum + val, 0);
  if (dashTransactionsCount) dashTransactionsCount.textContent = String(totalTransactions);
  if (dashTransactionsSub) {
    const listedDays = card.created_at ? Math.max(1, Math.ceil((Date.now() - new Date(card.created_at)) / 86400000)) : 12;
    dashTransactionsSub.textContent = `Listed for ${listedDays} days`;
  }
  if (dashTransactionsPill) {
    const firstHalf = data.monthly.slice(0, 6).reduce((sum, val) => sum + val, 0);
    const secondHalf = data.monthly.slice(6).reduce((sum, val) => sum + val, 0);
    const base = firstHalf || totalTransactions || 1;
    const diff = ((secondHalf - base) / base) * 100;
    dashTransactionsPill.textContent = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
  }
  if (dashSuccess) dashSuccess.textContent = String(data.success[0] ?? 0);
  if (dashFailed) dashFailed.textContent = String(data.failed[0] ?? 0);
  if (dashRefunded) dashRefunded.textContent = String(data.refunded[0] ?? 0);

  const grossCurrent = data.grossHistory[data.grossHistory.length - 1] || baseValue;
  const grossPrev = data.grossHistory[data.grossHistory.length - 2] || baseValue;
  if (dashGrossValue) dashGrossValue.innerHTML = `${formatPlainNumber(grossCurrent)} <span>F</span>`;
  if (dashGrossPrev) dashGrossPrev.textContent = `${formatPlainNumber(grossPrev)} F previous period`;
  if (dashGrossMax) dashGrossMax.textContent = formatCoins(Math.max(...data.grossHistory));
  if (dashGrossAvg) {
    const avg = data.grossHistory.reduce((sum, val) => sum + val, 0) / data.grossHistory.length;
    dashGrossAvg.textContent = `Avg ${formatCoins(avg)}`;
  }
  if (dashGrossMin) dashGrossMin.textContent = formatCoins(Math.min(...data.grossHistory));
  if (dashGrossPath) dashGrossPath.setAttribute('d', buildLinePath(data.grossHistory));
  if (dashGrossPill) {
    const diff = ((grossCurrent - grossPrev) / grossPrev) * 100;
    dashGrossPill.textContent = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
    dashGrossPill.classList.toggle('positive', diff >= 0);
  }

  const netStart = data.netHistory[0] || baseValue;
  const netNow = data.netHistory[data.netHistory.length - 1] || baseValue;
  const netDiff = netNow - netStart;
  if (dashNetValue) {
    dashNetValue.innerHTML = `${formatPlainNumber(Math.abs(netDiff))} <span>F</span>`;
    dashNetValue.classList.toggle('is-up', netDiff >= 0);
    dashNetValue.classList.toggle('is-down', netDiff < 0);
  }
  if (dashNetNow) dashNetNow.innerHTML = `Now: <strong>${formatCoins(netNow)}</strong>`;
  if (dashNetLast) dashNetLast.textContent = formatCoins(netStart);
  if (dashNetPath) dashNetPath.setAttribute('d', buildLinePath(data.netHistory));

  if (dashSaleList) {
    dashSaleList.innerHTML = data.sales
      .map(
        (sale) => `
      <div class="dash-sale-item">
        <div class="dash-sale-avatar">${sale.name.slice(0, 2).toUpperCase()}</div>
        <div class="dash-sale-info">
          <div class="dash-sale-name">${sale.name}</div>
          <div class="dash-sale-price">${formatCoins(sale.price)} • ${sale.when}</div>
        </div>
      </div>`
      )
      .join('');
  }

  if (dashTransactionsBars) {
    dashTransactionsBars.classList.remove('is-hover');
    dashTransactionsBars.querySelectorAll('.dash-bar').forEach((bar, index) => {
      bar.addEventListener('mouseenter', () => {
        dashTransactionsBars.classList.add('is-hover');
      });
      bar.addEventListener('mouseleave', () => {
        dashTransactionsBars.classList.remove('is-hover');
      });
      bar.addEventListener('click', () => {
        dashTransactionsBars.querySelectorAll('.dash-bar').forEach((item) => item.classList.remove('is-active'));
        bar.classList.add('is-active');
        if (dashSuccess) dashSuccess.textContent = bar.dataset.success || '0';
        if (dashFailed) dashFailed.textContent = bar.dataset.failed || '0';
        if (dashRefunded) dashRefunded.textContent = bar.dataset.refunded || '0';
      });
      if (index === 0) {
        bar.classList.add('is-active');
      }
    });
  }

  const setupLineHover = (chartEl, values, tooltipEl) => {
    if (!chartEl || !tooltipEl || !values.length) return;
    chartEl.__values = values;
    chartEl.__tooltip = tooltipEl;
    if (!chartEl.dataset.bound) {
      chartEl.dataset.bound = 'true';
      chartEl.addEventListener('mousemove', (event) => {
        const rect = chartEl.getBoundingClientRect();
        const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
        const list = chartEl.__values || [];
        if (!list.length) return;
        const idx = Math.round((x / rect.width) * (list.length - 1));
        const tooltip = chartEl.__tooltip;
        if (tooltip) {
          tooltip.textContent = formatCoins(list[idx]);
          tooltip.style.left = `${Math.min(Math.max(x - 30, 8), rect.width - 60)}px`;
        }
        chartEl.classList.add('is-hover');
      });
      chartEl.addEventListener('mouseleave', () => {
        chartEl.classList.remove('is-hover');
      });
    }
  };

  setupLineHover(dashGrossChart, data.grossHistory, dashGrossTooltip);
};

const openInventoryDetail = (card) => {
  if (!inventoryDetailStage || !cardgameView || !card) return;
  const meta = findCatalogCard(card);
  const packDefinition = packDefinitions[meta?.packKey] || packDefinitions.liverpool;
  activeInventoryDetailCard = card;
  activeInventoryDetailMeta = meta;
  const baseValue = getConfiguredCardValue(card, Number(card.card_value || meta?.value || 0), card.club || meta?.club);
  const liveValue = getLiveCardValue(card, baseValue);
  activeInventoryDetailValue = liveValue;
  const name = card.card_name || meta?.name || 'Player';
  const club = card.club || meta?.club || '';
  const clubShort = meta?.clubShort || club || '';
  const position = card.card_position || meta?.position || '';
  const country = meta?.country || '';
  const age = meta?.age || '';
  const number = meta?.number || '';
  const rarity = meta?.packKey === 'ultimate' ? '1/1' : '1/100';
  const price = Number(liveValue || baseValue || 0);

  if (inventoryStage) {
    inventoryStage.classList.add('is-hidden');
  }
  inventoryDetailStage.classList.remove('is-hidden');
  cardgameView.classList.add('is-inventory-detail');
  inventoryDetailOpen = true;
  inventoryViewLocked = true;
  setCardgameTabActive('inventory');
  setStoredView('inventory');

  if (inventoryDetailCardImg) {
    inventoryDetailCardImg.src = card.image || meta?.img || '';
    inventoryDetailCardImg.alt = name;
  }
  if (detailName) detailName.textContent = String(name).toUpperCase();
  if (detailPrice) detailPrice.textContent = formatCardValue(price);
  if (detailTeamLogo) {
    const logo = meta?.clubLogo || (club.toLowerCase() === 'brazil' ? flagImages.brazil : null);
    if (logo) {
      detailTeamLogo.src = logo;
      detailTeamLogo.alt = club || 'Team';
    } else {
      detailTeamLogo.removeAttribute('src');
    }
  }
  if (detailTeamShort) detailTeamShort.textContent = clubShort.toUpperCase();
  if (detailCountry) detailCountry.textContent = String(country).toUpperCase();
  applyFlag(detailFlag, country);
  if (detailAge) detailAge.textContent = String(age || '');
  if (detailPosition) detailPosition.textContent = String(position || '').toUpperCase();
  if (detailRarity) detailRarity.textContent = rarity;
  if (detailDate) detailDate.textContent = formatShortDate(card.created_at) || formatShortDate(new Date());

  if (detailCardId1) detailCardId1.textContent = String(number || 'AL');
  if (detailCardId2) detailCardId2.textContent = String(card.id || '001');
  if (detailCardId3) detailCardId3.textContent = String(clubShort || 'K').slice(0, 1).toUpperCase();
  if (detailTrade1) detailTrade1.textContent = '0';
  if (detailTrade2) detailTrade2.textContent = '9';
  if (detailTrade3) detailTrade3.textContent = '1';
  if (detailPack1) detailPack1.textContent = 'WQ';
  if (detailPack2) detailPack2.textContent = '4R';
  if (detailPack3) detailPack3.textContent = 'T5';

  const editionText =
    meta?.packKey === 'ultimate'
      ? 'ULTIMATE EDITION'
      : meta?.packKey === 'elite'
        ? 'ELITE EDITION'
        : `${(clubShort || club || 'LIV').toUpperCase()} EDITION`;
  if (detailEditionText) detailEditionText.textContent = editionText;
  if (detailEditionLogo) {
    const editionLogo =
      meta?.packKey === 'ultimate'
        ? flagImages.brazil
        : meta?.packKey === 'elite'
          ? packDefinitions.elite.backImg
          : meta?.clubLogo || null;
    if (editionLogo) {
      detailEditionLogo.src = editionLogo;
      detailEditionLogo.alt = editionText;
    } else {
      detailEditionLogo.removeAttribute('src');
      detailEditionLogo.alt = '';
    }
  }
  if (detailEditionBody) {
    detailEditionBody.classList.toggle('is-flag', meta?.packKey === 'ultimate');
    if (detailEditionLogo && meta?.packKey === 'ultimate') {
      detailEditionLogo.classList.add('is-vertical');
    } else if (detailEditionLogo) {
      detailEditionLogo.classList.remove('is-vertical');
    }
  }

  if (eventPackImg) {
    eventPackImg.src = packDefinition.backImg;
  }
  if (eventTitle) {
    eventTitle.textContent = packDefinition.eventTitle;
  }
  if (eventCreated) {
    eventCreated.textContent = packDefinition.eventCreated;
  }
  if (eventDesc) {
    eventDesc.textContent = packDefinition.eventDesc;
  }
  if (eventIncludes) {
    eventIncludes.textContent = packDefinition.eventIncludes;
  }
  if (eventTheme) {
    eventTheme.textContent = packDefinition.eventTheme;
  }
  if (eventDrop) {
    eventDrop.textContent = packDefinition.eventDrop;
  }

  if (inventoryDetailPanel) {
    inventoryDetailPanel.classList.remove('is-empty');
  }
  setDetailPanelMode('info');
  setDetailSectionVisibility('info');
  detailSideButtons.forEach((btn, index) => {
    btn.classList.toggle('is-active', index === 0);
  });
  renderInventoryDashboard(card, meta, liveValue);
};

const exitInventoryDetail = () => {
  if (!inventoryDetailStage || !cardgameView) return;
  inventoryDetailStage.classList.add('is-hidden');
  inventoryDetailOpen = false;
  activeInventoryDetailCard = null;
  activeInventoryDetailMeta = null;
  activeInventoryDetailValue = null;
  cardgameView.classList.remove('is-inventory-detail');
  if (inventoryStage && inventoryViewLocked) {
    inventoryStage.classList.remove('is-hidden');
  }
};

const parseOptionalNumber = (value) => {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
};

const getShopFilters = () => ({
  min: shopFilterMin ? parseOptionalNumber(shopFilterMin.value) : null,
  max: shopFilterMax ? parseOptionalNumber(shopFilterMax.value) : null,
  edition: shopFilterEdition ? shopFilterEdition.value : 'all',
  position: shopFilterPosition ? shopFilterPosition.value : 'all',
  club: shopFilterClub ? shopFilterClub.value : 'any',
  country: shopFilterCountry ? shopFilterCountry.value : 'any',
  seller: shopFilterSeller ? shopFilterSeller.value.trim().toLowerCase() : '',
  sort: shopFilterSort ? shopFilterSort.value : 'latest',
  rarity: {
    common: Boolean(shopFilterRarityCommon?.checked),
    elite: Boolean(shopFilterRarityElite?.checked),
    ultimate: Boolean(shopFilterRarityUltimate?.checked)
  },
  buyNow: Boolean(shopFilterBuyNow?.checked),
  verified: Boolean(shopFilterVerified?.checked),
  newToday: Boolean(shopFilterNew?.checked)
});

const applyShopFilters = () => {
  const filters = getShopFilters();
  let filtered = [...marketListings];

  if (Number.isFinite(filters.min)) {
    filtered = filtered.filter((item) => item.price >= filters.min);
  }
  if (Number.isFinite(filters.max) && filters.max > 0) {
    filtered = filtered.filter((item) => item.price <= filters.max);
  }

  if (filters.edition && filters.edition !== 'all') {
    filtered = filtered.filter((item) => item.packKey === filters.edition);
  }

  if (filters.position && filters.position !== 'all') {
    filtered = filtered.filter((item) => item.position === filters.position);
  }

  if (filters.club && filters.club !== 'any') {
    filtered = filtered.filter((item) => item.club?.toLowerCase() === filters.club);
  }

  if (filters.country && filters.country !== 'any') {
    filtered = filtered.filter((item) => item.country?.toLowerCase() === filters.country);
  }

  if (filters.seller) {
    filtered = filtered.filter((item) => item.seller.toLowerCase().includes(filters.seller));
  }

  if (filters.rarity.common || filters.rarity.elite || filters.rarity.ultimate) {
    filtered = filtered.filter((item) => {
      const rarity = item.rarity?.toLowerCase();
      if (rarity === 'common' && filters.rarity.common) return true;
      if (rarity === 'elite' && filters.rarity.elite) return true;
      if (rarity === 'ultimate' && filters.rarity.ultimate) return true;
      return false;
    });
  }

  if (filters.buyNow) {
    filtered = filtered.filter((item) => item.buyNow);
  }
  if (filters.verified) {
    filtered = filtered.filter((item) => item.verified);
  }
  if (filters.newToday) {
    filtered = filtered.filter((item) => item.newListing);
  }

  if (filters.sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'rating') {
    filtered.sort((a, b) => (b.marketValue || b.value || 0) - (a.marketValue || a.value || 0));
  } else if (filters.sort === 'latest') {
    filtered.sort((a, b) => b.listedAt - a.listedAt);
  }

  renderShop(filtered);
};

const resetShopFilters = () => {
  if (shopFilterMin) shopFilterMin.value = '';
  if (shopFilterMax) shopFilterMax.value = '';
  if (shopFilterEdition) shopFilterEdition.value = 'all';
  if (shopFilterPosition) shopFilterPosition.value = 'all';
  if (shopFilterClub) shopFilterClub.value = 'any';
  if (shopFilterCountry) shopFilterCountry.value = 'any';
  if (shopFilterSeller) shopFilterSeller.value = '';
  if (shopFilterSort) shopFilterSort.value = 'latest';
  if (shopFilterRarityCommon) shopFilterRarityCommon.checked = false;
  if (shopFilterRarityElite) shopFilterRarityElite.checked = false;
  if (shopFilterRarityUltimate) shopFilterRarityUltimate.checked = false;
  if (shopFilterBuyNow) shopFilterBuyNow.checked = false;
  if (shopFilterVerified) shopFilterVerified.checked = false;
  if (shopFilterNew) shopFilterNew.checked = false;
  renderShop(marketListings);
};

const getInventoryFilters = () => ({
  search: inventoryFilterSearch ? inventoryFilterSearch.value.trim().toLowerCase() : '',
  min: inventoryFilterMin ? parseOptionalNumber(inventoryFilterMin.value) : null,
  max: inventoryFilterMax ? parseOptionalNumber(inventoryFilterMax.value) : null,
  position: inventoryFilterPosition ? inventoryFilterPosition.value : 'all',
  club: inventoryFilterClub ? inventoryFilterClub.value : 'any',
  sort: inventoryFilterSort ? inventoryFilterSort.value : 'latest'
});

const applyInventoryFilters = () => {
  let filtered = [...inventoryAllRecords];
  const filters = getInventoryFilters();

  if (filters.search) {
    filtered = filtered.filter((card) =>
      String(card.card_name || '').toLowerCase().includes(filters.search)
    );
  }
  if (filters.position && filters.position !== 'all') {
    filtered = filtered.filter((card) => String(card.card_position || '') === filters.position);
  }
  if (filters.club && filters.club !== 'any') {
    filtered = filtered.filter((card) => String(card.club || '').toLowerCase() === filters.club);
  }

  filtered = filtered.filter((card) => {
    const meta = findCatalogCard(card);
    const baseValue = getConfiguredCardValue(card, Number(card.card_value || meta?.value || 0), card.club || meta?.club);
    const liveValue = getLiveCardValue(card, baseValue);
    if (Number.isFinite(filters.min) && liveValue < filters.min) return false;
    if (Number.isFinite(filters.max) && filters.max > 0 && liveValue > filters.max) return false;
    return true;
  });

  if (filters.sort === 'value-desc') {
    filtered.sort((a, b) => {
      const aMeta = findCatalogCard(a);
      const bMeta = findCatalogCard(b);
      const aVal = getLiveCardValue(a, getConfiguredCardValue(a, Number(a.card_value || aMeta?.value || 0), a.club || aMeta?.club));
      const bVal = getLiveCardValue(b, getConfiguredCardValue(b, Number(b.card_value || bMeta?.value || 0), b.club || bMeta?.club));
      return bVal - aVal;
    });
  } else if (filters.sort === 'value-asc') {
    filtered.sort((a, b) => {
      const aMeta = findCatalogCard(a);
      const bMeta = findCatalogCard(b);
      const aVal = getLiveCardValue(a, getConfiguredCardValue(a, Number(a.card_value || aMeta?.value || 0), a.club || aMeta?.club));
      const bVal = getLiveCardValue(b, getConfiguredCardValue(b, Number(b.card_value || bMeta?.value || 0), b.club || bMeta?.club));
      return aVal - bVal;
    });
  } else if (filters.sort === 'name') {
    filtered.sort((a, b) => String(a.card_name || '').localeCompare(String(b.card_name || '')));
  }

  renderInventory(filtered);
};

const resetInventoryFilters = () => {
  if (inventoryFilterSearch) inventoryFilterSearch.value = '';
  if (inventoryFilterMin) inventoryFilterMin.value = '';
  if (inventoryFilterMax) inventoryFilterMax.value = '';
  if (inventoryFilterPosition) inventoryFilterPosition.value = 'all';
  if (inventoryFilterClub) inventoryFilterClub.value = 'any';
  if (inventoryFilterSort) inventoryFilterSort.value = 'latest';
  renderInventory(inventoryAllRecords);
};

const setCardgameTabActive = (label) => {
  cardgameTabs.forEach((tab) => {
    const isActive = tab.textContent?.trim().toLowerCase() === label;
    tab.classList.toggle('is-active', isActive);
  });
};

const getCardgameTabLabel = (tab) => tab.textContent?.trim().toLowerCase();

export const openInventoryStage = async () => {
  const user = loadUser();
  if (!user) {
    openAuthModal('login');
    showAuthMessage('Login to view inventory.');
    return;
  }
  if (!inventoryStage || !cardgameView) return;
  if (inventoryDetailOpen) {
    exitInventoryDetail();
  }
  showCardgame();
  inventoryViewLocked = true;
  ensureInventoryFilterToggle();
  setInventoryFiltersOpen(false);
  inventoryStage.classList.remove('is-hidden');
  cardgameView.classList.add('is-inventory-open');
  setCardgameTabActive('inventory');
  setStoredView('inventory');
  try {
    const res = await fetch(`${API_BASE}/cardgame/inventory/${user.id}`);
    const data = await res.json().catch(() => ({}));
    const cards = FORCE_FULL_COLLECTION ? buildFullInventory() : (data.cards || []);
    setInventoryRecords(cards);
    resetInventoryFilters();
  } catch (err) {
    const cards = FORCE_FULL_COLLECTION ? buildFullInventory() : [];
    setInventoryRecords(cards);
    resetInventoryFilters();
  }
};

const exitInventoryStage = () => {
  if (!inventoryStage || !cardgameView) return;
  if (inventoryDetailOpen) {
    exitInventoryDetail();
  }
  inventoryStage.classList.add('is-hidden');
  inventoryViewLocked = false;
  cardgameView.classList.remove('is-inventory-open');
};

const closeInventoryStage = () => {
  exitInventoryStage();
  setInventoryFiltersOpen(false);
  showCardgame();
  setCardgameTabActive('packs');
  setStoredView('cardgame');
};

const openShopStage = () => {
  if (!shopStage || !cardgameView) return;
  if (packViewLocked) {
    exitPackStage();
  }
  if (inventoryViewLocked) {
    exitInventoryStage();
  }
  if (shopDetailOpen) {
    exitShopDetail();
  }
  showCardgame();
  ensureShopFilterToggle();
  setShopFiltersOpen(false);
  shopStage.classList.remove('is-hidden');
  shopViewLocked = true;
  cardgameView.classList.add('is-shop-open');
  cardgameView.classList.remove('is-shop-detail');
  setCardgameTabActive('shop');
  setStoredView('shop');
  renderShop();
};

const exitShopStage = () => {
  if (!shopStage || !cardgameView) return;
  if (shopDetailOpen) {
    exitShopDetail();
  }
  shopStage.classList.add('is-hidden');
  setShopFiltersOpen(false);
  shopViewLocked = false;
  cardgameView.classList.remove('is-shop-open');
  cardgameView.classList.remove('is-shop-detail');
};

const resetPackInfo = () => {
  if (packInfoName) packInfoName.textContent = 'PLAYER';
  if (packInfoNumber) packInfoNumber.textContent = '';
  if (packInfoMarket) packInfoMarket.textContent = '';
  if (packInfoClub) packInfoClub.textContent = '';
  if (packInfoClubLogo) packInfoClubLogo.removeAttribute('src');
  if (packInfoGoals) packInfoGoals.textContent = '';
  if (packInfoAssists) packInfoAssists.textContent = '';
  if (packInfoCountry) packInfoCountry.textContent = '';
  if (packInfoAge) packInfoAge.textContent = '';
  if (packInfoCardValue) packInfoCardValue.textContent = '';
  if (packInfoSeason) packInfoSeason.textContent = '';
  if (packInfoSellValue) packInfoSellValue.textContent = '';
  if (packInfoNote) packInfoNote.textContent = '';
};

const getActiveCard = () => packCards[activeSlotIndex]?.data;

const fillPackInfo = (card) => {
  if (!card) return;
  if (packInfoName) packInfoName.textContent = card.name.toUpperCase();
  if (packInfoNumber) packInfoNumber.textContent = card.number ?? '';
  if (packInfoMarket) packInfoMarket.textContent = formatMarketValue(card.marketValue);
  if (packInfoClub) packInfoClub.textContent = card.clubShort || card.club || '';
  if (packInfoClubLogo) {
    if (card.clubLogo) {
      packInfoClubLogo.src = card.clubLogo;
      packInfoClubLogo.alt = card.club || 'Club logo';
    } else {
      packInfoClubLogo.removeAttribute('src');
      packInfoClubLogo.alt = '';
    }
  }
  if (packInfoGoals) packInfoGoals.textContent = card.goals ?? '';
  if (packInfoAssists) packInfoAssists.textContent = card.assists ?? '';
  if (packInfoCountry) packInfoCountry.textContent = (card.country || '').toUpperCase();
  if (packInfoAge) packInfoAge.textContent = card.age ?? '';
  if (packInfoCardValue) packInfoCardValue.textContent = formatCardValue(card.value);
  if (packInfoSellValue) packInfoSellValue.textContent = formatCardValue(card.sell);
  if (packInfoSeason) packInfoSeason.textContent = card.season || '';
  if (packInfoFlag && Array.isArray(card.flag)) {
    const [top, mid, bottom] = card.flag;
    packInfoFlag.style.background = `linear-gradient(to bottom, ${top} 0 33%, ${mid} 33% 66%, ${bottom} 66% 100%)`;
  }
  if (packInfoNote) packInfoNote.textContent = card.note;
};

const resolvePackAfterOpen = (resolvedIndex = activeSlotIndex) => {
  const slot = packCards[resolvedIndex];
  if (slot?.card) {
    slot.resolved = true;
    slot.card.classList.add('is-resolved');
  }
  if (packOpensRemaining > 0) {
    packOpensRemaining -= 1;
  }
  if (packOpensRemaining > 0) {
    storage.set(PACK_COUNT_KEY, String(packOpensRemaining));
    resetPackInfo();
    if (packInfoStatus) {
      packInfoStatus.textContent = `${packOpensRemaining} open${packOpensRemaining === 1 ? '' : 's'} left.`;
    }
    return;
  }
  closePackStage();
};

const finalizePurchase = (quantity) => {
  packPurchaseReady = true;
  packOpensRemaining = quantity;
  storage.set(PACK_COUNT_KEY, String(quantity));
  setPackDisplayCount(quantity);
  setPackState({ open: true, packId: currentPackId, ready: true });
  if (packInfoStatus) {
    packInfoStatus.textContent = quantity > 1 ? 'Pack ready. 2 opens available.' : 'Pack ready. Tap the card to open.';
  }
  if (packBuyConfirm) {
    packBuyConfirm.textContent = quantity > 1 ? 'Purchased x2' : 'Purchased';
  }
  if (packBuyActions) packBuyActions.classList.add('is-hidden');
};

const openPackCard = (slotIndex) => {
  const slot = packCards[slotIndex];
  if (!slot?.card || !slot.backImg) return;
  if (!packPurchaseReady || packOpensRemaining <= 0) {
    if (packInfoStatus) packInfoStatus.textContent = 'Purchase required before opening.';
    return;
  }
  if (slot.resolved) {
    if (packInfoStatus) packInfoStatus.textContent = 'This card is already claimed.';
    return;
  }
  activeSlotIndex = slotIndex;
  if (slot.data) {
    fillPackInfo(slot.data);
    if (packInfoStatus) packInfoStatus.textContent = '';
    return;
  }
  const packDefinition = packDefinitions[currentPackId];
  if (packDefinition?.cards?.length) {
    const card = pickRandom(packDefinition.cards);
    slot.data = card;
    slot.backImg.src = card.img;
    fillPackInfo(card);
    if (packInfoStatus) packInfoStatus.textContent = '';
  }
  slot.card.classList.add('is-open');
  slot.card.setAttribute('aria-pressed', 'true');
  if (packOpenStage) {
    packOpenStage.classList.add('is-open');
  }
};

export const restorePackState = () => {
  const restorePackOpen = storage.get(PACK_OPEN_KEY) === 'true';
  const restorePackId = storage.get(PACK_ID_KEY);
  const restorePackReady = storage.get(PACK_READY_KEY) === 'true';
  const restoreCountRaw = Number(storage.get(PACK_COUNT_KEY) || 1);
  if (restorePackOpen && restorePackId) {
    showCardgame();
    openPackStage(restorePackId);
    if (restorePackReady) {
      packPurchaseReady = true;
      packOpensRemaining = Number.isFinite(restoreCountRaw) ? restoreCountRaw : 1;
      setPackDisplayCount(packOpensRemaining);
      if (packInfoStatus) {
        packInfoStatus.textContent =
          packOpensRemaining > 1 ? 'Pack ready. 2 opens available.' : 'Pack ready. Tap the card to open.';
      }
      if (packBuyConfirm) {
        packBuyConfirm.disabled = true;
        packBuyConfirm.textContent = packOpensRemaining > 1 ? 'Purchased x2' : 'Purchased';
      }
      if (packBuyActions) {
        packBuyActions.classList.add('is-hidden');
      }
    }
  }
};

export const initCardgame = () => {
  syncCatalogCardPrices();
  loadSharedCardPrices();

  registerBeforeViewChange(() => {
    if (packViewLocked) {
      exitPackStage();
    }
    if (inventoryViewLocked) {
      exitInventoryStage();
    }
    if (shopViewLocked) {
      exitShopStage();
    }
    if (inventoryDetailOpen) {
      exitInventoryDetail();
    }
  });

  const currentUser = loadUser();
  if (currentUser?.id) {
    fetchCardgameBalance(currentUser.id);
  } else {
    setCardgameBalance(DEFAULT_BALANCE);
  }

  onEvent('fodr:user', (event) => {
    const user = event.detail?.user;
    if (user?.id) {
      fetchCardgameBalance(user.id);
    }
  });

  onEvent('fodr:logout', () => {
    setCardgameBalance(DEFAULT_BALANCE);
  });

  packBuys.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const cost = Number(button.dataset.cost);
      if (!Number.isFinite(cost) || cost <= 0) return;
      pendingPackCost = cost;
      showCardgame();
      openPackStage(button.dataset.pack);
    });
  });

  if (inventoryBtn) {
    inventoryBtn.addEventListener('click', (event) => {
      event.preventDefault();
      openInventoryStage();
    });
  }

  if (inventoryBack) {
    inventoryBack.addEventListener('click', (event) => {
      event.preventDefault();
      closeInventoryStage();
    });
  }

  if (inventoryDetailBack) {
    inventoryDetailBack.addEventListener('click', (event) => {
      event.preventDefault();
      exitInventoryDetail();
    });
  }

  if (detailSideButtons.length) {
    detailSideButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        detailSideButtons.forEach((item) => item.classList.remove('is-active'));
        btn.classList.add('is-active');
        const mode =
          index === 1
            ? 'dashboard'
            : index === 2
            ? 'description'
            : index === 3
            ? 'collections'
            : index === 4
            ? 'event'
            : 'info';
        setDetailPanelMode(mode);
        setDetailSectionVisibility(mode);
        if (mode === 'dashboard' && activeInventoryDetailCard) {
          renderInventoryDashboard(
            activeInventoryDetailCard,
            activeInventoryDetailMeta,
            activeInventoryDetailValue
          );
        }
      });
    });
  }

  if (shopFilterApply) {
    shopFilterApply.addEventListener('click', (event) => {
      event.preventDefault();
      applyShopFilters();
      if (isCardgameEmbedMode) setShopFiltersOpen(false);
    });
  }

  if (shopFilterReset) {
    shopFilterReset.addEventListener('click', (event) => {
      event.preventDefault();
      resetShopFilters();
      if (isCardgameEmbedMode) setShopFiltersOpen(false);
    });
  }

  if (inventoryFilterApply) {
    inventoryFilterApply.addEventListener('click', (event) => {
      event.preventDefault();
      applyInventoryFilters();
      if (isCardgameEmbedMode) setInventoryFiltersOpen(false);
    });
  }

  if (inventoryFilterReset) {
    inventoryFilterReset.addEventListener('click', (event) => {
      event.preventDefault();
      resetInventoryFilters();
      if (isCardgameEmbedMode) setInventoryFiltersOpen(false);
    });
  }

  ensureInventoryFilterToggle();
  ensureShopFilterToggle();

  if (cardgameTabs.length) {
    cardgameTabs.forEach((tab) => {
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        const label = getCardgameTabLabel(tab);
        if (label === 'shop') {
          openShopStage();
          return;
        }
        if (label === 'inventory') {
          if (packViewLocked) {
            exitPackStage();
          }
          openInventoryStage();
          return;
        }
        if (packViewLocked && label !== 'inventory') {
          closePackStage();
        }
        if (inventoryViewLocked && label === 'packs') {
          closeInventoryStage();
        }
        if (shopViewLocked && label !== 'shop') {
          exitShopStage();
        }
        if (shopDetailOpen && label !== 'shop') {
          exitShopDetail();
        }
        if (inventoryDetailOpen && label !== 'inventory') {
          exitInventoryDetail();
        }
        setCardgameTabActive(label);
        if (label === 'packs') {
          setStoredView('cardgame');
        }
      });
    });
  }

  if (inventoryList) {
    inventoryList.addEventListener('click', (event) => {
      const sellBtn = event.target.closest('.inventory-sell');
      if (sellBtn) {
        const user = loadUser();
        if (!user) {
          openAuthModal('login');
          showAuthMessage('Login to sell cards.');
          return;
        }
        const cardId = Number(sellBtn.dataset.cardId);
        if (!cardId) return;
        postJson('/cardgame/inventory/sell', { userId: user.id, cardId })
          .then((data) => {
            if (typeof data.coins === 'number') {
              setCardgameBalance(data.coins);
            }
            inventoryAllRecords = inventoryAllRecords.filter((item) => Number(item.id) !== cardId);
            const filtered = inventoryRecords.filter((item) => Number(item.id) !== cardId);
            renderInventory(filtered);
            notifyInventoryUpdate();
          })
          .catch((err) => {
            alert(err.message || 'Sell failed.');
          });
        return;
      }

      const cardEl = event.target.closest('.inventory-card');
      if (!cardEl) return;
      const cardId = String(cardEl.dataset.cardId || '');
      const card = inventoryById.get(cardId);
      if (card) {
        openInventoryDetail(card);
      }
    });
  }

  if (shopGrid) {
    shopGrid.addEventListener('click', (event) => {
      const buyBtn = event.target.closest('.shop-buy');
      if (buyBtn) {
        const cardEl = buyBtn.closest('.shop-card');
        const listingId = String(cardEl?.dataset?.listingId || '');
        const listing = marketListings.find((item) => String(item.listingId) === listingId);
        handleShopPurchase(listing);
        return;
      }
      const cardEl = event.target.closest('.shop-card');
      if (!cardEl) return;
      const listingId = String(cardEl.dataset.listingId || '');
      const listing = marketListings.find((item) => String(item.listingId) === listingId);
      openShopDetail(listing);
    });
  }

  if (shopDetailBack) {
    shopDetailBack.addEventListener('click', (event) => {
      event.preventDefault();
      exitShopDetail();
    });
  }

  const shopDetailBuy = document.querySelector('.shop-detail-buy');
  if (shopDetailBuy) {
    shopDetailBuy.addEventListener('click', (event) => {
      event.preventDefault();
      if (!shopDetailConfirm) {
        handleShopPurchase(activeShopListing);
        return;
      }
      shopDetailConfirm.classList.toggle('is-hidden', false);
    });
  }

  if (shopDetailConfirmYes) {
    shopDetailConfirmYes.addEventListener('click', (event) => {
      event.preventDefault();
      if (shopDetailConfirm) shopDetailConfirm.classList.add('is-hidden');
      handleShopPurchase(activeShopListing);
    });
  }

  if (shopDetailConfirmNo) {
    shopDetailConfirmNo.addEventListener('click', (event) => {
      event.preventDefault();
      if (shopDetailConfirm) shopDetailConfirm.classList.add('is-hidden');
    });
  }

  if (shopDetailConfirm) {
    shopDetailConfirm.addEventListener('click', (event) => {
      if (event.target === shopDetailConfirm) {
        shopDetailConfirm.classList.add('is-hidden');
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (!packViewLocked) return;
    const link = event.target.closest('a');
    if (link && link.getAttribute('href')) {
      event.preventDefault();
    }
  });

  packCards.forEach((slot, index) => {
    if (!slot.card) return;
    slot.card.addEventListener('click', (event) => {
      event.preventDefault();
      openPackCard(index);
    });
    slot.card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPackCard(index);
      }
    });
  });

  if (packSaveBtn) {
    packSaveBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const user = loadUser();
      if (!user) {
        openAuthModal('login');
        showAuthMessage('Login to save cards.');
        return;
      }
      const openSlots = packCards
        .map((slot, index) => (slot?.data && !slot.resolved ? index : null))
        .filter((value) => value !== null);
      const activeCard = getActiveCard();
      if (!activeCard) {
        if (packInfoStatus) packInfoStatus.textContent = 'Open the pack first.';
        return;
      }
      const saveCard = (card) =>
        postJson('/cardgame/inventory/add', {
          userId: user.id,
          card: {
            name: card.name,
            position: card.position,
            club: card.club,
            started: card.started,
            value: card.value,
            sell: card.sell,
            note: card.note,
            image: card.img,
            acquiredVia: 'pack'
          }
        });

      if (openSlots.length > 1) {
        const cardsToSave = openSlots.map((idx) => packCards[idx].data).filter(Boolean);
        Promise.all(cardsToSave.map((card) => saveCard(card)))
          .then(() => {
            if (packInfoStatus) packInfoStatus.textContent = 'Saved both to inventory.';
            openSlots.forEach((idx) => resolvePackAfterOpen(idx));
            notifyInventoryUpdate();
          })
          .catch((err) => {
            if (packInfoStatus) packInfoStatus.textContent = err.message || 'Save failed.';
          });
        return;
      }

      saveCard(activeCard)
        .then(() => {
          if (packInfoStatus) packInfoStatus.textContent = 'Saved to inventory.';
          resolvePackAfterOpen(activeSlotIndex);
          notifyInventoryUpdate();
        })
        .catch((err) => {
          if (packInfoStatus) packInfoStatus.textContent = err.message || 'Save failed.';
        });
    });
  }

  if (packSellBtn) {
    packSellBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const user = loadUser();
      if (!user) {
        openAuthModal('login');
        showAuthMessage('Login to sell cards.');
        return;
      }
      const activeCard = getActiveCard();
      if (!activeCard) {
        if (packInfoStatus) packInfoStatus.textContent = 'Open the pack first.';
        return;
      }
      postJson('/cardgame/sell', { userId: user.id, amount: activeCard.sell })
        .then((data) => {
          if (typeof data.coins === 'number') {
            setCardgameBalance(data.coins);
          }
          if (packInfoStatus) {
            packInfoStatus.textContent = `Sold for ${formatCoins(activeCard.sell)}.`;
          }
          resolvePackAfterOpen();
        })
        .catch((err) => {
          if (packInfoStatus) packInfoStatus.textContent = err.message || 'Sell failed.';
        });
    });
  }

  if (packDiscardBtn) {
    packDiscardBtn.addEventListener('click', (event) => {
      event.preventDefault();
      resolvePackAfterOpen();
    });
  }

  if (packOpenBack) {
    packOpenBack.addEventListener('click', (event) => {
      event.preventDefault();
      closePackStage();
    });
  }

  if (packBuyConfirm) {
    packBuyConfirm.addEventListener('click', (event) => {
      event.preventDefault();
      const user = loadUser();
      if (!user) {
        openAuthModal('login');
        showAuthMessage('Login to buy packs.');
        return;
      }
      if (!pendingPackCost) return;
      if (packBuyActions) {
        packBuyActions.classList.remove('is-hidden');
      }
      if (packInfoStatus) packInfoStatus.textContent = 'Confirm or cancel the purchase below.';
    });
  }

  if (packBuyNo) {
    packBuyNo.addEventListener('click', (event) => {
      event.preventDefault();
      if (packBuyActions) packBuyActions.classList.add('is-hidden');
      if (packInfoStatus) packInfoStatus.textContent = 'Purchase canceled.';
    });
  }

  if (packBuyYes) {
    packBuyYes.addEventListener('click', (event) => {
      event.preventDefault();
      const user = loadUser();
      if (!user) {
        openAuthModal('login');
        showAuthMessage('Login to buy packs.');
        return;
      }
      if (!pendingPackCost) return;
      if (packBuyConfirm) packBuyConfirm.disabled = true;
      if (packBuyYes) packBuyYes.disabled = true;
      if (packBuyYesDouble) packBuyYesDouble.disabled = true;
      if (packBuyNo) packBuyNo.disabled = true;
      if (packInfoStatus) packInfoStatus.textContent = 'Processing purchase...';
      postJson('/cardgame/purchase', { userId: user.id, cost: pendingPackCost })
        .then((data) => {
          if (typeof data.coins === 'number') {
            setCardgameBalance(data.coins);
          }
          finalizePurchase(1);
        })
        .catch((err) => {
          packPurchaseReady = false;
          if (packInfoStatus) {
            packInfoStatus.textContent = err.message || 'Purchase failed.';
          } else {
            alert(err.message || 'Purchase failed.');
          }
          if (packBuyConfirm) packBuyConfirm.disabled = false;
          if (packBuyYes) packBuyYes.disabled = false;
          if (packBuyYesDouble) packBuyYesDouble.disabled = false;
          if (packBuyNo) packBuyNo.disabled = false;
        });
    });
  }

  if (packBuyYesDouble) {
    packBuyYesDouble.addEventListener('click', (event) => {
      event.preventDefault();
      const user = loadUser();
      if (!user) {
        openAuthModal('login');
        showAuthMessage('Login to buy packs.');
        return;
      }
      if (!pendingPackCost) return;
      const doubleCost = pendingPackCost * 2;
      if (packBuyConfirm) packBuyConfirm.disabled = true;
      if (packBuyYes) packBuyYes.disabled = true;
      if (packBuyYesDouble) packBuyYesDouble.disabled = true;
      if (packBuyNo) packBuyNo.disabled = true;
      if (packInfoStatus) packInfoStatus.textContent = 'Processing purchase x2...';
      postJson('/cardgame/purchase', { userId: user.id, cost: doubleCost })
        .then((data) => {
          if (typeof data.coins === 'number') {
            setCardgameBalance(data.coins);
          }
          finalizePurchase(2);
        })
        .catch((err) => {
          packPurchaseReady = false;
          if (packInfoStatus) {
            packInfoStatus.textContent = err.message || 'Purchase failed.';
          } else {
            alert(err.message || 'Purchase failed.');
          }
          if (packBuyConfirm) packBuyConfirm.disabled = false;
          if (packBuyYes) packBuyYes.disabled = false;
          if (packBuyYesDouble) packBuyYesDouble.disabled = false;
          if (packBuyNo) packBuyNo.disabled = false;
        });
    });
  }

  document.addEventListener('submit', (event) => {
    if (packViewLocked) {
      event.preventDefault();
    }
  });
};
