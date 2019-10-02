const mongoose = require('mongoose');

const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  location: {
    latitude: Number,
    longitude: Number,
  },
  weather: {
    forecast: RequiredString
  }
});



module.exports = mongoose.model('Stops', schema);