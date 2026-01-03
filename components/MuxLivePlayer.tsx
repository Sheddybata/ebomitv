"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, AlertCircle } from "lucide-react";

// Disable Mux analytics globally to avoid ad blocker issues
let analyticsDisabled = false;

const disableMuxAnalytics = () => {
  if (typeof window === 'undefined' || analyticsDisabled) return;

  try {
    // Override the sendBeacon function to block Mux analytics
    const originalSendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function(url, data) {
      // Block Mux analytics and tracking requests
      const urlString = url.toString();
      if (url && (
        urlString.includes('litix.io') ||
        urlString.includes('mux.com/analytics') ||
        urlString.includes('inferred.litix.io')
      )) {
        return true; // Pretend success
      }
      return originalSendBeacon.call(this, url, data);
    };

    // Also override fetch for any analytics requests
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes('litix.io') || url.includes('mux.com/analytics')) {
        // Return a resolved promise to avoid errors
        return Promise.resolve(new Response(JSON.stringify({}), {
          status: 200,
          statusText: 'OK'
        }));
      }
      return originalFetch.call(this, input, init);
    };

    analyticsDisabled = true;
  } catch (error) {
    console.warn('Could not disable Mux analytics:', error);
  }
};

const MuxPlayerWithAnalyticsDisabled = (props: any) => {
  useEffect(() => {
    disableMuxAnalytics();
  }, []);

  return <MuxPlayer {...props} />;
};

interface MuxLivePlayerProps {
  playbackId: string;
  streamKey?: string;
  title?: string;
  autoPlay?: boolean;
  onStreamStatusChange?: (isLive: boolean) => void;
}

export default function MuxLivePlayer({
  playbackId,
  streamKey,
  title = "Live Stream",
  autoPlay = false,
  onStreamStatusChange,
}: MuxLivePlayerProps) {
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAttemptedPlay, setHasAttemptedPlay] = useState(false);

  // Check stream status periodically
  useEffect(() => {
    if (!playbackId) return;

    const checkStreamStatus = async () => {
      try {
        // You can add an API route to check Mux stream status
        // For now, we'll rely on Mux player's built-in status detection
        setIsLoading(false);
      } catch (err) {
        setError("Failed to check stream status");
        setIsLoading(false);
      }
    };

    checkStreamStatus();
    const interval = setInterval(checkStreamStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [playbackId]);

  if (!playbackId) {
    return (
      <div className="w-full aspect-video bg-black/20 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
          <p className="text-foreground/60">No live stream available</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-black/20 rounded-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-ministry-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <MuxPlayerWithAnalyticsDisabled
          streamType="live"
          playbackId={playbackId}
          metadata={{
            video_title: title,
            viewer_user_id: "anonymous",
          }}
          autoPlay={autoPlay}
          muted={autoPlay ? false : false}
          playsInline
          preload="auto"
          maxResolution="720p"
          onPlay={() => {
            setIsLive(true);
            setHasAttemptedPlay(true);
            setError(null); // Clear error when stream plays successfully
            onStreamStatusChange?.(true);
          }}
          onPause={() => {
            setIsLive(false);
            onStreamStatusChange?.(false);
          }}
          onError={(error: Error) => {
            console.error("Mux player error:", error);
            // Don't set error for analytics-related errors
            // Don't show error when there's no livestream available - just silently handle it
            // The LiveStream component will show pre-recorded content instead
            if (!error?.message?.includes('ERR_BLOCKED_BY_CLIENT') &&
                !error?.message?.includes('litix.io')) {
              // Only log the error, don't display it to users
              // When there's no stream, pre-recorded content will be shown instead
              console.warn("Stream not available, will use pre-recorded content");
            }
            setIsLive(false);
            onStreamStatusChange?.(false);
          }}
          className="w-full h-full"
        />
        
        {/* Live Badge */}
        {isLive && (
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-xs font-semibold uppercase tracking-wide">
                LIVE
              </span>
            </div>
          </div>
        )}

        {/* Error Message - Hidden when there's no livestream available */}
        {/* Error display removed - when there's no stream, pre-recorded content will show instead */}
      </div>

    </div>
  );
}

