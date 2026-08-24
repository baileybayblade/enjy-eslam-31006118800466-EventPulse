const Event = require('../models/Event');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    get all events with filtering, pagination, sorting, and search
// @route   GET /api/events
// @access  public
exports.getEvents = asyncHandler(async (req, res, next) => {
  const { category, city, startDate, endDate, search, sortBy, order, page, limit } = req.query;

  // filtering
  const filter = {};
  if (category) filter.category = category;
  if (city) filter.city = city;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate)   filter.date.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // sorting
  const allowedSortFields = ['date', 'registrations'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
  const sortDirection = order === 'desc' ? -1 : 1;

  const actualSortField = sortField === 'registrations' ? 'registeredCount' : sortField;
  const sort = { [actualSortField]: sortDirection };

  // pagination calc
  const pageNum  = parseInt(page, 10)  || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip     = (pageNum - 1) * limitNum;

  // execute db queries
  const [data, total] = await Promise.all([
    Event.find(filter)
      .populate('category', 'name')
      .populate('organizer', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Event.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum) || 1;

  res.status(200).json({
    status: 'success',
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    data,
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