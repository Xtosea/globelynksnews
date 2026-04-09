import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Adcash Library */}
        <script
          id="aclib"
          src="//acscdn.com/script/aclib.js"
          type="text/javascript"
        />
      </Head>

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