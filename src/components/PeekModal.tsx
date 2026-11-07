import React, { useState } from 'react';
import { PeekResult } from '../game/types';
import { CardView } from './CardView';

interface PeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDailyFreePeek: boolean;
  gemBalance: number;
  onConfirmPaidPeek: () => boolean; // returns true if deducted
  onUseDailyFreePeek?: () => void;
  onOpenGemShop: () => void;
  peekResult: PeekResult | null;
}

export const PeekModal: React.FC<PeekModalProps> = ({
  isOpen,
  onClose,
  isDailyFreePeek,
  gemBalance,
  onConfirmPaidPeek,
  onUseDailyFreePeek,
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

    if (isDailyFreePeek) {
      setIsProcessing(true);
      onUseDailyFreePeek?.();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-gold)] rounded-2xl shadow-2xl p-5 sm:p-6 text-[var(--theme-text-primary)]">
        {!revealed ? (
          /* Confirmation Screen */
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)] flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-[var(--theme-accent)] fill-none stroke-current stroke-2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            <h2 className="font-display font-black text-xl text-[var(--theme-text-primary)] mb-1">
              Peek Next Card
            </h2>
            <p className="text-xs text-[var(--theme-text-muted)] mb-4 max-w-sm">
              Discover the exact card the upcoming computer opponent intends to play on their turn!
            </p>

            {/* Pricing details */}
            <div className="w-full p-4 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] mb-5 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[var(--theme-text-muted)]">Reward Status:</span>
                <span className="font-bold text-[var(--theme-accent)]">
                  {isDailyFreePeek ? 'FREE Daily Peek (Once per calendar day)' : 'Paid Peek (Daily free peek used)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--theme-text-muted)]">Peek Cost:</span>
                <span className="font-display font-extrabold text-sm text-[var(--theme-text-primary)]">
                  {isDailyFreePeek ? '0 Gems (Free Today)' : '100 Gems'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--theme-border)]">
                <span className="text-[var(--theme-text-muted)]">Your Balance:</span>
                <span className="font-bold text-[var(--theme-accent)]">{gemBalance} Gems</span>
              </div>
            </div>

            {!isDailyFreePeek && !hasEnoughGems && (
              <div className="w-full p-3 mb-4 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                You need 100 gems to peek, but only have {gemBalance} gems.
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={handleModalClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-xs font-semibold text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-elevated)] transition-all cursor-pointer"
              >
                Cancel
              </button>

              {!isDailyFreePeek && !hasEnoughGems ? (
                <button
                  onClick={() => {
                    handleModalClose();
                    onOpenGemShop();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Get Gems (Shop)
                </button>
              ) : (
                <button
                  disabled={isProcessing}
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isDailyFreePeek ? 'Use Daily Free Peek' : 'Confirm & Peek (100 💎)'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Prediction Result Screen */
          <div className="flex flex-col items-center text-center animate-fade-in">
            <span className="text-[10px] uppercase tracking-widest text-[var(--theme-accent)] font-bold mb-1">
              Secret Intel Revealed
            </span>
            <h2 className="font-display font-black text-xl text-[var(--theme-text-primary)] mb-3">
              {peekResult?.botName}&apos;s Next Intention
            </h2>

            {peekResult?.willDraw ? (
              <div className="flex flex-col items-center my-4 p-4 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] w-full max-w-xs">
                <div className="w-16 h-22 rounded-lg bg-[var(--theme-bg-surface)] border-2 border-dashed border-[var(--theme-accent)]/50 flex items-center justify-center text-2xl mb-2">
                  🛒
                </div>
                <span className="font-display font-bold text-sm text-[var(--theme-text-primary)]">
                  Opponent will draw a card.
                </span>
                <p className="text-xs text-[var(--theme-text-muted)] mt-1 text-center">
                  {peekResult.reason}
                </p>
              </div>
            ) : peekResult?.card ? (
              <div className="flex flex-col items-center my-3">
                <div className="shadow-2xl transform scale-105 mb-2">
                  <CardView card={peekResult.card} size="lg" />
                </div>
                <div className="bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-lg p-2.5 text-xs text-[var(--theme-text-primary)]/90 max-w-xs mt-2">
                  <p className="font-medium">{peekResult.reason}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--theme-text-muted)] my-4">
                No predictable action.
              </p>
            )}

            <p className="text-[10px] text-[var(--theme-text-muted)] mb-5">
              Note: This peek does not alter any cards, turn order, or player hands.
            </p>

            <button
              onClick={handleModalClose}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--theme-accent)] text-[var(--theme-accent-text)] hover:bg-[var(--theme-accent-hover)] text-xs font-bold transition-all active:scale-95 shadow-md cursor-pointer"
            >
              Back to Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
