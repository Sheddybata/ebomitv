"use client";

import { useState, useEffect } from "react";
import { Keyboard, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { KEYBOARD_SHORTCUTS_HELP } from "@/hooks/useKeyboardShortcuts";

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsHelp({
  isOpen,
  onClose,
}: KeyboardShortcutsHelpProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-foreground/10">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-foreground/10">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-6 h-6 text-ministry-gold" />
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                  aria-label="Close shortcuts help"
                >
                  <X className="w-5 h-5 text-foreground/70" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {KEYBOARD_SHORTCUTS_HELP.map((shortcut, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-foreground/5 border border-foreground/10 hover:border-ministry-gold/30 transition-colors"
                    >
                      <span className="text-foreground/70 text-sm">
                        {shortcut.description}
                      </span>
                      <kbd className="px-3 py-1.5 bg-foreground/10 border border-foreground/20 rounded-md text-xs font-mono font-semibold text-foreground">
                        {shortcut.key}
                      </kbd>
                    </motion.div>
                  ))}
                </div>

                {/* Footer Note */}
                <div className="mt-6 p-4 bg-ministry-gold/10 rounded-lg border border-ministry-gold/20">
                  <p className="text-sm text-foreground/70">
                    <strong className="text-foreground">Tip:</strong> These shortcuts work
                    when the video player is focused. Press{" "}
                    <kbd className="px-2 py-1 bg-foreground/10 border border-foreground/20 rounded text-xs font-mono">
                      ?
                    </kbd>{" "}
                    anytime to show this help.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
