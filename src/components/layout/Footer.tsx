import Link from "next/link";
import { NAV_ITEMS, SITE } from "@/content/site";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  return (
    <footer className="bg-burgundy-dark text-white" role="contentinfo">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4">
              <SiteLogo src={SITE.logoWhite} alt={SITE.logoAlt} size="footer" />
            </div>
            <p className="text-lg font-bold text-gold-light">{SITE.name}</p>
            <p className="mt-1 text-sm text-white/70">{SITE.tagline}</p>
            <p className="mt-3 text-sm text-white/60">{SITE.footerCredit}</p>
          </div>

          <nav aria-label="روابط التذييل">
            <p className="mb-4 font-bold text-gold-light">روابط سريعة</p>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/75 transition hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="#services" className="text-sm text-white/75 transition hover:text-gold">
                  خدماتنا
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="mb-4 font-bold text-gold-light">تواصل معنا</p>
            <div className="space-y-2 text-sm text-white/75">
              <a href={`tel:${SITE.phone}`} className="block hover:text-gold">{SITE.phoneIntl}</a>
              <a href={`mailto:${SITE.email}`} className="block hover:text-gold">{SITE.email}</a>
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="block leading-relaxed hover:text-gold">
                {SITE.address}
              </a>
            </div>
            <SocialLinks className="mt-5" variant="light" />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/50">
        © {new Date().getFullYear()} {SITE.name}. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
