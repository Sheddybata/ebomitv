import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FALLBACK_LANGUAGE,
  LANGUAGES,
  type LanguageCode,
  type TranslationKey,
  translations,
} from "./messages";

function formatTemplate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : ""
  );
}

export function useI18n() {
  const { language } = useLanguage();

  const dictionary = translations[language as LanguageCode] ?? translations[FALLBACK_LANGUAGE];

  const t = useMemo(
    () =>
      (key: TranslationKey, vars?: Record<string, string | number>) => {
        const template =
          dictionary[key] ??
          translations[FALLBACK_LANGUAGE][key] ??
          // fallback to key when missing
          key;
        return formatTemplate(template, vars);
      },
    [dictionary]
  );

  const dir = language === "ar" ? "rtl" : "ltr";

  return { t, dir, language };
}

export { LANGUAGES };
export type { LanguageCode, TranslationKey };

