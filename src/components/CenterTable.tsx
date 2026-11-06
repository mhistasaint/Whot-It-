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
      {/* Active Shape, Context Bar & 15s Countdown Timer */}
      <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        {/* Active Shape & Context Bar */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[var(--theme-bg-main)]/90 border border-[var(--theme-gold)]/40 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 shadow-md backdrop-blur-sm text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 font-medium text-[var(--theme-text-muted)]">
            <span>Shape:</span>
            <span className="font-display font-extrabold text-[var(--theme-gold)] tracking-wider uppercase flex items-center gap-1">
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B91C1C] inline-block bg-[#FDFBF7] p-0.5 rounded">
                <ShapeIcon shape={activeShape} className="w-full h-full" />
              </span>
              {activeShape}
            </span>
          </div>
          <span className="text-[var(--theme-gold)]/40">·</span>
          <div className="font-medium text-[var(--theme-text-muted)]">
            <span>Match:</span>{' '}
            <strong className="text-[var(--theme-text-primary)] font-bold">
              {activeShape} or {activeNumber}
            </strong>
          </div>
        </div>

        {/* 15s Countdown Timer for Human Player */}
        {isHumanTurn && turnTimeRemaining !== undefined && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold border transition-all shadow-md ${
              turnTimeRemaining <= 5
                ? 'bg-red-950/95 border-red-500 text-red-200 animate-pulse ring-2 ring-red-500/50'
                : 'bg-[var(--theme-bg-main)]/90 border-[var(--theme-gold)]/60 text-[var(--theme-gold)]'
            }`}
            title="15-second human turn countdown. Draws automatically if time runs out!"
          >
            <span className="text-xs sm:text-sm">{turnTimeRemaining <= 5 ? '⚠️' : '⏱️'}</span>
            <span className="font-mono font-black text-xs sm:text-sm tracking-tight">{turnTimeRemaining}s</span>
            <span className={`text-[10px] uppercase font-extrabold ${turnTimeRemaining <= 5 ? 'text-red-300' : 'text-[var(--theme-text-muted)]'}`}>
              {turnTimeRemaining <= 5 ? 'Auto-Draw!' : 'Your Turn'}
            </span>
          </div>
        )}
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
      <div className="flex items-center justify-center gap-5 sm:gap-8 md:gap-10 my-1">
        {/* Draw Pile / General Market */}
        <div className="flex flex-col items-center group">
          <div className="relative">
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
              onClick={isHumanTurn && canHumanDraw ? onDrawClick : undefined}
              className={`transition-all duration-200 ${
                isHumanTurn && canHumanDraw
                  ? 'ring-2 ring-[var(--theme-gold)] hover:scale-105 cursor-pointer shadow-xl'
                  : 'cursor-default opacity-90'
              }`}
            />
            {/* Draw Pile Count Badge */}
            <div className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 bg-[var(--theme-bg-main)] border border-[var(--theme-gold)]/40 text-[var(--theme-gold)] font-display font-black text-[9px] sm:text-xs px-2 py-0.5 rounded-full shadow whitespace-nowrap">
              {drawPileCount} Market
            </div>
          </div>
          {isHumanTurn && canHumanDraw && (
            <button
              onClick={onDrawClick}
              className="mt-3 sm:mt-4 px-3 sm:px-3.5 py-1.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-extrabold text-[11px] sm:text-xs rounded-lg shadow-md transition-all active:scale-95 cursor-pointer border border-[var(--theme-accent)] min-h-[36px] flex items-center"
            >
              Go to Market
            </button>
          )}
        </div>

        {/* Central Discard Pile */}
        <div className="flex flex-col items-center">
          <div className="relative">
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

      {/* Dynamic Status / Game Hint */}
      {statusMessage && (
        <div className="mt-2 sm:mt-3 text-center px-2">
          <p className="text-[11px] sm:text-xs md:text-sm text-[var(--theme-text-primary)] font-medium bg-[var(--theme-bg-main)]/80 border border-[var(--theme-border)] px-3 py-1 sm:py-1.5 rounded-xl max-w-md mx-auto shadow-sm">
            {statusMessage}
          </p>
        </div>
      )}
    </div>
  );
};
