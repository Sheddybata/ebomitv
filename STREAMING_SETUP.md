# Live Streaming Setup Guide

This guide explains how to set up and configure the live streaming system for your ministry platform.

## Architecture Overview

The platform uses a **smart multi-source fallback system** to ensure 100% uptime:

1. **Primary**: Facebook Live (when active)
2. **Secondary**: YouTube Live (backup when Facebook is offline)
3. **Final Fallback**: Pre-recorded content (sermons, podcasts, ads) with intelligent scheduling
4. **Auto-switching**: Automatically detects when live stream starts/stops

## Features

- ✅ Multi-source streaming (Facebook + YouTube Live)
- ✅ Automatic live stream detection
- ✅ Seamless fallback to pre-recorded content
- ✅ Content scheduling (time-based playback)
- ✅ Live status indicator (LIVE badge)
- ✅ Upcoming events countdown
- ✅ Schedule display
- ✅ Live chat (when stream is live)
- ✅ Donation widget (during live streams)
- ✅ Prayer request widget
- ✅ Multi-language support with captions
- ✅ 100% uptime guarantee

**For detailed feature documentation, see [FEATURES_GUIDE.md](./FEATURES_GUIDE.md)**

## Setup Instructions

### 1. Multi-Source Live Streaming Configuration

#### Facebook Live (Primary)

#### Option A: Facebook Page ID (Recommended)

1. Go to your Facebook Page
2. Copy your Page ID from the About section, or use: `https://www.facebook.com/yourpagename`
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_FACEBOOK_PAGE_ID=your_page_id_or_url
   ```

#### Option B: Specific Video Embed

1. When you go live on Facebook, click "Share" → "Embed"
2. Copy the video URL
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_FACEBOOK_VIDEO_ID=your_video_id
   NEXT_PUBLIC_FACEBOOK_LIVE=true  # Set to true when going live
   ```

#### YouTube Live (Secondary Backup)

1. Get your YouTube Channel ID
2. Get YouTube Data API Key from Google Cloud Console
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=your_channel_id
   YOUTUBE_API_KEY=your_api_key
   NEXT_PUBLIC_YOUTUBE_LIVE=true  # Set to true when going live
   NEXT_PUBLIC_YOUTUBE_VIDEO_ID=video_id  # Optional: specific video ID

### 2. Configure Pre-Recorded Content

Edit `lib/stream-config.ts` to add your content:

```typescript
export const PRERECORDED_PLAYLIST: PreRecordedContent[] = [
  {
    id: "1",
    title: "Your Sermon Title",
    type: "sermon",
    url: "https://www.youtube.com/embed/YOUR_VIDEO_ID", // YouTube embed URL
    thumbnail: "/path/to/thumbnail.jpg",
    duration: 3600, // Duration in seconds (optional, for auto-rotation)
  },
  // Add more content...
];
```

### 3. Configure Live Schedule

Update `lib/stream-config.ts` with your streaming schedule:

```typescript
export const LIVE_SCHEDULE: LiveSchedule[] = [
  {
    id: "sunday-service",
    title: "Sunday Service",
    scheduledTime: new Date("2024-03-24T10:00:00"), // Update date/time
    description: "Join us for our weekly Sunday service",
  },
  // Add more events...
];
```

### 4. Testing

#### Test Pre-Recorded Content
1. Make sure `NEXT_PUBLIC_FORCE_LIVE=false` in `.env.local`
2. Visit `/watch` - you should see pre-recorded content

#### Test Live Mode (Development)
1. Set `NEXT_PUBLIC_FORCE_LIVE=true` in `.env.local`
2. Visit `/watch` - you should see the live stream placeholder

## Advanced: Facebook Graph API Integration

For automatic live stream detection, you can integrate Facebook's Graph API:

1. Get a Facebook Access Token: https://developers.facebook.com/tools/explorer/
2. Add to `.env.local`:
   ```
   FACEBOOK_ACCESS_TOKEN=your_access_token
   ```
3. Uncomment the Graph API code in `app/api/stream-status/route.ts`

## Content Sources

### YouTube Videos
Use YouTube embed URLs:
```
https://www.youtube.com/embed/VIDEO_ID
```

### Vimeo Videos
Use Vimeo embed URLs:
```
https://player.vimeo.com/video/VIDEO_ID
```

### Facebook Videos
Use Facebook embed URLs:
```
https://www.facebook.com/plugins/video.php?href=VIDEO_URL
```

## Live Chat Integration

The live chat component is ready for integration. You can connect it to:

- **StreamChat** (getstream.io)
- **Twitch Chat API**
- **Custom WebSocket** server
- **Facebook Comments** API

Update `components/LiveChat.tsx` with your preferred service.

## Monitoring & Analytics

Consider adding:
- Viewer count display
- Engagement metrics
- Stream quality monitoring
- Error logging

## Troubleshooting

### Stream not showing
- Check Facebook Page ID is correct
- Verify video privacy is set to "Public"
- Check browser console for errors

### Pre-recorded content not playing
- Verify video URLs are correct
- Check video privacy settings
- Ensure embed URLs (not watch URLs) are used

### Auto-rotation not working
- Ensure `duration` is set in content config
- Check browser console for errors
- Videos rotate based on estimated duration

## Production Deployment

1. Set all environment variables in your hosting platform
2. Update live schedule dates
3. Add your actual content URLs
4. Test the fallback system
5. Monitor for any issues

## Future Enhancements

Ideas for future improvements:
- [ ] YouTube Live integration
- [ ] Multiple stream source selection
- [ ] Playlist editor UI
- [ ] Analytics dashboard
- [ ] Email notifications for live events
- [ ] Mobile app integration
- [ ] Multi-language support
- [ ] Prayer request integration
- [ ] Donation integration during streams

