const express = require('express');
const {body} = require('express-validator');

const router = express.Router();

const {validate} = require('../utils/validate');
const { registerUser, loginUser, getUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
router.post('/register', validate([
    body('name', 'Name is required.').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters, should include special characters').isLength({ min: 6 })
]), registerUser)

router.post('/login', validate([
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please include the password').notEmpty()
]), loginUser)

router.get('/user', authMiddleware, getUser)

module.exports = router;

