import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GuestBooking.css';

const GuestBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomInfo = location.state || {};

  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
    guests: '1',
    roomType: roomInfo.roomType || 'Standard'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        alert("Please login to complete your booking.");
        navigate('/login');
        return;
      }

      await axios.post('http://localhost:5000/api/bookings', {
        guestId: userInfo._id,
        roomId: roomInfo.roomId,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        totalPrice: roomInfo.price * 2, // Mock calc
        bookingStatus: 'confirmed'
      });

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error) {
      console.error('Booking failed:', error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="booking-success-container">
        <div className="success-content">
          <div className="success-icon"><i className="fas fa-check-circle"></i></div>
          <h1>Booking Confirmed!</h1>
          <p>Thank you for choosing LuxuryStay. Your reservation is set.</p>
          <p>Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guest-booking-page">
      <div className="booking-form-container">
        <div className="booking-header">
          <h1>Secure Your <span>Stay</span></h1>
          <p>Complete the form below to finalize your luxury reservation.</p>
        </div>

        <form className="luxury-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={formData.guestName}
                onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Check-In Date</label>
              <input 
                type="date"
                value={formData.checkInDate}
                onChange={(e) => setFormData({...formData, checkInDate: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Check-Out Date</label>
              <input 
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Number of Guests</label>
              <select 
                value={formData.guests}
                onChange={(e) => setFormData({...formData, guests: e.target.value})}
              >
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>Family</option>
              </select>
            </div>
            <div className="form-group">
              <label>Room Category</label>
              <input type="text" value={formData.roomType} readOnly disabled />
            </div>
          </div>

          <div className="booking-summary-mini">
             <div className="summary-row">
               <span>Expected Total</span>
               <span>${roomInfo.price ? (roomInfo.price * 2) : '---'}</span>
             </div>
          </div>

          <button type="submit" className="confirm-booking-btn" disabled={loading}>
            {loading ? "Processing..." : "Confirm Reservation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuestBooking;
