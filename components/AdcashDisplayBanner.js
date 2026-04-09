import { useEffect } from "react";

export default function AdcashVideoSlider() {
  useEffect(() => {
    if (window.aclib) {
      window.aclib.runBanner({
        zoneId: "11175706",
      });
    }
  }, []);

  return null;
}