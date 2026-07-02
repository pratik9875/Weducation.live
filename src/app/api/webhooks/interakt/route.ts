import { NextResponse } from "next/server";
import { verifyWebhookSignature, type InteraktWebhookEvent } from "@/lib/integrations/interakt";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Inbound WhatsApp events land here. This is the only place Interakt-specific
// payload shapes should be parsed — everything downstream works with our own
// `conversations` / `messages` tables (spec §5 abstraction layer).
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-interakt-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as InteraktWebhookEvent;
  const supabase = createServiceRoleClient();

  switch (event.type) {
    case "message_received":
      // TODO: resolve lead by phone, upsert conversation, insert message,
      // then hand off to the Core Engine (AI Admission Assistant, spec §9).
      break;
    case "message_status":
      // TODO: update notifications/messages delivery status.
      break;
    default:
      console.warn("interakt webhook: unhandled event type", event.type);
  }

  void supabase;
  return NextResponse.json({ ok: true });
}
