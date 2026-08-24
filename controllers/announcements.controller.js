const Message = require('../models/Message');
const Event = require('../models/Event');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    post and broadcast an announcement to an event room
// @route   POST /api/announcements
// @access  private/Admin
exports.createAnnouncement = asyncHandler(async (req, res, next) => {
  const { eventId, text } = req.body;

  if (!eventId || !text) {
    return next(new AppError('Please provide eventId and text', 400));
  }

  // crify event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // pass message to MongoDB
  let message = await Message.create({
    event: eventId,
    sender: req.user.userId,
    text,
  });

  // populate sender details
  message = await message.populate('sender', 'name email');

  // emit to the specific event room
  const io = req.app.get('io');
  io.to(eventId).emit('announcement', message);

  res.status(201).json({
    status: 'success',
    data: message,
  });
});

// @desc    get all past announcements for an event
// @route   GET /api/announcements/:eventId
// @access  public
exports.getAnnouncementsByEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  // get messages sorted oldest to newest
  const messages = await Message.find({ event: eventId })
    .sort({ createdAt: 1 })
    .populate('sender', 'name email');

  res.status(200).json({
    status: 'success',
    count: messages.length,
    data: messages,
  });
});