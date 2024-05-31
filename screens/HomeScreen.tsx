import {
  View,
  StatusBar,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutRight,
  FadeOutUp,
  LightSpeedInRight,
} from "react-native-reanimated";
import React, { useCallback, useEffect, useState } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Search } from "../interfaces/search";
import { WeatherForecast } from "../interfaces/forecast";
import { debounce } from "lodash";
import { fetchSearchList, fetchWeatherForecast } from "../api/current";
import * as Progress from "react-native-progress";
import { getData, storeData } from "../utils/asyncStorage";
import * as Location from "expo-location";

const bgImage = require("../assets/appBackground.jpg");

const weatherImages = {
  "Partly cloudy": require("../assets/images/partlycloudy.png"),
  "Moderate rain": require("../assets/images/moderaterain.png"),
  "Patchy rain possible": require("../assets/images/moderaterain.png"),
  Sunny: require("../assets/images/sun.png"),
  Clear: require("../assets/images/sun.png"),
  Overcast: require("../assets/images/cloud.png"),
  Cloudy: require("../assets/images/cloud.png"),
  "Light rain": require("../assets/images/moderaterain.png"),
  "Moderate rain at times": require("../assets/images/moderaterain.png"),
  "Heavy rain": require("../assets/images/heavyrain.png"),
  "Heavy rain at times": require("../assets/images/heavyrain.png"),
  "Moderate or heavy freezing rain": require("../assets/images/heavyrain.png"),
  "Moderate or heavy rain shower": require("../assets/images/heavyrain.png"),
  "Moderate or heavy rain with thunder": require("../assets/images/heavyrain.png"),
  other: require("../assets/images/moderaterain.png"),
  Mist: require("../assets/images/moderaterain.png"),
};

const HomeScreen = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<Search[] | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    userLocationWeather();
  }, []);

  const userLocationWeather = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      fetchDefaultWeather();

      console.log("Permission denied");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    console.log(currentLocation);
    console.log(
      `${currentLocation?.coords.latitude},${currentLocation?.coords.longitude}`
    );
    fetchWeatherForecast({
      cityName: `${currentLocation?.coords.latitude},${currentLocation?.coords.longitude}`,
    }).then((data) => {
      setWeatherData(data);
      setLoading(false);
    });
  };

  const fetchDefaultWeather = async () => {
    let myCity = await getData("city");
    let cityName = "New Delhi";
    if (myCity) cityName = myCity;
    fetchWeatherForecast({
      cityName: cityName,
    }).then((data) => {
      setWeatherData(data);
      setLoading(false);
    });
  };

  const handleSearch = (value: string) => {
    if (value.length > 2) {
      fetchSearchList({ cityName: value }).then((data) => {
        setSearchData(data);
      });
    }
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const handleSearchBlur = () => {
    setSearchData([]);
    setShowSearch(false);
  };

  const handleCityPress = (location: Search) => {
    setSearchData(null);
    setShowSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: location.name,
    }).then((data) => {
      setWeatherData(data);
      setLoading(false);
      storeData("city", location.name);
    });
  };

  return (
    <View className="flex-1 relative">
      <StatusBar barStyle="light-content" />
      <Image
        blurRadius={60}
        source={bgImage}
        className="absolute w-full h-full"
      />
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Progress.CircleSnail thickness={7} size={70} color={"#0bb3b2"} />
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          {/*search section*/}
          <View style={{ height: 60 }} className="mx-4 relative z-50">
            <View className="flex-1 bg-transparent">
              {showSearch ? (
                <Animated.View
                  className="flex-1 rounded-full justify-center"
                  style={{
                    backgroundColor: showSearch
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                  }}
                  entering={FadeInRight.duration(300).withInitialValues({
                    opacity: 0,
                    transform: [{ translateX: 20 }],
                  })}
                  exiting={FadeOutRight.duration(200)}
                >
                  <TextInput
                    onChangeText={handleTextDebounce}
                    onBlur={handleSearchBlur}
                    placeholder="Search city"
                    placeholderTextColor={"lightgray"}
                    className="flex-1 p-4 mb-1 text-base text-white"
                  />
                </Animated.View>
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  setShowSearch(!showSearch);
                  if (showSearch) setSearchData([]);
                }}
                style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                className="absolute right-1 top-1 rounded-full p-3 m-1"
              >
                <Ionicons name="search" color={"#fff"} size={20} />
              </TouchableOpacity>
            </View>
            {showSearch === true &&
            searchData !== null &&
            searchData?.length > 0 ? (
              <Animated.View
                entering={FadeInUp.withInitialValues({
                  opacity: 0,
                  transform: [{ translateY: -10 }],
                })}
                exiting={FadeOutUp}
                className="absolute w-full bg-gray-300 top-16 rounded-3xl"
              >
                {searchData?.map((item, index) => {
                  let showBorder = index + 1 != searchData?.length;
                  let borderClass = showBorder
                    ? "border-b-2 border-b-gray-400"
                    : "";
                  return (
                    <TouchableOpacity
                      onPress={() => handleCityPress(item)}
                      className={
                        " flex-row items-center p-3 px-4 mb-1 " + borderClass
                      }
                      key={index}
                    >
                      <Ionicons
                        name="location-outline"
                        size={22}
                        color="#FF7F50"
                      />
                      <Text className="text-xl">
                        {item.name}, {item.region}
                      </Text>
                      <Text
                        className="absolute text-base right-5 w-20 text-center"
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      >
                        {item.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </Animated.View>
            ) : null}
          </View>
          {/* current and forecast section*/}
          <View className="mx-4 flex justify-around flex-1 mb-2">
            <View className="mx-4 justify-around items-center self-center">
              <Animated.Text
                className="text-white text-center text-4xl font-bold"
                entering={FadeInUp}
                exiting={FadeOutUp}
              >
                {weatherData?.location.name}
              </Animated.Text>
              <Animated.Text
                className="text-lg font-semibold text-gray-300"
                entering={FadeInDown}
                exiting={FadeOutDown}
              >
                {weatherData?.location.region}
              </Animated.Text>

              <Animated.Text
                className="text-lg  text-gray-300"
                entering={FadeInDown}
                exiting={FadeOutDown}
              >
                {weatherData?.location.country}
              </Animated.Text>
            </View>
            {/* weather image*/}
            <View className="flex-row justify-center">
              <Animated.Image
                className="w-52 h-52"
                //@ts-ignore
                source={weatherImages[weatherData?.current?.condition?.text]}
                entering={FadeInRight.duration(500).withInitialValues({
                  opacity: 0,
                  transform: [{ translateX: 50 }],
                })}
                exiting={FadeOutRight}
              />
            </View>
            {/*temperature*/}
            <View className="space-y-2">
              <Animated.Text
                className="text-center font-bold text-white text-6xl ml-5"
                entering={FadeInUp}
                exiting={FadeOutUp}
              >
                {weatherData?.current.temp_c} °C
              </Animated.Text>
              <Animated.Text
                className="text-center text-white text-xl tracking-widest"
                entering={FadeInDown}
                exiting={FadeOutDown}
              >
                {weatherData?.current.condition.text}
              </Animated.Text>
            </View>
            {/* other stats*/}
            <Animated.View
              className="flex-row justify-between mx-4"
              entering={FadeIn.duration(500)}
              exiting={FadeOut}
            >
              <View className="flex-row space-x-2 items-center">
                <Image
                  className="h-6 w-6"
                  source={require("../assets/icons/wind.png")}
                />
                <Text className="text-white font-semibold text-base">
                  {weatherData?.current.wind_kph}km/hr
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  className="h-6 w-6"
                  source={require("../assets/icons/drop.png")}
                />
                <Text className="text-white font-semibold text-base">
                  {weatherData?.current.humidity}%
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  className="h-6 w-6"
                  source={require("../assets/icons/sun.png")}
                />
                <Text className="text-white font-semibold text-base">
                  {weatherData?.forecast.forecastday[0].astro.sunrise}
                </Text>
              </View>
            </Animated.View>
            {/*forecast section*/}
            <View className="mb-2 space-y-3">
              <View className="flex-row items-center mx-5 space-x-2">
                <Ionicons name="calendar" size={22} color={"#fff"} />
                <Text className="text-white text-base">Daily forecast</Text>
              </View>
              <Animated.ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: 15 }}
                showsHorizontalScrollIndicator={false}
                entering={LightSpeedInRight}
              >
                {weatherData?.forecast.forecastday.map((item, index) => {
                  let date = new Date(item.date);
                  let dayName = date.toLocaleDateString("en-US", {
                    weekday: "long",
                  });
                  dayName = dayName.split(",")[0];
                  return (
                    <View
                      key={index}
                      className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                    >
                      <Image
                        className="h-11 w-11"
                        //@ts-ignore
                        source={weatherImages[item?.day?.condition?.text]}
                      />
                      <Text className="text-white">{dayName}</Text>
                      <Text className="text-white text-xl font-semibold">
                        {item?.day?.avgtemp_c}°C
                      </Text>
                    </View>
                  );
                })}
              </Animated.ScrollView>
            </View>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

export default HomeScreen;
