const getForecast = require('../services/weather-api');

module.exports = () => (req, res, next) => {
  const { latitude, longitude } = req.body.location;

  if(!(latitude && longitude)) {
    return next({
      statusCode: 400,
      error: 'not useable location'
    });
  }

  getForecast(latitude, longitude)
    .then(weather => {
      if(!weather) {
        throw {
          statusCode: 400,
          error: 'location must be resolvable to weather'
        };
      }
      req.body.weather = weather;
      next();
    })
    .catch(next);
};