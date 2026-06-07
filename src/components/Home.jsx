import { Link } from 'react-router-dom';

const PHONE_EN = '352-484-6341';
const PHONE_EN_HREF = 'tel:+13524846341';
const PHONE_ES = '407-963-8544';

const COUNTIES = ['Marion County','Lake County','Sumter County','Levy County','Citrus County','Alachua County','The Villages','Ocala','Gainesville','Leesburg','Inverness','Crystal River'];

function PhotoPlaceholder({ label, height = 400, style = {} }) {
  return (
    <div className="photo-placeholder" style={{ height, ...style }}>
      <span className="ph-icon">📷</span>
      <span className="ph-label">{label}</span>
      <span style={{ fontSize: 10, opacity: 0.4 }}>Replace with actual photo</span>
    </div>
  );
}

const SERVICES = [
  { icon: '🔧', title: 'AC Repair', desc: 'Fast diagnosis and repair. Most repairs completed same day. All makes and models.' },
  { icon: '🔍', title: 'Maintenance Tune-Up', desc: '21-point inspection. Extend system life, cut energy bills, avoid emergency breakdowns.' },
  { icon: '❄️', title: 'System Replacement', desc: 'Full AC and heat pump replacement. Get an instant online quote in 60 seconds.' },
  { icon: '🏗️', title: 'New Installation', desc: 'New construction and add-on installations. Proper sizing and commissioning guaranteed.' },
  { icon: '💨', title: 'Indoor Air Quality', desc: 'Filtration upgrades, UV treatment, humidity control for Florida\'s climate challenges.' },
  { icon: '🌡️', title: 'Heat Pump Service', desc: 'Full heat pump repair, maintenance, and replacement. R-410A and R-32 certified.' },
];

const STATS = [
  { value: '6', label: 'Counties Served', sub: 'Marion, Lake, Sumter, Levy, Citrus, Alachua' },
  { value: '21', label: 'Point Tune-Up', sub: 'The most thorough inspection in the area' },
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
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #0B1D3A 0%, #122448 50%, #0B1D3A 100%)',
        paddingTop: 72,
      }}>
        {/* Decorative grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }} />
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '20%', right: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(21,101,192,0.25) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,172,193,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}>
            {/* Left: copy */}
            <div>
              <div className="section-label animate-fade-up">
                <span className="eyebrow">Ocala & Central Florida HVAC</span>
              </div>

              <h1 className="display-xl animate-fade-up delay-1" style={{
                marginBottom: 24, color: 'var(--white)',
              }}>
                Keep Your Home{' '}
                <span style={{
                  color: 'var(--gold)',
                  display: 'block',
                  textShadow: '0 0 40px rgba(249,168,37,0.3)',
                }}>
                  Cool &amp; Comfortable
                </span>
                All Year Long
              </h1>

              <p className="lead animate-fade-up delay-2" style={{ marginBottom: 36, maxWidth: 480 }}>
                Professional AC repair, maintenance, and replacement across Marion, Lake,
                Sumter, Levy, Citrus &amp; Alachua Counties — including The Villages.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}
                   className="animate-fade-up delay-3">
                <a href={PHONE_EN_HREF} className="btn btn-primary btn-lg">
                  📞 Call {PHONE_EN}
                </a>
                <Link to="/club" className="btn btn-outline btn-lg">
                  View Club Plans
                </Link>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
                   className="animate-fade-up delay-4">
                <span className="badge badge-green">✓ Licensed & Insured</span>
                <span className="badge badge-blue">✓ Same-Day Service</span>
                <span className="badge badge-gold">✓ Se habla español</span>
                <span className="badge badge-cyan">✓ All Makes & Models</span>
              </div>
            </div>

            {/* Right: photo */}
            <div className="animate-fade-up delay-2" style={{ position: 'relative' }}>
              <PhotoPlaceholder
                label="HERO PHOTO: Technician at outdoor AC unit / clean professional shot"
                height={520}
                style={{ borderRadius: 20 }}
              />
              {/* Floating card overlay */}
              <div style={{
                position: 'absolute', bottom: -20, left: -20,
                background: 'var(--navy-mid)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 16,
                padding: '20px 24px',
                backdropFilter: 'blur(20px)',
                boxShadow: 'var(--shadow-lg)',
                animation: 'float 4s ease-in-out infinite',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 32, fontWeight: 900,
                  color: 'var(--gold)', lineHeight: 1,
                }}>$0</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                  Diagnostic fee waived<br/>for Club members
                </div>
              </div>
              {/* Top badge */}
              <div style={{
                position: 'absolute', top: -16, right: -16,
                background: 'var(--blue)',
                borderRadius: 12, padding: '12px 18px',
                boxShadow: 'var(--shadow-md)',
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, lineHeight: 1 }}>
                  24hr
                </div>
                <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Priority Response</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 8, opacity: 0.4,
          animation: 'float 2s ease-in-out infinite',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2 }}>SCROLL</div>
          <div style={{ fontSize: 20 }}>↓</div>
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
      <section className="section-sm" style={{ background: 'var(--navy-mid)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 2,
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: '32px 24px', textAlign: 'center',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 56, fontWeight: 900,
                  color: 'var(--gold)', lineHeight: 1,
                  marginBottom: 8,
                }}>{s.value}</div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18, fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1, marginBottom: 6,
                }}>{s.label}</div>
                <div style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="gold-bar" style={{ margin: '0 auto 20px' }} />
            <div className="eyebrow" style={{ marginBottom: 12 }}>What We Do</div>
            <h2 className="display-lg">Complete HVAC Services</h2>
            <p className="lead" style={{ maxWidth: 540, margin: '16px auto 0' }}>
              From emergency repairs to full system replacements — we handle everything
              your home comfort system needs.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: 16 }}>
                <div style={{
                  width: 52, height: 52, flexShrink: 0,
                  background: 'rgba(21,101,192,0.15)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26,
                }}>
                  {s.icon}
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 20, fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/services" className="btn btn-outline">
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CLUB TEASER ──────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--blue) 0%, var(--navy-light) 100%)',
        padding: '80px 0',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,168,37,0.15) 0%, transparent 70%)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 64, alignItems: 'center',
          }}>
            <div>
              <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: 16 }}>
                Membership Program
              </div>
              <h2 className="display-lg" style={{ marginBottom: 20 }}>
                Join the<br />
                <span style={{ color: 'var(--gold)' }}>Air-Care Club</span>
              </h2>
              <p className="lead" style={{ marginBottom: 32 }}>
                Two professional tune-ups a year, priority scheduling, repair discounts,
                and filters included — starting at just $14.99/month.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/club" className="btn btn-primary btn-lg">
                  See Club Plans
                </Link>
                <a href={PHONE_EN_HREF} className="btn btn-outline">
                  Call to Join
                </a>
              </div>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
            }}>
              {[
                { icon:'🥈', name:'Silver', price:'$169/yr' },
                { icon:'⭐', name:'Gold', price:'$249/yr', best: true },
                { icon:'💎', name:'Platinum', price:'$399/yr' },
                { icon:'📞', name:'Priority Line', price:'Members Only' },
              ].map((p, i) => (
                <div key={i} style={{
                  background: p.best ? 'rgba(249,168,37,0.15)' : 'rgba(255,255,255,0.07)',
                  border: `1px solid ${p.best ? 'rgba(249,168,37,0.4)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: 16,
                  padding: '20px 16px',
                  textAlign: 'center',
                  position: 'relative',
                }}>
                  {p.best && (
                    <div style={{
                      position: 'absolute', top: -10, left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--gold)',
                      color: 'var(--navy)',
                      fontSize: 9, fontWeight: 800,
                      letterSpacing: 1.5, textTransform: 'uppercase',
                      padding: '3px 10px', borderRadius: 999,
                      whiteSpace: 'nowrap',
                    }}>Best Value</div>
                  )}
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{p.icon}</div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18, fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>{p.name}</div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 16, color: p.best ? 'var(--gold)' : 'var(--blue-light)',
                    fontWeight: 600,
                  }}>{p.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INSTANT QUOTE CTA ────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--navy-mid)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="gold-bar" style={{ margin: '0 auto 20px' }} />
          <div className="eyebrow" style={{ marginBottom: 16 }}>System Replacement</div>
          <h2 className="display-lg" style={{ marginBottom: 20 }}>
            Get an Instant Quote<br />in 60 Seconds
          </h2>
          <p className="lead" style={{ maxWidth: 520, margin: '0 auto 36px' }}>
            Enter your address and home details — our app gives you a guaranteed
            AC replacement price instantly, 24/7. No waiting, no sales pitch.
          </p>
          <a
            href="https://air-care-connect-estimate-app.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
          >
            ⚡ Get My Instant Quote →
          </a>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--gray)' }}>
            Powered by Air-Care Connect's live pricing engine. No account required.
          </p>
        </div>
      </section>

      {/* ── PHOTO STRIP ──────────────────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}>
            <PhotoPlaceholder label="PHOTO: Technician working on indoor air handler" height={260} />
            <PhotoPlaceholder label="PHOTO: Clean outdoor condenser unit after service" height={260} />
            <PhotoPlaceholder label="PHOTO: Happy customer / completed job" height={260} />
          </div>
        </div>
      </section>

      {/* ── EMERGENCY CTA BANNER ─────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(90deg, #B71C1C, #C62828)',
        padding: '32px 0',
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28, fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              🚨 AC Down? We Can Help — Fast.
            </div>
            <div style={{ fontSize: 15, opacity: 0.85, marginTop: 4 }}>
              Call now for emergency service across Central Florida
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={PHONE_EN_HREF} className="btn btn-primary">
              📞 {PHONE_EN}
            </a>
            <a href="tel:+14079638544" className="btn btn-outline">
              📞 Español: {PHONE_ES}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
