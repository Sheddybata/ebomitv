"use client";

import { useEffect, useState } from "react";
import { CaptionTrack } from "@/lib/types";

interface CaptionOverlayProps {
  captions?: CaptionTrack[];
  currentLanguage: string;
  isPlaying: boolean;
}

export default function CaptionOverlay({
  captions,
  currentLanguage,
  isPlaying,
}: CaptionOverlayProps) {
  const [currentCaption, setCurrentCaption] = useState<string>("");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!captions || captions.length === 0 || !isPlaying) {
      setCurrentCaption("");
      return;
    }

    const activeTrack = captions.find((track) => track.languageCode === currentLanguage);
    if (!activeTrack) {
      setCurrentCaption("");
      return;
    }

    // In production, you would:
    // 1. Fetch the VTT/SRT file from activeTrack.url
    // 2. Parse the caption file
    // 3. Sync captions with video playback time
    // 4. Update currentCaption based on current time

    // For now, this is a placeholder that would need integration with video player
    // Example implementation:
    // fetch(activeTrack.url)
    //   .then(res => res.text())
    //   .then(vtt => parseVTT(vtt))
    //   .then(parsed => {
    //     // Listen to video time updates and show matching captions
    //   });

    // Mock caption for demonstration
    if (isPlaying) {
      setCurrentCaption("Sample caption text - Replace with actual caption parsing");
    }
  }, [captions, currentLanguage, isPlaying]);

  if (!isVisible || !currentCaption) return null;

  return (
    <div className="absolute bottom-20 left-0 right-0 z-30 px-4">
      <div className="max-w-4xl mx-auto">
        <div
          className="bg-black/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-center text-lg font-medium"
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          {currentCaption}
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="mt-2 text-white/60 hover:text-white text-sm mx-auto block"
      >
        Hide Captions
      </button>
    </div>
  );
}












