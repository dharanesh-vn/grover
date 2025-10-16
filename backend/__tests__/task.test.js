const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const taskRoutes = require('../routes/task.routes');
const Task = require('../models/task.model');
const User = require('../models/user.model');
const Crop = require('../models/crop.model');
const jwt = require('jsonwebtoken');

let mongoServer;
let app;
let managerToken, farmerToken, workerToken;
let managerId, farmerId, workerId;
let cropId;

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
  app.use('/api/tasks', taskRoutes);

  // --- THIS IS THE CRITICAL FIX ---
  // Create IDs for our test users
  managerId = new mongoose.Types.ObjectId();
  farmerId = new mongoose.Types.ObjectId();
  workerId = new mongoose.Types.ObjectId();
  cropId = new mongoose.Types.ObjectId();

  // Create tokens for the different roles using their real IDs
  managerToken = jwt.sign({ user: { id: managerId, role: 'Manager' } }, process.env.JWT_SECRET);
  farmerToken = jwt.sign({ user: { id: farmerId, role: 'Farmer' } }, process.env.JWT_SECRET);
  workerToken = jwt.sign({ user: { id: workerId, role: 'Worker' } }, process.env.JWT_SECRET);

  // Create the actual user documents in the test database
  await User.create([
    { _id: managerId, name: 'Test Manager', email: 'manager@test.com', password: 'password', phone: '1234567890', role: 'Manager' },
    { _id: farmerId, name: 'Test Farmer', email: 'farmer@test.com', password: 'password', phone: '1234567890', role: 'Farmer' },
    { _id: workerId, name: 'Test Worker', email: 'worker@test.com', password: 'password', phone: '1234567890', role: 'Worker' }
  ]);
  
  await Crop.create({ _id: cropId, cropName: 'Test Crop', cropType: 'Test', plantingDate: new Date(), expectedHarvestDate: new Date(), area: 1 });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe('Task Routes - Complex Role Logic', () => {

  it('should allow a Manager to create a task for a Farmer', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        taskDescription: 'Water the fields',
        assignedTo: farmerId,
        cropId: cropId,
        dueDate: '2025-11-01',
      });
    expect(response.status).toBe(201);
    expect(response.body.taskDescription).toBe('Water the fields');
  });

  it('should allow a Farmer to get ONLY their own tasks via /mytasks', async () => {
    await Task.create({ taskDescription: 'Farmer Task', assignedTo: farmerId, cropId: cropId, dueDate: new Date() });
    await Task.create({ taskDescription: 'Worker Task', assignedTo: workerId, cropId: cropId, dueDate: new Date() });
    
    const response = await request(app)
      .get('/api/tasks/mytasks')
      .set('Authorization', `Bearer ${farmerToken}`);
      
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].taskDescription).toBe('Farmer Task');
  });

  it('should allow a Farmer to update the status of their OWN task', async () => {
    const task = await Task.create({ taskDescription: 'Fertilize', assignedTo: farmerId, cropId: cropId, dueDate: new Date() });
    const response = await request(app)
      .put(`/api/tasks/${task._id}/status`)
      .set('Authorization', `Bearer ${farmerToken}`)
      .send({ status: 'Completed' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Completed');
  });

  it('should FORBID a Farmer from updating the status of ANOTHER user\'s task', async () => {
    const task = await Task.create({ taskDescription: 'Worker Task to be Hacked', assignedTo: workerId, cropId: cropId, dueDate: new Date() });
    const response = await request(app)
      .put(`/api/tasks/${task._id}/status`)
      .set('Authorization', `Bearer ${farmerToken}`)
      .send({ status: 'Completed' });

    expect(response.status).toBe(403);
  });
});