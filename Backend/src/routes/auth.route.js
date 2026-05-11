const express = require('express');
const router = express.Router();
const { createUser, login, googleAuth } = require('../controllers/auth.controller');

router.post('/register', createUser);
router.post('/login', login);
router.post('/google', googleAuth);

module.exports = router;