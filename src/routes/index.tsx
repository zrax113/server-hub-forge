import { createFileRoute, useRouter } from "@tanstack/react-router";
import { HeroSection, SiteLayout, useSiteEffects } from "@/components/site-shell";
import { fallbackConfig, useSiteConfig } from "@/lib/config";

const homeFallback = {
  brand: {
    name: fallbackConfig.brand.name,
    tagline: fallbackConfig.brand.tagline,
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${homeFallback.brand.name} — Minecraft Server` },
      { name: "description", content: homeFallback.brand.tagline },
      { property: "og:title", content: `${homeFallback.brand.name} — Minecraft Server` },
      { property: "og:description", content: homeFallback.brand.tagline },
    ],
  }),
  component: HomePage,
  errorComponent: RouteError,
  notFoundComponent: () => <div className="p-10 text-center">Home page not found.</div>,
});

function HomePage() {
  const { config } = useSiteConfig();
  useSiteEffects();

  return (
    <SiteLayout config={config}>
      <HeroSection config={config} />
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
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}