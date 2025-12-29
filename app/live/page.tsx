"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MuxLivePlayer from "@/components/MuxLivePlayer";
import AmbientBackground from "@/components/AmbientBackground";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/lib/i18n";
import { Radio, Loader2, AlertCircle, Copy, Check, PlayCircle } from "lucide-react";

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
  const [copied, setCopied] = useState(false);
  const [isLive, setIsLive] = useState(false);

  // Fetch active live streams
  useEffect(() => {
    fetchLiveStreams();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchLiveStreams, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveStreams = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/mux/live/list?limit=10");
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
        setError(data.error || "Failed to fetch live streams");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load live streams");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const playbackId = activeStream?.playbackIds?.[0]?.id || "";

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

          {/* Live Stream Player */}
          {!isLoading && activeStream && (
            <div className="mb-8">
              {/* Live Status Indicator */}
              <div className="mb-4 text-center">
                {activeStream.status === "active" ? (
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
                streamKey={activeStream.streamKey}
                title="EBOMI TV Live"
                autoPlay={false}
                onStreamStatusChange={(isLiveNow) => {
                  setIsLive(isLiveNow);
                  console.log("Stream is live:", isLiveNow);
                }}
              />

              {/* Stream Info */}
              <div className="mt-6 p-4 bg-foreground/5 rounded-lg border border-foreground/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">Stream Status:</span>
                  <span className={`font-semibold capitalize ${
                    activeStream.status === "active"
                      ? "text-green-600"
                      : "text-foreground/80"
                  }`}>
                    {activeStream.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-foreground/60">Stream ID:</span>
                  <span className="text-foreground/80 font-mono">
                    {activeStream.id.slice(0, 12)}...
                  </span>
                </div>
              </div>
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

          {/* OBS Setup Guide - Always visible for active streams */}
          {activeStream && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Stream Details */}
              <div className="glass rounded-xl p-6 border border-foreground/10">
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                  Stream Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activeStream.status === "active"
                            ? "bg-green-500 animate-pulse"
                            : "bg-gray-400"
                        }`}
                      />
                      <span className="text-foreground font-medium capitalize">
                        {activeStream.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Stream ID</p>
                    <code className="text-xs bg-black/20 px-2 py-1 rounded font-mono text-foreground/80">
                      {activeStream.id}
                    </code>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Playback ID</p>
                    <code className="text-xs bg-black/20 px-2 py-1 rounded font-mono text-foreground/80">
                      {playbackId || "Not available"}
                    </code>
                  </div>
                </div>
              </div>

              {/* OBS Setup Guide */}
              <div className="glass rounded-xl p-6 border border-foreground/10">
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                  OBS Studio Setup
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">
                      RTMP Server URL:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-black/20 px-3 py-2 rounded font-mono text-foreground/90 break-all">
                        rtmp://global-live.mux.com:5222/app
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard("rtmp://global-live.mux.com:5222/app")
                        }
                        className="p-2 hover:bg-foreground/10 rounded transition-colors"
                        title="Copy RTMP URL"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-foreground/60" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Stream Key:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-black/20 px-3 py-2 rounded font-mono text-foreground/90 break-all">
                        {activeStream.streamKey}
                      </code>
                      <button
                        onClick={() => copyToClipboard(activeStream.streamKey)}
                        className="p-2 hover:bg-foreground/10 rounded transition-colors"
                        title="Copy Stream Key"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-foreground/60" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-foreground/10">
                    <p className="text-xs text-foreground/60">
                      Use these credentials in OBS Studio → Settings → Stream →
                      Custom service
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
