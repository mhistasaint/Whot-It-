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
      {/* Hand Header info & quick action bar */}
      <div className="flex items-center justify-between w-full max-w-xl px-2 sm:px-3 py-1 mb-0.5 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-display font-black text-xs sm:text-sm text-[var(--theme-text-primary)]">
            Your Hand
          </span>
          <span className="text-[var(--theme-accent)] font-bold bg-[var(--theme-bg-surface)] px-2 py-0.5 rounded-full border border-[var(--theme-border-subtle)] text-[11px] sm:text-xs">
            {cardCount} {cardCount === 1 ? 'Card' : 'Cards'}
          </span>
          {cardCount === 1 && (
            <span className="animate-pulse font-display font-black text-[#B91C1C] bg-[#FDFBF7] px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] shadow-md tracking-wider">
              ⚠️ LAST CARD!
            </span>
          )}
        </div>

        {isHumanTurn && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {!hasPlayableCard && (
              <span className="text-amber-300 font-medium text-[10px] sm:text-[11px] hidden md:inline">
                No matching cards:
              </span>
            )}

            <button
              onClick={onDrawCard}
              className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold rounded-lg border transition-all active:scale-95 cursor-pointer min-h-[32px] flex items-center ${
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

      {/* Cards container: Horizontally scrollable with smooth touch ergonomics */}
      <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-3 px-3 min-h-[125px] sm:min-h-[155px] touch-pan-x">
        <div
          className={`flex items-end ${
            cardCount > 6 ? '-space-x-3 sm:-space-x-5' : 'space-x-1.5 sm:space-x-3'
          } px-4 transition-all duration-200`}
        >
          {hand.map((card, index) => {
            const isLegal = isCardPlayable(card, activeShape, activeNumber, pendingPenalty);
            const playable = isHumanTurn && isLegal;
            const isSelected = selectedCardId === card.id;
            const showHighlight = hintsEnabled ? playable : false;
            const showDim = hintsEnabled && isHumanTurn && !isLegal;

            return (
              <div
                key={card.id}
                className={`transform transition-all duration-200 shrink-0 ${
                  isSelected ? 'z-30 -translate-y-3.5 scale-105' : 'hover:z-20 hover:-translate-y-1'
                }`}
                style={{
                  zIndex: isSelected ? 30 : index + 1,
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

      {/* Scroll indicator hint if player has many cards on mobile */}
      {cardCount > 5 && (
        <div className="text-[10px] text-[var(--theme-text-muted)] -mt-1 mb-0.5 sm:hidden">
          Swipe sideways to view all cards
        </div>
      )}
    </div>
  );
};

