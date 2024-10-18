// moonphase.js: Calculate moon phase accurately

const SYNODIC_MONTH = 29.53058867; // Length of a lunar cycle in days

// Reference new moon date: Jan 6, 2000, 18:14 UTC
const NEW_MOON_DATE = new Date(Date.UTC(2000, 0, 6, 18, 14));

export function getMoonPhase(date) {
    const daysSinceNewMoon = (date - NEW_MOON_DATE) / (1000 * 60 * 60 * 24);
    const phase = (daysSinceNewMoon % SYNODIC_MONTH) / SYNODIC_MONTH;
    return phase < 0 ? phase + 1 : phase; // Normalize to [0, 1]
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
