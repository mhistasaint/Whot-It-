import React, { useState } from 'react';
import { UserProfile, CardShape, PlayerAvatar } from '../game/types';
import { MatchStats } from '../services/storage';
import { AvatarView } from './AvatarView';
import { ShapeIcon } from './CardView';

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  stats: MatchStats;
  gems: number;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
  onOpenAvatarStudio: () => void;
  isCreationMode?: boolean;
}

const TITLES = [
  'Naija Challenger',
  'Whot Master',
  'Card Tactician',
  'Market General',
  'Agbalagba',
  'Deck Whisperer',
  'Grandmaster',
];

const SHAPES: Array<{ shape: CardShape; label: string; nick: string }> = [
  { shape: 'CIRCLE', label: 'Circle', nick: 'Ball' },
  { shape: 'TRIANGLE', label: 'Triangle', nick: 'Angle' },
  { shape: 'CROSS', label: 'Cross', nick: 'Cross' },
  { shape: 'SQUARE', label: 'Square', nick: 'Carpet' },
  { shape: 'STAR', label: 'Star', nick: 'Star' },
  { shape: 'WHOT', label: 'WHOT 20', nick: 'Wildcard' },
];

const REGIONS = [
  'Nigeria (West Africa)',
  'Lagos, NG',
  'Abuja, NG',
  'Port Harcourt, NG',
  'Ibadan, NG',
  'Enugu, NG',
  'Kano, NG',
  'Global Diaspora',
];

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  stats,
  gems,
  onSaveProfile,
  onOpenAvatarStudio,
  isCreationMode = false,
}) => {
  const [username, setUsername] = useState(profile.username);
  const [title, setTitle] = useState(profile.title || 'Naija Challenger');
  const [bio, setBio] = useState(profile.bio || 'Never go to market twice! Always holding WHOT 20.');
  const [favoriteShape, setFavoriteShape] = useState<CardShape>(profile.favoriteShape || 'STAR');
  const [region, setRegion] = useState(profile.region || 'Nigeria (West Africa)');
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'multiplayer'>('profile');

  if (!isOpen) return null;

  const winRate = stats.matchesPlayed > 0 ? Math.round((stats.wins / stats.matchesPlayed) * 100) : 0;

  const handleCopyFriendCode = () => {
    navigator.clipboard?.writeText(profile.friendCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    const trimmed = username.trim() || 'Player';
    onSaveProfile({
      username: trimmed,
      title,
      bio,
      favoriteShape,
      region,
      hasCustomProfile: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm select-none animate-fade-in overflow-y-auto text-[var(--theme-text-primary)]">
      <div className="w-full max-w-2xl bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-gold)] rounded-3xl shadow-2xl p-4 sm:p-6 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--theme-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--theme-gold)] text-[var(--theme-accent-text)] font-serif font-black text-base flex items-center justify-center">
              👤
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl text-[var(--theme-text-primary)]">
                {isCreationMode ? 'Create Your Player Profile' : 'Player Profile & Identity'}
              </h2>
              <p className="text-[11px] text-[var(--theme-text-muted)]">
                {isCreationMode
                  ? 'Set up your player card and identity for the WHOT table'
                  : 'Manage your personal details, ranking, and gameplay records'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--theme-bg-main)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] flex items-center justify-center text-sm cursor-pointer transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher (only in view/edit mode) */}
        {!isCreationMode && (
          <div className="flex items-center gap-2 mb-5 p-1 rounded-2xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)]">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[var(--theme-accent)] text-[var(--theme-accent-text)] shadow-sm'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-[var(--theme-accent)] text-[var(--theme-accent-text)] shadow-sm'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
              }`}
            >
              Records
            </button>
            <button
              onClick={() => setActiveTab('multiplayer')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'multiplayer'
                  ? 'bg-[var(--theme-accent)] text-[var(--theme-accent-text)] shadow-sm'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
              }`}
            >
              Online ID
            </button>
          </div>
        )}

        {/* TAB 1: Profile & Identity / Creation Form */}
        {(isCreationMode || activeTab === 'profile') && (
          <div className="space-y-4">
            
            {/* Player Identity Card Preview */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] relative overflow-hidden">
              <div className="relative group cursor-pointer" onClick={onOpenAvatarStudio} title="Click to customize avatar">
                <AvatarView avatar={profile.avatar} name={username} size="lg" />
                <span className="absolute -bottom-1 -right-1 bg-[var(--theme-gold)] text-[var(--theme-accent-text)] text-[10px] font-bold px-2 py-0.5 rounded-full shadow cursor-pointer hover:scale-105 transition-transform">
                  Change
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h3 className="font-display font-black text-lg text-[var(--theme-text-primary)]">
                    {username || 'Player'}
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-[var(--theme-gold)] bg-[var(--theme-gold)]/15 px-2 py-0.5 rounded-full border border-[var(--theme-gold)]/30">
                    {title}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--theme-accent)] bg-[var(--theme-bg-surface)] px-2 py-0.5 rounded-full border border-[var(--theme-border)]">
                    {profile.rankTier}
                  </span>
                </div>

                <p className="text-xs text-[var(--theme-text-muted)] italic mb-2">
                  "{bio}"
                </p>

                {/* Level & XP Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[var(--theme-text-primary)]">
                      Level {profile.level} · {profile.xp} XP
                    </span>
                    <span className="text-[10px] text-[var(--theme-text-muted)]">
                      Tier: {profile.rankTier}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--theme-bg-surface)] overflow-hidden border border-[var(--theme-border)]/50">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--theme-gold)] to-[var(--theme-accent)] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (profile.xp % 250) / 2.5)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Fields Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              
              {/* Username Field */}
              <div>
                <label className="block text-xs font-bold text-[var(--theme-text-primary)] mb-1">
                  Username / Player Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  maxLength={16}
                  placeholder="e.g. Adeola, NaijaKing"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] focus:outline-none focus:border-[var(--theme-gold)]"
                />
              </div>

              {/* Title / Tagline */}
              <div>
                <label className="block text-xs font-bold text-[var(--theme-text-primary)] mb-1">
                  Player Title / Tagline
                </label>
                <select
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] focus:outline-none focus:border-[var(--theme-gold)]"
                >
                  {TITLES.map(t => (
                    <option key={t} value={t} className="bg-[var(--theme-bg-surface)]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bio Field */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[var(--theme-text-primary)] mb-1">
                  Player Motto / Bio
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  maxLength={70}
                  placeholder="Your favorite Whot saying or match tactic"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] focus:outline-none focus:border-[var(--theme-gold)]"
                />
              </div>

              {/* Favorite Shape */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[var(--theme-text-primary)] mb-1.5">
                  Favorite Signature Card Shape
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {SHAPES.map(s => {
                    const isSelected = favoriteShape === s.shape;
                    return (
                      <button
                        key={s.shape}
                        type="button"
                        onClick={() => setFavoriteShape(s.shape)}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[var(--theme-gold)] bg-[var(--theme-bg-elevated)] ring-2 ring-[var(--theme-gold)]'
                            : 'border-[var(--theme-border)] bg-[var(--theme-bg-main)] hover:border-[var(--theme-gold)]/60'
                        }`}
                      >
                        <div className="w-6 h-6 text-[#B91C1C] mb-1 flex items-center justify-center">
                          <ShapeIcon shape={s.shape} className="w-full h-full fill-current" />
                        </div>
                        <span className="text-[10px] font-bold text-[var(--theme-text-primary)] truncate w-full text-center">
                          {s.nick}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Region */}
              <div>
                <label className="block text-xs font-bold text-[var(--theme-text-primary)] mb-1">
                  Region / Table Flag
                </label>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] focus:outline-none focus:border-[var(--theme-gold)]"
                >
                  {REGIONS.map(r => (
                    <option key={r} value={r} className="bg-[var(--theme-bg-surface)]">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Avatar Studio quick jump */}
              <div>
                <label className="block text-xs font-bold text-[var(--theme-text-primary)] mb-1">
                  Avatar Appearance
                </label>
                <button
                  type="button"
                  onClick={onOpenAvatarStudio}
                  className="w-full py-2 px-3 text-sm rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] text-[var(--theme-gold)] font-bold transition-all text-left flex items-center justify-between cursor-pointer"
                >
                  <span>🎨 Customize Hair & Attire</span>
                  <span className="text-xs">→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Game Statistics Breakdown */}
        {!isCreationMode && activeTab === 'stats' && (
          <div className="space-y-4">
            
            {/* Quick KPI stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-center">
                <span className="text-xl font-display font-black text-[var(--theme-gold)] block">
                  {stats.matchesPlayed}
                </span>
                <span className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider font-bold">
                  Matches Played
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-center">
                <span className="text-xl font-display font-black text-emerald-400 block">
                  {stats.wins}
                </span>
                <span className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider font-bold">
                  Victories
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-center">
                <span className="text-xl font-display font-black text-[var(--theme-accent)] block">
                  {winRate}%
                </span>
                <span className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider font-bold">
                  Win Rate
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-center">
                <span className="text-xl font-display font-black text-amber-300 block">
                  💎 {gems}
                </span>
                <span className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider font-bold">
                  Gems Balance
                </span>
              </div>
            </div>

            {/* Tactical Special Cards Counts */}
            <div className="p-4 rounded-2xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] space-y-2.5">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--theme-gold)]">
                Special Cards & Tactics Executed
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] flex items-center justify-between">
                  <span className="text-[var(--theme-text-muted)]">👑 WHOT 20 Calls:</span>
                  <span className="font-bold text-[var(--theme-text-primary)]">{stats.whotsPlayed}</span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] flex items-center justify-between">
                  <span className="text-[var(--theme-text-muted)]">✋ Hold Ons (1):</span>
                  <span className="font-bold text-[var(--theme-text-primary)]">{stats.holdOnsPlayed}</span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] flex items-center justify-between">
                  <span className="text-[var(--theme-text-muted)]">🛒 General Markets (14):</span>
                  <span className="font-bold text-[var(--theme-text-primary)]">{stats.generalMarketsPlayed}</span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] flex items-center justify-between">
                  <span className="text-[var(--theme-text-muted)]">⚡ Penalties Stacked:</span>
                  <span className="font-bold text-[var(--theme-text-primary)]">{stats.penaltiesStacked}</span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] flex items-center justify-between">
                  <span className="text-[var(--theme-text-muted)]">🎴 Total Cards Played:</span>
                  <span className="font-bold text-[var(--theme-text-primary)]">{stats.cardsPlayed}</span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] flex items-center justify-between">
                  <span className="text-[var(--theme-text-muted)]">👁️ Tactical Peeks:</span>
                  <span className="font-bold text-[var(--theme-text-primary)]">{stats.peeksUsed}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Future Multiplayer Integration Readiness */}
        {!isCreationMode && activeTab === 'multiplayer' && (
          <div className="space-y-4">
            
            {/* Friend Code Card */}
            <div className="p-4 rounded-2xl bg-[var(--theme-bg-main)] border border-[var(--theme-gold)]/40 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--theme-gold)] tracking-widest block">
                    Your Unique Player Identification Code
                  </span>
                  <div className="font-mono font-black text-xl md:text-2xl text-[var(--theme-text-primary)] tracking-wider mt-0.5">
                    {profile.friendCode}
                  </div>
                  <span className="text-[11px] text-[var(--theme-text-muted)] block mt-0.5">
                    Player ID: {profile.id} · Region: {region}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyFriendCode}
                  className="px-4 py-2 rounded-xl bg-[var(--theme-gold)] text-[var(--theme-accent-text)] font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>📋</span>
                  <span>{isCopied ? 'Copied!' : 'Copy Friend Code'}</span>
                </button>
              </div>
            </div>

            {/* Architecture Explanatory Banner */}
            <div className="p-4 rounded-2xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--theme-gold)]">
                <span className="text-base">🌐</span>
                <span>Future Online Multiplayer Architecture</span>
              </div>
              <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
                This player profile system is designed with full future multiplayer integration in mind. While online multiplayer is currently <strong>in development (Coming Soon)</strong>, your unique identity, friend code, and accumulated match stats are permanently preserved and will seamlessly transition to online matchmaking, custom rooms, and global leaderboards.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-[var(--theme-text-muted)]">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Status: Single-Player MVP · Online Multiplayer in Roadmap</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[var(--theme-border)]">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-xs font-semibold text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-6 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-black text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            {isCreationMode ? 'Complete Profile & Play' : 'Save Profile Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
