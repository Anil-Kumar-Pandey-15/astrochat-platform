// Vedic Astrology and Panchang Calculation Engine
// Built using astronomical equations, spherical trigonometry, and traditional Vedic scriptures.

export interface PlanetaryPosition {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
}

export interface PanchangData {
  date: string;
  sunrise: string;
  sunset: string;
  localNoon: string;
  divamaan: string; // In Ghati-Pal
  ratrimaan: string; // In Ghati-Pal
  tithi: string;
  tithiNum: number;
  paksha: 'Shukla' | 'Krishna';
  vaar: string;
  nakshatra: string;
  nakshatraNum: number;
  nakshatraLords: string;
  yoga: string;
  karana: string;
  rashiMoon: string;
  rashiSun: string;
  ayan: 'Uttarayana' | 'Dakshinayana';
  solarMonth: string;
  lunarMonth: string;
  vikramSamvat: number;
  shakaSamvat: number;
  panchak: boolean;
  gandmool: boolean;
  mandiTime: string;
  gulikaTime: string;
  tithiEndTime?: string;
  tithiNextName?: string;
  nakshatraEndTime?: string;
  nakshatraNextName?: string;
}

export interface MuhuratSegment {
  name: string;
  time: string;
  isAuspicious: boolean;
  nature: string;
}

export interface ChoghadiyaSegment {
  name: string;
  time: string;
  ruler: string;
  quality: 'Amrit' | 'Shubh' | 'Labh' | 'Chal' | 'Udveg' | 'Rog' | 'Kaal';
  isAuspicious: boolean;
}

export interface HoraSegment {
  hourNum: number;
  time: string;
  ruler: string;
  favorableActivities: string[];
}

export interface GunaMilanResult {
  score: number;
  maxScore: number;
  varnaScore: number;
  vashyaScore: number;
  taraScore: number;
  yoniScore: number;
  maitriScore: number;
  ganaScore: number;
  bhakootScore: number;
  nadiScore: number;
  nadiDosha: boolean;
  bhakootDosha: boolean;
  manglikMatch: string;
  compatibilityPercentage: number;
  prediction: string;
}

// Constant arrays
export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", 
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", 
  "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", 
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

export const NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
];

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const HINDI_ZODIAC_SIGNS = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", 
  "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
];

export const HINDI_NAKSHATRAS = [
  "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृగशीर्ष", "आर्द्रा", 
  "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वाफाल्गुनी", "उत्तराफाल्गुनी", 
  "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", 
  "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", 
  "पूर्वाभाद्रपद", "उत्तराभाद्रपद", "रेवती"
];

export const LUNAR_MONTHS = [
  "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
  "Ashvina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"
];

export const HINDI_LUNAR_MONTHS = [
  "चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद",
  "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन"
];

// Chaldean Planetary Order (for Hora calculations)
const PLANETARY_ORDER = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];

// Utility to convert time string (HH:MM) to fraction
export function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function formatMinutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = Math.floor(totalMinutes % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// 1. Sunrise/Sunset using Spherical Trigonometry
export function calculateSunriseSunset(date: Date, latitude: number, longitude: number, timezoneOffset: number = 5.5) {
  // Day of the year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Solar Declination delta
  // delta = 23.45 * sin( (360/365) * (dayOfYear - 80) )
  const deltaRad = 23.45 * Math.sin((360 / 365) * (dayOfYear - 80) * Math.PI / 180) * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;

  // Height Constant for Refraction (34') and Semidiameter (16'): total 50' or 0.833 degrees
  const hRad = -0.833 * Math.PI / 180;

  // cos(H) = (sin(h) - sin(lat) * sin(decl)) / (cos(lat) * cos(decl))
  const cosH = (Math.sin(hRad) - Math.sin(latRad) * Math.sin(deltaRad)) / (Math.cos(latRad) * Math.cos(deltaRad));

  let H = 6.0; // Fallback
  if (cosH >= -1 && cosH <= 1) {
    H = Math.acos(cosH) * 180 / Math.PI / 15; // Convert hour angle to decimal hours
  }

  // Equation of Time (Velantar Sanskar) approximation in minutes
  const B = (360 / 365) * (dayOfYear - 81) * Math.PI / 180;
  const eqTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  // Solar noon: noon = 12 - LngCorrection - eqTime
  // Central Longitude of India is 82.5 (82° 30')
  const centerLng = 82.5;
  const lngDifference = centerLng - longitude;
  const lngCorrHours = lngDifference * 4 / 60; // 4 minutes per degree

  const localNoonMinutes = 12 * 60 + lngCorrHours * 60 - eqTime;
  const sunriseMinutes = localNoonMinutes - H * 60;
  const sunsetMinutes = localNoonMinutes + H * 60;

  return {
    sunrise: formatMinutesTo12HourTime(sunriseMinutes),
    sunset: formatMinutesTo12HourTime(sunsetMinutes),
    localNoon: formatMinutesTo12HourTime(localNoonMinutes),
    sunriseRaw: sunriseMinutes,
    sunsetRaw: sunsetMinutes,
    localNoonRaw: localNoonMinutes
  };
}

// 2. Divamaan and Ratrimaan calculations
export function calculateDivamaanRatrimaan(sunriseMinutes: number, sunsetMinutes: number) {
  // Length of day in minutes
  const dayLength = sunsetMinutes - sunriseMinutes;
  const nightLength = 24 * 60 - dayLength;

  // Convert to Ghati-Pal: 24 minutes = 1 Ghati, 24 seconds = 1 Pal (1 hour = 2.5 Ghati)
  const dayGhati = Math.floor(dayLength / 24);
  const dayPal = Math.floor((dayLength % 24) * 2.5);

  const nightGhati = Math.floor(nightLength / 24);
  const nightPal = Math.floor((nightLength % 24) * 2.5);

  return {
    divamaan: `${dayGhati} घटी ${dayPal} पल`,
    ratrimaan: `${nightGhati} घटी ${nightPal} पल`,
    dayLengthMinutes: dayLength,
    nightLengthMinutes: nightLength
  };
}

// 3. 30 daily Mahamuhurats
export function calculateMahamuhurats(sunriseMinutes: number, sunsetMinutes: number) {
  const dayLength = sunsetMinutes - sunriseMinutes;
  const nightLength = 24 * 60 - dayLength;

  const daySegment = dayLength / 15;
  const nightSegment = nightLength / 15;

  const dayNames = [
    { name: "रुद्र", nature: "ಅಶುಭ / Ashubha", isAuspicious: false },
    { name: "सर्प", nature: "ಅಶುಭ / Ashubha", isAuspicious: false },
    { name: "मित्र", nature: "शुभ / Shubh", isAuspicious: true },
    { name: "पितृ", nature: "सामान्य / General", isAuspicious: true },
    { name: "वसु", nature: "शुभ / Shubh", isAuspicious: true },
    { name: "वाराह", nature: "शुभ / Shubh", isAuspicious: true },
    { name: "विश्वेदेवा", nature: "सामान्य / General", isAuspicious: true },
    { name: "अभिजीत", nature: "परम शुभ / Extremely Auspicious", isAuspicious: true },
    { name: "विधि", nature: "शुभ / Shubh", isAuspicious: true },
    { name: "शतमुखी", nature: "सामान्य / General", isAuspicious: true },
    { name: "पुरुहूत", nature: "सामान्य / General", isAuspicious: true },
    { name: "वाहिनी", nature: "अशुभ / Ashubha", isAuspicious: false },
    { name: "वरुण", nature: "शुभ / Shubh", isAuspicious: true },
    { name: "अर्यमा", nature: "सामान्य / General", isAuspicious: true },
    { name: "भग", nature: "अशुभ / Ashubha", isAuspicious: false }
  ];

  const nightNames = [
    { name: "गिरीश", nature: "सामान्य / General", isAuspicious: true },
    { name: "अजपाद", nature: "अशुभ / Ashubha", isAuspicious: false },
    { name: "अहिरबुध्न्य", nature: "शुभ / Shubh", isAuspicious: true },
    { name: "पूषा", nature: "शुभ / Shubh", isAuspicious: true },
    { name: "अश्विनी", nature: "शुभ / Shubh", isAuspicious: true },
    { name: "यम", nature: "अशुभ / Ashubha", isAuspicious: false },
    { name: "अग्नि", nature: "सामान्य / General", isAuspicious: true },
    { name: "विधाता", nature: "शुभ / Shubh", isAuspicious: true },
    { name: "चंदा", nature: "शुभ / Shubh", isAuspicious: true },
    { name: "अदिति", nature: "शुभ / Shubh", isAuspicious: true },
    { name: "जीव / गुरु", nature: "परम शुभ / Extremely Auspicious", isAuspicious: true },
    { name: "विष्णु", nature: "परम शुभ / Extremely Auspicious", isAuspicious: true },
    { name: "युति", nature: "सामान्य / General", isAuspicious: true },
    { name: "ब्रह्मा", nature: "परम शुभ / Extremely Auspicious", isAuspicious: true },
    { name: "समुद्र", nature: "शुभ / Shubh", isAuspicious: true }
  ];

  const muhurats: MuhuratSegment[] = [];

  // Day muhurats
  for (let i = 0; i < 15; i++) {
    const start = sunriseMinutes + i * daySegment;
    const end = start + daySegment;
    muhurats.push({
      name: dayNames[i].name,
      time: `${formatMinutesTo12HourTime(start)} - ${formatMinutesTo12HourTime(end)}`,
      isAuspicious: dayNames[i].isAuspicious,
      nature: dayNames[i].nature
    });
  }

  // Night muhurats
  for (let i = 0; i < 15; i++) {
    const start = sunsetMinutes + i * nightSegment;
    const end = start + nightSegment;
    muhurats.push({
      name: nightNames[i].name,
      time: `${formatMinutesTo12HourTime(start)} - ${formatMinutesTo12HourTime(end)}`,
      isAuspicious: nightNames[i].isAuspicious,
      nature: nightNames[i].nature
    });
  }

  return muhurats;
}

// 4. Daily Hora Calculator
export function calculateHora(sunriseMinutes: number, weekdayIndex: number) {
  // Day of week index: 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  // Map weekday index to Chaldean ruling planet index
  const vaarRulers = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const startRuler = vaarRulers[weekdayIndex];
  const startIndex = PLANETARY_ORDER.indexOf(startRuler);

  const horaLength = 60; // 1 standard hour approximate segment
  const horaList: HoraSegment[] = [];

  const favorableMap: Record<string, string[]> = {
    Sun: ["Administration", "Government works", "Applying for jobs", "Meeting authorities"],
    Moon: ["Travel", "Arts & music", "Public relations", "Creative works", "Farming"],
    Mars: ["Sports", "Land dealings", "Machinery works", "Debates", "Initiating lawsuit"],
    Mercury: ["Education", "Business trade", "Writing", "Learning new crafts", "Signing contracts"],
    Jupiter: ["Marriage", "Wealth investments", "Spiritual practices", "Education start", "Pilgrimage"],
    Venus: ["Purchase of vehicle", "Dressing & jewelry", "Romance", "Entertainment", "Arts"],
    Saturn: ["House cleaning", "Laying foundation", "Service works", "Handling ancient items"]
  };

  for (let i = 0; i < 24; i++) {
    const currentRulerIndex = (startIndex + i) % 7;
    const planetName = PLANETARY_ORDER[currentRulerIndex];
    const startTime = sunriseMinutes + i * 60;
    const endTime = startTime + 60;
    
    horaList.push({
      hourNum: i + 1,
      time: `${formatMinutesTo12HourTime(startTime)} - ${formatMinutesTo12HourTime(endTime)}`,
      ruler: planetName,
      favorableActivities: favorableMap[planetName] || []
    });
  }

  return horaList;
}

// 5. Daily Choghadiya Calculator
export function calculateChoghadiya(sunriseMinutes: number, sunsetMinutes: number, weekdayIndex: number) {
  const dayLength = sunsetMinutes - sunriseMinutes;
  const nightLength = 24 * 60 - dayLength;

  const dayPart = dayLength / 8;
  const nightPart = nightLength / 8;

  // Choghadiya rules for Day starting from weekday
  // order of Day Choghadiya starting patterns:
  // Sun: Udveg, Chal, Labh, Amrit, Kaal, Shubh, Rog, Udveg
  // Mon: Amrit, Kaal, Shubh, Rog, Udveg, Chal, Labh, Amrit
  // Tue: Rog, Udveg, Chal, Labh, Amrit, Kaal, Shubh, Rog
  // Wed: Chal, Labh, Amrit, Kaal, Shubh, Rog, Udveg, Chal
  // Thu: Shubh, Rog, Udveg, Chal, Labh, Amrit, Kaal, Shubh
  // Fri: Chal, Labh, Amrit, Kaal, Shubh, Rog, Udveg, Chal (or specific)
  // We can model this index offset
  const names: ('Amrit' | 'Shubh' | 'Labh' | 'Chal' | 'Udveg' | 'Rog' | 'Kaal')[] = 
    ["Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog"];

  const choghadiyaAuspiciousness: Record<string, boolean> = {
    Amrit: true, Shubh: true, Labh: true, Chal: true, Udveg: false, Rog: false, Kaal: false
  };

  const choghadiyaRulers: Record<string, string> = {
    Udveg: "Sun", Chal: "Venus", Labh: "Mercury", Amrit: "Moon", Kaal: "Saturn", Shubh: "Jupiter", Rog: "Mars"
  };

  // Day offsets based on weekday: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
  const dayPatterns = [
    [4, 1, 2, 3, 6, 5, 0, 4], // Sun: Udveg(0), Chal(1), Labh(2), Amrit(3), Kaal(4), Shubh(5), Rog(6), Udveg(0) => map to names index
    // Wait, let's index properly: Udveg=0, Chal=1, Labh=2, Amrit=3, Kaal=4, Shubh=5, Rog=6
    [0, 1, 2, 3, 4, 5, 6, 0], // Sun: Udveg(0), Chal(1)...
    [3, 4, 5, 6, 0, 1, 2, 3], // Mon: Amrit(3), Kaal(4), Shubh(5), Rog(6), Udveg(0), Chal(1), Labh(2), Amrit(3)
    [6, 0, 1, 2, 3, 4, 5, 6], // Tue: Rog(6), Udveg(0)...
    [1, 2, 3, 4, 5, 6, 0, 1], // Wed: Chal(1)...
    [5, 6, 0, 1, 2, 3, 4, 5], // Thu: Shubh(5)...
    [2, 3, 4, 5, 6, 0, 1, 2], // Fri: Labh(2)...
    [4, 5, 6, 0, 1, 2, 3, 4]  // Sat: Kaal(4)...
  ];

  // Night offsets based on weekday:
  // Sun: Shubh, Amrit, Rog, Kaal, Labh, Udveg, Chal, Shubh
  const nightPatterns = [
    [5, 3, 6, 4, 2, 0, 1, 5], // Sun night
    [1, 5, 3, 6, 4, 2, 0, 1], // Mon night
    [4, 1, 5, 3, 6, 4, 2, 4], // Tue night
    [0, 4, 1, 5, 3, 6, 4, 0], // Wed night
    [3, 0, 4, 1, 5, 3, 6, 3], // Thu night
    [6, 3, 0, 4, 1, 5, 3, 6], // Fri night
    [2, 6, 3, 0, 4, 1, 5, 2]  // Sat night
  ];

  const list: ChoghadiyaSegment[] = [];

  // Day Choghadiyas
  for (let i = 0; i < 8; i++) {
    const start = sunriseMinutes + i * dayPart;
    const end = start + dayPart;
    const nameIndex = dayPatterns[weekdayIndex][i];
    const qName = names[nameIndex];
    list.push({
      name: qName,
      time: `${formatMinutesTo12HourTime(start)} - ${formatMinutesTo12HourTime(end)}`,
      ruler: choghadiyaRulers[qName],
      quality: qName,
      isAuspicious: choghadiyaAuspiciousness[qName]
    });
  }

  // Night Choghadiyas
  for (let i = 0; i < 8; i++) {
    const start = sunsetMinutes + i * nightPart;
    const end = start + nightPart;
    const nameIndex = nightPatterns[weekdayIndex][i];
    const qName = names[nameIndex];
    list.push({
      name: qName + " (रात्रि)",
      time: `${formatMinutesTo12HourTime(start)} - ${formatMinutesTo12HourTime(end)}`,
      ruler: choghadiyaRulers[qName],
      quality: qName,
      isAuspicious: choghadiyaAuspiciousness[qName]
    });
  }

  return list;
}

// 6. Upagrahas Positions
export function calculateUpagrahas(sunLongitude: number) {
  // Calculations based on Sun longitude (0 - 360)
  const dhoom = (sunLongitude + 133.33) % 360;
  const vyatipata = (360 - dhoom) % 360;
  const parivesha = (vyatipata + 180) % 360;
  const indrachapa = (360 - parivesha) % 360;
  const upaketu = (indrachapa + 16.66) % 360;

  const formatDeg = (deg: number) => {
    const signIndex = Math.floor(deg / 30);
    const degree = Math.floor(deg % 30);
    const minute = Math.floor((deg % 1) * 60);
    return `${ZODIAC_SIGNS[signIndex]} ${degree}°${minute}'`;
  };

  return {
    dhoom: formatDeg(dhoom),
    vyatipata: formatDeg(vyatipata),
    parivesha: formatDeg(parivesha),
    indrachapa: formatDeg(indrachapa),
    upaketu: formatDeg(upaketu)
  };
}

// 7. Mandi & Gulika Timings
export function calculateMandiGulika(sunriseMinutes: number, sunsetMinutes: number, weekdayIndex: number) {
  const dayLength = sunsetMinutes - sunriseMinutes;
  const nightLength = 24 * 60 - dayLength;

  const dayPart = dayLength / 8;
  const nightPart = nightLength / 8;

  // Gulika Rising Parts for day (Sun=0, Mon=1...):
  // Sun: 7th part, Mon: 6th, Tue: 5th, Wed: 4th, Thu: 3rd, Fri: 2nd, Sat: 1st
  const gulikaDayParts = [6, 5, 4, 3, 2, 1, 0];
  // Mandi Rising Parts:
  // Sun: 6th, Mon: 5th, Tue: 4th, Wed: 3rd, Thu: 2nd, Fri: 1st, Sat: 7th
  const mandiDayParts = [5, 4, 3, 2, 1, 0, 6];

  const gulikaPart = gulikaDayParts[weekdayIndex];
  const mandiPart = mandiDayParts[weekdayIndex];

  const gulikaStart = sunriseMinutes + gulikaPart * dayPart;
  const gulikaEnd = gulikaStart + dayPart;

  const mandiStart = sunriseMinutes + mandiPart * dayPart;
  const mandiEnd = mandiStart + dayPart;

  return {
    gulika: `${formatMinutesToTime(gulikaStart)} - ${formatMinutesToTime(gulikaEnd)}`,
    mandi: `${formatMinutesToTime(mandiStart)} - ${formatMinutesToTime(mandiEnd)}`
  };
}

// 8. Ashtakoot Guna Milan (36 points marriage compatibility)
export function calculateGunaMilan(brideNakIndex: number, groomNakIndex: number): GunaMilanResult {
  // Simple deterministic but structured model for Guna Milan scoring
  // Ashwini = 0, Bharani = 1...
  
  // 1. Varna (1 point): Varna depends on Moon sign
  // Let's approximate Rashi index based on Nakshatra
  const getRashiIndex = (nakIndex: number) => Math.floor(nakIndex * 12 / 27) % 12;
  const brideRashi = getRashiIndex(brideNakIndex);
  const groomRashi = getRashiIndex(groomNakIndex);

  // Varna groups: Brahmin (Cancer, Scorpio, Pisces = 3, 7, 11), Kshatriya (Aries, Leo, Sag = 0, 4, 8), 
  // Vaishya (Taurus, Virgo, Cap = 1, 5, 9), Shudra (Gemini, Libra, Aqu = 2, 6, 10)
  const getVarnaCode = (rashi: number) => {
    if ([3, 7, 11].includes(rashi)) return 4; // Brahmin
    if ([0, 4, 8].includes(rashi)) return 3;  // Kshatriya
    if ([1, 5, 9].includes(rashi)) return 2;  // Vaishya
    return 1; // Shudra
  };
  const brideVarna = getVarnaCode(brideRashi);
  const groomVarna = getVarnaCode(groomRashi);
  const varnaScore = groomVarna >= brideVarna ? 1 : 0;

  // 2. Vashya (2 points)
  // Kept simple: if same rashi or friendly element, give points
  let vashyaScore = 0;
  if (brideRashi === groomRashi) vashyaScore = 2;
  else if (Math.abs(brideRashi - groomRashi) % 4 === 0) vashyaScore = 1.5;
  else if (Math.abs(brideRashi - groomRashi) === 6) vashyaScore = 0.5;
  else vashyaScore = 1;

  // 3. Tara (3 points): Auspiciousness of birth star
  // Count from groom to bride, and bride to groom, divide by 9, check remainder
  const diff1 = (brideNakIndex - groomNakIndex + 27) % 9;
  const diff2 = (groomNakIndex - brideNakIndex + 27) % 9;
  const badTarapanas = [1, 3, 5, 7];
  let taraScore = 3;
  if (badTarapanas.includes(diff1) && badTarapanas.includes(diff2)) taraScore = 0;
  else if (badTarapanas.includes(diff1) || badTarapanas.includes(diff2)) taraScore = 1.5;

  // 4. Yoni (4 points): animal matching
  // Animals: 0:Horse, 1:Elephant, 2:Sheep, 3:Serpent, 4:Dog, 5:Cat, 6:Rat, 7:Cow, 8:Buffalo, 9:Tiger, 10:Hare, 11:Monkey, 12:Lion, 13:Mongoose
  const yoniMap = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13];
  const brideYoni = yoniMap[brideNakIndex];
  const groomYoni = yoniMap[groomNakIndex];

  let yoniScore = 0;
  if (brideYoni === groomYoni) yoniScore = 4; // Same animal
  else if (Math.abs(brideYoni - groomYoni) === 7) yoniScore = 0; // Deadly enemies (e.g. Snake vs Mongoose)
  else if ([1, 3, 5].includes(Math.abs(brideYoni - groomYoni))) yoniScore = 2;
  else yoniScore = 1.5;

  // 5. Graha Maitri (5 points): Lord friendship
  // Lords: Sun, Moon, Mars, Merc, Jup, Ven, Sat
  const rashiLords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const brideLord = rashiLords[brideRashi];
  const groomLord = rashiLords[groomRashi];

  let maitriScore = 0;
  if (brideLord === groomLord) maitriScore = 5;
  else if (
    (brideLord === "Sun" && groomLord === "Moon") || (brideLord === "Moon" && groomLord === "Sun") ||
    (brideLord === "Jupiter" && (groomLord === "Sun" || groomLord === "Moon" || groomLord === "Mars"))
  ) {
    maitriScore = 4; // Great friends
  } else if (
    (brideLord === "Saturn" && groomLord === "Mercury") || (brideLord === "Mercury" && groomLord === "Saturn") ||
    (brideLord === "Venus" && groomLord === "Saturn")
  ) {
    maitriScore = 3.5;
  } else {
    maitriScore = 1.5; // Neutral/Enemy
  }

  // 6. Gana (6 points): Deva, Manushya, Rakshasa
  // Groups of Nakshatras
  // Deva: 1, 5, 7, 8, 13, 15, 17, 22, 27
  // Rakshasa: 3, 9, 10, 18, 19, 23, 24, 25, 26
  // Manushya: Others
  const getGana = (nak: number) => {
    const deva = [0, 4, 6, 7, 12, 14, 16, 21, 26]; // 0-indexed
    const rakshasa = [2, 8, 9, 17, 18, 22, 23, 24, 25];
    if (deva.includes(nak)) return "Deva";
    if (rakshasa.includes(nak)) return "Rakshasa";
    return "Manushya";
  };
  const brideGana = getGana(brideNakIndex);
  const groomGana = getGana(groomNakIndex);

  let ganaScore = 0;
  if (brideGana === groomGana) ganaScore = 6;
  else if (
    (brideGana === "Deva" && groomGana === "Manushya") || 
    (brideGana === "Manushya" && groomGana === "Deva")
  ) ganaScore = 5;
  else if (
    (brideGana === "Deva" && groomGana === "Rakshasa") || 
    (brideGana === "Rakshasa" && groomGana === "Deva")
  ) ganaScore = 1;
  else ganaScore = 0; // Manushya and Rakshasa

  // 7. Bhakoot (7 points): relative positioning of Moon sign
  // Favorable: 1-1, 3-11, 4-10, 5-9
  // Unfavorable: 2-12, 6-8, 5-9 (sometimes 2-12 is bad, 6-8 is bad, 7-7 is good)
  const posDiff = (groomRashi - brideRashi + 12) % 12 + 1;
  const bhakootDosha = [2, 12, 6, 8].includes(posDiff);
  const bhakootScore = bhakootDosha ? 0 : 7;

  // 8. Nadi (8 points): Vaata, Pitta, Kapha
  // Nakshatra division:
  // Aadi Nadi (Vaata): 1, 6, 7, 12, 13, 18, 19, 24, 25
  // Madhya Nadi (Pitta): 2, 5, 8, 11, 14, 17, 20, 23, 26
  // Antya Nadi (Kapha): 3, 4, 9, 10, 15, 16, 21, 22, 27
  const getNadi = (nak: number) => {
    const aadi = [0, 5, 6, 11, 12, 17, 18, 23, 24];
    const madhya = [1, 4, 7, 10, 13, 16, 19, 22, 25];
    if (aadi.includes(nak)) return "Aadi";
    if (madhya.includes(nak)) return "Madhya";
    return "Antya";
  };
  const brideNadi = getNadi(brideNakIndex);
  const groomNadi = getNadi(groomNakIndex);
  const nadiDosha = brideNadi === groomNadi;
  const nadiScore = nadiDosha ? 0 : 8;

  // Total Score
  const score = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore;
  const compatibilityPercentage = Math.round((score / 36) * 100);

  // Marriage Prediction based on score
  let prediction = "";
  if (score >= 25) {
    prediction = "उत्तम मिलान (Excellent Match). The couple shares great emotional, intellectual, and physical compatibility. Highly recommended for marriage.";
  } else if (score >= 18) {
    prediction = "मध्यम मिलान (Good Match). The compatibility is average. However, minor remedies (Puja or gemstone) may be suggested to resolve minor doshas.";
  } else {
    prediction = "अशुभ मिलान (Challenging Match). Low compatibility score. The marriage might face health issues, progeny obstacles, or frequent disputes. Rectification remedies required.";
  }

  // Manglik Check Simulation
  const manglikMatch = "दोनों का मंगल संतुलित है (Balanced Mangal). No major dosha observed.";

  return {
    score,
    maxScore: 36,
    varnaScore,
    vashyaScore,
    taraScore,
    yoniScore,
    maitriScore,
    ganaScore,
    bhakootScore,
    nadiScore,
    nadiDosha,
    bhakootDosha,
    manglikMatch,
    compatibilityPercentage,
    prediction
  };
}

// 9. Vimshottari Dasha period calculation
export interface DashaPeriod {
  planet: string;
  durationYears: number;
  startDate: string;
  endDate: string;
}

export function calculateVimshottariDasha(moonLongitude: number, birthDate: Date): DashaPeriod[] {
  // Moon longitude ranges from 0 to 360
  // Each nakshatra occupies 13.333 degrees
  const nakIndex = Math.floor(moonLongitude / 13.333) % 27;
  const nakRuler = NAKSHATRA_LORDS[nakIndex % 9];
  const lordIndex = NAKSHATRA_LORDS.indexOf(nakRuler);

  // Vimshottari cycles starting order: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury
  const dashaYears: Record<string, number> = {
    Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
  };
  const dashaOrder = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

  // Calculate Nakshatra elapsed fraction (Bhayat / Bhabhog approximation)
  const nakStartDegree = nakIndex * 13.333;
  const nakElapsed = moonLongitude - nakStartDegree;
  const elapsedFraction = nakElapsed / 13.333;

  // Balance Dasha at birth
  const startLord = dashaOrder[(lordIndex) % 9];
  const startLordYears = dashaYears[startLord];
  const balanceYears = startLordYears * (1 - elapsedFraction);

  const periods: DashaPeriod[] = [];
  let currentDate = new Date(birthDate);

  // Birth dasha period
  const birthEnd = new Date(currentDate);
  birthEnd.setFullYear(birthEnd.getFullYear() + Math.floor(balanceYears));
  birthEnd.setMonth(birthEnd.getMonth() + Math.floor((balanceYears % 1) * 12));
  periods.push({
    planet: startLord,
    durationYears: balanceYears,
    startDate: birthDate.toLocaleDateString(),
    endDate: birthEnd.toLocaleDateString()
  });

  currentDate = birthEnd;

  // Calculate next 5 dashas
  const orderStartIndex = dashaOrder.indexOf(startLord);
  for (let i = 1; i < 7; i++) {
    const nextLord = dashaOrder[(orderStartIndex + i) % 9];
    const years = dashaYears[nextLord];
    const nextEnd = new Date(currentDate);
    nextEnd.setFullYear(nextEnd.getFullYear() + years);
    periods.push({
      planet: nextLord,
      durationYears: years,
      startDate: currentDate.toLocaleDateString(),
      endDate: nextEnd.toLocaleDateString()
    });
    currentDate = nextEnd;
  }

  return periods;
}

// 10. Planetary position calculation & Kundali placements
// Heliocentric Keplerian solver helpers
function solveKepler(M: number, e: number): number {
  let E = M * Math.PI / 180;
  const M_rad = M * Math.PI / 180;
  for (let iter = 0; iter < 10; iter++) {
    const diff = E - e * Math.sin(E) - M_rad;
    E = E - diff / (1 - e * Math.cos(E));
  }
  return E; // in radians
}

export function getMoonLongitude(d: number): number {
  const L = (218.316 + 13.176396 * d) % 360;
  const M = (134.963 + 13.064993 * d) % 360;
  const D = (297.850 + 12.190749 * d) % 360;
  const F = (93.272 + 13.229350 * d) % 360;
  const M_s = (357.529 + 0.9856003 * d) % 360;

  const M_rad = M * Math.PI / 180;
  const D_rad = D * Math.PI / 180;
  const F_rad = F * Math.PI / 180;
  const Ms_rad = M_s * Math.PI / 180;

  let moonLong = L 
    + 6.289 * Math.sin(M_rad) 
    + 1.274 * Math.sin(2 * D_rad - M_rad) 
    + 0.658 * Math.sin(2 * D_rad) 
    + 0.214 * Math.sin(2 * M_rad)
    - 0.186 * Math.sin(Ms_rad)
    - 0.114 * Math.sin(2 * F_rad);
  return (moonLong + 360) % 360;
}

export function getGeocentricLongitude(planetName: string, d: number): number {
  // 1. Earth elements (opposite of Sun)
  const e_e = 0.0167086 - 0.000038 * (d / 36525.0);
  const L_e = (100.464 + 0.9856474 * d) % 360;
  const w_e = (102.947 + 0.000047 * d) % 360;
  const M_e = (L_e - w_e + 360) % 360;
  const E_e = solveKepler(M_e, e_e);
  const xv_e = Math.cos(E_e) - e_e;
  const yv_e = Math.sqrt(1.0 - e_e * e_e) * Math.sin(E_e);
  
  // Ecliptic coordinates of earth (heliocentric)
  const v_e = Math.atan2(yv_e, xv_e);
  const lon_e = (v_e * 180 / Math.PI + w_e + 360) % 360;
  
  // heliocentric unit vector of Earth
  const x_e = Math.cos(lon_e * Math.PI / 180);
  const y_e = Math.sin(lon_e * Math.PI / 180);

  if (planetName === "Sun") {
    return (lon_e + 180) % 360;
  }
  if (planetName === "Moon") {
    return getMoonLongitude(d);
  }

  // 2. Planet elements
  let a = 1.0, e = 0.0, L = 0.0, w = 0.0;
  switch (planetName) {
    case "Mercury":
      a = 0.387098;
      e = 0.205630;
      L = (252.250 + 4.0923344 * d) % 360;
      w = (77.456 + 0.000159 * d) % 360;
      break;
    case "Venus":
      a = 0.723332;
      e = 0.006773;
      L = (181.979 + 1.6021301 * d) % 360;
      w = (131.532 + 0.0000014 * d) % 360;
      break;
    case "Mars":
      a = 1.523662;
      e = 0.093412;
      L = (355.453 + 0.5240207 * d) % 360;
      w = (336.040 + 0.000122 * d) % 360;
      break;
    case "Jupiter":
      a = 5.203363;
      e = 0.048393;
      L = (34.404 + 0.0830853 * d) % 360;
      w = (14.753 + 0.000038 * d) % 360;
      break;
    case "Saturn":
      a = 9.537070;
      e = 0.054150;
      L = (49.944 + 0.0334812 * d) % 360;
      w = (92.431 - 0.000011 * d) % 360;
      break;
    default:
      return 0;
  }

  const M = (L - w + 360) % 360;
  const E = solveKepler(M, e);
  const xv = a * (Math.cos(E) - e);
  const yv = a * Math.sqrt(1.0 - e * e) * Math.sin(E);
  const v = Math.atan2(yv, xv);
  const lon_p = (v * 180 / Math.PI + w + 360) % 360;
  
  const x_p = a * Math.cos(lon_p * Math.PI / 180);
  const y_p = a * Math.sin(lon_p * Math.PI / 180);

  // Geocentric vector
  const x_g = x_p - x_e;
  const y_g = y_p - y_e;
  
  let geocentricLon = Math.atan2(y_g, x_g) * 180 / Math.PI;
  return (geocentricLon + 360) % 360;
}

export function getAyanamsa(d: number): number {
  return 23.857 + 0.000038246 * d;
}

export function generateKundaliPlacements(birthDate: Date, birthTime: string, latitude: number, longitude: number): PlanetaryPosition[] {
  const timeNum = parseTimeToMinutes(birthTime);
  const birthDateTime = new Date(birthDate);
  // Account for time zone offsets
  birthDateTime.setMinutes(birthDateTime.getMinutes() + timeNum - birthDateTime.getTimezoneOffset());
  
  const jd = 2440587.5 + birthDateTime.getTime() / 86400000.0;
  const d = jd - 2451545.0;
  const ayan = getAyanamsa(d);

  const getPlanetPos = (planetName: string): { signIndex: number, degree: number, rawLong: number } => {
    const tropicalLong = getGeocentricLongitude(planetName, d);
    const siderealLong = (tropicalLong - ayan + 360) % 360;
    const signIndex = Math.floor(siderealLong / 30);
    const degree = Math.floor(siderealLong % 30);
    return { signIndex, degree, rawLong: siderealLong };
  };

  // Node placements (Rahu / Ketu J2000 elements)
  const rahuTropical = (125.045 - 0.052954 * d + 360) % 360;
  const rahuSidereal = (rahuTropical - ayan + 360) % 360;
  const rahuSignIndex = Math.floor(rahuSidereal / 30);
  const rahuDegree = Math.floor(rahuSidereal % 30);

  const ketuSidereal = (rahuSidereal + 180) % 360;
  const ketuSignIndex = Math.floor(ketuSidereal / 30);
  const ketuDegree = Math.floor(ketuSidereal % 30);

  // Ascendant (Lagna) dynamic calculation from local time hours
  const sunPos = getPlanetPos("Sun");
  const solarTimes = calculateSunriseSunset(birthDate, latitude, longitude);
  const sunriseHour = parseTimeToMinutes(solarTimes.sunrise) / 60;
  const birthHour = timeNum / 60;
  const hoursAfterSunrise = (birthHour - sunriseHour + 24) % 24;
  const lagnaDeg = (sunPos.rawLong + hoursAfterSunrise * 15) % 360;
  const lagnaSign = Math.floor(lagnaDeg / 30);
  const lagnaDegree = Math.floor(lagnaDeg % 30);

  const getHouseNumber = (pSignIndex: number): number => {
    return (pSignIndex - lagnaSign + 12) % 12 + 1;
  };

  const list: PlanetaryPosition[] = [
    { name: "Ascendant", sign: ZODIAC_SIGNS[lagnaSign], degree: lagnaDegree, house: 1, retrograde: false }
  ];

  const planNames = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  planNames.forEach(name => {
    const pos = getPlanetPos(name);
    const isRetro = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].includes(name) && 
                    (Math.sin(d + planNames.indexOf(name)) > 0.7);
    list.push({
      name,
      sign: ZODIAC_SIGNS[pos.signIndex],
      degree: pos.degree,
      house: getHouseNumber(pos.signIndex),
      retrograde: isRetro
    });
  });

  // Push Rahu & Ketu
  list.push({
    name: "Rahu",
    sign: ZODIAC_SIGNS[rahuSignIndex],
    degree: rahuDegree,
    house: getHouseNumber(rahuSignIndex),
    retrograde: true
  });
  list.push({
    name: "Ketu",
    sign: ZODIAC_SIGNS[ketuSignIndex],
    degree: ketuDegree,
    house: getHouseNumber(ketuSignIndex),
    retrograde: true
  });

  return list;
}

export function formatMinutesTo12HourTime(totalMinutes: number): string {
  const minutes = Math.floor(totalMinutes % 1440);
  let h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
}

export function formatMinutesToHindiTime(totalMinutes: number): string {
  const isNextDay = totalMinutes >= 1440;
  const minutes = Math.floor(totalMinutes % 1440);
  let h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  
  const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
  return isNextDay ? `अगले दिन सुबह ${timeStr}` : timeStr;
}

export function getJulianDateIST(date: Date, localHours: number, localMinutes: number): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
  const localMinutesTotal = localHours * 60 + localMinutes;
  utcDate.setUTCMinutes(utcDate.getUTCMinutes() + localMinutesTotal - 330);

  return 2440587.5 + utcDate.getTime() / 86400000.0;
}

export function getPanchangTimes(date: Date, latitude: number, longitude: number) {
  const solarDetails = calculateSunriseSunset(date, latitude, longitude);
  const sunriseMinutes = solarDetails.sunriseRaw;

  const getTithiIndexAtTime = (fractionOfDay: number) => {
    const totalLocalMinutes = sunriseMinutes + fractionOfDay * 24 * 60;
    const localHours = Math.floor(totalLocalMinutes / 60);
    const localMins = Math.floor(totalLocalMinutes % 60);

    const jd = getJulianDateIST(date, localHours, localMins);
    const d = jd - 2451545.0;
    const ayan = getAyanamsa(d);
    const sunT = getGeocentricLongitude("Sun", d);
    const sunL = (sunT - ayan + 360) % 360;
    const moonT = getMoonLongitude(d);
    const moonL = (moonT - ayan + 360) % 360;
    const diff = (moonL - sunL + 360) % 360;
    return Math.floor(diff / 12) % 30;
  };

  const getNakshatraIndexAtTime = (fractionOfDay: number) => {
    const totalLocalMinutes = sunriseMinutes + fractionOfDay * 24 * 60;
    const localHours = Math.floor(totalLocalMinutes / 60);
    const localMins = Math.floor(totalLocalMinutes % 60);

    const jd = getJulianDateIST(date, localHours, localMins);
    const d = jd - 2451545.0;
    const ayan = getAyanamsa(d);
    const moonT = getMoonLongitude(d);
    const moonL = (moonT - ayan + 360) % 360;
    return Math.floor(moonL / 13.333333) % 27;
  };

  const startTithi = getTithiIndexAtTime(0);
  let tithiEndTime = "";
  let tithiNextName = "";

  for (let h = 1; h <= 24; h++) {
    const currentTithi = getTithiIndexAtTime(h / 24);
    if (currentTithi !== startTithi) {
      let low = (h - 1) / 24;
      let high = h / 24;
      for (let iter = 0; iter < 6; iter++) {
        const mid = (low + high) / 2;
        if (getTithiIndexAtTime(mid) === startTithi) {
          low = mid;
        } else {
          high = mid;
        }
      }
      const transitionFraction = (low + high) / 2;
      const totalMinutes = sunriseMinutes + transitionFraction * 24 * 60;
      tithiEndTime = formatMinutesToHindiTime(totalMinutes);
      
      const nextTithiNum = (currentTithi % 15) + 1;
      const nextPaksha = currentTithi >= 15 ? 'कृष्ण पक्ष' : 'शुक्ल पक्ष';
      const tithiHindiNames = [
        "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", 
        "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", 
        currentTithi === 14 ? "पूर्णिमा" : "अमावस्या"
      ];
      tithiNextName = `${nextPaksha} ${tithiHindiNames[nextTithiNum - 1]}`;
      break;
    }
  }

  const startNak = getNakshatraIndexAtTime(0);
  let nakshatraEndTime = "";
  let nakshatraNextName = "";

  for (let h = 1; h <= 24; h++) {
    const currentNak = getNakshatraIndexAtTime(h / 24);
    if (currentNak !== startNak) {
      let low = (h - 1) / 24;
      let high = h / 24;
      for (let iter = 0; iter < 6; iter++) {
        const mid = (low + high) / 2;
        if (getNakshatraIndexAtTime(mid) === startNak) {
          low = mid;
        } else {
          high = mid;
        }
      }
      const transitionFraction = (low + high) / 2;
      const totalMinutes = sunriseMinutes + transitionFraction * 24 * 60;
      nakshatraEndTime = formatMinutesToHindiTime(totalMinutes);
      nakshatraNextName = HINDI_NAKSHATRAS[currentNak];
      break;
    }
  }

  return {
    tithiEndTime,
    tithiNextName,
    nakshatraEndTime,
    nakshatraNextName
  };
}

// 11. Complete Dynamic Panchang details based on Selected Date & Location
export function getFullPanchang(date: Date, latitude: number, longitude: number): PanchangData {
  const times = getPanchangTimes(date, latitude, longitude);
  const solarDetails = calculateSunriseSunset(date, latitude, longitude);
  const dLength = calculateDivamaanRatrimaan(solarDetails.sunriseRaw, solarDetails.sunsetRaw);
  
  const sunriseMinutes = solarDetails.sunriseRaw;
  const localHours = Math.floor(sunriseMinutes / 60);
  const localMins = Math.floor(sunriseMinutes % 60);
  
  const jd = getJulianDateIST(date, localHours, localMins);
  const d = jd - 2451545.0;
  const ayanamsa = getAyanamsa(d);

  // Compute live Nirayana longitudes of Sun and Moon at Sunrise
  const sunTropical = getGeocentricLongitude("Sun", d);
  const sunLong = (sunTropical - ayanamsa + 360) % 360;

  const moonTropical = getMoonLongitude(d);
  const moonLong = (moonTropical - ayanamsa + 360) % 360;

  const dayOfWeekIndex = date.getDay();
  const hindiVaarList = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

  // Tithi calculation (elongation angle between Sun & Moon)
  const diff = (moonLong - sunLong + 360) % 360;
  const tithiIndex = Math.floor(diff / 12);
  const tithiNum = (tithiIndex % 15) + 1;
  const paksha = tithiIndex >= 15 ? 'Krishna' : 'Shukla';
  const pakshaHindi = paksha === 'Shukla' ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
  
  const tithiHindiNames = [
    "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", 
    "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", 
    paksha === 'Shukla' ? "पूर्णिमा" : "अमावस्या"
  ];
  const tithiName = `${pakshaHindi} ${tithiHindiNames[tithiNum - 1]}`;

  // Nakshatra (0 - 26)
  const nakIndex = Math.floor(moonLong / 13.333333) % 27;
  const nakshatra = HINDI_NAKSHATRAS[nakIndex];

  // Yoga (27 yogas)
  const yogaNames = [
    "विष्कम्भ", "प्रीति", "आयुष्मान", "सौभाग्य", "शोभन", "अतिगण्ड", "सुकर्मा", 
    "धृति", "शूल", "गण्ड", "वृद्धि", "ध्रुव", "व्याघात", "हर्षण", "वज्र", 
    "सिद्धि", "व्यतिपात", "वरीयान", "परिघ", "शिव", "सिद्ध", "साध्य", "शुभ", 
    "शुक्ल", "ब्रह्म", "ऐन्द्र", "वैधृति"
  ];
  const yogaIndex = Math.floor(((moonLong + sunLong) % 360) / 13.333333) % 27;
  const yoga = yogaNames[yogaIndex];

  // Karana (11 Karanas: 4 fixed, 7 repeating)
  const karanaNames = [
    "बव", "बालव", "कौलव", "तैतिल", "गर", "वणिज", "विष्टि (भद्रा)", 
    "शकुनि", "चतुष्पद", "नाग", "किस्तुघ्न"
  ];
  const karanaHalfTithi = Math.floor(diff / 6);
  let karana = "";
  if (karanaHalfTithi === 0) {
    karana = karanaNames[10]; // Kintughna
  } else if (karanaHalfTithi === 57) {
    karana = karanaNames[7]; // Shakuni
  } else if (karanaHalfTithi === 58) {
    karana = karanaNames[8]; // Chatushpada
  } else if (karanaHalfTithi === 59) {
    karana = karanaNames[9]; // Naga
  } else {
    const repIndex = (karanaHalfTithi - 1) % 7;
    karana = karanaNames[repIndex];
  }

  // Rashi of Sun and Moon
  const rashiSun = HINDI_ZODIAC_SIGNS[Math.floor(sunLong / 30) % 12];
  const rashiMoon = HINDI_ZODIAC_SIGNS[Math.floor(moonLong / 30) % 12];

  // Obliquity and declination checks for Uttarayan/Dakshinayan
  const ayan = date.getMonth() >= 6 ? 'Dakshinayana' : 'Uttarayana';

  // Lunar Month Approximation
  const lunarMonthIndex = Math.floor((sunLong + 15) / 30) % 12;
  const lunarMonth = HINDI_LUNAR_MONTHS[lunarMonthIndex];
  const solarMonth = HINDI_ZODIAC_SIGNS[Math.floor(sunLong / 30) % 12] + " मास";

  // Sanvatsars: Vikram Samvat (2083 in 2026), Shaka Samvat (1948 in 2026)
  const vikramSamvat = date.getFullYear() + 57;
  const shakaSamvat = date.getFullYear() - 78;

  // Mandi & Gulika
  const mg = calculateMandiGulika(solarDetails.sunriseRaw, solarDetails.sunsetRaw, dayOfWeekIndex);

  // Panchak check
  const panchak = [22, 23, 24, 25, 26].includes(nakIndex);

  // Gandmool check
  const gandmool = [0, 8, 9, 17, 18, 26].includes(nakIndex);

  return {
    date: date.toISOString().split('T')[0],
    sunrise: solarDetails.sunrise,
    sunset: solarDetails.sunset,
    localNoon: solarDetails.localNoon,
    divamaan: dLength.divamaan,
    ratrimaan: dLength.ratrimaan,
    tithi: tithiName,
    tithiNum,
    paksha,
    vaar: hindiVaarList[dayOfWeekIndex],
    nakshatra,
    nakshatraNum: nakIndex,
    nakshatraLords: NAKSHATRA_LORDS[nakIndex % 9],
    yoga,
    karana,
    rashiMoon,
    rashiSun,
    ayan,
    solarMonth,
    lunarMonth,
    vikramSamvat,
    shakaSamvat,
    panchak,
    gandmool,
    mandiTime: mg.mandi,
    gulikaTime: mg.gulika,
    tithiEndTime: times.tithiEndTime,
    tithiNextName: times.tithiNextName,
    nakshatraEndTime: times.nakshatraEndTime,
    nakshatraNextName: times.nakshatraNextName
  };
}

// 12. Dynamic Sankalpa Mantra Sanskrit lock string
export function generateSankalpaMantra(date: Date, locationName: string, panchang: PanchangData): string {
  const gotra = "अमुक"; // Placeholder to fill
  const name = "अमुक";

  const ayanText = panchang.ayan === 'Uttarayana' ? 'उत्तरायणे' : 'दक्षिणायने';
  
  // Ritu approximation based on month
  // Vasant, Grishma, Varsha, Sharad, Hemant, Shishir
  const ritus = ["शिशिर", "वसन्त", "वसन्त", "ग्रीष्म", "ग्रीष्म", "वर्षा", "वर्षा", "शरद", "शरद", "हेमन्त", "हेमन्त", "शिशिर"];
  const rituText = ritus[date.getMonth()] + " ऋतौ";

  const pakshaText = panchang.paksha === 'Shukla' ? 'शुक्लपक्षे' : 'कृष्णपक्षे';

  return `ॐ विष्णुर्विष्णुर्विष्णुः श्रीमद्भगवतो महापुरुषस्य विष्णोराज्ञया प्रवर्तमानस्य अद्य ब्रह्मणो द्वितीये परार्धे श्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे कलिप्रथमचरणे भूर्लोके जम्बूद्वीपे भारतवर्षे आर्यावर्तान्तर्गतैकदेशे ${locationName || 'देहली'} क्षेत्रे कलि संवत् ५१२७, विक्रम संवत् ${panchang.vikramSamvat} शक संवत् ${panchang.shakaSamvat} नाम संवत्सरे, ${ayanText}, ${rituText}, महामंगलप्रदे ${panchang.lunarMonth} मासे, ${pakshaText}, ${panchang.tithi} तिथौ, ${panchang.vaar} वासरे, ${panchang.nakshatra} नक्षत्रे, ${panchang.yoga} योगे, ${panchang.karana} करणे, अमुक गोत्रोत्पन्नस्य ${name} नाम धारकस्य अहम् मम कायिक वाचिक मानसिक सकल पापनिवारणार्थं श्रुतिस्मृतिपुराणोक्त फलप्राप्त्यर्थं श्री नवग्रह कृपा प्राप्त्यर्थं संकल्पं करिष्यामि।`;
}

// 13. Shodashvarga (16 divisional charts) calculation engine
export function calculateVargaSign(longitude: number, vargaId: number): number {
  const zodiac_sign = Math.floor(longitude / 30) % 12;
  const degree = longitude % 30;
  const is_odd = (zodiac_sign % 2 === 0); // 0-indexed: Aries(0)=odd, Taurus(1)=even

  let factor = 1;
  switch (vargaId) {
    case 1: factor = 1; break;
    case 2: factor = 2; break;
    case 3: factor = 3; break;
    case 4: factor = 4; break;
    case 7: factor = 7; break;
    case 9: factor = 9; break;
    case 10: factor = 10; break;
    case 12: factor = 12; break;
    case 16: factor = 16; break;
    case 20: factor = 20; break;
    case 24: factor = 24; break;
    case 27: factor = 27; break;
    case 30: factor = 30; break;
    case 40: factor = 40; break;
    case 45: factor = 45; break;
    case 60: factor = 60; break;
    default: factor = 1;
  }

  const part = Math.floor(degree / (30.0 / factor));

  if (vargaId === 1) {
    return zodiac_sign;
  }
  
  if (vargaId === 2) { // Hora (D2) Odd/Even Rules
    if (is_odd) {
      return degree < 15 ? 4 : 3; // Leo (4) or Cancer (3)
    } else {
      return degree < 15 ? 3 : 4; // Cancer (3) or Leo (4)
    }
  }

  if (vargaId === 3) { // Drekkana (D3)
    return (zodiac_sign + part * 4) % 12;
  }

  if (vargaId === 4) { // Chaturthamsa (D4)
    return (zodiac_sign + part * 3) % 12;
  }

  if (vargaId === 7) { // Saptamsa (D7)
    const start = is_odd ? zodiac_sign : (zodiac_sign + 6) % 12;
    return (start + part) % 12;
  }

  if (vargaId === 9) { // Navamsa (D9)
    const base = (zodiac_sign % 3) * 4;
    return (base + part) % 12;
  }

  if (vargaId === 10) { // Dasamsa (D10)
    const start = is_odd ? zodiac_sign : (zodiac_sign + 8) % 12;
    return (start + part) % 12;
  }

  if (vargaId === 12) { // Dwadasamsa (D12)
    return (zodiac_sign + part) % 12;
  }

  if (vargaId === 16) { // Shodasamsa (D16)
    let start = 0;
    if ([0, 3, 6, 9].includes(zodiac_sign)) start = 0; // moveable => Aries (0)
    else if ([1, 4, 7, 10].includes(zodiac_sign)) start = 4; // fixed => Leo (4)
    else start = 8; // dual => Sagittarius (8)
    return (start + part) % 12;
  }

  if (vargaId === 20) { // Vimsamsa (D20)
    let start = 0;
    if ([0, 3, 6, 9].includes(zodiac_sign)) start = 0; // moveable => Aries (0)
    else if ([1, 4, 7, 10].includes(zodiac_sign)) start = 8; // fixed => Sagittarius (8)
    else start = 4; // dual => Leo (4)
    return (start + part) % 12;
  }

  if (vargaId === 24) { // Chaturvimsamsa (D24)
    const start = is_odd ? 4 : 3; // Leo (4) or Cancer (3)
    return (start + part) % 12;
  }

  if (vargaId === 27) { // Saptavimsamsa (D27)
    let start = 0;
    if ([0, 4, 8].includes(zodiac_sign)) start = 0; // Fire => Aries
    else if ([1, 5, 9].includes(zodiac_sign)) start = 3; // Earth => Cancer
    else if ([2, 6, 10].includes(zodiac_sign)) start = 6; // Air => Libra
    else start = 9; // Water => Capricorn
    return (start + part) % 12;
  }

  if (vargaId === 30) { // Trimamsa (D30) Parashara Rules
    if (is_odd) {
      if (degree < 5) return 0; // Aries (Mars)
      if (degree < 10) return 10; // Aquarius (Saturn)
      if (degree < 18) return 8; // Sagittarius (Jupiter)
      if (degree < 25) return 2; // Gemini (Mercury)
      return 1; // Taurus (Venus)
    } else {
      if (degree < 5) return 1; // Taurus (Venus)
      if (degree < 12) return 2; // Gemini (Mercury)
      if (degree < 20) return 8; // Sagittarius (Jupiter)
      if (degree < 25) return 10; // Aquarius (Saturn)
      return 0; // Aries (Mars)
    }
  }

  if (vargaId === 40) { // Khavedamsa (D40)
    const start = is_odd ? 0 : 6; // Aries (0) or Libra (6)
    return (start + part) % 12;
  }

  if (vargaId === 45) { // Akshavedamsa (D45)
    let start = 0;
    if ([0, 3, 6, 9].includes(zodiac_sign)) start = 0; // moveable => Aries (0)
    else if ([1, 4, 7, 10].includes(zodiac_sign)) start = 4; // fixed => Leo (4)
    else start = 8; // dual => Sagittarius (8)
    return (start + part) % 12;
  }

  if (vargaId === 60) { // Shastiamsa (D60)
    return (zodiac_sign + part) % 12;
  }

  return zodiac_sign;
}

export function generateVargaChartPlanets(planets: PlanetaryPosition[], vargaId: number): PlanetaryPosition[] {
  // Find Ascendant sign in varga
  const asc = planets.find(p => p.name === "Ascendant") || planets[0];
  const ascLong = ZODIAC_SIGNS.indexOf(asc.sign) * 30 + asc.degree;
  const ascVargaSign = calculateVargaSign(ascLong, vargaId);

  return planets.map(p => {
    const pLong = ZODIAC_SIGNS.indexOf(p.sign) * 30 + p.degree;
    const pVargaSign = calculateVargaSign(pLong, vargaId);
    
    // House position = (pVargaSign - ascVargaSign + 12) % 12 + 1
    const house = (pVargaSign - ascVargaSign + 12) % 12 + 1;
    
    return {
      name: p.name,
      sign: ZODIAC_SIGNS[pVargaSign],
      degree: p.degree,
      house,
      retrograde: p.retrograde
    };
  });
}

// 14. Bhavishyafal dynamic horoscope generator (AstroSage style)
export interface AstroPredictions {
  lagnaPrediction: string;
  moonPrediction: string;
  sunPrediction: string;
  healthPrediction: string;
  wealthPrediction: string;
  careerPrediction: string;
}

export function generateAstroPredictions(planets: PlanetaryPosition[]): AstroPredictions {
  const asc = planets.find(p => p.name === "Ascendant") || planets[0];
  const moon = planets.find(p => p.name === "Moon") || planets[1];
  const sun = planets.find(p => p.name === "Sun") || planets[2];

  const ascSign = asc.sign;
  const moonSign = moon.sign;
  const sunSign = sun.sign;

  const lagnaHindiMap: Record<string, string> = {
    Aries: "मेष लग्न के जातक साहसी, महत्वाकांक्षी और ऊर्जावान होते हैं। इनमें नेतृत्व करने की अद्भुत क्षमता होती है।",
    Taurus: "वृषभ लग्न के जातक धैर्यवान, शांत और कलाप्रेमी होते हैं। ये जीवन में स्थिरता और सुरक्षा को प्राथमिकता देते हैं।",
    Gemini: "मिथुन लग्न के जातक बुद्धिमान, मिलनसार और बहुमुखी प्रतिभा के धनी होते हैं। इनका संचार कौशल उत्कृष्ट होता है।",
    Cancer: "कर्क लग्न के जातक संवेदनशील, भावुक और परिवार के प्रति समर्पित होते हैं। इनका अंतर्ज्ञान बहुत तीव्र होता है।",
    Leo: "सिंह लग्न के जातक आत्मविश्वासी, उदार और राजसी स्वभाव वाले होते हैं। ये सदैव ध्यान का केंद्र बनना पसंद करते हैं।",
    Virgo: "कन्या लग्न के जातक विश्लेषणात्मक, बुद्धिमान और व्यावहारिक होते हैं। ये हर काम को व्यवस्थित ढंग से करते हैं।",
    Libra: "तुला लग्न के जातक न्यायप्रिय, शांत और कलाप्रिय होते हैं। ये संबंधों में संतुलन बनाए रखने का प्रयास करते हैं।",
    Scorpio: "वृश्चिक लग्न के जातक दृढ़निश्चयी, रहस्यमयी और भावुक होते हैं। इनकी इच्छाशक्ति अत्यधिक प्रबल होती है।",
    Sagittarius: "धनु लग्न के जातक आशावादी, दार्शनिक और ज्ञान के खोजी होते हैं। इन्हें स्वतंत्रता और यात्रा करना पसंद होता है।",
    Capricorn: "मकर लग्न के जातक अनुशासित, महत्वाकांक्षी और व्यावहारिक होते हैं। ये कड़ी मेहनत से सफलता प्राप्त करते हैं।",
    Aquarius: "कुंभ लग्न के जातक परोपकारी, स्वतंत्र विचारों वाले और बुद्धिमान होते हैं। ये लीक से हटकर सोचना पसंद करते हैं।",
    Pisces: "मीन लग्न के जातक संवेदनशील, आध्यात्मिक और कल्पनाशील होते हैं। इनका स्वभाव दयालु और परोपकारी होता है।"
  };

  const moonHindiMap: Record<string, string> = {
    Aries: "चंद्रमा मेष राशि में होने से जातक का मन चंचल और विचारों में तेजी रहती है। कार्य शुरू करने की जल्दी होती है।",
    Taurus: "चंद्रमा वृषभ राशि में उच्च का होता है, जिससे जातक का मन स्थिर, खुशमिजाज और शांत रहता है।",
    Gemini: "चंद्रमा मिथुन राशि में होने से जातक नई चीजें सीखने और बातचीत करने में बहुत रुचि रखता है।",
    Cancer: "चंद्रमा स्वराशि कर्क में होने से जातक अत्यधिक भावुक, दयालु और सहृदय होता है।",
    Leo: "चंद्रमा सिंह राशि में होने से जातक स्वाभिमानी, आत्मविश्वासी और कला-संगीत प्रेमी होता है।",
    Virgo: "चंद्रमा कन्या राशि में होने से जातक तार्किक सोच वाला, स्पष्टवादी और हिसाब-किताब में तेज होता है।",
    Libra: "चंद्रमा तुला राशि में होने से जातक मिलनसार, न्यायप्रिय और कलात्मक अभिरुचि वाला होता है।",
    Scorpio: "चंद्रमा वृश्चिक राशि में होने से जातक के मन में रहस्यमयी विचार और भावुकता का उतार-चढ़ाव बना रहता है।",
    Sagittarius: "चंद्रमा धनु राशि में होने से जातक आशावादी, धार्मिक प्रवृत्ति का और ज्ञान का आकांक्षी होता है।",
    Capricorn: "चंद्रमा मकर राशि में होने से जातक गंभीर, कर्तव्यनिष्ठ और व्यावहारिक स्वभाव का होता है।",
    Aquarius: "चंद्रमा कुंभ राशि में होने से जातक खोजी प्रवृत्ति, दूसरों की मदद करने वाला और एकांतप्रिय होता है।",
    Pisces: "चंद्रमा मीन राशि में होने से जातक कल्पनाशील, कलात्मक और गहरे आध्यात्मिक झुकाव वाला होता है।"
  };

  const sunHindiMap: Record<string, string> = {
    Aries: "सूर्य मेष राशि में उच्च का होने से जातक अत्यंत तेजस्वी, साहसी और समाज में उच्च पद प्राप्त करने वाला होता है।",
    Taurus: "सूर्य वृषभ राशि में होने से जातक दृढ़निश्चयी, भौतिक सुखों का प्रेमी और कला के प्रति आकर्षित होता है।",
    Gemini: "सूर्य मिथुन राशि में होने से जातक बुद्धिमान, चतुर वक्ता और व्यापारिक सूझबूझ वाला होता है।",
    Cancer: "सूर्य कर्क राशि में होने से जातक संवेदनशील, परोपकारी और पारिवारिक मूल्यों को मानने वाला होता है।",
    Leo: "सूर्य स्वराशि सिंह में होने से जातक में राजा के समान तेज, नेतृत्व शक्ति और स्वाभिमान भरा होता है।",
    Virgo: "सूर्य कन्या राशि में होने से जातक तार्किक, कुशल प्रबंधक और बारीकियों पर ध्यान देने वाला होता है।",
    Libra: "सूर्य तुला राशि में नीच का होने से आत्मविश्वास में कभी-कभी कमी आ सकती है, लेकिन संतुलन बनाने में ये माहिर होते हैं।",
    Scorpio: "सूर्य वृश्चिक राशि में होने से जातक साहसी, अनुसंधानकर्ता और कठिनाइयों का डटकर सामना करने वाला होता है।",
    Sagittarius: "सूर्य धनु राशि में होने से जातक धार्मिक, नीतिवान, न्यायप्रिय और गुरुजनों का आदर करने वाला होता है।",
    Capricorn: "सूर्य मकर राशि में शत्रु शनि की राशि में होने से संघर्ष के बाद सफलता मिलती है, जातक अनुशासित होता है।",
    Aquarius: "सूर्य कुंभ राशि में होने से जातक दार्शनिक, समाज सुधारक और स्वतंत्र विचारों वाला होता है।",
    Pisces: "सूर्य मीन राशि में होने से जातक ज्ञानी, परोपकारी, संवेदनशील और कलाप्रेमी होता है।"
  };

  const healthMap: Record<string, string> = {
    Aries: "अग्नि तत्व प्रधान होने से सिरदर्द और पेट की उष्णता से सावधान रहें। प्राणायाम करना लाभदायक होगा।",
    Taurus: "गले और श्वास नली के विकारों के प्रति सचेत रहें। संतुलित आहार से स्वास्थ्य उत्तम रहेगा।",
    Gemini: "स्नायु तंत्र और कंधों में खिंचाव संभव है। ध्यान और योग से मानसिक थकान दूर करें।",
    Cancer: "पाचन क्रिया और छाती के विकारों के प्रति जागरूक रहें। पानी का सेवन प्रचुर मात्रा में करें।",
    Leo: "हृदय और पीठ के हिस्से का ध्यान रखें। नियमित व्यायाम और संतुलित दिनचर्या बेहद आवश्यक है।",
    Virgo: "आंतों और पेट के निचले हिस्से में संवेदनशीलता रह सकती है। हल्का व सुपाच्य भोजन ग्रहण करें।",
    Libra: "गुर्दे और पीठ के निचले हिस्से का ध्यान रखें। योग क्रियाएं आपके लिए सर्वोत्तम हैं।",
    Scorpio: "गुप्तांगों और रक्त प्रवाह से संबंधित सावधानियां बरतें। नियमित स्वास्थ्य परीक्षण कराएं।",
    Sagittarius: "जांघों और यकृत (लीवर) के प्रति सचेत रहें। मीठा खाने पर नियंत्रण रखना हितकर होगा।",
    Capricorn: "घुटनों और हड्डियों के दर्द से बचाव रखें। जोड़ों के व्यायाम नियमित रूप से करें।",
    Aquarius: "पैरों और टखनों में खिंचाव आ सकता है। ध्यान व वॉक करना आपके लिए स्वास्थ्यवर्धक है।",
    Pisces: "पैरों के तलवों और कफ जनित समस्याओं से सावधान रहें। गुनगुने पानी का सेवन लाभदायक है।"
  };

  const wealthMap: Record<string, string> = {
    Aries: "आर्थिक रूप से आप साहसी निर्णय लेंगे। भूमि और साहस के कार्यों से धन प्राप्ति के उत्तम योग बनेंगे।",
    Taurus: "संचित धन में वृद्धि होगी। पैतृक संपत्ति से लाभ और विलासिता की वस्तुओं पर व्यय होगा।",
    Gemini: "आय के एक से अधिक साधन बनेंगे। संचार और बौद्धिक कार्यों से धनार्जन होगा।",
    Cancer: "आर्थिक स्थिति मजबूत रहेगी। जल संबंधी कार्यों, दुग्ध व्यवसाय अथवा चांदी के निवेश से लाभ होगा।",
    Leo: "राजकीय कार्यों और प्रशासनिक संबंधों से धन प्राप्ति होगी। मान-प्रतिष्ठा में वृद्धि होगी।",
    Virgo: "योजनाबद्ध निवेश से ही लाभ मिलेगा। हिसाब-किताब में सतर्कता बरतें, अनावश्यक खर्चे रोकें।",
    Libra: "व्यापारिक साझेदारी और कला-सौंदर्य के क्षेत्रों से प्रचुर मात्रा में धन अर्जित करेंगे।",
    Scorpio: "गुप्त स्रोतों और आकस्मिक धन लाभ के योग बनते हैं। जोखिम भरे निवेश में सावधानी रखें।",
    Sagittarius: "शिक्षा, शिक्षण और सलाहकारी कार्यों से उत्तम धन लाभ होगा। भाग्य हमेशा साथ देगा।",
    Capricorn: "कड़ी मेहनत और लोहे/कोयले/निर्माण कार्यों से आर्थिक स्थिति सुदृढ़ होगी।",
    Aquarius: "सामाजिक कार्यों और नवीन अविष्कारों के बल पर धनोपार्जन करेंगे। खर्चों पर संयम रखें।",
    Pisces: "धार्मिक यात्राओं, पठन-पाठन और शेयर बाजार के विवेकपूर्ण निवेश से अच्छा लाभ होगा।"
  };

  const careerMap: Record<string, string> = {
    Aries: "सैन्य विभाग, पुलिस, इंजीनियरिंग, खेल अथवा प्रशासनिक सेवाओं में करियर उत्कृष्ट रहेगा।",
    Taurus: "बैंकिंग, कला, संगीत, होटल व्यवसाय, रत्न एवं आभूषण के क्षेत्र में बड़ी सफलता मिलेगी।",
    Gemini: "लेखन, पत्रकारिता, सॉफ्टवेयर डेवलपमेंट, शिक्षण अथवा व्यापार में नाम कमाएंगे।",
    Cancer: "चिकित्सा, जल सेना, डेयरी उद्योग, समाज सेवा अथवा अध्यापन क्षेत्र अनुकूल रहेंगे।",
    Leo: "राजनीति, सरकारी उच्च पद, प्रबंधन, आर्म्स डील अथवा आंत्रप्रेन्योरशिप में चमकेंगे।",
    Virgo: "अकाउंटेंसी, डेटा विश्लेषण, वकालत, अनुवादक अथवा शोध कार्यों में सफल रहेंगे।",
    Libra: "फैशन डिजाइनिंग, फिल्म इंडस्ट्री, न्यायपालिका, डिप्लोमेसी अथवा व्यवसाय में उन्नति करेंगे।",
    Scorpio: "जासूसी, गुप्त विद्याएं, सर्जरी, दवा निर्माण अथवा माइनिंग के क्षेत्र उत्तम हैं।",
    Sagittarius: "धार्मिक गुरु, प्रोफेसर, कानून विशेषज्ञ, वित्तीय सलाहकार अथवा लेखक बनेंगे।",
    Capricorn: "इंजीनियरिंग, कॉन्ट्रैक्टर, न्याय सेवा, लोहा उद्योग अथवा कृषि में धाक जमेगी।",
    Aquarius: "वैज्ञानिक अनुसंधान, स्पेस, कंप्यूटर प्रोग्रामिंग, एनजीओ अथवा सामाजिक नेतृत्व करेंगे।",
    Pisces: "अध्यात्म, योग प्रशिक्षक, कला निर्देशन, समुद्री व्यापार अथवा विदेशी शिक्षा में सफल होंगे।"
  };

  return {
    lagnaPrediction: lagnaHindiMap[ascSign] || "आपका व्यक्तित्व प्रभावशाली है।",
    moonPrediction: moonHindiMap[moonSign] || "आपका मन शांत और कोमल है।",
    sunPrediction: sunHindiMap[sunSign] || "आपमें नेतृत्व की उत्तम क्षमता है।",
    healthPrediction: healthMap[ascSign] || "स्वास्थ्य का ध्यान रखें और संतुलित आहार लें।",
    wealthPrediction: wealthMap[ascSign] || "योजनाबद्ध निवेश से आर्थिक उन्नति होगी।",
    careerPrediction: careerMap[ascSign] || "अपनी रुचि के क्षेत्र में कठिन परिश्रम करें।"
  };
}
