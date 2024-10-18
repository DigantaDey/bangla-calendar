// tides.js: Calculate approximate tide times based on lunar phases

import { getMoonPhase } from './moonphase.js';

export function getTideTimes(date) {
    const lunarDayInMinutes = 24 * 60 + 50; // A lunar day is 24 hours 50 minutes
    const moonPhase = getMoonPhase(date);

    const highTide1 = new Date(date);
    highTide1.setHours(6 + Math.floor(moonPhase * 12));

    const highTide2 = new Date(highTide1);
    highTide2.setHours(highTide1.getHours() + 12);

    const lowTide1 = new Date(highTide1);
    lowTide1.setHours(highTide1.getHours() - 6);

    const lowTide2 = new Date(highTide2);
    lowTide2.setHours(highTide2.getHours() - 6);

    return {
        highTides: [highTide1.toTimeString().slice(0, 5), highTide2.toTimeString().slice(0, 5)],
        lowTides: [lowTide1.toTimeString().slice(0, 5), lowTide2.toTimeString().slice(0, 5)]
    };
}
