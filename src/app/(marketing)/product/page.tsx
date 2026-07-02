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
    <div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li key={item} className="flex gap-3 text-sm text-slate-600">
            <span className="font-mono text-slate-400">{String(i + 1).padStart(2, "0")}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProductPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">The Platform</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        A single system covering the entire admission journey — the student experience
        inside WhatsApp, and the internal Staff / Admin portals your team runs it from.
      </p>

      <section className="mt-16">
        <h2 className="text-xl font-semibold text-slate-900">Student Journey (inside WhatsApp)</h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2">
          {studentJourney.map((step, i) => (
            <li
              key={step}
              className="flex gap-3 rounded-lg border border-slate-200 p-4 text-sm text-slate-700"
            >
              <span className="font-mono text-emerald-600">{String(i + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-12 sm:grid-cols-2">
        <ModuleList title="Staff Portal" items={staffModules} />
        <ModuleList title="Admin Portal" items={adminModules} />
      </section>
    </div>
  );
}
