const express = require('express');
const router = express.Router();
const { createUser, login, googleAuth, verifyOTP, resendOTP } = require('../controllers/auth.controller');

router.post('/register', createUser);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

module.exports = router;