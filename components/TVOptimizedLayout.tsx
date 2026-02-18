"use client";

import { useEffect, useState, useRef } from "react";
import { getDeviceType, isTVDevice } from "@/lib/tv-detection";

interface TVOptimizedLayoutProps {
  children: React.ReactNode;
}

/**
 * TV-Optimized Layout Component
 * Applies TV-specific optimizations when detected
 */
export default function TVOptimizedLayout({ children }: TVOptimizedLayoutProps) {
  const [isTV, setIsTV] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop' | 'tv'>('desktop');
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    setIsTV(isTVDevice());
    setDeviceType(getDeviceType());
    
    // Add TV-specific class to body
    if (isTVDevice()) {
      document.body.classList.add('tv-device');
      document.documentElement.classList.add('tv-device');
    }

    return () => {
      document.body.classList.remove('tv-device');
      document.documentElement.classList.remove('tv-device');
    };
  }, []);

  // Enhanced keyboard navigation for TV remotes
  useEffect(() => {
    if (!isTV) return;

    // Get all focusable elements
    const updateFocusableElements = () => {
      focusableElementsRef.current = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    };
    
    updateFocusableElements();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      
      // Arrow key navigation for TV remotes
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        e.preventDefault();
        
        updateFocusableElements();
        const focusable = focusableElementsRef.current.filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== "hidden";
        });
        
        if (focusable.length === 0) return;
        
        const currentIndex = focusable.findIndex(el => el === document.activeElement);
        let nextIndex = currentIndex;
        
        if (key === "ArrowRight" || key === "ArrowDown") {
          nextIndex = currentIndex < focusable.length - 1 ? currentIndex + 1 : 0;
        } else if (key === "ArrowLeft" || key === "ArrowUp") {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : focusable.length - 1;
        }
        
        focusable[nextIndex]?.focus();
        return;
      }
      
      // Enter/Space for activation
      if (key === "Enter" || key === " ") {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && (activeElement.tagName === "BUTTON" || activeElement.tagName === "A")) {
          e.preventDefault();
          activeElement.click();
        }
      }
      
      // Escape to close modals/overlays
      if (key === "Escape") {
        const modals = document.querySelectorAll('[role="dialog"], .modal, [data-modal]');
        if (modals.length > 0) {
          const lastModal = modals[modals.length - 1] as HTMLElement;
          const closeButton = lastModal.querySelector('[aria-label*="close" i], [aria-label*="Close" i]') as HTMLElement;
          closeButton?.click();
        }
      }
      
      // Prevent browser shortcuts that interfere
      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        return; // Allow refresh
      }
      
      if (e.ctrlKey || e.metaKey) {
        if (!["k", "f"].includes(e.key.toLowerCase())) {
          e.preventDefault();
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    // Focus management for modals
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const modal = target.closest('[role="dialog"], .modal, [data-modal]');
      
      if (modal) {
        // Trap focus within modal
        const focusableInModal = Array.from(
          modal.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        
        if (focusableInModal.length > 0 && !focusableInModal.includes(target)) {
          focusableInModal[0]?.focus();
        }
      }
    };
    
    document.addEventListener("focusin", handleFocusIn);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [isTV]);

  return (
    <div 
      className={`tv-layout ${isTV ? 'tv-mode' : ''} device-${deviceType}`}
      data-device-type={deviceType}
      data-is-tv={isTV}
    >
      {children}
    </div>
  );
}
