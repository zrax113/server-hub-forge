import { createFileRoute } from "@tanstack/react-router";
import { ConfigGate } from "@/components/ConfigGate";
import { copyToClipboard, useServerStatus } from "@/lib/site-utils";
import { FAQ } from "@/components/FAQ";
import type { SiteConfig } from "@/lib/config";

export const Route = createFileRoute("/")({ component: () => <ConfigGate>{(c) => <Home config={c} />}</ConfigGate> });

function Home({ config }: { config: SiteConfig }) {
  const status = useServerStatus(config.server.statusApi, config.server.ip, config.features.serverStatus);

  return (
    <main>
      {/* HERO */}
      <section className="relative">
        {config.images.hero && (
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <img src={config.images.hero} alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          </div>
        )}
        <div className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono mb-8 reveal">
            <span className={`w-1.5 h-1.5 rounded-full ${status?.online ? "bg-green-400" : "bg-muted-foreground"}`} />
            {config.features.serverStatus
              ? status === null ? "Checking…"
                : status.online ? `Online · ${status.players?.online ?? 0}/${status.players?.max ?? 0} players`
                : "Offline"
              : "Live"}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight reveal">
            Welcome to <span className="text-primary">{config.brand.name}</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground reveal">{config.brand.tagline}</p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center reveal">
            <button
              onClick={() => copyToClipboard(config.server.ip)}
              className="group glass rounded-lg px-5 py-3.5 inline-flex items-center gap-4 hover:border-primary transition"
            >
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Server IP</div>
                <div className="font-mono text-primary">{config.server.ip}</div>
              </div>
              <span className="text-xs font-semibold text-primary border-l border-border pl-4 group-hover:translate-x-0.5 transition">COPY</span>
            </button>
            {config.features.store && config.links.store && (
              <a href={config.links.store} target="_blank" rel="noreferrer"
                 className="px-6 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
                Visit Store
              </a>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12 reveal">
          <div className="text-primary font-mono text-xs uppercase tracking-widest mb-2">Features</div>
          <h2 className="text-3xl md:text-4xl font-bold">Built for players who want more</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {config.images.features.map((f, i) => (
            <article key={i} className="reveal group glass rounded-xl overflow-hidden hover:border-primary transition">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={f.src} alt={f.title} loading="lazy"
                     className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="reveal mb-10">
          <div className="text-primary font-mono text-xs uppercase tracking-widest mb-2">Why us</div>
          <h2 className="text-3xl md:text-4xl font-bold">A server that respects your time</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {config.highlights.map((h, i) => (
            <div key={i} className="reveal glass p-5 rounded-xl text-left">
              <div className="text-primary font-semibold mb-1">{h.title}</div>
              <div className="text-sm text-muted-foreground">{h.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STORE CTA */}
      {config.features.store && config.links.store && (
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="reveal relative rounded-2xl overflow-hidden glass">
            {config.images.store && (
              <>
                <img src={config.images.store} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              </>
            )}
            <div className="relative p-10 md:p-14 text-center">
              <div className="text-primary font-mono text-xs uppercase tracking-widest mb-2">Store</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Support the server. Stand out.</h2>
              <p className="text-muted-foreground mb-7 max-w-md mx-auto">Cosmetic ranks, particles, and exclusive kits — fair, never pay-to-win.</p>
              <a href={config.links.store} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
                Open Store →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-20">
        <div className="text-center mb-10 reveal">
          <div className="text-primary font-mono text-xs uppercase tracking-widest mb-2">FAQ</div>
          <h2 className="text-3xl md:text-4xl font-bold">Questions, answered</h2>
        </div>
        <div className="reveal"><FAQ items={config.faq} /></div>
      </section>
    </main>
  );
}
