import React, { useState } from 'react';
import { recordDemoPurchase, getDemoPurchases, DemoPurchase } from '../services/storage';

interface GemShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGemsUpdated: () => void;
  onOpenDailyBonus?: () => void;
}

const PACKAGES = [
  {
    name: 'Starter Pouch',
    gems: 100,
    priceTag: '$0.99',
    badge: 'Popular',
    icon: '💎',
  },
  {
    name: 'Champion Chest',
    gems: 300,
    priceTag: '$2.49',
    badge: 'Best Value',
    icon: '✨',
  },
  {
    name: 'Market Vault',
    gems: 700,
    priceTag: '$4.99',
    badge: 'VIP Stack',
    icon: '👑',
  },
];

export const GemShopModal: React.FC<GemShopModalProps> = ({
  isOpen,
  onClose,
  onGemsUpdated,
  onOpenDailyBonus,
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'history'>('packages');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<DemoPurchase[]>(getDemoPurchases());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-lg bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-gold)] rounded-3xl shadow-2xl p-4 sm:p-6 text-[var(--theme-text-primary)] max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💎</span>
            <h2 className="font-display font-black text-xl text-[var(--theme-text-primary)]">
              Gem Shop
            </h2>
            <span className="text-[10px] uppercase font-bold text-[var(--theme-gold)] bg-[var(--theme-gold)]/15 border border-[var(--theme-gold)]/30 px-2 py-0.5 rounded-full">
              Store Locked
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] p-1.5 cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        {/* Locked Store Announcement Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-950/70 border border-[var(--theme-gold)]/50 mb-4 text-xs text-amber-200">
          <div className="flex items-start gap-2">
            <span className="text-base leading-none">🔒</span>
            <div>
              <span className="font-bold block text-amber-100">Gem Store Locked:</span>
              <span>
                Purchases and extra gem packages are currently locked until the Online Multiplayer launch.
                However, the <strong className="text-[var(--theme-gold)] font-bold">Daily Gem Collection</strong> is 100% active!
              </span>
            </div>
          </div>
        </div>

        {/* Daily Gem Collection Card (Active & Promoted) */}
        <div className="p-3.5 rounded-2xl bg-[var(--theme-bg-main)] border-2 border-[var(--theme-accent)] flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <div className="text-left">
              <h4 className="font-display font-extrabold text-sm text-[var(--theme-text-primary)]">
                Daily Gem Collection is Active!
              </h4>
              <p className="text-[11px] text-[var(--theme-text-muted)]">
                Claim free gems every 24 hours to grow your streak
              </p>
            </div>
          </div>
          {onOpenDailyBonus && (
            <button
              onClick={() => {
                onClose();
                onOpenDailyBonus();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Collect Daily Gems →
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-[var(--theme-accent)] text-[var(--theme-accent-text)]'
                : 'bg-[var(--theme-bg-main)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            Locked Packages
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[var(--theme-accent)] text-[var(--theme-accent-text)]'
                : 'bg-[var(--theme-bg-main)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            History ({purchases.length})
          </button>
        </div>

        {activeTab === 'packages' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PACKAGES.map(pkg => (
              <div
                key={pkg.gems}
                className="relative flex flex-col justify-between p-4 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] opacity-85 transition-all"
              >
                {pkg.badge && (
                  <span className="absolute -top-2 right-3 text-[10px] font-extrabold uppercase tracking-wider bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full shadow">
                    Locked
                  </span>
                )}
                <div className="text-center mb-3">
                  <span className="text-3xl mb-1 block opacity-80">{pkg.icon}</span>
                  <h3 className="font-display font-extrabold text-base text-[var(--theme-text-primary)]">
                    {pkg.name}
                  </h3>
                  <div className="font-display font-black text-2xl text-[var(--theme-text-muted)] my-1">
                    +{pkg.gems}
                  </div>
                  <span className="text-[10px] text-[var(--theme-text-muted)]">Gems</span>
                </div>

                <div className="pt-2 border-t border-[var(--theme-border)] text-center">
                  <div className="text-[11px] text-[var(--theme-text-muted)] mb-2">
                    Unlocks with Multiplayer
                  </div>
                  <button
                    disabled
                    className="w-full py-2 px-3 rounded-lg bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] text-[var(--theme-text-muted)] text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5 opacity-70"
                  >
                    <span>🔒</span>
                    <span>Store Locked</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {purchases.length === 0 ? (
              <p className="text-xs text-[var(--theme-text-muted)] text-center py-6">
                No simulated purchases recorded yet.
              </p>
            ) : (
              purchases.map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--theme-bg-main)] border border-[var(--theme-border)] text-xs"
                >
                  <div>
                    <span className="font-bold text-[var(--theme-text-primary)]">{p.packageName}</span>
                    <span className="text-[10px] text-[var(--theme-accent)] ml-2 font-mono">DEMO</span>
                    <div className="text-[10px] text-[var(--theme-text-muted)]">
                      {new Date(p.timestamp).toLocaleDateString()} {new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <span className="font-display font-extrabold text-[var(--theme-accent)] text-sm">
                    +{p.gemAmount} 💎
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
