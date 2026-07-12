import Image from "next/image";

type SiteLogoProps = {
  src: string;
  alt: string;
  size?: "header" | "hero" | "footer";
  priority?: boolean;
};

const sizes = {
  header: { box: "h-14 w-14 md:h-16 md:w-16", px: 64 },
  footer: { box: "h-14 w-14", px: 56 },
  hero: { box: "h-28 w-28 md:h-36 md:w-36", px: 144 },
};

export function SiteLogo({
  src,
  alt,
  size = "header",
  priority = false,
}: SiteLogoProps) {
  const { box, px } = sizes[size];

  return (
    <span className={`relative inline-block shrink-0 overflow-hidden ${box}`}>
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        priority={priority}
        className="h-full w-full object-contain"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </span>
  );
}
