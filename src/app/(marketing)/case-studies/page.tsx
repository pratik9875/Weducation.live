import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real results from universities running admissions on WEducation.live — faster response times, higher conversion, and less manual follow-up.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <div>
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            Case Studies
          </span>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Proof, not promises
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Our first reference deployment is underway. Full case study details will be
            published here once the pilot goes live.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-brand-50/60 px-8 py-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              In Progress
            </span>
          </div>
          <div className="p-8 sm:p-10">
            <h2 className="text-xl font-semibold text-slate-900">
              Dr. P. A. Inamdar University, Pune
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              Multi-faculty higher-ed institution — Management, Engineering, Law, Education,
              Healthcare, Arts &amp; Science. End-to-end WhatsApp admissions rollout in
              progress.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Management", "Engineering", "Law", "Education", "Healthcare", "Arts & Science"].map(
                (faculty) => (
                  <span
                    key={faculty}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {faculty}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
