import { createClient } from "@/lib/supabase/server";
import type { Template, TemplateApprovalStatus } from "@/types/database";
import { Badge } from "@/components/dashboard/Badge";

const STATUS_TONE: Record<TemplateApprovalStatus, "neutral" | "brand" | "warning" | "danger"> = {
  draft: "neutral",
  pending: "warning",
  approved: "brand",
  rejected: "danger",
};

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
      <p className="mt-1 text-sm text-slate-500">
        WhatsApp templates submitted to Meta via Interakt&apos;s API, tracked here — never
        in Interakt&apos;s own dashboard.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Approval Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-slate-400">
                  No templates yet.
                </td>
              </tr>
            )}
            {rows.map((template) => (
              <tr key={template.id} className="transition-colors hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">{template.name}</td>
                <td className="px-5 py-3 text-slate-600">{template.category ?? "—"}</td>
                <td className="px-5 py-3">
                  <Badge tone={STATUS_TONE[template.approval_status]}>
                    {template.approval_status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
