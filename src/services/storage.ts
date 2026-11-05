export interface DailyRewardState {
  lastClaimDate: string | null; // Format YYYY-MM-DD
  consecutiveStreak: number;
  canClaimToday: boolean;
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

export interface PlayerSettings {
  soundEnabled: boolean;
  fastSpeed: boolean;
  playerName: string;
}

const STORAGE_KEYS = {
  GEMS: 'whot_it_gems_balance_v1',
  DAILY_REWARD: 'whot_it_daily_reward_v1',
  PURCHASES: 'whot_it_demo_purchases_v1',
  STATS: 'whot_it_match_stats_v1',
  SETTINGS: 'whot_it_settings_v1',
};

function getTodayDateString(): string {
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
      // New player starts with 100 gems
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
 * Daily Reward operations.
 * Grants 5 gems once per local calendar day.
 */
export function getDailyRewardState(): DailyRewardState {
  const today = getTodayDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_REWARD);
    if (!raw) {
      return {
        lastClaimDate: null,
        consecutiveStreak: 0,
        canClaimToday: true,
      };
    }
    const data = JSON.parse(raw);
    const lastClaim = typeof data.lastClaimDate === 'string' ? data.lastClaimDate : null;
    const streak = typeof data.consecutiveStreak === 'number' ? data.consecutiveStreak : 0;
    const canClaimToday = lastClaim !== today;

    return {
      lastClaimDate: lastClaim,
      consecutiveStreak: streak,
      canClaimToday,
    };
  } catch {
    return {
      lastClaimDate: null,
      consecutiveStreak: 0,
      canClaimToday: true,
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
    // Consecutive daily login!
    newStreak = current.consecutiveStreak + 1;
  }

  const gemsAwarded = 5;
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
    message: `Claimed +${gemsAwarded} gems! Streak: ${newStreak} day${newStreak > 1 ? 's' : ''}!`,
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
  soundEnabled: true,
  fastSpeed: false,
  playerName: 'You',
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
