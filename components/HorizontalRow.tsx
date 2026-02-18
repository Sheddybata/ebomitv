"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import VideoCard from "./VideoCard";
import { GalleryVideo } from "@/lib/gallery-data";
import { getDeviceType } from "@/lib/tv-detection";

interface HorizontalRowProps {
  title: string;
  videos: GalleryVideo[];
  onPlay?: (video: GalleryVideo) => void;
  largeCards?: boolean;
  seeAllLink?: string;
}

export default function HorizontalRow({
  title,
  videos,
  onPlay,
  largeCards = false,
  seeAllLink,
}: HorizontalRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const deviceType = getDeviceType();
  const isTV = deviceType === 'tv';

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    const targetScroll = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  if (videos.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 px-4 md:px-0">
        <h2 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          {title}
        </h2>
        {seeAllLink && (
          <a
            href={seeAllLink}
            className="text-ministry-gold hover:text-ministry-gold/80 text-sm md:text-base font-medium transition-colors"
          >
            See All →
          </a>
        )}
      </div>

      {/* Scrollable Row Container */}
      <div className="relative group">
        {/* Left Arrow - Desktop Only */}
        {showLeftArrow && !isTV && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-0 bottom-0 z-10 items-center justify-center w-12 bg-gradient-to-r from-background via-background/80 to-transparent hover:from-background/90 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-8 h-8 text-foreground/70 hover:text-foreground transition-colors" />
          </button>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-0 pb-4"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="flex-shrink-0"
              style={{
                width: largeCards
                  ? isTV
                    ? '400px'
                    : 'min(90vw, 320px)'
                  : isTV
                  ? '300px'
                  : 'min(70vw, 240px)',
                scrollSnapAlign: 'start',
              }}
            >
              <VideoCard video={video} onPlay={onPlay} />
            </div>
          ))}
        </div>

        {/* Right Arrow - Desktop Only */}
        {showRightArrow && !isTV && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-0 bottom-0 z-10 items-center justify-center w-12 bg-gradient-to-l from-background via-background/80 to-transparent hover:from-background/90 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-8 h-8 text-foreground/70 hover:text-foreground transition-colors" />
          </button>
        )}
      </div>
    </div>
  );
}
