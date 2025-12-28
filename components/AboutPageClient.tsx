"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Hand } from "lucide-react";
import Navbar from "@/components/Navbar";
import AmbientBackground from "@/components/AmbientBackground";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/lib/i18n";

export default function AboutPageClient() {
  const { language, setLanguage } = useLanguage();
  const { t } = useI18n();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <AmbientBackground />
      <Navbar />

      <div className="relative z-10 pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Language Selector and Theme Toggle - Positioned lower to avoid navbar conflict */}
          <div className="flex justify-end mb-8 md:mb-12 mt-4">
            <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
          </div>
          {/* Blue animated accents (subtle, non-distracting) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full blur-[110px]"
              style={{ background: "rgba(2, 1, 180, 0.22)" }}
              animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-28 -right-28 h-[560px] w-[560px] rounded-full blur-[130px]"
              style={{ background: "rgba(145, 26, 41, 0.14)" }}
              animate={{ x: [0, -70, 0], y: [0, -55, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Hero */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center rounded-full border border-ministry-gold/35 bg-[rgba(var(--background),0.55)] px-4 py-2 backdrop-blur-sm shadow-sm shadow-ministry-gold/10">
                <span className="text-xs font-semibold tracking-[0.18em] uppercase text-ministry-gold">
                  {t("about.badge")}
                </span>
              </div>

              <h1 className="mt-5 font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {t("about.headingLine1")}
                <span className="block text-gradient-gold">
                  {t("about.headingHighlight")}
                </span>
              </h1>

              <p className="mt-5 text-foreground/75 text-base md:text-lg leading-relaxed max-w-2xl">
                {t("about.description")}
              </p>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.div
                  className="glass rounded-2xl p-5 border border-[rgba(var(--foreground),0.12)]"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1, type: "spring", stiffness: 240, damping: 18 }}
                  whileHover={{ y: -3 }}
                >
                  <p className="text-sm font-semibold text-foreground">{t("about.card.mandate.title")}</p>
                  <p className="mt-1 text-foreground/70 text-sm leading-relaxed">
                    {t("about.card.mandate.body")}
                  </p>
                </motion.div>
                <motion.div
                  className="glass rounded-2xl p-5 border border-[rgba(var(--foreground),0.12)]"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2, type: "spring", stiffness: 240, damping: 18 }}
                  whileHover={{ y: -3 }}
                >
                  <p className="text-sm font-semibold text-foreground">{t("about.card.message.title")}</p>
                  <p className="mt-1 text-foreground/70 text-sm leading-relaxed">
                    {t("about.card.message.body")}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <div className="relative">
                {/* Glow */}
                <motion.div
                  aria-hidden
                  className="absolute -inset-6 rounded-[2rem] blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(2, 1, 180, 0.35), transparent 55%), radial-gradient(circle at 70% 80%, rgba(145, 26, 41, 0.18), transparent 60%)",
                  }}
                  animate={{ opacity: [0.55, 0.85, 0.55] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Image (bold, borderless) */}
                <motion.div
                  className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-ministry-gold/10"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                >
                  <motion.div
                    className="relative aspect-[4/3]"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Image
                      src="/aboutebomitv/image.jpg"
                      alt={t("about.imageAlt")}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </motion.div>

                  <motion.div
                    className="absolute bottom-6 left-6 right-6"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="rounded-2xl bg-black/45 backdrop-blur-md px-5 py-4">
                      <p className="text-white text-sm md:text-base leading-relaxed">
                        {t("about.imageCaption")}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* Statement */}
          <motion.section
            className="mt-14 md:mt-20"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="rounded-2xl bg-[rgba(var(--background),0.65)] backdrop-blur-sm p-6 md:p-10">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                {t("about.statementTitle")}
              </h2>
              <p className="mt-3 text-foreground/75 text-base md:text-lg leading-relaxed max-w-4xl">
                {t("about.statementBody")}
              </p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: t("about.pillar1.title"),
                    body: t("about.pillar1.body"),
                  },
                  {
                    title: t("about.pillar2.title"),
                    body: t("about.pillar2.body"),
                  },
                  {
                    title: t("about.pillar3.title"),
                    body: t("about.pillar3.body"),
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="rounded-2xl border border-[rgba(var(--foreground),0.12)] bg-background p-5 md:p-6"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1, type: "spring", stiffness: 240, damping: 18 }}
                    whileHover={{ y: -3 }}
                  >
                    <p className="text-foreground font-semibold">{item.title}</p>
                    <p className="mt-2 text-foreground/70 text-sm leading-relaxed">
                      {item.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Get involved / CTA (above footer) */}
          <motion.section
            className="mt-12 md:mt-16"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-end justify-between gap-6 mb-6">
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] uppercase text-ministry-gold">
                  {t("about.cta.kicker")}
                </p>
                <h2 className="mt-2 font-serif text-2xl md:text-3xl font-bold text-foreground">
                  {t("about.cta.title")}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <motion.a
                href="https://wa.me/2349034493360?text=I%20would%20like%20to%20advertise%20with%20you%20tell%20me%20more"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-border-gradient rounded-2xl border border-[rgba(var(--foreground),0.12)] bg-[rgba(var(--background),0.65)] p-7 md:p-8 block cursor-pointer group"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Hand className="h-5 w-5 text-ministry-gold group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold tracking-[0.18em] uppercase text-ministry-gold">
                    {t("about.cta.advertise.kicker")}
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                  {t("about.cta.advertise.title")}
                </h3>
                <p className="mt-3 text-foreground/70 leading-relaxed">
                  {t("about.cta.advertise.body")}
                </p>
              </motion.a>

              <motion.a
                href="https://wa.me/2349034493360?text=I%20would%20like%20to%20Intern%2FVolunteer%20with%20you%20tell%20about%20the%20requirements%20and%20eligibility%20criteria"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-border-gradient rounded-2xl border border-[rgba(var(--foreground),0.12)] bg-[rgba(var(--background),0.65)] p-7 md:p-8 block cursor-pointer group"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Hand className="h-5 w-5 text-ministry-gold group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold tracking-[0.18em] uppercase text-ministry-gold">
                    {t("about.cta.volunteer.kicker")}
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                  {t("about.cta.volunteer.title")}
                </h3>
                <p className="mt-3 text-foreground/70 leading-relaxed">
                  {t("about.cta.volunteer.body")}
                </p>
              </motion.a>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}


