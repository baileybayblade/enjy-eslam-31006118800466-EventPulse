const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required'],
    },
    text: {
      type: String,
      required: [true, 'Announcement text is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);