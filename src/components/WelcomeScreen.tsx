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

const SHOWCASE_CARDS: Array<{ shape: CardShape; number: number; label: string; badge?: string; rotate: string }> = [
  { shape: 'CIRCLE', number: 1, label: 'Hold On', badge: 'Play Again', rotate: '-rotate-12' },
  { shape: 'TRIANGLE', number: 2, label: 'Pick Two', badge: '+2 Cards', rotate: '-rotate-6' },
  { shape: 'CROSS', number: 5, label: 'Pick Three', badge: '+3 Cards', rotate: 'rotate-0' },
  { shape: 'SQUARE', number: 7, label: 'Carpet', rotate: 'rotate-6' },
  { shape: 'STAR', number: 8, label: 'Suspension', badge: 'Skip Bot', rotate: 'rotate-12' },
  { shape: 'WHOT', number: 20, label: 'Wildcard', badge: 'Crown Wild', rotate: 'rotate-20' },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onPlay,
  onSignIn,
  onSettings,
}) => {
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);

  const handleSignInClick = () => {
    setIsLockedModalOpen(true);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 select-none overflow-hidden text-[var(--theme-text-primary)] bg-[var(--theme-bg-main)] animate-fade-in">
      
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[var(--theme-gold)]/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[var(--theme-accent)]/30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center my-auto">
        
        {/* Game Name Heading */}
        <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight text-[var(--theme-text-primary)] mb-2">
          WHOT <span className="text-[var(--theme-gold)]">It!</span>
        </h1>

        {/* Tagline */}
        <p className="text-sm sm:text-base md:text-lg text-[var(--theme-text-muted)] font-medium mb-8 sm:mb-10">
          It definitely worth your time
        </p>

        {/* Card Picture (Engaging Nigerian Whot cards fanned out) */}
        <div className="relative w-full max-w-lg h-44 sm:h-56 flex items-center justify-center my-3 sm:my-6">
          <div className="relative flex items-center justify-center w-full">
            {SHOWCASE_CARDS.map((card, i) => (
              <div
                key={`${card.shape}-${card.number}`}
                className={`absolute transition-all duration-300 transform hover:-translate-y-4 hover:scale-110 cursor-pointer shadow-2xl rounded-xl ${card.rotate}`}
                style={{
                  left: `calc(50% - 40px + ${(i - 2.5) * 44}px)`,
                  zIndex: i + 1,
                }}
              >
                <div className="w-20 h-28 sm:w-24 sm:h-34 bg-[#FDFBF7] text-[#B91C1C] border border-[#B91C1C]/30 rounded-xl p-2 flex flex-col justify-between shadow-lg relative overflow-hidden select-none">
                  {/* Card top-left */}
                  <div className="flex flex-col items-center leading-none self-start">
                    <span className="font-display font-black text-xs sm:text-sm">{card.number}</span>
                    <div className="w-3.5 h-3.5 mt-0.5">
                      <ShapeIcon shape={card.shape} className="w-full h-full fill-current" />
                    </div>
                  </div>

                  {/* Center Shape */}
                  <div className="my-auto self-center w-7 h-7 sm:w-9 sm:h-9">
                    <ShapeIcon shape={card.shape} className="w-full h-full fill-current" />
                  </div>

                  {/* Card bottom-right */}
                  <div className="flex flex-col items-center leading-none self-end rotate-180">
                    <span className="font-display font-black text-xs sm:text-sm">{card.number}</span>
                    <div className="w-3.5 h-3.5 mt-0.5">
                      <ShapeIcon shape={card.shape} className="w-full h-full fill-current" />
                    </div>
                  </div>

                  {/* Mini badge */}
                  {card.badge && (
                    <span className="absolute bottom-1 left-1 right-1 text-[8px] font-bold text-center bg-[#B91C1C] text-white rounded px-0.5 py-0.2">
                      {card.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons: Play, Locked Sign In, Settings with appropriate icons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 w-full max-w-md">
          {/* Play Button */}
          <button
            onClick={onPlay}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-black text-base sm:text-lg tracking-wide shadow-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-2 border-[var(--theme-accent)] ring-2 ring-[var(--theme-gold)]/30"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Play</span>
          </button>

          {/* Locked Sign In Button */}
          <button
            onClick={handleSignInClick}
            className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-[var(--theme-bg-surface)] hover:bg-[var(--theme-bg-elevated)] border-2 border-[var(--theme-border)] hover:border-[var(--theme-gold)]/60 text-[var(--theme-text-primary)] font-display font-extrabold text-sm sm:text-base transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95 relative group"
            title="Account credentials unlock when Multiplayer goes live"
          >
            <Lock className="w-4 h-4 text-[var(--theme-gold)]" />
            <span>Sign In</span>
            <span className="text-[9px] uppercase tracking-wider font-extrabold bg-[var(--theme-gold)]/15 text-[var(--theme-gold)] px-1.5 py-0.5 rounded-full border border-[var(--theme-gold)]/30">
              Locked
            </span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onSettings}
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-[var(--theme-bg-surface)] hover:bg-[var(--theme-bg-elevated)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] font-display font-bold text-sm sm:text-base transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95"
            title="Game Settings"
          >
            <Settings className="w-4 h-4 text-[var(--theme-gold)]" />
            <span>Settings</span>
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
