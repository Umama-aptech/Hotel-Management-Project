import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User as UserIcon, Bell, Search } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  // Get Page Title from path
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav style={{ 
      backgroundColor: '#121212', 
      padding: windowWidth <= 768 ? '1rem 1.5rem' : '1.25rem 2.5rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderBottom: '1px solid #2A2A2A',
      zIndex: 50,
      position: 'sticky',
      top: 0,
      minHeight: '70px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: windowWidth <= 768 ? '1rem' : '2rem' }}>
        {windowWidth <= 768 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.5px' }}>
              L<span style={{ color: '#6366f1' }}>S</span>
            </h2>
            <div style={{ width: '1px', height: '20px', backgroundColor: '#333' }}></div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#6366f1' }}>{getPageTitle()}</h3>
          </div>
        ) : (
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{getPageTitle()}</h3>
        )}
        
        {window.innerWidth > 1024 && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: '#555' }} />
            <input 
              type="text" 
              placeholder="Search operations..." 
              style={{ 
                backgroundColor: '#1E1E1E', 
                border: '1px solid #333', 
                borderRadius: '0.75rem', 
                padding: '0.6rem 1rem 0.6rem 2.8rem',
                color: 'white',
                fontSize: '0.85rem',
                width: '280px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: windowWidth <= 768 ? '1rem' : '1.8rem' }}>
        <button style={{ background: 'none', border: 'none', color: '#BBBBBB', cursor: 'pointer', position: 'relative' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: '-2px', right: '-2px', backgroundColor: '#6366f1', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #121212' }}></span>
        </button>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.85rem', 
          paddingRight: windowWidth <= 768 ? '0' : '1rem', 
          borderRight: windowWidth <= 768 ? 'none' : '1px solid #2A2A2A' 
        }}>
          <div style={{ 
            width: '36px', height: '36px', 
            borderRadius: '0.75rem', backgroundColor: '#1E1E1E', 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            color: '#6366f1',
            border: '1px solid #333'
          }}>
            <UserIcon size={18} />
          </div>
          {windowWidth > 768 && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: 'white' }}>{userInfo?.name || 'Staff'}</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{userInfo?.role || 'admin'}</p>
            </div>
          )}
        </div>

        <button 
          onClick={handleLogout}
          style={{
            background: 'rgba(239, 68, 68, 0.1)', 
            border: 'none', 
            cursor: 'pointer',
            padding: windowWidth <= 768 ? '0.5rem' : '0.6rem 1.2rem',
            borderRadius: '0.5rem',
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: '#EF4444', 
            fontWeight: 600,
            fontSize: '0.85rem',
            transition: 'all 0.3s ease'
          }}
        >
          <LogOut size={18} />
          {windowWidth > 768 && 'Logout'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
