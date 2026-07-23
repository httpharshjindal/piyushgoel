"use client";

import { useRef, useEffect } from "react";

export function getInstagramPostId(url: string): string {
  const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([^/?]+)/);
  return match?.[1] || "";
}

export function InstagramEmbed({ url }: { url: string }) {
  const postId = getInstagramPostId(url);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!postId) return;
    const type = url.includes("/reel/") ? "reel" : "p";
    const src = `https://www.instagram.com/${type}/${postId}/embed/`;
    if (iframeRef.current) {
      iframeRef.current.src = src;
    }
  }, [url, postId]);

  if (!postId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex aspect-video items-center justify-center rounded-lg border border-ink/10 bg-paper text-center text-sm font-semibold text-oxblood"
      >
        Open Instagram
      </a>
    );
  }

  return (
    <div className="mt-4 flex justify-center">
      <iframe
        ref={iframeRef}
        title="Instagram embed"
        className="max-w-full rounded-lg"
        width="400"
        height="480"
        style={{ maxHeight: "80vh" }}
        frameBorder="0"
        scrolling="no"
        allowTransparency
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
