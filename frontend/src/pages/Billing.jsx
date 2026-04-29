import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Receipt, Download, X, CreditCard, Wallet, Banknote, History, CheckCircle2 } from 'lucide-react';

const Billing = () => {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [additionalServices, setAdditionalServices] = useState(0);
  
  // Invoice state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const invoiceRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, bookingsRes] = await Promise.all([
        api.get('/payments'),
        api.get('/bookings')
      ]);
      setPayments(paymentsRes.data);
      setBookings(bookingsRes.data.filter(b => b.bookingStatus === 'checked-in' || b.bookingStatus === 'confirmed'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    if (!selectedBookingId) return alert('Please select a booking');

    try {
      await api.post('/payments', {
        bookingId: selectedBookingId,
        paymentMethod,
        additionalServices: Number(additionalServices)
      });
      setShowGenerateModal(false);
      setSelectedBookingId('');
      setAdditionalServices(0);
      fetchData(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate bill');
    }
  };

  const downloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input, { 
      scale: 2,
      backgroundColor: '#1E1E1E',
      useCORS: true
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Luxury_Invoice_${currentInvoice._id.substring(18)}.pdf`);
    });
  };

  const InvoiceModal = () => {
    if (!currentInvoice) return null;
    const b = currentInvoice.bookingId;

    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
        backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
        backdropFilter: 'blur(10px)'
      }}>
        <div className="card zoom-fade" style={{ width: '700px', maxWidth: '95%', maxHeight: '95vh', overflowY: 'auto', padding: 0, border: '1px solid #FFD700' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1.5rem', backgroundColor: '#121212', borderBottom: '1px solid #2A2A2A' }}>
             <button onClick={downloadPDF} className="btn btn-primary" style={{ height: '40px', padding: '0 1.5rem' }}>
                <Download size={16} style={{ marginRight: '0.4rem' }} /> PDF Export
             </button>
             <button onClick={() => setShowInvoiceModal(false)} className="btn btn-secondary" style={{ height: '40px', padding: '0 1.5rem' }}>
                <X size={16} />
             </button>
          </div>
          
          <div ref={invoiceRef} style={{ padding: '3rem', backgroundColor: '#1E1E1E', color: '#BBBBBB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #333', paddingBottom: '2rem', marginBottom: '3rem' }}>
               <div>
                  <h1 style={{ margin: 0, color: '#FFD700', fontSize: '2.5rem', letterSpacing: '2px' }}>LUXURY<span style={{ color: '#FFF' }}>STAY</span></h1>
                  <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px' }}>Finance Department</p>
               </div>
               <div style={{ textAlign: 'right' }}>
                  <h3 style={{ margin: 0, fontSize: '1.5rem' }}>INVOICE / RECEIPT</h3>
                  <p style={{ margin: '0.5rem 0 0', fontWeight: 700, color: '#FFD700' }}>#{currentInvoice._id.substring(18).toUpperCase()}</p>
               </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
              <div>
                <strong style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '0.75rem' }}>Guest Portfolio</strong>
                <p style={{ margin: 0, fontSize: '1.1rem', color: '#FFF', fontWeight: 700 }}>{b?.guestId?.name}</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>{b?.guestId?.email}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ marginBottom: '1rem' }}>
                   <strong style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '0.4rem' }}>Issuance Date</strong>
                   <span style={{ color: '#FFF' }}>{new Date(currentInvoice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div>
                   <strong style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '0.4rem' }}>Payment Status</strong>
                   <span style={{ color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <CheckCircle2 size={14} /> SETTLED via {currentInvoice.paymentMethod}
                   </span>
                </div>
              </div>
            </div>

            <table style={{ marginBottom: '4rem', width: '100%' }}>
              <thead>
                 <tr>
                   <th style={{ backgroundColor: 'transparent', color: '#666', borderBottom: '1px solid #333' }}>Service Description</th>
                   <th style={{ backgroundColor: 'transparent', color: '#666', borderBottom: '1px solid #333', textAlign: 'right' }}>Investment</th>
                 </tr>
              </thead>
              <tbody>
                <tr>
                   <td style={{ backgroundColor: 'transparent', border: 'none', padding: '1.5rem 0' }}>
                      <div style={{ fontWeight: 700, color: '#FFF' }}>Room Reservation — #{b?.roomId?.roomNumber}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>{b?.roomId?.roomType} Accommodation • {new Date(b?.checkInDate).toLocaleDateString()} to {new Date(b?.checkOutDate).toLocaleDateString()}</div>
                   </td>
                   <td style={{ backgroundColor: 'transparent', border: 'none', textAlign: 'right', fontWeight: 700, color: '#FFF' }}>${b?.totalPrice?.toLocaleString()}</td>
                </tr>
                {currentInvoice.amount > b?.totalPrice && (
                  <tr style={{ borderTop: '1px solid #2A2A2A' }}>
                     <td style={{ backgroundColor: 'transparent', border: 'none', padding: '1.5rem 0' }}>
                        <div style={{ fontWeight: 700, color: '#FFF' }}>Additional Experiences & Services</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Spa, Dining, and Concierge enhancements</div>
                     </td>
                     <td style={{ backgroundColor: 'transparent', border: 'none', textAlign: 'right', fontWeight: 700, color: '#FFF' }}>${(currentInvoice.amount - b?.totalPrice).toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #FFD700', paddingTop: '2rem' }}>
               <div style={{ textAlign: 'right', minWidth: '200px' }}>
                  <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>Final Total Investment</div>
                  <div style={{ fontSize: '3rem', fontWeight: 700, color: '#FFD700' }}>${currentInvoice.amount?.toLocaleString()}</div>
               </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '5rem', color: '#444', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              &copy; {new Date().getFullYear()} LUXURYSTAY HOSPITALITY GROUP &bull; BEVERLY HILLS &bull; LONDON &bull; DUBAI
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div style={{ color: '#FFD700', textAlign: 'center', marginTop: '5rem', fontWeight: 600 }}>SYNCHRONIZING FINANCIAL DATA...</div>;

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
          <h2 style={{ margin: 0, fontSize: window.innerWidth <= 600 ? '1.5rem' : '1.8rem' }}>Financial Management</h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>Audit and process guest folios and final settlements.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowGenerateModal(true)} style={{ width: window.innerWidth <= 600 ? '100%' : 'auto' }}>
          <Receipt size={18} style={{ marginRight: '0.5rem' }} /> Process Settlement
        </button>
      </div>

      {showGenerateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          backdropFilter: 'blur(10px)',
          padding: window.innerWidth <= 768 ? '1rem' : '0'
        }}>
          <div className="card zoom-fade" style={{ width: '450px', maxWidth: '100%', border: '1px solid #FFD700', maxHeight: '95vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, color: '#FFD700' }}>Final Bill Generation</h3>
              <button onClick={() => setShowGenerateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleGenerateBill}>
              <div className="form-group">
                <label>Select Active Folio</label>
                <select 
                  className="form-control" required
                  value={selectedBookingId} onChange={(e) => setSelectedBookingId(e.target.value)}
                  style={{ backgroundColor: '#121212' }}
                >
                  <option value="">Choose a guest to checkout...</option>
                  {bookings.map(b => (
                    <option key={b._id} value={b._id}>
                      {b.guestId?.name} — Room {b.roomId?.roomNumber} (${b.totalPrice})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Service Enhancements ($)</label>
                <input type="number" className="form-control" min="0" placeholder="0.00"
                  value={additionalServices} onChange={(e) => setAdditionalServices(e.target.value)}
                  style={{ backgroundColor: '#121212' }}
                />
              </div>
              <div className="form-group">
                <label>Premium Payment Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                   <div 
                     onClick={() => setPaymentMethod('Credit Card')}
                     style={{ 
                       padding: '1rem', borderRadius: '0.75rem', border: '1px solid',
                       borderColor: paymentMethod === 'Credit Card' ? '#FFD700' : '#2A2A2A',
                       backgroundColor: paymentMethod === 'Credit Card' ? 'rgba(255,215,0,0.05)' : '#121212',
                       display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s ease'
                     }}
                   >
                     <CreditCard size={20} color={paymentMethod === 'Credit Card' ? '#FFD700' : '#444'} />
                     <span style={{ fontSize: '0.7rem', marginTop: '0.5rem', color: paymentMethod === 'Credit Card' ? '#FFD700' : '#444' }}>Card</span>
                   </div>
                   <div 
                     onClick={() => setPaymentMethod('Cash')}
                     style={{ 
                       padding: '1rem', borderRadius: '0.75rem', border: '1px solid',
                       borderColor: paymentMethod === 'Cash' ? '#FFD700' : '#2A2A2A',
                       backgroundColor: paymentMethod === 'Cash' ? 'rgba(255,215,0,0.05)' : '#121212',
                       display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s ease'
                     }}
                   >
                     <Banknote size={20} color={paymentMethod === 'Cash' ? '#FFD700' : '#444'} />
                     <span style={{ fontSize: '0.7rem', marginTop: '0.5rem', color: paymentMethod === 'Cash' ? '#FFD700' : '#444' }}>Liquid</span>
                   </div>
                   <div 
                     onClick={() => setPaymentMethod('Digital Wallet')}
                     style={{ 
                       padding: '1rem', borderRadius: '0.75rem', border: '1px solid',
                       borderColor: paymentMethod === 'Digital Wallet' ? '#FFD700' : '#2A2A2A',
                       backgroundColor: paymentMethod === 'Digital Wallet' ? 'rgba(255,215,0,0.05)' : '#121212',
                       display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s ease'
                     }}
                   >
                     <Wallet size={20} color={paymentMethod === 'Digital Wallet' ? '#FFD700' : '#444'} />
                     <span style={{ fontSize: '0.7rem', marginTop: '0.5rem', color: paymentMethod === 'Digital Wallet' ? '#FFD700' : '#444' }}>Digital</span>
                   </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowGenerateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Authorize & Close Folio</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInvoiceModal && <InvoiceModal />}

      <div className="card" style={{ padding: window.innerWidth <= 768 ? '0.5rem' : '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderBottom: '1px solid #2A2A2A', marginBottom: '1rem' }}>
           <History size={20} color="#FFD700" />
           <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Historical Settlement Archives</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Folio ID</th>
                <th>Guest Identity</th>
                <th style={{ display: window.innerWidth <= 768 ? 'none' : 'table-cell' }}>Suite</th>
                <th>Settled Date</th>
                <th>Total Value</th>
                <th style={{ display: window.innerWidth <= 1024 ? 'none' : 'table-cell' }}>Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#666' }}>{p._id.substring(18).toUpperCase()}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#FFF' }}>{p.bookingId?.guestId?.name || 'Legacy Portfolio'}</div>
                    <div style={{ fontSize: '0.7rem', color: '#555' }}>{p.bookingId?.bookingStatus?.toUpperCase()} STATUS</div>
                  </td>
                  <td style={{ color: '#FFD700', fontWeight: 600, display: window.innerWidth <= 768 ? 'none' : 'table-cell' }}>#{p.bookingId?.roomId?.roomNumber || 'N/A'}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 700, color: '#FFF', fontSize: '1.1rem' }}>${p.amount?.toLocaleString()}</td>
                  <td style={{ display: window.innerWidth <= 1024 ? 'none' : 'table-cell' }}>
                    <span style={{ color: '#FFD700', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px' }}>{p.paymentMethod}</span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', border: '1px solid #333' }}
                      onClick={() => { setCurrentInvoice(p); setShowInvoiceModal(true); }}
                    >
                      Review Invoice
                    </button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center" style={{ padding: '4rem', color: '#666' }}>
                    No historical financial records located.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;
