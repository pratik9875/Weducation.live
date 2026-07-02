import { createClient } from "@/lib/supabase/server";
import type { Application, ApplicationStatus } from "@/types/database";
import { Badge } from "@/components/dashboard/Badge";

const STATUS_TONE: Record<ApplicationStatus, "neutral" | "brand" | "warning" | "danger"> = {
  draft: "neutral",
  submitted: "brand",
  under_review: "warning",
  documents_pending: "warning",
  documents_verified: "brand",
  fee_pending: "warning",
  admitted: "brand",
  rejected: "danger",
};

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = (applications as Application[] | null) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Application Review</h1>
      <p className="mt-1 text-sm text-slate-500">Applications submitted through the admission funnel.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Application #</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-slate-400">
                  No applications yet.
                </td>
              </tr>
            )}
            {rows.map((app) => (
              <tr key={app.id} className="transition-colors hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">
                  {app.application_number ?? "—"}
                </td>
                <td className="px-5 py-3">
                  <Badge tone={STATUS_TONE[app.status]}>{app.status.replace("_", " ")}</Badge>
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {new Date(app.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
