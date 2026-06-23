import Head from "next/head";

import type { Seo as SeoData } from "@/types/home";

// Renders the site-wide meta tags into the document <head>. Driven by the
// `seoSettings` singleton in Sanity (see fetchHomeData → toSeo). Keys are set on
// the OG/Twitter tags so a per-page <Seo> could override them without duplicating.
export function Seo({ title, description, ogImageUrl, ogImageAlt, tags }: SeoData) {
  return (
    <Head>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      {tags.length ? (
        <meta name="keywords" content={tags.join(", ")} />
      ) : null}

      {/* Open Graph (Facebook, LinkedIn, iMessage, Slack, …) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} key="og:title" />
      {description ? (
        <meta
          property="og:description"
          content={description}
          key="og:description"
        />
      ) : null}
      {ogImageUrl ? (
        <>
          <meta property="og:image" content={ogImageUrl} key="og:image" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          {ogImageAlt ? (
            <meta property="og:image:alt" content={ogImageAlt} />
          ) : null}
        </>
      ) : null}

      {/* Twitter / X card */}
      <meta
        name="twitter:card"
        content={ogImageUrl ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={title} />
      {description ? (
        <meta name="twitter:description" content={description} />
      ) : null}
      {ogImageUrl ? (
        <meta name="twitter:image" content={ogImageUrl} />
      ) : null}
    </Head>
  );
}
