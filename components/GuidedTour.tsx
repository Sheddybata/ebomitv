"use client";

import { useEffect, useMemo, useState } from "react";
import Joyride, {
  ACTIONS,
  EVENTS,
  STATUS,
  type CallBackProps,
  type Step,
  type TooltipRenderProps,
} from "react-joyride";

const TOUR_SEEN_KEY = "ebomi_tour_seen_v1";

function TourTooltip(props: TooltipRenderProps) {
  const { tooltipProps, step, primaryProps, skipProps, isLastStep, index } = props;

  return (
    <div
      {...tooltipProps}
      className="w-[min(92vw,420px)] rounded-2xl border border-foreground/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      <div className="px-5 pt-5 pb-3 border-b border-foreground/10">
        <p className="font-serif text-lg font-bold text-foreground">
          Welcome to the Army of the Lord.
        </p>
        <p className="mt-1 text-xs text-foreground/60">Step {index + 1}</p>
      </div>

      <div className="px-5 py-4">
        {step.title ? (
          <p className="text-sm font-semibold text-foreground">{String(step.title)}</p>
        ) : null}
        <div className="mt-2 text-sm text-foreground/70">{step.content as any}</div>
      </div>

      <div className="px-5 pb-5 flex items-center justify-between gap-3">
        <button
          {...skipProps}
          className="text-sm font-semibold text-foreground/70 hover:text-foreground underline underline-offset-4"
        >
          I know the way.
        </button>

        <button
          {...primaryProps}
          className="px-4 py-2 rounded-lg bg-ministry-gold text-ministry-dark font-bold text-sm hover:bg-ministry-gold/90 transition-colors"
        >
          {isLastStep ? "Finish" : "Show me around."}
        </button>
      </div>
    </div>
  );
}

export default function GuidedTour() {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps: Step[] = useMemo(
    () => [
      {
        target: "body",
        placement: "center",
        title: "Quick tour",
        content: "Here’s where to find Live services, Gallery, Prayer Request, Give, Theme, and Language.",
        disableBeacon: true,
      },
      {
        target: "[data-tour='nav-live']",
        placement: "bottom",
        title: "Live services",
        content: "Tap here any time to jump into Live Sessions.",
        disableBeacon: true,
      },
      {
        target: "[data-tour='nav-gallery']",
        placement: "bottom",
        title: "Gallery",
        content: "Browse photos and media in the Gallery.",
        disableBeacon: true,
      },
      {
        target: "[data-tour='prayer-request']",
        placement: "right",
        title: "Prayer Request",
        content: "Need prayer? Use this button to send your request.",
        disableBeacon: true,
      },
      {
        target: "[data-tour='give']",
        placement: "right",
        title: "Give",
        content: "Support the ministry here—fast and secure giving.",
        disableBeacon: true,
      },
      {
        target: "[data-tour='theme-toggle']",
        placement: "bottom",
        title: "Theme",
        content: "Switch between Dark and Light mode here.",
        disableBeacon: true,
      },
      {
        target: "[data-tour='language-selector']",
        placement: "bottom",
        title: "Language",
        content: "Choose your preferred language here.",
        disableBeacon: true,
      },
    ],
    []
  );

  useEffect(() => {
    // First-time only (per browser)
    try {
      const seen = window.localStorage.getItem(TOUR_SEEN_KEY);
      if (!seen) setRun(true);
    } catch {
      // If storage is blocked, just don't auto-run
    }
  }, []);

  const handleCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data;

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + 1);
    }

    if (
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ||
      action === ACTIONS.CLOSE
    ) {
      try {
        window.localStorage.setItem(TOUR_SEEN_KEY, "1");
      } catch {
        // ignore
      }
      setRun(false);
      setStepIndex(0);
    }
  };

  if (!run) return null;

  return (
    <Joyride
      callback={handleCallback}
      continuous
      run={run}
      stepIndex={stepIndex}
      steps={steps}
      showSkipButton
      scrollToFirstStep
      disableOverlayClose
      hideBackButton
      tooltipComponent={TourTooltip}
      styles={{
        options: {
          zIndex: 9999,
          arrowColor: "rgba(0,0,0,0)",
          backgroundColor: "rgba(0,0,0,0)",
          overlayColor: "rgba(0,0,0,0.55)",
          primaryColor: "#D4AF37",
          textColor: "#111827",
        },
        spotlight: { borderRadius: 16 },
      }}
    />
  );
}


