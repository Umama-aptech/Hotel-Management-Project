import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BedDouble, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) navigate('/dashboard');
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password }
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
      display: 'flex', height: '100vh', width: '100vw', 
      backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center',
      backgroundImage: 'linear-gradient(rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.8)), url("/assets/login-bg.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="card zoom-fade" style={{ 
        width: '95%', maxWidth: '450px', 
        minHeight: window.innerWidth <= 480 ? '550px' : '650px', 
        padding: window.innerWidth <= 480 ? '2.5rem 1.5rem' : '4rem 3.5rem', 
        backdropFilter: 'blur(15px)', backgroundColor: 'rgba(30,30,30,0.8)',
        border: '1px solid rgba(255, 215, 0, 0.2)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        margin: '1rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: window.innerWidth <= 480 ? '2rem' : '3rem' }}>
          <div style={{ 
            display: 'inline-flex', justifyContent: 'center', alignItems: 'center', 
            background: 'linear-gradient(135deg, #FFD700, #B8860B)', 
            padding: window.innerWidth <= 480 ? '0.8rem' : '1.2rem', borderRadius: '1rem', marginBottom: '1.5rem',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
          }}>
            <BedDouble size={window.innerWidth <= 480 ? 30 : 40} color="black" />
          </div>
          <h1 style={{ margin: 0, fontSize: window.innerWidth <= 480 ? '1.8rem' : '2.2rem', letterSpacing: '2px', fontWeight: 700 }}>
            LUXURY<span style={{ color: '#FFD700' }}>STAY</span>
          </h1>
          <p style={{ color: '#BBBBBB', marginTop: '0.75rem', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
            Enter your credentials to access the pinnacle of hospitality management.
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', 
            padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', 
            textAlign: 'center', fontSize: '0.85rem', border: '1px solid rgba(239, 68, 68, 0.2)' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} /> Email Address
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. admin@luxurystay.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderColor: '#333' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} /> Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderColor: '#333' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem', height: '55px', fontSize: '1rem', gap: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : <><LogIn size={20} /> Sign In to Dashboard</>}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.8rem', color: '#666' }}>
          <p style={{ marginBottom: '0.5rem' }}>Managed by Excellence Systems &trade;</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', opacity: 0.5 }}>
            <span>Privacy Policy</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
