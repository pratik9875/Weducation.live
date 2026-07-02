// Brevo covers both transactional email (receipts, status changes) and the B2B
// marketing emails weducation.live sends to prospective university clients (spec §4.3).

const BREVO_API_BASE = "https://api.brevo.com/v3";

function assertConfigured() {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not configured");
  }
}

async function brevoRequest(path: string, body: unknown) {
  assertConfigured();

  const res = await fetch(`${BREVO_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Brevo request failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

export interface SendTransactionalEmailParams {
  to: { email: string; name?: string }[];
  templateId: number;
  params: Record<string, unknown>;
}

export async function sendTransactionalEmail(params: SendTransactionalEmailParams) {
  return brevoRequest("/smtp/email", {
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME,
    },
    to: params.to,
    templateId: params.templateId,
    params: params.params,
  });
}

export interface AddDemoRequestContactParams {
  email: string;
  name: string;
  universityName: string;
  phone?: string;
  listId: number;
}

// Feeds the weducation.live B2B "request a demo" form into the same Brevo
// marketing list used to run our own CRM pipeline (spec §2, dogfooding).
export async function addDemoRequestContact(params: AddDemoRequestContactParams) {
  return brevoRequest("/contacts", {
    email: params.email,
    attributes: {
      FIRSTNAME: params.name,
      UNIVERSITY: params.universityName,
      SMS: params.phone,
    },
    listIds: [params.listId],
    updateEnabled: true,
  });
}
