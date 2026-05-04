import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "AI SaaS Pro",
          },
          unit_amount: 999,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000",
  });

  return Response.json({ url: session.url });
}