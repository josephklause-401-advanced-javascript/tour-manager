/* eslint-disable new-cap*/
const router = require('express').Router();
const Tour = require('../models/tour');
const addGeo = require('../middleware/add-geolocation');
const getForecast = require('../middleware/add-weather');

router
  .post('/', (req, res, next) => {
    Tour.create(req.body)
      .then(tour => res.json(tour))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Tour.find()
      .then(tour => res.json(tour))
      .catch(next);
  })

  .post('/:id/stops', addGeo(), getForecast(), ({ params, body }, res, next) => {
    Tour.addStop(params.id, body)
      .then(stop => res.json(stop))
      .catch(next);
  })
  
  .delete('/:id/stops/:stopId', ({ params }, res, next) => {
    Tour.removeStop(params.id, params.stopId)
      .then(stop => res.json(stop))
      .catch(next);
  })

  .put('/:id/stops/:stopId/attendance', ({ params, body }, res, next) => {
    Tour.updateStopAttendance(params.id, params.stopId, body)
      .then(stop => res.json(stop))
      .catch(next);
  });

  

module.exports = router;