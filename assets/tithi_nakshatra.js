// tithi_nakshatra.js: Calculate tithi and nakshatra based on sun and moon longitude

function getLongitude(date, speed) {
    const daysSinceEpoch = (date - new Date(2000, 0, 1)) / (1000 * 60 * 60 * 24);
    return (daysSinceEpoch * speed) % 360;
}

export function getTithi(date) {
    const moonLongitude = getLongitude(date, 13.1764); // Moon's speed
    const sunLongitude = getLongitude(date, 0.9856);  // Sun's speed
    const tithi = Math.floor((moonLongitude - sunLongitude) / 12) + 1;
    return tithi <= 0 ? tithi + 30 : tithi; // Normalize Tithi
}

export function getNakshatra(date) {
    const moonLongitude = getLongitude(date, 13.1764);
    const nakshatra = Math.floor(moonLongitude / 13.3333) + 1; // 27 Nakshatras
    return nakshatra > 27 ? 1 : nakshatra; // Loop back to 1 if >27
}
