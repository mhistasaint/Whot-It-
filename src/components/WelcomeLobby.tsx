import React from 'react';
import { GameMode, BotDifficulty, PlayerAvatar } from '../game/types';
import { AvatarView } from './AvatarView';

interface WelcomeLobbyProps {
  playerName: string;
  avatar: PlayerAvatar;
  gems: number;
  canClaimDailyReward: boolean;
  canUseFreePeek: boolean;
  selectedMode: GameMode;
  selectedDifficulty: BotDifficulty;
  onSelectMode: (mode: GameMode) => void;
  onSelectDifficulty: (difficulty: BotDifficulty) => void;
  onPlayGame: () => void;
  onOpenAvatarStudio: () => void;
  onOpenDailyBonus: () => void;
  onOpenGemShop: () => void;
  onOpenStats: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenMultiplayer: () => void;
}

const MODES: Array<{ id: GameMode; name: string; opponents: number; desc: string; icon: string }> = [
  { id: '1v1', name: '1 vs 1 Duel', opponents: 1, desc: 'Fast head-to-head showdown', icon: '⚔️' },
  { id: '1v2', name: '1 vs 2 Trio', opponents: 2, desc: '3-player tactical clash', icon: '⚡' },
  { id: '1v3', name: '1 vs 3 Classic', opponents: 3, desc: 'Authentic 4-seat table', icon: '👑' },
  { id: '1v4', name: '1 vs 4 Grand', opponents: 4, desc: 'High-stakes 5-player market', icon: '🔥' },
];

const DIFFICULTIES: Array<{ id: BotDifficulty; label: string; desc: string }> = [
  { id: 'EASY', label: 'Easy', desc: 'Direct moves, beginner-friendly' },
  { id: 'MEDIUM', label: 'Medium', desc: 'Balanced strategy & tactics' },
  { id: 'HARD', label: 'Hard', desc: 'Aggressive card counting bots' },
];

export const WelcomeLobby: React.FC<WelcomeLobbyProps> = ({
  playerName,
  avatar,
  gems,
  canClaimDailyReward,
  canUseFreePeek,
  selectedMode,
  selectedDifficulty,
  onSelectMode,
  onSelectDifficulty,
  onPlayGame,
  onOpenAvatarStudio,
  onOpenDailyBonus,
  onOpenGemShop,
  onOpenStats,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenMultiplayer,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 md:py-8 flex flex-col justify-between min-h-[85vh] select-none animate-fade-in">
      
      {/* Lobby Top Banner / Identity Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#123D2B]/90 border border-[#176B45] rounded-3xl p-4 md:p-6 shadow-xl backdrop-blur-sm">
        
        {/* Left: Player Profile Badge */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div
            onClick={onOpenAvatarStudio}
            className="cursor-pointer relative group"
            title="Click to customize avatar"
          >
            <AvatarView avatar={avatar} name={playerName} size="lg" />
            <span className="absolute -bottom-1 -right-1 bg-[#D7B45A] text-[#08291F] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#08291F] shadow group-hover:scale-110 transition-transform">
              Edit
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-lg md:text-xl text-[#F7F3E8] tracking-tight">
                {playerName}
              </h2>
              <span className="text-[10px] uppercase font-bold text-[#D7B45A] px-2 py-0.5 rounded-full bg-[#D7B45A]/15 border border-[#D7B45A]/30">
                Challenger
              </span>
            </div>
            <p className="text-xs text-[#F7F3E8]/60 mt-0.5">
              Welcome back to the WHOT table!
            </p>
          </div>
        </div>

        {/* Right: Quick Action Chips (Gems, Daily Gift, Free Peek) */}
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end flex-wrap">
          {/* Daily Reward Badge */}
          <button
            onClick={onOpenDailyBonus}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              canClaimDailyReward
                ? 'bg-[#D7B45A] text-[#08291F] border-[#D7B45A] shadow-md animate-bounce'
                : 'bg-[#08291F] text-[#F7F3E8]/80 border-[#176B45]'
            }`}
          >
            <span>🎁</span>
            <span>Daily Bonus</span>
            {canClaimDailyReward && <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />}
          </button>

          {/* Daily Free Peek Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#08291F] border border-[#176B45] text-xs">
            <span className="text-[#D7B45A]">👁️</span>
            <span className="text-[11px] text-[#F7F3E8]/70">Daily Peek:</span>
            <span className="font-bold text-[#7CCB75]">
              {canUseFreePeek ? 'Ready' : 'Used'}
            </span>
          </div>

          {/* Gem Balance */}
          <button
            onClick={onOpenGemShop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#08291F] border border-[#D7B45A]/40 hover:border-[#D7B45A] text-[#F7F3E8] text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <span>💎</span>
            <span className="font-mono text-[#D7B45A]">{gems}</span>
            <span className="text-[#7CCB75] text-[10px] bg-[#7CCB75]/20 px-1 rounded">+</span>
          </button>
        </div>
      </div>

      {/* Main Game Setup Centerpiece */}
      <div className="my-6 md:my-8 bg-[#08291F]/90 border-2 border-[#123D2B] rounded-3xl p-5 md:p-8 shadow-2xl">
        
        {/* Game Mode Selector Cards */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-extrabold text-base md:text-lg text-[#F7F3E8] tracking-tight">
                Select Game Mode
              </h3>
              <p className="text-xs text-[#F7F3E8]/60">
                Choose the number of computer opponents at your table
              </p>
            </div>
            <span className="text-xs font-bold text-[#D7B45A] hidden sm:inline">
              Selected: {selectedMode}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {MODES.map(mode => {
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => onSelectMode(mode.id)}
                  className={`p-3.5 md:p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-[#D7B45A] bg-[#176B45] shadow-lg ring-2 ring-[#D7B45A]'
                      : 'border-[#176B45]/60 bg-[#123D2B]/50 hover:border-[#D7B45A]/50 hover:bg-[#123D2B]'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 text-[9px] font-extrabold uppercase bg-[#D7B45A] text-[#08291F] px-1.5 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                  <span className="text-2xl mb-1.5 block">{mode.icon}</span>
                  <h4 className="font-display font-extrabold text-sm md:text-base text-[#F7F3E8]">
                    {mode.name}
                  </h4>
                  <span className="text-xs text-[#D7B45A] font-semibold block mt-0.5">
                    {mode.opponents} Opponent{mode.opponents > 1 ? 's' : ''}
                  </span>
                  <p className="text-[11px] text-[#F7F3E8]/60 mt-1 leading-snug">
                    {mode.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-8 pt-4 border-t border-[#176B45]/60">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-extrabold text-sm md:text-base text-[#F7F3E8] tracking-tight">
                Computer Difficulty
              </h3>
              <p className="text-xs text-[#F7F3E8]/60">
                Directly influences bot tactical logic and special card responses
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {DIFFICULTIES.map(d => {
              const isSelected = selectedDifficulty === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => onSelectDifficulty(d.id)}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#D7B45A] bg-[#D7B45A] text-[#08291F] font-bold shadow-md ring-2 ring-[#D7B45A]'
                      : 'border-[#176B45] bg-[#123D2B] text-[#F7F3E8]/80 hover:border-[#D7B45A]/50'
                  }`}
                >
                  <span className="font-display font-black text-xs md:text-sm block">
                    {d.label}
                  </span>
                  <span className={`text-[10px] hidden sm:block leading-tight mt-0.5 ${isSelected ? 'text-[#08291F]/80' : 'text-[#F7F3E8]/50'}`}>
                    {d.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prominent PLAY MATCH Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onPlayGame}
            className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-[#D7B45A] hover:bg-[#c2a24c] text-[#08291F] font-display font-black text-base md:text-lg tracking-wide shadow-2xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-2 border-[#D7B45A]"
          >
            <span>▶</span> PLAY MATCH ({selectedMode} · {selectedDifficulty})
          </button>
        </div>
      </div>

      {/* Lobby Navigation Hub (Multiplayer, Stats, Rules, Settings) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={onOpenMultiplayer}
          className="p-3 rounded-2xl bg-[#123D2B] border border-[#176B45] hover:border-[#D7B45A] transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xl">🌐</span>
            <span className="text-[9px] font-bold text-[#D7B45A] bg-[#D7B45A]/15 px-1.5 py-0.2 rounded-full">
              Preview
            </span>
          </div>
          <span className="font-display font-bold text-xs text-[#F7F3E8] group-hover:text-[#D7B45A] block">
            Online Multiplayer
          </span>
          <span className="text-[10px] text-[#F7F3E8]/50">
            Private tables & codes
          </span>
        </button>

        <button
          onClick={onOpenStats}
          className="p-3 rounded-2xl bg-[#123D2B] border border-[#176B45] hover:border-[#D7B45A] transition-all text-left group cursor-pointer"
        >
          <span className="text-xl mb-1 block">📊</span>
          <span className="font-display font-bold text-xs text-[#F7F3E8] group-hover:text-[#D7B45A] block">
            Player Records
          </span>
          <span className="text-[10px] text-[#F7F3E8]/50">
            Win rate & card stats
          </span>
        </button>

        <button
          onClick={onOpenHowToPlay}
          className="p-3 rounded-2xl bg-[#123D2B] border border-[#176B45] hover:border-[#D7B45A] transition-all text-left group cursor-pointer"
        >
          <span className="text-xl mb-1 block">📖</span>
          <span className="font-display font-bold text-xs text-[#F7F3E8] group-hover:text-[#D7B45A] block">
            Rules & Deck Guide
          </span>
          <span className="text-[10px] text-[#F7F3E8]/50">
            Special cards breakdown
          </span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-3 rounded-2xl bg-[#123D2B] border border-[#176B45] hover:border-[#D7B45A] transition-all text-left group cursor-pointer"
        >
          <span className="text-xl mb-1 block">⚙️</span>
          <span className="font-display font-bold text-xs text-[#F7F3E8] group-hover:text-[#D7B45A] block">
            Audio & Themes
          </span>
          <span className="text-[10px] text-[#F7F3E8]/50">
            Music, speed & felt colors
          </span>
        </button>
      </div>
    </div>
  );
};
