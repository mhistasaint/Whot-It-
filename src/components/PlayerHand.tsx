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
  hintsEnabled?: boolean;
  onPlayCard: (cardId: string) => void;
  onDrawCard: () => void;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  hand,
  activeShape,
  activeNumber,
  pendingPenalty,
  isHumanTurn,
  hintsEnabled = true,
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
          <span className="font-display font-bold text-sm text-[var(--theme-text-primary)]">
            Your Hand
          </span>
          <span className="text-[var(--theme-accent)] font-semibold bg-[var(--theme-bg-surface)] px-2 py-0.5 rounded-full border border-[var(--theme-border-subtle)]">
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
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all active:scale-95 cursor-pointer ${
                !hasPlayableCard
                  ? 'bg-[var(--theme-accent)] text-[var(--theme-accent-text)] border-[var(--theme-accent)] shadow-md animate-pulse'
                  : 'bg-[var(--theme-bg-elevated)] text-[var(--theme-text-primary)] border-[var(--theme-border)] hover:bg-[var(--theme-bg-surface)]'
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
            const isLegal = isCardPlayable(card, activeShape, activeNumber, pendingPenalty);
            const playable = isHumanTurn && isLegal;
            const showHighlight = hintsEnabled ? playable : false;
            const showDim = hintsEnabled && isHumanTurn && !isLegal;
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
                  isSelected={showHighlight}
                  onClick={() => {
                    if (playable) onPlayCard(card.id);
                  }}
                  className={showDim ? 'opacity-65 filter grayscale-[20%]' : ''}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
