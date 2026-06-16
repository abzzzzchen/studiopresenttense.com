/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION

export default defineCliConfig({
  api: { projectId, dataset },
  // The Studio bundle reads NEXT_PUBLIC_* env vars (see sanity/env.ts), but the
  // Sanity CLI only inlines SANITY_STUDIO_* into the browser bundle by default.
  // Expose them explicitly so `sanity dev`/`build`/`deploy` work standalone too.
  vite: (config) => ({
    ...config,
    define: {
      ...config.define,
      'process.env.NEXT_PUBLIC_SANITY_PROJECT_ID': JSON.stringify(projectId),
      'process.env.NEXT_PUBLIC_SANITY_DATASET': JSON.stringify(dataset),
      'process.env.NEXT_PUBLIC_SANITY_API_VERSION': JSON.stringify(apiVersion),
    },
  }),
})
