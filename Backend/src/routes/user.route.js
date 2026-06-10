const express = require('express');
const { getProfile, updateProfile, updatePassword, uploadProfileImage, deleteAccount } = require('../controllers/user.controller');
const protect = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

//Configure multer - use memory storage for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

//GET /api/user/profile - protected route

router.get('/profile', protect, getProfile);

//PATCH /api/user/ - protected route
router.patch('/', protect, updateProfile);

//PATCH /api/user/update-password - protected route
router.patch('/password', protect, updatePassword);

//PATCH /api/user/upload-profile-image - protected route
router.patch('/profile-image', protect, upload.single('profileImage'), uploadProfileImage);

//DELETE /api/user/delete-account - protected route
router.delete('/account', protect, deleteAccount);

module.exports = router;