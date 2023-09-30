export function CalculateMonthPeriod() {
    let currentDate = new Date();

    let start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0);
    let end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

    return [start, end];
}
