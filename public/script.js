document.addEventListener('DOMContentLoaded', () => {
  const themes = {
    clear_sky: {
      '--main-color': '#C4E0F9',
      '--background-color': '#2EC0F9',
      '--text-color': '#A63D67'
    },
    cloudy_day: {
      '--main-color': '#93A8AC',
      '--background-color': '#4C5760',
      '--text-color': '#44435B'
    }, 
    rain_blues: {
      '--main-color': '#508991',
      '--background-color': '#172A3A',
      '--text-color': '#74B3CE'
    },
    snowy_sentement: {
      '--main-color': '#9EBC9F',
      '--background-color': '#F4F2F3',
      '--text-color': '#230903'
    },
    default: {
      '--main-color': '#A69CAC',
      '--background-color': '#474973',
      '--text-color': '#F1DAC4'
    }
  };

  const form = document.getElementById('weather-form');
  const content = document.getElementById('content');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;

    // if no city or state is entered, display an error message
    if (!city || !state) {
      content.innerHTML = `<p>Error: Please enter both city and state.</p>`;
      return;
    }

    // fetch the weather data from the server, display error if invalid city or state
    try {
      const response = await fetch(`/weather?city=${city}&state=${state}`);
      const data = await response.json();

      if (response.ok) {
        content.innerHTML = `
          <p>Temperature: ${data.temperature} °F</p>
          <p>Weather: ${data.weatherDescription}</p>
          <p>Wind Speed: ${data.windSpeed} mph</p>
          <!--placeholder for images-->
          <img src="icons/${data.condition.toLowerCase()}.svg" alt="${data.condition}">
        `;
        applyTheme(data.condition);
      } else {
        content.innerHTML = `<p>Invalid City or State</p>`;
      }
    } catch (error) {
      content.innerHTML = `<p>Invalid City or State</p>`;
    }
  });

  // uses the preset themes to change the css depending on the weather condition
  function applyTheme(condition) {
    let theme;
    switch (condition.toLowerCase()) {
      case 'clear':
        theme = themes.clear_sky;
        break;
      case 'clouds':
        theme = themes.cloudy_day;
        break;
      case 'rain':
        theme = themes.rain_blues;
        break;
      case 'snow':
        theme = themes.snowy_sentement;
        break;
      default:
        theme = themes.default;
    }
    for (const [key, value] of Object.entries(theme)) {
      document.documentElement.style.setProperty(key, value);
    }
  }
});
