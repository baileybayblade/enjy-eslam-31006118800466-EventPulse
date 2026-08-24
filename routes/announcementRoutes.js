const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcements.controller');
const requireAuth = require('../middleware/requireAuth');
const { requireRole } = require('../middleware/authMiddleware');

// public route: fetch history
router.get('/:eventId', announcementController.getAnnouncementsByEvent);

// admin route: post + broadcast announcement
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  announcementController.createAnnouncement
);

module.exports = router;