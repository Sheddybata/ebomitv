"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { Calendar, Clock, Play, Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TVProgram } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import {
  generateWeeklySchedule,
  getCurrentProgram,
  getNextProgram,
  getProgramsForDay,
  formatProgramTime,
  getTimeUntil,
} from "@/lib/tv-schedule";
import { format, isToday, addDays, subDays, startOfDay } from "date-fns";
import { useProgram } from "@/contexts/ProgramContext";
import { GALLERY_VIDEOS, GalleryVideo } from "@/lib/gallery-data";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

export default function TVGuide() {
  const [schedule, setSchedule] = useState<TVProgram[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode] = useState<"timeline">("timeline");
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [navigationIndex, setNavigationIndex] = useState<number>(-1); // Track current position in program list
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const programRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const { t, language } = useI18n();
  const { playProgram } = useProgram();
  const { lightTap, mediumTap } = useHapticFeedback();

  const pick = useCallback(
    (base?: string, localized?: Record<string, string>) =>
      (localized && localized[language]) || base || "",
    [language]
  );

  // Memoize schedule generation
  const weeklySchedule = useMemo(() => generateWeeklySchedule(), []);

  useEffect(() => {
    setSchedule(weeklySchedule);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    return () => clearInterval(timer);
  }, [weeklySchedule]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (viewMode === "timeline" && scrollContainerRef.current && isToday(selectedDate)) {
      const currentHour = currentTime.getHours();
      const scrollPosition = (currentHour / 24) * scrollContainerRef.current.scrollWidth;
      scrollContainerRef.current.scrollLeft = scrollPosition - 200;
    }
  }, [viewMode, currentTime, selectedDate]);

  // Memoize day programs
  const dayPrograms = useMemo(() => getProgramsForDay(schedule, selectedDate), [schedule, selectedDate]);

  // Memoize filtered programs
  const filteredPrograms = useMemo(() => {
    let programs = dayPrograms;
    
    if (searchQuery) {
      programs = programs.filter((program) => {
        const title = pick(program.title, program.titleLocalized) || "";
        const description = pick(program.description, program.descriptionLocalized) || "";
        const searchLower = searchQuery.toLowerCase();
        return (
          title.toLowerCase().includes(searchLower) ||
          description.toLowerCase().includes(searchLower) ||
          program.type.toLowerCase().includes(searchLower)
        );
      });
    }

    if (filterType) {
      programs = programs.filter((program) => program.type === filterType);
    }

    return programs;
  }, [dayPrograms, searchQuery, filterType, pick]);

  // Memoize deduplication
  const limitedPrograms = useMemo(() => {
    const uniqueVideoIds = new Set<string>();
    return filteredPrograms.filter((program) => {
      const parts = program.id.split("-");
      if (parts.length >= 3) {
        const videoId = parts.slice(0, -2).join("-");
        if (!uniqueVideoIds.has(videoId)) {
          uniqueVideoIds.add(videoId);
          return true;
        }
        return false;
      }
      return true;
    });
  }, [filteredPrograms]);

  const currentProgram = getCurrentProgram(limitedPrograms);
  
  // Sort all programs by start time for sequential navigation
  const sortedPrograms = [...limitedPrograms].sort((a, b) => 
    a.startTime.getTime() - b.startTime.getTime()
  );

  // Find current program index in sorted list
  const getCurrentProgramIndex = useCallback((): number => {
    if (currentProgram) {
      return sortedPrograms.findIndex(p => p.id === currentProgram.id);
    }
    const now = new Date();
    const index = sortedPrograms.findIndex(p =>
      now >= p.startTime && now < p.endTime
    );
    if (index >= 0) return index;
    const nextIndex = sortedPrograms.findIndex(p => p.startTime > now);
    return nextIndex >= 0 ? nextIndex : 0;
  }, [currentProgram, sortedPrograms]);

  // Get programs for navigation (sequential through all programs)
  const getPreviousProgram = (): TVProgram | null => {
    const currentIndex = navigationIndex >= 0 ? navigationIndex : getCurrentProgramIndex();
    if (currentIndex > 0) {
      return sortedPrograms[currentIndex - 1];
    }
    // If at the beginning, wrap to the last program
    return sortedPrograms.length > 0 ? sortedPrograms[sortedPrograms.length - 1] : null;
  };

  const getNextProgramForNav = (): TVProgram | null => {
    const currentIndex = navigationIndex >= 0 ? navigationIndex : getCurrentProgramIndex();
    if (currentIndex < sortedPrograms.length - 1) {
      return sortedPrograms[currentIndex + 1];
    }
    // If at the end, wrap to the first program
    return sortedPrograms.length > 0 ? sortedPrograms[0] : null;
  };

  const getCurrentProgramForNav = (): TVProgram | null => {
    const currentIndex = navigationIndex >= 0 ? navigationIndex : getCurrentProgramIndex();
    return sortedPrograms[currentIndex] || currentProgram || null;
  };

  const previousProgram = getPreviousProgram();
  const nextProgram = getNextProgramForNav();
  const currentProgramForNav = getCurrentProgramForNav();

  const scrollToNow = useCallback(() => {
    if (scrollContainerRef.current) {
      const currentHour = currentTime.getHours();
      const scrollPosition = (currentHour / 24) * scrollContainerRef.current.scrollWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition - 200,
        behavior: "smooth",
      });
    }
    setSelectedDate(new Date());
  }, [currentTime]);

  // Scroll to and highlight a program in the timeline
  const scrollToProgram = useCallback((program: TVProgram | null) => {
    if (!program || !scrollContainerRef.current) return;

    const programDate = new Date(program.startTime);
    const programDay = new Date(programDate.getFullYear(), programDate.getMonth(), programDate.getDate());
    const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

    if (programDay.getTime() !== selectedDay.getTime()) {
      setSelectedDate(programDate);
      setTimeout(() => scrollToProgram(program), 100);
      return;
    }

    const programElement = programRefs.current.get(program.id);
    if (programElement && scrollContainerRef.current) {
      const programLeft = programElement.offsetLeft;
      const programWidth = programElement.offsetWidth;
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const targetScroll = programLeft - (containerWidth / 2) + (programWidth / 2);

      scrollContainerRef.current.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth",
      });

      setSelectedProgramId(program.id);
      
      // Keep highlight longer for better visibility (5 seconds)
      setTimeout(() => {
        setSelectedProgramId(null);
      }, 5000);
    }
  }, [selectedDate]);

  const handlePlayPrevious = useCallback(() => {
    if (previousProgram) {
      const currentIndex = navigationIndex >= 0 ? navigationIndex : getCurrentProgramIndex();
      const newIndex = currentIndex > 0 ? currentIndex - 1 : sortedPrograms.length - 1;
      setNavigationIndex(newIndex);
      mediumTap(); // Haptic feedback
      playProgram(previousProgram);
      scrollToProgram(previousProgram);
    }
  }, [previousProgram, navigationIndex, sortedPrograms.length, getCurrentProgramIndex, playProgram, mediumTap, scrollToProgram]);

  const handlePlayCurrent = useCallback(() => {
    const programToPlay = currentProgramForNav || currentProgram;
    if (programToPlay) {
      const currentIndex = getCurrentProgramIndex();
      setNavigationIndex(currentIndex);
      mediumTap(); // Haptic feedback
      playProgram(programToPlay);
      scrollToProgram(programToPlay);
    } else {
      // If no current program, scroll to now
      scrollToNow();
    }
  }, [currentProgramForNav, currentProgram, getCurrentProgramIndex, playProgram, mediumTap, scrollToProgram, scrollToNow]);

  const handlePlayNext = useCallback(() => {
    if (nextProgram) {
      const currentIndex = navigationIndex >= 0 ? navigationIndex : getCurrentProgramIndex();
      const newIndex = currentIndex < sortedPrograms.length - 1 ? currentIndex + 1 : 0;
      setNavigationIndex(newIndex);
      mediumTap(); // Haptic feedback
      playProgram(nextProgram);
      scrollToProgram(nextProgram);
    }
  }, [nextProgram, navigationIndex, sortedPrograms.length, getCurrentProgramIndex, playProgram, mediumTap, scrollToProgram]);

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

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getProgramPosition = (program: TVProgram) => {
    const dayStart = startOfDay(selectedDate);
    const timelineWidth = 2400;
    const dayDuration = 24 * 60 * 60 * 1000;

    const programStart = new Date(program.startTime);
    const programEnd = new Date(program.endTime);

    const programStartOfDay = new Date(dayStart);
    programStartOfDay.setHours(
      programStart.getHours(),
      programStart.getMinutes(),
      programStart.getSeconds()
    );

    const programEndOfDay = new Date(dayStart);
    programEndOfDay.setHours(
      programEnd.getHours(),
      programEnd.getMinutes(),
      programEnd.getSeconds()
    );

    const startOffset = Math.max(0, programStartOfDay.getTime() - dayStart.getTime());
    const endOffset = Math.max(0, programEndOfDay.getTime() - dayStart.getTime());
    const duration = endOffset - startOffset;

    const leftPx = (startOffset / dayDuration) * timelineWidth;
    const widthPx = (duration / dayDuration) * timelineWidth;

    const minCardWidth = isMobile ? 160 : 180;
    const finalWidth = Math.max(widthPx, minCardWidth);
    const gapPx = Math.round(minCardWidth * 0.1);
    const adjustedWidth = Math.max(finalWidth - gapPx, minCardWidth * 0.8);

    return {
      left: `${leftPx}px`,
      width: `${adjustedWidth}px`,
    };
  };

  const isProgramCurrent = (program: TVProgram) => {
    const now = new Date();
    const programStart = new Date(program.startTime);
    const programEnd = new Date(program.endTime);
    const tolerance = 1000;
    return (
      now.getTime() + tolerance >= programStart.getTime() &&
      now.getTime() - tolerance < programEnd.getTime()
    );
  };

  const handleCardClick = useCallback((program: TVProgram) => {
    lightTap(); // Haptic feedback
    playProgram(program);
  }, [playProgram, lightTap]);

  const programTypes = Array.from(new Set(limitedPrograms.map((p) => p.type)));

  const cardHeight = isMobile ? 120 : 130;
  const cardSpacing = isMobile ? 80 : 150;
  const topOffset = isMobile ? 10 : 40;

  return (
    <div
      className={`glass rounded-lg ${isMobile ? "p-3" : "p-4 md:p-6"} shadow-lg`}
      data-schedule
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-foreground flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-ministry-gold" />
            {t("tv.programGuide")}
          </h3>
          <p className="text-foreground/70 text-sm">
            {isToday(selectedDate)
              ? t("schedule.today")
              : format(selectedDate, "EEEE, MMM d")}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground placeholder-foreground/30 focus:outline-none focus:border-ministry-gold text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter */}
          <div className="relative">
            <select
              value={filterType || ""}
              onChange={(e) => setFilterType(e.target.value || null)}
              className="pl-10 pr-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground focus:outline-none focus:border-ministry-gold text-sm appearance-none cursor-pointer"
            >
              <option value="">All Types</option>
              {programTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
          </div>

          {/* Program Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePlayPrevious}
              disabled={!previousProgram}
              className={`p-1.5 md:p-2 glass rounded-lg transition-colors text-sm md:text-base ${
                previousProgram
                  ? "text-foreground hover:bg-[rgba(var(--foreground),0.12)] cursor-pointer"
                  : "text-foreground/30 cursor-not-allowed"
              }`}
              aria-label="Play previous program"
              title={previousProgram ? "Play previous program" : "No previous program"}
            >
              <span>‹</span>
            </button>
            <button
              onClick={handlePlayCurrent}
              className={`px-3 py-1.5 md:px-4 md:py-2 font-semibold rounded-lg transition-colors text-xs md:text-sm shadow-md hover:shadow-lg ${
                currentProgram
                  ? "bg-ministry-gold hover:bg-ministry-gold/90 text-white"
                  : "bg-foreground/10 hover:bg-foreground/20 text-foreground"
              }`}
              aria-label="Play current program"
              title={currentProgram ? "Play current program" : "No current program - scroll to now"}
            >
              {t("tv.now")}
            </button>
            <button
              onClick={handlePlayNext}
              disabled={!nextProgram}
              className={`p-1.5 md:p-2 glass rounded-lg transition-colors text-sm md:text-base ${
                nextProgram
                  ? "text-foreground hover:bg-[rgba(var(--foreground),0.12)] cursor-pointer"
                  : "text-foreground/30 cursor-not-allowed"
              }`}
              aria-label="Play next program"
              title={nextProgram ? "Play next program" : "No next program"}
            >
              <span>›</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="relative overflow-x-auto pb-4"
          style={{
            scrollbarWidth: "thin",
            scrollBehavior: "smooth",
            width: "100%",
          }}
        >
          {/* Time Labels */}
          <div
            className={`relative ${isMobile ? "mb-2" : "mb-3"} ${isMobile ? "px-1" : "px-2"}`}
            style={{ width: "2400px", minHeight: "20px" }}
          >
            {hours
              .filter((h) => h % 3 === 0)
              .map((hour) => {
                const date = new Date();
                date.setHours(hour, 0, 0, 0);
                const time12h = date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });
                const labelPosition = (hour / 24) * 2400;
                return (
                  <span
                    key={hour}
                    className={`absolute text-foreground/70 ${isMobile ? "text-[10px]" : "text-xs"} font-medium`}
                    style={{ left: `${labelPosition}px`, transform: "translateX(-50%)" }}
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
              width: "2400px",
              minHeight: isMobile ? "140px" : "200px",
              paddingRight: isMobile ? "8px" : "32px",
              paddingLeft: isMobile ? "4px" : "16px",
              height: `${Math.max(isMobile ? 140 : 200, topOffset + cardHeight + (isMobile ? 10 : 20))}px`,
            }}
          >
            {/* Hour Markers */}
            {hours
              .filter((h) => h % 3 === 0)
              .map((hour) => {
                const markerPosition = (hour / 24) * 2400;
                return (
                  <div
                    key={hour}
                    className="absolute border-l border-[rgba(var(--foreground),0.15)]"
                    style={{
                      left: `${markerPosition}px`,
                      top: `${topOffset}px`,
                      height: `${cardHeight + 10}px`,
                    }}
                  />
                );
              })}

            {/* Program Blocks */}
            {limitedPrograms.map((program, index) => {
              const position = getProgramPosition(program);
              const isCurrent = isProgramCurrent(program);
              const isSelected = selectedProgramId === program.id;
              const topPx = topOffset;

              return (
                <motion.div
                  key={program.id}
                  ref={(el) => {
                    if (el) {
                      programRefs.current.set(program.id, el);
                    } else {
                      programRefs.current.delete(program.id);
                    }
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isSelected ? 1.05 : 1,
                  }}
                  onClick={() => {
                    handleCardClick(program);
                    setSelectedProgramId(program.id);
                    setTimeout(() => setSelectedProgramId(null), 3000);
                  }}
                  className={`absolute rounded-lg ${isMobile ? "p-1.5" : "p-2 sm:p-3 md:p-4"} cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-all border-2 shadow-lg touch-manipulation group ${
                    isSelected
                      ? "bg-ministry-gold/40 dark:bg-ministry-gold/50 border-ministry-gold border-[3px] z-[100] shadow-2xl shadow-ministry-gold/70 ring-4 ring-ministry-gold/30 animate-pulse"
                      : isCurrent && !isSelected
                      ? "bg-white dark:bg-neutral-800 border-blue-400/60 z-10"
                      : "bg-white/95 dark:bg-neutral-800/95 border-gray-200 dark:border-neutral-600 hover:border-ministry-gold hover:shadow-xl z-0"
                  }`}
                  style={{
                    left: position.left,
                    width: position.width,
                    top: `${topPx}px`,
                    height: `${cardHeight}px`,
                    zIndex: isSelected ? 100 : isCurrent ? 10 : 0,
                    ...(isSelected
                      ? {
                          boxShadow:
                            "0 12px 40px rgba(212, 175, 55, 0.6), 0 16px 50px rgba(212, 175, 55, 0.5), 0 8px 20px rgba(212, 175, 55, 0.4), 0 0 0 4px rgba(212, 175, 55, 0.2)",
                          borderColor: "rgb(212, 175, 55)",
                          transform: "scale(1.05)",
                        }
                      : isCurrent && !isSelected
                      ? {
                          boxShadow:
                            "0 4px 20px rgba(59, 130, 246, 0.3), 0 8px 30px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(59, 130, 246, 0.15)",
                          borderColor: "rgba(59, 130, 246, 0.4)",
                        }
                      : {}),
                  }}
                >
                  {program.thumbnail && (
                    <div
                      className={`absolute inset-0 rounded-md overflow-hidden ${isCurrent ? "opacity-100" : "opacity-40"}`}
                    >
                      <Image
                        src={program.thumbnail}
                        alt={program.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 80px, 120px"
                      />
                    </div>
                  )}
                  <div
                    className={`relative z-10 h-full flex flex-col justify-between rounded-md ${isMobile ? "p-1.5" : "p-1 sm:p-1.5 md:p-2"}`}
                  >
                    <div className="flex-shrink-0 flex items-start justify-between">
                      <span
                        className={`inline-block ${isMobile ? "px-1.5 py-0.5 text-[9px]" : "px-1 sm:px-1.5 py-0.5 text-[7px] sm:text-[8px] md:text-[9px]"} ${getProgramTypeColor(program.type)} text-white font-bold rounded shadow-sm`}
                      >
                        {program.type}
                      </span>
                      <Play className="w-3 h-3 text-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex-shrink-0 mt-auto">
                      <h4
                        className={`font-semibold text-gray-900 dark:text-white ${isMobile ? "text-xs" : "text-[10px] sm:text-xs md:text-sm"} line-clamp-2 ${isMobile ? "leading-snug" : "leading-tight sm:leading-snug"} drop-shadow-sm text-left`}
                      >
                        {pick(program.title, program.titleLocalized)}
                      </h4>
                      <p className="text-[8px] text-foreground/60 mt-1">
                        {formatProgramTime(program.startTime)} -{" "}
                        {formatProgramTime(program.endTime)}
                      </p>
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
          <div
            className={`${isMobile ? "p-3" : "p-4"} bg-[rgba(var(--foreground),0.08)] border border-[rgba(var(--foreground),0.15)] rounded-lg`}
          >
            <div className={`flex items-center gap-2 ${isMobile ? "mb-1.5" : "mb-2"}`}>
              <Clock className={`${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"} text-ministry-gold`} />
              <span className={`text-ministry-gold font-semibold ${isMobile ? "text-xs" : "text-sm"}`}>
                {t("tv.upNext")}: {getTimeUntil(nextProgram)}
              </span>
            </div>
            <h5 className={`font-serif font-bold text-foreground ${isMobile ? "text-sm mb-0.5" : "mb-1"}`}>
              {pick(nextProgram.title, nextProgram.titleLocalized)}
            </h5>
            <p className={`text-foreground/70 ${isMobile ? "text-xs" : "text-sm"}`}>
              {formatProgramTime(nextProgram.startTime)} -{" "}
              {formatProgramTime(nextProgram.endTime)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
