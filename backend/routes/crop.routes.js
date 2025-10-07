const express = require('express');
const router = express.Router();
const {
    createCrop,
    getAllCrops,
    getCropById,
    updateCrop,
    deleteCrop
} = require('../controllers/crop.controller');
const { protect, isManager } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getAllCrops)
    .post(protect, isManager, createCrop);

router.route('/:id')
    .get(protect, getCropById)
    .put(protect, isManager, updateCrop)
    .delete(protect, isManager, deleteCrop);

module.exports = router;