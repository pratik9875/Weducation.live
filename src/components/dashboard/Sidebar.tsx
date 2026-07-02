import Link from "next/link";
import type { StaffUser } from "@/types/database";

export interface SidebarLink {
  href: string;
  label: string;
}

export function Sidebar({
  title,
  links,
  user,
}: {
  title: string;
  links: SidebarLink[];
  user: StaffUser;
}) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{user.name}</p>
        <p className="text-xs capitalize text-slate-400">{user.role.replace("_", " ")}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
