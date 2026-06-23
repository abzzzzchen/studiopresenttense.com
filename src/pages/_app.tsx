import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { motion } from "motion/react";
import { Analytics } from "@vercel/analytics/next";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* viewport-fit=cover exposes env(safe-area-inset-*) so fixed elements
          can clear the home indicator / notch ("chin") on mobile devices. */}
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {/* Stop mobile browsers from auto-linking the email/phone/address (which
            adds an underline + tap styling we never want). */}
        <meta
          name="format-detection"
          content="telephone=no, email=no, address=no, date=no"
        />
      </Head>
      {/* Fade the whole site in on load: opacity 0 → 1 over 0.3s, nothing else. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Component {...pageProps} />
      </motion.div>
      <Analytics />
    </>
  );
}
