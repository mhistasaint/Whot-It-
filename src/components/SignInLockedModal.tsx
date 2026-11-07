import React from 'react';
import { Lock, Play, ShieldAlert, Sparkles } from 'lucide-react';

interface SignInLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayGuest: () => void;
}

export const SignInLockedModal: React.FC<SignInLockedModalProps> = ({
  isOpen,
  onClose,
  onPlayGuest,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none text-[var(--theme-text-primary)]">
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-gold)] rounded-3xl shadow-2xl p-5 sm:p-6 text-center">
        {/* Lock Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--theme-bg-main)] border border-[var(--theme-gold)]/40 flex items-center justify-center mb-4 text-[var(--theme-gold)] shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-gold)]/15 border border-[var(--theme-gold)]/30 text-[var(--theme-gold)] text-xs font-extrabold uppercase tracking-wider mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Feature Locked</span>
        </div>

        <h3 className="font-display font-black text-2xl text-[var(--theme-text-primary)] mb-2">
          Sign In & Account Creation
        </h3>

        <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] leading-relaxed mb-5">
          Account credentials and cloud sign-in are currently locked because they will go live alongside the <strong className="text-[var(--theme-gold)] font-bold">Online Multiplayer release</strong>.
        </p>

        {/* Info Highlights */}
        <div className="bg-[var(--theme-bg-main)] border border-[var(--theme-border)] rounded-2xl p-4 text-left text-xs space-y-2.5 mb-6">
          <div className="flex items-start gap-2.5">
            <span className="text-base leading-none">🎮</span>
            <div>
              <strong className="text-[var(--theme-text-primary)] block font-bold">Full Local Offline Play</strong>
              <span className="text-[var(--theme-text-muted)] text-[11px]">
                No account or login required! You can play right now against AI bots across 4 game modes.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="text-base leading-none">💾</span>
            <div>
              <strong className="text-[var(--theme-text-primary)] block font-bold">Local Profile & Stats Saved</strong>
              <span className="text-[var(--theme-text-muted)] text-[11px]">
                Custom avatars, level progression, rank tiers, and match stats are securely saved on your device.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[var(--theme-accent)] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[var(--theme-accent)] block font-bold">Coming with Multiplayer</strong>
              <span className="text-[var(--theme-text-muted)] text-[11px]">
                Credential-based login, cross-device sync, and private friend tables will launch together.
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] hover:border-[var(--theme-gold)] text-[var(--theme-text-primary)] font-display font-bold text-xs transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onPlayGuest();
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-black text-xs shadow-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Play as Challenger</span>
          </button>
        </div>
      </div>
    </div>
  );
};
