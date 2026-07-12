import Image from "next/image";
import { SITE } from "@/content/site";

const links = [
  {
    key: "instagram",
    href: SITE.social.instagram,
    label: "Instagram",
    icon: "/assets/icons/instagram.svg",
  },
  {
    key: "twitter",
    href: SITE.social.twitter,
    label: "X (Twitter)",
    icon: "/assets/icons/x.svg",
  },
  {
    key: "snapchat",
    href: SITE.social.snapchat,
    label: "Snapchat",
    icon: "/assets/icons/snapchat.svg",
  },
];

type SocialLinksProps = {
  className?: string;
  variant?: "light" | "dark";
};

export function SocialLinks({ className = "", variant = "dark" }: SocialLinksProps) {
  const base =
    variant === "light"
      ? "bg-white/10 text-white hover:bg-gold hover:text-white"
      : "bg-cream-dark text-burgundy hover:bg-gold hover:text-white";

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {links.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${base}`}
        >
          <Image
            src={link.icon}
            alt=""
            width={20}
            height={20}
            className={`h-5 w-5 object-contain ${variant === "light" ? "brightness-0 invert" : ""}`}
            aria-hidden
          />
        </a>
      ))}
    </div>
  );
}
