const express = require('express');
const router = express.Router();
const { createUser, login } = require('../controllers/auth.controller');

router.post('/register', createUser);
router.post('/login', login);

module.exports = router;