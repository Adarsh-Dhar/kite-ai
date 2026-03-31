import React, { useEffect, useState } from "react";

export function SkeletonCell() {
  const [width, setWidth] = useState("70%"); // fallback for SSR

  useEffect(() => {
    setWidth(`${60 + Math.random() * 40}%`);
  }, []);

  return (
    <div
      className="h-4 bg-[#1a1a1a] rounded animate-pulse"
      style={{ width }}
    />
  );
}
