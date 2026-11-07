import React from 'react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-gold)] rounded-2xl shadow-2xl p-4 sm:p-6 text-[var(--theme-text-primary)] max-h-[92dvh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3 mb-4">
          <h2 className="font-display font-extrabold text-xl text-[var(--theme-text-primary)] flex items-center gap-2">
            <span>📖</span> How to Play WHOT It!
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--theme-bg-main)] border border-[var(--theme-border)] hover:border-red-500/40 text-[var(--theme-text-muted)] hover:text-red-400 flex items-center justify-center text-sm font-bold cursor-pointer transition-all active:scale-95"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 text-xs leading-relaxed text-[var(--theme-text-primary)]/90">
          {/* Objective */}
          <div>
            <h3 className="font-display font-bold text-sm text-[var(--theme-accent)] mb-1">
              Objective & Setup
            </h3>
            <p>
              WHOT is Nigeria’s national card game! Compete against 3 computer opponents (Chidi, Amina, and Femi).
              Each player starts with 6 cards. The first player to empty all cards from their hand wins the match!
            </p>
          </div>

          {/* Authentic 54-Card Deck */}
          <div>
            <h3 className="font-display font-bold text-sm text-[var(--theme-accent)] mb-1">
              Authentic 54-Card Deck Distribution
            </h3>
            <p className="mb-2">
              Unlike standard playing cards, Nigerian Whot uses 5 geometric shapes and five WHOT 20 wild cards:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[var(--theme-bg-main)] p-3 rounded-xl border border-[var(--theme-border)]">
              <div>
                <strong className="text-[#FDFBF7]">Circle (Ball):</strong> 12 cards (1-5, 7, 8, 10-14)
              </div>
              <div>
                <strong className="text-[#FDFBF7]">Triangle (Angle):</strong> 12 cards (1-5, 7, 8, 10-14)
              </div>
              <div>
                <strong className="text-[#FDFBF7]">Cross:</strong> 9 cards (1-3, 5, 7, 10, 11, 13, 14)
              </div>
              <div>
                <strong className="text-[#FDFBF7]">Square (Carpet):</strong> 9 cards (1-3, 5, 7, 10, 11, 13, 14)
              </div>
              <div>
                <strong className="text-[#FDFBF7]">Star:</strong> 7 cards (1-5, 7, 8)
              </div>
              <div>
                <strong className="text-[var(--theme-accent)]">WHOT 20:</strong> 5 wild cards
              </div>
            </div>
            <p className="mt-1.5 text-[11px] text-[var(--theme-accent)]">
              * Notice: There are strictly NO 6s and NO 9s in authentic Nigerian Whot!
            </p>
          </div>

          {/* Matching Rules */}
          <div>
            <h3 className="font-display font-bold text-sm text-[var(--theme-accent)] mb-1">
              Card Matching & Going to Market
            </h3>
            <p>
              On your turn, you must play a card that matches the top discard card by <strong>Shape</strong> OR by <strong>Number</strong>.
              If you have no legal card to play, you must <strong>Draw 1 Card</strong> from the Market (the draw pile) and end your turn. You cannot immediately play the card you just drew.
            </p>
          </div>

          {/* Special Cards */}
          <div>
            <h3 className="font-display font-bold text-sm text-[var(--theme-accent)] mb-1">
              Special Card Powers
            </h3>
            <div className="space-y-2">
              <div className="bg-[var(--theme-bg-main)] p-2.5 rounded-lg border border-[var(--theme-border)]">
                <strong className="text-[var(--theme-accent)]">Card 1 — Hold On:</strong>
                <span className="block mt-0.5">The player who plays 1 immediately takes another turn! It does not skip other players.</span>
              </div>
              <div className="bg-[var(--theme-bg-main)] p-2.5 rounded-lg border border-[var(--theme-border)]">
                <strong className="text-[var(--theme-accent)]">Card 2 — Pick Two (Stackable):</strong>
                <span className="block mt-0.5">The next player must play another 2 to pass the penalty onward (+4, +6...), or draw the full accumulated penalty and lose their turn.</span>
              </div>
              <div className="bg-[var(--theme-bg-main)] p-2.5 rounded-lg border border-[var(--theme-border)]">
                <strong className="text-[var(--theme-accent)]">Card 5 — Pick Three (Stackable):</strong>
                <span className="block mt-0.5">The next player must play another 5 to pass the penalty onward (+6, +9...), or draw the full penalty and lose their turn.</span>
              </div>
              <div className="bg-[var(--theme-bg-main)] p-2.5 rounded-lg border border-[var(--theme-border)]">
                <strong className="text-[var(--theme-accent)]">Card 8 — Suspension:</strong>
                <span className="block mt-0.5">Normal 8 skips the very next player. <strong>Star 8 skips the next TWO players!</strong></span>
              </div>
              <div className="bg-[var(--theme-bg-main)] p-2.5 rounded-lg border border-[var(--theme-border)]">
                <strong className="text-[var(--theme-accent)]">Card 14 — General Market:</strong>
                <span className="block mt-0.5">Every other active player must immediately draw 1 card from the market, and the player who played 14 plays again!</span>
              </div>
              <div className="bg-[var(--theme-bg-main)] p-2.5 rounded-lg border border-[var(--theme-border)]">
                <strong className="text-[var(--theme-accent)]">Card 20 — WHOT Wild:</strong>
                <span className="block mt-0.5">Can be played onto any card. The player chooses which shape must be played next.</span>
              </div>
            </div>
          </div>

          {/* Signature Feature */}
          <div>
            <h3 className="font-display font-bold text-sm text-[var(--theme-accent)] mb-1">
              Signature Feature: Peek Next Card
            </h3>
            <p>
              Use the Peek button anytime to preview the exact card the upcoming computer opponent plans to play on their turn!
              Every player gets <strong>1 Free Peek per calendar day</strong>, after which peeks cost 100 gems with explicit confirmation.
            </p>
          </div>

          {/* Player Level, Tier & XP Calculation */}
          <div className="bg-[var(--theme-bg-main)] p-4 rounded-xl border border-[var(--theme-gold)]/40 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h3 className="font-display font-black text-sm text-[var(--theme-gold)]">
                Player Level, Rank Tiers & XP Calculation
              </h3>
            </div>
            <p className="text-xs text-[var(--theme-text-muted)]">
              Your profile rank, level, and tier progress dynamically with every match and tactical decision at the WHOT table:
            </p>

            {/* XP Scoring Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-[var(--theme-bg-surface)] border border-[var(--theme-border)]">
                <span className="text-[var(--theme-accent)] font-bold block">+120 XP</span>
                <span className="text-[var(--theme-text-muted)]">Match Victory</span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--theme-bg-surface)] border border-[var(--theme-border)]">
                <span className="text-[var(--theme-accent)] font-bold block">+30 XP</span>
                <span className="text-[var(--theme-text-muted)]">Match Completed</span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--theme-bg-surface)] border border-[var(--theme-border)]">
                <span className="text-[var(--theme-accent)] font-bold block">+5 XP</span>
                <span className="text-[var(--theme-text-muted)]">Per Card Played</span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--theme-bg-surface)] border border-[var(--theme-border)]">
                <span className="text-[var(--theme-accent)] font-bold block">+15 XP</span>
                <span className="text-[var(--theme-text-muted)]">WHOT 20 Played</span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--theme-bg-surface)] border border-[var(--theme-border)]">
                <span className="text-[var(--theme-accent)] font-bold block">+25 XP</span>
                <span className="text-[var(--theme-text-muted)]">Penalty Defended/Stacked</span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--theme-bg-surface)] border border-[var(--theme-border)]">
                <span className="text-[var(--theme-accent)] font-bold block">+20 XP</span>
                <span className="text-[var(--theme-text-muted)]">General Market Called</span>
              </div>
            </div>

            {/* Level & Rank Tiers Breakdown */}
            <div className="pt-2 border-t border-[var(--theme-border)] text-[11px] space-y-1.5">
              <div className="flex justify-between items-center">
                <strong className="text-[var(--theme-text-primary)]">Level Milestones:</strong>
                <span className="text-[var(--theme-accent)] font-mono">250 XP per Level</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                <div className="flex items-center gap-2 p-1.5 rounded-md bg-[var(--theme-bg-surface)]/70">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CD7F32]" />
                  <span><strong>Bronze:</strong> Level 1 – 2</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md bg-[var(--theme-bg-surface)]/70">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C0C0C0]" />
                  <span><strong>Silver:</strong> Level 3 – 5</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md bg-[var(--theme-bg-surface)]/70">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700]" />
                  <span><strong>Gold:</strong> Level 6 – 9</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md bg-[var(--theme-bg-surface)]/70">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                  <span><strong>Diamond:</strong> Level 10 – 14</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md bg-[var(--theme-bg-surface)]/70 sm:col-span-2 text-[var(--theme-gold)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-gold)]" />
                  <span><strong>Naija Champion:</strong> Level 15+ (Master of the Table)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-[var(--theme-border)] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] text-xs font-bold transition-all cursor-pointer"
          >
            Got it, Let&apos;s Play!
          </button>
        </div>
      </div>
    </div>
  );
};
