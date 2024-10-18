import { getMoonPhase, getMoonPhaseName } from './assets/moonphase.js';
import { getTideTimes } from './assets/tides.js';
import { getTithi, getNakshatra } from './assets/tithi_nakshatra.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Calendar script loaded"); // Debugging line

    const calendarBody = document.getElementById('calendarBody');

    function renderCalendar(year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        calendarBody.innerHTML = ''; // Clear previous entries

        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');

                if (i === 0 && j < firstDay) {
                    cell.innerHTML = ''; // Empty cell for alignment
                } else if (date > daysInMonth) {
                    break;
                } else {
                    const currentDate = new Date(year, month, date);
                    cell.textContent = date;
                    cell.addEventListener('click', () => showDetails(currentDate));
                    date++;
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
        }
    }

    function showDetails(date) {
        const moonPhase = getMoonPhase(date);
        const tideTimes = getTideTimes(date);
        const tithi = getTithi(date);
        const nakshatra = getNakshatra(date);

        const modal = document.getElementById('modal');
        const modalDate = document.getElementById('modalDate');
        const modalDetails = document.getElementById('modalDetails');

        modalDate.textContent = `Details for ${date.toDateString()}`;
        modalDetails.innerHTML = `
            <strong>Moon Phase:</strong> ${getMoonPhaseName(moonPhase)}<br>
            <strong>Tithi:</strong> ${tithi}<br>
            <strong>Nakshatra:</strong> ${nakshatra}<br>
            <strong>High Tides:</strong> ${tideTimes.highTides.join(', ')}<br>
            <strong>Low Tides:</strong> ${tideTimes.lowTides.join(', ')}
        `;
        modal.classList.remove('hidden');
    }

    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentYear, currentMonth);
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentYear, currentMonth);
    });

    renderCalendar(currentYear, currentMonth); // Initial render
});
