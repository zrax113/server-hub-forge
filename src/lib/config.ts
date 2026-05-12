export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  mcName?: string;
  image?: string;
}

export interface SiteConfig {
  brand: { name: string; tagline: string; logoEmoji?: string };
  server: { ip: string; statusApi?: string };
  links: { discord?: string; store?: string; patreon?: string };
  features: { store: boolean; patreon: boolean; serverStatus: boolean; team: boolean };
  skinApi?: string;
  images: {
    hero?: string;
    store?: string;
    stats?: string;
    features: { src: string; title: string; desc: string }[];
  };
  highlights: { title: string; desc: string }[];
  team: TeamMember[];
  faq: { q: string; a: string }[];
}

let cached: SiteConfig | null = null;

export async function loadConfig(): Promise<SiteConfig> {
  if (cached) return cached;
  const res = await fetch("/config.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("Failed to load config.json");
  cached = (await res.json()) as SiteConfig;
  return cached;
}

export function resolveSkinUrl(cfg: SiteConfig, m: TeamMember): string | null {
  if (m.image) return m.image;
  if (m.mcName && cfg.skinApi) return cfg.skinApi.replace("{name}", encodeURIComponent(m.mcName));
  return null;
}
