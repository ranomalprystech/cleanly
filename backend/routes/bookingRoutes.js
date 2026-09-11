const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const calculatePrice = require('../utils/calculatePrice');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.post('/create', verifyToken, async (req, res) => {
  try {
    let serviceConfig = await Service.findOne();

    if (!serviceConfig) {
      serviceConfig = {
        cleaningTypes: {
          standard: { perRoomRate: 50, perBathRate: 60 },
          deep: { perRoomRate: 75, perBathRate: 85 },
          moveInOut: { perRoomRate: 100, perBathRate: 110 }
        },
        addons: [
          { name: 'Clean Oven', price: 25 },
          { name: 'Clean Windows', price: 20 },
          { name: 'Clean Fridge', price: 20 }
        ],
        frequencyDiscounts: {
          oneTime: 0,
          Weekly: 25,
          biWeekly: 15,
          monthly: 10
        }
      };
    }

    const totalCost = calculatePrice(req.body, serviceConfig);

    const booking = new Booking({
      ...req.body,
      userId: req.user.id,
      totalCost
    });
    await booking.save();

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/mine', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .sort({ bookingDate: -1, createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/problems', verifyToken, async (req, res) => {
  try {
    const { subject, description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Subject and description are required.'
      });
    }

    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.problemReports.push({ subject, description });
    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Problem reported successfully.',
      report: booking.problemReports[booking.problemReports.length - 1]
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const serviceConfig = await Service.findOne();
    const totalCost = calculatePrice(req.body, serviceConfig);
    const assignedCleaners = Array.isArray(req.body.assignedCleaners)
      ? req.body.assignedCleaners
      : req.body.assignedCleaner
        ? [req.body.assignedCleaner]
        : [];

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        assignedCleaners,
        assignedCleaner: assignedCleaners,
        totalCost
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.json({ success: true, message: 'Booking updated successfully', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID.' });
    }

    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;