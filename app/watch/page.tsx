"use client";

import { useState } from "react";
import LiveStream from "@/components/LiveStream";
import StreamSchedule from "@/components/StreamSchedule";
import LiveChat from "@/components/LiveChat";
import DonationWidget from "@/components/DonationWidget";
import PrayerRequestWidget from "@/components/PrayerRequestWidget";
import LanguageSelector from "@/components/LanguageSelector";
import AmbientBackground from "@/components/AmbientBackground";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/lib/i18n";

export default function WatchPage() {
  const { language, setLanguage } = useLanguage();
  const { t } = useI18n();
  const [isLive, setIsLive] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-ministry-dark">
      <AmbientBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {/* Header with Language Selector */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              {t("watch.title")}
            </h1>
            <p className="text-white/70 text-lg">
              {t("watch.subtitle")}
            </p>
          </div>
          <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stream Player - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 relative">
            <LiveStream 
              onStreamStatusChange={(status) => setIsLive(status.isLive)} 
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Schedule */}
            <StreamSchedule />
            
            {/* Live Chat (only visible when live) */}
            <div className="hidden md:block">
              <LiveChat />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Widgets */}
      <DonationWidget isLive={isLive} />
      <PrayerRequestWidget />
    </main>
  );
}

