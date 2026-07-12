import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "whatsapp";
  external?: boolean;
  className?: string;
};

const variants = {
  primary:
    "bg-burgundy text-white hover:bg-burgundy-dark shadow-lg shadow-burgundy/20",
  secondary:
    "bg-gold text-white hover:bg-gold-dark shadow-lg shadow-gold/25",
  outline:
    "border-2 border-white/80 text-white hover:bg-white/15 backdrop-blur-sm",
  whatsapp:
    "bg-whatsapp text-white hover:brightness-110 shadow-lg shadow-whatsapp/25",
};

export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold transition-all duration-300 hover:-translate-y-0.5 ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
