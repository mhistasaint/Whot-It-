import React, { useState } from 'react';
import { isUserOnWaitlist, joinWaitlist } from '../services/storage';

interface MultiplayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiplayerModal: React.FC<MultiplayerModalProps> = ({ isOpen, onClose }) => {
  const [joined, setJoined] = useState(isUserOnWaitlist());

  if (!isOpen) return null;

  const handleJoin = () => {
    joinWaitlist();
    setJoined(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#123D2B] border-2 border-[#D7B45A] rounded-2xl shadow-2xl p-6 text-[#F7F3E8]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#176B45] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <h2 className="font-display font-extrabold text-xl text-[#F7F3E8]">
              Multiplayer <span className="text-[#D7B45A] text-xs font-bold uppercase ml-1 px-2 py-0.5 rounded-full bg-[#D7B45A]/20 border border-[#D7B45A]/50">Coming Soon</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#F7F3E8]/60 hover:text-[#F7F3E8] p-1.5"
          >
            ✕ Close
          </button>
        </div>

        {/* Feature previews */}
        <div className="space-y-3 mb-5 text-xs text-[#F7F3E8]/85">
          <p className="leading-relaxed">
            The next major evolution of <strong>WHOT It!</strong> is bringing real-time peer-to-peer online play directly to your browser!
          </p>

          <div className="space-y-2 bg-[#08291F] border border-[#176B45] rounded-xl p-3">
            <div className="flex items-start gap-2.5">
              <span className="text-base">🔑</span>
              <div>
                <strong className="text-[#D7B45A] block">Private Room Codes</strong>
                <span className="text-[11px] text-[#F7F3E8]/70">
                  Create custom tables and share a 4-digit code with friends and family worldwide.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-[#176B45]/60">
              <span className="text-base">🏆</span>
              <div>
                <strong className="text-[#D7B45A] block">Naija Ranked League</strong>
                <span className="text-[11px] text-[#F7F3E8]/70">
                  Climb the Lagos, Abuja, and Port Harcourt competitive divisions.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-[#176B45]/60">
              <span className="text-base">🎙️</span>
              <div>
                <strong className="text-[#D7B45A] block">Authentic Naija Banter</strong>
                <span className="text-[11px] text-[#F7F3E8]/70">
                  Live voice reactions, &apos;Last Card&apos; alerts, and table celebratory emotes.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist status / CTA */}
        <div className="text-center pt-2">
          {joined ? (
            <div className="p-3 bg-[#176B45]/50 border border-[#7CCB75] rounded-xl text-xs text-[#7CCB75] font-bold">
              ✓ You are on the Early Access VIP Waitlist! You will be notified when multiplayer tables go live.
            </div>
          ) : (
            <button
              onClick={handleJoin}
              className="w-full py-3 px-4 rounded-xl bg-[#D7B45A] hover:bg-[#c2a24c] text-[#08291F] font-display font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Join Early Access Waitlist
            </button>
          )}

          <button
            onClick={onClose}
            className="mt-3 text-xs text-[#F7F3E8]/60 hover:text-[#F7F3E8] py-1"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
