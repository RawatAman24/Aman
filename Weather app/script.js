const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
const apiBase = "https://api.openweathermap.org/data/2.5/weather";

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultEl = document.getElementById("weatherResult");

  if (!city) {
    resultEl.innerHTML = '<p class="error">Please enter a city name.</p>';
    return;
  }

  if (apiKey === "YOUR_OPENWEATHERMAP_API_KEY") {
    resultEl.innerHTML = `
      <p class="error">
        Replace <code>YOUR_OPENWEATHERMAP_API_KEY</code> in <code>script.js</code> with a valid OpenWeatherMap API key.
      </p>`;
    return;
  }

  resultEl.innerHTML = '<p class="loading">Loading weather...</p>';

  const url = `${apiBase}?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please check the name and try again.");
        }
        throw new Error("Unable to fetch weather data. Try again later.");
      }
      return response.json();
    })
    .then((data) => {
      resultEl.innerHTML = renderWeather(data);
    })
    .catch((error) => {
      resultEl.innerHTML = `<p class="error">${error.message}</p>`;
    });
}

function renderWeather(data) {
  const { name, sys, weather, main, wind } = data;
  return `
    <div class="weather-card">
      <h2>${name}, ${sys.country}</h2>
      <p class="description">${weather[0].description}</p>
      <p><strong>Temperature:</strong> ${Math.round(main.temp)}°C</p>
      <p><strong>Feels like:</strong> ${Math.round(main.feels_like)}°C</p>
      <p><strong>Humidity:</strong> ${main.humidity}%</p>
      <p><strong>Wind:</strong> ${wind.speed} m/s</p>
    </div>`;
}

document.getElementById("cityInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getWeather();
  }
});
