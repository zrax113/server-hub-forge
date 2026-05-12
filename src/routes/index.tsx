import { createFileRoute } from "@tanstack/react-router";
import { loadConfig } from "@/lib/config";
import { HeroSection, SiteLayout, useSiteEffects } from "@/components/site-shell";

export const Route = createFileRoute("/")({
  loader: () => loadConfig(),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.brand.name} — Minecraft Server` },
      { name: "description", content: loaderData.brand.tagline },
      { property: "og:title", content: `${loaderData.brand.name} — Minecraft Server` },
      { property: "og:description", content: loaderData.brand.tagline },
    ],
  }),
  component: HomePage,
  errorComponent: ({ error, reset }) => <RouteError error={error as Error} reset={reset} />,
  notFoundComponent: () => <div className="p-10 text-center">Home page not found.</div>,
});

function HomePage() {
  const config = Route.useLoaderData();
  useSiteEffects();

  return (
    <SiteLayout config={config}>
      <HeroSection config={config} />
    </SiteLayout>
  );
}

function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">This page didn’t load.</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-6 rounded-lg bg-primary px-4 py-2 text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}