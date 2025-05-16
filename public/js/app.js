// DOM Elements
const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherContainer = document.getElementById('weather-container');
const loadingElement = document.getElementById('loading');
const errorContainer = document.getElementById('error-container');

// Event Listeners
weatherForm.addEventListener('submit', fetchWeather);

// Functions
async function fetchWeather(e) {
  e.preventDefault();
  
  const city = cityInput.value.trim();
  
  if (!city) return;
  
  // Show loading and hide previous content
  showLoading();
  hideError();
  hideWeatherData();
  
  try {
    // Fetch weather data from our backend API
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch weather data');
    }
    
    const weatherData = await response.json();
    displayWeatherData(weatherData);
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoading();
  }
}

function displayWeatherData(data) {
  const weatherHTML = `
    <div class="weather-header">
      <div class="location">${data.city}, ${data.country}</div>
      <div class="weather-icon">
        <img src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="${data.description}">
      </div>
    </div>
    
    <div class="temp-container">
      <div class="main-temp">${Math.round(data.temperature)}°C</div>
      <div class="weather-description">${capitalizeFirstLetter(data.description)}</div>
    </div>
    
    <div class="weather-details">
      <div class="detail-item">
        <span>Feels like: ${Math.round(data.feels_like)}°C</span>
      </div>
      <div class="detail-item">
        <span>Humidity: ${data.humidity}%</span>
      </div>
      <div class="detail-item">
        <span>Wind: ${data.wind_speed} m/s</span>
      </div>
    </div>
  `;
  
  weatherContainer.innerHTML = weatherHTML;
  weatherContainer.style.display = 'block';
}

function showLoading() {
  loadingElement.style.display = 'flex';
}

function hideLoading() {
  loadingElement.style.display = 'none';
}

function showError(message) {
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
}

function hideError() {
  errorContainer.style.display = 'none';
}

function hideWeatherData() {
  weatherContainer.style.display = 'none';
}

function capitalizeFirstLetter(string) {
  return string.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}