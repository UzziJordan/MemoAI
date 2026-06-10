const express = require('express');
const router = express.Router();
const { createUser, login, googleAuth, verifyOTP, resendOTP, forgotPassword, resetPassword } = require('../controllers/auth.controller');

router.post('/register', createUser);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;