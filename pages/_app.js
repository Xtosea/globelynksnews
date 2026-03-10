import Head from "next/head"

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Tailwind CDN */}
        <script src="https://cdn.tailwindcss.com"></script>

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

        {/* SEO */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Globelynks Blog" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Component {...pageProps} />
    </>
  )
}