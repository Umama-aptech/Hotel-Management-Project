import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BedDouble, Mail, Lock, User, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/register',
        { 
          name: formData.name, 
          email: formData.email, 
          password: formData.password,
          role: 'guest' // Default role for public registration
        }
      );
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', minHeight: '100vh', width: '100vw', 
      backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div className="card zoom-fade" style={{ 
        width: '100%', maxWidth: '500px', 
        padding: '3rem', 
        background: 'rgba(20, 20, 20, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            display: 'inline-flex', justifyContent: 'center', alignItems: 'center', 
            background: 'rgba(99, 102, 241, 0.1)', 
            padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <BedDouble size={40} color="#6366f1" />
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'white' }}>
            Join <span>LUXURYSTAY</span>
          </h1>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
            Start your journey of unparalleled comfort and elegance.
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', 
            padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', 
            textAlign: 'center', fontSize: '0.85rem', border: '1px solid rgba(239, 68, 68, 0.2)' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>
              <User size={14} /> Full Name
            </label>
            <input
              type="text"
              placeholder="Ex. Julianne Moore"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              placeholder="Ex. julianne@luxury.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>
              <Lock size={14} /> Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
              style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: '100%', marginTop: '1rem', padding: '18px', borderRadius: '16px', 
              background: '#6366f1', color: 'white', fontWeight: 800, fontSize: '1rem', 
              border: 'none', cursor: 'pointer', transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
            disabled={loading}
          >
            {loading ? 'Processing...' : <><UserPlus size={20} /> Create Account</>}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '14px', color: '#9ca3af' }}>
          Already have an account? <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 700 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
