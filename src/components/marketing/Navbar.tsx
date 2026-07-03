import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/product", label: "Product" },
  { href: "/case-studies", label: "Case Studies" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="WEducation" width={195} height={65} priority />
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Staff Login
          </Link>
          <Link
            href="/request-demo"
            className="ml-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition-colors hover:bg-brand-700"
          >
            Request a Demo
          </Link>
        </div>
      </nav>
    </header>
  );
}
