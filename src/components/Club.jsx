import { useState } from 'react';
import { Link } from 'react-router-dom';

const PHONE_EN_HREF = 'tel:+13524846341';
const PHONE_EN = '352-484-6341';
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
  {
    id:'silver', icon:'🥈', name:'Air-Care Silver',
    price:189, monthly:14.99,
    color:'#78909C', colorPale:'#ECEFF1',
    border:'#B0BEC5',
    tagline:'Essential Protection',
    visits:'2 Tune-Up Visits / Year',
    features:[
      'Full 21-Point Inspection (both visits)',
      '2 Air Filters Included (MERV 8)',
      'Condensate Drain Flush & Treatment',
      '10% Discount on All Repairs',
      'Priority Scheduling',
      'Service Call Fee Waived (30 days after tune-up)',
      'Appointment Reminders by Call & Text',
    ],
    notIncluded:['Coil treatment not included','Refrigerant top-off not included'],
    value:'~$240',
  },
  {
    id:'gold', icon:'⭐', name:'Air-Care Gold',
    price:249, monthly:21.99,
    color:GOLD, colorPale:'#FFFDE7',
    border:'#FFD54F',
    tagline:'Complete Comfort — Most Popular',
    badge:'BEST VALUE',
    visits:'2 Tune-Ups + 1 Comfort Check Visit',
    features:[
      'Full 21-Point Inspection (both visits)',
      '4 Air Filters / Year (MERV 8 or MERV 11)',
      'Condensate Drain Flush + Pan Treatment Tabs',
      'Evaporator & Condenser Coil Treatment',
      'Thermostat Battery Replacement',
      '15% Discount on All Repairs — No Cap',
      'Peak Priority — Response within 24 hrs',
      'Service Call Fee Waived (45 days after tune-up)',
      'Annual Equipment Health Summary Report',
    ],
    notIncluded:['Refrigerant top-off not included'],
    value:'~$430',
    highlight:true,
  },
  {
    id:'platinum', icon:'💎', name:'Air-Care Platinum',
    price:399, monthly:35.99,
    color:SKY, colorPale:SKY_PALE,
    border:'#81D4FA',
    tagline:'Total Peace of Mind — VIP',
    badge:'MAX PROTECTION',
    visits:'2 Full Tune-Ups + Unlimited Priority Access',
    features:[
      'Full 21-Point Inspection (both visits)',
      '4 Filters / Year + Quarterly Mail Delivery Option',
      'Full Chemical Coil Wash (indoor + outdoor)',
      'Blower Wheel Inspection & Cleaning',
      'Up to 0.5 lb Refrigerant Top-Off Included',
      '20% Discount on All Repairs — No Cap',
      'VIP Priority — Same-Day Service, Guaranteed',
      'NO Service Call Fee — Ever',
      'Duct System Visual Inspection',
      'Plan Fully Transferable at Home Sale',
      'Digital Equipment Health Report (emailed)',
    ],
    notIncluded:[],
    value:'~$650+',
  },
];

const COMPARE_ROWS = [
  ['Annual Price','$189','$249','$399'],
  ['Monthly Option','$14.99/mo','$21.99/mo','$35.99/mo'],
  ['Tune-Up Visits','2','2 + comfort check','2 + unlimited priority'],
  ['Filters Included/Year','2','4','4 + delivery option'],
  ['Repair Discount','10%','15%','20%'],
  ['Service Priority','Standard','Peak 24-hr','VIP Same-Day'],
  ['Service Call Fee Waived','30 days','45 days','Always — never charged'],
  ['Coil Treatment','—','✓ Both visits','Chemical wash'],
  ['Refrigerant Top-Off','—','—','Up to 0.5 lb'],
  ['Transferable','—','—','✓ Yes'],
  ['Estimated Value','~$240','~$430','~$650+'],
];

export default function Club() {
  const [billing, setBilling] = useState('annual');

  return (
    <>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(160deg, ${OFF_WHITE} 0%, ${SKY_PALE} 50%, ${OFF_WHITE} 100%)`,
        padding: '140px 0 80px', textAlign: 'center',
      }}>
        <div className="container">
          <div style={{
            fontFamily:'Poppins,sans-serif', fontSize:12, fontWeight:600,
            letterSpacing:3, textTransform:'uppercase', color:SKY, marginBottom:16,
          }}>Membership Program</div>
          <h1 style={{
            fontFamily:'Poppins,sans-serif', fontSize:'clamp(36px,6vw,64px)',
            fontWeight:900, color:NAVY, marginBottom:20, lineHeight:1.1,
          }}>The Air-Care Club</h1>
          <p style={{
            fontSize:'clamp(16px,1.8vw,19px)', color:GRAY_DK,
            lineHeight:1.75, maxWidth:560, margin:'0 auto 36px',
          }}>
            Professional maintenance, priority service, and real savings — all year long.
            Two tune-ups, filters included, repair discounts that more than pay for the plan.
          </p>

          {/* Billing toggle */}
          <div style={{
            display:'inline-flex', gap:4,
            background:GRAY_LT, borderRadius:999, padding:4, marginBottom:12,
          }}>
            {[['annual','Pay Annually (Save)'],['monthly','Pay Monthly']].map(([v,label]) => (
              <button key={v} onClick={() => setBilling(v)} style={{
                padding:'10px 24px', borderRadius:999, border:'none',
                fontFamily:'Poppins,sans-serif', fontSize:15, fontWeight:700,
                cursor:'pointer', transition:'all 0.2s',
                background: billing===v ? SKY : 'transparent',
                color: billing===v ? WHITE : GRAY_DK,
                boxShadow: billing===v ? '0 4px 12px rgba(77,184,232,0.3)' : 'none',
              }}>{label}</button>
            ))}
          </div>
          {billing==='annual' && (
            <p style={{ fontSize:13, color:SKY, fontWeight:600 }}>
              ✓ Annual plans save you up to $62/year vs. monthly
            </p>
          )}
        </div>
      </section>

      {/* Plan cards */}
      <section style={{ background:WHITE, padding:'80px 0' }}>
        <div className="container">
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',
            gap:24, alignItems:'start',
          }}>
            {PLANS.map(plan => (
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
                {/* Badge */}
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
                  {/* Header */}
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

                  {/* Price */}
                  <div style={{ marginBottom:20 }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                      <span style={{
                        fontFamily:'Poppins,sans-serif',
                        fontSize:60, fontWeight:900, lineHeight:1, color:plan.color,
                      }}>${billing==='annual' ? plan.price : plan.monthly}</span>
                      <span style={{ color:GRAY, fontSize:16 }}>
                        {billing==='annual' ? '/year' : '/month'}
                      </span>
                    </div>
                    {billing==='monthly' && (
                      <div style={{ fontSize:12, color:GRAY, marginTop:4 }}>
                        Or ${plan.price}/year — save ${Math.round(plan.monthly*12-plan.price)}/yr
                      </div>
                    )}
                  </div>

                  {/* Visits */}
                  <div style={{
                    background:plan.colorPale, border:`1px solid ${plan.border}`,
                    borderRadius:10, padding:'10px 14px',
                    fontSize:13, color:NAVY, fontWeight:600, marginBottom:24,
                  }}>📅 {plan.visits}</div>

                  {/* Features */}
                  <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
                    {plan.features.map((f,i) => (
                      <li key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:14, color:GRAY_DK }}>
                        <span style={{
                          flexShrink:0, width:20, height:20,
                          background:SKY_PALE, color:SKY,
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

                  {/* Value */}
                  <div style={{
                    background:'rgba(56,161,105,0.08)', border:'1px solid rgba(56,161,105,0.2)',
                    borderRadius:10, padding:'10px 14px',
                    textAlign:'center', marginBottom:20, fontSize:13,
                  }}>
                    <span style={{ color:'#38A169', fontWeight:600 }}>
                      Estimated value: <strong style={{ fontSize:18 }}>{plan.value}</strong>
                      {' '}for only ${plan.price}
                    </span>
                  </div>

                  {/* CTA */}
                  <a href={PHONE_EN_HREF} style={{
                    display:'flex', alignItems:'center', justifyContent:'center',
                    width:'100%', padding:'14px',
                    background: plan.highlight ? plan.color : WHITE,
                    color: plan.highlight ? (plan.id==='gold' ? NAVY : WHITE) : plan.color,
                    border:`2px solid ${plan.color}`,
                    borderRadius:12, fontSize:15, fontWeight:700,
                    cursor:'pointer', fontFamily:'Poppins,sans-serif',
                    transition:'all 0.2s', textDecoration:'none',
                  }}>
                    Join {plan.name.replace('Air-Care ','')} Plan
                  </a>

                  {/* Email agreement CTA */}
                  <Link to={`/club/documents?plan=${plan.id}`} style={{
                    display:'flex', alignItems:'center', justifyContent:'center',
                    width:'100%', padding:'10px', marginTop:10,
                    color: GRAY_DK, fontSize:13, fontWeight:600,
                    fontFamily:'Poppins,sans-serif', textDecoration:'underline',
                  }}>
                    📧 Email Me This Agreement to Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ background:OFF_WHITE, padding:'80px 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div style={{ fontFamily:'Poppins,sans-serif', fontSize:12, fontWeight:600, letterSpacing:3, textTransform:'uppercase', color:SKY, marginBottom:12 }}>Side by Side</div>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontSize:'clamp(24px,3vw,36px)', fontWeight:800, color:NAVY }}>Plan Comparison</h2>
          </div>
          <div style={{ overflowX:'auto', borderRadius:16, boxShadow:'0 4px 24px rgba(27,58,107,0.1)', border:`1px solid ${GRAY_LT}` }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'Inter,sans-serif', fontSize:14, background:WHITE }}>
              <thead>
                <tr style={{ background:NAVY }}>
                  <th style={{ padding:'16px 20px', textAlign:'left', color:'rgba(255,255,255,0.6)', fontWeight:600 }}>Benefit</th>
                  {['🥈 Silver','⭐ Gold','💎 Platinum'].map((h,i) => (
                    <th key={i} style={{
                      padding:'16px 20px', textAlign:'center',
                      color:['#90A4AE',GOLD,SKY][i],
                      fontFamily:'Poppins,sans-serif', fontSize:15, fontWeight:800,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(([label,...vals], ri) => (
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

      {/* CTA */}
      <section style={{ background:NAVY, padding:'64px 0', textAlign:'center' }}>
        <div className="container">
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontSize:'clamp(24px,3vw,36px)', fontWeight:800, color:WHITE, marginBottom:20 }}>
            Ready to Join?
          </h2>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:17, maxWidth:460, margin:'0 auto 32px', lineHeight:1.7 }}>
            Call us and we'll get you set up before we leave your driveway. Most members enrolled in under 5 minutes.
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <a href={PHONE_EN_HREF} className="btn btn-primary btn-lg">📞 Call {PHONE_EN}</a>
            <Link to="/contact" className="btn btn-outline-sky btn-lg">Send a Message</Link>
          </div>
        </div>
      </section>
    </>
  );
}

