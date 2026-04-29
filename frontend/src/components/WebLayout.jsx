import React from 'react';
import WebsiteNavbar from './WebsiteNavbar';
import './WebLayout.css';

const WebLayout = ({ children }) => {
  return (
    <div className="web-layout">
      <WebsiteNavbar />
      <main className="web-main">
        {children}
      </main>
      <footer className="web-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>LUXURY<span>STAY</span></h4>
            <p>Redefining hospitality with a touch of elegance and modern comfort.</p>
          </div>
          <div className="footer-section">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="/rooms">Our Rooms</a></li>
              <li><a href="/contact">Support</a></li>
              <li><a href="/terms">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h5>Connect</h5>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 LuxuryStay HMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default WebLayout;
