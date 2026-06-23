import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import type { GetStaticProps } from "next";
import { motion } from "motion/react";
import { PortableText } from "next-sanity";

import { FlipText } from "@/components/FlipText";
import { Seo } from "@/components/Seo";
import { SIZE_STYLES, Text } from "@/components/Text";
import { HoverEmail } from "@/components/home/HoverEmail";
import { MobileHeroImage } from "@/components/home/MobileHeroImage";
import { ProjectGroup } from "@/components/home/ProjectGroup";
import { studioComponents } from "@/components/home/studioComponents";
import {
  EMAIL,
  EMAIL_FILL_DESKTOP,
  EMAIL_FILL_MOBILE,
  HERO_INTERVAL_MS,
  REFERENCE_FONT_SIZE,
  SM_BREAKPOINT,
} from "@/lib/constants";
import { fetchHomeData } from "@/lib/home";
import type { HomeProps } from "@/types/home";

// Clipboard fallback for non-secure contexts (LAN IP over http), where
// navigator.clipboard is undefined. A hidden, off-screen textarea + execCommand
// still copies during the tap's user gesture. Best-effort: silently no-ops if
// even this is unavailable, since the on-screen confirmation is shown separately.
function fallbackCopy(text: string) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  } catch {
    // ignore — confirmation still shows; user can copy manually if needed
  }
}

// Single source of truth for the desktop hero image's aspect ratio, shared by
// the bottom-left thumbnail and the expanded lightbox (they morph into each
// other via a shared layoutId, so their ratios must match). Tweak this one value
// to re-crop the hero — the lightbox width below derives its size from it, so the
// spacing stays correct at any ratio. Written "w / h" (CSS aspect-ratio syntax).
const HERO_IMAGE_AR = "3 / 2";

// Largest box of ratio HERO_IMAGE_AR that fits within 90vw × 90vh (i.e. leaving
// ~5vh/5vw of breathing room): width = min(90vw, 90vh × ratio). Height then
// follows from aspect-ratio, capping at 90vh on tall screens.
const HERO_LIGHTBOX_WIDTH = `min(90vw, 90vh * (${HERO_IMAGE_AR}))`;

export default function Home({
  seo,
  studio,
  services,
  inPractice,
  principles,
  desktopImages,
  mobileImages,
  currently,
  previously,
}: HomeProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [emailJustCopied, setEmailJustCopied] = useState(false);
  // Which side the "copied" confirmation aligns to — set to the opposite half
  // from where the email was tapped, so the text appears away from the finger.
  const [copiedAlign, setCopiedAlign] = useState<"left" | "right">("left");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Copy the email and show the "Copied!" feedback for 2s (resetting the timer
  // on repeat clicks/taps). The async Clipboard API only exists in a secure
  // context (https / localhost); over a LAN IP on plain http — how the dev
  // server is usually reached on a phone — `navigator.clipboard` is undefined,
  // so guard it and fall back to execCommand. Feedback shows regardless of which
  // path runs, so the user always gets confirmation.
  const copyEmail = useCallback((e: MouseEvent<HTMLElement>) => {
    // Align the confirmation to the opposite half from the tap: tap the left
    // half → align right, and vice versa, so the text isn't under the finger.
    const rect = e.currentTarget.getBoundingClientRect();
    const tappedLeftHalf = e.clientX < rect.left + rect.width / 2;
    setCopiedAlign(tappedLeftHalf ? "right" : "left");

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(EMAIL).catch(() => fallbackCopy(EMAIL));
    } else {
      fallbackCopy(EMAIL);
    }
    setEmailJustCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setEmailJustCopied(false), 2000);
  }, []);

  // Scroll the clicked section title to the top-left of the viewport.
  const scrollToTop = useCallback((e: MouseEvent<HTMLElement>) => {
    e.currentTarget.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Close the lightbox on Escape while it's open.
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  // Cycle the hero image every 1.5s, swapping instantly (no animation). The two
  // sets are parallel, so a single index drives both; cycle over the longer one
  // and index each set modulo its own length.
  const heroCount = Math.max(desktopImages.length, mobileImages.length);
  useEffect(() => {
    if (heroCount <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % heroCount);
    }, HERO_INTERVAL_MS);

    return () => clearInterval(id);
  }, [heroCount]);

  const fitToViewport = useCallback(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // The hero's content-box width already excludes the page padding (px-5)
    // and the vertical scrollbar, so lines fit exactly within the padded area.
    // Scale that target by the per-breakpoint fill ratio so the email can be
    // tweaked to fill less than the full width.
    const isDesktop = window.matchMedia(
      `(min-width: ${SM_BREAKPOINT}px)`
    ).matches;
    const fill = isDesktop ? EMAIL_FILL_DESKTOP : EMAIL_FILL_MOBILE;
    const available = hero.clientWidth * fill;

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

  // The current frame for each set. The browser picks which to display via the
  // <picture> <source> media query, so both stay in sync with one index.
  const hasHeroImages = heroCount > 0;
  const desktopSrc = desktopImages[activeIndex % (desktopImages.length || 1)];
  const mobileSrc = mobileImages[activeIndex % (mobileImages.length || 1)];

  return (
    <div className="p-3 md:p-5 overflow-x-hidden">
      <Seo {...seo} />
      {/* hero */}
      <div
        ref={heroRef}
        className="md:h-[calc(100vh-60px)] xl:h-[calc(100vh-68px)] relative"
      >
        {/* desktop: single line scaled to fill the width, with hover animation.
            The "copied" feedback is an absolute overlay so it never reflows the
            hero image / body stack below. */}
        <div className="relative">
          <HoverEmail onCopy={copyEmail} />
          {emailJustCopied ? (
            <Text
              // The confirmation jumps to the side opposite the click on every
              // breakpoint — copiedAlign is set from the click x in copyEmail.
              className={`absolute left-0 right-0 top-full z-20 ${
                copiedAlign === "right" ? "text-right" : "text-left"
              }`}
            >
              Email address copied.
            </Text>
          ) : null}
        </div>
        {/* mobile: full-width portrait image that scroll-morphs to the corner */}
        {hasHeroImages ? (
          <MobileHeroImage src={mobileSrc} heroRef={heroRef} />
        ) : null}
        {/* desktop: landscape thumbnail that morphs to/from the lightbox. The
            shared `hero-image` layoutId stays clean since only this one (or the
            lightbox) is mounted at a time. */}
        {hasHeroImages && !lightboxOpen ? (
          <div className="hidden md:block absolute bottom-0 left-0 pb-5">
            <motion.img
              layoutId="hero-image"
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              className="w-[27vw] object-cover cursor-pointer"
              style={{ aspectRatio: HERO_IMAGE_AR }}
              src={desktopSrc}
              alt="Studio Present Tense"
              onClick={() => setLightboxOpen(true)}
            />
          </div>
        ) : null}
      </div>
      {/* body */}
      <div className="flex flex-col gap-20 md:gap-40">
        {/* studio */}
        <div className="grid grid-cols-9 md:grid-cols-12 gap-x-3 gap-y-7 md:gap-5">
          <div className="col-start-4 col-span-6 md:col-span-3 flex flex-col gap-3 pr-0 md:pr-5">
            <Text
              size="bodyLarge"
              onClick={scrollToTop}
              className="cursor-pointer scroll-mt-5"
            >
              <FlipText>Studio</FlipText>
            </Text>
            <div className="flex flex-col gap-2">
              <PortableText value={studio} components={studioComponents} />
            </div>
          </div>
          <div className="col-start-4 col-span-6 md:col-span-3 flex flex-col gap-3 pr-0 md:pr-5">
            <Text
              size="bodyLarge"
              onClick={scrollToTop}
              className="cursor-pointer scroll-mt-5"
            >
              <FlipText>Services</FlipText>
            </Text>
            <div className="flex flex-col">
              {services.map((service, i) => (
                <Text key={i}>{service}</Text>
              ))}
            </div>
          </div>
          <div className="col-start-4 col-span-6 md:col-span-3 flex flex-col gap-3 pr-0 md:pr-5">
            <Text
              size="bodyLarge"
              onClick={scrollToTop}
              className="cursor-pointer scroll-mt-5"
            >
              <FlipText>In Practice</FlipText>
            </Text>
            <div className="flex flex-col gap-2">
              <PortableText value={inPractice} components={studioComponents} />
            </div>
          </div>
          <div className="col-start-4 col-span-6 md:col-span-3 flex flex-col gap-3 pr-0 md:pr-5">
            <Text
              size="bodyLarge"
              onClick={scrollToTop}
              className="cursor-pointer scroll-mt-5"
            >
              <FlipText>Principles</FlipText>
            </Text>
            <div className="flex flex-col gap-2">
              <PortableText value={principles} components={studioComponents} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <ProjectGroup label="Currently" projects={currently} />
          <ProjectGroup label="Previously" projects={previously} />
        </div>
        <div className="grid grid-cols-9 md:grid-cols-12 gap-x-3 mt-20 md:mt-0">
          <div className="col-start-4 col-span-6 md:col-span-12">
            <Text size="bodyRegular">
              Magically built by{" "}
              <a
                href="https://headlight.la"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FlipText>Headlight</FlipText>
              </a>
            </Text>
          </div>
        </div>
      </div>
      {/* desktop lightbox: the hero image morphs to the centre of the viewport */}
      {hasHeroImages && lightboxOpen ? (
        <>
          {/* transparent layer so clicking anywhere outside the image closes it */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setLightboxOpen(false)}
          />
          <motion.img
            layoutId="hero-image"
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="fixed inset-0 z-50 m-auto object-cover cursor-pointer"
            style={{ aspectRatio: HERO_IMAGE_AR, width: HERO_LIGHTBOX_WIDTH }}
            src={desktopSrc}
            alt="Studio Present Tense"
            onClick={() => setLightboxOpen(false)}
          />
        </>
      ) : null}
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return {
    props: await fetchHomeData(),
    revalidate: 60,
  };
};
