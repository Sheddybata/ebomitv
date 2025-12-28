# New Features Guide

This document explains all the new features added to the ministry streaming platform.

## 1. Multi-Source Streaming

### Overview
The platform now supports multiple live streaming sources with automatic fallback:
1. **Facebook Live** (Primary)
2. **YouTube Live** (Secondary backup)
3. **Pre-recorded Content** (Final fallback)

### Configuration

Add to `.env.local`:
```env
# Facebook
NEXT_PUBLIC_FACEBOOK_PAGE_ID=your_facebook_page_id
NEXT_PUBLIC_FACEBOOK_LIVE=true  # Set to true when going live

# YouTube
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=your_channel_id
NEXT_PUBLIC_YOUTUBE_LIVE=true  # Set to true when going live
NEXT_PUBLIC_YOUTUBE_VIDEO_ID=video_id  # Optional: specific video
YOUTUBE_API_KEY=your_api_key  # For automatic detection
```

### How It Works
- System checks Facebook Live first
- If not live, checks YouTube Live
- If neither is live, plays scheduled or random pre-recorded content
- Checks every 30 seconds for live status changes

## 2. Donation Integration

### Overview
A floating "Give Now" button appears during live streams, allowing viewers to donate.

### Features
- Preset donation amounts ($25, $50, $100, $250, $500)
- Custom amount input
- Optional name and email collection
- Success confirmation
- Ready for payment processor integration (Stripe, PayPal, etc.)

### Integration Steps

1. **Set up payment processor** (e.g., Stripe):
   - Get API keys from Stripe
   - Update `app/api/donate/route.ts` with Stripe integration
   - Uncomment Stripe code in the API route

2. **Test the flow**:
   - Visit `/watch` during a live stream
   - Click "Give Now" button (bottom right)
   - Fill in donation details
   - Process donation

### Customization
Edit `components/DonationWidget.tsx` to:
- Change preset amounts
- Add recurring donation options
- Customize the UI

## 3. Content Scheduling

### Overview
Schedule pre-recorded content to play at specific times of day, ensuring relevant content is shown when no live streams are active.

### Configuration

Edit `lib/stream-config.ts`:

```typescript
{
  id: "1",
  title: "Morning Devotion",
  type: "sermon",
  url: "https://www.youtube.com/embed/VIDEO_ID",
  duration: 3600,
  scheduledTime: {
    startHour: 6,    // 6 AM
    endHour: 12,     // 12 PM (noon)
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Sunday-Saturday (all days)
  },
}
```

### Scheduling Options
- **Time-based**: Content plays during specific hours (0-23)
- **Day-based**: Optional `daysOfWeek` array (0=Sunday, 6=Saturday)
- **Fallback**: Content without `scheduledTime` plays randomly when no scheduled content matches

### Example Schedule
- 6 AM - 12 PM: Morning devotionals
- 12 PM - 6 PM: Worship music
- 6 PM - 12 AM: Evening sermons
- 12 AM - 6 AM: Random content

## 4. Prayer Request Widget

### Overview
A floating "Prayer Request" button allows viewers to submit prayer requests in real-time.

### Features
- Prayer request text input
- Optional name and email
- Anonymous submission option
- Success confirmation
- Ready for backend integration

### Backend Integration

1. **Database Setup**:
   - Create a `prayer_requests` table
   - Fields: id, name, email, request, isAnonymous, createdAt, status

2. **Update API Route**:
   - Edit `app/api/prayer-requests/route.ts`
   - Uncomment database code
   - Add your database connection

3. **Notification Setup** (Optional):
   - Email notifications to prayer team
   - Slack/Discord webhooks
   - Admin dashboard for managing requests

### Usage
- Button appears on bottom left of watch page
- Click to open modal
- Fill in request (required)
- Submit (with or without name/email)
- Receive confirmation

## 5. Multi-Language Support

### Overview
Support for multiple languages with captions/subtitles for videos.

### Supported Languages
- English (en)
- Spanish (es)
- French (fr)
- Portuguese (pt)
- German (de)
- Chinese (zh)
- Arabic (ar)
- Hindi (hi)

### Configuration

1. **Add Captions to Content**:
   Edit `lib/stream-config.ts`:

```typescript
{
  id: "1",
  title: "Video Title",
  captions: [
    {
      language: "English",
      languageCode: "en",
      url: "/captions/video1-en.vtt",  // Path to VTT file
      label: "English",
    },
    {
      language: "Spanish",
      languageCode: "es",
      url: "/captions/video1-es.vtt",
      label: "Español",
    },
  ],
}
```

2. **Create Caption Files**:
   - Create VTT (WebVTT) or SRT files for each language
   - Place in `public/captions/` directory
   - Format: `video-id-language.vtt`

3. **Language Selector**:
   - Appears in top-right of watch page
   - User's preference saved in localStorage
   - Persists across sessions

### Caption File Format (VTT)

```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
Welcome to our ministry.

00:00:05.000 --> 00:00:10.000
Thank you for joining us today.
```

### YouTube Captions
If using YouTube videos, you can:
- Use YouTube's built-in captions (set `cc_lang_pref` in embed URL)
- Or provide your own VTT files for more control

### Customization
- Add more languages in `components/LanguageSelector.tsx`
- Customize caption styling in `components/CaptionOverlay.tsx`
- Adjust caption position and appearance

## Implementation Status

✅ **Completed Features:**
- Multi-source streaming (Facebook + YouTube)
- Donation widget with UI
- Content scheduling system
- Prayer request widget
- Multi-language selector
- Caption overlay component
- API routes for donations and prayer requests

⚠️ **Requires Integration:**
- Payment processor (Stripe/PayPal) for donations
- Database for prayer requests storage
- Caption file creation and hosting
- YouTube API key for automatic live detection
- Facebook Graph API for automatic live detection

## Next Steps

1. **Set up payment processing** for donations
2. **Create database schema** for prayer requests
3. **Generate caption files** for your videos
4. **Configure YouTube/Facebook API** keys for automatic detection
5. **Test all features** in production environment
6. **Customize styling** to match your brand

## Troubleshooting

### Donations not processing
- Check payment processor API keys
- Verify API route is deployed
- Check browser console for errors

### Prayer requests not saving
- Ensure database is configured
- Check API route for errors
- Verify CORS settings

### Captions not showing
- Verify VTT files exist and are accessible
- Check caption URLs in config
- Ensure language code matches selector

### Live stream not detecting
- Verify environment variables are set
- Check API keys are valid
- Use manual toggles for testing (`NEXT_PUBLIC_FACEBOOK_LIVE=true`)




