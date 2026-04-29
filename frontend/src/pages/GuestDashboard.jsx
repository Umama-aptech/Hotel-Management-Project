import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GuestDashboard.css';

const GuestDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [profileData, setProfileData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || ''
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/bookings/my-bookings');
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLoyaltyTier = () => {
    const totalStays = bookings.length;
    if (totalStays >= 5) return { name: 'Platinum', class: 'platinum', icon: 'fa-gem' };
    if (totalStays >= 2) return { name: 'Gold', class: 'gold', icon: 'fa-crown' };
    return { name: 'Silver', class: 'silver', icon: 'fa-medal' };
  };

  const tier = getLoyaltyTier();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // Mock update - in a real app this would call an API
      const updatedUser = { ...userInfo, name: profileData.name, email: profileData.email };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setEditingProfile(false);
      alert("Profile updated successfully!");
      window.location.reload(); // Refresh to update all UI parts
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await axios.put(`http://localhost:5000/api/bookings/${id}`, { bookingStatus: 'cancelled' });
        setBookings(bookings.map(b => b._id === id ? { ...b, bookingStatus: 'cancelled' } : b));
      } catch (error) {
        alert("Cancellation failed. Please contact support.");
      }
    }
  };

  if (loading) return <div className="loading-state">Personalizing your profile...</div>;

  return (
    <div className="luxury-dashboard">
      <div className="dashboard-content">
        {/* Profile Header */}
        <section className="profile-header">
           <div className="profile-avatar">
             {userInfo?.name?.charAt(0) || 'U'}
           </div>
           <div className="profile-info">
             <div className={`loyalty-badge ${tier.class}`}>
               <i className={`fas ${tier.icon}`}></i> {tier.name} Member
             </div>
             {!editingProfile ? (
               <>
                 <h1>Welcome Back, <span>{userInfo?.name || 'Guest'}</span></h1>
                 <p>Member since 2026 | {userInfo?.email}</p>
                 <button className="edit-profile-toggle" onClick={() => setEditingProfile(true)}>
                   <i className="fas fa-edit"></i> Edit Profile
                 </button>
               </>
             ) : (
               <form className="edit-profile-form" onSubmit={handleUpdateProfile}>
                 <div className="edit-group">
                   <input 
                     type="text" 
                     value={profileData.name} 
                     onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                     placeholder="Your Name"
                     required
                   />
                   <input 
                     type="email" 
                     value={profileData.email} 
                     onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                     placeholder="Your Email"
                     required
                   />
                 </div>
                 <div className="edit-actions">
                   <button type="submit" className="save-btn" disabled={updating}>
                     {updating ? 'Saving...' : 'Save Changes'}
                   </button>
                   <button type="button" className="cancel-edit-btn" onClick={() => setEditingProfile(false)}>Cancel</button>
                 </div>
               </form>
             )}
           </div>
           <div className="profile-stats">
             <div className="stat-card">
               <span className="stat-value">{bookings.filter(b => b.bookingStatus === 'confirmed').length}</span>
               <span className="stat-label">Active Bookings</span>
             </div>
             <div className="stat-card">
               <span className="stat-value">{bookings.length}</span>
               <span className="stat-label">Total Stays</span>
             </div>
           </div>
        </section>

        {/* Bookings List */}
        <section className="bookings-section">
          <div className="section-title">
            <h2>Your <span>Reservations</span></h2>
            <p>Manage your upcoming and past stays.</p>
          </div>

          <div className="booking-list">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking._id} className={`booking-luxury-card ${booking.bookingStatus}`}>
                  <div className="booking-main">
                    <div className="room-info">
                      <h3>{booking.roomId?.roomType || 'Deluxe'} Room</h3>
                      <p>Room #{booking.roomId?.roomNumber || '---'}</p>
                    </div>
                    <div className="dates-info">
                      <div className="date-block">
                        <label>Check-in</label>
                        <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
                      </div>
                      <i className="fas fa-arrow-right"></i>
                      <div className="date-block">
                        <label>Check-out</label>
                        <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="status-info">
                      <span className={`status-badge ${booking.bookingStatus}`}>
                        {booking.bookingStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    <div className="price-tag">
                      Total: <span>${booking.totalPrice || '0'}</span>
                    </div>
                    <div className="action-btns">
                      {booking.bookingStatus === 'confirmed' && (
                        <>
                          <button className="mod-btn" onClick={() => alert("Modification feature coming soon. Please contact concierge.")}>Modify</button>
                          <button className="cancel-btn" onClick={() => handleCancel(booking._id)}>Cancel</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-bookings">
                <i className="fas fa-calendar-times"></i>
                <p>No reservations found. Time for a new story?</p>
                <a href="/explore-rooms" className="explore-now">Explore Rooms</a>
              </div>
            )}
          </div>
        </section>

        {/* Personalized Perks */}
        <section className="perks-section">
          <div className={`perk-card ${tier.class}`}>
            <i className={`fas ${tier.icon}`}></i>
            <div>
              <h4>{tier.name} Tier Benefits</h4>
              <p>
                {tier.name === 'Platinum' 
                  ? "You've reached the pinnacle. Enjoy complimentary spa treatments and room upgrades!"
                  : tier.name === 'Gold'
                  ? `You are ${5 - bookings.length} stays away from Platinum status. Enjoy free late checkout!`
                  : `You are ${2 - bookings.length} stays away from Gold status. Book more to unlock exclusive perks!`}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GuestDashboard;
