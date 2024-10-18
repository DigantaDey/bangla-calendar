// moonphase.js: Calculate the moon phase based on astronomical formulas

export function getMoonPhase(date) {
    const synodicMonth = 29.53058867; // Length of the synodic month
    const newMoon = new Date(2000, 0, 6, 18, 14); // Reference new moon date

    const diff = (date - newMoon) / (1000 * 60 * 60 * 24); // Days since reference new moon
    const phase = (diff % synodicMonth) / synodicMonth;
    return phase < 0 ? phase + 1 : phase; // Normalize between 0 and 1
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
