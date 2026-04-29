const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },
  roomType: {
    type: String,
    required: true,
    enum: ['Standard', 'Deluxe', 'Suite', 'Family', 'Single', 'Penthouse'],
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'cleaning', 'maintenance'],
    default: 'available',
  },
  bedrooms: {
    type: Number,
    required: true,
    default: 1,
  },
  sqm: {
    type: Number,
    default: 25,
  },
  bedType: {
    type: String,
    default: 'Queen Bed',
  },
  guestCount: {
    type: Number,
    default: 2,
  },
  description: {
    type: String,
    default: 'Experience luxury and comfort in our exquisitely designed rooms.',
  },
  features: {
    type: [String],
    default: ['Private balcony', 'Work desk', 'Spacious layout', 'Large windows'],
  },
  facilities: {
    type: [String],
    default: ['High-speed Wi-Fi', 'In-room safe', 'Mini-fridge', 'Flat-screen TV', 'Air conditioning', 'Coffee/tea maker'],
  },
  amenities: {
    type: [String],
    default: ['Complimentary bottled water', 'Luxury toiletries', 'Hairdryer', 'Premium bedding'],
  },
    "images": {
    "type": [String],
    "default": [],
  },
  "offers": {
    "type": [String],
    "default": [],
  },
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
