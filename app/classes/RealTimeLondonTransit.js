// This class contains methods for accessing the London Transit Real-Time API

// Standard return for no address matches
const emptyAddressMatcherReturn = {
    resultCode: 0,
    results: [],
}

// Standard return for no bus times found OR no local bus stops
const emptyBusTimesReturn = [{
    StopTimeResult: [
        {
            Lines: [],
            StopTimes: [],
            ServiceResumeTimes: [],
            StopTimesOutput: [],
        }
    ],
}];


// Takes a search string 'inputString'
// Returns the 'result' object returned by the real-time API given inputString
// No results returned for an empty search string
// Used to implement the search autocomplete
async function GetAddressMatcherResults(inputString) {
    if (!inputString || inputString.length <= 0) {
        return emptyAddressMatcherReturn;
    }

    let data = {
        "version": "1.1",
        "method": "GetAddressMatcherResults",
        "params": { "addrString": inputString, "flags": "" }
    }

    try {
        // Make the POST call and return the response
        const response = await fetch('https://realtime.londontransit.ca/MapAddress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;',
            },
            body: JSON.stringify(data),
        });

        const data_1 = await response.json();
        return data_1.result;
    } catch (error) {
        // Return object with no matches on API error
        console.error('Fetch error:', error);
        return emptyAddressMatcherReturn;
    }
}


// Helper method that takes an OBJECT ID as 'stopId' (not exported)
// Returns the 'result' object that is returned by the real-time API given stopId
// Equivalent to 'GetAddressMatcherResults' but for a different API call
// Used to get live bus times
async function GetBusTimeResultsHelper(stopId) {
    if (!stopId || stopId < 0) {
        return emptyBusTimesReturn;
    }

    let data = {
        "version": "1.1",
        "method": "GetBusTimes",
        "params": {
            "LinesRequest": {
                "Radius": "0",
                "GetStopTimes": "1",
                "GetStopTripInfo": "1",
                "NumStopTimes": 150,
                "SuppressLinesUnloadOnly": "1",
                "Client": "MobileWeb",
                "StopId": stopId,
                "NumTimesPerLine": 5
            }
        }
    }

    try {
        // Make the POST call and return the response
        const response = await fetch('https://realtime.londontransit.ca/InfoWeb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;',
            },
            body: JSON.stringify(data),
        });

        const data_1 = await response.json();
        return data_1.result;
    } catch (error) {
        // Return object with no bus times on Fetch error
        console.error('Fetch error:', error);
        return emptyBusTimesReturn;
    }
}


/* Because the return from the InfoWeb call is full of irrelevant data,
this method simplifies the return object so that we only have to deal
with the relevant parts */
async function GetBusTimeResults(stopId) {
    const result = await GetBusTimeResultsHelper(stopId);

    if (!result[0].StopTimeResult[0]["StopTimesOutput"]) {
        result[0].StopTimeResult[0]["StopTimesOutput"] = []
    }

    return result[0].StopTimeResult[0];
}


// Helper method that takes latitude & longitude values as input
// Returns the 'result' object that is returned by the real-time API
// Used for finding nearby bus stops
async function GetLocalStopsHelper(latitude, longitude) {
    let data = {
        "version": "1.1",
        "method": "GetBusTimes",
        "params": {
            "LinesRequest": {
                "Radius": 500,
                "GetStopTimes": "0",
                "GetStopTripInfo": "1",
                "NumStopTimes": -1,
                "SuppressLinesUnloadOnly": "1",
                "Client": "MobileWeb",
                "OutputVersion": 1,
                "Lat": latitude,
                "Lon": longitude,
                "StopId": 0,
                "NumTimesPerLine": 0
            }
        }
    }

    try {
        const response = await fetch('https://realtime.londontransit.ca/InfoWeb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;',
            },
            body: JSON.stringify(data),
        });

        const data_1 = await response.json();
        return data_1.result;
    } catch (error) {
        console.error('Fetch error:', error)
        return emptyBusTimesReturn;
    }
}

/* As is the case with 'GetBusTimeResults', the InfoWeb API returns
a lot of irrelevant data, so this method filters it down to what we want
to return to the caller
*/
async function GetLocalStops(latitude, longitude) {
    const result = await GetLocalStopsHelper(latitude, longitude)
    const lines = (result[0].StopTimeResult[0]["Lines"] || [])

    const returnArray = [];

    lines.forEach(function (line) {
        let stops = line["LineStops"] || [];
        stops.forEach(function (stop) {
            if (!returnArray.some((element) => element.StopId === stop.StopId)) {
                returnArray.push(stop);
            }
        })
    })

    return returnArray;
}

export { GetAddressMatcherResults, GetBusTimeResults, GetLocalStops }