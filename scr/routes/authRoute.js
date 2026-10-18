const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// Define the routes and point them to the correct Chef functions
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;

