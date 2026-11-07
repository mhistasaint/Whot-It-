import React, { useState } from 'react';
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
  selectedCardId?: string | null;
  onSelectCard?: (cardId: string | null) => void;
  onPlayCard: (cardId: string) => void;
  onDrawCard: () => void;
  turnTimeRemaining?: number;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  hand,
  activeShape,
  activeNumber,
  pendingPenalty,
  isHumanTurn,
  hintsEnabled = true,
  selectedCardId: externalSelectedId,
  onSelectCard,
  onPlayCard,
  onDrawCard,
  turnTimeRemaining,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const selectedCardId = externalSelectedId !== undefined ? externalSelectedId : internalSelectedId;

  const cardCount = hand.length;
  const hasPlayableCard = hand.some(card =>
    isCardPlayable(card, activeShape, activeNumber, pendingPenalty)
  );

  const handleCardClick = (card: Card) => {
    if (!isHumanTurn) return;

    const isLegal = isCardPlayable(card, activeShape, activeNumber, pendingPenalty);
    if (!isLegal) return;

    // WHOT 20 ONLY: Open shape selection modal with cancellation/confirmation
    if (card.number === 20) {
      if (onSelectCard) onSelectCard(card.id);
      else setInternalSelectedId(card.id);
      onPlayCard(card.id);
      return;
    }

    // NORMAL CARDS AND OTHER SPECIAL CARDS (1, 2, 5, 8, 14):
    // Play immediately on first click! No confirmation modal, no second click, no prompt.
    if (onSelectCard) onSelectCard(null);
    else setInternalSelectedId(null);
    onPlayCard(card.id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-4 pb-1 pt-0.5 flex flex-col items-center select-none">
      {/* Hand Header info bar (Single turn timer, no draw button) */}
      <div className="flex items-center justify-between w-full max-w-xl px-2 sm:px-3 py-1 mb-0.5 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-display font-black text-xs sm:text-sm text-[var(--theme-text-primary)]">
            Your Hand
          </span>
          <span className="text-[var(--theme-text-muted)] font-medium text-[11px] sm:text-xs whitespace-nowrap">
            · {cardCount} {cardCount === 1 ? 'card' : 'cards'}
          </span>
          {cardCount === 1 && (
            <span className="animate-pulse font-display font-bold text-amber-400 text-[10px] sm:text-[11px] tracking-wider whitespace-nowrap">
              ⚠️ Last Card!
            </span>
          )}
        </div>

        {isHumanTurn && turnTimeRemaining !== undefined && (
          <div
            className={`flex items-center gap-1 font-mono font-black text-[11px] px-2.5 py-0.5 rounded-full border transition-all ${
              turnTimeRemaining <= 5
                ? 'bg-red-950 text-red-200 border-red-500 animate-pulse'
                : 'bg-[var(--theme-bg-surface)] text-[var(--theme-gold)] border-[var(--theme-gold)]/40'
            }`}
            title="15s turn countdown"
          >
            <span>⏱️</span>
            <span>{turnTimeRemaining}s</span>
          </div>
        )}
      </div>

      {/* Cards container: Cards stack on each other like a real hand, leaving the left index (number and shape) visible and clickable */}
      <div className="w-full flex items-center justify-center overflow-x-auto no-scrollbar py-2 sm:py-3 px-2 sm:px-4 min-h-[125px] sm:min-h-[155px]">
        <div
          className={`flex items-end justify-center transition-all duration-200 ${
            cardCount <= 2
              ? 'space-x-2 sm:space-x-3'
              : cardCount <= 4
              ? '-space-x-5 sm:-space-x-7'
              : cardCount <= 6
              ? '-space-x-8 sm:-space-x-12'
              : cardCount <= 9
              ? '-space-x-11 sm:-space-x-15'
              : '-space-x-13 sm:-space-x-18'
          } px-2 sm:px-4`}
        >
          {hand.map((card, index) => {
            const isLegal = isCardPlayable(card, activeShape, activeNumber, pendingPenalty);
            const playable = isHumanTurn && isLegal;
            const isSelected = selectedCardId === card.id;
            const showDim = hintsEnabled && isHumanTurn && !isLegal;

            return (
              <div
                key={card.id}
                className={`transform transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'z-40 -translate-y-4 scale-105 shadow-2xl'
                    : 'hover:z-30 hover:-translate-y-3 hover:scale-105 active:scale-95'
                }`}
                style={{
                  zIndex: isSelected ? 40 : index + 1,
                }}
              >
                <CardView
                  card={card}
                  size="hand"
                  isPlayable={playable}
                  isSelected={isSelected}
                  onClick={() => handleCardClick(card)}
                  className={`${showDim ? 'opacity-60 filter grayscale-[25%]' : ''}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

