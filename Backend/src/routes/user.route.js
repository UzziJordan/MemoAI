const express = require('express');
const { getProfile, updateProfile, updatePassword, uploadProfileImage, deleteAccount } = require('../controllers/user.controller');
const protect = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

//Configure multer - store files in /uploads folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

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