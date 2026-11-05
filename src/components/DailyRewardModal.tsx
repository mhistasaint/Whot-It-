import React, { useState } from 'react';
import { DailyRewardState, claimDailyReward } from '../services/storage';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[#123D2B] border border-[#D7B45A] rounded-2xl shadow-2xl p-6 text-center text-[#F7F3E8]">
        {/* Sun / Gift Icon */}
        <div className="w-14 h-14 mx-auto rounded-full bg-[#D7B45A]/20 border border-[#D7B45A] flex items-center justify-center mb-3 text-2xl">
          🎁
        </div>

        <h2 className="font-display font-black text-xl text-[#F7F3E8] mb-1">
          Daily Login Reward
        </h2>
        <p className="text-xs text-[#F7F3E8]/80 mb-5">
          Play daily to maintain your streak and earn free gems!
        </p>

        {/* Streak counter card */}
        <div className="bg-[#08291F] border border-[#176B45] rounded-xl p-4 mb-4 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#F7F3E8]/70">Current Streak:</span>
            <span className="font-display font-extrabold text-[#D7B45A] text-sm">
              🔥 {rewardState.consecutiveStreak} Day{rewardState.consecutiveStreak !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#F7F3E8]/70">Today&apos;s Gift:</span>
            <span className="font-display font-bold text-[#7CCB75] text-sm">
              +5 Gems 💎
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#176B45]">
            <span className="text-xs text-[#F7F3E8]/70">Status:</span>
            <span className="text-xs font-semibold text-[#F7F3E8]">
              {rewardState.canClaimToday ? 'Available to claim' : 'Claimed for today'}
            </span>
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
            className="flex-1 py-2.5 px-4 rounded-lg bg-[#08291F] border border-[#176B45] text-xs font-semibold text-[#F7F3E8]/80 hover:bg-[#176B45] transition-all"
          >
            Close
          </button>

          {rewardState.canClaimToday ? (
            <button
              onClick={handleClaim}
              className="flex-1 py-2.5 px-4 rounded-lg bg-[#D7B45A] hover:bg-[#c2a24c] text-[#08291F] text-xs font-bold shadow-md transition-all active:scale-95"
            >
              Claim +5 Gems
            </button>
          ) : (
            <button
              disabled
              className="flex-1 py-2.5 px-4 rounded-lg bg-gray-700 text-gray-400 text-xs font-bold cursor-not-allowed"
            >
              Claimed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
