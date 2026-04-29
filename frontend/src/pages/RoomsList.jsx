import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './RoomsList.css';

const RoomsList = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/rooms');
        setRooms(data);
        
        const params = new URLSearchParams(location.search);
        const guests = params.get('guests');
        const offer = params.get('offer');
        
        let filtered = data;
        if (guests) {
          const guestCount = guests.includes('Family') ? 4 : parseInt(guests);
          filtered = filtered.filter(r => r.guestCount >= guestCount);
        }
        
        if (offer) {
          filtered = filtered.filter(r => r.offers && r.offers.includes(offer));
        }
        
        setFilteredRooms(filtered);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError('Unable to fetch rooms. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [location.search]);

  const [filters, setFilters] = useState({
    type: 'All',
    price: 1000,
    search: '',
    beds: 'Any'
  });

  useEffect(() => {
    let result = rooms;

    if (filters.type !== 'All') {
      result = result.filter(r => r.roomType === filters.type);
    }

    result = result.filter(r => r.price <= filters.price);

    if (filters.search) {
      result = result.filter(r => 
        r.roomType.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.roomNumber.toString().includes(filters.search)
      );
    }

    if (filters.beds !== 'Any') {
      result = result.filter(r => r.bedType && r.bedType.includes(filters.beds));
    }

    const params = new URLSearchParams(location.search);
    const offer = params.get('offer');
    if (offer) {
      result = result.filter(r => r.offers && r.offers.includes(offer));
    }

    setFilteredRooms(result);
  }, [filters, rooms]);

  const getRoomImage = (type) => {
    const images = {
      'Standard': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'Deluxe': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      'Suite': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'Family': 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=800&q=80',
      'Penthouse': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    };
    return images[type] || images.Standard;
  };

  if (loading) return <div className="loading-state">Elevating your experience...</div>;

  return (
    <div className="rooms-list-page fade-up">
      <div className="rooms-header">
        <h1>Extraordinary <span>Accommodations</span></h1>
        <p>Curated luxury for the discerning traveler.</p>
      </div>

      <div className="rooms-main-container">
        {/* Sidebar */}
        <div className="rooms-sidebar">
          <div className="filter-group">
            <h4>Search</h4>
            <div className="filter-search">
              <input 
                type="text" 
                placeholder="Search..." 
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>

          <div className="filter-group">
            <h4>Categories</h4>
            <div className="filter-categories">
              {['All', 'Standard', 'Deluxe', 'Suite', 'Family', 'Penthouse'].map(type => (
                <button 
                  key={type}
                  className={filters.type === type ? 'active' : ''}
                  onClick={() => setFilters({...filters, type})}
                >
                  {type === 'All' ? 'All Suites' : type}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="price-display">
              <h4>Max Price</h4>
              <span>${filters.price}</span>
            </div>
            <input 
              type="range" 
              className="price-slider"
              min="100"
              max="1000"
              step="50"
              value={filters.price}
              onChange={(e) => setFilters({...filters, price: parseInt(e.target.value)})}
            />
          </div>

          <div className="filter-group">
            <button 
              className="details-btn" 
              style={{width: '100%', borderRadius: '12px'}}
              onClick={() => setFilters({ type: 'All', price: 1000, search: '', beds: 'Any' })}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="rooms-content-area">
          {error ? (
            <div className="loading-state" style={{fontSize: '20px', color: '#ff4d4d'}}>
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="rooms-grid">
              {filteredRooms.map((room) => (
                <div key={room._id} className="room-card-v2">
                  <div className="room-img-container">
                    <img src={getRoomImage(room.roomType)} alt={room.roomType} />
                    <div className="room-badge">{room.roomType}</div>
                  </div>
                  <div className="room-content">
                    <h3>{room.roomType} Room {room.roomNumber}</h3>
                    <div className="room-tags">
                      <span><i className="fas fa-expand"></i> {room.sqm || 35} sqm</span>
                      <span><i className="fas fa-bed"></i> {room.bedType || 'King Bed'}</span>
                    </div>
                    <p className="room-desc">
                      {room.description || "Indulge in a space where sophistication meets comfort. Perfect for your next getaway."}
                    </p>
                    <div className="room-footer">
                      <div className="room-price">
                        <span className="amount">${room.price}</span>
                        <span className="per-night">/ night</span>
                      </div>
                      <Link to={`/rooms/${room._id}`} className="details-btn">View Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="loading-state" style={{fontSize: '20px'}}>No suites matching your criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsList;
