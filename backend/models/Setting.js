const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  taxRate: {
    type: Number,
    required: true,
    default: 10 // 10%
  },
  hotelName: {
    type: String,
    required: true,
    default: 'LuxuryStay HMS'
  },
  hotelEmail: {
    type: String,
    required: true,
    default: 'concierge@luxurystay.com'
  },
  hotelAddress: {
    type: String,
    required: true,
    default: '123 Excellence Blvd, Beverly Hills, CA'
  },
  hotelPhone: {
    type: String,
    required: true,
    default: '+1 (555) 000-0000'
  },
  cancellationPolicy: {
    type: String,
    required: true,
    default: 'Free cancellation up to 24 hours before check-in.'
  },
  baseRoomPriceMultiplier: {
    type: Number,
    required: true,
    default: 1.0
  }
}, { timestamps: true });

const Setting = mongoose.model('Setting', settingSchema);
module.exports = Setting;
