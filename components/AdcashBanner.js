import { useEffect } from "react"

export default function AdcashBanner() {
  useEffect(() => {
    if (window.aclib) {
      window.aclib.runBanner({
        zoneId: '11174826',
      })
    }
  }, [])

  return <div id="adcash-banner"></div>
}