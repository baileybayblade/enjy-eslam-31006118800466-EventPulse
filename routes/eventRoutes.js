const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const eventController = require('../controllers/eventController');
const requireAuth = require('../middleware/requireAuth');
const { requireRole } = require('../middleware/authMiddleware');
const { validateResult } = require('../middleware/errorHandler');

const eventValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('venue').notEmpty().withMessage('Venue is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1 spot'),
  body('date').isISO8601().withMessage('Valid ISO date required'),
  body('category').isMongoId().withMessage('Valid Category ID required'),
];

// routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

router.use(requireAuth, requireRole('admin'));

router.post('/', eventValidationRules, validateResult, eventController.createEvent);
router.patch('/:id', eventValidationRules, validateResult, eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;