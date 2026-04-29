import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Calendar, 
  ArrowRightLeft, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  MoreHorizontal,
  ChevronDown,
  TrendingUp,
  Award
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, trend, icon, isGold }) => (
  <div className="card" style={{ 
    flex: 1, 
    minWidth: '240px', 
    backgroundColor: isGold ? 'rgba(99, 102, 241, 0.05)' : '#1E1E1E',
    border: isGold ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid #333',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {isGold && <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', transform: 'translate(20px, -20px)' }} />}
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h4 style={{ margin: 0, fontSize: '0.75rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h4>
        <p style={{ margin: '0.75rem 0', fontSize: '2.2rem', fontWeight: 700, color: '#FFF' }}>{value}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
           <span style={{ 
             display: 'flex', alignItems: 'center', gap: '0.2rem', 
             color: trend.startsWith('-') ? '#EF4444' : '#FFD700',
             backgroundColor: trend.startsWith('-') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 215, 0, 0.1)',
             padding: '0.2rem 0.5rem',
             borderRadius: '0.4rem',
             fontWeight: 700
           }}>
             {trend.startsWith('-') ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
             {trend.replace('-', '')}
           </span>
           <span style={{ color: '#555', fontSize: '0.7rem' }}>vs last period</span>
        </div>
      </div>
      <div style={{ 
        backgroundColor: '#121212', 
        padding: '0.8rem', 
        borderRadius: '0.75rem',
        color: '#6366f1',
        border: '1px solid #333'
      }}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const fetchDashboardData = async () => {
      try {
        const [statsRes, revenueRes] = await Promise.all([
          api.get('/reports/dashboard'),
          api.get('/reports/revenue')
        ]);
        setStats(statsRes.data);
        
        // Transform recent revenue data for the chart (last 6 data points)
        const chartData = revenueRes.data.revenueByDate.slice(-6).map(item => ({
          month: item.date.split('-').slice(1).join('/'), // Simplistic date format
          revenue: item.amount
        }));
        setRevenueData(chartData);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError("System synchronization failed. Please verify your administrative access.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <div style={{ color: '#6366f1', textAlign: 'center', marginTop: '10rem', fontWeight: 600, letterSpacing: '2px', animation: 'pulse 2s infinite' }}>SYNCHRONIZING GLOBAL OPERATIONS...</div>;

  if (error || !stats) return (
    <div style={{ textAlign: 'center', marginTop: '10rem' }}>
       <div style={{ color: '#EF4444', marginBottom: '1.5rem', fontSize: '1.2rem' }}>{error || 'Data parity error detected.'}</div>
       <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry Synchronization</button>
    </div>
  );

  const totalAvailability = stats.availability.occupied + stats.availability.available + stats.availability.reserved + stats.availability.notReady;
  
  const getWidth = (val) => `${(val / totalAvailability) * 100}%`;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', paddingBottom: windowWidth <= 768 ? '80px' : '0' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: windowWidth <= 768 ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: windowWidth <= 768 ? 'flex-start' : 'flex-end', 
        marginBottom: '2.5rem',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: windowWidth <= 768 ? '1.5rem' : '1.8rem' }}>Welcome Back, Admin</h1>
          <p style={{ color: '#666', margin: '0.5rem 0 0', fontSize: '0.85rem' }}>Here's what's happening at LuxuryStay today.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', width: windowWidth <= 768 ? '100%' : 'auto' }}>
           <div style={{ 
             padding: '0.75rem 1.25rem', 
             backgroundColor: '#1E1E1E', 
             borderRadius: '0.75rem', 
             border: '1px solid #333', 
             display: 'flex', 
             alignItems: 'center', 
             gap: '0.5rem', 
             color: '#BBBBBB', 
             fontSize: '0.85rem',
             width: '100%',
             justifyContent: 'center'
           }}>
              <Calendar size={16} color="#FFD700" />
              May 24, 2028 - May 31, 2028
           </div>
        </div>
      </div>

      {/* Top row stats */}
      <div className="responsive-grid" style={{ marginBottom: '2.5rem' }}>
        <StatCard title="Reservations" value={stats.newBookings} trend={stats.trends.bookings} icon={<Calendar size={20} />} isGold />
        <StatCard title="Arrivals" value={stats.checkIn} trend={stats.trends.checkIn} icon={<ArrowRightLeft size={20} />} />
        <StatCard title="Departures" value={stats.checkOut} trend={stats.trends.checkOut} icon={<ArrowRightLeft size={20} />} />
        <StatCard title="Revenue" value={stats.totalRevenue} trend={stats.trends.revenue} icon={<DollarSign size={20} />} />
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Revenue Graph Card */}
        <div className="card" style={{ flex: 1, minWidth: windowWidth <= 1024 ? '100%' : '500px' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: windowWidth <= 480 ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: windowWidth <= 480 ? 'flex-start' : 'center', 
            marginBottom: '2.5rem',
            gap: '1rem'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Financial Analytics</h3>
              <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem' }}>Revenue performance over the last 6 months</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               <span style={{ fontSize: '0.75rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFD700' }} />
                 Monthly Revenue
               </span>
            </div>
          </div>

          <div style={{ height: windowWidth <= 768 ? '250px' : '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2A2A" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#666', fontWeight: 600 }} 
                  dy={15}
                />
                <YAxis 
                  hide={windowWidth <= 480}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#666', fontWeight: 600 }} 
                  tickFormatter={(val) => `$${val/1000}K`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E1E', borderRadius: '0.75rem', border: '1px solid #333', color: '#FFF', fontSize: '0.85rem', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
                  itemStyle={{ color: '#6366f1', fontWeight: 700 }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Net Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Availability Card */}
        <div className="card" style={{ flex: window.innerWidth <= 1024 ? '1' : '0 0 380px', minWidth: windowWidth <= 768 ? '100%' : '350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Live Inventory</h3>
            <div style={{ color: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', padding: '0.4rem', borderRadius: '0.5rem' }}>
              <TrendingUp size={18} />
            </div>
          </div>

          <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Current room status distribution</p>

          <div style={{ 
            height: '14px', 
            width: '100%', 
            display: 'flex', 
            borderRadius: '10px', 
            overflow: 'hidden',
            backgroundColor: '#121212',
            marginBottom: '2.5rem',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
          }}>
            <div style={{ width: getWidth(stats.availability.occupied), background: 'linear-gradient(90deg, #6366f1, #4f46e5)', transition: 'width 1s ease' }} />
            <div style={{ width: getWidth(stats.availability.reserved), backgroundColor: '#444', transition: 'width 1s ease 0.2s' }} />
            <div style={{ width: getWidth(stats.availability.available), backgroundColor: '#222', borderRight: '1px solid #333', transition: 'width 1s ease 0.4s' }} />
            <div style={{ width: getWidth(stats.availability.notReady), backgroundColor: '#1A1A1A', transition: 'width 1s ease 0.6s' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#6366f1' }} />
                   <span style={{ fontSize: '0.9rem', color: '#BBB' }}>Occupied</span>
                </div>
                <span style={{ fontWeight: 700, color: '#FFF' }}>{stats.availability.occupied}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#444' }} />
                   <span style={{ fontSize: '0.9rem', color: '#BBB' }}>Reserved</span>
                </div>
                <span style={{ fontWeight: 700, color: '#FFF' }}>{stats.availability.reserved}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#222' }} />
                   <span style={{ fontSize: '0.9rem', color: '#BBB' }}>Available</span>
                </div>
                <span style={{ fontWeight: 700, color: '#FFF' }}>{stats.availability.available}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1A1A1A' }} />
                   <span style={{ fontSize: '0.9rem', color: '#BBB' }}>Not Ready</span>
                </div>
                <span style={{ fontWeight: 700, color: '#FFF' }}>{stats.availability.notReady}</span>
             </div>
          </div>

          <div style={{ marginTop: '2.5rem', padding: '1.25rem', backgroundColor: '#121212', borderRadius: '0.75rem', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(99,102,241,0.1)', padding: '0.5rem', borderRadius: '50%' }}>
              <Award size={20} color="#6366f1" />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>
              <span style={{ color: '#6366f1', fontWeight: 700 }}>{stats.availability.occupancyRate} Occupancy Rate</span> achieved this month. Top performance!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
