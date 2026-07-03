import Link from "next/link";
import { CheckCircle2, Clock, FileWarning, Files } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getStaffUser } from "@/lib/auth";
import type { DocumentRecord } from "@/types/database";
import { Badge } from "@/components/dashboard/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { TableToolbar } from "@/components/dashboard/TableToolbar";
import { rejectDocument, verifyDocument } from "../actions";

type DocumentRow = DocumentRecord & {
  applications: {
    id: string;
    application_number: string | null;
    leads: { name: string | null; phone: string } | null;
  } | null;
};

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { q, sort } = await searchParams;
  const searchTerm = q?.trim() ?? "";
  const ascending = sort !== "newest";

  const supabase = await createClient();

  let query = supabase
    .from("documents")
    .select("*, applications(id, application_number, leads(name, phone))")
    .eq("status", "pending")
    .order("created_at", { ascending })
    .limit(50);
  if (searchTerm) query = query.ilike("type", `%${searchTerm}%`);

  const [user, { data: documents }, { count: pending }, { count: verified }, { count: rejected }, { count: total }] =
    await Promise.all([
      getStaffUser(),
      query,
      supabase.from("documents").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("documents").select("*", { count: "exact", head: true }).eq("status", "verified"),
      supabase.from("documents").select("*", { count: "exact", head: true }).eq("status", "rejected"),
      supabase.from("documents").select("*", { count: "exact", head: true }),
    ]);

  const rows = (documents as DocumentRow[] | null) ?? [];
  const canVerify =
    user != null && ["admin", "admission_manager", "document_verifier"].includes(user.role);

  const exportRows = rows.map((doc) => ({
    type: doc.type,
    applicant: doc.applications?.leads?.name ?? doc.applications?.leads?.phone ?? "",
    application_number: doc.applications?.application_number ?? "",
    status: doc.status,
    created_at: doc.created_at,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Document Verification</h1>
      <p className="mt-1 text-sm text-slate-500">
        Marksheets, ID proofs, and photos awaiting review — oldest first.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total documents" value={total ?? 0} icon={Files} />
        <StatCard label="Pending" value={pending ?? 0} icon={Clock} />
        <StatCard label="Verified" value={verified ?? 0} icon={CheckCircle2} />
        <StatCard label="Rejected" value={rejected ?? 0} icon={FileWarning} />
      </div>

      <div className="mt-6">
        <TableToolbar
          searchPlaceholder="Search document type…"
          sortOptions={[
            { value: "oldest", label: "Oldest First" },
            { value: "newest", label: "Newest First" },
          ]}
          exportRows={exportRows}
          exportFilename="documents.csv"
        />
      </div>

      {!canVerify && (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Your role can view this queue but not verify documents. Ask an admin for the
          document verifier role.
        </p>
      )}

      <div className="mt-4 space-y-4">
        {rows.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">
            {searchTerm ? "No documents match your search." : "No documents pending verification. 🎉"}
          </div>
        )}
        {rows.map((doc) => {
          const applicant =
            doc.applications?.leads?.name ?? doc.applications?.leads?.phone ?? "Unknown applicant";
          return (
            <div key={doc.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold capitalize text-slate-900">
                      {doc.type.replace(/_/g, " ")}
                    </p>
                    <Badge tone="warning" dot>
                      {doc.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {applicant}
                    {doc.applications && (
                      <>
                        {" · "}
                        <Link
                          href={`/staff/applications/${doc.applications.id}`}
                          className="font-medium text-brand-700 hover:underline"
                        >
                          {doc.applications.application_number ?? "application"}
                        </Link>
                      </>
                    )}
                    {" · uploaded "}
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={doc.cloudinary_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  Open file ↗
                </a>
              </div>

              {canVerify && (
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                  <form action={verifyDocument}>
                    <input type="hidden" name="document_id" value={doc.id} />
                    <button
                      type="submit"
                      className="rounded-md bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                    >
                      Verify
                    </button>
                  </form>
                  <form action={rejectDocument} className="flex flex-1 items-center gap-2">
                    <input type="hidden" name="document_id" value={doc.id} />
                    <input
                      type="text"
                      name="rejection_reason"
                      required
                      placeholder="Rejection reason (sent to the applicant)"
                      className="min-w-48 flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-md border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
