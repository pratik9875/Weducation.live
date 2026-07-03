"use client";

import { useRouter } from "next/navigation";
import { Bell, HelpCircle, LogOut, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { StaffUser } from "@/types/database";
import { Avatar } from "@/components/dashboard/Avatar";

export function Topbar({ user }: { user: StaffUser }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-6">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search anything…"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <Bell className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          aria-label="Help"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <HelpCircle className="h-[18px] w-[18px]" />
        </button>

        <div className="mx-1 h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-2.5 pl-1">
          <Avatar name={user.name} />
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none text-slate-900">{user.name}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
              {user.role.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sign out"
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}
