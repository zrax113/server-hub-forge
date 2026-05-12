import { createFileRoute, useRouter } from "@tanstack/react-router";
import { FeaturesSection, SiteLayout, useSiteEffects } from "@/components/site-shell";
import { fallbackConfig, useSiteConfig } from "@/lib/config";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: `Features — ${fallbackConfig.brand.name}` },
      { name: "description", content: "Explore gameplay features, highlights, and what makes this Minecraft server worth joining." },
      { property: "og:title", content: `Features — ${fallbackConfig.brand.name}` },
      { property: "og:description", content: "Explore gameplay features, highlights, and what makes this Minecraft server worth joining." },
    ],
  }),
  component: FeaturesPage,
  errorComponent: RouteError,
  notFoundComponent: () => <div className="p-10 text-center">Features page not found.</div>,
});

function FeaturesPage() {
  const { config } = useSiteConfig();
  useSiteEffects();

  return (
    <SiteLayout config={config}>
      <FeaturesSection config={config} />
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