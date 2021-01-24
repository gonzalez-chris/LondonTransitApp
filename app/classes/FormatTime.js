// This class exports a method that is used to convert bus times from
// seconds remaining or seconds since midnight into a nicely formatted string
// i.e. Input: 60 seconds & any number of seconds since midnight
//      Output: "1 min"
//      
//      Input: 3600+ seconds & 54900 seconds since midnight
//      Output: "3:15 pm"


// Takes in 's' number of seconds since midnight
// Returns the time as a string
function SecondsToClockTime(s) {
    s = s % 86400

    let hours = Math.floor(s / 3600)
    let minutes = Math.floor((s % 3600) / 60)

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (hours < 1) {
        hours = 12
    }

    if (hours > 12) {
        hours = hours - 12;
        return hours + ":" + minutes + " p.m."
    } else {
        return hours + ":" + minutes + " a.m."
    }
}


// Takes in 's' seconds remaining and 'backup' seconds after midnight
// If s < 3600, convert to minutes and return as "00 min"
// Else, returns SecondsToClockTime (backup)
function FormatSeconds(s, backup) {
    if (s < 0) {
        return "Now"
    } else if (s < 45) {
        return "<1 min"
    } else if (s < 3600) {
        // Round seconds such that 90 seconds returns 1 min, 91-150 returns 2 min, ...
        return ((Math.floor((s + 29.5) / 60)).toString() + " min")
    } else {
        return SecondsToClockTime(backup)
    }
}

const FormatTime = FormatSeconds;


export { FormatTime }