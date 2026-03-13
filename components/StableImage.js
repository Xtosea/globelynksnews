"use client";

import { useState } from "react";

export default function StableImage({ src, alt, placeholder }) {
  const [loaded, setLoaded] = useState(false);

  const imageSrc = src || placeholder;

  return (
    <div className="relative w-full overflow-hidden rounded bg-gray-200 aspect-video">
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.currentTarget.src = placeholder;
          setLoaded(true);
        }}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-100"
        }`}
      />
    </div>
  );
}