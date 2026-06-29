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

const PLANS = [
  { id: 'silver', name: 'Club Aire Azul Plata', icon: '\ud83e\udd48', price: 189, color: '#78909C' },
  { id: 'gold', name: 'Club Aire Azul Oro', icon: '\u2b50', price: 249, color: GOLD },
  { id: 'platinum', name: 'Club Aire Azul Platino', icon: '\ud83d\udc8e', price: 399, color: SKY },
];

export default function ClubDocumentsEs() {
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
        body: JSON.stringify({ email, plans: selected, language: 'es' }),
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
        }}>Club Aire Azul</div>
        <h1 style={{
          fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(28px,4vw,42px)',
          fontWeight: 900, color: NAVY, marginBottom: 16, textAlign: 'center', lineHeight: 1.15,
        }}>Reciba su Acuerdo de Membres\u00eda por Correo</h1>
        <p style={{ fontSize: 16, color: GRAY_DK, textAlign: 'center', marginBottom: 40, lineHeight: 1.7 }}>
          Seleccione uno, dos o los tres planes para comparar \u2014 le enviaremos el acuerdo completo de cada uno, junto con un enlace seguro para inscribirse cuando est\u00e9 listo.
        </p>

        <div style={{
          background: WHITE, border: `1px solid ${GRAY_LT}`, borderRadius: 20,
          padding: 36, boxShadow: '0 4px 24px rgba(27,58,107,0.08)',
        }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>\u2705</div>
              <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 20, color: NAVY, marginBottom: 8 }}>
                \u00a1Revise su correo!
              </div>
              <p style={{ fontSize: 15, color: GRAY_DK, lineHeight: 1.7 }}>
                Hemos enviado {selected.length > 1 ? 'los acuerdos' : 'el acuerdo'} a <strong>{email}</strong>.
                Puede tardar uno o dos minutos en llegar \u2014 revise su carpeta de spam si no lo ve.
              </p>
              <Link to="/aire-azul" style={{ color: SKY, fontWeight: 600, fontSize: 14, display: 'inline-block', marginTop: 16 }}>
                \u2190 Volver a Aire Azul
              </Link>
            </div>
          ) : (
            <>
              <div style={{
                display: 'block', fontSize: 12, fontFamily: 'Poppins,sans-serif',
                letterSpacing: 1.5, textTransform: 'uppercase', color: GRAY_DK,
                fontWeight: 600, marginBottom: 14,
              }}>Seleccione el(los) Plan(es)</div>

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
                    <span style={{ fontSize: 14, color: GRAY_DK, fontWeight: 600 }}>${p.price}/a\u00f1o</span>
                  </label>
                ))}
              </div>

              <label style={{
                display: 'block', fontSize: 12, fontFamily: 'Poppins,sans-serif',
                letterSpacing: 1.5, textTransform: 'uppercase', color: GRAY_DK,
                fontWeight: 600, marginBottom: 6,
              }}>Su Correo Electr\u00f3nico *</label>
              <input
                type="email" placeholder="juan@ejemplo.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', background: OFF_WHITE,
                  border: `1px solid ${GRAY_LT}`, borderRadius: 10, color: '#1A1A2E',
                  fontFamily: 'Inter,sans-serif', fontSize: 15, outline: 'none', marginBottom: 20,
                }}
              />

              {status === 'missing' && (
                <p style={{ fontSize: 13, color: '#C62828', textAlign: 'center', marginBottom: 16 }}>
                  Por favor seleccione al menos un plan e ingrese su correo electr\u00f3nico.
                </p>
              )}

              <button
                className="btn btn-navy"
                style={{ width: '100%', justifyContent: 'center', opacity: status === 'submitting' ? 0.6 : 1 }}
                disabled={status === 'submitting'}
                onClick={handleSubmit}
              >
                {status === 'submitting' ? 'Enviando...' : `Enviarme ${selected.length > 1 ? 'estos Acuerdos' : 'este Acuerdo'} \u2192`}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
