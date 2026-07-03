import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadStage, StaffUser } from "@/types/database";
import { Avatar } from "@/components/dashboard/Avatar";
import { InlineSelectForm } from "@/components/dashboard/InlineSelectForm";
import { StatCard } from "@/components/dashboard/StatCard";
import { TableToolbar } from "@/components/dashboard/TableToolbar";
import { UserPlus, Sparkles, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { assignLeadCounselor, updateLeadStage } from "../actions";

const STAGES: LeadStage[] = [
  "new",
  "engaged",
  "application_started",
  "application_submitted",
  "admitted",
  "lost",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; q?: string; sort?: string }>;
}) {
  const { stage, q, sort } = await searchParams;
  const activeStage = STAGES.includes(stage as LeadStage) ? (stage as LeadStage) : null;
  const searchTerm = q?.trim() ?? "";
  const ascending = sort === "oldest";

  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending })
    .limit(100);
  if (activeStage) query = query.eq("stage", activeStage);
  if (searchTerm) query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { data: leads },
    { data: counselors },
    { count: totalLeads },
    { count: newCount },
    { count: convertedCount },
    { count: newThisMonth },
  ] = await Promise.all([
    query,
    supabase.from("users").select("*").in("role", ["counselor", "admission_manager"]).order("name"),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("stage", "new"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("stage", "admitted"),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString()),
  ]);

  const rows = (leads as Lead[] | null) ?? [];
  const counselorRows = (counselors as StaffUser[] | null) ?? [];
  const counselorOptions = [
    { value: "", label: "Unassigned" },
    ...counselorRows.map((c) => ({ value: c.id, label: c.name })),
  ];
  const stageOptions = STAGES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }));

  const exportRows = rows.map((lead) => ({
    name: lead.name ?? "",
    phone: lead.phone,
    stage: lead.stage,
    score: lead.score,
    source: lead.source ?? "",
    created_at: lead.created_at,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
      <p className="mt-1 text-sm text-slate-500">
        Every WhatsApp inbound contact captured from prospective applicants.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total leads" value={totalLeads ?? 0} icon={UserPlus} />
        <StatCard label="New" value={newCount ?? 0} icon={Sparkles} />
        <StatCard label="Converted" value={convertedCount ?? 0} icon={Target} />
        <StatCard label="New this month" value={newThisMonth ?? 0} icon={TrendingUp} />
      </div>

      <div className="mt-6">
        <TableToolbar
          searchPlaceholder="Search name or phone…"
          filters={[{ param: "stage", label: "All Status", options: stageOptions }]}
          sortOptions={SORT_OPTIONS}
          exportRows={exportRows}
          exportFilename="leads.csv"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Stage</th>
              <th className="px-5 py-3">Counselor</th>
              <th className="px-5 py-3">Score</th>
              <th className="px-5 py-3">Arrived</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                  {searchTerm || activeStage
                    ? "No leads match your search or filter."
                    : "No leads yet."}
                </td>
              </tr>
            )}
            {rows.map((lead) => (
              <tr key={lead.id} className="transition-colors hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">
                  <Link
                    href={`/staff/leads/${lead.id}`}
                    className="flex items-center gap-2.5 hover:underline"
                  >
                    <Avatar name={lead.name ?? lead.phone} size="sm" />
                    {lead.name ?? "Unknown"}
                  </Link>
                </td>
                <td className="px-5 py-3 text-slate-600">{lead.phone}</td>
                <td className="px-5 py-3">
                  <InlineSelectForm
                    action={updateLeadStage}
                    hiddenFields={{ lead_id: lead.id }}
                    name="stage"
                    value={lead.stage}
                    options={stageOptions}
                    ariaLabel={`Stage for ${lead.name ?? lead.phone}`}
                  />
                </td>
                <td className="px-5 py-3">
                  <InlineSelectForm
                    action={assignLeadCounselor}
                    hiddenFields={{ lead_id: lead.id }}
                    name="counselor_id"
                    value={lead.assigned_counselor_id ?? ""}
                    options={counselorOptions}
                    ariaLabel={`Counselor for ${lead.name ?? lead.phone}`}
                  />
                </td>
                <td className="px-5 py-3 text-slate-600">{lead.score}</td>
                <td className="px-5 py-3 text-slate-600">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Showing up to 100 leads. Change stage or counselor directly from the table.
      </p>
    </div>
  );
}
