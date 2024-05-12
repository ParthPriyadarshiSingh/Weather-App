import React, { useEffect, useState } from "react";
import { API_KEY, BASE_URL } from '@env';
import { Weather } from "../interfaces/current";import { View, StyleSheet, Text, ImageBackground, Image, Dimensions } from "react-native";

interface Props {
    currentData: Weather | null;
}

const { width, height } = Dimensions.get('window');
const backgroundImage = require("../assets/secondBoxBackground.jpg");

const SecondBox = ({currentData} : Props) => {

    const icon = `http:${currentData?.current.condition.icon}`;

    return (
        <View style={styles.blueContainer}>
            

        <ImageBackground source={backgroundImage} resizeMode="cover" imageStyle={styles.backgroundImage}>
            <View style={styles.contentContainer}>
            <View style={styles.firstRowContainer}>
<View style={styles.dataContainer}>
<Text style={styles.valueHeading}>Temperature</Text>
<Text style={styles.valueText}>{currentData?.current.temp_c} °C</Text>
</View>
<View style={styles.dataContainer}>
<Image source={{uri: icon}} style={styles.icon}/>
<Text style={styles.cityName}>{currentData?.location.name}</Text>
<Text style={styles.regionName}>{currentData?.location.region}</Text>
<Text style={styles.countryName}>{currentData?.location.country}</Text>


</View>
<View style={styles.dataContainer}>
<Text style={styles.valueHeading}>Condition</Text>
<Text style={styles.valueText}>{currentData?.current.condition.text}</Text>
</View>
            </View>

            <View style={styles.firstRowContainer}>
                <View style={styles.dataContainer}>
                    <Text style={styles.valueHeading}>Humidity</Text>
                    <Text style={styles.valueText}>{currentData?.current.humidity} %</Text>
                </View>
                <View style={styles.dataContainer}>
                    <Text style={styles.valueHeading}>Wind Speed</Text>
                    <Text style={styles.valueText}>{currentData?.current.wind_kph} kph</Text>
                </View>
                </View>
<View style={styles.firstRowContainer}>
                <View style={styles.dataContainer}>
                    <Text style={styles.valueHeading}>Pressure</Text>
                    <Text style={styles.valueText}>{currentData?.current.pressure_mb} mb</Text>
                </View>
                <View style={styles.dataContainer}>
                    <Text style={styles.valueHeading}>Precipitation</Text>
                    <Text style={styles.valueText}>{currentData?.current.precip_mm} mm</Text>
                </View>
                </View>
            </View>
</ImageBackground>

</View>
    )
}

const styles = StyleSheet.create({
    blueContainer: {
        height: 0.6*height,
        margin: 10,
            },
backgroundImage: {
    flex: 1,
    borderRadius: 40,
    opacity: 1,

},
contentContainer: {
    paddingVertical: 20,
     height: "100%", 
     justifyContent: 'space-around',
},
icon: {
    width: 60,
    height: 60,
},
firstRowContainer:  {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: "100%",
},
dataContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
},
cityName: {
    fontSize: 26,
    color: "#fff",
},
regionName: {
    fontSize: 16,
    color: "#fff",
},
countryName: {
    fontSize: 20,
    color: "#fff",
},
valueHeading: {
    fontSize: 16,
    color: "#0b132b",
},
valueText: {
    fontSize: 24,
    color: "#FF7F50",

}
}
)

export default SecondBox;