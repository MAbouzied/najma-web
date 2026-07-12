import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { SITE } from "@/content/site";
import {
  AnalyticsNoScript,
  AnalyticsScripts,
} from "@/components/Analytics";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.tagline,
  icons: {
    icon: SITE.favicon,
    apple: SITE.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={SITE.locale} dir={SITE.direction} className={tajawal.variable}>
      <head>
        <AnalyticsScripts />
      </head>
      <body className="font-sans antialiased">
        <AnalyticsNoScript />
        {children}
      </body>
    </html>
  );
}
