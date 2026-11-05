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
}) => {
  const topCard = discardPile[discardPile.length - 1];
  const previousCard = discardPile.length > 1 ? discardPile[discardPile.length - 2] : null;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-xl mx-auto py-2">
      {/* Active Shape & Context Bar */}
      <div className="flex items-center gap-3 mb-3 bg-[#08291F]/90 border border-[#D7B45A]/30 rounded-full px-4 py-1.5 shadow-md backdrop-blur-sm">
        <div className="flex items-center gap-1.5 text-xs text-[#F7F3E8]/80 font-medium">
          <span>Active Shape:</span>
          <span className="font-display font-extrabold text-[#D7B45A] tracking-wider uppercase flex items-center gap-1">
            <ShapeIcon shape={activeShape} className="w-4 h-4 text-[#B91C1C]" />
            {activeShape}
          </span>
        </div>
        <span className="text-[#D7B45A]/40">·</span>
        <div className="text-xs text-[#F7F3E8]/80 font-medium">
          <span>Match:</span>{' '}
          <strong className="text-[#F7F3E8] font-bold">
            {activeShape} or {activeNumber}
          </strong>
        </div>
      </div>

      {/* Pending Penalty Alert Banner */}
      {pendingPenalty && (
        <div className="mb-3 animate-bounce flex items-center gap-2 bg-[#991B1B]/90 border border-[#FCA5A5] text-[#FDFBF7] text-xs md:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>
            {pendingPenalty.type === 'PICK_TWO' ? 'Pick Two Stacking' : 'Pick Three Stacking'}: Draw +{pendingPenalty.amount} Cards or Play another {pendingPenalty.type === 'PICK_TWO' ? '2' : '5'}!
          </span>
        </div>
      )}

      {/* Main Table Decks (Draw Pile + Discard Pile) */}
      <div className="flex items-center justify-center gap-6 md:gap-10">
        {/* Draw Pile / General Market */}
        <div className="flex flex-col items-center group">
          <div className="relative">
            {/* Layered Deck effect */}
            {drawPileCount > 2 && (
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-[#08291F] border border-[#D7B45A]/20 rounded-lg pointer-events-none" />
            )}
            {drawPileCount > 1 && (
              <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-[#123D2B] border border-[#D7B45A]/30 rounded-lg pointer-events-none" />
            )}
            <CardView
              faceDown
              size="lg"
              isPlayable={isHumanTurn && canHumanDraw}
              onClick={isHumanTurn && canHumanDraw ? onDrawClick : undefined}
              className={`transition-all duration-200 ${
                isHumanTurn && canHumanDraw
                  ? 'ring-2 ring-[#7CCB75] hover:scale-105 cursor-pointer shadow-lg'
                  : 'cursor-default opacity-90'
              }`}
            />
            {/* Draw Pile Count Badge */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#08291F] border border-[#D7B45A]/40 text-[#D7B45A] font-display font-bold text-[10px] md:text-xs px-2 py-0.5 rounded-full shadow whitespace-nowrap">
              {drawPileCount} Market
            </div>
          </div>
          {isHumanTurn && canHumanDraw && (
            <button
              onClick={onDrawClick}
              className="mt-4 px-3 py-1 bg-[#176B45] hover:bg-[#123D2B] text-[#F7F3E8] border border-[#7CCB75]/40 text-xs font-semibold rounded-md shadow-sm transition-all active:scale-95"
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
                className="absolute inset-0 transform -rotate-6 pointer-events-none opacity-60 scale-95"
              >
                <CardView card={previousCard} size="lg" />
              </div>
            )}
            {/* Top active card */}
            <div className="transform rotate-1 transition-transform">
              <CardView card={topCard} size="lg" />
            </div>
          </div>
          <span className="mt-2 text-[11px] font-medium text-[#F7F3E8]/60">
            Discard Pile ({discardPile.length})
          </span>
        </div>
      </div>

      {/* Dynamic Status / Game Hint */}
      {statusMessage && (
        <div className="mt-3 text-center">
          <p className="text-xs md:text-sm text-[#F7F3E8]/90 font-medium bg-[#08291F]/60 border border-[#176B45]/50 px-3 py-1 rounded-md max-w-md mx-auto">
            {statusMessage}
          </p>
        </div>
      )}
    </div>
  );
};
