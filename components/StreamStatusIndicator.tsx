"use client";

import { useEffect, useState } from "react";
import { Radio, Clock } from "lucide-react";
import { StreamStatus } from "@/lib/types";
import { motion } from "framer-motion";

interface StreamStatusIndicatorProps {
  status: StreamStatus;
}

export default function StreamStatusIndicator({
  status,
}: StreamStatusIndicatorProps) {
  const [timeUntilLive, setTimeUntilLive] = useState<string>("");

  useEffect(() => {
    if (!status.nextLiveTime) {
      setTimeUntilLive("");
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const liveTime = new Date(status.nextLiveTime!).getTime();
      const diff = liveTime - now;

      if (diff <= 0) {
        setTimeUntilLive("");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeUntilLive(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeUntilLive(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeUntilLive(`${minutes}m ${seconds}s`);
      } else {
        setTimeUntilLive(`${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [status.nextLiveTime]);

  if (status.isLive) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-ministry-red rounded-full border-2 border-white/30 backdrop-blur-sm"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 bg-white rounded-full"
        />
        <Radio className="w-4 h-4 text-white" />
        <span className="text-white font-bold text-sm">LIVE</span>
      </motion.div>
    );
  }

  if (status.nextLiveTime && timeUntilLive) {
    return (
      <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-ministry-gold/20 backdrop-blur-sm rounded-full border border-ministry-gold/50">
        <Clock className="w-4 h-4 text-ministry-gold" />
        <div className="text-ministry-gold">
          <p className="text-xs font-medium">Next Live:</p>
          <p className="text-sm font-bold">{timeUntilLive}</p>
        </div>
      </div>
    );
  }

  return null;
}








