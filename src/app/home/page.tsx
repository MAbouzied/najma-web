import { PageShell } from "@/components/layout/PageShell";
import { HomeView } from "@/components/pages/HomeView";
import { PAGES } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: PAGES.home.title,
  description: PAGES.home.description,
  path: "/home/",
});

export default function LegacyHomePage() {
  return (
    <PageShell>
      <HomeView />
    </PageShell>
  );
}
