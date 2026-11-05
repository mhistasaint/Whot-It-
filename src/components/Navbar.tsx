import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface NavbarProps {
  gems: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
  onOpenDailyReward: () => void;
  onOpenGemShop: () => void;
  onNewMatch: () => void;
  freePeeksRemaining: number;
  onTriggerPeek: () => void;
  canPeek: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  gems,
  soundEnabled,
  onToggleSound,
  onOpenHowToPlay,
  onOpenStats,
  onOpenDailyReward,
  onOpenGemShop,
  onNewMatch,
  freePeeksRemaining,
  onTriggerPeek,
  canPeek,
}) => {
  return (
    <header className="w-full bg-[#08291F]/95 border-b border-[#176B45]/60 px-4 md:px-6 py-2.5 backdrop-blur-md sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#123D2B] border border-[#D7B45A] flex items-center justify-center text-[#D7B45A] font-serif font-black text-sm shadow-sm">
            W
          </div>
          <span className="font-display font-black text-lg md:text-xl tracking-tight text-[#F7F3E8] whitespace-nowrap">
            WHOT <span className="text-[#D7B45A]">It!</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-4 md:gap-6 text-xs md:text-sm font-medium text-[#F7F3E8]/80 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={onOpenHowToPlay}
            className="hover:text-[#D7B45A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            How to Play
          </button>
          <button
            onClick={onOpenStats}
            className="hover:text-[#D7B45A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Statistics
          </button>
          <button
            onClick={onOpenDailyReward}
            className="hover:text-[#D7B45A] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>Daily Gift</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#7CCB75]" />
          </button>
          <button
            onClick={onOpenGemShop}
            className="hover:text-[#D7B45A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Gem Shop
          </button>
        </nav>

        {/* Zone 3: Actions & Gems & Peek */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 text-[#F7F3E8]/70 hover:text-[#F7F3E8] hover:bg-[#123D2B] rounded-lg transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>

          {/* Peek Next Card Button */}
          <button
            onClick={onTriggerPeek}
            disabled={!canPeek}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 cursor-pointer ${
              freePeeksRemaining > 0
                ? 'bg-[#176B45] text-[#F7F3E8] border-[#7CCB75]/50 hover:bg-[#123D2B]'
                : 'bg-[#08291F] text-[#D7B45A] border-[#D7B45A]/50 hover:bg-[#123D2B]'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            title="Peek what the next opponent plans to play"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D7B45A]" />
            <span className="hidden sm:inline">Peek Card</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-black/30 font-mono">
              {freePeeksRemaining > 0 ? 'FREE' : '100💎'}
            </span>
          </button>

          {/* Gem Balance Counter */}
          <button
            onClick={onOpenGemShop}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#123D2B] border border-[#D7B45A]/40 hover:border-[#D7B45A] text-[#F7F3E8] text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Gem balance (Click to open Gem Shop)"
          >
            <span>💎</span>
            <span className="font-mono text-[#D7B45A]">{gems}</span>
          </button>

          {/* New Match Button */}
          <button
            onClick={onNewMatch}
            className="hidden lg:inline-flex px-3 py-1.5 text-xs font-bold text-[#08291F] bg-[#D7B45A] hover:bg-[#c2a24c] rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            New Match
          </button>
        </div>
      </div>
    </header>
  );
};
