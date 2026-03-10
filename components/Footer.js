import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Footer() {
  return (
    <footer className="border-t mt-16 py-8 text-center text-sm text-gray-500">

   <SpeedInsights/>

      © {new Date().getFullYear()} Powered by Board Givers International Multipurpose Limited. All rights reserved
    </footer>
  )
}
