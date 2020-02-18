const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value h2");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

const weather = {
  temperature: {
    unit: "celcius"
  }
};

const KELVIN = 273;
const key = "82005d27a116c2880c8f0fcb866998a0";

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeather(latitude, longitude);
}

function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message}</p>`;
}

function getWeather(latitude, longitude) {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  fetch(api)
    .then(response => response.json())
    .then(responseData => {
        console.log(responseData);
      weather.temperature.value = Math.floor(responseData.main.temp - KELVIN);
      weather.description = responseData.weather[0].description;
      weather.iconId = responseData.weather[0].icon;
      weather.city = responseData.name;
      weather.country = responseData.sys.country;
    })
    .then(() => displayWeather());
}

function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" />`;
  tempElement.innerHTML = `${weather.temperature.value}˚<span>C</span>`;
  descElement.innerHTML =  weather.description;
  locationElement.innerHTML = `${weather.city} ${weather.country}`;
}

function celsiusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32;
}

tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    if(weather.temperature.unit == "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);   
        fahrenheit = Math.floor(fahrenheit);
        tempElement.innerHTML = `${fahrenheit}˚<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
     }else {
        tempElement.innerHTML = `${weather.temperature.value}˚<span>C</span>`;
        weather.temperature.unit = "celsius";
     }
})