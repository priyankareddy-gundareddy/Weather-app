const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityName = document.getElementById("cityName");
const currentDate = document.getElementById("currentDate");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const errorMessage = document.getElementById("errorMessage");
const forecast = document.getElementById("forecast");
const hourlyForecast = document.getElementById("hourlyForecast");
const smartRecommendation = document.getElementById("smartRecommendation");
const rainChance = document.getElementById("rainChance");
const farmerTemp = document.getElementById("farmerTemp");
const farmerWind = document.getElementById("farmerWind");
const farmerHumidity = document.getElementById("farmerHumidity");
const farmerAdvice = document.getElementById("farmerAdvice");
const farmerAction = document.getElementById("farmerAction");
const farmerStatus = document.getElementById("farmerStatus");
const themeToggle = document.getElementById("themeToggle");
const unitToggle = document.getElementById("unitToggle");

let currentWeatherData = null;
let currentUnit = "C";

const weatherCodeMap = {
    0: { text: "Clear sky", icon: "☀️" },
    1: { text: "Mainly clear", icon: "🌤️" },
    2: { text: "Partly cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },
    45: { text: "Fog", icon: "🌫️" },
    48: { text: "Depositing rime fog", icon: "🌫️" },
    51: { text: "Light drizzle", icon: "🌦️" },
    53: { text: "Moderate drizzle", icon: "🌦️" },
    55: { text: "Dense drizzle", icon: "🌧️" },
    56: { text: "Freezing drizzle", icon: "🌧️" },
    57: { text: "Heavy freezing drizzle", icon: "🌧️" },
    61: { text: "Slight rain", icon: "🌦️" },
    63: { text: "Moderate rain", icon: "🌧️" },
    65: { text: "Heavy rain", icon: "🌧️" },
    66: { text: "Freezing rain", icon: "🌧️" },
    67: { text: "Heavy freezing rain", icon: "🌧️" },
    71: { text: "Slight snow", icon: "🌨️" },
    73: { text: "Moderate snow", icon: "🌨️" },
    75: { text: "Heavy snow", icon: "❄️" },
    77: { text: "Snow grains", icon: "❄️" },
    80: { text: "Slight rain showers", icon: "🌦️" },
    81: { text: "Moderate rain showers", icon: "🌧️" },
    82: { text: "Violent rain showers", icon: "⛈️" },
    85: { text: "Slight snow showers", icon: "🌨️" },
    86: { text: "Heavy snow showers", icon: "❄️" },
    95: { text: "Thunderstorm", icon: "⛈️" },
    96: { text: "Thunderstorm with hail", icon: "⛈️" },
    99: { text: "Heavy thunderstorm with hail", icon: "⛈️" }
};

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function clearError() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
}

function getWeatherInfo(code) {
    const info = weatherCodeMap[code] || { text: "Weather update", icon: "🌤️" };
    return info;
}

function celsiusToFahrenheit(value) {
    return (value * 9) / 5 + 32;
}

function convertTemperature(value) {
    return currentUnit === "C" ? value : celsiusToFahrenheit(value);
}

function formatTemperature(value) {
    return `${Math.round(convertTemperature(value))}°${currentUnit}`;
}

function getSmartRecommendation(code, temperatureC) {
    const temp = Number(temperatureC);

    if ([95, 96, 99].includes(code)) {
        return "⚠️ Thunderstorm alert: stay indoors if possible and avoid open areas.";
    }

    if ([45, 48].includes(code)) {
        return "🌫️ Foggy conditions: drive carefully and keep visibility in mind.";
    }

    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        if (temp < 10) {
            return "🌧️ Cold rain today: carry a raincoat and wear a warm layer.";
        }
        return "🌧️ Rain expected: bring an umbrella and keep a light waterproof jacket with you.";
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return "❄️ Snow or chilly showers: wear a thick coat and warm shoes.";
    }

    if (temp < 10) {
        return "🥶 Very cold outside: wear a heavy jacket, scarf, and gloves.";
    }

    if (temp >= 10 && temp < 18) {
        return "🧥 Cool day: a light jacket will be comfortable for the day.";
    }

    if (temp >= 18 && temp < 28) {
        return "😊 Pleasant weather: perfect for a walk, ride, or outdoor plans.";
    }

    if (temp >= 28 && temp < 35) {
        return "☀️ Warm day: carry water, wear sunscreen, and stay hydrated.";
    }

    return "🔥 Very hot day: avoid direct sunlight for long periods and drink plenty of water.";
}

function updateSmartRecommendation(code, temperatureC) {
    smartRecommendation.textContent = getSmartRecommendation(code, temperatureC);
}

function getFarmerAdvice(rainProbability, windSpeed, humidity, temperatureC) {
    if (rainProbability >= 70) {
        return "⚠️ High rain chance: avoid spraying pesticides and plan for extra irrigation control.";
    }

    if (windSpeed >= 25) {
        return "💨 Strong wind: avoid spraying or sensitive field work today.";
    }

    if (humidity >= 80 && rainProbability >= 40) {
        return "🌧️ Humidity is high: reduce heavy watering and monitor crop moisture carefully.";
    }

    if (temperatureC >= 25 && temperatureC <= 32 && rainProbability <= 40) {
        return "🌱 Good growing conditions: this is a suitable time for irrigation and crop monitoring.";
    }

    if (temperatureC < 10) {
        return "🥶 Cool conditions: protect crops from cold stress and delay heavy field work.";
    }

    if (temperatureC >= 18 && temperatureC <= 24) {
        return "✅ Comfortable field conditions: good for regular agriculture work and crop checks.";
    }

    return "🌾 Weather is manageable: continue normal farm planning and keep monitoring soil conditions.";
}

function updateFarmerMode(weatherData) {
    if (!weatherData || !weatherData.current || !weatherData.hourly) {
        rainChance.textContent = "--%";
        farmerTemp.textContent = "--°C";
        farmerWind.textContent = "-- km/h";
        farmerHumidity.textContent = "--%";
        farmerAdvice.textContent = "Select a location to get farming guidance.";
        farmerAction.textContent = "Irrigation planning ready";
        farmerStatus.textContent = "Good";
        farmerStatus.className = "farmer-status status-good";
        return;
    }

    const current = weatherData.current;
    const now = new Date();
    const currentHourIndex = weatherData.hourly.time.findIndex((time) => {
        const itemTime = new Date(time);
        return itemTime >= now;
    });

    const safeIndex = currentHourIndex === -1 ? 0 : currentHourIndex;
    const rainProbability = weatherData.hourly.precipitation_probability?.[safeIndex] ?? 0;

    const advice = getFarmerAdvice(
        rainProbability,
        current.wind_speed_10m,
        current.relative_humidity_2m,
        current.temperature_2m
    );

    let status = "Good";
    let statusClass = "status-good";
    let actionText = "Irrigation planning ready";

    if (rainProbability >= 70 || current.wind_speed_10m >= 25) {
        status = "Risk";
        statusClass = "status-risk";
        actionText = "Avoid spraying and field work";
    } else if (current.temperature_2m >= 18 && current.temperature_2m <= 24) {
        status = "Good";
        statusClass = "status-good";
        actionText = "Ideal conditions for field work";
    } else if (current.temperature_2m < 10 || current.relative_humidity_2m >= 80) {
        status = "Warning";
        statusClass = "status-warning";
        actionText = "Monitor crop moisture closely";
    }

    rainChance.textContent = `${Math.round(rainProbability)}%`;
    farmerTemp.textContent = formatTemperature(current.temperature_2m);
    farmerWind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    farmerHumidity.textContent = `${current.relative_humidity_2m}%`;
    farmerAdvice.textContent = advice;
    farmerAction.textContent = actionText;
    farmerStatus.textContent = status;
    farmerStatus.className = `farmer-status ${statusClass}`;
}

function updateForecast(daily) {
    forecast.innerHTML = "";

    daily.time.forEach((day, index) => {
        const code = daily.weather_code[index];
        const weatherInfo = getWeatherInfo(code);
        const dayCard = document.createElement("div");
        dayCard.className = "forecast-card";

        const dayLabel = new Date(day).toLocaleDateString("en-US", { weekday: "short" });
        const maxTemp = Math.round(convertTemperature(daily.temperature_2m_max[index]));
        const minTemp = Math.round(convertTemperature(daily.temperature_2m_min[index]));

        dayCard.innerHTML = `
            <div class="forecast-day">${dayLabel}</div>
            <div class="forecast-icon">${weatherInfo.icon}</div>
            <div class="forecast-temp">${maxTemp}° / ${minTemp}°</div>
        `;

        forecast.appendChild(dayCard);
    });
}

function updateHourlyForecast(hourly) {
    hourlyForecast.innerHTML = "";

    const now = new Date();
    const currentHourIndex = hourly.time.findIndex((time) => {
        const itemTime = new Date(time);
        return itemTime >= now;
    });

    const startIndex = currentHourIndex === -1 ? 0 : currentHourIndex;
    const timeValues = hourly.time.slice(startIndex, startIndex + 24);
    const tempValues = hourly.temperature_2m.slice(startIndex, startIndex + 24);
    const codeValues = hourly.weather_code.slice(startIndex, startIndex + 24);

    timeValues.forEach((time, index) => {
        const code = codeValues[index];
        const weatherInfo = getWeatherInfo(code);
        const card = document.createElement("div");
        card.className = "hourly-card";

        let hourLabel = new Date(time).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit"
        });

        if (index === 0) {
            hourLabel = "Now";
        }

        card.innerHTML = `
            <div class="hourly-time">${hourLabel}</div>
            <div class="hourly-icon">${weatherInfo.icon}</div>
            <div class="hourly-temp">${Math.round(convertTemperature(tempValues[index]))}°${currentUnit}</div>
        `;

        hourlyForecast.appendChild(card);
    });
}

async function getWeatherByCity(city) {
    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    clearError();

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoResponse.ok || !geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please try another name.");
        }

        const place = geoData.results[0];
        const latitude = place.latitude;
        const longitude = place.longitude;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        currentWeatherData = weatherData;
        const current = weatherData.current;
        const codeInfo = getWeatherInfo(current.weather_code);

        cityName.textContent = `${place.name}, ${place.country || ""}`.trim();
        currentDate.textContent = new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
        weatherIcon.textContent = codeInfo.icon;
        temperature.textContent = formatTemperature(current.temperature_2m);
        condition.textContent = codeInfo.text;
        humidity.textContent = `${current.relative_humidity_2m}%`;
        wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
        feelsLike.textContent = formatTemperature(current.apparent_temperature);
        updateSmartRecommendation(current.weather_code, current.temperature_2m);
        updateFarmerMode(weatherData);

        updateForecast(weatherData.daily);
        updateHourlyForecast(weatherData.hourly);
    } catch (error) {
        cityName.textContent = "City Name";
        currentDate.textContent = "--";
        weatherIcon.textContent = "☀️";
        temperature.textContent = "--°C";
        condition.textContent = "--";
        humidity.textContent = "--%";
        wind.textContent = "-- km/h";
        feelsLike.textContent = "--°C";
        forecast.innerHTML = "";
        hourlyForecast.innerHTML = "";
        currentWeatherData = null;
        updateFarmerMode(null);
        showError(error.message);
    }
}

async function getWeather() {
    const city = cityInput.value.trim();
    await getWeatherByCity(city);
}

async function getLocationName(latitude, longitude) {
    const openMeteoReverseUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`;

    try {
        const response = await fetch(openMeteoReverseUrl);
        if (response.ok) {
            const data = await response.json();
            const placeName = data?.results?.[0]?.name;
            if (placeName) {
                return placeName;
            }
        }
    } catch (error) {
        console.log("Open-Meteo reverse geocoding failed, trying Nominatim.");
    }

    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    try {
        const response = await fetch(nominatimUrl, {
            headers: {
                "Accept-Language": "en"
            }
        });

        if (!response.ok) {
            return "My Location";
        }

        const data = await response.json();
        const address = data?.address || {};

        return address.city || address.town || address.village || address.municipality || address.county || "My Location";
    } catch (error) {
        return "My Location";
    }
}

function getWeatherByLocation(latitude, longitude) {
    clearError();

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    fetch(weatherUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Weather request failed");
            }
            return response.json();
        })
        .then(async (weatherData) => {
            currentWeatherData = weatherData;
            const current = weatherData.current;
            const codeInfo = getWeatherInfo(current.weather_code);
            const locationName = await getLocationName(latitude, longitude);

            cityName.textContent = locationName;
            currentDate.textContent = new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
            weatherIcon.textContent = codeInfo.icon;
            temperature.textContent = formatTemperature(current.temperature_2m);
            condition.textContent = codeInfo.text;
            humidity.textContent = `${current.relative_humidity_2m}%`;
            wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
            feelsLike.textContent = formatTemperature(current.apparent_temperature);
            updateSmartRecommendation(current.weather_code, current.temperature_2m);
            updateFarmerMode(weatherData);

            updateForecast(weatherData.daily);
            updateHourlyForecast(weatherData.hourly);
        })
        .catch((error) => {
            cityName.textContent = "My Location";
            currentDate.textContent = "--";
            weatherIcon.textContent = "📍";
            temperature.textContent = "--°C";
            condition.textContent = "Unable to load weather";
            humidity.textContent = "--%";
            wind.textContent = "-- km/h";
            feelsLike.textContent = "--°C";
            forecast.innerHTML = "";
            hourlyForecast.innerHTML = "";
            currentWeatherData = null;
            smartRecommendation.textContent = "Search a city to get advice.";
            updateFarmerMode(null);
            showError("Unable to get your location weather. Try again or search by city.");
            console.error(error);
        });
}

searchBtn.addEventListener("click", getWeather);

locationBtn.addEventListener("click", function () {
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }

    showError("Getting your location...");

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            clearError();
            getWeatherByLocation(latitude, longitude);
        },
        function () {
            showError("Location access denied. Please allow access or search by city.");
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
});

cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

function toggleTemperatureUnit() {
    currentUnit = currentUnit === "C" ? "F" : "C";
    unitToggle.textContent = currentUnit === "C" ? "°F" : "°C";

    if (!currentWeatherData) {
        return;
    }

    const current = currentWeatherData.current;
    temperature.textContent = formatTemperature(current.temperature_2m);
    feelsLike.textContent = formatTemperature(current.apparent_temperature);
    updateSmartRecommendation(current.weather_code, current.temperature_2m);
    updateFarmerMode(currentWeatherData);
    updateForecast(currentWeatherData.daily);
    updateHourlyForecast(currentWeatherData.hourly);
}

unitToggle.addEventListener("click", toggleTemperatureUnit);

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }
});
