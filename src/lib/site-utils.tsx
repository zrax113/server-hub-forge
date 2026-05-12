import { useEffect, useState, useCallback, useRef } from "react";

// ---------- Toast ----------
type Toast = { id: number; msg: string; type: "success" | "error" };
let toastListeners: ((t: Toast) => void)[] = [];
let toastId = 0;
export const toast = {
  success: (msg: string) => toastListeners.forEach((l) => l({ id: ++toastId, msg, type: "success" })),
  error: (msg: string) => toastListeners.forEach((l) => l({ id: ++toastId, msg, type: "error" })),
};

export function ToastViewport() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    const fn = (t: Toast) => {
      setItems((p) => [...p, t]);
      setTimeout(() => setItems((p) => p.filter((x) => x.id !== t.id)), 2800);
    };
    toastListeners.push(fn);
    return () => { toastListeners = toastListeners.filter((l) => l !== fn); };
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={`glass glow-ring px-4 py-3 rounded-lg text-sm font-medium animate-in slide-in-from-right-5 ${
            t.type === "success" ? "text-foreground" : "text-destructive-foreground"
          }`}
          style={{ borderColor: t.type === "error" ? "oklch(0.65 0.22 25)" : undefined }}
        >
          {t.type === "success" ? "✓ " : "⚠ "}{t.msg}
        </div>
      ))}
    </div>
  );
}

// ---------- Copy IP ----------
export function copyToClipboard(text: string) {
  const ok = (m: string) => toast.success(m);
  const fail = () => toast.error("Failed to copy");
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => ok(`Copied ${text}`)).catch(() => fallback());
  } else fallback();
  function fallback() {
    try {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
      ok(`Copied ${text}`);
    } catch { fail(); }
  }
}

// ---------- Reveal on scroll ----------
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ---------- Back to top ----------
export function BackToTop() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const onScroll = () => setV(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!v) return null;
  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-6 z-50 glass glow-ring rounded-full w-12 h-12 flex items-center justify-center text-primary hover:scale-110 transition"
    >↑</button>
  );
}

// ---------- Server status (mcsrvstat.us v2) ----------
export type ServerStatus = {
  online: boolean;
  players?: { online: number; max: number };
  version?: string;
  motd?: string[];
  icon?: string;
  hostname?: string;
} | null;

export function useServerStatus(
  apiTpl?: string,
  ip?: string,
  enabled = true,
  refreshMs = 60000,
): { data: ServerStatus; loading: boolean } {
  const [data, setData] = useState<ServerStatus>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!enabled || !apiTpl || !ip) { setLoading(false); return; }
    let cancel = false;
    setLoading(true);
    const url = apiTpl.replace("{ip}", encodeURIComponent(ip));
    const run = async () => {
      try {
        const r = await fetch(url);
        const j = await r.json();
        if (cancel) return;
        setData({
          online: !!j.online,
          players: j.players ? { online: j.players.online ?? 0, max: j.players.max ?? 0 } : undefined,
          version: j.version,
          motd: j.motd?.clean,
          icon: j.icon,
          hostname: j.hostname,
        });
      } catch { if (!cancel) setData({ online: false }); }
      finally { if (!cancel) setLoading(false); }
    };
    run();
    const id = setInterval(run, Math.max(refreshMs, 15000));
    return () => { cancel = true; clearInterval(id); };
  }, [apiTpl, ip, enabled, refreshMs]);
  return { data, loading };
}

// ---------- Mobile nav ----------
export function useMobileNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [open, close]);
  return { open, setOpen, close, ref };
}
