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
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-gold)] rounded-2xl shadow-2xl p-5 sm:p-6 text-[var(--theme-text-primary)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <h2 className="font-display font-extrabold text-xl text-[var(--theme-text-primary)]">
              Multiplayer <span className="text-[var(--theme-accent)] text-xs font-bold uppercase ml-1 px-2 py-0.5 rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)]/50">Coming Soon</span>
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

        {/* Feature previews */}
        <div className="space-y-3 mb-5 text-xs text-[var(--theme-text-primary)]/85">
          <p className="leading-relaxed">
            The next major evolution of <strong>WHOT It!</strong> is bringing real-time peer-to-peer online play directly to your browser!
          </p>

          <div className="space-y-2 bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-xl p-3">
            <div className="flex items-start gap-2.5">
              <span className="text-base">🔑</span>
              <div>
                <strong className="text-[var(--theme-accent)] block">Private Room Codes</strong>
                <span className="text-[11px] text-[var(--theme-text-muted)]">
                  Create custom tables and share a 4-digit code with friends and family worldwide.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-[var(--theme-border)]/60">
              <span className="text-base">🏆</span>
              <div>
                <strong className="text-[var(--theme-accent)] block">Naija Ranked League</strong>
                <span className="text-[11px] text-[var(--theme-text-muted)]">
                  Climb the Lagos, Abuja, and Port Harcourt competitive divisions.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-[var(--theme-border)]/60">
              <span className="text-base">🎙️</span>
              <div>
                <strong className="text-[var(--theme-accent)] block">Authentic Naija Banter</strong>
                <span className="text-[11px] text-[var(--theme-text-muted)]">
                  Live voice reactions, &apos;Last Card&apos; alerts, and table celebratory emotes.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist status / CTA */}
        <div className="text-center pt-2">
          {joined ? (
            <div className="p-3 bg-[var(--theme-bg-elevated)]/50 border border-[var(--theme-accent)] rounded-xl text-xs text-[var(--theme-accent)] font-bold">
              ✓ You are on the Early Access VIP Waitlist! You will be notified when multiplayer tables go live.
            </div>
          ) : (
            <button
              onClick={handleJoin}
              className="w-full py-3 px-4 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Join Early Access Waitlist
            </button>
          )}

          <button
            onClick={onClose}
            className="mt-3 text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] py-1 cursor-pointer"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
