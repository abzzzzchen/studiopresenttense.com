import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Text } from "@/components/Text";
import type { Project } from "@/types/home";

// Constant linear speed (px/sec) for the hover scroll, so longer text takes
// proportionally longer to reveal rather than whipping past.
const SCROLL_SPEED = 80;

// Mirror a letter on either the x or the y axis (one or the other, at random) —
// no scaling on the unused axis, so the letter only flips, never resizes.
type LetterMirror = { sx: number; sy: number };
function randomMirror(): LetterMirror {
  return Math.random() < 0.5 ? { sx: -1, sy: 1 } : { sx: 1, sy: -1 };
}

// When an href is present, render the word as a link whose letters each
// randomly mirror (x or y) while hovered. Without a link, render plain text and
// no hover effect. Letters are split per word so wrapping still happens between
// words, not mid-word.
function MaybeLink({ href, children }: { href?: string; children: ReactNode }) {
  const text = typeof children === "string" ? children : "";
  const [mirrors, setMirrors] = useState<LetterMirror[]>([]);

  if (!href) return <>{children}</>;

  // One fresh mirror per non-space letter on enter; clear on leave.
  const handleEnter = () =>
    setMirrors(
      text
        .replace(/ /g, "")
        .split("")
        .map(() => randomMirror())
    );
  const handleLeave = () => setMirrors([]);

  let letterIndex = 0;
  const words = text.split(" ");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-pointer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span style={{ display: "inline-block" }}>
            {word.split("").map((ch, ci) => {
              const m = mirrors[letterIndex++];
              return (
                <span
                  key={ci}
                  style={{
                    display: "inline-block",
                    transform: m
                      ? `scaleX(${m.sx}) scaleY(${m.sy})`
                      : undefined,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </a>
  );
}

// Single-line cell that clips its text and, on hover, scrolls it left at a
// constant speed to reveal the end — then slides back when the pointer leaves.
function ScrollOnHover({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [duration, setDuration] = useState(0);
  // How much wider the text is than the cell, and whether the "…" is showing.
  const [overflow, setOverflow] = useState(0);
  // Trailing "…" at rest (more text to the right); leading "…" once scrolled to
  // the end (more text to the left).
  const [showEllipsis, setShowEllipsis] = useState(false);
  const [showStartEllipsis, setShowStartEllipsis] = useState(false);

  // Measure the overflow up front (and on resize / font load, since the type is
  // viewport-relative) so the ellipsis can show before any hover.
  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const o = el.scrollWidth - el.clientWidth;
      setOverflow(o);
      // Only toggle at rest — never while a scroll is in progress.
      setOffset((cur) => {
        if (cur === 0) setShowEllipsis(o > 0);
        return cur;
      });
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const scrollToEnd = () => {
    if (overflow <= 0) return;
    setShowEllipsis(false); // hide the trailing "…" the moment scrolling begins
    setDuration(overflow / SCROLL_SPEED);
    setOffset(overflow);
  };

  const scrollToStart = () => {
    setShowStartEllipsis(false); // hide the leading "…" as it scrolls back
    setOffset(0);
  };

  // When an animation finishes: at the start, show the trailing "…"; at the
  // end, show the leading "…".
  const handleTransitionEnd = () => {
    if (overflow <= 0) return;
    if (offset === 0) setShowEllipsis(true);
    else setShowStartEllipsis(true);
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden cursor-default ${className ?? ""}`}
      onMouseEnter={scrollToEnd}
      onMouseLeave={scrollToStart}
    >
      <Text
        className="block whitespace-nowrap"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: `transform ${duration}s linear`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {children}
      </Text>
      <Text
        aria-hidden
        className="absolute right-0 top-0 bg-background pl-1 pointer-events-none transition-opacity duration-150"
        style={{ opacity: showEllipsis ? 1 : 0 }}
      >
        …
      </Text>
      <Text
        aria-hidden
        className="absolute left-0 top-0 bg-background pr-1 pointer-events-none transition-opacity duration-150"
        style={{ opacity: showStartEllipsis ? 1 : 0 }}
      >
        …
      </Text>
    </div>
  );
}

export function ProjectGroup({
  label,
  projects,
}: {
  label: string;
  projects: Project[];
}) {
  return (
    <div>
      {/* mobile: one stacked card per project */}
      <div className="flex flex-col gap-2 sm:hidden">
        <div>
          <Text>{label}</Text>
          <Text>Services</Text>
          <Text>Sector</Text>
          <Text>In Practice</Text>
          <Text>With</Text>
        </div>
        {projects.map((project, i) => (
          <div key={i} className="pl-8">
            <div className="grid grid-cols-12">
              <Text className="col-span-8">
                <MaybeLink href={project.projectLink}>
                  {project.project}
                </MaybeLink>
              </Text>
            </div>
            <div className="grid grid-cols-12">
              <Text className="col-span-8">{project.services}</Text>
            </div>
            <div className="grid grid-cols-12">
              <Text className="col-span-8">{project.sector}</Text>
            </div>
            <div className="grid grid-cols-12">
              <Text className="col-span-8">{project.inPractice}</Text>
            </div>
            <div className="grid grid-cols-12">
              <Text className="col-span-8">
                <MaybeLink href={project.withLink}>{project.with}</MaybeLink>
              </Text>
            </div>
          </div>
        ))}
      </div>

      {/* desktop: row-major, hidden on mobile */}
      <div className="hidden flex-col sm:flex">
        {/* header row */}
        <div className="grid grid-cols-16 gap-5 mb-2">
          <Text className="col-span-3">{label}</Text>
          <Text className="col-span-3">Services</Text>
          <Text className="col-span-2">Sector</Text>
          <Text className="col-span-6">In Practice</Text>
          <Text className="col-span-1">With</Text>
        </div>
        {/* one grid row per project */}
        <div className="flex flex-col gap-[2px]">
          {projects.map((project, i) => (
            <div key={i} className="grid grid-cols-16 gap-5">
              <Text className="col-span-3">
                <MaybeLink href={project.projectLink}>
                  {project.project}
                </MaybeLink>
              </Text>
              <Text className="col-span-3">{project.services}</Text>
              <Text className="col-span-2">{project.sector}</Text>
              <ScrollOnHover className="col-span-6">
                {project.inPractice}
              </ScrollOnHover>
              <Text className="col-span-1 text-nowrap">
                <MaybeLink href={project.withLink}>
                  {project.with || " "}
                </MaybeLink>
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
