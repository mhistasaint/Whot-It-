import React from 'react';
import { MatchStats } from '../services/storage';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: MatchStats;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  const winRate = stats.matchesPlayed > 0
    ? Math.round((stats.wins / stats.matchesPlayed) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-[var(--theme-bg-surface)] border border-[var(--theme-gold)] rounded-2xl shadow-2xl p-4 sm:p-6 text-[var(--theme-text-primary)] max-h-[92dvh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3 mb-4">
          <h2 className="font-display font-extrabold text-xl text-[var(--theme-text-primary)] flex items-center gap-2">
            <span>📊</span> Match Statistics
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--theme-bg-main)] border border-[var(--theme-border)] hover:border-red-500/40 text-[var(--theme-text-muted)] hover:text-red-400 flex items-center justify-center text-sm font-bold cursor-pointer transition-all active:scale-95"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Primary Win/Loss metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-xl p-3">
            <span className="text-[10px] uppercase tracking-wider text-[var(--theme-text-muted)] block">
              Played
            </span>
            <span className="font-display font-black text-xl text-[var(--theme-text-primary)]">
              {stats.matchesPlayed}
            </span>
          </div>
          <div className="bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-xl p-3">
            <span className="text-[10px] uppercase tracking-wider text-[var(--theme-text-muted)] block">
              Victories
            </span>
            <span className="font-display font-black text-xl text-[var(--theme-accent)]">
              {stats.wins}
            </span>
          </div>
          <div className="bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-xl p-3">
            <span className="text-[10px] uppercase tracking-wider text-[var(--theme-text-muted)] block">
              Win Rate
            </span>
            <span className="font-display font-black text-xl text-[var(--theme-gold)]">
              {winRate}%
            </span>
          </div>
        </div>

        {/* Tactical breakdown */}
        <div className="bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-xl p-4 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[var(--theme-text-muted)]">Total Cards Played:</span>
            <span className="font-bold text-[var(--theme-text-primary)]">{stats.cardsPlayed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--theme-text-muted)]">WHOT 20 Wilds Called:</span>
            <span className="font-bold text-[var(--theme-accent)]">{stats.whotsPlayed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--theme-text-muted)]">Hold Ons (1) Executed:</span>
            <span className="font-bold text-[var(--theme-text-primary)]">{stats.holdOnsPlayed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--theme-text-muted)]">General Markets (14) Called:</span>
            <span className="font-bold text-[var(--theme-text-primary)]">{stats.generalMarketsPlayed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--theme-text-muted)]">Penalties Stacked (2s & 5s):</span>
            <span className="font-bold text-[var(--theme-accent)]">{stats.penaltiesStacked}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--theme-text-muted)]">Peeks Used:</span>
            <span className="font-bold text-[var(--theme-accent)]">{stats.peeksUsed}</span>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-sm font-bold text-[var(--theme-text-muted)] hover:text-red-400 hover:border-red-500/40 flex items-center justify-center cursor-pointer transition-all active:scale-95"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
