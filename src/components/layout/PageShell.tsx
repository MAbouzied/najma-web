import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CallButton, WhatsAppButton } from "@/components/widgets/FloatingButtons";

type PageShellProps = {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showFloatingButtons?: boolean;
};

export function PageShell({
  children,
  showHeader = true,
  showFooter = true,
  showFloatingButtons = true,
}: PageShellProps) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        تخطي إلى المحتوى
      </a>
      {showHeader && <Header />}
      <main id="main-content">{children}</main>
      {showFooter && <Footer />}
      {showFloatingButtons && (
        <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-3" aria-label="أزرار التواصل السريع">
          <WhatsAppButton />
          <CallButton />
        </div>
      )}
    </>
  );
}
