import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RoomDetails.css';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        setRoom(data);
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const getRoomImage = (type) => {
    const images = {
      'Standard': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'Deluxe': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'Suite': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'Family': 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=80',
      'Penthouse': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
    };
    return images[type] || images.Standard;
  };

  if (loading) return <div className="loading-state">Defining luxury for you...</div>;
  if (!room) return <div className="error-state">Room not found.</div>;

  return (
    <div className="room-details-page">
      <div className="room-hero">
        <img src={getRoomImage(room.roomType)} alt={room.roomType} />
        <div className="room-hero-overlay"></div>
        <div className="room-hero-content">
          <Link to="/explore-rooms" className="back-link"><i className="fas fa-arrow-left"></i> Back to Rooms</Link>
          <h1>{room.roomType} <span>Experience</span></h1>
        </div>
      </div>

      <div className="room-info-container">
        <div className="room-main-info">
          <section className="info-section">
            <h2>About this <span>Space</span></h2>
            <p>{room.description}</p>
          </section>

          <section className="info-section">
            <h2>Luxury <span>Amenities</span></h2>
            <div className="amenities-grid">
              {(room.amenities || ['Premium Bedding', 'L’Occitane Toiletries', 'Nespresso Machine', 'Smart Climate Control']).map((item, i) => (
                <div key={i} className="amenity-item">
                  <i className="fas fa-check-circle"></i> {item}
                </div>
              ))}
            </div>
          </section>

          <section className="info-section">
            <h2>Room <span>Facilities</span></h2>
            <div className="facilities-tags">
              {(room.facilities || ['High-speed Wi-Fi', 'Room Service', 'Mini Bar', 'HD TV']).map((f, i) => (
                <span key={i}>{f}</span>
              ))}
            </div>
          </section>

          <section className="info-section tour-section">
            <h2>360° Virtual <span>Tour</span></h2>
            <div className="tour-placeholder">
              <img src={getRoomImage(room.roomType)} alt="Tour Preview" />
              <div className="tour-overlay">
                <div className="play-button">
                  <i className="fas fa-play"></i>
                </div>
                <span>Experience the Luxury</span>
                <p>Interactive 360° view coming soon</p>
              </div>
            </div>
          </section>
        </div>

        <div className="room-sidebar">
          <div className="booking-card">
            <div className="card-header">
              <span className="price">${room.price}</span>
              <span className="per-night">/ night</span>
            </div>
            <div className="booking-specs">
              <div className="spec">
                <i className="fas fa-user-friends"></i>
                <span>{room.guestCount || 2} Guests</span>
              </div>
              <div className="spec">
                <i className="fas fa-bed"></i>
                <span>{room.bedType || 'King Bed'}</span>
              </div>
              <div className="spec">
                <i className="fas fa-ruler-combined"></i>
                <span>{room.sqm || 35} sqm</span>
              </div>
            </div>
            <button 
              className="book-now-btn"
              onClick={() => navigate('/guest-booking', { state: { roomId: room._id, roomType: room.roomType, price: room.price } })}
            >
              Book Now
            </button>
            <p className="card-footer">No immediate payment required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
