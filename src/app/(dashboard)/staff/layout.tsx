import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

const links = [
  { href: "/staff", label: "Overview" },
  { href: "/staff/leads", label: "Lead Management" },
  { href: "/staff/applications", label: "Application Review" },
  { href: "/staff/documents", label: "Document Verification" },
];

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await getStaffUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar title="Staff Portal" links={links} user={user} />
      <main className="flex-1 bg-slate-50 p-8">{children}</main>
    </div>
  );
}
