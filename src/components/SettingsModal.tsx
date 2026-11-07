import React from 'react';
import { PlayerSettings } from '../services/storage';
import { BotDifficulty, VisualTheme } from '../game/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PlayerSettings;
  onUpdateSettings: (newSettings: Partial<PlayerSettings>) => void;
  onOpenAvatarStudio: () => void;
}

const THEMES: Array<{ id: VisualTheme; name: string; preview: string; description: string }> = [
  {
    id: 'forest',
    name: 'Forest Green',
    preview: 'bg-[#123D2B] border-[#218858]',
    description: 'Classic Nigerian felt green with gold trim',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    preview: 'bg-[#0F172A] border-[#38BDF8]',
    description: 'Deep obsidian and electric cyan glow',
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    preview: 'bg-[#24113B] border-[#A855F7]',
    description: 'Imperial violet with regal amber trim',
  },
  {
    id: 'cream',
    name: 'Classic Cream',
    preview: 'bg-[#2C231C] border-[#E5B869]',
    description: 'Warm roasted umber & antique cream luxury',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    preview: 'bg-[#38130B] border-[#F59E0B]',
    description: 'Terracotta embers and dusk golden amber',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    preview: 'bg-[#082838] border-[#06B6D4]',
    description: 'Deep abyssal marine teal & bright cyan',
  },
];

const DIFFICULTIES: Array<{ id: BotDifficulty; label: string; desc: string }> = [
  { id: 'EASY', label: 'Easy', desc: 'Direct plays, beginner-friendly' },
  { id: 'MEDIUM', label: 'Medium', desc: 'Balanced tactics & shape choices' },
  { id: 'HARD', label: 'Hard', desc: 'Aggressive special card counters' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenAvatarStudio,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-lg bg-[var(--theme-bg-surface)] border border-[var(--theme-gold)] rounded-2xl shadow-2xl p-4 sm:p-5 text-[var(--theme-text-primary)] max-h-[92dvh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="font-display font-extrabold text-xl text-[var(--theme-text-primary)]">
              Game Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--theme-bg-main)] border border-[var(--theme-border)] hover:border-red-500/40 text-[var(--theme-text-muted)] hover:text-red-400 flex items-center justify-center text-sm font-bold cursor-pointer transition-all active:scale-95"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 text-xs">
          {/* Audio & Music */}
          <div>
            <span className="text-[11px] font-bold text-[var(--theme-gold)] uppercase tracking-wider block mb-2">
              Audio & Soundtrack
            </span>
            <div className="space-y-2 bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block">Background Music</span>
                  <span className="text-[11px] text-[var(--theme-text-muted)]">
                    Gentle ambient afrobeat groove
                  </span>
                </div>
                <button
                  onClick={() => onUpdateSettings({ musicEnabled: !settings.musicEnabled })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    settings.musicEnabled ? 'bg-[var(--theme-accent)]' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-[var(--theme-accent-text)] transition-transform ${
                      settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-2 border-t border-[var(--theme-border-subtle)] flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block">Sound Effects</span>
                  <span className="text-[11px] text-[var(--theme-text-muted)]">
                    Card drops, chimes & market bells
                  </span>
                </div>
                <button
                  onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    settings.soundEnabled ? 'bg-[var(--theme-accent)]' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-[var(--theme-accent-text)] transition-transform ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Gameplay & Assistance */}
          <div>
            <span className="text-[11px] font-bold text-[var(--theme-gold)] uppercase tracking-wider block mb-2">
              Gameplay & Mechanics
            </span>
            <div className="space-y-2 bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block">Card Play Hints</span>
                  <span className="text-[11px] text-[var(--theme-text-muted)]">
                    Highlight and lift valid legal cards
                  </span>
                </div>
                <button
                  onClick={() => onUpdateSettings({ hintsEnabled: !settings.hintsEnabled })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    settings.hintsEnabled ? 'bg-[var(--theme-accent)]' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-[var(--theme-accent-text)] transition-transform ${
                      settings.hintsEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-2 border-t border-[var(--theme-border-subtle)] flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block">Fast Animation Speed</span>
                  <span className="text-[11px] text-[var(--theme-text-muted)]">
                    Snappier bot turn responses
                  </span>
                </div>
                <button
                  onClick={() => onUpdateSettings({ fastSpeed: !settings.fastSpeed })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    settings.fastSpeed ? 'bg-[var(--theme-accent)]' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-[var(--theme-accent-text)] transition-transform ${
                      settings.fastSpeed ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Bot Difficulty Selection */}
          <div>
            <span className="text-[11px] font-bold text-[var(--theme-gold)] uppercase tracking-wider block mb-2">
              Opponent Difficulty
            </span>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.id}
                  onClick={() => onUpdateSettings({ difficulty: d.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    settings.difficulty === d.id
                      ? 'border-[var(--theme-gold)] bg-[var(--theme-bg-elevated)] shadow-md ring-1 ring-[var(--theme-gold)]'
                      : 'border-[var(--theme-border)] bg-[var(--theme-bg-main)] hover:border-[var(--theme-gold)]'
                  }`}
                >
                  <span className="font-display font-extrabold text-xs text-[var(--theme-text-primary)] block">
                    {d.label}
                  </span>
                  <span className="text-[10px] text-[var(--theme-text-muted)] leading-tight block mt-0.5">
                    {d.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Select Theme */}
          <div>
            <span className="text-[11px] font-bold text-[var(--theme-gold)] uppercase tracking-wider block mb-2">
              Select Theme
            </span>
            <div className="flex items-center justify-between gap-2 p-3 sm:p-4 rounded-2xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)]">
              {THEMES.map(th => {
                const isSelected = settings.theme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => onUpdateSettings({ theme: th.id })}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 sm:border-3 ${th.preview} transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md ${
                      isSelected
                        ? 'ring-3 sm:ring-4 ring-[var(--theme-gold)] ring-offset-2 ring-offset-[var(--theme-bg-surface)] scale-110 shadow-lg'
                        : 'opacity-70 hover:opacity-100 hover:scale-105 active:scale-95'
                    }`}
                    title={th.name}
                    aria-label={`Select ${th.name} theme`}
                  />
                );
              })}
            </div>
          </div>

          {/* Quick link to Avatar Studio */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenAvatarStudio();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-gold)] hover:bg-[var(--theme-bg-elevated)] text-xs font-bold text-[var(--theme-gold)] transition-all flex items-center justify-center cursor-pointer"
            >
              Customize Player
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-[var(--theme-border)] text-right">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
