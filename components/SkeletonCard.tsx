"use client";

import { motion } from "framer-motion";

export default function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-video bg-foreground/10" />

      {/* Content Skeleton */}
      <div className="p-4 md:p-6 space-y-3">
        {/* Title */}
        <div className="h-5 bg-foreground/10 rounded w-3/4" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 bg-foreground/10 rounded w-full" />
          <div className="h-3 bg-foreground/10 rounded w-5/6" />
        </div>

        {/* Metadata */}
        <div className="flex gap-4">
          <div className="h-3 bg-foreground/10 rounded w-20" />
          <div className="h-3 bg-foreground/10 rounded w-16" />
        </div>
      </div>
    </div>
  );
}
