import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />

      <body className="bg-white dark:bg-gray-900 transition-colors">
        <Main />
        <NextScript />

        {/* Monetad Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              aclib.runAutoTag({
                zoneId: '0vlavhw2a'
              });
            `,
          }}
        />

      </body>
    </Html>
  );
}