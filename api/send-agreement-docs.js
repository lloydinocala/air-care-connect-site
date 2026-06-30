// Vercel Serverless Function — Emails Air-Care Club agreement PDF(s) to a
// prospective member with correct pricing for their chosen billing period
// (annual or monthly) and a dynamic "Enroll & Pay" checkout link per plan.

const SITE_URL = 'https://www.air-careconnect.com';
const OFFICE_EMAIL = 'info@air-careconnect.com';
const SUPABASE_URL = 'https://dalertxugwgkfsyizmly.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nPaxXCiHyZkO8MkRsz-1Zw_ZgPBlybk';

const PLAN_INFO = {
  en: {
    silver:   { name: 'Air-Care Silver',   file: 'AirCare_Silver_Membership_Agreement.pdf',     annual: '$189/year',  monthly: '$15.99/month' },
    gold:     { name: 'Air-Care Gold',     file: 'AirCare_Gold_Membership_Agreement.pdf',        annual: '$249/year',  monthly: '$21.99/month' },
    platinum: { name: 'Air-Care Platinum', file: 'AirCare_Platinum_Membership_Agreement.pdf',    annual: '$399/year',  monthly: '$35.99/month' },
  },
  es: {
    silver:   { name: 'Club Aire Azul Plata',   file: 'ClubAireAzul_Plata_Acuerdo_Membresia.pdf',   annual: '$189/año', monthly: '$15.99/mes' },
    gold:     { name: 'Club Aire Azul Oro',     file: 'ClubAireAzul_Oro_Acuerdo_Membresia.pdf',      annual: '$249/año', monthly: '$21.99/mes' },
    platinum: { name: 'Club Aire Azul Platino', file: 'ClubAireAzul_Platino_Acuerdo_Membresia.pdf',  annual: '$399/año', monthly: '$35.99/mes' },
  },
};

const STRINGS = {
  en: {
    subject:    (n) => `Your Air-Care Club Agreement${n > 1 ? 's' : ''}`,
    subjectSub: 'Your billing preference is saved in the enrollment link below.',
    greeting:   "Thanks for your interest in the Air-Care Club! Here\u2019s what you asked for:",
    billingNote: (b) => b === 'monthly' ? 'Monthly billing \u2014 cancel any time' : 'Annual billing \u2014 save vs. monthly',
    viewBtn:    'Review Agreement (PDF)',
    enrollBtn:  'Enroll & Pay \u2192',
    closing:    'Questions about any plan? Call or text us at 352-484-6341 \u2014 we\u2019re happy to help you choose.',
    sign:       'Air-Care Connect',
    officeSubject: (e) => `\uD83D\uDCC4 Club agreement request \u2014 ${e}`,
  },
  es: {
    subject:    (n) => `Su${n > 1 ? 's' : ''} Acuerdo${n > 1 ? 's' : ''} del Club Aire Azul`,
    subjectSub: 'Su preferencia de pago est\u00e1 guardada en el enlace de inscripci\u00f3n.',
    greeting:   '\u00a1Gracias por su inter\u00e9s en el Club Aire Azul! Aqu\u00ed tiene lo que solicit\u00f3:',
    billingNote: (b) => b === 'monthly' ? 'Pago mensual \u2014 cancele en cualquier momento' : 'Pago anual \u2014 ahorre vs. mensual',
    viewBtn:    'Revisar Acuerdo (PDF)',
    enrollBtn:  'Inscribirse y Pagar \u2192',
    closing:    '\u00bfPreguntas? Ll\u00e1menos al 407-963-8544 \u2014 con gusto le ayudamos a elegir.',
    sign:       'Aire Azul',
    officeSubject: (e) => `\uD83D\uDCC4 Solicitud de acuerdo Club \u2014 ${e}`,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'quotes@air-careconnect.com';
  const FROM_NAME  = process.env.SENDGRID_FROM_NAME  || 'Air-Care Connect';

  if (!SENDGRID_API_KEY) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const { email, plans, billing = 'annual', language } = req.body;
    const lang    = language === 'es' ? 'es' : 'en';
    const t       = STRINGS[lang];
    const info    = PLAN_INFO[lang];
    const billingPeriod = billing === 'monthly' ? 'monthly' : 'annual';

    if (!email || !Array.isArray(plans) || plans.length === 0) {
      return res.status(400).json({ error: 'Email and at least one plan are required' });
    }
    const validPlans = plans.filter((p) => info[p]);
    if (validPlans.length === 0) {
      return res.status(400).json({ error: 'No valid plans provided' });
    }

    // Build plan cards for the email
    const planBlocks = validPlans.map((key) => {
      const p = info[key];
      const price = billingPeriod === 'monthly' ? p.monthly : p.annual;
      const pdfUrl = `${SITE_URL}/agreements/${p.file}`;
      // Checkout link passes plan, billing period, and pre-fills their email
      const checkoutUrl = `${SITE_URL}/api/start-checkout?plan=${key}&billing=${billingPeriod}&email=${encodeURIComponent(email)}`;
      return `
        <div style="border:1px solid #EEF2F5; border-radius:12px; padding:20px 24px; margin-bottom:16px; background:#ffffff;">
          <div style="font-weight:800; font-size:17px; color:#1B3A6B; margin-bottom:4px;">${p.name}</div>
          <div style="color:#4A5568; font-size:14px; margin-bottom:4px;">${price}</div>
          <div style="font-size:12px; color:#8FA3B1; margin-bottom:16px; font-style:italic;">${t.billingNote(billingPeriod)}</div>
          <a href="${pdfUrl}"
             style="display:inline-block; padding:10px 18px; border:2px solid #1B3A6B; border-radius:8px; color:#1B3A6B; text-decoration:none; font-weight:600; font-size:14px; margin-right:10px; margin-bottom:8px;">
            ${t.viewBtn}
          </a>
          <a href="${checkoutUrl}"
             style="display:inline-block; padding:10px 18px; background:#1B3A6B; border-radius:8px; color:#ffffff; text-decoration:none; font-weight:600; font-size:14px; margin-bottom:8px;">
            ${t.enrollBtn}
          </a>
        </div>`;
    }).join('');

    const html = `
      <div style="font-family:sans-serif; max-width:520px; color:#1A1A2E;">
        <p style="font-size:15px; line-height:1.7;">${t.greeting}</p>
        ${planBlocks}
        <p style="font-size:13px; color:#64748b; margin-top:24px; line-height:1.7;">${t.closing}</p>
        <p style="font-size:13px; color:#64748b;">\u2014 ${t.sign}</p>
      </div>`;

    // Send to customer — this is the essential send; return an error if it fails
    const customerSend = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject: t.subject(validPlans.length),
        content: [{ type: 'text/html', value: html }],
      }),
    });
    if (!customerSend.ok) {
      const errText = await customerSend.text();
      console.error('SendGrid customer error:', errText);
      return res.status(502).json({ error: `Email provider error: ${errText}` });
    }

    // Notify the office — best effort, don't fail the request if this errors
    try {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: OFFICE_EMAIL }] }],
          from: { email: FROM_EMAIL, name: FROM_NAME },
          subject: t.officeSubject(email),
          content: [{ type: 'text/html', value: `
            <div style="font-family:sans-serif;">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Plans requested:</strong> ${validPlans.map((k) => info[k].name).join(', ')}</p>
              <p><strong>Billing preference:</strong> ${billingPeriod}</p>
              <p><strong>Language:</strong> ${lang === 'es' ? 'Spanish' : 'English'}</p>
            </div>` }],
        }),
      });
    } catch (e) { console.error('Office notify error:', e); }

    // Log as a lead for follow-up — best effort
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({
          lead_type: 'club_document_request',
          customer_email: email,
          notes: `[Marketing site] Requested Club agreement(s): ${validPlans.map((k) => info[k].name).join(', ')}. Billing: ${billingPeriod}.`,
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
