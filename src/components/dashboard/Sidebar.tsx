"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <Image src="/logo.png" alt="WEducation" width={110} height={37} priority />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </p>
        <div className="mt-3 flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            {user.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs capitalize text-slate-400">{user.role.replace("_", " ")}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive
                  ? "block rounded-md bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700"
                  : "block rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
