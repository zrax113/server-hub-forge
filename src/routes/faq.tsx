import { createFileRoute, useRouter } from "@tanstack/react-router";
import { FaqSection, SiteLayout, useSiteEffects } from "@/components/site-shell";
import { fallbackConfig, useSiteConfig } from "@/lib/config";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: `FAQ — ${fallbackConfig.brand.name}` },
      { name: "description", content: "Quick answers about versions, joining, rules, and how to get started on the server." },
      { property: "og:title", content: `FAQ — ${fallbackConfig.brand.name}` },
      { property: "og:description", content: "Quick answers about versions, joining, rules, and how to get started on the server." },
    ],
  }),
  component: FaqPage,
  errorComponent: RouteError,
  notFoundComponent: () => <div className="p-10 text-center">FAQ page not found.</div>,
});

function FaqPage() {
  const { config } = useSiteConfig();
  useSiteEffects();

  return (
    <SiteLayout config={config}>
      <FaqSection config={config} />
    </SiteLayout>
  );
}

function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">This page didn’t load.</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-lg bg-primary px-4 py-2 text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}