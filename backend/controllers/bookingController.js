const Booking = require('../models/Booking');
const Room = require('../models/Room');

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('guestId', 'name email').populate('roomId', 'roomNumber roomType price');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ guestId: req.user._id })
      .populate('roomId', 'roomNumber roomType price');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { guestId, roomId, checkInDate, checkOutDate } = req.body;
    
    // Default to current user if guestId not provided (for guest role)
    const effectiveGuestId = guestId || req.user._id;

    // Check if room exists and is available
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Calculate total price
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const totalPrice = diffDays * room.price;

    const booking = new Booking({
      guestId: effectiveGuestId,
      roomId,
      checkInDate,
      checkOutDate,
      totalPrice,
      bookingStatus: 'confirmed'
    });

    const createdBooking = await booking.save();
    
    // Update room status
    room.status = 'occupied';
    await room.save();
    
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.bookingStatus = status;
      const updatedBooking = await booking.save();
      
      // Handle room status resets
      if (status === 'completed' || status === 'cancelled') {
         const room = await Room.findById(booking.roomId);
         if(room) {
             room.status = 'cleaning';
             await room.save();
         }
      }

      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBookings, getMyBookings, createBooking, updateBookingStatus };
