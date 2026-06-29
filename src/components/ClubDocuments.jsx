import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const SKY = '#4DB8E8';
const NAVY = '#1B3A6B';
const WHITE = '#FFFFFF';
const OFF_WHITE = '#F7FBFD';
const SKY_PALE = '#E8F6FC';
const GRAY_LT = '#EEF2F5';
const GRAY = '#8FA3B1';
const GRAY_DK = '#4A5568';
const GOLD = '#F9A825';

const PLANS = [
  { id: 'silver', name: 'Air-Care Silver', icon: '\ud83e\udd48', price: 189, color: '#78909C' },
  { id: 'gold', name: 'Air-Care Gold', icon: '\u2b50', price: 249, color: GOLD },
  { id: 'platinum', name: 'Air-Care Platinum', icon: '\ud83d\udc8e', price: 399, color: SKY },
];

export default function ClubDocuments() {
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | missing | submitting | success

  useEffect(() => {
    const requested = searchParams.get('plan');
    if (requested && PLANS.some((p) => p.id === requested)) {
      setSelected([requested]);
    }
  }, [searchParams]);

  const toggle = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const handleSubmit = async () => {
    if (!email.trim() || selected.length === 0) {
      setStatus('missing');
      return;
    }
    setStatus('submitting');
    try {
      await fetch('/api/send-agreement-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plans: selected, language: 'en' }),
      });
    } catch (e) { console.warn('Send agreement docs error:', e); }
    setStatus('success');
  };

  return (
    <section style={{ background: OFF_WHITE, padding: '140px 0 80px', minHeight: '70vh' }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <div style={{
          fontFamily: 'Poppins,sans-serif', fontSize: 12, fontWeight: 600,
          letterSpacing: 3, textTransform: 'uppercase', color: SKY, marginBottom: 16, textAlign: 'center',
        }}>Air-Care Club</div>
        <h1 style={{
          fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(28px,4vw,42px)',
          fontWeight: 900, color: NAVY, marginBottom: 16, textAlign: 'center', lineHeight: 1.15,
        }}>Get Your Membership Agreement by Email</h1>
        <p style={{ fontSize: 16, color: GRAY_DK, textAlign: 'center', marginBottom: 40, lineHeight: 1.7 }}>
          Select one, two, or all three plans to compare \u2014 we'll email you the full agreement for each, plus a secure link to enroll whenever you're ready.
        </p>

        <div style={{
          background: WHITE, border: `1px solid ${GRAY_LT}`, borderRadius: 20,
          padding: 36, boxShadow: '0 4px 24px rgba(27,58,107,0.08)',
        }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>\u2705</div>
              <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 20, color: NAVY, marginBottom: 8 }}>
                Check your inbox!
              </div>
              <p style={{ fontSize: 15, color: GRAY_DK, lineHeight: 1.7 }}>
                We've sent the agreement{selected.length > 1 ? 's' : ''} to <strong>{email}</strong>.
                It may take a minute or two to arrive \u2014 check your spam folder if you don't see it.
              </p>
              <Link to="/club" style={{ color: SKY, fontWeight: 600, fontSize: 14, display: 'inline-block', marginTop: 16 }}>
                \u2190 Back to the Air-Care Club
              </Link>
            </div>
          ) : (
            <>
              <div style={{
                display: 'block', fontSize: 12, fontFamily: 'Poppins,sans-serif',
                letterSpacing: 1.5, textTransform: 'uppercase', color: GRAY_DK,
                fontWeight: 600, marginBottom: 14,
              }}>Select Plan(s) to Receive</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {PLANS.map((p) => (
                  <label key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                    border: `2px solid ${selected.includes(p.id) ? p.color : GRAY_LT}`,
                    borderRadius: 12, cursor: 'pointer',
                    background: selected.includes(p.id) ? SKY_PALE : WHITE,
                    transition: 'all 0.15s',
                  }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggle(p.id)}
                      style={{ width: 18, height: 18, accentColor: p.color, flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 22 }}>{p.icon}</span>
                    <span style={{ flex: 1, fontFamily: 'Poppins,sans-serif', fontWeight: 700, color: NAVY, fontSize: 15 }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: 14, color: GRAY_DK, fontWeight: 600 }}>${p.price}/yr</span>
                  </label>
                ))}
              </div>

              <label style={{
                display: 'block', fontSize: 12, fontFamily: 'Poppins,sans-serif',
                letterSpacing: 1.5, textTransform: 'uppercase', color: GRAY_DK,
                fontWeight: 600, marginBottom: 6,
              }}>Your Email Address *</label>
              <input
                type="email" placeholder="john@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', background: OFF_WHITE,
                  border: `1px solid ${GRAY_LT}`, borderRadius: 10, color: '#1A1A2E',
                  fontFamily: 'Inter,sans-serif', fontSize: 15, outline: 'none', marginBottom: 20,
                }}
              />

              {status === 'missing' && (
                <p style={{ fontSize: 13, color: '#C62828', textAlign: 'center', marginBottom: 16 }}>
                  Please select at least one plan and enter your email.
                </p>
              )}

              <button
                className="btn btn-navy"
                style={{ width: '100%', justifyContent: 'center', opacity: status === 'submitting' ? 0.6 : 1 }}
                disabled={status === 'submitting'}
                onClick={handleSubmit}
              >
                {status === 'submitting' ? 'Sending...' : `Email Me ${selected.length > 1 ? 'These Agreements' : 'This Agreement'} \u2192`}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
