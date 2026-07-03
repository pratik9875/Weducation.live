import Link from "next/link";
import { HeroStats } from "@/components/marketing/HeroStats";
import { WhatsAppPreview } from "@/components/marketing/WhatsAppPreview";

const modules = [
  {
    title: "AI Admission Assistant",
    description: "A Claude-powered assistant that speaks as your university, on WhatsApp.",
    icon: "chat",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
  {
    title: "Admission CRM & Lead Pipeline",
    description: "Every enquiry tracked from first message to enrolled student.",
    icon: "pipeline",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  },
  {
    title: "Document Verification",
    description: "Marksheets, ID proofs, and photos — verified without the back-and-forth.",
    icon: "clip",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
  },
  {
    title: "Razorpay Fee Collection",
    description: "Secure payment links handed off automatically, reconciled by webhook.",
    icon: "card",
    gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
  },
  {
    title: "Real-Time Analytics",
    description: "Live status visibility for every applicant, at every stage.",
    icon: "chart",
    gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
  },
];

const moduleIcons: Record<string, React.ReactNode> = {
  chat: (
    <path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.9A8 8 0 1 1 21 12z" strokeLinejoin="round" />
  ),
  pipeline: (
    <path d="M4 6h16M4 12h10M4 18h6M18 15v6M15 18h6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  clip: (
    <path d="M20 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L9.7 17.2a1.7 1.7 0 0 1-2.4-2.4L15 7" strokeLinecap="round" strokeLinejoin="round" />
  ),
  card: (
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M6 15h4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  chart: (
    <path d="M4 20V10M10 20V4M16 20v-8M21 20H3" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        {/* Layered background: brand wash + faint grid + green glows */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(70% 60% at 30% 0%, var(--color-brand-50) 0%, transparent 65%), radial-gradient(50% 45% at 90% 20%, rgba(37,211,102,0.10) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(75% 65% at 50% 0%, black 0%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(75% 65% at 50% 0%, black 0%, transparent 85%)",
          }}
        />
        {/* Corner dot-grid accent, tinted WhatsApp green */}
        <div
          className="pointer-events-none absolute -right-10 top-0 -z-10 h-80 w-80"
          style={{
            backgroundImage: "radial-gradient(circle, #25d366 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(circle at 100% 0%, black 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at 100% 0%, black 0%, transparent 70%)",
            opacity: 0.35,
          }}
        />
        {/* Glows framing the phone mockup */}
        <div className="pointer-events-none absolute right-[4%] top-1/4 -z-10 h-96 w-96 rounded-full bg-[#25d366]/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-brand-400/15 blur-3xl" />

        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16">
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur">
                <span className="animate-pulse-dot h-2 w-2 rounded-full bg-[#25d366]" />
                B2B SaaS for University Admissions
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.6rem] lg:leading-[1.08]">
                Everything the admission journey needs,{" "}
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-[#1fa855] bg-clip-text text-transparent">
                  in one system.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 lg:mx-0">
                The student experience lives inside WhatsApp. Your team runs it from
                purpose-built Staff and Admin portals. Nothing bolted on, nothing to stitch
                together.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link
                  href="/request-demo"
                  className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/35"
                >
                  Request a Demo
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="/product"
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md"
                >
                  Explore the Platform
                </Link>
              </div>
              <HeroStats />
            </div>

            <WhatsAppPreview />
          </div>
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
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Colorful illustrated header */}
                <div
                  className="relative flex h-24 items-center justify-center overflow-hidden"
                  style={{ background: module.gradient }}
                >
                  <div className="absolute -left-6 -top-8 h-20 w-20 rounded-full bg-white/15" />
                  <div className="absolute -bottom-10 -right-4 h-24 w-24 rounded-full bg-white/10" />
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white shadow-lg backdrop-blur-sm ring-1 ring-white/30 transition-transform group-hover:scale-110">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-6 w-6"
                    >
                      {moduleIcons[module.icon]}
                    </svg>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-base font-semibold text-slate-900">{module.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {module.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_1.2fr]">
          {/* Colorful illustrated panel */}
          <div
            className="relative flex items-center overflow-hidden px-10 py-14 sm:px-14"
            style={{ background: "linear-gradient(135deg, #059669 0%, #0d9488 55%, #0891b2 100%)" }}
          >
            <div className="absolute -left-10 -top-14 h-40 w-40 rounded-full bg-white/15" />
            <div className="absolute -bottom-16 -right-8 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute right-10 top-8 h-12 w-12 rounded-2xl bg-white/15" style={{ transform: "rotate(15deg)" }} />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg backdrop-blur-sm ring-1 ring-white/30">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-white sm:text-3xl">
                Depth on one channel, not breadth across many
              </h2>
            </div>
          </div>

          <div className="flex items-center px-10 py-14 sm:px-14">
            <p className="text-lg leading-relaxed text-slate-600">
              Generic admissions CRMs treat WhatsApp as one channel among several. For us, the
              entire student journey — enquiry, application, document verification, fee
              payment, confirmation — happens inside WhatsApp, backed by an AI assistant built
              on your university&apos;s actual courses, fees, and policies.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
