"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import LiveStream from "@/components/LiveStream";
import TVGuide from "@/components/TVGuide";
import LiveChat from "@/components/LiveChat";
import DonationWidget from "@/components/DonationWidget";
import PrayerRequestWidget from "@/components/PrayerRequestWidget";
import GiveButton from "@/components/GiveButton";
import LanguageSelector from "@/components/LanguageSelector";
import AmbientBackground from "@/components/AmbientBackground";
import GuidedTour from "@/components/GuidedTour";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { Radio } from "lucide-react";

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const { t } = useI18n();
  const [isLive, setIsLive] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <AmbientBackground />
      <Navbar />
      <GuidedTour />
      
      <div className="relative z-10 pt-20 md:pt-24 lg:pt-28 pb-6 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Theme and Language Selector - Top */}
          <div className="mb-4 md:mb-6 flex items-center justify-end">
            <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
          </div>

          {/* Header Text - Below Theme/Language */}
          <div className="mb-4 md:mb-6">
              <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2 text-foreground">
                {t("home.title")}
              </h1>
              <p className="text-foreground/70 text-sm md:text-lg">
                {t("home.subtitle")}
              </p>
              <div className="mt-3">
                <Link
                  href="/live"
                  className="inline-flex items-center gap-2 bg-ministry-red hover:bg-ministry-red/90 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-full shadow-lg font-bold text-sm md:text-base transition-colors"
                >
                  <Radio className="w-4 h-4 md:w-5 md:h-5" />
                  Click here to watch live
                </Link>
              </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4 md:space-y-6">
            {/* Stream Player - Full width */}
            <div className="relative">
              <LiveStream
                onStreamStatusChange={(status) => setIsLive(status.isLive)}
                skipIntro={false}
              />
            </div>

            {/* Program Guide - Below video player */}
            <TVGuide />
            
            {/* Sidebar with Chat - Hidden on mobile unless toggled, always visible on desktop */}
            <div className="hidden md:block">
              <LiveChat />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Widgets - Mobile Optimized */}
      <div className="fixed bottom-6 left-4 md:left-6 z-40 flex flex-col gap-2">
        <PrayerRequestWidget />
        <GiveButton />
      </div>
      
      {/* Donation Widget (for live streams, shown on right) */}
      {isLive && <DonationWidget isLive={isLive} />}
    </main>
  );
}


