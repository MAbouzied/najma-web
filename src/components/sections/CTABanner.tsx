import { SITE } from "@/content/site";
import { Button } from "@/components/ui/Button";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-l from-gold via-gold-dark to-burgundy py-16 md:py-20">
      <div
        className="absolute inset-0 opacity-10"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h2 className="mb-4 text-3xl font-extrabold text-white md:text-4xl">
          جاهز لتجربة الاسترخاء؟
        </h2>
        <p className="mb-8 text-lg text-white/90">
          احجز موعدك الآن عبر واتساب أو اتصل بنا مباشرة — فريقنا في انتظارك
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href={SITE.whatsappUrl} variant="primary" external className="!bg-burgundy-dark hover:!bg-burgundy">
            تواصل عبر واتساب
          </Button>
          <Button href="/contact/" variant="outline">
            معلومات التواصل
          </Button>
        </div>
      </div>
    </section>
  );
}
