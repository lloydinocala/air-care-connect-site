// Vercel Serverless Function — Dynamically creates a Stripe Checkout
// Session for the requested membership plan and redirects the customer
// straight into Stripe's hosted checkout. Linked from the Club agreement
// emails ("Enroll & Pay" button) — built fresh on every click, so the link
// never goes stale the way a pre-made Stripe Payment Link eventually can.
//
// Customer clicks a plain URL in their email (GET request) — no JS needed
// on their end, this function does the Stripe API call and 302-redirects.

const SITE_URL = 'https://www.air-careconnect.com';

const PRICE_ENV = {
  silver: 'STRIPE_PRICE_SILVER',
  gold: 'STRIPE_PRICE_GOLD',
  platinum: 'STRIPE_PRICE_PLATINUM',
};

function errorPage(message) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Air-Care Connect</title></head>
  <body style="font-family:sans-serif; max-width:480px; margin:80px auto; text-align:center; color:#1A1A2E;">
    <h2 style="color:#1B3A6B;">We hit a snag</h2>
    <p>${message}</p>
    <p>Please call or text us at <strong>352-484-6341</strong> and we'll get you set up right away.</p>
    <a href="${SITE_URL}/club" style="color:#4DB8E8;">&larr; Back to the Air-Care Club</a>
  </body></html>`;
}

export default async function handler(req, res) {
  const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
  const { plan, email } = req.query;

  res.setHeader('Content-Type', 'text/html');

  if (!STRIPE_API_KEY) {
    return res.status(500).end(errorPage("Payment setup isn't finished on our end yet."));
  }
  if (!plan || !PRICE_ENV[plan]) {
    return res.status(400).end(errorPage("We couldn't tell which plan you meant."));
  }

  const priceId = process.env[PRICE_ENV[plan]];
  if (!priceId) {
    return res.status(500).end(errorPage("That plan isn't available for online enrollment just yet."));
  }

  try {
    const params = new URLSearchParams();
    params.append('mode', 'subscription');
    params.append('line_items[0][price]', priceId);
    params.append('line_items[0][quantity]', '1');
    params.append('success_url', `${SITE_URL}/club?enrolled=1`);
    params.append('cancel_url', `${SITE_URL}/club`);
    if (email) params.append('customer_email', email);

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
      console.error('Stripe error:', data);
      return res.status(502).end(errorPage("Our payment provider couldn't start the checkout."));
    }

    res.writeHead(302, { Location: data.url });
    return res.end();
  } catch (error) {
    console.error('start-checkout error:', error);
    return res.status(500).end(errorPage('Something went wrong on our end.'));
  }
}
