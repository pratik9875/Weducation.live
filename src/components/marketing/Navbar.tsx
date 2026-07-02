import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/product", label: "Product" },
  { href: "/case-studies", label: "Case Studies" },
];

export function Navbar() {
  return (
    <header className="border-b border-slate-200">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="WEducation" width={150} height={50} priority />
        </Link>
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Staff Login
          </Link>
          <Link
            href="/request-demo"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Request a Demo
          </Link>
        </div>
      </nav>
    </header>
  );
}
