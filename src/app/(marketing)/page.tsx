import Link from "next/link";

const modules = [
  "AI Admission Assistant on WhatsApp",
  "Admission CRM & Lead Pipeline",
  "Document Verification Workflow",
  "Razorpay Fee Collection",
  "Real-Time Analytics & Reporting",
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          B2B SaaS for University Admissions
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Your admission funnel, moving at WhatsApp speed.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          WEducation.live is the white-labeled WhatsApp admissions platform for higher-ed
          institutions — from first enquiry to fee payment, entirely inside a conversation
          that speaks in your university&apos;s own voice.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/request-demo"
            className="rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Request a Demo
          </Link>
          <Link
            href="/product"
            className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Explore the Platform
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            One platform, every stage of admissions
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <li
                key={module}
                className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-medium text-slate-800"
              >
                {module}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-slate-900">Depth on one channel, not breadth across many</h2>
        <p className="mt-4 max-w-3xl text-slate-600">
          Generic admissions CRMs treat WhatsApp as one channel among several. For us, the
          entire student journey — enquiry, application, document verification, fee
          payment, confirmation — happens inside WhatsApp, backed by an AI assistant built
          on your university&apos;s actual courses, fees, and policies.
        </p>
      </section>
    </>
  );
}
