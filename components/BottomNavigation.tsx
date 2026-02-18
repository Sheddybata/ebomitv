"use client";

import { useState, useEffect } from "react";
import { Home, Video, Radio, Search, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import SearchOverlay from "./SearchOverlay";
import { useSwipeGestures } from "@/hooks/useSwipeGestures";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

export default function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { lightTap } = useHapticFeedback();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  const navItems = [
    { icon: Home, label: t("nav.home"), href: "/", id: "home", action: null },
    { icon: Video, label: t("nav.gallery"), href: "/#gallery", id: "gallery", action: null },
    { icon: Radio, label: "Live", href: "/live", id: "live", action: null },
    { icon: Search, label: "Search", href: "#", id: "search", action: () => setSearchOpen(true) },
    { icon: MoreHorizontal, label: "More", href: "/#about", id: "more", action: null },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.replace("#", ""));
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-foreground/10 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const baseClassName =
            "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]";
          const content = (
            <>
              <motion.div
                animate={{ scale: active ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
                className={`p-2 rounded-lg transition-colors ${
                  active
                    ? "bg-ministry-gold/20 text-ministry-gold"
                    : "text-foreground/60"
                }`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? "text-ministry-gold" : "text-foreground/60"
                }`}
              >
                {item.label}
              </span>
            </>
          );

          if (item.action) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => {
                  lightTap();
                  e.preventDefault();
                  item.action?.();
                }}
                className={baseClassName}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => lightTap()}
              className={baseClassName}
            >
              {content}
            </Link>
          );
        })}
      </div>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </nav>
  );
}
