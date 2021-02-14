import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Button } from 'react-native';
import { GetAddressMatcherResults } from "../classes/RealTimeLondonTransit";
import { colors } from "../classes/AppColors";
import MapView from 'react-native-maps';

// Paths to image assets
const searchIconPath = "../assets/searchicon.png"
const chevronRightPath = "../assets/chevronright.png"

function Map(props) {
    navigator.geolocation.getCurrentPosition(

    )
    return (
        <View style={styles.stopsView}>
            <MapView
                style={styles.map}
                region={{
                    latitude: 42.98472,
                    longitude: -81.24527,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
            </MapView>
        </View>
    );
}


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


function FullMap(props) {

}


// The screen
function SearchForBusStop({ route, navigation }) {
    const searchString = useRef("");  // the string that is in the TextInput
    const textInput = useRef(null);
    const [results, setResults] = useState([]);  // return value of API call
    const [focused, setFocused] = useState(false);  // If the user is currently searching


    // On text change of the search bar, update searchString and make an API call
    // after 500 milliseconds (same as London Transit website)
    const changeText = (text) => {
        searchString.current = text;

        if (text.length <= 0) {
            setResults([])
        }

        setTimeout(async () => {
            if (text == searchString.current) {
                // Text here has been the same for the number of milliseconds
                // in setTimeout (do not go below 500)

                const result = await GetAddressMatcherResults(text);
                setResults([...result["results"]].filter((r) => (r.objectType === "t4BusStop")).slice(0, 10));
            }
        }, 500)
    }

    // On text input focus (search bar pressed)
    const focus = () => {
        setFocused(true)
    }

    // On touchable opacity press (cancel button)
    const press = () => {
        textInput.current.blur()
        textInput.current.clear()
        searchString.current = ""
        setResults([])
    }

    return (
        <SafeAreaView style={styles.safeView}>
            <View style={styles.headerView}>
                <View style={styles.headerContentView}>
                    <View style={styles.textInputView}>
                        <Image
                            style={styles.searchIcon}
                            source={require(searchIconPath)}
                        />

                        <View style={{ height: "100%", width: 14, }}>

                        </View>

                        <TextInput
                            style={styles.textInput}
                            returnKeyType={"search"}
                            placeholder={"Search Stop ID or Name"}
                            placeholderTextColor={colors.gray4}
                            onChangeText={changeText}
                            clearButtonMode="while-editing"
                            onFocus={focus}
                            onEndEditing={() => setFocused(false)}
                            ref={textInput}
                        />
                    </View>
                    {focused &&
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={press}
                        >
                            <Text style={styles.cancelButtonText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>

            <ScrollView style={styles.stopsView}>
                {results.map((r) => {
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
                    {(results.length <= 0 && searchString.current.length >= 1) ? "No matches" : ""}
                </Text>
            </ScrollView>

            {/* <Map /> */}
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
        height: 55,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    headerContentView: {
        width: "90%",
        height: "100%",
        flexDirection: "row",
        // backgroundColor: "blue",
        alignItems: "center",
    },
    textInput: {
        backgroundColor: "transparent",
        // width: "85%",
        flex: 1,
        fontSize: 15,
        color: colors.black,
    },
    textInputView: {
        backgroundColor: colors.white,
        // width: "100%",
        flex: 1,
        height: "60%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        flexDirection: "row",
    },
    cancelButton: {
        alignItems: "flex-end",
        // width: "15%",
        // left: "5%",
        // backgroundColor: "red",
        marginLeft: "2.5%",
    },
    cancelButtonText: {
        fontSize: 15,
        color: colors.white,
        // marginLeft: 20,
        // left: 20,
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
        paddingRight: 18,
        left: 9,
    },
    chevronRight: {
        position: "absolute",
        right: 0,
        opacity: 1 / 7,
    },
    stopIdText: {
        fontSize: 22,
        color: colors.black,
        // fontWeight: "500",
    },
    stopNameText: {
        fontSize: 15,
        width: "90%",
    },
    noResultsText: {
        fontSize: 15,
        position: "absolute",
        top: 240,
        margin: "auto",
        alignSelf: "center",
        color: colors.gray2,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    }
});


export default SearchForBusStop;