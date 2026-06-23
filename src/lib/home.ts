import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import type { HomeProps, Project, Seo, StudioBlocks } from "@/types/home";

const HOME_QUERY = `{
  "homepage": *[_type == "homepage"][0]{
    studio,
    "services": services[]->title,
    inPractice,
    principles,
    images,
    mobileImages
  },
  "seo": *[_type == "seoSettings"][0]{
    title,
    description,
    ogImage,
    tags
  },
  "projects": *[_type == "project"]{
    _id,
    title,
    titleLink,
    status,
    "services": services[]->title,
    sector,
    description,
    collaborator,
    collaboratorLink
  } | order(title asc)
}`;

type SanityProject = {
  _id: string;
  title?: string;
  titleLink?: string;
  status?: "currently" | "previously";
  services?: (string | null)[];
  sector?: string;
  description?: string;
  collaborator?: string;
  collaboratorLink?: string;
};

type SanityImage = Parameters<typeof urlFor>[0];

type HomeData = {
  homepage: {
    studio?: StudioBlocks;
    services?: (string | null)[];
    inPractice?: StudioBlocks;
    principles?: StudioBlocks;
    images?: SanityImage[]; // desktop (landscape)
    mobileImages?: SanityImage[]; // mobile (portrait)
  } | null;
  seo: {
    title?: string;
    description?: string;
    ogImage?: SanityImage & { alt?: string };
    tags?: (string | null)[];
  } | null;
  projects: SanityProject[];
};

// Site title used as the fallback whenever the SEO singleton is empty, so the
// <head> is never blank before an editor fills it in.
const SITE_TITLE = "Studio Present Tense";

// urlFor can't resolve a URL from a bare `{_key, _type:"image"}` placeholder, so
// only attempt resolution once an asset has actually been uploaded.
const hasAsset = (img?: SanityImage): boolean =>
  Boolean(img && typeof img === "object" && "asset" in img && img.asset);

// Turn an array of Sanity image objects into resolved URLs at the given pixel
// width, skipping entries with no uploaded asset. `auto("format")` serves
// webp/avif where supported (smaller and sharper than the default jpeg).
const toImageUrls = (imgs: SanityImage[] | undefined, width: number): string[] =>
  (imgs ?? [])
    .filter(hasAsset)
    .map((img) => urlFor(img).width(width).auto("format").url());

const toRow = (p: SanityProject): Project => ({
  project: p.title ?? "",
  projectLink: p.titleLink,
  services: (p.services ?? []).filter(Boolean).join(", "),
  sector: p.sector ?? "",
  inPractice: p.description ?? "",
  with: p.collaborator ?? "",
  withLink: p.collaboratorLink,
});

// Resolve the SEO singleton into the flat shape the <head> needs, applying
// fallbacks so the tags are never empty. The unfurl image is cropped to the
// 1200×630 Open Graph standard and returned as an absolute CDN URL.
const toSeo = (seo: HomeData["seo"]): Seo => ({
  title: seo?.title || SITE_TITLE,
  description: seo?.description ?? "",
  ogImageUrl: hasAsset(seo?.ogImage)
    ? urlFor(seo!.ogImage!).width(1200).height(630).fit("crop").url()
    : null,
  ogImageAlt: seo?.ogImage?.alt ?? null,
  tags: (seo?.tags ?? []).filter((t): t is string => Boolean(t)),
});

export async function fetchHomeData(): Promise<HomeProps> {
  const data = await client.fetch<HomeData>(HOME_QUERY);
  const homepage = data?.homepage ?? null;
  const projects = data?.projects ?? [];

  // Desktop images are served large enough for the expanded lightbox, which can
  // reach ~2400 device px on a Retina display. The same URL also backs the small
  // bottom-left thumbnail (CSS scales it down), so opening the lightbox reuses
  // the already-cached image — instant and crisp, with no second fetch / flash.
  const desktopImages = toImageUrls(homepage?.images, 2400);
  const mobileImages = toImageUrls(homepage?.mobileImages, 1600);

  return {
    seo: toSeo(data?.seo ?? null),
    studio: homepage?.studio ?? [],
    services: (homepage?.services ?? []).filter(
      (s): s is string => Boolean(s),
    ),
    inPractice: homepage?.inPractice ?? [],
    principles: homepage?.principles ?? [],
    // Each breakpoint falls back to the other set so the hero is never blank
    // when only one set has been uploaded.
    desktopImages: desktopImages.length ? desktopImages : mobileImages,
    mobileImages: mobileImages.length ? mobileImages : desktopImages,
    currently: projects.filter((p) => p.status === "currently").map(toRow),
    previously: projects.filter((p) => p.status === "previously").map(toRow),
  };
}
