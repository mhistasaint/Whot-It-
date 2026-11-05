import { GameMode, BotDifficulty, VisualTheme, PlayerAvatar, UserProfile, PlayerRankTier, CardShape } from '../game/types';

export interface DailyRewardState {
  lastClaimDate: string | null; // Format YYYY-MM-DD
  consecutiveStreak: number;
  canClaimToday: boolean;
  streakDay: number; // 1 to 7
  todayRewardAmount: number;
}

export interface DemoPurchase {
  id: string;
  timestamp: number;
  packageName: string;
  gemAmount: number;
  priceTag: string;
  isDemo: true;
}

export interface MatchStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  cardsPlayed: number;
  whotsPlayed: number;
  holdOnsPlayed: number;
  generalMarketsPlayed: number;
  penaltiesStacked: number;
  peeksUsed: number;
}

export const DEFAULT_AVATAR: PlayerAvatar = {
  skinTone: '#7D4B2A',
  hairStyle: 'afro',
  clothPattern: 'ankara_emerald',
  bgGradient: 'from-emerald-800 to-emerald-950',
  gender: 'female',
};

export interface PlayerSettings {
  musicEnabled: boolean;
  soundEnabled: boolean;
  hintsEnabled: boolean;
  fastSpeed: boolean;
  difficulty: BotDifficulty;
  selectedMode: GameMode;
  theme: VisualTheme;
  playerName: string;
  avatar: PlayerAvatar;
}

const STORAGE_KEYS = {
  GEMS: 'whot_it_gems_balance_v2',
  DAILY_REWARD: 'whot_it_daily_reward_v2',
  DAILY_FREE_PEEK: 'whot_it_daily_free_peek_v2',
  PURCHASES: 'whot_it_demo_purchases_v2',
  STATS: 'whot_it_match_stats_v2',
  SETTINGS: 'whot_it_settings_v2',
  WAITLIST: 'whot_it_multiplayer_waitlist_v2',
  PROFILE: 'whot_it_user_profile_v2',
};

export const STREAK_REWARDS = [5, 10, 15, 20, 25, 35, 50]; // 7 days

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gem balance operations. Starts at 100 for new player.
 */
export function getStoredGems(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GEMS);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEYS.GEMS, '100');
      return 100;
    }
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) || parsed < 0 ? 100 : parsed;
  } catch {
    return 100;
  }
}

export function setStoredGems(amount: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GEMS, Math.max(0, amount).toString());
  } catch (e) {
    console.error('Failed to save gems', e);
  }
}

export function deductGems(cost: number): boolean {
  const current = getStoredGems();
  if (current >= cost) {
    setStoredGems(current - cost);
    return true;
  }
  return false;
}

export function addGems(amount: number): number {
  const updated = getStoredGems() + amount;
  setStoredGems(updated);
  return updated;
}

/**
 * Daily Free Peek: Granted once per local calendar day!
 */
export function canUseDailyFreePeek(): boolean {
  const today = getTodayDateString();
  try {
    const lastDate = localStorage.getItem(STORAGE_KEYS.DAILY_FREE_PEEK);
    return lastDate !== today;
  } catch {
    return true;
  }
}

export function recordDailyFreePeekUsed(): void {
  const today = getTodayDateString();
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_FREE_PEEK, today);
  } catch (e) {
    console.error('Failed to record free peek', e);
  }
}

/**
 * Daily Reward operations with 7-day progressive reward track.
 */
export function getDailyRewardState(): DailyRewardState {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_REWARD);
    if (!raw) {
      return {
        lastClaimDate: null,
        consecutiveStreak: 0,
        canClaimToday: true,
        streakDay: 1,
        todayRewardAmount: STREAK_REWARDS[0],
      };
    }
    const data = JSON.parse(raw);
    const lastClaim = typeof data.lastClaimDate === 'string' ? data.lastClaimDate : null;
    const streak = typeof data.consecutiveStreak === 'number' ? data.consecutiveStreak : 0;
    const canClaimToday = lastClaim !== today;

    let currentDay = 1;
    if (lastClaim === today) {
      currentDay = ((streak - 1) % 7) + 1;
    } else if (lastClaim === yesterday) {
      currentDay = (streak % 7) + 1;
    } else {
      currentDay = 1; // streak reset
    }

    const todayRewardAmount = STREAK_REWARDS[currentDay - 1] || 5;

    return {
      lastClaimDate: lastClaim,
      consecutiveStreak: streak,
      canClaimToday,
      streakDay: currentDay,
      todayRewardAmount,
    };
  } catch {
    return {
      lastClaimDate: null,
      consecutiveStreak: 0,
      canClaimToday: true,
      streakDay: 1,
      todayRewardAmount: 5,
    };
  }
}

export function claimDailyReward(): { success: boolean; newStreak: number; gemsAwarded: number; message: string } {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const current = getDailyRewardState();

  if (!current.canClaimToday) {
    return {
      success: false,
      newStreak: current.consecutiveStreak,
      gemsAwarded: 0,
      message: 'You have already claimed today’s reward. Check back tomorrow!',
    };
  }

  let newStreak = 1;
  if (current.lastClaimDate === yesterday) {
    newStreak = current.consecutiveStreak + 1;
  }

  const streakIdx = ((newStreak - 1) % 7);
  const gemsAwarded = STREAK_REWARDS[streakIdx] || 5;
  addGems(gemsAwarded);

  try {
    localStorage.setItem(
      STORAGE_KEYS.DAILY_REWARD,
      JSON.stringify({
        lastClaimDate: today,
        consecutiveStreak: newStreak,
      })
    );
  } catch (e) {
    console.error('Failed to store daily reward', e);
  }

  return {
    success: true,
    newStreak,
    gemsAwarded,
    message: `Claimed +${gemsAwarded} gems! Day ${streakIdx + 1} streak active.`,
  };
}

/**
 * Demo Gem Shop purchases.
 */
export function getDemoPurchases(): DemoPurchase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordDemoPurchase(packageName: string, gemAmount: number, priceTag: string): void {
  const current = getDemoPurchases();
  const newPurchase: DemoPurchase = {
    id: `demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    packageName,
    gemAmount,
    priceTag,
    isDemo: true,
  };
  addGems(gemAmount);
  try {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify([newPurchase, ...current]));
  } catch (e) {
    console.error('Failed to record demo purchase', e);
  }
}

/**
 * Match Statistics.
 */
const DEFAULT_STATS: MatchStats = {
  matchesPlayed: 0,
  wins: 0,
  losses: 0,
  cardsPlayed: 0,
  whotsPlayed: 0,
  holdOnsPlayed: 0,
  generalMarketsPlayed: 0,
  penaltiesStacked: 0,
  peeksUsed: 0,
};

export function getMatchStats(): MatchStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function updateMatchStats(updater: (prev: MatchStats) => MatchStats): void {
  try {
    const current = getMatchStats();
    const updated = updater(current);
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update stats', e);
  }
}

/**
 * Player Settings.
 */
const DEFAULT_SETTINGS: PlayerSettings = {
  musicEnabled: false,
  soundEnabled: true,
  hintsEnabled: true,
  fastSpeed: false,
  difficulty: 'MEDIUM',
  selectedMode: '1v3',
  theme: 'forest',
  playerName: 'You',
  avatar: DEFAULT_AVATAR,
};

export function getPlayerSettings(): PlayerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function savePlayerSettings(settings: Partial<PlayerSettings>): PlayerSettings {
  const current = getPlayerSettings();
  const merged = { ...current, ...settings };
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
  return merged;
}

/**
 * Multiplayer Waitlist.
 */
export function isUserOnWaitlist(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.WAITLIST) === 'true';
  } catch {
    return false;
  }
}

export function joinWaitlist(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WAITLIST, 'true');
  } catch (e) {
    console.error('Failed to save waitlist', e);
  }
}

/**
 * Player Profile System
 */
export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'whot_usr_8492',
  friendCode: 'WHOT-8492',
  username: 'Adeola',
  title: 'Naija Challenger',
  bio: 'Never go to market twice! Always holding WHOT 20.',
  avatar: DEFAULT_AVATAR,
  favoriteShape: 'STAR',
  region: 'Nigeria (West Africa)',
  joinDate: 'November 2026',
  level: 1,
  xp: 150,
  rankTier: 'Bronze',
  hasCustomProfile: false,
};

export function calculatePlayerRank(stats: MatchStats): {
  level: number;
  xp: number;
  rankTier: PlayerRankTier;
  nextLevelXp: number;
  progressPercent: number;
} {
  const baseScore =
    stats.wins * 120 +
    stats.matchesPlayed * 30 +
    stats.cardsPlayed * 5 +
    stats.whotsPlayed * 15 +
    stats.penaltiesStacked * 25 +
    stats.generalMarketsPlayed * 20;

  const totalXp = Math.max(100, baseScore);
  const xpPerLevel = 250;
  const level = Math.floor(totalXp / xpPerLevel) + 1;
  const currentLevelFloor = (level - 1) * xpPerLevel;
  const nextLevelXp = level * xpPerLevel;
  const progressInLevel = totalXp - currentLevelFloor;
  const progressPercent = Math.min(100, Math.round((progressInLevel / xpPerLevel) * 100));

  let rankTier: PlayerRankTier = 'Bronze';
  if (level >= 15) rankTier = 'Naija Champion';
  else if (level >= 10) rankTier = 'Diamond';
  else if (level >= 6) rankTier = 'Gold';
  else if (level >= 3) rankTier = 'Silver';

  return {
    level,
    xp: totalXp,
    rankTier,
    nextLevelXp,
    progressPercent,
  };
}

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const settings = getPlayerSettings();
    const stats = getMatchStats();
    const rankInfo = calculatePlayerRank(stats);

    if (!raw) {
      const initial: UserProfile = {
        ...DEFAULT_USER_PROFILE,
        username: settings.playerName && settings.playerName !== 'You' ? settings.playerName : 'Adeola',
        avatar: settings.avatar,
        level: rankInfo.level,
        xp: rankInfo.xp,
        rankTier: rankInfo.rankTier,
      };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initial));
      return initial;
    }

    const parsed: UserProfile = JSON.parse(raw);
    return {
      ...DEFAULT_USER_PROFILE,
      ...parsed,
      level: rankInfo.level,
      xp: rankInfo.xp,
      rankTier: rankInfo.rankTier,
    };
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(updates: Partial<UserProfile>): UserProfile {
  try {
    const current = getUserProfile();
    const merged: UserProfile = {
      ...current,
      ...updates,
      hasCustomProfile: true,
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(merged));

    // Keep settings playerName & avatar in sync
    if (updates.username || updates.avatar) {
      savePlayerSettings({
        playerName: merged.username,
        avatar: merged.avatar,
      });
    }

    return merged;
  } catch (e) {
    console.error('Failed to save profile', e);
    return getUserProfile();
  }
}

