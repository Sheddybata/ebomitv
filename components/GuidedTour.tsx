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
      className="w-[min(92vw,420px)] rounded-2xl border-2 border-white/20 bg-gradient-to-br from-neutral-900/98 via-neutral-800/98 to-neutral-900/98 backdrop-blur-2xl shadow-2xl overflow-hidden"
      style={{
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.2)',
      }}
    >
      {/* Header with gradient accent */}
      <div className="px-5 pt-5 pb-3 border-b border-white/10 bg-gradient-to-r from-ministry-gold/20 via-transparent to-transparent">
        <p className="font-serif text-xl font-bold text-white drop-shadow-lg">
          Welcome to the Army of the Lord
        </p>
        <p className="mt-1.5 text-xs text-white/70 font-medium">Step {index + 1} of 7</p>
      </div>

      <div className="px-5 py-4 bg-gradient-to-b from-transparent to-black/20">
        {step.title ? (
          <p className="text-base font-bold text-white mb-2 drop-shadow-md">{String(step.title)}</p>
        ) : null}
        <div className="mt-2 text-sm text-white/90 leading-relaxed drop-shadow-sm">{step.content as any}</div>
      </div>

      <div className="px-5 pb-5 pt-3 flex items-center justify-between gap-3 bg-black/10 border-t border-white/5">
        <button
          {...skipProps}
          className="text-sm font-semibold text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/40 hover:decoration-white/80"
        >
          I know the way
        </button>

        <button
          {...primaryProps}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-ministry-gold to-ministry-gold/90 text-ministry-dark font-bold text-sm hover:from-ministry-gold/90 hover:to-ministry-gold/80 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          style={{
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
          }}
        >
          {isLastStep ? "Finish Tour" : "Continue →"}
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
        placement: "top", // Changed from "right" to "top" to keep tooltip visible above the button
        title: "Give",
        content: "Support the ministry here—fast and secure giving.",
        disableBeacon: true,
        disableScrolling: false, // Ensure it scrolls into view
        scrollOffset: 20, // Add some offset from top
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
    const { status, action, index, type, step } = data;

    // Special handling for Give button step - ensure tooltip is visible and scrollable
    if (step?.target === "[data-tour='give']" && type === EVENTS.STEP_BEFORE) {
      // When about to show Give button step, scroll it into view
      setTimeout(() => {
        const giveButton = document.querySelector("[data-tour='give']");
        if (giveButton) {
          // Scroll to center the button in viewport, accounting for tooltip above
          giveButton.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
          // Additional scroll adjustment to account for tooltip height
          setTimeout(() => {
            window.scrollBy({ top: -150, behavior: 'smooth' });
          }, 300);
        }
      }, 50);
    }

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
      floaterProps={{
        disableAnimation: false,
        disableFlip: false,
        placement: "top", // Default placement, but individual steps can override
      }}
      scrollOffset={20} // Offset when scrolling to steps
      styles={{
        options: {
          zIndex: 9999,
          arrowColor: "rgb(38, 38, 38)", // Dark background to match tooltip
          backgroundColor: "rgba(0,0,0,0)",
          overlayColor: "rgba(0,0,0,0.75)", // Darker overlay for better contrast
          primaryColor: "#D4AF37",
          textColor: "#ffffff", // White text for better visibility
        },
        spotlight: { 
          borderRadius: 16,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 40px rgba(212, 175, 55, 0.5)", // Enhanced spotlight with gold glow
        },
        tooltip: {
          borderRadius: 16,
        },
        tooltipContainer: {
          textAlign: "left",
        },
      }}
    />
  );
}



