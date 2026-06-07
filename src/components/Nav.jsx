import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PHONE_EN = '352-484-6341';
const PHONE_ES = '407-963-8544';
const PHONE_EN_HREF = 'tel:+13524846341';

export default function Nav({ menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const links = [
    { to: '/',         label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/club',     label: 'Air-Care Club' },
    { to: '/about',    label: 'About' },
    { to: '/contact',  label: 'Contact' },
    { to: '/aire-azul',label: '🇪🇸 Español' },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled
          ? 'rgba(11,29,58,0.97)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 72,
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg, #1565C0, #00ACC1)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
              boxShadow: '0 4px 16px rgba(21,101,192,0.4)',
            }}>❄️</div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800, fontSize: 20,
                letterSpacing: 1,
                textTransform: 'uppercase',
                lineHeight: 1,
                color: 'var(--white)',
              }}>Air-Care Connect</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9, letterSpacing: 2,
                color: 'var(--cyan)', textTransform: 'uppercase',
                lineHeight: 1, marginTop: 2,
              }}>Ocala & Central Florida</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}
               className="desktop-nav">
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontFamily: 'var(--font-display)',
                fontSize: 15, fontWeight: 600,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                color: isActive(l.to) ? 'var(--gold)' : 'rgba(255,255,255,0.85)',
                background: isActive(l.to) ? 'rgba(249,168,37,0.1)' : 'transparent',
                transition: 'all 0.2s',
                borderBottom: isActive(l.to) ? '2px solid var(--gold)' : '2px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive(l.to)) e.target.style.color = 'white'; }}
              onMouseLeave={e => { if (!isActive(l.to)) e.target.style.color = 'rgba(255,255,255,0.85)'; }}
              >{l.label}</Link>
            ))}
            <a href={PHONE_EN_HREF} className="btn btn-primary btn-sm" style={{ marginLeft: 8 }}>
              📞 {PHONE_EN}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="mobile-menu-btn"
            style={{
              background: 'none', border: 'none',
              color: 'white', fontSize: 28, padding: 8,
              display: 'none',
            }}
            aria-label="Menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'var(--navy)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        padding: '100px 32px 40px',
        gap: 8,
      }}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32, fontWeight: 800,
            textTransform: 'uppercase',
            color: isActive(l.to) ? 'var(--gold)' : 'rgba(255,255,255,0.9)',
            padding: '12px 0',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            letterSpacing: 1,
          }}>{l.label}</Link>
        ))}
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a href={PHONE_EN_HREF} className="btn btn-primary">
            📞 English: {PHONE_EN}
          </a>
          <a href="tel:+14079638544" className="btn btn-outline">
            📞 Español: {PHONE_ES}
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
