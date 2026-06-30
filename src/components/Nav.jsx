import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PHONE_EN = '352-484-6341';
const PHONE_EN_HREF = 'tel:+13524846341';
const PHONE_ES = '407-963-8544';
const PHONE_ES_HREF = 'tel:+14079638544';
const TERRA = '#E07A5F';

// Maps each English route to its Spanish twin and vice versa, so the
// language switcher lands on the SAME topic instead of always bouncing
// back to a homepage.
const ES_FOR_EN = {
  '/': '/aire-azul',
  '/services': '/aire-azul/services',
  '/club': '/aire-azul/club',
  '/club/documents': '/aire-azul/documentos',
  '/about': '/aire-azul/about',
  '/contact': '/aire-azul/contact',
};
const EN_FOR_ES = Object.fromEntries(Object.entries(ES_FOR_EN).map(([en, es]) => [es, en]));

const EN_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/club', label: 'Air-Care Club' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const ES_LINKS = [
  { to: '/aire-azul', label: 'Inicio' },
  { to: '/aire-azul/services', label: 'Servicios' },
  { to: '/aire-azul/club', label: 'Club Aire Azul' },
  { to: '/aire-azul/about', label: 'Nosotros' },
  { to: '/aire-azul/contact', label: 'Contacto' },
];

export default function Nav({ menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isSpanish = location.pathname.startsWith('/aire-azul');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); window.scrollTo(0, 0); }, [location.pathname]);

  const links = isSpanish ? ES_LINKS : EN_LINKS;
  const accent = isSpanish ? TERRA : '#4DB8E8';
  const phone = isSpanish ? PHONE_ES : PHONE_EN;
  const phoneHref = isSpanish ? PHONE_ES_HREF : PHONE_EN_HREF;

  // Where the language-switch link should go: the matching page in the
  // other language if we have a mapping for it, otherwise that language's
  // homepage as a safe fallback.
  const switchTo = isSpanish
    ? (EN_FOR_ES[location.pathname] || '/')
    : (ES_FOR_EN[location.pathname] || '/aire-azul');
  const switchLabel = isSpanish ? '🇺🇸 English' : '🇪🇸 Español';

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? `1px solid ${isSpanish ? 'rgba(224,122,95,0.2)' : 'rgba(77,184,232,0.2)'}` : `1px solid ${isSpanish ? 'rgba(224,122,95,0.1)' : 'rgba(77,184,232,0.1)'}`,
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
          <Link to={isSpanish ? '/aire-azul' : '/'} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 42, height: 42,
              background: isSpanish
                ? 'linear-gradient(135deg, #E07A5F, #1B3A6B)'
                : 'linear-gradient(135deg, #4DB8E8, #1B3A6B)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
              boxShadow: isSpanish ? '0 4px 12px rgba(224,122,95,0.3)' : '0 4px 12px rgba(77,184,232,0.3)',
            }}>❄️</div>
            <div>
              <div style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800, fontSize: 18,
                color: '#1B3A6B',
                lineHeight: 1,
              }}>{isSpanish ? 'Aire Azul' : 'Air-Care Connect'}</div>
              <div style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 10, letterSpacing: 2,
                color: accent, textTransform: 'uppercase',
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
                color: isActive(l.to) ? accent : '#4A5568',
                background: isActive(l.to) ? (isSpanish ? 'rgba(224,122,95,0.08)' : 'rgba(77,184,232,0.08)') : 'transparent',
                transition: 'all 0.2s',
                borderBottom: isActive(l.to) ? `2px solid ${accent}` : '2px solid transparent',
              }}>{l.label}</Link>
            ))}
            <Link to={switchTo} style={{
              padding: '6px 14px', borderRadius: 8,
              fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 600,
              color: '#4A5568', marginLeft: 4,
            }}>{switchLabel}</Link>
            <a href={phoneHref} className="btn btn-navy btn-sm" style={{ marginLeft: 12, borderRadius: 8, background: isSpanish ? TERRA : undefined, borderColor: isSpanish ? TERRA : undefined }}>
              📞 {phone}
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
            color: isActive(l.to) ? accent : '#1B3A6B',
            padding: '14px 0',
            borderBottom: '1px solid #EEF2F5',
          }}>{l.label}</Link>
        ))}
        <Link to={switchTo} style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: 24, fontWeight: 700,
          color: '#1B3A6B',
          padding: '14px 0',
          borderBottom: '1px solid #EEF2F5',
        }}>{switchLabel}</Link>
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a href={phoneHref} className="btn btn-navy" style={{ background: isSpanish ? TERRA : undefined, borderColor: isSpanish ? TERRA : undefined }}>
            📞 {phone}
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
