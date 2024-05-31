import { API_KEY, BASE_URL } from "@env";

interface WeatherParams {
  cityName: string;
}

const forecastEndpoint = (params: WeatherParams) =>
  `${BASE_URL}/forecast.json?key=${API_KEY}&q=${params.cityName}&days=6`;
const searchEndpoint = (params: WeatherParams) =>
  `${BASE_URL}/search.json?key=${API_KEY}&q=${params.cityName}`;

const apiCall = async (endpoint: string) => {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.log("fetch error: " + error);
    return null;
  }
};

export const fetchWeatherForecast = (params: WeatherParams) => {
  return apiCall(forecastEndpoint(params));
};

export const fetchSearchList = (params: WeatherParams) => {
  return apiCall(searchEndpoint(params));
};
