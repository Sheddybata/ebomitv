"use client";

import { useState } from "react";
import { Loader2, Copy, Check, Radio, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateLiveStreamPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [streamData, setStreamData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();

  const createStream = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const response = await fetch("/api/mux/live/test-create");
      const data = await response.json();

      if (data.success) {
        setStreamData(data.liveStream);
      } else {
        setError(data.error || "Failed to create stream");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create stream");
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            Create Live Stream
          </h1>
          <p className="text-foreground/70">
            Generate a new live stream for OBS Studio
          </p>
        </div>

        {!streamData && (
          <div className="glass rounded-xl p-8 border border-foreground/10">
            <button
              onClick={createStream}
              disabled={isCreating}
              className="w-full md:w-auto px-8 py-4 bg-ministry-gold hover:bg-ministry-gold/90 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Stream...
                </>
              ) : (
                <>
                  <Radio className="w-5 h-5" />
                  Create New Live Stream
                </>
              )}
            </button>

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-red-500 font-semibold">Error</p>
                  <p className="text-red-500/80 text-sm">{error}</p>
                </div>
              </div>
            )}

            {error && error.includes("credentials") && (
              <div className="mt-4 p-4 bg-foreground/5 rounded-lg">
                <p className="text-sm text-foreground/80 mb-2">
                  <strong>Setup Required:</strong> Add your Mux credentials to
                  `.env.local`:
                </p>
                <code className="text-xs bg-black/20 px-2 py-1 rounded block">
                  MUX_TOKEN_ID=your_token_id
                  <br />
                  MUX_TOKEN_SECRET=your_token_secret
                </code>
              </div>
            )}
          </div>
        )}

        {streamData && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="glass rounded-xl p-6 border border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Stream Created Successfully!
                </h2>
              </div>
              <p className="text-foreground/70">
                Use these credentials in OBS Studio
              </p>
            </div>

            {/* OBS Settings */}
            <div className="glass rounded-xl p-6 border border-foreground/10">
              <h3 className="font-serif text-xl font-bold text-foreground mb-6">
                OBS Studio Settings
              </h3>

              <div className="space-y-4">
                {/* Server URL */}
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Server (RTMP URL):
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-3 bg-black/20 rounded-lg font-mono text-sm text-foreground/90 break-all">
                      {streamData.rtmpUrl}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(streamData.rtmpUrl, "server")
                      }
                      className="p-3 hover:bg-foreground/10 rounded-lg transition-colors"
                      title="Copy Server URL"
                    >
                      {copied === "server" ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-foreground/60" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Stream Key */}
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Stream Key:
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-3 bg-black/20 rounded-lg font-mono text-sm text-foreground/90 break-all">
                      {streamData.streamKey}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(streamData.streamKey, "key")
                      }
                      className="p-3 hover:bg-foreground/10 rounded-lg transition-colors"
                      title="Copy Stream Key"
                    >
                      {copied === "key" ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-foreground/60" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="glass rounded-xl p-6 border border-foreground/10">
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                Step-by-Step Instructions
              </h3>
              <ol className="space-y-3 text-foreground/80">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ministry-gold text-white flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>Open OBS Studio</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ministry-gold text-white flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>
                    Go to <strong>Settings</strong> → <strong>Stream</strong>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ministry-gold text-white flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>
                    Set <strong>Service</strong> to <strong>&quot;Custom&quot;</strong>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ministry-gold text-white flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span>
                    Paste the <strong>Server URL</strong> above into{" "}
                    <strong>Server</strong> field
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ministry-gold text-white flex items-center justify-center text-sm font-bold">
                    5
                  </span>
                  <span>
                    Paste the <strong>Stream Key</strong> above into{" "}
                    <strong>Stream Key</strong> field
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ministry-gold text-white flex items-center justify-center text-sm font-bold">
                    6
                  </span>
                  <span>Click <strong>OK</strong> to save</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ministry-gold text-white flex items-center justify-center text-sm font-bold">
                    7
                  </span>
                  <span>
                    Click <strong>&quot;Start Streaming&quot;</strong> in OBS
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ministry-gold text-white flex items-center justify-center text-sm font-bold">
                    8
                  </span>
                  <span>
                    Your stream will appear on{" "}
                    <a
                      href="/live"
                      className="text-ministry-gold hover:underline"
                    >
                      /live
                    </a>{" "}
                    page
                  </span>
                </li>
              </ol>
            </div>

            {/* Stream Info */}
            <div className="glass rounded-xl p-6 border border-foreground/10">
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                Stream Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Stream ID:</span>
                  <code className="text-foreground/80 font-mono">
                    {streamData.id}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Status:</span>
                  <span className="text-foreground/80 capitalize">
                    {streamData.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Playback ID:</span>
                  <code className="text-foreground/80 font-mono">
                    {streamData.playbackId}
                  </code>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/live")}
                className="px-6 py-3 bg-ministry-gold hover:bg-ministry-gold/90 text-white font-semibold rounded-lg transition-all"
              >
                View Live Page
              </button>
              <button
                onClick={() => {
                  setStreamData(null);
                  setError(null);
                }}
                className="px-6 py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground font-semibold rounded-lg transition-all"
              >
                Create Another Stream
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

