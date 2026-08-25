const Event = require('../models/Event');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    get all events with filtering, pagination, sorting, and search
// @route   GET /api/events
// @access  public
exports.getEvents = asyncHandler(async (req, res, next) => {
  // destructure directly from req.query without reassigning req.query itself (due to previous supertest/jest errors)
  const { category, city, startDate, endDate, search, sortBy, order, page = 1, limit = 10 } = req.query;

  const query = {};

  if (category) query.category = category;
  if (city) query.city = city;

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate)   query.date.$lte = new Date(endDate);
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // sorting & pagination
  const allowedSortFields = ['date', 'registrations'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
  const sortDirection = order === 'desc' ? -1 : 1;
  const actualSortField = sortField === 'registrations' ? 'registeredCount' : sortField;
  const sort = { [actualSortField]: sortDirection };

  const pageNum  = parseInt(page, 10)  || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip     = (pageNum - 1) * limitNum;

  const events = await Event.find(query)
      .populate('category')
      .sort({ [sortBy || 'date']: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Event.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: events.length,
      total,
      data: events,
  });
});

// @desc    get single event by ID
// @route   GET /api/events/:id
// @access  public
exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('category')
    .populate('organizer');

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({ status: 'success', data: event });
});

// @desc    create a new event
// @route   POST /api/events
// @access  private/admin
exports.createEvent = asyncHandler(async (req, res, next) => {
  req.body.organizer = req.user.userId;

  const event = await Event.create(req.body);

  res.status(201).json({ status: 'success', data: event });
});

// @desc    update an event
// @route   PATCH /api/events/:id
// @access  private/admin
exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({ status: 'success', data: event });
});

// @desc    delete an event
// @route   DELETE /api/events/:id
// @access  private/admin
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({ status: 'success', data: null });
});