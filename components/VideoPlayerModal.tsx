"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryVideo } from "@/lib/gallery-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateVideoText } from "@/lib/video-translations";

interface VideoPlayerModalProps {
  video: GalleryVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

// Build video URL with autoplay
function getVideoUrlWithAutoplay(url: string): string {
  // Check if URL is a Facebook embed URL
  if (url.includes('facebook.com/plugins/video.php')) {
    // Facebook embed URLs - add autoplay parameter
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}autoplay=true`;
  } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
    // YouTube URLs - convert to embed format if needed
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`;
    }
  } else {
    // For other URLs, try to add autoplay
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}autoplay=1`;
  }
  
  return url;
}

export default function VideoPlayerModal({
  video,
  isOpen,
  onClose,
}: VideoPlayerModalProps) {
  const [hasError, setHasError] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setHasError(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!video) return null;

  const pick = (base?: string, localized?: Record<string, string>) =>
    (localized && localized[language]) || base || "";

  // Get base values (with localized fallback if available)
  const baseTitle = pick(video.title, video.titleLocalized);
  const baseDescription = pick(video.description, video.descriptionLocalized);
  const preacher = pick(video.preacher, video.preacherLocalized);
  const guest = pick(video.guest, video.guestLocalized);
  const date = pick(video.date, video.dateLocalized);

  // Apply automatic translations if no localized data exists
  const title = video.titleLocalized ? baseTitle : translateVideoText(baseTitle, language);
  const description = video.descriptionLocalized ? baseDescription : translateVideoText(baseDescription, language);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100]"
            onClick={() => onClose()}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-5xl max-h-[95vh] bg-background rounded-lg sm:rounded-2xl overflow-hidden border border-foreground/10 shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between p-3 sm:p-4 border-b border-ministry-gold/30 flex-shrink-0 relative">
                <div className="flex-1 pr-2 min-w-0">
                  <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-foreground line-clamp-2">
                    {title}
                  </h2>
                  {preacher && (
                    <p className="text-ministry-gold text-xs sm:text-sm mt-1 font-medium line-clamp-1">
                      {preacher}
                    </p>
                  )}
                  {guest && (
                    <p className="text-ministry-gold text-xs sm:text-sm mt-1 font-medium line-clamp-1">
                      Guest: {guest}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-2 sm:p-2.5 hover:bg-foreground/10 active:bg-foreground/20 rounded-lg transition-colors z-[101] relative"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative w-full aspect-video bg-black flex-shrink-0">
                {!hasError ? (
                  <>
                    <iframe
                      key={video.id}
                      src={getVideoUrlWithAutoplay(video.videoUrl)}
                      className="w-full h-full"
                      allowFullScreen
                      allow="autoplay; encrypted-media; picture-in-picture; web-share"
                      style={{ border: "none" }}
                      onError={() => setHasError(true)}
                      onLoad={() => {
                        // Check if the iframe content indicates an error
                        try {
                          const iframe = document.querySelector(`iframe[key="${video.id}"]`) as HTMLIFrameElement;
                          if (iframe) {
                            // Listen for messages from the iframe (Facebook sends error messages)
                            window.addEventListener('message', (event) => {
                              if (event.origin.includes('facebook.com') && event.data?.type === 'error') {
                                setHasError(true);
                              }
                            });
                          }
                        } catch (e) {
                          // Ignore errors in iframe communication
                        }
                      }}
                    />
                    {/* Facebook Attribution - Required by Facebook's Terms */}
                    {video.videoUrl.includes('facebook.com') && (
                      <div className="absolute bottom-2 right-2 text-xs text-white/60 bg-black/50 px-2 py-1 rounded">
                        Powered by Facebook
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black/80">
                    <div className="text-center px-6">
                      <div className="w-16 h-16 bg-ministry-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-ministry-red" />
                      </div>
                      <h3 className="text-white text-xl font-bold mb-2">Video Unavailable</h3>
                      <p className="text-white/70 text-sm mb-4">
                        This video may have been removed or is no longer available. Please try another video from our gallery.
                      </p>
                      <button
                        onClick={onClose}
                        className="bg-ministry-gold hover:bg-ministry-gold/80 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                      >
                        Browse Other Videos
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              {description && (
                <div className="p-3 sm:p-4 md:p-6 border-t border-ministry-gold/30 overflow-y-auto flex-shrink">
                  <h3 className="font-bold text-foreground mb-2 uppercase tracking-widest text-xs">Description</h3>
                  <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed">
                    {description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs font-bold uppercase tracking-widest text-ministry-gold/80">
                    <span>{date}</span>
                    {video.duration && <span>Duration: {video.duration}</span>}
                    {video.views && (
                      <span>{video.views.toLocaleString()} views</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

