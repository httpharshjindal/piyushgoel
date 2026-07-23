"use client";

import { useState, useRef, useEffect } from "react";

interface AudioShowreelProps {
  title: string;
  note: string;
  audioUrl?: string;
  adminMode?: boolean;
}

export function AudioShowreel({ title, note, audioUrl, adminMode }: AudioShowreelProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.addEventListener("timeupdate", () => setProgress(audio.currentTime / (audio.duration || 1)));
    audio.addEventListener("ended", () => setPlaying(false));
    return () => { audio.pause(); audio.src = ""; };
  }, [audioUrl]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-paper shadow-[0_18px_50px_rgba(40,24,18,0.08)]">
      {/* Piano key decoration */}
      <div className="pointer-events-none absolute bottom-0 right-0 flex select-none opacity-[0.04]">
        <div className="h-32 w-4 bg-ink" />
        <div className="h-32 w-4 bg-ink" />
        <div className="h-20 w-4 bg-ink" />
        <div className="h-32 w-4 bg-ink" />
        <div className="h-32 w-4 bg-ink" />
        <div className="h-20 w-4 bg-ink" />
        <div className="h-32 w-4 bg-ink" />
        <div className="h-32 w-4 bg-ink" />
      </div>
      {/* Sound wave line */}
      <div className="pointer-events-none absolute right-12 top-1/2 h-px w-40 -translate-y-1/2 -rotate-12 bg-oxblood/10" />

      <div className="relative z-10 flex flex-col items-center px-6 py-14 text-center md:py-20">
        <div className="mb-2 text-xs font-extrabold uppercase tracking-wider text-oxblood/60">Showreel</div>
        <h2 className="font-serif text-4xl font-bold text-oxblood md:text-5xl">{title}</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{note}</p>

        {audioUrl ? (
          <div className="mt-8 flex flex-col items-center gap-5">
            <button
              onClick={toggle}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-oxblood text-2xl text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              {playing ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
              ) : (
                <svg className="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <div className="h-1.5 w-64 max-w-full rounded-full bg-ink/10">
              <div className="h-full rounded-full bg-oxblood/50 transition-all" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        ) : (
          <div className="mt-8 flex h-12 items-end gap-1">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-oxblood/20"
                style={{ height: `${8 + Math.sin(i * 0.8) * 8 + 6}px` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
