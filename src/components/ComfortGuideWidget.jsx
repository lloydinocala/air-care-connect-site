import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Same publishable Supabase project the quote app writes leads to —
// keeping all leads in one table regardless of which surface they came from.
const SUPABASE_URL = "https://dalertxugwgkfsyizmly.supabase.co";
const SUPABASE_KEY = "sb_publishable_nPaxXCiHyZkO8MkRsz-1Zw_ZgPBlybk";

const NAVY = '#1B3A6B';
const SKY = '#4DB8E8';
const SKY_PALE = '#E8F6FC';
const WHITE = '#FFFFFF';
const GRAY_LT = '#EEF2F5';
const GRAY_DK = '#4A5568';

const QUOTE_APP_URL = 'https://systemestimate.air-careconnect.com';

// ── Page → context label + default language ──────────────────────────────
function getPageContext(pathname) {
  const map = {
    '/': 'Browsing the homepage',
    '/services': 'Viewing the Services page (AC Repair, 21-Point Tune-Up, System Replacement, Indoor Air Quality)',
    '/club': 'Viewing the Air-Care Club membership page',
    '/about': 'Viewing the About page',
    '/contact': 'Viewing the Contact page',
    '/aire-azul': 'Viewing the Aire Azul (Spanish-language) page',
  };
  return map[pathname] || `Browsing the site (path: ${pathname})`;
}

function getDefaultLang(pathname) {
  return pathname.startsWith('/aire-azul') ? 'es' : 'en';
}

// ── System prompts ─────────────────────────────────────────────────────────
function buildSystemPrompt(lang, pageContext) {
  if (lang === 'es') {
    return `Eres el Guía de Confort — un asesor virtual cálido y conocedor para Aire Azul (la línea de servicio en español de Air-Care Connect), una empresa de HVAC con licencia y seguro que atiende los condados de Marion, Lake, Sumter, Levy, Citrus y Alachua además de The Villages en el Centro de Florida.

TU ROL: Ayudar a los visitantes del sitio web a obtener respuestas rápidas y honestas sobre reparación, mantenimiento, reemplazo de HVAC, y la membresía Air-Care Club — y guiarlos al siguiente paso correcto. No eres un vendedor. No eres la herramienta de cotización en sí.

CONTEXTO ACTUAL DEL VISITANTE: ${pageContext}

LO QUE OFRECE ESTE SITIO:
- Reparación de AC: servicio el mismo día disponible, precio claro antes de empezar el trabajo
- Mantenimiento de 21 Puntos: inspección completa, reporte escrito después de cada visita, incluido en todos los planes del Club
- Reemplazo de Sistema: una herramienta separada de Cotización Instantánea da un precio real y garantizado en unos 60 segundos, sin necesidad de vendedor — ver "LA APP DE COTIZACIÓN INSTANTÁNEA" abajo
- Calidad del Aire Interior: filtros mejorados (MERV 8/11/13), luces UV germicidas, deshumidificación de toda la casa
- Membresía Air-Care Club (3 niveles): Silver ($169/año o $14.99/mes, 2 mantenimientos al año, 10% de descuento en reparaciones), Gold ($249/año o $21.99/mes, 2 mantenimientos + 1 revisión de confort, 15% de descuento, el más popular), Platinum ($399/año o $35.99/mes, prioridad VIP el mismo día, 20% de descuento, nunca cargo por visita de servicio)

LA APP DE COTIZACIÓN INSTANTÁNEA (esto es lo principal que debes promover — es el camino más rápido para cualquiera que considere un sistema nuevo):
- Una herramienta separada en systemestimate.air-careconnect.com
- Da un precio real e instalado, garantizado, en unos 60 segundos, basado en la casa real del cliente
- Sin llamada de vendedor, sin visita obligatoria al hogar
- Muestra varias marcas y niveles de precio, especificaciones completas del equipo, y opciones de financiamiento (tarjeta, transferencia ACH, financiamiento sin enganche con FTL o Microf)
- Garantía de precio por 45 días
- ESTO es lo que debes recomendar a cualquiera que pregunte cuánto cuesta un sistema nuevo

REGLAS:
- NUNCA cotices un precio específico para nada — ni una reparación, ni un mantenimiento, ni un sistema nuevo. Para reemplazo, siempre dirige a la app de Cotización Instantánea. Para reparaciones o mantenimiento, di que el precio depende del problema específico y ofrece que alguien del equipo los contacte.
- Mantente estrictamente en el tema: HVAC, los servicios de esta empresa, la app de cotización, la membresía, el área de servicio, y cómo contactarnos. Declina cortésmente temas no relacionados.
- Responde en el idioma que use el visitante. Si no está claro, responde en español ya que están en esta página.
- Respuestas conversacionales y breves — 2 a 4 oraciones generalmente.
- Nunca seas insistente. Tu trabajo es informar y orientar, no cerrar una venta.

CUANDO ALGUIEN QUIERE QUE LE LLAMEN (para reparaciones, mantenimiento, o cualquier cosa fuera del flujo de cotización instantánea):
1. Recopila su nombre y número de teléfono (requerido), correo opcional, y una breve razón si la ofrecen
2. Una vez que tengas nombre + teléfono Y hayan confirmado, usa la herramienta request_callback
3. Sé honesto: esto crea una solicitud para que un miembro real del equipo les llame — nada se programa automáticamente todavía`;
  }

  return `You are the Comfort Guide — a warm, knowledgeable virtual advisor for Air-Care Connect, a licensed and insured HVAC company serving Marion, Lake, Sumter, Levy, Citrus, and Alachua Counties plus The Villages in Central Florida.

YOUR ROLE: Help website visitors get quick, honest answers about HVAC repair, maintenance, replacement, and the Air-Care Club membership — and point them to the right next step. You are not a salesperson. You are not the quoting tool itself.

CURRENT VISITOR CONTEXT: ${pageContext}

WHAT THIS WEBSITE OFFERS:
- AC Repair: same-day service available, upfront pricing before work starts, no overtime charges for Club members
- 21-Point Maintenance Tune-Up: full inspection protocol, written report after every visit, included in all Club plans
- System Replacement: a separate Instant Quote tool gives a real, guaranteed price in about 60 seconds, no salesperson required — see "THE INSTANT QUOTE APP" below
- Indoor Air Quality: filtration upgrades (MERV 8/11/13), UV germicidal lights, whole-home dehumidification, duct cleaning assessment
- Air-Care Club membership (3 tiers): Silver ($169/yr or $14.99/mo, 2 tune-ups/year, 10% repair discount), Gold ($249/yr or $21.99/mo, 2 tune-ups + 1 comfort check, 15% repair discount, most popular), Platinum ($399/yr or $35.99/mo, same-day VIP priority, 20% repair discount, no service call fee ever)
- Aire Azul: full Spanish-language service line — same company, same technicians, same guarantees

THE INSTANT QUOTE APP (this is the main thing to promote — it's the best, fastest path for anyone considering a new system):
- A separate tool at systemestimate.air-careconnect.com
- Gives a real, guaranteed installed price in about 60 seconds, based on the customer's actual home
- No salesperson call, no in-home visit required
- Shows multiple brand/price tiers, full equipment specs, and financing options (card, ACH, 0%-down financing through FTL or Microf)
- 45-day price guarantee once quoted
- THIS is what you should point anyone toward who asks how much a new system costs, or anything about replacement pricing

GUARDRAILS:
- NEVER quote a specific price for anything — not a repair, not a tune-up, not a new system. For replacement pricing specifically, always point to the Instant Quote app. For repairs/tune-ups/IAQ, say pricing depends on the specific issue and offer to have a team member reach out.
- Stay strictly on topic: HVAC, this company's services, the instant quote app, membership, service area, and how to get in touch. Politely decline unrelated topics.
- Respond in whichever language the visitor writes in. If unclear, default to English since they're on an English-language page.
- Keep responses conversational and brief — 2-4 sentences usually.
- Never be pushy. Your job is to inform and point people in the right direction, not close a sale.

WHEN SOMEONE WANTS A CALLBACK (for repairs, tune-ups, or anything outside the instant-quote replacement flow):
1. Collect their name and phone number (required), email optional, and a one-line reason if they offer it
2. Once you have name + phone AND they've confirmed, use the request_callback tool
3. Be honest: this creates a request for a real team member to call back — nothing is automatically scheduled yet`;
}

const WELCOME = {
  en: "Hi! I'm your Comfort Guide. Ask me about repairs, maintenance, a new system, or our Club membership — or I can point you to our Instant Quote tool for real replacement pricing in 60 seconds.",
  es: "¡Hola! Soy tu Guía de Confort. Pregúntame sobre reparaciones, mantenimiento, un sistema nuevo, o la membresía del Club — o te puedo dirigir a nuestra herramienta de Cotización Instantánea para un precio real en 60 segundos.",
};

const PLACEHOLDER = { en: 'Ask me anything...', es: 'Pregúntame lo que sea...' };
const SEND_LABEL = { en: 'Send', es: 'Enviar' };
const THINKING = { en: 'Thinking...', es: 'Pensando...' };
const TITLE = { en: 'Comfort Guide', es: 'Guía de Confort' };
const QUOTE_CTA = { en: '⚡ Get Instant Quote', es: '⚡ Cotización Instantánea' };

export default function ComfortGuideWidget() {
  const location = useLocation();
  const defaultLang = getDefaultLang(location.pathname);

  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState(defaultLang);
  const [msgs, setMsgs] = useState([{ role: 'assistant', content: WELCOME[defaultLang] }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [calloutDismissed, setCalloutDismissed] = useState(false);
  const endRef = useRef(null);
  const initializedLang = useRef(defaultLang);

  // Re-sync default language only on first load per page-language-zone change,
  // without clobbering a conversation already in progress.
  useEffect(() => {
    if (!open && msgs.length === 1 && initializedLang.current !== defaultLang) {
      initializedLang.current = defaultLang;
      setLang(defaultLang);
      setMsgs([{ role: 'assistant', content: WELCOME[defaultLang] }]);
    }
  }, [defaultLang, open, msgs.length]);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  const requestCallback = async (name, phone, email, notes) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({
          lead_type: 'home_visit_request',
          property_address: null,
          customer_name: name,
          customer_email: email || null,
          customer_phone: phone,
          notes: `[Marketing site chat] ${notes || ''}`.trim(),
          language: lang,
          lead_status: 'new',
          organization_id: 1,
        }),
      });
    } catch (e) { console.warn('Lead save error:', e); }

    try {
      await fetch('/api/send-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'info@air-careconnect.com',
          subject: `New Callback Request (Website Chat) - ${name}`,
          htmlContent: `
            <div style="font-family: sans-serif; max-width: 480px;">
              <h2 style="color: ${NAVY};">New Callback Request — Marketing Site</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
              ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
              <p style="color:#64748b; font-size:13px;">Submitted via Comfort Guide on the marketing website — pursue as a lead.</p>
            </div>`,
        }),
      });
    } catch (e) { console.warn('Office notification email error:', e); }
  };

  const send = async () => {
    if (!input.trim() || busy) return;
    const next = [...msgs, { role: 'user', content: input.trim() }];
    setMsgs(next); setInput(''); setBusy(true);

    try {
      const sys = buildSystemPrompt(lang, getPageContext(location.pathname));
      const r = await fetch('/api/comfort-guide', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: sys,
          messages: next.map(m => ({ role: m.role, content: m.content })),
          tools: [{
            name: 'request_callback',
            description: "Call this ONLY once you have the visitor's name AND phone number, AND they have clearly confirmed they want a team member to call them back. Do not call this if name or phone is missing or unconfirmed.",
            input_schema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: "Visitor's full name" },
                phone: { type: 'string', description: 'Phone number for callback' },
                email: { type: 'string', description: 'Email address - optional' },
                notes: { type: 'string', description: 'Brief reason for the callback request, if shared' },
              },
              required: ['name', 'phone'],
            },
          }],
        }),
      });
      const d = await r.json();

      if (d.toolUse?.name === 'request_callback') {
        const { name, phone, email, notes } = d.toolUse.input;
        setMsgs(p => [...p, { role: 'assistant', content: d.text || (lang === 'es' ? 'Perfecto, enviando su solicitud...' : 'Perfect, sending your request...') }]);
        await requestCallback(name, phone, email, notes);
        setMsgs(p => [...p, { role: 'assistant', content: lang === 'es'
          ? `✅ ¡Listo! Un miembro de nuestro equipo le llamará pronto al ${phone}.`
          : `✅ Done! A team member will call you at ${phone} soon.` }]);
      } else if (d.text) {
        setMsgs(p => [...p, { role: 'assistant', content: d.text }]);
      } else {
        setMsgs(p => [...p, { role: 'assistant', content: lang === 'es' ? 'Tuve un problema conectando — intenta de nuevo.' : "I'm having trouble connecting — please try again in a moment." }]);
      }
    } catch (err) {
      console.error('Comfort Guide fetch error:', err);
      setMsgs(p => [...p, { role: 'assistant', content: lang === 'es' ? 'Problema de conexión — intenta de nuevo.' : 'Connection issue — please try again.' }]);
    }
    setBusy(false);
  };

  return (
    <>
      {/* Floating launcher button */}
      {!open && (
        <button
          onClick={() => { setOpen(true); setCalloutDismissed(true); }}
          aria-label={TITLE[lang]}
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 999,
            display: 'flex', alignItems: 'center', gap: 10,
            background: NAVY, color: WHITE, border: `2px solid ${WHITE}`,
            borderRadius: 999, padding: '14px 20px',
            boxShadow: '0 8px 24px rgba(27,58,107,0.35)',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
            cursor: 'pointer',
          }}
        >
          <span style={{
            width: 28, height: 28, borderRadius: '50%', background: SKY,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
          }}>🧑‍💼</span>
          {TITLE[lang]}
          {!calloutDismissed && (
            <span style={{
              position: 'absolute', top: -4, right: -4, width: 14, height: 14,
              borderRadius: '50%', background: '#F9A825', border: `2px solid ${WHITE}`,
            }} />
          )}
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="cg-widget-panel" style={{
          position: 'fixed', zIndex: 1000, background: SKY_PALE,
          display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)',
          boxShadow: '0 16px 48px rgba(27,58,107,0.30)', overflow: 'hidden',
        }}>
          <div style={{
            background: NAVY, color: WHITE, padding: '16px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 36, height: 36, borderRadius: '50%', background: SKY,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
                border: `2px solid ${WHITE}`,
              }}>🧑‍💼</span>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{TITLE[lang]}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => setLang(l => l === 'en' ? 'es' : 'en')} style={{
                background: 'rgba(255,255,255,0.15)', border: `1px solid ${WHITE}`, color: WHITE,
                borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-display)',
              }}>{lang === 'en' ? 'ES' : 'EN'}</button>
              <button onClick={() => setOpen(false)} aria-label="Close" style={{
                background: 'rgba(255,255,255,0.15)', border: `1px solid ${WHITE}`, color: WHITE,
                borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 14, fontWeight: 700,
              }}>✕</button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', background: m.role === 'user' ? SKY : WHITE,
                  color: m.role === 'user' ? WHITE : NAVY,
                  border: m.role === 'user' ? `1.5px solid ${SKY}` : `1.5px solid ${GRAY_LT}`,
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '9px 13px', fontSize: 14, lineHeight: 1.55, fontWeight: 500,
                  boxShadow: '0 1px 4px rgba(27,58,107,0.08)',
                }}>{m.content}</div>
              </div>
            ))}
            {busy && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  background: WHITE, border: `1.5px solid ${GRAY_LT}`, borderRadius: '16px 16px 16px 4px',
                  padding: '9px 14px', fontSize: 13, color: SKY, fontWeight: 600,
                }}>{THINKING[lang]}</div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div style={{ padding: '10px 14px', borderTop: `1px solid ${GRAY_LT}`, background: WHITE }}>
            <a href={QUOTE_APP_URL} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', textAlign: 'center', background: SKY, color: WHITE,
              borderRadius: 999, padding: '9px 0', fontFamily: 'var(--font-display)',
              fontWeight: 700, fontSize: 13, textDecoration: 'none',
            }}>{QUOTE_CTA[lang]}</a>
          </div>

          <div style={{ padding: '10px 14px 14px', background: WHITE, borderTop: `1px solid ${GRAY_LT}`, display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={PLACEHOLDER[lang]}
              style={{
                flex: 1, border: `1.5px solid ${SKY}`, borderRadius: 999, padding: '9px 14px',
                fontSize: 14, outline: 'none', color: NAVY, fontWeight: 500, fontFamily: 'var(--font-body)',
              }}
            />
            <button onClick={send} disabled={busy || !input.trim()} style={{
              background: NAVY, color: WHITE, border: 'none', borderRadius: 999, padding: '9px 18px',
              fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-display)',
              opacity: busy || !input.trim() ? 0.5 : 1,
            }}>{SEND_LABEL[lang]}</button>
          </div>
        </div>
      )}
    </>
  );
}
