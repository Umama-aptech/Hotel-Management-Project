import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, X, Calendar, User, Home, Receipt, UserCheck } from 'lucide-react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [newBooking, setNewBooking] = useState({
    guestId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, roomsRes, guestsRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/rooms'),
        api.get('/users')
      ]);
      setBookings(bookingsRes.data);
      setRooms(roomsRes.data.filter(r => r.status === 'available' || r.status === 'cleaning'));
      setGuests(guestsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: newStatus });
      fetchData(); 
    } catch (err) {
      console.error(err);
      alert('Failed to update booking status');
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    try {
      await api.post('/bookings', newBooking);
      setFormSuccess('Reservation confirmed successfully!');
      setTimeout(() => {
        setShowModal(false);
        setNewBooking({ guestId: '', roomId: '', checkInDate: '', checkOutDate: '' });
        fetchData();
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create booking. Ensure dates are valid.');
    }
  };

  const getStatusBadge = (status) => {
    const baseStyle = { border: '1px solid currentColor', backgroundColor: 'transparent' };
    switch(status) {
      case 'confirmed': return <span className="badge" style={{ ...baseStyle, color: '#3B82F6' }}>Confirmed</span>;
      case 'checked-in': return <span className="badge" style={{ ...baseStyle, color: '#10B981' }}>In Residence</span>;
      case 'completed': return <span className="badge" style={{ ...baseStyle, color: '#F59E0B' }}>Finalized</span>;
      case 'cancelled': return <span className="badge" style={{ ...baseStyle, color: '#EF4444' }}>Cancelled</span>;
      default: return <span className="badge" style={baseStyle}>{status}</span>;
    }
  };

  if (loading) return <div style={{ color: '#FFD700', textAlign: 'center', marginTop: '5rem', fontWeight: 600 }}>RETRIEVING RESERVATION DATA...</div>;

  return (
    <div className="zoom-fade" style={{ paddingBottom: window.innerWidth <= 768 ? '80px' : '0' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: window.innerWidth <= 600 ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: window.innerWidth <= 600 ? 'flex-start' : 'center', 
        marginBottom: '3rem',
        gap: '1.5rem'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: window.innerWidth <= 600 ? '1.5rem' : '1.8rem' }}>Guest Reservations</h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>Overview of all upcoming and active guest stays.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => { setShowModal(true); setFormSuccess(''); setFormError(''); }}
          style={{ width: window.innerWidth <= 600 ? '100%' : 'auto' }}
        >
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> New Reservation
        </button>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          backdropFilter: 'blur(8px)',
          padding: window.innerWidth <= 768 ? '1rem' : '0'
        }}>
          <div className="card zoom-fade" style={{ width: '550px', maxWidth: '100%', border: '1px solid #FFD700', maxHeight: '95vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, color: '#FFD700', letterSpacing: '1px' }}>New Reservation Entry</h3>
              <button 
                onClick={() => setShowModal(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
              >
                <X size={24}/>
              </button>
            </div>
            
            {formError && (
              <div style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', 
                padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', 
                textAlign: 'center', fontSize: '0.85rem', border: '1px solid rgba(239, 68, 68, 0.2)' 
              }}>
                {formError}
              </div>
            )}
            {formSuccess && (
              <div style={{ 
                backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', 
                padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', 
                textAlign: 'center', fontSize: '0.85rem', border: '1px solid rgba(16, 185, 129, 0.2)' 
              }}>
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleCreateBooking}>
              <div className="form-group">
                <label><User size={14} style={{ marginRight: '0.4rem' }} /> Registered Guest</label>
                <select 
                  className="form-control" required
                  value={newBooking.guestId} onChange={(e) => setNewBooking({...newBooking, guestId: e.target.value})}
                  style={{ backgroundColor: '#121212' }}
                >
                  <option value="">Search for a guest portfolio...</option>
                  {guests.map(g => (
                    <option key={g._id} value={g._id}>{g.name} — {g.email}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label><Home size={14} style={{ marginRight: '0.4rem' }} /> Suite Assignment</label>
                <select 
                  className="form-control" required
                  value={newBooking.roomId} onChange={(e) => setNewBooking({...newBooking, roomId: e.target.value})}
                  style={{ backgroundColor: '#121212' }}
                >
                  <option value="">Select an available suite...</option>
                  {rooms.map(r => (
                    <option key={r._id} value={r._id}>#{r.roomNumber} — {r.roomType} (${r.price}/night)</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label><Calendar size={14} style={{ marginRight: '0.4rem' }} /> Arrival</label>
                  <input type="date" className="form-control" required
                    value={newBooking.checkInDate} onChange={(e) => setNewBooking({...newBooking, checkInDate: e.target.value})}
                    style={{ backgroundColor: '#121212' }}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label><Calendar size={14} style={{ marginRight: '0.4rem' }} /> Departure</label>
                  <input type="date" className="form-control" required min={newBooking.checkInDate}
                    value={newBooking.checkOutDate} onChange={(e) => setNewBooking({...newBooking, checkOutDate: e.target.value})}
                    style={{ backgroundColor: '#121212' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ padding: '0.8rem 1.5rem' }}>Discard</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Confirm & Register</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: window.innerWidth <= 768 ? '0.5rem' : '1rem' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Guest Portfolio</th>
                <th>Suite</th>
                <th style={{ display: window.innerWidth <= 768 ? 'none' : 'table-cell' }}>Stay Period</th>
                <th>Investment</th>
                <th>Stage</th>
                <th>Management</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ backgroundColor: '#2A2A2A', padding: '0.5rem', borderRadius: '0.5rem', color: '#FFD700', display: window.innerWidth <= 480 ? 'none' : 'block' }}>
                        <User size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#FFF' }}>{booking.guestId?.name || 'Legacy Portfolio'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>{booking.guestId?.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                     <div style={{ color: '#FFD700', fontSize: '0.85rem', fontWeight: 600 }}>#{booking.roomId?.roomNumber || 'Del.'}</div>
                     <div style={{ fontSize: '0.7rem', color: '#666' }}>{booking.roomId?.roomType || 'Unknown'}</div>
                  </td>
                  <td style={{ display: window.innerWidth <= 768 ? 'none' : 'table-cell' }}>
                     <div style={{ fontSize: '0.85rem', color: '#BBB' }}>{new Date(booking.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(booking.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                     <div style={{ fontSize: '0.7rem', color: '#666' }}>{Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))} Nights</div>
                  </td>
                  <td>
                     <div style={{ fontWeight: 700, color: '#FFF' }}>${booking.totalPrice?.toLocaleString()}</div>
                     <div style={{ fontSize: '0.7rem', color: '#666', display: window.innerWidth <= 1024 ? 'none' : 'flex', alignItems: 'center', gap: '0.2rem' }}><Receipt size={10} /> Billing Active</div>
                  </td>
                  <td>{getStatusBadge(booking.bookingStatus)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserCheck size={14} color="#666" style={{ display: window.innerWidth <= 1024 ? 'none' : 'block' }} />
                      <select 
                        className="form-control" 
                        style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.8rem', backgroundColor: '#121212' }}
                        value={booking.bookingStatus}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      >
                        <option value="pending">Awaiting Arrival</option>
                        <option value="confirmed">Confirm Portfolio</option>
                        <option value="checked-in">Register Entrance</option>
                        <option value="completed">Finalize Exit</option>
                        <option value="cancelled">Void Contract</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: '4rem', color: '#666' }}>
                    No active reservations detected in the luxury network.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
