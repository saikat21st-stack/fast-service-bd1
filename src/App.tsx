import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Phone, 
  Send, 
  Package, 
  Zap, 
  CreditCard, 
  ShieldCheck, 
  Search 
} from 'lucide-react';

interface Order {
  id: string;
  name: string;
  phone: string;
  amount: string;
  service: string;
  time: string;
}

export default function App() {
  const [selectedService, setSelectedService] = useState('recharge');
  const [orderName, setOrderName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAmount, setOrderAmount] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [trackId, setTrackId] = useState('');
  const [trackResult, setTrackResult] = useState<string | null>(null);

  const services = [
    { id: 'recharge', name: 'Mobile Recharge', icon: Zap, fee: 'Instant', desc: 'Grameenphone, Banglalink, Robi, Airtel, Teletalk' },
    { id: 'payment', name: 'bKash / Nagad / Rocket', icon: CreditCard, fee: '0% fee', desc: 'Cash in, Cash out, Bill pay, Merchant payment' },
    { id: 'parcel', name: 'Express Parcel Delivery', icon: Package, fee: '60 BDT', desc: 'Doorstep parcel pickup & delivery nationwide in 24-48h' },
    { id: 'utility', name: 'Utility Bill Payment', icon: ShieldCheck, fee: 'Free', desc: 'DESCO, DPDC, NESCO, WASA, Titas Gas payments' },
  ];

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderName || !orderPhone) return;
    const newId = 'FSBD-' + Math.floor(100000 + Math.random() * 900000);
    setSubmittedOrder({
      id: newId,
      name: orderName,
      phone: orderPhone,
      amount: orderAmount || '100',
      service: services.find(s => s.id === selectedService)?.name || 'Service',
      time: new Date().toLocaleTimeString()
    });
    setOrderName('');
    setOrderPhone('');
    setOrderAmount('');
  };

  const handleTrack = () => {
    if (!trackId.trim()) return;
    setTrackResult(`Tracking ID: ${trackId.toUpperCase()} - Status: In Transit (Expected delivery within 4 hours). Hub: Dhaka.`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '6px 10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px' }}>FS</div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#0f172a' }}>Fast Service BD</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>24/7 Digital & Delivery Portal</div>
          </div>
        </div>
        <a href="tel:+8801700000000" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', backgroundColor: '#0284c7', color: '#ffffff', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none' }}>
          <Phone size={14} />
          <span>Call Hotline</span>
        </a>
      </header>

      {/* Hero & Tracking Search */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
          Fast & Reliable Digital Services in Bangladesh
        </h1>
        <p style={{ fontSize: '15px', color: '#475569', maxWidth: '600px', margin: '0 auto 28px auto' }}>
          Instant mobile recharge, bKash/Nagad transactions, parcel courier booking, and utility payments.
        </p>

        <div style={{ maxWidth: '500px', margin: '0 auto 30px auto', display: 'flex', gap: '8px', backgroundColor: '#ffffff', padding: '6px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
          <input 
            type="text" 
            placeholder="Enter Tracking ID (e.g. FSBD-123456)..." 
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            style={{ flex: 1, border: 'none', padding: '8px 12px', fontSize: '13px', outline: 'none' }}
          />
          <button 
            onClick={handleTrack}
            style={{ backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Search size={14} />
            <span>Track</span>
          </button>
        </div>

        {trackResult && (
          <div style={{ maxWidth: '500px', margin: '0 auto 30px auto', backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '8px', fontSize: '13px', textAlign: 'left' }}>
            {trackResult}
          </div>
        )}
      </section>

      {/* Services Grid */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px 40px 20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>Select a Service</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {services.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedService === s.id;
            return (
              <div 
                key={s.id}
                onClick={() => setSelectedService(s.id)}
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0', 
                  borderRadius: '10px', 
                  padding: '16px', 
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ backgroundColor: isSelected ? '#0284c7' : '#f1f5f9', color: isSelected ? '#ffffff' : '#0284c7', padding: '6px', borderRadius: '6px' }}>
                    <Icon size={18} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#0369a1', backgroundColor: '#e0f2fe', padding: '2px 6px', borderRadius: '10px' }}>
                    {s.fee}
                  </span>
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0', color: '#0f172a' }}>{s.name}</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Order Booking Form */}
      <section style={{ maxWidth: '600px', margin: '0 auto 60px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 6px 0', color: '#0f172a' }}>
            Book Service: {services.find(s => s.id === selectedService)?.name}
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>
            Fill out the details below to submit your request instantly.
          </p>

          {submittedOrder ? (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <CheckCircle2 size={32} color="#16a34a" style={{ margin: '0 auto 8px auto' }} />
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#166534', margin: '0 0 4px 0' }}>Request Submitted!</h3>
              <p style={{ fontSize: '12px', color: '#15803d', margin: '0 0 12px 0' }}>
                Your Tracking ID is <strong>{submittedOrder.id}</strong>. We will contact you at <strong>{submittedOrder.phone}</strong>.
              </p>
              <button 
                onClick={() => setSubmittedOrder(null)}
                style={{ backgroundColor: '#16a34a', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
              >
                New Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Customer Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Saikat" 
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Phone Number (017...)</label>
                <input 
                  type="tel" 
                  required
                  placeholder="017XXXXXXXX" 
                  value={orderPhone}
                  onChange={(e) => setOrderPhone(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Amount / Address Details</label>
                <input 
                  type="text" 
                  placeholder="e.g. 500 BDT or Mirpur 10, Dhaka" 
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <button 
                type="submit"
                style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              >
                <span>Submit Request</span>
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
        <div>© 2026 Fast Service BD. All rights reserved.</div>
      </footer>
    </div>
  );
      }
