const TONE_CLASSES: Record<"neutral" | "brand" | "warning" | "danger", string> = {
  neutral: "bg-slate-100 text-slate-600",
  brand: "bg-brand-100 text-brand-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
};

const DOT_CLASSES: Record<"neutral" | "brand" | "warning" | "danger", string> = {
  neutral: "bg-slate-400",
  brand: "bg-brand-600",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONE_CLASSES;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${TONE_CLASSES[tone]}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[tone]}`} />}
      {children}
    </span>
  );
}
