"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Music, Radio as RadioIcon, Play, X } from "lucide-react";
import { PreRecordedContent } from "@/lib/types";
import { PRERECORDED_PLAYLIST } from "@/lib/stream-config";
import CaptionOverlay from "./CaptionOverlay";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/lib/i18n";

interface PreRecordedPlayerProps {
  content: PreRecordedContent;
  autoPlay?: boolean;
  /** If false, skip the MP4 intro and go straight to the embedded player. */
  withIntro?: boolean;
  onEnded?: () => void;
}

const INTRO_VIDEO = "/ebomitvintro.mp4";

export default function PreRecordedPlayer({
  content,
  autoPlay = true,
  withIntro = true,
  onEnded,
}: PreRecordedPlayerProps) {
  const { language } = useLanguage();
  const { t } = useI18n();
  const [currentVideo, setCurrentVideo] = useState(content);
  const [showIntro, setShowIntro] = useState(withIntro);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errorCheckTimeout, setErrorCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const [programEnded, setProgramEnded] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const programEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const localizedTitle = currentVideo.titleLocalized?.[language] || currentVideo.title;

  // Function to try a different video when current one fails
  // DISABLED: Don't auto-switch videos - let the parent component (LiveStream) handle schedule-based switching
  const tryDifferentVideo = () => {
    // Don't automatically switch videos - this causes mismatches with the program guide
    // The parent LiveStream component will handle switching based on the schedule
    console.log(`Video failed for: ${currentVideo.title}. Waiting for parent to handle schedule-based switching.`);
    setHasError(true);
  };

  useEffect(() => {
    setShowIntro(withIntro);
    setHasError(false);
  }, [withIntro, content.id]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (errorCheckTimeout) {
        clearTimeout(errorCheckTimeout);
      }
    };
  }, [errorCheckTimeout]);

  useEffect(() => {
    const index = PRERECORDED_PLAYLIST.findIndex((c) => c.id === content.id);
    setCurrentVideo(index !== -1 ? PRERECORDED_PLAYLIST[index] : content);
    setHasError(false); // Reset error state when video changes
    setRetryCount(0); // Reset retry count when video changes
    setHasLoaded(false); // Reset loaded state when video changes
    setProgramEnded(false); // Reset program ended state
    setShowIntro(false); // Don't show intro when content changes initially
    
    // Clear any existing error check timeout
    if (errorCheckTimeout) {
      clearTimeout(errorCheckTimeout);
      setErrorCheckTimeout(null);
    }
    
    // Clear any existing program end timeout
    if (programEndTimeoutRef.current) {
      clearTimeout(programEndTimeoutRef.current);
      programEndTimeoutRef.current = null;
    }
  }, [content, content.id]);

  useEffect(() => {
    const video = introVideoRef.current;
    if (!video || !showIntro) return;

    video.src = INTRO_VIDEO;
    video.load();

    const onEndedLocal = () => {
      setShowIntro(false);
      setProgramEnded(false);
      // After intro ends, if program ended, trigger onEnded to load next program
      if (programEnded && onEnded) {
        onEnded();
      }
    };
    const onErrorLocal = () => {
      // If intro fails, just fall through to the main player.
      setShowIntro(false);
      setProgramEnded(false);
      if (programEnded && onEnded) {
        onEnded();
      }
    };

    video.addEventListener("ended", onEndedLocal);
    video.addEventListener("error", onErrorLocal);

    // Autoplay is only reliable when muted; keep it muted to avoid browser blocks.
    if (autoPlay) {
      video.play().catch(() => {
        // If autoplay is blocked, user can press play using native controls.
      });
    }

    return () => {
      video.removeEventListener("ended", onEndedLocal);
      video.removeEventListener("error", onErrorLocal);
    };
  }, [showIntro, autoPlay, onEnded, programEnded]);
  
  // Monitor iframe for program end (when video ends, play intro before next program)
  useEffect(() => {
    if (!iframeRef.current || showIntro) return;
    
    // For iframes, we can't directly detect when video ends
    // Instead, we'll use a timeout based on the program's scheduled end time
    // This will be handled by the parent component (LiveStream) checking program schedule
    // But we can also set up a listener for iframe messages if available
    
    // Cleanup
    return () => {
      if (programEndTimeoutRef.current) {
        clearTimeout(programEndTimeoutRef.current);
        programEndTimeoutRef.current = null;
      }
    };
  }, [showIntro, currentVideo]);

  const getTypeIcon = (type: PreRecordedContent["type"]) => {
    switch (type) {
      case "worship":
        return <Music className="w-5 h-5" />;
      case "podcast":
        return <RadioIcon className="w-5 h-5" />;
      default:
        return <Play className="w-5 h-5" />;
    }
  };

  const embedSrc = useMemo(() => {
    const raw = currentVideo.url;

    // Facebook plugin URLs: keep as-is, but explicitly disable autoplay.
    if (raw.includes("facebook.com/plugins/video.php")) {
      const hasAutoplayParam = /[?&]autoplay=/.test(raw);
      const withAutoplayDisabled = hasAutoplayParam
        ? raw.replace(/([?&])autoplay=[^&]*/g, "$1autoplay=false")
        : `${raw}&autoplay=false`;

      // Also discourage fullscreen behavior on mobile by disabling it at the plugin level.
      return /[?&]allowfullscreen=/.test(withAutoplayDisabled)
        ? withAutoplayDisabled.replace(/([?&])allowfullscreen=[^&]*/g, "$1allowfullscreen=false")
        : `${withAutoplayDisabled}&allowfullscreen=false`;
    }

    // YouTube: normalize to embed URL and enable default controls.
    if (raw.includes("youtube.com") || raw.includes("youtu.be")) {
      let videoId = "";
      if (raw.includes("youtube.com/watch?v=")) {
        videoId = raw.split("v=")[1]?.split("&")[0] || "";
      } else if (raw.includes("youtu.be/")) {
        videoId = raw.split("youtu.be/")[1]?.split("?")[0] || "";
      } else if (raw.includes("youtube.com/embed/")) {
        videoId = raw.split("embed/")[1]?.split("?")[0] || "";
      }

      if (videoId) {
        // fs=0 disables fullscreen button; playsinline helps keep playback in-page on iOS Safari.
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0&modestbranding=1&playsinline=1&fs=0`;
      }
    }

    // Default: leave it unchanged (platform decides controls).
    return raw;
  }, [currentVideo.url]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {showIntro ? (
        <video
          ref={introVideoRef}
          className="w-full h-full object-contain bg-black"
          playsInline
          webkit-playsinline="true"
          muted
          controlsList="nofullscreen noremoteplayback nodownload"
          disablePictureInPicture
          controls
          preload="auto"
          autoPlay={autoPlay}
        />
      ) : hasError ? (
        <div className="w-full h-full flex items-center justify-center bg-black/80">
          <div className="text-center px-6">
            <div className="w-16 h-16 bg-ministry-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-ministry-red" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Video Unavailable</h3>
            <p className="text-white/70 text-sm mb-4">
              This video may no longer exist, or you don&apos;t have permission to view it.
            </p>
            {retryCount >= 5 ? (
              <p className="text-white/50 text-xs">
                All videos attempted. Please check back later.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-white/60 text-xs mb-2">
                  Attempting to load another video...
                </p>
                <button
                  onClick={tryDifferentVideo}
                  className="bg-ministry-gold hover:bg-ministry-gold/80 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                >
                  Try Different Video Now
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <iframe
            ref={iframeRef}
            src={embedSrc}
            title={localizedTitle}
            className="w-full h-full"
            loading="lazy"
            allow="encrypted-media; picture-in-picture; web-share"
            style={{ border: "none" }}
            onError={() => {
              console.log(`Video iframe error for: ${currentVideo.title}`);
              // Only retry if we haven't tried this video before
              if (retryCount === 0) {
                tryDifferentVideo();
              } else {
                setHasError(true);
              }
            }}
            onLoad={() => {
              // Mark as loaded successfully
              setHasLoaded(true);

              // Don't auto-switch videos on error - let the parent LiveStream component
              // handle schedule-based switching. This prevents YouTube videos from
              // switching to Facebook videos and keeps the program guide in sync.
            }}
          />
          {/* Facebook Attribution - Required by Facebook's Terms */}
          {embedSrc.includes('facebook.com') && (
            <div className="absolute bottom-2 right-2 text-xs text-white/60 bg-black/50 px-2 py-1 rounded">
              Powered by Facebook
            </div>
          )}
        </>
      )}

      {/* Lightweight badge overlay (non-interactive, doesn't block native controls) */}
      {!showIntro && (
        <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-ministry-gold/30">
          {getTypeIcon(currentVideo.type)}
          <span className="text-sm text-ministry-gold font-medium capitalize">{currentVideo.type}</span>
        </div>
      )}

      {/* Caption Overlay (only if present). Note: playback state isn't tracked for iframe; captions remain decorative. */}
      {currentVideo.captions && currentVideo.captions.length > 0 && !showIntro && (
        <CaptionOverlay captions={currentVideo.captions} currentLanguage={language} isPlaying />
      )}
    </div>
  );
}
