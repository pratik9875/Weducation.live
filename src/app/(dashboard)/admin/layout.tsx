import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

const links = [
  { href: "/admin", label: "Dashboard & Overview" },
  { href: "/admin/users", label: "User & Role Management" },
  { href: "/admin/templates", label: "Template Management" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getStaffUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/staff");

  return (
    <div className="flex min-h-screen">
      <Sidebar title="Admin Portal" links={links} user={user} />
      <main className="flex-1 bg-slate-50 p-8">{children}</main>
    </div>
  );
}
