"use client";

import { useEffect, useState } from "react";

interface ScrollNavProps {
  sections: { id: string; label: string }[];
}

export function ScrollNav({ sections }: ScrollNavProps) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" },
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex">
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group flex items-center gap-3"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="whitespace-nowrap rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-ink opacity-0 shadow-sm transition-all group-hover:opacity-100 dark:bg-ink/80 dark:text-white">
              {s.label}
            </span>
            <div
              className={`rounded-full transition-all ${
                isActive ? "h-3 w-3 bg-oxblood shadow-[0_0_8px_rgba(139,58,58,0.6)]" : "h-2.5 w-2.5 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
