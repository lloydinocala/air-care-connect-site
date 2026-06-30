// Vercel Serverless Function — Dynamically creates a Stripe Checkout Session
// for the requested plan and billing period, then redirects the customer
// straight into Stripe's hosted checkout.
//
// URL params:
//   plan    = silver | gold | platinum
//   billing = annual (default) | monthly
//   email   = customer email (optional, pre-fills Stripe checkout)

const SITE_URL = 'https://www.air-careconnect.com';

// Map plan+billing to the Vercel env var that holds the Stripe Price ID.
// In Stripe: each product gets TWO prices — one yearly recurring, one monthly.
const PRICE_ENV = {
  silver:   { annual: 'STRIPE_PRICE_SILVER',          monthly: 'STRIPE_PRICE_SILVER_MONTHLY' },
  gold:     { annual: 'STRIPE_PRICE_GOLD',            monthly: 'STRIPE_PRICE_GOLD_MONTHLY' },
  platinum: { annual: 'STRIPE_PRICE_PLATINUM',        monthly: 'STRIPE_PRICE_PLATINUM_MONTHLY' },
};

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
  const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
  const { plan, billing = 'annual', email } = req.query;
  const billingPeriod = billing === 'monthly' ? 'monthly' : 'annual';

  res.setHeader('Content-Type', 'text/html');

  if (!STRIPE_API_KEY) {
    return res.status(500).end(errorPage("Online enrollment isn't set up yet on our end."));
  }
  if (!plan || !PRICE_ENV[plan]) {
    return res.status(400).end(errorPage("We couldn't tell which plan you meant."));
  }

  const priceEnvKey = PRICE_ENV[plan][billingPeriod];
  const priceId = process.env[priceEnvKey];
  if (!priceId) {
    return res.status(500).end(
      errorPage(`That plan isn't available for online enrollment just yet — ${PLAN_NAMES[plan]}, ${billingPeriod} billing.`)
    );
  }

  try {
    const params = new URLSearchParams();
    params.append('mode', 'subscription');
    params.append('line_items[0][price]', priceId);
    params.append('line_items[0][quantity]', '1');
    params.append('success_url', `${SITE_URL}/club?enrolled=1&plan=${plan}`);
    params.append('cancel_url', `${SITE_URL}/club`);
    // Pre-fill the customer's email so they don't have to re-type it
    if (email) params.append('customer_email', email);
    // Show a phone number on the checkout page so they can call if anything goes wrong
    params.append('phone_number_collection[enabled]', 'false');

    const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await r.json();

    if (!r.ok || !data.url) {
      console.error('Stripe error:', JSON.stringify(data));
      return res.status(502).end(errorPage("Our payment provider couldn't start the checkout session."));
    }

    // Redirect the customer straight into Stripe's hosted checkout
    res.writeHead(302, { Location: data.url });
    return res.end();

  } catch (error) {
    console.error('start-checkout error:', error);
    return res.status(500).end(errorPage('Something went wrong on our end.'));
  }
}
