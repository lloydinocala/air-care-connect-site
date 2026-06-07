// ─────────────────────────────────────────────────────────────
// Services.jsx
// ─────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';

const PHONE_EN_HREF = 'tel:+13524846341';
const PHONE_EN = '352-484-6341';

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

function PhotoPlaceholder({ label, height = 320 }) {
  return (
    <div className="photo-placeholder" style={{ height }}>
      <span className="ph-icon">📷</span>
      <span className="ph-label">{label}</span>
      <span style={{ fontSize: 10, opacity: 0.4 }}>Replace with actual photo</span>
    </div>
  );
}

export function Services() {
  return (
    <>
      <section style={{
        background: 'linear-gradient(160deg, #0B1D3A, #1A3260)',
        padding: '140px 0 80px', textAlign: 'center',
      }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>What We Offer</div>
          <h1 className="display-xl" style={{ marginBottom: 20 }}>HVAC Services</h1>
          <p className="lead" style={{ maxWidth: 560, margin: '0 auto' }}>
            Complete air conditioning and heat pump services across Central Florida.
            All makes and models. Licensed and insured.
          </p>
        </div>
      </section>

      {/* Services detail */}
      {[
        {
          icon: '🔧', title: 'AC Repair',
          desc: 'Your AC chose the worst possible day to break down — we know. Air-Care Connect offers fast diagnosis and same-day repair for most issues. Our technicians carry common parts on every truck so you\'re not waiting for a return visit.',
          points: ['All makes and models','Same-day service available','Upfront pricing before we start','No overtime charges for Club members'],
          photo: 'PHOTO: Technician repairing indoor air handler unit',
        },
        {
          icon: '🔍', title: '21-Point Maintenance Tune-Up',
          desc: 'Our thorough tune-up is the foundation of everything we do. Florida\'s year-round AC season means your system accumulates more wear than almost anywhere in the country. A proper tune-up catches small problems before they become $800 emergencies.',
          points: ['Full 21-point inspection protocol','Written report after every visit','Included in all Air-Care Club plans','Spring and fall scheduling windows'],
          photo: 'PHOTO: Technician performing tune-up / checking gauges',
          checklist: true,
        },
        {
          icon: '❄️', title: 'System Replacement',
          desc: 'When it\'s time for a new system, we make it simple. Use our instant quote tool to get a guaranteed price in 60 seconds — or call us for a full in-home assessment. We install all major brands and handle permits, removal, and commissioning.',
          points: ['Instant online quote available 24/7','All major brands','Permit handling included','Financing options available'],
          photo: 'PHOTO: New system installation / outdoor unit being placed',
          cta: { label: '⚡ Get Instant Quote', href: 'https://air-care-connect-estimate-app.vercel.app', external: true },
        },
        {
          icon: '💨', title: 'Indoor Air Quality',
          desc: 'Florida\'s humidity creates unique challenges — mold risk, airborne allergens, and musty air are common complaints. We offer filtration upgrades (up to MERV 13), UV germicidal systems, and whole-home dehumidification solutions.',
          points: ['MERV 8, 11, and 13 filtration upgrades','UV germicidal light installation','Whole-home dehumidification','Duct cleaning assessment'],
          photo: 'PHOTO: Filter or IAQ equipment close-up',
        },
      ].map((svc, i) => (
        <section key={i} className={i % 2 === 0 ? 'section' : 'section'} style={{
          background: i % 2 === 0 ? 'var(--navy)' : 'var(--navy-mid)',
        }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 64, alignItems: 'center',
              flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
            }}>
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{svc.icon}</div>
                <div className="gold-bar" />
                <h2 className="display-md" style={{ marginBottom: 16 }}>{svc.title}</h2>
                <p className="lead" style={{ marginBottom: 24 }}>{svc.desc}</p>
                <ul className="check-list" style={{ marginBottom: 28 }}>
                  {svc.points.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
                {svc.cta ? (
                  <a href={svc.cta.href} target={svc.cta.external ? '_blank' : undefined}
                     rel="noopener noreferrer" className="btn btn-primary">
                    {svc.cta.label}
                  </a>
                ) : (
                  <a href={PHONE_EN_HREF} className="btn btn-blue">
                    📞 Schedule: {PHONE_EN}
                  </a>
                )}
              </div>
              <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                <PhotoPlaceholder label={svc.photo} height={360} />
                {svc.checklist && (
                  <div style={{
                    marginTop: 20,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 16, padding: 24,
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 14, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: 2,
                      color: 'var(--cyan)', marginBottom: 16,
                    }}>Our 21-Point Checklist</div>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px',
                    }}>
                      {CHECKLIST.map((item, j) => (
                        <div key={j} style={{
                          fontSize: 12, color: 'rgba(255,255,255,0.65)',
                          display: 'flex', gap: 6, alignItems: 'flex-start',
                        }}>
                          <span style={{ color: 'var(--cyan)', flexShrink: 0 }}>✓</span>
                          {item}
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
      <section style={{ background: 'var(--blue)', padding: '64px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 className="display-lg" style={{ marginBottom: 16 }}>
            Save on Every Service with a Club Plan
          </h2>
          <p className="lead" style={{ maxWidth: 500, margin: '0 auto 32px' }}>
            Members get 10–20% off all repairs, priority scheduling, and free tune-ups. From $14.99/month.
          </p>
          <Link to="/club" className="btn btn-primary btn-lg">View Club Plans →</Link>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// About.jsx
// ─────────────────────────────────────────────────────────────
export function About() {
  const COUNTIES = ['Marion County','Lake County','Sumter County','Levy County','Citrus County','Alachua County','The Villages'];
  return (
    <>
      <section style={{
        background: 'linear-gradient(160deg, #0B1D3A, #122448)',
        padding: '140px 0 80px',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Our Story</div>
              <h1 className="display-xl" style={{ marginBottom: 24 }}>
                Local Owners.<br />
                <span style={{ color: 'var(--gold)' }}>Real Service.</span>
              </h1>
              <p className="lead" style={{ marginBottom: 20 }}>
                Air-Care Connect and Aire Azul are owned and operated by Lloyd and Orlando —
                two partners who built this business from the ground up to serve Central Florida
                homeowners the right way.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: 20 }}>
                We started with a simple belief: HVAC service in this region had too many
                companies that treated customers like a transaction. We wanted to build something
                different — a business where the owner answers the phone, where technicians show
                up on time, and where the price quoted is the price charged.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
                Our dual-brand structure — Air-Care Connect for English-speaking customers and
                Aire Azul for Spanish-speaking customers — means we serve the full community
                across our six-county territory with equal quality and professionalism.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="photo-placeholder" style={{ height: 300 }}>
                <span className="ph-icon">📷</span>
                <span className="ph-label">PHOTO: Lloyd & Orlando — owners / team photo</span>
              </div>
              <div className="photo-placeholder" style={{ height: 180 }}>
                <span className="ph-icon">📷</span>
                <span className="ph-label">PHOTO: Service truck / branded vehicle</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service territory */}
      <section className="section-light">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Where We Serve</div>
            <h2 className="display-md" style={{ color: 'var(--navy)' }}>
              Six Counties + The Villages
            </h2>
            <p style={{ color: 'var(--gray-dark)', maxWidth: 500, margin: '12px auto 0', lineHeight: 1.7 }}>
              We cover a wide territory across Central Florida. If you're not sure whether
              we service your area, just call — we'll let you know.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {COUNTIES.map((c, i) => (
              <div key={i} className="card" style={{
                textAlign: 'center', padding: '24px 16px',
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📍</div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16, fontWeight: 700,
                  textTransform: 'uppercase', color: 'var(--navy)',
                }}>{c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual brand */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Two Brands, One Standard</div>
            <h2 className="display-lg">Air-Care Connect & Aire Azul</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {[
              {
                name: 'Air-Care Connect', lang: 'English', phone: PHONE_EN,
                href: PHONE_EN_HREF, color: 'var(--blue)',
                desc: 'Serving English-speaking homeowners across all six counties. Same-day service, professional technicians, and the Air-Care Club membership program.',
              },
              {
                name: 'Aire Azul', lang: 'Español — Se habla español', phone: '407-963-8544',
                href: 'tel:+14079638544', color: 'var(--cyan)',
                desc: 'Sirviendo a clientes hispanohablantes en todo el territorio. El mismo nivel de servicio profesional, comunicado en su idioma. Club Aire Azul disponible.',
              },
            ].map((brand, i) => (
              <div key={i} className="card" style={{
                borderTop: `3px solid ${brand.color}`,
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 26, fontWeight: 800,
                  textTransform: 'uppercase', color: brand.color,
                  marginBottom: 6,
                }}>{brand.name}</div>
                <div className="badge badge-cyan" style={{ marginBottom: 16 }}>{brand.lang}</div>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 20 }}>
                  {brand.desc}
                </p>
                <a href={brand.href} className="btn btn-outline" style={{ borderColor: brand.color, color: brand.color }}>
                  📞 {brand.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Contact.jsx
// ─────────────────────────────────────────────────────────────
export function Contact() {
  return (
    <>
      <section style={{
        background: 'linear-gradient(160deg, #0B1D3A, #122448)',
        padding: '140px 0 80px',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Reach Us</div>
            <h1 className="display-xl" style={{ marginBottom: 16 }}>Contact Us</h1>
            <p className="lead" style={{ maxWidth: 480, margin: '0 auto' }}>
              Call, text, or send a message. We respond fast — especially for
              Air-Care Club members.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                {
                  icon: '📞', title: 'English Line',
                  value: PHONE_EN, href: PHONE_EN_HREF,
                  sub: 'Air-Care Connect — call or text',
                },
                {
                  icon: '📞', title: 'Línea en Español',
                  value: '407-963-8544', href: 'tel:+14079638544',
                  sub: 'Aire Azul — llame o envíe un mensaje',
                },
                {
                  icon: '⏰', title: 'Hours',
                  value: 'Mon–Fri 7am–7pm | Sat 8am–5pm',
                  sub: 'Emergency service available for Club members',
                },
                {
                  icon: '📍', title: 'Service Area',
                  value: 'Ocala & Central Florida',
                  sub: 'Marion, Lake, Sumter, Levy, Citrus, Alachua + The Villages',
                },
              ].map((item, i) => (
                <div key={i} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 48, height: 48, flexShrink: 0,
                    background: 'rgba(21,101,192,0.2)',
                    borderRadius: 12, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 24,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11,
                      letterSpacing: 2, color: 'var(--cyan)',
                      textTransform: 'uppercase', marginBottom: 6,
                    }}>{item.title}</div>
                    {item.href ? (
                      <a href={item.href} style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 24, fontWeight: 700,
                        color: 'var(--gold)', display: 'block', marginBottom: 4,
                      }}>{item.value}</a>
                    ) : (
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 18, fontWeight: 700, marginBottom: 4,
                      }}>{item.value}</div>
                    )}
                    <div style={{ fontSize: 13, color: 'var(--gray)' }}>{item.sub}</div>
                  </div>
                </div>
              ))}

              <div className="card" style={{ background: 'rgba(249,168,37,0.06)', borderColor: 'rgba(249,168,37,0.2)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--gold)' }}>
                  ⭐ Air-Care Club Members
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  Club members receive priority response. When you call, identify yourself as a
                  member and you'll be moved to the front of the scheduling queue — especially
                  important during peak season.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div className="card" style={{ padding: 40 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 26,
                fontWeight: 700, textTransform: 'uppercase', marginBottom: 24,
              }}>Send a Message</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Your Name', type: 'text', placeholder: 'John Smith' },
                  { label: 'Phone Number', type: 'tel', placeholder: '(352) 000-0000' },
                  { label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                  { label: 'City / Neighborhood', type: 'text', placeholder: 'Ocala, The Villages, etc.' },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{
                      display: 'block', fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: 1.5, textTransform: 'uppercase',
                      color: 'var(--gray)', marginBottom: 6,
                    }}>{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} style={{
                      width: '100%', padding: '12px 16px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 8, color: 'white',
                      fontFamily: 'var(--font-body)', fontSize: 15,
                      outline: 'none',
                    }} />
                  </div>
                ))}
                <div>
                  <label style={{
                    display: 'block', fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: 1.5, textTransform: 'uppercase',
                    color: 'var(--gray)', marginBottom: 6,
                  }}>How Can We Help?</label>
                  <textarea rows={4} placeholder="AC not cooling, needs tune-up, interested in Club membership..." style={{
                    width: '100%', padding: '12px 16px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8, color: 'white',
                    fontFamily: 'var(--font-body)', fontSize: 15,
                    resize: 'vertical', outline: 'none',
                  }} />
                </div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                  Send Message →
                </button>
                <p style={{ fontSize: 12, color: 'var(--gray)', textAlign: 'center' }}>
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

// ─────────────────────────────────────────────────────────────
// AireAzul.jsx — Spanish language page
// ─────────────────────────────────────────────────────────────
export function AireAzul() {
  return (
    <>
      <section style={{
        background: 'linear-gradient(160deg, #0B1D3A, #0D3B6E)',
        padding: '140px 0 80px',
        textAlign: 'center',
      }}>
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--cyan)', marginBottom: 16 }}>
            Servicio en Español — Se habla español
          </div>
          <h1 className="display-xl" style={{ marginBottom: 20 }}>
            <span style={{ color: 'var(--cyan)' }}>Aire Azul</span>
          </h1>
          <p className="lead" style={{ maxWidth: 580, margin: '0 auto 36px' }}>
            Servicio profesional de aire acondicionado para hogares hispanohablantes
            en el Centro de Florida. El mismo nivel de calidad — en su idioma.
          </p>
          <a href="tel:+14079638544" className="btn btn-primary btn-lg">
            📞 Llame: 407-963-8544
          </a>
        </div>
      </section>

      {/* Services in Spanish */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="gold-bar" style={{ margin: '0 auto 20px' }} />
            <h2 className="display-lg">Nuestros Servicios</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { icon:'🔧', title:'Reparación de AC', desc:'Diagnóstico rápido y reparación el mismo día en la mayoría de los casos. Todas las marcas y modelos.' },
              { icon:'🔍', title:'Mantenimiento Preventivo', desc:'Inspección de 21 puntos. Extienda la vida de su equipo y evite reparaciones de emergencia costosas.' },
              { icon:'❄️', title:'Reemplazo de Sistema', desc:'Cuando es hora de un sistema nuevo, lo hacemos simple. Cotización instantánea en línea disponible 24/7.' },
              { icon:'💨', title:'Calidad del Aire Interior', desc:'Filtros MERV 8, 11 y 13, control de humedad, y sistemas UV para el clima húmedo de Florida.' },
              { icon:'🏗️', title:'Instalación Nueva', desc:'Instalaciones para nuevas construcciones y ampliaciones. Dimensionamiento adecuado garantizado.' },
              { icon:'🌡️', title:'Servicio de Bomba de Calor', desc:'Reparación, mantenimiento y reemplazo completo de bombas de calor. Certificados en R-410A y R-32.' },
            ].map((s, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: 16 }}>
                <div style={{
                  width: 52, height: 52, flexShrink: 0,
                  background: 'rgba(0,172,193,0.15)', borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                }}>{s.icon}</div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
                    textTransform: 'uppercase', marginBottom: 8,
                  }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Club Aire Azul */}
      <section style={{ background: 'var(--navy-mid)', padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="eyebrow" style={{ color: 'var(--cyan)', marginBottom: 12 }}>Programa de Membresía</div>
            <h2 className="display-lg">Club Aire Azul</h2>
            <p className="lead" style={{ maxWidth: 540, margin: '16px auto 0' }}>
              Proteja su equipo y ahorre dinero con nuestra membresía anual.
              Mantenimiento profesional, servicio prioritario y descuentos en reparaciones.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { icon:'🥈', name:'Plata', price:'$169/año', sub:'2 visitas • 10% desc.', color:'#78909C' },
              { icon:'⭐', name:'Oro', price:'$249/año', sub:'3 visitas • 4 filtros • 15% desc.', color:'var(--gold)', best:true },
              { icon:'💎', name:'Platino', price:'$399/año', sub:'Prioridad VIP • Sin cargo de servicio', color:'var(--cyan)' },
            ].map((p, i) => (
              <div key={i} className="card" style={{
                textAlign: 'center',
                border: p.best ? '2px solid var(--gold)' : undefined,
                background: p.best ? 'rgba(249,168,37,0.08)' : undefined,
              }}>
                {p.best && <div style={{ color:'var(--gold)', fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:8 }}>MEJOR VALOR</div>}
                <div style={{ fontSize: 36, marginBottom: 8 }}>{p.icon}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, color:p.color }}>
                  Club Aire Azul {p.name}
                </div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:900, color:p.color, margin:'8px 0' }}>
                  {p.price}
                </div>
                <div style={{ fontSize:13, color:'var(--gray)' }}>{p.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href="tel:+14079638544" className="btn btn-primary btn-lg">
              📞 Llame para unirse: 407-963-8544
            </a>
          </div>
        </div>
      </section>

      {/* Área de servicio */}
      <section style={{ background: 'var(--blue)', padding: '48px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 className="display-md" style={{ marginBottom: 16 }}>Área de Servicio</h2>
          <p className="lead" style={{ maxWidth: 600, margin: '0 auto 24px' }}>
            Servimos los condados de Marion, Lake, Sumter, Levy, Citrus y Alachua,
            incluyendo The Villages, Ocala, Gainesville, Leesburg y toda el área central de Florida.
          </p>
          <a href="tel:+14079638544" className="btn btn-primary btn-lg">
            📞 407-963-8544 — ¡Llame hoy!
          </a>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer.jsx
// ─────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer style={{
      background: '#050E1F',
      borderTop: '1px solid rgba(255,255,255,0.06)',
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
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
            }}>Air-Care Connect</div>
            <div style={{ fontSize: 13, color: 'var(--cyan)', marginBottom: 16, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>
              + Aire Azul
            </div>
            <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.7 }}>
              Professional HVAC service across Central Florida.
              Licensed, insured, and locally owned.
            </p>
          </div>

          {/* Links */}
          <div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:2, color:'var(--gray)', marginBottom:16, textTransform:'uppercase' }}>
              Pages
            </div>
            {[
              ['/', 'Home'],
              ['/services', 'Services'],
              ['/club', 'Air-Care Club'],
              ['/about', 'About Us'],
              ['/contact', 'Contact'],
              ['/aire-azul', '🇪🇸 Aire Azul (Español)'],
            ].map(([href, label]) => (
              <a key={href} href={href} style={{
                display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.6)',
                marginBottom: 8, transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color='var(--gold)'}
              onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.6)'}
              >{label}</a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:2, color:'var(--gray)', marginBottom:16, textTransform:'uppercase' }}>
              Contact
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div>
                <div style={{ fontSize:12, color:'var(--cyan)', marginBottom:3 }}>English Line</div>
                <a href="tel:+13524846341" style={{ fontSize:18, fontFamily:'var(--font-display)', fontWeight:700, color:'var(--gold)' }}>
                  352-484-6341
                </a>
              </div>
              <div>
                <div style={{ fontSize:12, color:'var(--cyan)', marginBottom:3 }}>Línea en Español</div>
                <a href="tel:+14079638544" style={{ fontSize:18, fontFamily:'var(--font-display)', fontWeight:700, color:'var(--gold)' }}>
                  407-963-8544
                </a>
              </div>
              <div style={{ fontSize:13, color:'var(--gray)', lineHeight:1.6 }}>
                Mon–Fri 7am–7pm<br />Sat 8am–5pm
              </div>
            </div>
          </div>

          {/* Service area */}
          <div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:2, color:'var(--gray)', marginBottom:16, textTransform:'uppercase' }}>
              Service Area
            </div>
            {['Marion County','Lake County','Sumter County','Levy County','Citrus County','Alachua County','The Villages'].map(c => (
              <div key={c} style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:6, display:'flex', gap:8 }}>
                <span style={{ color:'var(--gold)' }}>▸</span> {c}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 24,
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ fontSize:12, color:'var(--gray)' }}>
            © {new Date().getFullYear()} Air-Care Connect / Aire Azul. All rights reserved.
          </div>
          <div style={{ display:'flex', gap:16 }}>
            <span className="badge badge-green">✓ Licensed & Insured</span>
            <span className="badge badge-blue">✓ Se habla español</span>
          </div>
          <div style={{ fontSize:12, color:'var(--gray)' }}>
            <a href="https://air-careconnect.com" style={{ color:'var(--gray)' }}>air-careconnect.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
