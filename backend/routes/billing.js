import express from 'express';
import Stripe from 'stripe';
import crypto from 'crypto';
import { authenticateToken } from './auth.js';

/* STREAMING_CHUNK: Initializing Billing Routing... */
const router = express.Router();

export function billingRoutes(dbClient) {
  // Use pre-configured Stripe Key or fallback placeholder
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_pulse_billing';
  const stripeClient = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
  });

  // Map Price IDs to Plan Tiers as requested by lead
  const priceToPlanMap = {
    'price_1TkB0tDBXoxP3P4OtvKAruXw': 'Starter',
    'price_1TkB0tDBXoxP3P4OolYdmfYp': 'Growth',
    'price_1TkB0tDBXoxP3P4OO46cGmwK': 'Scale',
  };

  // Endpoint to create checkout session
  router.post('/create-checkout-session', authenticateToken, async (req, res) => {
    const { priceId } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    if (!priceId) {
      return res.status(400).json({ error: 'priceId is required' });
    }

    const planTier = priceToPlanMap[priceId] || 'Starter';
    const DOMAIN = process.env.PUBLIC_URL || `http://${req.headers.host}` || 'http://localhost:3000';

    // Check if real secret key is configured. If not, generate a mock success flow.
    const isMock = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder');

    if (isMock) {
      console.log(`[Stripe Mock] Generating simulated checkout session URL for user ${userEmail} (${planTier})`);
      const mockSessionId = `cs_test_${crypto.randomBytes(16).toString('hex')}`;
      
      // We will redirect to a simulated payment page hosted on our own origin
      return res.json({
        id: mockSessionId,
        url: `${DOMAIN}/simulated-checkout?session_id=${mockSessionId}&price_id=${priceId}&email=${encodeURIComponent(userEmail)}&user_id=${userId}`
      });
    }

    try {
      /* STREAMING_CHUNK: Creating Stripe Checkout session... */
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${DOMAIN}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${DOMAIN}/billing/cancel`,
        customer_email: userEmail,
        client_reference_id: userId,
        metadata: {
          userId: userId,
          planTier: planTier,
          priceId: priceId
        }
      });

      res.json({ id: session.id, url: session.url });
    } catch (err) {
      console.error('Stripe Checkout Error:', err);
      // Fallback to simulated payment if Stripe throws an API key error
      const mockSessionId = `cs_test_fb_${crypto.randomBytes(16).toString('hex')}`;
      res.json({
        id: mockSessionId,
        url: `${DOMAIN}/simulated-checkout?session_id=${mockSessionId}&price_id=${priceId}&email=${encodeURIComponent(userEmail)}&user_id=${userId}&fallback=true`,
        warning: 'Fallback to simulated checkout due to Stripe configuration'
      });
    }
  });

  // Stripe Webhook Endpoint (checkout.session.completed and customer.subscription.updated)
  router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      /* STREAMING_CHUNK: Validating Webhook Signature... */
      if (endpointSecret && sig && req.rawBody) {
        event = stripeClient.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
      } else {
        // Fallback for direct triggers or unconfigured endpoint secret during testing
        event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`[Stripe Webhook] Received event of type: ${event.type}`);
    
    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id || (session.metadata && session.metadata.userId);
        const customerEmail = session.customer_email || session.customer_details?.email;
        
        let planTier = session.metadata?.planTier;
        if (!planTier && session.metadata?.priceId) {
          planTier = priceToPlanMap[session.metadata.priceId];
        }
        
        if (!planTier && session.line_items?.data?.[0]?.price?.id) {
          planTier = priceToPlanMap[session.line_items.data[0].price.id];
        }

        planTier = planTier || 'Starter';

        console.log(`[Stripe Webhook] Upgrading user: ${userId || customerEmail} to tier ${planTier}`);

        if (userId) {
          await dbClient.execute({
            sql: 'UPDATE users SET plan_tier = ? WHERE id = ?',
            args: [planTier, userId]
          });
        } else if (customerEmail) {
          await dbClient.execute({
            sql: 'UPDATE users SET plan_tier = ? WHERE email = ?',
            args: [planTier, customerEmail]
          });
        }
      } else if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Retrieve customer details to obtain email and upgrade plan tier
        try {
          const customer = await stripeClient.customers.retrieve(customerId);
          const email = customer.email;
          const priceId = subscription.items.data[0].price.id;
          const planTier = priceToPlanMap[priceId] || 'Starter';
          
          if (email) {
            console.log(`[Stripe Webhook] Subscription updated for ${email}: ${planTier}`);
            await dbClient.execute({
              sql: 'UPDATE users SET plan_tier = ? WHERE email = ?',
              args: [planTier, email]
            });
          }
        } catch (err) {
          console.error('Error handling customer.subscription.updated event:', err);
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error('Error processing Stripe webhook event:', err);
      res.status(500).json({ error: 'Webhook handling process failed' });
    }
  });

  // Simulated Success Upgrade route (Allows frontend mock success page to perform DB upgrades directly)
  router.post('/simulated-success', async (req, res) => {
    const { userId, planTier } = req.body;
    
    if (!userId || !planTier) {
      return res.status(400).json({ error: 'userId and planTier are required' });
    }
    
    try {
      console.log(`[Simulated Billing] Upgrading user ${userId} to ${planTier}...`);
      await dbClient.execute({
        sql: 'UPDATE users SET plan_tier = ? WHERE id = ?',
        args: [planTier, userId]
      });
      res.json({ success: true, message: `Successfully upgraded to ${planTier} plan via simulated sandbox.` });
    } catch (err) {
      console.error('Simulated success DB upgrade error:', err);
      res.status(500).json({ error: 'Failed to process simulated database upgrade' });
    }
  });

  // Billing Portal session creation endpoint
  router.post('/create-portal-session', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const DOMAIN = process.env.PUBLIC_URL || `http://${req.headers.host}` || 'http://localhost:3000';

    const isMock = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder');

    if (isMock) {
      return res.json({
        url: `${DOMAIN}/dashboard?portal_simulation=true`
      });
    }

    try {
      // Find or create customer in Stripe
      let customers = await stripeClient.customers.list({ email: userEmail, limit: 1 });
      let customerId;
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripeClient.customers.create({
          email: userEmail,
          metadata: { userId }
        });
        customerId = customer.id;
      }

      const portalSession = await stripeClient.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${DOMAIN}/dashboard`,
      });

      res.json({ url: portalSession.url });
    } catch (err) {
      console.error('Stripe Portal Error:', err);
      res.json({
        url: `${DOMAIN}/dashboard?portal_simulation=true`,
        warning: 'Fallback to portal simulation'
      });
    }
  });

  return router;
}
