import { Link, useLocation } from 'react-router-dom';
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
    id: 'ac-repair',
    icon: '🔧', title: 'AC Repair',
    desc: 'Your AC chose the worst possible day to break down — we know. Air-Care Connect offers fast diagnosis and same-day repair for most issues. Our technicians carry common parts on every truck.',
    points: ['All makes and models','Same-day service available','Upfront pricing before we start','No overtime charges for Club members'],
    photo: 'PHOTO: Technician repairing indoor air handler unit',
    ctas: [
      { label: `📞 Call: ${PHONE_EN}`, href: PHONE_EN_HREF },
      { label: '📅 Book a Service Call', href: '/contact', internal: true },
    ],
  },
  {
    id: 'tune-up',
    icon: '🔍', title: '21-Point Maintenance Tune-Up',
    desc: 'Our thorough tune-up is the foundation of everything we do. Florida\'s year-round AC season means your system accumulates more wear than almost anywhere in the country.',
    points: ['Full 21-point inspection protocol','Written report after every visit','Included in all Air-Care Club plans','Spring and fall scheduling windows'],
    photo: 'PHOTO: Technician performing tune-up / checking gauges',
    checklist: true,
    ctas: [
      { label: `📞 Call: ${PHONE_EN}`, href: PHONE_EN_HREF },
      { label: '📅 Book a Maintenance Tune-Up', href: `/contact?issue=${encodeURIComponent('Routine Maintenance / Tune-Up')}`, internal: true },
    ],
  },
  {
    id: 'system-replacement',
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
    ctas: [
      { label: `📞 Call: ${PHONE_EN}`, href: PHONE_EN_HREF },
      { label: '⚡ Get Instant Quote', href: 'https://systemestimate.air-careconnect.com', external: true },
    ],
  },
  {
    id: 'new-installation',
    icon: '🏗️', title: 'New Installation',
    desc: 'Installing HVAC in new construction or an addition? We handle proper load calculations, equipment selection, and commissioning from the ground up. We provide Energy Calculations for new residential construction.',
    points: ['New residential construction','Room additions and conversions','Proper Manual J load calculations','Full commissioning and testing'],
    photo: 'PHOTO: New construction installation',
    ctas: [
      { label: `📞 Call: ${PHONE_EN}`, href: PHONE_EN_HREF },
      { label: '📅 Schedule a Consultation', href: '/contact', internal: true },
    ],
  },
  {
    id: 'duct-cleaning',
    icon: '💨', title: 'Duct Cleaning & Indoor Air Quality',
    desc: 'Florida\'s humidity creates unique challenges — mold risk, airborne allergens, and musty air are common complaints. We offer filtration upgrades, UV systems, and whole-home dehumidification.',
    points: ['MERV 8, 11, and 13 filtration upgrades','UV germicidal light installation','Whole-home dehumidification','Duct cleaning assessment'],
    photo: 'PHOTO: Filter or IAQ equipment close-up',
    ctas: [
      { label: `📞 Call: ${PHONE_EN}`, href: PHONE_EN_HREF },
      { label: '📅 Book a Duct Cleaning', href: `/contact?issue=${encodeURIComponent('Duct Cleaning')}`, internal: true },
    ],
  },
  {
    id: 'heat-pump',
    icon: '🌡️', title: 'Heat Pump Service',
    desc: 'Full heat pump repair, maintenance, and replacement. R-410A, R-32, R-22, R-12, and R-454B certified.',
    points: ['All heat pump makes and models','Refrigerant recovery and recharge','Reverse cycle / heating mode service','Replacement and upgrade options'],
    photo: 'PHOTO: Heat pump outdoor unit',
    ctas: [
      { label: `📞 Call: ${PHONE_EN}`, href: PHONE_EN_HREF },
      { label: '📅 Book a Service Call', href: '/contact', internal: true },
    ],
  },
];

export function Services() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (!el) return;
    // Small delay lets the page finish rendering before scrolling
    const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <>
      <PageHero
        eyebrow="What We Offer"
        title="HVAC Services"
        subtitle="Complete air conditioning and heat pump services across Central Florida. All makes and models. Licensed and insured."
      />

      {SVCS.map((svc, i) => (
        <section key={i} id={svc.id} style={{ background: i % 2 === 0 ? WHITE : OFF_WHITE, padding: '80px 0' }}>
          <div className="container">
            <div className="svc-grid" style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 64, alignItems: 'center',
            }}>
              <div className="svc-content" style={{ order: i % 2 === 0 ? 0 : 1 }}>
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
                {svc.ctas ? (
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {svc.ctas.map((c, k) => (
                      c.internal ? (
                        <Link key={k} to={c.href} className="btn btn-navy">{c.label}</Link>
                      ) : c.external ? (
                        <a key={k} href={c.href} target="_blank" rel="noopener noreferrer" className="btn btn-navy">{c.label}</a>
                      ) : (
                        <a key={k} href={c.href} className="btn btn-navy">{c.label}</a>
                      )
                    ))}
                  </div>
                ) : svc.cta ? (
                  <a href={svc.cta.href} target="_blank" rel="noopener noreferrer"
                     className="btn btn-navy">{svc.cta.label}</a>
                ) : (
                  <a href={PHONE_EN_HREF} className="btn btn-navy">📞 Schedule: {PHONE_EN}</a>
                )}
              </div>
              <div className="svc-photo" style={{ order: i % 2 === 0 ? 1 : 0 }}>
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
// CONTACT / BOOK A SERVICE CALL
// ═══════════════════════════════════════════════════════════════
// Same publishable Supabase project the quote app and Comfort Guide write
// leads to — keeping all leads in one table regardless of which surface
// they came from.
const SUPABASE_URL = "https://dalertxugwgkfsyizmly.supabase.co";
const SUPABASE_KEY = "sb_publishable_nPaxXCiHyZkO8MkRsz-1Zw_ZgPBlybk";

const ISSUE_OPTIONS = [
  'No Cooling',
  'No Heat',
  'Strange Noise or Smell',
  'Water Leak',
  'Routine Maintenance / Tune-Up',
  'Duct Cleaning',
  'Indoor Air Quality / Filtration',
  'General Question',
  'Other',
];

// AC Repair + Maintenance share one crew/truck, so they share one calendar.
// Duct Cleaning / IAQ is a separate crew with its own (much sparser) calendar.
const DUCT_IAQ_ISSUES = ['Duct Cleaning', 'Indoor Air Quality / Filtration'];
function getCalendarForIssue(issue) {
  return DUCT_IAQ_ISSUES.includes(issue) ? 'duct_iaq' : 'general';
}

const TIME_OPTIONS = [
  'Morning (8am–12pm)',
  'Afternoon (12pm–4pm)',
  'Evening (4pm–7pm)',
  'ASAP — today if possible',
];

const inputStyle = {
  width: '100%', padding: '12px 16px',
  background: OFF_WHITE, border: `1px solid ${GRAY_LT}`,
  borderRadius: 10, color: CHARCOAL,
  fontFamily: 'Inter, sans-serif', fontSize: 15, outline: 'none',
};

const labelStyle = {
  display: 'block', fontSize: 12,
  fontFamily: 'Poppins, sans-serif', letterSpacing: 1.5,
  textTransform: 'uppercase', color: GRAY_DK,
  fontWeight: 600, marginBottom: 6,
};

// Max simultaneous bookings allowed per time slot. Raise this if you have
// more than one truck available to run service calls at the same time.
const SLOT_CAPACITY = 1;

function pad2(n) { return n < 10 ? `0${n}` : `${n}`; }

function formatHourLabel(hourDecimal) {
  const h = Math.floor(hourDecimal);
  const m = hourDecimal % 1 >= 0.5 ? 30 : 0;
  const period = h >= 12 ? 'PM' : 'AM';
  let displayH = h % 12;
  if (displayH === 0) displayH = 12;
  return `${displayH}:${pad2(m)} ${period}`;
}

// Builds the day's bookable arrival windows, every 2.5 hours, based on your
// posted hours (Mon–Fri 7am–7pm, Sat 8am–5pm). Closed Sunday → returns [].
function getDaySlots(dateStr, calendar = 'general') {
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.getDay(); // 0 = Sunday, 6 = Saturday

  if (calendar === 'duct_iaq') {
    // Separate crew, longer jobs — just two fixed arrivals, weekdays only.
    if (day === 0 || day === 6) return [];
    return ['8:30 AM', '2:00 PM'];
  }

  if (day === 0) return [];
  const isSat = day === 6;
  const openHour = isSat ? 8 : 7;
  const closeHour = isSat ? 17 : 19;

  const slots = [];
  let h = openHour;
  while (h < closeHour) {
    const end = Math.min(h + 2.5, closeHour);
    slots.push(`${formatHourLabel(h)} – ${formatHourLabel(end)}`);
    h += 2.5;
  }
  return slots;
}

export function Contact() {
  const location = useLocation();
  const [mode, setMode] = useState('book'); // 'book' (self-schedule) | 'callback' (ask us to call)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', issue: ISSUE_OPTIONS[0], notes: '',
  });
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [daySlots, setDaySlots] = useState([]); // [{ label, full }]
  const [callbackDate, setCallbackDate] = useState('');
  const [callbackTime, setCallbackTime] = useState(TIME_OPTIONS[0]);
  const [status, setStatus] = useState('idle'); // idle | missing | submitting | success

  // Arriving from a "Book a Service Call" button on the Services page —
  // pre-select the matching issue so people don't have to re-pick it.
  useEffect(() => {
    const requested = new URLSearchParams(location.search).get('issue');
    if (requested && ISSUE_OPTIONS.includes(requested)) {
      setForm((f) => ({ ...f, issue: requested }));
    }
  }, [location.search]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const switchMode = (next) => {
    setMode(next);
    setStatus('idle');
  };

  const calendar = getCalendarForIssue(form.issue); // 'general' (repair+maintenance) | 'duct_iaq'

  // Pull how many bookings already exist per slot for the chosen date,
  // via a Postgres function (keeps the raw leads table itself locked down).
  // Scoped per calendar — AC Repair/Maintenance share one truck's slots;
  // Duct Cleaning/IAQ is a separate crew with its own slot pool.
  useEffect(() => {
    if (mode !== 'book' || !date) { setDaySlots([]); setSlot(''); return; }

    const labels = getDaySlots(date, calendar);
    setSlot('');
    if (labels.length === 0) { setDaySlots([]); return; }

    let cancelled = false;
    setSlotsLoading(true);
    (async () => {
      let counts = {};
      try {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_booked_slot_counts`, {
          method: 'POST',
          headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_date: date, p_calendar: calendar }),
        });
        const data = await r.json();
        if (Array.isArray(data)) data.forEach((row) => { counts[row.time_slot] = row.slot_count; });
      } catch (e) { console.warn('Slot availability fetch error:', e); }
      if (!cancelled) {
        setDaySlots(labels.map((label) => ({ label, full: (counts[label] || 0) >= SLOT_CAPACITY })));
        setSlotsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [date, mode, calendar]);

  const resetForm = () => {
    setForm({ name: '', phone: '', email: '', address: '', issue: ISSUE_OPTIONS[0], notes: '' });
    setDate(''); setSlot(''); setDaySlots([]);
    setCallbackDate(''); setCallbackTime(TIME_OPTIONS[0]);
  };

  const handleBookSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !date || !slot) {
      setStatus('missing');
      return;
    }
    setStatus('submitting');

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({
          lead_type: 'service_call_booking',
          property_address: form.address,
          customer_name: form.name,
          customer_email: form.email || null,
          customer_phone: form.phone,
          notes: `[Marketing site - self-booked]${form.notes ? ' ' + form.notes : ''}`,
          language: 'en',
          lead_status: 'new',
          booking_date: date,
          time_slot: slot,
          booking_calendar: calendar,
          contact_preference: form.email ? 'email' : 'phone',
          organization_id: 1,
        }),
      });
    } catch (e) { console.warn('Booking save error:', e); }

    try {
      await fetch('/api/confirm-service-call', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, phone: form.phone, email: form.email || null,
          address: form.address, issue: form.issue, date, slot, notes: form.notes,
        }),
      });
    } catch (e) { console.warn('Confirmation send error:', e); }

    setStatus('success');
    resetForm();
  };

  const handleCallbackSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setStatus('missing');
      return;
    }
    setStatus('submitting');

    const summaryLine = [
      `Issue: ${form.issue}`,
      callbackDate ? `Preferred date: ${callbackDate}` : null,
      `Preferred time: ${callbackTime}`,
      form.notes ? `Message: ${form.notes}` : null,
    ].filter(Boolean).join(' | ');

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({
          lead_type: 'service_call_callback_request',
          property_address: form.address,
          customer_name: form.name,
          customer_email: form.email || null,
          customer_phone: form.phone,
          notes: `[Marketing site - Contact form] ${summaryLine}`,
          language: 'en',
          lead_status: 'new',
          contact_preference: form.email ? 'email' : 'phone',
          organization_id: 1,
        }),
      });
    } catch (e) { console.warn('Lead save error:', e); }

    try {
      await fetch('/api/send-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'info@air-careconnect.com',
          subject: `📞 Callback Requested — ${form.name}`,
          htmlContent: `
            <div style="font-family: sans-serif; max-width: 480px;">
              <h2 style="color: ${NAVY};">New Callback Request</h2>
              <p><strong>Name:</strong> ${form.name}</p>
              <p><strong>Phone:</strong> ${form.phone}</p>
              ${form.email ? `<p><strong>Email:</strong> ${form.email}</p>` : ''}
              <p><strong>Address:</strong> ${form.address}</p>
              <p><strong>Issue:</strong> ${form.issue}</p>
              ${callbackDate ? `<p><strong>Preferred Date:</strong> ${callbackDate}</p>` : ''}
              <p><strong>Preferred Time:</strong> ${callbackTime}</p>
              ${form.notes ? `<p><strong>Message:</strong> ${form.notes}</p>` : ''}
              <p style="color:#64748b; font-size:13px;">Submitted via the Contact page — nothing is scheduled yet, customer wants a callback.</p>
            </div>`,
        }),
      });
    } catch (e) { console.warn('Email notification error:', e); }

    try {
      await fetch('/api/send-sms', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: `Callback requested: ${form.name}, ${form.phone}. ${form.issue}. Preferred: ${callbackDate || 'no date given'} - ${callbackTime}. Address: ${form.address}`,
        }),
      });
    } catch (e) { console.warn('SMS notification error:', e); }

    setStatus('success');
    resetForm();
  };

  const tabStyle = (active) => ({
    flex: 1, padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
    textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 13,
    border: active ? `2px solid ${SKY}` : `1px solid ${GRAY_LT}`,
    background: active ? SKY_PALE : WHITE, color: active ? NAVY : GRAY_DK,
    transition: 'all 0.15s',
  });

  return (
    <>
      <PageHero
        eyebrow="Reach Us"
        title="Contact Us"
        subtitle="Call, text, or book a service call online. We respond fast — especially for Air-Care Club members."
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

            {/* Book a Service Call form */}
            <div style={{
              background: WHITE, border: `1px solid ${GRAY_LT}`,
              borderRadius: 20, padding: 40,
              boxShadow: '0 4px 24px rgba(27,58,107,0.08)',
            }}>
              <h2 style={{
                fontFamily: 'Poppins, sans-serif', fontSize: 24,
                fontWeight: 700, color: NAVY, marginBottom: 24,
              }}>Book a Service Call</h2>

              {status === 'success' ? (
                <div style={{
                  background: SKY_PALE, border: `1px solid rgba(77,184,232,0.3)`,
                  borderRadius: 14, padding: 24, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: NAVY, marginBottom: 6 }}>
                    {mode === 'book' ? 'You\'re booked!' : 'Request received!'}
                  </div>
                  <p style={{ fontSize: 14, color: GRAY_DK, lineHeight: 1.6 }}>
                    {mode === 'book'
                      ? 'Check your phone — a text confirming your appointment time is on the way (and an email too, if you gave us one).'
                      : 'A team member will call or text you shortly to confirm your appointment.'}
                  </p>
                  <button className="btn btn-navy" style={{ marginTop: 16 }} onClick={() => setStatus('idle')}>
                    Book Another Service Call
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                    <div style={tabStyle(mode === 'book')} onClick={() => switchMode('book')}>
                      📅 Book My Own Time
                    </div>
                    <div style={tabStyle(mode === 'callback')} onClick={() => switchMode('callback')}>
                      📞 Have Us Call You
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Your Name *</label>
                      <input type="text" placeholder="John Smith" value={form.name} onChange={update('name')} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number *</label>
                      <input type="tel" placeholder="(352) 000-0000" value={form.phone} onChange={update('phone')} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address {mode === 'book' && '(for an email confirmation too)'}</label>
                      <input type="email" placeholder="john@example.com" value={form.email} onChange={update('email')} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Service Address *</label>
                      <input type="text" placeholder="123 Main St, Ocala, FL" value={form.address} onChange={update('address')} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>What's Going On?</label>
                      <select value={form.issue} onChange={update('issue')} style={inputStyle}>
                        {ISSUE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>

                    {mode === 'book' ? (
                      <>
                        <div>
                          <label style={labelStyle}>Pick a Date *</label>
                          <input type="date" min={new Date().toISOString().split('T')[0]} value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
                        </div>

                        {date && (
                          <div>
                            <label style={labelStyle}>Pick a Time *</label>
                            {slotsLoading ? (
                              <p style={{ fontSize: 13, color: GRAY_DK }}>Checking availability...</p>
                            ) : daySlots.length === 0 ? (
                              <p style={{ fontSize: 13, color: '#C62828' }}>We're closed that day — please pick another date.</p>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {daySlots.map((s) => (
                                  <button
                                    key={s.label}
                                    type="button"
                                    disabled={s.full}
                                    onClick={() => setSlot(s.label)}
                                    style={{
                                      padding: '10px 8px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                                      cursor: s.full ? 'not-allowed' : 'pointer',
                                      border: slot === s.label ? `2px solid ${SKY}` : `1px solid ${GRAY_LT}`,
                                      background: s.full ? GRAY_LT : (slot === s.label ? SKY_PALE : WHITE),
                                      color: s.full ? GRAY : (slot === s.label ? NAVY : GRAY_DK),
                                    }}
                                  >
                                    {s.label}{s.full ? ' — Full' : ''}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                          <label style={labelStyle}>Preferred Date</label>
                          <input type="date" min={new Date().toISOString().split('T')[0]} value={callbackDate} onChange={(e) => setCallbackDate(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Preferred Time</label>
                          <select value={callbackTime} onChange={(e) => setCallbackTime(e.target.value)} style={inputStyle}>
                            {TIME_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    <div>
                      <label style={labelStyle}>Anything Else We Should Know?</label>
                      <textarea rows={3} placeholder="Any extra details about the issue..." value={form.notes} onChange={update('notes')} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>

                    {status === 'missing' && (
                      <p style={{ fontSize: 13, color: '#C62828', textAlign: 'center', margin: 0 }}>
                        {mode === 'book'
                          ? 'Please fill in your name, phone, address, and pick a date and time.'
                          : 'Please fill in your name, phone number, and service address.'}
                      </p>
                    )}

                    <button
                      className="btn btn-navy"
                      style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: status === 'submitting' ? 0.6 : 1 }}
                      disabled={status === 'submitting'}
                      onClick={mode === 'book' ? handleBookSubmit : handleCallbackSubmit}
                    >
                      {status === 'submitting' ? 'Submitting...' : (mode === 'book' ? 'Confirm Booking →' : 'Request Callback →')}
                    </button>
                    <p style={{ fontSize: 12, color: GRAY, textAlign: 'center' }}>
                      {mode === 'book'
                        ? 'This locks in your appointment instantly — confirmed by text right away.'
                        : 'Our team confirms the exact appointment time by phone or text.'}
                    </p>
                  </div>
                </>
              )}
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
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/aire-azul/services" className="btn btn-outline-sky btn-lg" style={{ borderColor: '#E07A5F', color: '#E07A5F' }}>
              Ver Todos los Servicios →
            </Link>
          </div>
        </div>
      </section>
      <section style={{ background: OFF_WHITE, padding: '80px 0' }}>
        <div className="container">
          <SectionHeader eyebrow="Programa de Membresía" title="Club Aire Azul"
            subtitle="Proteja su equipo y ahorre dinero con nuestra membresía anual. Mantenimiento profesional, servicio prioritario y descuentos en reparaciones." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { icon:'🥈', name:'Plata', price:'$189/año', sub:'2 visitas • 10% desc.', color:'#78909C', id:'silver' },
              { icon:'⭐', name:'Oro', price:'$249/año', sub:'3 visitas • 4 filtros • 15% desc.', color:GOLD, best:true, id:'gold' },
              { icon:'💎', name:'Platino', price:'$399/año', sub:'Prioridad VIP • Sin cargo de servicio', color:SKY, id:'platinum' },
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
                <Link to={`/aire-azul/documentos?plan=${p.id}`} style={{
                  display:'block', marginTop:14, fontSize:12, fontWeight:600,
                  color:GRAY_DK, textDecoration:'underline', fontFamily:'Poppins,sans-serif',
                }}>
                  📧 Recibir este acuerdo por correo
                </Link>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/aire-azul/club" className="btn btn-lg" style={{
              background: TERRA, color: WHITE, border: `2px solid ${TERRA}`, marginRight: 12,
            }}>Ver Todos los Planes →</Link>
            <a href={PHONE_ES_HREF} className="btn btn-lg" style={{
              background: WHITE, color: TERRA, border: `2px solid ${TERRA}`,
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

// ═══════════════════════════════════════════════════════════════
// SERVICIOS (Spanish mirror of Services — same structure/logic)
// ═══════════════════════════════════════════════════════════════
const TERRA = '#E07A5F';
const TERRA_PALE = '#FDF0EC';

const CHECKLIST_ES = [
  'Medir el diferencial de temperatura entre el aire de suministro y retorno',
  'Verificar las presiones del refrigerante (succión y descarga)',
  'Inspeccionar y limpiar el serpentín evaporador',
  'Inspeccionar y limpiar el serpentín condensador y enderezar las aletas',
  'Despejar y enjuagar la línea de drenaje de condensado',
  'Tratar la bandeja de drenaje con tabletas de condensado',
  'Inspeccionar y probar el(los) capacitor(es) — medir microfaradios',
  'Inspeccionar el contactor por picaduras y quemaduras',
  'Probar y registrar el consumo de amperaje del compresor',
  'Probar y registrar el consumo de amperaje del motor del soplador',
  'Inspeccionar la rueda del soplador — limpiar si es necesario',
  'Verificar y ajustar todas las conexiones eléctricas',
  'Probar el funcionamiento y la calibración del termostato',
  'Reemplazar las baterías del termostato (Nivel 2+)',
  'Reemplazar el filtro de aire (incluido según el plan)',
  'Inspeccionar y limpiar la bomba de condensado, si existe',
  'Inspeccionar las conexiones accesibles del sistema de ductos',
  'Inspeccionar la caja de desconexión — fusibles y cableado',
  'Verificar y registrar el voltaje del sistema',
  'Verificar el ciclo completo de enfriamiento — registrar todas las lecturas',
  'Informe escrito del sistema entregado al propietario',
];

const SVCS_ES = [
  {
    icon: '🔧', title: 'Reparación de AC',
    desc: 'Su AC eligió el peor día posible para fallar — lo sabemos. Air-Care Connect ofrece diagnóstico rápido y reparación el mismo día en la mayoría de los casos. Nuestros técnicos llevan piezas comunes en cada camión.',
    points: ['Todas las marcas y modelos','Servicio el mismo día disponible','Precios claros antes de empezar','Sin cargos de horas extra para miembros del Club'],
    photo: 'FOTO: Técnico reparando unidad manejadora de aire interior',
    ctas: [
      { label: `📞 Llame: ${PHONE_ES}`, href: PHONE_ES_HREF },
      { label: '📅 Reservar una Visita de Servicio', href: '/aire-azul/contact', internal: true },
    ],
  },
  {
    icon: '🔍', title: 'Mantenimiento Preventivo de 21 Puntos',
    desc: 'Nuestro mantenimiento exhaustivo es la base de todo lo que hacemos. La temporada de AC durante todo el año en Florida significa que su sistema acumula más desgaste que en casi cualquier otro lugar del país.',
    points: ['Protocolo completo de inspección de 21 puntos','Informe escrito después de cada visita','Incluido en todos los planes del Club Aire Azul','Ventanas de programación en primavera y otoño'],
    photo: 'FOTO: Técnico realizando mantenimiento / revisando manómetros',
    checklist: true,
    ctas: [
      { label: `📞 Llame: ${PHONE_ES}`, href: PHONE_ES_HREF },
      { label: '📅 Reservar un Mantenimiento', href: `/aire-azul/contact?issue=${encodeURIComponent('Routine Maintenance / Tune-Up')}`, internal: true },
    ],
  },
  {
    icon: '❄️', title: 'Reemplazo de Sistema',
    desc: 'Cuando es hora de un sistema nuevo, lo hacemos simple. Use nuestra herramienta de cotización instantánea para obtener un precio garantizado en 60 segundos — o llámenos para una evaluación completa en su hogar.',
    points: ['Cotización instantánea en línea disponible 24/7','Todas las marcas principales','Manejo de permisos incluido','Opciones de financiamiento disponibles'],
    photo: 'FOTO: Instalación de sistema nuevo / unidad exterior siendo colocada',
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
    ctas: [
      { label: `📞 Llame: ${PHONE_ES}`, href: PHONE_ES_HREF },
      { label: '⚡ Obtener Cotización Instantánea', href: 'https://systemestimate.air-careconnect.com', external: true },
    ],
  },
  {
    icon: '💨', title: 'Limpieza de Ductos y Calidad del Aire Interior',
    desc: 'La humedad de Florida crea desafíos únicos — riesgo de moho, alérgenos en el aire, y olor a humedad son quejas comunes. Ofrecemos mejoras de filtración, sistemas UV, y deshumidificación de toda la casa.',
    points: ['Mejoras de filtración MERV 8, 11 y 13','Instalación de luz UV germicida','Deshumidificación de toda la casa','Evaluación de limpieza de ductos'],
    photo: 'FOTO: Filtro o equipo de calidad del aire de cerca',
    ctas: [
      { label: `📞 Llame: ${PHONE_ES}`, href: PHONE_ES_HREF },
      { label: '📅 Reservar una Limpieza de Ductos', href: `/aire-azul/contact?issue=${encodeURIComponent('Duct Cleaning')}`, internal: true },
    ],
  },
];

export function ServicesEs() {
  return (
    <>
      <PageHero
        eyebrow="Lo Que Ofrecemos"
        title="Servicios de HVAC"
        subtitle="Servicios completos de aire acondicionado y bombas de calor en el Centro de Florida. Todas las marcas y modelos. Con licencia y asegurados."
      />

      {SVCS_ES.map((svc, i) => (
        <section key={i} style={{ background: i % 2 === 0 ? WHITE : OFF_WHITE, padding: '80px 0' }}>
          <div className="container">
            <div className="svc-grid" style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 64, alignItems: 'center',
            }}>
              <div className="svc-content" style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{svc.icon}</div>
                <div style={{ width: 48, height: 4, background: TERRA, borderRadius: 2, marginBottom: 20 }} />
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
                        background: TERRA_PALE, color: TERRA,
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 12, fontWeight: 700,
                        marginTop: 1, border: `1px solid rgba(224,122,95,0.3)`,
                      }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
                {svc.ctas ? (
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {svc.ctas.map((c, k) => (
                      c.internal ? (
                        <Link key={k} to={c.href} className="btn btn-navy" style={{ background: TERRA, borderColor: TERRA }}>{c.label}</Link>
                      ) : c.external ? (
                        <a key={k} href={c.href} target="_blank" rel="noopener noreferrer" className="btn btn-navy" style={{ background: TERRA, borderColor: TERRA }}>{c.label}</a>
                      ) : (
                        <a key={k} href={c.href} className="btn btn-navy" style={{ background: TERRA, borderColor: TERRA }}>{c.label}</a>
                      )
                    ))}
                  </div>
                ) : (
                  <a href={PHONE_ES_HREF} className="btn btn-navy" style={{ background: TERRA, borderColor: TERRA }}>📞 Llame: {PHONE_ES}</a>
                )}
              </div>
              <div className="svc-photo" style={{ order: i % 2 === 0 ? 1 : 0 }}>
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
                      textTransform: 'uppercase', letterSpacing: 2, color: TERRA, marginBottom: 16,
                    }}>Nuestra Lista de 21 Puntos</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                      {CHECKLIST_ES.map((item, j) => (
                        <div key={j} style={{
                          fontSize: 12, color: GRAY_DK,
                          display: 'flex', gap: 6, alignItems: 'flex-start',
                        }}>
                          <span style={{ color: TERRA, flexShrink: 0 }}>✓</span>{item}
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
          }}>Ahorre en Cada Servicio con un Plan del Club</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Los miembros reciben 10–20% de descuento en todas las reparaciones, programación prioritaria, y mantenimientos gratis. Desde $15.99/mes.
          </p>
          <Link to="/aire-azul/club" className="btn btn-primary btn-lg" style={{ background: TERRA, borderColor: TERRA }}>Ver Planes del Club →</Link>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// NOSOTROS (Spanish mirror of About — same structure/logic)
// ═══════════════════════════════════════════════════════════════
const COUNTIES_ES = ['Condado de Marion','Condado de Lake','Condado de Sumter','Condado de Levy','Condado de Citrus','Condado de Alachua','The Villages'];

export function AboutEs() {
  return (
    <>
      <PageHero
        eyebrow="Nuestra Historia"
        title="Propietarios Locales."
        titleAccent="Servicio Real."
        subtitle="Air-Care Connect y Aire Azul son propiedad y operados por Lloyd y Orlando — dos socios que construyeron este negocio para servir a los propietarios del Centro de Florida de la manera correcta."
      />

      <section style={{ background: WHITE, padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ width: 48, height: 4, background: TERRA, borderRadius: 2, marginBottom: 20 }} />
              <h2 style={{
                fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(24px,3vw,36px)',
                fontWeight: 800, color: NAVY, marginBottom: 20,
              }}>Por Qué Empezamos</h2>
              <p style={{ fontSize: 16, color: GRAY_DK, lineHeight: 1.8, marginBottom: 16 }}>
                Empezamos con una creencia simple: el servicio de HVAC en esta región tenía demasiadas
                empresas que trataban a los clientes como una transacción. Queríamos construir algo
                diferente — un negocio donde el propietario contesta el teléfono, los técnicos llegan
                a tiempo, y el precio cotizado es el precio cobrado.
              </p>
              <p style={{ fontSize: 16, color: GRAY_DK, lineHeight: 1.8 }}>
                Nuestra estructura de doble marca — Air-Care Connect para clientes de habla inglesa
                y Aire Azul para clientes de habla hispana — significa que servimos a toda la comunidad
                en nuestro territorio de seis condados con la misma calidad y profesionalismo.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PhotoPlaceholder label="FOTO: Lloyd y Orlando — propietarios / foto del equipo" height={280} />
              <PhotoPlaceholder label="FOTO: Camión de servicio / vehículo con logo" height={180} />
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: OFF_WHITE, padding: '80px 0' }}>
        <div className="container">
          <SectionHeader
            eyebrow="Dónde Servimos"
            title="Seis Condados + The Villages"
            subtitle="Cubrimos un amplio territorio en el Centro de Florida. Si no está seguro de si servimos su área, simplemente llame — le informaremos."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {COUNTIES_ES.map((c, i) => (
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

      <section style={{ background: WHITE, padding: '80px 0' }}>
        <div className="container">
          <SectionHeader eyebrow="Dos Marcas, Un Estándar" title="Air-Care Connect y Aire Azul" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {[
              {
                name: 'Aire Azul', lang: 'Español — Se habla español', phone: PHONE_ES, href: PHONE_ES_HREF,
                color: TERRA,
                desc: 'Sirviendo a clientes hispanohablantes en todo el territorio. El mismo nivel de servicio profesional, comunicado en su idioma. Club Aire Azul disponible.',
              },
              {
                name: 'Air-Care Connect', lang: 'English', phone: PHONE_EN, href: PHONE_EN_HREF,
                color: SKY,
                desc: 'Sirviendo a propietarios de habla inglesa en los seis condados. Servicio el mismo día, técnicos profesionales, y el programa de membresía Air-Care Club.',
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
                  display: 'inline-block', background: TERRA_PALE,
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
// CONTACTO / RESERVAR UNA VISITA (Spanish mirror of Contact)
// Reuses the SAME calendar/availability helpers as the English page
// (getCalendarForIssue, getDaySlots, Supabase RPC) so both languages
// share one real set of truck availability — only labels are translated.
// ═══════════════════════════════════════════════════════════════
const ISSUE_OPTIONS_ES = [
  'No Cooling',
  'No Heat',
  'Strange Noise or Smell',
  'Water Leak',
  'Routine Maintenance / Tune-Up',
  'Duct Cleaning',
  'Indoor Air Quality / Filtration',
  'General Question',
  'Other',
];
// Spanish labels shown to the customer, keyed to the same canonical
// English values used internally for calendar routing + admin records.
const ISSUE_LABELS_ES = {
  'No Cooling': 'No Enfría',
  'No Heat': 'No Calienta',
  'Strange Noise or Smell': 'Ruido o Olor Extraño',
  'Water Leak': 'Fuga de Agua',
  'Routine Maintenance / Tune-Up': 'Mantenimiento de Rutina',
  'Duct Cleaning': 'Limpieza de Ductos',
  'Indoor Air Quality / Filtration': 'Calidad del Aire / Filtración',
  'General Question': 'Pregunta General',
  'Other': 'Otro',
};
const TIME_OPTIONS_ES = [
  'Morning (8am–12pm)',
  'Afternoon (12pm–4pm)',
  'Evening (4pm–7pm)',
  'ASAP — today if possible',
];
const TIME_LABELS_ES = {
  'Morning (8am–12pm)': 'Mañana (8am–12pm)',
  'Afternoon (12pm–4pm)': 'Tarde (12pm–4pm)',
  'Evening (4pm–7pm)': 'Noche (4pm–7pm)',
  'ASAP — today if possible': 'Lo Antes Posible — hoy si es posible',
};

export function ContactEs() {
  const location = useLocation();
  const [mode, setMode] = useState('book');
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', issue: ISSUE_OPTIONS_ES[0], notes: '',
  });
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [daySlots, setDaySlots] = useState([]);
  const [callbackDate, setCallbackDate] = useState('');
  const [callbackTime, setCallbackTime] = useState(TIME_OPTIONS_ES[0]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const requested = new URLSearchParams(location.search).get('issue');
    if (requested && ISSUE_OPTIONS_ES.includes(requested)) {
      setForm((f) => ({ ...f, issue: requested }));
    }
  }, [location.search]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const switchMode = (next) => { setMode(next); setStatus('idle'); };
  const calendar = getCalendarForIssue(form.issue);

  useEffect(() => {
    if (mode !== 'book' || !date) { setDaySlots([]); setSlot(''); return; }
    const labels = getDaySlots(date, calendar);
    setSlot('');
    if (labels.length === 0) { setDaySlots([]); return; }
    let cancelled = false;
    setSlotsLoading(true);
    (async () => {
      let counts = {};
      try {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_booked_slot_counts`, {
          method: 'POST',
          headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_date: date, p_calendar: calendar }),
        });
        const data = await r.json();
        if (Array.isArray(data)) data.forEach((row) => { counts[row.time_slot] = row.slot_count; });
      } catch (e) { console.warn('Slot availability fetch error:', e); }
      if (!cancelled) {
        setDaySlots(labels.map((label) => ({ label, full: (counts[label] || 0) >= SLOT_CAPACITY })));
        setSlotsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [date, mode, calendar]);

  const resetForm = () => {
    setForm({ name: '', phone: '', email: '', address: '', issue: ISSUE_OPTIONS_ES[0], notes: '' });
    setDate(''); setSlot(''); setDaySlots([]);
    setCallbackDate(''); setCallbackTime(TIME_OPTIONS_ES[0]);
  };

  const handleBookSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !date || !slot) {
      setStatus('missing');
      return;
    }
    setStatus('submitting');
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({
          lead_type: 'service_call_booking',
          property_address: form.address,
          customer_name: form.name,
          customer_email: form.email || null,
          customer_phone: form.phone,
          notes: `[Sitio en español - auto-reservado]${form.notes ? ' ' + form.notes : ''}`,
          language: 'es',
          lead_status: 'new',
          booking_date: date,
          time_slot: slot,
          booking_calendar: calendar,
          contact_preference: form.email ? 'email' : 'phone',
          organization_id: 1,
        }),
      });
    } catch (e) { console.warn('Booking save error:', e); }

    try {
      await fetch('/api/confirm-service-call', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, phone: form.phone, email: form.email || null,
          address: form.address, issue: ISSUE_LABELS_ES[form.issue] || form.issue, date, slot, notes: form.notes,
        }),
      });
    } catch (e) { console.warn('Confirmation send error:', e); }

    setStatus('success');
    resetForm();
  };

  const handleCallbackSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setStatus('missing');
      return;
    }
    setStatus('submitting');

    const summaryLine = [
      `Asunto: ${ISSUE_LABELS_ES[form.issue] || form.issue}`,
      callbackDate ? `Fecha preferida: ${callbackDate}` : null,
      `Hora preferida: ${TIME_LABELS_ES[callbackTime] || callbackTime}`,
      form.notes ? `Mensaje: ${form.notes}` : null,
    ].filter(Boolean).join(' | ');

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({
          lead_type: 'service_call_callback_request',
          property_address: form.address,
          customer_name: form.name,
          customer_email: form.email || null,
          customer_phone: form.phone,
          notes: `[Sitio en español - Formulario de Contacto] ${summaryLine}`,
          language: 'es',
          lead_status: 'new',
          contact_preference: form.email ? 'email' : 'phone',
          organization_id: 1,
        }),
      });
    } catch (e) { console.warn('Lead save error:', e); }

    try {
      await fetch('/api/send-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'info@air-careconnect.com',
          subject: `📞 Solicitud de Llamada — ${form.name}`,
          htmlContent: `
            <div style="font-family: sans-serif; max-width: 480px;">
              <h2 style="color: ${NAVY};">Nueva Solicitud de Llamada (Aire Azul)</h2>
              <p><strong>Nombre:</strong> ${form.name}</p>
              <p><strong>Teléfono:</strong> ${form.phone}</p>
              ${form.email ? `<p><strong>Correo:</strong> ${form.email}</p>` : ''}
              <p><strong>Dirección:</strong> ${form.address}</p>
              <p><strong>Asunto:</strong> ${ISSUE_LABELS_ES[form.issue] || form.issue}</p>
              ${callbackDate ? `<p><strong>Fecha Preferida:</strong> ${callbackDate}</p>` : ''}
              <p><strong>Hora Preferida:</strong> ${TIME_LABELS_ES[callbackTime] || callbackTime}</p>
              ${form.notes ? `<p><strong>Mensaje:</strong> ${form.notes}</p>` : ''}
              <p style="color:#64748b; font-size:13px;">Enviado desde la página de contacto en español — nada está programado aún, el cliente quiere que le llamen.</p>
            </div>`,
        }),
      });
    } catch (e) { console.warn('Email notification error:', e); }

    try {
      await fetch('/api/send-sms', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: `Solicitud de llamada (Aire Azul): ${form.name}, ${form.phone}. ${ISSUE_LABELS_ES[form.issue] || form.issue}. Preferido: ${callbackDate || 'sin fecha'} - ${TIME_LABELS_ES[callbackTime] || callbackTime}. Dirección: ${form.address}`,
        }),
      });
    } catch (e) { console.warn('SMS notification error:', e); }

    setStatus('success');
    resetForm();
  };

  const tabStyleEs = (active) => ({
    flex: 1, padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
    textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 13,
    border: active ? `2px solid ${TERRA}` : `1px solid ${GRAY_LT}`,
    background: active ? TERRA_PALE : WHITE, color: active ? NAVY : GRAY_DK,
    transition: 'all 0.15s',
  });

  return (
    <>
      <PageHero
        eyebrow="Contáctenos"
        title="Contáctenos"
        subtitle="Llame, envíe un mensaje de texto, o reserve una visita de servicio en línea. Respondemos rápido — especialmente para miembros del Club Aire Azul."
      />

      <section style={{ background: OFF_WHITE, padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { icon:'📞', title:'Línea en Español', value:PHONE_ES, href:PHONE_ES_HREF, sub:'Aire Azul — llame o envíe un mensaje' },
                { icon:'📞', title:'English Line', value:PHONE_EN, href:PHONE_EN_HREF, sub:'Air-Care Connect — call or text' },
                { icon:'⏰', title:'Horario', value:'Lun–Vie 7am–7pm | Sáb 8am–5pm', sub:'Servicio de emergencia disponible para miembros del Club' },
                { icon:'📍', title:'Área de Servicio', value:'Ocala y Centro de Florida', sub:'Marion, Lake, Sumter, Levy, Citrus, Alachua + The Villages' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: WHITE, border: `1px solid ${GRAY_LT}`,
                  borderRadius: 16, padding: '24px 28px',
                  display: 'flex', gap: 20, alignItems: 'flex-start',
                  boxShadow: '0 2px 8px rgba(27,58,107,0.06)',
                }}>
                  <div style={{
                    width: 48, height: 48, flexShrink: 0,
                    background: TERRA_PALE, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{
                      fontFamily: 'Poppins, sans-serif', fontSize: 11,
                      letterSpacing: 2, color: TERRA, textTransform: 'uppercase',
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
                background: TERRA_PALE, border: `1px solid rgba(224,122,95,0.3)`,
                borderRadius: 16, padding: '20px 24px',
              }}>
                <div style={{ fontFamily:'Poppins,sans-serif', fontSize:16, fontWeight:700, color:NAVY, marginBottom:8 }}>
                  ⭐ Miembros del Club Aire Azul
                </div>
                <p style={{ fontSize:14, color:GRAY_DK, lineHeight:1.6 }}>
                  Los miembros del Club reciben respuesta prioritaria. Cuando llame, identifíquese como
                  miembro y será movido al frente de la fila de programación — especialmente importante
                  durante la temporada alta.
                </p>
              </div>
            </div>

            <div style={{
              background: WHITE, border: `1px solid ${GRAY_LT}`,
              borderRadius: 20, padding: 40,
              boxShadow: '0 4px 24px rgba(27,58,107,0.08)',
            }}>
              <h2 style={{
                fontFamily: 'Poppins, sans-serif', fontSize: 24,
                fontWeight: 700, color: NAVY, marginBottom: 24,
              }}>Reservar una Visita de Servicio</h2>

              {status === 'success' ? (
                <div style={{
                  background: TERRA_PALE, border: `1px solid rgba(224,122,95,0.3)`,
                  borderRadius: 14, padding: 24, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: NAVY, marginBottom: 6 }}>
                    {mode === 'book' ? '¡Está reservado!' : '¡Solicitud recibida!'}
                  </div>
                  <p style={{ fontSize: 14, color: GRAY_DK, lineHeight: 1.6 }}>
                    {mode === 'book'
                      ? 'Revise su teléfono — un mensaje de texto confirmando su cita está en camino (y un correo también, si nos lo dio).'
                      : 'Un miembro del equipo le llamará o enviará un mensaje de texto pronto para confirmar su cita.'}
                  </p>
                  <button className="btn btn-navy" style={{ marginTop: 16, background: TERRA, borderColor: TERRA }} onClick={() => setStatus('idle')}>
                    Reservar Otra Visita
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                    <div style={tabStyleEs(mode === 'book')} onClick={() => switchMode('book')}>
                      📅 Reservar Mi Propia Hora
                    </div>
                    <div style={tabStyleEs(mode === 'callback')} onClick={() => switchMode('callback')}>
                      📞 Que Nos Llamen
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Su Nombre *</label>
                      <input type="text" placeholder="Juan Pérez" value={form.name} onChange={update('name')} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Número de Teléfono *</label>
                      <input type="tel" placeholder="(352) 000-0000" value={form.phone} onChange={update('phone')} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Correo Electrónico {mode === 'book' && '(para confirmación por correo también)'}</label>
                      <input type="email" placeholder="juan@ejemplo.com" value={form.email} onChange={update('email')} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Dirección del Servicio *</label>
                      <input type="text" placeholder="123 Calle Principal, Ocala, FL" value={form.address} onChange={update('address')} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>¿Qué Está Pasando?</label>
                      <select value={form.issue} onChange={update('issue')} style={inputStyle}>
                        {ISSUE_OPTIONS_ES.map((opt) => <option key={opt} value={opt}>{ISSUE_LABELS_ES[opt]}</option>)}
                      </select>
                    </div>

                    {mode === 'book' ? (
                      <>
                        <div>
                          <label style={labelStyle}>Elija una Fecha *</label>
                          <input type="date" min={new Date().toISOString().split('T')[0]} value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
                        </div>

                        {date && (
                          <div>
                            <label style={labelStyle}>Elija una Hora *</label>
                            {slotsLoading ? (
                              <p style={{ fontSize: 13, color: GRAY_DK }}>Verificando disponibilidad...</p>
                            ) : daySlots.length === 0 ? (
                              <p style={{ fontSize: 13, color: '#C62828' }}>Estamos cerrados ese día — por favor elija otra fecha.</p>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {daySlots.map((s) => (
                                  <button
                                    key={s.label}
                                    type="button"
                                    disabled={s.full}
                                    onClick={() => setSlot(s.label)}
                                    style={{
                                      padding: '10px 8px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                                      cursor: s.full ? 'not-allowed' : 'pointer',
                                      border: slot === s.label ? `2px solid ${TERRA}` : `1px solid ${GRAY_LT}`,
                                      background: s.full ? GRAY_LT : (slot === s.label ? TERRA_PALE : WHITE),
                                      color: s.full ? GRAY : (slot === s.label ? NAVY : GRAY_DK),
                                    }}
                                  >
                                    {s.label}{s.full ? ' — Lleno' : ''}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                          <label style={labelStyle}>Fecha Preferida</label>
                          <input type="date" min={new Date().toISOString().split('T')[0]} value={callbackDate} onChange={(e) => setCallbackDate(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Hora Preferida</label>
                          <select value={callbackTime} onChange={(e) => setCallbackTime(e.target.value)} style={inputStyle}>
                            {TIME_OPTIONS_ES.map((opt) => <option key={opt} value={opt}>{TIME_LABELS_ES[opt]}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    <div>
                      <label style={labelStyle}>¿Algo Más Que Debamos Saber?</label>
                      <textarea rows={3} placeholder="Cualquier detalle adicional sobre el problema..." value={form.notes} onChange={update('notes')} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>

                    {status === 'missing' && (
                      <p style={{ fontSize: 13, color: '#C62828', textAlign: 'center', margin: 0 }}>
                        {mode === 'book'
                          ? 'Por favor complete su nombre, teléfono, dirección, y elija una fecha y hora.'
                          : 'Por favor complete su nombre, teléfono, y dirección del servicio.'}
                      </p>
                    )}

                    <button
                      className="btn btn-navy"
                      style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: status === 'submitting' ? 0.6 : 1, background: TERRA, borderColor: TERRA }}
                      disabled={status === 'submitting'}
                      onClick={mode === 'book' ? handleBookSubmit : handleCallbackSubmit}
                    >
                      {status === 'submitting' ? 'Enviando...' : (mode === 'book' ? 'Confirmar Reservación →' : 'Solicitar Llamada →')}
                    </button>
                    <p style={{ fontSize: 12, color: GRAY, textAlign: 'center' }}>
                      {mode === 'book'
                        ? 'Esto confirma su cita al instante — confirmado por mensaje de texto enseguida.'
                        : 'Nuestro equipo confirma la hora exacta de la cita por teléfono o mensaje de texto.'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


export function Footer() {
  const location = useLocation();
  const isSpanish = location.pathname.startsWith('/aire-azul');
  const accent = isSpanish ? '#E07A5F' : SKY;

  const pageLinks = isSpanish
    ? [['/aire-azul', 'Inicio'],['/aire-azul/services','Servicios'],['/aire-azul/club','Club Aire Azul'],['/aire-azul/about','Nosotros'],['/aire-azul/contact','Contacto'],['/', '🇺🇸 Air-Care Connect']]
    : [['/', 'Home'],['/services','Services'],['/club','Air-Care Club'],['/about','About Us'],['/contact','Contact'],['/aire-azul','🇪🇸 Aire Azul']];

  return (
    <footer style={{
      background: NAVY,
      borderTop: `4px solid ${accent}`,
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
            }}>{isSpanish ? 'Aire Azul' : 'Air-Care Connect'}</div>
            <div style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 12, color: accent,
              letterSpacing: 1.5, marginBottom: 16, fontWeight: 500,
            }}>{isSpanish ? '+ Air-Care Connect' : '+ Aire Azul'}</div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              {isSpanish
                ? 'Servicio profesional de HVAC en todo el Centro de Florida. Con licencia, asegurados, y de propiedad local.'
                : 'Professional HVAC service across Central Florida. Licensed, insured, and locally owned.'}
            </p>
          </div>

          {/* Links */}
          <div>
            <div style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 11, letterSpacing: 2,
              color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase', fontWeight: 600,
            }}>{isSpanish ? 'Páginas' : 'Pages'}</div>
            {pageLinks.map(([href, label]) => (
              <Link key={href} to={href} style={{
                display: 'block', fontSize: 14,
                color: 'rgba(255,255,255,0.65)', marginBottom: 10,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = accent}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
              >{label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 11, letterSpacing: 2,
              color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase', fontWeight: 600,
            }}>{isSpanish ? 'Contacto' : 'Contact'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: accent, marginBottom: 3, letterSpacing: 1 }}>
                  {isSpanish ? 'LÍNEA EN ESPAÑOL' : 'ENGLISH LINE'}
                </div>
                <a href={isSpanish ? PHONE_ES_HREF : PHONE_EN_HREF} style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: 20,
                  fontWeight: 700, color: WHITE,
                }}>{isSpanish ? PHONE_ES : PHONE_EN}</a>
              </div>
              <div>
                <div style={{ fontSize: 11, color: accent, marginBottom: 3, letterSpacing: 1 }}>
                  {isSpanish ? 'ENGLISH LINE' : 'LÍNEA EN ESPAÑOL'}
                </div>
                <a href={isSpanish ? PHONE_EN_HREF : PHONE_ES_HREF} style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: 20,
                  fontWeight: 700, color: WHITE,
                }}>{isSpanish ? PHONE_EN : PHONE_ES}</a>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                {isSpanish ? 'Lun–Vie 7am–7pm' : 'Mon–Fri 7am–7pm'}<br/>
                {isSpanish ? 'Sáb 8am–5pm' : 'Sat 8am–5pm'}
              </div>
            </div>
          </div>

          {/* Service area */}
          <div>
            <div style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 11, letterSpacing: 2,
              color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase', fontWeight: 600,
            }}>{isSpanish ? 'Área de Servicio' : 'Service Area'}</div>
            {(isSpanish ? COUNTIES_ES : COUNTIES).map(c => (
              <div key={c} style={{
                fontSize: 13, color: 'rgba(255,255,255,0.55)',
                marginBottom: 7, display: 'flex', gap: 8,
              }}>
                <span style={{ color: accent }}>▸</span> {c}
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
            © {new Date().getFullYear()} Air-Care Connect / Aire Azul. {isSpanish ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(56,161,105,0.15)', color: '#68D391',
              border: '1px solid rgba(56,161,105,0.3)',
              padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
            }}>✓ {isSpanish ? 'Con Licencia y Asegurados' : 'Licensed & Insured'}</span>
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






















