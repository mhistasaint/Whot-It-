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
  // Show between 1 and 4-5 card backs in the fan representing the hand
  const cardsToShow = Math.min(Math.max(cardCount, 1), compact ? 4 : 5);

  const isSidePosition = position === 'left' || position === 'right';

  return (
    <div
      className={`relative flex flex-col items-center select-none transition-all duration-300 shrink-0 ${
        isCurrentTurn ? 'scale-105 z-30' : 'opacity-90 hover:opacity-100'
      } ${
        compact || isSidePosition
          ? 'max-w-[65px] sm:max-w-[85px] md:max-w-[115px]'
          : 'max-w-[85px] sm:max-w-[110px] md:max-w-[135px]'
      }`}
    >
      {/* Dynamic Action / Speech Bubble */}
      {lastActionText && (
        <div className="absolute -top-7 sm:-top-9 z-40 animate-fade-in bg-[var(--theme-bg-elevated)] text-[var(--theme-text-primary)] border border-[var(--theme-gold)] text-[9px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full shadow-xl whitespace-nowrap font-bold pointer-events-none max-w-[110px] sm:max-w-[170px] truncate">
          {lastActionText}
        </div>
      )}

      {/* Opponent Card Fan (Authentic Nigerian WHOT Card Backs - Backs Only) */}
      <div className="relative mb-0.5 sm:mb-1 z-10 flex items-center justify-center">
        <div className="flex -space-x-2.5 sm:-space-x-3.5 items-center">
          {Array.from({ length: cardsToShow }).map((_, idx) => {
            const rotation = (idx - (cardsToShow - 1) / 2) * 7;
            return (
              <div
                key={idx}
                className={`${
                  compact || isSidePosition
                    ? 'w-5 h-7 sm:w-7 sm:h-10 md:w-8 md:h-11'
                    : 'w-6 h-8 sm:w-8 sm:h-11 md:w-9 md:h-12'
                } rounded-[3px] sm:rounded-md bg-[var(--theme-bg-surface)] border border-[var(--theme-gold)]/60 shadow-md transform transition-transform overflow-hidden relative shrink-0`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  zIndex: idx + 1,
                }}
              >
                {/* Traditional Whot Card Back Face */}
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
      </div>

      {/* Avatar with Turn Ring */}
      <div className="mt-0.5">
        <AvatarView
          avatar={player.avatar}
          name={player.name}
          size={compact || isSidePosition ? 'sm' : 'sm'}
          isCurrentTurn={isCurrentTurn}
        />
      </div>

      {/* Opponent Name & Plain Card Count (NO shapes, written plain) */}
      <div className="mt-0.5 sm:mt-1 flex flex-col items-center text-center w-full px-0.5">
        <span className="font-display font-bold text-[10px] sm:text-xs md:text-sm text-[var(--theme-text-primary)] truncate max-w-full">
          {player.name}
        </span>
        <span
          className={`text-[9px] sm:text-[10px] md:text-[11px] truncate max-w-full font-medium whitespace-nowrap ${
            cardCount === 1 ? 'text-amber-400 font-bold animate-pulse' : 'text-[var(--theme-text-muted)]'
          }`}
        >
          {cardCount === 1 ? '⚠️ Last Card! (1 card)' : `${cardCount} cards`}
        </span>
      </div>
    </div>
  );
};
