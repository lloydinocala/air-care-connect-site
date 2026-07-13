// Vercel Serverless Function — Creates a Stripe Checkout Session for the
// requested plan and billing period via Journey-HVAC's Stripe Connect setup,
// then redirects the customer straight into Stripe's hosted checkout.
//
// This used to call Stripe directly with a separate API key and hardcoded
// Price IDs. It now delegates to Journey so the resulting subscription,
// customer, property, and agreement all land in the same system Air-Care
// Connect runs on day to day — no more disconnected signups.
//
// URL params:
//   plan    = silver | gold | platinum
//   billing = annual (default) | monthly
//   email   = customer email (optional, pre-fills Stripe checkout)

const SITE_URL = 'https://www.air-careconnect.com';
const JOURNEY_FUNCTIONS_URL = 'https://gatndtsmjrxdgxquvydw.supabase.co/functions/v1';
const AIR_CARE_CONNECT_ORG_ID = '7194773e-a5fd-4666-bb32-2a70e736e7fb';

const PLAN_NAMES = {
  silver:   'Air-Care Silver',
  gold:     'Air-Care Gold',
  platinum: 'Air-Care Platinum',
};

function errorPage(message) {
  return `<!DOCTYPE html>
  <html><head><meta charset="utf-8"><title>Air-Care Connect</title></head>
  <body style="font-family:sans-serif; max-width:480px; margin:80px auto; text-align:center; color:#1A1A2E; padding:0 20px;">
    <h2 style="color:#1B3A6B;">We hit a snag</h2>
    <p style="color:#4A5568; line-height:1.7;">${message}</p>
    <p style="color:#4A5568;">Please call or text us at <strong>352-484-6341</strong> and we'll get you enrolled right away.</p>
    <a href="${SITE_URL}/club" style="color:#4DB8E8; font-weight:600;">&larr; Back to the Air-Care Club</a>
  </body></html>`;
}

export default async function handler(req, res) {
  const { plan, billing = 'annual', email } = req.query;
  const billingPeriod = billing === 'monthly' ? 'monthly' : 'annual';

  res.setHeader('Content-Type', 'text/html');

  if (!plan || !PLAN_NAMES[plan]) {
    return res.status(400).end(errorPage("We couldn't tell which plan you meant."));
  }

  try {
    const r = await fetch(`${JOURNEY_FUNCTIONS_URL}/public-club-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgId: AIR_CARE_CONNECT_ORG_ID,
        tierName: plan,
        billingCycle: billingPeriod,
        email: email || undefined,
        successUrl: `${SITE_URL}/club?enrolled=1&plan=${plan}`,
        cancelUrl: `${SITE_URL}/club`,
      }),
    });

    const data = await r.json();

    if (!r.ok || !data.url) {
      console.error('Journey checkout error:', JSON.stringify(data));
      return res.status(502).end(
        errorPage(`We couldn't start checkout for ${PLAN_NAMES[plan]} right now. ${data.error || ''}`)
      );
    }

    // Redirect the customer straight into Stripe's hosted checkout
    res.writeHead(302, { Location: data.url });
    return res.end();

  } catch (error) {
    console.error('start-checkout error:', error);
    return res.status(500).end(errorPage('Something went wrong on our end.'));
  }
}
