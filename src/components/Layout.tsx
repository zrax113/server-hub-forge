import { Link } from "@tanstack/react-router";
import type { SiteConfig } from "@/lib/config";

export function Header({ config }: { config: SiteConfig }) {
  const links = [
    { to: "/", label: "Home" },
    ...(config.features.team ? [{ to: "/team", label: "Team" }] : []),
  ];
  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="text-primary text-xl">{config.brand.logoEmoji ?? "◆"}</span>
          <span>{config.brand.name}</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-muted-foreground hover:text-foreground transition"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
          {config.links.discord && (
            <a href={config.links.discord} target="_blank" rel="noreferrer"
               className="text-muted-foreground hover:text-foreground transition hidden sm:inline">
              Discord
            </a>
          )}
          {config.features.store && config.links.store && (
            <a href={config.links.store} target="_blank" rel="noreferrer"
               className="px-3.5 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">
              Store
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Footer({ config }: { config: SiteConfig }) {
  return (
    <footer className="border-t mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} {config.brand.name}</div>
        <div className="flex items-center gap-5">
          {config.links.discord && <a href={config.links.discord} target="_blank" rel="noreferrer" className="hover:text-primary">Discord</a>}
          {config.features.store && config.links.store && <a href={config.links.store} target="_blank" rel="noreferrer" className="hover:text-primary">Store</a>}
          {config.features.patreon && config.links.patreon && <a href={config.links.patreon} target="_blank" rel="noreferrer" className="hover:text-primary">Patreon</a>}
        </div>
      </div>
    </footer>
  );
}
