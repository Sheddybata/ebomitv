"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import TVGuide from "./TVGuide";

interface LazyTVGuideProps {
  // Pass through any props TVGuide might need
}

export default function LazyTVGuide(props: LazyTVGuideProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad) return; // Already loading/loaded

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "200px", // Start loading 200px before it comes into view
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  if (!shouldLoad) {
    return (
      <div
        ref={containerRef}
        className="glass rounded-lg p-4 md:p-6 shadow-lg animate-pulse min-h-[400px]"
      >
        <div className="h-8 bg-foreground/10 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-foreground/5 rounded"></div>
      </div>
    );
  }

  return <TVGuide />;
}
