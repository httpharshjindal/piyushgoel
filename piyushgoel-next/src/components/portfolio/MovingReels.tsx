import Image from "next/image";

/**
 * PhotoWallReel
 * -----------------------------------------------------------------------
 * A vertical, Instagram-Reel-sized (9:16) wall of photo tiles arranged in
 * rows. Each row auto-scrolls infinitely and horizontally, alternating
 * direction line-to-line (row 1 → left, row 2 → right, row 3 → left, ...)
 * exactly like the reference. Pure CSS keyframe animation — no JS timers,
 * so it's smooth, GPU-accelerated, and works great recorded as reel content.
 *
 * Swap PHOTOS below for your own image URLs. Each row pulls a different
 * slice of the array so the wall doesn't feel repetitive.
 *
 * Export tip: the canvas is built at a true 1080x1920 reel ratio (scaled
 * responsively via aspect-ratio), so a screen recording / screenshot of
 * this component drops straight into Reels/Shorts/TikTok at full quality.
 */

const PHOTOS = [
  "https://picsum.photos/seed/reel01/400/520",
  "https://picsum.photos/seed/reel02/400/520",
  "https://picsum.photos/seed/reel03/400/520",
  "https://picsum.photos/seed/reel04/400/520",
  "https://picsum.photos/seed/reel05/400/520",
  "https://picsum.photos/seed/reel06/400/520",
  "https://picsum.photos/seed/reel07/400/520",
  "https://picsum.photos/seed/reel08/400/520",
  "https://picsum.photos/seed/reel09/400/520",
  "https://picsum.photos/seed/reel10/400/520",
  "https://picsum.photos/seed/reel11/400/520",
  "https://picsum.photos/seed/reel12/400/520",
  "https://picsum.photos/seed/reel13/400/520",
  "https://picsum.photos/seed/reel14/400/520",
  "https://picsum.photos/seed/reel15/400/520",
  "https://picsum.photos/seed/reel16/400/520",
  "https://picsum.photos/seed/reel17/400/520",
  "https://picsum.photos/seed/reel18/400/520",
];

// One config entry per row: which photos it shows, scroll direction, and speed.
const ROWS = [
  { photos: PHOTOS.slice(0, 6), direction: "left", duration: 26 },
  { photos: PHOTOS.slice(6, 12), direction: "right", duration: 32 },
  { photos: PHOTOS.slice(12, 18), direction: "left", duration: 22 },
];

export default function PhotoWallReel() {
  return (
    <div className="w-full flex items-center justify-center bg-black py-6">
      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .row-track {
          display: flex;
          width: max-content;
          gap: 10px;
        }
        .row-left  { animation: scroll-left  linear infinite; }
        .row-right { animation: scroll-right linear infinite; }
      `}</style>

      {/* Reel canvas: true 9:16 ratio */}
      <div
        className="relative bg-black overflow-hidden"
        style={{
          width: "min(92vw, 405px)",
          aspectRatio: "9 / 16",
          borderRadius: 18,
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-center gap-[10px]">
          {ROWS.map((row, i) => (
            <div key={i} className="overflow-hidden w-full">
              <div
                className={`row-track ${row.direction === "left" ? "row-left" : "row-right"}`}
                style={{ animationDuration: `${row.duration}s` }}
              >
                {/* photos rendered twice back-to-back = seamless infinite loop */}
                {[...row.photos, ...row.photos].map((src, idx) => (
                  <Image
                    key={idx}
                    src={src}
                    alt=""
                    width={108}
                    height={140}
                    draggable={false}
                    className="select-none object-cover flex-shrink-0"
                    style={{ borderRadius: 14 }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* soft edge fade so tiles don't hard-cut at the canvas edge */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 8%, rgba(0,0,0,0) 92%, rgba(0,0,0,0.9) 100%)",
          }}
        />
      </div>
    </div>
  );
}