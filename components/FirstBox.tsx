import { API_KEY, BASE_URL } from "@env";
import React, { useState } from "react";
import {TextInput, View, StyleSheet, ImageBackground, Image, FlatList, Text, TouchableOpacity } from "react-native";
import { Search } from "../interfaces/search";

const FirstBox = () => {

    const searchBackground = require("../assets/searchBackground2.jpg")
    const appIconImage = require("../assets/weather.png");
    const [searchData, setSearchData] = useState<Search[] | null>(null)

    const onTextEntry = async (text: string) => {
try{
const res = await fetch(`${BASE_URL}/search.json?key=${API_KEY}&q=${text}`)

if(!res.ok){
    throw new Error("Server error")
}

const jsonData = await res.json();
setSearchData(jsonData)

}  catch(error) {
        console.log("Search error: " + error)
}
    }

    const renderItem = ({ item }: { item: Search}) => (
<TouchableOpacity style={styles.item}>
    <Text style={styles.itemName}>{item.name}, {item.region}</Text>
    <Text style={styles.itemCountry}>{item.country}</Text>
</TouchableOpacity>
    )
       

          
       
    

    return(
        <View style={styles.searchContainer}>
        <ImageBackground source={searchBackground} resizeMode="stretch" style={styles.searchBackground}>
        <Image source={appIconImage} style={styles.appIcon}/>
    
            <TextInput placeholder="city, code" placeholderTextColor="#fff" style={styles.searchInput} onChangeText={(text) => onTextEntry(text)}/>
        </ImageBackground>
        {/* <FlatList data={searchData as Search[]} renderItem={renderItem} contentContainerStyle={styles.list} nestedScrollEnabled/> */}
    </View>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        width: '100%',
        paddingHorizontal: 10,
    },
    searchBackground: {
        flex: 1,
        height: 130,
        opacity: 0.9,
        justifyContent: 'center',
borderRadius: 40,

overflow: "hidden",

    },
    appIcon: {

        width: "100%",
        height: 60,
        resizeMode: "contain",
    },
searchInput: {
margin: 10,
marginBottom: 15,
fontSize: 20,
padding: 15,
borderBottomWidth: 1,
borderColor: "#fff",
},
list: {
    width: "100%",
    height: 200,
    backgroundColor: "#fff",
},
item: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: "100%",
    margin: 10,
    borderBottomWidth: 1,
    flexWrap: 'wrap',
},
itemName: {
    fontSize: 24,

},
itemCountry: {
fontSize: 20,
fontWeight: '500',
}
})

export default FirstBox;