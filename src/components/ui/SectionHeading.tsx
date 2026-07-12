type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  centered?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {eyebrow && (
        <p
          className={`mb-2 text-sm font-bold tracking-widest uppercase ${
            light ? "text-gold-light" : "text-gold-dark"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl ${
          light ? "text-white" : "text-burgundy-dark"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mx-auto mt-4 max-w-2xl text-lg leading-relaxed ${
            light ? "text-white/85" : "text-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-5 h-1 w-16 rounded-full bg-gold ${
          centered ? "mx-auto" : ""
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
