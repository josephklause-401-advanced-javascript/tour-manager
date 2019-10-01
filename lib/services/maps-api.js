const request = require('superagent');

// url and key

const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

// api service methods we want to expose:
module.exports = function getLocation(search) {
  // if we wanted to do string concat
  // const url = `${BASE_URL}?address=${search}&key=${GEOCODE_API_KEY}`;

  return request
    .get(BASE_URL)
    .query({ address: search })
    .query({ key: GEOCODE_API_KEY })
    .then(res => {
      return toLocation(res.body, search);
    });
};

// Helper functions for transforming data

function toLocation(geoData) {
  const firstResult = geoData.results[0];
  const geometry = firstResult.geometry;

  return {
    latitude: geometry.location.lat,
    longitude: geometry.location.lng
  };
}