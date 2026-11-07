import React, { useState } from 'react';
import { Play, Lock, Settings } from 'lucide-react';
import { CardShape } from '../game/types';
import { ShapeIcon } from './CardView';
import { SignInLockedModal } from './SignInLockedModal';

interface WelcomeScreenProps {
  onPlay: () => void;
  onSignIn?: () => void;
  onSettings: () => void;
}

const SHOWCASE_CARDS: Array<{
  shape: CardShape;
  number: number;
  label: string;
  badge?: string;
  rotDeg: number;
}> = [
  { shape: 'CIRCLE', number: 1, label: 'Hold On', badge: 'Play Again', rotDeg: -14 },
  { shape: 'TRIANGLE', number: 2, label: 'Pick Two', badge: '+2 Cards', rotDeg: -7 },
  { shape: 'CROSS', number: 5, label: 'Pick Three', badge: '+3 Cards', rotDeg: 0 },
  { shape: 'SQUARE', number: 7, label: 'Carpet', rotDeg: 7 },
  { shape: 'STAR', number: 8, label: 'Suspension', badge: 'Skip Bot', rotDeg: 14 },
  { shape: 'WHOT', number: 20, label: 'Wildcard', badge: 'Crown Wild', rotDeg: 22 },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onPlay,
  onSettings,
}) => {
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);

  const handleSignInClick = () => {
    setIsLockedModalOpen(true);
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-6 select-none overflow-hidden text-[var(--theme-text-primary)] bg-[var(--theme-bg-main)] animate-fade-in"
      style={{
        paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
        paddingLeft: 'max(1.25rem, env(safe-area-inset-left))',
        paddingRight: 'max(1.25rem, env(safe-area-inset-right))',
      }}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[var(--theme-gold)]/25 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[var(--theme-accent)]/25 blur-3xl" />
      </div>

      {/* Main Content: Centralized vertical stack across all screens */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center justify-center text-center my-auto">
        
        {/* 1. TOP: Name and Tagline */}
        <div className="flex flex-col items-center text-center mb-4 sm:mb-7">
          <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight text-[var(--theme-text-primary)] mb-1.5 sm:mb-2 drop-shadow-md">
            WHOT <span className="text-[var(--theme-gold)]">It!</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[var(--theme-text-muted)] font-medium max-w-md mx-auto">
            It definitely worth your time
          </p>
        </div>

        {/* 2. MIDDLE: Cards animated at the center */}
        <div className="relative w-full max-w-md h-40 sm:h-52 md:h-60 flex items-center justify-center my-2 sm:my-4">
          <div className="relative flex items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md h-full">
            {SHOWCASE_CARDS.map((card, i) => (
              <div
                key={`${card.shape}-${card.number}`}
                className="absolute transition-all duration-300 transform hover:-translate-y-4 hover:scale-110 cursor-pointer shadow-2xl rounded-xl animate-welcome-card"
                style={{
                  left: `calc(50% - 32px + ${(i - 2.5) * 36}px)`,
                  zIndex: i + 1,
                  ['--card-rot' as any]: `${card.rotDeg}deg`,
                  animationDelay: `${i * 0.22}s`,
                }}
              >
                <div className="w-16 h-22 sm:w-22 sm:h-30 md:w-24 md:h-34 bg-[#FDFBF7] text-[#B91C1C] border border-[#B91C1C]/30 rounded-xl p-1.5 sm:p-2 flex flex-col justify-between shadow-lg relative overflow-hidden select-none hover:ring-2 hover:ring-[var(--theme-gold)]">
                  {/* Card top-left */}
                  <div className="flex flex-col items-center leading-none self-start">
                    <span className="font-display font-black text-[11px] sm:text-sm">{card.number}</span>
                    <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 mt-0.5">
                      <ShapeIcon shape={card.shape} className="w-full h-full fill-current" />
                    </div>
                  </div>

                  {/* Center Shape */}
                  <div className="my-auto self-center w-5 h-5 sm:w-8 sm:h-8">
                    <ShapeIcon shape={card.shape} className="w-full h-full fill-current" />
                  </div>

                  {/* Card bottom-right */}
                  <div className="flex flex-col items-center leading-none self-end rotate-180">
                    <span className="font-display font-black text-[11px] sm:text-sm">{card.number}</span>
                    <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 mt-0.5">
                      <ShapeIcon shape={card.shape} className="w-full h-full fill-current" />
                    </div>
                  </div>

                  {/* Mini badge */}
                  {card.badge && (
                    <span className="absolute bottom-1 left-1 right-1 text-[7px] sm:text-[8px] font-bold text-center bg-[#B91C1C] text-white rounded px-0.5 py-0.2 truncate">
                      {card.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. BOTTOM: Buttons under the animated cards */}
        <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-md mt-4 sm:mt-6">
          {/* Play Button */}
          <button
            onClick={onPlay}
            className="flex-1 min-w-[120px] py-3 sm:py-3.5 px-5 sm:px-6 rounded-2xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-black text-sm sm:text-base tracking-wide shadow-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-2 border-[var(--theme-accent)] ring-2 ring-[var(--theme-gold)]/30 hover:shadow-[0_0_20px_rgba(215,180,90,0.35)]"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span>Play</span>
          </button>

          {/* Sign In Button */}
          <button
            onClick={handleSignInClick}
            className="flex-1 min-w-[110px] py-3 sm:py-3.5 px-4 sm:px-5 rounded-2xl bg-[var(--theme-bg-surface)] hover:bg-[var(--theme-bg-elevated)] border-2 border-[var(--theme-gold)] text-[var(--theme-gold)] font-display font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-gold)]" />
            <span>Sign In</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onSettings}
            className="py-3 sm:py-3.5 px-4 sm:px-5 rounded-2xl bg-[var(--theme-bg-surface)] hover:bg-[var(--theme-bg-elevated)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] font-display font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95 hover:border-[var(--theme-gold)]"
            title="Game Settings"
          >
            <Settings className="w-4 h-4 text-[var(--theme-gold)]" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

      </div>

      {/* Sign In Locked Modal */}
      <SignInLockedModal
        isOpen={isLockedModalOpen}
        onClose={() => setIsLockedModalOpen(false)}
        onPlayGuest={onPlay}
      />
    </div>
  );
};
