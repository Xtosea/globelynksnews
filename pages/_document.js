import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Adcash Library */}
       <script id="aclib" type="text/javascript" src="//acscdn.com/script/aclib.js"></script>

<script id="aclib" type="text/javascript" src="//acscdn.com/script/aclib.js"></script>


      </Head>

      <body className="bg-white dark:bg-gray-900 transition-colors">
        <Main />
        <NextScript />

        
      </body>
    </Html>
  );
}