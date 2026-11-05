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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#123D2B] border border-[#D7B45A] rounded-2xl shadow-2xl p-6 text-[#F7F3E8]">
        <div className="flex items-center justify-between border-b border-[#176B45] pb-3 mb-4">
          <h2 className="font-display font-extrabold text-xl text-[#F7F3E8] flex items-center gap-2">
            <span>📊</span> Match Statistics
          </h2>
          <button
            onClick={onClose}
            className="text-xs text-[#F7F3E8]/60 hover:text-[#F7F3E8] p-1.5"
          >
            ✕ Close
          </button>
        </div>

        {/* Primary Win/Loss metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-[#08291F] border border-[#176B45] rounded-xl p-3">
            <span className="text-[10px] uppercase tracking-wider text-[#F7F3E8]/70 block">
              Played
            </span>
            <span className="font-display font-black text-xl text-[#F7F3E8]">
              {stats.matchesPlayed}
            </span>
          </div>
          <div className="bg-[#08291F] border border-[#176B45] rounded-xl p-3">
            <span className="text-[10px] uppercase tracking-wider text-[#F7F3E8]/70 block">
              Victories
            </span>
            <span className="font-display font-black text-xl text-[#7CCB75]">
              {stats.wins}
            </span>
          </div>
          <div className="bg-[#08291F] border border-[#176B45] rounded-xl p-3">
            <span className="text-[10px] uppercase tracking-wider text-[#F7F3E8]/70 block">
              Win Rate
            </span>
            <span className="font-display font-black text-xl text-[#D7B45A]">
              {winRate}%
            </span>
          </div>
        </div>

        {/* Tactical breakdown */}
        <div className="bg-[#08291F] border border-[#176B45] rounded-xl p-4 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[#F7F3E8]/70">Total Cards Played:</span>
            <span className="font-bold text-[#F7F3E8]">{stats.cardsPlayed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#F7F3E8]/70">WHOT 20 Wilds Called:</span>
            <span className="font-bold text-[#D7B45A]">{stats.whotsPlayed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#F7F3E8]/70">Hold Ons (1) Executed:</span>
            <span className="font-bold text-[#F7F3E8]">{stats.holdOnsPlayed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#F7F3E8]/70">General Markets (14) Called:</span>
            <span className="font-bold text-[#F7F3E8]">{stats.generalMarketsPlayed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#F7F3E8]/70">Penalties Stacked (2s & 5s):</span>
            <span className="font-bold text-[#7CCB75]">{stats.penaltiesStacked}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#F7F3E8]/70">Peeks Used:</span>
            <span className="font-bold text-[#D7B45A]">{stats.peeksUsed}</span>
          </div>
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-lg bg-[#176B45] hover:bg-[#123D2B] text-[#F7F3E8] border border-[#7CCB75]/40 text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
