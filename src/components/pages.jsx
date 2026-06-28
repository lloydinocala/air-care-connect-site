import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

// ── Shared constants ──────────────────────────────────────────
const PHONE_EN = '352-484-6341';
const PHONE_EN_HREF = 'tel:+13524846341';
const PHONE_ES = '407-963-8544';
const PHONE_ES_HREF = 'tel:+14079638544';

// ── Shared colors (Home page palette) ────────────────────────
const SKY      = '#4DB8E8';
const NAVY     = '#1B3A6B';
const WHITE    = '#FFFFFF';
const OFF_WHITE= '#F7FBFD';
const SKY_PALE = '#E8F6FC';
const GRAY_LT  = '#EEF2F5';
const GRAY     = '#8FA3B1';
const GRAY_DK  = '#4A5568';
const CHARCOAL = '#1A1A2E';
const GOLD     = '#F9A825';

function PhotoPlaceholder({ label, height = 320 }) {
  return (
    <div style={{
      height, background: `linear-gradient(135deg, ${SKY_PALE}, ${GRAY_LT})`,
      border: `2px dashed ${SKY}`, borderRadius: 16,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 8, color: GRAY, fontSize: 12, textAlign: 'center', padding: 24,
    }}>
      <span style={{ fontSize: 32, opacity: 0.5 }}>📷</span>
      <span style={{ fontWeight: 600, color: SKY }}>{label}</span>
      <span style={{ opacity: 0.5 }}>Replace with actual photo</span>
    </div>
  );
}

// Auto-advancing screenshot carousel for the instant quote app.
// Phone-shaped, swipeable, pauses on hover/touch, dot + arrow nav.
function PhotoCarousel({ images, interval = 4500 }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  const goTo = (i) => setIndex(((i % images.length) + images.length) % images.length);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
  };

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [images.length]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; stopTimer(); };
  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) prev();
    else if (delta < -40) next();
    touchStartX.current = null;
    startTimer();
  };

  const arrowStyle = (side) => ({
    position: 'absolute', top: '50%', [side]: 8, transform: 'translateY(-50%)',
    width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer',
    background: 'rgba(27,58,107,0.55)', color: WHITE, fontSize: 18, lineHeight: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
  });

  return (
    <div>
      <div
        onMouseEnter={stopTimer}
        onMouseLeave={startTimer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative', width: '100%', maxWidth: 300, margin: '0 auto',
          aspectRatio: '9 / 19', borderRadius: 28, overflow: 'hidden',
          background: WHITE, border: `1px solid ${GRAY_LT}`,
          boxShadow: '0 16px 40px rgba(27,58,107,0.20)',
        }}
      >
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Instant quote app — step ${i + 1} of ${images.length}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', opacity: i === index ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          />
        ))}

        <button onClick={() => { prev(); startTimer(); }} aria-label="Previous screenshot" style={arrowStyle('left')}>‹</button>
        <button onClick={() => { next(); startTimer(); }} aria-label="Next screenshot" style={arrowStyle('right')}>›</button>

        <div style={{
          position: 'absolute', bottom: 12, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 6,
        }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); startTimer(); }}
              aria-label={`Go to screenshot ${i + 1}`}
              style={{
                width: i === index ? 18 : 7, height: 7, borderRadius: 4,
                border: 'none', cursor: 'pointer', padding: 0,
                background: i === index ? WHITE : 'rgba(255,255,255,0.55)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle, center = true }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 52 }}>
      <div style={{
        width: 48, height: 4, background: SKY, borderRadius: 2,
        margin: center ? '0 auto 16px' : '0 0 16px',
      }} />
      {eyebrow && (
        <div style={{
          fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 600,
          letterSpacing: 3, textTransform: 'uppercase', color: SKY, marginBottom: 12,
        }}>{eyebrow}</div>
      )}
      <h2 style={{
        fontFamily: 'Poppins, sans-serif',
        fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800,
        color: NAVY, lineHeight: 1.15, marginBottom: subtitle ? 16 : 0,
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          fontSize: 'clamp(15px, 1.8vw, 18px)', color: GRAY_DK,
          lineHeight: 1.75, maxWidth: 560, margin: center ? '0 auto' : 0,
        }}>{subtitle}</p>
      )}
    </div>
  );
}

function PageHero({ eyebrow, title, subtitle, titleAccent }) {
  return (
    <section style={{
      background: `linear-gradient(160deg, ${OFF_WHITE} 0%, ${SKY_PALE} 50%, ${OFF_WHITE} 100%)`,
      padding: '140px 0 80px', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 600, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(77,184,232,0.08) 0%, transparent 70%)`,
      }} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {eyebrow && (
          <div style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 600,
            letterSpacing: 3, textTransform: 'uppercase', color: SKY, marginBottom: 16,
          }}>{eyebrow}</div>
        )}
        <h1 style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 800,
          color: NAVY, lineHeight: 1.1, marginBottom: 20,
        }}>
          {title}{' '}
          {titleAccent && <span style={{ color: SKY }}>{titleAccent}</span>}
        </h1>
        {subtitle && (
          <p style={{
            fontSize: 'clamp(16px,1.8vw,19px)', color: GRAY_DK,
            lineHeight: 1.75, maxWidth: 580, margin: '0 auto',
          }}>{subtitle}</p>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════
const CHECKLIST = [
  'Measure supply/return air temperature differential',
  'Check refrigerant pressures (suction + discharge)',
  'Inspect and clean evaporator coil',
  'Inspect and clean condenser coil + straighten fins',
  'Clear and flush condensate drain line',
  'Treat drain pan with condensate tabs',
  'Inspect and test capacitor(s) — measure microfarads',
  'Inspect contactor for pitting and burning',
  'Test and record compressor amperage draw',
  'Test and record blower motor amperage draw',
  'Inspect blower wheel — clean if needed',
  'Check and tighten all electrical connections',
  'Test thermostat operation and calibration',
  'Replace thermostat batteries (Tier 2+)',
  'Replace air filter (included per plan)',
  'Inspect and clean condensate pump if present',
  'Inspect accessible ductwork connections',
  'Inspect disconnect box — fuses and wiring',
  'Check and record system voltage',
  'Verify full cooling cycle — record all readings',
  'Written system report left with homeowner',
];

const SVCS = [
  {
    icon: '🔧', title: 'AC Repair',
    desc: 'Your AC chose the worst possible day to break down — we know. Air-Care Connect offers fast diagnosis and same-day repair for most issues. Our technicians carry common parts on every truck.',
    points: ['All makes and models','Same-day service available','Upfront pricing before we start','No overtime charges for Club members'],
    photo: 'PHOTO: Technician repairing indoor air handler unit',
  },
  {
    icon: '🔍', title: '21-Point Maintenance Tune-Up',
    desc: 'Our thorough tune-up is the foundation of everything we do. Florida\'s year-round AC season means your system accumulates more wear than almost anywhere in the country.',
    points: ['Full 21-point inspection protocol','Written report after every visit','Included in all Air-Care Club plans','Spring and fall scheduling windows'],
    photo: 'PHOTO: Technician performing tune-up / checking gauges',
    checklist: true,
  },
  {
    icon: '❄️', title: 'System Replacement',
    desc: 'When it\'s time for a new system, we make it simple. Use our instant quote tool to get a guaranteed price in 60 seconds — or call us for a full in-home assessment.',
    points: ['Instant online quote available 24/7','All major brands','Permit handling included','Financing options available'],
    photo: 'PHOTO: New system installation / outdoor unit being placed',
    images: [
      '/See%20What%20a%20New%20Comfort%20System%20Could%20Cost%20for%20Your%20Home.jpg',
      '/What%20Would%20You%20Like%20to%20Estimate.jpg',
      '/Determining%20Your%20System%20Requirements.jpg',
      '/Please%20Choose%20A%20Brand.jpg',
      '/Choose%20Your%20Brand%20Family.jpg',
      '/Your%20System%20Recommendations.jpg',
      '/Review%20Your%20System%20Details.jpg',
      '/Almost%20There.jpg',
      '/Choose%20Your%20Installation%20Date.jpg',
      '/Choose%20How%20You%20Like%20to%20Pay.jpg',
      '/Booking%20Confirmation.jpg',
    ],
    cta: { label: '⚡ Get Instant Quote', href: 'https://systemestimate.air-careconnect.com', external: true },
  },
  {
    icon: '💨', title: 'Indoor Air Quality',
    desc: 'Florida\'s humidity creates unique challenges — mold risk, airborne allergens, and musty air are common complaints. We offer filtration upgrades, UV systems, and whole-home dehumidification.',
    points: ['MERV 8, 11, and 13 filtration upgrades','UV germicidal light installation','Whole-home dehumidification','Duct cleaning assessment'],
    photo: 'PHOTO: Filter or IAQ equipment close-up',
  },
];

export function Services() {
  return (
    <>
      <PageHero
        eyebrow="What We Offer"
        title="HVAC Services"
        subtitle="Complete air conditioning and heat pump services across Central Florida. All makes and models. Licensed and insured."
      />

      {SVCS.map((svc, i) => (
        <section key={i} style={{ background: i % 2 === 0 ? WHITE : OFF_WHITE, padding: '80px 0' }}>
          <div className="container">
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 64, alignItems: 'center',
            }}>
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{svc.icon}</div>
                <div style={{ width: 48, height: 4, background: SKY, borderRadius: 2, marginBottom: 20 }} />
                <h2 style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(22px,3vw,32px)',
                  fontWeight: 700, color: NAVY, marginBottom: 16,
                }}>{svc.title}</h2>
                <p style={{ fontSize: 16, color: GRAY_DK, lineHeight: 1.75, marginBottom: 24 }}>{svc.desc}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {svc.points.map((p, j) => (
                    <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15, color: GRAY_DK }}>
                      <span style={{
                        flexShrink: 0, width: 22, height: 22,
                        background: SKY_PALE, color: SKY,
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 12, fontWeight: 700,
                        marginTop: 1, border: `1px solid rgba(77,184,232,0.3)`,
                      }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
                {svc.cta ? (
                  <a href={svc.cta.href} target="_blank" rel="noopener noreferrer"
                     className="btn btn-navy">{svc.cta.label}</a>
                ) : (
                  <a href={PHONE_EN_HREF} className="btn btn-navy">📞 Schedule: {PHONE_EN}</a>
                )}
              </div>
              <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                {svc.images ? (
                  <PhotoCarousel images={svc.images} />
                ) : (
                  <PhotoPlaceholder label={svc.photo} height={340} />
                )}
                {svc.checklist && (
                  <div style={{
                    marginTop: 20, background: WHITE,
                    border: `1px solid ${GRAY_LT}`, borderRadius: 16, padding: 24,
                    boxShadow: '0 2px 12px rgba(27,58,107,0.06)',
                  }}>
                    <div style={{
                      fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: 2, color: SKY, marginBottom: 16,
                    }}>Our 21-Point Checklist</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                      {CHECKLIST.map((item, j) => (
                        <div key={j} style={{
                          fontSize: 12, color: GRAY_DK,
                          display: 'flex', gap: 6, alignItems: 'flex-start',
                        }}>
                          <span style={{ color: SKY, flexShrink: 0 }}>✓</span>{item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Club CTA */}
      <section style={{ background: NAVY, padding: '64px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(24px,3vw,36px)',
            fontWeight: 800, color: WHITE, marginBottom: 16,
          }}>Save on Every Service with a Club Plan</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Members get 10–20% off all repairs, priority scheduling, and free tune-ups. From $14.99/month.
          </p>
          <Link to="/club" className="btn btn-primary btn-lg">View Club Plans →</Link>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// ABOUT
// ═══════════════════════════════════════════════════════════════
const COUNTIES = ['Marion County','Lake County','Sumter County','Levy County','Citrus County','Alachua County','The Villages'];

export function About() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Local Owners."
        titleAccent="Real Service."
        subtitle="Air-Care Connect and Aire Azul are owned and operated by Lloyd and Orlando — two partners who built this business to serve Central Florida homeowners the right way."
      />

      {/* Story section */}
      <section style={{ background: WHITE, padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ width: 48, height: 4, background: SKY, borderRadius: 2, marginBottom: 20 }} />
              <h2 style={{
                fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(24px,3vw,36px)',
                fontWeight: 800, color: NAVY, marginBottom: 20,
              }}>Why We Started</h2>
              <p style={{ fontSize: 16, color: GRAY_DK, lineHeight: 1.8, marginBottom: 16 }}>
                We started with a simple belief: HVAC service in this region had too many companies
                that treated customers like a transaction. We wanted to build something different —
                a business where the owner answers the phone, technicians show up on time, and the
                price quoted is the price charged.
              </p>
              <p style={{ fontSize: 16, color: GRAY_DK, lineHeight: 1.8 }}>
                Our dual-brand structure — Air-Care Connect for English-speaking customers and
                Aire Azul for Spanish-speaking customers — means we serve the full community
                across our six-county territory with equal quality and professionalism.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PhotoPlaceholder label="PHOTO: Lloyd & Orlando — owners / team photo" height={280} />
              <PhotoPlaceholder label="PHOTO: Service truck / branded vehicle" height={180} />
            </div>
          </div>
        </div>
      </section>

      {/* Service territory */}
      <section style={{ background: OFF_WHITE, padding: '80px 0' }}>
        <div className="container">
          <SectionHeader
            eyebrow="Where We Serve"
            title="Six Counties + The Villages"
            subtitle="We cover a wide territory across Central Florida. If you're not sure whether we service your area, just call — we'll let you know."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {COUNTIES.map((c, i) => (
              <div key={i} style={{
                background: WHITE, border: `1px solid ${GRAY_LT}`,
                borderRadius: 16, padding: '24px 16px', textAlign: 'center',
                boxShadow: '0 2px 8px rgba(27,58,107,0.06)',
                transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📍</div>
                <div style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 700, color: NAVY,
                }}>{c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual brand */}
      <section style={{ background: WHITE, padding: '80px 0' }}>
        <div className="container">
          <SectionHeader eyebrow="Two Brands, One Standard" title="Air-Care Connect & Aire Azul" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {[
              {
                name: 'Air-Care Connect', lang: 'English', phone: PHONE_EN, href: PHONE_EN_HREF,
                color: SKY,
                desc: 'Serving English-speaking homeowners across all six counties. Same-day service, professional technicians, and the Air-Care Club membership program.',
              },
              {
                name: 'Aire Azul', lang: 'Español — Se habla español', phone: PHONE_ES, href: PHONE_ES_HREF,
                color: '#E07A5F',
                desc: 'Sirviendo a clientes hispanohablantes en todo el territorio. El mismo nivel de servicio profesional, comunicado en su idioma. Club Aire Azul disponible.',
              },
            ].map((brand, i) => (
              <div key={i} style={{
                background: WHITE, border: `1px solid ${GRAY_LT}`,
                borderTop: `4px solid ${brand.color}`,
                borderRadius: 16, padding: 32,
                boxShadow: '0 4px 16px rgba(27,58,107,0.08)',
              }}>
                <div style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: 24, fontWeight: 800,
                  color: brand.color, marginBottom: 8,
                }}>{brand.name}</div>
                <span style={{
                  display: 'inline-block', background: SKY_PALE,
                  color: NAVY, padding: '4px 12px', borderRadius: 999,
                  fontSize: 12, fontWeight: 600, marginBottom: 16,
                }}>{brand.lang}</span>
                <p style={{ fontSize: 15, color: GRAY_DK, lineHeight: 1.7, marginBottom: 20 }}>{brand.desc}</p>
                <a href={brand.href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 24px', borderRadius: 10,
                  border: `2px solid ${brand.color}`, color: brand.color,
                  fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15,
                  transition: 'all 0.2s',
                }}>📞 {brand.phone}</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════════════════════
export function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Reach Us"
        title="Contact Us"
        subtitle="Call, text, or send a message. We respond fast — especially for Air-Care Club members."
      />

      <section style={{ background: OFF_WHITE, padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>

            {/* Contact info cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { icon:'📞', title:'English Line', value:PHONE_EN, href:PHONE_EN_HREF, sub:'Air-Care Connect — call or text' },
                { icon:'📞', title:'Línea en Español', value:PHONE_ES, href:PHONE_ES_HREF, sub:'Aire Azul — llame o envíe un mensaje' },
                { icon:'⏰', title:'Hours', value:'Mon–Fri 7am–7pm | Sat 8am–5pm', sub:'Emergency service available for Club members' },
                { icon:'📍', title:'Service Area', value:'Ocala & Central Florida', sub:'Marion, Lake, Sumter, Levy, Citrus, Alachua + The Villages' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: WHITE, border: `1px solid ${GRAY_LT}`,
                  borderRadius: 16, padding: '24px 28px',
                  display: 'flex', gap: 20, alignItems: 'flex-start',
                  boxShadow: '0 2px 8px rgba(27,58,107,0.06)',
                }}>
                  <div style={{
                    width: 48, height: 48, flexShrink: 0,
                    background: SKY_PALE, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{
                      fontFamily: 'Poppins, sans-serif', fontSize: 11,
                      letterSpacing: 2, color: SKY, textTransform: 'uppercase',
                      fontWeight: 600, marginBottom: 6,
                    }}>{item.title}</div>
                    {item.href ? (
                      <a href={item.href} style={{
                        fontFamily: 'Poppins, sans-serif', fontSize: 22,
                        fontWeight: 700, color: NAVY, display: 'block', marginBottom: 4,
                      }}>{item.value}</a>
                    ) : (
                      <div style={{
                        fontFamily: 'Poppins, sans-serif', fontSize: 16,
                        fontWeight: 700, color: NAVY, marginBottom: 4,
                      }}>{item.value}</div>
                    )}
                    <div style={{ fontSize: 13, color: GRAY }}>{item.sub}</div>
                  </div>
                </div>
              ))}

              <div style={{
                background: SKY_PALE, border: `1px solid rgba(77,184,232,0.3)`,
                borderRadius: 16, padding: '20px 24px',
              }}>
                <div style={{ fontFamily:'Poppins,sans-serif', fontSize:16, fontWeight:700, color:NAVY, marginBottom:8 }}>
                  ⭐ Air-Care Club Members
                </div>
                <p style={{ fontSize:14, color:GRAY_DK, lineHeight:1.6 }}>
                  Club members receive priority response. When you call, identify yourself as a member
                  and you'll be moved to the front of the scheduling queue — especially important during peak season.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div style={{
              background: WHITE, border: `1px solid ${GRAY_LT}`,
              borderRadius: 20, padding: 40,
              boxShadow: '0 4px 24px rgba(27,58,107,0.08)',
            }}>
              <h2 style={{
                fontFamily: 'Poppins, sans-serif', fontSize: 24,
                fontWeight: 700, color: NAVY, marginBottom: 24,
              }}>Send a Message</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label:'Your Name', type:'text', placeholder:'John Smith' },
                  { label:'Phone Number', type:'tel', placeholder:'(352) 000-0000' },
                  { label:'Email Address', type:'email', placeholder:'john@example.com' },
                  { label:'City / Neighborhood', type:'text', placeholder:'Ocala, The Villages, etc.' },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{
                      display: 'block', fontSize: 12,
                      fontFamily: 'Poppins, sans-serif', letterSpacing: 1.5,
                      textTransform: 'uppercase', color: GRAY_DK,
                      fontWeight: 600, marginBottom: 6,
                    }}>{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} style={{
                      width: '100%', padding: '12px 16px',
                      background: OFF_WHITE, border: `1px solid ${GRAY_LT}`,
                      borderRadius: 10, color: CHARCOAL,
                      fontFamily: 'Inter, sans-serif', fontSize: 15, outline: 'none',
                    }} />
                  </div>
                ))}
                <div>
                  <label style={{
                    display: 'block', fontSize: 12, fontFamily: 'Poppins, sans-serif',
                    letterSpacing: 1.5, textTransform: 'uppercase', color: GRAY_DK,
                    fontWeight: 600, marginBottom: 6,
                  }}>How Can We Help?</label>
                  <textarea rows={4} placeholder="AC not cooling, needs tune-up, interested in Club membership..." style={{
                    width: '100%', padding: '12px 16px',
                    background: OFF_WHITE, border: `1px solid ${GRAY_LT}`,
                    borderRadius: 10, color: CHARCOAL,
                    fontFamily: 'Inter, sans-serif', fontSize: 15,
                    resize: 'vertical', outline: 'none',
                  }} />
                </div>
                <button className="btn btn-navy" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                  Send Message →
                </button>
                <p style={{ fontSize: 12, color: GRAY, textAlign: 'center' }}>
                  We typically respond within 2 hours during business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// AIRE AZUL
// ═══════════════════════════════════════════════════════════════
export function AireAzul() {
  const TERRA = '#E07A5F';
  return (
    <>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(160deg, ${OFF_WHITE} 0%, #FDF0EC 50%, ${OFF_WHITE} 100%)`,
        padding: '140px 0 80px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 500, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,122,95,0.08) 0%, transparent 70%)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 600,
            letterSpacing: 3, textTransform: 'uppercase', color: TERRA, marginBottom: 16,
          }}>Servicio en Español — Se habla español</div>
          <h1 style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 900,
            color: NAVY, lineHeight: 1.1, marginBottom: 20,
          }}>
            <span style={{ color: TERRA }}>Aire</span>{' '}
            <span style={{ color: NAVY }}>Azul</span>
          </h1>
          <p style={{
            fontSize: 'clamp(16px,1.8vw,19px)', color: GRAY_DK,
            lineHeight: 1.75, maxWidth: 560, margin: '0 auto 36px',
          }}>
            Servicio profesional de aire acondicionado para hogares hispanohablantes
            en el Centro de Florida. El mismo nivel de calidad — en su idioma.
          </p>
          <a href={PHONE_ES_HREF} className="btn btn-lg" style={{
            background: TERRA, color: WHITE, border: `2px solid ${TERRA}`,
          }}>📞 Llame: {PHONE_ES}</a>
        </div>
      </section>

      {/* Services */}
      <section style={{ background: WHITE, padding: '80px 0' }}>
        <div className="container">
          <SectionHeader eyebrow="Lo Que Ofrecemos" title="Nuestros Servicios" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { icon:'🔧', title:'Reparación de AC', desc:'Diagnóstico rápido y reparación el mismo día en la mayoría de los casos. Todas las marcas y modelos.' },
              { icon:'🔍', title:'Mantenimiento Preventivo', desc:'Inspección de 21 puntos. Extienda la vida de su equipo y evite reparaciones de emergencia costosas.' },
              { icon:'❄️', title:'Reemplazo de Sistema', desc:'Cuando es hora de un sistema nuevo, lo hacemos simple. Cotización instantánea en línea disponible 24/7.' },
              { icon:'💨', title:'Calidad del Aire Interior', desc:'Filtros MERV 8, 11 y 13, control de humedad, y sistemas UV para el clima húmedo de Florida.' },
              { icon:'🏗️', title:'Instalación Nueva', desc:'Instalaciones para nuevas construcciones y ampliaciones. Dimensionamiento adecuado garantizado.' },
              { icon:'🌡️', title:'Servicio de Bomba de Calor', desc:'Reparación, mantenimiento y reemplazo completo de bombas de calor.' },
            ].map((s, i) => (
              <div key={i} style={{
                background: WHITE, border: `1px solid ${GRAY_LT}`,
                borderRadius: 16, padding: 28,
                display: 'flex', gap: 16,
                boxShadow: '0 2px 8px rgba(27,58,107,0.06)',
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 52, height: 52, flexShrink: 0,
                  background: '#FDF0EC', borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                }}>{s.icon}</div>
                <div>
                  <h3 style={{
                    fontFamily: 'Poppins, sans-serif', fontSize: 17, fontWeight: 700,
                    color: NAVY, marginBottom: 8,
                  }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: GRAY_DK, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Club Aire Azul */}
      <section style={{ background: OFF_WHITE, padding: '80px 0' }}>
        <div className="container">
          <SectionHeader eyebrow="Programa de Membresía" title="Club Aire Azul"
            subtitle="Proteja su equipo y ahorre dinero con nuestra membresía anual. Mantenimiento profesional, servicio prioritario y descuentos en reparaciones." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { icon:'🥈', name:'Plata', price:'$169/año', sub:'2 visitas • 10% desc.', color:'#78909C' },
              { icon:'⭐', name:'Oro', price:'$249/año', sub:'3 visitas • 4 filtros • 15% desc.', color:GOLD, best:true },
              { icon:'💎', name:'Platino', price:'$399/año', sub:'Prioridad VIP • Sin cargo de servicio', color:SKY },
            ].map((p, i) => (
              <div key={i} style={{
                background: WHITE, border: `2px solid ${p.best ? GOLD : GRAY_LT}`,
                borderRadius: 16, padding: '28px 20px', textAlign: 'center',
                boxShadow: p.best ? `0 8px 24px rgba(249,168,37,0.15)` : '0 2px 8px rgba(27,58,107,0.06)',
                position: 'relative',
              }}>
                {p.best && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: GOLD, color: NAVY, fontSize: 10, fontWeight: 800,
                    letterSpacing: 1.5, padding: '3px 12px', borderRadius: 999,
                    fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap',
                  }}>MEJOR VALOR</div>
                )}
                <div style={{ fontSize: 36, marginBottom: 10 }}>{p.icon}</div>
                <div style={{ fontFamily:'Poppins,sans-serif', fontSize:20, fontWeight:800, color:NAVY }}>
                  Club Aire Azul {p.name}
                </div>
                <div style={{ fontFamily:'Poppins,sans-serif', fontSize:26, fontWeight:900, color:p.color, margin:'10px 0' }}>
                  {p.price}
                </div>
                <div style={{ fontSize:13, color:GRAY }}>{p.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href={PHONE_ES_HREF} className="btn btn-lg" style={{
              background: TERRA, color: WHITE, border: `2px solid ${TERRA}`,
            }}>📞 Llame para unirse: {PHONE_ES}</a>
          </div>
        </div>
      </section>

      {/* Service area */}
      <section style={{ background: NAVY, padding: '48px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(22px,3vw,32px)',
            fontWeight: 800, color: WHITE, marginBottom: 16,
          }}>Área de Servicio</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, maxWidth: 600, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Servimos los condados de Marion, Lake, Sumter, Levy, Citrus y Alachua,
            incluyendo The Villages, Ocala, Gainesville, Leesburg y toda el área central de Florida.
          </p>
          <a href={PHONE_ES_HREF} className="btn btn-lg" style={{
            background: TERRA, color: WHITE, border: `2px solid ${TERRA}`,
          }}>📞 {PHONE_ES} — ¡Llame hoy!</a>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════
export function Footer() {
  return (
    <footer style={{
      background: NAVY,
      borderTop: `4px solid ${SKY}`,
      padding: '64px 0 32px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 48, marginBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 20, fontWeight: 800,
              color: WHITE, marginBottom: 4,
            }}>Air-Care Connect</div>
            <div style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 12, color: SKY,
              letterSpacing: 1.5, marginBottom: 16, fontWeight: 500,
            }}>+ Aire Azul</div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              Professional HVAC service across Central Florida. Licensed, insured, and locally owned.
            </p>
          </div>

          {/* Links */}
          <div>
            <div style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 11, letterSpacing: 2,
              color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase', fontWeight: 600,
            }}>Pages</div>
            {[['/', 'Home'],['/services','Services'],['/club','Air-Care Club'],['/about','About Us'],['/contact','Contact'],['/aire-azul','🇪🇸 Aire Azul']].map(([href, label]) => (
              <a key={href} href={href} style={{
                display: 'block', fontSize: 14,
                color: 'rgba(255,255,255,0.65)', marginBottom: 10,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = SKY}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
              >{label}</a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 11, letterSpacing: 2,
              color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase', fontWeight: 600,
            }}>Contact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: SKY, marginBottom: 3, letterSpacing: 1 }}>ENGLISH LINE</div>
                <a href={PHONE_EN_HREF} style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: 20,
                  fontWeight: 700, color: WHITE,
                }}>{PHONE_EN}</a>
              </div>
              <div>
                <div style={{ fontSize: 11, color: SKY, marginBottom: 3, letterSpacing: 1 }}>LÍNEA EN ESPAÑOL</div>
                <a href={PHONE_ES_HREF} style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: 20,
                  fontWeight: 700, color: WHITE,
                }}>{PHONE_ES}</a>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                Mon–Fri 7am–7pm<br/>Sat 8am–5pm
              </div>
            </div>
          </div>

          {/* Service area */}
          <div>
            <div style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 11, letterSpacing: 2,
              color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase', fontWeight: 600,
            }}>Service Area</div>
            {COUNTIES.map(c => (
              <div key={c} style={{
                fontSize: 13, color: 'rgba(255,255,255,0.55)',
                marginBottom: 7, display: 'flex', gap: 8,
              }}>
                <span style={{ color: SKY }}>▸</span> {c}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 24,
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} Air-Care Connect / Aire Azul. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(56,161,105,0.15)', color: '#68D391',
              border: '1px solid rgba(56,161,105,0.3)',
              padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
            }}>✓ Licensed & Insured</span>
            <span style={{
              background: `rgba(77,184,232,0.15)`, color: SKY,
              border: `1px solid rgba(77,184,232,0.3)`,
              padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
            }}>✓ Se habla español</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>air-careconnect.com</div>
        </div>
      </div>
    </footer>
  );
}
