import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Cloudinary upload-completed notifications (e.g. async moderation/transformation
// results) land here and update the `documents` table.
export async function POST(request: Request) {
  const payload = await request.json();
  const supabase = createServiceRoleClient();

  // TODO: verify Cloudinary's X-Cld-Signature/X-Cld-Timestamp headers once
  // notification URLs are configured during integration kickoff (spec §10).
  void supabase;
  void payload;

  return NextResponse.json({ ok: true });
}
