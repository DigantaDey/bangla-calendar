import { getMoonPhase, getMoonPhaseName } from './assets/moonphase.js';
import { getTideTimes } from './assets/tides.js';
import { getTithi, getNakshatra } from './assets/tithi_nakshatra.js';

const bengaliMonths = [
    "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ",
    "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ",
    "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
];

const calendarBody = document.getElementById('calendarBody');
const monthYearDisplay = document.getElementById('monthYear');
const languageSwitcher = document.getElementById('languageSwitcher');
let currentLanguage = 'en'; // Default language: English

// Julian Day calculation
function julianDay(year, month, day) {
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) +
           Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Calculate sun's ecliptic longitude for the given Julian Day
function sunLongitude(jd) {
    const n = jd - 2451545.0;
    const L = (280.460 + 0.9856474 * n) % 360;
    const g = (357.528 + 0.9856003 * n) % 360;
    const lambda = L + 1.915 * Math.sin(toRadians(g)) + 0.02 * Math.sin(toRadians(2 * g));
    return lambda % 360;
}

// Helper to convert degrees to radians
function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

// Convert Gregorian date to Bengali solar date
function convertToBengaliDate(gregorianDate) {
    const jd = julianDay(gregorianDate.getFullYear(), gregorianDate.getMonth() + 1, gregorianDate.getDate());
    const longitude = sunLongitude(jd);

    const bengaliMonth = Math.floor(longitude / 30); // Determine the current Bengali month
    const monthStartLongitude = bengaliMonth * 30;
    const dayInMonth = Math.floor((longitude - monthStartLongitude) * (365.25 / 360));

    const bengaliMonthName = bengaliMonths[bengaliMonth];
    const bengaliYear = gregorianDate.getFullYear() - 593 + (bengaliMonth === 0 ? 1 : 0);

    return `${dayInMonth + 1} ${bengaliMonthName}, ${bengaliYear}`;
}

// Render calendar for the given year and month
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
                cell.innerHTML = ''; // Empty cell
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

// Display detailed modal on date click
function showDetails(date) {
    const moonPhase = getMoonPhase(date);
    const moonPhaseName = getMoonPhaseName(moonPhase);
    const tideTimes = getTideTimes(date);
    const tithi = getTithi(date);
    const nakshatra = getNakshatra(date);

    const modal = document.getElementById('modal');
    const modalDate = document.getElementById('modalDate');
    const modalDetails = document.getElementById('modalDetails');

    modalDate.textContent = `Details for ${date.toDateString()}`;
    modalDetails.innerHTML = `
        <strong>Moon Phase:</strong> ${moonPhaseName}<br>
        <strong>Tithi:</strong> ${tithi}<br>
        <strong>Nakshatra:</strong> ${nakshatra}<br>
        <strong>High Tides:</strong> ${tideTimes.highTides.join(', ')}<br>
        <strong>Low Tides:</strong> ${tideTimes.lowTides.join(', ')}
    `;

    modal.classList.remove('hidden');
}

// Get month name based on the selected language
function getMonthName(month, language) {
    const englishMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return language === 'en' ? englishMonths[month] : bengaliMonths[month];
}

// Event listener for language switcher
languageSwitcher.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    renderCalendar(new Date().getFullYear(), new Date().getMonth());
});

// Initialize the calendar with the current month
const today = new Date();
renderCalendar(today.getFullYear(), today.getMonth());

document.getElementById('prevMonth').addEventListener('click', () => {
    let month = today.getMonth() - 1;
    let year = today.getFullYear();
    if (month < 0) {
        month = 11;
        year--;
    }
    renderCalendar(year, month);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    if (month > 11) {
        month = 0;
        year++;
    }
    renderCalendar(year, month);
});
