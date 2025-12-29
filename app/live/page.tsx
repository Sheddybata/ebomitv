"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MuxLivePlayer from "@/components/MuxLivePlayer";
import AmbientBackground from "@/components/AmbientBackground";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/lib/i18n";
import { Radio, Loader2, AlertCircle, PlayCircle } from "lucide-react";

interface LiveStream {
  id: string;
  streamKey: string;
  status: string;
  playbackIds: Array<{ id: string; policy: string }>;
  activeAssetId?: string;
  createdAt: string;
}

export default function LivePage() {
  const { language, setLanguage } = useLanguage();
  const { t } = useI18n();
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  // Fetch active live streams
  useEffect(() => {
    fetchLiveStreams();
    // Poll for updates every 30 seconds, but only if we don't have persistent errors
    const interval = setInterval(() => {
      // Only poll if we don't have a persistent error
      if (!error || error.includes("credentials")) {
        fetchLiveStreams();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveStreams = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/mux/live/list?limit=10");
      
      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setLiveStreams(data.liveStreams);

        // Find active stream (status === "active") or most recent
        const active = data.liveStreams.find(
          (stream: LiveStream) => stream.status === "active"
        ) || data.liveStreams[0];

        if (active) {
          setActiveStream(active);
        }

        setError(null);
      } else {
        // Only set error if we don't have an existing stream to show
        if (!activeStream) {
          setError(data.error || "Failed to fetch live streams");
        }
        // If we have an active stream, just log the error but don't break the UI
        console.warn("Failed to fetch live streams:", data.error);
      }
    } catch (err: any) {
      // Only set error if we don't have an existing stream
      if (!activeStream) {
        setError(err.message || "Failed to load live streams");
      }
      // Log error but don't break the UI if we have a stream
      console.warn("Error fetching live streams:", err.message);
    } finally {
      setIsLoading(false);
    }
  };


  // Fallback playback ID if API fails (from your existing stream)
  const FALLBACK_PLAYBACK_ID = "JAph4wH6lutzw7cJZbX3r2axeSIrx3OhPsF2RdbR8aI";
  const playbackId = activeStream?.playbackIds?.[0]?.id || FALLBACK_PLAYBACK_ID;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <AmbientBackground />
      <Navbar />

      <div className="relative z-10 pt-20 md:pt-24 lg:pt-28 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Theme and Language Selector */}
          <div className="mb-6 md:mb-8 flex items-center justify-end">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>

          {/* Header */}
          <div className="mb-8 md:mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Radio className="w-6 h-6 text-ministry-gold" />
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Live Sessions
              </h1>
            </div>
            <p className="text-foreground/70 text-base md:text-lg">
              Watch our live broadcasts and join us in real-time
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-ministry-gold animate-spin" />
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Live Stream Player - Show if we have a stream or use fallback */}
          {!isLoading && (activeStream || playbackId) && (
            <div className="max-w-6xl mx-auto">
              {/* Live Status Indicator */}
              <div className="mb-4 text-center">
                {activeStream && activeStream.status === "active" ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="font-semibold">LIVE NOW</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/10 text-foreground rounded-full">
                    <PlayCircle className="w-4 h-4" />
                    <span className="font-semibold">WAITING FOR STREAM</span>
                  </div>
                )}
              </div>

              <MuxLivePlayer
                playbackId={playbackId}
                streamKey={activeStream?.streamKey || ""}
                title="EBOMI TV Live"
                autoPlay={true}
                onStreamStatusChange={(isLiveNow) => {
                  setIsLive(isLiveNow);
                  console.log("Stream is live:", isLiveNow);
                }}
              />
            </div>
          )}

          {/* No Streams Available */}
          {!isLoading && !error && liveStreams.length === 0 && (
            <div className="text-center py-20 glass rounded-2xl border border-foreground/10">
              <Radio className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                No Live Streams Available
              </h3>
              <p className="text-foreground/60 mb-6">
                Check back later for upcoming live sessions or create a new stream in the admin panel.
              </p>
              <a
                href="/admin/live/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-ministry-gold hover:bg-ministry-gold/90 text-ministry-dark font-bold rounded-lg transition-all"
              >
                <Radio className="w-4 h-4" />
                Create Live Stream
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
