"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X, Play, Hand, Flame } from "lucide-react";
import Navbar from "@/components/Navbar";
import HomeStreamPlayer from "@/components/HomeStreamPlayer";
import TVGuide from "@/components/TVGuide";
import LiveChat from "@/components/LiveChat";
import PrayerRequestWidget from "@/components/PrayerRequestWidget";
import GiveButton from "@/components/GiveButton";
import LanguageSelector from "@/components/LanguageSelector";
import AmbientBackground from "@/components/AmbientBackground";
import GuidedTour from "@/components/GuidedTour";
import VideoCard from "@/components/VideoCard";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import CategoryCard from "@/components/CategoryCard";
import SectionNavigator from "@/components/SectionNavigator";
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
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const { t } = useI18n();
  const [isLive, setIsLive] = useState(false);
  
  // Gallery state
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<GalleryVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle hash navigation on page load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Wait for page to render, then scroll to section
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const offset = 100; // Account for fixed navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, []);

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
      <GuidedTour />
      
      <div className="relative z-10 pt-20 md:pt-24 lg:pt-28 pb-6 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Theme and Language Selector - Top */}
          <div className="mb-4 md:mb-6 flex items-center justify-end">
            <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
          </div>

          {/* Header Text - Below Theme/Language */}
          <div className="mb-4 md:mb-6">
              <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2 text-foreground">
                {t("home.title")}
              </h1>
              <p className="text-foreground/70 text-sm md:text-lg">
                {t("home.subtitle")}
              </p>
          </div>

          {/* Main Content */}
          <div id="top" className="space-y-4 md:space-y-6">
            {/* Stream Player - Full width */}
            <div className="relative">
              <HomeStreamPlayer
                onStreamStatusChange={(isLive) => setIsLive(isLive)}
                skipIntro={false}
              />
            </div>

            {/* Program Guide - Below video player */}
            <TVGuide />
            
            {/* Sidebar with Chat - Hidden on mobile unless toggled, always visible on desktop */}
            <div className="hidden md:block">
              <LiveChat />
            </div>
          </div>

          {/* Featured Section */}
          {getFeaturedVideos().length > 0 && (
            <section id="featured" className="mt-16 md:mt-20 pt-16 md:pt-20 border-t border-foreground/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {getFeaturedVideos().map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onPlay={handlePlayVideo}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Gallery Section - First section after Program Guide */}
          <section id="gallery" data-tour="gallery" className="mt-16 md:mt-20 pt-16 md:pt-20 border-t border-foreground/10">
            {/* Hero Section with Background Image */}
            <div className="relative mb-12 md:mb-16 rounded-2xl overflow-hidden">
              <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
                <Image
                  src="/categories/heroheader.jpg"
                  alt="EBOMI TV Gallery"
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-white">
                    {t("gallery.title")}
                  </h2>
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

            {/* Category Cards */}
            <div className="mb-12 md:mb-16">
              <div className="flex items-center justify-between gap-4 mb-6 md:mb-8 border-b border-[rgba(var(--foreground),0.1)] pb-4">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  {t("gallery.categoriesTitle")}
                </h3>
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
                      // Smooth scroll to gallery section
                      document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                    &quot;{searchQuery}&quot;
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Results Count */}
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
          </section>

          {/* About Section - Last section */}
          <section id="about" data-tour="about" className="mt-16 md:mt-20 pt-16 md:pt-20 border-t border-foreground/10">
            {/* Blue animated accents */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <motion.div
                className="absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full blur-[110px]"
                style={{ background: "rgba(2, 1, 180, 0.22)" }}
                animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-28 -right-28 h-[560px] w-[560px] rounded-full blur-[130px]"
                style={{ background: "rgba(145, 26, 41, 0.14)" }}
                animate={{ x: [0, -70, 0], y: [0, -55, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <motion.div
                className="lg:col-span-6"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="inline-flex items-center rounded-full border border-ministry-gold/35 bg-[rgba(var(--background),0.55)] px-4 py-2 backdrop-blur-sm shadow-sm shadow-ministry-gold/10">
                  <span className="text-xs font-semibold tracking-[0.18em] uppercase text-ministry-gold">
                    {t("about.badge")}
                  </span>
                </div>

                <h2 className="mt-5 font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                  {t("about.headingLine1")}
                  <span className="block text-gradient-gold">
                    {t("about.headingHighlight")}
                  </span>
                </h2>

                <p className="mt-5 text-foreground/75 text-base md:text-lg leading-relaxed max-w-2xl">
                  {t("about.description")}
                </p>

                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <motion.div
                    className="glass rounded-2xl p-5 border border-[rgba(var(--foreground),0.12)]"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1, type: "spring", stiffness: 240, damping: 18 }}
                    whileHover={{ y: -3 }}
                  >
                    <p className="text-sm font-semibold text-foreground">{t("about.card.mandate.title")}</p>
                    <p className="mt-1 text-foreground/70 text-sm leading-relaxed">
                      {t("about.card.mandate.body")}
                    </p>
                  </motion.div>
                  <motion.div
                    className="glass rounded-2xl p-5 border border-[rgba(var(--foreground),0.12)]"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2, type: "spring", stiffness: 240, damping: 18 }}
                    whileHover={{ y: -3 }}
                  >
                    <p className="text-sm font-semibold text-foreground">{t("about.card.message.title")}</p>
                    <p className="mt-1 text-foreground/70 text-sm leading-relaxed">
                      {t("about.card.message.body")}
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="lg:col-span-6"
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <div className="relative">
                  <motion.div
                    aria-hidden
                    className="absolute -inset-6 rounded-[2rem] blur-3xl"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 20%, rgba(2, 1, 180, 0.35), transparent 55%), radial-gradient(circle at 70% 80%, rgba(145, 26, 41, 0.18), transparent 60%)",
                    }}
                    animate={{ opacity: [0.55, 0.85, 0.55] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-ministry-gold/10"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  >
                    <motion.div
                      className="relative aspect-[4/3]"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Image
                        src="/aboutebomitv/image.jpg"
                        alt={t("about.imageAlt")}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    </motion.div>
                    <motion.div
                      className="absolute bottom-6 left-6 right-6"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="rounded-2xl bg-black/45 backdrop-blur-md px-5 py-4">
                        <p className="text-white text-sm md:text-base leading-relaxed">
                          {t("about.imageCaption")}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Statement */}
            <motion.div
              className="mt-14 md:mt-20"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="rounded-2xl bg-[rgba(var(--background),0.65)] backdrop-blur-sm p-6 md:p-10">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                  {t("about.statementTitle")}
                </h3>
                <p className="mt-3 text-foreground/75 text-base md:text-lg leading-relaxed max-w-4xl">
                  {t("about.statementBody")}
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: t("about.pillar1.title"),
                      body: t("about.pillar1.body"),
                    },
                    {
                      title: t("about.pillar2.title"),
                      body: t("about.pillar2.body"),
                    },
                    {
                      title: t("about.pillar3.title"),
                      body: t("about.pillar3.body"),
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      className="rounded-2xl border border-[rgba(var(--foreground),0.12)] bg-background p-5 md:p-6"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1, type: "spring", stiffness: 240, damping: 18 }}
                      whileHover={{ y: -3 }}
                    >
                      <p className="text-foreground font-semibold">{item.title}</p>
                      <p className="mt-2 text-foreground/70 text-sm leading-relaxed">
                        {item.body}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Get involved / CTA */}
            <motion.div
              className="mt-12 md:mt-16"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-end justify-between gap-6 mb-6">
                <div>
                  <p className="text-sm font-semibold tracking-[0.18em] uppercase text-ministry-gold">
                    {t("about.cta.kicker")}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl md:text-3xl font-bold text-foreground">
                    {t("about.cta.title")}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <motion.a
                  href="https://wa.me/2349034493360?text=I%20would%20like%20to%20advertise%20with%20you%20tell%20me%20more"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-border-gradient rounded-2xl border border-[rgba(var(--foreground),0.12)] bg-[rgba(var(--background),0.65)] p-7 md:p-8 block cursor-pointer group"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Hand className="h-5 w-5 text-ministry-gold group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold tracking-[0.18em] uppercase text-ministry-gold">
                      {t("about.cta.advertise.kicker")}
                    </span>
                  </div>
                  <h4 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                    {t("about.cta.advertise.title")}
                  </h4>
                  <p className="mt-3 text-foreground/70 leading-relaxed">
                    {t("about.cta.advertise.body")}
                  </p>
                </motion.a>

                <motion.a
                  href="https://wa.me/2349034493360?text=I%20would%20like%20to%20Intern%2FVolunteer%20with%20you%20tell%20about%20the%20requirements%20and%20eligibility%20criteria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-border-gradient rounded-2xl border border-[rgba(var(--foreground),0.12)] bg-[rgba(var(--background),0.65)] p-7 md:p-8 block cursor-pointer group"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Hand className="h-5 w-5 text-ministry-gold group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold tracking-[0.18em] uppercase text-ministry-gold">
                      {t("about.cta.volunteer.kicker")}
                    </span>
                  </div>
                  <h4 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                    {t("about.cta.volunteer.title")}
                  </h4>
                  <p className="mt-3 text-foreground/70 leading-relaxed">
                    {t("about.cta.volunteer.body")}
                  </p>
                </motion.a>
              </div>
            </motion.div>
          </section>
        </div>
      </div>

      {/* Floating Widgets - Mobile Optimized */}
      <div className="fixed bottom-6 left-4 md:left-6 z-40 flex flex-col gap-2">
        <PrayerRequestWidget />
        <GiveButton />
      </div>

      {/* Section Navigator - Up/Down arrows */}
      <SectionNavigator />

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}


