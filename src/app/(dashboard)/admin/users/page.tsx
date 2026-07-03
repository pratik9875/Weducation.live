import { ShieldCheck, Users as UsersIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getStaffUser } from "@/lib/auth";
import type { AppRole, StaffUser } from "@/types/database";
import { Avatar } from "@/components/dashboard/Avatar";
import { Badge } from "@/components/dashboard/Badge";
import { InlineSelectForm } from "@/components/dashboard/InlineSelectForm";
import { StatCard } from "@/components/dashboard/StatCard";
import { TableToolbar } from "@/components/dashboard/TableToolbar";
import { updateUserRole } from "../actions";

const ROLES: AppRole[] = [
  "admin",
  "admission_manager",
  "counselor",
  "document_verifier",
  "finance",
  "registrar",
];

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { q, sort } = await searchParams;
  const searchTerm = q?.trim() ?? "";
  const ascending = sort !== "recent";

  const supabase = await createClient();
  let query = supabase.from("users").select("*").order("name", { ascending });
  if (searchTerm) query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);

  const [me, { data: users }, { count: total }, { count: admins }] = await Promise.all([
    getStaffUser(),
    query,
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "admin"),
  ]);

  const rows = (users as StaffUser[] | null) ?? [];
  const roleOptions = ROLES.map((role) => ({ value: role, label: role.replace(/_/g, " ") }));

  const exportRows = rows.map((user) => ({
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">User & Role Management</h1>
      <p className="mt-1 text-sm text-slate-500">
        Staff accounts and their assigned roles. Accounts are provisioned via Supabase Auth;
        roles are managed here.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Total staff" value={total ?? 0} icon={UsersIcon} />
        <StatCard label="Admins" value={admins ?? 0} icon={ShieldCheck} />
      </div>

      <div className="mt-6">
        <TableToolbar
          searchPlaceholder="Search name or email…"
          sortOptions={[
            { value: "az", label: "Name A–Z" },
            { value: "recent", label: "Recently joined" },
          ]}
          exportRows={exportRows}
          exportFilename="staff-users.csv"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                  {searchTerm ? "No staff match your search." : "No staff accounts yet."}
                </td>
              </tr>
            )}
            {rows.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={user.name} size="sm" />
                    {user.name}
                    {me?.id === user.id && (
                      <span className="text-xs font-normal text-slate-400">(you)</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">{user.email}</td>
                <td className="px-5 py-3">
                  {me?.id === user.id ? (
                    <Badge tone="brand">{user.role.replace(/_/g, " ")}</Badge>
                  ) : (
                    <InlineSelectForm
                      action={updateUserRole}
                      hiddenFields={{ user_id: user.id }}
                      name="role"
                      value={user.role}
                      options={roleOptions}
                      ariaLabel={`Role for ${user.name}`}
                    />
                  )}
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        You cannot change your own role — ask another admin.
      </p>
    </div>
  );
}
