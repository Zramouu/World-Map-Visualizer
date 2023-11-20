//import axios from 'axios';

const API_KEY = "f983725c3821cb6135ab5c138b8597db";
export async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  
  const response = await fetch(url);
  if (!response.ok) {
      throw new Error('Network response was not ok'); // Handle error response from the server
  }
  const data = await response.json();

  return data;
}


