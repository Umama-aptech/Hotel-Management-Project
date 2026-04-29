import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Filter, Bed, Check, Info, Calendar } from 'lucide-react';

const BookRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [search, setSearch] = useState({ type: 'All', checkIn: '', checkOut: '' });
  const [message, setMessage] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const fetchRooms = async () => {
      try {
        const { data } = await api.get('/rooms');
        setRooms(data.filter(r => r.status === 'available'));
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBook = async (roomId) => {
    if (!search.checkIn || !search.checkOut) {
      setMessage('Please select check-in and check-out dates first.');
      return;
    }

    setBookingLoading(true);
    try {
      await api.post('/bookings', {
        roomId,
        checkInDate: search.checkIn,
        checkOutDate: search.checkOut
      });
      setMessage('Suite reserved successfully! Redirecting to your stays...');
      setTimeout(() => window.location.href = '/my-bookings', 2000);
    } catch (err) {
      console.error("Booking failed", err);
      setMessage('Failed to secure reservation. Please try again.');
    } finally {
      setBookingLoading(setBookingLoading);
    }
  };

  const filteredRooms = rooms.filter(r => 
    search.type === 'All' || r.roomType === search.type
  );

  if (loading) return <div style={{ color: '#FFD700', textAlign: 'center', marginTop: '5rem', fontWeight: 600 }}>CURATING AVAILABLE SUITES...</div>;

  return (
    <div className="zoom-fade" style={{ paddingBottom: windowWidth <= 768 ? '80px' : '0' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: windowWidth <= 600 ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: windowWidth <= 600 ? 'flex-start' : 'center', 
        marginBottom: '3rem',
        gap: '1.5rem'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: windowWidth <= 600 ? '1.5rem' : '1.8rem' }}>Elevate Your Stay</h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>Select your sanctuary from our curated selection of ultra-luxury suites.</p>
        </div>
      </div>

      {/* Date & Filter Bar */}
      <div className="card" style={{ 
        marginBottom: '3rem', 
        padding: '1.5rem', 
        display: 'flex', 
        flexDirection: windowWidth <= 768 ? 'column' : 'row',
        gap: '1.5rem', 
        alignItems: windowWidth <= 768 ? 'stretch' : 'flex-end', 
        backgroundColor: 'rgba(30, 30, 30, 0.4)', 
        backdropFilter: 'blur(5px)' 
      }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
             <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#444' }}>Stay Start</label>
             <input type="date" className="form-control" value={search.checkIn} onChange={(e) => setSearch({...search, checkIn: e.target.value})} style={{ backgroundColor: '#121212' }} />
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
             <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#444' }}>Stay End</label>
             <input type="date" className="form-control" value={search.checkOut} onChange={(e) => setSearch({...search, checkOut: e.target.value})} style={{ backgroundColor: '#121212' }} />
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
             <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#444' }}>Suite Class</label>
             <select className="form-control" value={search.type} onChange={(e) => setSearch({...search, type: e.target.value})} style={{ backgroundColor: '#121212' }}>
                <option value="All">All Tiers</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
             </select>
          </div>
          <div style={{ flex: windowWidth <= 768 ? 'none' : 0.5, display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ 
               flex: 1,
               backgroundColor: '#1A1A1A', 
               padding: '0.75rem', 
               borderRadius: '0.5rem', 
               border: '1px solid #333',
               display: 'flex',
               justifyContent: 'center'
             }}>
                <Filter size={18} color="#FFD700" />
             </div>
          </div>
      </div>

      {message && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'center', fontWeight: 600, border: '1px solid rgba(255, 215, 0, 0.2)' }}>
           {message}
        </div>
      )}

      {/* Room Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {filteredRooms.map(room => (
          <div key={room._id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
             <div style={{ height: '200px', backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #2A2A2A', position: 'relative' }}>
                <Bed size={64} color="#333" />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(0,0,0,0.8)', padding: '0.4rem 0.8rem', borderRadius: '2rem', border: '1px solid #FFD700', color: '#FFD700', fontSize: '0.7rem', fontWeight: 700 }}>
                   ${room.price}/NIGHT
                </div>
             </div>
             
             <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                   <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{room.roomType} Suite</h3>
                   <span style={{ fontSize: '0.75rem', color: '#666' }}>ROOM {room.roomNumber}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#BBB', fontSize: '0.8rem' }}>
                      <Check size={14} color="#10B981" /> 5-Star Amenities
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#BBB', fontSize: '0.8rem' }}>
                      <Check size={14} color="#10B981" /> Skyline View
                   </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                   <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleBook(room._id)} disabled={bookingLoading}>
                      Reserve Now
                   </button>
                   <button style={{ backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#666', borderRadius: '0.5rem', padding: '0 1rem' }}>
                      <Info size={18} />
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
         <div style={{ textAlign: 'center', padding: '5rem', color: '#444' }}>
            No suites matching your selection are currently vacant.
         </div>
      )}
    </div>
  );
};

export default BookRoom;
