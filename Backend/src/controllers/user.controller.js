const User = require('../models/User');
const Recording = require('../models/Recordings');
const UserTodo = require('../models/UserTodo');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const getCloudinaryPublicId = (url) => {
    if (!url || !url.includes('/upload/')) return null;

    const uploadPath = url.split('/upload/')[1];
    if (!uploadPath) return null;

    const pathWithoutVersion = uploadPath.replace(/^v\d+\//, '');
    return pathWithoutVersion.replace(/\.[^/.]+$/, '');
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        //req.user.id comes from the middleware
        const user = await User.findById(req.user.id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status (200).json({ user });
    } catch (err) {
        console.error('Error fetching user profile', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update User Profile (Name, etc.)
exports.updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name.trim();
        
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
        console.error('Error updating profile', err);
        res.status(500).json({ message: 'Server error' });
    }
};

//Update User Password
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        //Validate new password
        if ( !newPassword || newPassword.length < 6 ) {
            return res.status(400).json({ message: 'New Password Must Be At Least 6 Characters'})
        }

        //Google Users cant update password
        if (!user.passwordHash) {
            return res.status(400).json({ message: 'Google authenticated users cannot update password' });
        }

        //Hash new password and save
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error updating password', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Upload user profile image
exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image file' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Upload to Cloudinary using a stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'profile_pictures',
                public_id: `user_${user._id}`,
                overwrite: true,
                transformation: [{ width: 500, height: 500, crop: 'limit' }]
            },
            async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ message: 'Cloudinary upload failed' });
                }

                // Update user with Cloudinary secure URL
                user.profileImage = result.secure_url;
                await user.save();

                res.status(200).json({ 
                    message: 'Profile image updated successfully', 
                    profileImage: user.profileImage 
                });
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

    } catch (err) {
        console.error('Error uploading profile image', err);
        res.status(500).json({ message: 'Server error' });
    }
};

//Delete user account
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const recordings = await Recording.find({ user: userId }).select('audioUrl');
        const audioPublicIds = recordings
            .map((recording) => getCloudinaryPublicId(recording.audioUrl))
            .filter(Boolean);

        const profileImagePublicId = getCloudinaryPublicId(user.profileImage);
        const cloudinaryDeletes = [];

        if (profileImagePublicId) {
            cloudinaryDeletes.push(
                cloudinary.uploader.destroy(profileImagePublicId, { resource_type: 'image' })
            );
        }

        audioPublicIds.forEach((publicId) => {
            cloudinaryDeletes.push(
                cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
            );
        });

        const cloudinaryResults = await Promise.allSettled(cloudinaryDeletes);
        cloudinaryResults.forEach((result) => {
            if (result.status === 'rejected') {
                console.error('Cloudinary cleanup failed during account deletion:', result.reason);
            }
        });

        await Promise.all([
            Recording.deleteMany({ user: userId }),
            UserTodo.deleteMany({ user: userId }),
            Notification.deleteMany({ user: userId }),
            User.findByIdAndDelete(userId)
        ]);

        res.status(200).json({
            message: 'Account and associated data deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting account', err);
        res.status(500).json({ message: 'Server error' });
    }
};
