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
import { SIZE_STYLES, Text } from "@/components/Text";
import { HoverEmail } from "@/components/home/HoverEmail";
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

export default function Home({
  studio,
  services,
  inPractice,
  principles,
  heroImages,
  currently,
  previously,
}: HomeProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [emailJustCopied, setEmailJustCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Copy the email and show the "Copied!" feedback for 2s (resetting the timer
  // on repeat clicks/taps).
  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(EMAIL);
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

  // Cycle the hero image every 1.5s, swapping instantly (no animation).
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % heroImages.length);
    }, HERO_INTERVAL_MS);

    return () => clearInterval(id);
  }, [heroImages.length]);

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

  return (
    <div className="px-3 md:px-5 overflow-x-hidden">
      {/* hero */}
      <div
        ref={heroRef}
        className="h-[25vh] md:h-[calc(100vh-44px)] pt-3 md:pt-5 relative"
      >
        {/* mobile: one word per line, at bodyLarge size (no dynamic scaling) */}
        {/* <div className="block md:hidden">
          <h1
            onClick={copyEmail}
            className={`m-0 cursor-pointer ${SIZE_STYLES.bodyLarge}`}
          >
            {["hello@", "studio", "present", "tense", ".com"].map((line) => (
              <span
                key={line}
                style={{ display: "block", whiteSpace: "nowrap" }}
              >
                {line}
              </span>
            ))}
          </h1>
          {emailJustCopied ? (
            <Text className="text-left">Email address copied.</Text>
          ) : null}
        </div> */}
        {/* desktop: single line scaled to fill the width, with hover animation */}
        <div>
          <HoverEmail onCopy={copyEmail} />
          {emailJustCopied ? (
            <Text className="text-left">Email address copied.</Text>
          ) : null}
        </div>
        {/* hero image — portrait thumbnail on mobile, landscape on desktop.
            A single element keeps exactly one `hero-image` layoutId mounted so
            the morph to/from the lightbox stays clean (no flash). */}
        {heroImages.length > 0 && !lightboxOpen ? (
          <div className="fixed md:absolute bottom-0 left-0 p-3 pb-[calc(0.75rem_+_env(safe-area-inset-bottom))] md:p-0 md:pb-5">
            <motion.img
              layoutId="hero-image"
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              className="aspect-[3/4.5] w-[calc(33.33vw-12px)] md:aspect-[4.5/3] md:w-[27vw] object-cover cursor-pointer"
              src={heroImages[activeIndex]}
              alt="Studio Present Tense"
              onClick={() => setLightboxOpen(true)}
            />
          </div>
        ) : null}
      </div>
      {/* body */}
      <div className="flex flex-col gap-20 md:gap-40 pb-5">
        {/* studio */}
        <div className=" grid grid-cols-9 md:grid-cols-12 gap-x-3 gap-y-10 md:gap-5">
          <div className="col-start-4 col-span-6 md:col-span-3 flex flex-col gap-[var(--body-leading)] pr-0 md:pr-5">
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
          <div className="col-start-4 col-span-6 md:col-span-3 flex flex-col gap-[var(--body-leading)] pr-0 md:pr-5">
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
          <div className="col-start-4 col-span-6 md:col-span-3 flex flex-col gap-[var(--body-leading)] pr-0 md:pr-5">
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
          <div className="col-start-4 col-span-6 md:col-span-3 flex flex-col gap-[var(--body-leading)] pr-0 md:pr-5">
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
      {/* lightbox: the hero image morphs to the centre of the viewport */}
      {heroImages.length > 0 && lightboxOpen ? (
        <>
          {/* transparent layer so clicking anywhere outside the image closes it */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setLightboxOpen(false)}
          />
          <motion.img
            layoutId="hero-image"
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="fixed inset-0 z-50 m-auto aspect-[3/4.5] w-[min(90vw,60vh)] md:aspect-[4.5/3] md:w-[min(90vw,135vh)] object-cover cursor-pointer"
            src={heroImages[activeIndex]}
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
