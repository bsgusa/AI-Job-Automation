import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email: string | undefined = body.email;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Marriage Green Card Package — I-130 + I-485",
              description:
                "Complete USCIS petition packet with AI-guided form filling, document checklist, RFE risk analysis, and step-by-step filing instructions.",
              images: [],
            },
            unit_amount: 39900, // $399.00
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${appUrl}/apply/intake?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/apply`,
      metadata: {
        product: "marriage_green_card",
      },
      // Collect billing address for fraud protection
      billing_address_collection: "auto",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
