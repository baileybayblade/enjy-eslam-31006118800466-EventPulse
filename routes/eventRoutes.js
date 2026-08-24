const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const eventController = require('../controllers/events.controller');
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/requireAuth');
const { requireRole } = require('../middleware/authMiddleware');

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

router.use(requireAuth, requireRole('admin'));

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('category').isMongoId().withMessage('Category must be a valid MongoId'),
    body('date').isISO8601().withMessage('Date must be a valid date'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
  ],
  validate,
  eventController.createEvent
);

router.patch(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID parameter must be a valid MongoId'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('category').optional().isMongoId().withMessage('Category must be a valid MongoId'),
    body('date').optional().isISO8601().withMessage('Date must be a valid date'),
    body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
  ],
  validate,
  eventController.updateEvent
);

module.exports = router;