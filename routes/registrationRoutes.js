const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

// all registration routes are protected for authenticated users :3
router.use(protect);

router.post('/', registrationController.registerForEvent);
router.get('/my-registrations', registrationController.getMyRegistrations);
router.delete('/:id', registrationController.cancelRegistration);

module.exports = router;