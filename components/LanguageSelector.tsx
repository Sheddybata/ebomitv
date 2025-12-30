"use client";

import { useState, useEffect } from "react";
import { Globe, ChevronDown, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n";
import * as Flags from "country-flag-icons/react/3x2";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag?: string;
  countryCode?: string;
}

// Map language codes to country codes for flag icons
const LANGUAGE_TO_COUNTRY: Record<LanguageCode, string> = {
  ha: "NG", // Hausa - Nigeria
  ig: "NG", // Igbo - Nigeria
  yo: "NG", // Yoruba - Nigeria
  fr: "FR", // French - France
  ar: "SA", // Arabic - Saudi Arabia
  zh: "CN", // Chinese - China
  es: "ES", // Spanish - Spain
  en: "US", // English - United States
  pt: "PT", // Portuguese - Portugal
  de: "DE", // German - Germany
  hi: "IN", // Hindi - India
};

// Helper function to get flag component
function getFlagComponent(countryCode: string) {
  const FlagComponent = (Flags as any)[countryCode];
  return FlagComponent || null;
}

export const SUPPORTED_LANGUAGES: Language[] = LANGUAGES.map((lang) => ({
  ...lang,
  countryCode: LANGUAGE_TO_COUNTRY[lang.code],
}));

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (languageCode: LanguageCode) => void;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  
  const CurrentFlag = currentLang.countryCode ? getFlagComponent(currentLang.countryCode) : null;

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Theme Toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          data-tour="theme-toggle"
          className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg glass hover:bg-[rgba(var(--foreground),0.1)] transition-all text-foreground/70 hover:text-foreground"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? (
            <>
              <Moon className="w-4 h-4 text-ministry-gold" />
              <span className="text-xs md:text-sm font-medium">Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-[#E31E24]" />
              <span className="text-xs md:text-sm font-medium">Light</span>
            </>
          )}
        </button>
      )}

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-tour="language-selector"
          className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 glass rounded-lg hover:bg-[rgba(var(--foreground),0.1)] transition-colors"
          aria-label="Select language"
        >
          <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-ministry-gold" />
          <span className="text-foreground text-xs md:text-sm font-medium flex items-center gap-2">
            {CurrentFlag ? (
              <CurrentFlag className="w-5 h-4 md:w-6 md:h-4 rounded-sm" title={currentLang.name} />
            ) : currentLang.flag ? (
              <span className="text-lg md:text-xl" role="img" aria-label={currentLang.name}>
                {currentLang.flag}
              </span>
            ) : null}
            {currentLang.nativeName}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 md:w-4 md:h-4 text-foreground/60 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 right-0 glass rounded-lg overflow-hidden z-50 min-w-[220px]"
              >
                {SUPPORTED_LANGUAGES.map((language) => {
                  const FlagComponent = language.countryCode ? getFlagComponent(language.countryCode) : null;
                  return (
                    <button
                      key={language.code}
                      onClick={() => {
                        onLanguageChange(language.code);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-[rgba(var(--foreground),0.1)] transition-colors flex items-center justify-between ${
                        currentLanguage === language.code
                          ? "bg-ministry-gold/20 text-ministry-gold"
                          : "text-foreground"
                      }`}
                      aria-label={`Select ${language.name} language`}
                    >
                      <span className="font-medium flex items-center gap-2">
                        {FlagComponent ? (
                          <FlagComponent className="w-5 h-4 md:w-6 md:h-4 rounded-sm" title={language.name} />
                        ) : language.flag ? (
                          <span className="text-lg md:text-xl" role="img" aria-label={language.name}>
                            {language.flag}
                          </span>
                        ) : null}
                        {language.nativeName}
                      </span>
                      {currentLanguage === language.code && (
                        <div className="w-2 h-2 bg-ministry-gold rounded-full" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
