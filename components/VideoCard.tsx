"use client";

import { Play, Clock, Eye, User, Mic } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GalleryVideo } from "@/lib/gallery-data";
import { useLanguage } from "@/contexts/LanguageContext";

interface VideoCardProps {
  video: GalleryVideo;
  onPlay?: (video: GalleryVideo) => void;
}

export default function VideoCard({ video, onPlay }: VideoCardProps) {
  const { language } = useLanguage();

  const pick = (base?: string, localized?: Record<string, string>) =>
    (localized && localized[language]) || base || "";

  const title = pick(video.title, video.titleLocalized);
  const description = pick(video.description, video.descriptionLocalized);
  const preacher = pick(video.preacher, video.preacherLocalized);
  const guest = pick(video.guest, video.guestLocalized);
  const date = pick(video.date, video.dateLocalized);

  const handleClick = () => {
    if (onPlay) {
      onPlay(video);
    }
  };

  const getCategoryColor = (category: GalleryVideo["category"]) => {
    switch (category) {
      case "sermon":
        return "bg-ministry-gold";
      case "praise":
        return "bg-ministry-red";
      case "podcast":
        return "bg-blue-600";
      case "interview":
        return "bg-purple-600";
      case "testimony":
        return "bg-green-600";
      default:
        return "bg-neutral-600";
    }
  };

  return (
    <motion.div
      className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer hover:border-ministry-gold/30 transition-all duration-500"
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-background to-[rgba(var(--foreground),0.1)] overflow-hidden">
        {/* Thumbnail Image */}
        {video.thumbnail && video.thumbnail !== "/api/placeholder/400/225" ? (
          <Image
            src={video.thumbnail}
            alt={title || video.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-ministry-red/20 to-ministry-gold/20" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Category Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span
            className={`px-2 py-1 ${getCategoryColor(video.category)} text-white text-[10px] font-bold rounded tracking-wider`}
          >
            {video.category.toUpperCase()}
          </span>
        </div>

        {/* Featured Badge */}
        {video.featured && (
          <div className="absolute top-2 right-2 z-10">
            <span className="px-2 py-1 bg-ministry-gold text-white text-[10px] font-bold rounded tracking-wider shadow-sm">
              ⭐ FEATURED
            </span>
          </div>
        )}

        {/* Duration */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-white text-[10px] font-medium">
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
        )}

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 border-2 border-ministry-gold/0 group-hover:border-ministry-gold/60 transition-all duration-300 rounded-lg" />
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <h3 className="font-serif text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-ministry-gold transition-colors line-clamp-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-foreground/60 text-sm mb-3 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-ministry-gold/80 font-medium">
          {preacher && (
            <span className="flex items-center gap-1.5 uppercase tracking-wide">
              <User className="w-3.5 h-3.5" />
              {preacher}
            </span>
          )}
          {guest && (
            <span className="flex items-center gap-1.5 uppercase tracking-wide">
              <Mic className="w-3.5 h-3.5" />
              {guest}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(var(--foreground),0.05)]">
          <span className="text-foreground/30 text-[10px] font-bold uppercase tracking-widest">
            {date}
          </span>
          {video.views && (
            <span className="text-foreground/30 text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-widest">
              <Eye className="w-3.5 h-3.5" />
              {video.views.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}


