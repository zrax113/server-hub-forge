import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { FAQ } from "@/components/FAQ";
import { type SiteConfig } from "@/lib/config";
import {
  BackToTop,
  ToastViewport,
  copyToClipboard,
  useMobileNav,
  useReveal,
  useServerStatus,
} from "@/lib/site-utils";

export function useSiteEffects() {
  useReveal();
}

export function SiteLayout({
  config,
  children,
}: {
  config: SiteConfig;
  children: ReactNode;
}) {
  const nav = useMobileNav();

  const links = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/status", label: "Status" },
    { to: "/faq", label: "FAQ" },
  ];

  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-18 w-full max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3 font-bold text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-2xl text-primary glow-ring">
              {config.brand.logoEmoji ?? "◆"}
            </span>
            <div className="leading-tight">
              <div>{config.brand.name}</div>
              <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">Minecraft Server</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {links.map((item) => (
              <Link key={item.to} to={item.to} activeProps={{ className: "text-foreground" }} className="transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {config.links.discord && (
              <a href={config.links.discord} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground transition hover:text-foreground">
                Discord
              </a>
            )}
            {config.features.store && config.links.store && (
              <a href={config.links.store} target="_blank" rel="noreferrer" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 glow-ring">
                Store
              </a>
            )}
          </div>

          <div className="md:hidden" ref={nav.ref}>
            <button aria-label="Menu" onClick={() => nav.setOpen(!nav.open)} className="flex h-11 w-11 items-center justify-center rounded-lg border border-border/70 bg-card/60">
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 bg-foreground" />
                <span className="block h-0.5 w-5 bg-foreground" />
                <span className="block h-0.5 w-5 bg-foreground" />
              </span>
            </button>
            {nav.open && (
              <div className="absolute right-4 top-16 flex min-w-[220px] flex-col gap-3 rounded-xl border border-border/70 bg-card/90 p-4 shadow-2xl backdrop-blur-xl">
                {links.map((item) => (
                  <Link key={item.to} to={item.to} onClick={nav.close} className="text-sm transition hover:text-primary">
                    {item.label}
                  </Link>
                ))}
                {config.links.discord && <a href={config.links.discord} target="_blank" rel="noreferrer" onClick={nav.close} className="text-sm transition hover:text-primary">Discord</a>}
                {config.features.store && config.links.store && (
                  <a href={config.links.store} target="_blank" rel="noreferrer" onClick={nav.close} className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground">
                    Store
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {children}

      <footer className="mt-16 border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-center text-sm text-muted-foreground md:flex-row md:text-left">
          <div className="flex items-center gap-2">
            <span className="text-primary">{config.brand.logoEmoji ?? "◆"}</span>
            <span>© {new Date().getFullYear()} {config.brand.name}</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/features" className="transition hover:text-primary">Features</Link>
            <Link to="/status" className="transition hover:text-primary">Status</Link>
            <Link to="/faq" className="transition hover:text-primary">FAQ</Link>
            {config.links.discord && <a href={config.links.discord} target="_blank" rel="noreferrer" className="transition hover:text-primary">Discord</a>}
            {config.features.store && config.links.store && <a href={config.links.store} target="_blank" rel="noreferrer" className="transition hover:text-primary">Store</a>}
          </div>
        </div>
      </footer>

      <ToastViewport />
      <BackToTop />
    </div>
  );
}

export function HeroSection({ config }: { config: SiteConfig }) {
  const { data: status, loading } = useServerStatus(
    config.server.statusApi,
    config.server.ip,
    config.features.serverStatus,
    config.server.statusRefreshMs,
  );

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-35" />
      {config.images.hero && (
        <div className="absolute inset-0 -z-10">
          <img src={config.images.hero} alt={config.brand.name} className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/55 to-background" />
        </div>
      )}

      <div className="mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div className="text-center lg:text-left">
          <div className="reveal inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs font-mono uppercase tracking-[0.24em] text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${status?.online ? "bg-green-400 animate-pulse-glow" : "bg-muted-foreground"}`} />
            {loading ? "Checking server" : status?.online ? "Server online" : "Server offline"}
          </div>

          <h1 className="reveal mt-6 text-5xl font-bold leading-[1.02] md:text-7xl">
            <span className="block">{config.brand.name}</span>
            <span className="text-primary text-glow">join the world.</span>
          </h1>

          <p className="reveal mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:mx-0 lg:text-xl">
            {config.brand.tagline}
          </p>

          <div className="reveal mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <button onClick={() => copyToClipboard(config.server.ip)} className="group flex min-h-15 items-center gap-4 rounded-xl border border-border/70 bg-card/70 px-5 py-4 text-left transition hover:-translate-y-0.5 hover:glow-ring">
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.24em] text-muted-foreground">Server IP</div>
                <div className="font-mono text-lg text-primary">{config.server.ip}</div>
              </div>
              <span className="border-l border-border pl-4 text-sm font-semibold text-primary transition group-hover:translate-x-1">COPY</span>
            </button>

            {config.features.store && config.links.store && (
              <a href={config.links.store} target="_blank" rel="noreferrer" className="inline-flex min-h-15 items-center justify-center rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition hover:opacity-90 glow-ring">
                Visit Store
              </a>
            )}
          </div>
        </div>

        <ServerStatusPanel config={config} compact={false} />
      </div>
    </section>
  );
}

export function ServerStatusPanel({ config, compact = false }: { config: SiteConfig; compact?: boolean }) {
  const { data: status, loading } = useServerStatus(
    config.server.statusApi,
    config.server.ip,
    config.features.serverStatus,
    config.server.statusRefreshMs,
  );

  return (
    <div className="reveal relative overflow-hidden rounded-2xl border border-border/70 bg-card/72 p-6 shadow-2xl backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.68_0.22_305_/_0.28),transparent_42%)]" />
      <div className="relative text-center lg:text-left">
        <div className="text-xs font-mono uppercase tracking-[0.24em] text-primary">Live server status</div>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">{compact ? "Status" : "Instant ping, real players, real version."}</h2>

        <div className="mt-8 flex flex-col items-center gap-6 lg:items-start">
          {loading ? (
            <div className="text-muted-foreground">Pinging {config.server.ip}…</div>
          ) : status?.online ? (
            <>
              <div className="flex items-center gap-4">
                {status.icon && <img src={status.icon} alt="Server icon" className="h-16 w-16 rounded-xl border border-border/70 bg-background/50 p-1" />}
                <div>
                  <div className="flex items-center justify-center gap-2 font-mono text-sm text-green-400 lg:justify-start">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse-glow" /> ONLINE
                  </div>
                  <div className="mt-1 font-mono text-primary">{status.hostname ?? config.server.ip}</div>
                </div>
              </div>

              <div className="grid w-full gap-4 sm:grid-cols-2">
                <MetricCard label="Players" value={`${status.players?.online ?? 0}/${status.players?.max ?? "?"}`} />
                <MetricCard label="Version" value={status.version ?? "—"} />
              </div>

              {status.motd && status.motd.length > 0 && (
                <div className="w-full rounded-xl border border-border/70 bg-background/45 px-4 py-3 font-mono text-sm text-muted-foreground whitespace-pre-line">
                  {status.motd.join("\n")}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 lg:items-start">
              <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-muted-foreground" /> OFFLINE
              </div>
              <div className="font-mono text-primary">{config.server.ip}</div>
              <div className="text-sm text-muted-foreground">We can’t reach the server right now.</div>
            </div>
          )}

          <button onClick={() => copyToClipboard(config.server.ip)} className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition hover:opacity-90">
            Copy IP
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/40 p-4 text-center lg:text-left">
      <div className="mb-1 text-xs font-mono uppercase tracking-[0.24em] text-muted-foreground">{label}</div>
      <div className="truncate text-xl font-bold text-primary">{value}</div>
    </div>
  );
}

export function FeaturesSection({ config }: { config: SiteConfig }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <div className="reveal mx-auto mb-14 max-w-2xl text-center">
        <div className="text-xs font-mono uppercase tracking-[0.24em] text-primary">Features</div>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">Built for players who want more.</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {config.images.features.map((feature, i) => (
          <article key={i} className="reveal group overflow-hidden rounded-2xl border border-border/70 bg-card/72 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:glow-ring">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={feature.src} alt={feature.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold">{feature.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
        {config.images.stats && (
          <div className="reveal overflow-hidden rounded-2xl border border-border/70 shadow-2xl animate-float">
            <img src={config.images.stats} alt="Gameplay preview" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="space-y-6">
          <div className="reveal">
            <div className="text-xs font-mono uppercase tracking-[0.24em] text-primary">Why us</div>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">A server that respects your time.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {config.highlights.map((item, i) => (
              <div key={i} className="reveal rounded-xl border border-border/70 bg-card/68 p-5 backdrop-blur-xl">
                <div className="font-bold text-primary">{item.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ config }: { config: SiteConfig }) {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-24">
      <div className="reveal mb-12 text-center">
        <div className="text-xs font-mono uppercase tracking-[0.24em] text-primary">FAQ</div>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">Questions, answered.</h1>
      </div>
      <div className="reveal">
        <FAQ items={config.faq} />
      </div>
    </section>
  );
}