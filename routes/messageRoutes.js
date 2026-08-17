const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// get msg history for an event (only accessible to logged-in users)
router.get('/event/:eventId', requireAuth, messageController.getEventMessages);

// broadcast an announcement (admin only)
router.post('/announcement', requireAuth, requireRole('admin'), messageController.sendAnnouncement);

module.exports = router;