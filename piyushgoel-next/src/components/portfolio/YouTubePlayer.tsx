"use client";

import { useVideoState } from "./VideoContext";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
}

export function YouTubePlayer({ videoId, title }: YouTubePlayerProps) {
  const { setVideoPlaying } = useVideoState();
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

  return (
    <div className="aspect-video w-full rounded-lg bg-ink overflow-hidden">
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onMouseEnter={() => setVideoPlaying(true)}
        onMouseLeave={() => setVideoPlaying(false)}
      />
    </div>
  );
}
