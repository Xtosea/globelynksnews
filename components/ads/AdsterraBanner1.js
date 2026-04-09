"use client";

import { useEffect } from "react";

export default function AdsterraBanner1() {
  useEffect(() => {
    // Prevent duplicate load
    if (document.getElementById("trend-ad-script")) return;

    // Define global options
    window.atOptions = {
      key: "1f0fc51684d9eb27e09a097d7db65457",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };

    const script = document.createElement("script");
    script.id = "trend-ad-script";
    script.async = true;
    script.src =
      "https://www.highperformanceformat.com/1f0fc51684d9eb27e09a097d7db65457/invoke.js";

    document.body.appendChild(script);
  }, []);

  return (
    <div
      style={{
        width: "300px",
        height: "250px",
        margin: "20px auto",
        textAlign: "center",
      }}
    />
  );
}