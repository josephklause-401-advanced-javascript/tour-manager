const mongoose = require('mongoose');

const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  title: RequiredString,
  activities: [RequiredString],
  launchDate: {
    type: Date,
    default: () => new Date()
  },
  stops: []
});

schema.statics = {

  addStop(id, stop) {
    return this.updateById(id, {
      $push: {
        stops: stop
      }
    }
    )
      .then(tour => tour);
  },


  removeStop(id, stopId) {
    return this.updateById(id, {
      $pull: {
        stops: { _id: stopId }
      }
    })
      .then(tour => tour.stops);
  },

  updateStopAttendance(id, stopId, attendance) {
    return this.updateOne(
      { _id: id, 'stops._id': stopId },
      {
        $set: {
          'stops.$.attendance': attendance
        }
      }
    )
      .then(tour => tour.stops);
  }
};

module.exports = mongoose.model('Tours', schema);