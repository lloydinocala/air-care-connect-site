import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PHONE_EN = '352-484-6341';
const PHONE_EN_HREF = 'tel:+13524846341';
const PHONE_ES = '407-963-8544';

export default function Nav({ menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); window.scrollTo(0, 0); }, [location.pathname]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/club', label: 'Air-Care Club' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/aire-azul', label: '🇪🇸 Español' },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(77,184,232,0.2)' : '1px solid rgba(77,184,232,0.1)',
        boxShadow: scrolled ? '0 2px 20px rgba(27,58,107,0.08)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 70,
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 42, height: 42,
              background: 'linear-gradient(135deg, #4DB8E8, #1B3A6B)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
              boxShadow: '0 4px 12px rgba(77,184,232,0.3)',
            }}>❄️</div>
            <div>
              <div style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800, fontSize: 18,
                color: '#1B3A6B',
                lineHeight: 1,
              }}>Air-Care Connect</div>
              <div style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 10, letterSpacing: 2,
                color: '#4DB8E8', textTransform: 'uppercase',
                lineHeight: 1, marginTop: 2, fontWeight: 500,
              }}>Ocala & Central Florida</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="desktop-nav">
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontFamily: 'Poppins, sans-serif',
                fontSize: 14, fontWeight: 600,
                color: isActive(l.to) ? '#4DB8E8' : '#4A5568',
                background: isActive(l.to) ? 'rgba(77,184,232,0.08)' : 'transparent',
                transition: 'all 0.2s',
                borderBottom: isActive(l.to) ? '2px solid #4DB8E8' : '2px solid transparent',
              }}>{l.label}</Link>
            ))}
            <a href={PHONE_EN_HREF} className="btn btn-navy btn-sm" style={{ marginLeft: 12, borderRadius: 8 }}>
              📞 {PHONE_EN}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="mobile-menu-btn"
            style={{ background: 'none', border: 'none', color: '#1B3A6B', fontSize: 28, padding: 8, display: 'none' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'white',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        padding: '100px 32px 40px', gap: 4,
      }}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 24, fontWeight: 700,
            color: isActive(l.to) ? '#4DB8E8' : '#1B3A6B',
            padding: '14px 0',
            borderBottom: '1px solid #EEF2F5',
          }}>{l.label}</Link>
        ))}
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a href={PHONE_EN_HREF} className="btn btn-navy">📞 {PHONE_EN}</a>
          <a href="tel:+14079638544" className="btn btn-outline">📞 Español: {PHONE_ES}</a>
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
