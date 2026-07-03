"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getStaffUser } from "@/lib/auth";
import type { AppRole, StaffUser } from "@/types/database";

const LEAD_STAGES = [
  "new",
  "engaged",
  "application_started",
  "application_submitted",
  "admitted",
  "lost",
] as const;

const APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "documents_pending",
  "documents_verified",
  "fee_pending",
  "admitted",
  "rejected",
] as const;

const APPLICATION_REVIEW_ROLES: AppRole[] = ["admin", "admission_manager", "registrar"];
const DOCUMENT_VERIFY_ROLES: AppRole[] = ["admin", "admission_manager", "document_verifier"];

// Every action re-verifies the session server-side — server actions are reachable
// via direct POST, so the layout's redirect alone is not a security boundary.
async function requireStaff(allowedRoles?: AppRole[]): Promise<StaffUser> {
  const user = await getStaffUser();
  if (!user) throw new Error("Unauthorized");
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("Your role does not permit this action.");
  }
  return user;
}

async function audit(user: StaffUser, action: string, entity: string) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    university_id: user.university_id,
    user_id: user.id,
    action,
    entity,
  });
}

export async function updateLeadStage(formData: FormData) {
  const user = await requireStaff();
  const leadId = String(formData.get("lead_id") ?? "");
  const stage = String(formData.get("stage") ?? "");

  if (!leadId || !LEAD_STAGES.includes(stage as (typeof LEAD_STAGES)[number])) {
    throw new Error("Invalid lead stage.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ stage, updated_at: new Date().toISOString() })
    .eq("id", leadId)
    .eq("university_id", user.university_id);

  if (error) throw new Error(`Could not update lead stage: ${error.message}`);

  await audit(user, `lead.stage:${stage}`, `leads/${leadId}`);
  revalidatePath("/staff/leads");
  revalidatePath(`/staff/leads/${leadId}`);
  revalidatePath("/staff");
}

export async function assignLeadCounselor(formData: FormData) {
  const user = await requireStaff();
  const leadId = String(formData.get("lead_id") ?? "");
  const counselorId = String(formData.get("counselor_id") ?? "");

  if (!leadId) throw new Error("Missing lead.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({
      assigned_counselor_id: counselorId || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId)
    .eq("university_id", user.university_id);

  if (error) throw new Error(`Could not assign counselor: ${error.message}`);

  await audit(user, "lead.assign_counselor", `leads/${leadId}`);
  revalidatePath("/staff/leads");
  revalidatePath(`/staff/leads/${leadId}`);
}

export async function updateApplicationStatus(formData: FormData) {
  const user = await requireStaff(APPLICATION_REVIEW_ROLES);
  const applicationId = String(formData.get("application_id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (
    !applicationId ||
    !APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number])
  ) {
    throw new Error("Invalid application status.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", applicationId)
    .eq("university_id", user.university_id);

  if (error) throw new Error(`Could not update application: ${error.message}`);

  await audit(user, `application.status:${status}`, `applications/${applicationId}`);
  revalidatePath("/staff/applications");
  revalidatePath(`/staff/applications/${applicationId}`);
  revalidatePath("/staff");
}

export async function verifyDocument(formData: FormData) {
  const user = await requireStaff(DOCUMENT_VERIFY_ROLES);
  const documentId = String(formData.get("document_id") ?? "");
  if (!documentId) throw new Error("Missing document.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("documents")
    .update({ status: "verified", rejection_reason: null, verified_by: user.id })
    .eq("id", documentId)
    .eq("university_id", user.university_id);

  if (error) throw new Error(`Could not verify document: ${error.message}`);

  await audit(user, "document.verify", `documents/${documentId}`);
  revalidatePath("/staff/documents");
  revalidatePath("/staff");
}

export async function rejectDocument(formData: FormData) {
  const user = await requireStaff(DOCUMENT_VERIFY_ROLES);
  const documentId = String(formData.get("document_id") ?? "");
  const reason = String(formData.get("rejection_reason") ?? "").trim();

  if (!documentId) throw new Error("Missing document.");
  if (!reason) throw new Error("A rejection reason is required.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("documents")
    .update({ status: "rejected", rejection_reason: reason, verified_by: user.id })
    .eq("id", documentId)
    .eq("university_id", user.university_id);

  if (error) throw new Error(`Could not reject document: ${error.message}`);

  await audit(user, "document.reject", `documents/${documentId}`);
  revalidatePath("/staff/documents");
  revalidatePath("/staff");
}
