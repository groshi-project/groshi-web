export function getClosestWeekBeginning() {
    let closestWeekBeginning = new Date();
    closestWeekBeginning.setDate(
        closestWeekBeginning.getDate() - ((closestWeekBeginning.getDay() + 6) % 7) // +6 is for Monday
    );
    return closestWeekBeginning;
}
