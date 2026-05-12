import { createFileRoute } from "@tanstack/react-router";
import { ConfigGate } from "@/components/ConfigGate";
import { resolveSkinUrl, type SiteConfig } from "@/lib/config";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Meet the staff" },
      { name: "description", content: "Meet the team behind the server." },
    ],
  }),
  component: () => <ConfigGate>{(c) => <Team config={c} />}</ConfigGate>,
});

function Team({ config }: { config: SiteConfig }) {
  if (!config.features.team) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-32 text-center text-muted-foreground">
        Team page is disabled.
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-14 reveal">
        <div className="text-primary font-mono text-xs uppercase tracking-widest mb-2">Team</div>
        <h1 className="text-4xl md:text-5xl font-bold">Meet the crew</h1>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          The people keeping {config.brand.name} alive, fair, and fun.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {config.team.map((m, i) => {
          const skin = resolveSkinUrl(config, m);
          return (
            <article key={i} className="reveal glass rounded-xl p-6 text-center hover:border-primary transition">
              <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden bg-muted ring-1 ring-border" style={{ imageRendering: "pixelated" as const }}>
                {skin ? (
                  <img src={skin} alt={m.name} loading="lazy"
                       className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-muted-foreground">?</div>
                )}
              </div>
              <h3 className="font-semibold">{m.name}</h3>
              <div className="text-xs text-primary font-mono uppercase tracking-wider mt-0.5">{m.role}</div>
              {m.bio && <p className="text-sm text-muted-foreground mt-3">{m.bio}</p>}
            </article>
          );
        })}
      </div>
    </main>
  );
}
