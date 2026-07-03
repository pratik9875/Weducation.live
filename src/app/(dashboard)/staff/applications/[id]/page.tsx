import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStaffUser } from "@/lib/auth";
import type {
  Application,
  ApplicationStatus,
  DocumentRecord,
  DocumentStatus,
  Payment,
  PaymentStatus,
} from "@/types/database";
import { Badge } from "@/components/dashboard/Badge";
import { InlineSelectForm } from "@/components/dashboard/InlineSelectForm";
import { updateApplicationStatus } from "../../actions";

const STATUSES: ApplicationStatus[] = [
  "draft",
  "submitted",
  "under_review",
  "documents_pending",
  "documents_verified",
  "fee_pending",
  "admitted",
  "rejected",
];

const DOC_TONE: Record<DocumentStatus, "neutral" | "brand" | "warning" | "danger"> = {
  pending: "warning",
  verified: "brand",
  rejected: "danger",
};

const PAYMENT_TONE: Record<PaymentStatus, "neutral" | "brand" | "warning" | "danger"> = {
  created: "neutral",
  authorized: "warning",
  captured: "brand",
  failed: "danger",
  refunded: "neutral",
};

type ApplicationDetail = Application & {
  leads: { id: string; name: string | null; phone: string } | null;
  courses: { name: string; fee: number } | null;
};

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [user, { data: application }] = await Promise.all([
    getStaffUser(),
    supabase
      .from("applications")
      .select("*, leads(id, name, phone), courses(name, fee)")
      .eq("id", id)
      .single(),
  ]);

  if (!application) notFound();
  const app = application as ApplicationDetail;
  const canReview =
    user != null && ["admin", "admission_manager", "registrar"].includes(user.role);

  const [{ data: documents }, { data: payments }] = await Promise.all([
    supabase
      .from("documents")
      .select("*")
      .eq("application_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("payments")
      .select("*")
      .eq("application_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const docRows = (documents as DocumentRecord[] | null) ?? [];
  const paymentRows = (payments as Payment[] | null) ?? [];

  return (
    <div>
      <Link
        href="/staff/applications"
        className="text-sm font-medium text-brand-700 hover:underline"
      >
        ← Back to applications
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {app.application_number ?? `Application ${app.id.slice(0, 8)}`}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {app.leads ? (
              <Link href={`/staff/leads/${app.leads.id}`} className="hover:underline">
                {app.leads.name ?? app.leads.phone}
              </Link>
            ) : (
              "Unknown applicant"
            )}
            {" · "}
            {app.courses?.name ?? "Unknown course"}
            {app.courses ? ` · fee ₹${Number(app.courses.fee).toLocaleString("en-IN")}` : ""}
          </p>
        </div>
        {canReview && (
          <InlineSelectForm
            action={updateApplicationStatus}
            hiddenFields={{ application_id: app.id }}
            name="status"
            value={app.status}
            options={STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))}
            ariaLabel="Application status"
          />
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Documents
          </h2>
          <div className="mt-3 space-y-3">
            {docRows.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-400">
                No documents uploaded yet.
              </div>
            )}
            {docRows.map((doc) => (
              <div key={doc.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium capitalize text-slate-900">
                    {doc.type.replace(/_/g, " ")}
                  </p>
                  <Badge tone={DOC_TONE[doc.status]}>{doc.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Uploaded {new Date(doc.created_at).toLocaleDateString()} ·{" "}
                  <a
                    href={doc.cloudinary_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-brand-700 hover:underline"
                  >
                    View file
                  </a>
                </p>
                {doc.status === "rejected" && doc.rejection_reason && (
                  <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                    {doc.rejection_reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Payments
          </h2>
          <div className="mt-3 space-y-3">
            {paymentRows.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-400">
                No payments recorded yet.
              </div>
            )}
            {paymentRows.map((payment) => (
              <div
                key={payment.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">
                    ₹{Number(payment.amount).toLocaleString("en-IN")}
                  </p>
                  <Badge tone={PAYMENT_TONE[payment.status]}>{payment.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(payment.created_at).toLocaleDateString()}
                  {payment.gateway_ref ? ` · ref ${payment.gateway_ref}` : ""}
                  {payment.receipt_url && (
                    <>
                      {" · "}
                      <a
                        href={payment.receipt_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-brand-700 hover:underline"
                      >
                        Receipt
                      </a>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
