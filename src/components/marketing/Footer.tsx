import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Platform Overview" },
      { href: "/case-studies", label: "Case Studies" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { href: "/request-demo", label: "Request a Demo" },
      { href: "/login", label: "Staff Login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image src="/logo.png" alt="WEducation" width={130} height={44} className="opacity-90" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              White-labeled WhatsApp admissions for higher-ed institutions — the entire
              student journey, one conversation.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition-colors hover:text-brand-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-400">
          © {new Date().getFullYear()} WEducation.live — B2B admissions platform for higher
          education.
        </div>
      </div>
    </footer>
  );
}
