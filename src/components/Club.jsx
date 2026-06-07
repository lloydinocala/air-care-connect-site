import { useState } from 'react';
import { Link } from 'react-router-dom';

const PHONE_EN_HREF = 'tel:+13524846341';
const PHONE_EN = '352-484-6341';

const PLANS = [
  {
    id: 'silver', icon: '🥈', name: 'Air-Care Silver',
    price: 169, monthly: 14.99,
    color: '#78909C', colorLight: 'rgba(120,144,156,0.12)',
    border: 'rgba(120,144,156,0.4)',
    tagline: 'Essential Protection',
    visits: '2 Tune-Up Visits / Year',
    features: [
      'Full 21-Point Inspection (both visits)',
      '2 Air Filters Included (MERV 8)',
      'Condensate Drain Flush & Treatment',
      '10% Discount on All Repairs',
      'Priority Scheduling',
      'Service Call Fee Waived (30 days after tune-up)',
      'Appointment Reminders by Call & Text',
    ],
    notIncluded: ['Coil treatment not included', 'Refrigerant top-off not included'],
    value: '~$240',
  },
  {
    id: 'gold', icon: '⭐', name: 'Air-Care Gold',
    price: 249, monthly: 21.99,
    color: '#F9A825', colorLight: 'rgba(249,168,37,0.12)',
    border: 'rgba(249,168,37,0.5)',
    tagline: 'Complete Comfort — Most Popular',
    badge: 'BEST VALUE',
    visits: '2 Tune-Ups + 1 Comfort Check Visit',
    features: [
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
    notIncluded: ['Refrigerant top-off not included'],
    value: '~$430',
    highlight: true,
  },
  {
    id: 'platinum', icon: '💎', name: 'Air-Care Platinum',
    price: 399, monthly: 35.99,
    color: '#00ACC1', colorLight: 'rgba(0,172,193,0.12)',
    border: 'rgba(0,172,193,0.4)',
    tagline: 'Total Peace of Mind — VIP',
    badge: 'MAX PROTECTION',
    visits: '2 Full Tune-Ups + Unlimited Priority Access',
    features: [
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
    notIncluded: [],
    value: '~$650+',
  },
];

const COMPARE_ROWS = [
  ['Annual Price', '$169', '$249', '$399'],
  ['Monthly Option', '$14.99/mo', '$21.99/mo', '$35.99/mo'],
  ['Tune-Up Visits', '2', '2 + comfort check', '2 + unlimited priority'],
  ['Filters Included/Year', '2', '4', '4 + delivery option'],
  ['Repair Discount', '10%', '15%', '20%'],
  ['Service Priority', 'Standard', 'Peak 24-hr', 'VIP Same-Day'],
  ['Service Call Fee Waived', '30 days post-tune-up', '45 days post-tune-up', 'Always — never charged'],
  ['Coil Treatment', '—', '✓ Both visits', 'Chemical wash'],
  ['Refrigerant Top-Off', '—', '—', 'Up to 0.5 lb'],
  ['Transferable', '—', '—', '✓ Yes'],
  ['Estimated Value', '~$240', '~$430', '~$650+'],
];

export default function Club() {
  const [billing, setBilling] = useState('annual');

  return (
    <>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #0B1D3A 0%, #122448 60%, #1A3260 100%)',
        padding: '140px 0 80px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,168,37,0.08) 0%, transparent 70%)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Membership Program</div>
          <h1 className="display-xl" style={{ marginBottom: 20 }}>
            The Air-Care Club
          </h1>
          <p className="lead" style={{ maxWidth: 560, margin: '0 auto 36px' }}>
            Professional maintenance, priority service, and real savings —
            all year long. Two tune-ups, filters included, repair discounts
            that more than pay for the plan.
          </p>

          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', gap: 4,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 999, padding: 4, marginBottom: 16,
          }}>
            {[['annual','Pay Annually (Save)'],['monthly','Pay Monthly']].map(([v,label]) => (
              <button key={v} onClick={() => setBilling(v)} style={{
                padding: '10px 24px',
                borderRadius: 999, border: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: 16, fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: billing === v ? 'var(--gold)' : 'transparent',
                color: billing === v ? 'var(--navy)' : 'rgba(255,255,255,0.6)',
              }}>{label}</button>
            ))}
          </div>
          {billing === 'annual' && (
            <p style={{ fontSize: 13, color: 'var(--gold)', marginTop: 4 }}>
              ✓ Annual plans save you up to $62/year vs. monthly
            </p>
          )}
        </div>
      </section>

      {/* Plan cards */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24, alignItems: 'start',
          }}>
            {PLANS.map(plan => (
              <div key={plan.id} style={{
                background: plan.highlight
                  ? `linear-gradient(160deg, ${plan.colorLight}, rgba(255,255,255,0.03))`
                  : 'rgba(255,255,255,0.04)',
                border: `2px solid ${plan.highlight ? plan.border : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 24,
                overflow: 'hidden',
                transform: plan.highlight ? 'scale(1.03)' : 'scale(1)',
                boxShadow: plan.highlight ? `0 24px 64px rgba(249,168,37,0.15)` : 'none',
                transition: 'all 0.3s',
              }}>
                {/* Badge */}
                {plan.badge && (
                  <div style={{
                    background: plan.color, color: plan.id === 'gold' ? 'var(--navy)' : 'white',
                    textAlign: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: 13, fontWeight: 800,
                    letterSpacing: 2, textTransform: 'uppercase',
                    padding: '8px',
                  }}>{plan.badge}</div>
                )}

                <div style={{ padding: 32 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <span style={{ fontSize: 36 }}>{plan.icon}</span>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 22, fontWeight: 800,
                        textTransform: 'uppercase', color: plan.color,
                      }}>{plan.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--gray)', fontStyle: 'italic' }}>
                        {plan.tagline}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 60, fontWeight: 900, lineHeight: 1,
                        color: plan.color,
                      }}>
                        ${billing === 'annual' ? plan.price : plan.monthly}
                      </span>
                      <span style={{ color: 'var(--gray)', fontSize: 16 }}>
                        {billing === 'annual' ? '/year' : '/month'}
                      </span>
                    </div>
                    {billing === 'monthly' && (
                      <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 4 }}>
                        Or ${plan.price}/year — save ${Math.round(plan.monthly * 12 - plan.price)}/yr
                      </div>
                    )}
                  </div>

                  {/* Visits */}
                  <div style={{
                    background: plan.colorLight,
                    border: `1px solid ${plan.border}`,
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: 13, color: plan.color,
                    fontWeight: 600, marginBottom: 24,
                  }}>
                    📅 {plan.visits}
                  </div>

                  {/* Features */}
                  <ul className="check-list" style={{ marginBottom: 24 }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ color: 'rgba(255,255,255,0.85)' }}>{f}</li>
                    ))}
                    {plan.notIncluded.map((f, i) => (
                      <li key={`x${i}`} style={{
                        color: 'var(--gray)', opacity: 0.6,
                      }}>
                        <span style={{ marginRight: 8, opacity: 0.4 }}>✗</span>{f}
                      </li>
                    ))}
                  </ul>

                  {/* Value callout */}
                  <div style={{
                    background: 'rgba(46,125,50,0.1)',
                    border: '1px solid rgba(46,125,50,0.3)',
                    borderRadius: 10, padding: '10px 14px',
                    textAlign: 'center', marginBottom: 20,
                    fontSize: 13,
                  }}>
                    <span style={{ color: '#66BB6A', fontWeight: 600 }}>
                      Estimated value: <strong style={{ fontSize: 18 }}>{plan.value}</strong>
                      {' '}for only ${plan.price}
                    </span>
                  </div>

                  {/* CTA */}
                  <a href={PHONE_EN_HREF} className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'}`}
                    style={{ width: '100%', justifyContent: 'center', borderColor: plan.color,
                             color: plan.highlight ? 'var(--navy)' : plan.color,
                             background: plan.highlight ? plan.color : 'transparent' }}>
                    Join {plan.name.split(' ')[2] || plan.name} Plan
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section-light">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Side by Side</div>
            <h2 className="display-md" style={{ color: 'var(--navy)' }}>Plan Comparison</h2>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 16, boxShadow: 'var(--shadow-md)' }}>
            <table style={{
              width: '100%', borderCollapse: 'collapse',
              fontFamily: 'var(--font-body)', fontSize: 14,
              background: 'white',
            }}>
              <thead>
                <tr style={{ background: 'var(--navy)' }}>
                  <th style={{ padding: '16px 20px', textAlign: 'left', color: 'var(--gray)' }}>Benefit</th>
                  {['🥈 Silver','⭐ Gold','💎 Platinum'].map((h, i) => (
                    <th key={i} style={{
                      padding: '16px 20px', textAlign: 'center',
                      color: ['#78909C','var(--gold)','#00ACC1'][i],
                      fontFamily: 'var(--font-display)',
                      fontSize: 16, fontWeight: 800, textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(([label, ...vals], ri) => (
                  <tr key={ri} style={{ background: ri % 2 === 0 ? 'white' : '#F8FAFC' }}>
                    <td style={{
                      padding: '13px 20px', fontWeight: 500,
                      color: 'var(--navy)',
                      borderBottom: '1px solid #F0F0F0',
                    }}>{label}</td>
                    {vals.map((v, vi) => (
                      <td key={vi} style={{
                        padding: '13px 20px', textAlign: 'center',
                        color: v === '—' ? '#CCCCCC' : vi === 1 ? '#B45309' : 'var(--navy)',
                        fontWeight: vi === 1 ? 700 : 400,
                        borderBottom: '1px solid #F0F0F0',
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
      <section style={{ background:'var(--navy-mid)', padding:'64px 0', textAlign:'center' }}>
        <div className="container">
          <h2 className="display-lg" style={{ marginBottom: 20 }}>Ready to Join?</h2>
          <p className="lead" style={{ maxWidth: 480, margin: '0 auto 32px' }}>
            Call us and we'll get you set up before we leave your driveway.
            Most members are enrolled in under 5 minutes.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={PHONE_EN_HREF} className="btn btn-primary btn-lg">
              📞 Call {PHONE_EN}
            </a>
            <Link to="/contact" className="btn btn-outline btn-lg">
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
