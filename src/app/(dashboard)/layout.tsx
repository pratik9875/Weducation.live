import type { Metadata } from "next";

// Staff/admin/login are behind auth and excluded from robots.txt — this
// noindex is defense-in-depth in case a crawler ignores that.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
