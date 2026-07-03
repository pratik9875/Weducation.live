import Link from "next/link";
import { CheckCircle2, ClipboardList, Clock, FileWarning } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Application, ApplicationStatus } from "@/types/database";
import { Avatar } from "@/components/dashboard/Avatar";
import { Badge } from "@/components/dashboard/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { TableToolbar } from "@/components/dashboard/TableToolbar";

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

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

type ApplicationRow = Application & {
  leads: { name: string | null; phone: string } | null;
  courses: { name: string } | null;
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; sort?: string }>;
}) {
  const { status, q, sort } = await searchParams;
  const activeStatus = STATUSES.includes(status as ApplicationStatus)
    ? (status as ApplicationStatus)
    : null;
  const searchTerm = q?.trim() ?? "";
  const ascending = sort === "oldest";

  const supabase = await createClient();
  let query = supabase
    .from("applications")
    .select("*, leads(name, phone), courses(name)")
    .order("created_at", { ascending })
    .limit(100);
  if (activeStatus) query = query.eq("status", activeStatus);
  if (searchTerm) query = query.ilike("application_number", `%${searchTerm}%`);

  const [
    { data: applications },
    { count: total },
    { count: toReview },
    { count: admitted },
    { count: rejected },
  ] = await Promise.all([
    query,
    supabase.from("applications").select("*", { count: "exact", head: true }),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .in("status", ["submitted", "under_review"]),
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "admitted"),
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "rejected"),
  ]);

  const rows = (applications as ApplicationRow[] | null) ?? [];
  const statusOptions = STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }));

  const exportRows = rows.map((app) => ({
    application_number: app.application_number ?? "",
    applicant: app.leads?.name ?? app.leads?.phone ?? "",
    course: app.courses?.name ?? "",
    status: app.status,
    created_at: app.created_at,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Application Review</h1>
      <p className="mt-1 text-sm text-slate-500">Applications submitted through the admission funnel.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total applications" value={total ?? 0} icon={ClipboardList} />
        <StatCard label="To review" value={toReview ?? 0} icon={Clock} />
        <StatCard label="Admitted" value={admitted ?? 0} icon={CheckCircle2} />
        <StatCard label="Rejected" value={rejected ?? 0} icon={FileWarning} />
      </div>

      <div className="mt-6">
        <TableToolbar
          searchPlaceholder="Search application number…"
          filters={[{ param: "status", label: "All Status", options: statusOptions }]}
          sortOptions={SORT_OPTIONS}
          exportRows={exportRows}
          exportFilename="applications.csv"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Application #</th>
              <th className="px-5 py-3">Applicant</th>
              <th className="px-5 py-3">Course</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  {searchTerm || activeStatus
                    ? "No applications match your search or filter."
                    : "No applications yet."}
                </td>
              </tr>
            )}
            {rows.map((app) => (
              <tr key={app.id} className="transition-colors hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">
                  <Link href={`/staff/applications/${app.id}`} className="hover:underline">
                    {app.application_number ?? app.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-5 py-3 text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={app.leads?.name ?? app.leads?.phone ?? "?"} size="sm" />
                    {app.leads?.name ?? app.leads?.phone ?? "—"}
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">{app.courses?.name ?? "—"}</td>
                <td className="px-5 py-3">
                  <Badge tone={STATUS_TONE[app.status]} dot>
                    {app.status.replace(/_/g, " ")}
                  </Badge>
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
