const apiKey = `14951c93f3d11e8ac8bed96dd90e8bc7`; // replace with your OpenWeatherMap API key

const searchBox = document.querySelector('.search-box');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const locationEl = document.getElementById('location');
const temperatureEl = document.getElementById('temperature');
const iconEl = document.getElementById('icon');
const descriptionEl = document.getElementById('description');
const currentTime = document.getElementById('current-time');
const date = document.getElementById('date');
const day = document.getElementById('day');
const month = document.getElementById('month');
const year = document.getElementById('year');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

searchBtn.addEventListener('click', () => {
  const searchValue = searchInput.value;
  if (searchValue) {
    getWeatherData(searchValue);
  }
});


async function getWeatherData(city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    console.log(data);

    locationEl.textContent = `${data.name}, ${data.sys.country}`;
    temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
    iconEl.innerHTML = `<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">`;
    descriptionEl.textContent = data.weather[0].description;
  } catch (error) {
    console.log(error);
  }
}
async function getWeatherData(city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    console.log(data);

    locationEl.textContent = `${data.name}, ${data.sys.country}`;
    temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
    iconEl.innerHTML = `<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">`;
    descriptionEl.textContent = data.weather[0].description;

    // add a class to the search bar to move it to the top of the page
    searchBox.classList.add('search-top');
  } catch (error) {
    console.log(error);
  }
}


// clock settings
function updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const currentTime = `${hours}:${minutes}:${seconds}`;
    document.getElementById("current-time").textContent = currentTime;
}
  
updateCurrentTime(); // set initial value
setInterval(updateCurrentTime, 1000); // update every second

function updateCurrentDate() {
    const now = new Date();
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const currentDate = `${day}, ${date}/${month}/${year}`;
    document.getElementById("date").textContent = currentDate;
}

updateCurrentDate(); // set initial value
setInterval(updateCurrentDate, 1000); // update every second
