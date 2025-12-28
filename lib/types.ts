import { type LanguageCode } from "./i18n/messages";

export type LocalizedText = Partial<Record<LanguageCode, string>>;

export interface StreamStatus {
  isLive: boolean;
  source: "facebook" | "youtube" | "prerecorded" | "none";
  facebookUrl?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  nextLiveTime?: Date;
  currentContent?: PreRecordedContent;
}

export interface PreRecordedContent {
  id: string;
  title: string;
  titleLocalized?: LocalizedText;
  descriptionLocalized?: LocalizedText;
  type: "sermon" | "podcast" | "ad" | "worship";
  url: string;
  thumbnail?: string;
  duration?: number;
  scheduledTime?: ScheduledContentTime; // For time-based scheduling
  captions?: CaptionTrack[]; // For multi-language support
}

export interface ScheduledContentTime {
  startHour: number; // 0-23
  endHour: number; // 0-23
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday), undefined = every day
}

export interface CaptionTrack {
  language: string;
  languageCode: string; // ISO 639-1 code (en, es, fr, etc.)
  url: string; // VTT or SRT file URL
  label: string; // Display name (English, Español, etc.)
}

export interface LiveSchedule {
  id: string;
  title: string;
  titleLocalized?: LocalizedText;
  scheduledTime: Date;
  description?: string;
  descriptionLocalized?: LocalizedText;
  source?: "facebook" | "youtube";
  url?: string;
}

export interface PrayerRequest {
  id?: string;
  name: string;
  email?: string;
  request: string;
  isAnonymous: boolean;
  createdAt?: Date;
}

export interface DonationAmount {
  preset?: number;
  custom?: number;
}

export interface TVProgram {
  id: string;
  title: string;
  description?: string;
  titleLocalized?: LocalizedText;
  descriptionLocalized?: LocalizedText;
  thumbnail?: string;
  startTime: Date;
  endTime: Date;
  type: "live" | "sermon" | "worship" | "teaching" | "music" | "prayer" | "event";
  channel?: string;
  isLive?: boolean;
  videoUrl?: string;
}
