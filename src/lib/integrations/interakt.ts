// Thin abstraction over Interakt's API (spec §5).
//
// Interakt is treated strictly as a backend BSP — the pipe to Meta's WhatsApp
// Cloud API. Its dashboard, branding, and chatbot builder are never surfaced
// to clients or students. Conversation logic lives in our own Core Engine.
//
// If Interakt is ever swapped for a direct Meta Cloud API integration, only
// this file (and its webhook counterpart) should need to change.

const INTERAKT_API_BASE = "https://api.interakt.ai/v1/public";

function assertConfigured() {
  if (!process.env.INTERAKT_API_KEY) {
    throw new Error("INTERAKT_API_KEY is not configured");
  }
}

export interface SendWhatsAppMessageParams {
  toPhoneNumber: string;
  countryCode: string;
  templateName?: string;
  templateData?: Record<string, string>;
  freeformText?: string;
}

export async function sendWhatsAppMessage(params: SendWhatsAppMessageParams) {
  assertConfigured();

  const body = params.templateName
    ? {
        countryCode: params.countryCode,
        phoneNumber: params.toPhoneNumber,
        type: "Template",
        template: {
          name: params.templateName,
          languageCode: "en",
          bodyValues: params.templateData ? Object.values(params.templateData) : [],
        },
      }
    : {
        countryCode: params.countryCode,
        phoneNumber: params.toPhoneNumber,
        type: "Text",
        data: { message: params.freeformText },
      };

  const res = await fetch(`${INTERAKT_API_BASE}/message/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.INTERAKT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Interakt send failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

export interface SubmitTemplateParams {
  name: string;
  category: string;
  languageCode: string;
  body: string;
}

export async function submitTemplateForApproval(params: SubmitTemplateParams) {
  assertConfigured();

  const res = await fetch(`${INTERAKT_API_BASE}/template/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.INTERAKT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Interakt template submit failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

// Shape of the payload Interakt POSTs to our webhook on inbound messages /
// delivery status changes. Narrowed as we integrate the real payload.
export interface InteraktWebhookEvent {
  type: "message_received" | "message_status" | string;
  data: Record<string, unknown>;
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!process.env.INTERAKT_WEBHOOK_SECRET || !signature) return false;
  // TODO: implement HMAC verification once Interakt's signing scheme is confirmed
  // during integration kickoff (spec §10 checklist item).
  return true;
}
