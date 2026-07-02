import { createClient } from "@/lib/supabase/server";
import type { DocumentRecord } from "@/types/database";

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
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Uploaded</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                  No documents pending verification.
                </td>
              </tr>
            )}
            {rows.map((doc) => (
              <tr key={doc.id}>
                <td className="px-4 py-3 capitalize">{doc.type.replace("_", " ")}</td>
                <td className="px-4 py-3 capitalize">{doc.status}</td>
                <td className="px-4 py-3">{new Date(doc.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
