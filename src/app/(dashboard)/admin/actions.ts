"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getStaffUser } from "@/lib/auth";
import type { StaffUser } from "@/types/database";

const ROLES = [
  "admin",
  "admission_manager",
  "counselor",
  "document_verifier",
  "finance",
  "registrar",
] as const;

async function requireAdmin(): Promise<StaffUser> {
  const user = await getStaffUser();
  if (!user || user.role !== "admin") throw new Error("Unauthorized");
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

export async function updateUserRole(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!userId || !ROLES.includes(role as (typeof ROLES)[number])) {
    throw new Error("Invalid role.");
  }
  if (userId === admin.id) {
    throw new Error("You cannot change your own role.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId)
    .eq("university_id", admin.university_id);

  if (error) throw new Error(`Could not update role: ${error.message}`);

  await audit(admin, `user.role:${role}`, `users/${userId}`);
  revalidatePath("/admin/users");
}

export async function createTemplate(formData: FormData) {
  const admin = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!name || !body) throw new Error("Template name and body are required.");

  const supabase = await createClient();
  const { error } = await supabase.from("templates").insert({
    university_id: admin.university_id,
    name,
    category: category || null,
    body,
    approval_status: "draft",
  });

  if (error) throw new Error(`Could not create template: ${error.message}`);

  await audit(admin, "template.create", `templates/${name}`);
  revalidatePath("/admin/templates");
}

// Marks a draft template as submitted to Meta for approval. Actual submission via
// Interakt's API (src/lib/integrations/interakt.ts) is wired in the integration pass.
export async function submitTemplateForApproval(formData: FormData) {
  const admin = await requireAdmin();
  const templateId = String(formData.get("template_id") ?? "");
  if (!templateId) throw new Error("Missing template.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("templates")
    .update({ approval_status: "pending" })
    .eq("id", templateId)
    .eq("university_id", admin.university_id)
    .eq("approval_status", "draft");

  if (error) throw new Error(`Could not submit template: ${error.message}`);

  await audit(admin, "template.submit_for_approval", `templates/${templateId}`);
  revalidatePath("/admin/templates");
}

export async function createCourse(formData: FormData) {
  const admin = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const fee = Number(formData.get("fee"));
  const intakeYear = String(formData.get("intake_year") ?? "").trim();

  if (!name || !intakeYear || !Number.isFinite(fee) || fee < 0) {
    throw new Error("Course name, a valid fee, and intake year are required.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("courses").insert({
    university_id: admin.university_id,
    name,
    fee,
    intake_year: intakeYear,
  });

  if (error) throw new Error(`Could not create course: ${error.message}`);

  await audit(admin, "course.create", `courses/${name}`);
  revalidatePath("/admin/courses");
}

export async function updateCourse(formData: FormData) {
  const admin = await requireAdmin();
  const courseId = String(formData.get("course_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const fee = Number(formData.get("fee"));
  const intakeYear = String(formData.get("intake_year") ?? "").trim();

  if (!courseId || !name || !intakeYear || !Number.isFinite(fee) || fee < 0) {
    throw new Error("Course name, a valid fee, and intake year are required.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("courses")
    .update({ name, fee, intake_year: intakeYear })
    .eq("id", courseId)
    .eq("university_id", admin.university_id);

  if (error) throw new Error(`Could not update course: ${error.message}`);

  await audit(admin, "course.update", `courses/${courseId}`);
  revalidatePath("/admin/courses");
}

export async function deleteCourse(formData: FormData) {
  const admin = await requireAdmin();
  const courseId = String(formData.get("course_id") ?? "");
  if (!courseId) throw new Error("Missing course.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId)
    .eq("university_id", admin.university_id);

  if (error) {
    throw new Error(
      "Could not delete course — it likely has applications tied to it. " +
        error.message,
    );
  }

  await audit(admin, "course.delete", `courses/${courseId}`);
  revalidatePath("/admin/courses");
}

const PAYMENT_STATUSES = ["created", "authorized", "captured", "failed", "refunded"] as const;

// Manual override for admin/finance use while Razorpay isn't wired up (spec §10) —
// the real flow updates this via the webhook once live credentials are configured.
export async function updatePaymentStatus(formData: FormData) {
  const user = await getStaffUser();
  if (!user || !["admin", "finance"].includes(user.role)) throw new Error("Unauthorized");

  const paymentId = String(formData.get("payment_id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!paymentId || !PAYMENT_STATUSES.includes(status as (typeof PAYMENT_STATUSES)[number])) {
    throw new Error("Invalid payment status.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("payments")
    .update({ status })
    .eq("id", paymentId)
    .eq("university_id", user.university_id);

  if (error) throw new Error(`Could not update payment: ${error.message}`);

  await audit(user, `payment.status:${status}`, `payments/${paymentId}`);
  revalidatePath("/admin/payments");
}
