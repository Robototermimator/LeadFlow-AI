import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe key not configured" }, { status: 400 });
  }

  const { priceId } = await request.json();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?billing=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?billing=cancel`
  });

  return NextResponse.json({ url: session.url });
}
