import React, { useState } from 'react';
import { GameMode, BotDifficulty, PlayerAvatar, UserProfile } from '../game/types';
import { AvatarView } from './AvatarView';
import { User, Globe, Settings } from 'lucide-react';

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
      className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-2 sm:py-4 flex flex-col gap-3 sm:gap-4 pb-20 select-none animate-fade-in text-[var(--theme-text-primary)]"
      style={{
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right))',
        paddingTop: 'max(0.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(3.5rem, env(safe-area-inset-bottom))',
      }}
    >
      {/* Lobby Top Banner: Player Identity Card */}
      <div
        onClick={onOpenProfile || onOpenAvatarStudio}
        className="flex items-center gap-3.5 sm:gap-4.5 bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xl backdrop-blur-sm transition-all cursor-pointer hover:border-[var(--theme-gold)] group"
        title="View & Edit Player Profile"
      >
        <div className="shrink-0 relative">
          <AvatarView avatar={avatar} name={playerName} size="lg" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Bold Player Name Heading & Level Beside It */}
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <h2 className="font-display font-black text-xl sm:text-2xl text-[var(--theme-text-primary)] tracking-tight group-hover:text-[var(--theme-gold)] transition-colors truncate">
              {playerName}
            </h2>
            <span className="text-[10px] sm:text-[11px] font-bold text-[var(--theme-text-primary)] bg-[var(--theme-bg-main)] px-2.5 py-0.5 rounded-md border border-[var(--theme-border)] shrink-0 whitespace-nowrap shadow-sm">
              Lvl {userProfile?.level ?? 1} · {userProfile?.rankTier || 'Bronze'}
            </span>
          </div>

          {/* Player Tag Under Username */}
          <div className="flex items-center gap-2 mb-1.5">
            {/* Solid colour rectangle tag based on selected theme */}
            <span className="text-[10px] sm:text-[11px] uppercase font-black text-[var(--theme-accent-text)] px-2.5 py-0.5 rounded-md bg-[var(--theme-accent)] shadow-sm shrink-0 tracking-wider whitespace-nowrap">
              {userProfile?.title || 'Naija Challenger'}
            </span>
          </div>

          {/* Bio Quote - Displays fully without truncation */}
          <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] italic leading-relaxed break-words">
            {userProfile?.bio ? `"${userProfile.bio}"` : '"Never go to market twice! Always holding WHOT 20."'}
          </p>
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

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {MODES.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => {
                    onSelectMode(mode.id);
                    setSelectedModeStage(mode.id);
                  }}
                  className="p-3.5 sm:p-4 rounded-2xl border border-[var(--theme-border)]/70 bg-[var(--theme-bg-main)]/60 hover:border-[var(--theme-gold)] hover:bg-[var(--theme-bg-elevated)] text-left transition-all cursor-pointer group hover:scale-[1.01] active:scale-95 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl sm:text-2xl shrink-0 leading-none">{mode.icon}</span>
                    <h4 className="font-display font-black text-sm sm:text-base text-[var(--theme-text-primary)] group-hover:text-[var(--theme-gold)] transition-colors truncate">
                      {mode.name}
                    </h4>
                  </div>
                  <p className="text-xs text-[var(--theme-text-muted)] leading-snug">
                    {mode.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Stage 2: Selected Mode Header with Cancel, Difficulty, and Play Button */
          <div className="space-y-5">
            {/* Direct Mode Header on Card Pop-up: Mode Title, Opponents Under It, Icon, and "X" Cancel Button */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">{activeModeObj?.icon || '👑'}</span>
                <div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-[var(--theme-text-primary)]">
                    {activeModeObj?.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] font-medium">
                    {activeModeObj?.opponents} Computer Opponent{activeModeObj && activeModeObj.opponents > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Cancel Button with only "X" Icon */}
              <button
                type="button"
                onClick={() => setSelectedModeStage(null)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--theme-bg-main)]/80 hover:bg-red-500/20 hover:text-red-400 border border-[var(--theme-border)] hover:border-red-500/50 text-[var(--theme-text-muted)] transition-all cursor-pointer flex items-center justify-center font-bold text-sm sm:text-base active:scale-95"
                title="Back to Mode Selection"
                aria-label="Back to Mode Selection"
              >
                ✕
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

      {/* Lobby Navigation Hub: 3 Clickable Icon-Only Cards (Profile, Multiplayer, Audio & Themes) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-1">
        {/* Card 1: My Profile */}
        <button
          onClick={onOpenProfile || onOpenAvatarStudio}
          className="h-16 sm:h-20 rounded-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] hover:bg-[var(--theme-bg-elevated)] transition-all flex items-center justify-center group cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
          title="My Profile"
          aria-label="My Profile"
        >
          <User className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--theme-text-primary)] group-hover:text-[var(--theme-gold)] group-hover:scale-110 transition-all" />
        </button>

        {/* Card 2: Online Multiplayer */}
        <button
          onClick={onOpenMultiplayer}
          className="h-16 sm:h-20 rounded-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] hover:bg-[var(--theme-bg-elevated)] transition-all flex items-center justify-center group cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
          title="Online Multiplayer"
          aria-label="Online Multiplayer"
        >
          <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--theme-text-primary)] group-hover:text-[var(--theme-gold)] group-hover:scale-110 transition-all" />
        </button>

        {/* Card 3: Audio & Themes */}
        <button
          onClick={onOpenSettings}
          className="h-16 sm:h-20 rounded-2xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] hover:bg-[var(--theme-bg-elevated)] transition-all flex items-center justify-center group cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
          title="Audio & Themes"
          aria-label="Audio & Themes"
        >
          <Settings className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--theme-text-primary)] group-hover:text-[var(--theme-gold)] group-hover:scale-110 transition-all" />
        </button>
      </div>
    </div>
  );
};
