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
  position = 'top',
  lastActionText,
  compact = false,
}) => {
  const cardCount = player.hand.length;
  const cardsToShow = Math.min(Math.max(cardCount, 1), compact ? 4 : 5);

  // Orientation-specific layout tweaks for side positions (left/right table edges)
  const isSidePosition = position === 'left' || position === 'right';

  return (
    <div
      className={`relative flex ${
        isSidePosition ? 'flex-col items-center' : 'flex-col items-center'
      } select-none transition-all duration-300 shrink-0 ${
        isCurrentTurn ? 'scale-105 z-30' : 'opacity-90 hover:opacity-100'
      } ${compact ? 'max-w-[85px] sm:max-w-[110px]' : 'max-w-[110px] sm:max-w-[140px]'}`}
    >
      {/* Dynamic Action / Speech Bubble */}
      {lastActionText && (
        <div className="absolute -top-8 sm:-top-10 z-40 animate-fade-in bg-[var(--theme-bg-elevated)] text-[var(--theme-text-primary)] border border-[var(--theme-gold)] text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-xl whitespace-nowrap font-bold pointer-events-none max-w-[140px] sm:max-w-[190px] truncate">
          {lastActionText}
        </div>
      )}

      {/* Opponent Card Fan (Authentic Nigerian WHOT Card Backs) */}
      <div className="relative mb-1 z-10 flex items-center justify-center">
        <div className="flex -space-x-3 sm:-space-x-4 items-center">
          {Array.from({ length: cardsToShow }).map((_, idx) => {
            const rotation = (idx - (cardsToShow - 1) / 2) * 8;
            return (
              <div
                key={idx}
                className={`${
                  compact ? 'w-6 h-9 sm:w-8 sm:h-11' : 'w-7 h-10 sm:w-9 sm:h-13'
                } rounded-[3px] sm:rounded-md bg-[var(--theme-bg-surface)] border border-[var(--theme-gold)]/60 shadow-md transform transition-transform overflow-hidden relative`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  zIndex: idx + 1,
                }}
              >
                {/* Traditional Whot Geometric Card Back Inset */}
                <div className="absolute inset-0.5 border border-[var(--theme-gold)]/30 rounded-[2px] bg-[var(--theme-bg-main)] flex flex-col items-center justify-center p-0.5">
                  <div className="w-full h-full border border-dashed border-[var(--theme-gold)]/30 rounded-[1px] flex flex-col items-center justify-center">
                    <span className="font-display font-black text-[var(--theme-gold)] text-[7px] sm:text-[9px] leading-none">
                      W
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Badge with exact card count */}
        <div className="absolute -bottom-1 -right-2 bg-[var(--theme-gold)] text-[var(--theme-accent-text)] font-display font-black text-[9px] sm:text-xs px-2 py-0.5 rounded-full shadow-lg border border-[var(--theme-bg-main)] min-w-[20px] text-center z-20">
          {cardCount}
        </div>
      </div>

      {/* Avatar with Turn Ring */}
      <div className="mt-0.5 sm:mt-1">
        <AvatarView
          avatar={player.avatar}
          name={player.name}
          size={compact ? 'sm' : 'md'}
          isCurrentTurn={isCurrentTurn}
        />
      </div>

      {/* Opponent Name & Card Status (NO hints) */}
      <div className="mt-1 flex flex-col items-center text-center w-full px-0.5">
        <span className="font-display font-bold text-[11px] sm:text-xs md:text-sm text-[var(--theme-text-primary)] truncate max-w-full">
          {player.name}
        </span>
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
