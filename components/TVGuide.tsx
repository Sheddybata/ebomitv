"use client";

import { useEffect, useState, useRef } from "react";
import { Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { TVProgram } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import {
  generateWeeklySchedule,
  getNextProgram,
  getProgramsForDay,
  formatProgramTime,
  getTimeUntil,
} from "@/lib/tv-schedule";
import { format, isToday, addDays, subDays, startOfDay } from "date-fns";
import VideoPlayerModal from "./VideoPlayerModal";
import { GALLERY_VIDEOS, GalleryVideo } from "@/lib/gallery-data";

export default function TVGuide() {
  const [schedule, setSchedule] = useState<TVProgram[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode] = useState<"timeline">("timeline");
  const [selectedVideo, setSelectedVideo] = useState<GalleryVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useI18n();

  const pick = (base?: string, localized?: Record<string, string>) =>
    (localized && localized[language]) || base || "";

  useEffect(() => {
    // Generate schedule on mount - only once
    const weeklySchedule = generateWeeklySchedule();
    setSchedule(weeklySchedule);
    setCurrentTime(new Date());

    // Update current time every 10 seconds for more accurate current program detection
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to current time on mount
  useEffect(() => {
    if (viewMode === "timeline" && scrollContainerRef.current && isToday(selectedDate)) {
      const currentHour = currentTime.getHours();
      const scrollPosition = (currentHour / 24) * scrollContainerRef.current.scrollWidth;
      scrollContainerRef.current.scrollLeft = scrollPosition - 200;
    }
  }, [viewMode, currentTime, selectedDate]);

  // Calculate row assignment with balanced distribution
  const calculateRows = (programs: TVProgram[]): Map<string, number> => {
    const rowMap = new Map<string, number>();
    
    // Sort programs by start time
    const sorted = [...programs].sort((a, b) => 
      a.startTime.getTime() - b.startTime.getTime()
    );

    // Track programs in each row with their time ranges
    const rowPrograms: Array<Array<{ start: number; end: number }>> = [];

    sorted.forEach((program) => {
      const programStart = program.startTime.getTime();
      const programEnd = program.endTime.getTime();
      const availableRows: number[] = [];

      // Find all rows where this program can fit (no overlap)
      for (let rowIndex = 0; rowIndex < rowPrograms.length; rowIndex++) {
        const row = rowPrograms[rowIndex];
        let canFit = true;

        // Check if this program overlaps with any program in this row
        for (const existing of row) {
          // Overlap occurs if: programStart < existing.end AND programEnd > existing.start
          if (programStart < existing.end && programEnd > existing.start) {
            canFit = false;
            break;
          }
        }

        if (canFit) {
          availableRows.push(rowIndex);
        }
      }

      // Choose row: prefer rows with fewer programs to balance distribution
      let assignedRow = -1;
      if (availableRows.length > 0) {
        // Sort available rows by number of programs (fewer = better)
        availableRows.sort((a, b) => rowPrograms[a].length - rowPrograms[b].length);
        assignedRow = availableRows[0];
        rowPrograms[assignedRow].push({ start: programStart, end: programEnd });
      } else {
        // No available row, create new one
        assignedRow = rowPrograms.length;
        rowPrograms.push([{ start: programStart, end: programEnd }]);
      }

      rowMap.set(program.id, assignedRow);
    });

    return rowMap;
  };

  const dayPrograms = getProgramsForDay(schedule, selectedDate);
  
  // Remove duplicates by video ID and keep only the first occurrence of each
  const uniqueVideoIds = new Set<string>();
  const limitedPrograms = dayPrograms.filter((program) => {
    // Extract video ID from program ID (format: videoId-day-index)
    const parts = program.id.split('-');
    if (parts.length >= 3) {
      const videoId = parts.slice(0, -2).join('-');
      if (!uniqueVideoIds.has(videoId)) {
        uniqueVideoIds.add(videoId);
        return true;
      }
      return false;
    }
    return true; // Keep if ID format is unexpected
  }); // Show all unique videos (no limit)
  
  const nextProgram = getNextProgram(limitedPrograms);
  const programRowMap = calculateRows(limitedPrograms);
  
  // Calculate max row number for height
  const maxRow = limitedPrograms.length > 0 
    ? Math.max(...Array.from(programRowMap.values()))
    : 0;
  
  // Calculate card dimensions for consistent use
  const cardHeight = isMobile ? 120 : 130; // Increased from 90 to 120 for better mobile visibility
  const cardSpacing = isMobile ? 80 : 150;
  const topOffset = isMobile ? 10 : 40; // Reduced from 20 to 10 to reduce white space
  
  // Calculate hour marker height based on program rows
  const hourMarkerHeight = topOffset + (maxRow + 1) * (cardHeight + cardSpacing) - cardSpacing;

  const scrollToNow = () => {
    if (scrollContainerRef.current) {
      const currentHour = currentTime.getHours();
      const scrollPosition = (currentHour / 24) * scrollContainerRef.current.scrollWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition - 200,
        behavior: "smooth",
      });
    }
    setSelectedDate(new Date());
  };

  const getProgramTypeColor = (type: TVProgram["type"]) => {
    switch (type) {
      case "live":
        return "bg-ministry-red";
      case "worship":
        return "bg-ministry-gold";
      case "teaching":
        return "bg-blue-600";
      case "prayer":
        return "bg-purple-600";
      default:
        return "bg-neutral-700";
    }
  };

  // Generate 24-hour timeline
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Calculate program width and position based on actual scheduled time
  const getProgramPosition = (program: TVProgram) => {
    const dayStart = startOfDay(selectedDate);
    const timelineWidth = 2400; // Fixed width: 100px per hour (24 hours = 2400px)
    const dayDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    const programStart = new Date(program.startTime);
    const programEnd = new Date(program.endTime);
    
    // Normalize program times to the selected day
    const programStartOfDay = new Date(dayStart);
    programStartOfDay.setHours(programStart.getHours(), programStart.getMinutes(), programStart.getSeconds());
    
    const programEndOfDay = new Date(dayStart);
    programEndOfDay.setHours(programEnd.getHours(), programEnd.getMinutes(), programEnd.getSeconds());
    
    // Calculate position in milliseconds from start of day
    const startOffset = Math.max(0, programStartOfDay.getTime() - dayStart.getTime());
    const endOffset = Math.max(0, programEndOfDay.getTime() - dayStart.getTime());
    const duration = endOffset - startOffset;
    
    // Convert to pixels based on timeline width
    const leftPx = (startOffset / dayDuration) * timelineWidth;
    const widthPx = (duration / dayDuration) * timelineWidth;
    
    // Minimum card width for visibility
    const minCardWidth = isMobile ? 160 : 180; // Increased from 140 to 160 for better mobile visibility
    const finalWidth = Math.max(widthPx, minCardWidth);
    
    // Gap between cards: 10% of minimum card width
    const gapPx = Math.round(minCardWidth * 0.10);
    
    // Adjust width to account for gap (reduce width slightly to create visible gap)
    const adjustedWidth = Math.max(finalWidth - gapPx, minCardWidth * 0.8);

    return { 
      left: `${leftPx}px`, 
      width: `${adjustedWidth}px`
    };
  };

  const isProgramCurrent = (program: TVProgram) => {
    const now = new Date();
    const programStart = new Date(program.startTime);
    const programEnd = new Date(program.endTime);
    
    // Check if current time falls within program time range
    // Use getTime() for accurate comparison
    // Allow a small tolerance (1 second) for timing precision
    const tolerance = 1000; // 1 second
    return (now.getTime() + tolerance) >= programStart.getTime() && (now.getTime() - tolerance) < programEnd.getTime();
  };

  const currentTimePercent = () => {
    const dayStart = startOfDay(currentTime).getTime();
    const now = currentTime.getTime();
    const dayDuration = 24 * 60 * 60 * 1000;
    return ((now - dayStart) / dayDuration) * 100;
  };

  // Find video from program ID
  const findVideoByProgramId = (programId: string): GalleryVideo | null => {
    // Program ID format: `${video.id}-${day}-${videoIndex}`
    // Try to match by removing the last two segments (day and videoIndex)
    // Handle cases where video IDs might have dashes
    for (const video of GALLERY_VIDEOS) {
      // Check if program ID starts with video ID followed by dash and numbers
      const pattern = new RegExp(`^${video.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d+-\\d+$`);
      if (pattern.test(programId)) {
        return video;
      }
      // Also try exact match in case the ID format is different
      if (programId.startsWith(video.id)) {
        return video;
      }
    }
    return null;
  };

  // Handle card click
  const handleCardClick = (program: TVProgram) => {
    const video = findVideoByProgramId(program.id);
    if (video) {
      setSelectedVideo(video);
      setIsModalOpen(true);
    }
  };

  return (
    <div className={`glass rounded-lg ${isMobile ? 'p-3' : 'p-4 md:p-6'} shadow-lg`} data-schedule>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-foreground flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-ministry-gold" />
            {t("tv.programGuide")}
          </h3>
          <p className="text-foreground/70 text-sm">
            {isToday(selectedDate) ? t("schedule.today") : format(selectedDate, "EEEE, MMM d")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Navigation */}
          <button
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            className="p-1.5 md:p-2 glass rounded-lg hover:bg-[rgba(var(--foreground),0.12)] transition-colors text-foreground"
            aria-label="Previous day"
          >
            <span className="text-foreground text-sm md:text-base">‹</span>
          </button>
          <button
            onClick={scrollToNow}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-ministry-gold hover:bg-ministry-gold/90 text-white font-semibold rounded-lg transition-colors text-xs md:text-sm shadow-md hover:shadow-lg"
          >
            {t("tv.now")}
          </button>
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="p-1.5 md:p-2 glass rounded-lg hover:bg-[rgba(var(--foreground),0.12)] transition-colors text-foreground"
            aria-label="Next day"
          >
            <span className="text-foreground text-sm md:text-base">›</span>
          </button>
        </div>
      </div>

      {/* Timeline View */}
      <div className="relative">
        {/* Timeline Container with synchronized scrolling */}
        <div
          ref={scrollContainerRef}
          className="relative overflow-x-auto pb-4"
          style={{ 
            scrollbarWidth: "thin",
            scrollBehavior: "smooth",
            width: "100%"
          }}
        >
          {/* Time Labels - Positioned to match hour markers, scrolls with timeline */}
          <div className={`relative ${isMobile ? 'mb-2' : 'mb-3'} ${isMobile ? 'px-1' : 'px-2'}`} style={{ width: '2400px', minHeight: '20px' }}>
            {hours.filter((h) => h % 3 === 0).map((hour) => {
              const date = new Date();
              date.setHours(hour, 0, 0, 0);
              const time12h = date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });
              // Position labels to match hour markers: hour 0 = 0px, hour 3 = 300px, etc. (100px per hour)
              const labelPosition = (hour / 24) * 2400;
              return (
                <span 
                  key={hour} 
                  className={`absolute text-foreground/70 ${isMobile ? 'text-[10px]' : 'text-xs'} font-medium`}
                  style={{ left: `${labelPosition}px`, transform: 'translateX(-50%)' }}
                >
                  {time12h}
                </span>
              );
            })}
          </div>
          <div 
            ref={timelineRef} 
            className="relative"
              style={{ 
              width: '2400px', // Wide enough for 24-hour timeline (100px per hour)
              minHeight: isMobile ? '140px' : '200px', // Reduced min height on mobile
              paddingRight: isMobile ? '8px' : '32px', // Reduced padding on mobile
              paddingLeft: isMobile ? '4px' : '16px', // Reduced padding on mobile
              height: `${Math.max(isMobile ? 140 : 200, topOffset + cardHeight + (isMobile ? 10 : 20))}px` // Reduced bottom spacing on mobile
            }}
          >
            {/* Hour Markers - Positioned to match timeline width (2400px = 100px per hour) */}
            {hours.filter((h) => h % 3 === 0).map((hour) => {
              // Position markers at exact pixel positions: hour 0 = 0px, hour 3 = 300px, etc.
              const markerPosition = (hour / 24) * 2400;
              return (
                <div
                  key={hour}
                  className="absolute border-l border-[rgba(var(--foreground),0.15)]"
                  style={{ 
                    left: `${markerPosition}px`,
                    top: `${topOffset}px`,
                    height: `${cardHeight + 10}px`
                  }}
                />
              );
            })}

            {/* Program Blocks - Positioned based on scheduled time with gaps between them */}
            {limitedPrograms.map((program, index) => {
              const position = getProgramPosition(program);
              const isCurrent = isProgramCurrent(program);
              const row = 0; // All cards in one row for simplicity
              const topPx = topOffset;

              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => handleCardClick(program)}
                  className={`absolute rounded-lg ${isMobile ? 'p-1.5' : 'p-2 sm:p-3 md:p-4'} cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-all border-2 shadow-lg touch-manipulation ${
                    isCurrent
                      ? "bg-white dark:bg-neutral-800 border-blue-400/60 z-10"
                      : "bg-white/95 dark:bg-neutral-800/95 border-gray-200 dark:border-neutral-600 hover:border-ministry-gold hover:shadow-xl z-0"
                  }`}
                  style={{
                    left: position.left,
                    width: position.width,
                    top: `${topPx}px`,
                    height: `${cardHeight}px`,
                    opacity: isCurrent ? 1 : 1, // Current program: 0% transparency (fully opaque)
                    ...(isCurrent ? {
                      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3), 0 8px 30px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(59, 130, 246, 0.15)', // Soft blue shadow
                      borderColor: 'rgba(59, 130, 246, 0.4)',
                    } : {}),
                  }}
                >
                  {program.thumbnail && (
                    <div className={`absolute inset-0 rounded-md overflow-hidden ${isCurrent ? 'opacity-100' : 'opacity-40'}`}>
                      <img
                        src={program.thumbnail}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`relative z-10 h-full flex flex-col justify-between rounded-md ${isMobile ? 'p-1.5' : 'p-1 sm:p-1.5 md:p-2'}`}>
                    {/* Category badge at top left */}
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-block ${isMobile ? 'px-1.5 py-0.5 text-[9px]' : 'px-1 sm:px-1.5 py-0.5 text-[7px] sm:text-[8px] md:text-[9px]'} ${getProgramTypeColor(program.type)} text-white font-bold rounded shadow-sm`}
                      >
                        {program.type}
                      </span>
                    </div>
                    {/* Title at bottom left */}
                    <div className="flex-shrink-0 mt-auto">
                      <h4 className={`font-semibold text-gray-900 dark:text-white ${isMobile ? 'text-xs' : 'text-[10px] sm:text-xs md:text-sm'} line-clamp-2 ${isMobile ? 'leading-snug' : 'leading-tight sm:leading-snug'} drop-shadow-sm text-left`}>
                        {pick(program.title, program.titleLocalized)}
                      </h4>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Next Program Info */}
      <div className={isMobile ? "mt-4" : "mt-6"}>
        {nextProgram && (
          <div className={`${isMobile ? 'p-3' : 'p-4'} bg-[rgba(var(--foreground),0.08)] border border-[rgba(var(--foreground),0.15)] rounded-lg`}>
            <div className={`flex items-center gap-2 ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
              <Clock className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-ministry-gold`} />
              <span className={`text-ministry-gold font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {t("tv.upNext")}: {getTimeUntil(nextProgram)}
              </span>
            </div>
            <h5 className={`font-serif font-bold text-foreground ${isMobile ? 'text-sm mb-0.5' : 'mb-1'}`}>
              {pick(nextProgram.title, nextProgram.titleLocalized)}
            </h5>
            <p className={`text-foreground/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {formatProgramTime(nextProgram.startTime)} -{" "}
              {formatProgramTime(nextProgram.endTime)}
            </p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVideo(null);
        }}
      />
    </div>
  );
}

