const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: Number, required: true },
  status: {
    type: String,
    enum: ['planned', 'booked', 'completed'],
    default: 'planned'
  },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Trip', TripSchema);