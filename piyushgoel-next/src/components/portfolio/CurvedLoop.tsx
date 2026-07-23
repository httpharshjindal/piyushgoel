"use client";

import { useRef, useEffect, useState } from "react";

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
  className?: string;
}

export default function CurvedLoop({
  marqueeText = "Welcome to React Bits ✦",
  speed = 1,
  curveAmount = 150,
  direction = "left",
  interactive = true,
  className = "",
}: CurvedLoopProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [offset, setOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animationId: number;
    const animate = () => {
      const directionMultiplier = direction === "right" ? -1 : 1;
      const speedMultiplier = isHovered ? speed * 0.3 : speed;
      setOffset((prev) => prev + directionMultiplier * speedMultiplier);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [speed, direction, isHovered]);

  const repeatedText = `${marqueeText} ✦ ${marqueeText} ✦ ${marqueeText} ✦ ${marqueeText} ✦ ${marqueeText} ✦`;

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1000 200"
        className="w-full h-auto"
        style={{ maxHeight: "200px" }}
      >
        <defs>
          <path
            id="curvePath"
            d={`M -50,${100 + curveAmount} Q 500,${100 - curveAmount} 1050,${100 + curveAmount}`}
            fill="transparent"
          />
        </defs>
        <text
          className="fill-oxblood text-3xl font-bold"
          style={{
            offsetPath: `path("M -50,${100 + curveAmount} Q 500,${100 - curveAmount} 1050,${100 + curveAmount}")`,
            offsetDistance: `${offset}px`,
          }}
        >
          {repeatedText}
        </text>
      </svg>
    </div>
  );
}
