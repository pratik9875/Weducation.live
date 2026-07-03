import { redirect } from "next/navigation";
import { LayoutDashboard, ListChecks, ShieldCheck, Users } from "lucide-react";
import { getStaffUser } from "@/lib/auth";
import { Sidebar, type SidebarGroup } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

const iconClass = "h-4 w-4 shrink-0";

const groups: SidebarGroup[] = [
  {
    links: [
      { href: "/staff", label: "Overview", icon: <LayoutDashboard className={iconClass} /> },
    ],
  },
  {
    label: "Pipeline",
    links: [
      { href: "/staff/leads", label: "Lead Management", icon: <Users className={iconClass} /> },
      {
        href: "/staff/applications",
        label: "Application Review",
        icon: <ListChecks className={iconClass} />,
      },
      {
        href: "/staff/documents",
        label: "Document Verification",
        icon: <ShieldCheck className={iconClass} />,
      },
    ],
  },
];

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await getStaffUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar title="Staff Portal" groups={groups} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 bg-slate-50 p-8">{children}</main>
      </div>
    </div>
  );
}
