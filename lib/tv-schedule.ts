import { TVProgram } from "./types";
import { GALLERY_VIDEOS } from "./gallery-data";

const parseDisplayDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/i, "$1");
  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? null : d;
};

const minutesForVideo = (title: string, category: string): number => {
  const lower = title.toLowerCase();
  if (lower.includes("fire on the altar")) return 90;
  if (lower.includes("prayer rally")) return 90;
  if (lower.includes("service")) return 90;
  if (category === "podcast") return 45;
  if (category === "praise") return 30;
  return 60;
};

// Generate a rolling 7-day schedule from gallery videos (continuous loop)
// Only uses the first 20 videos and loops them
export function generateWeeklySchedule(): TVProgram[] {
  const schedule: TVProgram[] = [];
  const now = new Date();

  // Sort videos by their provided date (oldest to newest) to distribute chronologically
  const sortedVideos = [...GALLERY_VIDEOS].sort((a, b) => {
    const da = parseDisplayDate(a.date)?.getTime() || 0;
    const db = parseDisplayDate(b.date)?.getTime() || 0;
    return da - db;
  });

  // If no videos, return empty
  if (sortedVideos.length === 0) return schedule;

  // Use all videos for the program guide (no limit)
  const programVideos = sortedVideos;

  // For each of 7 days, show all videos
  for (let day = 0; day < 7; day++) {
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    dayStart.setDate(now.getDate() + day);

    // Calculate total duration of all videos
    const totalDuration = programVideos.reduce((sum, video) => {
      return sum + minutesForVideo(video.title, video.category);
    }, 0);

    // Calculate spacing to distribute videos evenly across 24 hours
    // If total duration is less than 24 hours, space them evenly
    // If total duration is more than 24 hours, they'll overlap (which is fine)
    const availableMinutes = 24 * 60;
    const spacing = Math.max(0, (availableMinutes - totalDuration) / (programVideos.length - 1));
    
    let minutesUsed = 0;

    // Create programs, one for each video
    programVideos.forEach((video, videoIndex) => {
      const durationMin = minutesForVideo(video.title, video.category);
      const start = new Date(dayStart.getTime() + minutesUsed * 60 * 1000);
      const end = new Date(start.getTime() + durationMin * 60 * 1000);

      schedule.push({
        id: `${video.id}-${day}-${videoIndex}`,
        title: video.title,
        titleLocalized: video.titleLocalized,
        description: video.description,
        descriptionLocalized: video.descriptionLocalized,
        thumbnail: video.thumbnail,
        startTime: start,
        endTime: end,
        type: video.category === "praise" ? "worship" : video.category === "podcast" ? "teaching" : "sermon",
        channel: "Main",
        isLive: false,
      });

      // Move to next position: video duration + spacing (except for last video)
      minutesUsed += durationMin;
      if (videoIndex < programVideos.length - 1) {
        minutesUsed += spacing;
      }
    });
  }

  // Remove duplicates: same video ID with identical time slots (exact duplicates only)
  const deduplicated: TVProgram[] = [];
  const seen = new Set<string>();
  
  for (const program of schedule) {
    // Create a unique key based on video ID (extract from program ID) and exact time slot
    // Program ID format: {videoId}-{day}-{videoIndex}
    // Extract video ID by removing the last two segments (day and index)
    const parts = program.id.split('-');
    if (parts.length >= 3) {
      // Last two parts are day and index, everything before is the video ID
      const videoId = parts.slice(0, -2).join('-');
      
      // Create unique key: video ID + exact start time + exact end time
      const timeKey = `${videoId}-${program.startTime.getTime()}-${program.endTime.getTime()}`;
      
      // Only add if we haven't seen this exact video at this exact time
      if (!seen.has(timeKey)) {
        seen.add(timeKey);
        deduplicated.push(program);
      }
    } else {
      // Fallback: if ID format is unexpected, just add it
      deduplicated.push(program);
    }
  }

  // Sort by start time to ensure chronological order
  return deduplicated.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
}

// Get current program
export function getCurrentProgram(schedule: TVProgram[]): TVProgram | null {
  const now = new Date();
  return schedule.find(
    (prog) => now >= prog.startTime && now < prog.endTime
  ) || null;
}

// Get next program
export function getNextProgram(schedule: TVProgram[]): TVProgram | null {
  const now = new Date();
  const upcoming = schedule.filter((prog) => prog.startTime > now);
  if (upcoming.length === 0) return null;
  return upcoming.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];
}

// Get programs for a specific day
export function getProgramsForDay(schedule: TVProgram[], date: Date): TVProgram[] {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Include programs that start on this day OR overlap with this day
  return schedule.filter(
    (prog) => {
      const progStart = new Date(prog.startTime);
      const progEnd = new Date(prog.endTime);
      
      // Program is included if:
      // 1. It starts on this day, OR
      // 2. It overlaps with this day (starts before but ends during/after, or spans the entire day)
      return (
        (progStart >= startOfDay && progStart <= endOfDay) ||
        (progStart < startOfDay && progEnd > startOfDay) ||
        (progStart <= endOfDay && progEnd > endOfDay)
      );
    }
  );
}

// Format time for display
export function formatProgramTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Get time until program starts
export function getTimeUntil(program: TVProgram): string {
  const now = new Date();
  const diff = program.startTime.getTime() - now.getTime();
  
  if (diff < 0) return "Now";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `in ${hours}h ${minutes}m`;
  }
  return `in ${minutes}m`;
}


