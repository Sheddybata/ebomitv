"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Play, Pause, PictureInPicture, Volume2, VolumeX } from "lucide-react";
import { PreRecordedContent } from "@/lib/types";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import KeyboardShortcutsHelp from "./KeyboardShortcutsHelp";

interface EnhancedVideoPlayerProps {
  content: PreRecordedContent | null;
  introVideoPath?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  onError?: () => void;
}

const INTRO_VIDEO = "/ebomitvintro.mp4";
const STORAGE_KEY = "ebomi_tv_playback_state";
const WATCH_PROGRESS_KEY = "ebomi_tv_watch_progress";

interface PlaybackState {
  contentId: string;
  position: number;
  timestamp: number;
}

export default function EnhancedVideoPlayer({
  content,
  introVideoPath = INTRO_VIDEO,
  autoPlay = true,
  onEnded,
  onError,
}: EnhancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [networkError, setNetworkError] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  // Load saved playback state
  useEffect(() => {
    if (!content) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state: PlaybackState = JSON.parse(saved);
        // Restore if same content and within 24 hours
        if (
          state.contentId === content.id &&
          Date.now() - state.timestamp < 24 * 60 * 60 * 1000
        ) {
          // Will restore position after intro
          setTimeout(() => {
            if (videoRef.current && state.position > 0) {
              videoRef.current.currentTime = state.position;
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error loading playback state:", error);
    }
  }, [content]);

  // Save playback state
  const savePlaybackState = useCallback(() => {
    if (!content || !videoRef.current) return;

    try {
      const state: PlaybackState = {
        contentId: content.id,
        position: videoRef.current.currentTime,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

      // Also save watch progress for video cards
      if (videoRef.current.duration > 0) {
        const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        localStorage.setItem(
          `${WATCH_PROGRESS_KEY}_${content.id}`,
          JSON.stringify({
            progress: Math.min(100, progress),
            lastWatched: Date.now(),
          })
        );
      }
    } catch (error) {
      console.error("Error saving playback state:", error);
    }
  }, [content]);

  // Save state periodically
  useEffect(() => {
    if (!isPlaying || !content) return;

    const interval = setInterval(() => {
      savePlaybackState();
    }, 5000); // Save every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, content, savePlaybackState]);

  // Load main content
  const loadMainContent = useCallback(() => {
    if (!content || !videoRef.current) return;

    const video = videoRef.current;

    if (content.url.includes('.mp4') || content.url.includes('.webm') || content.url.includes('.m3u8')) {
      video.src = content.url;
      video.load();
    } else {
      setNetworkError(true);
      setTimeout(() => {
        setNetworkError(false);
        if (videoRef.current) {
          video.src = introVideoPath;
          video.load();
        }
      }, 3000);
    }
  }, [content, introVideoPath]);

  // Handle intro video
  useEffect(() => {
    if (!showIntro || !videoRef.current) return;

    const video = videoRef.current;
    video.src = introVideoPath;
    video.load();

    const handleIntroEnd = () => {
      setIsIntroPlaying(false);
      setShowIntro(false);
      if (content) {
        loadMainContent();
      }
    };

    video.addEventListener("ended", handleIntroEnd);
    return () => video.removeEventListener("ended", handleIntroEnd);
  }, [showIntro, introVideoPath, content, loadMainContent]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      }
    },
    onSeekBackward: (seconds = 10) => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - seconds);
      }
    },
    onSeekForward: (seconds = 10) => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.min(
          videoRef.current.duration,
          videoRef.current.currentTime + seconds
        );
      }
    },
    onMute: () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    },
    onFullscreen: () => {
      if (videoRef.current) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          videoRef.current.requestFullscreen();
        }
      }
    },
    onPictureInPicture: () => {
      enterPictureInPicture();
    },
    onOpenSearch: () => {
      // Search is handled by navbar
    },
  }, true);

  // Keyboard shortcut for help (?)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          setShowShortcutsHelp(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Media Session API for background playback
  useEffect(() => {
    if (!content || !videoRef.current) return;

    if ("mediaSession" in navigator) {
      const video = videoRef.current;
      const ms = navigator.mediaSession;

      ms.metadata = new MediaMetadata({
        title: content.title,
        artist: "Ebomi TV",
        artwork: content.thumbnail
          ? [{ src: content.thumbnail, sizes: "512x512", type: "image/jpeg" }]
          : [],
      });

      ms.setActionHandler("play", () => {
        video.play();
        setIsPlaying(true);
      });

      ms.setActionHandler("pause", () => {
        video.pause();
        setIsPlaying(false);
      });

      ms.setActionHandler("seekbackward", () => {
        video.currentTime = Math.max(0, video.currentTime - 10);
      });

      ms.setActionHandler("seekforward", () => {
        video.currentTime = Math.min(
          video.duration,
          video.currentTime + 10
        );
      });
    }
  }, [content]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setHasError(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
      savePlaybackState();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      savePlaybackState();
      if (onEnded) onEnded();
      // Show intro before next video
      setShowIntro(true);
      setIsIntroPlaying(true);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
      // Show intro as fallback
      if (!showIntro) {
        setShowIntro(true);
        setIsIntroPlaying(true);
      }
      if (onError) onError();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setNetworkError(true);
    };

    const handlePlaying = () => {
      setNetworkError(false);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
    };
  }, [showIntro, onEnded, onError, savePlaybackState]);

  // Auto-play when ready
  useEffect(() => {
    if (autoPlay && videoRef.current && !isIntroPlaying && !showIntro) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [autoPlay, isIntroPlaying, showIntro]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const enterPictureInPicture = async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error("Picture-in-Picture error:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        webkit-playsinline="true"
        muted={isMuted}
        autoPlay={autoPlay}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-ministry-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Network Error / Intro Fallback */}
      {networkError && !showIntro && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <p className="text-white mb-4">Network issue. Playing intro...</p>
            <div className="w-12 h-12 border-4 border-ministry-gold border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {content && (
            <div className="px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
              <p className="text-white text-sm font-medium line-clamp-1">
                {content.title}
              </p>
            </div>
          )}
        </div>

        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-ministry-gold/90 hover:bg-ministry-gold flex items-center justify-center shadow-2xl transition-all hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <div 
              className="h-1 bg-white/20 rounded-full overflow-hidden relative cursor-pointer group"
              onMouseMove={(e) => {
                if (duration > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  setHoverTime(Math.max(0, Math.min(1, percent)));
                }
              }}
              onMouseLeave={() => setHoverTime(null)}
              onClick={(e) => {
                if (videoRef.current && duration > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  videoRef.current.currentTime = percent * duration;
                }
              }}
            >
              <div
                className="h-full bg-ministry-gold transition-all"
                style={{
                  width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
                }}
              />
              {/* Thumbnail Preview on Hover */}
              {hoverTime !== null && duration > 0 && (
                <div 
                  className="absolute bottom-4 transform -translate-x-1/2 pointer-events-none z-20"
                  style={{ left: `${hoverTime * 100}%` }}
                >
                  <div className="bg-black/90 rounded px-2 py-1 text-white text-xs whitespace-nowrap">
                    {formatTime(hoverTime * duration)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayPause}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {document.pictureInPictureEnabled && (
                <button
                  onClick={enterPictureInPicture}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Picture in Picture"
                >
                  <PictureInPicture className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
    </div>
  );
}










