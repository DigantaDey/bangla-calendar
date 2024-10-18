import { getMoonPhase, getMoonPhaseName } from './assets/moonphase.js';
import { getTideTimes } from './assets/tides.js';
import { getTithi, getNakshatra } from './assets/tithi_nakshatra.js';

function renderMoonSymbol(phase) {
    const moon = document.createElement('div');
    moon.className = 'moon';

    const phaseAngle = phase * 360; // Convert phase to degrees (0-360)

    // Create a dark overlay for phases other than full moon
    const darkSide = document.createElement('div');
    darkSide.className = 'moon-overlay';

    if (phase <= 0.5) {
        // Waxing phases (New Moon to Full Moon)
        darkSide.style.clipPath = `circle(50% at ${100 - phase * 200}% 50%)`;
    } else {
        // Waning phases (Full Moon to New Moon)
        darkSide.style.clipPath = `circle(50% at ${phase * 200 - 100}% 50%)`;
    }

    moon.appendChild(darkSide);
    return moon;
}

function showDetails(date) {
    const moonPhase = getMoonPhase(date);
    const moonPhaseName = getMoonPhaseName(moonPhase);
    const tideTimes = getTideTimes(date);
    const tithi = getTithi(date);
    const nakshatra = getNakshatra(date);

    const modal = document.getElementById('modal');
    const modalDate = document.getElementById('modalDate');
    const modalDetails = document.getElementById('modalDetails');

    const moonSymbol = renderMoonSymbol(moonPhase);

    modalDate.textContent = `Details for ${date.toDateString()}`;
    modalDetails.innerHTML = `
        <strong>Moon Phase:</strong> ${moonPhaseName}<br>
        <strong>Tithi:</strong> ${tithi}<br>
        <strong>Nakshatra:</strong> ${nakshatra}<br>
        <strong>High Tides:</strong> ${tideTimes.highTides.join(', ')}<br>
        <strong>Low Tides:</strong> ${tideTimes.lowTides.join(', ')}
    `;
    modalDetails.prepend(moonSymbol); // Add moon symbol to the modal

    modal.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    renderCalendar(today.getFullYear(), today.getMonth());
});
