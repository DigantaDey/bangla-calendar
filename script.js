import { getMoonPhase, getMoonPhaseName } from './assets/moonphase.js';
import { getTideTimes } from './assets/tides.js';
import { getTithi, getNakshatra } from './assets/tithi_nakshatra.js';

const bengaliMonths = [
    "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ",
    "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ",
    "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
];

const tithiNames = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
    "Purnima", "Amavasya"
];

const nakshatraNames = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
    "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
    "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
    "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const calendarBody = document.getElementById('calendarBody');
const monthYearDisplay = document.getElementById('monthYear');
const languageSwitcher = document.getElementById('languageSwitcher');
let currentLanguage = 'en'; // Default language: English

// Calculate Julian Day to determine solar transit
function julianDay(year, month, day) {
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Calculate sun's longitude for accurate Mesh Sankranti calculation
function sunLongitude(jd) {
    const n = jd - 2451545.0; // Days since J2000.0 epoch
    const L = (280.460 + 0.9856474 * n) % 360; // Mean longitude
    const g = (357.528 + 0.9856003 * n) % 360; // Mean anomaly
    const lambda = L + 1.915 * Math.sin(toRadians(g)) + 0.02 * Math.sin(toRadians(2 * g));
    return lambda % 360;
}

// Helper function to convert degrees to radians
function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

// Determine Poila Boishakh (Bengali New Year) date dynamically
function getPoilaBoishakh(year) {
    let jdApril14 = julianDay(year, 4, 14); // April 14 Julian Day
    let jdApril15 = julianDay(year, 4, 15); // April 15 Julian Day

    const longitudeApril14 = sunLongitude(jdApril14);
    const longitudeApril15 = sunLongitude(jdApril15);

    // If the sun enters Aries (0°) on April 15, New Year is on April 15
    if (Math.floor(longitudeApril15 / 30) === 0) {
        return new Date(year, 3, 15); // April 15
    }
    return new Date(year, 3, 14); // April 14
}

// Check if the date is today
function isToday(date) {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

// Convert Gregorian date to Bengali solar date
function convertToBengaliDate(gregorianDate) {
    const poilaBoishakh = getPoilaBoishakh(gregorianDate.getFullYear());
    let bengaliYear = gregorianDate.getFullYear() - 593;

    if (gregorianDate < poilaBoishakh) {
        bengaliYear -= 1;
    }

    const daysSinceBoishakh = Math.floor((gregorianDate - poilaBoishakh) / (1000 * 60 * 60 * 24));
    const monthIndex = Math.floor(daysSinceBoishakh / 30) % 12;
    const bengaliDay = (daysSinceBoishakh % 30) + 1;

    return {
        day: bengaliDay,
        month: bengaliMonths[monthIndex],
        year: bengaliYear
    };
}

// Render the calendar for the given year and month
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
                const { day, month: bengaliMonth, year: bengaliYear } = convertToBengaliDate(currentDate);

                cell.innerHTML = `
                    <div>${date}</div>
                    <div>${day} ${bengaliMonth}, ${bengaliYear}</div>
                `;

                if (isToday(currentDate)) {
                    cell.classList.add('highlight'); // Highlight today's date
                }

                cell.addEventListener('click', () => showDetails(currentDate));
                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}

// Show detailed information for the selected date
function showDetails(date) {
    const moonPhase = getMoonPhase(date);
    const moonPhaseName = getMoonPhaseName(moonPhase);
    const tideTimes = getTideTimes(date);
    const tithi = tithiNames[getTithi(date) - 1];
    const nakshatra = nakshatraNames[getNakshatra(date) - 1];

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

// Get month name based on selected language
function getMonthName(month, language) {
    const englishMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return language === 'en' ? englishMonths[month] : bengaliMonths[month];
}

// Handle language switch
languageSwitcher.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    renderCalendar(new Date().getFullYear(), new Date().getMonth());
});

// Initialize calendar with the current month
const today = new Date();
renderCalendar(today.getFullYear(), today.getMonth());
