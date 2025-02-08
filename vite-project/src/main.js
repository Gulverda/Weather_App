const apiKey = import.meta.env.VITE_API_KEY;
const locationEl = document.getElementById('location');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const highTempEl = document.getElementById('high-temp');
const lowTempEl = document.getElementById('low-temp');
const iconEl = document.getElementById('icon');
const hourlyForecastEl = document.getElementById('hourly-forecast');
const weeklyForecastEl = document.getElementById('weekly-forecast');
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');

// Event listener for search button
searchButton.addEventListener('click', function() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert("Please enter a city name.");
    }
});

// Fetch weather data for the city
async function fetchWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        if (data.cod === "404") {
            alert("City not found. Please check the city name.");
            return;
        }

        // Update the weather information
        locationEl.textContent = `${data.name}, ${data.sys.country}`;
        temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
        descriptionEl.textContent = data.weather[0].description;
        highTempEl.textContent = `${Math.round(data.main.temp_max)}°C`;
        lowTempEl.textContent = `${Math.round(data.main.temp_min)}°C`;
        iconEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png">`;

        // Fetch hourly and weekly forecasts
        fetchHourlyForecast(data.coord.lat, data.coord.lon);
        fetchWeeklyForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Fetch hourly weather forecast
async function fetchHourlyForecast(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        hourlyForecastEl.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const hourData = data.list[i];
            const time = new Date(hourData.dt * 1000).getHours();
            const temp = Math.round(hourData.main.temp);
            const icon = hourData.weather[0].icon;

            hourlyForecastEl.innerHTML += `
                <div>
                    <p>${time}:00</p>
                    <img src="https://openweathermap.org/img/wn/${icon}.png">
                    <p>${temp}°C</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error fetching hourly forecast:", error);
    }
}

// Fetch weekly weather forecast using the correct API endpoint
async function fetchWeeklyForecast(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        weeklyForecastEl.innerHTML = '';
        data.daily.forEach((day, index) => {
            const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
            const temp = Math.round(day.temp.day);
            const icon = day.weather[0].icon;

            weeklyForecastEl.innerHTML += `
                <div class="day-forecast">
                    <p>${date}</p>
                    <img src="https://openweathermap.org/img/wn/${icon}.png">
                    <p>${temp}°C</p>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching weekly forecast:", error);
    }
}

// Get user's current location and fetch weather data for it
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            try {
                // Fetch weather data for current location using lat, lon
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
                );
                const data = await response.json();
                
                locationEl.textContent = `${data.name}, ${data.sys.country}`;
                temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
                descriptionEl.textContent = data.weather[0].description;
                highTempEl.textContent = `${Math.round(data.main.temp_max)}°C`;
                lowTempEl.textContent = `${Math.round(data.main.temp_min)}°C`;
                iconEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png">`;

                // Fetch hourly and weekly forecasts
                fetchHourlyForecast(data.coord.lat, data.coord.lon);
                fetchWeeklyForecast(data.coord.lat, data.coord.lon);
            } catch (error) {
                console.error("Error fetching weather data for current location:", error);
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Call the function to fetch weather for current location on page load
getCurrentLocationWeather();
