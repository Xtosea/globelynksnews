"use client";

import { useEffect } from "react";

export default function TrendingAd() {
  useEffect(() => {
    // Prevent script from loading twice
    if (document.getElementById("effectivegate-script")) return;

    const script = document.createElement("script");
    script.id = "effectivegate-script";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src =
      "https://pl28748982.effectivegatecpm.com/872356e7bdfe5cfb68809141542a5ee2/invoke.js";

    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="container-872356e7bdfe5cfb68809141542a5ee2"
      style={{
        width: "100%",
        margin: "20px 0",
        display: "flex",
        justifyContent: "center",
      }}
    />
  );
}