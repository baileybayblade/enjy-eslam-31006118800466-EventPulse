const Event = require('../models/Event');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    get all events with filtering, pagination, sorting, and search
// @route   GET /api/events
// @access  public
exports.getEvents = asyncHandler(async (req, res, next) => {
  const { category, city, startDate, endDate, search, sort, page, limit } = req.query;

  // build combined filter object
  const filter = {};

  if (category) filter.category = category;
  if (city) filter.city = city;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate)   filter.date.$lte = new Date(endDate);
  }

  // search query
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // sorting
  let sortOption = { createdAt: -1 };
  if (sort === 'date') sortOption = { date: 1 };
  else if (sort === '-date') sortOption = { date: -1 };
  else if (sort === 'popularity') sortOption = { registeredCount: -1 };

  // pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const startIndex = (pageNum - 1) * limitNum;

  const total = await Event.countDocuments(filter);

  const events = await Event.find(filter)
    .populate('category', 'name')
    .populate('organizer', 'name email')
    .sort(sortOption)
    .skip(startIndex)
    .limit(limitNum);

  res.status(200).json({
    status: 'success',
    count: events.length,
    total,
    currentPage: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    data: events,
  });
});

// @desc    get single event by ID
// @route   GET /api/events/:id
// @access  public
exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('category', 'name description')
    .populate('organizer', 'name email');

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