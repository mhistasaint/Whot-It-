import React from 'react';
import { Player } from '../game/types';
import { AvatarView } from './AvatarView';

interface OpponentSeatProps {
  player: Player;
  isCurrentTurn: boolean;
  position?: 'left' | 'top' | 'right' | 'topLeft' | 'topRight' | 'center';
  lastActionText?: string | null;
  compact?: boolean;
}

export const OpponentSeat: React.FC<OpponentSeatProps> = ({
  player,
  isCurrentTurn,
  position,
  lastActionText,
  compact = false,
}) => {
  const cardCount = player.hand.length;

  return (
    <div
      className={`relative flex flex-col items-center select-none transition-all duration-200 shrink-0 ${
        isCurrentTurn ? 'scale-105 z-20' : 'opacity-90'
      } ${compact ? 'max-w-[78px] sm:max-w-[110px]' : 'max-w-[100px] sm:max-w-[130px]'}`}
    >
      {/* Speech / Action Bubble */}
      {lastActionText && (
        <div className="absolute -top-7 sm:-top-9 z-30 animate-fade-in bg-[var(--theme-bg-elevated)] text-[var(--theme-text-primary)] border border-[var(--theme-gold)] text-[9px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full shadow-lg whitespace-nowrap font-medium pointer-events-none max-w-[130px] sm:max-w-[180px] truncate">
          {lastActionText}
        </div>
      )}

      {/* Opponent Card Stack Cues (Face down mini cards) */}
      <div className="relative -mb-2 sm:-mb-3 z-10 flex items-center justify-center">
        <div className="flex -space-x-2 sm:-space-x-3 items-center">
          {Array.from({ length: Math.min(cardCount, compact ? 3 : 4) }).map((_, idx) => (
            <div
              key={idx}
              className={`${
                compact ? 'w-4 h-5 sm:w-5 sm:h-7' : 'w-4 h-6 sm:w-6 sm:h-8'
              } rounded-[2px] sm:rounded-[3px] bg-[var(--theme-bg-surface)] border border-[var(--theme-gold)]/40 shadow-sm transform transition-transform`}
              style={{
                transform: `rotate(${(idx - 1) * 7}deg)`,
              }}
            />
          ))}
        </div>
        {/* Badge with exact card count */}
        <div className="absolute -bottom-1 -right-2 bg-[var(--theme-gold)] text-[var(--theme-accent-text)] font-display font-black text-[9px] sm:text-xs px-1.5 py-0.2 sm:py-0.5 rounded-full shadow-md min-w-[18px] text-center">
          {cardCount}
        </div>
      </div>

      {/* Avatar with Turn Ring */}
      <div className="mt-1 sm:mt-2">
        <AvatarView
          avatar={player.avatar}
          name={player.name}
          size={compact ? 'sm' : position === 'top' ? 'md' : 'sm'}
          isCurrentTurn={isCurrentTurn}
        />
      </div>

      {/* Opponent Name & Status */}
      <div className="mt-0.5 sm:mt-1 flex flex-col items-center text-center w-full px-0.5">
        <div className="flex items-center justify-center gap-1 w-full">
          <span className="font-display font-bold text-[11px] sm:text-xs md:text-sm text-[var(--theme-text-primary)] truncate max-w-full">
            {player.name}
          </span>
        </div>
        <span
          className={`text-[9px] sm:text-[10px] truncate max-w-full font-medium ${
            cardCount === 1 ? 'text-amber-400 font-bold animate-pulse' : 'text-[var(--theme-text-muted)]'
          }`}
        >
          {cardCount === 1 ? '⚠️ Last Card!' : `${cardCount} cards`}
        </span>
      </div>
    </div>
  );
};
