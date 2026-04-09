import { useEffect } from "react";

export default function AdcashVideoSlider() {
  useEffect(() => {
    if (window.aclib) {
      window.aclib.runVideoSlider({
        zoneId: "11175702",
      });
    }
  }, []);

  return null;
}