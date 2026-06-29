// Vercel Serverless Function — Send SMS via Twilio
// Notifies YOUR OWN phone number(s) only — the recipient is never accepted
// from the page, so this endpoint can't be hijacked to text strangers
// through your Twilio account. Configure recipients with TWILIO_NOTIFY_TO.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;
  const NOTIFY_TO = process.env.TWILIO_NOTIFY_TO; // comma-separated, e.g. "+13525551234,+13525555678"

  if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER || !NOTIFY_TO) {
    return res.status(500).json({ error: 'SMS service not configured' });
  }

  try {
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({ error: 'Message body is required' });
    }

    const recipients = NOTIFY_TO.split(',').map((n) => n.trim()).filter(Boolean);
    const auth = Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64');

    const results = await Promise.all(
      recipients.map(async (to) => {
        const params = new URLSearchParams({ To: to, From: FROM_NUMBER, Body: body });
        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Twilio error sending to ${to}:`, errorText);
          return { to, ok: false };
        }
        return { to, ok: true };
      })
    );

    const anySuccess = results.some((r) => r.ok);
    if (!anySuccess) {
      return res.status(502).json({ error: 'All SMS sends failed', results });
    }

    return res.status(200).json({ success: true, results });
  } catch (error) {
    console.error('SMS send error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
