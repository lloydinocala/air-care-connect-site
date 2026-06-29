import { Link } from 'react-router-dom';

const PHONE_EN = '352-484-6341';
const PHONE_EN_HREF = 'tel:+13524846341';
const PHONE_ES = '407-963-8544';

const COUNTIES = ['Marion County','Lake County','Sumter County','Levy County','Citrus County','Alachua County','The Villages','Ocala','Gainesville','Leesburg','Inverness','Crystal River'];

function PhotoPlaceholder({ label, height = 400, style = {} }) {
  return (
    <div className="photo-placeholder" style={{ height, ...style }}>
      <span className="ph-icon">📷</span>
      <span style={{ fontWeight: 600, color: '#4DB8E8', fontSize: 12 }}>{label}</span>
      <span style={{ fontSize: 10, opacity: 0.5 }}>Replace with actual photo</span>
    </div>
  );
}

const SERVICES = [
  { icon: '🔧', title: 'AC Repair', desc: 'Fast diagnosis and same-day repair on most issues. All makes and models. Upfront pricing before we start.' },
  { icon: '🔍', title: 'Tune-Up & Maintenance', desc: '21-point inspection that catches small problems before they become expensive emergencies.' },
  { icon: '❄️', title: 'System Replacement', desc: 'Full replacement with instant online pricing. Get a guaranteed quote in 60 seconds, 24/7.' },
  { icon: '🏗️', title: 'New Installation', desc: 'New construction and add-ons. Proper sizing and commissioning guaranteed.' },
  { icon: '💨', title: 'Duct Cleaning & Indoor Air Quality', desc: 'MERV 8–13 filtration, UV treatment, and whole-home humidity control for Florida\'s climate.' },
  { icon: '🌡️', title: 'Heat Pump Service', desc: 'Full heat pump repair, maintenance, and replacement. R-410A and R-32 certified.' },
];

const STATS = [
  { value: '6', label: 'Counties Served', sub: 'Marion, Lake, Sumter, Levy, Citrus, Alachua' },
  { value: '21', label: 'Point Tune-Up', sub: 'The most thorough inspection in Central Florida' },
  { value: '24hr', label: 'Club Priority', sub: 'Gold & Platinum members — peak season guarantee' },
  { value: '100%', label: 'Satisfaction', sub: 'We don\'t leave until it\'s right' },
];

export default function Home() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        background: 'linear-gradient(160deg, #F7FBFD 0%, #E8F6FC 50%, #F7FBFD 100%)',
        paddingTop: 70, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(77,184,232,0.12) 0%, transparent 70%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48, alignItems: 'center',
          }}>
            {/* Left: copy */}
            <div>
              <div style={{
                fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 600,
                letterSpacing: 3, textTransform: 'uppercase', color: '#4DB8E8', marginBottom: 16,
              }}>Ocala & Central Florida HVAC</div>

              <h1 className="display-xl" style={{ marginBottom: 24, color: '#1B3A6B' }}>
                Keep Your Home{' '}
                <span style={{ color: '#4DB8E8' }}>Cool &amp; Comfortable</span>{' '}
                All Year Long
              </h1>

              <p style={{
                fontSize: 'clamp(16px,1.8vw,19px)', color: '#4A5568',
                lineHeight: 1.75, marginBottom: 36, maxWidth: 480,
              }}>
                Professional AC repair, maintenance, and replacement across Marion, Lake,
                Sumter, Levy, Citrus &amp; Alachua Counties — including The Villages.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
                <a href={PHONE_EN_HREF} className="btn btn-navy btn-lg">
                  📞 {PHONE_EN}
                </a>
                <Link to="/club" className="btn btn-outline btn-lg">
                  View Club Plans
                </Link>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="badge badge-green">✓ Licensed & Insured</span>
                <span className="badge badge-sky">✓ Same-Day Service</span>
                <span className="badge badge-gold">✓ Se habla español</span>
                <span className="badge badge-navy">✓ All Makes & Models</span>
              </div>
            </div>

            {/* Right: photo — hidden on mobile via CSS */}
            <div style={{ position: 'relative' }}>
              <PhotoPlaceholder
                label="HERO PHOTO: Technician at outdoor AC unit"
                height={480}
                style={{ borderRadius: 20, boxShadow: '0 20px 60px rgba(27,58,107,0.15)' }}
              />
              <div className="hero-float-card" style={{
                position: 'absolute', bottom: -20, left: -20,
                background: 'white', border: '1px solid rgba(77,184,232,0.2)',
                borderRadius: 16, padding: '20px 24px',
                boxShadow: '0 12px 40px rgba(27,58,107,0.12)',
              }}>
                <div style={{ fontFamily:'Poppins,sans-serif', fontSize:36, fontWeight:800, color:'#4DB8E8', lineHeight:1 }}>$0</div>
                <div style={{ fontSize:13, color:'#4A5568', marginTop:4 }}>Diagnostic fee waived<br/>for Club members</div>
              </div>
              <div className="hero-top-badge" style={{
                position: 'absolute', top: -16, right: -16,
                background: '#1B3A6B', borderRadius: 12, padding: '12px 18px',
                boxShadow: '0 8px 24px rgba(27,58,107,0.25)',
                textAlign: 'center', color: 'white',
              }}>
                <div style={{ fontFamily:'Poppins,sans-serif', fontSize:28, fontWeight:800, lineHeight:1 }}>24hr</div>
                <div style={{ fontSize:11, opacity:0.8, marginTop:2 }}>Priority Response</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TERRITORY MARQUEE ────────────────────────────────── */}
      <div className="territory-strip">
        <div className="territory-strip-inner">
          {[...COUNTIES, ...COUNTIES].map((c, i) => (
            <span key={i} className="territory-item">📍 {c}</span>
          ))}
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section style={{ background: 'white', padding: '56px 0', borderBottom: '1px solid #EEF2F5' }}>
        <div className="container">
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: '32px 20px', textAlign: 'center',
                borderRight: i < STATS.length - 1 ? '1px solid #EEF2F5' : 'none',
              }}>
                <div style={{
                  fontFamily:'Poppins,sans-serif', fontSize:52, fontWeight:800,
                  color:'#4DB8E8', lineHeight:1, marginBottom:8,
                }}>{s.value}</div>
                <div style={{
                  fontFamily:'Poppins,sans-serif', fontSize:14, fontWeight:700,
                  color:'#1B3A6B', marginBottom:6,
                }}>{s.label}</div>
                <div style={{ fontSize:12, color:'#8FA3B1', lineHeight:1.4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section style={{ background: '#F7FBFD', padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <div style={{ width:48, height:4, background:'#4DB8E8', borderRadius:2, margin:'0 auto 16px' }} />
            <div style={{ fontFamily:'Poppins,sans-serif', fontSize:12, fontWeight:600, letterSpacing:3, textTransform:'uppercase', color:'#4DB8E8', marginBottom:12 }}>What We Do</div>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontSize:'clamp(26px,4vw,40px)', fontWeight:800, color:'#1B3A6B', marginBottom:16 }}>Complete HVAC Services</h2>
            <p style={{ fontSize:'clamp(15px,1.8vw,18px)', color:'#4A5568', maxWidth:520, margin:'0 auto', lineHeight:1.75 }}>
              From emergency repairs to full system replacements — we handle everything your home comfort system needs.
            </p>
          </div>
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',
            gap:20,
          }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="card" style={{ display:'flex', gap:16 }}>
                <div style={{
                  width:52, height:52, flexShrink:0,
                  background:'#E8F6FC', borderRadius:12,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:26,
                }}>{s.icon}</div>
                <div>
                  <h3 style={{ fontFamily:'Poppins,sans-serif', fontSize:17, fontWeight:700, color:'#1B3A6B', marginBottom:8 }}>{s.title}</h3>
                  <p style={{ fontSize:14, color:'#4A5568', lineHeight:1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:40 }}>
            <Link to="/services" className="btn btn-outline">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* ── CLUB TEASER ──────────────────────────────────────── */}
      <section style={{ background: '#1B3A6B', padding: '80px 0' }}>
        <div className="container">
          <div className="club-teaser-grid" style={{
            display:'grid', gridTemplateColumns:'1fr 1fr',
            gap:48, alignItems:'center',
          }}>
            <div>
              <div style={{ fontFamily:'Poppins,sans-serif', fontSize:12, fontWeight:600, letterSpacing:3, textTransform:'uppercase', color:'#4DB8E8', marginBottom:16 }}>Membership Program</div>
              <h2 style={{ fontFamily:'Poppins,sans-serif', fontSize:'clamp(26px,4vw,42px)', fontWeight:800, color:'white', marginBottom:20, lineHeight:1.15 }}>
                Join the<br/><span style={{ color:'#4DB8E8' }}>Air-Care Club</span>
              </h2>
              <p style={{ color:'rgba(255,255,255,0.8)', fontSize:17, lineHeight:1.7, marginBottom:32 }}>
                Two professional tune-ups a year, priority scheduling, repair discounts,
                and filters included — starting at just $14.99/month.
              </p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <Link to="/club" className="btn btn-primary btn-lg">See Club Plans</Link>
                <a href={PHONE_EN_HREF} className="btn btn-outline-sky">Call to Join</a>
              </div>
            </div>

            <div className="club-plan-minigrid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {[
                { icon:'🥈', name:'Silver', price:'$169/yr', color:'#90A4AE' },
                { icon:'⭐', name:'Gold', price:'$249/yr', best:true, color:'#F9A825' },
                { icon:'💎', name:'Platinum', price:'$399/yr', color:'#4DB8E8' },
                { icon:'📞', name:'Priority Line', price:'Members Only', color:'#4DB8E8' },
              ].map((p, i) => (
                <div key={i} style={{
                  background: p.best ? 'rgba(249,168,37,0.1)' : 'rgba(255,255,255,0.06)',
                  border:`1px solid ${p.best ? 'rgba(249,168,37,0.4)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius:16, padding:'20px 12px', textAlign:'center', position:'relative',
                }}>
                  {p.best && (
                    <div style={{
                      position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)',
                      background:'#F9A825', color:'#1B3A6B',
                      fontSize:9, fontWeight:800, letterSpacing:1.5,
                      padding:'3px 10px', borderRadius:999, whiteSpace:'nowrap',
                      fontFamily:'Poppins,sans-serif',
                    }}>BEST VALUE</div>
                  )}
                  <div style={{ fontSize:28, marginBottom:6 }}>{p.icon}</div>
                  <div style={{ fontFamily:'Poppins,sans-serif', fontSize:14, fontWeight:700, color:'white' }}>{p.name}</div>
                  <div style={{ fontFamily:'Poppins,sans-serif', fontSize:13, color:p.color, fontWeight:600 }}>{p.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INSTANT QUOTE ────────────────────────────────────── */}
      <section style={{ background:'#E8F6FC', padding:'80px 0', textAlign:'center' }}>
        <div className="container">
          <div style={{ width:48, height:4, background:'#4DB8E8', borderRadius:2, margin:'0 auto 16px' }} />
          <div style={{ fontFamily:'Poppins,sans-serif', fontSize:12, fontWeight:600, letterSpacing:3, textTransform:'uppercase', color:'#4DB8E8', marginBottom:16 }}>System Replacement</div>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#1B3A6B', marginBottom:20 }}>
            Get an Instant Quote in 60 Seconds
          </h2>
          <p style={{ fontSize:'clamp(15px,1.8vw,18px)', color:'#4A5568', maxWidth:520, margin:'0 auto 36px', lineHeight:1.75 }}>
            Enter your address and our app gives you a guaranteed AC replacement price instantly, 24/7. No waiting, no sales pitch.
          </p>
          <a href="https://systemestimate.air-careconnect.com" target="_blank" rel="noopener noreferrer"
             className="btn btn-navy btn-lg">
            ⚡ Get My Instant Quote →
          </a>
          <p style={{ marginTop:16, fontSize:13, color:'#8FA3B1' }}>
            Powered by Air-Care Connect's live pricing engine. No account required.
          </p>
        </div>
      </section>

      {/* ── PHOTO STRIP ──────────────────────────────────────── */}
      <section style={{ background:'white', padding:'48px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
            <PhotoPlaceholder label="PHOTO: Technician working on indoor air handler" height={220} />
            <PhotoPlaceholder label="PHOTO: Clean outdoor condenser unit after service" height={220} />
            <PhotoPlaceholder label="PHOTO: Happy customer / completed job" height={220} />
          </div>
        </div>
      </section>

      {/* ── EMERGENCY BANNER ─────────────────────────────────── */}
      <section style={{ background:'#E53E3E', padding:'28px 0' }}>
        <div className="container" style={{
          display:'flex', alignItems:'center',
          justifyContent:'space-between', flexWrap:'wrap', gap:20,
        }}>
          <div>
            <div style={{ fontFamily:'Poppins,sans-serif', fontSize:'clamp(18px,2.5vw,22px)', fontWeight:800, color:'white' }}>
              🚨 AC Down? We Can Help — Fast.
            </div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.85)', marginTop:4 }}>
              Emergency service across Central Florida
            </div>
          </div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <a href={PHONE_EN_HREF} className="btn btn-gold">📞 {PHONE_EN}</a>
            <a href="tel:+14079638544" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'14px 20px', borderRadius:12,
              border:'2px solid rgba(255,255,255,0.5)',
              color:'white', fontFamily:'Poppins,sans-serif',
              fontWeight:600, fontSize:15, cursor:'pointer',
            }}>📞 Español: {PHONE_ES}</a>
          </div>
        </div>
      </section>
    </>
  );
}

