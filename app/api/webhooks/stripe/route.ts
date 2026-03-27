import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return NextResponse.json({ ok: true });
}
