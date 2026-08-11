const DATA_URL = "data/risk-places.csv";
const MAP_URL = "data/world-map.json?v=20260519-portugal-crimea-1";
const SAVE_KEY = "risk-variant-moderator-v1";
const ONLINE_GAME_ID_KEY = "risk-variant-online-game-id";
const SESSION_ROLE_KEY = "risk-variant-session-role";
const SESSION_PLAYER_KEY = "risk-variant-session-player-id";
const RECRUIT_DRAFT_KEY_PREFIX = "risk-variant-recruit-draft";

const REGION_BONUSES = {
  "Eastern Europe": 11,
  "Northern Africa": 10,
  "Northern Middle East": 7,
  "East Asia": 6,
  "Central Africa": 6,
  "Southern Europe": 5,
  "Southeastern Africa": 5,
  "Southern Middle East": 5,
  "Western Europe": 4,
  "South America": 4,
  "Northern Europe": 4,
  "Western Africa": 3,
  "Southern Caribbean": 3,
  "Central Asia": 3,
  "North America": 3,
  "Southeast Asia": 3,
  "Northern Caribbean": 2,
  "Southern Africa": 2,
  "Western Oceania": 2,
  "Eastern Oceania": 1
};

const MAP_FEATURE_ALIASES = {
  "United States of America": "United States",
  "Czech Republic": "Czechia",
  "Guinea": "Rep. Guinea",
  "U.K. of Great Britain and Northern Ireland": "United Kingdom",
  "Russian Federation": "Russia",
  "Republic of Korea": "South Korea",
  "Democratic People's Republic of Korea": "North Korea",
  "Iran (Islamic Republic of)": "Iran",
  "Brunei Darussalam": "Brunei",
  "Côte d'Ivoire": "Cote d'Ivoire",
  "Libyan Arab Jamahiriya": "Libya",
  "The former Yugoslav Republic of Macedonia": "North Macedonia",
  "Democratic Republic of the Congo": "DR Congo",
  "Swaziland": "Eswatini",
  "Lao People's Democratic Republic": "Laos",
  "Moldova, Republic of": "Moldova",
  "Sudan": "The Sudan",
  "Syrian Arab Republic": "Syria",
  "United Republic of Tanzania": "Tanzania",
  "Cape Verde": "Cabo Verde",
  "Timor-Leste": "East Timor",
  "Niger": "The Niger",
  "Holy See": "Vatican City",
  "Micronesia (Federated States of)": "Micronesia",
  "Puerto Rico": "Puerto Rico & US Virgin Islands",
  "United States Virgin Islands": "Puerto Rico & US Virgin Islands",
  "Guam": "Mariana Islands",
  "Northern Mariana Islands": "Mariana Islands",
  "British Virgin Islands": "Anguilla & British Virgin Islands",
  "Anguilla": "Anguilla & British Virgin Islands",
  "Falkland Islands (Malvinas)": "Falkland Islands",
  "Pitcairn Island": "Pitcairn Islands",
  "Azores Islands": "Azores",
  "Madeira Islands": "Madeira",
  "Cook Islands": "Cook Islands, Niue, & Tokelau",
  "Niue": "Cook Islands, Niue, & Tokelau",
  "Tokelau": "Cook Islands, Niue, & Tokelau",
  "Guadeloupe": "Guadeloupe & Martinique",
  "Martinique": "Guadeloupe & Martinique",
  "Glorioso Islands": "Glorioso Islands & Mayotte",
  "Mayotte": "Glorioso Islands & Mayotte",
  "Reunion": "Reunion & Tromelin Island",
  "Heard Island and McDonald Islands": "Heard and McDonald Islands",
  "Cocos (Keeling) Islands": "Cocos Islands",
  "South Georgia & the South Sandwich Islands": "South Georgia and the South Sandwich Islands",
  "Antigua and Barb.": "Antigua and Barbuda",
  "Bosnia and Herz.": "Bosnia and Herzegovina",
  "Br. Indian Ocean Ter.": "British Indian Ocean Territory",
  "Cayman Is.": "Cayman Islands",
  "Central African Rep.": "Central African Republic",
  "Dem. Rep. Congo": "DR Congo",
  "Dominican Rep.": "Dominican Republic",
  "Eq. Guinea": "Equatorial Guinea",
  "Faeroe Is.": "Faroe Islands",
  "Falkland Is.": "Falkland Islands",
  "Fr. Polynesia": "French Polynesia",
  "Heard I. and McDonald Is.": "Heard and McDonald Islands",
  "Marshall Is.": "Marshall Islands",
  "Pitcairn Is.": "Pitcairn Islands",
  "S. Geo. and the Is.": "South Georgia and the South Sandwich Islands",
  "S. Sudan": "South Sudan",
  "Solomon Is.": "Solomon Islands",
  "St. Kitts and Nevis": "Saint Kitts and Nevis",
  "St. Vin. and Gren.": "Saint Vincent and the Grenadines",
  "São Tomé and Principe": "Sao Tome and Principe",
  "Turks and Caicos Is.": "Turks and Caicos Islands",
  "Vatican": "Vatican City"
};

let countries = [];
let countryByName = new Map();
let countryByNormalizedName = new Map();
let mapFeatures = [];
let mapFeaturesByRiskName = new Map();
let game = null;
let mapView = { x: 0, y: 0, width: 1000, height: 500 };
let globeView = { lon: 0, lat: 18, scale: 225 };
let moderatorGlobeView = { lon: 0, lat: 18, scale: 225 };
let mapDrag = null;
let moderatorMapDrag = null;
let suppressMapClick = false;
let suppressModeratorMapClick = false;
let selectedMapCountry = null;
let selectedModeratorMapCountry = null;
let onlineClient = null;
let onlineGameId = localStorage.getItem(ONLINE_GAME_ID_KEY) || "";
let onlineSaveTimer = null;
let onlineSaveInFlight = false;
let onlineSaveQueued = false;
let onlineRefreshTimer = null;
let onlineRefreshInFlight = false;
let lastOnlineStateText = "";
let pendingOnlineStateText = "";
let setupMode = false;
let sessionRole = localStorage.getItem(SESSION_ROLE_KEY) || "player";
let sessionPlayerId = localStorage.getItem(SESSION_PLAYER_KEY) || "";
let lastRenderedTurnPlayerId = "";
let promptedNuclearDecisionIds = new Set();
let manualLoadPromise = null;

const MAP_MIN_SCALE = 145;
const PLAYER_MAP_MAX_SCALE = 7200;
const MODERATOR_MAP_MAX_SCALE = 7200;
const MAP_ZOOM_STEP = 1.12;
const MAP_KEYBOARD_PAN_DEGREES = 12;

const NUCLEAR_POWERS = new Set([
  "United States",
  "China",
  "North Korea",
  "Pakistan",
  "India",
  "Israel",
  "United Kingdom",
  "France",
  "Russia"
]);

const GLOBAL_VISIBILITY_COUNTRIES = new Set(["United States", "China", "Russia", "India", "Japan"]);
const GLOBAL_VISIBILITY_COMBO = ["Germany", "Italy", "Czechia"];
const STRATEGIC_NUCLEAR_RETALIATORS = new Set(["United States", "Russia", "China", "United Kingdom", "France", "India", "Israel", "North Korea"]);

const CONDITIONAL_NUCLEAR_POWERS = {
  Belarus: "Russia",
  Germany: "United States",
  Turkey: "United States",
  Italy: "United States",
  Belgium: "United States",
  Netherlands: "United States"
};

const MAP_LABEL_POINTS = {
  Alaska: [-152, 64],
  France: [2.2, 46.4],
  Netherlands: [5.3, 52.2],
  Portugal: [-8.1, 39.6],
  Russia: [37.6, 55.8],
  "Russian Federation": [37.6, 55.8],
  "Saint Helena": [-5.72, -15.95]
};

const PLAYER_COLORS = [
  "#d6a23f",
  "#df6b57",
  "#4f9f7f",
  "#6d8fd7",
  "#c47ac0",
  "#d4874a",
  "#68a9c7",
  "#9aa152"
];

const ANTARCTICA_NAME = "Antarctica";
const ANTARCTICA_CONNECTIONS = new Set([
  "Argentina", "Australia", "Brazil", "Chile", "China", "Czechia", "France", "Germany", "India", "Italy",
  "Japan", "New Zealand", "Norway", "Poland", "Russia", "South Africa", "South Korea", "Ukraine",
  "United Kingdom", "United States", "Uruguay"
]);
const BIR_TAWIL_NAME = "Bir Tawil";
const BIR_TAWIL_CONNECTIONS = new Set(["The Sudan", "Egypt"]);
const SHARED_STAGING_CONFIG = {
  [ANTARCTICA_NAME]: {
    id: "antarctica",
    troopsKey: "antarcticaTroops",
    unclaimedKey: "antarcticaUnclaimed",
    connections: ANTARCTICA_CONNECTIONS
  },
  [BIR_TAWIL_NAME]: {
    id: "bir-tawil",
    troopsKey: "birTawilTroops",
    unclaimedKey: "birTawilUnclaimed",
    connections: BIR_TAWIL_CONNECTIONS
  }
};
const SHARED_STAGING_PLACES = Object.entries(SHARED_STAGING_CONFIG).map(([name, config]) => ({
  id: config.id,
  name,
  magnitude: "",
  region: "",
  network: "",
  land: [],
  maritime: []
}));

const $ = (id) => document.getElementById(id);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === "\"" && next === "\"") {
        cell += "\"";
        i += 1;
      } else if (ch === "\"") {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === "\"") {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const headers = rows.shift();
  return rows.filter((r) => r.length === headers.length).map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
}

function splitList(value) {
  return (value || "").split(";").map((v) => v.trim()).filter(Boolean);
}

function normalizedName(value) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

function circleFeature(name, lon, lat, radius = 0.35, points = 24) {
  const ring = [];
  for (let i = 0; i < points; i += 1) {
    const angle = (Math.PI * 2 * i) / points;
    ring.push([
      Number((lon + Math.cos(angle) * radius).toFixed(3)),
      Number((lat + Math.sin(angle) * radius).toFixed(3))
    ]);
  }
  ring.push(ring[0]);
  return {
    name,
    iso3: "",
    continent: "Africa",
    bbox: [lon - radius, lat - radius, lon + radius, lat + radius],
    parts: [ring]
  };
}

async function loadCountries() {
  const response = await fetch(DATA_URL);
  const csv = await response.text();
  countries = parseCsv(csv).map((row) => ({
    id: row.Object_ID,
    name: row.Name.trim(),
    magnitude: Number(row.Magnitude),
    region: row.Region.trim(),
    network: row.Network.trim(),
    land: splitList(row["Land Borders"]),
    maritime: splitList(row["Maritime Borders"])
  }));
  countryByName = new Map(countries.map((country) => [country.name, country]));
  countryByNormalizedName = new Map(countries.map((country) => [normalizedName(country.name), country]));
}

async function loadWorldMap() {
  const response = await fetch(MAP_URL);
  const data = await response.json();
  const features = [...data.features, circleFeature(BIR_TAWIL_NAME, 33.55, 21.87, 0.28)];
  mapFeatures = features.map((feature) => ({
    ...feature,
    riskName: riskNameForMapFeature(feature.name)
  }));
  mapFeaturesByRiskName = new Map();
  for (const feature of mapFeatures) {
    if (!feature.riskName) continue;
    if (!mapFeaturesByRiskName.has(feature.riskName)) mapFeaturesByRiskName.set(feature.riskName, []);
    mapFeaturesByRiskName.get(feature.riskName).push(feature);
  }
}

function riskNameForMapFeature(mapName) {
  if (mapName === ANTARCTICA_NAME) return ANTARCTICA_NAME;
  if (mapName === BIR_TAWIL_NAME) return BIR_TAWIL_NAME;
  const alias = MAP_FEATURE_ALIASES[mapName];
  if (alias && countryByName.has(alias)) return alias;
  return countryByNormalizedName.get(normalizedName(mapName))?.name || null;
}

function blankState() {
  return {
    players: [],
    ownership: {},
    troops: {},
    antarcticaTroops: {},
    antarcticaUnclaimed: 0,
    birTawilTroops: {},
    birTawilUnclaimed: 0,
    ownershipSince: {},
    round: 1,
    turnPointer: 0,
    snakeDirection: 1,
    phase: "setup",
    pendingTransfers: [],
    pendingNuclearRetaliations: [],
    log: [],
    nextId: 1,
    ownershipTick: 1,
    incomeCalculatedRound: 0,
    planningPlayerId: null,
    winnerId: null,
    turnStage: "attack",
    turnHadAction: false,
    consecutivePasses: [],
    regionControlAnnouncements: {},
    recruitPlans: {},
    turnHistory: [],
    timelineIndex: 0
  };
}

function activePlayers() {
  if (!game) return [];
  return game.players.filter((player) => !player.eliminated);
}

function winner() {
  if (!game?.winnerId) return null;
  return game.players.find((player) => player.id === game.winnerId) || null;
}

function recordTurnSnapshot(label) {
  if (!game) return;
  game.turnHistory ||= [];
  const ownership = {};
  const troops = {};
  for (const country of countries) {
    if (game.ownership[country.name]) ownership[country.name] = game.ownership[country.name];
    const count = countryTroops(country.name);
    if (count > 0) troops[country.name] = count;
  }
  game.turnHistory.push({
    label,
    round: game.round,
    ownership,
    troops,
    antarcticaTroops: { ...(game.antarcticaTroops || {}) },
    antarcticaUnclaimed: Number(game.antarcticaUnclaimed || 0),
    birTawilTroops: { ...(game.birTawilTroops || {}) },
    birTawilUnclaimed: Number(game.birTawilUnclaimed || 0)
  });
  game.timelineIndex = game.turnHistory.length - 1;
}

function ownedCountries(playerId) {
  return countries
    .filter((country) => game.ownership[country.name] === playerId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function playerName(playerId) {
  return game.players.find((player) => player.id === playerId)?.name || "Unowned";
}

function playerColor(playerId) {
  const index = game.players.findIndex((player) => player.id === playerId);
  return index >= 0 ? PLAYER_COLORS[index % PLAYER_COLORS.length] : "";
}

function countryTroops(name) {
  return Number(game.troops[name] || 0);
}

function capitalCountryFor(playerId) {
  if (!playerId) return null;
  return ownedCountries(playerId)
    .map((country) => ({ country, since: game.ownershipSince?.[country.name] || Infinity }))
    .sort((a, b) => a.since - b.since || a.country.name.localeCompare(b.country.name))[0]?.country || null;
}

function isCapitalCountry(countryName, playerId = game?.ownership?.[countryName]) {
  return Boolean(countryName && playerId && capitalCountryFor(playerId)?.name === countryName);
}

function attackDiceLimitFor(fromName, baseLimit) {
  return Math.max(1, Number(baseLimit || 0));
}

function attackKeptDiceMaxFor(fromName, baseLimit) {
  const troopLimited = Math.min(attackDiceLimitFor(fromName, baseLimit), countryTroops(fromName) - 1);
  return Math.max(0, troopLimited);
}

function defenderDiceFor(countryName) {
  const troopLimited = Math.min(2, countryTroops(countryName));
  return Math.max(0, troopLimited);
}

function rollCapitalAwareDice(countryName, keptDice) {
  const capital = isCapitalCountry(countryName);
  const raw = rollDice(Math.max(0, Number(keptDice || 0)) + (capital ? 1 : 0));
  const kept = capital ? raw.slice(0, Math.max(0, raw.length - 1)) : raw;
  const dropped = capital ? raw.slice(Math.max(0, raw.length - 1)) : [];
  return { raw, kept, dropped, capital };
}

function diceLogText(label, roll) {
  if (!roll.capital) return `${label} ${roll.kept.join(", ")}`;
  return `${label} ${roll.kept.join(", ")} (capital raw ${roll.raw.join(", ")}; dropped ${roll.dropped.join(", ")})`;
}

function isNuclearPower(countryName, ownerId = game?.ownership?.[countryName]) {
  if (NUCLEAR_POWERS.has(countryName)) return true;
  const requiredCountry = CONDITIONAL_NUCLEAR_POWERS[countryName];
  return Boolean(requiredCountry && ownerId && game.ownership[requiredCountry] === ownerId);
}

function visibleNuclearMarkerFor(countryName, playerId, visibility) {
  if (!countryName || !visibility || visibility === "Same region" || isSharedStaging(countryName)) return false;
  if (NUCLEAR_POWERS.has(countryName)) return true;
  const requiredCountry = CONDITIONAL_NUCLEAR_POWERS[countryName];
  if (!requiredCountry) return false;
  const ownerId = game.ownership[countryName];
  if (!ownerId) return false;
  if (ownerId === playerId) return game.ownership[requiredCountry] === playerId;
  return hasCompleteInfoAbout(playerId, requiredCountry)
    && game.ownership[requiredCountry] === ownerId;
}

function visibleSatelliteMarkerFor(countryName, playerId, visibility) {
  if (!countryName || !visibility || visibility === "Same region" || isSharedStaging(countryName)) return false;
  if (GLOBAL_VISIBILITY_COUNTRIES.has(countryName)) return true;
  if (!GLOBAL_VISIBILITY_COMBO.includes(countryName)) return false;
  const ownership = GLOBAL_VISIBILITY_COMBO.map((name) => ({ name, ownerId: game.ownership[name] || null }));
  const viewerOwned = ownership.filter((item) => item.ownerId === playerId);
  const unowned = ownership.filter((item) => !item.ownerId);
  if (viewerOwned.length === GLOBAL_VISIBILITY_COMBO.length) return true;
  if (viewerOwned.length === GLOBAL_VISIBILITY_COMBO.length - 1 && unowned.length === 1) {
    return countryName === unowned[0].name;
  }
  const ownerId = game.ownership[countryName];
  if (!ownerId || ownerId === playerId) return false;
  return GLOBAL_VISIBILITY_COMBO.every((name) => hasCompleteInfoAbout(playerId, name) && game.ownership[name] === ownerId);
}

function visibleIcbmMarkerFor(countryName, visibility) {
  return Boolean(countryName && visibility && visibility !== "Same region" && STRATEGIC_NUCLEAR_RETALIATORS.has(countryName));
}

function visibleCapabilityMarkers(country, visibility, playerId) {
  const markers = [];
  if (visibleNuclearMarkerFor(country.name, playerId, visibility)) markers.push("nuclear");
  if (visibleSatelliteMarkerFor(country.name, playerId, visibility)) markers.push("satellite");
  if (visibleIcbmMarkerFor(country.name, visibility)) markers.push("missile");
  return markers;
}

function isSharedStaging(name) {
  return Boolean(SHARED_STAGING_CONFIG[name]);
}

function isAntarctica(name) {
  return name === ANTARCTICA_NAME;
}

function placeByName(name) {
  return SHARED_STAGING_PLACES.find((place) => place.name === name) || countryByName.get(name);
}

function sharedStagingConfig(name) {
  return SHARED_STAGING_CONFIG[name] || null;
}

function sharedStagingTroops(name, playerId) {
  const config = sharedStagingConfig(name);
  return config ? Number(game[config.troopsKey]?.[playerId] || 0) : 0;
}

function totalSharedStagingTroops(name) {
  const config = sharedStagingConfig(name);
  if (!config) return 0;
  return Object.values(game[config.troopsKey] || {}).reduce((sum, value) => sum + Number(value || 0), Number(game[config.unclaimedKey] || 0));
}

function playerCanAccessSharedStaging(playerId, stagingName) {
  const config = sharedStagingConfig(stagingName);
  if (!config) return false;
  return ownedCountries(playerId).some((country) => config.connections.has(country.name));
}

function sharedStagingPlacesForPlayer(playerId) {
  return SHARED_STAGING_PLACES.filter((place) => playerCanAccessSharedStaging(playerId, place.name));
}

function antarcticaTroops(playerId) {
  return sharedStagingTroops(ANTARCTICA_NAME, playerId);
}

function totalAntarcticaTroops() {
  return totalSharedStagingTroops(ANTARCTICA_NAME);
}

function setCountryOwner(name, playerId) {
  if (game.ownership[name] !== playerId) {
    game.ownershipSince ||= {};
    game.ownershipTick ||= 1;
    game.ownershipSince[name] = game.ownershipTick++;
  }
  game.ownership[name] = playerId;
}

function removeCountryOwner(name) {
  delete game.ownership[name];
  game.troops[name] = 0;
}

function queuedOutgoingTroops(name) {
  return 0;
}

function movableTroops(name) {
  if (isSharedStaging(name)) return sharedStagingTroops(name, currentPlayer()?.id);
  return Math.max(0, countryTroops(name) - queuedOutgoingTroops(name) - 1);
}

function addLog(message) {
  const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  game.log.push({
    time: stamp,
    message,
    visibleTo: null
  });
}

function addPrivateLog(message, playerIds) {
  const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const visibleTo = [...new Set((playerIds || []).filter(Boolean))];
  game.log.push({
    time: stamp,
    message,
    visibleTo
  });
}

function logText(entry) {
  if (typeof entry === "string") return entry;
  return `${entry.time} - ${entry.message}`;
}

function canSeeLogEntry(entry) {
  if (typeof entry === "string") return true;
  if (!entry.visibleTo) return true;
  return entry.visibleTo.includes(sessionPlayerId);
}

function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startGame(names) {
  game = blankState();
  game.players = names.map((name, index) => ({
    id: `p${index + 1}`,
    name,
    carry: 0,
    nuclearRecruitPenaltyRemaining: 0,
    nuclearRecruitPenaltySource: "",
    reserve: 0,
    eliminated: false
  }));
  const starts = shuffled(countries).slice(0, game.players.length);
  game.players.forEach((player, index) => {
    const country = starts[index];
    setCountryOwner(country.name, player.id);
    game.troops[country.name] = 10;
    if (isNuclearPower(country.name, player.id)) {
      player.nuclearRecruitPenaltyRemaining = Math.max(0, country.magnitude || 0);
      player.nuclearRecruitPenaltySource = country.name;
    }
    addPrivateLog(`${player.name} starts in ${country.name} with 10 troops.`, [player.id]);
    if (player.nuclearRecruitPenaltyRemaining > 0) {
      addPrivateLog(`${player.name} starts on nuclear country ${country.name}; the first ${player.nuclearRecruitPenaltyRemaining} region bonus recruit${player.nuclearRecruitPenaltyRemaining === 1 ? "" : "s"} will be withheld.`, [player.id]);
    }
  });
  game.phase = "turn";
  game.incomeCalculatedRound = 1;
  game.turnStage = "attack";
  game.turnHadAction = false;
  game.consecutivePasses = [];
  addLog("Round 1 begins with action turns. Initial planning is skipped.");
  recordTurnSnapshot("Initial setup");
  resetMapView(false);
  saveGame();
  showTab("turn");
  render();
}

function saveGame() {
  saveLocalGame();
  queueOnlineSave();
}

function saveLocalGame() {
  if (game) localStorage.setItem(SAVE_KEY, JSON.stringify(game));
}

function recruitDraftKey(playerId = sessionPlayerId) {
  return `${RECRUIT_DRAFT_KEY_PREFIX}-${onlineGameId || "local"}-${game?.round || 0}-${playerId || "unknown"}`;
}

function loadRecruitDraft(playerId = sessionPlayerId) {
  try {
    return JSON.parse(localStorage.getItem(recruitDraftKey(playerId)) || "{}");
  } catch {
    return {};
  }
}

function saveRecruitDraft(draft, playerId = sessionPlayerId) {
  localStorage.setItem(recruitDraftKey(playerId), JSON.stringify(draft || {}));
}

function clearRecruitDraft(playerId = sessionPlayerId) {
  localStorage.removeItem(recruitDraftKey(playerId));
}

function recruitDraftTotal(draft) {
  return Object.values(draft || {}).reduce((sum, value) => sum + Number(value || 0), 0);
}

function normalizeLoadedGame() {
  if (!game) return;
  game.turnStage ||= "attack";
  game.turnHadAction = Boolean(game.turnHadAction);
  game.consecutivePasses ||= [];
  game.regionControlAnnouncements ||= {};
  game.recruitPlans ||= {};
  game.pendingTransfers ||= [];
  game.pendingNuclearRetaliations ||= [];
  game.antarcticaTroops ||= {};
  game.antarcticaUnclaimed ||= 0;
  game.birTawilTroops ||= {};
  game.birTawilUnclaimed ||= 0;
  game.ownershipSince ||= {};
  game.ownershipTick ||= 1;
  game.planningPlayerId ||= null;
  game.turnHistory ||= [];
  game.timelineIndex = Number(game.timelineIndex || 0);
  for (const player of game.players || []) {
    player.nuclearRecruitPenaltyRemaining = Number(player.nuclearRecruitPenaltyRemaining || 0);
    player.nuclearRecruitPenaltySource ||= "";
  }
  for (const country of countries) {
    if (game.ownership[country.name] && !game.ownershipSince[country.name]) {
      game.ownershipSince[country.name] = game.ownershipTick++;
    }
  }
}

function loadSavedGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return;
  try {
    game = JSON.parse(saved);
    normalizeLoadedGame();
  } catch {
    game = null;
  }
}

function onlineTableName() {
  return window.SUPABASE_CONFIG?.tableName || "games";
}

function onlineStateColumn() {
  return window.SUPABASE_CONFIG?.stateColumn || "state";
}

function onlineShortIdColumn() {
  return window.SUPABASE_CONFIG?.shortIdColumn || "short_id";
}

function onlineConfigured() {
  return Boolean(window.SUPABASE_CONFIG?.url && window.SUPABASE_CONFIG?.anonKey && window.supabase);
}

function supabaseBaseUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.pathname = "";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

function setOnlineStatus(message) {
  const status = $("onlineStatus");
  if (status) status.textContent = message;
}

function onlineTimestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function initOnlineClient() {
  if (!onlineConfigured()) {
    setOnlineStatus("Paste your Supabase URL and anon key into supabase-config.js to connect online saving.");
    return;
  }
  onlineClient = window.supabase.createClient(supabaseBaseUrl(window.SUPABASE_CONFIG.url), window.SUPABASE_CONFIG.anonKey);
  if ($("onlineGameId")) $("onlineGameId").value = onlineGameId;
  setOnlineStatus(onlineGameId ? `Connected to Supabase. Current online game: ${onlineGameId}` : "Connected to Supabase. Create or load an online game.");
}

function rememberOnlineGameId(id) {
  onlineGameId = id || "";
  if (onlineGameId) localStorage.setItem(ONLINE_GAME_ID_KEY, onlineGameId);
  else localStorage.removeItem(ONLINE_GAME_ID_KEY);
  if ($("onlineGameId")) $("onlineGameId").value = onlineGameId;
  if ($("activeOnlineGameId")) $("activeOnlineGameId").value = onlineGameId;
}

function gameStateText(state = game) {
  try {
    return JSON.stringify(state || null);
  } catch {
    return "";
  }
}

function isEditingGameControl() {
  const active = document.activeElement;
  return Boolean(active && active.closest("#gameView") && active.matches("input, select, textarea"));
}

function generateShortGameId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";
  for (let index = 0; index < 6; index += 1) {
    value += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return value;
}

function updateJoinRoleFields() {
  $("joinPlayerNameLabel")?.classList.remove("hidden");
}

function queueOnlineSave() {
  if (!onlineClient || !onlineGameId || !game) return;
  clearTimeout(onlineSaveTimer);
  setOnlineStatus(`Unsaved online changes for ${onlineGameId}. Saving soon...`);
  onlineSaveTimer = setTimeout(() => {
    saveOnlineGame({ quiet: true });
  }, 500);
}

async function createOnlineGame() {
  if (!onlineClient) {
    alert("Supabase is not connected yet. Paste your project URL and anon key into supabase-config.js first.");
    return;
  }
  if (!game) {
    alert("Start a game first, then create an online save for it.");
    return;
  }
  const stateColumn = onlineStateColumn();
  const shortIdColumn = onlineShortIdColumn();
  const gameName = `Risk game - ${new Date().toLocaleString()}`;
  const shortId = generateShortGameId();
  const { data, error } = await onlineClient
    .from(onlineTableName())
    .insert({ name: gameName, [stateColumn]: game, [shortIdColumn]: shortId })
    .select(`id, ${shortIdColumn}`)
    .single();
  if (error) {
    alert(`Supabase could not create the online game: ${error.message}`);
    setOnlineStatus("Online save failed.");
    return;
  }
  rememberOnlineGameId(data[shortIdColumn] || data.id);
  lastOnlineStateText = gameStateText();
  startOnlineRefresh();
  setOnlineStatus(`Online game created. Share this ID: ${onlineGameId}`);
}

async function loadOnlineGame(id) {
  if (!onlineClient) {
    alert("Supabase is not connected yet. Paste your project URL and anon key into supabase-config.js first.");
    return;
  }
  const requestedId = (id || $("onlineGameId")?.value || "").trim();
  if (!requestedId) {
    alert("Paste an online game ID first.");
    return;
  }
  const stateColumn = onlineStateColumn();
  const shortIdColumn = onlineShortIdColumn();
  let { data, error } = await onlineClient
    .from(onlineTableName())
    .select(`${stateColumn}, id, ${shortIdColumn}`)
    .eq(shortIdColumn, requestedId.toUpperCase())
    .maybeSingle();
  if (error || !data) {
    const fallback = await onlineClient
      .from(onlineTableName())
      .select(`${stateColumn}, id, ${shortIdColumn}`)
      .eq("id", requestedId)
      .single();
    data = fallback.data;
    error = fallback.error;
  }
  if (error) {
    alert(`Supabase could not load that game: ${error.message}`);
    setOnlineStatus("Online load failed.");
    return;
  }
  game = data[stateColumn];
  normalizeLoadedGame();
  const requestedName = ($("joinPlayerName")?.value || "").trim().toLowerCase();
  const player = game.players.find((candidate) => candidate.name.toLowerCase() === requestedName);
  if (!player) {
    const names = game.players.map((candidate) => candidate.name).join(", ");
    game = null;
    alert(`That player name was not found. Available players: ${names}`);
    render();
    return;
  }
  setSession("player", player.id);
  setupMode = false;
  rememberOnlineGameId(data[shortIdColumn] || requestedId);
  resetMapView(false);
  saveLocalGame();
  lastOnlineStateText = gameStateText();
  startOnlineRefresh();
  setOnlineStatus(`Loaded latest online game ${requestedId} at ${onlineTimestamp()}.`);
  render();
}

async function refreshOnlineGame({ forceRender = false } = {}) {
  if (!onlineClient || !onlineGameId || !game || onlineSaveInFlight || onlineRefreshInFlight) return;
  onlineRefreshInFlight = true;
  const stateColumn = onlineStateColumn();
  const shortIdColumn = onlineShortIdColumn();
  let { data, error } = await onlineClient
    .from(onlineTableName())
    .select(`${stateColumn}, id, ${shortIdColumn}`)
    .eq(shortIdColumn, onlineGameId.toUpperCase())
    .maybeSingle();
  if (error || !data) {
    const fallback = await onlineClient
      .from(onlineTableName())
      .select(`${stateColumn}, id, ${shortIdColumn}`)
      .eq("id", onlineGameId)
      .single();
    data = fallback.data;
    error = fallback.error;
  }
  onlineRefreshInFlight = false;
  if (error || !data?.[stateColumn]) return;
  const nextStateText = gameStateText(data[stateColumn]);
  if (nextStateText === lastOnlineStateText || nextStateText === gameStateText()) {
    lastOnlineStateText = nextStateText;
    return;
  }
  if (!forceRender && isEditingGameControl()) {
    pendingOnlineStateText = nextStateText;
    setOnlineStatus("Online updates are available. Press Refresh when you are ready.");
    return;
  }
  const previousTurnId = currentPlayer()?.id || "";
  const previousPhase = game.phase;
  const previousPlanningId = game.planningPlayerId || "";
  game = data[stateColumn];
  normalizeLoadedGame();
  lastOnlineStateText = gameStateText();
  pendingOnlineStateText = "";
  if (game) localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  const nextTurnId = currentPlayer()?.id || "";
  if (previousTurnId !== nextTurnId || previousPhase !== game.phase || previousPlanningId !== (game.planningPlayerId || "")) {
    resetMapView(false, game.phase === "planning" ? planningMapPlayer() : visibleSessionPlayer());
  }
  render();
}

async function loadLatestOnlineStateForMerge() {
  if (!onlineClient || !onlineGameId) return false;
  const stateColumn = onlineStateColumn();
  const shortIdColumn = onlineShortIdColumn();
  let { data, error } = await onlineClient
    .from(onlineTableName())
    .select(`${stateColumn}, id, ${shortIdColumn}`)
    .eq(shortIdColumn, onlineGameId.toUpperCase())
    .maybeSingle();
  if (error || !data) {
    const fallback = await onlineClient
      .from(onlineTableName())
      .select(`${stateColumn}, id, ${shortIdColumn}`)
      .eq("id", onlineGameId)
      .single();
    data = fallback.data;
    error = fallback.error;
  }
  if (error || !data?.[stateColumn]) return false;
  game = data[stateColumn];
  normalizeLoadedGame();
  lastOnlineStateText = gameStateText();
  saveLocalGame();
  return true;
}

function startOnlineRefresh() {
  if (onlineRefreshTimer) return;
  onlineRefreshTimer = setInterval(refreshOnlineGame, 20000);
}

function stopOnlineRefresh() {
  if (!onlineRefreshTimer) return;
  clearInterval(onlineRefreshTimer);
  onlineRefreshTimer = null;
}

async function saveOnlineGame(options = {}) {
  if (!onlineClient || !onlineGameId || !game) return;
  if (onlineSaveInFlight) {
    onlineSaveQueued = true;
    return;
  }
  onlineSaveInFlight = true;
  setOnlineStatus(`Saving online game ${onlineGameId}...`);
  const stateColumn = onlineStateColumn();
  const shortIdColumn = onlineShortIdColumn();
  let { error } = await onlineClient
    .from(onlineTableName())
    .update({ [stateColumn]: game })
    .eq(shortIdColumn, onlineGameId.toUpperCase());
  if (error) {
    const fallback = await onlineClient
      .from(onlineTableName())
      .update({ [stateColumn]: game })
      .eq("id", onlineGameId);
    error = fallback.error;
  }
  onlineSaveInFlight = false;
  if (error) {
    if (!options.quiet) alert(`Supabase could not save the online game: ${error.message}`);
    setOnlineStatus("Online save failed.");
    return;
  }
  lastOnlineStateText = gameStateText();
  setOnlineStatus(`Saved online game ${onlineGameId} at ${onlineTimestamp()}.`);
  if (onlineSaveQueued) {
    onlineSaveQueued = false;
    queueOnlineSave();
  }
}

function connectedNeighbors(country, includeType = "all") {
  const links = [];
  if (includeType === "all" || includeType === "land") {
    country.land.forEach((name) => links.push({ name, type: "land" }));
  }
  if (includeType === "all" || includeType === "maritime") {
    country.maritime.forEach((name) => links.push({ name, type: "maritime" }));
  }
  if (includeType === "all" && country.network) {
    countries
      .filter((other) => other.name !== country.name && other.network === country.network)
      .forEach((other) => links.push({ name: other.name, type: "network" }));
  }
  return links;
}

function hasOwnedTransferPath(playerId, fromName, toName) {
  if (isSharedStaging(fromName)) {
    return Boolean(sharedStagingConfig(fromName)?.connections.has(toName) && game.ownership[toName] === playerId);
  }
  if (isSharedStaging(toName)) {
    return Boolean(sharedStagingConfig(toName)?.connections.has(fromName) && game.ownership[fromName] === playerId);
  }
  if (fromName === toName) return true;
  const seen = new Set([fromName]);
  const queue = [fromName];
  while (queue.length) {
    const name = queue.shift();
    const country = countryByName.get(name);
    for (const link of connectedNeighbors(country, "all")) {
      if (seen.has(link.name)) continue;
      if (game.ownership[link.name] !== playerId) continue;
      if (link.name === toName) return true;
      seen.add(link.name);
      queue.push(link.name);
    }
  }
  return false;
}

function attackOptionsFor(fromName) {
  const from = countryByName.get(fromName);
  const owner = game.ownership[fromName];
  if (!from || !owner) return [];
  const options = new Map();
  const visibleLinks = new Map(connectedNeighbors(from, "all").map((link) => [link.name, link.type]));
  for (const border of from.land) {
    if (game.ownership[border] && game.ownership[border] !== owner) {
      options.set(border, { target: border, type: "land", maxDice: attackDiceLimitFor(fromName, 3) });
    }
  }
  for (const border of from.maritime) {
    if (game.ownership[border] && game.ownership[border] !== owner) {
      const existing = options.get(border);
      const maxDice = attackDiceLimitFor(fromName, 2);
      if (!existing || existing.maxDice > maxDice) options.set(border, { target: border, type: "maritime", maxDice });
    }
  }
  for (const country of countries) {
    if (country.name !== from.name && country.region === from.region && game.ownership[country.name] !== owner) {
      const linkType = visibleLinks.get(country.name);
      if (linkType && linkType !== "network") continue;
      if (linkType === "network" && game.ownership[country.name]) {
        options.set(country.name, { target: country.name, type: "network region", maxDice: attackDiceLimitFor(fromName, 1) });
        continue;
      }
      if (!options.has(country.name)) {
        options.set(country.name, { target: country.name, type: "limited region", maxDice: attackDiceLimitFor(fromName, 1), limited: true });
      }
    }
  }
  return [...options.values()].sort((a, b) => a.target.localeCompare(b.target));
}

function hasCompleteInfoAbout(playerId, countryName) {
  return visibleCountriesFor(playerId).some(({ country, visibility }) => country.name === countryName && visibility !== "Same region");
}

function viableAttackOptionsFor(fromName) {
  const playerId = game.ownership[fromName];
  if (countryTroops(fromName) <= 1) return [];
  return attackOptionsFor(fromName).filter((option) => {
    const targetOwner = game.ownership[option.target];
    if (targetOwner) return true;
    if (!hasCompleteInfoAbout(playerId, option.target)) return true;
    const minimumMove = Math.max(1, countryByName.get(option.target)?.magnitude || 0);
    return countryTroops(fromName) - 1 >= minimumMove;
  });
}

function claimOptionsFor(fromName) {
  const from = countryByName.get(fromName);
  if (!from) return [];
  return [...new Set([...from.land, ...from.maritime])]
    .filter((name) => !game.ownership[name])
    .filter((name) => movableTroops(fromName) >= Math.max(1, countryByName.get(name)?.magnitude || 0))
    .sort((a, b) => a.localeCompare(b));
}

function controlledRegions(playerId) {
  const regions = [...new Set(countries.map((country) => country.region))];
  return regions.filter((region) => {
    const members = countries.filter((country) => country.region === region);
    return members.every((country) => game.ownership[country.name] === playerId);
  });
}

function refreshRegionControlAnnouncements() {
  game.regionControlAnnouncements ||= {};
  const current = new Set();
  for (const player of activePlayers()) {
    for (const region of controlledRegions(player.id)) {
      current.add(`${player.id}|${region}`);
    }
  }
  for (const key of Object.keys(game.regionControlAnnouncements)) {
    if (!current.has(key)) {
      const [playerId, region] = key.split("|");
      const player = game.players.find((candidate) => candidate.id === playerId);
      if (player && region) {
        addPrivateLog(`${player.name} no longer controls all countries in ${region}.`, [player.id]);
      }
      delete game.regionControlAnnouncements[key];
    }
  }
}

function announceNewRegionControls(playerId) {
  game.regionControlAnnouncements ||= {};
  refreshRegionControlAnnouncements();
  const player = game.players.find((candidate) => candidate.id === playerId);
  for (const region of controlledRegions(playerId)) {
    const key = `${playerId}|${region}`;
    if (game.regionControlAnnouncements[key]) continue;
    game.regionControlAnnouncements[key] = true;
    addPrivateLog(`${player.name} now controls all countries in ${region}.`, [player.id]);
  }
}

function calculateRecruits() {
  if (game.phase === "gameover" || game.incomeCalculatedRound === game.round) return 0;
  let totalAwarded = 0;
  for (const player of activePlayers()) {
    const magnitudeSum = ownedCountries(player.id).reduce((sum, country) => sum + country.magnitude, 0);
    const raw = magnitudeSum / 25 + player.carry;
    const base = Math.floor(raw);
    player.carry = Number((raw - base).toFixed(8));
    const regions = controlledRegions(player.id);
    const bonus = regions.reduce((sum, region) => sum + (REGION_BONUSES[region] || 0), 0);
    const penaltyBefore = Math.max(0, Number(player.nuclearRecruitPenaltyRemaining || 0));
    const withheld = Math.min(bonus, penaltyBefore);
    const awardedBonus = bonus - withheld;
    player.nuclearRecruitPenaltyRemaining = penaltyBefore - withheld;
    player.reserve += base + awardedBonus;
    totalAwarded += base + awardedBonus;
    const penaltyText = withheld > 0
      ? ` ${withheld} region bonus recruit${withheld === 1 ? "" : "s"} withheld for nuclear penalties${player.nuclearRecruitPenaltySource ? ` (${player.nuclearRecruitPenaltySource})` : ""}; ${player.nuclearRecruitPenaltyRemaining} penalty remaining.`
      : "";
    addPrivateLog(`${player.name} receives ${base} recruits from magnitude, ${awardedBonus}/${bonus} from regions, and carries ${player.carry.toFixed(2)}.${penaltyText}`, [player.id]);
  }
  game.incomeCalculatedRound = game.round;
  return totalAwarded;
}

function startNewRound(reason) {
  game.round += 1;
  game.pendingTransfers = [];
  game.turnHadAction = false;
  game.consecutivePasses = [];
  const totalAwarded = calculateRecruits();
  addLog(`${reason}; round ${game.round} begins.`);
  if (totalAwarded > 0) {
    game.phase = "planning";
    game.planningPlayerId = null;
    game.recruitPlans = {};
    resetMapView(false, planningMapPlayer());
    showTab(preferredOpenTab());
  } else {
    game.phase = "turn";
    game.planningPlayerId = null;
    game.turnStage = "attack";
    addLog(`No recruits are available for round ${game.round}; recruit placement is skipped.`);
    showTab("turn");
  }
}

function startNewRoundAfterRoll(remaining) {
  startNewRound(`Round-end roll: 1/${remaining}. The round ends`);
}

function markTurnAction() {
  game.turnHadAction = true;
}

function turnPassTriggersNewRound(playerId) {
  const activeIds = new Set(activePlayers().map((player) => player.id));
  game.consecutivePasses = (game.consecutivePasses || []).filter((id) => activeIds.has(id));
  if (game.turnHadAction) {
    game.consecutivePasses = [];
    game.turnHadAction = false;
    return false;
  }
  game.consecutivePasses = game.consecutivePasses.filter((id) => id !== playerId);
  game.consecutivePasses.push(playerId);
  return game.consecutivePasses.length >= activeIds.size;
}

function currentPlayer() {
  if (!game) return null;
  if (game.phase === "gameover") return null;
  const players = activePlayers();
  if (!players.length) return null;
  game.turnPointer = Math.min(game.turnPointer, players.length - 1);
  return players[game.turnPointer];
}

function sessionPlayer() {
  if (!game || sessionRole !== "player") return null;
  return game.players.find((player) => player.id === sessionPlayerId) || null;
}

function visibleSessionPlayer() {
  return sessionPlayer() || currentPlayer();
}

function planningMapPlayer() {
  return sessionPlayer() || currentPlanningPlayer() || currentPlayer();
}

function isPlayerSession() {
  return sessionRole === "player";
}

function playerSessionCanAct() {
  if (!isPlayerSession()) return true;
  return game?.phase === "turn" && currentPlayer()?.id === sessionPlayerId;
}

function setSession(role, playerId = "") {
  sessionRole = "player";
  sessionPlayerId = playerId;
  localStorage.setItem(SESSION_ROLE_KEY, sessionRole);
  if (sessionPlayerId) localStorage.setItem(SESSION_PLAYER_KEY, sessionPlayerId);
  else localStorage.removeItem(SESSION_PLAYER_KEY);
}

function setTurnPointerToPlayer(playerId) {
  const players = activePlayers();
  const index = players.findIndex((player) => player.id === playerId);
  if (index >= 0) game.turnPointer = index;
}

function advanceTurn() {
  const players = activePlayers();
  if (players.length <= 1) return;
  if (game.snakeDirection === 1) {
    if (game.turnPointer >= players.length - 1) {
      game.snakeDirection = -1;
      game.turnPointer = players.length - 1;
    } else {
      game.turnPointer += 1;
    }
  } else if (game.turnPointer <= 0) {
    game.snakeDirection = 1;
    game.turnPointer = 0;
  } else {
    game.turnPointer -= 1;
  }
}

function nextTurnAfterForfeit(playerId) {
  const players = activePlayers();
  const index = players.findIndex((player) => player.id === playerId);
  if (index < 0 || players.length <= 1) return null;
  let nextIndex = index;
  let nextDirection = game.snakeDirection;
  if (game.snakeDirection === 1) {
    if (index >= players.length - 1) {
      nextDirection = -1;
      nextIndex = index - 1;
    } else {
      nextIndex = index + 1;
    }
  } else if (index <= 0) {
    nextDirection = 1;
    nextIndex = index + 1;
  } else {
    nextIndex = index - 1;
  }
  const nextPlayer = players[nextIndex] || null;
  return nextPlayer ? { playerId: nextPlayer.id, direction: nextDirection } : null;
}

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function rollDice(count) {
  return Array.from({ length: count }, rollDie).sort((a, b) => b - a);
}

function checkEliminations() {
  const turnPlayerId = currentPlayer()?.id;
  for (const player of game.players) {
    if (player.eliminated) continue;
    const owned = ownedCountries(player.id);
    const troops = owned.reduce((sum, country) => sum + countryTroops(country.name), 0);
    if (owned.length === 0 || troops === 0) {
      for (const place of SHARED_STAGING_PLACES) {
        const config = sharedStagingConfig(place.name);
        const stranded = sharedStagingTroops(place.name, player.id);
        if (stranded > 0) {
          game[config.unclaimedKey] = Number(game[config.unclaimedKey] || 0) + stranded;
          game[config.troopsKey][player.id] = 0;
        }
      }
      player.eliminated = true;
      player.reserve = 0;
      game.pendingNuclearRetaliations = (game.pendingNuclearRetaliations || []).filter((pending) => pending.actorId !== player.id);
      addPrivateLog(`${player.name} is eliminated.`, [player.id]);
    }
  }
  resolveSharedStagingUnclaimedTroops();
  const gameEnded = concludeGameIfWon();
  if (!gameEnded && turnPlayerId && activePlayers().some((player) => player.id === turnPlayerId)) {
    setTurnPointerToPlayer(turnPlayerId);
  }
}

function forfeitCurrentSessionPlayer() {
  const player = sessionPlayer();
  if (!game || !player || player.eliminated) {
    alert("There is no active player to forfeit.");
    return;
  }
  if (!confirm(`${player.name}, forfeit this game? Your troops outside shared staging territories will be removed.`)) return;

  const currentTurnPlayerId = currentPlayer()?.id || null;
  const nextTurn = currentTurnPlayerId === player.id ? nextTurnAfterForfeit(player.id) : null;
  for (const country of ownedCountries(player.id)) {
    removeCountryOwner(country.name);
  }
  player.eliminated = true;
  player.reserve = 0;
  game.pendingTransfers = (game.pendingTransfers || []).filter((transfer) => transfer.playerId !== player.id);
  game.pendingNuclearRetaliations = (game.pendingNuclearRetaliations || []).filter((pending) => pending.defenderId !== player.id && pending.actorId !== player.id);
  game.consecutivePasses = (game.consecutivePasses || []).filter((id) => id !== player.id);
  addPrivateLog(`${player.name} forfeits the game. Troops outside shared staging territories are removed.`, [player.id]);
  refreshRegionControlAnnouncements();

  if (!concludeGameIfWon()) {
    if (game.phase === "planning" && allRecruitsPlaced()) {
      resolvePlanning();
      return;
    }
    if (game.phase === "turn") {
      game.turnStage = "attack";
      game.turnHadAction = false;
      if (nextTurn) {
        game.snakeDirection = nextTurn.direction;
        setTurnPointerToPlayer(nextTurn.playerId);
      } else if (currentTurnPlayerId && activePlayers().some((active) => active.id === currentTurnPlayerId)) {
        setTurnPointerToPlayer(currentTurnPlayerId);
      } else {
        game.turnPointer = Math.min(game.turnPointer, Math.max(0, activePlayers().length - 1));
      }
    }
  }

  saveGame();
  render();
}

function nuclearRetaliationGeographyRank(country, sourceCountry) {
  if (!sourceCountry) return 3;
  const landLinked = sourceCountry.land.includes(country.name) || country.land.includes(sourceCountry.name);
  if (landLinked) return 0;
  const maritimeLinked = sourceCountry.maritime.includes(country.name) || country.maritime.includes(sourceCountry.name);
  if (maritimeLinked) return 1;
  if (sourceCountry.region && country.region === sourceCountry.region) return 2;
  return 3;
}

function isNormallyStrikeableFrom(sourceCountry, targetCountry) {
  if (!sourceCountry || !targetCountry) return false;
  const landLinked = sourceCountry.land.includes(targetCountry.name) || targetCountry.land.includes(sourceCountry.name);
  const maritimeLinked = sourceCountry.maritime.includes(targetCountry.name) || targetCountry.maritime.includes(sourceCountry.name);
  const sameRegion = sourceCountry.region && sourceCountry.region === targetCountry.region;
  return landLinked || maritimeLinked || sameRegion;
}

function sourceCountryVisibilityNames(sourceCountry) {
  if (!sourceCountry) return new Set();
  const names = new Set([sourceCountry.name]);
  for (const link of connectedNeighbors(sourceCountry, "all")) names.add(link.name);
  for (const country of countries) {
    if (country.region === sourceCountry.region) names.add(country.name);
  }
  return names;
}

function strikeableNuclearTargets({ sourceName, targetPlayerId, retaliatorPlayerId = null, excludeCountry = null }) {
  const sourceCountry = countryByName.get(sourceName);
  if (!sourceCountry || !targetPlayerId) return [];
  let allowedNames = null;
  if (STRATEGIC_NUCLEAR_RETALIATORS.has(sourceName)) {
    allowedNames = retaliatorPlayerId
      ? new Set(visibleCountriesFor(retaliatorPlayerId).map(({ country }) => country.name))
      : sourceCountryVisibilityNames(sourceCountry);
    for (const name of sourceCountryVisibilityNames(sourceCountry)) allowedNames.add(name);
    if (GLOBAL_VISIBILITY_COUNTRIES.has(sourceName)) {
      for (const country of countries) allowedNames.add(country.name);
    }
  }
  return ownedCountries(targetPlayerId)
    .filter((country) => country.name !== excludeCountry && countryTroops(country.name) > 0)
    .filter((country) => allowedNames ? allowedNames.has(country.name) : isNormallyStrikeableFrom(sourceCountry, country))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function nuclearCounterSourceSnapshot(sourceName, fromPlayerId, targetPlayerId, excludeCountry = null) {
  return {
    name: sourceName,
    strikeableTargets: strikeableNuclearTargets({
      sourceName,
      targetPlayerId,
      retaliatorPlayerId: fromPlayerId,
      excludeCountry
    }).map((country) => country.name)
  };
}

function nuclearLossOrder(playerId, excludeCountry = null, sourceCountryName = null) {
  const sourceCountry = sourceCountryName ? countryByName.get(sourceCountryName) : null;
  const strikeable = new Set(strikeableNuclearTargets({ sourceName: sourceCountryName, targetPlayerId: playerId, excludeCountry }).map((country) => country.name));
  return ownedCountries(playerId)
    .filter((country) => country.name !== excludeCountry && countryTroops(country.name) > 0)
    .filter((country) => !sourceCountryName || strikeable.has(country.name))
    .map((country) => ({
      country,
      nuclear: isNuclearPower(country.name, playerId),
      troops: countryTroops(country.name),
      since: game.ownershipSince?.[country.name] || Infinity,
      geographyRank: nuclearRetaliationGeographyRank(country, sourceCountry)
    }))
    .sort((a, b) => {
      if (a.geographyRank !== b.geographyRank) return a.geographyRank - b.geographyRank;
      if (a.nuclear !== b.nuclear) return a.nuclear ? 1 : -1;
      const magnitudeDifference = b.country.magnitude - a.country.magnitude;
      if (magnitudeDifference) return magnitudeDifference;
      const troopDifference = a.troops - b.troops;
      if (troopDifference) return troopDifference;
      return a.since - b.since;
    });
}

function applyOrderedTroopLoss(playerId, amount, excludeCountry = null, sourceCountryName = null, counterTargetPlayerId = null) {
  let remaining = Math.max(0, amount);
  const losses = [];
  const nuclearSources = [];
  for (const { country, nuclear } of nuclearLossOrder(playerId, excludeCountry, sourceCountryName)) {
    if (remaining <= 0) break;
    const available = countryTroops(country.name);
    const loss = Math.min(available, remaining);
    const counterSource = nuclear && loss > 0 && counterTargetPlayerId
      ? nuclearCounterSourceSnapshot(country.name, playerId, counterTargetPlayerId)
      : null;
    game.troops[country.name] = available - loss;
    remaining -= loss;
    losses.push(`${loss} from ${country.name}`);
    if (counterSource) nuclearSources.push(counterSource);
    if (countryTroops(country.name) <= 0) {
      removeCountryOwner(country.name);
      losses[losses.length - 1] += " (lost)";
    }
  }
  return { prescribed: amount, lost: amount - remaining, remaining, losses, nuclearSources };
}

function describeLossResult(result) {
  if (!result.lost) return "no troops available";
  return result.losses.join("; ");
}

function applySpecificCountryTroopLoss(countryName, amount) {
  const country = countryByName.get(countryName);
  if (!country || amount <= 0 || countryTroops(countryName) <= 0) {
    return { prescribed: amount, lost: 0, remaining: amount, losses: [] };
  }
  const available = countryTroops(countryName);
  const loss = Math.min(available, amount);
  game.troops[countryName] = available - loss;
  const losses = [`${loss} from ${countryName}`];
  if (countryTroops(countryName) <= 0) {
    removeCountryOwner(countryName);
    losses[0] += " (lost)";
  }
  return { prescribed: amount, lost: loss, remaining: amount - loss, losses };
}

function applyNuclearStrike({ sourceName, fromPlayerId, targetPlayerId, strikeableTargets = null, automatic = false, optionalPlayerId = null, depth = 0 }) {
  if (depth > 30 || !fromPlayerId || !targetPlayerId || fromPlayerId === targetPlayerId) return;
  const sourceCountry = countryByName.get(sourceName);
  const sourcePlayer = game.players.find((player) => player.id === fromPlayerId);
  const targetPlayer = game.players.find((player) => player.id === targetPlayerId);
  if (!sourceCountry || !sourcePlayer || !targetPlayer || targetPlayer.eliminated) return;
  if (automatic) {
    executeNuclearRetaliation({
      targetName: sourceName,
      actorId: targetPlayerId,
      defenderId: fromPlayerId,
      action: "is counter-retaliated against by"
    });
    return;
  }
  queueNuclearRetaliationDecision({
    targetName: sourceName,
    actorId: targetPlayerId,
    defenderId: fromPlayerId,
    action: "is counter-retaliated against by",
    strikeableTargets
  });
}

function applyNuclearRetaliation({ targetName, actorId, defenderId = null, excludeCountry = null, action = "targets" }) {
  const targetCountry = countryByName.get(targetName);
  if (!targetCountry || !isNuclearPower(targetName, defenderId || game.ownership[targetName])) return;
  const actor = game.players.find((player) => player.id === actorId);
  const defender = game.players.find((player) => player.id === defenderId);
  if (!actor) return;
  if (defenderId && defenderId !== actorId && defender) {
    queueNuclearRetaliationDecision({ targetName, actorId, defenderId, excludeCountry, action });
    return;
  }
  executeNuclearRetaliation({ targetName, actorId, defenderId, excludeCountry, action });
}

function queueNuclearRetaliationDecision({ targetName, actorId, defenderId, excludeCountry = null, action = "targets", strikeableTargets = null }) {
  game.pendingNuclearRetaliations ||= [];
  const duplicate = game.pendingNuclearRetaliations.some((pending) => (
    pending.targetName === targetName
    && pending.actorId === actorId
    && pending.defenderId === defenderId
    && pending.round === game.round
  ));
  if (duplicate) return;
  const actor = game.players.find((player) => player.id === actorId);
  const defender = game.players.find((player) => player.id === defenderId);
  const targetNames = strikeableTargets || strikeableNuclearTargets({ sourceName: targetName, targetPlayerId: actorId, retaliatorPlayerId: defenderId, excludeCountry }).map((country) => country.name);
  if (!targetNames.length) {
    addPrivateLog(`${defender?.name || "Defender"}'s retaliation from ${targetName} is skipped because there are no attacking options.`, [defenderId, actorId]);
    return;
  }
  game.pendingNuclearRetaliations.push({
    id: `nuke-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    targetName,
    actorId,
    defenderId,
    excludeCountry,
    action,
    strikeableTargets: targetNames,
    round: game.round
  });
  addPrivateLog(`${defender?.name || "Defender"} may choose whether to retaliate from nuclear power ${targetName} against ${actor?.name || "the attacker"}.`, [defenderId, actorId]);
}

function executeNuclearRetaliation({ targetName, actorId, defenderId = null, excludeCountry = null, action = "targets" }) {
  const targetCountry = countryByName.get(targetName);
  if (!targetCountry || !isNuclearPower(targetName, defenderId || game.ownership[targetName])) return;
  const actor = game.players.find((player) => player.id === actorId);
  if (!actor) return;
  const amount = Math.max(0, targetCountry.magnitude || 0);
  const result = applyOrderedTroopLoss(actorId, amount, excludeCountry, targetName, defenderId);
  addPrivateLog(`${actor.name} ${action} nuclear power ${targetName}; retaliation follows the nuclear loss order and costs ${result.lost}/${amount} troops: ${describeLossResult(result)}.`, [actorId, defenderId]);

  if (!defenderId || defenderId === actorId) return;
  for (const nuclearCountry of result.nuclearSources) {
    applyNuclearStrike({
      sourceName: nuclearCountry.name,
      fromPlayerId: actorId,
      targetPlayerId: defenderId,
      strikeableTargets: nuclearCountry.strikeableTargets,
      automatic: false,
      optionalPlayerId: actorId
    });
  }
}

function pendingNuclearDecisionForSession() {
  const player = sessionPlayer();
  if (!player) return null;
  return (game.pendingNuclearRetaliations || []).find((pending) => pending.defenderId === player.id) || null;
}

function currentNuclearRetaliationOptions(pending) {
  return (pending?.strikeableTargets || [])
    .map((name) => countryByName.get(name))
    .filter((country) => (
      country
      && game.ownership[country.name] === pending.actorId
      && country.name !== pending.excludeCountry
      && countryTroops(country.name) > 0
    ))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function executeChosenNuclearRetaliation(pending) {
  const sourceCountry = countryByName.get(pending.targetName);
  const defender = game.players.find((player) => player.id === pending.defenderId);
  const actor = game.players.find((player) => player.id === pending.actorId);
  if (!sourceCountry || !actor) return { prescribed: 0, lost: 0, remaining: 0, losses: [], nuclearSources: [], stoppedEarly: false };
  let remaining = Math.max(0, sourceCountry.magnitude || 0);
  const losses = [];
  const nuclearSources = [];
  let stoppedEarly = false;
  while (remaining > 0) {
    const options = currentNuclearRetaliationOptions(pending);
    if (!options.length) break;
    const menu = options.map((country, index) => `${index + 1}. ${country.name} (${countryTroops(country.name)} troops)`).join("\n");
    const answer = prompt(`${defender?.name || "You"}: choose a nuclear retaliation target from ${pending.targetName}, or enter 0 to stop retaliating.\n${remaining} troop loss${remaining === 1 ? "" : "es"} remaining. The game will remove troops from the chosen country up to that remaining total.\n\n0. Stop retaliating\n${menu}`);
    if (answer === null) {
      stoppedEarly = true;
      break;
    }
    if (String(answer).trim() === "0") {
      stoppedEarly = true;
      break;
    }
    const index = Number(answer) - 1;
    const chosen = options[index] || options.find((country) => country.name.toLowerCase() === String(answer).trim().toLowerCase());
    if (!chosen) {
      alert("Choose a listed number or country name.");
      continue;
    }
    const counterSource = isNuclearPower(chosen.name, pending.actorId)
      ? nuclearCounterSourceSnapshot(chosen.name, pending.actorId, pending.defenderId)
      : null;
    const result = applySpecificCountryTroopLoss(chosen.name, remaining);
    remaining -= result.lost;
    losses.push(...result.losses);
    if (counterSource && result.lost > 0) nuclearSources.push(counterSource);
  }
  const prescribed = Math.max(0, sourceCountry.magnitude || 0);
  const lost = prescribed - remaining;
  addPrivateLog(`${defender?.name || "Defender"} retaliates with ${pending.targetName} against ${actor.name}'s chosen countries; ${lost}/${prescribed} troops lost: ${losses.length ? losses.join("; ") : "no troops available"}.`, [pending.defenderId, pending.actorId]);
  if (stoppedEarly && remaining > 0) {
    addPrivateLog(`${defender?.name || "Defender"} stops nuclear retaliation from ${pending.targetName} with ${remaining} troop loss${remaining === 1 ? "" : "es"} unused.`, [pending.defenderId, pending.actorId]);
  }
  return { prescribed, lost, remaining, losses, nuclearSources, stoppedEarly };
}

function resolvePendingNuclearDecision(id, retaliate) {
  const pending = (game.pendingNuclearRetaliations || []).find((item) => item.id === id);
  if (!pending) return;
  const defender = game.players.find((player) => player.id === pending.defenderId);
  const actor = game.players.find((player) => player.id === pending.actorId);
  game.pendingNuclearRetaliations = (game.pendingNuclearRetaliations || []).filter((item) => item.id !== id);
  promptedNuclearDecisionIds.delete(id);
  if (retaliate) {
    const result = executeChosenNuclearRetaliation(pending);
    for (const nuclearCountry of result.nuclearSources) {
      applyNuclearStrike({
        sourceName: nuclearCountry.name,
        fromPlayerId: pending.actorId,
        targetPlayerId: pending.defenderId,
        strikeableTargets: nuclearCountry.strikeableTargets,
        automatic: false,
        optionalPlayerId: pending.actorId
      });
    }
    checkEliminations();
    refreshRegionControlAnnouncements();
  } else {
    addPrivateLog(`${defender?.name || "Defender"} declines nuclear retaliation from ${pending.targetName}.`, [pending.defenderId, pending.actorId]);
  }
  saveGame();
  render();
}

function promptPendingNuclearDecision() {
  const pending = pendingNuclearDecisionForSession();
  if (!pending || promptedNuclearDecisionIds.has(pending.id)) return;
  if (!currentNuclearRetaliationOptions(pending).length) {
    const defender = game.players.find((player) => player.id === pending.defenderId);
    const actor = game.players.find((player) => player.id === pending.actorId);
    game.pendingNuclearRetaliations = (game.pendingNuclearRetaliations || []).filter((item) => item.id !== pending.id);
    addPrivateLog(`${defender?.name || "Defender"}'s retaliation from ${pending.targetName} is skipped because there are no attacking options.`, [pending.defenderId, pending.actorId]);
    saveGame();
    render();
    return;
  }
  promptedNuclearDecisionIds.add(pending.id);
  const actor = game.players.find((player) => player.id === pending.actorId);
  const defender = game.players.find((player) => player.id === pending.defenderId);
  setTimeout(() => {
    if (!game || !(game.pendingNuclearRetaliations || []).some((item) => item.id === pending.id)) return;
    const retaliate = confirm(`${defender?.name || "You"} may use nuclear retaliation from ${pending.targetName} against ${actor?.name || "the attacker"}.\n\nPress OK to retaliate.\nPress Cancel to decline.`);
    resolvePendingNuclearDecision(pending.id, retaliate);
  }, 0);
}

function resolveSharedStagingUnclaimedTroops() {
  for (const place of SHARED_STAGING_PLACES) {
    const config = sharedStagingConfig(place.name);
    const unclaimed = Number(game[config.unclaimedKey] || 0);
    if (unclaimed <= 0) continue;
    const candidates = activePlayers().map((player) => ({ player, troops: sharedStagingTroops(place.name, player.id) }));
    if (!candidates.length) continue;
    const most = Math.max(...candidates.map((item) => item.troops));
    const leaders = candidates.filter((item) => item.troops === most);
    if (leaders.length !== 1) continue;
    const leader = leaders[0].player;
    game[config.troopsKey][leader.id] = sharedStagingTroops(place.name, leader.id) + unclaimed;
    game[config.unclaimedKey] = 0;
    addPrivateLog(`${leader.name} receives ${unclaimed} unclaimed troops in ${place.name}.`, [leader.id]);
  }
}

function concludeGameIfWon() {
  if (game.phase === "gameover") return true;
  const remaining = activePlayers();
  if (remaining.length === 1) {
    recordTurnSnapshot(`Game over: ${remaining[0].name} wins`);
    game.phase = "gameover";
    game.winnerId = remaining[0].id;
    game.pendingTransfers = [];
    addLog(`${remaining[0].name} wins the game.`);
    return true;
  }
  return false;
}

function visibleCountriesFor(playerId) {
  const owned = ownedCountries(playerId);
  if (playerHasGlobalVisibility(playerId)) {
    const visible = new Map();
    for (const country of countries) visible.set(country.name, game.ownership[country.name] === playerId ? "Owned" : "Global");
    for (const place of sharedStagingPlacesForPlayer(playerId)) visible.set(place.name, place.name);
    return [...visible.entries()]
      .map(([name, visibility]) => ({ country: placeByName(name), visibility }))
      .sort((a, b) => a.country.name.localeCompare(b.country.name));
  }
  const visible = new Map();
  for (const country of owned) {
    visible.set(country.name, "Owned");
    for (const link of connectedNeighbors(country, "all")) {
      if (!visible.has(link.name)) visible.set(link.name, "Border or network");
    }
  }
  for (const ownedCountry of owned) {
    for (const country of countries) {
      if (country.region === ownedCountry.region && !visible.has(country.name)) {
        visible.set(country.name, "Same region");
      }
    }
  }
  for (const place of sharedStagingPlacesForPlayer(playerId)) visible.set(place.name, place.name);
  return [...visible.entries()]
    .map(([name, visibility]) => ({ country: placeByName(name), visibility }))
    .sort((a, b) => a.country.name.localeCompare(b.country.name));
}

function playerHasGlobalVisibility(playerId) {
  const ownedNames = new Set(ownedCountries(playerId).map((country) => country.name));
  return [...GLOBAL_VISIBILITY_COUNTRIES].some((name) => ownedNames.has(name))
    || GLOBAL_VISIBILITY_COMBO.every((name) => ownedNames.has(name));
}

function setOptions(select, items, getLabel = (x) => x, getValue = (x) => x) {
  const previous = select.value;
  select.innerHTML = "";
  const options = items
    .map((item) => ({ item, label: String(getLabel(item)), value: String(getValue(item)) }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: "base" }));
  for (const { label, value } of options) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  }
  if ([...select.options].some((option) => option.value === previous)) {
    select.value = previous;
  }
}

function playersWithRecruits() {
  return activePlayers()
    .filter((player) => player.reserve > 0);
}

function playerRecruitPlan(playerId) {
  return game?.recruitPlans?.[playerId] || null;
}

function playerHasSubmittedRecruitPlan(playerId) {
  const player = game?.players?.find((candidate) => candidate.id === playerId);
  if (!player || player.reserve <= 0) return true;
  return Boolean(playerRecruitPlan(playerId)?.submitted);
}

function playersAwaitingRecruitPlans() {
  return playersWithRecruits().filter((player) => !playerHasSubmittedRecruitPlan(player.id));
}

function currentPlanningPlayer() {
  const player = sessionPlayer();
  if (player && player.reserve > 0 && !player.eliminated && !playerHasSubmittedRecruitPlan(player.id)) return player;
  return null;
}

function allRecruitsPlaced() {
  return activePlayers().every((player) => player.reserve <= 0 || playerHasSubmittedRecruitPlan(player.id));
}

function renderSetupNames() {
  const count = Math.max(2, Number($("playerCount").value || 2));
  $("playerNames").innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    const label = document.createElement("label");
    label.textContent = `Player ${i + 1}`;
    const input = document.createElement("input");
    input.className = "player-name";
    input.value = `Player ${i + 1}`;
    label.appendChild(input);
    $("playerNames").appendChild(label);
  }
  if ($("setupPlayerName") && !$("setupPlayerName").value.trim()) $("setupPlayerName").value = "Player 1";
}

function renderSummary() {
  const active = activePlayers();
  const player = currentPlayer();
  const self = sessionPlayer();
  const winningPlayer = winner();
  const pendingNuclear = pendingNuclearDecisionForSession();
  $("statusLine").classList.toggle("recruit-alert", Boolean(game && game.phase === "planning" && self?.reserve > 0 && !playerHasSubmittedRecruitPlan(self.id)));
  $("statusLine").textContent = game
    ? winningPlayer
      ? `Game over · ${winningPlayer.name} wins`
      : pendingNuclear
      ? `Nuclear retaliation decision pending for ${pendingNuclear.targetName}`
      : game.phase === "planning" && self?.reserve > 0 && !playerHasSubmittedRecruitPlan(self.id)
      ? `Place your ${self.reserve} recruit${self.reserve === 1 ? "" : "s"} now · click one of your countries on the map`
      : game.phase === "planning" && self?.reserve > 0
      ? "Recruit plan submitted · waiting for the other players"
      : game.phase === "planning"
      ? `Recruit placement is underway · ${playersAwaitingRecruitPlans().length} player${playersAwaitingRecruitPlans().length === 1 ? "" : "s"} still placing`
      : `Player view · ${sessionPlayer()?.name || "Unknown player"} · Round ${game.round} · ${game.phase === "planning" ? "planning phase" : `${player?.name || "No one"}'s turn`}`
    : `${countries.length} countries loaded`;
  $("summaryGrid").innerHTML = active.map((p) => {
    const owned = ownedCountries(p.id);
    const stagingSummary = SHARED_STAGING_PLACES
      .map((place) => `${sharedStagingTroops(place.name, p.id)} in ${place.name}`)
      .join(" · ");
    const stagingTroops = SHARED_STAGING_PLACES.reduce((sum, place) => sum + sharedStagingTroops(place.name, p.id), 0);
    const troopCount = owned.reduce((sum, country) => sum + countryTroops(country.name), 0) + stagingTroops;
    const nuclearPenalty = Number(p.nuclearRecruitPenaltyRemaining || 0);
    const penaltyText = nuclearPenalty > 0 ? ` · ${nuclearPenalty} nuclear start penalty left` : "";
    return `<div class="summary-card"><strong>${p.name}</strong><span>${owned.length} countries · ${troopCount} troops · ${stagingSummary} · ${p.reserve} unplaced recruits · ${p.carry.toFixed(2)} carry${penaltyText}</span></div>`;
  }).join("");
}

function boardPlaces() {
  return [...countries, ...SHARED_STAGING_PLACES];
}

function renderBoard() {
  const query = $("boardSearch").value.trim().toLowerCase();
  const filters = {
    country: $("filterCountry").value.trim().toLowerCase(),
    region: $("filterRegion").value.trim().toLowerCase(),
    network: $("filterNetwork").value.trim().toLowerCase(),
    magnitude: $("filterMagnitude").value.trim().toLowerCase(),
    owner: $("filterOwner").value.trim().toLowerCase(),
    troops: $("filterTroops").value.trim().toLowerCase()
  };
  $("boardRows").innerHTML = boardPlaces()
    .filter((country) => !query || country.name.toLowerCase().includes(query) || country.region.toLowerCase().includes(query))
    .filter((country) => {
      const row = {
        country: country.name.toLowerCase(),
        region: country.region.toLowerCase(),
        network: (country.network || "").toLowerCase(),
        magnitude: String(country.magnitude),
        owner: isSharedStaging(country.name) ? "shared" : playerName(game.ownership[country.name]).toLowerCase(),
        troops: isSharedStaging(country.name) ? String(totalSharedStagingTroops(country.name)) : String(countryTroops(country.name) || "")
      };
      return Object.entries(filters).every(([key, value]) => !value || row[key].includes(value));
    })
    .map((country) => `<tr>
      <td>${country.name}</td>
      <td>${country.region}</td>
      <td>${country.network || ""}</td>
      <td>${country.magnitude}</td>
      <td>${isSharedStaging(country.name) ? "Shared staging" : playerName(game.ownership[country.name])}</td>
      <td>${isSharedStaging(country.name) ? totalSharedStagingTroops(country.name) : countryTroops(country.name) || ""}</td>
    </tr>`).join("");
}

function renderPlanning() {
  const planningPlayer = currentPlanningPlayer();
  const self = sessionPlayer();
  setOptions($("placePlayer"), planningPlayer ? [planningPlayer] : [], (p) => `${p.name} (${p.reserve} recruits)`, (p) => p.id);
  $("placeForm").classList.toggle("hidden", !(self?.reserve > 0 || planningPlayer));
  renderRecruitDraftStatus(planningPlayer);
  updatePlaceCountries();
  renderPlanningVisible();
}

function renderRecruitDraftStatus(player) {
  const status = $("planningSubmitStatus");
  const list = $("planningDraftList");
  const submitButton = $("submitRecruitPlanButton");
  if (!status || !list || !submitButton) return;
  if (!player) {
    const self = sessionPlayer();
    status.textContent = self && playerHasSubmittedRecruitPlan(self.id)
      ? "Your recruit plan has been submitted. Recruits will appear on the board once every active player has submitted."
      : "No recruits to place right now.";
    list.textContent = "";
    submitButton.disabled = true;
    return;
  }
  const draft = loadRecruitDraft(player.id);
  const total = recruitDraftTotal(draft);
  const remaining = Math.max(0, player.reserve - total);
  const entries = Object.entries(draft).filter(([, amount]) => Number(amount) > 0).sort(([a], [b]) => a.localeCompare(b));
  status.textContent = `${total}/${player.reserve} recruits planned · ${remaining} remaining.`;
  list.textContent = entries.length
    ? `Plan: ${entries.map(([country, amount]) => `${amount} to ${country}`).join("; ")}`
    : "No recruits planned yet.";
  submitButton.disabled = player.reserve <= 0 || remaining !== 0;
}

function validRecruitDestinations(playerId) {
  const owned = ownedCountries(playerId);
  const destinations = new Set(owned.map((country) => country.name));
  for (const place of sharedStagingPlacesForPlayer(playerId)) destinations.add(place.name);
  return destinations;
}

function validateRecruitDraft(playerId, draft) {
  const player = game.players.find((candidate) => candidate.id === playerId);
  if (!player || player.eliminated || game.phase !== "planning") return { ok: false, message: "Recruit placement is not open." };
  if (player.reserve <= 0) return { ok: false, message: "You do not have recruits to place." };
  const destinations = validRecruitDestinations(playerId);
  const clean = {};
  let total = 0;
  for (const [country, rawAmount] of Object.entries(draft || {})) {
    const amount = Number(rawAmount || 0);
    if (!Number.isInteger(amount) || amount < 0) return { ok: false, message: "Recruit amounts must be whole numbers." };
    if (amount === 0) continue;
    if (!destinations.has(country)) return { ok: false, message: `${country} is no longer available for recruit placement.` };
    clean[country] = (clean[country] || 0) + amount;
    total += amount;
  }
  if (total !== player.reserve) return { ok: false, message: `Your plan must assign exactly ${player.reserve} recruits.` };
  return { ok: true, placements: clean };
}

function placementsEqual(a = {}, b = {}) {
  const left = Object.entries(a).filter(([, amount]) => Number(amount) > 0).sort(([x], [y]) => x.localeCompare(y));
  const right = Object.entries(b).filter(([, amount]) => Number(amount) > 0).sort(([x], [y]) => x.localeCompare(y));
  return JSON.stringify(left) === JSON.stringify(right);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyRecruitPlanToBoard(playerId, placements) {
  const player = game.players.find((candidate) => candidate.id === playerId);
  if (!player || player.reserve <= 0) return false;
  game.recruitPlans ||= {};
  const existingPlan = game.recruitPlans[playerId];
  if (existingPlan?.applied) return false;
  let placed = 0;
  for (const [country, rawAmount] of Object.entries(placements || {})) {
    const amount = Math.max(0, Number(rawAmount || 0));
    if (amount <= 0) continue;
    if (isSharedStaging(country)) {
      const config = sharedStagingConfig(country);
      game[config.troopsKey][player.id] = sharedStagingTroops(country, player.id) + amount;
      placed += amount;
    } else if (game.ownership[country] === player.id) {
      game.troops[country] = countryTroops(country) + amount;
      placed += amount;
    }
  }
  player.reserve = Math.max(0, player.reserve - placed);
  game.recruitPlans[player.id] = {
    submitted: true,
    applied: true,
    placements,
    round: game.round,
    submittedAt: existingPlan?.submittedAt || new Date().toISOString()
  };
  addPrivateLog(`${player.name}'s recruit plan resolves: ${Object.entries(placements || {}).filter(([, amount]) => Number(amount) > 0).sort(([a], [b]) => a.localeCompare(b)).map(([country, amount]) => `${amount} to ${country}`).join("; ")}.`, [player.id]);
  return true;
}

async function preserveOnlineRecruitPlan(playerId, placements, attempts = 4) {
  if (!onlineClient || !onlineGameId) return;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    await wait(attempt === 0 ? 350 : 900);
    const loaded = await loadLatestOnlineStateForMerge();
    if (!loaded || game.phase !== "planning") return;
    const plan = playerRecruitPlan(playerId);
    if (plan?.applied && placementsEqual(plan.placements, placements)) {
      if (allRecruitsPlaced()) {
        resolvePlanning();
        await saveOnlineGame({ quiet: true });
      }
      return;
    }
    applyRecruitPlanToBoard(playerId, placements);
    if (allRecruitsPlaced()) {
      resolvePlanning();
    } else {
      saveGame();
    }
    await saveOnlineGame({ quiet: true });
  }
}

async function submitRecruitPlan() {
  const player = currentPlanningPlayer();
  if (!player) {
    alert("You do not have a recruit plan to submit right now.");
    return;
  }
  const localDraft = loadRecruitDraft(player.id);
  if (onlineClient && onlineGameId) {
    setOnlineStatus("Checking the latest online game before submitting recruits...");
    await loadLatestOnlineStateForMerge();
  }
  const latestPlayer = currentPlanningPlayer();
  if (!latestPlayer || latestPlayer.id !== player.id) {
    alert("Recruit placement changed while you were submitting. Please review the latest game state.");
    render();
    return;
  }
  const validation = validateRecruitDraft(player.id, localDraft);
  if (!validation.ok) {
    alert(validation.message);
    render();
    return;
  }
  applyRecruitPlanToBoard(player.id, validation.placements);
  clearRecruitDraft(player.id);
  addPrivateLog(`${player.name} submits a recruit plan.`, [player.id]);
  if (allRecruitsPlaced()) {
    resolvePlanning();
    if (onlineClient && onlineGameId) await saveOnlineGame({ quiet: true });
    return;
  }
  saveGame();
  if (onlineClient && onlineGameId) {
    await saveOnlineGame({ quiet: true });
    await preserveOnlineRecruitPlan(player.id, validation.placements);
  }
  render();
}

function updatePlaceCountries() {
  const playerId = $("placePlayer").value;
  if (!playerId) {
    setOptions($("placeCountry"), []);
    $("placeAmount").disabled = true;
    return;
  }
  const owned = ownedCountries(playerId);
  const destinations = [...owned, ...sharedStagingPlacesForPlayer(playerId)];
  setOptions(
    $("placeCountry"),
    destinations,
    (country) => `${country.name} (${isSharedStaging(country.name) ? sharedStagingTroops(country.name, playerId) : countryTroops(country.name)})`,
    (country) => country.name
  );
  const player = game.players.find((candidate) => candidate.id === playerId);
  const draft = loadRecruitDraft(playerId);
  const remaining = Math.max(0, (player?.reserve || 0) - recruitDraftTotal(draft));
  const max = remaining;
  $("placeAmount").max = max;
  $("placeAmount").disabled = max < 1;
  $("placeAmount").value = Math.min(Math.max(1, Number($("placeAmount").value || 1)), Math.max(1, max));
}

function updateTransferCountries() {
  const player = visibleSessionPlayer();
  const playerId = player?.id;
  if (!playerId) {
    setOptions($("transferFrom"), []);
    setOptions($("transferTo"), []);
    $("transferAmount").disabled = true;
    return;
  }
  const allOwned = ownedCountries(playerId);
  const origins = allOwned.filter((country) => movableTroops(country.name) > 0);
  for (const place of SHARED_STAGING_PLACES) {
    if (sharedStagingTroops(place.name, playerId) > 0) origins.push(place);
  }
  setOptions($("transferFrom"), origins, (country) => `${country.name} (${isSharedStaging(country.name) ? sharedStagingTroops(country.name, playerId) : movableTroops(country.name)} movable)`, (country) => country.name);
  const from = $("transferFrom").value;
  const destinations = from
    ? [
        ...allOwned.filter((country) => country.name !== from && hasOwnedTransferPath(playerId, from, country.name)),
        ...SHARED_STAGING_PLACES.filter((place) => !isSharedStaging(from) && hasOwnedTransferPath(playerId, from, place.name))
      ]
    : [];
  setOptions($("transferTo"), destinations, (country) => country.name, (country) => country.name);
  const max = from ? (isSharedStaging(from) ? sharedStagingTroops(from, playerId) : movableTroops(from)) : 0;
  $("transferAmount").max = max;
  $("transferAmount").value = Math.min(Math.max(1, Number($("transferAmount").value || 1)), Math.max(1, max));
  $("transferAmount").disabled = max < 1 || destinations.length === 0;
}

function renderTransferQueue() {
  $("transferQueue").innerHTML = `<p class="note">Transfers apply immediately when submitted.</p>`;
}

function renderMapTurnFlowButton() {
  const button = $("mapTurnFlowButton");
  if (!button) return;
  const show = game?.phase === "turn" && playerSessionCanAct() && !winner();
  button.classList.toggle("hidden", !show);
  if (!show) return;
  if (game.turnStage === "transfer") {
    button.textContent = "End Turn";
    button.classList.add("primary");
  } else {
    button.textContent = "Finished Attacking";
    button.classList.remove("primary");
  }
}

function regionProgressFor(playerId) {
  const owned = ownedCountries(playerId);
  const regions = [...new Set(owned.map((country) => country.region).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
  return regions.map((region) => {
    const members = countries.filter((country) => country.region === region);
    const ownedCount = members.filter((country) => game.ownership[country.name] === playerId).length;
    return {
      region,
      ownedCount,
      remainingCount: members.length - ownedCount,
      totalCount: members.length,
      bonus: REGION_BONUSES[region] || 0
    };
  });
}

function renderRegionProgress(player, elementId) {
  const element = $(elementId);
  if (!element) return;
  if (!player) {
    element.innerHTML = "";
    return;
  }
  const rows = regionProgressFor(player.id);
  if (!rows.length) {
    element.innerHTML = `<h3>Region Progress</h3><p class="note">This player does not own any countries in a region yet.</p>`;
    return;
  }
  element.innerHTML = `
    <h3>Region Progress</h3>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Region</th>
            <th>Owned</th>
            <th>Remaining</th>
            <th>Bonus</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>${row.region}</td>
              <td>${row.ownedCount} / ${row.totalCount}</td>
              <td>${row.remainingCount}</td>
              <td>${row.bonus}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderTurn() {
  const player = currentPlayer();
  const playersStillPlacing = playersWithRecruits();
  const winningPlayer = winner();
  const transferStage = game.turnStage === "transfer";
  const canAct = playerSessionCanAct();
  const viewingPlayer = visibleSessionPlayer();
  $("turnTitle").textContent = winningPlayer
    ? `${winningPlayer.name} Wins`
    : game.phase === "planning"
    ? `${viewingPlayer?.name || "Player"}'s Map`
    : isPlayerSession() && !canAct
    ? `${viewingPlayer?.name || "Player"}'s Map`
    : player
    ? `${player.name}'s Turn`
    : "Game Over";
  $("turnNote").textContent = winningPlayer
    ? "Only one player remains. The game is complete."
    : game.phase === "planning"
    ? `${playersStillPlacing.length} player${playersStillPlacing.length === 1 ? "" : "s"} still placing recruits. Your map remains visible here.`
    : isPlayerSession() && !canAct
    ? `It is currently ${player?.name || "another player"}'s turn. Your map remains visible here.`
    : player
    ? transferStage
      ? `Click one of your countries on the map to move troops. After this turn, the round ends on a 1 in ${activePlayers().length} roll.`
      : `Attack or claim until finished, then open end-of-turn transfers. After this turn, the round ends on a 1 in ${activePlayers().length} roll.`
    : "Only one player remains.";
  $("attackSection").classList.toggle("hidden", Boolean(winningPlayer) || transferStage || !canAct);
  $("transferSection").classList.toggle("hidden", Boolean(winningPlayer) || !transferStage || !canAct);
  $("finishAttackButton").disabled = Boolean(winningPlayer) || transferStage || !canAct;
  $("endTurnButton").disabled = Boolean(winningPlayer) || !canAct;
  const owned = player ? ownedCountries(player.id).filter((country) => countryTroops(country.name) > 1) : [];
  setOptions($("claimFrom"), owned, (country) => `${country.name} (${countryTroops(country.name)})`, (country) => country.name);
  setOptions($("attackFrom"), owned, (country) => `${country.name} (${countryTroops(country.name)})`, (country) => country.name);
  updateClaimTargets();
  updateAttackTargets();
  updateTransferCountries();
  renderTransferQueue();
  renderMapTurnFlowButton();
}

function updateClaimTargets() {
  const from = $("claimFrom").value;
  const options = from ? claimOptionsFor(from) : [];
  setOptions($("claimTo"), options, (name) => {
    const country = countryByName.get(name);
    return `${name} (magnitude ${country?.magnitude ?? "?"})`;
  });
  const target = countryByName.get($("claimTo").value);
  const max = from ? Math.max(0, countryTroops(from) - 1) : 0;
  $("claimAmount").min = target ? Math.max(1, target.magnitude) : 1;
  $("claimAmount").max = max || 1;
  $("claimAmount").value = target ? Math.max(1, max) : 1;
}

function updateAttackTargets() {
  const from = $("attackFrom").value;
  const options = from ? viableAttackOptionsFor(from) : [];
  setOptions($("attackTo"), options, (o) => `${o.target} (${o.type}, max ${o.maxDice})`, (o) => o.target);
  updateAttackDice();
}

function updateAttackDice() {
  const from = $("attackFrom").value;
  const target = $("attackTo").value;
  const option = viableAttackOptionsFor(from).find((item) => item.target === target);
  const max = option ? attackKeptDiceMaxFor(from, option.maxDice) : 0;
  setOptions($("attackDice"), Array.from({ length: Math.max(0, max) }, (_, i) => i + 1), String, String);
  if (max > 0) $("attackDice").value = String(max);
  $("conquestMove").min = 1;
  $("conquestMove").max = from ? Math.max(1, countryTroops(from) - 1) : 1;
  $("conquestMove").value = from ? Math.max(1, countryTroops(from) - 1) : 1;
}

function applyMapView() {
  $("playerMap").setAttribute("viewBox", "0 0 1000 500");
  $("moderatorMap").setAttribute("viewBox", "0 0 1000 500");
  if ($("planningPlayerMap")) $("planningPlayerMap").setAttribute("viewBox", "0 0 1000 500");
}

function appendOceanLayer(svg, view) {
  const id = `${svg.id}-ocean`;
  const textureX = ((((view.lon * -4.2) % 104) + 104) % 104).toFixed(2);
  const textureY = ((((view.lat * 3.1) % 90) + 90) % 90).toFixed(2);
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <radialGradient id="${id}-gradient" cx="42%" cy="37%" r="82%">
      <stop offset="0%" stop-color="#176d86"></stop>
      <stop offset="30%" stop-color="#0d5575"></stop>
      <stop offset="68%" stop-color="#0b496c"></stop>
      <stop offset="100%" stop-color="#052640"></stop>
    </radialGradient>
    <filter id="${id}-texture" x="-8%" y="-8%" width="116%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency="0.009 0.015" numOctaves="3" seed="26" result="noise">
        <animate attributeName="baseFrequency" dur="28s" values="0.009 0.015;0.012 0.012;0.009 0.015" repeatCount="indefinite"></animate>
      </feTurbulence>
      <feColorMatrix in="noise" type="matrix" values="
        0 0 0 0 0.12
        0 0 0 0 0.48
        0 0 0 0 0.60
        0 0 0 .24 0" result="paintNoise"></feColorMatrix>
      <feBlend in="SourceGraphic" in2="paintNoise" mode="soft-light"></feBlend>
    </filter>
    <pattern id="${id}-grain" x="${textureX}" y="${textureY}" width="126" height="108" patternUnits="userSpaceOnUse" patternTransform="rotate(-11)">
      <rect width="126" height="108" fill="rgba(4, 38, 64, 0.14)"></rect>
      <path d="M-20 24 C 10 2, 38 48, 68 25 S 108 4, 146 28" class="ocean-current"></path>
      <path d="M-16 70 C 14 48, 45 95, 76 70 S 112 47, 146 74" class="ocean-current muted"></path>
      <path d="M5 44 C 20 35, 34 54, 50 43 S 78 33, 96 44" class="ocean-current fine"></path>
      <path d="M62 10 C 80 0, 95 20, 114 9" class="ocean-foam"></path>
      <path d="M22 92 C 39 80, 58 103, 77 91" class="ocean-foam muted"></path>
      <circle cx="21" cy="19" r="1.1" class="ocean-mottle"></circle>
      <circle cx="105" cy="52" r="1.4" class="ocean-mottle muted"></circle>
      <circle cx="58" cy="78" r="0.9" class="ocean-mottle"></circle>
    </pattern>
    <clipPath id="${id}-clip">
      <circle cx="500" cy="250" r="${view.scale}"></circle>
    </clipPath>
  `;
  svg.appendChild(defs);

  const ocean = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  ocean.setAttribute("cx", "500");
  ocean.setAttribute("cy", "250");
  ocean.setAttribute("r", view.scale);
  ocean.setAttribute("class", "globe-ocean");
  ocean.setAttribute("fill", `url(#${id}-gradient)`);
  ocean.setAttribute("filter", `url(#${id}-texture)`);
  svg.appendChild(ocean);

  const grain = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  grain.setAttribute("cx", "500");
  grain.setAttribute("cy", "250");
  grain.setAttribute("r", view.scale);
  grain.setAttribute("class", "ocean-grain");
  grain.setAttribute("fill", `url(#${id}-grain)`);
  svg.appendChild(grain);
}

function resetMapView(renderNow = true, player = visibleSessionPlayer()) {
  mapView = { x: 0, y: 0, width: 1000, height: 500 };
  selectedMapCountry = null;
  const strongest = player
    ? ownedCountries(player.id)
        .slice()
        .sort((a, b) => {
          const troopDifference = countryTroops(b.name) - countryTroops(a.name);
          if (troopDifference) return troopDifference;
          return (game.ownershipSince[a.name] || Infinity) - (game.ownershipSince[b.name] || Infinity);
        })[0]
    : null;
  const center = strongest ? centerForRiskCountry(strongest.name) : null;
  globeView = center
    ? { lon: center.lon, lat: Math.max(-80, Math.min(80, center.lat)), scale: 700 }
    : { lon: 0, lat: 18, scale: 225 };
  applyMapView();
  if (renderNow && game) renderVisible();
}

function resetModeratorMapView() {
  selectedModeratorMapCountry = null;
  moderatorGlobeView = { lon: 0, lat: 18, scale: 245 };
  applyMapView();
  if (game) renderModeratorMap();
}

function clampMapView() {
  mapView.width = Math.min(1000, Math.max(80, mapView.width));
  mapView.height = Math.min(500, Math.max(40, mapView.height));
  mapView.x = Math.min(1000 - mapView.width, Math.max(0, mapView.x));
  mapView.y = Math.min(500 - mapView.height, Math.max(0, mapView.y));
}

function mapPointFromEvent(event) {
  const svg = $("playerMap");
  const rect = svg.getBoundingClientRect();
  return {
    x: mapView.x + ((event.clientX - rect.left) / rect.width) * mapView.width,
    y: mapView.y + ((event.clientY - rect.top) / rect.height) * mapView.height
  };
}

function degreesToRadians(value) {
  return (value * Math.PI) / 180;
}

function projectPointForView([lon, lat], view) {
  const lambda = degreesToRadians(lon - view.lon);
  const phi = degreesToRadians(lat);
  const phi0 = degreesToRadians(view.lat);
  const cosPhi = Math.cos(phi);
  const visibility = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * cosPhi * Math.cos(lambda);
  if (visibility <= 0) return null;
  return {
    x: 500 + view.scale * cosPhi * Math.sin(lambda),
    y: 250 - view.scale * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * cosPhi * Math.cos(lambda)),
    visibility
  };
}

function normalizeLongitude(lon) {
  return (((lon + 180) % 360) + 360) % 360 - 180;
}

function mapCursorPoint(event, svg) {
  const rect = svg.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 1000,
    y: ((event.clientY - rect.top) / rect.height) * 500
  };
}

function unprojectPointForView(point, view) {
  const x = (point.x - 500) / view.scale;
  const y = (250 - point.y) / view.scale;
  const rho = Math.hypot(x, y);
  if (rho > 1) return null;
  if (rho < 1e-9) return { lon: view.lon, lat: view.lat };

  const c = Math.asin(Math.min(1, rho));
  const phi0 = degreesToRadians(view.lat);
  const lat = Math.asin(Math.cos(c) * Math.sin(phi0) + (y * Math.sin(c) * Math.cos(phi0)) / rho);
  const lon = degreesToRadians(view.lon) + Math.atan2(
    x * Math.sin(c),
    rho * Math.cos(phi0) * Math.cos(c) - y * Math.sin(phi0) * Math.sin(c)
  );
  return { lon: normalizeLongitude((lon * 180) / Math.PI), lat: (lat * 180) / Math.PI };
}

function nudgeViewToCursor(view, geoPoint, cursorPoint) {
  if (!geoPoint) return;
  for (let index = 0; index < 5; index += 1) {
    const projected = projectPointForView([geoPoint.lon, geoPoint.lat], view);
    if (!projected) return;
    const dx = projected.x - cursorPoint.x;
    const dy = projected.y - cursorPoint.y;
    if (Math.hypot(dx, dy) < 0.5) return;
    view.lon = normalizeLongitude(view.lon + (dx / view.scale) * 58);
    view.lat = Math.max(-80, Math.min(80, view.lat - (dy / view.scale) * 58));
  }
}

function projectPoint(point) {
  return projectPointForView(point, globeView);
}

function pathForFeatureWithView(feature, view) {
  const segments = [];
  for (const ring of feature.parts) {
    let segment = [];
    for (const point of ring) {
      const projected = projectPointForView(point, view);
      if (!projected) {
        if (segment.length > 1) segments.push(segment);
        segment = [];
        continue;
      }
      segment.push(projected);
    }
    if (segment.length > 1) segments.push(segment);
  }
  return segments.map((segment) => segment.map((point, index) => {
    return `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }).join(" ")).join(" ");
}

function pathForFeature(feature) {
  return pathForFeatureWithView(feature, globeView);
}

function ringArea(ring) {
  let area = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) / 2;
}

function pointInRing(point, ring) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || 1e-9) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function ringCenter(ring) {
  const total = ring.reduce((sum, point) => ({ lon: sum.lon + point[0], lat: sum.lat + point[1] }), { lon: 0, lat: 0 });
  return [total.lon / ring.length, total.lat / ring.length];
}

function labelCandidatePointsForFeature(feature, view = globeView) {
  const candidates = [];
  const override = MAP_LABEL_POINTS[feature.riskName] || MAP_LABEL_POINTS[feature.name];
  if (override) {
    const projected = projectPointForView(override, view);
    const minimumVisibility = feature.riskName === "France" || feature.name === "France" ? 0.65 : 0.25;
    if (projected && projected.visibility > minimumVisibility) candidates.push({ ...projected, priority: 0 });
    return candidates.filter((point) => point.visibility > 0.25);
  }

  const rings = feature.parts
    .filter((ring) => ring.length > 2)
    .map((ring) => ({ ring, area: ringArea(ring) }))
    .sort((a, b) => b.area - a.area);

  for (const { ring } of rings.slice(0, 4)) {
    const lons = ring.map((point) => point[0]);
    const lats = ring.map((point) => point[1]);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const center = ringCenter(ring);
    const centerProjected = pointInRing(center, ring) ? projectPointForView(center, view) : null;
    if (centerProjected) candidates.push({ ...centerProjected, priority: 1 });

    for (const xStep of [0.5, 0.35, 0.65, 0.2, 0.8]) {
      for (const yStep of [0.5, 0.35, 0.65, 0.2, 0.8]) {
        const point = [minLon + (maxLon - minLon) * xStep, minLat + (maxLat - minLat) * yStep];
        if (!pointInRing(point, ring)) continue;
        const projected = projectPointForView(point, view);
        if (projected) candidates.push({ ...projected, priority: 2 });
      }
    }
  }

  return candidates.filter((point) => point.visibility > 0.25);
}

function labelPointForFeature(feature, view = globeView) {
  return labelCandidatePointsForFeature(feature, view)[0] || null;
}

function centerForRiskCountry(countryName) {
  const features = mapFeaturesByRiskName.get(countryName) || [];
  if (!features.length) return null;
  const bounds = features.reduce((acc, feature) => {
    acc.minLon = Math.min(acc.minLon, feature.bbox[0]);
    acc.minLat = Math.min(acc.minLat, feature.bbox[1]);
    acc.maxLon = Math.max(acc.maxLon, feature.bbox[2]);
    acc.maxLat = Math.max(acc.maxLat, feature.bbox[3]);
    return acc;
  }, { minLon: Infinity, minLat: Infinity, maxLon: -Infinity, maxLat: -Infinity });
  let lon = (bounds.minLon + bounds.maxLon) / 2;
  if (bounds.maxLon - bounds.minLon > 180) {
    const shiftedMin = bounds.minLon < 0 ? bounds.minLon + 360 : bounds.minLon;
    const shiftedMax = bounds.maxLon < 0 ? bounds.maxLon + 360 : bounds.maxLon;
    lon = ((shiftedMin + shiftedMax) / 2 + 540) % 360 - 180;
  }
  return { lon, lat: (bounds.minLat + bounds.maxLat) / 2 };
}

function visibilityClass(visibility, country, playerId) {
  if (visibility === "Same region") return "map-region";
  if (visibility === "Owned") return "map-owned";
  const owner = game.ownership[country.name];
  if (!owner) return "map-unowned";
  return owner === playerId ? "map-owned" : "map-known";
}

function visibleLabelLines(country, visibility, playerId) {
  if (isSharedStaging(country.name)) return [country.name, `${sharedStagingTroops(country.name, playerId)} troops`];
  if (visibility === "Same region") return [country.name];
  const owner = game.ownership[country.name];
  if (!owner) return [country.name, `Mag ${country.magnitude}`];
  if (visibility === "Owned" || owner !== playerId) return [country.name, `${countryTroops(country.name)} troops`];
  return [country.name];
}

function visibleDetailHtml(country, visibility, playerId) {
  if (isSharedStaging(country.name)) {
    return `
      <strong>${country.name}</strong>
      <p><span class="badge">Shared staging</span></p>
      <p>Your troops: ${sharedStagingTroops(country.name, playerId)}</p>
      <p>Total troops: ${totalSharedStagingTroops(country.name)}</p>
    `;
  }
  const full = visibility !== "Same region";
  const owner = game.ownership[country.name];
  const enemyTroopsVisible = full && owner && owner !== playerId;
  const troopText = full && !owner ? "0" : visibility === "Owned" || enemyTroopsVisible ? `${countryTroops(country.name)}` : "Hidden";
  const capitalText = full && owner ? `<p>Capital: ${isCapitalCountry(country.name, owner) ? "Yes" : "No"}</p>` : "";
  return `
    <strong>${country.name}</strong>
    <p><span class="badge ${visibility === "Owned" ? "gold" : ""}">${visibility}</span></p>
    <p>Region: ${country.region}</p>
    ${full ? `<p>Network: ${country.network || "None"}</p>` : ""}
    ${full ? `<p>Magnitude: ${country.magnitude}</p>` : ""}
    ${full ? `<p>Owner: ${playerName(owner)}</p>` : ""}
    ${full ? `<p>Troops: ${troopText}</p>` : ""}
    ${capitalText}
  `;
}

function contextualActionHtml(country, playerId, detailsId) {
  if (!country || !playerId || isSharedStaging(country.name)) return "";
  const owner = game.ownership[country.name];
  const current = currentPlayer();
  const isOwnCountry = owner === playerId;
  if (game.phase === "planning") {
    const player = sessionPlayer();
    if (!player || player.id !== playerId || !isOwnCountry || player.reserve <= 0) return "";
    const remaining = Math.max(0, player.reserve - recruitDraftTotal(loadRecruitDraft(player.id)));
    if (remaining <= 0) return "";
    return `
      <form class="map-action-panel" data-context-action="place-recruits" data-country="${country.name}">
        <label>Recruits
          <input name="amount" type="number" min="1" max="${remaining}" value="1">
        </label>
        <button type="submit" class="primary">Add to Plan</button>
      </form>
    `;
  }
  if (game.phase !== "turn" || !playerSessionCanAct() || !current || current.id !== playerId || !isOwnCountry) return "";
  if (game.turnStage === "transfer") {
    const destinations = ownedCountries(playerId)
      .filter((candidate) => candidate.name !== country.name && hasOwnedTransferPath(playerId, country.name, candidate.name));
    if (!destinations.length || movableTroops(country.name) < 1) return "";
    return `
      <form class="map-action-panel" data-context-action="transfer" data-from="${country.name}">
        <label>Transfer to
          <select name="target">
            ${destinations.map((target) => `<option value="${target.name}">${target.name}</option>`).join("")}
          </select>
        </label>
        <label>Troops
          <input name="amount" type="number" min="1" max="${movableTroops(country.name)}" value="1">
        </label>
        <button type="submit" class="primary">Transfer</button>
      </form>
    `;
  }
  const claims = claimOptionsFor(country.name);
  const attacks = viableAttackOptionsFor(country.name);
  return `
    <div class="map-action-panel">
      ${claims.length ? `
        <form data-context-action="claim" data-from="${country.name}">
          <label>Claim
            <select name="target">
              ${claims.map((name) => `<option value="${name}">${name} (magnitude ${countryByName.get(name)?.magnitude ?? "?"})</option>`).join("")}
            </select>
          </label>
          <label>Troops
            <input name="amount" type="number" min="1" value="1">
          </label>
          <button type="submit" class="primary">Claim</button>
        </form>
      ` : ""}
      ${attacks.length ? `
        <form data-context-action="attack" data-from="${country.name}">
          <label>Attack
            <select name="target" class="context-attack-target">
              ${attacks.map((option) => `<option value="${option.target}">${option.target} (${option.type})</option>`).join("")}
            </select>
          </label>
          <label>Attack dice
            <select name="dice" class="context-attack-dice"></select>
          </label>
          <label>Move on conquest
            <input name="move" type="number" min="1" value="1">
          </label>
          <button type="submit" class="primary">Attack</button>
        </form>
      ` : ""}
    </div>
  `;
}

function moderatorLabelLines(country) {
  if (isSharedStaging(country.name)) return [country.name, `${totalSharedStagingTroops(country.name)} troops`];
  const owner = game.ownership[country.name];
  if (!owner) return [country.name, `Mag ${country.magnitude}`];
  return [country.name, `${countryTroops(country.name)} troops`, `Mag ${country.magnitude}`];
}

function snapshotLabelLines(country, snapshot) {
  if (isSharedStaging(country.name)) {
    const config = sharedStagingConfig(country.name);
    const total = Object.values(snapshot[config.troopsKey] || {}).reduce((sum, value) => sum + Number(value || 0), Number(snapshot[config.unclaimedKey] || 0));
    return [country.name, `${total} troops`];
  }
  const owner = snapshot.ownership?.[country.name];
  if (!owner) return [country.name, `Mag ${country.magnitude}`];
  return [country.name, `${Number(snapshot.troops?.[country.name] || 0)} troops`, `Mag ${country.magnitude}`];
}

function regionLabelClass(country) {
  if (!country?.region) return "region-label-0";
  const regions = Object.keys(REGION_BONUSES);
  const index = Math.max(0, regions.indexOf(country.region));
  return `region-label-${index % 8}`;
}

function labelBox(point, lines) {
  const longestLine = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const width = Math.max(34, longestLine * 7.5);
  const height = lines.length * 15;
  return {
    left: point.x - width / 2,
    right: point.x + width / 2,
    top: point.y - 12,
    bottom: point.y - 12 + height
  };
}

function boxesOverlap(a, b, padding = 9) {
  return !(a.right + padding < b.left || b.right + padding < a.left || a.bottom + padding < b.top || b.bottom + padding < a.top);
}

function chooseMapLabels(labelEntries) {
  const placed = [];
  const sorted = labelEntries
    .map((entry) => ({ ...entry, candidates: entry.candidates.sort((a, b) => a.priority - b.priority || b.visibility - a.visibility) }))
    .sort((a, b) => {
      const aBest = a.candidates[0]?.visibility || 0;
      const bBest = b.candidates[0]?.visibility || 0;
      return bBest - aBest || b.lines.join("").length - a.lines.join("").length;
    });

  for (const entry of sorted) {
    let selected = null;
    const lineCounts = Array.from({ length: entry.lines.length }, (_, index) => entry.lines.length - index);
    for (const count of lineCounts) {
      const lines = entry.lines.slice(0, count);
      for (const point of entry.candidates) {
        const box = labelBox(point, lines);
        if (box.left < 2 || box.right > 998 || box.top < 2 || box.bottom > 498) continue;
        if (placed.every((item) => !boxesOverlap(box, item.box))) {
          selected = { ...entry, point, lines, box };
          break;
        }
      }
      if (selected) break;
    }
    if (selected) placed.push(selected);
  }

  return placed;
}

function appendMapLabel(svg, entry, onSelect) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", entry.point.x.toFixed(2));
  text.setAttribute("y", entry.point.y.toFixed(2));
  text.setAttribute("class", `map-label ${regionLabelClass(entry.country)}`);
  if (entry.ownerId) text.style.fill = playerColor(entry.ownerId);
  text.dataset.country = entry.country.name;
  entry.lines.forEach((line, index) => {
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    tspan.setAttribute("x", entry.point.x.toFixed(2));
    tspan.setAttribute("dy", index === 0 ? "0" : "1.1em");
    tspan.textContent = line;
    text.appendChild(tspan);
  });
  text.addEventListener("click", (event) => {
    event.stopPropagation();
    if (suppressMapClick) {
      suppressMapClick = false;
      return;
    }
    onSelect(entry.country.name);
  });
  svg.appendChild(text);
}

function appendSvgElement(parent, tag, attrs = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, String(value));
  }
  parent.appendChild(element);
  return element;
}

function wedgePath(innerRadius, outerRadius, startDeg, endDeg) {
  const point = (radius, deg) => {
    const radians = (deg - 90) * Math.PI / 180;
    return [Math.cos(radians) * radius, Math.sin(radians) * radius];
  };
  const [outerStartX, outerStartY] = point(outerRadius, startDeg);
  const [outerEndX, outerEndY] = point(outerRadius, endDeg);
  const [innerEndX, innerEndY] = point(innerRadius, endDeg);
  const [innerStartX, innerStartY] = point(innerRadius, startDeg);
  return [
    `M ${outerStartX.toFixed(2)} ${outerStartY.toFixed(2)}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${outerEndX.toFixed(2)} ${outerEndY.toFixed(2)}`,
    `L ${innerEndX.toFixed(2)} ${innerEndY.toFixed(2)}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStartX.toFixed(2)} ${innerStartY.toFixed(2)}`,
    "Z"
  ].join(" ");
}

function appendNuclearSymbol(parent) {
  appendSvgElement(parent, "circle", { cx: 0, cy: 0, r: 2.1 });
  for (const rotation of [0, 120, 240]) {
    appendSvgElement(parent, "path", {
      d: wedgePath(4.2, 11, -24 + rotation, 24 + rotation)
    });
  }
}

function appendSatelliteSymbol(parent) {
  appendSvgElement(parent, "image", {
    href: "assets/satellite-symbol.png",
    x: -15.8,
    y: -16.5,
    width: 31.6,
    height: 33.1,
    preserveAspectRatio: "xMidYMid meet"
  });
}

function appendMissileSymbol(parent) {
  const angled = appendSvgElement(parent, "g", { transform: "rotate(45)" });
  appendSvgElement(angled, "path", { d: "M -3 -13 Q 0 -18 3 -13 L 3 9 Q 0 12 -3 9 Z" });
  appendSvgElement(angled, "path", { d: "M -3 3 L -8 11 L -3 9 Z" });
  appendSvgElement(angled, "path", { d: "M 3 3 L 8 11 L 3 9 Z" });
  appendSvgElement(angled, "path", { d: "M -2 9 L 0 17 L 2 9 Z" });
}

function appendCapabilityMarker(svg, entry) {
  const point = entry.point;
  if (!point || !entry.markers?.length) return;
  const spacing = 20;
  const startX = -((entry.markers.length - 1) * spacing) / 2;
  const yOffset = Math.max(16, entry.lines.length * 13 + 8);
  const group = appendSvgElement(svg, "g", {
    class: "capability-marker",
    "data-country": entry.country.name,
    transform: `translate(${point.x.toFixed(2)} ${(point.y + yOffset).toFixed(2)})`
  });
  entry.markers.forEach((marker, index) => {
    const icon = appendSvgElement(group, "g", {
      class: `capability-marker-icon capability-marker-${marker}`,
      transform: `translate(${(startX + index * spacing).toFixed(2)} 0) scale(0.72)`
    });
    if (marker === "nuclear") appendNuclearSymbol(icon);
    if (marker === "satellite") appendSatelliteSymbol(icon);
    if (marker === "missile") appendMissileSymbol(icon);
  });
}

function moderatorDetailHtml(country) {
  if (isSharedStaging(country.name)) {
    const config = sharedStagingConfig(country.name);
    const rows = game.players.map((player) => `<p>${player.name}: ${sharedStagingTroops(country.name, player.id)}</p>`).join("");
    return `
      <strong>${country.name}</strong>
      <p>Shared staging area</p>
      <p>Unclaimed tied troops: ${Number(game[config.unclaimedKey] || 0)}</p>
      ${rows}
    `;
  }
  const owner = game.ownership[country.name];
  return `
    <strong>${country.name}</strong>
    <p>Region: ${country.region}</p>
    <p>Network: ${country.network || "None"}</p>
    <p>Magnitude: ${country.magnitude}</p>
    <p>Owner: ${playerName(owner)}</p>
    <p>Troops: ${countryTroops(country.name) || 0}</p>
    ${owner ? `<p>Capital: ${isCapitalCountry(country.name, owner) ? "Yes" : "No"}</p>` : ""}
  `;
}

function selectVisibleMapCountry(countryName, visible, playerId, svgId = "playerMap", detailsId = "mapDetails") {
  const entry = visible.get(countryName);
  if (!entry) return;
  selectedMapCountry = countryName;
  $(svgId).querySelectorAll(".map-country").forEach((node) => {
    node.classList.toggle("active", node.dataset.country === countryName);
  });
  $(detailsId).innerHTML = visibleDetailHtml(entry.country, entry.visibility, playerId) + contextualActionHtml(entry.country, playerId, detailsId);
  updateContextAttackDice(detailsId);
  updateContextClaimAmount(detailsId);
}

function applyKnownOwnerColor(path, country) {
  if (isSharedStaging(country.name)) return;
  const owner = game.ownership[country.name];
  path.style.fill = owner ? playerColor(owner) : "";
}

function selectModeratorMapCountry(countryName) {
  const country = placeByName(countryName);
  if (!country) return;
  selectedModeratorMapCountry = countryName;
  $("moderatorMap").querySelectorAll(".map-country").forEach((node) => {
    node.classList.toggle("active", node.dataset.country === countryName);
  });
  $("moderatorMapDetails").innerHTML = moderatorDetailHtml(country);
}

function countryFromMapEvent(event, svg) {
  const node = event.target.closest?.("[data-country]");
  if (!node || !svg.contains(node)) return null;
  return node.dataset.country || null;
}

function selectCurrentVisibleCountry(countryName, player = currentPlayer(), svgId = "playerMap", detailsId = "mapDetails") {
  const playerId = player?.id;
  if (!countryName || !playerId) return;
  const visible = new Map(visibleCountriesFor(playerId).map(({ country, visibility }) => [country.name, { country, visibility }]));
  selectVisibleMapCountry(countryName, visible, playerId, svgId, detailsId);
}

function renderPlayerMapFor(player, { svgId, detailsId, unmappedId, labelId }) {
  if (labelId) $(labelId).textContent = player ? player.name : "No active player";
  const playerId = player?.id;
  if (!playerId) {
    $(svgId).innerHTML = "";
    $(unmappedId).innerHTML = "";
    $(detailsId).innerHTML = "<strong>No active player</strong>";
    return;
  }
  const visible = new Map(visibleCountriesFor(playerId).map(({ country, visibility }) => [country.name, { country, visibility }]));
  const mapped = new Set();
  const shaped = new Set(mapFeatures.filter((feature) => feature.riskName && visible.has(feature.riskName)).map((feature) => feature.riskName));
  const labels = new Map();
  const svg = $(svgId);
  applyMapView();
  svg.innerHTML = "";
  appendOceanLayer(svg, globeView);
  for (const feature of mapFeatures) {
    if (!feature.riskName || !visible.has(feature.riskName)) continue;
    const { country, visibility } = visible.get(feature.riskName);
    const pathData = pathForFeature(feature);
    if (!pathData) continue;
    mapped.add(feature.riskName);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("class", `map-country ${visibilityClass(visibility, country, playerId)}`);
    if (visibility !== "Same region") applyKnownOwnerColor(path, country);
    path.dataset.country = country.name;
    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = country.name;
    path.appendChild(title);
    path.addEventListener("click", (event) => {
      event.stopPropagation();
      if (suppressMapClick) {
        suppressMapClick = false;
        return;
      }
      selectVisibleMapCountry(country.name, visible, playerId, svgId, detailsId);
    });
    svg.appendChild(path);
    const candidates = labelCandidatePointsForFeature(feature);
    const markers = visibleCapabilityMarkers(country, visibility, playerId);
    if (candidates.length) {
      const existing = labels.get(country.name);
      if (existing) {
        existing.candidates.push(...candidates);
        if (markers.length) existing.markers = markers;
      } else {
        const ownerId = visibility === "Same region" ? null : game.ownership[country.name];
        labels.set(country.name, { country, visibility, ownerId, markers, lines: visibleLabelLines(country, visibility, playerId), candidates });
      }
    }
  }
  for (const entry of chooseMapLabels([...labels.values()])) {
    appendCapabilityMarker(svg, entry);
    appendMapLabel(svg, entry, (countryName) => selectVisibleMapCountry(countryName, visible, playerId, svgId, detailsId));
  }

  const unmapped = [...visible.values()]
    .filter(({ country }) => !shaped.has(country.name))
    .sort((a, b) => a.country.name.localeCompare(b.country.name));
  $(unmappedId).innerHTML = unmapped.length
    ? `<p class="note">Visible places without a map shape:</p>${unmapped.map(({ country, visibility }) => `<button type="button" class="badge visibility-chip ${visibilityClass(visibility, country, playerId)}" data-unmapped-country="${country.name}">${country.name} · ${visibility}</button>`).join("")}`
    : "";
  $(unmappedId).querySelectorAll("[data-unmapped-country]").forEach((button) => {
    button.addEventListener("click", () => {
      selectVisibleMapCountry(button.dataset.unmappedCountry, visible, playerId, svgId, detailsId);
    });
  });

  const selected = selectedMapCountry ? visible.get(selectedMapCountry) : null;
  if (selected) {
    svg.querySelectorAll(".map-country").forEach((node) => {
      node.classList.toggle("active", node.dataset.country === selectedMapCountry);
    });
  }
  $(detailsId).innerHTML = selected
    ? visibleDetailHtml(selected.country, selected.visibility, playerId) + contextualActionHtml(selected.country, playerId, detailsId)
    : "<strong>Visible Map</strong><p>Select a country on the map or a visible place below to see details.</p>";
  updateContextAttackDice(detailsId);
  updateContextClaimAmount(detailsId);
}

function renderVisible() {
  const player = visibleSessionPlayer();
  setOptions($("visiblePlayer"), player ? [player] : [], (p) => p.name, (p) => p.id);
  if (player) $("visiblePlayer").value = player.id;
  renderPlayerMapFor(player, {
    svgId: "playerMap",
    detailsId: "mapDetails",
    unmappedId: "unmappedVisible",
    labelId: "visiblePlayerLabel"
  });
  renderRegionProgress(player, "regionProgress");
}

function renderPlanningVisible() {
  const player = planningMapPlayer();
  renderPlayerMapFor(player, {
    svgId: "planningPlayerMap",
    detailsId: "planningMapDetails",
    unmappedId: "planningUnmappedVisible",
    labelId: "planningVisiblePlayerLabel"
  });
  renderRegionProgress(player, "planningRegionProgress");
}

function renderModeratorMap() {
  const svg = $("moderatorMap");
  if (!svg) return;
  applyMapView();
  svg.innerHTML = "";
  appendOceanLayer(svg, moderatorGlobeView);

  const labels = new Map();
  for (const feature of mapFeatures) {
    if (!feature.riskName) continue;
    const country = placeByName(feature.riskName);
    if (!country) continue;
    const pathData = pathForFeatureWithView(feature, moderatorGlobeView);
    if (!pathData) continue;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("class", `map-country ${isSharedStaging(country.name) ? "map-region" : game.ownership[country.name] ? "map-known" : "map-unowned"}`);
    applyKnownOwnerColor(path, country);
    path.dataset.country = country.name;
    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = country.name;
    path.appendChild(title);
    path.addEventListener("click", () => selectModeratorMapCountry(country.name));
    svg.appendChild(path);
    const candidates = labelCandidatePointsForFeature(feature, moderatorGlobeView);
    if (candidates.length) {
      const existing = labels.get(country.name);
      if (existing) {
        existing.candidates.push(...candidates);
      } else {
        labels.set(country.name, { country, ownerId: game.ownership[country.name], lines: moderatorLabelLines(country), candidates });
      }
    }
  }
  for (const entry of chooseMapLabels([...labels.values()])) {
    appendMapLabel(svg, entry, selectModeratorMapCountry);
  }

  const selected = selectedModeratorMapCountry ? placeByName(selectedModeratorMapCountry) : null;
  if (selected) {
    svg.querySelectorAll(".map-country").forEach((node) => {
      node.classList.toggle("active", node.dataset.country === selectedModeratorMapCountry);
    });
  }
  $("moderatorMapDetails").innerHTML = selected
    ? moderatorDetailHtml(selected)
    : "<strong>World Map</strong><p>Select a country on the map to see its full information.</p>";
}

function renderTimelineMap() {
  const panel = $("timelinePanel");
  if (!panel) return;
  const snapshots = game.turnHistory || [];
  const showTimeline = game.phase === "gameover" && snapshots.length > 0;
  panel.classList.toggle("hidden", !showTimeline);
  if (!showTimeline) return;
  const slider = $("timelineSlider");
  slider.max = String(Math.max(0, snapshots.length - 1));
  game.timelineIndex = Math.max(0, Math.min(Number(game.timelineIndex || snapshots.length - 1), snapshots.length - 1));
  slider.value = String(game.timelineIndex);
  const snapshot = snapshots[game.timelineIndex];
  $("timelineLabel").textContent = snapshot.label || `Snapshot ${game.timelineIndex + 1}`;

  const svg = $("timelineMap");
  svg.setAttribute("viewBox", "0 0 1000 500");
  svg.innerHTML = "";
  appendOceanLayer(svg, moderatorGlobeView);

  const labels = new Map();
  for (const feature of mapFeatures) {
    if (!feature.riskName) continue;
    const country = placeByName(feature.riskName);
    if (!country) continue;
    const pathData = pathForFeatureWithView(feature, moderatorGlobeView);
    if (!pathData) continue;
    const ownerId = snapshot.ownership?.[country.name];
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("class", `map-country ${isSharedStaging(country.name) ? "map-region" : ownerId ? "map-known" : "map-unowned"}`);
    if (ownerId && !isSharedStaging(country.name)) path.style.fill = playerColor(ownerId);
    path.dataset.country = country.name;
    svg.appendChild(path);
    const candidates = labelCandidatePointsForFeature(feature, moderatorGlobeView);
    if (candidates.length) {
      const existing = labels.get(country.name);
      if (existing) {
        existing.candidates.push(...candidates);
      } else {
        labels.set(country.name, { country, ownerId, lines: snapshotLabelLines(country, snapshot), candidates });
      }
    }
  }
  for (const entry of chooseMapLabels([...labels.values()])) {
    appendMapLabel(svg, entry, () => {});
  }
}

function renderLog() {
  $("logList").innerHTML = game.log
    .filter(canSeeLogEntry)
    .map((item) => `<li>${logText(item)}</li>`)
    .join("");
}

async function loadManualContent() {
  const target = $("manualContent");
  if (!target || target.dataset.loaded === "true") return;
  if (!manualLoadPromise) {
    manualLoadPromise = fetch("PLAYER_MANUAL.html").then((response) => {
      if (!response.ok) throw new Error("Manual could not be loaded.");
      return response.text();
    });
  }
  try {
    target.innerHTML = await manualLoadPromise;
    target.dataset.loaded = "true";
  } catch {
    target.textContent = "The player guide could not be loaded.";
  }
}

function canOpenTab(name) {
  if (!game) return false;
  if (name === "moderator") return false;
  if (name === "planning") return game.phase === "planning";
  if (name === "turn") return game.phase !== "gameover";
  if (name === "manual") return true;
  return name === "log";
}

function renderTabs() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.disabled = !canOpenTab(button.dataset.tab);
  });
}

function preferredOpenTab() {
  if (canOpenTab("planning")) return "planning";
  if (canOpenTab("turn")) return "turn";
  return "log";
}

function render() {
  $("entryView").classList.toggle("hidden", Boolean(game) || setupMode);
  $("setupView").classList.toggle("hidden", Boolean(game) || !setupMode);
  $("gameView").classList.toggle("hidden", !game);
  $("headerGameIdBox").classList.toggle("hidden", !game || !onlineGameId);
  $("forfeitButton").classList.toggle("hidden", !game || !sessionPlayer() || sessionPlayer()?.eliminated || game.phase === "gameover");
  rememberOnlineGameId(onlineGameId);
  if (!game) {
    $("statusLine").textContent = setupMode ? "Set up a new online game" : "Create or load an online game";
    return;
  }
  if (game.phase === "planning" && allRecruitsPlaced()) {
    resolvePlanning();
    return;
  }
  if (game.phase === "turn") {
    const turnPlayerId = currentPlayer()?.id || "";
    if (turnPlayerId && lastRenderedTurnPlayerId && turnPlayerId !== lastRenderedTurnPlayerId) {
      game.turnStage = "attack";
      selectedMapCountry = null;
    }
    lastRenderedTurnPlayerId = turnPlayerId;
  } else if (game.phase !== "planning") {
    lastRenderedTurnPlayerId = "";
  }
  renderTabs();
  renderSummary();
  renderBoard();
  renderModeratorMap();
  renderTimelineMap();
  renderPlanning();
  renderTurn();
  renderVisible();
  renderLog();
  promptPendingNuclearDecision();
  const activeTab = document.querySelector(".tab.active")?.dataset.tab;
  showTab(canOpenTab(activeTab) ? activeTab : preferredOpenTab());
}

function showTab(name) {
  if (!canOpenTab(name)) {
    if (name === "planning" && game?.phase === "turn") {
      alert("Round planning has already been resolved. It will reopen when a new round begins.");
    }
    return;
  }
  document.querySelectorAll(".tab").forEach((button) => button.classList.toggle("active", button.dataset.tab === name));
  document.querySelectorAll(".tab-view").forEach((view) => view.classList.add("hidden"));
  $(`${name}Tab`).classList.remove("hidden");
  if (name === "turn") {
    $("visiblePlayer").dataset.followTurn = "true";
    selectedMapCountry = null;
    renderVisible();
  }
}

function bindInteractivePlayerMap({ svgId, getPlayer, renderMap, detailsId, resetButtonId = null }) {
  const svg = $(svgId);
  if (!svg) return;
  svg.addEventListener("click", (event) => {
    if (suppressMapClick) {
      suppressMapClick = false;
      return;
    }
    const countryName = countryFromMapEvent(event, svg);
    selectCurrentVisibleCountry(countryName, getPlayer(), svgId, detailsId);
  });

  svg.addEventListener("wheel", (event) => {
    event.preventDefault();
    const cursorPoint = mapCursorPoint(event, svg);
    const cursorGeo = unprojectPointForView(cursorPoint, globeView);
    const zoomFactor = event.deltaY < 0 ? MAP_ZOOM_STEP : 1 / MAP_ZOOM_STEP;
    globeView.scale = Math.min(PLAYER_MAP_MAX_SCALE, Math.max(MAP_MIN_SCALE, globeView.scale * zoomFactor));
    nudgeViewToCursor(globeView, cursorGeo, cursorPoint);
    renderMap();
  }, { passive: false });

  svg.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const countryName = countryFromMapEvent(event, svg);
    mapDrag = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      countryName,
      moved: false,
      view: { ...globeView }
    };
    svg.classList.add("panning");
    svg.setPointerCapture(event.pointerId);
  });

  svg.addEventListener("pointermove", (event) => {
    if (!mapDrag || mapDrag.id !== event.pointerId) return;
    const rect = svg.getBoundingClientRect();
    const pixelDx = event.clientX - mapDrag.startX;
    const pixelDy = event.clientY - mapDrag.startY;
    if (Math.hypot(pixelDx, pixelDy) > 4) mapDrag.moved = true;
    const dx = pixelDx / rect.width;
    const dy = pixelDy / rect.height;
    globeView.lon = ((((mapDrag.view.lon - dx * 105) + 180) % 360) + 360) % 360 - 180;
    globeView.lat = Math.max(-80, Math.min(80, mapDrag.view.lat + dy * 52));
    globeView.scale = mapDrag.view.scale;
    renderMap();
  });

  function endDrag(event) {
    if (!mapDrag || mapDrag.id !== event.pointerId) return;
    if (mapDrag.countryName && !mapDrag.moved) {
      selectCurrentVisibleCountry(mapDrag.countryName, getPlayer(), svgId, detailsId);
    }
    suppressMapClick = mapDrag.moved;
    mapDrag = null;
    svg.classList.remove("panning");
  }

  svg.addEventListener("pointerup", endDrag);
  svg.addEventListener("pointercancel", endDrag);
  if (resetButtonId) $(resetButtonId).addEventListener("click", resetMapView);
}

function bindMapControls() {
  bindInteractivePlayerMap({
    svgId: "playerMap",
    getPlayer: visibleSessionPlayer,
    renderMap: renderVisible,
    detailsId: "mapDetails",
    resetButtonId: "resetMapButton"
  });
  bindInteractivePlayerMap({
    svgId: "planningPlayerMap",
    getPlayer: planningMapPlayer,
    renderMap: renderPlanningVisible,
    detailsId: "planningMapDetails"
  });
}

function shouldIgnoreMapKeyboardEvent(event) {
  const target = event.target;
  return Boolean(target && target.closest?.("input, textarea, select, button, [contenteditable='true']"));
}

function panVisiblePlayerMap(direction) {
  if (!game || game.phase === "gameover") return false;
  const planningOpen = !$("planningTab").classList.contains("hidden");
  const turnOpen = !$("turnTab").classList.contains("hidden");
  if (!planningOpen && !turnOpen) return false;
  globeView.lon = ((((globeView.lon + direction * MAP_KEYBOARD_PAN_DEGREES) + 180) % 360) + 360) % 360 - 180;
  if (planningOpen) {
    renderPlanningVisible();
  } else {
    renderVisible();
  }
  return true;
}

function bindMapKeyboardControls() {
  document.addEventListener("keydown", (event) => {
    if (shouldIgnoreMapKeyboardEvent(event)) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const direction = event.key === "ArrowLeft" ? -1 : 1;
    if (panVisiblePlayerMap(direction)) event.preventDefault();
  });
}

function bindModeratorMapControls() {
  const svg = $("moderatorMap");
  svg.addEventListener("click", (event) => {
    if (suppressModeratorMapClick) {
      suppressModeratorMapClick = false;
      return;
    }
    const countryName = countryFromMapEvent(event, svg);
    if (!countryName) return;
    selectModeratorMapCountry(countryName);
  });

  svg.addEventListener("wheel", (event) => {
    event.preventDefault();
    const cursorPoint = mapCursorPoint(event, svg);
    const cursorGeo = unprojectPointForView(cursorPoint, moderatorGlobeView);
    const zoomFactor = event.deltaY < 0 ? MAP_ZOOM_STEP : 1 / MAP_ZOOM_STEP;
    moderatorGlobeView.scale = Math.min(MODERATOR_MAP_MAX_SCALE, Math.max(MAP_MIN_SCALE, moderatorGlobeView.scale * zoomFactor));
    nudgeViewToCursor(moderatorGlobeView, cursorGeo, cursorPoint);
    renderModeratorMap();
  }, { passive: false });

  svg.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const countryName = countryFromMapEvent(event, svg);
    moderatorMapDrag = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      countryName,
      moved: false,
      view: { ...moderatorGlobeView }
    };
    svg.classList.add("panning");
    svg.setPointerCapture(event.pointerId);
  });

  svg.addEventListener("pointermove", (event) => {
    if (!moderatorMapDrag || moderatorMapDrag.id !== event.pointerId) return;
    const rect = svg.getBoundingClientRect();
    const pixelDx = event.clientX - moderatorMapDrag.startX;
    const pixelDy = event.clientY - moderatorMapDrag.startY;
    if (Math.hypot(pixelDx, pixelDy) > 4) moderatorMapDrag.moved = true;
    const dx = pixelDx / rect.width;
    const dy = pixelDy / rect.height;
    moderatorGlobeView.lon = ((((moderatorMapDrag.view.lon - dx * 105) + 180) % 360) + 360) % 360 - 180;
    moderatorGlobeView.lat = Math.max(-80, Math.min(80, moderatorMapDrag.view.lat + dy * 52));
    moderatorGlobeView.scale = moderatorMapDrag.view.scale;
    renderModeratorMap();
  });

  function endDrag(event) {
    if (!moderatorMapDrag || moderatorMapDrag.id !== event.pointerId) return;
    if (moderatorMapDrag.countryName && !moderatorMapDrag.moved) {
      selectModeratorMapCountry(moderatorMapDrag.countryName);
    }
    suppressModeratorMapClick = moderatorMapDrag.moved;
    moderatorMapDrag = null;
    svg.classList.remove("panning");
  }

  svg.addEventListener("pointerup", endDrag);
  svg.addEventListener("pointercancel", endDrag);
  $("resetModeratorMapButton").addEventListener("click", resetModeratorMapView);
}

function resolvePlanning() {
  if (game.phase === "gameover") {
    alert("The game is over.");
    return;
  }
  const stillUnsubmitted = playersAwaitingRecruitPlans();
  if (stillUnsubmitted.length) {
    alert(`Recruit plans are still needed from: ${stillUnsubmitted.map((player) => player.name).join(", ")}.`);
    return;
  }
  applySubmittedRecruitPlans();
  game.phase = "turn";
  game.turnStage = "attack";
  game.turnHadAction = false;
  game.consecutivePasses = [];
  game.recruitPlans = {};
  addLog(`Round ${game.round} action turns begin.`);
  resetMapView(false);
  saveGame();
  showTab("turn");
  render();
}

function applySubmittedRecruitPlans() {
  for (const player of activePlayers()) {
    const plan = playerRecruitPlan(player.id);
    if (!plan?.submitted || player.reserve <= 0) continue;
    const placements = plan.placements || {};
    let placed = 0;
    for (const [country, rawAmount] of Object.entries(placements)) {
      const amount = Math.max(0, Number(rawAmount || 0));
      if (amount <= 0) continue;
      placed += amount;
      if (isSharedStaging(country)) {
        const config = sharedStagingConfig(country);
        game[config.troopsKey][player.id] = sharedStagingTroops(country, player.id) + amount;
      } else if (game.ownership[country] === player.id) {
        game.troops[country] = countryTroops(country) + amount;
      }
    }
    player.reserve = Math.max(0, player.reserve - placed);
    addPrivateLog(`${player.name}'s recruit plan resolves: ${Object.entries(placements).filter(([, amount]) => Number(amount) > 0).sort(([a], [b]) => a.localeCompare(b)).map(([country, amount]) => `${amount} to ${country}`).join("; ")}.`, [player.id]);
  }
}

function resolveEndOfTurnTransfers() {
  game.pendingTransfers = [];
  return true;
}

function handleAttack(event) {
  event.preventDefault();
  if (game.phase === "gameover") {
    alert("The game is over.");
    return;
  }
  const attacker = currentPlayer();
  const from = $("attackFrom").value;
  const target = $("attackTo").value;
  const attackDice = Number($("attackDice").value);
  if (!attacker || !from || !target || !attackDice) return;
  const option = viableAttackOptionsFor(from).find((item) => item.target === target);
  const maxAttackDice = option ? attackKeptDiceMaxFor(from, option.maxDice) : 0;
  if (!option || attackDice < 1 || attackDice > maxAttackDice) {
    alert("That attack dice choice is not available.");
    return;
  }
  if (option?.limited) {
    handleLimitedAttack(attacker, from, target, option);
    return;
  }
  markTurnAction();
  const defenderId = game.ownership[target];
  const targetIsNuclear = isNuclearPower(target, defenderId);
  const defenderDice = defenderDiceFor(target);
  const attackRoll = rollCapitalAwareDice(from, attackDice);
  const defendRoll = rollCapitalAwareDice(target, defenderDice);
  let attackerLoss = 0;
  let defenderLoss = 0;
  for (let i = 0; i < Math.min(attackRoll.kept.length, defendRoll.kept.length); i += 1) {
    if (attackRoll.kept[i] > defendRoll.kept[i]) defenderLoss += 1;
    else attackerLoss += 1;
  }
  game.troops[from] -= attackerLoss;
  game.troops[target] -= defenderLoss;
  const capitalNotes = [
    isCapitalCountry(from, attacker.id) ? `${from} is ${attacker.name}'s capital` : "",
    isCapitalCountry(target, defenderId) ? `${target} is ${playerName(defenderId)}'s capital` : ""
  ].filter(Boolean);
  if (countryTroops(from) <= 0) removeCountryOwner(from);
  addPrivateLog(`${attacker.name} attacks ${target} from ${from}. ${diceLogText("Attack rolls", attackRoll)}; ${diceLogText("defense rolls", defendRoll)}. Losses: ${attackerLoss} attacker, ${defenderLoss} defender.${capitalNotes.length ? ` Capital bonus: ${capitalNotes.join("; ")}.` : ""}`, [attacker.id, defenderId]);
  let conquered = false;
  if (countryTroops(target) <= 0 && game.ownership[from] === attacker.id && countryTroops(from) > 1) {
    const requestedMove = Number($("conquestMove").value || attackDice);
    const move = Math.max(1, Math.min(requestedMove, countryTroops(from) - 1));
    setCountryOwner(target, attacker.id);
    game.troops[target] = move;
    game.troops[from] -= move;
    if (countryTroops(from) <= 0) removeCountryOwner(from);
    conquered = true;
    addPrivateLog(`${attacker.name} conquers ${target} from ${playerName(defenderId)} and moves ${move} troops in.`, [attacker.id, defenderId]);
    announceNewRegionControls(attacker.id);
  } else if (countryTroops(target) <= 0) {
    removeCountryOwner(target);
    addPrivateLog(`${target} is left without troops after ${attacker.name}'s attack from ${from}.`, [attacker.id, defenderId]);
  }
  if (targetIsNuclear) {
    applyNuclearRetaliation({
      targetName: target,
      actorId: attacker.id,
      defenderId,
      excludeCountry: conquered ? target : null,
      action: conquered ? "conquers" : "attacks"
    });
  }
  checkEliminations();
  refreshRegionControlAnnouncements();
  saveGame();
  render();
}

function handleLimitedAttack(attacker, from, target, option = null) {
  const defenderId = game.ownership[target];
  const targetCountry = countryByName.get(target);
  const targetIsNuclear = isNuclearPower(target, defenderId);
  if (!defenderId) {
    const minimumMove = Math.max(1, targetCountry.magnitude);
    const requestedMove = Number($("conquestMove").value || minimumMove);
    const movable = countryTroops(from) - 1;
    if (requestedMove > movable) {
      alert("The starting country does not have enough movable troops.");
      addPrivateLog(`${attacker.name} probes ${target} from ${from}. The starting country does not have enough movable troops.`, [attacker.id]);
    } else if (requestedMove < minimumMove) {
      alert("Move on conquest is not high enough.");
      addPrivateLog(`${attacker.name} probes ${target} from ${from}. Move on conquest is not high enough.`, [attacker.id]);
    } else {
      markTurnAction();
      setCountryOwner(target, attacker.id);
      game.troops[target] = requestedMove;
      game.troops[from] -= requestedMove;
      addPrivateLog(`${attacker.name} probes ${target} from ${from}, finds it unowned, and claims it with ${requestedMove} troops.`, [attacker.id]);
      announceNewRegionControls(attacker.id);
      if (targetIsNuclear) {
        applyNuclearRetaliation({
          targetName: target,
          actorId: attacker.id,
          excludeCountry: target,
          action: "claims"
        });
        checkEliminations();
        refreshRegionControlAnnouncements();
      }
    }
    saveGame();
    render();
    return;
  }

  markTurnAction();
  const attackDice = attackKeptDiceMaxFor(from, option?.maxDice || attackDiceLimitFor(from, 1));
  const defenderDice = defenderDiceFor(target);
  const attackRoll = rollCapitalAwareDice(from, attackDice);
  const defendRoll = rollCapitalAwareDice(target, defenderDice);
  let attackerLoss = 0;
  let defenderLoss = 0;
  for (let i = 0; i < Math.min(attackRoll.kept.length, defendRoll.kept.length); i += 1) {
    if (attackRoll.kept[i] > defendRoll.kept[i]) defenderLoss += 1;
    else attackerLoss += 1;
  }
  let conquered = false;
  if (attackerLoss > 0) {
    game.troops[from] -= attackerLoss;
    if (countryTroops(from) <= 0) removeCountryOwner(from);
    addPrivateLog(`${attacker.name} probes ${target} from ${from}. ${attackerLoss} attacking troop${attackerLoss === 1 ? "" : "s"} die${attackerLoss === 1 ? "s" : ""}.`, [attacker.id, defenderId]);
  }
  if (defenderLoss > 0) {
    game.troops[target] -= defenderLoss;
    if (countryTroops(target) <= 0 && game.ownership[from] === attacker.id && countryTroops(from) > 1) {
      const requestedMove = Number($("conquestMove").value || 1);
      const move = Math.max(1, Math.min(requestedMove, countryTroops(from) - 1));
      setCountryOwner(target, attacker.id);
      game.troops[target] = move;
      game.troops[from] -= move;
      if (countryTroops(from) <= 0) removeCountryOwner(from);
      conquered = true;
      addPrivateLog(`${attacker.name} probes ${target} from ${from}, conquers it, and moves ${move} troops in.`, [attacker.id, defenderId]);
      announceNewRegionControls(attacker.id);
    } else if (countryTroops(target) <= 0) {
      removeCountryOwner(target);
      addPrivateLog(`${target} is left without troops after ${attacker.name}'s probe from ${from}.`, [attacker.id, defenderId]);
    } else if (attackerLoss <= 0) {
      addPrivateLog(`${attacker.name} probes ${target} from ${from}. No visible result.`, [attacker.id]);
    }
  } else if (attackerLoss <= 0) {
    addPrivateLog(`${attacker.name} probes ${target} from ${from}. No visible result.`, [attacker.id]);
  }
  if (targetIsNuclear) {
    applyNuclearRetaliation({
      targetName: target,
      actorId: attacker.id,
      defenderId,
      excludeCountry: conquered ? target : null,
      action: conquered ? "conquers" : "attacks"
    });
  }
  checkEliminations();
  refreshRegionControlAnnouncements();
  saveGame();
  render();
}

function updateContextAttackDice(rootId = "mapDetails") {
  const root = $(rootId);
  if (!root) return;
  root.querySelectorAll('[data-context-action="attack"]').forEach((form) => {
    const from = form.dataset.from;
    const target = form.querySelector('[name="target"]')?.value;
    const diceSelect = form.querySelector('[name="dice"]');
    const moveInput = form.querySelector('[name="move"]');
    const option = viableAttackOptionsFor(from).find((item) => item.target === target);
    const max = option ? attackKeptDiceMaxFor(from, option.maxDice) : 0;
    diceSelect.innerHTML = "";
    for (let value = 1; value <= max; value += 1) {
      const optionNode = document.createElement("option");
      optionNode.value = String(value);
      optionNode.textContent = String(value);
      diceSelect.appendChild(optionNode);
    }
    if (max > 0) diceSelect.value = String(max);
    if (moveInput) {
      const movable = Math.max(1, countryTroops(from) - 1);
      moveInput.max = String(movable);
      moveInput.value = String(movable);
    }
  });
}

function updateContextClaimAmount(rootId = "mapDetails") {
  const root = $(rootId);
  if (!root) return;
  root.querySelectorAll('[data-context-action="claim"]').forEach((form) => {
    const target = countryByName.get(form.querySelector('[name="target"]')?.value);
    const input = form.querySelector('[name="amount"]');
    const min = Math.max(1, target?.magnitude || 0);
    const max = Math.max(1, countryTroops(form.dataset.from) - 1);
    input.min = String(min);
    input.max = String(max);
    input.value = String(max);
  });
}

function submitContextAction(form) {
  const action = form.dataset.contextAction;
  if (action === "place-recruits") {
    $("placeCountry").value = form.dataset.country;
    $("placeAmount").value = form.elements.amount.value;
    $("placeForm").requestSubmit();
    return;
  }
  if (action === "claim") {
    $("claimFrom").value = form.dataset.from;
    updateClaimTargets();
    $("claimTo").value = form.elements.target.value;
    $("claimAmount").value = form.elements.amount.value;
    $("claimForm").requestSubmit();
    return;
  }
  if (action === "attack") {
    $("attackFrom").value = form.dataset.from;
    updateAttackTargets();
    $("attackTo").value = form.elements.target.value;
    updateAttackDice();
    $("attackDice").value = form.elements.dice.value;
    $("conquestMove").value = form.elements.move.value;
    $("attackForm").requestSubmit();
    return;
  }
  if (action === "transfer") {
    $("transferFrom").value = form.dataset.from;
    updateTransferCountries();
    $("transferTo").value = form.elements.target.value;
    $("transferAmount").value = form.elements.amount.value;
    $("transferForm").requestSubmit();
  }
}

function bindEvents() {
  $("makeNamesButton").addEventListener("click", renderSetupNames);
  $("playerCount").addEventListener("change", renderSetupNames);
  $("showNewGameButton").addEventListener("click", () => {
    rememberOnlineGameId("");
    setupMode = true;
    render();
  });
  $("startGameButton").addEventListener("click", async () => {
    const names = [...document.querySelectorAll(".player-name")].map((input) => input.value.trim()).filter(Boolean);
    if (new Set(names).size !== names.length || names.length < 2) {
      alert("Please enter at least two unique player names.");
      return;
    }
    const creatorName = $("setupPlayerName").value.trim().toLowerCase();
    const creator = names.find((name) => name.toLowerCase() === creatorName);
    if (!creator) {
      alert("Your player name must exactly match one of the players in this game.");
      return;
    }
    startGame(names);
    const player = game.players.find((candidate) => candidate.name.toLowerCase() === creatorName);
    setSession("player", player.id);
    resetMapView(false);
    await createOnlineGame();
    render();
  });
  $("saveButton").addEventListener("click", () => {
    saveGame();
    if (onlineGameId) {
      saveOnlineGame();
      alert("Game saved locally and online.");
    } else {
      alert("Game saved in this browser.");
    }
  });
  $("refreshGameButton").addEventListener("click", async () => {
    await refreshOnlineGame({ forceRender: true });
  });
  $("forfeitButton").addEventListener("click", forfeitCurrentSessionPlayer);
  $("loadOnlineGameButton").addEventListener("click", () => loadOnlineGame());
  $("copyOnlineGameIdButton").addEventListener("click", async () => {
    if (!onlineGameId) {
      alert("There is no online Game ID yet.");
      return;
    }
    try {
      await navigator.clipboard.writeText(onlineGameId);
      setOnlineStatus("Game ID copied.");
    } catch {
      alert(`Game ID: ${onlineGameId}`);
    }
  });
  $("mainMenuButton").addEventListener("click", () => {
    if (game && !confirm("Return to the main menu? Your online game will not be deleted.")) return;
    stopOnlineRefresh();
    game = null;
    setupMode = false;
    resetMapView();
    resetModeratorMapView();
    render();
  });
  document.querySelectorAll(".tab").forEach((button) => button.addEventListener("click", () => showTab(button.dataset.tab)));
  ["mapDetails", "planningMapDetails"].forEach((id) => {
    $(id).addEventListener("change", (event) => {
      if (event.target.matches(".context-attack-target")) updateContextAttackDice(id);
      if (event.target.closest('[data-context-action="claim"]')) updateContextClaimAmount(id);
    });
    $(id).addEventListener("submit", (event) => {
      const form = event.target.closest("[data-context-action]");
      if (!form) return;
      event.preventDefault();
      submitContextAction(form);
    });
    $(id).addEventListener("click", (event) => {
      const button = event.target.closest("[data-context-button]");
      if (!button) return;
      if (button.dataset.contextButton === "finish-attacking") $("finishAttackButton").click();
      if (button.dataset.contextButton === "end-turn") $("endTurnButton").click();
    });
  });
  $("openLogButton").addEventListener("click", () => {
    renderLog();
    $("logTab").classList.remove("hidden");
  });
  $("closeLogButton").addEventListener("click", () => $("logTab").classList.add("hidden"));
  $("openManualButton").addEventListener("click", () => {
    loadManualContent();
    $("manualTab").classList.remove("hidden");
  });
  $("closeManualButton").addEventListener("click", () => $("manualTab").classList.add("hidden"));
  bindMapControls();
  bindMapKeyboardControls();
  bindModeratorMapControls();
  $("boardSearch").addEventListener("input", renderBoard);
  ["filterCountry", "filterRegion", "filterNetwork", "filterMagnitude", "filterOwner", "filterTroops"].forEach((id) => {
    $(id).addEventListener("input", renderBoard);
  });
  $("placePlayer").addEventListener("change", updatePlaceCountries);
  $("transferFrom").addEventListener("change", updateTransferCountries);
  $("transferAmount").addEventListener("input", () => {
    const max = Number($("transferAmount").max || 0);
    if (max > 0 && Number($("transferAmount").value) > max) $("transferAmount").value = max;
  });
  $("placeAmount").addEventListener("input", () => {
    const max = Number($("placeAmount").max || 0);
    if (max > 0 && Number($("placeAmount").value) > max) $("placeAmount").value = max;
  });
  $("claimFrom").addEventListener("change", updateClaimTargets);
  $("claimTo").addEventListener("change", updateClaimTargets);
  $("attackFrom").addEventListener("change", updateAttackTargets);
  $("attackTo").addEventListener("change", updateAttackDice);
  $("placeForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const player = game.players.find((p) => p.id === $("placePlayer").value);
    const country = $("placeCountry").value;
    const amount = Number($("placeAmount").value);
    const draft = loadRecruitDraft(player?.id);
    const remaining = Math.max(0, (player?.reserve || 0) - recruitDraftTotal(draft));
    if (!player || !country || amount < 1 || amount > remaining) {
      alert("That recruit placement is not available for your current plan.");
      return;
    }
    draft[country] = Number(draft[country] || 0) + amount;
    saveRecruitDraft(draft, player.id);
    if (recruitDraftTotal(draft) === player.reserve) {
      await submitRecruitPlan();
      return;
    }
    render();
  });
  $("submitRecruitPlanButton").addEventListener("click", () => submitRecruitPlan());
  $("transferForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const player = currentPlayer();
    const playerId = player?.id;
    const from = $("transferFrom").value;
    const to = $("transferTo").value;
    const amount = Number($("transferAmount").value);
    const maxTransfer = isSharedStaging(from) ? sharedStagingTroops(from, playerId) : movableTroops(from);
    if (!playerId || !from || !to || amount < 1 || amount > maxTransfer || !hasOwnedTransferPath(playerId, from, to)) {
      alert("That transfer is not available.");
      return;
    }
    markTurnAction();
    if (isSharedStaging(from)) {
      const config = sharedStagingConfig(from);
      game[config.troopsKey][playerId] = sharedStagingTroops(from, playerId) - amount;
      game.troops[to] = countryTroops(to) + amount;
    } else if (isSharedStaging(to)) {
      const config = sharedStagingConfig(to);
      game.troops[from] -= amount;
      game[config.troopsKey][playerId] = sharedStagingTroops(to, playerId) + amount;
    } else {
      game.troops[from] -= amount;
      game.troops[to] = countryTroops(to) + amount;
    }
    addPrivateLog(`${player.name} transfers ${amount} from ${from} to ${to}.`, [player.id]);
    resolveSharedStagingUnclaimedTroops();
    saveGame();
    render();
  });
  if ($("resolvePlanningButton")) $("resolvePlanningButton").addEventListener("click", resolvePlanning);
  $("finishAttackButton").addEventListener("click", () => {
    game.turnStage = "transfer";
    render();
  });
  $("mapTurnFlowButton").addEventListener("click", () => {
    if (game.turnStage === "transfer") $("endTurnButton").click();
    else $("finishAttackButton").click();
  });
  $("claimForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (game.phase === "gameover") {
      alert("The game is over.");
      return;
    }
    const player = currentPlayer();
    const from = $("claimFrom").value;
    const target = $("claimTo").value;
    const amount = Number($("claimAmount").value);
    const targetIsNuclear = isNuclearPower(target, game.ownership[target]);
    const min = Math.max(1, countryByName.get(target)?.magnitude || 0);
    if (!player || !from || !target || amount < min || countryTroops(from) - amount < 1 || game.ownership[target]) {
      alert(`Claim requires at least ${min} troops and must leave 1 behind.`);
      return;
    }
    markTurnAction();
    game.troops[from] -= amount;
    setCountryOwner(target, player.id);
    game.troops[target] = amount;
    addPrivateLog(`${player.name} claims ${target} from ${from} with ${amount} troops.`, [player.id]);
    announceNewRegionControls(player.id);
    if (targetIsNuclear) {
      applyNuclearRetaliation({
        targetName: target,
        actorId: player.id,
        excludeCountry: target,
        action: "claims"
      });
      checkEliminations();
    }
    refreshRegionControlAnnouncements();
    saveGame();
    render();
  });
  $("attackForm").addEventListener("submit", handleAttack);
  $("endTurnButton").addEventListener("click", () => {
    if (game.phase === "gameover") return;
    if (!resolveEndOfTurnTransfers()) return;
    const endingPlayer = currentPlayer();
    const automaticRound = endingPlayer ? turnPassTriggersNewRound(endingPlayer.id) : false;
    const remaining = activePlayers().length;
    if (remaining <= 1) {
      concludeGameIfWon();
      saveGame();
      render();
      return;
    }
    if (endingPlayer) recordTurnSnapshot(`After ${endingPlayer.name}'s turn in round ${game.round}`);
    advanceTurn();
    game.turnStage = "attack";
    lastRenderedTurnPlayerId = currentPlayer()?.id || "";
    game.turnHadAction = false;
    if (automaticRound) {
      startNewRound("Every active player passed consecutively, so the round ends automatically");
    } else {
      const roll = Math.floor(Math.random() * remaining) + 1;
      if (roll === 1) {
        startNewRoundAfterRoll(remaining);
      } else {
        addLog(`Round-end roll: ${roll}/${remaining}. The round continues.`);
      }
    }
    if (game.phase === "turn") resetMapView(false);
    saveGame();
    render();
  });
  $("timelineSlider").addEventListener("input", () => {
    if (!game) return;
    game.timelineIndex = Number($("timelineSlider").value || 0);
    saveGame();
    renderTimelineMap();
  });
}

async function init() {
  await loadCountries();
  await loadWorldMap();
  bindEvents();
  initOnlineClient();
  updateJoinRoleFields();
  renderSetupNames();
  render();
}

init().catch((error) => {
  console.error(error);
  $("statusLine").textContent = "Could not load map data.";
});
