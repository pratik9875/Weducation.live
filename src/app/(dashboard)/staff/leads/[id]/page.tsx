import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  Application,
  ApplicationStatus,
  Lead,
  LeadStage,
  MessageDirection,
  StaffUser,
} from "@/types/database";
import { Badge } from "@/components/dashboard/Badge";
import { InlineSelectForm } from "@/components/dashboard/InlineSelectForm";
import { assignLeadCounselor, updateLeadStage } from "../../actions";

const STAGES: LeadStage[] = [
  "new",
  "engaged",
  "application_started",
  "application_submitted",
  "admitted",
  "lost",
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

type ApplicationWithCourse = Application & { courses: { name: string } | null };
type ConversationMessage = {
  id: string;
  direction: MessageDirection;
  content: string;
  created_at: string;
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).single();
  if (!lead) notFound();
  const leadRow = lead as Lead;

  const [{ data: counselors }, { data: applications }, { data: conversations }] =
    await Promise.all([
      supabase
        .from("users")
        .select("*")
        .in("role", ["counselor", "admission_manager"])
        .order("name"),
      supabase
        .from("applications")
        .select("*, courses(name)")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
      supabase.from("conversations").select("id").eq("lead_id", id),
    ]);

  const conversationIds = ((conversations as { id: string }[] | null) ?? []).map((c) => c.id);
  const { data: messages } = conversationIds.length
    ? await supabase
        .from("messages")
        .select("id, direction, content, created_at")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: true })
        .limit(100)
    : { data: [] };

  const counselorRows = (counselors as StaffUser[] | null) ?? [];
  const appRows = (applications as ApplicationWithCourse[] | null) ?? [];
  const messageRows = (messages as ConversationMessage[] | null) ?? [];

  return (
    <div>
      <Link href="/staff/leads" className="text-sm font-medium text-brand-700 hover:underline">
        ← Back to leads
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{leadRow.name ?? "Unknown lead"}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {leadRow.phone}
            {leadRow.source ? ` · via ${leadRow.source}` : ""} · arrived{" "}
            {new Date(leadRow.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <InlineSelectForm
            action={updateLeadStage}
            hiddenFields={{ lead_id: leadRow.id }}
            name="stage"
            value={leadRow.stage}
            options={STAGES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))}
            ariaLabel="Lead stage"
          />
          <InlineSelectForm
            action={assignLeadCounselor}
            hiddenFields={{ lead_id: leadRow.id }}
            name="counselor_id"
            value={leadRow.assigned_counselor_id ?? ""}
            options={[
              { value: "", label: "Unassigned" },
              ...counselorRows.map((c) => ({ value: c.id, label: c.name })),
            ]}
            ariaLabel="Assigned counselor"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Applications
          </h2>
          <div className="mt-3 space-y-3">
            {appRows.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-400">
                No applications started yet.
              </div>
            )}
            {appRows.map((app) => (
              <Link
                key={app.id}
                href={`/staff/applications/${app.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-300"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">
                    {app.courses?.name ?? "Unknown course"}
                  </p>
                  <Badge tone={STATUS_TONE[app.status]}>{app.status.replace(/_/g, " ")}</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {app.application_number ?? "No application number"} · started{" "}
                  {new Date(app.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            WhatsApp conversation
          </h2>
          <div className="mt-3 max-h-[28rem] space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {messageRows.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">No messages recorded yet.</p>
            )}
            {messageRows.map((message) => (
              <div
                key={message.id}
                className={message.direction === "inbound" ? "flex" : "flex justify-end"}
              >
                <div
                  className={
                    message.direction === "inbound"
                      ? "max-w-[80%] rounded-lg rounded-tl-none bg-slate-100 px-3 py-2 text-sm text-slate-800"
                      : "max-w-[80%] rounded-lg rounded-tr-none bg-brand-50 px-3 py-2 text-sm text-slate-800"
                  }
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="mt-1 text-right text-[10px] text-slate-400">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
