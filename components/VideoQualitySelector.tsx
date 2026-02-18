"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, Check, Monitor, Smartphone, Tablet, Tv } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getDeviceType } from "@/lib/tv-detection";

export interface VideoQuality {
  label: string;
  value: string;
  resolution?: string;
  bitrate?: string;
}

interface VideoQualitySelectorProps {
  qualities: VideoQuality[];
  currentQuality: string;
  onQualityChange: (quality: string) => void;
  autoQuality?: boolean;
  onAutoQualityChange?: (enabled: boolean) => void;
}

const QUALITY_ICONS = {
  auto: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  tv: Tv,
};

export default function VideoQualitySelector({
  qualities,
  currentQuality,
  onQualityChange,
  autoQuality = true,
  onAutoQualityChange,
}: VideoQualitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const deviceType = getDeviceType();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const getCurrentQualityLabel = () => {
    if (autoQuality && currentQuality === "auto") {
      return "Auto";
    }
    const quality = qualities.find((q) => q.value === currentQuality);
    return quality?.label || currentQuality;
  };

  const handleQualitySelect = (quality: string) => {
    onQualityChange(quality);
    setIsOpen(false);
  };

  const handleAutoToggle = () => {
    if (onAutoQualityChange) {
      onAutoQualityChange(!autoQuality);
      if (!autoQuality) {
        handleQualitySelect("auto");
      }
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors backdrop-blur-sm"
        aria-label="Video quality settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Settings className="w-4 h-4" />
        <span className="text-sm font-medium">{getCurrentQualityLabel()}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 mb-2 w-56 bg-black/95 backdrop-blur-md rounded-lg shadow-xl border border-white/10 overflow-hidden z-50"
            >
              {/* Auto Quality Toggle */}
              {onAutoQualityChange && (
                <div className="px-4 py-3 border-b border-white/10">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={autoQuality}
                      onChange={handleAutoToggle}
                      className="w-4 h-4 rounded border-white/30 bg-white/10 checked:bg-ministry-gold checked:border-ministry-gold focus:ring-2 focus:ring-ministry-gold/50 transition-colors"
                    />
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">Auto</div>
                      <div className="text-white/60 text-xs">
                        Adjust quality based on connection
                      </div>
                    </div>
                    <Monitor className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                  </label>
                </div>
              )}

              {/* Quality Options */}
              <div className="py-2" role="listbox" aria-label="Video quality options">
                {qualities.map((quality) => {
                  const isSelected = currentQuality === quality.value;
                  const Icon = QUALITY_ICONS[quality.value as keyof typeof QUALITY_ICONS] || Monitor;

                  return (
                    <button
                      key={quality.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleQualitySelect(quality.value)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Icon className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                        <div className="text-left flex-1">
                          <div className="text-white text-sm font-medium">
                            {quality.label}
                          </div>
                          {quality.resolution && (
                            <div className="text-white/50 text-xs">
                              {quality.resolution}
                              {quality.bitrate && ` • ${quality.bitrate}`}
                            </div>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-ministry-gold" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Device Info */}
              <div className="px-4 py-2 border-t border-white/10">
                <div className="text-white/50 text-xs">
                  Device: <span className="text-white/70 capitalize">{deviceType}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
