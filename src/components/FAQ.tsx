import { useState, useRef, type KeyboardEvent } from "react";

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowDown") { e.preventDefault(); refs.current[(i + 1) % items.length]?.focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); refs.current[(i - 1 + items.length) % items.length]?.focus(); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(open === i ? null : i); }
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="glass rounded-xl overflow-hidden">
            <button
              ref={(el) => { refs.current[i] = el; }}
              onClick={() => setOpen(isOpen ? null : i)}
              onKeyDown={(e) => onKey(e, i)}
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold hover:text-primary transition"
            >
              <span>{item.q}</span>
              <span className={`text-primary transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            <div
              id={`faq-${i}`}
              role="region"
              className="grid transition-all duration-300"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-muted-foreground">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
