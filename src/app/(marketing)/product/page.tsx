import type { Metadata } from "next";
import Link from "next/link";
import { HeroStats } from "@/components/marketing/HeroStats";
import { WhatsAppPreview } from "@/components/marketing/WhatsAppPreview";

export const metadata: Metadata = {
  title: "Product",
  description:
    "See how WEducation.live runs the entire admissions journey inside WhatsApp — lead capture, applications, document verification, and fee collection in one system.",
  alternates: { canonical: "/product" },
};

const studentJourney = [
  {
    title: "First contact & welcome",
    description: "A student messages your number and gets an instant, branded welcome.",
    icon: "chat",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
  {
    title: "Course enquiry & selection",
    description: "The assistant answers from your real course, fee, and eligibility data.",
    icon: "book",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  },
  {
    title: "Conversational application",
    description: "The form is filled chat-style — auto-saved at every step, no portal logins.",
    icon: "form",
    gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
  },
  {
    title: "Document upload",
    description: "Marksheets, ID proofs, and photos submitted as simple attachments.",
    icon: "clip",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
  },
  {
    title: "Real-time verification",
    description: "Students see status updates the moment your staff verify a document.",
    icon: "shield",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
  },
  {
    title: "Fee payment",
    description: "A secure Razorpay link in-chat, reconciled automatically by webhook.",
    icon: "card",
    gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
  },
  {
    title: "Admission confirmation",
    description: "Offer letter and confirmation delivered in the same conversation thread.",
    icon: "ribbon",
    gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
  },
  {
    title: "Notifications & reminders",
    description: "Automatic nudges for deadlines, pending documents, and next steps.",
    icon: "bell",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
  },
];

const staffModules = [
  "Lead Management",
  "Application Review",
  "Document Verification",
  "Communication & Outreach",
  "Fee & Payment Tracking",
  "Task & Follow-up Management",
  "Student Profiles",
  "Reports & Analytics",
];

const adminModules = [
  "Dashboard & Overview",
  "User & Role Management",
  "Course & Content Management",
  "Template Management",
  "Workflow & Automation",
  "Integration Management",
  "Reports & Business Insights",
  "System Settings & Security",
];

const iconPaths: Record<string, React.ReactNode> = {
  chat: (
    <path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.9A8 8 0 1 1 21 12z" strokeLinejoin="round" />
  ),
  book: (
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21zM4 18.5V5.5M8 7h8M8 10.5h5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  form: (
    <path d="M16.5 3.5l4 4L9 19H5v-4zM14 6l4 4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  clip: (
    <path d="M20 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L9.7 17.2a1.7 1.7 0 0 1-2.4-2.4L15 7" strokeLinecap="round" strokeLinejoin="round" />
  ),
  shield: (
    <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6zM9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  card: (
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M6 15h4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  ribbon: (
    <path d="M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM9 13l-1.5 7L12 17.5 16.5 20 15 13" strokeLinecap="round" strokeLinejoin="round" />
  ),
  bell: (
    <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6zM10 19a2 2 0 0 0 4 0" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

function StepIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
      {iconPaths[name]}
    </svg>
  );
}

function PortalCard({
  title,
  subtitle,
  items,
  gradient,
  dark = false,
}: {
  title: string;
  subtitle: string;
  items: string[];
  gradient: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${
        dark ? "border-slate-800 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      {/* Colorful illustrated header */}
      <div
        className="relative flex h-32 items-end overflow-hidden px-8 pb-5"
        style={{ background: gradient }}
      >
        <div className="absolute -left-8 -top-10 h-32 w-32 rounded-full bg-white/15" />
        <div className="absolute -right-6 -bottom-12 h-36 w-36 rounded-full bg-white/10" />
        <div className="absolute right-16 top-6 h-10 w-10 rounded-xl bg-white/15" style={{ transform: "rotate(15deg)" }} />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg backdrop-blur-sm ring-1 ring-white/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
              {dark ? (
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 21v-2a4 4 0 0 0-3-3.85M15.5 3.15a4 4 0 0 1 0 7.7" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-white drop-shadow-sm">{title}</h3>
        </div>
      </div>

      <div className="p-8 pt-6">
        <p className={`text-base ${dark ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</p>
        <ul className="mt-6 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[15px]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-brand-400" : "text-brand-500"}`}
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={dark ? "text-slate-300" : "text-slate-600"}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-200">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(70% 80% at 25% 0%, var(--color-brand-50) 0%, transparent 65%), radial-gradient(45% 55% at 90% 10%, rgba(37,211,102,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(70% 80% at 50% 0%, black 0%, transparent 90%)",
            WebkitMaskImage: "radial-gradient(70% 80% at 50% 0%, black 0%, transparent 90%)",
          }}
        />
        {/* Glow behind the phone mockup */}
        <div className="pointer-events-none absolute right-[4%] top-1/4 -z-10 h-96 w-96 rounded-full bg-[#25d366]/20 blur-3xl" />

        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-brand-700 shadow-sm backdrop-blur">
                <span className="animate-pulse-dot h-2 w-2 rounded-full bg-[#25d366]" />
                Platform Overview
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Everything the admission journey needs,{" "}
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-[#1fa855] bg-clip-text text-transparent">
                  in one system.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-600">
                The student experience lives inside WhatsApp. Your team runs it from
                purpose-built Staff and Admin portals. Nothing bolted on, nothing to stitch
                together.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
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
                  href="/case-studies"
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md"
                >
                  Read Case Studies
                </Link>
              </div>

              <HeroStats />
            </div>

            <WhatsAppPreview />
          </div>
        </div>
      </div>

      {/* Student Journey */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-600">
              Student journey
            </span>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Eight steps, one conversation
            </h2>
          </div>
          <p className="max-w-sm text-base text-slate-500">
            From first &ldquo;hi&rdquo; to enrolled student — without a single app download or
            portal password.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {studentJourney.map((step, i) => (
            <li
              key={step.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Colorful illustrated header */}
              <div
                className="relative flex h-28 items-center justify-center overflow-hidden"
                style={{ background: step.gradient }}
              >
                {/* Decorative shapes */}
                <div className="absolute -left-6 -top-8 h-24 w-24 rounded-full bg-white/15" />
                <div className="absolute -bottom-10 -right-4 h-28 w-28 rounded-full bg-white/10" />
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg backdrop-blur-sm ring-1 ring-white/30 transition-transform group-hover:scale-110">
                  <StepIcon name={step.icon} />
                </div>
                <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 font-mono text-xs font-bold text-white backdrop-blur-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold leading-snug text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Staff & Admin Portals */}
      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-600">
              Your side of the desk
            </span>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Staff & Admin portals
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Everything students do on WhatsApp lands here — reviewable, assignable, and
              measurable, with role-based access baked in.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <PortalCard
              title="Staff Portal"
              subtitle="Where counselors live day-to-day — leads in, admissions out."
              items={staffModules}
              gradient="linear-gradient(135deg, #10b981 0%, #0d9488 100%)"
            />
            <PortalCard
              title="Admin Portal"
              subtitle="Where management controls the machine — content, people, and policy."
              items={adminModules}
              gradient="linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)"
              dark
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="px-8 py-14 text-center sm:px-14">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              See the whole journey, live
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
              A 20-minute walkthrough on your own WhatsApp number — your courses, your fees,
              your brand.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
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
                href="/case-studies"
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md"
              >
                Read Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
