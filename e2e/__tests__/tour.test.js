const request = require('../request');
const db = require('../db');

describe('tour api', () => {
  beforeEach(() => {
    return db.dropCollection('tours');
  });

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
            "title": "Joe takes on the town!",
          }
        `
        );
      });
  });
});
