import { useEffect } from "react"

export default function AdcashBanner() {
  useEffect(() => {
    if (window.aclib) {
      window.aclib.runBanner({
        zoneId: '11174774',
      })
    }
  }, [])

  return <div id="adcash-banner"></div>
}