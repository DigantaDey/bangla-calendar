import { getMoonPhase, getMoonPhaseName } from './assets/moonphase.js';
import { getTideTimes } from './assets/tides.js';
import { getTithi, getNakshatra } from './assets/tithi_nakshatra.js';

const calendarBody = document.getElementById('calendarBody');
const languageSwitcher = document.getElementById('languageSwitcher');
const monthYearDisplay = document.getElementById('monthYear');
let currentLanguage = 'en'; // Default language

const bengaliMonths = ["বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"];
const gregorianMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getMonthName(month, language) {
    return language === 'en' ? gregorianMonths[month] : bengaliMonths[month];
}

function renderCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    calendarBody.innerHTML = ''; // Clear previous entries
    monthYearDisplay.textContent = `${getMonthName(month, currentLanguage)} ${year}`;

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
                const bengaliDate = convertToBengaliDate(currentDate);

                cell.innerHTML = `
                    <div>${date}</div>
                    <div>${bengaliDate}</div>
                `;
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
    const tithi = tithiNames[getTithi(date) - 1];
    const nakshatra = nakshatraNames[getNakshatra(date) - 1];

    fetch(`https://some-moon-api.com?phase=${moonPhase}`)
        .then(response => response.json())
        .then(data => {
            const moonImage = data.image; // Get moon phase image from API
            const modal = document.getElementById('modal');
            const modalDate = document.getElementById('modalDate');
            const modalDetails = document.getElementById('modalDetails');

            modalDate.textContent = `Details for ${date.toDateString()}`;
            modalDetails.innerHTML = `
                <img src="${moonImage}" alt="Moon Phase">
                <strong>Moon Phase:</strong> ${getMoonPhaseName(moonPhase)}<br>
                <strong>Tithi:</strong> ${tithi}<br>
                <strong>Nakshatra:</strong> ${nakshatra}<br>
                <strong>High Tides:</strong> ${tideTimes.highTides.join(', ')}<br>
                <strong>Low Tides:</strong> ${tideTimes.lowTides.join(', ')}
            `;
            modal.classList.remove('hidden');
        });
}

languageSwitcher.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    renderCalendar(new Date().getFullYear(), new Date().getMonth());
});

const today = new Date();
renderCalendar(today.getFullYear(), today.getMonth());
