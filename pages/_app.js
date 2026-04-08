import Head from "next/head"

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>

        {/* Monetad Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='10851618',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
          }}
        />

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