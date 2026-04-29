import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Mock submission
  };

  if (submitted) {
    return (
      <div className="contact-success">
        <div className="success-content">
          <i className="fas fa-paper-plane"></i>
          <h1>Message Dispatched</h1>
          <p>Our concierge team will review your inquiry and respond within 24 hours.</p>
          <button onClick={() => setSubmitted(false)} className="back-btn">Send Another Message</button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-info-panel">
          <div className="info-header">
            <h1>Contact <span>Us</span></h1>
            <p>We are here to assist you with any inquiries or special requests.</p>
          </div>
          
          <div className="info-items">
            <div className="info-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h5>Location</h5>
                <p>123 Luxury Ave, Beverly Hills, CA 90210</p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-phone-alt"></i>
              <div>
                <h5>Reservations</h5>
                <p>+1 (800) LUX-STAY</p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-envelope"></i>
              <div>
                <h5>General Inquiries</h5>
                <p>concierge@luxurystay.com</p>
              </div>
            </div>
          </div>

          <div className="social-connect">
            <h5>Follow Our Journey</h5>
            <div className="social-icons">
               <a href="#"><i className="fab fa-instagram"></i></a>
               <a href="#"><i className="fab fa-facebook"></i></a>
               <a href="#"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
        </div>

        <div className="contact-form-panel">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Ex. Julianne Moore"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="Ex. julianne@luxury.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <select 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              >
                <option value="">Select a subject</option>
                <option value="Reservation Query">Reservation Query</option>
                <option value="Special Occasion">Special Occasion</option>
                <option value="Feedback">Feedback</option>
                <option value="Events">Events & Conferences</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                rows="5" 
                placeholder="How can we elevate your stay?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-contact-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
