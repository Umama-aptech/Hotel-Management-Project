import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Landmark, ArrowUpRight } from 'lucide-react';

const COLORS = ['#FFD700', '#C0C0C0', '#B8860B', '#444444', '#1E1E1E'];

const Reports = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [occupancyData, setOccupancyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [revenueRes, occupancyRes] = await Promise.all([
          api.get('/reports/revenue'),
          api.get('/reports/occupancy')
        ]);
        setRevenueData(revenueRes.data);
        setOccupancyData(occupancyRes.data);
      } catch (err) {
        console.error("Error fetching reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#1E1E1E', border: '1px solid #FFD700', padding: '0.75rem', borderRadius: '0.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>{label}</p>
          <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', fontWeight: 700, color: '#FFD700' }}>
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div style={{ color: '#FFD700', textAlign: 'center', marginTop: '5rem', fontWeight: 600 }}>AGGREGATING GLOBAL ANALYTICS...</div>;

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
          <h2 style={{ margin: 0, fontSize: window.innerWidth <= 600 ? '1.5rem' : '1.8rem' }}>Business Intelligence</h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>Comprehensive performance metrics and revenue distribution.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', width: window.innerWidth <= 600 ? '100%' : 'auto' }}>
           <div style={{ 
             flex: 1,
             padding: '0.75rem 1.25rem', backgroundColor: '#1E1E1E', borderRadius: '0.75rem', 
             border: '1px solid #333', display: 'flex', alignItems: 'center', 
             gap: '0.6rem', color: '#FFD700', fontSize: '0.85rem', fontWeight: 700,
             justifyContent: 'center'
           }}>
              <TrendingUp size={16} /> LIVE DATA
           </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', flexDirection: window.innerWidth <= 1024 ? 'column' : 'row' }}>
        <div className="card" style={{ flex: 2, minWidth: '300px', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
             <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Revenue Trajectory (7 Days)</h3>
             <ArrowUpRight size={18} color="#FFD700" />
          </div>
          <div style={{ height: window.innerWidth <= 480 ? '250px' : '350px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData?.revenueByDate || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2A2A" />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis hide={window.innerWidth <= 480} tickFormatter={(value) => `$${value}`} tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255, 215, 0, 0.05)'}} />
                <Bar dataKey="amount" fill="#FFD700" radius={[4, 4, 0, 0]} barSize={window.innerWidth <= 480 ? 25 : 40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ flex: 1, minWidth: '350px', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
             <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Asset Occupancy</h3>
             <PieIcon size={18} color="#FFD700" />
          </div>
          <div style={{ height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {occupancyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1500}
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    formatter={(value) => <span style={{ color: '#BBB', fontSize: '0.8rem', textTransform: 'uppercase' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <p style={{color: '#444', fontSize: '0.9rem'}}>No inventory data located.</p>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: window.innerWidth <= 768 ? '0.5rem' : '1.5rem' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem' }}>
            <Landmark size={20} color="#FFD700" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Financial Ecosystem Distribution</h3>
         </div>
         <div className="table-container">
           <table>
              <thead>
                 <tr>
                   <th>Payment Channel</th>
                   <th style={{ textAlign: 'right' }}>Cumulative Investment Volume</th>
                 </tr>
              </thead>
              <tbody>
                 {revenueData?.revenueByMethod?.map((method, index) => (
                    <tr key={index}>
                       <td style={{ color: '#BBB', fontWeight: 600 }}>{method.name.toUpperCase()}</td>
                       <td style={{ textAlign: 'right', fontWeight: 700, color: '#FFF', fontSize: '1.1rem' }}>${method.value.toLocaleString()}</td>
                    </tr>
                 ))}
                 <tr>
                    <td style={{ fontWeight: 700, borderTop: '2px solid #333', paddingTop: '2rem', color: '#666', fontSize: '0.8rem', textTransform: 'uppercase' }}>Consolidated All-Time Revenue</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, fontSize: window.innerWidth <= 480 ? '1.5rem' : '2rem', color: '#FFD700', borderTop: '2px solid #FFD700', paddingTop: '2rem' }}>
                      ${revenueData?.totalRevenue?.toLocaleString()}
                    </td>
                 </tr>
              </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};

export default Reports;
