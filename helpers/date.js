exports.dateToString = date => {
    const simpleDate = new Date(date);
    var dateString =
        simpleDate.getUTCFullYear() + "/" +
        ("0" + (simpleDate.getUTCMonth() + 1)).slice(-2) + "/" +
        ("0" + simpleDate.getUTCDate()).slice(-2) + " " +
        ("0" + simpleDate.getUTCHours()).slice(-2) + ":" +
        ("0" + simpleDate.getUTCMinutes()).slice(-2) + ":" +
        ("0" + simpleDate.getUTCSeconds()).slice(-2);
    return dateString;
};