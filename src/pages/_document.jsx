import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />

        <NextScript />

        <Script
          type="module"
          src="https://cdn.jsdelivr.net/npm/ionicons@latest/dist/ionicons/ionicons.esm.js"
          strategy="beforeInteractive"
        />

        <Script
          noModule
          src="https://cdn.jsdelivr.net/npm/ionicons@latest/dist/ionicons/ionicons.js"
          strategy="beforeInteractive"
        />
      </body>
    </Html>
  );
}
