"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY_VIDEOS, searchVideos, GalleryVideo } from "@/lib/gallery-data";
import VideoCard from "./VideoCard";
import { useI18n } from "@/lib/i18n";
import { useProgram } from "@/contexts/ProgramContext";
import { TVProgram } from "@/lib/types";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoSelect?: (video: GalleryVideo) => void;
  onPlay?: (video: GalleryVideo) => void;
}

export default function SearchOverlay({
  isOpen,
  onClose,
  onVideoSelect,
  onPlay,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<GalleryVideo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();
  const { playProgram } = useProgram();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ebomi_tv_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search as user types
  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchVideos(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  // Handle search
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      // Add to recent searches
      const updated = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("ebomi_tv_recent_searches", JSON.stringify(updated));
    }
  };

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
  }, []);

  // Close overlay
  const handleClose = useCallback(() => {
    clearSearch();
    onClose();
  }, [clearSearch, onClose]);

  // Helper function to parse duration string (e.g., "1:30:00" or "45:00") to milliseconds
  const parseDuration = (durationStr: string): number => {
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 3) {
      // HH:MM:SS
      return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
    } else if (parts.length === 2) {
      // MM:SS
      return (parts[0] * 60 + parts[1]) * 1000;
    }
    return 3600000; // Default 1 hour
  };

  // Trending searches (most viewed videos)
  const trendingSearches = GALLERY_VIDEOS
    .filter((v) => v.views && v.views > 1000)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map((v) => v.title);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-foreground/10"
          >
            <div className="max-w-7xl mx-auto p-4 md:p-6">
              {/* Search Input */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search videos, sermons, preachers..."
                  className="w-full pl-12 pr-12 py-4 bg-foreground/5 border border-foreground/10 rounded-xl text-foreground placeholder-foreground/30 focus:outline-none focus:border-ministry-gold focus:ring-4 focus:ring-ministry-gold/10 transition-all text-lg"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      handleClose();
                    }
                  }}
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Search Results or Suggestions */}
              {query.trim() ? (
                <div>
                  <h3 className="text-sm font-semibold text-foreground/60 mb-4">
                    {results.length} {results.length === 1 ? "result" : "results"}
                  </h3>
                  {results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {results.map((video) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                          onPlay={(v) => {
                            // Convert GalleryVideo to TVProgram format for home page player
                            // Format ID to match what HomeStreamPlayer expects: videoId-day-index
                            // Use current day and index 0 for search results
                            const now = new Date();
                            const day = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (24 * 60 * 60 * 1000));
                            const program: TVProgram = {
                              id: `${v.id}-${day}-0`, // Format: videoId-day-index (matches schedule format)
                              title: v.title,
                              titleLocalized: v.titleLocalized,
                              description: v.description,
                              descriptionLocalized: v.descriptionLocalized,
                              thumbnail: v.thumbnail,
                              startTime: new Date(), // Current time for immediate playback
                              endTime: new Date(Date.now() + (v.duration ? parseDuration(v.duration) : 3600000)), // Default 1 hour if no duration
                              type: v.category === "praise" ? "worship" : v.category === "podcast" ? "teaching" : "sermon",
                              channel: "Main",
                              isLive: false,
                              // Add videoUrl directly to help with matching
                              videoUrl: v.videoUrl,
                            };
                            
                            // Play in home page player
                            playProgram(program);
                            
                            // Also call optional callbacks if provided
                            if (onPlay) {
                              onPlay(v);
                            } else {
                              onVideoSelect?.(v);
                            }
                            handleClose();
                          }}
                          showProgress={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-foreground/60 mb-2">No results found</p>
                      <p className="text-foreground/40 text-sm mb-4">
                        Try different keywords
                      </p>
                      <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-ministry-gold hover:bg-ministry-gold/90 text-white font-semibold rounded-lg transition-colors"
                      >
                        Close Search
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-foreground/60" />
                        <h3 className="text-sm font-semibold text-foreground/60">
                          Recent Searches
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(search)}
                            className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 rounded-lg text-foreground/80 text-sm transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Searches */}
                  {trendingSearches.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-foreground/60" />
                        <h3 className="text-sm font-semibold text-foreground/60">
                          Trending
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(search)}
                            className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 rounded-lg text-foreground/80 text-sm transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
