import { HomeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const homepageType = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "studio",
      title: "Studio",
      type: "blockContent",
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
    defineField({
      name: "inPractice",
      title: "In Practice",
      type: "blockContent",
    }),
    defineField({
      name: "principles",
      title: "Principles",
      type: "blockContent",
    }),
    defineField({
      // Field key kept as `images` so existing uploads carry over without a
      // data migration; it now represents the desktop (landscape) set.
      name: "images",
      title: "Desktop Images (landscape)",
      description: "Landscape images shown on desktop — cropped to 3:2.",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
    defineField({
      name: "mobileImages",
      title: "Mobile Images (portrait)",
      description:
        "Portrait images shown on mobile — cropped to 4:5. If left empty, the desktop images are used.",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
  ],
  // Singleton — there is only ever one Homepage document.
  preview: {
    prepare() {
      return { title: "Homepage" };
    },
  },
});
