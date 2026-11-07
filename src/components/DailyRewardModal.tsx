import React, { useState } from 'react';
import { DailyRewardState, claimDailyReward, STREAK_REWARDS } from '../services/storage';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardState: DailyRewardState;
  onClaimSuccess: () => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  isOpen,
  onClose,
  rewardState,
  onClaimSuccess,
}) => {
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClaim = () => {
    const res = claimDailyReward();
    setClaimMessage(res.message);
    if (res.success) {
      onClaimSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-gold)] rounded-2xl shadow-2xl p-4 sm:p-6 text-center text-[var(--theme-text-primary)]">
        {/* Gift Icon */}
        <div className="w-14 h-14 mx-auto rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)] flex items-center justify-center mb-2 text-2xl">
          🎁
        </div>

        <h2 className="font-display font-black text-xl text-[var(--theme-text-primary)] mb-0.5">
          Daily Bonus & Streak
        </h2>
        <p className="text-xs text-[var(--theme-text-muted)] mb-4">
          Claim free gems once every calendar day to grow your 7-day streak!
        </p>

        {/* 7-Day Streak Ladder */}
        <div className="bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between text-xs mb-2 px-1">
            <span className="text-[var(--theme-text-muted)]">Streak Calendar</span>
            <span className="font-bold text-[var(--theme-accent)]">
              🔥 {rewardState.consecutiveStreak} Day Streak
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {STREAK_REWARDS.map((amount, idx) => {
              const dayNum = idx + 1;
              const isCurrent = rewardState.streakDay === dayNum;
              const isPast = rewardState.streakDay > dayNum && !rewardState.canClaimToday;

              return (
                <div
                  key={dayNum}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg border text-center transition-all ${
                    isCurrent
                      ? 'border-[var(--theme-accent)] bg-[var(--theme-bg-elevated)] shadow-md ring-2 ring-[var(--theme-accent)]'
                      : isPast
                      ? 'border-[var(--theme-border)] bg-[var(--theme-bg-surface)] opacity-70'
                      : 'border-[var(--theme-border)]/50 bg-[var(--theme-bg-surface)]/50'
                  }`}
                >
                  <span className="text-[9px] text-[var(--theme-text-muted)] uppercase">D{dayNum}</span>
                  <span className="text-base my-0.5">{dayNum === 7 ? '👑' : '💎'}</span>
                  <span className={`text-[10px] font-bold ${isCurrent ? 'text-[var(--theme-accent)]' : 'text-[var(--theme-text-primary)]'}`}>
                    +{amount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {claimMessage && (
          <div className="mb-4 p-2.5 rounded-lg bg-[var(--theme-bg-elevated)]/60 border border-[var(--theme-border)] text-xs font-semibold text-[var(--theme-accent)]">
            {claimMessage}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-xs font-semibold text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-elevated)] transition-all cursor-pointer"
          >
            Close
          </button>

          {rewardState.canClaimToday ? (
            <button
              onClick={handleClaim}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Claim +{rewardState.todayRewardAmount} Gems
            </button>
          ) : (
            <button
              disabled
              className="flex-1 py-2.5 px-4 rounded-xl bg-gray-700 text-gray-400 text-xs font-bold cursor-not-allowed"
            >
              Claimed for Today
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
