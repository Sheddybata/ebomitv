"use client";

import { useState } from "react";
import { Heart, Copy, Check as CheckIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface DonationWidgetProps {
  isLive?: boolean;
  forceOpen?: boolean;
  onClose?: () => void;
  showButton?: boolean;
}

export default function DonationWidget({
  isLive = false,
  forceOpen,
  onClose,
  showButton = true
}: DonationWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Use forceOpen prop if provided, otherwise use internal state
  const modalOpen = forceOpen !== undefined ? forceOpen : isOpen;
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  // Sync internal state with forceOpen prop
  const handleOpen = () => {
    if (forceOpen === undefined) {
      setIsOpen(true);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const nairaAccount = {
    name: "El-Buba Outreach Min. Intl (EBOMI)",
    number: "1011143959",
    bank: "Zenith Bank"
  };

  const dollarAccount = {
    name: "El-buba Outreach Min. INtl (EBOMI)",
    number: "5074823438",
    branch: "JOS BRANCH",
    swift: "ZEIBNGLA",
    bank: "ZENITH BANK"
  };

  return (
    <>
      {/* Floating Donate Button - Only show if showButton is true */}
      {showButton && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 bg-ministry-red hover:bg-ministry-red/90 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold text-sm md:text-base"
          onClick={handleOpen}
        >
          <Heart className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
          <span className="hidden sm:inline">{t("donation.giveNow")}</span>
          <span className="sm:hidden">{t("donation.giveShort")}</span>
        </motion.button>
      )}

      {/* Donation Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => !isProcessing && handleClose()}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass rounded-2xl p-4 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto mx-4 bg-background border border-foreground/10 shadow-2xl transition-all duration-500">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-ministry-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-ministry-red" fill="currentColor" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                    Support EBOMI TV
                  </h2>
                  <p className="text-white/70 text-sm md:text-base">
                    Your generous giving helps spread the transformative message of the Cross globally.
                  </p>
                </div>

                {/* Naira Account */}
                <div className="mb-6">
                  <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">₦</span>
                    Naira Account
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-foreground/[0.03] border border-ministry-gold/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white/70">Account Name</span>
                        <button
                          onClick={() => copyToClipboard(nairaAccount.name, "naira-name")}
                          className="text-ministry-gold hover:text-ministry-gold/80 transition-colors"
                        >
                          {copiedField === "naira-name" ? (
                            <CheckIcon className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-white font-mono text-sm">{nairaAccount.name}</p>
                    </div>

                    <div className="bg-foreground/[0.03] border border-ministry-gold/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white/70">Account Number</span>
                        <button
                          onClick={() => copyToClipboard(nairaAccount.number, "naira-number")}
                          className="text-ministry-gold hover:text-ministry-gold/80 transition-colors"
                        >
                          {copiedField === "naira-number" ? (
                            <CheckIcon className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-white font-mono text-lg font-bold">{nairaAccount.number}</p>
                    </div>

                    <div className="bg-foreground/[0.03] border border-ministry-gold/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white/70">Bank</span>
                        <button
                          onClick={() => copyToClipboard(nairaAccount.bank, "naira-bank")}
                          className="text-ministry-gold hover:text-ministry-gold/80 transition-colors"
                        >
                          {copiedField === "naira-bank" ? (
                            <CheckIcon className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-white font-mono text-sm">{nairaAccount.bank}</p>
                    </div>
                  </div>
                </div>

                {/* Dollar Account */}
                <div className="mb-6">
                  <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">$</span>
                    Dollar Account
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-foreground/[0.03] border border-ministry-gold/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white/70">Account Name</span>
                        <button
                          onClick={() => copyToClipboard(dollarAccount.name, "dollar-name")}
                          className="text-ministry-gold hover:text-ministry-gold/80 transition-colors"
                        >
                          {copiedField === "dollar-name" ? (
                            <CheckIcon className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-white font-mono text-sm">{dollarAccount.name}</p>
                    </div>

                    <div className="bg-foreground/[0.03] border border-ministry-gold/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white/70">Account Number</span>
                        <button
                          onClick={() => copyToClipboard(dollarAccount.number, "dollar-number")}
                          className="text-ministry-gold hover:text-ministry-gold/80 transition-colors"
                        >
                          {copiedField === "dollar-number" ? (
                            <CheckIcon className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-white font-mono text-lg font-bold">{dollarAccount.number}</p>
                    </div>

                    <div className="bg-foreground/[0.03] border border-ministry-gold/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white/70">Bank Details</span>
                        <button
                          onClick={() => copyToClipboard(`${dollarAccount.branch} | SWIFT: ${dollarAccount.swift} | BANK: ${dollarAccount.bank}`, "dollar-bank")}
                          className="text-ministry-gold hover:text-ministry-gold/80 transition-colors"
                        >
                          {copiedField === "dollar-bank" ? (
                            <CheckIcon className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-mono text-sm">{dollarAccount.branch}</p>
                        <p className="text-white font-mono text-sm">SWIFT: {dollarAccount.swift}</p>
                        <p className="text-white font-mono text-sm">BANK: {dollarAccount.bank}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-white/50 mb-4">
                    Click the copy icons to easily copy account details to your clipboard
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full bg-ministry-gold hover:bg-ministry-gold/80 text-ministry-dark font-bold py-3 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

