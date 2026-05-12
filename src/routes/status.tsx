import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ServerStatusPanel, SiteLayout, useSiteEffects } from "@/components/site-shell";
import { fallbackConfig, useSiteConfig } from "@/lib/config";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: `Server Status — ${fallbackConfig.brand.name}` },
      { name: "description", content: "Check live Minecraft server status, online players, version, and current MOTD." },
      { property: "og:title", content: `Server Status — ${fallbackConfig.brand.name}` },
      { property: "og:description", content: "Check live Minecraft server status, online players, version, and current MOTD." },
    ],
  }),
  component: StatusPage,
  errorComponent: RouteError,
  notFoundComponent: () => <div className="p-10 text-center">Status page not found.</div>,
});

function StatusPage() {
  const { config } = useSiteConfig();
  useSiteEffects();

  return (
    <SiteLayout config={config}>
      <section className="mx-auto w-full max-w-4xl px-6 py-24">
        <ServerStatusPanel config={config} compact />
      </section>
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