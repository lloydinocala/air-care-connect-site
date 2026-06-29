// Vercel Serverless Function — Emails Air-Care Club agreement PDF(s) to a
// prospective member, with an "Enroll & Pay" link per plan (Stripe Payment
// Link, configured via env vars). Also logs the request as a lead and
// notifies the office by email.

const SITE_URL = 'https://www.air-careconnect.com';
const OFFICE_EMAIL = 'info@air-careconnect.com';
const SUPABASE_URL = 'https://dalertxugwgkfsyizmly.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nPaxXCiHyZkO8MkRsz-1Zw_ZgPBlybk';

const PLAN_INFO = {
  en: {
    silver: { name: 'Air-Care Silver', file: 'AirCare_Silver_Membership_Agreement.pdf', price: '$189/year' },
    gold: { name: 'Air-Care Gold', file: 'AirCare_Gold_Membership_Agreement.pdf', price: '$249/year' },
    platinum: { name: 'Air-Care Platinum', file: 'AirCare_Platinum_Membership_Agreement.pdf', price: '$399/year' },
  },
  es: {
    silver: { name: 'Club Aire Azul Plata', file: 'ClubAireAzul_Plata_Acuerdo_Membresia.pdf', price: '$189/a\u00f1o' },
    gold: { name: 'Club Aire Azul Oro', file: 'ClubAireAzul_Oro_Acuerdo_Membresia.pdf', price: '$249/a\u00f1o' },
    platinum: { name: 'Club Aire Azul Platino', file: 'ClubAireAzul_Platino_Acuerdo_Membresia.pdf', price: '$399/a\u00f1o' },
  },
};

// Stripe Payment Links — same checkout regardless of language (set these in
// Vercel once created in Stripe; see setup notes provided separately).
const STRIPE_LINKS = {
  silver: process.env.STRIPE_LINK_SILVER || null,
  gold: process.env.STRIPE_LINK_GOLD || null,
  platinum: process.env.STRIPE_LINK_PLATINUM || null,
};

const STRINGS = {
  en: {
    subject: (n) => `Your Air-Care Club Agreement${n > 1 ? 's' : ''}`,
    greeting: 'Thanks for your interest in the Air-Care Club! Here\u2019s what you asked for:',
    viewBtn: 'View Agreement (PDF)',
    enrollBtn: 'Enroll & Pay \u2192',
    closing: 'Questions about any plan? Call or text us at 352-484-6341 \u2014 we\u2019re happy to help you choose.',
    sign: 'Air-Care Connect',
  },
  es: {
    subject: (n) => `Su${n > 1 ? 's' : ''} Acuerdo${n > 1 ? 's' : ''} del Club Aire Azul`,
    greeting: '\u00a1Gracias por su inter\u00e9s en el Club Aire Azul! Aqu\u00ed tiene lo que solicit\u00f3:',
    viewBtn: 'Ver Acuerdo (PDF)',
    enrollBtn: 'Inscribirse y Pagar \u2192',
    closing: '\u00bfPreguntas sobre alg\u00fan plan? Llame o env\u00ede un mensaje de texto al 407-963-8544 \u2014 con gusto le ayudamos a elegir.',
    sign: 'Aire Azul',
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'quotes@air-careconnect.com';
  const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Air-Care Connect';

  if (!SENDGRID_API_KEY) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const { email, plans, language } = req.body;
    const lang = language === 'es' ? 'es' : 'en';
    const t = STRINGS[lang];
    const info = PLAN_INFO[lang];

    if (!email || !Array.isArray(plans) || plans.length === 0) {
      return res.status(400).json({ error: 'Email and at least one plan are required' });
    }
    const validPlans = plans.filter((p) => info[p]);
    if (validPlans.length === 0) {
      return res.status(400).json({ error: 'No valid plans provided' });
    }

    const planBlocks = validPlans.map((key) => {
      const p = info[key];
      const pdfUrl = `${SITE_URL}/agreements/${p.file}`;
      const stripeUrl = STRIPE_LINKS[key];
      return `
        <div style="border:1px solid #EEF2F5; border-radius:12px; padding:20px; margin-bottom:16px;">
          <div style="font-weight:700; font-size:17px; color:#1B3A6B; margin-bottom:4px;">${p.name}</div>
          <div style="color:#4A5568; font-size:14px; margin-bottom:14px;">${p.price}</div>
          <a href="${pdfUrl}" style="display:inline-block; padding:10px 18px; border:2px solid #1B3A6B; border-radius:8px; color:#1B3A6B; text-decoration:none; font-weight:600; font-size:14px; margin-right:10px;">${t.viewBtn}</a>
          ${stripeUrl ? `<a href="${stripeUrl}" style="display:inline-block; padding:10px 18px; background:#1B3A6B; border-radius:8px; color:#ffffff; text-decoration:none; font-weight:600; font-size:14px;">${t.enrollBtn}</a>` : ''}
        </div>`;
    }).join('');

    const html = `
      <div style="font-family: sans-serif; max-width: 520px;">
        <p style="font-size:15px; color:#1A1A2E;">${t.greeting}</p>
        ${planBlocks}
        <p style="font-size:13px; color:#64748b; margin-top:20px;">${t.closing}</p>
        <p style="font-size:13px; color:#64748b;">\u2014 ${t.sign}</p>
      </div>`;

    // Send the email
    let customerEmailSent = false;
    try {
      const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email }] }],
          from: { email: FROM_EMAIL, name: FROM_NAME },
          subject: t.subject(validPlans.length),
          content: [{ type: 'text/html', value: html }],
        }),
      });
      if (r.ok) {
        customerEmailSent = true;
      } else {
        const errText = await r.text();
        console.error('SendGrid error:', errText);
        return res.status(502).json({ error: `Email provider rejected the request: ${errText}` });
      }
    } catch (e) {
      console.error('Customer email error:', e);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Notify the office
    try {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: OFFICE_EMAIL }] }],
          from: { email: FROM_EMAIL, name: FROM_NAME },
          subject: `\ud83d\udcc4 Club agreement request \u2014 ${email}`,
          content: [{ type: 'text/html', value: `
            <div style="font-family:sans-serif;">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Plans requested:</strong> ${validPlans.map((k) => info[k].name).join(', ')}</p>
              <p><strong>Language:</strong> ${lang === 'es' ? 'Spanish' : 'English'}</p>
            </div>` }],
        }),
      });
    } catch (e) { console.error('Office notify error:', e); }

    // Log as a lead for follow-up
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({
          lead_type: 'club_document_request',
          customer_email: email,
          notes: `[Marketing site] Requested Club agreement(s): ${validPlans.map((k) => info[k].name).join(', ')}`,
          language: lang,
          lead_status: 'new',
          organization_id: 1,
        }),
      });
    } catch (e) { console.warn('Lead save error:', e); }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('send-agreement-docs error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
