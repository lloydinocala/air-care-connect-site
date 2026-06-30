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

const PLANS = [
  { id:'silver', name:'Club Aire Azul Plata',   icon:'🥈', annual:189, monthly:15.99, color:'#78909C' },
  { id:'gold',   name:'Club Aire Azul Oro',     icon:'⭐', annual:249, monthly:21.99, color:GOLD, badge:'Mejor Valor' },
  { id:'platinum',name:'Club Aire Azul Platino',icon:'💎', annual:399, monthly:35.99, color:SKY,  badge:'VIP' },
];

const inputStyle = {
  width:'100%', padding:'12px 16px', background:OFF_WHITE,
  border:`1px solid ${GRAY_LT}`, borderRadius:10, color:'#1A1A2E',
  fontFamily:'Inter,sans-serif', fontSize:15, outline:'none',
};
const labelStyle = {
  display:'block', fontSize:12, fontFamily:'Poppins,sans-serif',
  letterSpacing:1.5, textTransform:'uppercase', color:GRAY_DK,
  fontWeight:600, marginBottom:6,
};

export default function ClubDocumentsEs() {
  const [searchParams] = useSearchParams();
  const [selected, setSelected]   = useState([]);
  const [billing, setBilling]     = useState('annual');
  const [email, setEmail]         = useState('');
  const [status, setStatus]       = useState('idle');
  const [sentEmail, setSentEmail] = useState('');

  useEffect(() => {
    const requested = searchParams.get('plan');
    if (requested && PLANS.some((p) => p.id === requested)) setSelected([requested]);
    const bill = searchParams.get('billing');
    if (bill === 'monthly') setBilling('monthly');
  }, [searchParams]);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleSubmit = async () => {
    if (!email.trim() || selected.length === 0) { setStatus('missing'); return; }
    setStatus('submitting');
    try {
      const r = await fetch('/api/send-agreement-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plans: selected, billing, language: 'es' }),
      });
      if (!r.ok) { setStatus('error'); return; }
      setSentEmail(email);
      setStatus('success');
    } catch (e) { setStatus('error'); }
  };

  const annualSavings = (p) => Math.round(p.monthly * 12 - p.annual);

  return (
    <section style={{ background:OFF_WHITE, padding:'140px 0 80px', minHeight:'70vh' }}>
      <div className="container" style={{ maxWidth:660 }}>

        <div style={{ fontFamily:'Poppins,sans-serif', fontSize:12, fontWeight:600,
          letterSpacing:3, textTransform:'uppercase', color:SKY, marginBottom:16, textAlign:'center' }}>
          Club Aire Azul
        </div>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:'clamp(26px,4vw,40px)',
          fontWeight:900, color:NAVY, marginBottom:14, textAlign:'center', lineHeight:1.15 }}>
          Reciba su Acuerdo de Membresía por Correo
        </h1>
        <p style={{ fontSize:16, color:GRAY_DK, textAlign:'center', marginBottom:36, lineHeight:1.75 }}>
          Seleccione uno, dos o los tres planes — le enviaremos el acuerdo de membresía completo
          para cada uno, junto con un enlace seguro para inscribirse cuando esté listo.
          Sin presión, sin compromiso.
        </p>

        <div style={{ background:WHITE, border:`1px solid ${GRAY_LT}`, borderRadius:20,
          padding:36, boxShadow:'0 4px 24px rgba(27,58,107,0.08)' }}>

          {status === 'success' ? (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
              <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:22, color:NAVY, marginBottom:10 }}>
                ¡Revise su correo!
              </div>
              <p style={{ fontSize:15, color:GRAY_DK, lineHeight:1.75, maxWidth:420, margin:'0 auto' }}>
                Enviamos {selected.length > 1 ? 'los acuerdos' : 'el acuerdo'} a <strong>{sentEmail}</strong>.
                Cada uno incluye un botón para revisar el PDF completo y un enlace seguro para
                inscribirse y pagar cuando esté listo — sin necesidad de cuenta ni contraseña.
              </p>
              <p style={{ fontSize:13, color:GRAY_DK, marginTop:14 }}>
                ¿No lo recibió? Revise su carpeta de spam, o llámenos al{' '}
                <a href="tel:+14079638544" style={{ color:SKY, fontWeight:600 }}>407-963-8544</a>.
              </p>
              <Link to="/aire-azul" style={{ color:SKY, fontWeight:600, fontSize:14,
                display:'inline-block', marginTop:20 }}>
                ← Volver a Aire Azul
              </Link>
            </div>

          ) : (
            <>
              {/* ── Paso 1: Facturación ── */}
              <div style={{ marginBottom:28 }}>
                <div style={labelStyle}>Paso 1 — ¿Cómo prefiere pagar?</div>
                <div style={{ display:'flex', gap:0, background:GRAY_LT, borderRadius:12, padding:4 }}>
                  {[
                    { v:'annual',  label:'Pago Anual',    sub:'Ahorre hasta $62/año' },
                    { v:'monthly', label:'Pago Mensual',  sub:'Sin compromiso largo' },
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

              {/* ── Paso 2: Planes ── */}
              <div style={{ marginBottom:28 }}>
                <div style={labelStyle}>Paso 2 — Seleccione el(los) Plan(es)</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {PLANS.map((p) => {
                    const active = selected.includes(p.id);
                    const price = billing === 'annual' ? `$${p.annual}/año` : `$${p.monthly}/mes`;
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
                              Ahorre ${savings}/año vs. mensual
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                <p style={{ fontSize:12, color:GRAY_DK, marginTop:10, fontStyle:'italic' }}>
                  Seleccionar varios planes le permite compararlos antes de decidir.
                </p>
              </div>

              {/* ── Paso 3: Email ── */}
              <div style={{ marginBottom:20 }}>
                <label style={labelStyle}>Paso 3 — Su Correo Electrónico *</label>
                <input
                  type="email" placeholder="juan@ejemplo.com" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
                <p style={{ fontSize:12, color:GRAY_DK, marginTop:6, fontStyle:'italic' }}>
                  Le enviaremos el acuerdo y un enlace de inscripción. No le enviaremos spam.
                </p>
              </div>

              {status === 'missing' && (
                <p style={{ fontSize:13, color:'#C62828', textAlign:'center', marginBottom:14 }}>
                  Por favor seleccione al menos un plan e ingrese su correo electrónico.
                </p>
              )}
              {status === 'error' && (
                <p style={{ fontSize:13, color:'#C62828', textAlign:'center', marginBottom:14 }}>
                  Algo salió mal — inténtelo de nuevo o llámenos al 407-963-8544.
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
                  ? 'Enviando...'
                  : `Enviarme ${selected.length > 1 ? 'estos Acuerdos' : 'este Acuerdo'} →`}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
