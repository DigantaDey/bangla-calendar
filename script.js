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

// Convert degrees to radians
function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

// Calculate the sun's ecliptic longitude for a given Julian Day
function sunLongitude(jd) {
    const n = jd - 2451545.0; // Days since J2000 epoch

    // Mean longitude of the sun (L) at the epoch, adjusted daily
    const L = (280.46646 + 0.98564736 * n) % 360;

    // Mean anomaly of the sun (g), adjusted daily
    const g = (357.52911 + 0.98560028 * n) % 360;

    // Convert degrees to radians for trigonometric functions
    const gRad = toRadians(g);

    // Calculate the true ecliptic longitude (lambda)
    const lambda = L + 1.914602 * Math.sin(gRad) + 
                         0.019993 * Math.sin(2 * gRad) + 
                         0.000289 * Math.sin(3 * gRad);

    return lambda % 360; // Return value within the range [0, 360)
}

// // Dynamically calculate Poila Boishakh (New Year) date for the year
// function getPoilaBoishakh(year) {
//     const jdApril14 = julianDay(year, 4, 14);
//     const jdApril15 = julianDay(year, 4, 15);
//     const longitudeApril14 = jdApril14 % 360;
//     const longitudeApril15 = jdApril15 % 360;

//     return Math.floor(longitudeApril15 / 30) === 0
//         ? new Date(year, 3, 15)
//         : new Date(year, 3, 14);
// }

// Highlight today’s date
function isToday(date) {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

// Calculate the Poila Boishakh (Bengali New Year) based on the solar transit into Aries

function getPoilaBoishakh(year) {
    // Julian Day calculation for April 14 and April 15
    const jdApril14 = julianDay(year, 4, 14);
    const jdApril15 = julianDay(year, 4, 15);

    // Longitude of the Sun on these days
    const longitudeApril14 = sunLongitude(jdApril14);
    const longitudeApril15 = sunLongitude(jdApril15);

    // If the sun enters Aries (0° longitude) on April 15, Poila Boishakh is April 15
    if (Math.floor(longitudeApril15 / 30) === 0) {
        return new Date(year, 3, 15); // April 15
    }

    // Otherwise, it's April 14
    return new Date(year, 3, 14); // April 14
}

// Define Bengali month lengths: Regular year and Leap year (some months can have 32 days)
const bengaliMonthLengths = {
    regular: [31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30, 30], // Baishakh to Chaitra
    leap: [31, 31, 31, 32, 30, 30, 30, 30, 30, 30, 31, 30]     // Ashwin has 32 days in leap years
};

// Function to determine if a year is a Bengali leap year
function isBengaliLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// // Convert a Gregorian date to the corresponding Bengali date
// function convertToBengaliDate(gregorianDate) {
//     const poilaBoishakh = getPoilaBoishakh(gregorianDate.getFullYear());
//     let bengaliYear = gregorianDate.getFullYear() - 593;

//     // If the Gregorian date is before Poila Boishakh, it belongs to the previous Bengali year
//     if (gregorianDate < poilaBoishakh) {
//         bengaliYear -= 1;
//     }

//     // Calculate the number of days since Poila Boishakh
//     const daysSinceBoishakh = Math.floor((gregorianDate - poilaBoishakh) / (1000 * 60 * 60 * 24));

//     // Select the correct month lengths based on whether it's a leap year
//     const monthLengths = isBengaliLeapYear(bengaliYear)
//         ? bengaliMonthLengths.leap
//         : bengaliMonthLengths.regular;

//     // Calculate the Bengali month and day
//     let monthIndex = 0;
//     let remainingDays = daysSinceBoishakh;

//     // Distribute the days across the months
//     while (remainingDays >= monthLengths[monthIndex]) {
//         remainingDays -= monthLengths[monthIndex];
//         monthIndex = (monthIndex + 1) % 12; // Wrap around to the next month
//     }

//     const bengaliDay = remainingDays + 1; // Day within the month
//     const bengaliMonth = bengaliMonths[monthIndex]; // Get the Bengali month name

//     return {
//         day: bengaliDay,
//         month: bengaliMonth,
//         year: bengaliYear
//     };
// }

// Helper to get the Julian day of the solar transit into a specific zodiac sign
function getSolarTransit(year, sign) {
    const jd = julianDay(year, 4, 14); // Start checking from April 14
    let transitDay = jd;

    // Check daily until the sun enters the desired zodiac sign (30° * sign)
    while (Math.floor(sunLongitude(transitDay) / 30) !== sign) {
        transitDay++;
    }

    return transitDay; // Return the Julian day when transit occurs
}

// Calculate dynamic month lengths based on solar transits
function calculateMonthLengths(bengaliYear) {
    const monthStartDays = [];

    // Calculate the Julian day of solar transits for each month (Baishakh to Chaitra)
    for (let i = 0; i < 12; i++) {
        monthStartDays.push(getSolarTransit(bengaliYear + 593, i));
    }

    // Calculate the length of each month in days
    const monthLengths = monthStartDays.map((start, index) => {
        const nextStart = monthStartDays[(index + 1) % 12];
        return nextStart - start;
    });

    return monthLengths;
}

// Convert Gregorian date to Bengali calendar date using dynamic month lengths
function convertToBengaliDate(gregorianDate) {
    const poilaBoishakh = getPoilaBoishakh(gregorianDate.getFullYear());
    let bengaliYear = gregorianDate.getFullYear() - 593;

    // Adjust the Bengali year if the Gregorian date is before Poila Boishakh
    if (gregorianDate < poilaBoishakh) {
        bengaliYear -= 1;
    }

    // Calculate the number of days since Poila Boishakh
    const daysSinceBoishakh = Math.floor((gregorianDate - poilaBoishakh) / (1000 * 60 * 60 * 24));

    // Calculate month lengths dynamically based on solar transits
    const monthLengths = calculateMonthLengths(bengaliYear);

    // Determine the Bengali month and day
    let monthIndex = 0;
    let remainingDays = daysSinceBoishakh;

    while (remainingDays >= monthLengths[monthIndex]) {
        remainingDays -= monthLengths[monthIndex];
        monthIndex = (monthIndex + 1) % 12;
    }

    const bengaliDay = remainingDays + 1;
    const bengaliMonth = bengaliMonths[monthIndex];

    return {
        day: bengaliDay,
        month: bengaliMonth,
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
