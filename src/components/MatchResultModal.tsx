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
}

export const MatchResultModal: React.FC<MatchResultModalProps> = ({
  isOpen,
  winner,
  players,
  turnCount,
  onNewMatch,
}) => {
  const isHumanWinner = winner?.isHuman ?? false;

  useEffect(() => {
    if (isOpen && isHumanWinner) {
      // Fire festive victory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7CCB75', '#D7B45A', '#F7F3E8', '#176B45'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen, isHumanWinner]);

  if (!isOpen || !winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-gold)] rounded-2xl shadow-2xl p-6 text-center text-[var(--theme-text-primary)]">
        {/* Crown / Trophy icon */}
        <div
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 text-3xl border-2 ${
            isHumanWinner
              ? 'bg-[var(--theme-accent)]/20 border-[var(--theme-accent)] text-[var(--theme-accent)]'
              : 'bg-[#991B1B]/20 border-[#991B1B] text-[#FCA5A5]'
          }`}
        >
          {isHumanWinner ? '🏆' : '👑'}
        </div>

        <h2 className="font-display font-black text-2xl text-[var(--theme-text-primary)] mb-1">
          {isHumanWinner ? 'You Won the Match!' : `${winner.name} Won!`}
        </h2>
        <p className="text-xs text-[var(--theme-text-muted)] mb-5">
          {isHumanWinner
            ? 'Splendid game! You emptied your hand first and conquered the table.'
            : `${winner.name} finished all cards first. Ready for a rematch?`}
        </p>

        {/* Winner Showcase */}
        <div className="flex items-center justify-center gap-3 bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-xl p-3 mb-4">
          <AvatarView avatar={winner.avatar} name={winner.name} size="md" />
          <div className="text-left">
            <span className="font-display font-bold text-sm text-[var(--theme-text-primary)] block">
              {winner.name}
            </span>
            <span className="text-[11px] text-[var(--theme-accent)]">{winner.titles || 'Champion'}</span>
          </div>
        </div>

        {/* Final Standings / Hand counts */}
        <div className="bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-xl p-3 text-xs mb-5 text-left">
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

        {/* New Match Action */}
        <button
          onClick={onNewMatch}
          className="w-full py-3 px-4 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-extrabold text-sm shadow-xl transition-all active:scale-95 cursor-pointer"
        >
          Deal New Match
        </button>
      </div>
    </div>
  );
};
