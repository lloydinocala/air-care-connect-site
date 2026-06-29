// Vercel Serverless Function — Confirms a self-booked service call
// Fires right after the booking is saved to Supabase. Sends:
//   1. A confirmation text (and email, if given) to the CUSTOMER
//   2. A notification text + email to the OFFICE
//
// The office text always goes to TWILIO_NOTIFY_TO (never a client-supplied
// number) — only the customer-confirmation side uses the phone/email the
// customer themselves just typed into the booking form.

const OFFICE_EMAIL = 'info@air-careconnect.com';
const OFFICE_PHONE_DISPLAY = '352-484-6341';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'quotes@air-careconnect.com';
  const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Air-Care Connect';
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;
  const TWILIO_NOTIFY_TO = process.env.TWILIO_NOTIFY_TO;

  try {
    const { name, phone, email, address, issue, date, slot, notes } = req.body;

    if (!name || !phone || !address || !date || !slot) {
      return res.status(400).json({ error: 'Missing required booking details' });
    }

    const prettyDate = new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });

    const sendEmail = async (to, subject, html) => {
      if (!SENDGRID_API_KEY || !to) return;
      try {
        const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: { Authorization: `Bearer ${SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: to }] }],
            from: { email: FROM_EMAIL, name: FROM_NAME },
            subject,
            content: [{ type: 'text/html', value: html }],
          }),
        });
        if (!r.ok) console.error('SendGrid error:', await r.text());
      } catch (e) { console.error('Email send error:', e); }
    };

    const sendSms = async (to, body) => {
      if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER || !to) return;
      try {
        const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
        const params = new URLSearchParams({ To: to, From: TWILIO_FROM_NUMBER, Body: body });
        const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params,
        });
        if (!r.ok) console.error(`Twilio error sending to ${to}:`, await r.text());
      } catch (e) { console.error('SMS send error:', e); }
    };

    const tasks = [];

    // ── Customer confirmation ──────────────────────────────────────
    tasks.push(sendSms(
      phone,
      `Air-Care Connect: Your service call is confirmed for ${prettyDate}, ${slot}. We'll see you then! Questions? Call/text ${OFFICE_PHONE_DISPLAY}.`
    ));

    if (email) {
      tasks.push(sendEmail(
        email,
        'Your Service Call is Confirmed — Air-Care Connect',
        `<div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color:#1B3A6B;">Your Service Call is Confirmed ✅</h2>
          <p><strong>Date:</strong> ${prettyDate}</p>
          <p><strong>Arrival Window:</strong> ${slot}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Issue:</strong> ${issue}</p>
          <p style="color:#64748b; font-size:13px;">Need to reschedule? Call or text us at ${OFFICE_PHONE_DISPLAY}.</p>
        </div>`
      ));
    }

    // ── Office notification ────────────────────────────────────────
    tasks.push(sendEmail(
      OFFICE_EMAIL,
      `📅 New SELF-BOOKED Service Call — ${name}`,
      `<div style="font-family: sans-serif; max-width: 480px;">
        <h2 style="color:#1B3A6B;">New Self-Booked Service Call</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Issue:</strong> ${issue}</p>
        <p><strong>Date:</strong> ${prettyDate}</p>
        <p><strong>Time Slot:</strong> ${slot}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        <p style="color:#64748b; font-size:13px;">Customer booked this time directly online — already confirmed, no callback needed.</p>
      </div>`
    ));

    if (TWILIO_NOTIFY_TO) {
      TWILIO_NOTIFY_TO.split(',').map((n) => n.trim()).filter(Boolean).forEach((to) => {
        tasks.push(sendSms(
          to,
          `New SELF-BOOKED service call: ${name}, ${phone}. ${issue}. ${prettyDate}, ${slot}. ${address}`
        ));
      });
    }

    await Promise.all(tasks);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Confirm service call error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
