const PALETTE = [
  "bg-brand-100 text-brand-700",
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

function toneFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initial = name.trim()[0]?.toUpperCase() ?? "?";
  const dimensions = size === "sm" ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-xs";

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${dimensions} ${toneFor(name)}`}
    >
      {initial}
    </span>
  );
}
