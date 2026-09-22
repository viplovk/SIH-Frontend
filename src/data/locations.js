// Indian Meteorological Observation Hubs & Reference Stations for Algoriot Blending Engine
export const LOCATIONS = [
  {
    id: "delhi",
    name: "Delhi",
    state: "National Capital Region",
    lat: 28.6139,
    lon: 77.2090,
    elevation: 216,
    terrain: "Indo-Gangetic Plain",
    climaticZone: "Subtropical Semi-Arid",
    radarStation: "IMD Mausam Bhavan (Doppler C-Band)",
    currentRegime: "MONSOON / HIGH HUMIDITY CONVECTIVE",
    regimeConfidence: 89,
    baseWeather: {
      temperature: 31.4,
      feelsLike: 34.2,
      humidity: 68,
      pressure: 1006.2,
      windSpeed: 14.8,
      windDirection: "WNW (295°)",
      precipitation: 74,
      cloudCover: 52,
      visibility: 7.2,
      dewPoint: 24.6,
      uvIndex: 7,
      airQualityIndex: 142
    },
    modelWeights: {
      nwp: 54, // ECMWF IFS / IMD GFS
      aiA: 31, // FuXi / GraphCast
      aiB: 15  // WeatherNext / Pangu-Weather
    },
    weightRationale: "High convective boundary layer instability detected (+6h horizon). NWP retains thermodynamic mass conservation constraints, while AI Model A (FuXi) exhibits superior high-resolution precipitation gradient localization.",
    extremeAlert: {
      type: "Heavy Rainfall & Localized Inundation",
      severity: "MODERATE",
      probability: 72,
      timeframe: "+12h → +24h",
      modelAgreement: "HIGH"
    }
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    lat: 19.0760,
    lon: 72.8777,
    elevation: 14,
    terrain: "Coastal Lowland / Western Ghats Foothills",
    climaticZone: "Tropical Wet & Dry",
    radarStation: "Colaba Coastal Doppler S-Band",
    currentRegime: "OROGRAPHIC MARITIME OFFSHORE TROUGH",
    regimeConfidence: 94,
    baseWeather: {
      temperature: 29.8,
      feelsLike: 35.6,
      humidity: 86,
      pressure: 1004.1,
      windSpeed: 24.2,
      windDirection: "WSW (245°)",
      precipitation: 88,
      cloudCover: 82,
      visibility: 5.5,
      dewPoint: 27.2,
      uvIndex: 4,
      airQualityIndex: 68
    },
    modelWeights: {
      nwp: 62,
      aiA: 26,
      aiB: 12
    },
    weightRationale: "Intense moisture advection from Arabian Sea crossing Western Ghats barrier. Physics-based NWP given primary weight to respect hydrostatic lifting and Navier-Stokes momentum equations.",
    extremeAlert: {
      type: "Intense Coastal Squalls & High Tide Surge",
      severity: "HIGH",
      probability: 84,
      timeframe: "+6h → +18h",
      modelAgreement: "HIGH"
    }
  },
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    lat: 22.5726,
    lon: 88.3639,
    elevation: 9,
    terrain: "Lower Gangetic Delta Plain",
    climaticZone: "Tropical Wet-and-Dry",
    radarStation: "Alipore Radar Complex",
    currentRegime: "MESOSCALE CONVECTIVE SYSTEM (KALBAISAKHI / NOR'WESTER)",
    regimeConfidence: 87,
    baseWeather: {
      temperature: 33.1,
      feelsLike: 39.4,
      humidity: 78,
      pressure: 1002.8,
      windSpeed: 18.5,
      windDirection: "SSE (160°)",
      precipitation: 62,
      cloudCover: 64,
      visibility: 6.8,
      dewPoint: 28.1,
      uvIndex: 8,
      airQualityIndex: 110
    },
    modelWeights: {
      nwp: 42,
      aiA: 40,
      aiB: 18
    },
    weightRationale: "Pre-monsoon dryline clash between Chota Nagpur dry westerlies and Bay of Bengal maritime air. AI Model A has demonstrated superior lead-time skill in rapid squall initiation identification.",
    extremeAlert: {
      type: "Severe Thunderstorm & Gale Wind",
      severity: "ELEVATED",
      probability: 69,
      timeframe: "+3h → +9h",
      modelAgreement: "MEDIUM"
    }
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0827,
    lon: 80.2707,
    elevation: 6,
    terrain: "Coromandel Coastal Plain",
    climaticZone: "Tropical Maritime",
    radarStation: "Port of Chennai DWR Station",
    currentRegime: "NORTHEAST TRADEWIND EASTERLY WAVE",
    regimeConfidence: 91,
    baseWeather: {
      temperature: 32.5,
      feelsLike: 37.0,
      humidity: 74,
      pressure: 1007.6,
      windSpeed: 16.0,
      windDirection: "ENE (070°)",
      precipitation: 38,
      cloudCover: 44,
      visibility: 8.0,
      dewPoint: 25.8,
      uvIndex: 9,
      airQualityIndex: 75
    },
    modelWeights: {
      nwp: 48,
      aiA: 34,
      aiB: 18
    },
    weightRationale: "Tropical low-latitude easterly wave disturbance. Multi-model ensemble balances NWP baroclinic dynamics with deep transformer temporal pattern recognition.",
    extremeAlert: {
      type: "Moderate Coastal Swell Warning",
      severity: "LOW",
      probability: 35,
      timeframe: "+24h → +48h",
      modelAgreement: "HIGH"
    }
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    lat: 12.9716,
    lon: 77.5946,
    elevation: 920,
    terrain: "Deccan High Plateau",
    climaticZone: "Tropical Savanna / Highland Moderated",
    radarStation: "HAL Airport Meteorological Unit",
    currentRegime: "DIURNAL ELEVATED CONVECTIVE DRIFT",
    regimeConfidence: 85,
    baseWeather: {
      temperature: 26.8,
      feelsLike: 27.4,
      humidity: 62,
      pressure: 1012.3,
      windSpeed: 12.0,
      windDirection: "W (270°)",
      precipitation: 45,
      cloudCover: 58,
      visibility: 9.5,
      dewPoint: 19.2,
      uvIndex: 6,
      airQualityIndex: 54
    },
    modelWeights: {
      nwp: 46,
      aiA: 36,
      aiB: 18
    },
    weightRationale: "High plateau topography dampens extreme boundary fluxes. Dynamic meta-learner shifts weighting evenly between NWP grid resolution and AI temporal recurrent filters.",
    extremeAlert: {
      type: "Evening Urban Flash Rain",
      severity: "LOW",
      probability: 48,
      timeframe: "+6h → +12h",
      modelAgreement: "HIGH"
    }
  },
  {
    id: "guwahati",
    name: "Guwahati",
    state: "Assam",
    lat: 26.1445,
    lon: 91.7362,
    elevation: 55,
    terrain: "Brahmaputra Alluvial Valley / Meghalaya Plateau Basin",
    climaticZone: "Humid Subtropical Heavy Monsoon",
    radarStation: "Borjhar Regional Radar Observatory",
    currentRegime: "DEEP OROGRAPHIC TROUGH & BASIN FLOODING",
    regimeConfidence: 96,
    baseWeather: {
      temperature: 28.5,
      feelsLike: 33.8,
      humidity: 92,
      pressure: 1001.4,
      windSpeed: 11.5,
      windDirection: "ENE (060°)",
      precipitation: 95,
      cloudCover: 90,
      visibility: 4.8,
      dewPoint: 27.0,
      uvIndex: 3,
      airQualityIndex: 42
    },
    modelWeights: {
      nwp: 59,
      aiA: 28,
      aiB: 13
    },
    weightRationale: "Complex valley-funneling topography trapped against Cherrapunji mountain front. Extreme boundary precipitation physics handled through NWP microphysics scheme, augmented by AI bias-offsetting.",
    extremeAlert: {
      type: "Severe Riverine Flash Flood & Inundation",
      severity: "CRITICAL",
      probability: 91,
      timeframe: "+6h → +36h",
      modelAgreement: "VERY HIGH"
    }
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    lat: 23.0225,
    lon: 72.5714,
    elevation: 53,
    terrain: "Semi-Arid Sabarmati Basin",
    climaticZone: "Hot Semi-Arid",
    radarStation: "SVP International Airport Radar",
    currentRegime: "CONTINENTAL THERMAL HIGH / HEATWAVE DOME",
    regimeConfidence: 92,
    baseWeather: {
      temperature: 39.8,
      feelsLike: 43.1,
      humidity: 32,
      pressure: 1009.5,
      windSpeed: 15.2,
      windDirection: "NW (315°)",
      precipitation: 5,
      cloudCover: 12,
      visibility: 10.0,
      dewPoint: 17.5,
      uvIndex: 11,
      airQualityIndex: 165
    },
    modelWeights: {
      nwp: 38,
      aiA: 44,
      aiB: 18
    },
    weightRationale: "Thar desert advective heating and subsidence dome. Machine learning models (AI Model A & B) capture surface radiative thermal balances and sensible heat fluxes with lower root-mean-square error than standard hydrostatic NWP.",
    extremeAlert: {
      type: "Extreme Daytime Heatwave Warning",
      severity: "HIGH",
      probability: 86,
      timeframe: "+12h → +48h",
      modelAgreement: "VERY HIGH"
    }
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    lat: 17.3850,
    lon: 78.4867,
    elevation: 542,
    terrain: "Deccan High Plateau / Musi River Basin",
    climaticZone: "Tropical Wet & Dry",
    radarStation: "Begumpet DWR Doppler Unit",
    currentRegime: "SEMI-ARID INTERIOR CONVECTIVE PLUME",
    regimeConfidence: 90,
    baseWeather: {
      temperature: 34.6,
      feelsLike: 37.2,
      humidity: 54,
      pressure: 1008.4,
      windSpeed: 14.0,
      windDirection: "WNW (290°)",
      precipitation: 25,
      cloudCover: 38,
      visibility: 9.0,
      dewPoint: 22.8,
      uvIndex: 8,
      airQualityIndex: 98
    },
    modelWeights: {
      nwp: 45,
      aiA: 38,
      aiB: 17
    },
    weightRationale: "Diurnal heating triggering convective cells across granite plateau. AI Model A (FuXi) demonstrates high skill in localized precipitation onset timing.",
    extremeAlert: {
      type: "Isolated Thunderstorm Gusts",
      severity: "LOW",
      probability: 42,
      timeframe: "+6h → +18h",
      modelAgreement: "HIGH"
    }
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    lat: 26.9124,
    lon: 75.7873,
    elevation: 431,
    terrain: "Semi-Arid Thar Fringe / Aravalli Range",
    climaticZone: "Hot Semi-Arid",
    radarStation: "Sanganer Airport Doppler Radar",
    currentRegime: "DRY THERMAL CONVECTION / DUST ADVECTION",
    regimeConfidence: 93,
    baseWeather: {
      temperature: 38.2,
      feelsLike: 40.5,
      humidity: 28,
      pressure: 1005.8,
      windSpeed: 17.5,
      windDirection: "SW (225°)",
      precipitation: 8,
      cloudCover: 15,
      visibility: 8.5,
      dewPoint: 15.6,
      uvIndex: 10,
      airQualityIndex: 178
    },
    modelWeights: {
      nwp: 40,
      aiA: 42,
      aiB: 18
    },
    weightRationale: "Continental heating and Thar desert thermal advection. Machine learning models capture boundary layer sensible heat flux and radiation with lower error than hydrostatic NWP.",
    extremeAlert: {
      type: "Severe Heatwave & High UV Advisory",
      severity: "HIGH",
      probability: 88,
      timeframe: "+12h → +48h",
      modelAgreement: "VERY HIGH"
    }
  },
  {
    id: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    lat: 26.8467,
    lon: 80.9462,
    elevation: 123,
    terrain: "Central Indo-Gangetic Basin",
    climaticZone: "Humid Subtropical",
    radarStation: "Amausi Meteorological Doppler Radar",
    currentRegime: "MONSOONAL LOW PRESSURE TROUGH ADVECTION",
    regimeConfidence: 88,
    baseWeather: {
      temperature: 33.8,
      feelsLike: 38.4,
      humidity: 72,
      pressure: 1004.6,
      windSpeed: 11.2,
      windDirection: "ESE (115°)",
      precipitation: 58,
      cloudCover: 62,
      visibility: 7.0,
      dewPoint: 26.5,
      uvIndex: 7,
      airQualityIndex: 154
    },
    modelWeights: {
      nwp: 52,
      aiA: 32,
      aiB: 16
    },
    weightRationale: "Monsoon trough axis passage across central UP plain. Physics NWP retains strict moisture convergence constraints.",
    extremeAlert: {
      type: "Squall & Localized Flooding Risk",
      severity: "MODERATE",
      probability: 68,
      timeframe: "+6h → +24h",
      modelAgreement: "HIGH"
    }
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    lat: 18.5204,
    lon: 73.8567,
    elevation: 560,
    terrain: "Rain Shadow of Western Ghats",
    climaticZone: "Hot Semi-Arid / Highland",
    radarStation: "Pashan IMD Regional Radar",
    currentRegime: "OROGRAPHIC LEE-SIDE ROTATION",
    regimeConfidence: 91,
    baseWeather: {
      temperature: 29.4,
      feelsLike: 31.0,
      humidity: 65,
      pressure: 1010.2,
      windSpeed: 15.0,
      windDirection: "W (270°)",
      precipitation: 35,
      cloudCover: 55,
      visibility: 9.8,
      dewPoint: 21.0,
      uvIndex: 6,
      airQualityIndex: 62
    },
    modelWeights: {
      nwp: 56,
      aiA: 30,
      aiB: 14
    },
    weightRationale: "Lee-side subsidence behind Western Ghats barrier. ECMWF IFS physics resolves crest wave dynamics and downslope wind warming.",
    extremeAlert: {
      type: "Moderate Ridge Wind Warning",
      severity: "LOW",
      probability: 32,
      timeframe: "+12h → +36h",
      modelAgreement: "HIGH"
    }
  },
  {
    id: "srinagar",
    name: "Srinagar",
    state: "Jammu & Kashmir",
    lat: 34.0837,
    lon: 74.7973,
    elevation: 1585,
    terrain: "Kashmir Alpine Intermontane Valley",
    climaticZone: "Humid Subtropical Alpine Moderated",
    radarStation: "Srinagar DWR (X-Band)",
    currentRegime: "WESTERN DISTURBANCE OROGRAPHIC CLASH",
    regimeConfidence: 94,
    baseWeather: {
      temperature: 18.5,
      feelsLike: 17.8,
      humidity: 58,
      pressure: 1016.8,
      windSpeed: 9.2,
      windDirection: "N (360°)",
      precipitation: 42,
      cloudCover: 48,
      visibility: 10.0,
      dewPoint: 9.5,
      uvIndex: 6,
      airQualityIndex: 38
    },
    modelWeights: {
      nwp: 64,
      aiA: 24,
      aiB: 12
    },
    weightRationale: "Upper-tropospheric jet stream interaction with Himalayan terrain. Hydrostatic and non-hydrostatic NWP physics essential for mountain gravity wave propagation.",
    extremeAlert: {
      type: "Alpine Flash Runoff & Landslide Watch",
      severity: "MODERATE",
      probability: 58,
      timeframe: "+12h → +36h",
      modelAgreement: "HIGH"
    }
  },
  {
    id: "bhopal",
    name: "Bhopal",
    state: "Madhya Pradesh",
    lat: 23.2599,
    lon: 77.4126,
    elevation: 527,
    terrain: "Malwa Plateau / Vindhyan Range",
    climaticZone: "Humid Subtropical",
    radarStation: "Raja Bhoj Meteorological Radar",
    currentRegime: "CONTINENTAL CONVECTIVE DRYLINE",
    regimeConfidence: 87,
    baseWeather: {
      temperature: 35.1,
      feelsLike: 37.8,
      humidity: 48,
      pressure: 1007.2,
      windSpeed: 13.4,
      windDirection: "WNW (295°)",
      precipitation: 20,
      cloudCover: 32,
      visibility: 9.2,
      dewPoint: 21.4,
      uvIndex: 8,
      airQualityIndex: 105
    },
    modelWeights: {
      nwp: 48,
      aiA: 36,
      aiB: 16
    },
    weightRationale: "Central plateau convergence zone. Dynamic ensemble balances NWP baroclinic stability with AI deep spatial pattern recognition.",
    extremeAlert: {
      type: "Afternoon Heat Index Advisory",
      severity: "MODERATE",
      probability: 64,
      timeframe: "+6h → +18h",
      modelAgreement: "HIGH"
    }
  },
  {
    id: "patna",
    name: "Patna",
    state: "Bihar",
    lat: 25.5941,
    lon: 85.1376,
    elevation: 53,
    terrain: "Middle Gangetic Plain",
    climaticZone: "Humid Subtropical",
    radarStation: "Patna Airport Doppler Unit",
    currentRegime: "NOR'WESTER SQUALL CORRIDOR",
    regimeConfidence: 89,
    baseWeather: {
      temperature: 34.0,
      feelsLike: 40.1,
      humidity: 76,
      pressure: 1003.5,
      windSpeed: 12.0,
      windDirection: "E (090°)",
      precipitation: 60,
      cloudCover: 68,
      visibility: 6.5,
      dewPoint: 27.8,
      uvIndex: 7,
      airQualityIndex: 168
    },
    modelWeights: {
      nwp: 50,
      aiA: 34,
      aiB: 16
    },
    weightRationale: "Bay of Bengal moisture advection clashing with dry continental westerlies across south Bihar plain.",
    extremeAlert: {
      type: "Severe Lightning & Thunderstorm Alert",
      severity: "HIGH",
      probability: 78,
      timeframe: "+3h → +12h",
      modelAgreement: "HIGH"
    }
  },
  {
    id: "kochi",
    name: "Kochi",
    state: "Kerala",
    lat: 9.9312,
    lon: 76.2673,
    elevation: 4,
    terrain: "Malabar Coastal Belt / Vembanad Lake",
    climaticZone: "Tropical Monsoon",
    radarStation: "Naval Air Station INS Garuda Radar",
    currentRegime: "EQUATORIAL OFFSHORE MONSOON SURGE",
    regimeConfidence: 95,
    baseWeather: {
      temperature: 28.2,
      feelsLike: 33.4,
      humidity: 89,
      pressure: 1009.1,
      windSpeed: 18.0,
      windDirection: "WSW (240°)",
      precipitation: 85,
      cloudCover: 86,
      visibility: 5.0,
      dewPoint: 26.2,
      uvIndex: 4,
      airQualityIndex: 45
    },
    modelWeights: {
      nwp: 60,
      aiA: 26,
      aiB: 14
    },
    weightRationale: "Heavy tropical maritime low-level jet advecting abundant moisture directly into coastal orography.",
    extremeAlert: {
      type: "High Wave Coastal Surge & Intense Rain",
      severity: "HIGH",
      probability: 82,
      timeframe: "+6h → +24h",
      modelAgreement: "VERY HIGH"
    }
  }
];

export const DEFAULT_LOCATION = LOCATIONS[0]; // Delhi
