// tithi_nakshatra.js: Calculate Tithi and Nakshatra based on solar and lunar positions

const tithiNames = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", 
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", 
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", 
    "Purnima/Amavasya"
];

const nakshatraNames = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", 
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", 
    "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", 
    "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", 
    "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", 
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

export function getTithi(date) {
    const moonLongitude = getLongitude(date, 13.1764);
    const sunLongitude = getLongitude(date, 0.9856);
    const tithi = Math.floor((moonLongitude - sunLongitude) / 12) + 1;
    return tithi <= 0 ? tithi + 30 : tithi;
}

export function getNakshatra(date) {
    const moonLongitude = getLongitude(date, 13.1764);
    return Math.floor(moonLongitude / 13.3333) % 27;
}

function getLongitude(date, speed) {
    const daysSinceEpoch = (date - new Date(2000, 0, 1)) / (1000 * 60 * 60 * 24);
    return (daysSinceEpoch * speed) % 360;
}
