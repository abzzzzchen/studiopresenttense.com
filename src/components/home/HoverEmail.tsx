import { useState } from "react";

import { EMAIL } from "@/lib/constants";

type CharTransform = { y: number; sx: number; sy: number };

function randomTransform(): CharTransform {
  return {
    y: (Math.random() - 0.5) * 32,
    sx: Math.random() > 0.5 ? -1 : 1,
    sy: Math.random() > 0.5 ? -1 : 1,
  };
}

// Desktop-only hover animation (ported from the Figma export): hovering a
// character displaces it and its ±2 neighbours with a random vertical offset
// and axis flips, plus ghost copies above and below. The transform is instant.
// Keeps `data-fit-line` so the existing width-fitting logic still scales it.
export function HoverEmail({ onCopy }: { onCopy: () => void }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [transforms, setTransforms] = useState<Record<number, CharTransform>>(
    {}
  );
  const chars = EMAIL.split("");

  const handleEnter = (i: number) => {
    setActiveIndex(i);
    setTransforms((prev) => {
      const next = { ...prev };
      for (let d = -2; d <= 2; d++) {
        const idx = i + d;
        if (idx >= 0 && idx < chars.length && !next[idx]) {
          next[idx] = randomTransform();
        }
      }
      return next;
    });
  };

  return (
    <h1
      data-fit-line
      onMouseLeave={() => setActiveIndex(null)}
      onClick={onCopy}
      style={{
        display: "inline-block",
        whiteSpace: "nowrap",
        margin: 0,
        lineHeight: 1,
        letterSpacing: "-0.02em",
        cursor: "pointer",
      }}
    >
      {chars.map((ch, i) => {
        const isActive = activeIndex !== null && Math.abs(i - activeIndex) <= 2;
        const t = transforms[i];
        const ghostTransform =
          t && `translateY(${t.y * 0.6}px) scaleX(${t.sx}) scaleY(${t.sy})`;

        return (
          <span
            key={i}
            onMouseEnter={() => handleEnter(i)}
            style={{
              display: "inline-block",
              position: "relative",
              cursor: "pointer",
              transform:
                isActive && t
                  ? `translateY(${t.y}px) scaleX(${t.sx}) scaleY(${t.sy})`
                  : undefined,
            }}
          >
            {ch}
            {isActive && t && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: "-1em",
                  transform: ghostTransform,
                  pointerEvents: "none",
                }}
              >
                {ch}
              </span>
            )}
            {isActive && t && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: "1em",
                  transform: ghostTransform,
                  pointerEvents: "none",
                }}
              >
                {ch}
              </span>
            )}
          </span>
        );
      })}
    </h1>
  );
}
