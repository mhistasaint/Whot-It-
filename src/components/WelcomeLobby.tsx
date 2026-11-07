import React, { useState } from 'react';
import { GameMode, BotDifficulty, PlayerAvatar, UserProfile } from '../game/types';
import { AvatarView } from './AvatarView';

interface WelcomeLobbyProps {
  playerName: string;
  avatar: PlayerAvatar;
  gems: number;
  canClaimDailyReward: boolean;
  canUseFreePeek: boolean;
  selectedMode: GameMode;
  selectedDifficulty: BotDifficulty;
  userProfile?: UserProfile;
  onSelectMode: (mode: GameMode) => void;
  onSelectDifficulty: (difficulty: BotDifficulty) => void;
  onPlayGame: () => void;
  onOpenAvatarStudio: () => void;
  onOpenDailyBonus: () => void;
  onOpenGemShop: () => void;
  onOpenStats?: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenMultiplayer: () => void;
  onOpenProfile?: () => void;
  onBackToWelcome?: () => void;
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
  userProfile,
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
  onOpenProfile,
  onBackToWelcome,
}) => {
  const [selectedModeStage, setSelectedModeStage] = useState<GameMode | null>(null);
  const activeModeObj = MODES.find(m => m.id === (selectedModeStage || selectedMode));
  return (
    <div
      className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-2 sm:py-4 md:py-6 flex flex-col justify-between min-h-[85vh] select-none animate-fade-in text-[var(--theme-text-primary)]"
      style={{
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right))',
        paddingTop: 'max(0.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
    >
      
      {/* Lobby Top Banner / Identity Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] rounded-3xl p-4 md:p-6 shadow-xl backdrop-blur-sm transition-colors duration-250">
        
        {/* Left: Player Profile Badge */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">

          <div
            onClick={onOpenProfile || onOpenAvatarStudio}
            className="cursor-pointer relative group shrink-0"
            title="Click to view/edit profile"
          >
            <AvatarView avatar={avatar} name={playerName} size="lg" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                onClick={onOpenProfile || onOpenAvatarStudio}
                className="font-display font-extrabold text-lg md:text-xl text-[var(--theme-text-primary)] tracking-tight hover:text-[var(--theme-gold)] transition-colors cursor-pointer"
              >
                {playerName}
              </h2>
              <span className="text-[10px] uppercase font-bold text-[var(--theme-gold)] px-2 py-0.5 rounded-full bg-[var(--theme-gold)]/15 border border-[var(--theme-gold)]/30">
                {userProfile?.title || 'Challenger'}
              </span>
              {userProfile && (
                <span className="text-[10px] font-bold text-[var(--theme-accent)] bg-[var(--theme-bg-main)] px-2 py-0.5 rounded-full border border-[var(--theme-border)]">
                  Lvl {userProfile.level} · {userProfile.rankTier}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
              {userProfile?.bio ? `"${userProfile.bio}"` : 'Welcome to the WHOT table!'}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Chips */}
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end flex-wrap">
          {/* Daily Reward Badge */}
          <button
            onClick={onOpenDailyBonus}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              canClaimDailyReward
                ? 'bg-[var(--theme-gold)] text-[var(--theme-accent-text)] border-[var(--theme-gold)] shadow-md animate-bounce'
                : 'bg-[var(--theme-bg-main)] text-[var(--theme-text-muted)] border-[var(--theme-border)]'
            }`}
          >
            <span>🎁</span>
            <span>Daily Bonus</span>
            {canClaimDailyReward && <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />}
          </button>

          {/* Daily Free Peek Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-xs">
            <span className="text-[var(--theme-gold)]">👁️</span>
            <span className="text-[11px] text-[var(--theme-text-muted)]">Daily Peek:</span>
            <span className="font-bold text-[var(--theme-accent)]">
              {canUseFreePeek ? 'Ready' : 'Used'}
            </span>
          </div>

          {/* Gem Balance */}
          <button
            onClick={onOpenGemShop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-gold)]/40 hover:border-[var(--theme-gold)] text-[var(--theme-text-primary)] text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <span>💎</span>
            <span className="font-mono text-[var(--theme-gold)]">{gems}</span>
            <span className="text-[var(--theme-accent)] text-[10px] bg-[var(--theme-bg-elevated)] px-1 rounded font-bold">+</span>
          </button>
        </div>
      </div>

      {/* Main Game Setup Centerpiece */}
      <div className="my-3 sm:my-4 md:my-6 bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-border)] rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-2xl transition-colors duration-250">
        {!selectedModeStage ? (
          /* Stage 1: Select Game Mode */
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display font-extrabold text-base sm:text-lg md:text-xl text-[var(--theme-text-primary)] tracking-tight">
                  Select Game Mode
                </h3>
                <p className="text-xs text-[var(--theme-text-muted)]">
                  Choose your table setup to proceed to difficulty and play
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {MODES.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => {
                    onSelectMode(mode.id);
                    setSelectedModeStage(mode.id);
                  }}
                  className="p-3 sm:p-4 rounded-2xl border border-[var(--theme-border)]/70 bg-[var(--theme-bg-main)]/60 hover:border-[var(--theme-gold)] hover:bg-[var(--theme-bg-elevated)] text-left transition-all cursor-pointer group hover:scale-[1.01] active:scale-95 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{mode.icon}</span>
                    <span className="text-xs font-bold text-[var(--theme-gold)] px-2 py-0.5 rounded-full bg-[var(--theme-gold)]/10 border border-[var(--theme-gold)]/20">
                      {mode.opponents} Bot{mode.opponents > 1 ? 's' : ''}
                    </span>
                  </div>
                  <h4 className="font-display font-extrabold text-base text-[var(--theme-text-primary)] group-hover:text-[var(--theme-gold)] transition-colors">
                    {mode.name}
                  </h4>
                  <p className="text-xs text-[var(--theme-text-muted)] mt-1 leading-snug">
                    {mode.desc}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[var(--theme-gold)]">
                    <span>Select Mode</span>
                    <span>→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Stage 2: Selected Mode Header with Cancel, Difficulty, and Play Button */
          <div className="space-y-6">
            {/* Mode Banner & Cancel Option */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)]">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeModeObj?.icon || '👑'}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--theme-gold)] bg-[var(--theme-gold)]/15 px-2 py-0.5 rounded-full">
                      Selected Mode
                    </span>
                    <span className="text-xs text-[var(--theme-text-muted)]">
                      {activeModeObj?.opponents} Computer Opponent{activeModeObj && activeModeObj.opponents > 1 ? 's' : ''}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-lg text-[var(--theme-text-primary)] mt-0.5">
                    {activeModeObj?.name}
                  </h3>
                </div>
              </div>

              {/* Cancel Button to Return to Mode Selection */}
              <button
                type="button"
                onClick={() => setSelectedModeStage(null)}
                className="px-3.5 py-2 rounded-xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] hover:border-red-500/60 hover:text-red-400 text-xs font-bold text-[var(--theme-text-muted)] transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
              >
                <span>✕</span>
                <span>Change Mode</span>
              </button>
            </div>

            {/* Difficulty Selector */}
            <div>
              <div className="mb-2.5">
                <h4 className="font-display font-extrabold text-sm md:text-base text-[var(--theme-text-primary)]">
                  Select Difficulty
                </h4>
                <p className="text-xs text-[var(--theme-text-muted)]">
                  Influence computer opponent tactical speed, card awareness and challenge
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {DIFFICULTIES.map(d => {
                  const isSelected = selectedDifficulty === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => onSelectDifficulty(d.id)}
                      className={`py-3 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--theme-gold)] bg-[var(--theme-gold)] text-[var(--theme-accent-text)] font-black shadow-md ring-2 ring-[var(--theme-gold)]'
                          : 'border-[var(--theme-border)] bg-[var(--theme-bg-main)] text-[var(--theme-text-muted)] hover:border-[var(--theme-gold)]/50'
                      }`}
                    >
                      <span className="font-display font-black text-xs md:text-sm block">
                        {d.label}
                      </span>
                      <span className={`text-[10px] hidden sm:block leading-tight mt-0.5 ${isSelected ? 'opacity-90' : 'text-[var(--theme-text-muted)]'}`}>
                        {d.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PLAY Action Button Alone */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onPlayGame}
                className="w-full sm:w-auto px-16 py-3.5 rounded-2xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-black text-base md:text-lg tracking-wide shadow-2xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-2 border-[var(--theme-accent)]"
              >
                <span>▶</span> PLAY
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lobby Navigation Hub (3 Clean Core Items) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <button
          onClick={onOpenProfile || onOpenAvatarStudio}
          className="p-2.5 sm:p-3.5 rounded-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] transition-all text-left group cursor-pointer"
        >
          <span className="text-xl mb-1 block">👤</span>
          <span className="font-display font-bold text-xs text-[var(--theme-text-primary)] group-hover:text-[var(--theme-gold)] block">
            My Profile
          </span>
          <span className="text-[10px] text-[var(--theme-text-muted)]">
            Stats, records & ID
          </span>
        </button>

        <button
          onClick={onOpenMultiplayer}
          className="p-3.5 rounded-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xl">🌐</span>
            <span className="text-[9px] font-bold text-[var(--theme-gold)] bg-[var(--theme-gold)]/15 px-1.5 py-0.2 rounded-full">
              Preview
            </span>
          </div>
          <span className="font-display font-bold text-xs text-[var(--theme-text-primary)] group-hover:text-[var(--theme-gold)] block">
            Online Multiplayer
          </span>
          <span className="text-[10px] text-[var(--theme-text-muted)]">
            Private tables & codes
          </span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-3.5 rounded-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] transition-all text-left group cursor-pointer"
        >
          <span className="text-xl mb-1 block">⚙️</span>
          <span className="font-display font-bold text-xs text-[var(--theme-text-primary)] group-hover:text-[var(--theme-gold)] block">
            Audio & Themes
          </span>
          <span className="text-[10px] text-[var(--theme-text-muted)]">
            Music, speed & 6 themes
          </span>
        </button>
      </div>
    </div>
  );
};
