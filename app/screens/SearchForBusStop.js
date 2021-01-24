import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { GetAddressMatcherResults } from "../classes/RealTimeLondonTransit";
import { colors } from "../classes/AppColors"

// Paths to image assets
const searchIconPath = "../assets/searchicon.png"
const chevronRightPath = "../assets/chevronright.png"


// This component represents one bus stop in a list of search results
function BusStop(props) {
    // Navigate to "LiveBusTimes" when a stop is pressed
    const pressButton = () => {
        props["navigation"].navigate("LiveBusTimes", {
            objectId: props["objectId"],
            stopId: props["stopId"],
            stopName: props["stopName"],
        })
    }

    return (
        <View style={styles.stopView}>
            <TouchableOpacity onPress={pressButton}>
                <View style={styles.touchableView}>
                    <Text style={styles.stopIdText}>
                        {props.stopId}
                    </Text>

                    <Text style={styles.stopNameText}>
                        {props.stopName}
                    </Text>

                    <Image
                        source={require(chevronRightPath)}
                        style={styles.chevronRight}
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
}


// The screen
function SearchForBusStop({ route, navigation }) {
    const searchString = useRef("");  // the string that is in the TextInput
    const [results, setResults] = useState([]);  // return value of API call

    // On text change of the search bar, update searchString and make an API call
    // after 500 milliseconds (same as London Transit website)
    const changeText = (text) => {
        searchString.current = text;

        setTimeout(async () => {
            if (text == searchString.current) {
                // Text here has been the same for the nunber of milliseconds
                // in setTimeout (do not go below 500)

                const result = await GetAddressMatcherResults(text);
                setResults([...result["results"]].slice(0, 10));
            }
        }, 500)
    }

    return (
        <SafeAreaView style={styles.safeView}>
            <View style={styles.headerView}>
                <View style={styles.textInputView}>
                    <Image
                        style={styles.searchIcon}
                        source={require(searchIconPath)}
                    />

                    <View style={{ height: "100%", width: "2.5%", }}>

                    </View>

                    <TextInput
                        style={styles.textInput}
                        returnKeyType={"search"}
                        placeholder={"Search Stop ID or Name"}
                        placeholderTextColor={colors.gray4}
                        onChangeText={changeText}
                        clearButtonMode="while-editing"
                    />
                </View>
            </View>

            <ScrollView style={styles.stopsView}>
                {results.filter((r) => {
                    return (r.objectType === "t4BusStop")
                }).map((r) => {
                    return (
                        <BusStop
                            key={r["objectId"]}

                            stopId={r["objectIdStr"]}
                            stopName={r.siteName}
                            objectId={r["objectId"]}
                            navigation={navigation}
                        />
                    );
                })}

                <Text style={{ ...styles.noResultsText, }}>
                    {(results.length <= 0 && searchString.current.length > 1) ? "No matches" : ""}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        width: "100%",
        backgroundColor: colors.green1,
    },
    stopsView: {
        backgroundColor: colors.gray6,
        width: "100%",
        flex: 1,
    },
    headerView: {
        backgroundColor: colors.green1,
        width: "100%",
        height: 48,
        alignItems: "center",
        justifyContent: "center",
    },
    textInput: {
        backgroundColor: "transparent",
        width: "85%",
        fontSize: 15,
        color: colors.black,
    },
    textInputView: {
        backgroundColor: colors.white,
        width: "75%",
        height: "75%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        flexDirection: "row",
    },
    stopView: {
        backgroundColor: "transparent",
        width: "95%",
        height: 96,
        borderBottomWidth: 1,
        borderColor: colors.gray4,
        alignSelf: "flex-end",
        justifyContent: "center",
    },
    touchableView: {
        height: "100%",
        justifyContent: "center",
    },
    searchIcon: {
        width: 18,
        height: 18,
        opacity: 1 / 7,
    },
    chevronRight: {
        position: "absolute",
        right: 0,
        opacity: 1 / 7,
    },
    stopIdText: {
        fontSize: 22,
        color: colors.black,
    },
    stopNameText: {
        fontSize: 15,
    },

    noResultsText: {
        fontSize: 15,
        position: "absolute",
        top: 240,
        margin: "auto",
        alignSelf: "center",
        color: colors.gray2,
    }
});


export default SearchForBusStop;