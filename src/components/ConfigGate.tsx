import { useEffect, useState, type ReactNode } from "react";
import { loadConfig, type SiteConfig } from "@/lib/config";
import { ToastViewport, BackToTop, useReveal } from "@/lib/site-utils";
import { Header, Footer } from "@/components/Layout";

export function ConfigGate({ children }: { children: (config: SiteConfig) => ReactNode }) {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useReveal();
  useEffect(() => { loadConfig().then(setConfig).catch((e) => setErr(String(e))); }, []);

  if (err) return <div className="min-h-screen flex items-center justify-center text-destructive">Config error: {err}</div>;
  if (!config) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;

  return (
    <>
      <Header config={config} />
      {children(config)}
      <Footer config={config} />
      <ToastViewport />
      <BackToTop />
    </>
  );
}
