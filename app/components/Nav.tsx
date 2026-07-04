import Link from "next/link";
import { Logo } from "./Logo";
import { ConsultTrigger } from "./ConsultTrigger";

const LINKS = [
  { label: "Services", href: "#capabilities" },
  { label: "Solutions", href: "#capabilities" },
  { label: "About", href: "#about" },
];

export function Nav() {
  return (
    <header className="border-b border-white/7">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-5 sm:px-6 md:gap-7 md:px-12">
        <Logo />
        <nav className="hidden items-center gap-6.5 text-sm font-medium text-nav-link md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-nav-link no-underline transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <ConsultTrigger className="text-nav-link no-underline transition-colors hover:text-white">
            Contact
          </ConsultTrigger>
        </nav>
        <div className="flex shrink-0 items-center gap-2.5 md:gap-3.5">
          <Link
            href="#client-login"
            className="hidden shrink-0 rounded-[9px] border border-white/20 px-4 py-2.5 text-[13.5px] font-semibold whitespace-nowrap text-foreground no-underline transition-colors hover:bg-white/6 sm:inline-block"
          >
            Client Login
          </Link>
          <ConsultTrigger className="shrink-0 rounded-[9px] bg-accent px-4.5 py-2.5 text-[13.5px] font-semibold whitespace-nowrap text-white transition-[filter] hover:brightness-110">
            Get started
          </ConsultTrigger>
        </div>
      </div>
    </header>
  );
}
