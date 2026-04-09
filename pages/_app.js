// pages/_app.js
import Head from "next/head";
import Layout from "../components/Layout";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Globelynks News</title>

        {/* Tailwind CDN */}
        <script src="https://cdn.tailwindcss.com"></script>

        {/* Monetad Ad Script */}
        <script
          src="https://5gvci.com/act/files/tag.min.js?z=10851573"
          data-cfasync="false"
          async
        ></script>

        {/* Tailwind Config */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      primary: '#2276fc'
                    }
                  }
                }
              }
            `,
          }}
        />

        {/* SEO Defaults */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Globelynks News" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Wrap all pages with Layout */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}