import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/integrations/razorpay";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Razorpay webhook → Supabase (payments table) → Brevo receipt trigger (spec §10).
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as {
    event: string;
    payload: { payment_link?: { entity: Record<string, unknown> } };
  };

  const supabase = createServiceRoleClient();

  if (event.event === "payment_link.paid") {
    const link = event.payload.payment_link?.entity;
    const applicationId = (link?.reference_id as string) ?? null;

    if (applicationId) {
      await supabase
        .from("payments")
        .update({ status: "captured", gateway_ref: link?.id as string })
        .eq("application_id", applicationId);
      // TODO: trigger Brevo payment-receipt transactional email.
    }
  }

  return NextResponse.json({ ok: true });
}
