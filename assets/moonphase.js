// MoonPhase.js: Calculate moon phases reliably using astronomical data

export function getMoonPhase(date) {
    const synodicMonth = 29.53058867; // Synodic month in days
    const newMoon = new Date(2000, 0, 6, 18, 14); // Reference new moon date (Jan 6, 2000)
    
    const diff = (date - newMoon) / (1000 * 60 * 60 * 24); // Days difference
    const phase = (diff % synodicMonth) / synodicMonth;

    return phase < 0 ? phase + 1 : phase; // Normalize phase between 0 and 1
}

export function getMoonPhaseName(phase) {
    if (phase === 0) return "New Moon";
    if (phase < 0.25) return "Waxing Crescent";
    if (phase === 0.25) return "First Quarter";
    if (phase < 0.5) return "Waxing Gibbous";
    if (phase === 0.5) return "Full Moon";
    if (phase < 0.75) return "Waning Gibbous";
    if (phase === 0.75) return "Last Quarter";
    return "Waning Crescent";
}
