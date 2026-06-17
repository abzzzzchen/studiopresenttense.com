import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

import { Text } from "@/components/Text";
import type { Project } from "@/types/home";

// Per-character cadence (ms) of the hover ticker — constant speed in letters
// per second, so every cell scrolls at the same reading pace.
const CHAR_STEP_MS = 45;

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

// Single-line cell that truncates with a real CSS ellipsis. On hover it tickers
// the text one character at a time — dropping a whole letter off the front each
// step so the tail scrolls into view, with the ellipsis appended at the right —
// until the remaining tail fits and the true end shows in full. Rewinds to the
// start when the pointer leaves.
function ScrollOnHover({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [start, setStart] = useState(0);
  const [active, setActive] = useState(false);
  const text = typeof children === "string" ? children : "";

  useEffect(() => {
    // Rewind a character at a time once the pointer has left.
    if (!active) {
      if (start === 0) return;
      const id = setTimeout(() => setStart((s) => s - 1), CHAR_STEP_MS);
      return () => clearTimeout(id);
    }
    // Advance until the remaining tail fits the cell (the end is fully shown).
    const el = ref.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    const id = setTimeout(() => setStart((s) => s + 1), CHAR_STEP_MS);
    return () => clearTimeout(id);
  }, [active, start]);

  return (
    <Text
      ref={ref}
      className={`block overflow-hidden whitespace-nowrap text-ellipsis cursor-default ${className ?? ""}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {text.slice(start)}
    </Text>
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
      <div className="hidden flex-col sm:flex gap-[1.3228vw]">
        {/* header row */}
        <div className="grid grid-cols-16 gap-5">
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
