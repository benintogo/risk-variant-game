const DATA_URL = "data/risk-places.csv";
const MAP_URL = "data/world-map.json?v=20260519-portugal-crimea-1";
const SAVE_KEY = "risk-variant-moderator-v1";
const ONLINE_GAME_ID_KEY = "risk-variant-online-game-id";
const SESSION_ROLE_KEY = "risk-variant-session-role";
const SESSION_PLAYER_KEY = "risk-variant-session-player-id";

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
let setupMode = false;
let sessionRole = localStorage.getItem(SESSION_ROLE_KEY) || "moderator";
let sessionPlayerId = localStorage.getItem(SESSION_PLAYER_KEY) || "";

const MAP_MIN_SCALE = 145;
const PLAYER_MAP_MAX_SCALE = 7200;
const MODERATOR_MAP_MAX_SCALE = 7200;
const MAP_ZOOM_STEP = 1.12;

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
  Russia: [96, 61],
  "Russian Federation": [96, 61],
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
const ANTARCTICA_PLACE = {
  id: "antarctica",
  name: ANTARCTICA_NAME,
  magnitude: "",
  region: "",
  network: "",
  land: [],
  maritime: []
};

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
  mapFeatures = data.features.map((feature) => ({
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
    ownershipSince: {},
    round: 1,
    turnPointer: 0,
    snakeDirection: 1,
    phase: "setup",
    pendingTransfers: [],
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
    antarcticaUnclaimed: Number(game.antarcticaUnclaimed || 0)
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

function isNuclearPower(countryName, ownerId = game?.ownership?.[countryName]) {
  if (NUCLEAR_POWERS.has(countryName)) return true;
  const requiredCountry = CONDITIONAL_NUCLEAR_POWERS[countryName];
  return Boolean(requiredCountry && ownerId && game.ownership[requiredCountry] === ownerId);
}

function isAntarctica(name) {
  return name === ANTARCTICA_NAME;
}

function placeByName(name) {
  return isAntarctica(name) ? ANTARCTICA_PLACE : countryByName.get(name);
}

function antarcticaTroops(playerId) {
  return Number(game.antarcticaTroops?.[playerId] || 0);
}

function totalAntarcticaTroops() {
  return Object.values(game.antarcticaTroops || {}).reduce((sum, value) => sum + Number(value || 0), Number(game.antarcticaUnclaimed || 0));
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
  if (isAntarctica(name)) return antarcticaTroops(currentPlayer()?.id);
  return Math.max(0, countryTroops(name) - queuedOutgoingTroops(name) - 1);
}

function addLog(message) {
  const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  game.log.push(`${stamp} - ${message}`);
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
  const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
  game.players = sortedNames.map((name, index) => ({
    id: `p${index + 1}`,
    name,
    carry: 0,
    reserve: 0,
    eliminated: false
  }));
  const starts = shuffled(countries).slice(0, game.players.length);
  game.players.forEach((player, index) => {
    const country = starts[index];
    setCountryOwner(country.name, player.id);
    game.troops[country.name] = 10;
    addLog(`${player.name} starts in ${country.name} with 10 troops.`);
  });
  game.phase = "turn";
  game.incomeCalculatedRound = 1;
  game.turnStage = "attack";
  game.turnHadAction = false;
  game.consecutivePasses = [];
  addLog("Round 1 begins with action turns. Initial planning is skipped.");
  recordTurnSnapshot("Initial setup");
  setSession("moderator");
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

function normalizeLoadedGame() {
  if (!game) return;
  game.turnStage ||= "attack";
  game.turnHadAction = Boolean(game.turnHadAction);
  game.consecutivePasses ||= [];
  game.regionControlAnnouncements ||= {};
  game.pendingTransfers ||= [];
  game.antarcticaTroops ||= {};
  game.antarcticaUnclaimed ||= 0;
  game.ownershipSince ||= {};
  game.ownershipTick ||= 1;
  game.planningPlayerId ||= null;
  game.turnHistory ||= [];
  game.timelineIndex = Number(game.timelineIndex || 0);
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

function updateJoinRoleFields() {
  const isPlayer = $("joinRole")?.value === "player";
  $("joinPlayerNameLabel")?.classList.toggle("hidden", !isPlayer);
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
  const gameName = `Risk game - ${new Date().toLocaleString()}`;
  const { data, error } = await onlineClient
    .from(onlineTableName())
    .insert({ name: gameName, [stateColumn]: game })
    .select("id")
    .single();
  if (error) {
    alert(`Supabase could not create the online game: ${error.message}`);
    setOnlineStatus("Online save failed.");
    return;
  }
  rememberOnlineGameId(data.id);
  setOnlineStatus(`Online game created. Share this ID: ${data.id}`);
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
  const { data, error } = await onlineClient
    .from(onlineTableName())
    .select(stateColumn)
    .eq("id", requestedId)
    .single();
  if (error) {
    alert(`Supabase could not load that game: ${error.message}`);
    setOnlineStatus("Online load failed.");
    return;
  }
  game = data[stateColumn];
  normalizeLoadedGame();
  const requestedRole = $("joinRole")?.value || "moderator";
  if (requestedRole === "player") {
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
  } else {
    setSession("moderator");
  }
  setupMode = false;
  rememberOnlineGameId(requestedId);
  resetMapView(false);
  saveLocalGame();
  setOnlineStatus(`Loaded latest online game ${requestedId} at ${onlineTimestamp()}.`);
  render();
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
  const { error } = await onlineClient
    .from(onlineTableName())
    .update({ [stateColumn]: game })
    .eq("id", onlineGameId);
  onlineSaveInFlight = false;
  if (error) {
    if (!options.quiet) alert(`Supabase could not save the online game: ${error.message}`);
    setOnlineStatus("Online save failed.");
    return;
  }
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
  if (isAntarctica(fromName)) {
    return ANTARCTICA_CONNECTIONS.has(toName) && game.ownership[toName] === playerId;
  }
  if (isAntarctica(toName)) {
    return ANTARCTICA_CONNECTIONS.has(fromName) && game.ownership[fromName] === playerId;
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
      options.set(border, { target: border, type: "land", maxDice: 3 });
    }
  }
  for (const border of from.maritime) {
    if (game.ownership[border] && game.ownership[border] !== owner) {
      const existing = options.get(border);
      if (!existing || existing.maxDice > 2) options.set(border, { target: border, type: "maritime", maxDice: 2 });
    }
  }
  for (const country of countries) {
    if (country.name !== from.name && country.region === from.region && game.ownership[country.name] !== owner) {
      const linkType = visibleLinks.get(country.name);
      if (linkType && linkType !== "network") continue;
      if (linkType === "network" && game.ownership[country.name]) {
        options.set(country.name, { target: country.name, type: "network region", maxDice: 1 });
        continue;
      }
      if (!options.has(country.name)) {
        options.set(country.name, { target: country.name, type: "limited region", maxDice: 1, limited: true });
      }
    }
  }
  return [...options.values()].sort((a, b) => a.target.localeCompare(b.target));
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
    if (!current.has(key)) delete game.regionControlAnnouncements[key];
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
    addLog(`${player.name} now controls all countries in ${region}.`);
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
    player.reserve += base + bonus;
    totalAwarded += base + bonus;
    addLog(`${player.name} receives ${base} recruits from magnitude, ${bonus} from regions, and carries ${player.carry.toFixed(2)}.`);
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
    game.planningPlayerId = playersWithRecruits()[0]?.id || null;
    showTab("planning");
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
  const players = activePlayers().sort((a, b) => a.name.localeCompare(b.name));
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

function isPlayerSession() {
  return sessionRole === "player";
}

function playerSessionCanAct() {
  if (!isPlayerSession()) return true;
  return currentPlayer()?.id === sessionPlayerId;
}

function setSession(role, playerId = "") {
  sessionRole = role === "player" ? "player" : "moderator";
  sessionPlayerId = sessionRole === "player" ? playerId : "";
  localStorage.setItem(SESSION_ROLE_KEY, sessionRole);
  if (sessionPlayerId) localStorage.setItem(SESSION_PLAYER_KEY, sessionPlayerId);
  else localStorage.removeItem(SESSION_PLAYER_KEY);
}

function setTurnPointerToPlayer(playerId) {
  const players = activePlayers().sort((a, b) => a.name.localeCompare(b.name));
  const index = players.findIndex((player) => player.id === playerId);
  if (index >= 0) game.turnPointer = index;
}

function advanceTurn() {
  const players = activePlayers().sort((a, b) => a.name.localeCompare(b.name));
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
      const stranded = antarcticaTroops(player.id);
      if (stranded > 0) {
        game.antarcticaUnclaimed = Number(game.antarcticaUnclaimed || 0) + stranded;
        game.antarcticaTroops[player.id] = 0;
      }
      player.eliminated = true;
      player.reserve = 0;
      addLog(`${player.name} is eliminated.`);
    }
  }
  resolveAntarcticaUnclaimedTroops();
  const gameEnded = concludeGameIfWon();
  if (!gameEnded && turnPlayerId && activePlayers().some((player) => player.id === turnPlayerId)) {
    setTurnPointerToPlayer(turnPlayerId);
  }
}

function nuclearLossOrder(playerId, excludeCountry = null) {
  return ownedCountries(playerId)
    .filter((country) => country.name !== excludeCountry && countryTroops(country.name) > 0)
    .map((country) => ({
      country,
      nuclear: isNuclearPower(country.name, playerId),
      since: game.ownershipSince?.[country.name] || Infinity
    }))
    .sort((a, b) => {
      if (a.nuclear !== b.nuclear) return a.nuclear ? 1 : -1;
      if (a.nuclear) {
        const magnitudeDifference = a.country.magnitude - b.country.magnitude;
        if (magnitudeDifference) return magnitudeDifference;
        return b.since - a.since;
      }
      const magnitudeDifference = b.country.magnitude - a.country.magnitude;
      if (magnitudeDifference) return magnitudeDifference;
      return a.since - b.since;
    });
}

function applyOrderedTroopLoss(playerId, amount, excludeCountry = null) {
  let remaining = Math.max(0, amount);
  const losses = [];
  const nuclearSources = [];
  // Nuclear retaliation is strategic; it ignores attack geography and uses only this ordering.
  for (const { country, nuclear } of nuclearLossOrder(playerId, excludeCountry)) {
    if (remaining <= 0) break;
    const available = countryTroops(country.name);
    const loss = Math.min(available, remaining);
    game.troops[country.name] = available - loss;
    remaining -= loss;
    losses.push(`${loss} from ${country.name}`);
    if (nuclear && loss > 0) nuclearSources.push(country);
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

function applyNuclearStrike({ sourceName, fromPlayerId, targetPlayerId, automatic, optionalPlayerId, depth = 0 }) {
  if (depth > 30 || !fromPlayerId || !targetPlayerId || fromPlayerId === targetPlayerId) return;
  const sourceCountry = countryByName.get(sourceName);
  const sourcePlayer = game.players.find((player) => player.id === fromPlayerId);
  const targetPlayer = game.players.find((player) => player.id === targetPlayerId);
  if (!sourceCountry || !sourcePlayer || !targetPlayer || targetPlayer.eliminated) return;
  if (!automatic) {
    const proceed = confirm(`${sourcePlayer.name} may counter-retaliate with ${sourceName} against ${targetPlayer.name}. Do this?`);
    if (!proceed) {
      addLog(`${sourcePlayer.name} declines to counter-retaliate with ${sourceName}.`);
      return;
    }
  }
  const amount = Math.max(0, sourceCountry.magnitude || 0);
  const result = applyOrderedTroopLoss(targetPlayerId, amount);
  addLog(`${sourcePlayer.name} retaliates with ${sourceName} against ${targetPlayer.name}'s countries by nuclear loss order; ${result.lost}/${amount} troops lost: ${describeLossResult(result)}.`);
  for (const hitNuclear of result.nuclearSources) {
    applyNuclearStrike({
      sourceName: hitNuclear.name,
      fromPlayerId: targetPlayerId,
      targetPlayerId: fromPlayerId,
      automatic: targetPlayerId !== optionalPlayerId,
      optionalPlayerId,
      depth: depth + 1
    });
  }
}

function applyNuclearRetaliation({ targetName, actorId, defenderId = null, excludeCountry = null, action = "targets" }) {
  const targetCountry = countryByName.get(targetName);
  if (!targetCountry || !isNuclearPower(targetName, defenderId || game.ownership[targetName])) return;
  const actor = game.players.find((player) => player.id === actorId);
  const defender = game.players.find((player) => player.id === defenderId);
  if (!actor) return;
  if (defenderId && defenderId !== actorId && defender) {
    const proceed = confirm(`${defender.name} may use nuclear retaliation from ${targetName} against ${actor.name}. Do this?`);
    if (!proceed) {
      addLog(`${defender.name} declines nuclear retaliation from ${targetName}.`);
      return;
    }
  }
  const amount = Math.max(0, targetCountry.magnitude || 0);
  const result = applyOrderedTroopLoss(actorId, amount, excludeCountry);
  addLog(`${actor.name} ${action} nuclear power ${targetName}; retaliation follows the nuclear loss order and costs ${result.lost}/${amount} troops: ${describeLossResult(result)}.`);

  if (!defenderId || defenderId === actorId) return;
  for (const nuclearCountry of result.nuclearSources) {
    applyNuclearStrike({
      sourceName: nuclearCountry.name,
      fromPlayerId: actorId,
      targetPlayerId: defenderId,
      automatic: false,
      optionalPlayerId: actorId
    });
  }
}

function resolveAntarcticaUnclaimedTroops() {
  const unclaimed = Number(game.antarcticaUnclaimed || 0);
  if (unclaimed <= 0) return;
  const candidates = activePlayers().map((player) => ({ player, troops: antarcticaTroops(player.id) }));
  if (!candidates.length) return;
  const most = Math.max(...candidates.map((item) => item.troops));
  const leaders = candidates.filter((item) => item.troops === most);
  if (leaders.length !== 1) return;
  const leader = leaders[0].player;
  game.antarcticaTroops[leader.id] = antarcticaTroops(leader.id) + unclaimed;
  game.antarcticaUnclaimed = 0;
  addLog(`${leader.name} receives ${unclaimed} unclaimed troops in Antarctica.`);
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
  if (owned.some((country) => ANTARCTICA_CONNECTIONS.has(country.name))) {
    visible.set(ANTARCTICA_NAME, "Antarctica");
  }
  return [...visible.entries()]
    .map(([name, visibility]) => ({ country: placeByName(name), visibility }))
    .sort((a, b) => a.country.name.localeCompare(b.country.name));
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
    .filter((player) => player.reserve > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function currentPlanningPlayer() {
  const players = playersWithRecruits();
  if (!players.length) {
    game.planningPlayerId = null;
    return null;
  }
  if (!players.some((player) => player.id === game.planningPlayerId)) {
    game.planningPlayerId = players[0].id;
  }
  return players.find((player) => player.id === game.planningPlayerId) || players[0];
}

function advancePlanningPlayer() {
  const players = playersWithRecruits();
  if (!players.length) {
    game.planningPlayerId = null;
    return;
  }
  const currentIndex = players.findIndex((player) => player.id === game.planningPlayerId);
  game.planningPlayerId = players[Math.max(0, currentIndex + 1) % players.length].id;
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
}

function renderSummary() {
  const active = activePlayers();
  const player = currentPlayer();
  const winningPlayer = winner();
  $("statusLine").textContent = game
    ? winningPlayer
      ? `Game over · ${winningPlayer.name} wins`
      : isPlayerSession()
      ? `Player view · ${sessionPlayer()?.name || "Unknown player"} · Round ${game.round} · ${game.phase === "planning" ? "planning phase" : `${player?.name || "No one"}'s turn`}`
      : `Moderator view · Round ${game.round} · ${game.phase === "planning" ? "planning phase" : `${player?.name || "No one"}'s turn`} · ${active.length} active players`
    : `${countries.length} countries loaded`;
  $("summaryGrid").innerHTML = active.map((p) => {
    const owned = ownedCountries(p.id);
    const troopCount = owned.reduce((sum, country) => sum + countryTroops(country.name), 0) + antarcticaTroops(p.id);
    return `<div class="summary-card"><strong>${p.name}</strong><span>${owned.length} countries · ${troopCount} troops · ${antarcticaTroops(p.id)} in Antarctica · ${p.reserve} unplaced recruits · ${p.carry.toFixed(2)} carry</span></div>`;
  }).join("");
}

function boardPlaces() {
  return [...countries, ANTARCTICA_PLACE];
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
        owner: isAntarctica(country.name) ? "shared" : playerName(game.ownership[country.name]).toLowerCase(),
        troops: isAntarctica(country.name) ? String(totalAntarcticaTroops()) : String(countryTroops(country.name) || "")
      };
      return Object.entries(filters).every(([key, value]) => !value || row[key].includes(value));
    })
    .map((country) => `<tr>
      <td>${country.name}</td>
      <td>${country.region}</td>
      <td>${country.network || ""}</td>
      <td>${country.magnitude}</td>
      <td>${isAntarctica(country.name) ? "Shared staging" : playerName(game.ownership[country.name])}</td>
      <td>${isAntarctica(country.name) ? totalAntarcticaTroops() : countryTroops(country.name) || ""}</td>
    </tr>`).join("");
}

function renderPlanning() {
  const players = activePlayers();
  $("incomeRows").innerHTML = players.map((player) => {
    const magnitudeSum = ownedCountries(player.id).reduce((sum, country) => sum + country.magnitude, 0);
    const regions = controlledRegions(player.id);
    const bonus = regions.reduce((sum, region) => sum + (REGION_BONUSES[region] || 0), 0);
    return `<div class="income-card"><strong>${player.name}</strong><span>Magnitude ${magnitudeSum} / 25 + carry ${player.carry.toFixed(2)} · region bonus ${bonus} · reserve ${player.reserve}</span></div>`;
  }).join("");
  const planningPlayer = currentPlanningPlayer();
  setOptions($("placePlayer"), planningPlayer ? [planningPlayer] : [], (p) => `${p.name} (${p.reserve} recruits)`, (p) => p.id);
  updatePlaceCountries();
  renderPlanningVisible();
}

function updatePlaceCountries() {
  const playerId = $("placePlayer").value;
  const owned = ownedCountries(playerId);
  const destinations = [...owned];
  if (owned.some((country) => ANTARCTICA_CONNECTIONS.has(country.name))) destinations.push(ANTARCTICA_PLACE);
  setOptions(
    $("placeCountry"),
    destinations,
    (country) => `${country.name} (${isAntarctica(country.name) ? antarcticaTroops(playerId) : countryTroops(country.name)})`,
    (country) => country.name
  );
  const player = game.players.find((candidate) => candidate.id === playerId);
  const max = player?.reserve || 0;
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
  if (antarcticaTroops(playerId) > 0) origins.push(ANTARCTICA_PLACE);
  setOptions($("transferFrom"), origins, (country) => `${country.name} (${isAntarctica(country.name) ? antarcticaTroops(playerId) : movableTroops(country.name)} movable)`, (country) => country.name);
  const from = $("transferFrom").value;
  const destinations = from
    ? [
        ...allOwned.filter((country) => country.name !== from && hasOwnedTransferPath(playerId, from, country.name)),
        ...(!isAntarctica(from) && hasOwnedTransferPath(playerId, from, ANTARCTICA_NAME) ? [ANTARCTICA_PLACE] : [])
      ]
    : [];
  setOptions($("transferTo"), destinations, (country) => country.name, (country) => country.name);
  const max = from ? (isAntarctica(from) ? antarcticaTroops(playerId) : movableTroops(from)) : 0;
  $("transferAmount").max = max;
  $("transferAmount").value = Math.min(Math.max(1, Number($("transferAmount").value || 1)), Math.max(1, max));
  $("transferAmount").disabled = max < 1 || destinations.length === 0;
}

function renderTransferQueue() {
  $("transferQueue").innerHTML = `<p class="note">Transfers apply immediately when submitted.</p>`;
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
  const winningPlayer = winner();
  const transferStage = game.turnStage === "transfer";
  const canAct = playerSessionCanAct();
  const viewingPlayer = visibleSessionPlayer();
  $("turnTitle").textContent = winningPlayer
    ? `${winningPlayer.name} Wins`
    : isPlayerSession() && !canAct
    ? `${viewingPlayer?.name || "Player"}'s Map`
    : player
    ? `${player.name}'s Turn`
    : "Game Over";
  $("turnNote").textContent = winningPlayer
    ? "Only one player remains. The game is complete."
    : isPlayerSession() && !canAct
    ? `It is currently ${player?.name || "another player"}'s turn. Your map remains visible here.`
    : player
    ? transferStage
      ? `End-of-turn transfers are available. After this turn, the round ends on a 1 in ${activePlayers().length} roll.`
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
}

function updateClaimTargets() {
  const from = $("claimFrom").value;
  const options = from ? claimOptionsFor(from) : [];
  setOptions($("claimTo"), options, (name) => {
    const country = countryByName.get(name);
    return `${name} (magnitude ${country?.magnitude ?? "?"})`;
  });
  const target = countryByName.get($("claimTo").value);
  $("claimAmount").min = target ? Math.max(1, target.magnitude) : 1;
  $("claimAmount").value = target ? Math.max(1, target.magnitude) : 1;
}

function updateAttackTargets() {
  const from = $("attackFrom").value;
  const options = from ? attackOptionsFor(from) : [];
  setOptions($("attackTo"), options, (o) => `${o.target} (${o.type}, max ${o.maxDice})`, (o) => o.target);
  updateAttackDice();
}

function updateAttackDice() {
  const from = $("attackFrom").value;
  const target = $("attackTo").value;
  const option = attackOptionsFor(from).find((item) => item.target === target);
  const max = option ? Math.min(option.maxDice, countryTroops(from) - 1) : 0;
  setOptions($("attackDice"), Array.from({ length: Math.max(0, max) }, (_, i) => i + 1), String, String);
  if (max > 0) $("attackDice").value = String(max);
  $("conquestMove").min = 1;
  $("conquestMove").value = max ? Math.min(Math.max(1, max), countryTroops(from) - 1) : 1;
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

function resetMapView(renderNow = true) {
  mapView = { x: 0, y: 0, width: 1000, height: 500 };
  selectedMapCountry = null;
  const player = currentPlayer();
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
    if (projected) candidates.push({ ...projected, priority: 0 });
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
  if (isAntarctica(country.name)) return [country.name, `${antarcticaTroops(playerId)} troops`];
  if (visibility === "Same region") return [country.name];
  const owner = game.ownership[country.name];
  if (!owner) return [country.name, `Mag ${country.magnitude}`];
  if (visibility === "Owned" || owner !== playerId) return [country.name, `${countryTroops(country.name)} troops`];
  return [country.name];
}

function visibleDetailHtml(country, visibility, playerId) {
  if (isAntarctica(country.name)) {
    return `
      <strong>${country.name}</strong>
      <p><span class="badge">Shared staging</span></p>
      <p>Your troops: ${antarcticaTroops(playerId)}</p>
      <p>Total troops: ${totalAntarcticaTroops()}</p>
    `;
  }
  const full = visibility !== "Same region";
  const owner = game.ownership[country.name];
  const enemyTroopsVisible = full && owner && owner !== playerId;
  const troopText = full && !owner ? "0" : visibility === "Owned" || enemyTroopsVisible ? `${countryTroops(country.name)}` : "Hidden";
  return `
    <strong>${country.name}</strong>
    <p><span class="badge ${visibility === "Owned" ? "gold" : ""}">${visibility}</span></p>
    <p>Region: ${country.region}</p>
    ${full ? `<p>Network: ${country.network || "None"}</p>` : ""}
    ${full ? `<p>Magnitude: ${country.magnitude}</p>` : ""}
    ${full ? `<p>Owner: ${playerName(owner)}</p>` : ""}
    ${full ? `<p>Troops: ${troopText}</p>` : ""}
  `;
}

function moderatorLabelLines(country) {
  if (isAntarctica(country.name)) return [country.name, `${totalAntarcticaTroops()} troops`];
  const owner = game.ownership[country.name];
  if (!owner) return [country.name, `Mag ${country.magnitude}`];
  return [country.name, `${countryTroops(country.name)} troops`, `Mag ${country.magnitude}`];
}

function snapshotLabelLines(country, snapshot) {
  if (isAntarctica(country.name)) {
    const total = Object.values(snapshot.antarcticaTroops || {}).reduce((sum, value) => sum + Number(value || 0), Number(snapshot.antarcticaUnclaimed || 0));
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
  text.addEventListener("click", () => onSelect(entry.country.name));
  svg.appendChild(text);
}

function moderatorDetailHtml(country) {
  if (isAntarctica(country.name)) {
    const rows = game.players.map((player) => `<p>${player.name}: ${antarcticaTroops(player.id)}</p>`).join("");
    return `
      <strong>${country.name}</strong>
      <p>Shared staging area</p>
      <p>Unclaimed tied troops: ${Number(game.antarcticaUnclaimed || 0)}</p>
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
  `;
}

function selectVisibleMapCountry(countryName, visible, playerId, svgId = "playerMap", detailsId = "mapDetails") {
  const entry = visible.get(countryName);
  if (!entry) return;
  selectedMapCountry = countryName;
  $(svgId).querySelectorAll(".map-country").forEach((node) => {
    node.classList.toggle("active", node.dataset.country === countryName);
  });
  $(detailsId).innerHTML = visibleDetailHtml(entry.country, entry.visibility, playerId);
}

function applyKnownOwnerColor(path, country) {
  if (isAntarctica(country.name)) return;
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
    path.addEventListener("click", () => selectVisibleMapCountry(country.name, visible, playerId, svgId, detailsId));
    svg.appendChild(path);
    const candidates = labelCandidatePointsForFeature(feature);
    if (candidates.length) {
      const existing = labels.get(country.name);
      if (existing) {
        existing.candidates.push(...candidates);
      } else {
        const ownerId = visibility === "Same region" ? null : game.ownership[country.name];
        labels.set(country.name, { country, visibility, ownerId, lines: visibleLabelLines(country, visibility, playerId), candidates });
      }
    }
  }
  for (const entry of chooseMapLabels([...labels.values()])) {
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
    ? visibleDetailHtml(selected.country, selected.visibility, playerId)
    : "<strong>Visible Map</strong><p>Select a country on the map or a visible place below to see details.</p>";
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
  const planningPlayer = currentPlanningPlayer();
  renderPlayerMapFor(planningPlayer, {
    svgId: "planningPlayerMap",
    detailsId: "planningMapDetails",
    unmappedId: "planningUnmappedVisible",
    labelId: "planningVisiblePlayerLabel"
  });
  renderRegionProgress(planningPlayer, "planningRegionProgress");
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
    path.setAttribute("class", `map-country ${isAntarctica(country.name) ? "map-region" : game.ownership[country.name] ? "map-known" : "map-unowned"}`);
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
    path.setAttribute("class", `map-country ${isAntarctica(country.name) ? "map-region" : ownerId ? "map-known" : "map-unowned"}`);
    if (ownerId && !isAntarctica(country.name)) path.style.fill = playerColor(ownerId);
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
  $("logList").innerHTML = game.log.map((item) => `<li>${item}</li>`).join("");
}

function canOpenTab(name) {
  if (!game) return false;
  if (isPlayerSession()) {
    if (name === "moderator") return false;
    if (name === "planning") return game.phase === "planning" && currentPlanningPlayer()?.id === sessionPlayerId;
    if (name === "turn") return game.phase !== "planning" && game.phase !== "gameover";
    return name === "log";
  }
  if (name === "planning") return game.phase === "planning";
  if (name === "turn") return game.phase !== "planning" && game.phase !== "gameover";
  return true;
}

function renderTabs() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.classList.toggle("hidden", isPlayerSession() && button.dataset.tab === "moderator");
    button.disabled = !canOpenTab(button.dataset.tab);
  });
}

function render() {
  $("entryView").classList.toggle("hidden", Boolean(game) || setupMode);
  $("setupView").classList.toggle("hidden", Boolean(game) || !setupMode);
  $("gameView").classList.toggle("hidden", !game);
  $("headerGameIdBox").classList.toggle("hidden", !game || !onlineGameId);
  rememberOnlineGameId(onlineGameId);
  if (!game) {
    $("statusLine").textContent = setupMode ? "Set up a new online game" : "Create or load an online game";
    return;
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
  if (isPlayerSession() && !canOpenTab(document.querySelector(".tab.active")?.dataset.tab)) {
    showTab(canOpenTab("turn") ? "turn" : canOpenTab("planning") ? "planning" : "log");
  }
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
    renderVisible();
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
    getPlayer: currentPlayer,
    renderMap: renderVisible,
    detailsId: "mapDetails",
    resetButtonId: "resetMapButton"
  });
  bindInteractivePlayerMap({
    svgId: "planningPlayerMap",
    getPlayer: currentPlanningPlayer,
    renderMap: renderPlanningVisible,
    detailsId: "planningMapDetails"
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
  const stillUnplaced = activePlayers().filter((player) => player.reserve > 0);
  if (stillUnplaced.length) {
    alert(`Place all recruits before beginning turns. Still unplaced: ${stillUnplaced.map((player) => player.name).join(", ")}.`);
    return;
  }
  game.phase = "turn";
  game.turnStage = "attack";
  game.turnHadAction = false;
  game.consecutivePasses = [];
  addLog(`Round ${game.round} action turns begin.`);
  resetMapView(false);
  saveGame();
  showTab("turn");
  render();
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
  const option = attackOptionsFor(from).find((item) => item.target === target);
  if (option?.limited) {
    handleLimitedAttack(attacker, from, target);
    return;
  }
  markTurnAction();
  const defenderId = game.ownership[target];
  const targetIsNuclear = isNuclearPower(target, defenderId);
  const defenderDice = Math.min(2, countryTroops(target));
  const attackRolls = rollDice(attackDice);
  const defendRolls = rollDice(defenderDice);
  let attackerLoss = 0;
  let defenderLoss = 0;
  for (let i = 0; i < Math.min(attackRolls.length, defendRolls.length); i += 1) {
    if (attackRolls[i] > defendRolls[i]) defenderLoss += 1;
    else attackerLoss += 1;
  }
  game.troops[from] -= attackerLoss;
  game.troops[target] -= defenderLoss;
  addLog(`${attacker.name} attacks ${target} from ${from}. Attack rolls ${attackRolls.join(", ")}; defense rolls ${defendRolls.join(", ")}. Losses: ${attackerLoss} attacker, ${defenderLoss} defender.`);
  let conquered = false;
  if (countryTroops(target) <= 0) {
    const requestedMove = Number($("conquestMove").value || attackDice);
    const move = Math.max(1, Math.min(requestedMove, countryTroops(from) - 1));
    setCountryOwner(target, attacker.id);
    game.troops[target] = move;
    game.troops[from] -= move;
    conquered = true;
    addLog(`${attacker.name} conquers ${target} from ${playerName(defenderId)} and moves ${move} troops in.`);
    announceNewRegionControls(attacker.id);
  }
  if (targetIsNuclear) {
    applyNuclearRetaliation({
      targetName: target,
      actorId: attacker.id,
      defenderId,
      excludeCountry: conquered ? target : null,
      action: "attacks"
    });
  }
  checkEliminations();
  refreshRegionControlAnnouncements();
  saveGame();
  render();
}

function handleLimitedAttack(attacker, from, target) {
  const defenderId = game.ownership[target];
  const targetCountry = countryByName.get(target);
  const targetIsNuclear = isNuclearPower(target, defenderId);
  if (!defenderId) {
    const minimumMove = Math.max(1, targetCountry.magnitude);
    const requestedMove = Number($("conquestMove").value || minimumMove);
    const movable = countryTroops(from) - 1;
    if (requestedMove > movable) {
      alert("The starting country does not have enough movable troops.");
      addLog(`${attacker.name} probes ${target} from ${from}. The starting country does not have enough movable troops.`);
    } else if (requestedMove < minimumMove) {
      alert("Move on conquest is not high enough.");
      addLog(`${attacker.name} probes ${target} from ${from}. Move on conquest is not high enough.`);
    } else {
      markTurnAction();
      setCountryOwner(target, attacker.id);
      game.troops[target] = requestedMove;
      game.troops[from] -= requestedMove;
      addLog(`${attacker.name} probes ${target} from ${from}, finds it unowned, and claims it with ${requestedMove} troops.`);
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
  const attackRoll = rollDice(1);
  const defendRoll = rollDice(Math.min(2, countryTroops(target)));
  const attackerLoses = attackRoll[0] <= defendRoll[0];
  let conquered = false;
  if (attackerLoses) {
    game.troops[from] -= 1;
    addLog(`${attacker.name} probes ${target} from ${from}. One attacking troop dies.`);
  } else {
    game.troops[target] -= 1;
    if (countryTroops(target) <= 0) {
      const requestedMove = Number($("conquestMove").value || 1);
      const move = Math.max(1, Math.min(requestedMove, countryTroops(from) - 1));
      setCountryOwner(target, attacker.id);
      game.troops[target] = move;
      game.troops[from] -= move;
      conquered = true;
      addLog(`${attacker.name} probes ${target} from ${from}, conquers it, and moves ${move} troops in.`);
      announceNewRegionControls(attacker.id);
    } else {
      addLog(`${attacker.name} probes ${target} from ${from}. No visible result.`);
    }
  }
  if (targetIsNuclear) {
    applyNuclearRetaliation({
      targetName: target,
      actorId: attacker.id,
      defenderId,
      excludeCountry: conquered ? target : null,
      action: "attacks"
    });
  }
  checkEliminations();
  refreshRegionControlAnnouncements();
  saveGame();
  render();
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
    startGame(names);
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
  $("loadOnlineGameButton").addEventListener("click", () => loadOnlineGame());
  $("joinRole").addEventListener("change", updateJoinRoleFields);
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
    game = null;
    setupMode = false;
    resetMapView();
    resetModeratorMapView();
    render();
  });
  document.querySelectorAll(".tab").forEach((button) => button.addEventListener("click", () => showTab(button.dataset.tab)));
  bindMapControls();
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
  $("placeForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const player = game.players.find((p) => p.id === $("placePlayer").value);
    const country = $("placeCountry").value;
    const amount = Number($("placeAmount").value);
    if (!player || !country || amount < 1 || amount > player.reserve) {
      alert("That recruit placement is not available.");
      return;
    }
    player.reserve -= amount;
    if (isAntarctica(country)) {
      game.antarcticaTroops[player.id] = antarcticaTroops(player.id) + amount;
    } else {
      game.troops[country] = countryTroops(country) + amount;
    }
    addLog(`${player.name} places ${amount} recruits in ${country}.`);
    if (game.phase === "planning" && player.reserve <= 0) advancePlanningPlayer();
    saveGame();
    render();
  });
  $("transferForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const player = currentPlayer();
    const playerId = player?.id;
    const from = $("transferFrom").value;
    const to = $("transferTo").value;
    const amount = Number($("transferAmount").value);
    const maxTransfer = isAntarctica(from) ? antarcticaTroops(playerId) : movableTroops(from);
    if (!playerId || !from || !to || amount < 1 || amount > maxTransfer || !hasOwnedTransferPath(playerId, from, to)) {
      alert("That transfer is not available.");
      return;
    }
    markTurnAction();
    if (isAntarctica(from)) {
      game.antarcticaTroops[playerId] = antarcticaTroops(playerId) - amount;
      game.troops[to] = countryTroops(to) + amount;
    } else if (isAntarctica(to)) {
      game.troops[from] -= amount;
      game.antarcticaTroops[playerId] = antarcticaTroops(playerId) + amount;
    } else {
      game.troops[from] -= amount;
      game.troops[to] = countryTroops(to) + amount;
    }
    addLog(`${player.name} transfers ${amount} from ${from} to ${to}.`);
    resolveAntarcticaUnclaimedTroops();
    saveGame();
    render();
  });
  $("resolvePlanningButton").addEventListener("click", resolvePlanning);
  $("finishAttackButton").addEventListener("click", () => {
    game.turnStage = "transfer";
    render();
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
    addLog(`${player.name} claims ${target} from ${from} with ${amount} troops.`);
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
  $("clearLogButton").addEventListener("click", () => {
    game.log = [];
    saveGame();
    renderLog();
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
