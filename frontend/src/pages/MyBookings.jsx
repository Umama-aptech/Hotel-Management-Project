import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Calendar, Bed, MapPin, Receipt, Clock, ExternalLink } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const fetchMyBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my-bookings');
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch my bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <div style={{ color: '#FFD700', textAlign: 'center', marginTop: '5rem', fontWeight: 600 }}>RETRIEVING STAY HISTORY...</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'completed': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="zoom-fade" style={{ paddingBottom: windowWidth <= 768 ? '80px' : '0' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: windowWidth <= 600 ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: windowWidth <= 600 ? 'flex-start' : 'center', 
        marginBottom: '3rem',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: windowWidth <= 600 ? '1.5rem' : '1.8rem' }}>Your Luxury Stays</h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>Management and history of your exclusive reservations.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {bookings.map(booking => (
          <div key={booking._id} className="card" style={{ 
            display: 'flex', 
            flexDirection: windowWidth <= 768 ? 'column' : 'row',
            padding: 0, 
            overflow: 'hidden', 
            minHeight: windowWidth <= 768 ? 'auto' : '180px' 
          }}>
            <div style={{ 
              width: windowWidth <= 768 ? '100%' : '12px', 
              height: windowWidth <= 768 ? '8px' : 'auto',
              backgroundColor: getStatusColor(booking.bookingStatus) 
            }}></div>
            
            <div style={{ 
              flex: 1, 
              padding: windowWidth <= 480 ? '1.2rem' : '1.5rem', 
              display: 'flex', 
              flexDirection: windowWidth <= 1024 ? 'column' : 'row',
              justifyContent: 'space-between', 
              alignItems: windowWidth <= 1024 ? 'flex-start' : 'center',
              gap: '1.5rem'
            }}>
               <div style={{ 
                 display: 'flex', 
                 flexDirection: windowWidth <= 600 ? 'column' : 'row',
                 gap: windowWidth <= 600 ? '1rem' : '2.5rem', 
                 alignItems: windowWidth <= 600 ? 'flex-start' : 'center' 
               }}>
                  <div style={{ 
                    fontSize: windowWidth <= 480 ? '1.4rem' : '1.8rem', 
                    fontWeight: 800, color: '#333', 
                    textAlign: windowWidth <= 600 ? 'left' : 'center', 
                    minWidth: windowWidth <= 600 ? 'auto' : '80px' 
                  }}>
                     <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Suite</div>
                     <span style={{ color: '#FFD700' }}>{booking.roomId?.roomNumber || 'N/A'}</span>
                  </div>

                  <div style={{ 
                    height: windowWidth <= 600 ? '1px' : '50px', 
                    width: windowWidth <= 600 ? '100%' : '1px', 
                    backgroundColor: '#2A2A2A' 
                  }}></div>

                  <div>
                     <div style={{ fontSize: windowWidth <= 480 ? '1.1rem' : '1.2rem', fontWeight: 700, color: '#FFF', marginBottom: '0.4rem' }}>{booking.roomId?.roomType} Experience</div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {new Date(booking.checkInDate).toLocaleDateString()} — {new Date(booking.checkOutDate).toLocaleDateString()}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>< Receipt size={14} /> Total: ${booking.totalPrice?.toLocaleString()}</div>
                     </div>
                  </div>
               </div>

               <div style={{ 
                 display: 'flex', 
                 width: windowWidth <= 1024 ? '100%' : 'auto',
                 justifyContent: 'space-between',
                 alignItems: 'center', 
                 gap: '2rem',
                 borderTop: windowWidth <= 1024 ? '1px solid #2A2A2A' : 'none',
                 paddingTop: windowWidth <= 1024 ? '1.2rem' : '0'
               }}>
                  <div style={{ textAlign: 'left' }}>
                     <div style={{ 
                        fontSize: '0.6rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', 
                        color: getStatusColor(booking.bookingStatus), border: `1px solid ${getStatusColor(booking.bookingStatus)}`,
                        padding: '0.25rem 0.75rem', borderRadius: '1rem', display: 'inline-block', marginBottom: '0.5rem'
                     }}>
                        {booking.bookingStatus}
                     </div>
                     <div style={{ color: '#444', fontSize: '0.75rem' }}>Ref: {booking._id.slice(-8).toUpperCase()}</div>
                  </div>

                  <button className="btn btn-secondary" style={{ padding: '0.75rem', borderRadius: '0.75rem' }}>
                     <ExternalLink size={18} />
                  </button>
               </div>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
             No reservations found in your history. Begin your journey today.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
