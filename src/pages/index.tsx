import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const REFERENCE_FONT_SIZE = 100;

const HERO_IMAGES = ["/images/pt-1.jpg", "/images/pt-2.png"];
const HERO_INTERVAL_MS = 1500;

type Project = {
  project: string;
  services: string;
  sector: string;
  inPractice: string;
  with: string;
};

const CURRENTLY: Project[] = [
  {
    project: "Basement Workshop",
    services: "Digital Experience",
    sector: "Arts & Culture",
    inPractice: "Turning years of impact into a lasting digital system",
    with: "Headlight",
  },
  {
    project: "MáLà Project",
    services: "Creative Direction",
    sector: "Hospitality",
    inPractice: "Building a framework a great brand needs",
    with: "",
  },
  {
    project: "Worthless Studios",
    services: "Digital Experience",
    sector: "Arts & Culture",
    inPractice: "Turning years of impact into a lasting digital system",
    with: "Caleb Bennett",
  },
];

const PREVIOUSLY: Project[] = [
  {
    project: "Basement Workshop",
    services: "Digital Experience",
    sector: "Arts & Culture",
    inPractice: "Turning years of impact into a lasting digital system",
    with: "Headlight",
  },
  {
    project: "MáLà Project",
    services: "Creative Direction",
    sector: "Hospitality",
    inPractice: "Building a framework a great brand needs",
    with: "",
  },
  {
    project: "Worthless Studios",
    services: "Digital Experience",
    sector: "Arts & Culture",
    inPractice: "Turning years of impact into a lasting digital system",
    with: "Caleb Bennett",
  },
  {
    project: "Basement Workshop",
    services: "Digital Experience",
    sector: "Arts & Culture",
    inPractice: "Turning years of impact into a lasting digital system",
    with: "Headlight",
  },
  {
    project: "MáLà Project",
    services: "Creative Direction",
    sector: "Hospitality",
    inPractice: "Building a framework a great brand needs",
    with: "",
  },
  {
    project: "Worthless Studios",
    services: "Digital Experience",
    sector: "Arts & Culture",
    inPractice: "Turning years of impact into a lasting digital system",
    with: "Caleb Bennett",
  },
  {
    project: "Basement Workshop",
    services: "Digital Experience",
    sector: "Arts & Culture",
    inPractice: "Turning years of impact into a lasting digital system",
    with: "Headlight",
  },
  {
    project: "MáLà Project",
    services: "Creative Direction",
    sector: "Hospitality",
    inPractice: "Building a framework a great brand needs",
    with: "",
  },
  {
    project: "Worthless Studios",
    services: "Digital Experience",
    sector: "Arts & Culture",
    inPractice: "Turning years of impact into a lasting digital system",
    with: "Caleb Bennett",
  },
  {
    project: "Basement Workshop",
    services: "Digital Experience",
    sector: "Arts & Culture",
    inPractice: "Turning years of impact into a lasting digital system",
    with: "Headlight",
  },
  {
    project: "MáLà Project",
    services: "Creative Direction",
    sector: "Hospitality",
    inPractice: "Building a framework a great brand needs",
    with: "",
  },
  {
    project: "Worthless Studios",
    services: "Digital Experience",
    sector: "Arts & Culture",
    inPractice: "Turning years of impact into a lasting digital system",
    with: "Caleb Bennett",
  },
  {
    project: "Basement Workshop",
    services: "Digital Experience",
    sector: "Arts & Culture",
    inPractice: "Turning years of impact into a lasting digital system",
    with: "Headlight",
  },
  {
    project: "MáLà Project",
    services: "Creative Direction",
    sector: "Hospitality",
    inPractice: "Building a framework a great brand needs",
    with: "",
  },
  {
    project: "Worthless Studios",
    services: "Digital Experience",
    sector: "Arts & Culture",
    inPractice: "Turning years of impact into a lasting digital system",
    with: "Caleb Bennett",
  },
];

const SERVICES = [
  "Brand Identity",
  "Design Systems",
  "Digital Experiences",
  "Editorial Design",
  "Exhibition Graphics",
  "Creative Direction",
];

const IN_PRACTICE = [
  "Bring clarity to things that don't feel quite right.",
  "Turn a hazy idea into something to build from.",
  "Build a scalable foundation that grows with you.",
  "Make the shift toward a new direction.",
  "Tell your story in ways that it can be felt.",
  "Create something as ambitious as the vision.",
];

const PRINCIPLES = [
  "Every decision serves the idea, nothing arbitrary.",
  "Leading with curiosity, knowing the world the work lives in.",
  "Rooting conceptual play in strategic intention.",
  "Made with, not for. Fueled by trust and thinking together.",
  "Embracing intersectional cultural humility.",
  "Play, play again, play past the obvious.",
];

function ProjectGroup({
  label,
  projects,
}: {
  label: string;
  projects: Project[];
}) {
  return (
    <div className="text-[16px]">
      {/* mobile: one stacked card per project */}
      <div className="flex flex-col gap-2 sm:hidden">
        {projects.map((project, i) => (
          <div key={i}>
            <div className="grid grid-cols-12">
              <p className="col-span-4">{label}</p>
              <p className="col-span-8">{project.project}</p>
            </div>
            <div className="grid grid-cols-12">
              <p className="col-span-4">Services</p>
              <p className="col-span-8">{project.services}</p>
            </div>
            <div className="grid grid-cols-12">
              <p className="col-span-4">Sector</p>
              <p className="col-span-8">{project.sector}</p>
            </div>
            <div className="grid grid-cols-12">
              <p className="col-span-4">In Practice</p>
              <p className="col-span-8">{project.inPractice}</p>
            </div>
            <div className="grid grid-cols-12">
              <p className="col-span-4">With</p>
              <p className="col-span-8">{project.with}</p>
            </div>
          </div>
        ))}
      </div>

      {/* desktop: column-major, hidden on mobile */}
      <div className="hidden grid-cols-12 gap-5 sm:grid">
        <div className="col-span-2">
          <p className="mb-2">{label}</p>
          <div className="flex flex-col gap-[2px]">
            {projects.map((project, i) => (
              <p key={i}>{project.project}</p>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <p className="mb-2">Services</p>
          <div className="flex flex-col gap-[2px]">
            {projects.map((project, i) => (
              <p key={i}>{project.services}</p>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <p className="mb-2">Sector</p>
          <div className="flex flex-col gap-[2px]">
            {projects.map((project, i) => (
              <p key={i}>{project.sector}</p>
            ))}
          </div>
        </div>
        <div className="col-span-4">
          <p className="mb-2">In Practice</p>
          <div className="flex flex-col gap-[2px]">
            {projects.map((project, i) => (
              <p key={i}>{project.inPractice}</p>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <p className="mb-2">With</p>
          {projects.map((project, i) => (
            <p key={i}>{project.with || " "}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

const EMAIL = "hello@studiopresenttense.com";

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
function HoverEmail() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [transforms, setTransforms] = useState<Record<number, CharTransform>>(
    {},
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
      style={{
        display: "inline-block",
        whiteSpace: "nowrap",
        margin: 0,
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}
    >
      {chars.map((ch, i) => {
        const isActive =
          activeIndex !== null && Math.abs(i - activeIndex) <= 2;
        const t = transforms[i];
        const ghostTransform =
          t &&
          `translateY(${t.y * 0.6}px) scaleX(${t.sx}) scaleY(${t.sy})`;

        return (
          <span
            key={i}
            onMouseEnter={() => handleEnter(i)}
            style={{
              display: "inline-block",
              position: "relative",
              cursor: "default",
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

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Cycle the hero image every 1.5s, swapping instantly (no animation).
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, HERO_INTERVAL_MS);

    return () => clearInterval(id);
  }, []);

  const fitToViewport = useCallback(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // The hero's content-box width already excludes the page padding (px-5)
    // and the vertical scrollbar, so lines fit exactly within the padded area.
    const available = hero.clientWidth;

    // Measure every line's intrinsic width at the reference size. The desktop
    // version has one line; the mobile version has several (one per word). Lines
    // hidden at the current breakpoint measure 0 (display: none) and are skipped.
    const lines = Array.from(
      hero.querySelectorAll<HTMLElement>("[data-fit-line]")
    );
    let widestText = 0;
    const visibleLines: HTMLElement[] = [];
    lines.forEach((line) => {
      // Each line hugs its text (fit-content + nowrap), so scrollWidth is the
      // intrinsic text width at the reference size.
      line.style.fontSize = `${REFERENCE_FONT_SIZE}px`;
      const textWidth = line.scrollWidth;
      if (textWidth === 0) return;

      visibleLines.push(line);
      widestText = Math.max(widestText, textWidth);
    });
    if (widestText === 0) return;

    // The longest line sets the size for all lines, so it spans the full width
    // and the shorter lines stay flush-left within it at the same size.
    const fontSize = REFERENCE_FONT_SIZE * (available / widestText);
    visibleLines.forEach((line) => {
      line.style.fontSize = `${fontSize}px`;
    });
  }, []);

  useLayoutEffect(() => {
    fitToViewport();

    window.addEventListener("resize", fitToViewport);
    // Recompute once the webfont loads, since fallback metrics differ.
    document.fonts.ready.then(fitToViewport);

    return () => window.removeEventListener("resize", fitToViewport);
  }, [fitToViewport]);

  return (
    <div className="px-5 overflow-x-hidden">
      {/* hero */}
      <div ref={heroRef} className="h-[calc(100vh-44px)] pt-5 relative">
        {/* mobile: one word per line, each scaled to fill the width */}
        <div className="block sm:hidden">
          <h1 style={{ margin: 0, lineHeight: 0.9, letterSpacing: "-0.02em" }}>
            {["hello@", "studio", "present", "tense", ".com"].map((line) => (
              <span
                key={line}
                data-fit-line
                style={{
                  display: "block",
                  width: "fit-content",
                  whiteSpace: "nowrap",
                }}
              >
                {line}
              </span>
            ))}
          </h1>
        </div>
        {/* desktop: single line scaled to fill the width, with hover animation */}
        <div className="hidden sm:block">
          <HoverEmail />
        </div>
        <div className="absolute bottom-0 left-0 pb-5">
          <img
            className="aspect-[4.5/3] bg-[red] w-[75vw] sm:w-[27vw]"
            src={HERO_IMAGES[activeIndex]}
            alt="Studio Present Tense"
          ></img>
        </div>
      </div>
      {/* body */}
      <div className="flex flex-col gap-[40vh] pb-5">
        {/* studio */}
        <div className=" grid grid-cols-12 gap-5">
          <div className="col-span-12 sm:col-span-3 flex flex-col gap-5 pr-14">
            <p className="text-[32px] tracking-[-.02em]">Studio</p>
            <div className="text-[16px] flex flex-col gap-2">
              <p className="tracking-[-.01em]">
                Creating culturally resonant, systemically elastic work.  From
                single expression to a full ecosystem, for brands,
                 institutions, and entrepreneurs.
              </p>
              <p className="tracking-[-.01em]">
                Founded by Abby Chen, a designer and creative director with 12+
                years across studios and in-house creative teams in culture,
                media, and tech, bringing multidisciplinary thinking to  every
                project, at every stage.
              </p>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-3 flex flex-col gap-5 pr-14">
            <p className="text-[32px] tracking-[-.02em]">Services</p>
            <div className="text-[16px] flex flex-col">
              {SERVICES.map((service, i) => (
                <p key={i} className="tracking-[-.01em]">
                  {service}
                </p>
              ))}
            </div>
          </div>
          <div className="col-span-12 sm:col-span-3 flex flex-col gap-5 pr-14">
            <p className="text-[32px] tracking-[-.02em]">In Practice</p>
            <div className="text-[16px] flex flex-col gap-2">
              {IN_PRACTICE.map((item, i) => (
                <p key={i} className="tracking-[-.01em]">
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="col-span-12 sm:col-span-3 flex flex-col gap-5 pr-14">
            <p className="text-[32px] tracking-[-.02em]">Principles</p>
            <div className="text-[16px] flex flex-col gap-2">
              {PRINCIPLES.map((item, i) => (
                <p key={i} className="tracking-[-.01em]">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <ProjectGroup label="Currently" projects={CURRENTLY} />
          <ProjectGroup label="Previously" projects={PREVIOUSLY} />
        </div>
      </div>
    </div>
  );
}
