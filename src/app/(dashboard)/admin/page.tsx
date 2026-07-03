import { GraduationCap, IndianRupee, ListChecks, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { LeadStage, StaffUser } from "@/types/database";
import { Avatar } from "@/components/dashboard/Avatar";
import { StatCard } from "@/components/dashboard/StatCard";

const STAGES: LeadStage[] = [
  "new",
  "engaged",
  "application_started",
  "application_submitted",
  "admitted",
  "lost",
];

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { count: totalLeads },
    { count: totalApplications },
    { count: admitted },
    { data: capturedPayments },
    { data: leadStageRows },
    { data: counselors },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("applications").select("*", { count: "exact", head: true }),
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "admitted"),
    supabase.from("payments").select("amount").eq("status", "captured").limit(1000),
    supabase.from("leads").select("stage, assigned_counselor_id").limit(1000),
    supabase.from("users").select("*").in("role", ["counselor", "admission_manager"]).order("name"),
  ]);

  const feesCollected = ((capturedPayments as { amount: number }[] | null) ?? []).reduce(
    (sum, p) => sum + Number(p.amount),
    0,
  );

  const stageRows =
    (leadStageRows as { stage: LeadStage; assigned_counselor_id: string | null }[] | null) ?? [];
  const stageCounts = new Map<LeadStage, number>();
  const workload = new Map<string, number>();
  for (const row of stageRows) {
    stageCounts.set(row.stage, (stageCounts.get(row.stage) ?? 0) + 1);
    if (row.assigned_counselor_id) {
      workload.set(row.assigned_counselor_id, (workload.get(row.assigned_counselor_id) ?? 0) + 1);
    }
  }
  const maxStageCount = Math.max(1, ...stageCounts.values());
  const counselorRows = (counselors as StaffUser[] | null) ?? [];
  const unassigned = stageRows.filter((r) => !r.assigned_counselor_id).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard & Overview</h1>
      <p className="mt-1 text-sm text-slate-500">University-wide admission funnel metrics.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total leads" value={totalLeads ?? 0} hint="All inbound contacts" icon={Users} />
        <StatCard
          label="Applications"
          value={totalApplications ?? 0}
          hint="Across all statuses"
          icon={ListChecks}
        />
        <StatCard
          label="Admitted"
          value={admitted ?? 0}
          hint="Completed the funnel"
          icon={GraduationCap}
        />
        <StatCard
          label="Fees collected"
          value={`₹${feesCollected.toLocaleString("en-IN")}`}
          hint="Captured payments"
          icon={IndianRupee}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Lead funnel
          </h2>
          <div className="mt-4 space-y-3">
            {STAGES.map((stage) => {
              const count = stageCounts.get(stage) ?? 0;
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize text-slate-700">{stage.replace(/_/g, " ")}</span>
                    <span className="font-semibold text-slate-900">{count}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={stage === "lost" ? "h-full bg-red-300" : "h-full bg-brand-500"}
                      style={{ width: `${(count / maxStageCount) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Counselor workload
          </h2>
          <table className="mt-4 min-w-full text-sm">
            <thead className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="pb-2">Counselor</th>
                <th className="pb-2 text-right">Assigned leads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {counselorRows.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-6 text-center text-slate-400">
                    No counselors provisioned yet.
                  </td>
                </tr>
              )}
              {counselorRows.map((counselor) => (
                <tr key={counselor.id}>
                  <td className="flex items-center gap-2.5 py-2.5 font-medium text-slate-900">
                    <Avatar name={counselor.name} size="sm" />
                    {counselor.name}
                  </td>
                  <td className="py-2.5 text-right text-slate-600">
                    {workload.get(counselor.id) ?? 0}
                  </td>
                </tr>
              ))}
              {counselorRows.length > 0 && (
                <tr>
                  <td className="py-2.5 text-slate-500">Unassigned</td>
                  <td className="py-2.5 text-right text-slate-500">{unassigned}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
