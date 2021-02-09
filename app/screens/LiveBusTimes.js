import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from "../classes/AppColors"
import { GetBusTimeResults } from "../classes/RealTimeLondonTransit";
import { FormatTime } from "../classes/FormatTime"


// This component represents one bus route that will arrive at the stop
function BusTime(props) {
    return (
        <View style={styles.timeView}>
            <Text style={styles.routeText}>
                {props.route}
            </Text>
            <Text style={styles.routeDirectionText}>
                {props.direction.toUpperCase()}
            </Text>
            <Text style={styles.timeText}>
                {FormatTime(props.realTimeSPC, props.realTime)}
            </Text>
        </View>
    );
}


// The screen
function LiveBusTimes({ route, navigation }) {
    const [stopTimes, setStopTimes] = useState([]);  // stopTimes = array of StopTimesOutput
    const refreshTimer = useRef();  // the active setInterval method

    useEffect(() => {
        (async () => {

            const results = await GetBusTimeResults(route.params["objectId"])
            const array = results["StopTimesOutput"]
            const newArray = [...array]

            setStopTimes(newArray);

            // setInterval at 10 seconds (same as London Transit website)
            refreshTimer.current = setInterval(async () => {

                const results = await GetBusTimeResults(route.params["objectId"])
                const array = results["StopTimesOutput"]
                const newArray = [...array]

                setStopTimes(newArray);
            }, 10000)
        })();

        return (() => {
            // stop the setInterval on unmount
            clearInterval(refreshTimer.current)
        });
    }, [route.params["objectId"]])

    return (
        <SafeAreaView style={styles.safeView}>
            <View style={styles.header2View}>
                <Text style={styles.header2Text}>
                    {route.params["stopName"]}
                </Text>
            </View>

            <View style={styles.liveBusTimesView}>
                {
                    stopTimes.sort((a, b) => {
                        const aSPC = a["RealTimeSPC"] || a["ETimeSPC"]
                        const bSPC = b["RealTimeSPC"] || b["ETimeSPC"]

                        return (aSPC > bSPC)
                    }).slice(0, 6).map((r) => {
                        return (
                            <BusTime
                                key={r["TripId"]}

                                route={r["LineAbbr"]}
                                realTimeSPC={r["RealTimeSPC"] || r["ETimeSPC"]}
                                realTime={r["RealTime"] || r["ETime"]}
                                direction={r["DirectionName"]}
                            />
                        );
                    })
                }

                <Text style={{ ...styles.noStopsText, }}>
                    {stopTimes.length <= 0 ? "No stop times were found" : ""}
                </Text>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        width: "100%",
        backgroundColor: colors.green1,
    },
    headerView: {
        backgroundColor: colors.green1,
        width: "100%",
        height: 48,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTextView: {
        backgroundColor: "transparent",
        width: "75%",
        height: "75%",
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: {
        backgroundColor: "transparent",
        color: colors.white,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18,
    },
    liveBusTimesView: {
        backgroundColor: colors.gray6,
        width: "100%",
        flex: 1,
    },
    header2View: {
        backgroundColor: colors.green2,
        width: "100%",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    header2Text: {
        color: colors.white,
        textAlign: "center",
        fontSize: 15,
    },
    timeView: {
        backgroundColor: "transparent",
        width: "95%",
        height: 80,
        borderBottomWidth: 1,
        borderColor: colors.gray4,
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
    },
    routeText: {
        fontSize: 40,
        color: colors.green2,
        fontWeight: "600",
    },
    routeDirectionText: {
        fontSize: 12,
        position: "absolute",
        fontWeight: "600",
        color: colors.gray2,
        bottom: "5%",
    },
    timeText: {
        position: "absolute",
        right: "5%",
        fontSize: 20,
        color: colors.black,
    },

    noStopsText: {
        fontSize: 15,
        position: "absolute",
        top: 240,
        margin: "auto",
        alignSelf: "center",
        color: colors.gray2,
    }
});


export default LiveBusTimes;