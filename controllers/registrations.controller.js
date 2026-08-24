const Registration = require('../models/Registration');
const Event = require('../models/Event');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    register current authenticated user for an event
// @route   POST /api/registrations
// @access  priv
exports.registerForEvent = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const eventId = req.body.event; // Expects 'event' in the body per spec

  // check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // prevent dupe registration
  const existing = await Registration.findOne({
    event: eventId,
    attendee: userId,
  });
  if (existing) {
    return next(new AppError('You are already registered for this event', 400));
  }

  // check capacity
  const currentCount = await Registration.countDocuments({ event: eventId });
  if (currentCount >= event.capacity) {
    return next(new AppError('This event is full', 400));
  }

  // create registration record
  const registration = await Registration.create({
    event: eventId,
    attendee: userId,
  });

  await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

  res.status(201).json({
    status: 'success',
    data: registration,
  });
});

// @desc    get registered events for current user
// @route   GET /api/registrations/my
// @access  priv
exports.getMyRegistrations = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;

  // fetch user's registrations and populate the event document
  const registrations = await Registration.find({ attendee: userId }).populate('event');

  res.status(200).json({
    status: 'success',
    count: registrations.length,
    data: registrations,
  });
});

// @desc    cancel an event registration
// @route   DELETE /api/registrations/:id
// @access  priv
exports.cancelRegistration = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const registrationId = req.params.id;

  // check if registration exists
  const registration = await Registration.findById(registrationId);
  if (!registration) {
    return next(new AppError('Registration not found', 404));
  }

  // auth check (only owner can cancel)
  if (registration.attendee.toString() !== userId) {
    return next(new AppError("You can only cancel your own registration", 403));
  }

  // remove registration record
  await registration.deleteOne();

  // decrement event counter
  await Event.findByIdAndUpdate(registration.event, {
    $inc: { registeredCount: -1 },
  });

  // response
  res.status(200).json({
    status: 'success',
    message: 'Registration cancelled successfully',
  });
});