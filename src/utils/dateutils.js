export function CalculateMonthPeriod() {
    let currentDate = new Date();

    let start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    return [start, end];
}
