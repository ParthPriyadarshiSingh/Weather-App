import { Image, SafeAreaView, StyleSheet, Text, View, StatusBar, ScrollView, Dimensions, ImageBackground } from "react-native";
import React, { useEffect, useState } from "react";
import { API_KEY, BASE_URL } from '@env';
import { Weather } from "../interfaces/current";
import FirstBox from "../components/FirstBox";
import SecondBox from "../components/SecondBox";




const HomeScreen = () => {

    const [currentData, setCurrentData] = useState<Weather | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      
    
        const fetchCurrentData = async () => {
            try {
                const res = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=bangalore`); // Pass the signal to fetch
                if (!res.ok) {
                    throw new Error("Server error");
                }
                const jsonData = await res.json();
                setCurrentData(jsonData);
                console.log(jsonData)
                setIsLoading(false);
            } catch (error) {
                console.log("Error: " + error);
            }
        };
    
        // fetchCurrentData();
// console.log(data);
    }, []);
    
    return(
        <ScrollView style={styles.viewContainer}>
                <StatusBar barStyle="light-content"/>
            <SafeAreaView style={styles.safeViewContainer}>
      <FirstBox/>
           <SecondBox currentData={currentData}/>

</SafeAreaView>
</ScrollView>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: "#212529",
    },
    safeViewContainer: {
        flex: 1,
            },
          
   
  
})

export default HomeScreen;