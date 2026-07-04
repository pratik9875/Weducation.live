import Link from "next/link";
import { CheckCircle2, Clock, IndianRupee, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getStaffUser } from "@/lib/auth";
import type { Payment, PaymentStatus } from "@/types/database";
import { Avatar } from "@/components/dashboard/Avatar";
import { InlineSelectForm } from "@/components/dashboard/InlineSelectForm";
import { StatCard } from "@/components/dashboard/StatCard";
import { TableToolbar } from "@/components/dashboard/TableToolbar";
import { updatePaymentStatus } from "../actions";

const STATUSES: PaymentStatus[] = ["created", "authorized", "captured", "failed", "refunded"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

type PaymentRow = Payment & {
  applications: {
    application_number: string | null;
    leads: { name: string | null; phone: string } | null;
    courses: { name: string } | null;
  } | null;
};

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; sort?: string }>;
}) {
  const { status, q, sort } = await searchParams;
  const activeStatus = STATUSES.includes(status as PaymentStatus) ? (status as PaymentStatus) : null;
  const searchTerm = q?.trim() ?? "";
  const ascending = sort === "oldest";

  const supabase = await createClient();
  let query = supabase
    .from("payments")
    .select("*, applications(application_number, leads(name, phone), courses(name))")
    .order("created_at", { ascending })
    .limit(100);
  if (activeStatus) query = query.eq("status", activeStatus);
  if (searchTerm) query = query.ilike("gateway_ref", `%${searchTerm}%`);

  const [user, { data: payments }, { count: total }, { count: pending }, { count: failed }, captured] =
    await Promise.all([
      getStaffUser(),
      query,
      supabase.from("payments").select("*", { count: "exact", head: true }),
      supabase
        .from("payments")
        .select("*", { count: "exact", head: true })
        .in("status", ["created", "authorized"]),
      supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "failed"),
      supabase.from("payments").select("amount").eq("status", "captured"),
    ]);

  const rows = (payments as PaymentRow[] | null) ?? [];
  const canManage = user != null && ["admin", "finance"].includes(user.role);
  const statusOptions = STATUSES.map((s) => ({ value: s, label: s }));
  const totalCaptured = ((captured.data as { amount: number }[] | null) ?? []).reduce(
    (sum, p) => sum + Number(p.amount),
    0,
  );

  const exportRows = rows.map((p) => ({
    application_number: p.applications?.application_number ?? "",
    applicant: p.applications?.leads?.name ?? p.applications?.leads?.phone ?? "",
    amount: p.amount,
    status: p.status,
    gateway_ref: p.gateway_ref ?? "",
    created_at: p.created_at,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
      <p className="mt-1 text-sm text-slate-500">
        Fee payments collected via Razorpay payment links. Status updates automatically once
        Razorpay is connected — until then, {canManage ? "you" : "admins/finance"} can correct
        status manually here.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total payments" value={total ?? 0} icon={IndianRupee} />
        <StatCard label="Pending" value={pending ?? 0} icon={Clock} />
        <StatCard label="Failed" value={failed ?? 0} icon={XCircle} />
        <StatCard
          label="Captured"
          value={`₹${totalCaptured.toLocaleString("en-IN")}`}
          icon={CheckCircle2}
        />
      </div>

      <div className="mt-6">
        <TableToolbar
          searchPlaceholder="Search gateway reference…"
          filters={[{ param: "status", label: "All Status", options: statusOptions }]}
          sortOptions={SORT_OPTIONS}
          exportRows={exportRows}
          exportFilename="payments.csv"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Application</th>
              <th className="px-5 py-3">Applicant</th>
              <th className="px-5 py-3">Course</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                  {searchTerm || activeStatus
                    ? "No payments match your search or filter."
                    : "No payments recorded yet."}
                </td>
              </tr>
            )}
            {rows.map((payment) => (
              <tr key={payment.id} className="transition-colors hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">
                  <Link
                    href={`/staff/applications/${payment.application_id}`}
                    className="hover:underline"
                  >
                    {payment.applications?.application_number ?? payment.application_id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-5 py-3 text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      name={
                        payment.applications?.leads?.name ??
                        payment.applications?.leads?.phone ??
                        "?"
                      }
                      size="sm"
                    />
                    {payment.applications?.leads?.name ?? payment.applications?.leads?.phone ?? "—"}
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">{payment.applications?.courses?.name ?? "—"}</td>
                <td className="px-5 py-3 font-medium text-slate-900">
                  ₹{Number(payment.amount).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3">
                  {canManage ? (
                    <InlineSelectForm
                      action={updatePaymentStatus}
                      hiddenFields={{ payment_id: payment.id }}
                      name="status"
                      value={payment.status}
                      options={statusOptions}
                      ariaLabel={`Status for payment ${payment.id}`}
                    />
                  ) : (
                    <span className="capitalize text-slate-600">{payment.status}</span>
                  )}
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {new Date(payment.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
