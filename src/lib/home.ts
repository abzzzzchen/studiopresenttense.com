import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import type { HomeProps, Project, StudioBlocks } from "@/types/home";

const HOME_QUERY = `{
  "homepage": *[_type == "homepage"][0]{
    studio,
    "services": services[]->title,
    inPractice,
    principles,
    images,
    mobileImages
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

type HomeData = {
  homepage: {
    studio?: StudioBlocks;
    services?: (string | null)[];
    inPractice?: StudioBlocks;
    principles?: StudioBlocks;
    images?: Parameters<typeof urlFor>[0][]; // desktop (landscape)
    mobileImages?: Parameters<typeof urlFor>[0][]; // mobile (portrait)
  } | null;
  projects: SanityProject[];
};

// Turn an array of Sanity image objects into resolved URLs, skipping entries
// with no uploaded asset — urlFor can't resolve a URL from a bare
// `{_key, _type:"image"}` placeholder.
const toImageUrls = (imgs?: Parameters<typeof urlFor>[0][]): string[] =>
  (imgs ?? [])
    .filter(
      (img) =>
        img &&
        typeof img === "object" &&
        "asset" in img &&
        Boolean(img.asset),
    )
    .map((img) => urlFor(img).width(1200).url());

const toRow = (p: SanityProject): Project => ({
  project: p.title ?? "",
  projectLink: p.titleLink,
  services: (p.services ?? []).filter(Boolean).join(", "),
  sector: p.sector ?? "",
  inPractice: p.description ?? "",
  with: p.collaborator ?? "",
  withLink: p.collaboratorLink,
});

export async function fetchHomeData(): Promise<HomeProps> {
  const data = await client.fetch<HomeData>(HOME_QUERY);
  const homepage = data?.homepage ?? null;
  const projects = data?.projects ?? [];

  const desktopImages = toImageUrls(homepage?.images);
  const mobileImages = toImageUrls(homepage?.mobileImages);

  return {
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
