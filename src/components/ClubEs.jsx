import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PHONE_ES_HREF = 'tel:+14079638544';
const PHONE_ES = '407-963-8544';
const TERRA = '#E07A5F';
const TERRA_PALE = '#FDF0EC';
const NAVY = '#1B3A6B';
const WHITE = '#FFFFFF';
const OFF_WHITE = '#F7FBFD';
const GRAY_LT = '#EEF2F5';
const GRAY = '#8FA3B1';
const GRAY_DK = '#4A5568';
const GOLD = '#F9A825';
const SKY = '#4DB8E8';
const SKY_PALE = '#E8F6FC';

const JOURNEY_FUNCTIONS_URL = 'https://gatndtsmjrxdgxquvydw.supabase.co/functions/v1';
const AIR_CARE_CONNECT_ORG_ID = '7194773e-a5fd-4666-bb32-2a70e736e7fb';

// Pricing (price/monthly/discount) is fetched live from Journey's tier table
// at render time and merged in below — these numbers are only the fallback
// used if that fetch fails. Everything else is presentation content.
const PLANS = [
  {
    id:'silver', icon:'🥈', name:'Club Aire Azul Plata',
    price:189, monthly:14.99, discount:'10%',
    color:'#78909C', colorPale:'#ECEFF1',
    border:'#B0BEC5',
    tagline:'Protección Esencial',
    visits:'2 Visitas de Mantenimiento / Año',
    features:[
      'Inspección Completa de 21 Puntos (ambas visitas)',
      '2 Filtros de Aire Incluidos (MERV 8)',
      'Limpieza y Tratamiento de Drenaje de Condensado',
      '10% de Descuento en Todas las Reparaciones',
      'Programación Prioritaria',
      'Tarifa de Visita Exenta (30 días después del mantenimiento)',
      'Recordatorios de Cita por Llamada y Mensaje de Texto',
    ],
    notIncluded:['Tratamiento de serpentín no incluido','Recarga de refrigerante no incluida'],
    value:'~$240',
  },
  {
    id:'gold', icon:'⭐', name:'Club Aire Azul Oro',
    price:249, monthly:21.99, discount:'15%',
    color:GOLD, colorPale:'#FFFDE7',
    border:'#FFD54F',
    tagline:'Confort Completo — Mejor Valor',
    badge:'MEJOR VALOR',
    visits:'2 Mantenimientos + 1 Visita de Revisión',
    features:[
      'Inspección Completa de 21 Puntos (ambas visitas)',
      '4 Filtros de Aire / Año (MERV 8 u 11)',
      'Limpieza de Drenaje + Tabletas de Tratamiento',
      'Tratamiento de Serpentín Evaporador y Condensador',
      'Reemplazo de Baterías del Termostato',
      '15% de Descuento en Todas las Reparaciones — Sin Límite',
      'Prioridad de Temporada Alta — Respuesta en 24 hrs',
      'Tarifa de Visita Exenta (45 días después del mantenimiento)',
      'Informe Anual del Estado del Equipo',
    ],
    notIncluded:['Recarga de refrigerante no incluida'],
    value:'~$430',
    highlight:true,
  },
  {
    id:'platinum', icon:'💎', name:'Club Aire Azul Platino',
    price:399, monthly:35.99, discount:'20%',
    color:SKY, colorPale:SKY_PALE,
    border:'#81D4FA',
    tagline:'Tranquilidad Total — VIP',
    badge:'MÁXIMA PROTECCIÓN',
    visits:'2 Mantenimientos Completos + Prioridad Ilimitada',
    features:[
      'Inspección Completa de 21 Puntos (ambas visitas)',
      '4 Filtros / Año + Opción de Envío Trimestral',
      'Lavado Químico Completo del Serpentín (interior y exterior)',
      'Inspección y Limpieza de la Rueda del Soplador',
      'Recarga de Refrigerante Incluida (hasta 0.5 lb)',
      '20% de Descuento en Todas las Reparaciones — Sin Límite',
      'Prioridad VIP — Servicio el Mismo Día, Garantizado',
      'SIN Tarifa de Visita de Servicio — Nunca',
      'Inspección Visual del Sistema de Ductos',
      'Plan Totalmente Transferible en Venta de Casa',
      'Informe Digital del Estado del Equipo (por correo)',
    ],
    notIncluded:[],
    value:'~$650+',
  },
];

function formatAnnual(price) {
  return '$' + (Number.isInteger(price) ? price : price.toFixed(2));
}
function formatMonthly(price) {
  return '$' + Number(price).toFixed(2) + '/mes';
}

export default function ClubEs() {
  const [billing, setBilling] = useState('annual');
  const [liveTiers, setLiveTiers] = useState(null);

  useEffect(() => {
    fetch(`${JOURNEY_FUNCTIONS_URL}/public-tiers?orgId=${AIR_CARE_CONNECT_ORG_ID}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data || !data.tiers) return;
        const byName = {};
        for (const t of data.tiers) byName[t.name.toLowerCase()] = t;
        setLiveTiers(byName);
      })
      .catch(() => {}); // silently keep fallback prices if this fails
  }, []);

  const displayPlans = PLANS.map((plan) => {
    const live = liveTiers && liveTiers[plan.id];
    if (!live) return plan;
    return {
      ...plan,
      price: Number(live.annual_price),
      monthly: Number(live.monthly_price),
      discount: Number(live.discount_pct) + '%',
    };
  });

  const compareRows = [
    ['Precio Anual', ...displayPlans.map((p) => formatAnnual(p.price))],
    ['Opción Mensual', ...displayPlans.map((p) => formatMonthly(p.monthly))],
    ['Visitas de Mantenimiento', '2', '2 + revisión', '2 + prioridad ilimitada'],
    ['Filtros Incluidos/Año', '2', '4', '4 + opción de envío'],
    ['Descuento en Reparaciones', ...displayPlans.map((p) => p.discount)],
    ['Prioridad de Servicio', 'Estándar', 'Alta — 24 hrs', 'VIP Mismo Día'],
    ['Tarifa de Visita Exenta', '30 días', '45 días', 'Siempre — nunca se cobra'],
    ['Tratamiento de Serpentín', '—', '✓ Ambas visitas', 'Lavado químico'],
    ['Recarga de Refrigerante', '—', '—', 'Hasta 0.5 lb'],
    ['Transferible', '—', '—', '✓ Sí'],
    ['Valor Estimado', ...displayPlans.map((p) => p.value)],
  ];

  return (
    <>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(160deg, ${OFF_WHITE} 0%, ${TERRA_PALE} 50%, ${OFF_WHITE} 100%)`,
        padding: '140px 0 80px', textAlign: 'center',
      }}>
        <div className="container">
          <div style={{
            fontFamily:'Poppins,sans-serif', fontSize:12, fontWeight:600,
            letterSpacing:3, textTransform:'uppercase', color:TERRA, marginBottom:16,
          }}>Programa de Membresía</div>
          <h1 style={{
            fontFamily:'Poppins,sans-serif', fontSize:'clamp(36px,6vw,64px)',
            fontWeight:900, color:NAVY, marginBottom:20, lineHeight:1.1,
          }}>Club Aire Azul</h1>
          <p style={{
            fontSize:'clamp(16px,1.8vw,19px)', color:GRAY_DK,
            lineHeight:1.75, maxWidth:560, margin:'0 auto 36px',
          }}>
            Mantenimiento profesional, servicio prioritario y ahorros reales — todo el año.
            Dos mantenimientos, filtros incluidos, y descuentos en reparaciones que justifican el plan.
          </p>

          <div style={{
            display:'inline-flex', gap:4,
            background:GRAY_LT, borderRadius:999, padding:4, marginBottom:12,
          }}>
            {[['annual','Pago Anual (Ahorre)'],['monthly','Pago Mensual']].map(([v,label]) => (
              <button key={v} onClick={() => setBilling(v)} style={{
                padding:'10px 24px', borderRadius:999, border:'none',
                fontFamily:'Poppins,sans-serif', fontSize:15, fontWeight:700,
                cursor:'pointer', transition:'all 0.2s',
                background: billing===v ? TERRA : 'transparent',
                color: billing===v ? WHITE : GRAY_DK,
                boxShadow: billing===v ? '0 4px 12px rgba(224,122,95,0.3)' : 'none',
              }}>{label}</button>
            ))}
          </div>
          {billing==='annual' && (
            <p style={{ fontSize:13, color:TERRA, fontWeight:600 }}>
              ✓ Los planes anuales ahorran hasta $62/año vs. mensual
            </p>
          )}
        </div>
      </section>

      <section style={{ background:WHITE, padding:'80px 0' }}>
        <div className="container">
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',
            gap:24, alignItems:'start',
          }}>
            {displayPlans.map(plan => (
              <div key={plan.id} style={{
                background:WHITE,
                border:`2px solid ${plan.highlight ? plan.color : GRAY_LT}`,
                borderRadius:24, overflow:'hidden',
                transform: plan.highlight ? 'scale(1.03)' : 'scale(1)',
                boxShadow: plan.highlight
                  ? `0 16px 48px rgba(249,168,37,0.15)`
                  : '0 4px 16px rgba(27,58,107,0.08)',
                transition:'all 0.3s',
              }}>
                {plan.badge && (
                  <div style={{
                    background: plan.id==='gold' ? GOLD : NAVY,
                    color: plan.id==='gold' ? NAVY : WHITE,
                    textAlign:'center',
                    fontFamily:'Poppins,sans-serif',
                    fontSize:12, fontWeight:800,
                    letterSpacing:2, textTransform:'uppercase',
                    padding:'8px',
                  }}>{plan.badge}</div>
                )}

                <div style={{ padding:32 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                    <span style={{ fontSize:36 }}>{plan.icon}</span>
                    <div>
                      <div style={{
                        fontFamily:'Poppins,sans-serif', fontSize:20, fontWeight:800,
                        color:plan.color,
                      }}>{plan.name}</div>
                      <div style={{ fontSize:13, color:GRAY, fontStyle:'italic' }}>{plan.tagline}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom:20 }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                      <span style={{
                        fontFamily:'Poppins,sans-serif',
                        fontSize:60, fontWeight:900, lineHeight:1, color:plan.color,
                      }}>${billing==='annual' ? plan.price : plan.monthly}</span>
                      <span style={{ color:GRAY, fontSize:16 }}>
                        {billing==='annual' ? '/año' : '/mes'}
                      </span>
                    </div>
                    {billing==='monthly' && (
                      <div style={{ fontSize:12, color:GRAY, marginTop:4 }}>
                        O ${plan.price}/año — ahorre ${Math.round(plan.monthly*12-plan.price)}/año
                      </div>
                    )}
                  </div>

                  <div style={{
                    background:plan.colorPale, border:`1px solid ${plan.border}`,
                    borderRadius:10, padding:'10px 14px',
                    fontSize:13, color:NAVY, fontWeight:600, marginBottom:24,
                  }}>📅 {plan.visits}</div>

                  <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
                    {plan.features.map((f,i) => (
                      <li key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:14, color:GRAY_DK }}>
                        <span style={{
                          flexShrink:0, width:20, height:20,
                          background:TERRA_PALE, color:TERRA,
                          borderRadius:'50%', display:'flex', alignItems:'center',
                          justifyContent:'center', fontSize:11, fontWeight:700, marginTop:1,
                        }}>✓</span>
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded.map((f,i) => (
                      <li key={`x${i}`} style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:14, color:'#B0BEC5' }}>
                        <span style={{ flexShrink:0 }}>✗</span>{f}
                      </li>
                    ))}
                  </ul>

                  <div style={{
                    background:'rgba(56,161,105,0.08)', border:'1px solid rgba(56,161,105,0.2)',
                    borderRadius:10, padding:'10px 14px',
                    textAlign:'center', marginBottom:20, fontSize:13,
                  }}>
                    <span style={{ color:'#38A169', fontWeight:600 }}>
                      Valor estimado: <strong style={{ fontSize:18 }}>{plan.value}</strong>
                      {' '}por solo ${plan.price}
                    </span>
                  </div>

                  <a href={PHONE_ES_HREF} style={{
                    display:'flex', alignItems:'center', justifyContent:'center',
                    width:'100%', padding:'14px',
                    background: plan.highlight ? plan.color : WHITE,
                    color: plan.highlight ? (plan.id==='gold' ? NAVY : WHITE) : plan.color,
                    border:`2px solid ${plan.color}`,
                    borderRadius:12, fontSize:15, fontWeight:700,
                    cursor:'pointer', fontFamily:'Poppins,sans-serif',
                    transition:'all 0.2s', textDecoration:'none',
                  }}>
                    Únase al Plan {plan.name.replace('Club Aire Azul ','')}
                  </a>

                  <Link to={`/aire-azul/documentos?plan=${plan.id}`} style={{
                    display:'flex', alignItems:'center', justifyContent:'center',
                    width:'100%', padding:'10px', marginTop:10,
                    color: GRAY_DK, fontSize:13, fontWeight:600,
                    fontFamily:'Poppins,sans-serif', textDecoration:'underline',
                  }}>
                    📧 Recibir este Acuerdo por Correo
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:OFF_WHITE, padding:'80px 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div style={{ fontFamily:'Poppins,sans-serif', fontSize:12, fontWeight:600, letterSpacing:3, textTransform:'uppercase', color:TERRA, marginBottom:12 }}>Comparación</div>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontSize:'clamp(24px,3vw,36px)', fontWeight:800, color:NAVY }}>Comparación de Planes</h2>
          </div>
          <div style={{ overflowX:'auto', borderRadius:16, boxShadow:'0 4px 24px rgba(27,58,107,0.1)', border:`1px solid ${GRAY_LT}` }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'Inter,sans-serif', fontSize:14, background:WHITE }}>
              <thead>
                <tr style={{ background:NAVY }}>
                  <th style={{ padding:'16px 20px', textAlign:'left', color:'rgba(255,255,255,0.6)', fontWeight:600 }}>Beneficio</th>
                  {['🥈 Plata','⭐ Oro','💎 Platino'].map((h,i) => (
                    <th key={i} style={{
                      padding:'16px 20px', textAlign:'center',
                      color:['#90A4AE',GOLD,SKY][i],
                      fontFamily:'Poppins,sans-serif', fontSize:15, fontWeight:800,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map(([label,...vals], ri) => (
                  <tr key={ri} style={{ background: ri%2===0 ? WHITE : OFF_WHITE }}>
                    <td style={{ padding:'13px 20px', fontWeight:500, color:NAVY, borderBottom:`1px solid ${GRAY_LT}` }}>{label}</td>
                    {vals.map((v,vi) => (
                      <td key={vi} style={{
                        padding:'13px 20px', textAlign:'center',
                        borderBottom:`1px solid ${GRAY_LT}`,
                        color: v==='—' ? '#CBD5E0' : vi===1 ? '#B7791F' : NAVY,
                        fontWeight: vi===1 ? 700 : 400,
                      }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={{ background:NAVY, padding:'64px 0', textAlign:'center' }}>
        <div className="container">
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontSize:'clamp(24px,3vw,36px)', fontWeight:800, color:WHITE, marginBottom:20 }}>
            ¿Listo para Unirse?
          </h2>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:17, maxWidth:460, margin:'0 auto 32px', lineHeight:1.7 }}>
            Llámenos y le inscribiremos antes de que salgamos de su entrada. La mayoría se inscribe en menos de 5 minutos.
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <a href={PHONE_ES_HREF} className="btn btn-primary btn-lg" style={{ background: TERRA, borderColor: TERRA }}>📞 Llame {PHONE_ES}</a>
            <Link to="/aire-azul/contact" className="btn btn-outline-sky btn-lg">Enviar un Mensaje</Link>
          </div>
        </div>
      </section>
    </>
  );
}
