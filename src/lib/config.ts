export interface SiteConfig {
  brand: { name: string; tagline: string; logoEmoji?: string };
  server: { ip: string; statusApi?: string };
  links: { discord?: string; discordInviteCode?: string; discordApi?: string; store?: string; patreon?: string };
  features: { store: boolean; patreon: boolean; serverStatus: boolean; discordCounter: boolean };
  images: {
    hero?: string;
    store?: string;
    stats?: string;
    sunset?: string;
    features: { src: string; title: string; desc: string }[];
  };
  highlights: { title: string; desc: string }[];
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
