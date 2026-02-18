/**
 * Schedule Configuration
 * 
 * This file allows you to configure the program schedule order and timing.
 * Modify the video order here to reschedule programs without user editing.
 */

import { GALLERY_VIDEOS } from "./gallery-data";

/**
 * Custom video order for scheduling
 * Set the order you want videos to appear in the program guide
 * Use video IDs from GALLERY_VIDEOS
 * 
 * Example:
 * export const CUSTOM_VIDEO_ORDER = [
 *   "video-id-1",
 *   "video-id-2",
 *   "video-id-3",
 * ];
 * 
 * Leave empty array [] to use default order (sorted by date)
 */
export const CUSTOM_VIDEO_ORDER: string[] = [];

/**
 * Get ordered videos based on custom configuration
 * Falls back to default order if CUSTOM_VIDEO_ORDER is empty
 */
export function getOrderedVideos() {
  if (CUSTOM_VIDEO_ORDER.length === 0) {
    // Default: sort by date (oldest to newest)
    return [...GALLERY_VIDEOS].sort((a, b) => {
      const parseDisplayDate = (dateStr: string): Date | null => {
        if (!dateStr) return null;
        const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/i, "$1");
        const d = new Date(cleaned);
        return isNaN(d.getTime()) ? null : d;
      };
      
      const da = parseDisplayDate(a.date)?.getTime() || 0;
      const db = parseDisplayDate(b.date)?.getTime() || 0;
      return da - db;
    });
  }

  // Use custom order
  const orderedVideos: typeof GALLERY_VIDEOS = [];
  const videoMap = new Map(GALLERY_VIDEOS.map(v => [v.id, v]));
  
  // Add videos in custom order
  for (const videoId of CUSTOM_VIDEO_ORDER) {
    const video = videoMap.get(videoId);
    if (video) {
      orderedVideos.push(video);
      videoMap.delete(videoId); // Remove from map to track what's left
    }
  }
  
  // Add any remaining videos that weren't in the custom order
  videoMap.forEach(video => orderedVideos.push(video));
  
  return orderedVideos;
}

/**
 * Program duration settings (in minutes)
 */
export const PROGRAM_DURATIONS: Record<string, number> = {
  "fire on the altar": 90,
  "prayer rally": 90,
  "service": 90,
  "podcast": 45,
  "praise": 30,
  "default": 60,
};

/**
 * Get duration for a video based on title and category
 */
export function getVideoDuration(title: string, category: string): number {
  const lower = title.toLowerCase();
  
  // Check for specific titles first
  if (lower.includes("fire on the altar")) return PROGRAM_DURATIONS["fire on the altar"];
  if (lower.includes("prayer rally")) return PROGRAM_DURATIONS["prayer rally"];
  if (lower.includes("service")) return PROGRAM_DURATIONS.service;
  
  // Check category
  if (category === "podcast") return PROGRAM_DURATIONS.podcast;
  if (category === "praise") return PROGRAM_DURATIONS.praise;
  
  // Default duration
  return PROGRAM_DURATIONS.default;
}
