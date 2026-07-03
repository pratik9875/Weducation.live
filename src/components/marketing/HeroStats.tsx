const stats = [
  {
    value: "50%+",
    label: "Faster processing",
    tint: "#059669",
    tintBg: "#ecfdf5",
    icon: <path d="M13 2L4.5 13.5H11L9.5 22 19 10.5h-6.5z" strokeLinejoin="round" />,
  },
  {
    value: "70%",
    label: "Less manual work",
    tint: "#2563eb",
    tintBg: "#eff6ff",
    icon: (
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    value: "24×7",
    label: "Always-on assistant",
    tint: "#7c3aed",
    tintBg: "#f5f3ff",
    icon: (
      <path d="M4 13a8 8 0 0 1 16 0M4 13v3a2 2 0 0 0 2 2h1v-5H5.5M20 13v3a2 2 0 0 1-2 2h-1v-5h1.5M15 21h-2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export function HeroStats() {
  return (
    <dl className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="absolute inset-x-0 top-0 h-1" style={{ background: stat.tint }} />
          <div className="flex items-start justify-between">
            <dd className="text-3xl font-bold tracking-tight text-slate-900">{stat.value}</dd>
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
              style={{ background: stat.tintBg, color: stat.tint }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-4.5 w-4.5">
                {stat.icon}
              </svg>
            </div>
          </div>
          <dt className="mt-2 text-sm font-semibold text-slate-700">{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}
