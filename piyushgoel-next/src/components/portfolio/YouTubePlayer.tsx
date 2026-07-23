"use client";

import { useEffect, useRef } from "react";
import { useVideoState } from "./VideoContext";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
}

declare global {
  interface Window {
    YT?: {
      Player: new (id: string, config: Record<string, unknown>) => {
        getPlayerState: () => number;
        addEventListener: (event: string, cb: () => void) => void;
        destroy: () => void;
      };
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YT_STATES = { PLAYING: 1 };

export function YouTubePlayer({ videoId, title }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<{ destroy: () => void } | null>(null);
  const calledRef = useRef(false);
  const { setVideoPlaying } = useVideoState();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || calledRef.current) return;
    calledRef.current = true;

    const id = `yt-player-${videoId}-${Date.now()}`;
    container.id = id;

    function initPlayer() {
      if (!window.YT?.Player) return;
      const player = new window.YT.Player(id, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, autoplay: 0 },
        events: {
          onStateChange: () => {
            if (!window.YT) return;
            const state = player.getPlayerState();
            setVideoPlaying(state === YT_STATES.PLAYING);
          },
        },
      });
      playerRef.current = player;
    }

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const first = document.getElementsByTagName("script")[0];
      first?.parentNode?.insertBefore(tag, first);

      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      playerRef.current?.destroy();
      setVideoPlaying(false);
    };
  }, [videoId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mt-4 aspect-video w-full rounded-lg bg-ink overflow-hidden">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
