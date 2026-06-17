import { useRef, useState, type ReactNode } from "react";

import { Text } from "@/components/Text";
import type { Project } from "@/types/home";

// Constant linear speed (px/sec) for the hover scroll, so longer text takes
// proportionally longer to reveal rather than whipping past.
const SCROLL_SPEED = 80;

// Wrap content in an external link when an href is present, otherwise render it
// as-is. Keeps the title/collaborator cells link-aware without duplicating the
// anchor markup.
function MaybeLink({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return <>{children}</>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
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

  const scrollToEnd = () => {
    const el = ref.current;
    if (!el) return;
    // overflow = how much wider the text is than the visible cell.
    const overflow = el.scrollWidth - el.clientWidth;
    if (overflow <= 0) return;
    setDuration(overflow / SCROLL_SPEED);
    setOffset(overflow);
  };

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${className ?? ""}`}
      onMouseEnter={scrollToEnd}
      onMouseLeave={() => setOffset(0)}
    >
      <Text
        className="block whitespace-nowrap"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: `transform ${duration}s linear`,
        }}
      >
        {children}
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
