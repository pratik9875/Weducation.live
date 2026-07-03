"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export interface SidebarGroup {
  label?: string;
  links: SidebarLink[];
}

export function Sidebar({ title, groups }: { title: string; groups: SidebarGroup[] }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-6">
        <Image src="/logo.png" alt="WEducation" width={150} height={50} priority />
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
          Beta
        </span>
      </div>
      <p className="px-6 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((group, groupIndex) => (
          <div key={group.label ?? groupIndex}>
            {group.label && (
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.links.map((link) => {
                const isPortalRoot = link.href.split("/").filter(Boolean).length === 1;
                const isActive =
                  pathname === link.href ||
                  (!isPortalRoot && pathname.startsWith(`${link.href}/`));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={
                      isActive
                        ? "flex items-center gap-2.5 rounded-md bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700"
                        : "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    }
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
