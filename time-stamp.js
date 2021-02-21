function timeStamp() {

    const ts = Date.now();

    const date_ob = new Date(ts);
    // current year
    const year = date_ob.getFullYear();
    // current month
    const month = (`0${date_ob.getMonth() + 1}`).slice(-2);
    // adjust 0 before single digit date
    const date = (`0${date_ob.getDate()}`).slice(-2);
    // current hours
    const hours = (`0${date_ob.getHours()}`).slice(-2);
    // current minutes
    const minutes = (`0${date_ob.getMinutes()}`).slice(-2);
    // current seconds
    const seconds = (`0${date_ob.getSeconds()}`).slice(-2);
    // current milliseconds
    const milliseconds = (`00${date_ob.getMilliseconds()}`).slice(-3);

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return { 
            "formattedDatetime": `${year}-${month}-${date} ${hours}:${minutes}:${seconds}:${milliseconds}`, 
            "timestampInMs": ts, 
            "timestampInSecs": Math.floor(ts/1000),
            "timestampInMins": Math.floor((ts/1000)/60)
        }
}

module.exports = timeStamp