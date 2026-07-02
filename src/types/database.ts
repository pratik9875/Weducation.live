// Hand-written types mirroring supabase/migrations/0001_init.sql (spec §7).
// Once the Supabase project is live, replace with generated types:
//   npx supabase gen types typescript --project-id <id> > src/types/database.ts

export type AppRole =
  | "admin"
  | "admission_manager"
  | "counselor"
  | "document_verifier"
  | "finance"
  | "registrar";

export type LeadStage =
  | "new"
  | "engaged"
  | "application_started"
  | "application_submitted"
  | "admitted"
  | "lost";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "documents_pending"
  | "documents_verified"
  | "fee_pending"
  | "admitted"
  | "rejected";

export type DocumentStatus = "pending" | "verified" | "rejected";
export type PaymentStatus = "created" | "authorized" | "captured" | "failed" | "refunded";
export type TemplateApprovalStatus = "draft" | "pending" | "approved" | "rejected";
export type MessageChannel = "whatsapp" | "email" | "sms";
export type MessageDirection = "inbound" | "outbound";
export type NotificationStatus = "queued" | "sent" | "delivered" | "failed";

export interface University {
  id: string;
  name: string;
  whatsapp_number_id: string | null;
  branding_config: Record<string, unknown>;
  academic_year: string | null;
  created_at: string;
}

export interface StaffUser {
  id: string;
  university_id: string;
  role: AppRole;
  name: string;
  email: string;
  created_at: string;
}

export interface Course {
  id: string;
  university_id: string;
  name: string;
  fee: number;
  eligibility_rules: Record<string, unknown>;
  intake_year: string;
  created_at: string;
}

export interface Lead {
  id: string;
  university_id: string;
  phone: string;
  name: string | null;
  source: string | null;
  stage: LeadStage;
  assigned_counselor_id: string | null;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  university_id: string;
  lead_id: string;
  course_id: string;
  status: ApplicationStatus;
  application_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentRecord {
  id: string;
  university_id: string;
  application_id: string;
  type: string;
  cloudinary_url: string;
  status: DocumentStatus;
  rejection_reason: string | null;
  verified_by: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  university_id: string;
  application_id: string;
  amount: number;
  status: PaymentStatus;
  receipt_url: string | null;
  gateway_ref: string | null;
  created_at: string;
}

export interface Template {
  id: string;
  university_id: string;
  name: string;
  approval_status: TemplateApprovalStatus;
  category: string | null;
  body: string;
  created_at: string;
}
