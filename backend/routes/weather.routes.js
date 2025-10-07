const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');

// @route   GET api/weather
// @desc    Get weather data for a specific city
// @access  Public
router.get('/', weatherController.getWeather);

module.exports = router;