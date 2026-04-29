const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'guestId', select: 'name email' },
          { path: 'roomId', select: 'roomNumber roomType price' }
        ]
      });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, additionalServices } = req.body;
    
    const booking = await Booking.findById(bookingId).populate('roomId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Default to booking's total price, add any arbitrary external services
    let finalAmount = booking.totalPrice;
    if (additionalServices) {
       finalAmount += Number(additionalServices);
    }

    const payment = new Payment({
      bookingId,
      amount: finalAmount,
      paymentMethod,
      paymentStatus: 'Paid'
    });

    const savedPayment = await payment.save();
    
    // Auto-update booking status upon payment
    booking.bookingStatus = 'completed';
    await booking.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPayments, createPayment };
