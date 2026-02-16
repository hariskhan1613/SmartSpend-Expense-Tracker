const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    signup,
    login,
    getMe,
    signupValidation,
    loginValidation,
} = require('../controllers/authController');

// Public routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

// Protected route – get current user
router.get('/me', auth, getMe);

module.exports = router;
