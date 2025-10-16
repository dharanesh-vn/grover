const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const cropRoutes = require('../routes/crop.routes');
const Crop = require('../models/crop.model');
const User = require('../models/user.model'); // Import the User model
const jwt = require('jsonwebtoken');

let mongoServer;
let app;
let managerToken;
let farmerToken;
let managerId;
let farmerId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());
  
  // This middleware now correctly finds the full user from the DB
  app.use(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.user.id); // Find the actual user
        } catch (e) {
            req.user = null;
        }
    }
    next();
  });
  app.use('/api/crops', cropRoutes);

  // --- THIS IS THE CRITICAL FIX ---
  // Create IDs for our test users
  managerId = new mongoose.Types.ObjectId();
  farmerId = new mongoose.Types.ObjectId();

  // Create tokens for the different roles using their real IDs
  managerToken = jwt.sign({ user: { id: managerId, role: 'Manager' } }, process.env.JWT_SECRET);
  farmerToken = jwt.sign({ user: { id: farmerId, role: 'Farmer' } }, process.env.JWT_SECRET);
  
  // Create the actual user documents in the test database
  await User.create([
      { _id: managerId, name: 'Test Manager', email: 'manager-crop@test.com', password: 'password', phone: '1234567890', role: 'Manager' },
      { _id: farmerId, name: 'Test Farmer', email: 'farmer-crop@test.com', password: 'password', phone: '1234567890', role: 'Farmer' }
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Crop.deleteMany({});
});

describe('Crop Routes - Security and CRUD', () => {

  it('should allow a Manager to create a crop', async () => {
    const response = await request(app)
      .post('/api/crops')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        cropName: 'Corn',
        cropType: 'Grain',
        plantingDate: '2025-05-10',
        expectedHarvestDate: '2025-09-20',
        area: 15
      });
    expect(response.status).toBe(201);
    expect(response.body.cropName).toBe('Corn');
  });

  it('should FORBID a Farmer from creating a crop', async () => {
    const response = await request(app)
      .post('/api/crops')
      .set('Authorization', `Bearer ${farmerToken}`)
      .send({ cropName: 'Forbidden Corn', cropType: 'Grain', plantingDate: '2025-05-10', expectedHarvestDate: '2025-09-20', area: 15 });
    expect(response.status).toBe(403);
  });

  it('should allow any authenticated user to get all crops', async () => {
    await Crop.create({ cropName: 'Wheat', cropType: 'Grain', plantingDate: '2025-01-01', expectedHarvestDate: '2025-06-01', area: 10 });
    const response = await request(app)
      .get('/api/crops')
      .set('Authorization', `Bearer ${farmerToken}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].cropName).toBe('Wheat');
  });

  it('should FORBID a Farmer from deleting a crop', async () => {
    const crop = await Crop.create({ cropName: 'Carrot', cropType: 'Vegetable', plantingDate: '2025-03-01', expectedHarvestDate: '2025-06-01', area: 2 });
    const response = await request(app)
      .delete(`/api/crops/${crop._id}`)
      .set('Authorization', `Bearer ${farmerToken}`);
    expect(response.status).toBe(403);
  });

  it('should allow a Manager to delete a crop', async () => {
    const crop = await Crop.create({ cropName: 'Potato', cropType: 'Vegetable', plantingDate: '2025-04-01', expectedHarvestDate: '2025-07-01', area: 5 });
    const response = await request(app)
      .delete(`/api/crops/${crop._id}`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Crop removed successfully');
  });
});