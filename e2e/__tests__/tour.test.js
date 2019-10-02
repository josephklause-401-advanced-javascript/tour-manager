jest.mock('../../lib/services/maps-api');
jest.mock('../../lib/services/weather-api');
const request = require('../request');
const db = require('../db');
const getLocation = require('../../lib/services/maps-api');
const getForecast = require('../../lib/services/weather-api');
const { ObjectId } = require('mongoose').Types;

getLocation.mockResolvedValue({
  latitude: 45.5266975,
  longitude: -122.6880503
});

getForecast.mockResolvedValue({
  forecast: 'unhappy'
});

const location = {
  address: 97215,
  _id: new ObjectId()
};

const tour = {
  title: 'Joe takes on the town!',
  activities: ['drinking', 'smoking', 'pillaging'],
  launchDate: new Date()
};

function postTour(tour) {
  return request
    .post('/api/tours')
    .send(tour)
    .expect(200)
    .then(({ body }) => body);
}

describe('tour api', () => {
  beforeEach(() => {
    return db.dropCollection('tours');
  });

  it('posts a tour', () => {
    return request
      .post('/api/tours')
      .send(tour)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            launchDate: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "activities": Array [
              "drinking",
              "smoking",
              "pillaging",
            ],
            "launchDate": Any<String>,
            "stops": Array [],
            "title": "Joe takes on the town!",
          }
        `
        );
      });
  });

  it('gets a list of tours', () => {
    return Promise.all([postTour(tour), postTour(tour), postTour(tour)])
      .then(() => {
        return request.get('/api/tours').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            launchDate: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "activities": Array [
              "drinking",
              "smoking",
              "pillaging",
            ],
            "launchDate": Any<String>,
            "stops": Array [],
            "title": "Joe takes on the town!",
          }
        `
        );
      });
  });

  it('adding a stop gets a geo location and weather', () => {
    return postTour(tour).then(tour => {
      return request
        .post(`/api/tours/${tour._id}/stops`)
        .send(location)
        .expect(200)
        .then(({ body }) => {
          expect(body[0]).toMatchInlineSnapshot(
            {
              _id: expect.any(String)
            },
            `
            Object {
              "_id": Any<String>,
              "address": 97215,
              "location": Object {
                "latitude": 45.5266975,
                "longitude": -122.6880503,
              },
              "weather": Object {
                "forecast": "unhappy",
              },
            }
          `
          );
        });
    });
  });

  it('deletes a stop that got cancelled', () => {
    return postTour(tour).then(tour => {
      return request
        .post(`/api/tours/${tour._id}/stops`)
        .send(location)
        .expect(200)
        .then(({ body }) => {
          return request
            .delete(`/api/tours/${tour._id}/stops/${body[0]._id}`)
            .expect(200);
        })
        .then(({ body }) => {
          expect(body.length).toBe(0);
        });
    });
  });

  it('updates attendance in stop', () => {
    return postTour(tour).then(tour => {
      return request
        .post(`/api/tours/${tour._id}/stops`)
        .send(location)
        .expect(200)
        .then(({ body }) => {
          return request
            .put(`/api/tours/${tour._id}/stops/${body[0]._id}/attendance`)
            .send('12')
            .expect(200);
        })
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(`
            Array [
              Object {
                "_id": "5d93f9c69eff51536175b25d",
                "address": 97215,
                "attendance": Object {},
                "location": Object {
                  "latitude": 45.5266975,
                  "longitude": -122.6880503,
                },
                "weather": Object {
                  "forecast": "unhappy",
                },
              },
            ]
          `);
        });
    });
  });
});
