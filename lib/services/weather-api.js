const request = require('superagent');

const BASE_URL = 'https://api.darksky.net/forecast';
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

module.exports = function getForecast(lat, lng) {
  const url = `${BASE_URL}/${WEATHER_API_KEY}/${lat},${lng}`;

  return request
    .get(url)
    .then(res => {
      return formatForecast(res.body);
    });
};

function formatForecast(response) {
  const data = response.daily.data;
  return data.map(formatDay);
}

function formatDay(day) {
  return {
    time: new Date(day.time * 1000).toISOString(),
    forecast: day.summary
  };
}