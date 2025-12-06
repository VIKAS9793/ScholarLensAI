import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DisclaimerBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-minimize on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Minimize when scrolling down past 100px
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsMinimized(true);
      } else if (currentScrollY < 50) {
        setIsMinimized(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          height: isMinimized ? 'auto' : 'auto'
        }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-semantic-error-light border-b border-semantic-error sticky top-0 z-50 shadow-sm ${isMinimized ? 'py-1 px-4' : 'p-3 px-4'
          }`}
        role="alert"
        aria-live="polite"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`text-semantic-error flex-shrink-0 ${isMinimized ? 'h-4 w-4' : 'h-5 w-5'}`} aria-hidden="true" />
            {isMinimized ? (
              <button
                onClick={() => setIsMinimized(false)}
                className="text-xs text-semantic-error-dark font-medium hover:underline"
              >
                ⚠️ SCREENING TOOL ONLY - Click to expand
              </button>
            ) : (
              <p className="text-xs sm:text-sm text-semantic-error-dark font-medium">
                <strong>SCREENING TOOL ONLY:</strong> ScholarLens AI does <strong>NOT</strong> diagnose medical conditions.
                Results should always be reviewed by qualified professionals.
              </p>
            )}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-2 p-1 text-semantic-error-dark hover:bg-semantic-error/20 rounded transition-colors"
            aria-label="Dismiss disclaimer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};