import { useEffect, useState } from "react";

export interface SiteConfig {
  brand: { name: string; tagline: string; logoEmoji?: string };
  server: { ip: string; statusApi?: string; statusRefreshMs?: number };
  links: { discord?: string; store?: string; patreon?: string };
  features: { store: boolean; patreon: boolean; serverStatus: boolean };
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

export const fallbackConfig: SiteConfig = {
  brand: {
    name: "PurpleCraft",
    tagline: "A modern Minecraft server built for adventure, community, and chaos.",
    logoEmoji: "⬢",
  },
  server: {
    ip: "play.purplecraft.net",
    statusApi: "https://api.mcsrvstat.us/2/{ip}",
    statusRefreshMs: 45000,
  },
  links: {
    discord: "https://discord.gg/minecraft",
    store: "https://store.purplecraft.net",
    patreon: "https://patreon.com/purplecraft",
  },
  features: {
    store: true,
    patreon: false,
    serverStatus: true,
  },
  images: {
    hero: "/images/hero.jpg",
    store: "/images/store.jpg",
    stats: "/images/stats.jpg",
    sunset: "/images/sunset.jpg",
    features: [
      { src: "/images/feature-1.jpg", title: "Survival Reimagined", desc: "Custom mechanics, fresh biomes, and a thriving economy." },
      { src: "/images/feature-2.jpg", title: "Epic Dungeons", desc: "Tackle handcrafted trials with friends for legendary loot." },
      { src: "/images/feature-3.jpg", title: "Endless Worlds", desc: "Explore deep caves, lush peaks, and uncharted dimensions." },
    ],
  },
  highlights: [
    { title: "No Pay-to-Win", desc: "Cosmetics and perks only. Skill always wins." },
    { title: "24/7 Uptime", desc: "Hosted on premium hardware with daily backups." },
    { title: "Active Community", desc: "Weekly events, builds, and tournaments." },
    { title: "Friendly Staff", desc: "Real moderators, real fast responses." },
  ],
  faq: [
    { q: "What version do you support?", a: "We support the latest Minecraft Java Edition release with backwards compatibility down to 1.20." },
    { q: "Is there a whitelist?", a: "No whitelist — just connect with the IP and start playing." },
    { q: "Are mods required?", a: "No mods required. Optifine and shaders are fully supported but optional." },
    { q: "How do I report a player?", a: "Use the /report command in-game or open a ticket in our Discord server." },
  ],
};

let cached: SiteConfig | null = null;

function clampRefreshMs(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallbackConfig.server.statusRefreshMs ?? 45000;
  return Math.min(Math.max(n, 15000), 300000);
}

function mergeConfig(raw: Partial<SiteConfig> | null | undefined): SiteConfig {
  const merged: SiteConfig = {
    brand: { ...fallbackConfig.brand, ...(raw?.brand ?? {}) },
    server: { ...fallbackConfig.server, ...(raw?.server ?? {}) },
    links: { ...fallbackConfig.links, ...(raw?.links ?? {}) },
    features: { ...fallbackConfig.features, ...(raw?.features ?? {}) },
    images: {
      ...fallbackConfig.images,
      ...(raw?.images ?? {}),
      features: raw?.images?.features?.length ? raw.images.features : fallbackConfig.images.features,
    },
    highlights: raw?.highlights?.length ? raw.highlights : fallbackConfig.highlights,
    faq: raw?.faq?.length ? raw.faq : fallbackConfig.faq,
  };

  merged.server.statusRefreshMs = clampRefreshMs(merged.server.statusRefreshMs);
  return merged;
}

export async function loadConfig(): Promise<SiteConfig> {
  if (cached) return cached;

  const candidates = Array.from(new Set([
    "/config.json",
    `${import.meta.env.BASE_URL}config.json`,
    "./config.json",
  ]));

  for (const path of candidates) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) continue;
      cached = mergeConfig((await res.json()) as Partial<SiteConfig>);
      return cached;
    } catch {
      continue;
    }
  }

  cached = mergeConfig(undefined);
  return cached;
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(fallbackConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadConfig()
      .then((next) => {
        if (!cancelled) setConfig(next);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { config, loading };
}
