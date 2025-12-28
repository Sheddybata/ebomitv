"use client";

import { motion } from "framer-motion";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none dark:bg-ministry-dark bg-ministry-light transition-colors duration-500">
      {/* Red Circle */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-ministry-red/20 dark:bg-ministry-red/10 blur-[120px]"
        animate={{
          x: [0, 100, 0],
          y: [0, 150, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          top: "10%",
          left: "10%",
        }}
      />

      {/* Gold Circle */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-ministry-gold/20 dark:bg-ministry-gold/10 blur-[100px]"
        animate={{
          x: [0, -120, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          bottom: "15%",
          right: "15%",
        }}
      />

      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}


