# Mux Live Streaming Setup Guide

This guide will help you set up Mux for live streaming on EBOMI TV.

## Step 1: Create Mux Account

1. Go to [https://mux.com](https://mux.com)
2. Sign up for a free account
3. Navigate to **Settings** → **Access Tokens**
4. Create a new access token with **Full Access** permissions
5. Copy your **Token ID** and **Token Secret**

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
MUX_TOKEN_ID=your_token_id_here
MUX_TOKEN_SECRET=your_token_secret_here
```

**For Vercel deployment:**
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add both `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET`
4. Redeploy your application

## Step 3: Create Your First Live Stream

### Option A: Using the API (Recommended)

You can create a live stream programmatically by calling:

```bash
POST /api/mux/live/create
```

Or use the Mux dashboard to create one manually.

### Option B: Using Mux Dashboard

1. Go to [Mux Dashboard](https://dashboard.mux.com)
2. Navigate to **Live Streams**
3. Click **Create Live Stream**
4. Copy the **Stream Key** and **Playback ID**

## Step 4: Set Up OBS Studio

1. **Download OBS Studio**: [https://obsproject.com](https://obsproject.com)

2. **Configure OBS Settings:**
   - Open OBS Studio
   - Go to **Settings** → **Stream**
   - Select **Service: Custom**
   - **Server**: `rtmp://global-live.mux.com:5222/app`
   - **Stream Key**: Paste your Mux Stream Key

3. **Add Sources:**
   - Click **+** in Sources panel
   - Add **Video Capture Device** (your camera)
   - Add **Audio Input Capture** (your microphone)
   - Add **Display Capture** (if streaming screen)

4. **Start Streaming:**
   - Click **Start Streaming** in OBS
   - Your stream will appear on `/live` page automatically

## Step 5: Test Your Stream

1. Start streaming from OBS Studio
2. Navigate to `http://localhost:3000/live` (or your deployed URL)
3. You should see your live stream playing

## API Endpoints

### Create Live Stream
```bash
POST /api/mux/live/create
```

### List Live Streams
```bash
GET /api/mux/live/list?limit=10&page=1
```

### Get Live Stream Status
```bash
GET /api/mux/live/[id]
```

### Delete Live Stream
```bash
DELETE /api/mux/live/[id]
```

## Troubleshooting

### Stream Not Showing
- Check that OBS is actually streaming (look for green indicator)
- Verify your Stream Key is correct
- Check Mux dashboard for stream status
- Ensure environment variables are set correctly

### Authentication Errors
- Verify your Mux Token ID and Secret are correct
- Check that tokens have proper permissions
- Ensure `.env.local` file is in project root

### Player Not Loading
- Check browser console for errors
- Verify Playback ID is correct
- Ensure Mux player package is installed

## Cost Information

Mux Live Streaming pricing:
- **$0.015 per minute streamed**
- First 1,000 minutes/month are free (for testing)
- Recordings are stored as assets (separate pricing)

## Next Steps

1. Set up automatic recording of live streams
2. Create admin interface for managing streams
3. Add stream scheduling functionality
4. Integrate with Supabase for stream metadata

## Support

- [Mux Documentation](https://docs.mux.com)
- [Mux Support](https://mux.com/support)

