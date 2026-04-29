import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GuestDashboard from './pages/GuestDashboard';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';
import BookRoom from './pages/BookRoom';
import MyBookings from './pages/MyBookings';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Reviews from './pages/Reviews';
import Expenses from './pages/Expenses';
import Chatbot from './components/Chatbot/Chatbot';

// Import CSS
import './index.css';

const PrivateRoute = ({ children, roles }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (!userInfo) return <Navigate to="/login" />;
  if (roles && !roles.includes(userInfo.role)) return <Navigate to="/dashboard" />;
  return children;
};

const AppLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

import Home from './pages/Home';
import RoomsList from './pages/RoomsList';
import RoomDetails from './pages/RoomDetails';
import GuestBooking from './pages/GuestBooking';
import Register from './pages/Register';
import Contact from './pages/Contact';
import WebLayout from './components/WebLayout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Guest Website Routes */}
        <Route path="/" element={<WebLayout><Home /></WebLayout>} />
        <Route path="/explore-rooms" element={<WebLayout><RoomsList /></WebLayout>} />
        <Route path="/rooms/:id" element={<WebLayout><RoomDetails /></WebLayout>} />
        <Route path="/guest-booking" element={<WebLayout><GuestBooking /></WebLayout>} />
        <Route path="/contact" element={<WebLayout><Contact /></WebLayout>} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            {JSON.parse(localStorage.getItem('userInfo'))?.role === 'admin' ? (
              <AppLayout><Dashboard /></AppLayout>
            ) : (
              <WebLayout><GuestDashboard /></WebLayout>
            )}
          </PrivateRoute>
        } />

        <Route path="/rooms" element={
          <PrivateRoute roles={['admin']}>
            <AppLayout>
              <Rooms />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/bookings" element={
          <PrivateRoute roles={['admin']}>
            <AppLayout>
              <Bookings />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/book-room" element={
          <PrivateRoute roles={['guest']}>
            <AppLayout>
              <BookRoom />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/my-bookings" element={
          <PrivateRoute roles={['guest']}>
            <AppLayout>
              <MyBookings />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/billing" element={
          <PrivateRoute roles={['admin']}>
            <AppLayout>
              <Billing />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/reports" element={
          <PrivateRoute roles={['admin']}>
            <AppLayout>
              <Reports />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/settings" element={
          <PrivateRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/reviews" element={
          <PrivateRoute roles={['admin']}>
            <AppLayout>
              <Reviews />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/expenses" element={
          <PrivateRoute roles={['admin']}>
            <AppLayout>
              <Expenses />
            </AppLayout>
          </PrivateRoute>
        } />
      </Routes>
      <Chatbot />
    </Router>
  );
};

export default App;
