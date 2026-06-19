import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";

type Rect = { top: number; left: number; width: number; height: number };

// Fraction of the hero's scroll over which the image morphs to the corner.
// Lower = the image docks after less scrolling (and overlaps the body less).
const DOCK_AT = 0.4;

// Mobile-only hero image. It starts as a full-width portrait image in the hero
// flow (between the email and the body) and, as the hero scrolls past the top,
// animates — proportionally to scroll position — down to the small fixed
// bottom-left thumbnail. The morph is a uniform scale + translate (both anchors
// share the 4/5 aspect), so it's GPU-composited and never distorts.
//
// Two invisible anchors define the exact endpoints: `startRef` reserves the
// full-width slot in the flow; `endRef` mirrors the corner thumbnail's position
// (incl. safe-area padding). The visible image is `position: fixed` and is
// interpolated between the two measured rects.
export function MobileHeroImage({
  src,
  heroRef,
}: {
  src: string;
  heroRef: RefObject<HTMLDivElement | null>;
}) {
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState<Rect | null>(null);
  const [end, setEnd] = useState<Rect | null>(null);

  // Progress 0 when the hero top hits the viewport top, 1 once the hero has
  // fully scrolled past it — i.e. one hero-height of scroll drives the morph.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  useLayoutEffect(() => {
    const measure = () => {
      const s = startRef.current;
      const e = endRef.current;
      if (!s || !e) return;
      const sr = s.getBoundingClientRect();
      const er = e.getBoundingClientRect();
      // Both anchors are display:none above the md breakpoint — skip then.
      if (sr.width === 0 || er.width === 0) return;
      setStart({
        // Document-space top: the fixed image's scroll-0 viewport position.
        top: sr.top + window.scrollY,
        left: sr.left,
        width: sr.width,
        height: sr.height,
      });
      // endRef is fixed, so its rect is already viewport-relative & stable.
      setEnd({
        top: er.top,
        left: er.left,
        width: er.width,
        height: er.height,
      });
    };

    measure();

    // Re-measure whenever the hero's size changes — margin/spacing edits, font
    // reflow, or content changes all shift the placeholder, and `start.top` has
    // to follow it or the fixed image lands at a stale position.
    const hero = heroRef.current;
    const ro =
      hero && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    ro?.observe(hero!);

    // Viewport-height-only changes (mobile URL bar) move the bottom-anchored end
    // anchor without resizing the hero, so keep a resize listener too.
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [heroRef]);

  const ready = start !== null && end !== null;
  // Origin top-left: scaling keeps the top-left pinned, then translate carries it
  // from the start slot to the corner. The morph completes within the first
  // DOCK_AT fraction of the hero scroll (then clamps), so the image shrinks to
  // the corner quickly instead of overlapping the body text as it scrolls up.
  const scale = useTransform(
    scrollYProgress,
    [0, DOCK_AT],
    [1, ready ? end!.width / start!.width : 1]
  );
  const x = useTransform(
    scrollYProgress,
    [0, DOCK_AT],
    [0, ready ? end!.left - start!.left : 0]
  );
  const y = useTransform(
    scrollYProgress,
    [0, DOCK_AT],
    [0, ready ? end!.top - start!.top : 0]
  );

  return (
    <>
      {/* reserves the full-width image's space in the hero flow. mt = gap to the
          email above; mb = gap to the body text below — tweak each freely. */}
      <div
        ref={startRef}
        className="mt-12 mb-4 w-full aspect-[4/5] md:hidden"
      />

      {/* invisible anchor mirroring the final corner thumbnail (measured only) */}
      <div
        aria-hidden
        className="fixed bottom-0 left-0 p-3 pb-[calc(0.75rem_+_env(safe-area-inset-bottom))] invisible pointer-events-none md:hidden"
      >
        <div ref={endRef} className="w-[calc(33.33vw-20px)] aspect-[4/5]" />
      </div>

      {/* the visible, scroll-animated image */}
      {ready ? (
        <motion.img
          src={src}
          alt="Studio Present Tense"
          className="fixed z-10 object-cover md:hidden"
          style={{
            top: start!.top,
            left: start!.left,
            width: start!.width,
            height: start!.height,
            transformOrigin: "top left",
            willChange: "transform",
            x,
            y,
            scale,
          }}
        />
      ) : null}
    </>
  );
}
