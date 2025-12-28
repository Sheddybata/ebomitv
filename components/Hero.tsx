"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background transition-colors duration-500">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      {/* Primary (Blue) Radial Glow */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: "radial-gradient(circle at center, rgba(2, 1, 180, 0.18) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="font-serif text-6xl md:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 tracking-tighter"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {t("hero.title")}
        </motion.h1>
        <p className="text-foreground/60 text-lg md:text-xl font-light tracking-wide uppercase tracking-[0.2em]">
          {t("hero.subtitle")}
        </p>
      </motion.div>
    </section>
  );
}

