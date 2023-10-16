/**
 * Returns the very first date of the day.
 */
export function dayStart(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
}

/**
 * Returns the very last date of the day.
 */
export function dayEnd(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
}

/**
 * Returns the very first date of the week.
 * note about weekFirstDay param: 0 for Sunday, 1 for Monday, etc.
 */
export function weekStart(date = new Date(), weekFirstDay) {
    const now = new Date();
    const currentDay = now.getDay();
    const difference = currentDay - weekFirstDay;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - difference);

    startOfWeek.setHours(0, 0, 0);
    return startOfWeek;
}

/**
 * Returns the very last date of the week.
 * Note about weekFirstDay param: 0 for Sunday, 1 for Monday, etc.
 */
export function weekEnd(date = new Date(), weekFirstDay) {
    const currentDay = date.getDay();
    const difference = 6 - (currentDay - weekFirstDay);

    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + difference);
    endOfWeek.setHours(23, 59, 59);
    return endOfWeek;
}

/**
 * Returns the very first date of the month.
 */
export function monthStart(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
}

/**
 * Returns the very last date of the month.
 */
export function monthEnd(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
}

/**
 * Returns the very first date of the year.
 */
export function yearStart(date = new Date()) {
    return new Date(date.getFullYear(), 0, 1, 0, 0, 0);
}

/**
 * Returns the very last date of the year.
 */
export function yearEnd(date = new Date()) {
    return new Date(date.getFullYear(), 11, 31, 23, 59, 59);
}

/**
 * Returns an array containing past `n` months
 * (objects containing short month name, it's start date and end date).
 */
export function pastNMonths(n) {
    const now = new Date();
    let months = [];

    for (let shift = -n; shift <= -1; shift++) {
        let year = now.getFullYear();
        let monthIndex = now.getMonth() + shift;

        if (monthIndex < 0) {
            monthIndex = 12 + monthIndex;
            year--;
        }
        const date = new Date(year, monthIndex);
        months.push({
            name: date.toLocaleDateString("default", { month: "short" }),
            start: monthStart(date),
            end: monthEnd(date),
        });
    }
    return months;
}
