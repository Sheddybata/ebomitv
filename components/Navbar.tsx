"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useI18n();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass px-4 md:px-6 py-3 md:py-4 transition-all duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative h-10 w-28 md:h-12 md:w-40 group-hover:scale-[1.02] transition-transform">
            <Image
              src="/logo/ebomilogo.png"
              alt="Ebomi TV Logo"
              fill
              sizes="(max-width: 768px) 112px, 160px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-foreground/70 hover:text-ministry-gold transition-colors text-sm font-medium tracking-wide"
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/gallery"
              className="text-foreground/70 hover:text-ministry-gold transition-colors text-sm font-medium tracking-wide relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-ministry-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              {t("nav.gallery")}
            </Link>
            <Link
              href="/about"
              className="text-foreground/70 hover:text-ministry-gold transition-colors text-sm font-medium tracking-wide relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-ministry-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              {t("nav.about")}
            </Link>
          </div>
          <div className="hidden md:block">
            {/* Added a placeholder selector here if needed, or we can move the main one to navbar */}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-foreground p-2 hover:bg-[rgba(var(--foreground),0.12)] rounded-lg transition-colors"
          aria-label="Menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="pt-4 pb-2 space-y-2 border-t border-[rgba(var(--foreground),0.12)]">
              <Link
                href="/"
                className="block px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-[rgba(var(--foreground),0.12)] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/gallery"
                className="block px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-[rgba(var(--foreground),0.12)] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.gallery")}
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-[rgba(var(--foreground),0.12)] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.about")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}


