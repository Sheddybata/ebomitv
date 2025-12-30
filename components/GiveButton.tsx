"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import DonationWidget from "./DonationWidget";

export default function GiveButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        data-tour="give"
        className="bg-ministry-red hover:bg-ministry-red/90 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold text-sm md:text-base"
        onClick={() => setIsOpen(true)}
      >
        <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
        <span className="hidden sm:inline">Give</span>
        <span className="sm:hidden">Give</span>
      </motion.button>
      
      {/* Render DonationWidget modal without button */}
      <DonationWidget 
        isLive={true} 
        forceOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        showButton={false}
      />
    </>
  );
}








