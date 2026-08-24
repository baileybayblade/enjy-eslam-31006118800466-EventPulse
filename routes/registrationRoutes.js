const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrations.controller');
const requireAuth = require('../middleware/requireAuth');

// all registration routes are protected for authenticated users :3
router.use(requireAuth);

router.post('/', registrationController.registerForEvent);
router.get('/my', registrationController.getMyRegistrations);
router.delete('/:id', registrationController.cancelRegistration);

module.exports = router;