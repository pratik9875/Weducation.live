import type { Metadata } from "next";
import { DemoRequestForm } from "@/components/marketing/DemoRequestForm";

export const metadata: Metadata = {
  title: "Request a Demo",
  description:
    "See WEducation.live's AI Admission Assistant and Staff & Admin portals live, and get a rollout timeline scoped to your intake calendar.",
  alternates: { canonical: "/request-demo" },
};

const bullets = [
  "See the AI Admission Assistant handle a real enquiry, live",
  "Walk through the Staff & Admin portals for your team",
  "Get a rollout timeline scoped to your intake calendar",
];

export default function RequestDemoPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-6 py-20 sm:grid-cols-2 sm:items-center">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          Request a Demo
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          See it running on your own courses
        </h1>
        <p className="mt-4 text-slate-600">
          Tell us about your institution and we&apos;ll walk you through the platform.
        </p>
        <ul className="mt-8 space-y-3">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                ✓
              </span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <DemoRequestForm />
      </div>
    </div>
  );
}
