import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Plus, Bed, Layers, DollarSign, Settings2, Search, Filter, 
  ChevronRight, Maximize2, Users, Star, CheckCircle2, 
  Wind, Tv, Coffee, ShieldCheck, Edit3, X, Image as ImageIcon
} from 'lucide-react';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    roomType: 'Standard',
    price: '',
    bedrooms: 1,
    sqm: 25,
    bedType: 'Queen Bed',
    guestCount: 2,
    description: '',
    features: ['Private balcony', 'Work desk'],
    facilities: ['High-speed Wi-Fi', 'Air conditioning'],
    amenities: ['Luxury toiletries', 'Premium bedding']
  });

  const fetchRooms = async () => {
    try {
      const { data } = await api.get('/rooms');
      setRooms(data);
      if (data.length > 0 && !selectedRoom) setSelectedRoom(data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rooms', newRoom);
      setShowAddForm(false);
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRooms = rooms.filter(r => 
    (filterType === 'All' || r.roomType === filterType) &&
    (r.roomNumber.includes(searchTerm) || r.roomType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div style={{ color: '#6366f1', textAlign: 'center', marginTop: '10rem', fontWeight: 600, letterSpacing: '2px' }}>CURATING INVENTORY...</div>;

  return (
    <div className="zoom-fade" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      {/* Top Header & Actions */}
      <div style={{ 
        display: 'flex', 
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center', 
        marginBottom: '2rem',
        gap: '1.5rem'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: window.innerWidth <= 768 ? '1.5rem' : '1.8rem' }}>Asset Management</h2>
          <p style={{ color: '#666', fontSize: '0.85rem' }}>Inventory overview and detailed suite specifications.</p>
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
          gap: '1rem',
          width: window.innerWidth <= 768 ? '100%' : 'auto'
        }}>
           <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
              <input 
                type="text" 
                placeholder="Search suites..." 
                className="form-control"
                style={{ paddingLeft: '3rem', width: '100%', backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <select 
             className="form-control" 
             style={{ width: window.innerWidth <= 480 ? '100%' : '150px', backgroundColor: '#1E1E1E', border: '1px solid #333' }}
             value={filterType}
             onChange={(e) => setFilterType(e.target.value)}
           >
              <option value="All">All Categories</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Family">Family</option>
           </select>
           <button className="btn btn-primary" onClick={() => setShowAddForm(true)} style={{ width: window.innerWidth <= 480 ? '100%' : 'auto', whiteSpace: 'nowrap' }}>
             <Plus size={18} /> Add New Asset
           </button>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: window.innerWidth <= 1024 ? 'column' : 'row',
        gap: '2rem', 
        flex: 1, 
        overflow: 'hidden' 
      }}>
        {/* Left List Pane */}
        <div style={{ 
          flex: window.innerWidth <= 1024 ? 'none' : '0 0 450px', 
          overflowY: 'auto', 
          paddingRight: window.innerWidth <= 1024 ? '0' : '1rem', 
          display: selectedRoom && window.innerWidth <= 1024 ? 'none' : 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          maxHeight: window.innerWidth <= 1024 ? 'none' : '100%'
        }}>
          {filteredRooms.map(room => (
            <div 
              key={room._id} 
              className="card" 
              onClick={() => setSelectedRoom(room)}
              style={{ 
                padding: '1rem', 
                cursor: 'pointer', 
                border: selectedRoom?._id === room._id ? '1px solid #6366f1' : '1px solid #2A2A2A',
                backgroundColor: selectedRoom?._id === room._id ? 'rgba(99, 102, 241, 0.03)' : '#1E1E1E',
                transition: 'all 0.3s ease',
                display: 'flex',
                gap: '1.2rem'
              }}
            >
              <div style={{ width: '120px', height: '100px', backgroundColor: '#121212', borderRadius: '0.75rem', overflow: 'hidden', flexShrink: 0 }}>
                 {room.images?.[0] ? (
                   <img src={room.images[0]} alt="Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 ) : (
                   <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bed size={32} color="#333" />
                   </div>
                 )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{room.roomType} Suite</h4>
                  <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: 700 }}>#{room.roomNumber}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', color: '#666', fontSize: '0.75rem', marginBottom: '0.8rem' }}>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Maximize2 size={12}/> {room.sqm || 25} m²</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Bed size={12}/> {room.bedType || 'Queen'}</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={12}/> {room.guestCount || 2}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ color: '#6366f1', fontSize: '1.2rem', fontWeight: 700 }}>${room.price}<span style={{ fontSize: '0.7rem', color: '#444' }}>/night</span></div>
                   <span className="badge" style={{ 
                     color: room.status === 'available' ? '#10B981' : room.status === 'occupied' ? '#EF4444' : '#F59E0B',
                     border: '1px solid currentColor',
                     fontSize: '0.65rem'
                   }}>
                     {room.status.toUpperCase()}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Detail Pane */}
        <div className="card" style={{ 
          flex: 1, 
          overflowY: 'auto', 
          position: 'relative', 
          padding: window.innerWidth <= 768 ? '1.5rem' : '2.5rem',
          display: !selectedRoom && window.innerWidth <= 1024 ? 'none' : 'block'
        }}>
          {selectedRoom ? (
            <div className="zoom-fade">
              {window.innerWidth <= 1024 && (
                <button 
                  onClick={() => setSelectedRoom(null)}
                  style={{ marginBottom: '1.5rem', background: 'none', border: 'none', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  <ChevronLeft size={18} /> Back to List
                </button>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                 <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                       <h2 style={{ margin: 0, fontSize: '2.2rem' }}>{selectedRoom.roomType} Room</h2>
                       <span style={{ 
                         backgroundColor: selectedRoom.status === 'available' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                         color: selectedRoom.status === 'available' ? '#10B981' : '#EF4444',
                         padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, border: '1px solid currentColor'
                       }}>
                         {selectedRoom.status.toUpperCase()}
                       </span>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Room Designation: <span style={{ color: '#6366f1', fontWeight: 700 }}>#{selectedRoom.roomNumber}</span> | Managed Asset ID: {selectedRoom._id.slice(-8).toUpperCase()}</p>
                 </div>
                 <button className="btn btn-secondary" style={{ border: '1px solid #FFD700', color: '#FFD700' }}>
                    <Edit3 size={18} style={{ marginRight: '0.5rem' }} /> Edit Details
                 </button>
              </div>

              {/* Image Gallery Mockup */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth <= 600 ? '1fr' : '2fr 1fr', 
                gap: '1rem', 
                marginBottom: '3rem', 
                height: window.innerWidth <= 600 ? 'auto' : '400px' 
              }}>
                 <div style={{ backgroundColor: '#121212', borderRadius: '1.5rem', overflow: 'hidden', height: window.innerWidth <= 600 ? '250px' : 'auto' }}>
                    <img src={selectedRoom.images?.[0] || 'https://via.placeholder.com/800x600?text=Room+Master'} alt="Master" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 </div>
                 <div style={{ 
                   display: window.innerWidth <= 600 ? 'none' : 'flex', 
                   flexDirection: 'column', 
                   gap: '1rem' 
                 }}>
                    <div style={{ flex: 1, backgroundColor: '#121212', borderRadius: '1rem', overflow: 'hidden' }}>
                       <img src={selectedRoom.images?.[1] || 'https://via.placeholder.com/400x300?text=Bath'} alt="Support" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, backgroundColor: '#121212', borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
                       <img src={selectedRoom.images?.[2] || 'https://via.placeholder.com/400x300?text=View'} alt="Support" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <div style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             <ImageIcon size={18} /> VIEW GALLERY
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Tech Specs */}
              <div style={{ 
                display: 'flex', 
                flexDirection: window.innerWidth <= 550 ? 'column' : 'row',
                gap: window.innerWidth <= 550 ? '1rem' : '3rem', 
                padding: window.innerWidth <= 550 ? '1.5rem' : '1.5rem 2.5rem', 
                backgroundColor: '#121212', 
                borderRadius: '1rem', 
                border: '1px solid #333', 
                marginBottom: '3rem' 
              }}>
                 <div style={{ flex: 1, textAlign: 'center', borderRight: window.innerWidth <= 550 ? 'none' : '1px solid #222', borderBottom: window.innerWidth <= 550 ? '1px solid #222' : 'none', paddingBottom: window.innerWidth <= 550 ? '0.5rem' : '0' }}>
                    <div style={{ color: '#444', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Area Size</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedRoom.sqm || 25} <span style={{ fontSize: '0.8rem', color: '#666' }}>m²</span></div>
                 </div>
                 <div style={{ flex: 1, textAlign: 'center', borderRight: window.innerWidth <= 550 ? 'none' : '1px solid #222', borderBottom: window.innerWidth <= 550 ? '1px solid #222' : 'none', paddingBottom: window.innerWidth <= 550 ? '0.5rem' : '0' }}>
                    <div style={{ color: '#444', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Bedding</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedRoom.bedType || 'Queen'}</div>
                 </div>
                 <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ color: '#444', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Occupancy</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedRoom.guestCount || 2} <span style={{ fontSize: '0.8rem', color: '#666' }}>Guests</span></div>
                 </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '3rem' }}>
                 <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Description</h3>
                 <p style={{ color: '#BBB', lineHeight: '1.8', fontSize: '1.05rem' }}>
                    {selectedRoom.description || 'Elevate your stay in our signature suites, where contemporary design meets timeless elegance. Each room is meticulously curated with premium textures, ambient lighting, and high-end amenities to ensure the ultimate luxury experience.'}
                 </p>
              </div>

              {/* Features, Facilities, Amenities Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth <= 600 ? '1fr' : '1fr 1fr', 
                gap: window.innerWidth <= 600 ? '2rem' : '4rem' 
              }}>
                 <div>
                    <h4 style={{ fontSize: '1rem', color: '#6366f1', marginBottom: '1.5rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>Premium Features</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                       {selectedRoom.features?.map((f, i) => (
                         <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#BBB' }}>
                           <CheckCircle2 size={14} color="#10B981" /> {f}
                         </div>
                       ))}
                    </div>
                 </div>
                 <div>
                    <h4 style={{ fontSize: '1rem', color: '#6366f1', marginBottom: '1.5rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>Suite Facilities</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                       {selectedRoom.facilities?.map((f, i) => (
                         <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#BBB' }}>
                           <Settings2 size={14} color="#333" /> {f}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div style={{ marginTop: '3rem' }}>
                 <h4 style={{ fontSize: '1rem', color: '#FFD700', marginBottom: '1.5rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>Guest Amenities</h4>
                 <div style={{ 
                   display: 'grid', 
                   gridTemplateColumns: window.innerWidth <= 480 ? '1fr 1fr' : 'repeat(4, 1fr)', 
                   gap: '1.5rem' 
                 }}>
                    {selectedRoom.amenities?.map((a, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#BBB' }}>
                        <Star size={14} color="#6366f1" fill="#6366f1" /> {a}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
               Select an asset to view technical specifications.
            </div>
          )}
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: window.innerWidth <= 768 ? '1rem' : '0' }}>
           <div className="card zoom-fade" style={{ width: '800px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                 <h3 style={{ margin: 0, fontSize: window.innerWidth <= 480 ? '1.1rem' : '1.5rem' }}>Register New Luxury Asset</h3>
                 <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X /></button>
              </div>
              <form onSubmit={handleAddRoom}>
                 <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 550 ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                       <label>Room Number</label>
                       <input type="text" className="form-control" value={newRoom.roomNumber} onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})} required style={{ backgroundColor: '#121212' }} />
                    </div>
                    <div className="form-group">
                       <label>Type</label>
                       <select className="form-control" value={newRoom.roomType} onChange={(e) => setNewRoom({...newRoom, roomType: e.target.value})} style={{ backgroundColor: '#121212' }}>
                          <option value="Standard">Standard</option>
                          <option value="Deluxe">Deluxe</option>
                          <option value="Suite">Suite</option>
                          <option value="Family">Family</option>
                       </select>
                    </div>
                    <div className="form-group">
                       <label>Price</label>
                       <input type="number" className="form-control" value={newRoom.price} onChange={(e) => setNewRoom({...newRoom, price: e.target.value})} required style={{ backgroundColor: '#121212' }} />
                    </div>
                    <div className="form-group">
                       <label>Area (m²)</label>
                       <input type="number" className="form-control" value={newRoom.sqm} onChange={(e) => setNewRoom({...newRoom, sqm: Number(e.target.value)})} style={{ backgroundColor: '#121212' }} />
                    </div>
                 </div>
                 <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Description</label>
                    <textarea className="form-control" rows="3" value={newRoom.description} onChange={(e) => setNewRoom({...newRoom, description: e.target.value})} style={{ backgroundColor: '#121212', resize: 'none' }} />
                 </div>
                 <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Discard</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem' }}>Commit Asset</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
