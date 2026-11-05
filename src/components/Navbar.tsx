import React from 'react';
import { Volume2, VolumeX, Sparkles, Music, Settings, Home } from 'lucide-react';

interface NavbarProps {
  gems: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
  onOpenDailyReward: () => void;
  onOpenGemShop: () => void;
  onOpenSettings: () => void;
  onOpenLobby?: () => void;
  onOpenWelcome?: () => void;
  onOpenProfile?: () => void;
  onNewMatch: () => void;
  isDailyFreePeek: boolean;
  onTriggerPeek: () => void;
  canPeek: boolean;
  isInGame?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  gems,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onOpenHowToPlay,
  onOpenStats,
  onOpenDailyReward,
  onOpenGemShop,
  onOpenSettings,
  onOpenLobby,
  onOpenWelcome,
  onOpenProfile,
  onNewMatch,
  isDailyFreePeek,
  onTriggerPeek,
  canPeek,
  isInGame = false,
}) => {
  return (
    <header className="w-full bg-[var(--theme-bg-main)]/95 border-b border-[var(--theme-border)]/60 px-3 sm:px-6 py-2.5 backdrop-blur-md sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Zone 1: Brand Title & Lobby Return */}
        <div className="flex items-center gap-2 shrink-0">
          {isInGame && onOpenLobby && (
            <button
              onClick={onOpenLobby}
              className="p-1.5 rounded-lg bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] hover:border-[var(--theme-accent)] transition-colors cursor-pointer mr-1"
              title="Return to Main Menu Lobby"
            >
              <Home className="w-4 h-4 text-[var(--theme-accent)]" />
            </button>
          )}

          <div
            onClick={onOpenLobby || onOpenWelcome}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[var(--theme-bg-surface)] border border-[var(--theme-accent)] flex items-center justify-center text-[var(--theme-accent)] font-serif font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
              W
            </div>
            <span className="font-display font-black text-base sm:text-xl tracking-tight text-[var(--theme-text-primary)] whitespace-nowrap">
              WHOT <span className="text-[var(--theme-accent)]">It!</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs sm:text-sm font-medium text-[var(--theme-text-muted)] overflow-x-auto no-scrollbar py-1">
          {onOpenWelcome && (
            <button
              onClick={onOpenWelcome}
              className="hover:text-[var(--theme-accent)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Home
            </button>
          )}
          {onOpenLobby && (
            <button
              onClick={onOpenLobby}
              className="hover:text-[var(--theme-accent)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Gameplay
            </button>
          )}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="hover:text-[var(--theme-accent)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              My Profile
            </button>
          )}
          <button
            onClick={onOpenHowToPlay}
            className="hover:text-[var(--theme-accent)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            How to Play
          </button>
          <button
            onClick={onOpenDailyReward}
            className="hover:text-[var(--theme-accent)] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>Daily Gift</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
          </button>
          <button
            onClick={onOpenGemShop}
            className="hover:text-[var(--theme-accent)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Gem Shop
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Music Toggle */}
          <button
            onClick={onToggleMusic}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              musicEnabled
                ? 'bg-[var(--theme-bg-elevated)] text-[var(--theme-accent)] border-[var(--theme-accent)]/50'
                : 'text-[var(--theme-text-muted)] border-transparent hover:bg-[var(--theme-bg-surface)]'
            }`}
            title={musicEnabled ? 'Turn music off' : 'Turn music on'}
            aria-label="Toggle Music"
          >
            <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-surface)] rounded-lg transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-[var(--theme-text-muted)] hover:text-[var(--theme-accent)] hover:bg-[var(--theme-bg-surface)] rounded-lg transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* In-game Peek Button */}
          {isInGame && (
            <button
              onClick={onTriggerPeek}
              disabled={!canPeek}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 cursor-pointer ${
                isDailyFreePeek
                  ? 'bg-[var(--theme-bg-elevated)] text-[var(--theme-text-primary)] border-[var(--theme-accent)]/50 hover:bg-[var(--theme-bg-surface)]'
                  : 'bg-[var(--theme-bg-main)] text-[var(--theme-accent)] border-[var(--theme-accent)]/50 hover:bg-[var(--theme-bg-surface)]'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              title="Peek what the next opponent plans to play"
            >
              <Sparkles className="w-3 h-3 text-[var(--theme-accent)]" />
              <span className="hidden sm:inline">Peek</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-black/30 font-mono">
                {isDailyFreePeek ? 'FREE' : '100💎'}
              </span>
            </button>
          )}

          {/* Gem Balance Counter */}
          <button
            onClick={onOpenGemShop}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[var(--theme-bg-surface)] border border-[var(--theme-border-subtle)] hover:border-[var(--theme-accent)] text-[var(--theme-text-primary)] text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Gem balance (Click to open Gem Shop)"
          >
            <span>💎</span>
            <span className="font-mono text-[var(--theme-accent)] text-xs">{gems}</span>
          </button>

          {/* New Match Button */}
          {isInGame && (
            <button
              onClick={onNewMatch}
              className="hidden lg:inline-flex px-3 py-1.5 text-xs font-bold text-[var(--theme-accent-text)] bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer whitespace-nowrap shrink-0"
            >
              Restart
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
