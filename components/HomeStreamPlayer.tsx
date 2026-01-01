"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Loader2 } from "lucide-react";
import { PreRecordedContent } from "@/lib/types";
import { generateWeeklySchedule, getCurrentProgram, getNextProgram } from "@/lib/tv-schedule";
import { GALLERY_VIDEOS } from "@/lib/gallery-data";
import PreRecordedPlayer from "./PreRecordedPlayer";
import MuxLivePlayer from "./MuxLivePlayer";

const INTRO_VIDEO = "/ebomitvintro.mp4";

interface LiveStream {
  id: string;
  streamKey: string;
  status: string;
  playbackIds: Array<{ id: string; policy: string }>;
  activeAssetId?: string;
  createdAt: string;
}

interface HomeStreamPlayerProps {
  onStreamStatusChange?: (isLive: boolean) => void;
  skipIntro?: boolean;
}

export default function HomeStreamPlayer({ onStreamStatusChange, skipIntro = false }: HomeStreamPlayerProps) {
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuxLive, setIsMuxLive] = useState(false);
  const [showIntro, setShowIntro] = useState(!skipIntro);
  const [schedule, setSchedule] = useState(generateWeeklySchedule());
  const [currentProgram, setCurrentProgram] = useState<{ program: any; content: PreRecordedContent } | null>(null);
  const [hasPlayedInitialIntro, setHasPlayedInitialIntro] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);
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
        // If no next program, use the first program from schedule (loop back to start of day)
        if (currentSchedule.length > 0) {
          const firstProgram = currentSchedule[0];
          const content = findVideoContent(firstProgram);
          if (content) {
            setCurrentProgram({ program: firstProgram, content });
          }
        }
      }
    }
  };
  
  updateCurrentProgramRef.current = updateCurrentProgram;

  // Fetch active Mux live streams
  const fetchLiveStreams = async () => {
    try {
      const response = await fetch("/api/mux/live/list?limit=10");
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Find active stream (status === "active") or most recent
        const active = data.liveStreams.find(
          (stream: LiveStream) => stream.status === "active"
        ) || data.liveStreams[0];

        if (active) {
          setActiveStream(active);
          setIsMuxLive(active.status === "active");
        } else {
          setActiveStream(null);
          setIsMuxLive(false);
        }
        setIsLoading(false);
      } else {
        setActiveStream(null);
        setIsMuxLive(false);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.warn("Error fetching live streams:", err.message);
      setActiveStream(null);
      setIsMuxLive(false);
      setIsLoading(false);
    }
  };

  // Check for Mux live streams
  useEffect(() => {
    fetchLiveStreams();
    
    // Poll every 30 seconds to check for active streams
    const interval = setInterval(() => {
      fetchLiveStreams();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Monitor program schedule and update current program (only when not live and not loading)
  useEffect(() => {
    if (!isLoading && !isMuxLive) {
      // Check program schedule every minute
      programCheckIntervalRef.current = setInterval(() => {
        updateCurrentProgramRef.current();
      }, 60000);
      
      // Initial update - only if we haven't played intro yet or skipIntro is true
      if (skipIntro || hasPlayedInitialIntro) {
        updateCurrentProgram();
      }
    }
    
    return () => {
      if (programCheckIntervalRef.current) {
        clearInterval(programCheckIntervalRef.current);
      }
    };
  }, [isMuxLive, isLoading, skipIntro, hasPlayedInitialIntro]);

  // Handle intro video - only show if not skipping intro and not live and not loading
  useEffect(() => {
    if (!introVideoRef.current || skipIntro || isMuxLive || isLoading) return;

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
  }, [showIntro, skipIntro, isMuxLive, isLoading, hasPlayedInitialIntro]);

  // If skipIntro is true, ensure we never show intro once we have content
  useEffect(() => {
    if (skipIntro && !isMuxLive) {
      setShowIntro(false);
    }
  }, [skipIntro, isMuxLive]);

  // Fallback playback ID if API fails
  const FALLBACK_PLAYBACK_ID = "JAph4wH6lutzw7cJZbX3r2axeSIrx3OhPsF2RdbR8aI";
  const playbackId = activeStream?.playbackIds?.[0]?.id || FALLBACK_PLAYBACK_ID;

  // Notify parent component of live status
  useEffect(() => {
    if (onStreamStatusChange) {
      onStreamStatusChange(isMuxLive);
    }
  }, [isMuxLive, onStreamStatusChange]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-ministry-gold animate-spin" />
        </div>
      </div>
    );
  }

  // Show Mux live stream if active
  if (isMuxLive && activeStream) {
    return (
      <div className="relative w-full">
        <MuxLivePlayer
          playbackId={playbackId}
          streamKey={activeStream.streamKey}
          title="EBOMI TV Live"
          autoPlay={true}
          onStreamStatusChange={(isLive) => {
            setIsMuxLive(isLive);
            if (onStreamStatusChange) {
              onStreamStatusChange(isLive);
            }
          }}
        />
      </div>
    );
  }

  // Show pre-recorded content (program guide)
  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
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
          ) : (
            <div className="w-full aspect-video bg-foreground/5 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video className="w-12 h-12 text-ministry-gold/50 mx-auto mb-4" />
                <p className="text-foreground/60">No content available</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

