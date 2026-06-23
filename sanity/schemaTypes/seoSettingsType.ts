import { SearchIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Singleton holding the site-wide meta tags surfaced in the document <head>:
// title, description, social unfurl image, and tags/keywords. Edited in the
// Studio under "SEO & Social"; consumed by the <Seo> component on the frontend.
export const seoSettingsType = defineType({
  name: "seoSettings",
  title: "SEO & Social",
  type: "document",
  icon: SearchIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description:
        "The browser tab title and social card heading. ~50–60 characters.",
      type: "string",
      validation: (Rule) => [
        Rule.required(),
        Rule.max(70).warning("Longer titles get truncated."),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      description:
        "Shown in search results and link previews. ~150–160 characters.",
      type: "text",
      rows: 3,
      validation: (Rule) => [
        Rule.required(),
        Rule.max(200).warning("Descriptions over ~160 chars get truncated."),
      ],
    }),
    defineField({
      name: "ogImage",
      title: "Unfurl Image",
      description:
        "The preview image shown when the site is shared (Open Graph / Twitter). Cropped to 1200×630.",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description: "Keywords describing the site, surfaced as a meta tag.",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  // Singleton — there is only ever one SEO & Social document.
  preview: {
    prepare() {
      return { title: "SEO & Social" };
    },
  },
});
