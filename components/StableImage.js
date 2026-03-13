"use client";

import { useState } from "react";

export default function StableImage({ src, alt, placeholder }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded bg-gray-200 aspect-video">
      <img
        src={src || placeholder}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={(e) => (e.currentTarget.src = placeholder)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}