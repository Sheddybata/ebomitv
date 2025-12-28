"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function PrayerRequestWidget() {
  const handleWhatsAppRedirect = () => {
    const message = "I want to request for Prayers, Please can I share my Prayer request here?";
    const whatsappUrl = `https://wa.me/2348082538837?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Floating Prayer Request Button - Positioned in parent container */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-ministry-gold hover:bg-ministry-gold/80 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold text-sm md:text-base"
        onClick={handleWhatsAppRedirect}
      >
        <Heart className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
        <span className="hidden sm:inline">Prayer Request</span>
        <span className="sm:hidden">Prayer</span>
      </motion.button>

    </>
  );
}

