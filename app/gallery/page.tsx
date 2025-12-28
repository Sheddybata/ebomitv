"use client";

import { useState, useMemo } from "react";
import { Search, X, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import VideoCard from "@/components/VideoCard";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import CategoryCard from "@/components/CategoryCard";
import AmbientBackground from "@/components/AmbientBackground";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/lib/i18n";
import {
  GALLERY_VIDEOS,
  CATEGORIES,
  VideoCategory,
  getVideosByCategory,
  getFeaturedVideos,
  searchVideos,
  GalleryVideo,
} from "@/lib/gallery-data";
import Image from "next/image";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<GalleryVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { t } = useI18n();

  const filteredVideos = useMemo(() => {
    let videos = GALLERY_VIDEOS;

    if (selectedCategory === "featured") {
      videos = getFeaturedVideos();
    } else if (selectedCategory !== "all") {
      videos = videos.filter((video) => video.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const searchResults = searchVideos(searchQuery);
      if (selectedCategory === "featured") {
        videos = searchResults.filter((video) => video.featured);
      } else if (selectedCategory !== "all") {
        videos = searchResults.filter((video) => video.category === selectedCategory);
      } else {
        videos = searchResults;
      }
    }

    return videos;
  }, [selectedCategory, searchQuery]);

  const handlePlayVideo = (video: GalleryVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  const getCategoryCount = (category: VideoCategory) => {
    if (category === "all") return GALLERY_VIDEOS.length;
    if (category === "featured") return getFeaturedVideos().length;
    return GALLERY_VIDEOS.filter((v) => v.category === category).length;
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <AmbientBackground />
      <Navbar />

      <div className="relative z-10 pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Language Selector - Positioned above hero */}
          <div className="flex justify-end mb-10">
            <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
          </div>

          {/* Hero Section with Background Image */}
          <div className="relative mb-12 md:mb-16 rounded-2xl overflow-hidden">
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
              {/* Background Image */}
              <Image
                src="/categories/heroheader.jpg"
                alt="EBOMI TV Gallery"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-white">
                  {t("gallery.title")}
                </h1>
                <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed font-light">
                  {t("gallery.subtitle")}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-10 md:mb-12">
            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ministry-gold group-focus-within:text-foreground transition-colors" />
              <input
                type="text"
                placeholder={t("gallery.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-foreground/[0.03] dark:bg-white/[0.03] border border-foreground/10 dark:border-white/10 hover:border-ministry-gold/50 focus:border-ministry-gold glass rounded-2xl text-foreground placeholder-foreground/30 focus:outline-none focus:ring-4 focus:ring-ministry-gold/10 transition-all text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Cards - Visual Grid */}
          <div className="mb-12 md:mb-16">
            <div className="flex items-center justify-between gap-4 mb-6 md:mb-8 border-b border-[rgba(var(--foreground),0.1)] pb-4">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {t("gallery.categoriesTitle")}
              </h2>
              <p className="text-ministry-gold text-xs font-semibold tracking-widest uppercase">
                {CATEGORIES.length} {t("gallery.collectionsLabel")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {CATEGORIES.map((category) => (
                <CategoryCard
                  key={category.value}
                  category={category}
                  isSelected={selectedCategory === category.value}
                  onClick={() => {
                    setSelectedCategory(category.value);
                  }}
                  count={getCategoryCount(category.value)}
                />
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== "all" || searchQuery) && (
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="text-foreground/40 text-sm font-medium uppercase tracking-wider">
                {t("gallery.filtersLabel")}
              </span>
              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="px-4 py-2 bg-ministry-red/10 text-ministry-red border border-ministry-red/30 text-sm font-semibold rounded-full flex items-center gap-2 hover:bg-ministry-red/20 transition-colors"
                >
                  {CATEGORIES.find((c) => c.value === selectedCategory)?.label}
                  <X className="w-4 h-4" />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-[rgba(var(--foreground),0.05)] text-foreground/80 border border-[rgba(var(--foreground),0.1)] text-sm font-semibold rounded-full flex items-center gap-2 hover:bg-[rgba(var(--foreground),0.1)] transition-colors"
                >
                  "{searchQuery}"
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Results Count & Layout Toggle (Optional, keeping it simple for now) */}
          <div className="mb-8 flex items-center justify-between border-b border-[rgba(var(--foreground),0.05)] pb-4">
            <p className="text-foreground/50 text-sm md:text-base font-medium">
              {t("gallery.showingLabel")}{" "}
              <span className="text-foreground font-bold">{filteredVideos.length}</span>{" "}
              {filteredVideos.length === 1 ? t("gallery.videoSingular") : t("gallery.videoPlural")}
            </p>
          </div>

          {/* Video Grid */}
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={handlePlayVideo}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glass rounded-3xl border border-dashed border-[rgba(var(--foreground),0.12)]">
              <div className="text-6xl mb-6 opacity-50">📹</div>
              <h3 className="font-serif text-3xl font-bold text-foreground mb-3">
                {t("gallery.noVideosTitle")}
              </h3>
              <p className="text-foreground/60 mb-8 max-w-md mx-auto">
                {t("gallery.noVideosBody")}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-8 py-3 bg-ministry-gold hover:bg-ministry-gold/90 text-ministry-dark font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-ministry-gold/20"
              >
                {t("gallery.clearFilters")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}
