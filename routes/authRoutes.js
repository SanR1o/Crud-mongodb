const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registro
router.post('/signup', authController.signup);

// Login
router.post('/signin', authController.signin);

module.exports = router;
