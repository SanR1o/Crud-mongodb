const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registro
router.post('/api/signup', authController.signup);

// Login
router.post('/api/signin', authController.signin);

module.exports = router;
