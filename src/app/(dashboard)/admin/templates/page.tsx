import { createClient } from "@/lib/supabase/server";
import type { Template } from "@/types/database";

export default async function AdminTemplatesPage() {
  const supabase = await createClient();
  const { data: templates } = await supabase
    .from("templates")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (templates as Template[] | null) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Template Management</h1>
      <p className="mt-2 text-sm text-slate-500">
        WhatsApp templates submitted to Meta via Interakt&apos;s API, tracked here — never
        in Interakt&apos;s own dashboard (spec §5).
      </p>
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Approval Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                  No templates yet.
                </td>
              </tr>
            )}
            {rows.map((template) => (
              <tr key={template.id}>
                <td className="px-4 py-3">{template.name}</td>
                <td className="px-4 py-3">{template.category ?? "—"}</td>
                <td className="px-4 py-3 capitalize">{template.approval_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
