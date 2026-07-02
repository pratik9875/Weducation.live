export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard & Overview</h1>
      <p className="mt-1 text-sm text-slate-500">University-wide admission funnel metrics.</p>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm font-medium text-slate-600">
          Processing time, counselor workload, and real-time status visibility will surface
          here.
        </p>
      </div>
    </div>
  );
}
