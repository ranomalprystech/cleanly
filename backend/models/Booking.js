const mongoose = require('mongoose');

const ProblemReportSchema = new mongoose.Schema({
  subject: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true }, 
  address: { type: String, required: true },
  zipCode: { type: String, required: true },
  cleaningType: { type: String, enum: ['Standard', 'Deep', 'Move In-Out'], required: true },
  frequency: { type: String, enum: ['ONE-TIME', 'WEEKLY', 'BI-WEEKLY', 'MONTHLY'], required: true },
  bedrooms: { type: Number, min: 1, required: true }, 
  bathrooms: { type: Number, min: 1, required: true }, 
  extras: [{ type: String }], 
  specialReq: { type: String },
  bookingDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  totalCost: { type: Number, required: true },
  assignedCleaner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cleaner' }],
  assignedCleaners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cleaner' }],
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  problemReports: [ProblemReportSchema]
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);