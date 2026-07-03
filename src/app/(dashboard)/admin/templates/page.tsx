import { CheckCircle2, Clock, FileText, PenLine } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Template, TemplateApprovalStatus } from "@/types/database";
import { Badge } from "@/components/dashboard/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { TableToolbar } from "@/components/dashboard/TableToolbar";
import { createTemplate, submitTemplateForApproval } from "../actions";

const STATUS_TONE: Record<TemplateApprovalStatus, "neutral" | "brand" | "warning" | "danger"> = {
  draft: "neutral",
  pending: "warning",
  approved: "brand",
  rejected: "danger",
};

const STATUSES: TemplateApprovalStatus[] = ["draft", "pending", "approved", "rejected"];

export default async function AdminTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const searchTerm = q?.trim() ?? "";
  const activeStatus = STATUSES.includes(status as TemplateApprovalStatus)
    ? (status as TemplateApprovalStatus)
    : null;

  const supabase = await createClient();
  let query = supabase.from("templates").select("*").order("created_at", { ascending: false });
  if (activeStatus) query = query.eq("approval_status", activeStatus);
  if (searchTerm) query = query.ilike("name", `%${searchTerm}%`);

  const [
    { data: templates },
    { count: total },
    { count: draft },
    { count: pending },
    { count: approved },
  ] = await Promise.all([
    query,
    supabase.from("templates").select("*", { count: "exact", head: true }),
    supabase.from("templates").select("*", { count: "exact", head: true }).eq("approval_status", "draft"),
    supabase.from("templates").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
    supabase.from("templates").select("*", { count: "exact", head: true }).eq("approval_status", "approved"),
  ]);

  const rows = (templates as Template[] | null) ?? [];
  const exportRows = rows.map((t) => ({
    name: t.name,
    category: t.category ?? "",
    approval_status: t.approval_status,
    created_at: t.created_at,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Template Management</h1>
      <p className="mt-1 text-sm text-slate-500">
        WhatsApp templates submitted to Meta via Interakt&apos;s API, tracked here — never
        in Interakt&apos;s own dashboard.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total templates" value={total ?? 0} icon={FileText} />
        <StatCard label="Draft" value={draft ?? 0} icon={PenLine} />
        <StatCard label="Pending approval" value={pending ?? 0} icon={Clock} />
        <StatCard label="Approved" value={approved ?? 0} icon={CheckCircle2} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            New template
          </h2>
          <form
            action={createTemplate}
            className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <label htmlFor="template-name" className="block text-xs font-medium text-slate-600">
                Name
              </label>
              <input
                id="template-name"
                type="text"
                name="name"
                required
                placeholder="fee_reminder_v2"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="template-category"
                className="block text-xs font-medium text-slate-600"
              >
                Category
              </label>
              <select
                id="template-category"
                name="category"
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
              >
                <option value="UTILITY">Utility</option>
                <option value="MARKETING">Marketing</option>
                <option value="AUTHENTICATION">Authentication</option>
              </select>
            </div>
            <div>
              <label htmlFor="template-body" className="block text-xs font-medium text-slate-600">
                Body
              </label>
              <textarea
                id="template-body"
                name="body"
                required
                rows={5}
                placeholder={"Hi {{1}}, your admission fee of {{2}} is due on {{3}}."}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-400">
                Use {"{{1}}"}, {"{{2}}"}… for variables, per Meta template rules.
              </p>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Save draft
            </button>
          </form>
        </section>

        <section className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              All templates
            </h2>
          </div>
          <div className="mt-3">
            <TableToolbar
              searchPlaceholder="Search template name…"
              filters={[
                {
                  param: "status",
                  label: "All Status",
                  options: STATUSES.map((s) => ({ value: s, label: s })),
                },
              ]}
              exportRows={exportRows}
              exportFilename="templates.csv"
            />
          </div>
          <div className="mt-4 space-y-3">
            {rows.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">
                {searchTerm || activeStatus
                  ? "No templates match your search or filter."
                  : "No templates yet — create your first draft on the left."}
              </div>
            )}
            {rows.map((template) => (
              <div
                key={template.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{template.name}</p>
                    {template.category && (
                      <span className="text-xs uppercase tracking-wide text-slate-400">
                        {template.category}
                      </span>
                    )}
                    <Badge tone={STATUS_TONE[template.approval_status]} dot>
                      {template.approval_status}
                    </Badge>
                  </div>
                  {template.approval_status === "draft" && (
                    <form action={submitTemplateForApproval}>
                      <input type="hidden" name="template_id" value={template.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                      >
                        Submit for approval
                      </button>
                    </form>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {template.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
