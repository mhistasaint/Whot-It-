import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '../game/types';
import { AvatarView } from './AvatarView';

interface MatchResultModalProps {
  isOpen: boolean;
  winner: Player | null;
  players: Player[];
  turnCount: number;
  onNewMatch: () => void;
  onReturnToLobby?: () => void;
  onReturnHome?: () => void;
}

export const MatchResultModal: React.FC<MatchResultModalProps> = ({
  isOpen,
  winner,
  onNewMatch,
  onReturnToLobby,
  onReturnHome,
}) => {
  const isHumanWinner = winner?.isHuman ?? false;

  useEffect(() => {
    if (!isOpen || !isHumanWinner) return;

    // Multi-stage celebration fireworks and confetti!
    try {
      // 1. Initial celebratory center burst
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#D7B45A', '#176B45', '#B91C1C', '#F7F3E8', '#FCD34D'],
      });

      // 2. Left victory cannon salvo
      const timer1 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 65,
          origin: { x: 0.1, y: 0.75 },
          colors: ['#D7B45A', '#FCD34D', '#F7F3E8', '#176B45'],
        });
      }, 250);

      // 3. Right victory cannon salvo
      const timer2 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 65,
          origin: { x: 0.9, y: 0.75 },
          colors: ['#D7B45A', '#FCD34D', '#F7F3E8', '#B91C1C'],
        });
      }, 500);

      // 4. Center star & sparkle shower
      const timer3 = setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 100,
          origin: { y: 0.4 },
          shapes: ['circle', 'square'],
          colors: ['#D7B45A', '#FCD34D', '#FFFFFF', '#7CCB75'],
        });
      }, 800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } catch {
      // Safe fallback
    }
  }, [isOpen, isHumanWinner]);

  if (!isOpen || !winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-sm sm:max-w-md bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-gold)] rounded-3xl shadow-2xl p-6 sm:p-7 text-center text-[var(--theme-text-primary)] overflow-hidden">
        
        {/* Celebration Sunburst & Bouncy Trophy / Crown */}
        <div className="relative mb-3 flex items-center justify-center">
          {isHumanWinner && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-36 h-36 rounded-full animate-victory-sunburst opacity-35"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(215, 180, 90, 0.45) 0deg 20deg, transparent 20deg 40deg, rgba(215, 180, 90, 0.45) 40deg 60deg, transparent 60deg 80deg, rgba(215, 180, 90, 0.45) 80deg 100deg, transparent 100deg 120deg, rgba(215, 180, 90, 0.45) 120deg 140deg, transparent 140deg 160deg, rgba(215, 180, 90, 0.45) 160deg 180deg, transparent 180deg 200deg, rgba(215, 180, 90, 0.45) 200deg 220deg, transparent 220deg 240deg, rgba(215, 180, 90, 0.45) 240deg 260deg, transparent 260deg 280deg, rgba(215, 180, 90, 0.45) 280deg 300deg, transparent 300deg 320deg, rgba(215, 180, 90, 0.45) 320deg 340deg, transparent 340deg 360deg)',
                }}
              />
            </div>
          )}

          {/* Floating celebratory sparkle accents */}
          {isHumanWinner && (
            <>
              <span className="absolute -top-1 -left-3 text-xl animate-victory-sparkle pointer-events-none" style={{ animationDelay: '0.1s' }}>
                ✨
              </span>
              <span className="absolute -top-2 -right-3 text-xl animate-victory-sparkle pointer-events-none" style={{ animationDelay: '0.6s' }}>
                ⭐
              </span>
              <span className="absolute bottom-1 -left-4 text-xl animate-victory-sparkle pointer-events-none" style={{ animationDelay: '1.1s' }}>
                🎉
              </span>
              <span className="absolute bottom-1 -right-4 text-xl animate-victory-sparkle pointer-events-none" style={{ animationDelay: '0.4s' }}>
                🌟
              </span>
            </>
          )}

          {/* Crown / Trophy badge */}
          <div
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-4xl border-3 shadow-2xl transition-all ${
              isHumanWinner
                ? 'bg-[var(--theme-accent)]/25 border-[var(--theme-gold)] text-[var(--theme-gold)] ring-4 ring-[var(--theme-gold)]/40 ring-offset-2 ring-offset-[var(--theme-bg-surface)] animate-victory-trophy'
                : 'bg-[#991B1B]/20 border-[#991B1B] text-[#FCA5A5]'
            }`}
          >
            {isHumanWinner ? '🏆' : '👑'}
          </div>
        </div>

        {/* Big "Winner" Heading */}
        <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-wider text-[var(--theme-gold)] mb-4">
          Winner
        </h2>

        {/* Winner Avatar with Name */}
        <div className="flex flex-col items-center justify-center gap-2 mb-7">
          <AvatarView avatar={winner.avatar} name={winner.name} size="lg" />
          <div className="text-center">
            <span className="font-display font-black text-xl sm:text-2xl text-[var(--theme-text-primary)] block">
              {winner.name} {winner.isHuman ? '(You)' : ''}
            </span>
            {winner.titles && (
              <span className="text-xs text-[var(--theme-accent)] font-semibold block mt-0.5">
                {winner.titles}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Back to Home & Play Again */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
          {(onReturnHome || onReturnToLobby) && (
            <button
              onClick={onReturnHome || onReturnToLobby}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] text-[var(--theme-text-primary)] font-display font-bold text-xs transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
            >
              Back to Home
            </button>
          )}
          <button
            onClick={onNewMatch}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-extrabold text-xs shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
