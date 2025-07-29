const API_KEY = "f84a721510a77fb91106b98148ac7a68"; // Replace with your OpenWeatherMap API key

document.getElementById("toggle-mode").addEventListener("click", () => {
  const theme = document.documentElement.getAttribute("data-theme");
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    document.getElementById("toggle-mode").innerText = "🌙 Dark Mode";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    document.getElementById("toggle-mode").innerText = "☀️ Light Mode";
  }
});

function getWeather() {
  const city = document.getElementById("city-input").value;
  if (!city) return alert("Please enter a city name");

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const weatherBox = document.getElementById("weather-box");
      const mapBox = document.getElementById("map");

      const emoji = getEmoji(data.weather[0].main);
      const desc = data.weather[0].description;

      weatherBox.innerHTML = `
        <h2>${emoji} ${data.name}, ${data.sys.country}</h2>
        <p><strong>🌡️ Temp:</strong> ${data.main.temp}°C</p>
        <p><strong>🌥️ Condition:</strong> ${desc}</p>
        <p><strong>💧 Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>🌬️ Wind:</strong> ${data.wind.speed} m/s</p>
        <p><strong>📍 Coordinates:</strong> [${data.coord.lat}, ${data.coord.lon}]</p>
      `;

      weatherBox.classList.remove("hidden");
      mapBox.classList.remove("hidden");

      // Show map
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      const map = L.map('map').setView([lat, lon], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      L.marker([lat, lon]).addTo(map).bindPopup(`${data.name}`).openPopup();
    })
    .catch(() => {
      alert("City not found!");
    });
}

function getEmoji(weather) {
  const emojis = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Smoke: "💨",
    Haze: "🌫️",
    Dust: "🌪️",
    Fog: "🌁",
    Sand: "🏜️",
    Ash: "🌋",
    Squall: "🌬️",
    Tornado: "🌪️"
  };
  return emojis[weather] || "🌡️";
}
