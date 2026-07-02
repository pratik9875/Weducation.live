import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadStage } from "@/types/database";
import { Badge } from "@/components/dashboard/Badge";

const STAGE_TONE: Record<LeadStage, "neutral" | "brand" | "warning" | "danger"> = {
  new: "neutral",
  engaged: "brand",
  application_started: "brand",
  application_submitted: "warning",
  admitted: "brand",
  lost: "danger",
};

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = (leads as Lead[] | null) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
      <p className="mt-1 text-sm text-slate-500">Every WhatsApp inbound contact, in one pipeline.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Stage</th>
              <th className="px-5 py-3">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                  No leads yet.
                </td>
              </tr>
            )}
            {rows.map((lead) => (
              <tr key={lead.id} className="transition-colors hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">{lead.name ?? "—"}</td>
                <td className="px-5 py-3 text-slate-600">{lead.phone}</td>
                <td className="px-5 py-3">
                  <Badge tone={STAGE_TONE[lead.stage]}>{lead.stage.replace("_", " ")}</Badge>
                </td>
                <td className="px-5 py-3 text-slate-600">{lead.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
