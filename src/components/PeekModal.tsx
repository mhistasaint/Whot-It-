import React, { useState } from 'react';
import { PeekResult } from '../game/types';
import { CardView } from './CardView';

interface PeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFreePeek: boolean;
  gemBalance: number;
  onConfirmPaidPeek: () => boolean; // returns true if deducted
  onUseFreePeek?: () => void;
  onOpenGemShop: () => void;
  peekResult: PeekResult | null;
}

export const PeekModal: React.FC<PeekModalProps> = ({
  isOpen,
  onClose,
  isFreePeek,
  gemBalance,
  onConfirmPaidPeek,
  onUseFreePeek,
  onOpenGemShop,
  peekResult,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const cost = 100;
  const hasEnoughGems = gemBalance >= cost;

  const handleConfirm = () => {
    if (isProcessing) return;

    if (isFreePeek) {
      setIsProcessing(true);
      onUseFreePeek?.();
      setRevealed(true);
      setIsProcessing(false);
    } else {
      if (!hasEnoughGems) return;
      setIsProcessing(true);
      const success = onConfirmPaidPeek();
      if (success) {
        setRevealed(true);
      }
      setIsProcessing(false);
    }
  };

  const handleModalClose = () => {
    setRevealed(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#123D2B] border border-[#D7B45A] rounded-2xl shadow-2xl p-6 text-[#F7F3E8]">
        {!revealed ? (
          /* Confirmation Screen */
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#D7B45A]/20 border border-[#D7B45A] flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#D7B45A] fill-none stroke-current stroke-2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            <h2 className="font-display font-black text-xl text-[#F7F3E8] mb-1">
              Peek Next Card
            </h2>
            <p className="text-xs text-[#F7F3E8]/80 mb-4 max-w-sm">
              Discover the exact card the upcoming computer opponent intends to play on their next turn!
            </p>

            {/* Pricing details */}
            <div className="w-full p-4 rounded-xl bg-[#08291F] border border-[#176B45] mb-5 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#F7F3E8]/70">Peek Status:</span>
                <span className="font-bold text-[#D7B45A]">
                  {isFreePeek ? 'FREE (1st peek of match)' : 'PAID PEEK'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#F7F3E8]/70">Cost:</span>
                <span className="font-display font-extrabold text-sm text-[#F7F3E8]">
                  {isFreePeek ? '0 Gems' : '100 Gems'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#176B45]">
                <span className="text-[#F7F3E8]/70">Your Balance:</span>
                <span className="font-bold text-[#7CCB75]">{gemBalance} Gems</span>
              </div>
            </div>

            {!isFreePeek && !hasEnoughGems && (
              <div className="w-full p-3 mb-4 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                You need 100 gems to peek, but only have {gemBalance} gems.
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={handleModalClose}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#08291F] border border-[#176B45] text-xs font-semibold text-[#F7F3E8]/80 hover:bg-[#176B45] transition-all"
              >
                Cancel
              </button>

              {!isFreePeek && !hasEnoughGems ? (
                <button
                  onClick={() => {
                    handleModalClose();
                    onOpenGemShop();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#D7B45A] hover:bg-[#c2a24c] text-[#08291F] text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  Get Gems (Shop)
                </button>
              ) : (
                <button
                  disabled={isProcessing}
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#D7B45A] hover:bg-[#c2a24c] text-[#08291F] text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isFreePeek ? 'Use Free Peek' : 'Confirm & Peek (100 💎)'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Prediction Result Screen */
          <div className="flex flex-col items-center text-center animate-fade-in">
            <span className="text-[10px] uppercase tracking-widest text-[#D7B45A] font-bold mb-1">
              Secret Intel Revealed
            </span>
            <h2 className="font-display font-black text-xl text-[#F7F3E8] mb-3">
              {peekResult?.botName}&apos;s Next Intention
            </h2>

            {peekResult?.willDraw ? (
              <div className="flex flex-col items-center my-4 p-4 rounded-xl bg-[#08291F] border border-[#176B45] w-full max-w-xs">
                <div className="w-16 h-22 rounded-lg bg-[#123D2B] border-2 border-dashed border-[#D7B45A]/50 flex items-center justify-center text-2xl mb-2">
                  🛒
                </div>
                <span className="font-display font-bold text-sm text-[#F7F3E8]">
                  Opponent will draw a card.
                </span>
                <p className="text-xs text-[#F7F3E8]/70 mt-1 text-center">
                  {peekResult.reason}
                </p>
              </div>
            ) : peekResult?.card ? (
              <div className="flex flex-col items-center my-3">
                <div className="shadow-2xl transform scale-105 mb-2">
                  <CardView card={peekResult.card} size="lg" />
                </div>
                <div className="bg-[#08291F] border border-[#176B45] rounded-lg p-2.5 text-xs text-[#F7F3E8]/90 max-w-xs mt-2">
                  <p className="font-medium">{peekResult.reason}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#F7F3E8]/70 my-4">
                No predictable action.
              </p>
            )}

            <p className="text-[10px] text-[#F7F3E8]/50 mb-5">
              Note: This peek does not alter any cards, turn order, or player hands.
            </p>

            <button
              onClick={handleModalClose}
              className="w-full py-2.5 px-4 rounded-lg bg-[#176B45] hover:bg-[#123D2B] text-[#F7F3E8] border border-[#7CCB75]/40 text-xs font-bold transition-all active:scale-95 shadow-md"
            >
              Back to Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
