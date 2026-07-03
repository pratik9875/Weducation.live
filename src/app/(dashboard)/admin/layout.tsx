import { redirect } from "next/navigation";
import { LayoutDashboard, MessageSquareText, UserCog } from "lucide-react";
import { getStaffUser } from "@/lib/auth";
import { Sidebar, type SidebarGroup } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

const iconClass = "h-4 w-4 shrink-0";

const groups: SidebarGroup[] = [
  {
    links: [
      {
        href: "/admin",
        label: "Dashboard & Overview",
        icon: <LayoutDashboard className={iconClass} />,
      },
    ],
  },
  {
    label: "Administration",
    links: [
      {
        href: "/admin/users",
        label: "User & Role Management",
        icon: <UserCog className={iconClass} />,
      },
      {
        href: "/admin/templates",
        label: "Template Management",
        icon: <MessageSquareText className={iconClass} />,
      },
    ],
  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getStaffUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/staff");

  return (
    <div className="flex min-h-screen">
      <Sidebar title="Admin Portal" groups={groups} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 bg-slate-50 p-8">{children}</main>
      </div>
    </div>
  );
}
