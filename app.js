const SAMPLE_SCORING = {
  groupWinnerPoints: 4,
  groupRunnerUpPoints: 4,
  bracketSpotPoints: {},
  roundPoints: {
    R16: 1,
    QF: 2,
    SF: 4,
    Final: 8
  },
  matchPoints: {}
};

const SAMPLE_TOURNAMENT = {
  tournamentName: "Sample World Cup Knockout",
  groups: [
    { group: "A", winner: "Argentina", runnerUp: "USA" },
    { group: "B", winner: "Brazil", runnerUp: "Uruguay" }
  ],
  matches: [
    { id: "R16-1", round: "Round of 16", pointsKey: "R16", label: "USA vs Argentina", teams: ["USA", "Argentina"], winner: "Argentina", status: "complete", nextMatchId: "QF-1", nextSlot: 0 },
    { id: "R16-2", round: "Round of 16", pointsKey: "R16", label: "Brazil vs Uruguay", teams: ["Brazil", "Uruguay"], winner: "Brazil", status: "complete", nextMatchId: "QF-1", nextSlot: 1 },
    { id: "R16-3", round: "Round of 16", pointsKey: "R16", label: "France vs Denmark", teams: ["France", "Denmark"], winner: "France", status: "complete", nextMatchId: "QF-2", nextSlot: 0 },
    { id: "R16-4", round: "Round of 16", pointsKey: "R16", label: "England vs Netherlands", teams: ["England", "Netherlands"], winner: "England", status: "complete", nextMatchId: "QF-2", nextSlot: 1 },
    { id: "R16-5", round: "Round of 16", pointsKey: "R16", label: "Spain vs Morocco", teams: ["Spain", "Morocco"], status: "pending", nextMatchId: "QF-3", nextSlot: 0 },
    { id: "R16-6", round: "Round of 16", pointsKey: "R16", label: "Germany vs Mexico", teams: ["Germany", "Mexico"], status: "pending", nextMatchId: "QF-3", nextSlot: 1 },
    { id: "R16-7", round: "Round of 16", pointsKey: "R16", label: "Portugal vs Croatia", teams: ["Portugal", "Croatia"], status: "pending", nextMatchId: "QF-4", nextSlot: 0 },
    { id: "R16-8", round: "Round of 16", pointsKey: "R16", label: "Japan vs South Korea", teams: ["Japan", "South Korea"], status: "pending", nextMatchId: "QF-4", nextSlot: 1 },
    { id: "QF-1", round: "Quarterfinal", pointsKey: "QF", label: "Quarterfinal 1", status: "pending", nextMatchId: "SF-1", nextSlot: 0 },
    { id: "QF-2", round: "Quarterfinal", pointsKey: "QF", label: "Quarterfinal 2", status: "pending", nextMatchId: "SF-1", nextSlot: 1 },
    { id: "QF-3", round: "Quarterfinal", pointsKey: "QF", label: "Quarterfinal 3", status: "pending", nextMatchId: "SF-2", nextSlot: 0 },
    { id: "QF-4", round: "Quarterfinal", pointsKey: "QF", label: "Quarterfinal 4", status: "pending", nextMatchId: "SF-2", nextSlot: 1 },
    { id: "SF-1", round: "Semifinal", pointsKey: "SF", label: "Semifinal 1", status: "pending", nextMatchId: "Final-1", nextSlot: 0 },
    { id: "SF-2", round: "Semifinal", pointsKey: "SF", label: "Semifinal 2", status: "pending", nextMatchId: "Final-1", nextSlot: 1 },
    { id: "Final-1", round: "Final", pointsKey: "Final", label: "World Cup Final", status: "pending" }
  ]
};

const SAMPLE_ENTRIES = [
  {
    name: "Janice",
    picks: {
      "R16-1": "Argentina",
      "R16-2": "Brazil",
      "R16-3": "France",
      "R16-4": "England",
      "R16-5": "Spain",
      "R16-6": "Germany",
      "R16-7": "Portugal",
      "R16-8": "Japan",
      "QF-1": "Brazil",
      "QF-2": "France",
      "QF-3": "Germany",
      "QF-4": "Portugal",
      "SF-1": "France",
      "SF-2": "Portugal",
      "Final-1": "France"
    },
    groupPicks: {
      A: { winner: "Argentina", runnerUp: "USA" },
      B: { winner: "Brazil", runnerUp: "Uruguay" }
    }
  },
  {
    name: "Mateo",
    picks: {
      "R16-1": "USA",
      "R16-2": "Brazil",
      "R16-3": "France",
      "R16-4": "Netherlands",
      "R16-5": "Morocco",
      "R16-6": "Mexico",
      "R16-7": "Portugal",
      "R16-8": "South Korea",
      "QF-1": "Brazil",
      "QF-2": "France",
      "QF-3": "Morocco",
      "QF-4": "Portugal",
      "SF-1": "France",
      "SF-2": "Portugal",
      "Final-1": "Portugal"
    },
    groupPicks: {
      A: { winner: "USA", runnerUp: "Argentina" },
      B: { winner: "Brazil", runnerUp: "Uruguay" }
    }
  },
  {
    name: "Amina",
    picks: {
      "R16-1": "Argentina",
      "R16-2": "Uruguay",
      "R16-3": "France",
      "R16-4": "England",
      "R16-5": "Spain",
      "R16-6": "Germany",
      "R16-7": "Croatia",
      "R16-8": "Japan",
      "QF-1": "Argentina",
      "QF-2": "England",
      "QF-3": "Spain",
      "QF-4": "Japan",
      "SF-1": "England",
      "SF-2": "Spain",
      "Final-1": "England"
    },
    groupPicks: {
      A: { winner: "Argentina", runnerUp: "USA" },
      B: { winner: "Uruguay", runnerUp: "Brazil" }
    }
  },
  {
    name: "Leo",
    picks: {
      "R16-1": "Argentina",
      "R16-2": "Brazil",
      "R16-3": "Denmark",
      "R16-4": "England",
      "R16-5": "Spain",
      "R16-6": "Mexico",
      "R16-7": "Portugal",
      "R16-8": "Japan",
      "QF-1": "Brazil",
      "QF-2": "England",
      "QF-3": "Spain",
      "QF-4": "Portugal",
      "SF-1": "Brazil",
      "SF-2": "Portugal",
      "Final-1": "Brazil"
    },
    groupPicks: {
      A: { winner: "Argentina", runnerUp: "USA" },
      B: { winner: "Brazil", runnerUp: "Mexico" }
    }
  },
  {
    name: "Sam",
    picks: {
      "R16-1": "USA",
      "R16-2": "Uruguay",
      "R16-3": "France",
      "R16-4": "England",
      "R16-5": "Morocco",
      "R16-6": "Germany",
      "R16-7": "Croatia",
      "R16-8": "South Korea",
      "QF-1": "Uruguay",
      "QF-2": "France",
      "QF-3": "Germany",
      "QF-4": "Croatia",
      "SF-1": "France",
      "SF-2": "Germany",
      "Final-1": "France"
    },
    groupPicks: {
      A: { winner: "USA", runnerUp: "Argentina" },
      B: { winner: "Brazil", runnerUp: "Uruguay" }
    }
  }
];

const DEFAULT_WORLD_CUP_2026_SCORING = {
  "groupWinnerPoints": 4,
  "groupRunnerUpPoints": 4,
  "bracketSpotPoints": {
    "R32": [
      {
        "slot": 1,
        "label": "E 1st",
        "points": 4
      },
      {
        "slot": 2,
        "label": "ABCDF 3rd",
        "points": 10
      },
      {
        "slot": 3,
        "label": "I 1st",
        "points": 4
      },
      {
        "slot": 4,
        "label": "CDFGH 3rd",
        "points": 11
      },
      {
        "slot": 5,
        "label": "A 2nd",
        "points": 4
      },
      {
        "slot": 6,
        "label": "B 2nd",
        "points": 4
      },
      {
        "slot": 7,
        "label": "F 1st",
        "points": 4
      },
      {
        "slot": 8,
        "label": "C 2nd",
        "points": 4
      },
      {
        "slot": 9,
        "label": "K 2nd",
        "points": 4
      },
      {
        "slot": 10,
        "label": "L 2nd",
        "points": 4
      },
      {
        "slot": 11,
        "label": "H 1st",
        "points": 4
      },
      {
        "slot": 12,
        "label": "J 2nd",
        "points": 4
      },
      {
        "slot": 13,
        "label": "D 1st",
        "points": 4
      },
      {
        "slot": 14,
        "label": "BEFIJ 3rd",
        "points": 8
      },
      {
        "slot": 15,
        "label": "G 1st",
        "points": 4
      },
      {
        "slot": 16,
        "label": "AEHIJ 3rd",
        "points": 9
      },
      {
        "slot": 17,
        "label": "C 1st",
        "points": 4
      },
      {
        "slot": 18,
        "label": "F 2nd",
        "points": 4
      },
      {
        "slot": 19,
        "label": "E 2nd",
        "points": 4
      },
      {
        "slot": 20,
        "label": "I 2nd",
        "points": 4
      },
      {
        "slot": 21,
        "label": "A 1st",
        "points": 4
      },
      {
        "slot": 22,
        "label": "CEFHI 3rd",
        "points": 12
      },
      {
        "slot": 23,
        "label": "L 1st",
        "points": 4
      },
      {
        "slot": 24,
        "label": "EHIJK 3rd",
        "points": 8
      },
      {
        "slot": 25,
        "label": "J 1st",
        "points": 4
      },
      {
        "slot": 26,
        "label": "H 2nd",
        "points": 4
      },
      {
        "slot": 27,
        "label": "D 2nd",
        "points": 4
      },
      {
        "slot": 28,
        "label": "G 2nd",
        "points": 4
      },
      {
        "slot": 29,
        "label": "B 1st",
        "points": 4
      },
      {
        "slot": 30,
        "label": "EFGIJ 3rd",
        "points": 9
      },
      {
        "slot": 31,
        "label": "K 1st",
        "points": 4
      },
      {
        "slot": 32,
        "label": "DEIJL 3rd",
        "points": 8
      }
    ],
    "R16": [
      {
        "slot": 1,
        "label": "E 1st / ABCDF 3rd",
        "points": 14
      },
      {
        "slot": 2,
        "label": "I 1st / CDFGH 3rd",
        "points": 15
      },
      {
        "slot": 3,
        "label": "A 2nd / B 2nd",
        "points": 8
      },
      {
        "slot": 4,
        "label": "F 1st / C 2nd",
        "points": 8
      },
      {
        "slot": 5,
        "label": "K 2nd / L 2nd",
        "points": 8
      },
      {
        "slot": 6,
        "label": "H 1st / J 2nd",
        "points": 8
      },
      {
        "slot": 7,
        "label": "D 1st / BEFIJ 3rd",
        "points": 12
      },
      {
        "slot": 8,
        "label": "G 1st / AEHIJ 3rd",
        "points": 13
      },
      {
        "slot": 9,
        "label": "C 1st / F 2nd",
        "points": 8
      },
      {
        "slot": 10,
        "label": "E 2nd / I 2nd",
        "points": 8
      },
      {
        "slot": 11,
        "label": "A 1st / CEFHI 3rd",
        "points": 16
      },
      {
        "slot": 12,
        "label": "L 1st / EHIJK 3rd",
        "points": 12
      },
      {
        "slot": 13,
        "label": "J 1st / H 2nd",
        "points": 8
      },
      {
        "slot": 14,
        "label": "D 2nd / G 2nd",
        "points": 8
      },
      {
        "slot": 15,
        "label": "B 1st / EFGIJ 3rd",
        "points": 13
      },
      {
        "slot": 16,
        "label": "K 1st / DEIJL 3rd",
        "points": 12
      }
    ],
    "QF": [
      {
        "slot": 1,
        "points": 23
      },
      {
        "slot": 2,
        "points": 16
      },
      {
        "slot": 3,
        "points": 16
      },
      {
        "slot": 4,
        "points": 24
      },
      {
        "slot": 5,
        "points": 16
      },
      {
        "slot": 6,
        "points": 26
      },
      {
        "slot": 7,
        "points": 16
      },
      {
        "slot": 8,
        "points": 25
      }
    ],
    "SF": [
      {
        "slot": 1,
        "points": 28
      },
      {
        "slot": 2,
        "points": 33
      },
      {
        "slot": 3,
        "points": 29
      },
      {
        "slot": 4,
        "points": 29
      }
    ],
    "F": [
      {
        "slot": 1,
        "points": 46
      },
      {
        "slot": 2,
        "points": 46
      }
    ],
    "C": [
      {
        "slot": 1,
        "points": 48
      }
    ]
  },
  "roundPoints": {},
  "matchPoints": {}
};

const DEFAULT_WORLD_CUP_2026_RESULTS = {
  "tournamentName": "World Cup 2026",
  "asOfDate": "2026-06-11",
  "notes": [
    "Use this as the live results file for the 2026 World Cup pool app.",
    "Update each group's winner and runnerUp when those positions are officially settled.",
    "Update stageResults as exact bracket slots become known.",
    "The app currently scores group outcomes and exact bracket slots. It does not yet derive group standings from individual group-stage match scores."
  ],
  "groups": [
    {
      "group": "A",
      "teams": [
        "Mexico",
        "South Africa",
        "South Korea",
        "Czechia"
      ],
      "winner": "",
      "runnerUp": "",
      "reference": {
        "matchesPlayed": [
          {
            "date": "2026-06-11",
            "home": "Mexico",
            "away": "South Africa",
            "score": "2-0",
            "homeFairPlay": 5,
            "awayFairPlay": 10,
            "status": "complete"
          }
        ]
      }
    },
    {
      "group": "B",
      "teams": [
        "Canada",
        "Bosnia and Herzegovina",
        "Qatar",
        "Switzerland"
      ],
      "winner": "",
      "runnerUp": ""
    },
    {
      "group": "C",
      "teams": [
        "Brazil",
        "Morocco",
        "Haiti",
        "Scotland"
      ],
      "winner": "",
      "runnerUp": ""
    },
    {
      "group": "D",
      "teams": [
        "United States",
        "Paraguay",
        "Australia",
        "Turkey"
      ],
      "winner": "",
      "runnerUp": ""
    },
    {
      "group": "E",
      "teams": [
        "Germany",
        "Curacao",
        "Ivory Coast",
        "Ecuador"
      ],
      "winner": "",
      "runnerUp": ""
    },
    {
      "group": "F",
      "teams": [
        "Netherlands",
        "Japan",
        "Sweden",
        "Tunisia"
      ],
      "winner": "",
      "runnerUp": ""
    },
    {
      "group": "G",
      "teams": [
        "Belgium",
        "Egypt",
        "Iran",
        "New Zealand"
      ],
      "winner": "",
      "runnerUp": ""
    },
    {
      "group": "H",
      "teams": [
        "Spain",
        "Cape Verde",
        "Saudi Arabia",
        "Uruguay"
      ],
      "winner": "",
      "runnerUp": ""
    },
    {
      "group": "I",
      "teams": [
        "France",
        "Senegal",
        "Iraq",
        "Norway"
      ],
      "winner": "",
      "runnerUp": ""
    },
    {
      "group": "J",
      "teams": [
        "Argentina",
        "Algeria",
        "Austria",
        "Jordan"
      ],
      "winner": "",
      "runnerUp": ""
    },
    {
      "group": "K",
      "teams": [
        "Portugal",
        "DR Congo",
        "Uzbekistan",
        "Colombia"
      ],
      "winner": "",
      "runnerUp": ""
    },
    {
      "group": "L",
      "teams": [
        "England",
        "Croatia",
        "Ghana",
        "Panama"
      ],
      "winner": "",
      "runnerUp": ""
    }
  ],
  "stageResults": {
    "R32": {},
    "R16": {},
    "QF": {},
    "SF": {},
    "F": {},
    "C": {}
  }
};

const DEFAULT_WORLD_CUP_2026_ENTRIES = [
  {
    "name": "Arlen",
    "slotPicks": {
      "R32": {
        "1": "Ecuador",
        "2": "Scotland",
        "3": "France",
        "4": "Sweden",
        "5": "South Korea",
        "6": "Canada",
        "7": "Netherlands",
        "8": "Morocco",
        "9": "Colombia",
        "10": "Croatia",
        "11": "Spain",
        "12": "Austria",
        "13": "Turkey",
        "14": "Bosnia and Herzegovina",
        "15": "Belgium",
        "16": "Czechia",
        "17": "Brazil",
        "18": "Japan",
        "19": "Germany",
        "20": "Norway",
        "21": "Mexico",
        "22": "Ivory Coast",
        "23": "England",
        "24": "Uzbekistan",
        "25": "Argentina",
        "26": "Uruguay",
        "27": "Paraguay",
        "28": "Iran",
        "29": "Switzerland",
        "30": "Egypt",
        "31": "Portugal",
        "32": "Panama"
      },
      "R16": {
        "1": "Ecuador",
        "2": "France",
        "3": "Canada",
        "4": "Netherlands",
        "5": "Colombia",
        "6": "Spain",
        "7": "Turkey",
        "8": "Belgium",
        "9": "Brazil",
        "10": "Norway",
        "11": "Mexico",
        "12": "England",
        "13": "Argentina",
        "14": "Paraguay",
        "15": "Switzerland",
        "16": "Portugal"
      },
      "QF": {
        "1": "France",
        "2": "Netherlands",
        "3": "Spain",
        "4": "Turkey",
        "5": "Brazil",
        "6": "England",
        "7": "Argentina",
        "8": "Portugal"
      },
      "SF": {
        "1": "France",
        "2": "Spain",
        "3": "England",
        "4": "Argentina"
      },
      "F": {
        "1": "Spain",
        "2": "Argentina"
      },
      "C": {
        "1": "Spain"
      }
    }
  },
  {
    "name": "Helen",
    "slotPicks": {
      "R32": {
        "1": "Germany",
        "2": "Turkey",
        "3": "France",
        "4": "Egypt",
        "5": "South Korea",
        "6": "Switzerland",
        "7": "Netherlands",
        "8": "Morocco",
        "9": "Colombia",
        "10": "Croatia",
        "11": "Spain",
        "12": "Austria",
        "13": "United States",
        "14": "Japan",
        "15": "Belgium",
        "16": "Czechia",
        "17": "Brazil",
        "18": "Sweden",
        "19": "Ecuador",
        "20": "Norway",
        "21": "Mexico",
        "22": "Scotland",
        "23": "England",
        "24": "Senegal",
        "25": "Argentina",
        "26": "Uruguay",
        "27": "Australia",
        "28": "Iran",
        "29": "Canada",
        "30": "Algeria",
        "31": "Portugal",
        "32": "Ghana"
      },
      "R16": {
        "1": "Germany",
        "2": "France",
        "3": "Switzerland",
        "4": "Netherlands",
        "5": "Colombia",
        "6": "Spain",
        "7": "United States",
        "8": "Belgium",
        "9": "Brazil",
        "10": "Ecuador",
        "11": "Mexico",
        "12": "England",
        "13": "Argentina",
        "14": "Australia",
        "15": "Canada",
        "16": "Portugal"
      },
      "QF": {
        "1": "Germany",
        "2": "Switzerland",
        "3": "Spain",
        "4": "United States",
        "5": "Brazil",
        "6": "England",
        "7": "Argentina",
        "8": "Portugal"
      },
      "SF": {
        "1": "Germany",
        "2": "Spain",
        "3": "Brazil",
        "4": "Argentina"
      },
      "F": {
        "1": "Spain",
        "2": "Argentina"
      },
      "C": {
        "1": "Spain"
      }
    }
  },
  {
    "name": "Ruben",
    "slotPicks": {
      "R32": {
        "1": "Ecuador",
        "2": "Canada",
        "3": "France",
        "4": "Paraguay",
        "5": "South Korea",
        "6": "Bosnia and Herzegovina",
        "7": "Japan",
        "8": "Brazil",
        "9": "Colombia",
        "10": "England",
        "11": "Spain",
        "12": "Austria",
        "13": "Turkey",
        "14": "Sweden",
        "15": "Belgium",
        "16": "Czechia",
        "17": "Morocco",
        "18": "Netherlands",
        "19": "Germany",
        "20": "Senegal",
        "21": "Mexico",
        "22": "Ivory Coast",
        "23": "Croatia",
        "24": "Norway",
        "25": "Argentina",
        "26": "Uruguay",
        "27": "United States",
        "28": "Iran",
        "29": "Switzerland",
        "30": "Egypt",
        "31": "Portugal",
        "32": "Algeria"
      },
      "R16": {
        "1": "Ecuador",
        "2": "France",
        "3": "South Korea",
        "4": "Japan",
        "5": "Colombia",
        "6": "Spain",
        "7": "Turkey",
        "8": "Belgium",
        "9": "Morocco",
        "10": "Senegal",
        "11": "Mexico",
        "12": "Croatia",
        "13": "Argentina",
        "14": "United States",
        "15": "Switzerland",
        "16": "Portugal"
      },
      "QF": {
        "1": "France",
        "2": "Japan",
        "3": "Spain",
        "4": "Turkey",
        "5": "Senegal",
        "6": "Mexico",
        "7": "Argentina",
        "8": "Portugal"
      },
      "SF": {
        "1": "France",
        "2": "Spain",
        "3": "Mexico",
        "4": "Portugal"
      },
      "F": {
        "1": "France",
        "2": "Portugal"
      },
      "C": {
        "1": "France"
      }
    }
  },
  {
    "name": "Will",
    "slotPicks": {
      "R32": {
        "1": "Germany",
        "2": "Mexico",
        "3": "France",
        "4": "Scotland",
        "5": "Czechia",
        "6": "Canada",
        "7": "Netherlands",
        "8": "Brazil",
        "9": "Colombia",
        "10": "Croatia",
        "11": "Spain",
        "12": "Algeria",
        "13": "Turkey",
        "14": "Ivory Coast",
        "15": "Belgium",
        "16": "Austria",
        "17": "Morocco",
        "18": "Japan",
        "19": "Ecuador",
        "20": "Senegal",
        "21": "South Korea",
        "22": "Norway",
        "23": "England",
        "24": "Uzbekistan",
        "25": "Argentina",
        "26": "Uruguay",
        "27": "Australia",
        "28": "Egypt",
        "29": "Switzerland",
        "30": "Iran",
        "31": "Portugal",
        "32": "United States"
      },
      "R16": {
        "1": "Germany",
        "2": "France",
        "3": "Czechia",
        "4": "Brazil",
        "5": "Colombia",
        "6": "Spain",
        "7": "Turkey",
        "8": "Belgium",
        "9": "Morocco",
        "10": "Ecuador",
        "11": "Norway",
        "12": "England",
        "13": "Argentina",
        "14": "Egypt",
        "15": "Switzerland",
        "16": "Portugal"
      },
      "QF": {
        "1": "France",
        "2": "Brazil",
        "3": "Spain",
        "4": "Belgium",
        "5": "Morocco",
        "6": "England",
        "7": "Argentina",
        "8": "Portugal"
      },
      "SF": {
        "1": "France",
        "2": "Spain",
        "3": "Morocco",
        "4": "Argentina"
      },
      "F": {
        "1": "Spain",
        "2": "Argentina"
      },
      "C": {
        "1": "Spain"
      }
    }
  },
  {
    "name": "Muhammed",
    "slotPicks": {
      "R32": {
        "1": "Germany",
        "2": "Australia",
        "3": "France",
        "4": "Japan",
        "5": "South Korea",
        "6": "Canada",
        "7": "Netherlands",
        "8": "Scotland",
        "9": "Colombia",
        "10": "Croatia",
        "11": "Spain",
        "12": "Austria",
        "13": "United States",
        "14": "Ecuador",
        "15": "Belgium",
        "16": "Saudi Arabia",
        "17": "Brazil",
        "18": "Sweden",
        "19": "Ivory Coast",
        "20": "Norway",
        "21": "Mexico",
        "22": "Morocco",
        "23": "England",
        "24": "Senegal",
        "25": "Argentina",
        "26": "Uruguay",
        "27": "Paraguay",
        "28": "Egypt",
        "29": "Switzerland",
        "30": "Algeria",
        "31": "Portugal",
        "32": "Ghana"
      },
      "R16": {
        "1": "Germany",
        "2": "France",
        "3": "South Korea",
        "4": "Netherlands",
        "5": "Croatia",
        "6": "Spain",
        "7": "United States",
        "8": "Belgium",
        "9": "Brazil",
        "10": "Norway",
        "11": "Mexico",
        "12": "England",
        "13": "Argentina",
        "14": "Egypt",
        "15": "Switzerland",
        "16": "Portugal"
      },
      "QF": {
        "1": "France",
        "2": "Netherlands",
        "3": "Spain",
        "4": "Belgium",
        "5": "Brazil",
        "6": "England",
        "7": "Argentina",
        "8": "Portugal"
      },
      "SF": {
        "1": "France",
        "2": "Spain",
        "3": "England",
        "4": "Portugal"
      },
      "F": {
        "1": "France",
        "2": "Portugal"
      },
      "C": {
        "1": "Portugal"
      }
    }
  },
  {
    "name": "Mason",
    "slotPicks": {
      "R32": {
        "1": "Germany",
        "2": "Paraguay",
        "3": "France",
        "4": "Sweden",
        "5": "South Korea",
        "6": "Canada",
        "7": "Netherlands",
        "8": "Morocco",
        "9": "Colombia",
        "10": "Croatia",
        "11": "Spain",
        "12": "Austria",
        "13": "United States",
        "14": "Ivory Coast",
        "15": "Belgium",
        "16": "Czechia",
        "17": "Brazil",
        "18": "Japan",
        "19": "Ecuador",
        "20": "Norway",
        "21": "Mexico",
        "22": "Scotland",
        "23": "England",
        "24": "Uzbekistan",
        "25": "Argentina",
        "26": "Uruguay",
        "27": "Turkey",
        "28": "Egypt",
        "29": "Switzerland",
        "30": "Algeria",
        "31": "Portugal",
        "32": "Senegal"
      },
      "R16": {
        "1": "Germany",
        "2": "France",
        "3": "South Korea",
        "4": "Morocco",
        "5": "Colombia",
        "6": "Spain",
        "7": "United States",
        "8": "Belgium",
        "9": "Japan",
        "10": "Norway",
        "11": "Mexico",
        "12": "England",
        "13": "Argentina",
        "14": "Turkey",
        "15": "Switzerland",
        "16": "Portugal"
      },
      "QF": {
        "1": "France",
        "2": "Morocco",
        "3": "Spain",
        "4": "Belgium",
        "5": "Norway",
        "6": "England",
        "7": "Argentina",
        "8": "Portugal"
      },
      "SF": {
        "1": "France",
        "2": "Spain",
        "3": "England",
        "4": "Argentina"
      },
      "F": {
        "1": "Spain",
        "2": "Argentina"
      },
      "C": {
        "1": "Spain"
      }
    }
  },
  {
    "name": "Lee",
    "slotPicks": {
      "R32": {
        "1": "Germany",
        "2": "Qatar",
        "3": "France",
        "4": "Scotland",
        "5": "South Korea",
        "6": "Canada",
        "7": "Netherlands",
        "8": "Morocco",
        "9": "Colombia",
        "10": "Croatia",
        "11": "Spain",
        "12": "Austria",
        "13": "Australia",
        "14": "Algeria",
        "15": "Belgium",
        "16": "Czechia",
        "17": "Brazil",
        "18": "Sweden",
        "19": "Ecuador",
        "20": "Senegal",
        "21": "Mexico",
        "22": "Japan",
        "23": "England",
        "24": "DR Congo",
        "25": "Argentina",
        "26": "Uruguay",
        "27": "United States",
        "28": "Egypt",
        "29": "Switzerland",
        "30": "Norway",
        "31": "Portugal",
        "32": "Paraguay"
      },
      "R16": {
        "1": "Germany",
        "2": "France",
        "3": "South Korea",
        "4": "Netherlands",
        "5": "Colombia",
        "6": "Spain",
        "7": "Australia",
        "8": "Belgium",
        "9": "Brazil",
        "10": "Ecuador",
        "11": "Japan",
        "12": "England",
        "13": "Argentina",
        "14": "United States",
        "15": "Switzerland",
        "16": "Portugal"
      },
      "QF": {
        "1": "France",
        "2": "Netherlands",
        "3": "Spain",
        "4": "Belgium",
        "5": "Brazil",
        "6": "England",
        "7": "Argentina",
        "8": "Portugal"
      },
      "SF": {
        "1": "France",
        "2": "Spain",
        "3": "Brazil",
        "4": "Argentina"
      },
      "F": {
        "1": "Spain",
        "2": "Brazil"
      },
      "C": {
        "1": "Spain"
      }
    }
  }
];

const WORLD_CUP_2026_GROUP_LAYOUT = [
  { group: "A", teams: ["Mexico", "South Africa", "South Korea", "Czechia"] },
  { group: "B", teams: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"] },
  { group: "C", teams: ["Brazil", "Morocco", "Haiti", "Scotland"] },
  { group: "D", teams: ["United States", "Paraguay", "Australia", "Turkey"] },
  { group: "E", teams: ["Germany", "Curacao", "Ivory Coast", "Ecuador"] },
  { group: "F", teams: ["Netherlands", "Japan", "Sweden", "Tunisia"] },
  { group: "G", teams: ["Belgium", "Egypt", "Iran", "New Zealand"] },
  { group: "H", teams: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"] },
  { group: "I", teams: ["France", "Senegal", "Iraq", "Norway"] },
  { group: "J", teams: ["Argentina", "Algeria", "Austria", "Jordan"] },
  { group: "K", teams: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"] },
  { group: "L", teams: ["England", "Croatia", "Ghana", "Panama"] }
];

const WORLD_CUP_2026_GROUP_FIXTURE_DATES = {
  A: ["2026-06-11", "2026-06-11", "2026-06-18", "2026-06-18", "2026-06-24", "2026-06-24"],
  B: ["2026-06-12", "2026-06-13", "2026-06-18", "2026-06-18", "2026-06-24", "2026-06-24"],
  C: ["2026-06-13", "2026-06-13", "2026-06-19", "2026-06-19", "2026-06-24", "2026-06-24"],
  D: ["2026-06-12", "2026-06-13", "2026-06-19", "2026-06-19", "2026-06-25", "2026-06-25"],
  E: ["2026-06-14", "2026-06-14", "2026-06-20", "2026-06-20", "2026-06-25", "2026-06-25"],
  F: ["2026-06-14", "2026-06-14", "2026-06-20", "2026-06-20", "2026-06-25", "2026-06-25"],
  G: ["2026-06-15", "2026-06-15", "2026-06-21", "2026-06-21", "2026-06-26", "2026-06-26"],
  H: ["2026-06-15", "2026-06-15", "2026-06-21", "2026-06-21", "2026-06-26", "2026-06-26"],
  I: ["2026-06-16", "2026-06-16", "2026-06-22", "2026-06-22", "2026-06-26", "2026-06-26"],
  J: ["2026-06-16", "2026-06-16", "2026-06-22", "2026-06-22", "2026-06-27", "2026-06-27"],
  K: ["2026-06-17", "2026-06-17", "2026-06-23", "2026-06-23", "2026-06-27", "2026-06-27"],
  L: ["2026-06-17", "2026-06-17", "2026-06-23", "2026-06-23", "2026-06-27", "2026-06-27"]
};

const WORLD_CUP_2026_RANKING_HISTORY = {
  Mexico: [15],
  "South Africa": [61],
  "South Korea": [22],
  Czechia: [44],
  Canada: [30, 27],
  "Bosnia and Herzegovina": [64, 71],
  Qatar: [56, 51],
  Switzerland: [19, 17],
  Brazil: [5],
  Morocco: [11],
  Haiti: [84],
  Scotland: [36],
  "United States": [14],
  Paraguay: [39],
  Australia: [26],
  Turkey: [25],
  Germany: [9],
  Curacao: [82],
  "Ivory Coast": [42],
  Ecuador: [23],
  Netherlands: [7],
  Japan: [18],
  Sweden: [62],
  Tunisia: [40],
  Belgium: [8],
  Egypt: [34],
  Iran: [20],
  "New Zealand": [86],
  Spain: [1],
  "Cape Verde": [68],
  "Saudi Arabia": [60],
  Uruguay: [16],
  France: [3],
  Senegal: [19],
  Iraq: [58],
  Norway: [29],
  Argentina: [2],
  Algeria: [35],
  Austria: [24],
  Jordan: [66],
  Portugal: [6],
  "DR Congo": [56],
  Uzbekistan: [50],
  Colombia: [13],
  England: [4],
  Croatia: [10],
  Ghana: [72],
  Panama: [30]
};

const WORLD_CUP_2026_R32_SLOT_RULES = {
  "1": "Winner Group E",
  "2": "Best 3rd from A/B/C/D/F",
  "3": "Winner Group I",
  "4": "Best 3rd from C/D/F/G/H",
  "5": "Runner-up Group A",
  "6": "Runner-up Group B",
  "7": "Winner Group F",
  "8": "Runner-up Group C",
  "9": "Runner-up Group K",
  "10": "Runner-up Group L",
  "11": "Winner Group H",
  "12": "Runner-up Group J",
  "13": "Winner Group D",
  "14": "Best 3rd from B/E/F/I/J",
  "15": "Winner Group G",
  "16": "Best 3rd from A/E/H/I/J",
  "17": "Winner Group C",
  "18": "Runner-up Group F",
  "19": "Runner-up Group E",
  "20": "Runner-up Group I",
  "21": "Winner Group A",
  "22": "Best 3rd from C/E/F/H/I",
  "23": "Winner Group L",
  "24": "Best 3rd from E/H/I/J/K",
  "25": "Winner Group J",
  "26": "Runner-up Group H",
  "27": "Runner-up Group D",
  "28": "Runner-up Group G",
  "29": "Winner Group B",
  "30": "Best 3rd from E/F/G/I/J",
  "31": "Winner Group K",
  "32": "Best 3rd from D/E/I/J/L"
};

const WORLD_CUP_2026_FIXED_R32_SLOTS = {
  "1": { group: "E", outcome: "winner" },
  "3": { group: "I", outcome: "winner" },
  "5": { group: "A", outcome: "runnerUp" },
  "6": { group: "B", outcome: "runnerUp" },
  "7": { group: "F", outcome: "winner" },
  "8": { group: "C", outcome: "runnerUp" },
  "9": { group: "K", outcome: "runnerUp" },
  "10": { group: "L", outcome: "runnerUp" },
  "11": { group: "H", outcome: "winner" },
  "12": { group: "J", outcome: "runnerUp" },
  "13": { group: "D", outcome: "winner" },
  "15": { group: "G", outcome: "winner" },
  "17": { group: "C", outcome: "winner" },
  "18": { group: "F", outcome: "runnerUp" },
  "19": { group: "E", outcome: "runnerUp" },
  "20": { group: "I", outcome: "runnerUp" },
  "21": { group: "A", outcome: "winner" },
  "23": { group: "L", outcome: "winner" },
  "25": { group: "J", outcome: "winner" },
  "26": { group: "H", outcome: "runnerUp" },
  "27": { group: "D", outcome: "runnerUp" },
  "28": { group: "G", outcome: "runnerUp" },
  "29": { group: "B", outcome: "winner" },
  "31": { group: "K", outcome: "winner" }
};

const WORLD_CUP_2026_THIRD_PLACE_SLOT_MAP = {
  "1A": "22",
  "1B": "30",
  "1D": "14",
  "1E": "2",
  "1G": "16",
  "1I": "4",
  "1K": "32",
  "1L": "24"
};

const WORLD_CUP_2026_THIRD_PLACE_COLUMNS = ["1A", "1B", "1D", "1E", "1G", "1I", "1K", "1L"];
const WIKIPEDIA_GROUP_PAGE_PREFIX = "2026_FIFA_World_Cup_Group_";
const GROUP_STAGE_GOALS_MEAN_PER_TEAM = 1.18;
const GROUP_STAGE_MAX_SIMULATED_GOALS = 6;
const SLOT_STAGE_ORDER = ["R32", "R16", "QF", "SF", "F", "C"];
const TEAM_NAME_ALIASES = {
  Mexico: ["Mexico"],
  "South Africa": ["South Africa"],
  "South Korea": ["South Korea", "Korea Republic"],
  Czechia: ["Czechia", "Czech Republic"],
  Canada: ["Canada"],
  "Bosnia and Herzegovina": ["Bosnia and Herzegovina"],
  Qatar: ["Qatar"],
  Switzerland: ["Switzerland"],
  Brazil: ["Brazil"],
  Morocco: ["Morocco"],
  Haiti: ["Haiti"],
  Scotland: ["Scotland"],
  "United States": ["United States", "USA", "United States of America"],
  Paraguay: ["Paraguay"],
  Australia: ["Australia"],
  Turkey: ["Turkey", "Turkiye"],
  Germany: ["Germany"],
  Curacao: ["Curacao", "Curaçao"],
  "Ivory Coast": ["Ivory Coast", "Cote d'Ivoire", "Côte d'Ivoire"],
  Ecuador: ["Ecuador"],
  Netherlands: ["Netherlands"],
  Japan: ["Japan"],
  Sweden: ["Sweden"],
  Tunisia: ["Tunisia"],
  Belgium: ["Belgium"],
  Egypt: ["Egypt"],
  Iran: ["Iran"],
  "New Zealand": ["New Zealand"],
  Spain: ["Spain"],
  "Cape Verde": ["Cape Verde"],
  "Saudi Arabia": ["Saudi Arabia"],
  Uruguay: ["Uruguay"],
  France: ["France"],
  Senegal: ["Senegal"],
  Iraq: ["Iraq"],
  Norway: ["Norway"],
  Argentina: ["Argentina"],
  Algeria: ["Algeria"],
  Austria: ["Austria"],
  Jordan: ["Jordan"],
  Portugal: ["Portugal"],
  "DR Congo": ["DR Congo", "Democratic Republic of the Congo", "Congo DR", "Congo"],
  Uzbekistan: ["Uzbekistan"],
  Colombia: ["Colombia"],
  England: ["England"],
  Croatia: ["Croatia"],
  Ghana: ["Ghana"],
  Panama: ["Panama"]
};

const SIMULATION_COUNT = 100000;
const TIMELINE_PREVIEW_SIMULATION_COUNT = 1200;
const TIMELINE_CACHE_STORAGE_KEY = "world-cup-2026-timeline-cache-v1";

const state = {
  scoring: {
    groupWinnerPoints: 0,
    groupRunnerUpPoints: 0,
    bracketSpotPoints: {},
    roundPoints: {},
    matchPoints: {}
  },
  tournamentName: "",
  groups: [],
  stageResults: {},
  matches: [],
  entries: [],
  latest: null,
  syncInFlight: false,
  timelineRefreshInFlight: false,
  timelineRefreshPendingMode: "",
  timelineCacheSummary: {
    cached: 0,
    total: 0
  },
  selectedGroup: "A",
  selectedStandingsView: "A",
  selectedStage: "R32",
  derived: {
    groups: [],
    byGroup: {},
    thirdPlace: []
  }
};

const $ = (id) => document.getElementById(id);

function getTimelineCacheStore() {
  try {
    const storage = globalThis.localStorage;
    if (!storage) {
      return { snapshots: {} };
    }
    const parsed = JSON.parse(storage.getItem(TIMELINE_CACHE_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? { snapshots: parsed.snapshots || {} } : { snapshots: {} };
  } catch (_error) {
    return { snapshots: {} };
  }
}

function saveTimelineCacheStore(store) {
  try {
    const storage = globalThis.localStorage;
    if (!storage) {
      return;
    }
    storage.setItem(TIMELINE_CACHE_STORAGE_KEY, JSON.stringify({ snapshots: store.snapshots || {} }));
  } catch (_error) {
    // Ignore storage failures so the app still works without persistence.
  }
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function timelineRefreshModePriority(mode) {
  if (mode === "full") {
    return 3;
  }
  if (mode === "partial") {
    return 2;
  }
  return 1;
}

const COUNTRY_FLAG_EMOJI = {
  Algeria: "🇩🇿",
  Argentina: "🇦🇷",
  Australia: "🇦🇺",
  Austria: "🇦🇹",
  Belgium: "🇧🇪",
  "Bosnia and Herzegovina": "🇧🇦",
  Brazil: "🇧🇷",
  Canada: "🇨🇦",
  "Cape Verde": "🇨🇻",
  Colombia: "🇨🇴",
  Croatia: "🇭🇷",
  Curacao: "🇨🇼",
  Curaçao: "🇨🇼",
  Czechia: "🇨🇿",
  "DR Congo": "🇨🇩",
  Ecuador: "🇪🇨",
  Egypt: "🇪🇬",
  England: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
  France: "🇫🇷",
  Germany: "🇩🇪",
  Ghana: "🇬🇭",
  Haiti: "🇭🇹",
  Iran: "🇮🇷",
  Iraq: "🇮🇶",
  "Ivory Coast": "🇨🇮",
  Japan: "🇯🇵",
  Jordan: "🇯🇴",
  Mexico: "🇲🇽",
  Morocco: "🇲🇦",
  Netherlands: "🇳🇱",
  "New Zealand": "🇳🇿",
  Norway: "🇳🇴",
  Panama: "🇵🇦",
  Paraguay: "🇵🇾",
  Portugal: "🇵🇹",
  Qatar: "🇶🇦",
  "Saudi Arabia": "🇸🇦",
  Scotland: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
  Senegal: "🇸🇳",
  "South Africa": "🇿🇦",
  "South Korea": "🇰🇷",
  Spain: "🇪🇸",
  Sweden: "🇸🇪",
  Switzerland: "🇨🇭",
  Thailand: "🇹🇭",
  Tunisia: "🇹🇳",
  Turkey: "🇹🇷",
  Turkiye: "🇹🇷",
  "United States": "🇺🇸",
  USA: "🇺🇸",
  Uruguay: "🇺🇾",
  Uzbekistan: "🇺🇿"
};

const TEAM_THREE_LETTER_CODES = {
  Algeria: "ALG",
  Argentina: "ARG",
  Australia: "AUS",
  Austria: "AUT",
  Belgium: "BEL",
  "Bosnia and Herzegovina": "BIH",
  Brazil: "BRA",
  Canada: "CAN",
  "Cape Verde": "CPV",
  Colombia: "COL",
  Croatia: "CRO",
  Curacao: "CUW",
  Curaçao: "CUW",
  Czechia: "CZE",
  "DR Congo": "COD",
  Ecuador: "ECU",
  Egypt: "EGY",
  England: "ENG",
  France: "FRA",
  Germany: "GER",
  Ghana: "GHA",
  Haiti: "HAI",
  Iran: "IRN",
  Iraq: "IRQ",
  "Ivory Coast": "CIV",
  Japan: "JPN",
  Jordan: "JOR",
  Mexico: "MEX",
  Morocco: "MAR",
  Netherlands: "NED",
  "New Zealand": "NZL",
  Norway: "NOR",
  Panama: "PAN",
  Paraguay: "PAR",
  Portugal: "POR",
  Qatar: "QAT",
  "Saudi Arabia": "KSA",
  Scotland: "SCO",
  Senegal: "SEN",
  "South Africa": "RSA",
  "South Korea": "KOR",
  Spain: "ESP",
  Sweden: "SWE",
  Switzerland: "SUI",
  Tunisia: "TUN",
  Turkey: "TUR",
  Turkiye: "TUR",
  "United States": "USA",
  USA: "USA",
  Uruguay: "URU",
  Uzbekistan: "UZB"
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === "\"" && next === "\"") {
        cell += "\"";
        i += 1;
      } else if (char === "\"") {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === "\"") {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows.shift().map((header) => header.trim());
  return rows
    .filter((values) => values.some((value) => value.trim() !== ""))
    .map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] || "").trim()])));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeName(value) {
  return String(value || "").trim();
}

function getTeamThreeLetterCode(team) {
  const normalized = normalizeName(team);
  return TEAM_THREE_LETTER_CODES[normalized] || normalized.slice(0, 3).toUpperCase();
}

function formatMatchAxisLabel(homeTeam, awayTeam) {
  return `${getTeamThreeLetterCode(homeTeam)} vs ${getTeamThreeLetterCode(awayTeam)}`;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function hasNumericScore(value) {
  return value !== "" && value !== null && value !== undefined && Number.isFinite(Number(value));
}

function normalizeRankingHistory(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => toNumber(entry, Number.POSITIVE_INFINITY));
  }
  if (value === undefined || value === null || value === "") {
    return [];
  }
  return [toNumber(value, Number.POSITIVE_INFINITY)];
}

function buildDefaultGroupFixtures(teams) {
  if (!teams || teams.length < 4) {
    return [];
  }

  return [
    { home: teams[0], away: teams[1], homeGoals: "", awayGoals: "", homeFairPlay: 0, awayFairPlay: 0, status: "pending" },
    { home: teams[2], away: teams[3], homeGoals: "", awayGoals: "", homeFairPlay: 0, awayFairPlay: 0, status: "pending" },
    { home: teams[0], away: teams[2], homeGoals: "", awayGoals: "", homeFairPlay: 0, awayFairPlay: 0, status: "pending" },
    { home: teams[3], away: teams[1], homeGoals: "", awayGoals: "", homeFairPlay: 0, awayFairPlay: 0, status: "pending" },
    { home: teams[3], away: teams[0], homeGoals: "", awayGoals: "", homeFairPlay: 0, awayFairPlay: 0, status: "pending" },
    { home: teams[1], away: teams[2], homeGoals: "", awayGoals: "", homeFairPlay: 0, awayFairPlay: 0, status: "pending" }
  ];
}

function normalizeFixture(raw) {
  const scoreText = normalizeName(raw.score);
  let [homeGoals, awayGoals] = scoreText.includes("-")
    ? scoreText.split("-").map((part) => part.trim())
    : [raw.homeGoals, raw.awayGoals];

  const parsedMatchNumber = Number(raw.matchNumber ?? raw.match ?? raw.number);

  homeGoals = hasNumericScore(homeGoals) ? toNumber(homeGoals, 0) : "";
  awayGoals = hasNumericScore(awayGoals) ? toNumber(awayGoals, 0) : "";

  return {
    date: normalizeName(raw.date),
    matchNumber: Number.isFinite(parsedMatchNumber) ? parsedMatchNumber : null,
    kickoffMinutes: Number.isFinite(Number(raw.kickoffMinutes)) ? Number(raw.kickoffMinutes) : null,
    kickoffUtcMinutes: Number.isFinite(Number(raw.kickoffUtcMinutes)) ? Number(raw.kickoffUtcMinutes) : null,
    home: normalizeName(raw.home || raw.teamA),
    away: normalizeName(raw.away || raw.teamB),
    homeGoals,
    awayGoals,
    homeFairPlay: toNumber(raw.homeFairPlay ?? raw.homeFairPlayDeductions ?? raw.homeConduct ?? 0, 0),
    awayFairPlay: toNumber(raw.awayFairPlay ?? raw.awayFairPlayDeductions ?? raw.awayConduct ?? 0, 0),
    status: normalizeName(raw.status || (hasNumericScore(homeGoals) && hasNumericScore(awayGoals) ? "complete" : "pending")) || "pending"
  };
}

function buildWorldCup2026Group(groupCode) {
  const template = WORLD_CUP_2026_GROUP_LAYOUT.find((entry) => entry.group === groupCode);
  if (!template) {
    return null;
  }
  return {
    group: groupCode,
    teams: [...template.teams],
    rankings: Object.fromEntries(template.teams.map((team) => [team, [...(WORLD_CUP_2026_RANKING_HISTORY[team] || [])]])),
    fixtures: buildDefaultGroupFixtures(template.teams),
    winner: "",
    runnerUp: ""
  };
}

function isWorldCup2026GroupSet(groups) {
  const groupCodes = [...new Set(groups.map((group) => group.group))].sort().join("");
  return groupCodes === "ABCDEFGHIJKL";
}

function ensureGroupDetails(group) {
  const template = buildWorldCup2026Group(group.group);
  const teams = (group.teams && group.teams.length ? group.teams : template?.teams || []).map((team) => normalizeName(team));
  const rankings = Object.fromEntries(
    teams.map((team) => [
      team,
      normalizeRankingHistory(group.rankings?.[team] ?? template?.rankings?.[team] ?? WORLD_CUP_2026_RANKING_HISTORY[team] ?? [])
    ])
  );

  let fixtures = (group.fixtures || []).map(normalizeFixture).filter((fixture) => fixture.home && fixture.away);
  if (!fixtures.length && teams.length === 4) {
    fixtures = buildDefaultGroupFixtures(teams);
  }

  const canonicalFixtureDates = WORLD_CUP_2026_GROUP_FIXTURE_DATES[group.group] || [];
  fixtures = fixtures.map((fixture, fixtureIndex) => ({
    ...fixture,
    date: normalizeName(fixture.date) || canonicalFixtureDates[fixtureIndex] || ""
  }));

  const referencePlayed = asArray(group.reference?.matchesPlayed);
  referencePlayed.forEach((match) => {
    const index = fixtures.findIndex((fixture) => fixture.home === normalizeName(match.home) && fixture.away === normalizeName(match.away));
    if (index < 0) {
      return;
    }
    const normalized = normalizeFixture(match);
    fixtures[index] = {
      ...fixtures[index],
      ...normalized,
      status: normalized.status || "complete"
    };
  });

  return {
    ...group,
    teams,
    rankings,
    fixtures
  };
}

function compareRankingHistory(leftHistory, rightHistory) {
  const maxLength = Math.max(leftHistory.length, rightHistory.length);
  for (let index = 0; index < maxLength; index += 1) {
    const left = leftHistory[index] ?? Number.POSITIVE_INFINITY;
    const right = rightHistory[index] ?? Number.POSITIVE_INFINITY;
    if (left !== right) {
      return left - right;
    }
  }
  return 0;
}

function createTeamStats(team, group, rankings) {
  return {
    group,
    team,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    fairPlayDeductions: 0,
    rankingHistory: normalizeRankingHistory(rankings?.[team] ?? WORLD_CUP_2026_RANKING_HISTORY[team] ?? [])
  };
}

function computeStatsForTeams(teamNames, fixtures, group, rankings) {
  const stats = Object.fromEntries(teamNames.map((team) => [team, createTeamStats(team, group, rankings)]));
  fixtures.forEach((fixture) => {
    if (fixture.status !== "complete" || !hasNumericScore(fixture.homeGoals) || !hasNumericScore(fixture.awayGoals)) {
      return;
    }
    if (!stats[fixture.home] || !stats[fixture.away]) {
      return;
    }

    const home = stats[fixture.home];
    const away = stats[fixture.away];
    home.played += 1;
    away.played += 1;
    home.goalsFor += fixture.homeGoals;
    home.goalsAgainst += fixture.awayGoals;
    away.goalsFor += fixture.awayGoals;
    away.goalsAgainst += fixture.homeGoals;
    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;
    home.fairPlayDeductions += toNumber(fixture.homeFairPlay, 0);
    away.fairPlayDeductions += toNumber(fixture.awayFairPlay, 0);

    if (fixture.homeGoals > fixture.awayGoals) {
      home.wins += 1;
      away.losses += 1;
      home.points += 3;
    } else if (fixture.homeGoals < fixture.awayGoals) {
      away.wins += 1;
      home.losses += 1;
      away.points += 3;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }
  });
  return stats;
}

function applyOverallTieBreakers(teamNames, overallStats) {
  return [...teamNames].sort((left, right) => {
    const a = overallStats[left];
    const b = overallStats[right];
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }
    if (a.fairPlayDeductions !== b.fairPlayDeductions) {
      return a.fairPlayDeductions - b.fairPlayDeductions;
    }
    const rankingCompare = compareRankingHistory(a.rankingHistory, b.rankingHistory);
    if (rankingCompare !== 0) {
      return rankingCompare;
    }
    return naturalCompare(a.team, b.team);
  });
}

function rankGroupTie(teamNames, fixtures, overallStats) {
  if (teamNames.length <= 1) {
    return [...teamNames];
  }

  const miniStats = computeStatsForTeams(teamNames, fixtures, overallStats[teamNames[0]].group, null);
  const buckets = new Map();

  teamNames.forEach((team) => {
    const stat = miniStats[team];
    const key = [stat.points, stat.goalDifference, stat.goalsFor].join("|");
    if (!buckets.has(key)) {
      buckets.set(key, []);
    }
    buckets.get(key).push(team);
  });

  const orderedBuckets = [...buckets.values()].sort((leftBucket, rightBucket) => {
    const left = miniStats[leftBucket[0]];
    const right = miniStats[rightBucket[0]];
    if (right.points !== left.points) {
      return right.points - left.points;
    }
    if (right.goalDifference !== left.goalDifference) {
      return right.goalDifference - left.goalDifference;
    }
    return right.goalsFor - left.goalsFor;
  });

  if (orderedBuckets.length === 1) {
    return applyOverallTieBreakers(teamNames, overallStats);
  }

  return orderedBuckets.flatMap((bucket) => {
    if (bucket.length === 1) {
      return bucket;
    }
    const reducedFixtures = fixtures.filter((fixture) => bucket.includes(fixture.home) && bucket.includes(fixture.away));
    return rankGroupTie(bucket, reducedFixtures, overallStats);
  });
}

function deriveGroupStandings(group) {
  const normalizedGroup = ensureGroupDetails(group);
  const completeFixtures = normalizedGroup.fixtures.filter((fixture) => fixture.status === "complete" && hasNumericScore(fixture.homeGoals) && hasNumericScore(fixture.awayGoals));
  const overallStats = computeStatsForTeams(normalizedGroup.teams, completeFixtures, normalizedGroup.group, normalizedGroup.rankings);
  const groupedByPoints = new Map();

  normalizedGroup.teams.forEach((team) => {
    const points = overallStats[team].points;
    if (!groupedByPoints.has(points)) {
      groupedByPoints.set(points, []);
    }
    groupedByPoints.get(points).push(team);
  });

  const orderedTeams = [...groupedByPoints.entries()]
    .sort((left, right) => right[0] - left[0])
    .flatMap(([, teams]) => {
      if (teams.length === 1) {
        return teams;
      }
      const tieFixtures = completeFixtures.filter((fixture) => teams.includes(fixture.home) && teams.includes(fixture.away));
      return rankGroupTie(teams, tieFixtures, overallStats);
    });

  const standings = orderedTeams.map((team, index) => ({
    position: index + 1,
    ...overallStats[team]
  }));

  const complete = normalizedGroup.fixtures.length > 0 && normalizedGroup.fixtures.every((fixture) => fixture.status === "complete" && hasNumericScore(fixture.homeGoals) && hasNumericScore(fixture.awayGoals));

  return {
    ...normalizedGroup,
    standings,
    complete,
    winner: complete ? standings[0]?.team || "" : "",
    runnerUp: complete ? standings[1]?.team || "" : "",
    thirdPlace: standings[2] || null
  };
}

function deriveThirdPlaceRanking(derivedGroups) {
  return derivedGroups
    .map((group) => group.thirdPlace)
    .filter(Boolean)
    .sort((left, right) => {
      if (right.points !== left.points) {
        return right.points - left.points;
      }
      if (right.goalDifference !== left.goalDifference) {
        return right.goalDifference - left.goalDifference;
      }
      if (right.goalsFor !== left.goalsFor) {
        return right.goalsFor - left.goalsFor;
      }
      if (left.fairPlayDeductions !== right.fairPlayDeductions) {
        return left.fairPlayDeductions - right.fairPlayDeductions;
      }
      const rankingCompare = compareRankingHistory(left.rankingHistory, right.rankingHistory);
      if (rankingCompare !== 0) {
        return rankingCompare;
      }
      return naturalCompare(left.group, right.group);
    })
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      qualifies: index < 8
    }));
}

function deriveGroupTables(groups) {
  const derivedGroups = groups.map(deriveGroupStandings);
  return {
    groups: derivedGroups,
    byGroup: Object.fromEntries(derivedGroups.map((group) => [group.group, group])),
    thirdPlace: deriveThirdPlaceRanking(derivedGroups)
  };
}

function deriveWorldCup2026R32Slots(derived) {
  const slots = {};
  Object.entries(WORLD_CUP_2026_FIXED_R32_SLOTS).forEach(([slot, rule]) => {
    const group = derived.byGroup[rule.group];
    if (!group) {
      return;
    }
    const team = rule.outcome === "winner" ? group.winner : group.runnerUp;
    if (team) {
      slots[slot] = team;
    }
  });

  const qualifiedThirds = derived.thirdPlace.filter((entry) => entry.qualifies && entry.group);
  const allGroupsComplete = derived.groups.length === 12 && derived.groups.every((group) => group.complete);
  if (!allGroupsComplete || qualifiedThirds.length < 8) {
    return slots;
  }

  const key = qualifiedThirds.map((entry) => entry.group).sort().join("");
  const combination = globalThis.ANNEX_C_THIRD_PLACE_LOOKUP?.[key];
  if (!combination) {
    return slots;
  }

  WORLD_CUP_2026_THIRD_PLACE_COLUMNS.forEach((column, index) => {
    const slot = WORLD_CUP_2026_THIRD_PLACE_SLOT_MAP[column];
    const groupCode = combination[index]?.replace(/^3/, "");
    const team = qualifiedThirds.find((entry) => entry.group === groupCode)?.team || "";
    if (slot && team) {
      slots[slot] = team;
    }
  });

  return slots;
}

function buildWorldCup2026Matches(stageResults = {}) {
  const matches = [];
  for (let index = 1; index <= 16; index += 1) {
    const slotA = String((index - 1) * 2 + 1);
    const slotB = String((index - 1) * 2 + 2);
    matches.push({
      id: `R32-${index}`,
      round: "Round of 32",
      pointsKey: "R32",
      label: `Round of 32 ${index}`,
      teams: [normalizeName(stageResults.R32?.[slotA]), normalizeName(stageResults.R32?.[slotB])],
      winner: "",
      status: "pending",
      nextMatchId: `R16-${Math.ceil(index / 2)}`,
      nextSlot: (index - 1) % 2
    });
  }

  for (let index = 1; index <= 8; index += 1) {
    matches.push({
      id: `R16-${index}`,
      round: "Round of 16",
      pointsKey: "R16",
      label: `Round of 16 ${index}`,
      teams: ["", ""],
      winner: "",
      status: "pending",
      nextMatchId: `QF-${Math.ceil(index / 2)}`,
      nextSlot: (index - 1) % 2
    });
  }

  for (let index = 1; index <= 4; index += 1) {
    matches.push({
      id: `QF-${index}`,
      round: "Quarterfinal",
      pointsKey: "QF",
      label: `Quarterfinal ${index}`,
      teams: ["", ""],
      winner: "",
      status: "pending",
      nextMatchId: `SF-${Math.ceil(index / 2)}`,
      nextSlot: (index - 1) % 2
    });
  }

  matches.push(
    { id: "SF-1", round: "Semifinal", pointsKey: "SF", label: "Semifinal 1", teams: ["", ""], winner: "", status: "pending", nextMatchId: "Final-1", nextSlot: 0 },
    { id: "SF-2", round: "Semifinal", pointsKey: "SF", label: "Semifinal 2", teams: ["", ""], winner: "", status: "pending", nextMatchId: "Final-1", nextSlot: 1 },
    { id: "Final-1", round: "Final", pointsKey: "Final", label: "World Cup Final", teams: ["", ""], winner: "", status: "pending" }
  );

  return matches;
}

function syncWorldCup2026Matches(existingMatches, stageResults) {
  const baseMatches = existingMatches.length ? mergeResults(buildWorldCup2026Matches(stageResults), existingMatches) : buildWorldCup2026Matches(stageResults);
  return baseMatches.map((match) => {
    if (!match.id.startsWith("R32-")) {
      return match;
    }
    const index = toNumber(match.id.split("-")[1], 0);
    const slotA = String((index - 1) * 2 + 1);
    const slotB = String((index - 1) * 2 + 2);
    return {
      ...match,
      teams: [normalizeName(stageResults.R32?.[slotA]), normalizeName(stageResults.R32?.[slotB])]
    };
  });
}

function detectFormat(text, name) {
  const trimmed = text.trim();
  if (name.toLowerCase().endsWith(".json") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return "json";
  }
  return "csv";
}

function coerceMatch(raw) {
  const teams = Array.isArray(raw.teams)
    ? raw.teams.slice(0, 2)
    : [raw.teamA ?? raw.team1 ?? raw.homeTeam ?? "", raw.teamB ?? raw.team2 ?? raw.awayTeam ?? ""];

  return {
    id: normalizeName(raw.id || raw.matchId),
    label: normalizeName(raw.label || raw.name || raw.id || raw.matchId),
    round: normalizeName(raw.round || raw.stage || raw.pointsKey),
    pointsKey: normalizeName(raw.pointsKey || raw.round || raw.stage),
    teams: teams.map((team) => normalizeName(team)),
    winner: normalizeName(raw.winner),
    status: normalizeName(raw.status || (raw.winner ? "complete" : "pending")) || "pending",
    nextMatchId: normalizeName(raw.nextMatchId),
    nextSlot: raw.nextSlot === undefined || raw.nextSlot === null || raw.nextSlot === "" ? null : toNumber(raw.nextSlot, 0)
  };
}

function parseScoringData(text, fileName) {
  if (detectFormat(text, fileName) === "json") {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return scoringFromRows(parsed);
    }
    return {
      groupWinnerPoints: toNumber(parsed.groupWinnerPoints ?? parsed.groupWinner ?? parsed.groupPoints?.winner, 0),
      groupRunnerUpPoints: toNumber(parsed.groupRunnerUpPoints ?? parsed.groupRunnerUp ?? parsed.groupPoints?.runnerUp, 0),
      bracketSpotPoints: normalizeBracketSpotPoints(parsed.bracketSpotPoints || parsed.slotPoints || {}),
      roundPoints: normalizeScoreMap(parsed.roundPoints || parsed.rounds || {}),
      matchPoints: normalizeScoreMap(parsed.matchPoints || parsed.matches || {})
    };
  }

  return scoringFromRows(parseCsv(text));
}

function normalizeScoreMap(source) {
  return Object.fromEntries(
    Object.entries(source).map(([key, value]) => [normalizeName(key), toNumber(value, 0)])
  );
}

function normalizeBracketSpotPoints(source) {
  const normalized = {};
  Object.entries(source || {}).forEach(([stage, values]) => {
    const stageKey = normalizeStageKey(stage);
    if (!stageKey) {
      return;
    }

    if (Array.isArray(values)) {
      normalized[stageKey] = Object.fromEntries(
        values.map((value, index) => {
          if (value && typeof value === "object") {
            return [String(toNumber(value.slot, index + 1)), toNumber(value.points ?? value.value, 0)];
          }
          return [String(index + 1), toNumber(value, 0)];
        })
      );
      return;
    }

    normalized[stageKey] = Object.fromEntries(
      Object.entries(values || {}).map(([slot, points]) => [String(toNumber(slot, 0) || slot), toNumber(points, 0)])
    );
  });
  return normalized;
}

function scoringFromRows(rows) {
  const scoring = {
    groupWinnerPoints: 0,
    groupRunnerUpPoints: 0,
    bracketSpotPoints: {},
    roundPoints: {},
    matchPoints: {}
  };

  rows.forEach((row) => {
    const points = toNumber(row.points ?? row.score ?? row.value, 0);
    const round = normalizeName(row.round ?? row.pointsKey ?? row.stage);
    const stage = normalizeStageKey(row.stage ?? row.bracketStage ?? row.column);
    const slot = normalizeName(row.slot ?? row.position);
    const matchId = normalizeName(row.matchId ?? row.id);
    const groupOutcome = normalizeGroupOutcome(row.groupOutcome ?? row.groupPick ?? row.type ?? row.slot);

    if (groupOutcome === "winner") {
      scoring.groupWinnerPoints = points;
      return;
    }

    if (groupOutcome === "runnerUp") {
      scoring.groupRunnerUpPoints = points;
      return;
    }

    if (stage && slot) {
      if (!scoring.bracketSpotPoints[stage]) {
        scoring.bracketSpotPoints[stage] = {};
      }
      scoring.bracketSpotPoints[stage][slot] = points;
      return;
    }

    if (matchId) {
      scoring.matchPoints[matchId] = points;
    } else if (round) {
      scoring.roundPoints[round] = points;
    }
  });

  return scoring;
}

function parseEntriesData(text, fileName) {
  if (detectFormat(text, fileName) === "json") {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed.map(coerceEntry).filter((entry) => entry.name);
    }
    if (Array.isArray(parsed.entries)) {
      return parsed.entries.map(coerceEntry).filter((entry) => entry.name);
    }
    return [coerceEntry(parsed)].filter((entry) => entry.name);
  }

  const rows = parseCsv(text);
  if (!rows.length) {
    return [];
  }

  return rows.map((row) => {
    const { picks, groupPicks } = extractCsvEntryPicks(row);
    Object.entries(row).forEach(([key, value]) => {
      if (!["name", "entry", "person", "player"].includes(key.toLowerCase()) && !parseGroupPickColumn(key)) {
        picks[normalizeName(key)] = normalizeName(value);
      }
    });

    return coerceEntry({
      name: row.name || row.entry || row.person || row.player,
      picks,
      groupPicks
    });
  }).filter((entry) => entry.name);
}

function coerceEntry(raw) {
  const picks = Object.fromEntries(
    Object.entries(raw.picks || {}).map(([matchId, team]) => [normalizeName(matchId), normalizeName(team)])
  );

  const slotPicks = normalizeStageEntries(raw.slotPicks || raw.bracketPicks || {});
  const groupPicks = Object.fromEntries(
    Object.entries(raw.groupPicks || {}).map(([group, prediction]) => [
      normalizeName(group),
      {
        winner: normalizeName(prediction?.winner),
        runnerUp: normalizeName(prediction?.runnerUp)
      }
    ])
  );

  return {
    name: normalizeName(raw.name || raw.entry || raw.player),
    picks,
    slotPicks,
    groupPicks
  };
}

function normalizeStageKey(value) {
  const normalized = normalizeName(value).toUpperCase();
  if (!normalized) {
    return "";
  }
  const compact = normalized.replace(/[\s_-]+/g, "");
  if (compact === "ROUNDOF32" || compact === "R32") {
    return "R32";
  }
  if (compact === "ROUNDOF16" || compact === "LAST16" || compact === "R16") {
    return "R16";
  }
  if (compact === "QF" || compact === "QUARTERFINAL" || compact === "QUARTERFINALS") {
    return "QF";
  }
  if (compact === "SF" || compact === "SEMIFINAL" || compact === "SEMIFINALS") {
    return "SF";
  }
  if (compact === "F" || compact === "FINAL" || compact === "FINALIST" || compact === "FINALISTS") {
    return "F";
  }
  if (compact === "C" || compact === "CHAMPION") {
    return "C";
  }
  return normalized;
}

function normalizeStageEntries(source) {
  const normalized = {};
  Object.entries(source || {}).forEach(([stage, values]) => {
    const stageKey = normalizeStageKey(stage);
    if (!stageKey) {
      return;
    }
    if (Array.isArray(values)) {
      normalized[stageKey] = Object.fromEntries(
        values.map((team, index) => [String(index + 1), normalizeName(team?.team || team)])
      );
      return;
    }

    normalized[stageKey] = Object.fromEntries(
      Object.entries(values || {}).map(([slot, team]) => [String(toNumber(slot, 0) || slot), normalizeName(team?.team || team)])
    );
  });
  return normalized;
}

function parseResultsData(text, fileName) {
  if (detectFormat(text, fileName) === "json") {
    const parsed = JSON.parse(text);
    return {
      tournamentName: normalizeName(parsed.tournamentName || parsed.name || "World Cup Pool"),
      groups: asArray(parsed.groups).map(coerceGroupResult).filter((group) => group.group),
      stageResults: normalizeStageResults(parsed.stageResults || parsed.slots || {}),
      matches: asArray(parsed.matches || parsed).map(coerceMatch).filter((match) => match.id)
    };
  }

  const rows = parseCsv(text);
  return {
    tournamentName: state.tournamentName || "World Cup Pool",
    groups: rows.filter((row) => row.group).map(coerceGroupResult).filter((group) => group.group),
    stageResults: rows.filter((row) => row.stage && row.slot).reduce((accumulator, row) => {
      const stage = normalizeStageKey(row.stage);
      if (!stage) {
        return accumulator;
      }
      if (!accumulator[stage]) {
        accumulator[stage] = {};
      }
      accumulator[stage][String(toNumber(row.slot, 0) || row.slot)] = normalizeName(row.team ?? row.pick ?? row.value);
      return accumulator;
    }, {}),
    matches: rows.filter((row) => row.matchId || row.id).map(coerceMatch).filter((match) => match.id)
  };
}

function normalizeStageResults(source) {
  const normalized = {};
  Object.entries(source || {}).forEach(([stage, values]) => {
    const stageKey = normalizeStageKey(stage);
    if (!stageKey) {
      return;
    }
    if (Array.isArray(values)) {
      normalized[stageKey] = Object.fromEntries(
        values.map((entry, index) => [String(toNumber(entry?.slot, index + 1)), normalizeName(entry?.team || entry)])
      );
      return;
    }
    normalized[stageKey] = Object.fromEntries(
      Object.entries(values || {}).map(([slot, team]) => [String(toNumber(slot, 0) || slot), normalizeName(team?.team || team)])
    );
  });
  return normalized;
}

function mergeEntries(existing, incoming) {
  const byName = new Map(existing.map((entry) => [entry.name, entry]));
  incoming.forEach((entry) => {
    byName.set(entry.name, entry);
  });
  return [...byName.values()];
}

function mergeResults(existingMatches, incomingMatches) {
  if (!existingMatches.length) {
    return incomingMatches;
  }

  const merged = new Map(existingMatches.map((match) => [match.id, { ...match, teams: [...match.teams] }]));
  incomingMatches.forEach((match) => {
    const prior = merged.get(match.id);
    merged.set(match.id, {
      ...(prior || {}),
      ...match,
      teams: match.teams.some(Boolean) ? [...match.teams] : prior?.teams || ["", ""]
    });
  });

  return [...merged.values()];
}

function mergeGroups(existingGroups, incomingGroups) {
  if (!existingGroups.length) {
    return incomingGroups;
  }

  const merged = new Map(existingGroups.map((group) => [group.group, { ...group }]));
  incomingGroups.forEach((group) => {
    const prior = merged.get(group.group);
    merged.set(group.group, {
      ...(prior || {}),
      ...group
    });
  });

  return [...merged.values()];
}

function mergeStageResults(existing, incoming) {
  const merged = structuredClone(existing || {});
  Object.entries(incoming || {}).forEach(([stage, slots]) => {
    const stageKey = normalizeStageKey(stage);
    if (!merged[stageKey]) {
      merged[stageKey] = {};
    }
    Object.entries(slots || {}).forEach(([slot, team]) => {
      merged[stageKey][String(slot)] = normalizeName(team);
    });
  });
  return merged;
}

function buildFeederMap(matches) {
  const feederMap = new Map();
  matches.forEach((match) => {
    if (!match.nextMatchId) {
      return;
    }
    if (!feederMap.has(match.nextMatchId)) {
      feederMap.set(match.nextMatchId, [null, null]);
    }
    const slots = feederMap.get(match.nextMatchId);
    const slotIndex = match.nextSlot === 1 ? 1 : 0;
    slots[slotIndex] = match.id;
  });
  return feederMap;
}

function resolvePossibleWinners(matchId, matchMap, feederMap, memo) {
  if (memo.has(matchId)) {
    return memo.get(matchId);
  }

  const match = matchMap.get(matchId);
  if (!match) {
    return new Set();
  }

  if (match.winner) {
    const set = new Set([match.winner]);
    memo.set(matchId, set);
    return set;
  }

  const entrants = resolvePossibleEntrants(matchId, matchMap, feederMap, memo);
  const winners = new Set([...entrants[0], ...entrants[1]].filter(Boolean));
  memo.set(matchId, winners);
  return winners;
}

function resolvePossibleEntrants(matchId, matchMap, feederMap, memo) {
  const match = matchMap.get(matchId);
  const feeders = feederMap.get(matchId) || [null, null];

  return [0, 1].map((slot) => {
    if (match?.teams?.[slot]) {
      return new Set([match.teams[slot]]);
    }
    if (feeders[slot]) {
      return resolvePossibleWinners(feeders[slot], matchMap, feederMap, memo);
    }
    return new Set();
  });
}

function resolveSimulationEntrants(matchId, matchMap, feederMap, winnersByMatch) {
  const match = matchMap.get(matchId);
  const feeders = feederMap.get(matchId) || [null, null];

  return [0, 1].map((slot) => {
    if (match?.teams?.[slot]) {
      return match.teams[slot];
    }
    if (feeders[slot] && winnersByMatch.has(feeders[slot])) {
      return winnersByMatch.get(feeders[slot]);
    }
    return "";
  });
}

function getMatchPoints(match, scoring) {
  return scoring.matchPoints[match.id] ?? scoring.roundPoints[match.pointsKey] ?? scoring.roundPoints[match.round] ?? 0;
}

function normalizeGroupOutcome(value) {
  const normalized = normalizeName(value).toLowerCase().replace(/[\s_-]+/g, "");
  if (normalized === "winner" || normalized === "groupwinner") {
    return "winner";
  }
  if (normalized === "runnerup" || normalized === "grouprunnerup" || normalized === "runnerupteam") {
    return "runnerUp";
  }
  return "";
}

function parseGroupPickColumn(columnName) {
  const normalized = normalizeName(columnName);
  const explicitMatch = normalized.match(/^group\s+([a-z0-9]+)\s+(winner|runner[\s-]*up)$/i);
  if (explicitMatch) {
    return {
      group: explicitMatch[1].toUpperCase(),
      outcome: normalizeGroupOutcome(explicitMatch[2])
    };
  }

  const compactMatch = normalized.match(/^([a-z0-9]+)[\s_-]+(winner|runner[\s-]*up)$/i);
  if (compactMatch) {
    return {
      group: compactMatch[1].toUpperCase(),
      outcome: normalizeGroupOutcome(compactMatch[2])
    };
  }

  return null;
}

function extractCsvEntryPicks(row) {
  const picks = {};
  const groupPicks = {};

  Object.entries(row).forEach(([key, value]) => {
    const groupColumn = parseGroupPickColumn(key);
    if (!groupColumn) {
      return;
    }
    if (!groupPicks[groupColumn.group]) {
      groupPicks[groupColumn.group] = { winner: "", runnerUp: "" };
    }
    groupPicks[groupColumn.group][groupColumn.outcome] = normalizeName(value);
  });

  return { picks, groupPicks };
}

function coerceGroupResult(raw) {
  return {
    group: normalizeName(raw.group || raw.id || raw.name).toUpperCase(),
    teams: asArray(raw.teams).map(normalizeName).filter(Boolean),
    rankings: Object.fromEntries(
      Object.entries(raw.rankings || {}).map(([team, history]) => [normalizeName(team), normalizeRankingHistory(history)])
    ),
    fixtures: asArray(raw.fixtures).map(normalizeFixture).filter((fixture) => fixture.home && fixture.away),
    winner: normalizeName(raw.winner),
    runnerUp: normalizeName(raw.runnerUp ?? raw.runnerup ?? raw.second),
    reference: raw.reference && typeof raw.reference === "object" ? structuredClone(raw.reference) : {}
  };
}

function supportsStandingsUpdater(groups) {
  return groups.some((group) => asArray(group.teams).length === 4 || asArray(group.fixtures).length > 0) || isWorldCup2026GroupSet(groups);
}

function refreshDerivedState() {
  if (!supportsStandingsUpdater(state.groups)) {
    state.derived = {
      groups: [],
      byGroup: {},
      thirdPlace: []
    };
    return;
  }

  const normalizedGroups = state.groups.map(ensureGroupDetails);
  const derived = deriveGroupTables(normalizedGroups);
  state.derived = derived;
  state.groups = derived.groups.map((group) => ({
    group: group.group,
    teams: [...group.teams],
    rankings: structuredClone(group.rankings || {}),
    fixtures: group.fixtures.map((fixture) => ({ ...fixture })),
    winner: group.winner,
    runnerUp: group.runnerUp,
    reference: group.reference && typeof group.reference === "object" ? structuredClone(group.reference) : {}
  }));

  if (!isWorldCup2026GroupSet(derived.groups)) {
    return;
  }

  const nextStageResults = {
    ...state.stageResults,
    R32: deriveWorldCup2026R32Slots(derived)
  };
  state.stageResults = nextStageResults;
  state.matches = syncWorldCup2026Matches(state.matches, nextStageResults);
}

function hasScoringRules(scoring) {
  return (
    Object.keys(scoring.bracketSpotPoints || {}).some((stage) => Object.keys(scoring.bracketSpotPoints[stage] || {}).length > 0) ||
    Object.keys(scoring.roundPoints || {}).length > 0 ||
    Object.keys(scoring.matchPoints || {}).length > 0 ||
    Number(scoring.groupWinnerPoints || 0) > 0 ||
    Number(scoring.groupRunnerUpPoints || 0) > 0
  );
}

function scoreGroupPicks(entry, groups, scoring) {
  let total = 0;

  groups.forEach((group) => {
    const prediction = entry.groupPicks?.[group.group];
    if (!prediction) {
      return;
    }
    if (group.winner && prediction.winner === group.winner) {
      total += toNumber(scoring.groupWinnerPoints, 0);
    }
    if (group.runnerUp && prediction.runnerUp === group.runnerUp) {
      total += toNumber(scoring.groupRunnerUpPoints, 0);
    }
  });

  return total;
}

function compareStagePicks(entry, stageResults, scoring, onlyResolved) {
  let total = 0;
  const slotPicks = entry.slotPicks || {};

  Object.entries(scoring.bracketSpotPoints || {}).forEach(([stage, slotPoints]) => {
    const actualSlots = stageResults?.[stage] || {};
    const entrySlots = slotPicks?.[stage] || {};

    Object.entries(slotPoints || {}).forEach(([slot, points]) => {
      const actualTeam = normalizeName(actualSlots[slot]);
      const pickedTeam = normalizeName(entrySlots[slot]);
      if (onlyResolved && !actualTeam) {
        return;
      }
      if (actualTeam && pickedTeam && actualTeam === pickedTeam) {
        total += toNumber(points, 0);
      }
    });
  });

  return total;
}

function sortMatchesById(matches) {
  return [...matches].sort((left, right) => naturalCompare(left.id, right.id));
}

function naturalCompare(left, right) {
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
}

function normalizeComparableText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function stageDisplayName(stage) {
  const normalized = normalizeStageKey(stage);
  if (normalized === "R32") {
    return "Round of 32";
  }
  if (normalized === "R16") {
    return "Round of 16";
  }
  if (normalized === "QF") {
    return "Quarterfinals";
  }
  if (normalized === "SF") {
    return "Semifinals";
  }
  if (normalized === "F") {
    return "Finalists";
  }
  if (normalized === "C") {
    return "Champion";
  }
  return normalized || "Stage";
}

function getStageSlotCount(stage) {
  const normalized = normalizeStageKey(stage);
  const candidates = [];
  candidates.push(...Object.keys(state.scoring?.bracketSpotPoints?.[normalized] || {}).map((slot) => toNumber(slot, 0)));
  candidates.push(...Object.keys(state.stageResults?.[normalized] || {}).map((slot) => toNumber(slot, 0)));
  state.entries.forEach((entry) => {
    candidates.push(...Object.keys(entry.slotPicks?.[normalized] || {}).map((slot) => toNumber(slot, 0)));
  });
  return Math.max(...candidates, 0);
}

function getStageSlotLabel(stage, slot) {
  const normalized = normalizeStageKey(stage);
  if (normalized === "R32") {
    return WORLD_CUP_2026_R32_SLOT_RULES[String(slot)] || `${stageDisplayName(normalized)} ${slot}`;
  }
  const stageScoring = state.scoring?.bracketSpotPoints?.[normalized] || {};
  return stageScoring[String(slot)]?.label || `${stageDisplayName(normalized)} ${slot}`;
}

function getStageSlotPoints(stage, slot) {
  const normalized = normalizeStageKey(stage);
  const stageScoring = state.scoring?.bracketSpotPoints?.[normalized] || {};
  return toNumber(stageScoring[String(slot)]?.points, 0);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTeamNamePattern(team) {
  const aliases = [...new Set([team, ...(TEAM_NAME_ALIASES[team] || [])])];
  return `(?:${aliases.map((name) => escapeRegExp(normalizeComparableText(name))).join("|")})`;
}

async function fetchWikipediaGroupHtml(groupCode) {
  const page = `${WIKIPEDIA_GROUP_PAGE_PREFIX}${encodeURIComponent(groupCode)}`;
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${page}&prop=text&formatversion=2&format=json&origin=*`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Wikipedia group fetch failed for Group ${groupCode}: ${response.status}`);
    }
    const payload = await response.json();
    const html = payload?.parse?.text;
    if (!html) {
      throw new Error(`Wikipedia returned no parsed HTML for Group ${groupCode}.`);
    }
    return html;
  } catch (fetchError) {
    const callbackName = `wikiCallback_${groupCode}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const fallbackUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${page}&prop=text&formatversion=2&format=json&callback=${callbackName}`;
    const html = await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const timeoutId = window.setTimeout(() => {
        cleanup();
        reject(new Error(`Wikipedia group fetch timed out for Group ${groupCode}.`));
      }, 10000);

      function cleanup() {
        window.clearTimeout(timeoutId);
        delete window[callbackName];
        script.remove();
      }

      window[callbackName] = (payload) => {
        cleanup();
        const parsedHtml = payload?.parse?.text;
        if (!parsedHtml) {
          reject(new Error(`Wikipedia returned no parsed HTML for Group ${groupCode}.`));
          return;
        }
        resolve(parsedHtml);
      };

      script.onerror = () => {
        cleanup();
        reject(fetchError);
      };
      script.src = fallbackUrl;
      document.head.appendChild(script);
    });
    return html;
  }
}

function extractCompletedScoresFromHtml(groupHtml, group) {
  const parser = new DOMParser();
  const fragment = parser.parseFromString(groupHtml, "text/html");
  const normalizedText = normalizeComparableText(fragment.body.textContent || "");
  const results = [];

  group.fixtures.forEach((fixture, fixtureIndex) => {
    const homePattern = buildTeamNamePattern(fixture.home);
    const awayPattern = buildTeamNamePattern(fixture.away);
    const patterns = [
      new RegExp(`${homePattern}\\s+(\\d+)\\s*-\\s*(\\d+)\\s+${awayPattern}`, "i"),
      new RegExp(`${awayPattern}\\s+(\\d+)\\s*-\\s*(\\d+)\\s+${homePattern}`, "i")
    ];

    for (const pattern of patterns) {
      const match = normalizedText.match(pattern);
      if (!match) {
        continue;
      }
      const homeGoals = toNumber(match[1], 0);
      const awayGoals = toNumber(match[2], 0);
      const swapped = pattern === patterns[1];
      results.push({
        fixtureIndex,
        homeGoals: swapped ? awayGoals : homeGoals,
        awayGoals: swapped ? homeGoals : awayGoals
      });
      break;
    }
  });

  return results;
}

function collectSectionTextUntilNextHeading(heading) {
  const chunks = [];
  let cursor = heading.nextElementSibling;
  while (cursor) {
    if (/^H[23]$/i.test(cursor.tagName)) {
      break;
    }
    chunks.push(cursor.textContent || "");
    cursor = cursor.nextElementSibling;
  }
  return chunks.join(" ");
}

function parseKickoffTimeToMinutes(timeText, meridiemText = "") {
  const timeMatch = String(timeText || "").match(/(\d{1,2}):(\d{2})/);
  if (!timeMatch) {
    return null;
  }
  let hours = toNumber(timeMatch[1], 0);
  const minutes = toNumber(timeMatch[2], 0);
  const meridiem = normalizeComparableText(meridiemText).replace(/\./g, "");
  if (meridiem === "pm" && hours < 12) {
    hours += 12;
  }
  if (meridiem === "am" && hours === 12) {
    hours = 0;
  }
  return (hours * 60) + minutes;
}

function parseUtcOffsetToMinutes(offsetText = "") {
  const match = String(offsetText).match(/UTC([+-])(\d{1,2})(?::(\d{2}))?/i);
  if (!match) {
    return null;
  }
  const sign = match[1] === "-" ? -1 : 1;
  const hours = toNumber(match[2], 0);
  const minutes = toNumber(match[3] || 0, 0);
  return sign * ((hours * 60) + minutes);
}

function extractFixtureScheduleMetadataFromHtml(groupHtml, group) {
  const parser = new DOMParser();
  const fragment = parser.parseFromString(groupHtml, "text/html");
  const metadataByFixtureIndex = {};
  const headings = Array.from(fragment.querySelectorAll("h3"));

  group.fixtures.forEach((fixture, fixtureIndex) => {
    const heading = headings.find((node) => normalizeComparableText(node.textContent || "") === normalizeComparableText(`${fixture.home} vs ${fixture.away}`));
    if (!heading) {
      return;
    }

    const sectionText = collectSectionTextUntilNextHeading(heading);
    const isoDateMatch = sectionText.match(/\((\d{4}-\d{2}-\d{2})\)/);
    const timeMatch = sectionText.match(/(\d{1,2}:\d{2})\s*(a\.m\.|p\.m\.)/i);
    const utcOffsetMatch = sectionText.match(/UTC([+-]\d{1,2}(?::\d{2})?)/i);
    const kickoffMinutes = timeMatch ? parseKickoffTimeToMinutes(timeMatch[1], timeMatch[2]) : null;
    const utcOffsetMinutes = utcOffsetMatch ? parseUtcOffsetToMinutes(`UTC${utcOffsetMatch[1]}`) : null;
    const matchNumberMatch = sectionText.match(/Match\s+(\d+)/i);

    metadataByFixtureIndex[fixtureIndex] = {
      date: isoDateMatch ? isoDateMatch[1] : normalizeName(fixture.date),
      matchNumber: matchNumberMatch ? toNumber(matchNumberMatch[1], null) : fixture.matchNumber ?? null,
      kickoffMinutes,
      kickoffUtcMinutes: kickoffMinutes !== null && utcOffsetMinutes !== null ? kickoffMinutes - utcOffsetMinutes : null
    };
  });

  return metadataByFixtureIndex;
}

function getDisciplineCardDeduction(cell) {
  return Array.from(cell?.querySelectorAll("img") || []).reduce((total, image) => {
    const description = normalizeComparableText(
      image.getAttribute("alt")
      || image.getAttribute("title")
      || image.getAttribute("aria-label")
      || ""
    );

    if (description.includes("yellow-red card")) {
      return total + 3;
    }
    if (description.includes("yellow card")) {
      return total + 1;
    }
    if (description.includes("red card") && !description.includes("arrow")) {
      return total + 4;
    }
    return total;
  }, 0);
}

function getDisciplineCountValue(cell) {
  const text = normalizeComparableText(cell?.textContent || "");
  const numericMatch = text.match(/\d+/);
  if (numericMatch) {
    return toNumber(numericMatch[0], 0);
  }
  return 0;
}

function countTeamCardDeductionsFromTable(table) {
  const rows = Array.from(table?.querySelectorAll("tr") || []);
  let total = 0;

  rows.forEach((row) => {
    const descriptions = Array.from(row.querySelectorAll("img"))
      .map((image) => normalizeComparableText(
        image.getAttribute("alt")
        || image.getAttribute("title")
        || image.getAttribute("aria-label")
        || ""
      ));

    const hasYellowRed = descriptions.some((description) => description.includes("yellow-red card"));
    const hasRed = descriptions.some((description) => description.includes("red card") && !description.includes("yellow-red") && !description.includes("arrow"));
    const hasYellow = descriptions.some((description) => description.includes("yellow card") && !description.includes("yellow-red"));

    if (hasYellow && hasRed) {
      total += 5;
      return;
    }
    if (hasYellowRed) {
      total += 3;
      return;
    }
    if (hasRed) {
      total += 4;
      return;
    }
    if (hasYellow) {
      total += 1;
    }
  });

  return total;
}

function findDisciplineTable(fragment) {
  const disciplineHeading = Array.from(fragment.querySelectorAll("h2, h3, .mw-headline"))
    .find((node) => normalizeComparableText(node.textContent || "") === "discipline");

  let cursor = disciplineHeading?.closest("h2, h3") || disciplineHeading;
  while (cursor) {
    cursor = cursor.nextElementSibling;
    if (!cursor) {
      break;
    }
    if (/^H[23]$/i.test(cursor.tagName)) {
      break;
    }
    if (cursor.tagName === "TABLE" && normalizeComparableText(cursor.textContent || "").includes("match 1")) {
      return cursor;
    }
  }

  return Array.from(fragment.querySelectorAll("table"))
    .find((table) => {
      const text = normalizeComparableText(table.textContent || "");
      return text.includes("match 1") && text.includes("match 2") && text.includes("match 3") && text.includes("score");
    }) || null;
}

function matchGroupTeamCell(cellText, group) {
  const normalizedCell = normalizeComparableText(cellText);
  return group.teams.find((team) => {
    const aliases = [team, ...(TEAM_NAME_ALIASES[team] || [])];
    return aliases.some((alias) => normalizedCell.includes(normalizeComparableText(alias)));
  }) || "";
}

function findMatchHeading(fragment, fixture) {
  const expectedHeading = normalizeComparableText(`${fixture.home} vs ${fixture.away}`);
  return Array.from(fragment.querySelectorAll("h3"))
    .find((node) => normalizeComparableText(node.textContent || "") === expectedHeading) || null;
}

function collectSectionNodesUntilNextHeading(heading) {
  const nodes = [];
  let cursor = heading.nextElementSibling;
  while (cursor) {
    if (/^H[23]$/i.test(cursor.tagName)) {
      break;
    }
    nodes.push(cursor);
    cursor = cursor.nextElementSibling;
  }
  return nodes;
}

function extractFairPlayByFixtureFromMatchSections(groupHtml, group) {
  const parser = new DOMParser();
  const fragment = parser.parseFromString(groupHtml, "text/html");
  const deductionsByFixtureIndex = {};

  group.fixtures.forEach((fixture, fixtureIndex) => {
    const heading = findMatchHeading(fragment, fixture);
    if (!heading) {
      return;
    }

    const sectionNodes = collectSectionNodesUntilNextHeading(heading);
    const footballBox = sectionNodes.find((node) => {
      const className = normalizeComparableText(node.className || "");
      return className.includes("footballbox") || !!node.querySelector?.(".footballbox");
    });
    const footballRoot = footballBox?.classList?.contains("footballbox")
      ? footballBox
      : footballBox?.querySelector?.(".footballbox");

    const homeTables = footballRoot
      ? Array.from(footballRoot.querySelectorAll(".fleft table, .fb-template-team1 table"))
      : [];
    const awayTables = footballRoot
      ? Array.from(footballRoot.querySelectorAll(".fright table, .fb-template-team2 table"))
      : [];

    const homeFairPlayTotal = homeTables.reduce((sum, table) => sum + countTeamCardDeductionsFromTable(table), 0);
    const awayFairPlayTotal = awayTables.reduce((sum, table) => sum + countTeamCardDeductionsFromTable(table), 0);

    if (!homeFairPlayTotal && !awayFairPlayTotal) {
      return;
    }

    deductionsByFixtureIndex[fixtureIndex] = {
      homeFairPlay: homeFairPlayTotal,
      awayFairPlay: awayFairPlayTotal
    };
  });

  return deductionsByFixtureIndex;
}

function extractFairPlayByTeamFromHtml(groupHtml, group) {
  const parser = new DOMParser();
  const fragment = parser.parseFromString(groupHtml, "text/html");
  const disciplineTable = findDisciplineTable(fragment);

  if (!disciplineTable) {
    return {};
  }

  const rows = Array.from(disciplineTable.querySelectorAll("tr"));
  const deductionsByTeam = {};

  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll("th, td"));
    if (!cells.length) {
      return;
    }

    const teamCellIndex = cells.findIndex((cell) => matchGroupTeamCell(cell.textContent || "", group));
    if (teamCellIndex < 0) {
      return;
    }

    const team = matchGroupTeamCell(cells[teamCellIndex].textContent || "", group);
    if (!team) {
      return;
    }

    const scoreCellOffset = cells.length > (teamCellIndex + 13) ? 1 : 0;
    const disciplineCells = cells.slice(teamCellIndex + 1, cells.length - scoreCellOffset);

    if (disciplineCells.length >= 12) {
      const matchDeductions = [];
      for (let matchIndex = 0; matchIndex < 3; matchIndex += 1) {
        const baseIndex = matchIndex * 4;
        const yellowCards = getDisciplineCountValue(disciplineCells[baseIndex]);
        const secondYellowReds = getDisciplineCountValue(disciplineCells[baseIndex + 1]);
        const straightReds = getDisciplineCountValue(disciplineCells[baseIndex + 2]);
        const yellowPlusRed = getDisciplineCountValue(disciplineCells[baseIndex + 3]);

        matchDeductions.push(
          yellowCards
          + (3 * secondYellowReds)
          + (4 * straightReds)
          + (5 * yellowPlusRed)
        );
      }

      deductionsByTeam[team] = matchDeductions;
      return;
    }

    const matchCells = disciplineCells.slice(0, 3);
    if (!matchCells.length) {
      return;
    }

    deductionsByTeam[team] = matchCells.map((cell) => getDisciplineCardDeduction(cell));
  });

  return deductionsByTeam;
}

function getTeamFixtureAppearanceIndex(fixtures, fixtureIndex, team) {
  let appearanceIndex = -1;
  for (let index = 0; index <= fixtureIndex; index += 1) {
    const fixture = fixtures[index];
    if (!fixture) {
      continue;
    }
    if (fixture.home === team || fixture.away === team) {
      appearanceIndex += 1;
    }
  }
  return appearanceIndex;
}

function deriveStageResults(matches, winnersByMatch, baseStageResults = {}) {
  const derived = mergeStageResults({}, baseStageResults);
  const stageTransitions = [
    ["R32", "R16"],
    ["R16", "QF"],
    ["QF", "SF"],
    ["SF", "F"],
    ["Final", "C"]
  ];

  stageTransitions.forEach(([matchStage, targetStage]) => {
    const stageMatches = sortMatchesById(matches.filter((match) => normalizeStageKey(match.pointsKey || match.round) === normalizeStageKey(matchStage)));
    if (!stageMatches.length) {
      return;
    }
    if (!derived[targetStage]) {
      derived[targetStage] = {};
    }
    stageMatches.forEach((match, index) => {
      const winner = normalizeName(winnersByMatch.get(match.id));
      if (winner) {
        derived[targetStage][String(index + 1)] = winner;
      }
    });
  });

  return derived;
}

function scoreEntry(entry, matchMap, groups, stageResults, scoring, winnersByMatch, onlyCompleted) {
  let total = scoreGroupPicks(entry, groups, scoring);
  total += compareStagePicks(entry, stageResults, scoring, onlyCompleted);
  matchMap.forEach((match) => {
    const winner = winnersByMatch.get(match.id) || "";
    if (!winner) {
      return;
    }
    if (onlyCompleted && !match.winner) {
      return;
    }
    if (entry.picks[match.id] === winner) {
      total += getMatchPoints(match, scoring);
    }
  });
  return total;
}

function buildTournamentData(matches) {
  const matchMap = new Map(matches.map((match) => [match.id, match]));
  const feederMap = buildFeederMap(matches);
  return { matchMap, feederMap };
}

function cloneGroupsForSimulation(groups) {
  return groups.map((group) => ({
    group: group.group,
    teams: [...(group.teams || [])],
    rankings: structuredClone(group.rankings || {}),
    fixtures: asArray(group.fixtures).map((fixture) => ({ ...fixture })),
    winner: group.winner || "",
    runnerUp: group.runnerUp || "",
    reference: structuredClone(group.reference || {})
  }));
}

function samplePoisson(lambda) {
  const threshold = Math.exp(-lambda);
  let product = 1;
  let count = 0;

  while (product > threshold) {
    count += 1;
    product *= Math.random();
  }

  return count - 1;
}

function simulateFixtureScoreline() {
  const homeGoals = Math.min(samplePoisson(GROUP_STAGE_GOALS_MEAN_PER_TEAM), GROUP_STAGE_MAX_SIMULATED_GOALS);
  const awayGoals = Math.min(samplePoisson(GROUP_STAGE_GOALS_MEAN_PER_TEAM), GROUP_STAGE_MAX_SIMULATED_GOALS);
  return { homeGoals, awayGoals };
}

function simulatePendingGroups(groups) {
  const simulatedGroups = cloneGroupsForSimulation(groups).map(ensureGroupDetails);

  simulatedGroups.forEach((group) => {
    group.fixtures = group.fixtures.map((fixture) => {
      if (fixture.status === "complete" && hasNumericScore(fixture.homeGoals) && hasNumericScore(fixture.awayGoals)) {
        return { ...fixture };
      }
      const scoreline = simulateFixtureScoreline();
      return {
        ...fixture,
        homeGoals: scoreline.homeGoals,
        awayGoals: scoreline.awayGoals,
        homeFairPlay: toNumber(fixture.homeFairPlay, 0),
        awayFairPlay: toNumber(fixture.awayFairPlay, 0),
        status: "complete"
      };
    });
  });

  return deriveGroupTables(simulatedGroups);
}

function buildSimulationState(groups, baseStageResults, baseMatches) {
  if (!supportsStandingsUpdater(groups) || !isWorldCup2026GroupSet(groups)) {
    return {
      groups,
      stageResults: baseStageResults,
      matches: baseMatches
    };
  }

  const simulatedDerived = simulatePendingGroups(groups);
  const simulatedStageResults = mergeStageResults(baseStageResults, {
    R32: deriveWorldCup2026R32Slots(simulatedDerived)
  });
  const simulatedMatches = syncWorldCup2026Matches(baseMatches, simulatedStageResults).map((match) => ({
    ...match,
    teams: [...(match.teams || [])]
  }));

  return {
    groups: simulatedDerived.groups,
    stageResults: simulatedStageResults,
    matches: simulatedMatches
  };
}

function simulatePool(groups, matches, entries, scoring, iterations = SIMULATION_COUNT, baseStageResults = state.stageResults) {
  const { matchMap, feederMap } = buildTournamentData(matches);
  const completedWinners = new Map(matches.filter((match) => match.winner).map((match) => [match.id, match.winner]));
  const currentStageResults = deriveStageResults(matches, completedWinners, baseStageResults);
  const stats = new Map(entries.map((entry) => [entry.name, {
    winCredits: 0,
    projectedTotal: 0,
    currentPoints: scoreEntry(entry, matchMap, groups, currentStageResults, scoring, completedWinners, true)
  }]));
  let completedRuns = 0;

  for (let run = 0; run < iterations; run += 1) {
    const simulation = buildSimulationState(groups, baseStageResults, matches);
    const { matchMap: simulatedMatchMap, feederMap: simulatedFeederMap } = buildTournamentData(simulation.matches);
    const winnersByMatch = new Map(simulation.matches.filter((match) => match.winner).map((match) => [match.id, match.winner]));
    const pending = new Set(simulation.matches.map((match) => match.id).filter((id) => !winnersByMatch.has(id)));

    while (pending.size) {
      let progressed = false;

      pending.forEach((matchId) => {
        const entrants = resolveSimulationEntrants(matchId, simulatedMatchMap, simulatedFeederMap, winnersByMatch);
        if (!entrants[0] || !entrants[1]) {
          return;
        }

        const winner = Math.random() < 0.5 ? entrants[0] : entrants[1];
        winnersByMatch.set(matchId, winner);
        pending.delete(matchId);
        progressed = true;
      });

      if (!progressed) {
        break;
      }
    }

    if (pending.size) {
      continue;
    }

    completedRuns += 1;
    const simulatedStageResults = deriveStageResults(simulation.matches, winnersByMatch, simulation.stageResults);

    const scores = entries.map((entry) => ({
      name: entry.name,
      total: scoreEntry(entry, simulatedMatchMap, simulation.groups, simulatedStageResults, scoring, winnersByMatch, false)
    }));

    const maxScore = Math.max(...scores.map((score) => score.total));
    const winners = scores.filter((score) => score.total === maxScore);
    const splitCredit = winners.length ? 1 / winners.length : 0;

    scores.forEach((score) => {
      const record = stats.get(score.name);
      record.projectedTotal += score.total;
      if (score.total === maxScore) {
        record.winCredits += splitCredit;
      }
    });
  }

  const possibleWinnerMemo = new Map();

  const leaderboard = entries.map((entry) => {
    const record = stats.get(entry.name);
    let perfectPicksLeft = 0;
    let bestCase = record.currentPoints;

    groups.forEach((group) => {
      if (group.winner && group.runnerUp) {
        return;
      }
      const prediction = entry.groupPicks?.[group.group];
      if (!prediction) {
        return;
      }
      if (!group.winner && prediction.winner) {
        bestCase += toNumber(scoring.groupWinnerPoints, 0);
        perfectPicksLeft += 1;
      }
      if (!group.runnerUp && prediction.runnerUp) {
        bestCase += toNumber(scoring.groupRunnerUpPoints, 0);
        perfectPicksLeft += 1;
      }
    });

    if (Object.keys(scoring.bracketSpotPoints || {}).some((stage) => Object.keys(scoring.bracketSpotPoints[stage] || {}).length > 0)) {
      Object.entries(scoring.bracketSpotPoints || {}).forEach(([stage, slotPoints]) => {
        const actualSlots = currentStageResults?.[stage] || {};
        const entrySlots = entry.slotPicks?.[stage] || {};
        Object.entries(slotPoints || {}).forEach(([slot, points]) => {
          const actualTeam = normalizeName(actualSlots[slot]);
          const pickedTeam = normalizeName(entrySlots[slot]);
          if (actualTeam || !pickedTeam) {
            return;
          }
          perfectPicksLeft += 1;
          bestCase += toNumber(points, 0);
        });
      });
    } else {
      matches.forEach((match) => {
        if (match.winner) {
          return;
        }
        const aliveTeams = resolvePossibleWinners(match.id, matchMap, feederMap, possibleWinnerMemo);
        if (aliveTeams.has(entry.picks[match.id])) {
          perfectPicksLeft += 1;
          bestCase += getMatchPoints(match, scoring);
        }
      });
    }

    return {
      name: entry.name,
      currentPoints: record.currentPoints,
      winOdds: completedRuns ? record.winCredits / completedRuns : 0,
      projectedFinal: completedRuns ? record.projectedTotal / completedRuns : record.currentPoints,
      bestCase,
      perfectPicksLeft
    };
  }).sort((left, right) => {
    if (right.currentPoints !== left.currentPoints) {
      return right.currentPoints - left.currentPoints;
    }
    return right.winOdds - left.winOdds;
  });

  return {
    leaderboard,
    completedRuns
  };
}

function formatTimelineLabel(key, index) {
  if (key === "pre-tournament") {
    return "Before start";
  }
  if (key.startsWith("date:")) {
    const dateValue = key.slice(5);
    const parsed = new Date(`${dateValue}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }
  }
  return `Day ${index + 1}`;
}

function createGroupsSnapshot(groups, includedKeys) {
  return groups.map((group) => {
    const detailedGroup = ensureGroupDetails(group);
    const reference = structuredClone(detailedGroup.reference || {});
    delete reference.matchesPlayed;
    const fixtures = detailedGroup.fixtures.map((fixture, index) => {
      const eventKey = `group:${group.group}:${index}`;
      if (fixture.status === "complete" && includedKeys.has(eventKey)) {
        return { ...fixture, status: "complete" };
      }
      return {
        ...fixture,
        homeGoals: "",
        awayGoals: "",
        status: "pending"
      };
    });

    return {
      group: detailedGroup.group,
      teams: [...detailedGroup.teams],
      rankings: structuredClone(detailedGroup.rankings || {}),
      fixtures,
      winner: "",
      runnerUp: "",
      reference
    };
  });
}

function serializeGroupsForTimelineCache(groups) {
  return groups.map((group) => ({
    group: group.group,
    teams: [...(group.teams || [])],
    winner: normalizeName(group.winner),
    runnerUp: normalizeName(group.runnerUp),
    fixtures: asArray(group.fixtures).map((fixture) => ({
      date: normalizeName(fixture.date),
      matchNumber: Number.isFinite(Number(fixture.matchNumber)) ? Number(fixture.matchNumber) : null,
      kickoffMinutes: Number.isFinite(Number(fixture.kickoffMinutes)) ? Number(fixture.kickoffMinutes) : null,
      kickoffUtcMinutes: Number.isFinite(Number(fixture.kickoffUtcMinutes)) ? Number(fixture.kickoffUtcMinutes) : null,
      home: normalizeName(fixture.home),
      away: normalizeName(fixture.away),
      homeGoals: hasNumericScore(fixture.homeGoals) ? toNumber(fixture.homeGoals, 0) : "",
      awayGoals: hasNumericScore(fixture.awayGoals) ? toNumber(fixture.awayGoals, 0) : "",
      homeFairPlay: toNumber(fixture.homeFairPlay, 0),
      awayFairPlay: toNumber(fixture.awayFairPlay, 0),
      status: normalizeName(fixture.status || "")
    }))
  }));
}

function serializeEntriesForTimelineCache(entries) {
  return entries.map((entry) => ({
    name: entry.name,
    groupPicks: structuredClone(entry.groupPicks || {}),
    slotPicks: structuredClone(entry.slotPicks || {}),
    picks: structuredClone(entry.picks || {})
  }));
}

function serializeScoringForTimelineCache(scoring) {
  return {
    groupWinnerPoints: toNumber(scoring.groupWinnerPoints, 0),
    groupRunnerUpPoints: toNumber(scoring.groupRunnerUpPoints, 0),
    bracketSpotPoints: structuredClone(scoring.bracketSpotPoints || {}),
    roundPoints: structuredClone(scoring.roundPoints || {}),
    matchPoints: structuredClone(scoring.matchPoints || {})
  };
}

function buildTimelineCacheKey(_kind, _label, groups, entries, scoring, stageResults = {}) {
  return JSON.stringify({
    groups: serializeGroupsForTimelineCache(groups),
    entries: serializeEntriesForTimelineCache(entries),
    scoring: serializeScoringForTimelineCache(scoring),
    stageResults: structuredClone(stageResults || {})
  });
}

function buildTimelinePointModels(groups, entries, scoring) {
  if (!groups.length || !entries.length || !hasScoringRules(scoring) || !supportsStandingsUpdater(groups)) {
    return [];
  }

  const getChronologicalSortValue = (event) => {
    if (!event.rawDate) {
      return null;
    }
    const baseDate = new Date(`${event.rawDate}T00:00:00Z`);
    if (Number.isNaN(baseDate.getTime())) {
      return null;
    }
    if (event.kickoffUtcMinutes !== null) {
      return baseDate.getTime() + (event.kickoffUtcMinutes * 60 * 1000);
    }
    if (event.kickoffMinutes !== null) {
      return baseDate.getTime() + (event.kickoffMinutes * 60 * 1000);
    }
    return baseDate.getTime();
  };

  const buildSnapshotModel = (key, index, includedKeys, customLabel = "") => {
    const snapshotGroups = createGroupsSnapshot(groups, includedKeys);
    const snapshotDerived = deriveGroupTables(snapshotGroups.map(ensureGroupDetails));
    const snapshotStageResults = mergeStageResults({}, isWorldCup2026GroupSet(snapshotDerived.groups) ? { R32: deriveWorldCup2026R32Slots(snapshotDerived) } : {});
    const snapshotMatches = isWorldCup2026GroupSet(snapshotDerived.groups) ? syncWorldCup2026Matches([], snapshotStageResults) : [];

    return {
      key,
      label: customLabel || formatTimelineLabel(key, index),
      kind: key === "live" ? "live" : "history",
      groups: snapshotDerived.groups,
      stageResults: snapshotStageResults,
      matches: snapshotMatches,
      cacheKey: buildTimelineCacheKey(key === "live" ? "live" : "history", customLabel || formatTimelineLabel(key, index), snapshotDerived.groups, entries, scoring, snapshotStageResults)
    };
  };

  const completedEvents = [];
  groups.forEach((group) => {
    const detailedGroup = ensureGroupDetails(group);
    detailedGroup.fixtures.forEach((fixture, fixtureIndex) => {
      if (fixture.status !== "complete" || !hasNumericScore(fixture.homeGoals) || !hasNumericScore(fixture.awayGoals)) {
        return;
      }
      completedEvents.push({
        key: `group:${group.group}:${fixtureIndex}`,
        label: formatMatchAxisLabel(fixture.home, fixture.away),
        rawDate: fixture.date || "",
        matchNumber: Number.isFinite(Number(fixture.matchNumber)) ? Number(fixture.matchNumber) : null,
        kickoffMinutes: Number.isFinite(Number(fixture.kickoffMinutes)) ? Number(fixture.kickoffMinutes) : null,
        kickoffUtcMinutes: Number.isFinite(Number(fixture.kickoffUtcMinutes)) ? Number(fixture.kickoffUtcMinutes) : null,
        fallbackOrder: completedEvents.length
      });
    });
  });

  if (!completedEvents.length) {
    return [buildSnapshotModel("pre-tournament", 0, new Set())];
  }

  completedEvents
    .sort((left, right) => {
      const leftChronologicalValue = getChronologicalSortValue(left);
      const rightChronologicalValue = getChronologicalSortValue(right);

      if (leftChronologicalValue !== null && rightChronologicalValue !== null && leftChronologicalValue !== rightChronologicalValue) {
        return leftChronologicalValue - rightChronologicalValue;
      }
      if (left.rawDate && right.rawDate && left.rawDate !== right.rawDate) {
        return naturalCompare(left.rawDate, right.rawDate);
      }
      if (left.kickoffUtcMinutes !== null && right.kickoffUtcMinutes !== null && left.kickoffUtcMinutes !== right.kickoffUtcMinutes) {
        return left.kickoffUtcMinutes - right.kickoffUtcMinutes;
      }
      if (left.kickoffMinutes !== null && right.kickoffMinutes !== null && left.kickoffMinutes !== right.kickoffMinutes) {
        return left.kickoffMinutes - right.kickoffMinutes;
      }
      if (left.rawDate && !right.rawDate) {
        return -1;
      }
      if (!left.rawDate && right.rawDate) {
        return 1;
      }
      if (left.matchNumber !== null && right.matchNumber !== null && left.matchNumber !== right.matchNumber) {
        return left.matchNumber - right.matchNumber;
      }
      return left.fallbackOrder - right.fallbackOrder;
    });

  const includedKeys = new Set();
  const timeline = [buildSnapshotModel("pre-tournament", 0, includedKeys)];

  completedEvents.forEach((event, index) => {
    includedKeys.add(event.key);
    timeline.push(buildSnapshotModel(event.key, index + 1, includedKeys, event.label));
  });

  return timeline;
}

function simulateTimelinePoint(model, entries, scoring, iterations = SIMULATION_COUNT) {
  return simulatePool(model.groups, model.matches, entries, scoring, iterations, model.stageResults);
}

function getCachedTimelinePoint(cacheKey) {
  return getTimelineCacheStore().snapshots?.[cacheKey] || null;
}

function saveCachedTimelinePoint(cacheKey, model, snapshot) {
  const store = getTimelineCacheStore();
  store.snapshots[cacheKey] = {
    label: model.label,
    key: model.key,
    kind: model.kind,
    computedAt: new Date().toISOString(),
    completedRuns: snapshot.completedRuns,
    leaderboard: snapshot.leaderboard.map((entry) => ({ ...entry }))
  };
  saveTimelineCacheStore(store);
}

function getCurrentTimelineModel(groups, entries, scoring) {
  const models = buildTimelinePointModels(groups, entries, scoring);
  return models.length ? models[models.length - 1] : null;
}

function persistLatestCalculationToTimelineCache() {
  if (!state.latest?.leaderboard?.length || !state.groups.length || !state.entries.length || !hasScoringRules(state.scoring)) {
    return;
  }
  const currentModel = getCurrentTimelineModel(state.groups, state.entries, state.scoring);
  if (!currentModel) {
    return;
  }
  saveCachedTimelinePoint(currentModel.cacheKey, currentModel, state.latest);
}

function buildProbabilityTimelineData(groups, entries, scoring) {
  const models = buildTimelinePointModels(groups, entries, scoring);
  if (!models.length) {
    state.timelineCacheSummary = { cached: 0, total: 0 };
    return [];
  }

  let cachedCount = 0;
  const previewMemo = new Map();
  const timeline = models.map((model) => {
    const cached = getCachedTimelinePoint(model.cacheKey);
    if (cached?.leaderboard?.length) {
      cachedCount += 1;
      return {
        key: model.key,
        label: model.label,
        leaderboard: cached.leaderboard.map((entry) => ({ ...entry })),
        source: "cached"
      };
    }

    if (!previewMemo.has(model.cacheKey)) {
      const fallback = model.kind === "live" && state.latest?.leaderboard?.length
        ? { leaderboard: state.latest.leaderboard }
        : simulateTimelinePoint(model, entries, scoring, TIMELINE_PREVIEW_SIMULATION_COUNT);
      previewMemo.set(model.cacheKey, fallback.leaderboard.map((entry) => ({ ...entry })));
    }

    return {
      key: model.key,
      label: model.label,
      leaderboard: previewMemo.get(model.cacheKey).map((entry) => ({ ...entry })),
      source: "preview"
    };
  });

  state.timelineCacheSummary = {
    cached: cachedCount,
    total: models.length
  };

  return timeline;
}

function renderTimelineChart(containerId, timeline, config) {
  const container = $(containerId);
  if (!container) {
    return;
  }
  if (!timeline.length) {
    container.innerHTML = `<div class="empty-state">${escapeHtml(config.emptyMessage)}</div>`;
    return;
  }
  const seriesNames = [...new Set(timeline.flatMap((point) => point.leaderboard.map((entry) => entry.name)))];
  const colors = [
    "#c65d2e",
    "#1d7b7d",
    "#d7a22a",
    "#355070",
    "#6d597a",
    "#b56576",
    "#4f772d",
    "#3c6e71"
  ];
  const shapeSequence = ["circle", "square", "triangle", "diamond", "cross", "plus", "star", "hexagon"];
  const colorByName = Object.fromEntries(seriesNames.map((name, index) => [name, colors[index % colors.length]]));
  const shapeByName = Object.fromEntries(seriesNames.map((name, index) => [name, shapeSequence[index % shapeSequence.length]]));
  const width = 920;
  const height = 360;
  const margin = { top: 18, right: 24, bottom: 168, left: 58 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const xStep = timeline.length > 1 ? plotWidth / (timeline.length - 1) : 0;
  const values = timeline.flatMap((point) => point.leaderboard.map((entry) => toNumber(entry[config.valueKey], 0)));
  const lowestValue = values.length ? Math.min(...values) : 0;
  const highestValue = values.length ? Math.max(...values) : 0;
  const yAxisMin = config.axisFloor(lowestValue, highestValue);
  let yAxisMax = config.axisCeiling(highestValue, yAxisMin);
  if (!(yAxisMax > yAxisMin)) {
    const fallbackStep = typeof config.axisStep === "function"
      ? config.axisStep(highestValue || yAxisMin || 1)
      : 1;
    yAxisMax = yAxisMin + fallbackStep;
  }
  const yAxisRange = yAxisMax - yAxisMin;
  const yFor = (value) => margin.top + plotHeight - (((value - yAxisMin) / yAxisRange) * plotHeight);
  const xFor = (index) => margin.left + (xStep * index);

  const gridLines = Array.from({ length: 5 }, (_, index) => yAxisMin + ((yAxisRange * index) / 4));
  const paths = seriesNames.map((name) => {
    const points = timeline.map((point, index) => {
      const entry = point.leaderboard.find((row) => row.name === name);
      return {
        x: xFor(index),
        y: yFor(toNumber(entry?.[config.valueKey], 0)),
        value: toNumber(entry?.[config.valueKey], 0),
        label: point.label
      };
    });
    return {
      name,
      color: colorByName[name],
      shape: shapeByName[name],
      path: points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" "),
      points
    };
  });

  const markerSvg = (shape, x, y, color, filled = true) => {
    const stroke = filled ? color : "#1e2a2f";
    const fill = filled ? color : "#ffffff";
    switch (shape) {
      case "square":
        return `<rect x="${(x - 4).toFixed(2)}" y="${(y - 4).toFixed(2)}" width="8" height="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"></rect>`;
      case "triangle":
        return `<polygon points="${x.toFixed(2)},${(y - 5).toFixed(2)} ${(x - 5).toFixed(2)},${(y + 4).toFixed(2)} ${(x + 5).toFixed(2)},${(y + 4).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"></polygon>`;
      case "diamond":
        return `<polygon points="${x.toFixed(2)},${(y - 5).toFixed(2)} ${(x - 5).toFixed(2)},${y.toFixed(2)} ${x.toFixed(2)},${(y + 5).toFixed(2)} ${(x + 5).toFixed(2)},${y.toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"></polygon>`;
      case "cross":
        return `<g stroke="${stroke}" stroke-width="2" stroke-linecap="round"><line x1="${(x - 4).toFixed(2)}" y1="${(y - 4).toFixed(2)}" x2="${(x + 4).toFixed(2)}" y2="${(y + 4).toFixed(2)}"></line><line x1="${(x + 4).toFixed(2)}" y1="${(y - 4).toFixed(2)}" x2="${(x - 4).toFixed(2)}" y2="${(y + 4).toFixed(2)}"></line></g>`;
      case "plus":
        return `<g stroke="${stroke}" stroke-width="2" stroke-linecap="round"><line x1="${x.toFixed(2)}" y1="${(y - 5).toFixed(2)}" x2="${x.toFixed(2)}" y2="${(y + 5).toFixed(2)}"></line><line x1="${(x - 5).toFixed(2)}" y1="${y.toFixed(2)}" x2="${(x + 5).toFixed(2)}" y2="${y.toFixed(2)}"></line></g>`;
      case "star":
        return `<polygon points="${x.toFixed(2)},${(y - 5).toFixed(2)} ${(x + 1.8).toFixed(2)},${(y - 1.6).toFixed(2)} ${(x + 5).toFixed(2)},${(y - 1.2).toFixed(2)} ${(x + 2.6).toFixed(2)},${(y + 1.2).toFixed(2)} ${(x + 3.3).toFixed(2)},${(y + 5).toFixed(2)} ${x.toFixed(2)},${(y + 2.8).toFixed(2)} ${(x - 3.3).toFixed(2)},${(y + 5).toFixed(2)} ${(x - 2.6).toFixed(2)},${(y + 1.2).toFixed(2)} ${(x - 5).toFixed(2)},${(y - 1.2).toFixed(2)} ${(x - 1.8).toFixed(2)},${(y - 1.6).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"></polygon>`;
      case "hexagon":
        return `<polygon points="${(x - 4.5).toFixed(2)},${y.toFixed(2)} ${(x - 2.2).toFixed(2)},${(y - 4).toFixed(2)} ${(x + 2.2).toFixed(2)},${(y - 4).toFixed(2)} ${(x + 4.5).toFixed(2)},${y.toFixed(2)} ${(x + 2.2).toFixed(2)},${(y + 4).toFixed(2)} ${(x - 2.2).toFixed(2)},${(y + 4).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1.3"></polygon>`;
      case "circle":
      default:
        return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"></circle>`;
    }
  };

  const markerHtml = (series, point) => {
    if (config.shapeMarkers) {
      return `
        <g
          data-series-name="${escapeHtml(series.name)}"
          data-point-label="${escapeHtml(point.label)}"
          data-point-value="${escapeHtml(config.valueFormatter(point.value))}"
        >
          ${markerSvg(series.shape, point.x, point.y, series.color, true)}
          <title>${escapeHtml(series.name)}: ${escapeHtml(config.valueFormatter(point.value))}</title>
        </g>
      `;
    }
    return `
      <circle
        cx="${point.x}"
        cy="${point.y}"
        r="4"
        fill="${series.color}"
        data-series-name="${escapeHtml(series.name)}"
        data-point-label="${escapeHtml(point.label)}"
        data-point-value="${escapeHtml(config.valueFormatter(point.value))}"
      >
        <title>${escapeHtml(series.name)}: ${escapeHtml(config.valueFormatter(point.value))}</title>
      </circle>
    `;
  };

  const legendMarkerHtml = (series) => {
    if (!config.shapeMarkers) {
      return `<span class="timeline-swatch" style="background:${series.color}"></span>`;
    }
    return `
      <svg class="timeline-shape-swatch" viewBox="0 0 16 16" aria-hidden="true">
        ${markerSvg(series.shape, 8, 8, series.color, false)}
      </svg>
    `;
  };

  container.innerHTML = `
    <svg class="timeline-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(config.ariaLabel)}">
      ${gridLines.map((tick) => `
        <line class="timeline-grid-line" x1="${margin.left}" x2="${width - margin.right}" y1="${yFor(tick)}" y2="${yFor(tick)}"></line>
        <text class="timeline-tick-label" x="${margin.left - 10}" y="${yFor(tick) + 4}" text-anchor="end">${escapeHtml(config.tickFormatter(tick))}</text>
      `).join("")}
      <line class="timeline-axis" x1="${margin.left}" x2="${margin.left}" y1="${margin.top}" y2="${height - margin.bottom}"></line>
      <line class="timeline-axis" x1="${margin.left}" x2="${width - margin.right}" y1="${height - margin.bottom}" y2="${height - margin.bottom}"></line>
      ${timeline.map((point, index) => `
        <text class="timeline-tick-label timeline-x-tick-label" x="${xFor(index)}" y="${height - margin.bottom + 12}" text-anchor="start" transform="rotate(90 ${xFor(index)} ${height - margin.bottom + 12})">${escapeHtml(point.label)}</text>
      `).join("")}
      <text class="timeline-axis-label" x="${margin.left - 42}" y="${margin.top - 2}">${escapeHtml(config.yAxisLabel)}</text>
      <text class="timeline-axis-label" x="${width / 2}" y="${height - 10}" text-anchor="middle">${escapeHtml(config.xAxisLabel || "Match")}</text>
      ${paths.map((series) => `
        <path d="${series.path}" fill="none" stroke="${series.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
        ${series.points.map((point) => markerHtml(series, point)).join("")}
      `).join("")}
    </svg>
    <div class="timeline-tooltip"></div>
    <div class="timeline-legend">
      ${paths.map((series) => `
        <div class="timeline-legend-item">
          ${legendMarkerHtml(series)}
          <span>${escapeHtml(series.name)}</span>
        </div>
      `).join("")}
    </div>
  `;

  const tooltip = container.querySelector(".timeline-tooltip");
  const markers = container.querySelectorAll("[data-series-name]");
  const positionTooltip = (marker) => {
    const circleRect = marker.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    tooltip.style.left = `${circleRect.left - containerRect.left + (circleRect.width / 2)}px`;
    tooltip.style.top = `${circleRect.top - containerRect.top + (circleRect.height / 2)}px`;
  };
  markers.forEach((marker) => {
    marker.addEventListener("mouseenter", () => {
      tooltip.innerHTML = `<strong>${marker.dataset.seriesName}</strong><br>${marker.dataset.pointLabel}: ${marker.dataset.pointValue}`;
      positionTooltip(marker);
      tooltip.classList.add("visible");
    });
    marker.addEventListener("mousemove", () => {
      positionTooltip(marker);
    });
    marker.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });
}

function renderProbabilityTimeline() {
  const timeline = buildProbabilityTimelineData(state.groups, state.entries, state.scoring);
  renderTimelineChart("probabilityTimeline", timeline, {
    valueKey: "winOdds",
    emptyMessage: "The win probability history will appear once the saved pool is loaded.",
    ariaLabel: "Win probability by day line chart",
    yAxisLabel: "Win %",
    axisFloor: (lowestValue) => floorPercentToSignificantFigures(lowestValue, 2),
    axisCeiling: (highestValue, yAxisMin) => {
      const ceiling = ceilPercentToSignificantFigures(highestValue, 2);
      return ceiling > yAxisMin ? ceiling : yAxisMin + percentSignificantFigureStep(highestValue || yAxisMin || 0.01, 2);
    },
    axisStep: (value) => percentSignificantFigureStep(value || 0.01, 2),
    tickFormatter: (value) => `${Math.round(value * 100)}%`,
    valueFormatter: formatPercent,
    xAxisLabel: "Match"
  });
}

function renderProjectedPointsTimeline() {
  const timeline = buildProbabilityTimelineData(state.groups, state.entries, state.scoring);
  renderTimelineChart("projectedPointsTimeline", timeline, {
    valueKey: "projectedFinal",
    emptyMessage: "The projected points history will appear once the saved pool is loaded.",
    ariaLabel: "Projected points by day line chart",
    yAxisLabel: "Points",
    axisFloor: (lowestValue) => floorToSignificantFigures(lowestValue, 2),
    axisCeiling: (highestValue, yAxisMin) => {
      const ceiling = ceilToSignificantFigures(highestValue, 2);
      return ceiling > yAxisMin ? ceiling : yAxisMin + significantFigureStep(highestValue || yAxisMin || 0.1, 2);
    },
    axisStep: (value) => significantFigureStep(value || 0.1, 2),
    tickFormatter: (value) => String(Math.round(value)),
    valueFormatter: (value) => value.toFixed(1),
    xAxisLabel: "Match"
  });
  renderTimelineChart("projectedPointsTimelineAccessible", timeline, {
    valueKey: "projectedFinal",
    emptyMessage: "The projected points history will appear once the saved pool is loaded.",
    ariaLabel: "Color-blind-friendly projected points by match line chart",
    yAxisLabel: "Points",
    axisFloor: (lowestValue) => floorToSignificantFigures(lowestValue, 2),
    axisCeiling: (highestValue, yAxisMin) => {
      const ceiling = ceilToSignificantFigures(highestValue, 2);
      return ceiling > yAxisMin ? ceiling : yAxisMin + significantFigureStep(highestValue || yAxisMin || 0.1, 2);
    },
    axisStep: (value) => significantFigureStep(value || 0.1, 2),
    tickFormatter: (value) => String(Math.round(value)),
    valueFormatter: (value) => value.toFixed(1),
    xAxisLabel: "Match",
    shapeMarkers: true
  });
}

function renderTimelineCacheStatus() {
  const node = $("timelineCacheStatus");
  if (!node) {
    return;
  }
  const { cached, total } = state.timelineCacheSummary || { cached: 0, total: 0 };
  if (!total) {
    node.textContent = "Saved full-strength timeline snapshots will appear here.";
    return;
  }
  const refreshLabel = state.timelineRefreshInFlight ? " Refreshing saved snapshots now..." : "";
  node.textContent = `${cached} of ${total} timeline points are currently using saved full-strength simulations.${refreshLabel}`;
}

async function refreshTimelineSimulationCache(mode = "missing") {
  if (state.timelineRefreshInFlight) {
    if (timelineRefreshModePriority(mode) > timelineRefreshModePriority(state.timelineRefreshPendingMode || "missing")) {
      state.timelineRefreshPendingMode = mode;
    }
    return;
  }

  if (!state.groups.length || !state.entries.length || !hasScoringRules(state.scoring)) {
    return;
  }

  const models = buildTimelinePointModels(state.groups, state.entries, state.scoring);
  if (!models.length) {
    return;
  }

  const store = getTimelineCacheStore();
  let targets = [];
  if (mode === "full") {
    targets = models;
  } else if (mode === "partial") {
    targets = models.length ? [models[models.length - 1]] : [];
  } else {
    targets = models.filter((model) => !store.snapshots?.[model.cacheKey]);
  }
  targets = targets.filter((model, index, list) => list.findIndex((entry) => entry.cacheKey === model.cacheKey) === index);

  if (!targets.length) {
    renderProbabilityTimeline();
    renderProjectedPointsTimeline();
    renderTimelineCacheStatus();
    setStatus(mode === "partial"
      ? "The current chart endpoint is already using a saved full-strength simulation."
      : "The timeline is already using saved full-strength simulations for every available point.");
    return;
  }

  state.timelineRefreshInFlight = true;
  renderTimelineCacheStatus();

  const totalTargets = targets.length;
  try {
    for (let index = 0; index < targets.length; index += 1) {
      const model = targets[index];
      setStatus(
        mode === "partial"
          ? "Recalculating the current chart endpoint at full simulation strength..."
          : `Refreshing saved timeline snapshot ${index + 1} of ${totalTargets} at full simulation strength...`
      );
      await Promise.resolve();
      const snapshot = simulateTimelinePoint(model, state.entries, state.scoring, SIMULATION_COUNT);

      if (mode === "partial" && index === targets.length - 1) {
        state.latest = snapshot;
      }
      saveCachedTimelinePoint(model.cacheKey, model, snapshot);
      renderProbabilityTimeline();
      renderProjectedPointsTimeline();
      renderTimelineCacheStatus();
    }

    if (mode === "partial") {
      renderAll();
      setStatus("Saved a fresh full-strength simulation for the current chart endpoint.");
    } else if (mode === "full") {
      renderAll();
      setStatus(`Rebuilt and saved ${totalTargets} full-strength timeline points.`);
    } else {
      renderAll();
      setStatus(`Saved ${totalTargets} new full-strength timeline point${totalTargets === 1 ? "" : "s"} for the charts.`);
    }
  } finally {
    state.timelineRefreshInFlight = false;
    renderTimelineCacheStatus();
    if (state.timelineRefreshPendingMode) {
      const pendingMode = state.timelineRefreshPendingMode;
      state.timelineRefreshPendingMode = "";
      refreshTimelineSimulationCache(pendingMode).catch((error) => console.error(error));
    }
  }
}

function renderStatCards() {
  const container = $("summaryGrid");
  if ((!state.groups.length && !state.matches.length) || !state.entries.length) {
    container.innerHTML = "";
    return;
  }

  const completedGroups = state.groups.filter((group) => group.winner || group.runnerUp).length;
  const completedMatches = state.matches.filter((match) => match.winner).length;
  const leaderboard = state.latest?.leaderboard || [];
  const leader = leaderboard[0];
  const leaders = leader ? leaderboard.filter((entry) => entry.currentPoints === leader.currentPoints) : [];
  const leaderLabel = leaders.length > 1 ? leaders.map((entry) => entry.name).join(", ") : leader?.name || "None";
  const leaderDetail = leader
    ? `${leader.currentPoints} points so far${leaders.length > 1 ? `, shared by ${leaders.length} entries.` : "."}`
    : "Upload entries and results to see the table.";
  const favorite = [...(state.latest?.leaderboard || [])].sort((left, right) => right.winOdds - left.winOdds)[0];

  const cards = [
    {
      label: "Pool entries",
      value: state.entries.length,
      detail: `Tracking ${state.groups.length} groups and ${state.matches.length} knockout matches in ${state.tournamentName || "your tournament"}.`
    },
    {
      label: "Matches completed",
      value: completedMatches,
      detail: `${completedGroups} groups finalized so far, with ${state.matches.length - completedMatches} knockout matches still left to swing the standings.`
    },
    {
      label: "Current leader",
      value: leaderLabel,
      detail: leaderDetail
    },
    {
      label: "Probability favorite",
      value: favorite ? favorite.name : "None",
      detail: favorite ? `${formatPercent(favorite.winOdds)} win probability right now.` : "Run simulations once data is loaded."
    }
  ];

  container.innerHTML = cards.map((card) => `
    <article class="stat-card">
      <span class="label">${escapeHtml(card.label)}</span>
      <strong>${escapeHtml(String(card.value))}</strong>
      <p class="detail">${escapeHtml(card.detail)}</p>
    </article>
  `).join("");
}

function renderChart(targetId, rows, valueKey, className, formatter) {
  const container = $(targetId);

  if (!rows.length) {
    container.innerHTML = `<div class="empty-state">Load entries and results to see this chart.</div>`;
    return;
  }

  const isPointsChart = valueKey === "currentPoints";
  const maxValue = isPointsChart
    ? Math.max(...rows.map((row) => Math.max(toNumber(row.bestCase, 0), toNumber(row[valueKey], 0))), 1)
    : Math.max(...rows.map((row) => row[valueKey]), 1);
  container.innerHTML = rows.map((row) => {
    const currentWidth = Math.max((row[valueKey] / maxValue) * 100, row[valueKey] > 0 ? 2 : 0);
    const bestCaseWidth = isPointsChart
      ? Math.max((Math.max(toNumber(row.bestCase, 0), toNumber(row[valueKey], 0)) / maxValue) * 100, currentWidth)
      : currentWidth;
    return `
      <article class="chart-row">
        <header>
          <strong>${escapeHtml(row.name)}</strong>
          <span>${escapeHtml(formatter(row[valueKey]))}</span>
        </header>
        <div class="chart-bar">
          ${isPointsChart ? `<div class="chart-fill remaining" style="width: ${bestCaseWidth}%"></div>` : ""}
          <div class="chart-fill ${className}" style="width: ${currentWidth}%"></div>
        </div>
      </article>
    `;
  }).join("");
}

function renderLeaderboard() {
  const body = $("leaderboardBody");
  const leaderboard = state.latest?.leaderboard || [];

  if (!leaderboard.length) {
    body.innerHTML = `<tr><td colspan="5">Upload data or load the sample pool to build the leaderboard.</td></tr>`;
    return;
  }

  body.innerHTML = leaderboard.map((entry) => `
    <tr>
      <td><strong>${escapeHtml(entry.name)}</strong></td>
      <td>${entry.currentPoints}</td>
      <td>${entry.projectedFinal.toFixed(1)}</td>
      <td>${entry.bestCase}</td>
      <td>${formatPercent(entry.winOdds)}</td>
    </tr>
  `).join("");
}

function renderMatches() {
  const board = $("matchesBoard");

  if (!state.matches.length) {
    board.innerHTML = `<div class="empty-state">The results file defines the knockout bracket. Load the sample pool or upload a results file to see the bracket status.</div>`;
    return;
  }

  const { matchMap, feederMap } = buildTournamentData(state.matches);
  const memo = new Map();

  board.innerHTML = state.matches.map((match) => {
    const entrants = resolvePossibleEntrants(match.id, matchMap, feederMap, memo).map((slotSet, index) => {
      if (match.teams[index]) {
        return [match.teams[index]];
      }
      return [...slotSet];
    });

    const teams = entrants.map((options, index) => {
      if (!options.length) {
        return "TBD";
      }
      if (options.length === 1) {
        return options[0];
      }
      return `Winner of ${match.id} path: ${options.join(" / ")}`;
    });

    return `
      <article class="match-card">
        <div class="match-topline">
          <div>
            <strong>${escapeHtml(match.label || match.id)}</strong>
            <div class="match-meta">${escapeHtml(match.round || match.pointsKey || "Knockout round")} • ${escapeHtml(match.id)}</div>
          </div>
          <span class="pill ${match.winner ? "complete" : "live"}">${match.winner ? "Complete" : "Pending"}</span>
        </div>
        <div class="team-stack">
          ${teams.map((team) => `
            <div class="team-row ${match.winner === team ? "winner" : ""}">
              <span>${escapeHtml(team)}</span>
              <span>${match.winner === team ? "Winner" : ""}</span>
            </div>
          `).join("")}
        </div>
      </article>
    `;
  }).join("");
}

function renderStandingsUpdater() {
  const select = $("groupSelect");
  const standingsViewSelect = $("standingsViewSelect");
  const fixtureEditor = $("fixtureEditor");
  const standingsHead = $("standingsTableHead");
  const standingsBody = $("standingsTableBody");
  const slotStageSelect = $("slotStageSelect");
  const slotAssignmentsHead = $("slotAssignmentsHead");
  const slotAssignmentsBody = $("slotAssignmentsBody");
  const meta = $("updaterMeta");

  if (!supportsStandingsUpdater(state.groups) || !state.derived.groups.length) {
    select.innerHTML = `<option value="">No editable groups loaded</option>`;
    select.disabled = true;
    standingsViewSelect.disabled = false;
    standingsViewSelect.value = state.selectedStandingsView;
    fixtureEditor.innerHTML = `<div class="empty-state">Upload a 2026 results file with group teams and fixtures to edit live scores here.</div>`;
    standingsHead.innerHTML = `
      <tr>
        <th>Team</th>
        <th>P</th>
        <th>GD</th>
        <th>GF</th>
        <th>Fair Play</th>
      </tr>
    `;
    standingsBody.innerHTML = `<tr><td colspan="5">Live standings will appear here once a group file is loaded.</td></tr>`;
    slotStageSelect.value = state.selectedStage;
    slotAssignmentsHead.innerHTML = `
      <tr>
        <th>${state.selectedStage === "R32" ? "Path" : "Slot"}</th>
        <th>Points</th>
        <th>Actual</th>
      </tr>
    `;
    const emptyCount = Math.max(getStageSlotCount(state.selectedStage), 1);
    slotAssignmentsBody.innerHTML = Array.from({ length: emptyCount }, (_, index) => `
      <tr>
        <td>${escapeHtml(state.selectedStage === "R32" ? getStageSlotLabel(state.selectedStage, index + 1) : String(index + 1))}</td>
        <td>${getStageSlotPoints(state.selectedStage, index + 1)}</td>
        <td>TBD</td>
      </tr>
    `).join("");
    meta.textContent = "Load a 2026-style results file to enter group match scores, apply FIFA tiebreakers, and fill the Round of 32 automatically.";
    return;
  }

  const groups = [...state.derived.groups].sort((left, right) => naturalCompare(left.group, right.group));
  if (!groups.some((group) => group.group === state.selectedGroup)) {
    state.selectedGroup = groups[0]?.group || "A";
  }
  if (state.selectedStandingsView !== "THIRD" && !groups.some((group) => group.group === state.selectedStandingsView)) {
    state.selectedStandingsView = groups[0]?.group || "A";
  }

  select.disabled = false;
  select.innerHTML = groups.map((group) => `
    <option value="${escapeHtml(group.group)}" ${group.group === state.selectedGroup ? "selected" : ""}>Group ${escapeHtml(group.group)}</option>
  `).join("");
  standingsViewSelect.disabled = false;
  standingsViewSelect.innerHTML = `
    ${groups.map((group) => `
      <option value="${escapeHtml(group.group)}" ${group.group === state.selectedStandingsView ? "selected" : ""}>Group ${escapeHtml(group.group)}</option>
    `).join("")}
    <option value="THIRD" ${state.selectedStandingsView === "THIRD" ? "selected" : ""}>Best Third-Place Table</option>
  `;

  const selectedGroup = state.derived.byGroup[state.selectedGroup] || groups[0];
  if (!selectedGroup) {
    fixtureEditor.innerHTML = `<div class="empty-state">Choose a group to start entering results.</div>`;
  } else {
    fixtureEditor.innerHTML = selectedGroup.fixtures.map((fixture, index) => {
      const complete = fixture.status === "complete" && hasNumericScore(fixture.homeGoals) && hasNumericScore(fixture.awayGoals);
      return `
        <article class="fixture-card">
          <div class="fixture-header">
            <div>
              <strong class="fixture-title">${escapeHtml(fixture.home)} vs ${escapeHtml(fixture.away)}</strong>
              <div class="subtle">Group ${escapeHtml(selectedGroup.group)} match ${index + 1}</div>
            </div>
            <span class="status-chip ${complete ? "qualifier" : "pending"}">${complete ? "Complete" : "Pending"}</span>
          </div>
          <div class="fixture-inputs">
            <label>
              <span>${escapeHtml(fixture.home)} goals</span>
              <div class="score-pair">
                <input data-group="${escapeHtml(selectedGroup.group)}" data-fixture-index="${index}" data-field="homeGoals" type="number" min="0" step="1" value="${complete || hasNumericScore(fixture.homeGoals) ? fixture.homeGoals : ""}">
              </div>
            </label>
            <label>
              <span>${escapeHtml(fixture.away)} goals</span>
              <div class="score-pair">
                <input data-group="${escapeHtml(selectedGroup.group)}" data-fixture-index="${index}" data-field="awayGoals" type="number" min="0" step="1" value="${complete || hasNumericScore(fixture.awayGoals) ? fixture.awayGoals : ""}">
              </div>
            </label>
            <label>
              <span>${escapeHtml(fixture.home)} fair play deductions</span>
              <div class="fair-play-pair">
                <input data-group="${escapeHtml(selectedGroup.group)}" data-fixture-index="${index}" data-field="homeFairPlay" type="number" min="0" step="1" value="${toNumber(fixture.homeFairPlay, 0)}">
              </div>
            </label>
            <label>
              <span>${escapeHtml(fixture.away)} fair play deductions</span>
              <div class="fair-play-pair">
                <input data-group="${escapeHtml(selectedGroup.group)}" data-fixture-index="${index}" data-field="awayFairPlay" type="number" min="0" step="1" value="${toNumber(fixture.awayFairPlay, 0)}">
              </div>
            </label>
          </div>
        </article>
      `;
    }).join("");
  }

  if (state.selectedStandingsView === "THIRD") {
    standingsHead.innerHTML = `
      <tr>
        <th>Rank</th>
        <th>Group</th>
        <th>Team</th>
        <th>Pts</th>
        <th>GD</th>
        <th>GF</th>
        <th>Fair Play</th>
        <th>Status</th>
      </tr>
    `;
    standingsBody.innerHTML = state.derived.thirdPlace.length
      ? state.derived.thirdPlace.map((entry) => {
        const group = state.derived.byGroup[entry.group];
        const statusClass = entry.qualifies ? "qualifier" : group?.complete ? "waiting" : "pending";
        const statusLabel = entry.qualifies ? "Top 8" : group?.complete ? "Outside top 8" : "In progress";
        return `
          <tr>
            <td>${entry.rank}</td>
            <td>${escapeHtml(entry.group)}</td>
            <td><strong>${escapeHtml(entry.team)}</strong></td>
            <td>${entry.points}</td>
            <td>${entry.goalDifference}</td>
            <td>${entry.goalsFor}</td>
            <td>${entry.fairPlayDeductions}</td>
            <td><span class="status-chip ${statusClass}">${escapeHtml(statusLabel)}</span></td>
          </tr>
        `;
      }).join("")
      : `<tr><td colspan="8">Third-place teams will appear here as soon as the groups are loaded.</td></tr>`;
  } else {
    const selectedStandingsGroup = state.derived.byGroup[state.selectedStandingsView] || groups[0];
    standingsHead.innerHTML = `
      <tr>
        <th>Team</th>
        <th>P</th>
        <th>GD</th>
        <th>GF</th>
        <th>Fair Play</th>
      </tr>
    `;
    standingsBody.innerHTML = selectedStandingsGroup?.standings?.length
      ? selectedStandingsGroup.standings.map((team) => `
          <tr>
            <td><strong>${escapeHtml(team.team)}</strong></td>
            <td>${team.points}</td>
            <td>${team.goalDifference}</td>
            <td>${team.goalsFor}</td>
            <td>${team.fairPlayDeductions}</td>
          </tr>
        `).join("")
      : `<tr><td colspan="5">Enter scores for Group ${escapeHtml(state.selectedStandingsView)} to build the table.</td></tr>`;
  }

  const selectedStage = normalizeStageKey(state.selectedStage) || "R32";
  state.selectedStage = selectedStage;
  slotStageSelect.value = selectedStage;
  const usesPathLabels = selectedStage === "R32";
  slotAssignmentsHead.innerHTML = `
    <tr>
      <th>${usesPathLabels ? "Path" : "Slot"}</th>
      <th>Points</th>
      <th>Actual</th>
      ${state.entries.map((entry) => `<th>${escapeHtml(entry.name)}</th>`).join("")}
    </tr>
  `;
  const stageCount = Math.max(getStageSlotCount(selectedStage), 1);
  slotAssignmentsBody.innerHTML = Array.from({ length: stageCount }, (_, index) => {
    const slot = String(index + 1);
    const actualTeam = normalizeName(state.stageResults?.[selectedStage]?.[slot]) || "TBD";
    return `
      <tr>
        <td>${escapeHtml(usesPathLabels ? getStageSlotLabel(selectedStage, slot) : slot)}</td>
        <td>${getStageSlotPoints(selectedStage, slot)}</td>
        <td class="flag-cell">${renderCountryFlag(actualTeam, "TBD")}</td>
        ${state.entries.map((entry) => `<td class="flag-cell">${renderCountryFlag(normalizeName(entry.slotPicks?.[selectedStage]?.[slot]), "-")}</td>`).join("")}
      </tr>
    `;
  }).join("");

  const r32Slots = state.stageResults.R32 || {};
  const completeGroups = state.derived.groups.filter((group) => group.complete).length;
  const lockedThirdPlaceSlots = Object.keys(r32Slots).filter((slot) => ["2", "4", "14", "16", "22", "24", "30", "32"].includes(slot)).length;
  meta.textContent = `${completeGroups} of ${state.derived.groups.length} groups are final. FIFA group tiebreakers and the official Annex C third-place mapping are being applied automatically. ${lockedThirdPlaceSlots === 8 ? "All third-place Round of 32 slots are locked in." : "Third-place Round of 32 slots lock once all groups finish."}`;
}

function renderAll() {
  renderStatCards();
  renderStandingsUpdater();
  renderChart("pointsChart", [...(state.latest?.leaderboard || [])].sort((left, right) => right.projectedFinal - left.projectedFinal), "projectedFinal", "", (value) => `${value.toFixed(1)} pts`);
  renderChart("oddsChart", [...(state.latest?.leaderboard || [])].sort((left, right) => right.winOdds - left.winOdds), "winOdds", "odds", formatPercent);
  renderProbabilityTimeline();
  renderProjectedPointsTimeline();
  renderTimelineCacheStatus();
  renderLeaderboard();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderCountryFlag(value, fallback = "-") {
  const name = normalizeName(value);
  if (!name) {
    return `<span class="flag-fallback">${escapeHtml(fallback)}</span>`;
  }
  if (name === "TBD") {
    return `<span class="flag-fallback">TBD</span>`;
  }
  const flag = COUNTRY_FLAG_EMOJI[name];
  if (!flag) {
    return `<span class="flag-fallback" title="${escapeHtml(name)}">${escapeHtml(name)}</span>`;
  }
  return `<span class="flag-chip" data-country="${escapeHtml(name)}" aria-label="${escapeHtml(name)}">${flag}</span>`;
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function floorToSignificantFigures(value, figures = 2) {
  const numeric = toNumber(value, 0);
  if (!Number.isFinite(numeric) || numeric === 0) {
    return 0;
  }
  const magnitude = Math.floor(Math.log10(Math.abs(numeric)));
  const factor = 10 ** (magnitude - figures + 1);
  return Math.floor(numeric / factor) * factor;
}

function ceilToSignificantFigures(value, figures = 2) {
  const numeric = toNumber(value, 0);
  if (!Number.isFinite(numeric) || numeric === 0) {
    return 0;
  }
  const magnitude = Math.floor(Math.log10(Math.abs(numeric)));
  const factor = 10 ** (magnitude - figures + 1);
  return Math.ceil(numeric / factor) * factor;
}

function significantFigureStep(value, figures = 2) {
  const numeric = Math.abs(toNumber(value, 0));
  if (!numeric) {
    return 10 ** (1 - figures);
  }
  const magnitude = Math.floor(Math.log10(numeric));
  return 10 ** (magnitude - figures + 1);
}

function floorPercentToSignificantFigures(value, figures = 2) {
  return floorToSignificantFigures(toNumber(value, 0) * 100, figures) / 100;
}

function ceilPercentToSignificantFigures(value, figures = 2) {
  return ceilToSignificantFigures(toNumber(value, 0) * 100, figures) / 100;
}

function percentSignificantFigureStep(value, figures = 2) {
  return significantFigureStep(toNumber(value, 0) * 100, figures) / 100;
}

function setStatus(message) {
  $("statusLine").textContent = message;
}

function recalculate() {
  refreshDerivedState();

  if (!state.groups.length && !state.matches.length) {
    state.latest = { leaderboard: [] };
    renderAll();
    setStatus("Upload a results file that defines the group results, the knockout bracket, or both.");
    return;
  }

  if (!state.entries.length) {
    state.latest = { leaderboard: [] };
    renderAll();
    setStatus("The bracket structure is ready. Upload your friends' entries next.");
    return;
  }

  if (!hasScoringRules(state.scoring)) {
    state.latest = { leaderboard: [] };
    renderAll();
    setStatus("Your bracket and entries are loaded. Upload the scoring rules to calculate points and odds.");
    return;
  }

  state.latest = simulatePool(state.groups, state.matches, state.entries, state.scoring, SIMULATION_COUNT);
  persistLatestCalculationToTimelineCache();

  renderAll();

  const completedGroups = state.groups.filter((group) => group.winner || group.runnerUp).length;
  const completedMatches = state.matches.filter((match) => match.winner).length;
  setStatus(`Calculated ${state.entries.length} entries across ${completedGroups} finalized groups, ${completedMatches} completed matches, and ${state.latest.completedRuns.toLocaleString()} completed simulations.`);
}

function handleFixtureFieldChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }
  const groupCode = normalizeName(target.dataset.group).toUpperCase();
  const fixtureIndex = toNumber(target.dataset.fixtureIndex, -1);
  const field = normalizeName(target.dataset.field);
  if (!groupCode || fixtureIndex < 0 || !field) {
    return;
  }

  const group = state.groups.find((entry) => entry.group === groupCode);
  const fixture = group?.fixtures?.[fixtureIndex];
  if (!fixture) {
    return;
  }

  fixture[field] = field.endsWith("FairPlay")
    ? toNumber(target.value, 0)
    : (target.value === "" ? "" : toNumber(target.value, 0));
  fixture.status = hasNumericScore(fixture.homeGoals) && hasNumericScore(fixture.awayGoals) ? "complete" : "pending";
  recalculate();
}

function downloadUpdatedResults() {
  const payload = {
    tournamentName: state.tournamentName || "World Cup 2026",
    asOfDate: new Date().toISOString().slice(0, 10),
    groups: state.groups.map((group) => ({
      group: group.group,
      teams: [...(group.teams || [])],
      rankings: structuredClone(group.rankings || {}),
      fixtures: asArray(group.fixtures).map((fixture) => ({
        home: fixture.home,
        away: fixture.away,
        homeGoals: fixture.homeGoals,
        awayGoals: fixture.awayGoals,
        homeFairPlay: toNumber(fixture.homeFairPlay, 0),
        awayFairPlay: toNumber(fixture.awayFairPlay, 0),
        status: fixture.status || (hasNumericScore(fixture.homeGoals) && hasNumericScore(fixture.awayGoals) ? "complete" : "pending")
      })),
      winner: group.winner || "",
      runnerUp: group.runnerUp || ""
    })),
    stageResults: structuredClone(state.stageResults || {}),
    matches: state.matches.map((match) => ({
      ...match,
      teams: [...(match.teams || [])]
    }))
  };

  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "world-cup-2026-results-updated.json";
  link.click();
  URL.revokeObjectURL(url);
  setStatus("Downloaded the latest results snapshot with updated group tables and Round of 32 slots.");
}

async function handleScoringUpload(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    state.scoring = parseScoringData(text, file.name);
    recalculate();
  } catch (error) {
    setStatus(`I couldn't read ${file.name}. Double-check the scoring file format and try again.`);
    console.error(error);
  }
}

async function handleEntriesUpload(event) {
  const files = [...(event.target.files || [])];
  if (!files.length) {
    return;
  }

  try {
    const loadedGroups = await Promise.all(files.map(async (file) => parseEntriesData(await file.text(), file.name)));
    state.entries = mergeEntries(state.entries, loadedGroups.flat());
    recalculate();
  } catch (error) {
    setStatus("I couldn't read one of the entry files. Check the bracket upload format and try again.");
    console.error(error);
  }
}

async function handleResultsUpload(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const payload = parseResultsData(text, file.name);
    state.tournamentName = payload.tournamentName || state.tournamentName;
    state.groups = mergeGroups(state.groups, payload.groups);
    state.stageResults = mergeStageResults(state.stageResults, payload.stageResults);
    state.matches = mergeResults(state.matches, payload.matches);
    recalculate();
  } catch (error) {
    setStatus(`I couldn't read ${file.name}. Make sure the results file is valid JSON or CSV.`);
    console.error(error);
  }
}

async function syncPlayedMatchesFromInternet(options = {}) {
  const { background = false } = options;
  const editableGroups = supportsStandingsUpdater(state.groups)
    ? state.groups.map(ensureGroupDetails).filter((group) => group.group && group.teams.length === 4)
    : [];

  if (!editableGroups.length) {
    if (!background) {
      setStatus("Load the 2026 pool first, then I can sync completed group matches from the web.");
    }
    return;
  }

  if (state.syncInFlight) {
    return;
  }

  state.syncInFlight = true;
  if (!background) {
    setStatus("Checking the web for completed group matches and merging them into your current pool...");
  }

  try {
    const pages = await Promise.all(editableGroups.map(async (group) => ({
      group: group.group,
      html: await fetchWikipediaGroupHtml(group.group)
    })));

    let syncedMatches = 0;
    pages.forEach(({ group: groupCode, html }) => {
      const group = state.groups.find((entry) => entry.group === groupCode);
      if (!group) {
        return;
      }
      const detailedGroup = ensureGroupDetails(group);
      const completedScores = extractCompletedScoresFromHtml(html, detailedGroup);
      const fairPlayByTeam = extractFairPlayByTeamFromHtml(html, detailedGroup);
      const fairPlayByFixture = extractFairPlayByFixtureFromMatchSections(html, detailedGroup);
      const fixtureMetadata = extractFixtureScheduleMetadataFromHtml(html, detailedGroup);
      completedScores.forEach((result) => {
        const fixture = group.fixtures?.[result.fixtureIndex];
        if (!fixture) {
          return;
        }

        const scheduleMetadata = fixtureMetadata[result.fixtureIndex] || {};
        if (scheduleMetadata.date) {
          fixture.date = scheduleMetadata.date;
        }
        if (scheduleMetadata.matchNumber !== null && scheduleMetadata.matchNumber !== undefined) {
          fixture.matchNumber = scheduleMetadata.matchNumber;
        }
        if (scheduleMetadata.kickoffMinutes !== null && scheduleMetadata.kickoffMinutes !== undefined) {
          fixture.kickoffMinutes = scheduleMetadata.kickoffMinutes;
        }
        if (scheduleMetadata.kickoffUtcMinutes !== null && scheduleMetadata.kickoffUtcMinutes !== undefined) {
          fixture.kickoffUtcMinutes = scheduleMetadata.kickoffUtcMinutes;
        }

        const homeAppearanceIndex = getTeamFixtureAppearanceIndex(detailedGroup.fixtures, result.fixtureIndex, fixture.home);
        const awayAppearanceIndex = getTeamFixtureAppearanceIndex(detailedGroup.fixtures, result.fixtureIndex, fixture.away);
        const fixtureFairPlay = fairPlayByFixture[result.fixtureIndex] || {};
        const homeFairPlay = fixtureFairPlay.homeFairPlay ?? fairPlayByTeam[fixture.home]?.[homeAppearanceIndex] ?? toNumber(fixture.homeFairPlay, 0);
        const awayFairPlay = fixtureFairPlay.awayFairPlay ?? fairPlayByTeam[fixture.away]?.[awayAppearanceIndex] ?? toNumber(fixture.awayFairPlay, 0);
        const alreadySame =
          toNumber(fixture.homeGoals, -1) === result.homeGoals &&
          toNumber(fixture.awayGoals, -1) === result.awayGoals &&
          toNumber(fixture.homeFairPlay, 0) === homeFairPlay &&
          toNumber(fixture.awayFairPlay, 0) === awayFairPlay &&
          fixture.status === "complete";
        if (alreadySame) {
          return;
        }
        fixture.homeGoals = result.homeGoals;
        fixture.awayGoals = result.awayGoals;
        fixture.homeFairPlay = homeFairPlay;
        fixture.awayFairPlay = awayFairPlay;
        fixture.status = "complete";
        syncedMatches += 1;
      });
    });

    recalculate();
    refreshTimelineSimulationCache("missing").catch((error) => console.error(error));
    if (!background) {
      setStatus(
        syncedMatches
          ? `Pulled ${syncedMatches} completed World Cup matches from the web. Future fixtures are still yours to edit manually.`
          : "No new completed matches were found to import. Your future fixtures are still fully editable."
      );
    }
  } catch (error) {
    console.error(error);
    if (!background) {
      setStatus("I couldn't pull completed matches right now. The page might be offline, blocked, or the source format may have changed.");
    }
  } finally {
    state.syncInFlight = false;
  }
}

async function loadSamplePool() {
  state.scoring = {
    groupWinnerPoints: toNumber(DEFAULT_WORLD_CUP_2026_SCORING.groupWinnerPoints, 0),
    groupRunnerUpPoints: toNumber(DEFAULT_WORLD_CUP_2026_SCORING.groupRunnerUpPoints, 0),
    bracketSpotPoints: normalizeBracketSpotPoints(DEFAULT_WORLD_CUP_2026_SCORING.bracketSpotPoints || {}),
    roundPoints: normalizeScoreMap(DEFAULT_WORLD_CUP_2026_SCORING.roundPoints || {}),
    matchPoints: normalizeScoreMap(DEFAULT_WORLD_CUP_2026_SCORING.matchPoints || {})
  };
  state.entries = DEFAULT_WORLD_CUP_2026_ENTRIES.map((entry) => coerceEntry(structuredClone(entry)));
  state.tournamentName = DEFAULT_WORLD_CUP_2026_RESULTS.tournamentName || "World Cup 2026";
  state.groups = DEFAULT_WORLD_CUP_2026_RESULTS.groups.map((group) => coerceGroupResult(structuredClone(group)));
  state.stageResults = normalizeStageResults(DEFAULT_WORLD_CUP_2026_RESULTS.stageResults || {});
  state.matches = asArray(DEFAULT_WORLD_CUP_2026_RESULTS.matches).map((match) => coerceMatch(match)).filter((match) => match.id);
  state.selectedGroup = "A";
  state.selectedStandingsView = "A";
  state.selectedStage = "R32";
  recalculate();
  refreshTimelineSimulationCache("missing").catch((error) => console.error(error));
  await syncPlayedMatchesFromInternet({ background: true }).catch((error) => console.error(error));
}

function seedEmptyView() {
  state.scoring = {
    groupWinnerPoints: 0,
    groupRunnerUpPoints: 0,
    bracketSpotPoints: {},
    roundPoints: {},
    matchPoints: {}
  };
  state.groups = [];
  state.stageResults = {};
  state.matches = [];
  state.entries = [];
  state.tournamentName = "";
  state.latest = { leaderboard: [] };
  state.selectedGroup = "A";
  state.selectedStandingsView = "A";
  state.selectedStage = "R32";
  state.derived = {
    groups: [],
    byGroup: {},
    thirdPlace: []
  };
  renderAll();
}

function bindEvents() {
  $("scoringInput").addEventListener("change", handleScoringUpload);
  $("entriesInput").addEventListener("change", handleEntriesUpload);
  $("resultsInput").addEventListener("change", handleResultsUpload);
  $("loadSampleButton").addEventListener("click", loadSamplePool);
  $("runSimulationsButton").addEventListener("click", recalculate);
  $("syncPlayedMatchesButton").addEventListener("click", syncPlayedMatchesFromInternet);
  $("partialTimelineRecalcButton").addEventListener("click", () => {
    recalculate();
    refreshTimelineSimulationCache("partial").catch((error) => console.error(error));
  });
  $("fullTimelineRecalcButton").addEventListener("click", () => {
    recalculate();
    refreshTimelineSimulationCache("full").catch((error) => console.error(error));
  });
  $("groupSelect").addEventListener("change", (event) => {
    state.selectedGroup = normalizeName(event.target.value).toUpperCase() || "A";
    renderStandingsUpdater();
  });
  $("standingsViewSelect").addEventListener("change", (event) => {
    const value = normalizeName(event.target.value).toUpperCase();
    state.selectedStandingsView = value === "THIRD" ? "THIRD" : value || "A";
    renderStandingsUpdater();
  });
  $("slotStageSelect").addEventListener("change", (event) => {
    state.selectedStage = normalizeStageKey(event.target.value) || "R32";
    renderStandingsUpdater();
  });
  $("fixtureEditor").addEventListener("input", handleFixtureFieldChange);
}

let bootstrapped = false;

function bootstrapApp() {
  if (bootstrapped) {
    return;
  }
  bootstrapped = true;
  bindEvents();
  loadSamplePool().catch((error) => {
    console.error(error);
    setStatus("I hit a snag while loading the saved 2026 pool.");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapApp, { once: true });
} else {
  bootstrapApp();
}
