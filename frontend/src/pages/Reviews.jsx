import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { MessageSquare, CheckCircle, Archive, Send, Star, X, Clock, User } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [newMessage, setNewMessage] = useState({ guestName: '', rating: 5, message: '' });

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews');
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/reviews/${id}/status`, { status });
      fetchReviews();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleSimulateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', newMessage);
      setShowSimulateModal(false);
      setNewMessage({ guestName: '', rating: 5, message: '' });
      fetchReviews();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '0.2rem' }}>
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            fill={i < rating ? "#FFD700" : "transparent"} 
            color={i < rating ? "#FFD700" : "#333"} 
          />
        ))}
      </div>
    );
  };

  if (loading) return <div style={{ color: '#FFD700', textAlign: 'center', marginTop: '5rem', fontWeight: 600 }}>SYNCHRONIZING GUEST RELATIONS...</div>;

  return (
    <div className="zoom-fade" style={{ paddingBottom: window.innerWidth <= 768 ? '80px' : '0' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: window.innerWidth <= 600 ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: window.innerWidth <= 600 ? 'flex-start' : 'center', 
        marginBottom: '3.5rem',
        gap: '1.5rem'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: window.innerWidth <= 600 ? '1.5rem' : '1.8rem' }}>Guest Relations & Feedback</h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>Monitor and curate the luxury experience through direct guest feedback.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowSimulateModal(true)}
          style={{ width: window.innerWidth <= 600 ? '100%' : 'auto' }}
        >
          <Send size={18} style={{ marginRight: '0.5rem' }} /> Create Guest Entry
        </button>
      </div>

      {showSimulateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          backdropFilter: 'blur(10px)',
          padding: window.innerWidth <= 768 ? '1rem' : '0'
        }}>
          <div className="card zoom-fade" style={{ width: '450px', maxWidth: '100%', border: '1px solid #FFD700', maxHeight: '95vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
               <h3 style={{ margin: 0, color: '#FFD700' }}>Simulate Guest Interaction</h3>
               <button onClick={() => setShowSimulateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSimulateSubmit}>
              <div className="form-group">
                <label>Guest Identity</label>
                <input type="text" className="form-control" placeholder="Full name" value={newMessage.guestName} onChange={(e) => setNewMessage({...newMessage, guestName: e.target.value})} required style={{ backgroundColor: '#121212' }} />
              </div>
              <div className="form-group">
                <label>Experience Rating (1-5)</label>
                <input type="number" min="1" max="5" className="form-control" value={newMessage.rating} onChange={(e) => setNewMessage({...newMessage, rating: e.target.value})} style={{ backgroundColor: '#121212' }} />
              </div>
              <div className="form-group">
                <label>Confidential Message</label>
                <textarea className="form-control" rows="4" placeholder="Detail the guest's experience..." value={newMessage.message} onChange={(e) => setNewMessage({...newMessage, message: e.target.value})} required style={{ backgroundColor: '#121212', resize: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSimulateModal(false)}>Discard</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Dispatch Message</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="responsive-grid">
        {reviews.map(review => (
          <div key={review._id} className="card" style={{ 
            animation: 'fadeIn 0.4s ease',
            backgroundColor: review.status === 'archived' ? 'rgba(30, 30, 30, 0.4)' : '#1E1E1E',
            borderLeft: `3px solid ${review.status === 'unread' ? '#FFD700' : 'transparent'}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <div style={{ backgroundColor: '#121212', padding: '0.6rem', borderRadius: '0.75rem', border: '1px solid #333' }}>
                      <User size={18} color="#FFD700" />
                   </div>
                   <div>
                      <div style={{ fontWeight: 700, color: '#FFF', fontSize: '1rem' }}>{review.guestName}</div>
                      {renderStars(review.rating)}
                   </div>
                </div>
                <div style={{ color: '#666', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                   <Clock size={12} />
                   {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#BBB', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '2rem' }}>
                "{review.message}"
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #2A2A2A', paddingTop: '1.25rem' }}>
              <span className="badge" style={{ 
                border: '1px solid currentColor', 
                color: review.status === 'unread' ? '#FFD700' : '#444',
                fontSize: '0.6rem',
                letterSpacing: '1px'
              }}>
                {review.status.toUpperCase()}
              </span>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {review.status === 'unread' && (
                  <button 
                    onClick={() => handleUpdateStatus(review._id, 'read')} 
                    className="btn btn-secondary" 
                    style={{ padding: '0.4rem 0.6rem', border: '1px solid #333' }}
                    title="Mark Authenticated"
                  >
                    <CheckCircle size={16} color="#10B981" />
                  </button>
                )}
                {review.status !== 'archived' && (
                  <button 
                    onClick={() => handleUpdateStatus(review._id, 'archived')} 
                    className="btn btn-secondary" 
                    style={{ padding: '0.4rem 0.6rem', border: '1px solid #333' }}
                    title="Archive Record"
                  >
                    <Archive size={16} color="#666" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#666' }}>
            No guest interactions currently archived in the luxury database.
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
