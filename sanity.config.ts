"use client";

/**
 * This configuration is used for the Sanity Studio. Run it standalone with
 * `npx sanity dev`, or mount it in a Next.js route via `basePath` (see below).
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const SINGLETONS = ["homepage"];

export default defineConfig({
  name: "default",
  title: "Studio Present Tense",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    // Keep singleton types out of the global "Create new" menu.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((item) => !SINGLETONS.includes(item.templateId))
        : prev,
    // Singletons can't be deleted, duplicated, or unpublished.
    actions: (prev, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? prev.filter(
            ({ action }) =>
              action && !["delete", "duplicate", "unpublish"].includes(action)
          )
        : prev,
  },
});
