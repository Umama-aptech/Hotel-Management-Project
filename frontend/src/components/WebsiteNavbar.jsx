import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import './WebsiteNavbar.css';

const WebsiteNavbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="website-navbar">
      <div className="nav-logo">
        <Link to="/">LUXURY<span>STAY</span></Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/explore-rooms">Rooms</Link>
        <Link to="/guest-booking">Booking</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="nav-auth">
        {userInfo ? (
          <div className="user-nav-info">
            <Link to="/settings" className="user-profile-btn" title="Profile Settings">
              <User size={20} />
            </Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="login-link">Sign In</Link>
            <Link to="/register" className="register-btn">Join Now</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default WebsiteNavbar;
