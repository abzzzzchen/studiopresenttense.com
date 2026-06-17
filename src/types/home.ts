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

export type HomeProps = {
  studio: StudioBlocks;
  services: string[];
  inPractice: StudioBlocks;
  principles: StudioBlocks;
  heroImages: string[];
  currently: Project[];
  previously: Project[];
};
