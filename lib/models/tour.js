const mongoose = require('mongoose');

const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  title: RequiredString,
  activities: [RequiredString],
  launchDate: {
    type: Date,
    default: () => new Date()
  }
});

module.exports = mongoose.model('Tours', schema);