"use client";

import { Calendar, Clock } from "lucide-react";
import { LIVE_SCHEDULE } from "@/lib/stream-config";
import { format, isToday, isTomorrow } from "date-fns";
import { useI18n } from "@/lib/i18n";

export default function StreamSchedule() {
  const { t, language } = useI18n();
  const pick = (base?: string, localized?: Record<string, string>) =>
    (localized && localized[language]) || base || "";
  const upcomingEvents = LIVE_SCHEDULE.filter(
    (event) => event.scheduledTime > new Date()
  ).slice(0, 3);

  if (upcomingEvents.length === 0) {
    return (
      <div className="glass rounded-lg p-6">
        <h3 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-ministry-gold" />
          {t("schedule.schedule")}
        </h3>
        <p className="text-foreground/70 text-sm">{t("schedule.noEvents")}</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    if (isToday(date)) return t("schedule.today");
    if (isTomorrow(date)) return t("schedule.tomorrow");
    return format(date, "MMM d, yyyy");
  };

  return (
    <div className="glass rounded-lg p-4 md:p-6" data-schedule>
      <h3 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-ministry-gold" />
        {t("schedule.upcoming")}
      </h3>
      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="border-l-2 border-ministry-gold/50 pl-4 py-2"
          >
            <h4 className="font-semibold text-foreground mb-1">
              {pick(event.title, event.titleLocalized)}
            </h4>
            <div className="flex items-center gap-2 text-sm text-ministry-gold/80">
              <Clock className="w-4 h-4" />
              <span>{formatDate(event.scheduledTime)}</span>
              <span>•</span>
              <span>{format(event.scheduledTime, "h:mm a")}</span>
            </div>
            {event.description && (
              <p className="text-xs text-foreground/60 mt-1">
                {pick(event.description, event.descriptionLocalized)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

