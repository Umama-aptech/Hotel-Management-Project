import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Save, Info, DollarSign, ShieldAlert, Hotel, Mail, Phone, MapPin, User } from 'lucide-react';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));
  const isAdmin = userInfo?.role === 'admin';
  
  const [formData, setFormData] = useState({
    hotelName: '',
    hotelEmail: '',
    hotelAddress: '',
    hotelPhone: '',
    taxRate: 10,
    cancellationPolicy: '',
    baseRoomPriceMultiplier: 1.0,
    // Profile fields
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin) {
          const { data } = await api.get('/settings');
          if (data) setFormData(prev => ({...prev, ...data}));
        } else {
          const { data } = await api.get('/users/profile');
          if (data) setFormData(prev => ({...prev, name: data.name, email: data.email}));
        }
      } catch (err) {
        console.error("Failed to load settings/profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      if (isAdmin) {
        await api.put('/settings', formData);
        setMessage({ text: 'Global configurations updated successfully.', type: 'success' });
      } else {
        await api.put('/users/profile', {
           name: formData.name,
           email: formData.email,
           password: formData.password
        });
        setMessage({ text: 'Your profile has been updated successfully.', type: 'success' });
      }
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Update failed.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div style={{ color: '#6366f1', textAlign: 'center', marginTop: '5rem', fontWeight: 600 }}>SYNCHRONIZING SECURE DATA...</div>;

  return (
    <div className="zoom-fade" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: window.innerWidth <= 768 ? '80px' : '0' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: window.innerWidth <= 600 ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: window.innerWidth <= 600 ? 'flex-start' : 'center', 
        marginBottom: '3rem',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: window.innerWidth <= 600 ? '1.5rem' : '1.8rem' }}>{isAdmin ? 'System Configurations' : 'My Personal Profile'}</h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            {isAdmin ? 'Fine-tune the operational and financial heart of your luxury establishment.' : 'Manage your identity and security preferences at LuxuryStay.'}
          </p>
        </div>
      </div>
      
      {message.text && (
        <div style={{ 
          padding: '1.25rem', marginBottom: '2.5rem', borderRadius: '0.75rem',
          backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? '#10B981' : '#EF4444',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          textAlign: 'center', fontWeight: 600, fontSize: '0.9rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isAdmin ? (
          <>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid #2A2A2A', paddingBottom: '1rem' }}>
                 <Hotel size={20} color="#6366f1" />
                 <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Brand & Identity</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 600 ? '1fr' : '1fr 1fr', gap: '2rem' }}>
                <div className="form-group">
                  <label><Info size={14} style={{ marginRight: '0.4rem' }} /> Establishment Name</label>
                  <input 
                    type="text" className="form-control" name="hotelName" placeholder="e.g. LuxuryStay Grand Resort"
                    value={formData.hotelName} onChange={handleChange} required
                    style={{ backgroundColor: '#121212' }}
                  />
                </div>
                <div className="form-group">
                  <label><Mail size={14} style={{ marginRight: '0.4rem' }} /> Corporate Email</label>
                  <input 
                    type="email" className="form-control" name="hotelEmail" placeholder="concierge@luxurystay.com"
                    value={formData.hotelEmail} onChange={handleChange} required
                    style={{ backgroundColor: '#121212' }}
                  />
                </div>
                <div className="form-group">
                  <label><Phone size={14} style={{ marginRight: '0.4rem' }} /> Global Contact Number</label>
                  <input 
                    type="text" className="form-control" name="hotelPhone" placeholder="+1 (555) 000-0000"
                    value={formData.hotelPhone} onChange={handleChange}
                    style={{ backgroundColor: '#121212' }}
                  />
                </div>
                <div className="form-group">
                  <label><MapPin size={14} style={{ marginRight: '0.4rem' }} /> Physical Address</label>
                  <input 
                    type="text" className="form-control" name="hotelAddress" placeholder="123 Excellence Blvd, Beverly Hills, CA"
                    value={formData.hotelAddress} onChange={handleChange}
                    style={{ backgroundColor: '#121212' }}
                  />
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid #2A2A2A', paddingBottom: '1rem' }}>
                 <DollarSign size={20} color="#6366f1" />
                 <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Financial Algorithms</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : '1fr 1fr', gap: '2rem' }}>
                <div className="form-group">
                  <label>Standard Taxation (%)</label>
                  <input 
                    type="number" className="form-control" name="taxRate" step="0.1"
                    value={formData.taxRate} onChange={handleChange} required
                    style={{ backgroundColor: '#121212' }}
                  />
                </div>
                <div className="form-group">
                  <label>Market Surge Multiplier</label>
                  <input 
                    type="number" className="form-control" name="baseRoomPriceMultiplier" step="0.1"
                    value={formData.baseRoomPriceMultiplier} onChange={handleChange} required
                    style={{ backgroundColor: '#121212' }}
                  />
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid #2A2A2A', paddingBottom: '1rem' }}>
                 <ShieldAlert size={20} color="#6366f1" />
                 <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Operational Protocols</h3>
              </div>
              <div className="form-group">
                <label>Master Cancellation & Refund Policy</label>
                <textarea 
                  className="form-control" name="cancellationPolicy" rows="6" 
                  value={formData.cancellationPolicy} onChange={handleChange} required
                  style={{ backgroundColor: '#121212', resize: 'none' }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="card" style={{ marginBottom: '3rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid #2A2A2A', paddingBottom: '1rem' }}>
                 <User size={20} color="#6366f1" />
                 <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Personal Information</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 600 ? '1fr' : '1fr 1fr', gap: '2rem' }}>
                <div className="form-group">
                  <label>Display Name</label>
                  <input 
                    type="text" className="form-control" name="name" 
                    value={formData.name} onChange={handleChange} required
                    style={{ backgroundColor: '#121212' }}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" className="form-control" name="email" 
                    value={formData.email} onChange={handleChange} required
                    style={{ backgroundColor: '#121212' }}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: window.innerWidth <= 600 ? 'auto' : '1 / -1' }}>
                  <label>New Password (Optional)</label>
                  <input 
                    type="password" className="form-control" name="password" placeholder="Leave blank to keep current"
                    value={formData.password} onChange={handleChange} 
                    style={{ backgroundColor: '#121212' }}
                  />
                </div>
              </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '4rem' }}>
          <button type="submit" className="btn btn-primary" style={{ width: window.innerWidth <= 480 ? '100%' : 'auto', padding: '1rem 3rem', gap: '0.75rem' }} disabled={saving}>
            {saving ? 'Synchronizing...' : <><Save size={20} /> Commit Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
