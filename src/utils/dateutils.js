export function dayStart() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
}

export function dayEnd() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
}

// note about firstDay param: 0 for Sunday, 1 for Monday, etc.
export function weekStart(firstDay) {
    const now = new Date();
    const currentDay = now.getDay();
    const difference = currentDay - firstDay;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - difference);

    startOfWeek.setHours(0, 0, 0);
    return startOfWeek;
}

// note about firstDay param: 0 for Sunday, 1 for Monday, etc.
export function weekEnd(firstDay) {
    const today = new Date();
    const currentDay = today.getDay();
    const difference = 6 - (currentDay - firstDay);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + difference);

    endOfWeek.setHours(23, 59, 59);
    return endOfWeek;
}

export function monthStart() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
}

export function monthEnd() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
}

export function yearStart() {
    const now = new Date();
    return new Date(now.getFullYear(), 0, 1, 0, 0, 0);
}

export function yearEnd() {
    const now = new Date();
    return new Date(now.getFullYear(), 11, 31, 23, 59, 59);
}
