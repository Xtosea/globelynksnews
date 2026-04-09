import { useEffect } from "react"

export default function AdcashBanner() {
  useEffect(() => {
    if (window.aclib) {
      window.aclib.runInPagePush({
        zoneId: '11175106',
       maxAds: 2,
      })
    }
  }, [])

  return <div id="adcash-banner"></div>
}