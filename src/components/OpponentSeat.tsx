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
        <div className="absolute -top-10 z-20 animate-fade-in bg-[#176B45] text-[#F7F3E8] border border-[#D7B45A]/50 text-xs px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap">
          {lastActionText}
        </div>
      )}

      {/* Opponent Card Stack Cues (Face down mini cards) */}
      <div className="relative -mb-3 z-10 flex items-center justify-center">
        {/* Render a neat mini card fan representation */}
        <div className="flex -space-x-3 items-center">
          {Array.from({ length: Math.min(cardCount, 5) }).map((_, idx) => (
            <div
              key={idx}
              className="w-5 h-7 md:w-6 md:h-8 rounded-[3px] bg-[#123D2B] border border-[#D7B45A]/40 shadow-sm transform transition-transform"
              style={{
                transform: `rotate(${(idx - Math.min(cardCount, 5) / 2) * 8}deg)`,
              }}
            />
          ))}
        </div>
        {/* Badge with exact card count */}
        <div className="absolute -bottom-1 -right-2 bg-[#D7B45A] text-[#08291F] font-display font-extrabold text-[10px] md:text-xs px-1.5 py-0.5 rounded-full shadow-md min-w-[20px] text-center">
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
          <span className="font-display font-bold text-xs md:text-sm text-[#F7F3E8]">
            {player.name}
          </span>
          {isCurrentTurn && (
            <span className="text-[10px] font-medium text-[#7CCB75] bg-[#7CCB75]/10 px-1.5 py-0.2 rounded-full border border-[#7CCB75]/30 animate-pulse">
              Thinking
            </span>
          )}
        </div>
        <span className="text-[10px] text-[#F7F3E8]/60 max-w-[120px] truncate">
          {cardCount === 1 ? '⚠️ Last Card!' : `${cardCount} cards`}
        </span>
      </div>
    </div>
  );
};
