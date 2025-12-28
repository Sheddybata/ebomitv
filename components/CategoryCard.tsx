"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { VideoCategory } from "@/lib/gallery-data";

interface CategoryCardProps {
  category: {
    value: VideoCategory;
    label: string;
    icon: string;
    image: string;
  };
  isSelected: boolean;
  onClick: () => void;
  count?: number;
}

export default function CategoryCard({
  category,
  isSelected,
  onClick,
  count,
}: CategoryCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-500 ${
        isSelected
          ? "border-ministry-gold shadow-lg shadow-ministry-gold/20 scale-[1.02]"
          : "border-transparent hover:border-ministry-red/50 bg-foreground/[0.03] dark:bg-white/[0.02]"
      }`}
      whileHover={{ scale: isSelected ? 1.02 : 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Category Image */}
      <div className="relative aspect-video w-full">
        <Image
          src={category.image}
          alt={category.label}
          fill
          className={`object-cover transition-all ${
            isSelected ? "brightness-100" : "brightness-75 group-hover:brightness-90"
          }`}
          onError={(e) => {
            // Fallback to gradient if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        
        {/* Overlay Gradient */}
        <div
          className={`absolute inset-0 transition-all ${
            isSelected
              ? "bg-gradient-to-t from-black/90 via-black/60 to-black/40"
              : "bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/85"
          }`}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-start justify-end p-4 md:p-6 z-10">
          <h3 className="font-serif text-lg md:text-2xl font-bold text-white mb-0.5 text-left tracking-tight">
            {category.label}
          </h3>
          {count !== undefined && (
            <p className="text-ministry-gold/90 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em]">
              {count} {count === 1 ? "Video" : "Videos"}
            </p>
          )}
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-ministry-gold rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-ministry-dark rounded-full" />
          </div>
        )}
      </div>
    </motion.button>
  );
}

