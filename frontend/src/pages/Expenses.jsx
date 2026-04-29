import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Filter, 
  Search, 
  ChevronDown, 
  Download, 
  Eye,
  X,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#FFD700', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#F59E0B'];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: '',
    category: 'Salaries and Wages',
    quantity: 1,
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    status: 'Completed'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesRes, statsRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/expenses/stats')
      ]);
      setExpenses(expensesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', newExpense);
      setShowAddModal(false);
      setNewExpense({
        name: '',
        category: 'Salaries and Wages',
        quantity: 1,
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        status: 'Completed'
      });
      fetchData();
    } catch (err) {
      alert("Failed to add expense");
    }
  };

  if (loading) return <div style={{ color: '#FFD700', textAlign: 'center', marginTop: '5rem', fontWeight: 600 }}>SYNCHRONIZING FINANCIAL RECORDS...</div>;

  return (
    <div className="zoom-fade" style={{ paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Expense Management</h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>Monitor and control operational expenditures.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add New Expense
        </button>
      </div>

      {/* Stats Row */}
      <div className="responsive-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ flex: 1 }}>
          <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>Total Balance</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#FFF' }}>${stats?.totalBalance?.toLocaleString()}</div>
          <div style={{ color: '#FFD700', fontSize: '0.8rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <TrendingUp size={14} /> +3.56% <span style={{ color: '#555' }}>from last week</span>
          </div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>Total Income</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#FFF' }}>${stats?.totalIncome?.toLocaleString()}</div>
          <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <TrendingDown size={14} /> -1.25% <span style={{ color: '#555' }}>from last week</span>
          </div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>Total Expenses</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#FFF' }}>${stats?.totalExpenses?.toLocaleString()}</div>
          <div style={{ color: '#FFD700', fontSize: '0.8rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <TrendingUp size={14} /> +4.79% <span style={{ color: '#555' }}>from last week</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ minHeight: '400px' }}>
          <h3 style={{ margin: '0 0 2rem', fontSize: '1.2rem' }}>Earnings Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Jan', income: 4000, expense: 2400 },
              { name: 'Feb', income: 3000, expense: 1398 },
              { name: 'Mar', income: 2000, expense: 9800 },
              { name: 'Apr', income: 2780, expense: 3908 },
              { name: 'May', income: 1890, expense: 4800 },
              { name: 'Jun', income: 2390, expense: 3800 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2A2A" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#666'}} />
              <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }} />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="income" fill="#FFD700" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#1E4D2B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ minHeight: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Expense Breakdown</h3>
            <PieChartIcon color="#666" />
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.breakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats?.breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '1rem' }}>
            {stats?.breakdown.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#AAA', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }} />
                  {item.name}
                </span>
                <span style={{ color: '#FFF', fontWeight: 600 }}>${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Transactions</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input type="text" placeholder="Search expense..." className="form-control" style={{ paddingLeft: '2.5rem', width: '250px', backgroundColor: '#121212' }} />
            </div>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #333' }}>
              <Filter size={16} /> All Category <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Expense Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp._id}>
                  <td>{exp.name}</td>
                  <td style={{ color: '#666' }}>{exp.category}</td>
                  <td>{exp.quantity}</td>
                  <td style={{ fontWeight: 700, color: '#FFF' }}>${exp.amount.toLocaleString()}</td>
                  <td>{new Date(exp.expenseDate).toLocaleDateString()}</td>
                  <td>
                    <span className="badge" style={{ 
                      backgroundColor: exp.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: exp.status === 'Completed' ? '#10B981' : '#F59E0B'
                    }}>
                      {exp.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem', border: '1px solid #333' }}><Eye size={14} /></button>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem', border: '1px solid #333' }}><Download size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          <div className="card zoom-fade" style={{ width: '500px', maxWidth: '95%', border: '1px solid #FFD700' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, color: '#FFD700' }}>Add New Expense</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label>Expense Detail Name</label>
                <input type="text" className="form-control" required value={newExpense.name} onChange={e => setNewExpense({...newExpense, name: e.target.value})} style={{ backgroundColor: '#121212' }} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} style={{ backgroundColor: '#121212' }}>
                  <option>Salaries and Wages</option>
                  <option>Utilities</option>
                  <option>Maintenance and Repairs</option>
                  <option>Supplies</option>
                  <option>Marketing and Advertising</option>
                  <option>Miscellaneous</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" className="form-control" required value={newExpense.quantity} onChange={e => setNewExpense({...newExpense, quantity: e.target.value})} style={{ backgroundColor: '#121212' }} />
                </div>
                <div className="form-group">
                  <label>Amount ($)</label>
                  <input type="number" className="form-control" required value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} style={{ backgroundColor: '#121212' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
