const express = require('express');
const { getNotifications, markAsRead, markAllRead, deleteNotification, createNotification } = require('../controllers/notification.controller');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);

// Helper route to manually trigger a notification (useful for settings toggles)
router.post('/', async (req, res) => {
    try {
        const { title, message, type, link } = req.body;
        await createNotification(req.user.id, title, message, type, link);
        res.status(201).json({ message: 'Notification created' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating notification' });
    }
});

router.patch('/mark-all-read', markAllRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
