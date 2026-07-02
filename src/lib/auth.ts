import { createClient } from "@/lib/supabase/server";
import type { StaffUser } from "@/types/database";

// Resolves the signed-in Supabase auth user to their staff row (role, university_id).
// Returns null if unauthenticated or not yet provisioned as staff.
export async function getStaffUser(): Promise<StaffUser | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data } = await supabase.from("users").select("*").eq("id", authUser.id).single();

  return (data as StaffUser) ?? null;
}
