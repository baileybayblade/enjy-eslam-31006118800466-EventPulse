// all registration routes are protected for authenticated users :3
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const registrationController = require('../controllers/registrations.controller');
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.post(
  '/',
  [
    body('event').isMongoId().withMessage('event must be a valid MongoId'),
  ],
  validate,
  registrationController.registerForEvent
);

module.exports = router;