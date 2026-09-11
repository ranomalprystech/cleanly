const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  cleaningTypes: {
    standard: {
      perRoomRate: { type: Number, default: 50 },
      perBathRate: { type: Number, default: 60 },
      addons: [{ name: { type: String, required: true }, price: { type: Number, required: true } }]
    },
    deep: {
      perRoomRate: { type: Number, default: 75 },
      perBathRate: { type: Number, default: 85 },
      addons: [{ name: { type: String, required: true }, price: { type: Number, required: true } }]
    },
    moveInOut: {
      perRoomRate: { type: Number, default: 100 },
      perBathRate: { type: Number, default: 110 },
      addons: [{ name: { type: String, required: true }, price: { type: Number, required: true } }]
    }
  },
    frequencyDiscounts: {
        oneTime: {type: Number, default: 0},
        weekly: {type: Number, default: 25},
        biWeekly: {type: Number, default: 0},
        monthly: {type: Number, default: 0}
    },

}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
