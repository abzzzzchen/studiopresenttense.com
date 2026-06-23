import type { ComponentProps } from "react";
import type { PortableText } from "next-sanity";

export type StudioBlocks = ComponentProps<typeof PortableText>["value"];

export type Project = {
  project: string;
  projectLink?: string;
  services: string;
  sector: string;
  inPractice: string;
  with: string;
  withLink?: string;
};

// Site-wide meta tags, resolved for the document <head>. ogImageUrl is an
// absolute Sanity CDN URL, or null when no unfurl image is set. Optional fields
// are null (not undefined) so the object stays JSON-serializable through
// getStaticProps.
export type Seo = {
  title: string;
  description: string;
  ogImageUrl: string | null;
  ogImageAlt: string | null;
  tags: string[];
};

export type HomeProps = {
  seo: Seo;
  studio: StudioBlocks;
  services: string[];
  inPractice: StudioBlocks;
  principles: StudioBlocks;
  desktopImages: string[];
  mobileImages: string[];
  currently: Project[];
  previously: Project[];
};
