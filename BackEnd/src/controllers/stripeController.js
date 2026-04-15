import { stripe } from "../config/stripe.js";
import prisma from "../config/prisma.js";

/**
 * START CHECKOUT SESSION
 * Triggered when a user selects a plan on the frontend
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { planName } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user session found" });
    }

    const planMapping = {
      PRO: process.env.STRIPE_PRO_PRICE_ID,
      ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    };

    const priceId = planMapping[planName];

    if (!priceId) {
      return res
        .status(400)
        .json({ message: "Invalid Plan Selection or Missing Price ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      metadata: {
        userId: user.id,
        planName: planName,
      },
      customer: user.stripeCustomerId || undefined,
      customer_email: user.stripeCustomerId ? undefined : user.email,
      success_url: `${process.env.FRONTEND_URL}/dashboard/profile?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/pricing?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * HANDLE STRIPE WEBHOOKS
 * Processes events sent from Stripe to sync your database
 */
export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error(`❌ Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;

  // Handle successful checkout completion
  if (event.type === "checkout.session.completed") {
    const userId = session.metadata?.userId;
    const rawPlan = session.metadata?.planName || "PRO";
    const planEnum = rawPlan.toUpperCase();

    if (!userId) {
      console.warn("⚠️ No userId in metadata. Skipping update.");
      return res.status(200).json({ received: true });
    }

    try {
      // 1. Retrieve the session with expansions to get line items and subscription details
      const expandedSession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items", "subscription"] },
      );

      const priceId = expandedSession.line_items?.data[0]?.price?.id;
      let subscription = expandedSession.subscription;

      // 2. TIMESTAMPS: Stripe uses seconds, JS uses milliseconds.
      // We ensure we have a valid Date object to avoid Prisma "Invalid Date" errors.
      let periodEnd = new Date();

      if (
        subscription &&
        typeof subscription === "object" &&
        subscription.current_period_end
      ) {
        periodEnd = new Date(subscription.current_period_end * 1000);
      } else if (typeof subscription === "string") {
        // Fallback: If subscription didn't expand, fetch it manually
        const subObj = await stripe.subscriptions.retrieve(subscription);
        periodEnd = new Date(subObj.current_period_end * 1000);
      }

      // 3. DATABASE UPDATE: Syncing Stripe data to our Prisma User model
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
          subscriptionStatus: "active",
          plan: planEnum,
          stripePriceId: priceId || null,
          stripeCurrentPeriodEnd: periodEnd,
        },
      });

      console.log(
        `✅ Success: ${updatedUser.email} upgraded to ${updatedUser.plan}`,
      );
      return res.status(200).json({ success: true });
    } catch (dbError) {
      console.error("❌ DATABASE UPDATE FAILED:");
      console.error(dbError.message);
      return res
        .status(500)
        .json({ error: "DB Update Failed", details: dbError.message });
    }
  }

  // Acknowledge receipt of all other events
  res.json({ received: true });
};
