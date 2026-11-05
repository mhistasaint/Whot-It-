import React from 'react';
import { Player } from '../game/types';
import { AvatarView } from './AvatarView';

interface OpponentSeatProps {
  player: Player;
  isCurrentTurn: boolean;
  position?: 'left' | 'top' | 'right' | 'topLeft' | 'topRight' | 'center';
  lastActionText?: string | null;
}

export const OpponentSeat: React.FC<OpponentSeatProps> = ({
  player,
  isCurrentTurn,
  position,
  lastActionText,
}) => {
  const cardCount = player.hand.length;

  return (
    <div
      className={`relative flex flex-col items-center select-none transition-all duration-300 ${
        isCurrentTurn ? 'scale-105' : 'opacity-90'
      }`}
    >
      {/* Speech / Action Bubble */}
      {lastActionText && (
        <div className="absolute -top-10 z-20 animate-fade-in bg-[var(--theme-bg-elevated)] text-[var(--theme-text-primary)] border border-[var(--theme-gold)] text-xs px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap font-medium">
          {lastActionText}
        </div>
      )}

      {/* Opponent Card Stack Cues (Face down mini cards) */}
      <div className="relative -mb-3 z-10 flex items-center justify-center">
        <div className="flex -space-x-3 items-center">
          {Array.from({ length: Math.min(cardCount, 5) }).map((_, idx) => (
            <div
              key={idx}
              className="w-5 h-7 md:w-6 md:h-8 rounded-[3px] bg-[var(--theme-bg-surface)] border border-[var(--theme-gold)]/40 shadow-sm transform transition-transform"
              style={{
                transform: `rotate(${(idx - Math.min(cardCount, 5) / 2) * 8}deg)`,
              }}
            />
          ))}
        </div>
        {/* Badge with exact card count */}
        <div className="absolute -bottom-1 -right-2 bg-[var(--theme-gold)] text-[var(--theme-accent-text)] font-display font-extrabold text-[10px] md:text-xs px-1.5 py-0.5 rounded-full shadow-md min-w-[20px] text-center">
          {cardCount}
        </div>
      </div>

      {/* Avatar with Turn Ring */}
      <div className="mt-2">
        <AvatarView
          avatar={player.avatar}
          name={player.name}
          size={position === 'top' ? 'lg' : 'md'}
          isCurrentTurn={isCurrentTurn}
        />
      </div>

      {/* Opponent Name & Status */}
      <div className="mt-1 flex flex-col items-center text-center">
        <div className="flex items-center gap-1.5">
          <span className="font-display font-bold text-xs md:text-sm text-[var(--theme-text-primary)]">
            {player.name}
          </span>
          {isCurrentTurn && (
            <span className="text-[10px] font-bold text-[var(--theme-accent)] bg-[var(--theme-bg-elevated)]/60 px-1.5 py-0.2 rounded-full border border-[var(--theme-accent)] animate-pulse">
              Thinking
            </span>
          )}
        </div>
        <span className="text-[10px] text-[var(--theme-text-muted)] max-w-[120px] truncate">
          {cardCount === 1 ? '⚠️ Last Card!' : `${cardCount} cards`}
        </span>
      </div>
    </div>
  );
};
