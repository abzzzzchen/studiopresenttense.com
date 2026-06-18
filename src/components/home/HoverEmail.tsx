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

// Build the CSS transform for one row, optionally damping the vertical offset.
function toTransform({ y, sx, sy }: CharTransform, damp = 1) {
  return `translateY(${y * damp}px) scaleX(${sx}) scaleY(${sy})`;
}

// Vertical-offset damping for the two ghost rows.
const GHOST_DAMP = 0.6;

// Desktop-only hover animation (ported from the Figma export): hovering a
// character offsets and flips it and its ±2 neighbours in the email line itself,
// and spawns two mirrored ghost copies of them stacked below the line. Each of
// the three rows gets its own random transform per letter, so no two rows match.
// The transform is instant.
// Keeps `data-fit-line` so the existing width-fitting logic still scales it.
export function HoverEmail({ onCopy }: { onCopy: () => void }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Per letter, one transform per row: [main, ghost, ghost].
  const [transforms, setTransforms] = useState<Record<number, CharTransform[]>>(
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
          next[idx] = [randomTransform(), randomTransform(), randomTransform()];
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
        lineHeight: 0.9,
        letterSpacing: "-0.02em",
        cursor: "pointer",
      }}
    >
      {chars.map((ch, i) => {
        const isActive = activeIndex !== null && Math.abs(i - activeIndex) <= 2;
        const rows = isActive ? transforms[i] : undefined;

        return (
          <span
            key={i}
            onMouseEnter={() => handleEnter(i)}
            style={{
              display: "inline-block",
              position: "relative",
              cursor: "pointer",
            }}
          >
            {/* the visible glyph — transformed without affecting the ghosts */}
            <span
              style={{
                display: "inline-block",
                transform: rows ? toTransform(rows[0]) : undefined,
              }}
            >
              {ch}
            </span>
            {rows && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: "0.9em",
                  transform: toTransform(rows[1], GHOST_DAMP),
                  pointerEvents: "none",
                }}
              >
                {ch}
              </span>
            )}
            {rows && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: "1.8em",
                  transform: toTransform(rows[2], GHOST_DAMP),
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
