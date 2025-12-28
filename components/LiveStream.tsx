"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Loader2 } from "lucide-react";
import { StreamStatus, PreRecordedContent } from "@/lib/types";
import { getContentForCurrentTime } from "@/lib/stream-config";
import { generateWeeklySchedule, getCurrentProgram, getNextProgram } from "@/lib/tv-schedule";
import { GALLERY_VIDEOS } from "@/lib/gallery-data";
import PreRecordedPlayer from "./PreRecordedPlayer";
import StreamStatusIndicator from "./StreamStatusIndicator";

const INTRO_VIDEO = "/ebomitvintro.mp4";

interface LiveStreamProps {
  onStreamStatusChange?: (status: StreamStatus) => void;
  skipIntro?: boolean; // Option to skip intro video for direct content access
}

export default function LiveStream({ onStreamStatusChange, skipIntro = false }: LiveStreamProps) {
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(!skipIntro);
  const [networkError, setNetworkError] = useState(false);
  const [youtubeError, setYoutubeError] = useState(false);
  const [schedule, setSchedule] = useState(generateWeeklySchedule());
  const [currentProgram, setCurrentProgram] = useState<{ program: any; content: PreRecordedContent } | null>(null);
  const [hasPlayedInitialIntro, setHasPlayedInitialIntro] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const youtubeErrorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const programCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const programEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Find video content from program
  const findVideoContent = (program: any): PreRecordedContent | null => {
    // Extract video ID from program ID (format: videoId-day-index)
    const parts = program.id.split('-');
    if (parts.length >= 3) {
      const videoId = parts.slice(0, -2).join('-');
      const video = GALLERY_VIDEOS.find(v => v.id === videoId);
      if (video) {
        return {
          id: video.id,
          title: video.title,
          titleLocalized: video.titleLocalized,
          descriptionLocalized: video.descriptionLocalized,
          type: program.type === "worship" ? "worship" : program.type === "podcast" ? "podcast" : "sermon",
          url: video.videoUrl,
          thumbnail: video.thumbnail,
        };
      }
    }
    return null;
  };

  // Update current program based on schedule
  const updateCurrentProgramRef = useRef<() => void>(() => {});
  
  const updateCurrentProgram = () => {
    const now = new Date();
    const currentSchedule = generateWeeklySchedule();
    
    // Clear any existing program end timeout
    if (programEndTimeoutRef.current) {
      clearTimeout(programEndTimeoutRef.current);
      programEndTimeoutRef.current = null;
    }
    
    const program = getCurrentProgram(currentSchedule);
    
    if (program) {
      const content = findVideoContent(program);
      if (content) {
        setCurrentProgram({ program, content });
        setShowIntro(false); // Don't show intro while program is playing
        
        // Set up timeout to show intro when program ends
        const timeUntilEnd = program.endTime.getTime() - now.getTime();
        if (timeUntilEnd > 0) {
          programEndTimeoutRef.current = setTimeout(() => {
            setShowIntro(true);
          }, timeUntilEnd);
        } else {
          // Program has already ended, show intro immediately
          setShowIntro(true);
        }
      }
    } else {
      // No current program, check if we should show intro or get next program
      if (showIntro) {
        // Intro is playing, don't change program yet
        return;
      }
      
      // No current program and intro not playing, get next one
      const nextProgram = getNextProgram(currentSchedule);
      if (nextProgram) {
        const content = findVideoContent(nextProgram);
        if (content) {
          setCurrentProgram({ program: nextProgram, content });
        }
      } else {
        // Fallback to random content
        const fallbackContent = getContentForCurrentTime();
        setCurrentProgram({ 
          program: null, 
          content: fallbackContent 
        });
      }
    }
  };
  
  updateCurrentProgramRef.current = updateCurrentProgram;

  async function checkStreamStatus() {
    try {
      const response = await fetch("/api/stream-status");
      const status: StreamStatus = await response.json();
      setStreamStatus(status);
      if (onStreamStatusChange) {
        onStreamStatusChange(status);
      }
      setLoading(false);
      setNetworkError(false);
      
      // If not live, use schedule-based content
      if (!status.isLive) {
        // Set streamStatus to prerecorded so component can render
        if (!status.currentContent) {
          // Get current program for streamStatus
          const currentSchedule = generateWeeklySchedule();
          const currentProgramSchedule = getCurrentProgram(currentSchedule);
          if (currentProgramSchedule) {
            const content = findVideoContent(currentProgramSchedule);
            if (content) {
              setStreamStatus({
                ...status,
                currentContent: content,
              });
            }
          }
        }
        // Don't update program if intro is playing on initial load
        if (!showIntro || hasPlayedInitialIntro) {
          updateCurrentProgram();
        }
      } else if (skipIntro) {
        setShowIntro(false);
        setHasPlayedInitialIntro(true);
      }
    } catch (error) {
      console.error("Failed to fetch stream status:", error);
      setLoading(false);
      setNetworkError(true);
      // Fallback to pre-recorded on error
      updateCurrentProgram();
      setStreamStatus({
        isLive: false,
        source: "prerecorded",
        currentContent: currentProgram?.content || {
          id: "fallback",
          title: "Welcome to EBOMI TV",
          type: "sermon",
          url: "/ebomitvintro.mp4",
        },
      });
    }
  }

  // Handle intro video - only show if not skipping intro
  useEffect(() => {
    if (!introVideoRef.current || skipIntro) return;

    const video = introVideoRef.current;
    
    // Only set intro video source if showIntro is true and not skipping
    if (showIntro && !skipIntro) {
      video.src = INTRO_VIDEO;
      video.load();
    }

    const handleIntroEnd = () => {
      setShowIntro(false);
      
      // If this is the initial intro (first time loading), get the current program
      if (!hasPlayedInitialIntro) {
        setHasPlayedInitialIntro(true);
        const currentSchedule = generateWeeklySchedule();
        const currentProgramSchedule = getCurrentProgram(currentSchedule);
        
        if (currentProgramSchedule) {
          const content = findVideoContent(currentProgramSchedule);
          if (content) {
            setCurrentProgram({ program: currentProgramSchedule, content });
            // Set up timeout for when this program ends
            const now = new Date();
            const timeUntilEnd = currentProgramSchedule.endTime.getTime() - now.getTime();
            if (timeUntilEnd > 0) {
              if (programEndTimeoutRef.current) {
                clearTimeout(programEndTimeoutRef.current);
              }
              programEndTimeoutRef.current = setTimeout(() => {
                setShowIntro(true);
              }, timeUntilEnd);
            }
            return;
          }
        }
      }
      
      // After intro ends between programs, get the next program
      const currentSchedule = generateWeeklySchedule();
      const nextProgram = getNextProgram(currentSchedule);
      
      if (nextProgram) {
        const content = findVideoContent(nextProgram);
        if (content) {
          setCurrentProgram({ program: nextProgram, content });
          // Set up timeout for when this program ends
          const now = new Date();
          const timeUntilEnd = nextProgram.endTime.getTime() - now.getTime();
          if (timeUntilEnd > 0) {
            if (programEndTimeoutRef.current) {
              clearTimeout(programEndTimeoutRef.current);
            }
            programEndTimeoutRef.current = setTimeout(() => {
              setShowIntro(true);
            }, timeUntilEnd);
          }
        }
      } else {
        // No next program, use fallback
        const fallbackContent = getContentForCurrentTime();
        setCurrentProgram({ 
          program: null, 
          content: fallbackContent 
        });
      }
    };

    const handleIntroError = (e: Event) => {
      console.error("Intro video error:", e);
      // If intro fails, just hide it and show content
      setShowIntro(false);
      updateCurrentProgramRef.current();
    };

    const handleCanPlay = () => {
      // Auto-play when ready (only if showIntro is true and not skipIntro)
      if (showIntro && !skipIntro) {
        video.play().catch((err) => {
          console.error("Intro play error:", err);
          setShowIntro(false);
          updateCurrentProgram();
        });
      }
    };

    if (showIntro && !skipIntro) {
      video.addEventListener("ended", handleIntroEnd);
      video.addEventListener("error", handleIntroError);
      video.addEventListener("canplay", handleCanPlay);
    }

    return () => {
      video.removeEventListener("ended", handleIntroEnd);
      video.removeEventListener("error", handleIntroError);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [showIntro, skipIntro]);
  
  // Monitor program schedule and update current program
  useEffect(() => {
    // Check program schedule every minute
    programCheckIntervalRef.current = setInterval(() => {
      if (!streamStatus?.isLive && hasPlayedInitialIntro) {
        updateCurrentProgramRef.current();
      }
    }, 60000); // Check every minute
    
    // Initial update only if intro has already played
    if (!streamStatus?.isLive && hasPlayedInitialIntro) {
      updateCurrentProgram();
    }
    
    return () => {
      if (programCheckIntervalRef.current) {
        clearInterval(programCheckIntervalRef.current);
      }
    };
  }, [streamStatus, hasPlayedInitialIntro]);

  useEffect(() => {
    // Check stream status immediately
    checkStreamStatus();

    // Poll every 30 seconds to check if stream goes live
    const interval = setInterval(checkStreamStatus, 30000);

    // Monitor network
    const handleOnline = () => {
      setNetworkError(false);
      checkStreamStatus();
    };

    const handleOffline = () => {
      setNetworkError(true);
      setShowIntro(true);
      if (introVideoRef.current) {
        introVideoRef.current.src = INTRO_VIDEO;
        introVideoRef.current.load();
        introVideoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (youtubeErrorTimeoutRef.current) {
        clearTimeout(youtubeErrorTimeoutRef.current);
      }
      if (programEndTimeoutRef.current) {
        clearTimeout(programEndTimeoutRef.current);
      }
    };
  }, []);

  // If skipIntro is true, ensure we never show intro once we have content
  useEffect(() => {
    if (skipIntro && streamStatus && !loading) {
      setShowIntro(false);
    }
  }, [skipIntro, streamStatus, loading]);

  // Show intro while loading, on initial load, or on network error (unless skipIntro is true)
  if ((loading || showIntro || networkError) && !skipIntro) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={introVideoRef}
          className="w-full h-full object-contain"
          playsInline
          webkit-playsinline="true"
          // Keep playback inline + reduce accidental fullscreen routes on mobile browsers
          controlsList="nofullscreen noremoteplayback nodownload"
          disablePictureInPicture
          autoPlay={showIntro && !skipIntro}
          muted
          controls
          loop={false}
          preload="auto"
          onError={(e) => {
            console.error("Intro video load error:", e);
            console.error("Video src:", INTRO_VIDEO);
          }}
          onLoadStart={() => {
            console.log("Intro video loading...");
          }}
          onCanPlay={() => {
            console.log("Intro video can play");
          }}
        />
        {loading && !networkError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-ministry-gold animate-spin" />
          </div>
        )}
        {networkError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <p className="text-white mb-4">Network issue. Playing intro...</p>
              <div className="w-12 h-12 border-4 border-ministry-gold border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!streamStatus) return null;

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {streamStatus.isLive && streamStatus.source === "facebook" && streamStatus.facebookUrl ? (
          <motion.div
            key="facebook-live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
          >
            {/* Facebook Live Embed */}
            <iframe
              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
                streamStatus.facebookUrl
              )}&show_text=false&width=100%&height=100%&autoplay=false&allowfullscreen=false`}
              className="w-full h-full"
              loading="lazy"
              title="Facebook Live"
              allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
            />

            {/* LIVE Badge Overlay */}
            <StreamStatusIndicator status={streamStatus} />
          </motion.div>
        ) : streamStatus.isLive && streamStatus.source === "youtube" && streamStatus.youtubeVideoId ? (
          <motion.div
            key="youtube-live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
          >
            {/* YouTube Live Embed */}
            <iframe
              src={`https://www.youtube.com/embed/${streamStatus.youtubeVideoId}?autoplay=0&controls=1&rel=0&modestbranding=1&playsinline=1&fs=0&enablejsapi=1`}
              className="w-full h-full"
              loading="lazy"
              title="YouTube Live"
              allow="encrypted-media; picture-in-picture; web-share"
              style={{ border: "none" }}
              onLoad={() => {
                // Set a timeout to check if YouTube video is unavailable
                // YouTube shows "Video unavailable" error inside iframe, which we can't detect directly
                // So we'll check after a delay and fallback if needed
                if (youtubeErrorTimeoutRef.current) {
                  clearTimeout(youtubeErrorTimeoutRef.current);
                }
                youtubeErrorTimeoutRef.current = setTimeout(() => {
                  // If we can't confirm the video is playing, assume it might be unavailable
                  // This is a heuristic - in practice, YouTube embeds load quickly if valid
                  console.log("Checking YouTube video availability...");
                  // We'll let the user see the error message and provide a fallback button
                  setYoutubeError(true);
                }, 10000); // 10 second delay to allow video to load
              }}
            />

            {/* Error Overlay - Show if YouTube video is unavailable */}
            {youtubeError && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                <div className="text-center px-6">
                  <p className="text-white text-lg font-bold mb-2">YouTube Video Unavailable</p>
                  <p className="text-white/70 text-sm mb-4">
                    The live stream video may no longer be available or you don&apos;t have permission to view it.
                  </p>
                  <button
                    onClick={() => {
                      // Fallback to pre-recorded content
                      const fallbackStatus: StreamStatus = {
                        isLive: false,
                        source: "prerecorded",
                        currentContent: getContentForCurrentTime(),
                      };
                      setStreamStatus(fallbackStatus);
                      if (onStreamStatusChange) {
                        onStreamStatusChange(fallbackStatus);
                      }
                      setYoutubeError(false);
                    }}
                    className="bg-ministry-gold hover:bg-ministry-gold/80 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                  >
                    Watch Pre-recorded Content
                  </button>
                </div>
              </div>
            )}

            {/* LIVE Badge Overlay */}
            {!youtubeError && <StreamStatusIndicator status={streamStatus} />}
          </motion.div>
        ) : (
          <motion.div
            key="prerecorded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {showIntro && !skipIntro ? (
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={introVideoRef}
                  className="w-full h-full object-contain"
                  playsInline
                  webkit-playsinline="true"
                  controlsList="nofullscreen noremoteplayback nodownload"
                  disablePictureInPicture
                  autoPlay
                  muted
                  controls
                  loop={false}
                  preload="auto"
                />
              </div>
            ) : currentProgram?.content ? (
              <PreRecordedPlayer 
                content={currentProgram.content} 
                withIntro={false}
                onEnded={() => {
                  // When program ends, show intro before next program
                  setShowIntro(true);
                }}
              />
            ) : streamStatus.currentContent ? (
              <PreRecordedPlayer content={streamStatus.currentContent} withIntro={false} />
            ) : (
              <div className="w-full aspect-video bg-foreground/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-12 h-12 text-ministry-gold/50 mx-auto mb-4" />
                  <p className="text-foreground/60">No content available</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

