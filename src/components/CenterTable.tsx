import React from 'react';
import { Card, CardShape, PendingPenalty } from '../game/types';
import { CardView, ShapeIcon } from './CardView';

interface CenterTableProps {
  drawPileCount: number;
  discardPile: Card[];
  activeShape: CardShape;
  activeNumber: number;
  pendingPenalty: PendingPenalty | null;
  isHumanTurn: boolean;
  canHumanDraw: boolean;
  onDrawClick: () => void;
  statusMessage?: string;
  turnTimeRemaining?: number;
}

export const CenterTable: React.FC<CenterTableProps> = ({
  drawPileCount,
  discardPile,
  activeShape,
  activeNumber,
  pendingPenalty,
  isHumanTurn,
  canHumanDraw,
  onDrawClick,
  statusMessage,
  turnTimeRemaining,
}) => {
  const topCard = discardPile[discardPile.length - 1];
  const previousCard = discardPile.length > 1 ? discardPile[discardPile.length - 2] : null;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-xl mx-auto py-1 sm:py-2 select-none text-[var(--theme-text-primary)]">
      {/* Active Shape & Match Hint: Plain text fitting on one line without any enclosing shape */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-[10px] sm:text-xs whitespace-nowrap text-center">
        <span className="text-[var(--theme-text-muted)] font-medium">Shape:</span>
        <span className="font-display font-black text-[var(--theme-gold)] tracking-wide uppercase flex items-center gap-1">
          <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B91C1C] inline-block bg-[#FDFBF7] p-0.5 rounded shrink-0">
            <ShapeIcon shape={activeShape} className="w-full h-full" />
          </span>
          {activeShape}
        </span>
        <span className="text-[var(--theme-gold)]/40 mx-0.5">·</span>
        <span className="text-[var(--theme-text-muted)] font-medium">Match:</span>
        <strong className="text-[var(--theme-text-primary)] font-bold">
          {activeShape} or {activeNumber}
        </strong>
      </div>

      {/* Pending Penalty Alert Banner */}
      {pendingPenalty && (
        <div className="mb-2 sm:mb-3 animate-bounce flex items-center gap-2 bg-[#991B1B]/95 border border-[#FCA5A5] text-[#FDFBF7] text-xs md:text-sm font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>
            {pendingPenalty.type === 'PICK_TWO' ? 'Pick Two Stacking' : 'Pick Three Stacking'}: Draw +{pendingPenalty.amount} or Play {pendingPenalty.type === 'PICK_TWO' ? '2' : '5'}!
          </span>
        </div>
      )}

      {/* Main Table Decks (Draw Pile + Discard Pile) */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-10 my-1">
        {/* Draw Pile / General Market (Direct Tap to Pick from Market) */}
        <div className="flex flex-col items-center">
          <div
            onClick={isHumanTurn && canHumanDraw ? onDrawClick : undefined}
            className={`relative group ${isHumanTurn && canHumanDraw ? 'cursor-pointer' : 'cursor-default'}`}
            title={isHumanTurn && canHumanDraw ? 'Tap to draw from Market' : undefined}
          >
            {/* Layered Deck effect */}
            {drawPileCount > 2 && (
              <div className="absolute inset-0 translate-x-1 sm:translate-x-1.5 translate-y-1 sm:translate-y-1.5 bg-[var(--theme-bg-main)] border border-[var(--theme-gold)]/20 rounded-lg pointer-events-none" />
            )}
            {drawPileCount > 1 && (
              <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-[var(--theme-bg-surface)] border border-[var(--theme-gold)]/30 rounded-lg pointer-events-none" />
            )}
            <CardView
              faceDown
              size="table"
              isPlayable={isHumanTurn && canHumanDraw}
              className={`transition-all duration-200 ${
                isHumanTurn && canHumanDraw
                  ? 'ring-2 ring-[var(--theme-gold)] hover:scale-105 active:scale-95 shadow-xl hover:ring-offset-2 hover:ring-offset-[var(--theme-bg-main)]'
                  : 'cursor-default opacity-90'
              }`}
            />
            {/* Draw Pile Count Badge */}
            <div className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 border font-display font-black text-[9px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap transition-all ${
              isHumanTurn && canHumanDraw
                ? 'bg-[var(--theme-gold)] text-[var(--theme-accent-text)] border-[var(--theme-gold)] animate-pulse'
                : 'bg-[var(--theme-bg-main)] border-[var(--theme-gold)]/40 text-[var(--theme-gold)]'
            }`}>
              {drawPileCount} Market {isHumanTurn && canHumanDraw ? '· Tap' : ''}
            </div>
          </div>
        </div>

        {/* Central Discard Pile */}
        <div className="flex flex-col items-center">
          <div className="relative" id="table-discard-pile">
            {/* Previous card peek for realism */}
            {previousCard && (
              <div
                className="absolute inset-0 transform -rotate-6 pointer-events-none opacity-50 scale-95"
              >
                <CardView card={previousCard} size="table" />
              </div>
            )}
            {/* Top active card with fluid play transition animation */}
            <div
              key={topCard ? topCard.id : 'empty'}
              className="transform rotate-1 transition-transform animate-card-play"
            >
              <CardView card={topCard} size="table" />
            </div>
          </div>
          <span className="mt-2 text-[10px] sm:text-[11px] font-medium text-[var(--theme-text-muted)]">
            Discard Pile ({discardPile.length})
          </span>
        </div>
      </div>
    </div>
  );
};
