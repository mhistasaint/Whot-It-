import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw } from 'lucide-react';

interface LandscapePromptProps {
  forceEnabled?: boolean;
}

export const LandscapePrompt: React.FC<LandscapePromptProps> = ({ forceEnabled = true }) => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if mobile/tablet screen and in portrait mode
      const isMobileSize = window.innerWidth <= 896;
      const isPortraitMode = window.innerHeight > window.innerWidth;
      setIsPortrait(isMobileSize && isPortraitMode);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!forceEnabled || !isPortrait || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[var(--theme-bg-main)]/95 backdrop-blur-xl text-[var(--theme-text-primary)] text-center animate-fade-in select-none">
      <div className="relative mb-6">
        {/* Animated Phone rotating 90 degrees */}
        <div className="w-20 h-20 rounded-2xl bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-gold)] flex items-center justify-center shadow-2xl relative overflow-hidden">
          <Smartphone className="w-10 h-10 text-[var(--theme-gold)] animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <RotateCw className="w-14 h-14 text-[var(--theme-gold)]/30 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>
      </div>

      <h2 className="font-display font-black text-2xl sm:text-3xl text-[var(--theme-gold)] tracking-wide mb-2">
        Please Rotate Your Device
      </h2>

      <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] max-w-xs sm:max-w-sm mb-6 leading-relaxed">
        WHOT It! is crafted for landscape mode to give you the ultimate card table view with all opponents and hands in clear sight.
      </p>

      <button
        onClick={() => setDismissed(true)}
        className="px-4 py-2 rounded-xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-all cursor-pointer shadow-sm"
      >
        Continue in Portrait
      </button>
    </div>
  );
};
