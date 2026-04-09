"use client";

import { useEffect } from "react";

export default function AdcashVideoSlider() {
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.aclib) {
        window.aclib.runVideoSlider({
          zoneId: "11175702",
        });

        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return null;
}