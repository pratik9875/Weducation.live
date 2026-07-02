const studentJourney = [
  "First contact & welcome",
  "Course enquiry & selection",
  "Online application form (conversational, auto-saved)",
  "Document upload (photos, marksheets, ID proofs)",
  "Verification status updates in real time",
  "Fee payment via secure Razorpay link",
  "Admission confirmation",
  "Notifications & reminders",
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

function ModuleList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <ul className="mt-4 space-y-1">
        {items.map((item, i) => (
          <li
            key={item}
            className="flex gap-3 rounded-md px-2 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
          >
            <span className="font-mono text-xs text-brand-500">
              {String(i + 1).padStart(2, "0")}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProductPage() {
  return (
    <div>
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            Platform
          </span>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Everything the admission journey needs
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            A single system covering the entire admission journey — the student experience
            inside WhatsApp, and the internal Staff / Admin portals your team runs it from.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-xl font-semibold text-slate-900">Student Journey (inside WhatsApp)</h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2">
          {studentJourney.map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 font-mono text-xs font-semibold text-brand-700">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-xl font-semibold text-slate-900">Staff & Admin Portals</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <ModuleList title="Staff Portal" items={staffModules} />
            <ModuleList title="Admin Portal" items={adminModules} />
          </div>
        </div>
      </section>
    </div>
  );
}
