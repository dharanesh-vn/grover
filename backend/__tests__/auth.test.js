const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authRoutes = require('../routes/auth.routes');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Controller - White-Box Tests', () => {

  test('WBT-01: Should register a user successfully on the success path', async () => {
    console.log('\n--- RUNNING WBT-01: Testing Success Path ---');
    const userData = {
      name: 'Valid User',
      email: 'wbt1@grover.com',
      password: 'Password@123',
      phone: '1234567890',
      role: 'Farmer',
    };
    console.log('INPUT DATA:', userData);

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    console.log('ACTUAL OUTPUT - Status:', response.status);
    console.log('ACTUAL OUTPUT - Body:', response.body);
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully!');
  });

  test('WBT-02: Should fail to register if email already exists', async () => {
    console.log('\n--- RUNNING WBT-02: Testing Duplicate Email Branch ---');
    const existingUser = new User({ name: 'Existing User', email: 'wbt2@grover.com', password: 'Password@123', phone: '1112223334', role: 'Worker' });
    await existingUser.save();
    console.log('SETUP: Pre-existing user created in database.');

    const duplicateUserData = {
      name: 'Another User',
      email: 'wbt2@grover.com',
      password: 'Password@456',
      phone: '9876543210',
      role: 'Farmer',
    };
    console.log('INPUT DATA:', duplicateUserData);
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(duplicateUserData);

    console.log('ACTUAL OUTPUT - Status:', response.status);
    console.log('ACTUAL OUTPUT - Body:', response.body);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User with this email already exists.');
  });

  test('WBT-03: Should fail to register if password is too short', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Weak Pass User',
        email: 'wbt3@grover.com',
        password: '123',
        phone: '1234567890',
        role: 'Farmer',
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password must be at least 8 characters long.');
  });

  test('WBT-04: Should fail to register if a field is missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: '',
        email: 'wbt4@grover.com',
        password: 'Password@123',
        phone: '1234567890',
        role: 'Farmer',
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Please enter all required fields.');
  });
  
  describe('Login Logic', () => {
    beforeEach(async () => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Password@123', salt);
        const user = new User({ name: 'Login User', email: 'login@grover.com', password: hashedPassword, phone: '5556667778', role: 'Farmer' });
        await user.save();
    });

    test('WBT-06: Should log in successfully with valid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'login@grover.com', password: 'Password@123' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('WBT-07: Should fail to log in with a non-existent email', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'nonexistent@grover.com', password: 'Password@123' });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid credentials.');
    });

    test('WBT-08: Should fail to log in with an incorrect password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'login@grover.com', password: 'WrongPassword' });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid credentials.');
    });
  });
});