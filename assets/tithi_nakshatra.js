// tithi_nakshatra.js: Calculate Tithi and Nakshatra

const TITHI_NAMES = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
    "Purnima", "Amavasya"
];

const NAKSHATRA_NAMES = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
    "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
    "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
    "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

// Calculate sun/moon longitude for the given date
function getLongitude(date, speed) {
    const daysSinceEpoch = (date - new Date(2000, 0, 1)) / (1000 * 60 * 60 * 24);
    return (daysSinceEpoch * speed) % 360;
}

export function getTithi(date) {
    const moonLongitude = getLongitude(date, 13.1764); // Moon's speed
    const sunLongitude = getLongitude(date, 0.9856); // Sun's speed
    const tithi = Math.floor((moonLongitude - sunLongitude) / 12) + 1;
    return tithi <= 0 ? tithi + 30 : tithi; // Adjust for negative values
}

export function getNakshatra(date) {
    const moonLongitude = getLongitude(date, 13.1764); // Moon's speed
    return Math.floor(moonLongitude / 13.3333) % 27;
}

// Get Tithi name based on calculated Tithi number
export function getTithiName(date) {
    const tithiNumber = getTithi(date) - 1;
    return TITHI_NAMES[tithiNumber];
}

// Get Nakshatra name based on calculated Nakshatra number
export function getNakshatraName(date) {
    const nakshatraNumber = getNakshatra(date);
    return NAKSHATRA_NAMES[nakshatraNumber];
}
