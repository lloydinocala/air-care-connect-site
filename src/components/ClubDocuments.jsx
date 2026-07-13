import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const SKY = '#4DB8E8';
const NAVY = '#1B3A6B';
const WHITE = '#FFFFFF';
const OFF_WHITE = '#F7FBFD';
const SKY_PALE = '#E8F6FC';
const GRAY_LT = '#EEF2F5';
const GRAY_DK = '#4A5568';
const GOLD = '#F9A825';
const GREEN = '#38A169';

const JOURNEY_FUNCTIONS_URL = 'https://gatndtsmjrxdgxquvydw.supabase.co/functions/v1';
const AIR_CARE_CONNECT_ORG_ID = '7194773e-a5fd-4666-bb32-2a70e736e7fb';

// Fallback prices only — used until the live fetch from Journey resolves,
// or if it fails, so this page never shows blank pricing.
const PLANS = [
  { id: 'silver', name: 'Air-Care Silver', icon: '🥈', annual: 189, monthly: 14.99, color: '#78909C' },
  { id: 'gold',   name: 'Air-Care Gold',   icon: '⭐', annual: 249, monthly: 21.99, color: GOLD,    badge: 'Most Popular' },
  { id: 'platinum',name: 'Air-Care Platinum',icon:'💎', annual: 399, monthly: 35.99, color: SKY,    badge: 'VIP' },
];

const inputStyle = {
  width: '100%', padding: '12px 16px', background: OFF_WHITE,
  border: `1px solid ${GRAY_LT}`, borderRadius: 10, color: '#1A1A2E',
  fontFamily: 'Inter,sans-serif', fontSize: 15, outline: 'none',
};
const labelStyle = {
  display: 'block', fontSize: 12, fontFamily: 'Poppins,sans-serif',
  letterSpacing: 1.5, textTransform: 'uppercase', color: GRAY_DK,
  fontWeight: 600, marginBottom: 6,
};

export default function ClubDocuments() {
  const [searchParams] = useSearchParams();
  const [selected, setSelected]   = useState([]);
  const [billing, setBilling]     = useState('annual'); // 'annual' | 'monthly'
  const [email, setEmail]         = useState('');
  const [status, setStatus]       = useState('idle');   // idle | missing | submitting | success | error
  const [sentEmail, setSentEmail] = useState('');
  const [livePlans, setLivePlans] = useState(PLANS);

  // Pre-select the plan when arriving from a "Email Me This Agreement" button
  useEffect(() => {
    const requested = searchParams.get('plan');
    if (requested && PLANS.some((p) => p.id === requested)) setSelected([requested]);
    const bill = searchParams.get('billing');
    if (bill === 'monthly') setBilling('monthly');
  }, [searchParams]);

  // Pull live pricing from Journey so this page can never drift from what's
  // actually charged at checkout.
  useEffect(() => {
    fetch(`${JOURNEY_FUNCTIONS_URL}/public-tiers?orgId=${AIR_CARE_CONNECT_ORG_ID}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data || !data.tiers) return;
        const byName = {};
        for (const t of data.tiers) byName[t.name.toLowerCase()] = t;
        setLivePlans(PLANS.map((p) => {
          const live = byName[p.id];
          return live ? { ...p, annual: Number(live.annual_price), monthly: Number(live.monthly_price) } : p;
        }));
      })
      .catch(() => {}); // keep fallback prices if this fails
  }, []);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleSubmit = async () => {
    if (!email.trim() || selected.length === 0) { setStatus('missing'); return; }
    setStatus('submitting');
    try {
      const r = await fetch('/api/send-agreement-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plans: selected, billing, language: 'en' }),
      });
      if (!r.ok) { setStatus('error'); return; }
      setSentEmail(email);
      setStatus('success');
    } catch (e) { setStatus('error'); }
  };

  const annualSavings = (p) => Math.round(p.monthly * 12 - p.annual);

  return (
    <section style={{ background: OFF_WHITE, padding: '140px 0 80px', minHeight: '70vh' }}>
      <div className="container" style={{ maxWidth: 660 }}>

        <div style={{ fontFamily:'Poppins,sans-serif', fontSize:12, fontWeight:600,
          letterSpacing:3, textTransform:'uppercase', color:SKY, marginBottom:16, textAlign:'center' }}>
          Air-Care Club
        </div>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:'clamp(26px,4vw,40px)',
          fontWeight:900, color:NAVY, marginBottom:14, textAlign:'center', lineHeight:1.15 }}>
          Get Your Membership Agreement by Email
        </h1>
        <p style={{ fontSize:16, color:GRAY_DK, textAlign:'center', marginBottom:36, lineHeight:1.75 }}>
          Select one, two, or all three plans — we'll email you the full membership agreement
          for each one, plus a secure link to enroll whenever you're ready. No pressure, no obligation.
        </p>

        <div style={{ background:WHITE, border:`1px solid ${GRAY_LT}`, borderRadius:20,
          padding:36, boxShadow:'0 4px 24px rgba(27,58,107,0.08)' }}>

          {status === 'success' ? (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
              <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:22, color:NAVY, marginBottom:10 }}>
                Check your inbox!
              </div>
              <p style={{ fontSize:15, color:GRAY_DK, lineHeight:1.75, maxWidth:420, margin:'0 auto' }}>
                We sent the agreement{selected.length > 1 ? 's' : ''} to <strong>{sentEmail}</strong>.
                Each one includes a button to review the full PDF and a secure link to enroll and pay
                when you're ready — no account or login required.
              </p>
              <p style={{ fontSize:13, color:GRAY_DK, marginTop:14 }}>
                Didn't receive it? Check your spam folder, or call us at{' '}
                <a href="tel:+13524846341" style={{ color:SKY, fontWeight:600 }}>352-484-6341</a>.
              </p>
              <Link to="/club" style={{ color:SKY, fontWeight:600, fontSize:14,
                display:'inline-block', marginTop:20 }}>
                ← Back to the Air-Care Club
              </Link>
            </div>

          ) : (
            <>
              {/* ── Step 1: Billing toggle ── */}
              <div style={{ marginBottom:28 }}>
                <div style={labelStyle}>Step 1 — How would you like to pay?</div>
                <div style={{ display:'flex', gap:0, background:GRAY_LT, borderRadius:12, padding:4 }}>
                  {[
                    { v:'annual',  label:'Pay Annually',  sub:'Save up to $62/yr' },
                    { v:'monthly', label:'Pay Monthly',   sub:'No long commitment' },
                  ].map(({ v, label, sub }) => (
                    <button key={v} onClick={() => setBilling(v)} type="button" style={{
                      flex:1, padding:'12px 10px', borderRadius:10, border:'none',
                      cursor:'pointer', transition:'all 0.15s', textAlign:'center',
                      background: billing === v ? NAVY : 'transparent',
                      color: billing === v ? WHITE : GRAY_DK,
                      boxShadow: billing === v ? '0 2px 8px rgba(27,58,107,0.25)' : 'none',
                    }}>
                      <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14 }}>{label}</div>
                      <div style={{ fontSize:11, opacity: billing === v ? 0.8 : 0.6, marginTop:2 }}>{sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Step 2: Plan selection ── */}
              <div style={{ marginBottom:28 }}>
                <div style={labelStyle}>Step 2 — Select Plan(s) to Receive</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {livePlans.map((p) => {
                    const active = selected.includes(p.id);
                    const price = billing === 'annual' ? `$${p.annual}/yr` : `$${p.monthly}/mo`;
                    const savings = annualSavings(p);
                    return (
                      <label key={p.id} style={{
                        display:'flex', alignItems:'center', gap:14, padding:'14px 16px',
                        border:`2px solid ${active ? p.color : GRAY_LT}`,
                        borderRadius:12, cursor:'pointer',
                        background: active ? SKY_PALE : WHITE,
                        transition:'all 0.15s', position:'relative',
                      }}>
                        {p.badge && (
                          <div style={{
                            position:'absolute', top:-10, right:14,
                            background: p.id === 'gold' ? GOLD : NAVY,
                            color: p.id === 'gold' ? NAVY : WHITE,
                            fontSize:10, fontWeight:800, letterSpacing:1.5,
                            padding:'2px 10px', borderRadius:999,
                            fontFamily:'Poppins,sans-serif',
                          }}>{p.badge}</div>
                        )}
                        <input
                          type="checkbox" checked={active} onChange={() => toggle(p.id)}
                          style={{ width:18, height:18, accentColor:p.color, flexShrink:0 }}
                        />
                        <span style={{ fontSize:22 }}>{p.icon}</span>
                        <span style={{ flex:1, fontFamily:'Poppins,sans-serif', fontWeight:700, color:NAVY, fontSize:15 }}>
                          {p.name}
                        </span>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:15, fontWeight:700, color:p.color }}>{price}</div>
                          {billing === 'annual' && (
                            <div style={{ fontSize:11, color:GREEN, fontWeight:600 }}>
                              Save ${savings}/yr vs. monthly
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                <p style={{ fontSize:12, color:GRAY_DK, marginTop:10, fontStyle:'italic' }}>
                  Selecting multiple plans lets you compare them side by side before deciding.
                </p>
              </div>

              {/* ── Step 3: Email ── */}
              <div style={{ marginBottom:20 }}>
                <label style={labelStyle}>Step 3 — Your Email Address *</label>
                <input
                  type="email" placeholder="john@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
                <p style={{ fontSize:12, color:GRAY_DK, marginTop:6, fontStyle:'italic' }}>
                  We'll send the agreement(s) and a secure enrollment link. We won't spam you.
                </p>
              </div>

              {status === 'missing' && (
                <p style={{ fontSize:13, color:'#C62828', textAlign:'center', marginBottom:14 }}>
                  Please select at least one plan and enter your email address.
                </p>
              )}
              {status === 'error' && (
                <p style={{ fontSize:13, color:'#C62828', textAlign:'center', marginBottom:14 }}>
                  Something went wrong — please try again or call us at 352-484-6341.
                </p>
              )}

              <button
                className="btn btn-navy"
                style={{ width:'100%', justifyContent:'center',
                  opacity: status === 'submitting' ? 0.6 : 1 }}
                disabled={status === 'submitting'}
                onClick={handleSubmit}
              >
                {status === 'submitting'
                  ? 'Sending...'
                  : `Email Me ${selected.length > 1 ? 'These Agreements' : 'This Agreement'} →`}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
