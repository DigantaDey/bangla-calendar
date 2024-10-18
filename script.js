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
let currentLanguage = 'en'; // Default language

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

// Dynamically display the correct month and year
function getMonthName(month) {
    if (currentLanguage === 'en') {
        return englishMonthNames[month];
    } else {
        return bengaliLabels.months[month];
    }
}

// Highlight today's date
function isToday(date) {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
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
                cell.innerHTML = `<div>${date}</div>`;
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

// Handle language switching for labels (like "Previous" and "Next")
function updateLabels() {
    const prevButton = document.getElementById('prevMonth');
    const nextButton = document.getElementById('nextMonth');

    if (currentLanguage === 'bn') {
        prevButton.textContent = bengaliLabels.previous;
        nextButton.textContent = bengaliLabels.next;
    } else {
        prevButton.textContent = "Previous";
        nextButton.textContent = "Next";
    }
}

// Handle language switch
languageSwitcher.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    updateLabels();
    renderCalendar(new Date().getFullYear(), new Date().getMonth());
});

// Initialize the calendar with the current month
const today = new Date();
renderCalendar(today.getFullYear(), today.getMonth());
updateLabels();

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
