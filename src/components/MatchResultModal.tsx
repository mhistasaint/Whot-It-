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
  players,
  turnCount,
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
      <div className="relative w-full max-w-md bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-gold)] rounded-3xl shadow-2xl p-6 sm:p-7 text-center text-[var(--theme-text-primary)] overflow-hidden">
        
        {/* Celebration Sunburst & Bouncy Trophy */}
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

        {isHumanWinner && (
          <div className="inline-block bg-[var(--theme-gold)]/15 border border-[var(--theme-gold)]/40 text-[var(--theme-gold)] px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-1.5 animate-pulse">
            ★ Victory Achieved ★
          </div>
        )}

        <h2 className={`font-display font-black text-2xl sm:text-3xl mb-1 ${isHumanWinner ? 'victory-gold-shimmer' : 'text-[var(--theme-text-primary)]'}`}>
          {isHumanWinner ? 'You Won the Match!' : `${winner.name} Won!`}
        </h2>
        <p className="text-xs text-[var(--theme-text-muted)] mb-5 max-w-sm mx-auto">
          {isHumanWinner
            ? 'Splendid game! You emptied your hand first and conquered the table.'
            : `${winner.name} finished all cards first. Ready for a rematch?`}
        </p>

        {/* Winner Showcase */}
        <div className="flex items-center justify-center gap-3 bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-2xl p-3 mb-4 shadow-inner">
          <AvatarView avatar={winner.avatar} name={winner.name} size="md" />
          <div className="text-left">
            <span className="font-display font-bold text-sm text-[var(--theme-text-primary)] block">
              {winner.name}
            </span>
            <span className="text-[11px] text-[var(--theme-accent)] font-semibold">{winner.titles || 'Champion'}</span>
          </div>
        </div>

        {/* Final Standings / Hand counts */}
        <div className="bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-2xl p-3 text-xs mb-5 text-left shadow-inner">
          <span className="text-[10px] uppercase font-bold text-[var(--theme-text-muted)] tracking-wider block mb-2">
            Remaining Hand Standings
          </span>
          <div className="space-y-1.5">
            {players.map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <span className={`flex items-center gap-1.5 ${p.id === winner.id ? 'font-bold text-[var(--theme-accent)]' : 'text-[var(--theme-text-primary)]/80'}`}>
                  {p.id === winner.id ? '🥇' : '•'} {p.name} {p.isHuman ? '(You)' : ''}
                </span>
                <span className="font-mono">
                  {p.id === winner.id ? '0 cards (Winner)' : `${p.hand.length} cards`}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-[var(--theme-border)] flex justify-between text-[11px] text-[var(--theme-text-muted)]">
            <span>Total Turns:</span>
            <span>{turnCount} turns</span>
          </div>
        </div>

        {/* Play Again & Back to Home Actions (NO home icon, Play Again text) */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
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
