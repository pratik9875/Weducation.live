import Link from "next/link";
import { WhatsAppPreview } from "@/components/marketing/WhatsAppPreview";

const modules = [
  {
    title: "AI Admission Assistant",
    description: "A Claude-powered assistant that speaks as your university, on WhatsApp.",
    icon: "💬",
  },
  {
    title: "Admission CRM & Lead Pipeline",
    description: "Every enquiry tracked from first message to enrolled student.",
    icon: "📋",
  },
  {
    title: "Document Verification",
    description: "Marksheets, ID proofs, and photos — verified without the back-and-forth.",
    icon: "📎",
  },
  {
    title: "Razorpay Fee Collection",
    description: "Secure payment links handed off automatically, reconciled by webhook.",
    icon: "💳",
  },
  {
    title: "Real-Time Analytics",
    description: "Live status visibility for every applicant, at every stage.",
    icon: "📊",
  },
];

const stats = [
  { value: "50%+", label: "faster admission processing" },
  { value: "70%", label: "less manual counselor workload" },
  { value: "24×7", label: "automated support, human handoff" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, var(--color-brand-50) 0%, transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16">
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                B2B SaaS for University Admissions
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Your admission funnel,{" "}
                <span className="text-brand-600">moving at WhatsApp speed.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 lg:mx-0">
                From first enquiry to fee payment, the entire student journey happens inside
                a conversation that speaks in your university&apos;s own voice —
                white-labeled, end to end.
              </p>
              <div className="mt-10 flex justify-center gap-4 lg:justify-start">
                <Link
                  href="/request-demo"
                  className="rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-700"
                >
                  Request a Demo
                </Link>
                <Link
                  href="/product"
                  className="rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-400 hover:bg-slate-50"
                >
                  Explore the Platform
                </Link>
              </div>
            </div>

            <WhatsAppPreview />
          </div>

          <dl className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-8 border-t border-slate-200 pt-10 text-center sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-3xl font-bold text-slate-900">{stat.value}</dt>
                <dd className="mt-1 text-sm text-slate-500">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              One platform, every stage of admissions
            </h2>
            <p className="mt-3 text-slate-600">
              Purpose-built modules that cover the full funnel — not a generic CRM with a
              WhatsApp plugin bolted on.
            </p>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <li
                key={module.title}
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <span className="text-2xl">{module.icon}</span>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">{module.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {module.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 rounded-2xl border border-slate-200 bg-white p-10 shadow-sm sm:grid-cols-2 sm:p-14">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Depth on one channel, not breadth across many
            </h2>
          </div>
          <p className="text-slate-600">
            Generic admissions CRMs treat WhatsApp as one channel among several. For us, the
            entire student journey — enquiry, application, document verification, fee
            payment, confirmation — happens inside WhatsApp, backed by an AI assistant built
            on your university&apos;s actual courses, fees, and policies.
          </p>
        </div>
      </section>
    </>
  );
}
