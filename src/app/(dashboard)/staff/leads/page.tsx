import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/types/database";

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
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No leads yet.
                </td>
              </tr>
            )}
            {rows.map((lead) => (
              <tr key={lead.id}>
                <td className="px-4 py-3">{lead.name ?? "—"}</td>
                <td className="px-4 py-3">{lead.phone}</td>
                <td className="px-4 py-3 capitalize">{lead.stage.replace("_", " ")}</td>
                <td className="px-4 py-3">{lead.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
