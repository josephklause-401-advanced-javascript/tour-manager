const mongoose = require('mongoose');

const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  location: {
    latitude: Number,
    longitude: Number,
  },
  weather: {
    forcast: RequiredString
  }
});

module.exports = mongoose.model('Tours', schema);