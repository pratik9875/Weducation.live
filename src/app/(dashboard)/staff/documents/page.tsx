import { createClient } from "@/lib/supabase/server";
import type { DocumentRecord } from "@/types/database";
import { Badge } from "@/components/dashboard/Badge";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = (documents as DocumentRecord[] | null) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Document Verification</h1>
      <p className="mt-1 text-sm text-slate-500">Marksheets, ID proofs, and photos awaiting review.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Uploaded</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-slate-400">
                  No documents pending verification.
                </td>
              </tr>
            )}
            {rows.map((doc) => (
              <tr key={doc.id} className="transition-colors hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">
                  {doc.type.replace("_", " ")}
                </td>
                <td className="px-5 py-3">
                  <Badge tone="warning">{doc.status}</Badge>
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
