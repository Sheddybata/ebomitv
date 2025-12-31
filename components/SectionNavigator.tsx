"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SectionNavigator() {
  const [currentSection, setCurrentSection] = useState(0);
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(false);

  const sections = [
    { id: "top", name: "Top" },
    { id: "gallery", name: "Gallery" },
    { id: "about", name: "About" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Determine which section we're in
      const galleryElement = document.getElementById("gallery");
      const aboutElement = document.getElementById("about");

      let sectionIndex = 0;
      if (aboutElement && scrollPosition >= aboutElement.offsetTop - windowHeight / 2) {
        sectionIndex = 2; // About section
      } else if (galleryElement && scrollPosition >= galleryElement.offsetTop - windowHeight / 2) {
        sectionIndex = 1; // Gallery section
      } else {
        sectionIndex = 0; // Top section
      }

      setCurrentSection(sectionIndex);
      setShowUp(sectionIndex > 0);
      setShowDown(sectionIndex < sections.length - 1);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (direction: "up" | "down") => {
    let targetIndex = currentSection;
    
    if (direction === "down" && currentSection < sections.length - 1) {
      targetIndex = currentSection + 1;
    } else if (direction === "up" && currentSection > 0) {
      targetIndex = currentSection - 1;
    }

    const targetId = sections[targetIndex].id;
    const element = targetId === "top" 
      ? document.documentElement 
      : document.getElementById(targetId);

    if (element) {
      const offset = 100; // Account for fixed navbar
      let scrollPosition: number;

      if (targetId === "top") {
        scrollPosition = 0;
      } else {
        const elementPosition = element.getBoundingClientRect().top;
        scrollPosition = elementPosition + window.pageYOffset - offset;
      }

      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="fixed right-6 bottom-24 z-40 flex flex-col gap-3">
      <AnimatePresence>
        {showUp && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => scrollToSection("up")}
            className="p-3 rounded-full bg-ministry-gold/90 hover:bg-ministry-gold text-white shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border-2 border-ministry-gold/50 hover:scale-110 active:scale-95"
            aria-label="Scroll up"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDown && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            onClick={() => scrollToSection("down")}
            className="p-3 rounded-full bg-ministry-gold/90 hover:bg-ministry-gold text-white shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border-2 border-ministry-gold/50 hover:scale-110 active:scale-95"
            aria-label="Scroll down"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

