import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BedDouble, 
  CalendarCheck, 
  FileText, 
  Settings, 
  CreditCard, 
  MessageSquare,
  ChevronLeft,
  Menu,
  ArrowUpRight
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isAdmin = userInfo?.role === 'admin';

  React.useEffect(() => {
    const handleResize = () => setIsMobile(windowWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = isCollapsed ? '80px' : '260px';

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    color: '#BBBBBB',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '0.75rem',
    margin: '0.25rem 1rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  };

  const activeStyle = {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    color: '#6366f1',
    boxShadow: 'inset 0 0 10px rgba(99, 102, 241, 0.05)',
    borderLeft: '4px solid #6366f1'
  };

  return (
    <aside className={isMobile ? 'sidebar-mobile' : ''} style={{
      width: isMobile ? '0' : sidebarWidth,
      backgroundColor: '#121212',
      color: 'white',
      display: isMobile ? 'none' : 'flex',
      flexDirection: 'column',
      height: '100vh',
      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      borderRight: '1px solid #2A2A2A',
      zIndex: 100,
      position: 'relative',
      visibility: isMobile ? 'hidden' : 'visible'
    }}>
      {/* Brand Header */}
      <div style={{ 
        padding: '2rem 1rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isCollapsed ? 'center' : 'space-between',
        borderBottom: '1px solid #2A2A2A',
        minHeight: '100px'
      }}>
        {!isCollapsed && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, letterSpacing: '1px' }}>
              LUXURY<span style={{ color: '#6366f1' }}>STAY</span>
            </h2>
            <p style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.2rem' }}>
              Excellence Reimagined
            </p>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ 
            background: 'rgba(99, 102, 241, 0.1)', 
            border: '1px solid rgba(99, 102, 241, 0.2)', 
            color: '#6366f1',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden' }}>
        <NavLink to="/dashboard" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
          <Home size={22} />
          {!isCollapsed && <span>{isAdmin ? 'Dashboard' : 'My Stay'}</span>}
        </NavLink>

        {!isAdmin ? (
          <>
            <NavLink to="/book-room" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
              <BedDouble size={22} />
              {!isCollapsed && <span>Book a Room</span>}
            </NavLink>

            <NavLink to="/my-bookings" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
              <CalendarCheck size={22} />
              {!isCollapsed && <span>My Bookings</span>}
            </NavLink>

            <NavLink to="/settings" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
              <Settings size={22} />
              {!isCollapsed && <span>My Profile</span>}
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/rooms" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
              <BedDouble size={22} />
              {!isCollapsed && <span>Inventory</span>}
            </NavLink>

            <NavLink to="/bookings" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
              <CalendarCheck size={22} />
              {!isCollapsed && <span>Reservations</span>}
            </NavLink>

            <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.65rem', color: '#555', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              {!isCollapsed ? 'Financials' : '---'}
            </div>

            <NavLink to="/billing" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
              <CreditCard size={22} />
              {!isCollapsed && <span>Invoice</span>}
            </NavLink>

            <NavLink to="/expenses" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
              <FileText size={22} />
              {!isCollapsed && <span>Expenses</span>}
            </NavLink>

            <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.65rem', color: '#555', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              {!isCollapsed ? 'Management' : '---'}
            </div>
            
            <NavLink to="/reports" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
              <ArrowUpRight size={22} />
              {!isCollapsed && <span>Analytics</span>}
            </NavLink>
            
            <NavLink to="/settings" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
              <Settings size={22} />
              {!isCollapsed && <span>Systems</span>}
            </NavLink>

            <NavLink to="/reviews" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
              <MessageSquare size={22} />
              {!isCollapsed && <span>Guest Relations</span>}
            </NavLink>
          </>
        )}
      </nav>
      
      {/* Footer */}
      {!isCollapsed && (
        <div style={{ padding: '1.5rem', borderTop: '1px solid #2A2A2A', fontSize: '0.7rem', color: '#444', textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} LUXURYSTAY HMS
        </div>
      )}
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70px',
          backgroundColor: 'rgba(18, 18, 18, 0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid #2A2A2A',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 1000,
          padding: '0 0.5rem',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
        }}>
          <NavLink to="/dashboard" style={({ isActive }) => ({ ...linkStyle, margin: 0, padding: '0.5rem', flex: 1, justifyContent: 'center', color: isActive ? '#6366f1' : '#666', borderLeft: 'none', background: 'none' })}>
            <Home size={24} />
          </NavLink>
          <NavLink to={isAdmin ? "/rooms" : "/book-room"} style={({ isActive }) => ({ ...linkStyle, margin: 0, padding: '0.5rem', flex: 1, justifyContent: 'center', color: isActive ? '#6366f1' : '#666', borderLeft: 'none', background: 'none' })}>
            <BedDouble size={24} />
          </NavLink>
          <NavLink to={isAdmin ? "/bookings" : "/my-bookings"} style={({ isActive }) => ({ ...linkStyle, margin: 0, padding: '0.5rem', flex: 1, justifyContent: 'center', color: isActive ? '#6366f1' : '#666', borderLeft: 'none', background: 'none' })}>
            <CalendarCheck size={24} />
          </NavLink>
          <NavLink to="/settings" style={({ isActive }) => ({ ...linkStyle, margin: 0, padding: '0.5rem', flex: 1, justifyContent: 'center', color: isActive ? '#6366f1' : '#666', borderLeft: 'none', background: 'none' })}>
            <Settings size={24} />
          </NavLink>
          {isAdmin && (
            <NavLink to="/reviews" style={({ isActive }) => ({ ...linkStyle, margin: 0, padding: '0.5rem', flex: 1, justifyContent: 'center', color: isActive ? '#6366f1' : '#666', borderLeft: 'none', background: 'none' })}>
              <MessageSquare size={24} />
            </NavLink>
          )}
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;
