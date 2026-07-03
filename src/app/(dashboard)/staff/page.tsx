import Link from "next/link";
import { CalendarClock, ClipboardList, FileCheck, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadStage } from "@/types/database";
import { Avatar } from "@/components/dashboard/Avatar";
import { Badge } from "@/components/dashboard/Badge";
import { StatCard } from "@/components/dashboard/StatCard";

const STAGE_TONE: Record<LeadStage, "neutral" | "brand" | "warning" | "danger"> = {
  new: "neutral",
  engaged: "brand",
  application_started: "brand",
  application_submitted: "warning",
  admitted: "brand",
  lost: "danger",
};

export default async function StaffOverviewPage() {
  const supabase = await createClient();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    { count: newLeads },
    { count: leadsToday },
    { count: underReview },
    { count: pendingDocs },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("stage", "new"),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfToday.toISOString()),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .in("status", ["submitted", "under_review"]),
    supabase.from("documents").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(8),
  ]);

  const rows = (recentLeads as Lead[] | null) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
      <p className="mt-1 text-sm text-slate-500">Your admission funnel at a glance.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="New leads"
          value={newLeads ?? 0}
          hint="Awaiting first contact"
          icon={UserPlus}
        />
        <StatCard
          label="Leads today"
          value={leadsToday ?? 0}
          hint="Arrived since midnight"
          icon={CalendarClock}
        />
        <StatCard
          label="Applications to review"
          value={underReview ?? 0}
          hint="Submitted or under review"
          icon={ClipboardList}
        />
        <StatCard
          label="Documents pending"
          value={pendingDocs ?? 0}
          hint="Awaiting verification"
          icon={FileCheck}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Latest leads
        </h2>
        <Link href="/staff/leads" className="text-sm font-medium text-brand-700 hover:underline">
          View all →
        </Link>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Stage</th>
              <th className="px-5 py-3">Arrived</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                  No leads yet — inbound WhatsApp contacts will appear here.
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
                  <Badge tone={STAGE_TONE[lead.stage]} dot>
                    {lead.stage.replace(/_/g, " ")}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
