import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

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
      <Component {...pageProps} />
    </>
  );
}
