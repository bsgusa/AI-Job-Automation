import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceSupabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (
      session.payment_status === "paid" &&
      session.metadata?.product === "marriage_green_card"
    ) {
      const sb = getServiceSupabase();

      const { error } = await sb.from("marriage_cases").insert({
        email: session.customer_email ?? session.customer_details?.email ?? "",
        stripe_session_id: session.id,
        stripe_payment_intent:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id,
        status: "paid",
      });

      if (error) {
        console.error("Supabase insert error:", error);
        // Return 200 so Stripe doesn't retry — log and investigate separately
      }
    }
  }

  return NextResponse.json({ received: true });
}
