import { Fragment, useState } from "react";

// Vertical offset range, in em so it scales with the text size.
const OFFSET_EM = 0.4;

type CharTransform = { y: number; sx: number; sy: number };

// Random vertical offset (em) plus a flip on each axis.
function randomTransform(): CharTransform {
  return {
    y: (Math.random() - 0.5) * OFFSET_EM,
    sx: Math.random() > 0.5 ? -1 : 1,
    sy: Math.random() > 0.5 ? -1 : 1,
  };
}

// Recreates the email hover effect (minus the ghost rows): hovering a letter
// offsets and flips it and its ±2 neighbours. Letters are split per word so
// wrapping still happens between words, not mid-word; the global index spans the
// spaces so the ±2 cluster reaches across word boundaries.
export function FlipText({ children }: { children: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [transforms, setTransforms] = useState<Record<number, CharTransform>>(
    {}
  );

  const handleEnter = (i: number) => {
    setActiveIndex(i);
    setTransforms((prev) => {
      const next = { ...prev };
      for (let d = -2; d <= 2; d++) {
        const idx = i + d;
        if (idx >= 0 && idx < children.length && !next[idx]) {
          next[idx] = randomTransform();
        }
      }
      return next;
    });
  };

  let globalIndex = 0;
  const words = children.split(" ");

  return (
    <span onMouseLeave={() => setActiveIndex(null)}>
      {words.map((word, wi) => {
        const letters = word.split("").map((ch) => {
          const idx = globalIndex++;
          const isActive =
            activeIndex !== null && Math.abs(idx - activeIndex) <= 2;
          const t = transforms[idx];
          return (
            <span
              key={idx}
              onMouseEnter={() => handleEnter(idx)}
              style={{
                display: "inline-block",
                transform:
                  isActive && t
                    ? `translateY(${t.y}em) scaleX(${t.sx}) scaleY(${t.sy})`
                    : undefined,
              }}
            >
              {ch}
            </span>
          );
        });
        const isLast = wi === words.length - 1;
        if (!isLast) globalIndex++; // consume the space between words
        return (
          <Fragment key={wi}>
            <span style={{ display: "inline-block" }}>{letters}</span>
            {isLast ? null : " "}
          </Fragment>
        );
      })}
    </span>
  );
}
