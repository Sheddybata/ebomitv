import { NextResponse } from "next/server";
import { StreamStatus } from "@/lib/types";
import {
  FACEBOOK_PAGE_ID,
  YOUTUBE_CHANNEL_ID,
  YOUTUBE_API_KEY,
  getNextLiveEvent,
  getContentForCurrentTime,
} from "@/lib/stream-config";

// Check Facebook Live status
async function checkFacebookLiveStatus(): Promise<{ isLive: boolean; url?: string }> {
  // Option 1: Use Facebook Graph API (requires access token)
  // const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  // if (accessToken) {
  //   try {
  //     const response = await fetch(
  //       `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/live_videos?access_token=${accessToken}&limit=1`
  //     );
  //     const data = await response.json();
  //     const liveVideo = data.data?.find((video: any) => video.status === 'LIVE');
  //     if (liveVideo) {
  //       return { isLive: true, url: liveVideo.permalink_url };
  //     }
  //   } catch (error) {
  //     console.error("Facebook API error:", error);
  //   }
  // }

  // Option 2: Manual toggle for testing
  if (process.env.NEXT_PUBLIC_FACEBOOK_LIVE === "true") {
    return {
      isLive: true,
      url: `https://www.facebook.com/${FACEBOOK_PAGE_ID}/live`,
    };
  }

  return { isLive: false };
}

// Check YouTube Live status
async function checkYouTubeLiveStatus(): Promise<{ isLive: boolean; videoId?: string; url?: string }> {
  if (!YOUTUBE_CHANNEL_ID || !YOUTUBE_API_KEY) {
    return { isLive: false };
  }

  try {
    // Check for live broadcasts using YouTube Data API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("YouTube API request failed");
    }

    const data = await response.json();
    const liveVideo = data.items?.[0];

    if (liveVideo) {
      return {
        isLive: true,
        videoId: liveVideo.id.videoId,
        url: `https://www.youtube.com/watch?v=${liveVideo.id.videoId}`,
      };
    }
  } catch (error) {
    console.error("YouTube API error:", error);
  }

  // Manual toggle for testing
  if (process.env.NEXT_PUBLIC_YOUTUBE_LIVE === "true") {
    const videoId = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || "";
    return {
      isLive: true,
      videoId,
      url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined,
    };
  }

  return { isLive: false };
}

export async function GET() {
  try {
    // Check sources in priority order: Facebook first, then YouTube
    const facebookStatus = await checkFacebookLiveStatus();
    let streamStatus: StreamStatus;

    if (facebookStatus.isLive) {
      streamStatus = {
        isLive: true,
        source: "facebook",
        facebookUrl: facebookStatus.url,
      };
    } else {
      const youtubeStatus = await checkYouTubeLiveStatus();
      if (youtubeStatus.isLive) {
        streamStatus = {
          isLive: true,
          source: "youtube",
          youtubeUrl: youtubeStatus.url,
          youtubeVideoId: youtubeStatus.videoId,
        };
      } else {
        // Use scheduled content or fallback to random
        const nextLive = getNextLiveEvent();
        streamStatus = {
          isLive: false,
          source: "prerecorded",
          nextLiveTime: nextLive?.scheduledTime,
          currentContent: getContentForCurrentTime(),
        };
      }
    }

    return NextResponse.json(streamStatus);
  } catch (error) {
    console.error("Error checking stream status:", error);
    // On error, default to pre-recorded content for 100% uptime
    return NextResponse.json({
      isLive: false,
      source: "prerecorded" as const,
      currentContent: getContentForCurrentTime(),
    });
  }
}

