import { PreRecordedContent, LiveSchedule } from "./types";
import { GALLERY_VIDEOS } from "./gallery-data";

// Your Facebook Page ID or Video ID
export const FACEBOOK_PAGE_ID = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || "";
export const FACEBOOK_VIDEO_ID = process.env.NEXT_PUBLIC_FACEBOOK_VIDEO_ID || "";

// YouTube Channel ID or Video ID
export const YOUTUBE_CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || "";
export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";

const mapCategoryToType = (category: string): PreRecordedContent["type"] => {
  if (category === "praise") return "worship";
  if (category === "podcast") return "podcast";
  return "sermon";
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

// Build pre-recorded playlist from gallery videos (looping, spread over 24h)
let cumulativeMinutes = 0;
export const PRERECORDED_PLAYLIST: PreRecordedContent[] = GALLERY_VIDEOS.map((video) => {
  const durationMin = minutesForVideo(video.title, video.category);
  const startHour = (cumulativeMinutes / 60) % 24;
  const endHour = ((cumulativeMinutes + durationMin) / 60) % 24;
  cumulativeMinutes += durationMin;

  return {
    id: video.id,
    title: video.title,
    titleLocalized: video.titleLocalized,
    descriptionLocalized: video.descriptionLocalized,
    type: mapCategoryToType(video.category),
    url: video.videoUrl,
    thumbnail: video.thumbnail,
    duration: durationMin * 60, // seconds
    scheduledTime: {
      startHour,
      endHour,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    },
  };
});

// Live streaming schedule (for countdown display)
export const LIVE_SCHEDULE: LiveSchedule[] = [
  {
    id: "sunday-service",
    title: "Sunday Service",
    scheduledTime: new Date("2024-03-24T10:00:00"), // Update with your schedule
    description: "Join us for our weekly Sunday service",
  },
  {
    id: "wednesday-prayer",
    title: "Wednesday Prayer Meeting",
    scheduledTime: new Date("2024-03-27T19:00:00"), // Update with your schedule
    description: "Mid-week prayer and fellowship",
  },
];

// Function to get next live event
export function getNextLiveEvent(): LiveSchedule | null {
  const now = new Date();
  const upcoming = LIVE_SCHEDULE.filter((event) => event.scheduledTime > now);
  if (upcoming.length === 0) return null;
  return upcoming.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())[0];
}

// Function to get random pre-recorded content
export function getRandomPreRecordedContent(): PreRecordedContent {
  const randomIndex = Math.floor(Math.random() * PRERECORDED_PLAYLIST.length);
  return PRERECORDED_PLAYLIST[randomIndex];
}

// Function to get scheduled content based on current time
export function getScheduledContent(): PreRecordedContent | null {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

  // Find content that matches current time slot
  for (const content of PRERECORDED_PLAYLIST) {
    if (content.scheduledTime) {
      const { startHour, endHour, daysOfWeek } = content.scheduledTime;
      
      // Check if current day matches (if specified)
      if (daysOfWeek && !daysOfWeek.includes(currentDay)) {
        continue;
      }

      // Check if current hour is within scheduled time
      if (currentHour >= startHour && currentHour < endHour) {
        return content;
      }
    }
  }

  return null;
}

// Function to get content for current time (scheduled or random)
export function getContentForCurrentTime(): PreRecordedContent {
  const scheduled = getScheduledContent();
  return scheduled || getRandomPreRecordedContent();
}

