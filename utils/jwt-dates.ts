const jwtDates = {
    dateToJWTTimestamp: (date: Date) => Math.floor(date.getTime() / 1000),
    now: () => jwtDates.dateToJWTTimestamp(new Date()),
};
export default jwtDates;
