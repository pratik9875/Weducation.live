export default function StaffOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
      <p className="mt-1 text-sm text-slate-500">Your admission funnel at a glance.</p>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm font-medium text-slate-600">
          Lead pipeline, pending reviews, and today&apos;s follow-ups will surface here.
        </p>
      </div>
    </div>
  );
}
