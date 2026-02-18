# 📺 Schedule Configuration Guide

## Overview
Program schedules can be rescheduled by modifying the configuration file. No user-facing edit mode is needed - schedules are managed through code configuration.

## How to Reschedule Programs

### Step 1: Open the Configuration File
Open `lib/schedule-config.ts` in your code editor.

### Step 2: Configure Video Order
Edit the `CUSTOM_VIDEO_ORDER` array to specify the order you want videos to appear:

```typescript
export const CUSTOM_VIDEO_ORDER: string[] = [
  "video-id-1",  // First video
  "video-id-2",  // Second video
  "video-id-3",  // Third video
  // ... add more video IDs in the order you want
];
```

### Step 3: Find Video IDs
To find video IDs, check `lib/gallery-data.ts` - each video has an `id` property.

Example:
```typescript
{
  id: "walking-in-faith",
  title: "Walking in Faith",
  // ... other properties
}
```

### Step 4: Save and Restart
After modifying the configuration:
1. Save the file
2. Restart your development server (`npm run dev`)
3. The new schedule will be applied automatically

## Default Behavior

If `CUSTOM_VIDEO_ORDER` is empty (`[]`), the system will:
- Sort videos by date (oldest to newest)
- Automatically distribute them across the day
- Maintain chronological order

## Program Duration Configuration

You can also customize program durations in `lib/schedule-config.ts`:

```typescript
export const PROGRAM_DURATIONS: Record<string, number> = {
  "fire on the altar": 90,    // 90 minutes
  "prayer rally": 90,         // 90 minutes
  "service": 90,              // 90 minutes
  "podcast": 45,              // 45 minutes
  "praise": 30,               // 30 minutes
  "default": 60,              // 60 minutes (default)
};
```

## Example Configuration

```typescript
// lib/schedule-config.ts

// Custom order - videos will appear in this sequence
export const CUSTOM_VIDEO_ORDER = [
  "walking-in-faith",
  "power-of-prayer",
  "finding-hope",
  "living-with-purpose",
  "gift-of-grace",
];

// Custom durations (optional)
export const PROGRAM_DURATIONS: Record<string, number> = {
  "fire on the altar": 90,
  "prayer rally": 90,
  "service": 90,
  "podcast": 45,
  "praise": 30,
  "default": 60,
};
```

## Features

✅ **No User Editing**: Schedules are managed by admins through code
✅ **Simple Configuration**: Just edit an array of video IDs
✅ **Automatic Timing**: Programs are automatically spaced throughout the day
✅ **Flexible Duration**: Customize how long each program type runs
✅ **Default Fallback**: Works automatically if no custom order is set

## Notes

- Video IDs must match exactly with IDs in `gallery-data.ts`
- Videos not in the custom order will appear after ordered videos
- Programs are distributed evenly across 24 hours
- Each day repeats the same schedule pattern
- Changes require a server restart to take effect

---

**Last Updated**: February 2026
**Version**: 2.0
