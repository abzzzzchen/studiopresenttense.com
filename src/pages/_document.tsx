import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload the body/display typeface so it's fetched before first paint
            and text renders in LayGrotesk immediately (no flash of fallback
            text). crossOrigin is required: fonts are always requested in CORS
            mode, so the preload must match or the browser double-fetches. */}
        <link
          rel="preload"
          href="/fonts/LayGrotesk/LayGrotesk-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <body className="antialiased font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
