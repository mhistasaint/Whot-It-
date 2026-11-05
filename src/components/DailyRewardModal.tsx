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
      <div className="w-full max-w-md bg-[#123D2B] border-2 border-[#D7B45A] rounded-2xl shadow-2xl p-5 sm:p-6 text-center text-[#F7F3E8]">
        {/* Gift Icon */}
        <div className="w-14 h-14 mx-auto rounded-full bg-[#D7B45A]/20 border border-[#D7B45A] flex items-center justify-center mb-2 text-2xl">
          🎁
        </div>

        <h2 className="font-display font-black text-xl text-[#F7F3E8] mb-0.5">
          Daily Bonus & Streak
        </h2>
        <p className="text-xs text-[#F7F3E8]/80 mb-4">
          Claim free gems once every calendar day to grow your 7-day streak!
        </p>

        {/* 7-Day Streak Ladder */}
        <div className="bg-[#08291F] border border-[#176B45] rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between text-xs mb-2 px-1">
            <span className="text-[#F7F3E8]/70">Streak Calendar</span>
            <span className="font-bold text-[#D7B45A]">
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
                      ? 'border-[#D7B45A] bg-[#176B45] shadow-md ring-2 ring-[#D7B45A]'
                      : isPast
                      ? 'border-[#7CCB75]/40 bg-[#176B45]/20 opacity-70'
                      : 'border-[#176B45] bg-[#123D2B]/50'
                  }`}
                >
                  <span className="text-[9px] text-[#F7F3E8]/70 uppercase">D{dayNum}</span>
                  <span className="text-base my-0.5">{dayNum === 7 ? '👑' : '💎'}</span>
                  <span className={`text-[10px] font-bold ${isCurrent ? 'text-[#D7B45A]' : 'text-[#7CCB75]'}`}>
                    +{amount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {claimMessage && (
          <div className="mb-4 p-2.5 rounded-lg bg-[#176B45]/60 border border-[#7CCB75]/40 text-xs font-semibold text-[#7CCB75]">
            {claimMessage}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#08291F] border border-[#176B45] text-xs font-semibold text-[#F7F3E8]/80 hover:bg-[#176B45] transition-all"
          >
            Close
          </button>

          {rewardState.canClaimToday ? (
            <button
              onClick={handleClaim}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#D7B45A] hover:bg-[#c2a24c] text-[#08291F] font-display font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
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
