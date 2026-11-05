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
    name: 'Classic Forest Green',
    preview: 'bg-emerald-900 border-emerald-500',
    description: 'Traditional Nigerian felt green with gold trim',
  },
  {
    id: 'mahogany',
    name: 'Royal Mahogany',
    preview: 'bg-[#3E1812] border-amber-600',
    description: 'Warm mahogany wood tone with rich crimson table',
  },
  {
    id: 'indigo',
    name: 'Velvet Midnight',
    preview: 'bg-slate-900 border-indigo-500',
    description: 'Deep midnight indigo with celestial accents',
  },
  {
    id: 'sunset',
    name: 'Calabar Sunset',
    preview: 'bg-[#431407] border-amber-500',
    description: 'Warm terracotta sunset and golden amber tones',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-lg bg-[#123D2B] border border-[#D7B45A] rounded-2xl shadow-2xl p-5 text-[#F7F3E8] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#176B45] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="font-display font-extrabold text-xl text-[#F7F3E8]">
              Game Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#F7F3E8]/60 hover:text-[#F7F3E8] p-1.5"
          >
            ✕ Close
          </button>
        </div>

        <div className="space-y-5 text-xs">
          {/* Audio & Music */}
          <div>
            <span className="text-[11px] font-bold text-[#D7B45A] uppercase tracking-wider block mb-2">
              Audio & Soundtrack
            </span>
            <div className="space-y-2 bg-[#08291F] border border-[#176B45] rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block">Background Music</span>
                  <span className="text-[11px] text-[#F7F3E8]/60">
                    Gentle ambient afrobeat groove
                  </span>
                </div>
                <button
                  onClick={() => onUpdateSettings({ musicEnabled: !settings.musicEnabled })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    settings.musicEnabled ? 'bg-[#7CCB75]' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-2 border-t border-[#176B45]/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block">Sound Effects</span>
                  <span className="text-[11px] text-[#F7F3E8]/60">
                    Card drops, chimes & market bells
                  </span>
                </div>
                <button
                  onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    settings.soundEnabled ? 'bg-[#7CCB75]' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Gameplay & Assistance */}
          <div>
            <span className="text-[11px] font-bold text-[#D7B45A] uppercase tracking-wider block mb-2">
              Gameplay & Mechanics
            </span>
            <div className="space-y-2 bg-[#08291F] border border-[#176B45] rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block">Card Play Hints</span>
                  <span className="text-[11px] text-[#F7F3E8]/60">
                    Highlight and lift valid legal cards
                  </span>
                </div>
                <button
                  onClick={() => onUpdateSettings({ hintsEnabled: !settings.hintsEnabled })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    settings.hintsEnabled ? 'bg-[#7CCB75]' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.hintsEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-2 border-t border-[#176B45]/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block">Fast Animation Speed</span>
                  <span className="text-[11px] text-[#F7F3E8]/60">
                    Snappier bot turn responses
                  </span>
                </div>
                <button
                  onClick={() => onUpdateSettings({ fastSpeed: !settings.fastSpeed })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    settings.fastSpeed ? 'bg-[#7CCB75]' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.fastSpeed ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Bot Difficulty Selection */}
          <div>
            <span className="text-[11px] font-bold text-[#D7B45A] uppercase tracking-wider block mb-2">
              Default Opponent Difficulty
            </span>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.id}
                  onClick={() => onUpdateSettings({ difficulty: d.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    settings.difficulty === d.id
                      ? 'border-[#D7B45A] bg-[#176B45]/70 shadow-md ring-1 ring-[#D7B45A]'
                      : 'border-[#176B45] bg-[#08291F] hover:border-[#D7B45A]/50'
                  }`}
                >
                  <span className="font-display font-extrabold text-xs text-[#F7F3E8] block">
                    {d.label}
                  </span>
                  <span className="text-[10px] text-[#F7F3E8]/60 leading-tight block mt-0.5">
                    {d.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Themes */}
          <div>
            <span className="text-[11px] font-bold text-[#D7B45A] uppercase tracking-wider block mb-2">
              Table Visual Theme
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {THEMES.map(th => (
                <button
                  key={th.id}
                  onClick={() => onUpdateSettings({ theme: th.id })}
                  className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all text-left ${
                    settings.theme === th.id
                      ? 'border-[#D7B45A] bg-[#176B45]/60 ring-1 ring-[#D7B45A]'
                      : 'border-[#176B45] bg-[#08291F] hover:border-[#D7B45A]/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 ${th.preview} shrink-0`} />
                  <div>
                    <span className="font-display font-bold text-xs text-[#F7F3E8] block">
                      {th.name}
                    </span>
                    <span className="text-[10px] text-[#F7F3E8]/60 leading-tight block">
                      {th.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick link to Avatar Studio */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenAvatarStudio();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#08291F] border border-[#D7B45A]/50 hover:bg-[#176B45] text-xs font-bold text-[#D7B45A] transition-all flex items-center justify-center gap-2"
            >
              <span>🎭</span> Open Avatar & Profile Customizer
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-[#176B45] text-right">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#176B45] hover:bg-[#123D2B] text-[#F7F3E8] border border-[#7CCB75]/40 text-xs font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
