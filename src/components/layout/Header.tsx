"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { NAV_ITEMS, SITE } from "@/content/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-cream-dark/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 lg:px-8">
        <Link href="/" className="shrink-0" aria-label={SITE.name}>
          <SiteLogo
            src={SITE.logoHeader}
            alt={SITE.logoAlt}
            size="header"
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="القائمة الرئيسية"
        >
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-gold/15 text-burgundy"
                    : "text-burgundy-dark hover:bg-cream hover:text-burgundy"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2 rounded-full bg-whatsapp px-5 py-2 text-sm font-bold text-white transition hover:brightness-110"
          >
            احجز الآن
          </a>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-cream-dark md:hidden"
          aria-label="فتح القائمة"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className={`block h-0.5 w-5 bg-burgundy-dark transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-burgundy-dark transition ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-burgundy-dark transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="border-t border-cream-dark bg-white px-6 py-4 md:hidden" aria-label="القائمة الجوال">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 font-bold text-burgundy-dark hover:bg-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block rounded-xl bg-whatsapp px-4 py-3 text-center font-bold text-white"
              >
                احجز عبر واتساب
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
