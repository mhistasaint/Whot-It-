import React from 'react';
import { Card, CardShape, PendingPenalty } from '../game/types';
import { CardView } from './CardView';
import { isCardPlayable } from '../game/rules';

interface PlayerHandProps {
  hand: Card[];
  activeShape: CardShape;
  activeNumber: number;
  pendingPenalty: PendingPenalty | null;
  isHumanTurn: boolean;
  onPlayCard: (cardId: string) => void;
  onDrawCard: () => void;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  hand,
  activeShape,
  activeNumber,
  pendingPenalty,
  isHumanTurn,
  onPlayCard,
  onDrawCard,
}) => {
  const cardCount = hand.length;
  const hasPlayableCard = hand.some(card =>
    isCardPlayable(card, activeShape, activeNumber, pendingPenalty)
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-4 pb-2 pt-1 flex flex-col items-center select-none">
      {/* Hand Header info bar */}
      <div className="flex items-center justify-between w-full max-w-xl px-3 py-1 mb-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-sm text-[#F7F3E8]">
            Your Hand
          </span>
          <span className="text-[#D7B45A] font-semibold bg-[#123D2B] px-2 py-0.5 rounded-full border border-[#D7B45A]/30">
            {cardCount} {cardCount === 1 ? 'Card' : 'Cards'}
          </span>
          {cardCount === 1 && (
            <span className="animate-pulse font-display font-extrabold text-[#B91C1C] bg-[#FDFBF7] px-2 py-0.5 rounded-full text-[11px] shadow-md tracking-wider">
              ⚠️ LAST CARD!
            </span>
          )}
        </div>

        {isHumanTurn && (
          <div className="flex items-center gap-2">
            {!hasPlayableCard && (
              <span className="text-amber-300 font-medium text-[11px] hidden sm:inline">
                No matching cards. Go to market:
              </span>
            )}
            <button
              onClick={onDrawCard}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all active:scale-95 ${
                !hasPlayableCard
                  ? 'bg-[#D7B45A] text-[#08291F] border-[#D7B45A] shadow-md animate-pulse'
                  : 'bg-[#176B45] text-[#F7F3E8] border-[#7CCB75]/40 hover:bg-[#123D2B]'
              }`}
            >
              {pendingPenalty ? `Draw +${pendingPenalty.amount} Penalty` : 'Draw 1 Card'}
            </button>
          </div>
        )}
      </div>

      {/* Cards container: Horizontally scrollable and fanned on small screens */}
      <div className="w-full flex items-center justify-center overflow-x-auto no-scrollbar py-4 px-2 min-h-[140px] md:min-h-[170px]">
        <div className="flex items-center justify-center -space-x-4 md:-space-x-6 hover:space-x-1 transition-all duration-300">
          {hand.map((card, index) => {
            const playable = isHumanTurn && isCardPlayable(card, activeShape, activeNumber, pendingPenalty);
            // Slight fan rotation based on hand position
            const rotation = (index - (cardCount - 1) / 2) * 2.5;

            return (
              <div
                key={card.id}
                className="transform transition-transform duration-200 hover:z-30 hover:scale-110"
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                <CardView
                  card={card}
                  size="md"
                  isPlayable={playable}
                  onClick={() => {
                    if (playable) onPlayCard(card.id);
                  }}
                  className={!playable && isHumanTurn ? 'opacity-65 filter grayscale-[20%]' : ''}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
