const request = require('supertest');

const { User } = require('../../../models/user.model');
const { Car } = require('../../../models/car.model');

let server;

const car = new Car({
  carNumber: 'UP ASK 2859',
  companyName: 'Toyota',
  dailyRentalRate: 2000,
  model: 'Fortuner',
  year: 2018,
  seatingCapacity: 8,
});

describe('auth middleware', () => {
  beforeEach(() => {
    server = require('../../../index');
  });
  afterEach(async () => {
    await server.close();
    await Car.remove({});
  });

  let token;

  const exec = () => {
    return request(server)
      .post('/api/cars/addCar')
      .set('auth-token', token)
      .send(car);
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
