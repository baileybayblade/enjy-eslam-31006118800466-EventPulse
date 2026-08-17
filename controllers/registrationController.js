const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    register current authenticated user for an event
// @route   POST /api/registrations
exports.registerForEvent = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.body;

    // ...check if the event even exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // ...prevent duplicate registration
    const existingRegistration = await Registration.findOne({
      user: userId,
      event: eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event.',
      });
    }

    // ...check capacity rules
    const currentRegistrationCount = await Registration.countDocuments({ event: eventId });
    if (currentRegistrationCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Registration blocked: Event has reached full capacity.',
      });
    }

    // ...create registration record
    const registration = await Registration.create({
      user: userId,
      event: eventId,
    });

    await registration.populate('event');

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event.',
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    get registered events for current user
// @route   GET /api/registrations/my-registrations
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // fetch only this user's registrations + populate full event & category details
    const registrations = await Registration.find({ user: userId }).populate({
      path: 'event',
      populate: { path: 'category' },
    });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    cancel registration and free up a spot
// @route   DELETE /api/registrations/:id
exports.cancelRegistration = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found.',
      });
    }

    // ensure user can only cancel their own registration
    if (registration.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only cancel your own registrations.',
      });
    }

    await registration.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Registration cancelled. Space freed for another attendee.',
    });
  } catch (error) {
    next(error);
  }
};