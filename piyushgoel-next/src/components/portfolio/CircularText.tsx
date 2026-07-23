"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "motion/react";

interface CircularTextProps {
  text: string;
  onHover?: "speedUp" | "slowDown" | "pause" | "goBonkers";
  spinDuration?: number;
  className?: string;
}

export default function CircularText({
  text,
  onHover = "speedUp",
  spinDuration = 20,
  className = "",
}: CircularTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  const letters = text.split("*");
  const totalLetters = text.replace(/\*/g, "").length;

  useEffect(() => {
    if (isHovered) {
      switch (onHover) {
        case "speedUp":
          controls.start({
            rotate: 360,
            transition: { duration: spinDuration / 4, ease: "linear", repeat: Infinity },
          });
          break;
        case "slowDown":
          controls.start({
            rotate: 360,
            transition: { duration: spinDuration * 2, ease: "linear", repeat: Infinity },
          });
          break;
        case "pause":
          controls.stop();
          break;
        case "goBonkers":
          controls.start({
            rotate: [0, 360, 720, 1080, 1440],
            scale: [1, 1.2, 0.8, 1.1, 1],
            transition: { duration: 2, ease: "easeInOut" },
          });
          break;
      }
    } else {
      controls.start({
        rotate: 360,
        transition: { duration: spinDuration, ease: "linear", repeat: Infinity },
      });
    }
  }, [isHovered, onHover, spinDuration, controls]);

  return (
    <motion.div
      ref={ref}
      className={`relative inline-flex items-center justify-center ${className}`}
      animate={controls}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: 120, height: 120 }}
    >
      {letters.map((word, wordIndex) => {
        const wordLetters = word.split("");
        let startIndex = 0;
        for (let i = 0; i < wordIndex; i++) {
          startIndex += letters[i].length;
        }

        return wordLetters.map((letter, letterIndex) => {
          const angle = ((startIndex + letterIndex) / totalLetters) * 360;
          const radian = (angle * Math.PI) / 180;
          const x = Math.sin(radian) * 45;
          const y = -Math.cos(radian) * 45;

          return (
            <span
              key={`${wordIndex}-${letterIndex}`}
              className="absolute text-sm font-bold text-oxblood"
              style={{
                transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`,
                transformOrigin: "center",
              }}
            >
              {letter}
            </span>
          );
        });
      })}
    </motion.div>
  );
}
