import { createClient } from "@/lib/supabase/server";
import type { StaffUser } from "@/types/database";
import { Badge } from "@/components/dashboard/Badge";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase.from("users").select("*").order("name");

  const rows = (users as StaffUser[] | null) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">User & Role Management</h1>
      <p className="mt-1 text-sm text-slate-500">Staff accounts and their assigned roles.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-slate-400">
                  No staff accounts yet.
                </td>
              </tr>
            )}
            {rows.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">{user.name}</td>
                <td className="px-5 py-3 text-slate-600">{user.email}</td>
                <td className="px-5 py-3">
                  <Badge tone={user.role === "admin" ? "brand" : "neutral"}>
                    {user.role.replace("_", " ")}
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
