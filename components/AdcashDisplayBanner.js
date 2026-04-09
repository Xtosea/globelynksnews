"use client";

import { useEffect } from "react";

export default function AdcashDisplayBanner() {
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.aclib) {
        window.aclib.runBanner({
          zoneId: "11175706",
        });

        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <div id="adcash-banner"></div>;
}