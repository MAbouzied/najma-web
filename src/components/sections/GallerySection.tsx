import Image from "next/image";
import { GALLERY_IMAGES } from "@/content/services";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GallerySection() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="معرض الصور"
          title="أجواء الاسترخاء"
          subtitle="استكشف مساحاتنا المصممة بعناية لراحتك وخصوصيتك"
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {GALLERY_IMAGES.map((src, i) => (
            <div
              key={src}
              className={`group relative overflow-hidden rounded-2xl ${
                i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto md:min-h-[400px]" : "aspect-square"
              }`}
            >
              <Image
                src={src}
                alt={`صورة من نجم سبا ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 33vw"}
              />
              <div className="absolute inset-0 bg-burgundy-dark/0 transition group-hover:bg-burgundy-dark/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
