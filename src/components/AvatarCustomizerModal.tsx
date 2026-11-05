import React, { useState } from 'react';
import { PlayerAvatar } from '../game/types';
import { AvatarView } from './AvatarView';

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: PlayerAvatar;
  playerName: string;
  onSave: (avatar: PlayerAvatar, name: string) => void;
}

const SKIN_TONES = [
  { label: 'Mahogany', color: '#4A2A18' },
  { label: 'Chestnut', color: '#6B4226' },
  { label: 'Bronze', color: '#7D4B2A' },
  { label: 'Caramel', color: '#8C5638' },
  { label: 'Umber', color: '#9A6546' },
];

const HAIR_STYLES: Array<{ id: PlayerAvatar['hairStyle']; label: string }> = [
  { id: 'afro', label: 'Afro Crown' },
  { id: 'braids', label: 'Braided Rows' },
  { id: 'lowcut', label: 'Low Cut Fade' },
  { id: 'gele', label: 'Regal Gele' },
  { id: 'fila', label: 'Embroidered Fila' },
  { id: 'dreads', label: 'Locs / Dreads' },
];

const ATTIRE_PATTERNS: Array<{ id: PlayerAvatar['clothPattern']; label: string }> = [
  { id: 'ankara_gold', label: 'Ankara Gold' },
  { id: 'ankara_emerald', label: 'Ankara Emerald' },
  { id: 'ankara_ruby', label: 'Ankara Ruby' },
  { id: 'dashiki_indigo', label: 'Indigo Dashiki' },
  { id: 'white_agbada', label: 'Crisp White Agbada' },
];

const PRESETS: Array<{ name: string; avatar: PlayerAvatar }> = [
  {
    name: 'Zainab',
    avatar: {
      skinTone: '#4A2A18',
      hairStyle: 'gele',
      clothPattern: 'ankara_ruby',
      bgGradient: 'from-rose-800 to-rose-950',
      gender: 'female',
    },
  },
  {
    name: 'Tunde',
    avatar: {
      skinTone: '#6B4226',
      hairStyle: 'fila',
      clothPattern: 'white_agbada',
      bgGradient: 'from-amber-800 to-amber-950',
      gender: 'male',
    },
  },
  {
    name: 'Ada',
    avatar: {
      skinTone: '#7D4B2A',
      hairStyle: 'braids',
      clothPattern: 'ankara_emerald',
      bgGradient: 'from-emerald-800 to-emerald-950',
      gender: 'female',
    },
  },
  {
    name: 'Kalu',
    avatar: {
      skinTone: '#8C5638',
      hairStyle: 'lowcut',
      clothPattern: 'dashiki_indigo',
      bgGradient: 'from-blue-800 to-blue-950',
      gender: 'male',
    },
  },
  {
    name: 'Obioma',
    avatar: {
      skinTone: '#54311C',
      hairStyle: 'dreads',
      clothPattern: 'ankara_gold',
      bgGradient: 'from-amber-900 to-stone-950',
      gender: 'male',
    },
  },
];

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  playerName,
  onSave,
}) => {
  const [avatar, setAvatar] = useState<PlayerAvatar>(currentAvatar);
  const [name, setName] = useState<string>(playerName);
  const [activeTab, setActiveTab] = useState<'skin' | 'hair' | 'attire' | 'presets'>('skin');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(avatar, name.trim() || 'You');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-lg bg-[#123D2B] border border-[#D7B45A] rounded-2xl shadow-2xl p-5 text-[#F7F3E8] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#176B45] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎭</span>
            <h2 className="font-display font-extrabold text-xl text-[#F7F3E8]">
              Avatar Studio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#F7F3E8]/60 hover:text-[#F7F3E8] p-1.5"
          >
            ✕ Close
          </button>
        </div>

        {/* Live Preview & Name Edit */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#08291F] border border-[#176B45] rounded-xl p-4 mb-4">
          <AvatarView avatar={avatar} name={name} size="lg" />
          <div className="flex-1 w-full text-center sm:text-left">
            <label className="text-[11px] font-semibold text-[#D7B45A] uppercase tracking-wider block mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              maxLength={15}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full bg-[#123D2B] border border-[#176B45] focus:border-[#D7B45A] text-[#F7F3E8] font-display font-bold text-base px-3 py-1.5 rounded-lg outline-none"
            />
            <span className="text-[10px] text-[#F7F3E8]/50 mt-1 block">
              Shown to opponents at the table
            </span>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#08291F] rounded-lg mb-4 text-xs font-semibold overflow-x-auto no-scrollbar">
          {(['skin', 'hair', 'attire', 'presets'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 px-3 rounded-md capitalize transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#176B45] text-[#F7F3E8] shadow-sm'
                  : 'text-[#F7F3E8]/70 hover:text-[#F7F3E8]'
              }`}
            >
              {tab === 'presets' ? 'Quick Presets' : tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[140px] mb-5">
          {activeTab === 'skin' && (
            <div>
              <span className="text-xs text-[#F7F3E8]/70 mb-2 block font-medium">
                Select Skin Tone:
              </span>
              <div className="grid grid-cols-5 gap-2">
                {SKIN_TONES.map(item => (
                  <button
                    key={item.color}
                    onClick={() => setAvatar(prev => ({ ...prev, skinTone: item.color }))}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                      avatar.skinTone === item.color
                        ? 'border-[#D7B45A] bg-[#176B45]/40 shadow-md ring-2 ring-[#D7B45A]'
                        : 'border-[#176B45] bg-[#08291F] hover:border-[#D7B45A]/60'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full shadow-inner border border-white/20"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[10px] text-[#F7F3E8]/80 font-medium truncate w-full text-center">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hair' && (
            <div>
              <span className="text-xs text-[#F7F3E8]/70 mb-2 block font-medium">
                Select Hairstyle & Headgear:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {HAIR_STYLES.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setAvatar(prev => ({ ...prev, hairStyle: item.id }))}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                      avatar.hairStyle === item.id
                        ? 'border-[#D7B45A] bg-[#176B45]/60 text-[#D7B45A] ring-1 ring-[#D7B45A]'
                        : 'border-[#176B45] bg-[#08291F] text-[#F7F3E8]/80 hover:border-[#D7B45A]/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attire' && (
            <div>
              <span className="text-xs text-[#F7F3E8]/70 mb-2 block font-medium">
                Select Attire & Ankara Pattern:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ATTIRE_PATTERNS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setAvatar(prev => ({ ...prev, clothPattern: item.id }))}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                      avatar.clothPattern === item.id
                        ? 'border-[#D7B45A] bg-[#176B45]/60 text-[#D7B45A] ring-1 ring-[#D7B45A]'
                        : 'border-[#176B45] bg-[#08291F] text-[#F7F3E8]/80 hover:border-[#D7B45A]/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'presets' && (
            <div>
              <span className="text-xs text-[#F7F3E8]/70 mb-2 block font-medium">
                Pick a Curated Character:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setAvatar(preset.avatar);
                      setName(preset.name);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl bg-[#08291F] border border-[#176B45] hover:border-[#D7B45A] transition-all text-left"
                  >
                    <AvatarView avatar={preset.avatar} name={preset.name} size="sm" />
                    <div>
                      <span className="font-display font-bold text-xs text-[#F7F3E8] block">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-[#D7B45A]">Select</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-[#176B45]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#08291F] border border-[#176B45] text-xs font-semibold text-[#F7F3E8]/80 hover:bg-[#176B45] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#D7B45A] hover:bg-[#c2a24c] text-[#08291F] font-display font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Save Avatar & Name
          </button>
        </div>
      </div>
    </div>
  );
};
