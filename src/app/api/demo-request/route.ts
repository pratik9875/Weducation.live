import { NextResponse } from "next/server";
import { z } from "zod";
import { addDemoRequestContact } from "@/lib/integrations/brevo";

const demoRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  universityName: z.string().min(1),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = demoRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const listId = Number(process.env.BREVO_DEMO_REQUEST_LIST_ID ?? 1);

  try {
    await addDemoRequestContact({ ...parsed.data, listId });
  } catch (err) {
    console.error("demo-request: failed to add Brevo contact", err);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
