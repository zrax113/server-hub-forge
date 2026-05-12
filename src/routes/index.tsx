import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadConfig, type SiteConfig } from "@/lib/config";
import {
  ToastViewport, BackToTop, copyToClipboard,
  useReveal, useServerStatus, useDiscordCount, useMobileNav,
} from "@/lib/site-utils";
import { FAQ } from "@/components/FAQ";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    loadConfig().then(setConfig).catch((e) => setErr(String(e)));
  }, []);

  if (err) return <div className="min-h-screen flex items-center justify-center text-destructive">Config error: {err}</div>;
  if (!config) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  return <Site config={config} />;
}

function Site({ config }: { config: SiteConfig }) {
  useReveal();
  const status = useServerStatus(config.server.statusApi, config.features.serverStatus);
  const discordCount = useDiscordCount(config.links.discordApi, config.links.discordInviteCode, config.features.discordCounter);
  const nav = useMobileNav();

  const sections = [
    { id: "features", label: "Features" },
    { id: "stats", label: "Stats" },
    ...(config.features.store && config.links.store ? [{ id: "store", label: "Store" }] : []),
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="min-h-screen text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-primary text-2xl text-glow">{config.brand.logoEmoji ?? "◆"}</span>
            <span>{config.brand.name}</span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="hover:text-foreground transition">{s.label}</a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            {config.links.discord && (
              <a href={config.links.discord} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition">
                Discord {discordCount !== null && <span className="text-primary">· {discordCount.toLocaleString()}</span>}
              </a>
            )}
            {config.features.store && config.links.store && (
              <a href={config.links.store} target="_blank" rel="noreferrer"
                 className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition glow-ring">
                Store
              </a>
            )}
          </div>
          <div className="md:hidden" ref={nav.ref}>
            <button aria-label="Menu" onClick={() => nav.setOpen(!nav.open)} className="p-2">
              <span className="block w-6 h-0.5 bg-foreground mb-1.5" />
              <span className="block w-6 h-0.5 bg-foreground mb-1.5" />
              <span className="block w-6 h-0.5 bg-foreground" />
            </button>
            {nav.open && (
              <div className="absolute right-4 top-16 glass rounded-xl p-4 min-w-[200px] flex flex-col gap-3">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} onClick={nav.close} className="text-sm hover:text-primary">{s.label}</a>
                ))}
                {config.links.discord && <a href={config.links.discord} target="_blank" rel="noreferrer" onClick={nav.close} className="text-sm hover:text-primary">Discord</a>}
                {config.features.store && config.links.store && (
                  <a href={config.links.store} target="_blank" rel="noreferrer" onClick={nav.close}
                     className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm text-center font-semibold">Store</a>
                )}
                {config.features.patreon && config.links.patreon && (
                  <a href={config.links.patreon} target="_blank" rel="noreferrer" onClick={nav.close} className="text-sm hover:text-primary">Patreon</a>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        {config.images.hero && (
          <div className="absolute inset-0 -z-10">
            <img src={config.images.hero} alt="" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono mb-6 reveal">
              <span className={`w-2 h-2 rounded-full ${status?.online ? "bg-green-400 animate-pulse-glow" : "bg-muted-foreground"}`} />
              {config.features.serverStatus
                ? status === null ? "Checking server…"
                  : status.online ? `ONLINE · ${status.players?.online ?? 0}/${status.players?.max ?? "?"} players`
                  : "OFFLINE"
                : "LIVE"}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] reveal">
              Welcome to <span className="text-primary text-glow">{config.brand.name}</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl reveal">{config.brand.tagline}</p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 reveal">
              <button
                onClick={() => copyToClipboard(config.server.ip)}
                className="group glass glow-ring rounded-xl px-5 py-4 flex items-center gap-4 hover:scale-[1.02] transition"
              >
                <div className="text-left">
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Server IP</div>
                  <div className="font-mono text-lg text-primary">{config.server.ip}</div>
                </div>
                <span className="text-primary font-semibold text-sm border-l border-border pl-4 group-hover:translate-x-1 transition">COPY</span>
              </button>
              {config.features.store && config.links.store && (
                <a href={config.links.store} target="_blank" rel="noreferrer"
                   className="px-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition glow-ring animate-pulse-glow">
                  Visit Store →
                </a>
              )}
              {config.features.patreon && config.links.patreon && (
                <a href={config.links.patreon} target="_blank" rel="noreferrer"
                   className="px-6 py-4 rounded-xl glass font-semibold flex items-center justify-center hover:text-primary transition">
                  Patreon
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-14 reveal">
          <div className="text-primary font-mono text-xs uppercase tracking-widest mb-3">// Features</div>
          <h2 className="text-4xl md:text-5xl font-bold">Built for players who want more.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {config.images.features.map((f, i) => (
            <article key={i} className="reveal group glass rounded-2xl overflow-hidden hover:glow-ring transition">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={f.src} alt={f.title} loading="lazy"
                     className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* STATS / HIGHLIGHTS */}
      <section id="stats" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {config.images.stats && (
            <div className="reveal relative rounded-3xl overflow-hidden glow-ring animate-float">
              <img src={config.images.stats} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent" />
            </div>
          )}
          <div className="space-y-6">
            <div className="reveal">
              <div className="text-primary font-mono text-xs uppercase tracking-widest mb-3">// Why us</div>
              <h2 className="text-4xl md:text-5xl font-bold">A server that respects your time.</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {config.highlights.map((h, i) => (
                <div key={i} className="reveal glass p-5 rounded-xl">
                  <div className="text-primary font-bold mb-1">{h.title}</div>
                  <div className="text-sm text-muted-foreground">{h.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STORE CTA */}
      {config.features.store && config.links.store && (
        <section id="store" className="max-w-7xl mx-auto px-6 py-24">
          <div className="reveal relative rounded-3xl overflow-hidden glow-ring">
            {config.images.store && <img src={config.images.store} alt="" className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
            <div className="relative p-10 md:p-16 max-w-2xl">
              <div className="text-primary font-mono text-xs uppercase tracking-widest mb-3">// Store</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Support the server. Stand out.</h2>
              <p className="text-muted-foreground mb-8">Cosmetic ranks, particle trails, exclusive kits — everything fair, nothing pay-to-win.</p>
              <a href={config.links.store} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
                Open Store →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-12 reveal">
          <div className="text-primary font-mono text-xs uppercase tracking-widest mb-3">// FAQ</div>
          <h2 className="text-4xl md:text-5xl font-bold">Questions, answered.</h2>
        </div>
        <div className="reveal"><FAQ items={config.faq} /></div>
      </section>

      {/* FOOTER */}
      <footer className="border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-primary">{config.brand.logoEmoji ?? "◆"}</span>
            <span>© {new Date().getFullYear()} {config.brand.name}</span>
          </div>
          <div className="flex items-center gap-5">
            {config.links.discord && <a href={config.links.discord} target="_blank" rel="noreferrer" className="hover:text-primary">Discord</a>}
            {config.features.store && config.links.store && <a href={config.links.store} target="_blank" rel="noreferrer" className="hover:text-primary">Store</a>}
            {config.features.patreon && config.links.patreon && <a href={config.links.patreon} target="_blank" rel="noreferrer" className="hover:text-primary">Patreon</a>}
          </div>
        </div>
      </footer>

      <ToastViewport />
      <BackToTop />
    </div>
  );
}
