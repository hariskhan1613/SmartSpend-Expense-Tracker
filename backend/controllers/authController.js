const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const User = require('../models/User');

/**
 * Generate a JWT token for a given user ID.
 * Token expires in 7 days.
 */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Validation rules for signup
 */
const signupValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];

/**
 * Validation rules for login
 */
const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
const signup = async (req, res) => {
    try {
        // Check for validation errors from express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        // Create the user (password is hashed automatically via pre-save hook)
        const user = await User.create({ name, email, password });

        // Return user info + token
        res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email },
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { email, password } = req.body;

        // Find user and explicitly select password (normally excluded)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            user: { id: user._id, name: user.name, email: user.email },
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user info
 * @access  Private
 */
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('GetMe error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { signup, login, getMe, signupValidation, loginValidation };
