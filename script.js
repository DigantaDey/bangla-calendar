import { 
    getMoonPhase, 
    getMoonPhaseName 
} from './assets/moonphase.js';
import { 
    getTideTimes 
} from './assets/tides.js';
import { 
    getTithiName, 
    getNakshatraName 
} from './assets/tithi_nakshatra.js';

const calendarBody = document.getElementById('calendarBody');
const monthYearDisplay = document.getElementById('monthYear');
const languageSwitcher = document.getElementById('languageSwitcher');
let currentLanguage = 'en'; // Default to English

const englishMonthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const bengaliLabels = {
    previous: "পূর্ববর্তী",
    next: "পরবর্তী",
    months: [
        "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল",
        "মে", "জুন", "জুলাই", "আগস্ট",
        "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ]
};

const bengaliMonths = [
    "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ",
    "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ",
    "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
];

// Calculate Julian Day for astronomical calculations
function julianDay(year, month, day) {
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Dynamically calculate Poila Boishakh (New Year) date for the year
function getPoilaBoishakh(year) {
    const jdApril14 = julianDay(year, 4, 14);
    const jdApril15 = julianDay(year, 4, 15);
    const longitudeApril14 = jdApril14 % 360;
    const longitudeApril15 = jdApril15 % 360;

    return Math.floor(longitudeApril15 / 30) === 0
        ? new Date(year, 3, 15)
        : new Date(year, 3, 14);
}

// Highlight today’s date
function isToday(date) {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

// Convert Gregorian date to Bengali calendar date
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

// Render the calendar for the selected year and month
function renderCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    calendarBody.innerHTML = ''; // Clear previous entries

    monthYearDisplay.textContent = `${getMonthName(month)} ${year}`;

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
                const { day, month: bengaliMonth, year: bengaliYear } = convertToBengaliDate(currentDate);

                cell.innerHTML = `
                    <div>${date}</div>
                    <div>${day} ${bengaliMonth}, ${bengaliYear}</div>
                `;

                if (isToday(currentDate)) {
                    cell.classList.add('highlight'); // Highlight today’s date
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
    const tithiName = getTithiName(date) || "N/A";
    const nakshatraName = getNakshatraName(date) || "N/A";

    const modal = document.getElementById('modal');
    const modalDate = document.getElementById('modalDate');
    const modalDetails = document.getElementById('modalDetails');

    modalDate.textContent = `Details for ${date.toDateString()}`;
    modalDetails.innerHTML = `
        <strong>Moon Phase:</strong> ${moonPhaseName}<br>
        <strong>Tithi:</strong> ${tithiName}<br>
        <strong>Nakshatra:</strong> ${nakshatraName}<br>
        <strong>High Tides:</strong> ${tideTimes.highTides.join(', ')}<br>
        <strong>Low Tides:</strong> ${tideTimes.lowTides.join(', ')}
    `;

    modal.classList.remove('hidden');
}

// Get month name based on current language
function getMonthName(month) {
    return currentLanguage === 'en'
        ? englishMonthNames[month]
        : bengaliLabels.months[month];
}

// Handle language switch event
languageSwitcher.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    renderCalendar(new Date().getFullYear(), new Date().getMonth());
});

// Initialize the calendar with the current month
const today = new Date();
renderCalendar(today.getFullYear(), today.getMonth());

// Event listeners for navigation buttons
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
