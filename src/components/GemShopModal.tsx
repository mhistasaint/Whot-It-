import React, { useState } from 'react';
import { recordDemoPurchase, getDemoPurchases, DemoPurchase } from '../services/storage';

interface GemShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGemsUpdated: () => void;
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
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'history'>('packages');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<DemoPurchase[]>(getDemoPurchases());

  if (!isOpen) return null;

  const handleDemoBuy = (pkg: typeof PACKAGES[0]) => {
    recordDemoPurchase(pkg.name, pkg.gems, pkg.priceTag);
    onGemsUpdated();
    setPurchases(getDemoPurchases());
    setSuccessMsg(`Simulated demo purchase complete! +${pkg.gems} Gems credited.`);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[var(--theme-bg-surface)] border border-[var(--theme-gold)] rounded-2xl shadow-2xl p-6 text-[var(--theme-text-primary)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💎</span>
            <h2 className="font-display font-extrabold text-xl text-[var(--theme-text-primary)]">
              Gem Shop
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] p-1.5 cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        {/* DEMO Disclaimer Banner */}
        <div className="p-3 rounded-xl bg-amber-950/60 border border-[var(--theme-accent)]/40 mb-4 text-xs text-amber-200">
          <span className="font-bold">⚠️ SIMULATED DEMO SHOP ONLY:</span> No real payment gateway is integrated, and no real money is ever charged or collected. All purchases are instant simulated credits.
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
            Packages
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[var(--theme-accent)] text-[var(--theme-accent-text)]'
                : 'bg-[var(--theme-bg-main)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            Demo History ({purchases.length})
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-[var(--theme-bg-elevated)] border border-[var(--theme-accent)] text-[var(--theme-accent)] text-xs font-bold text-center">
            {successMsg}
          </div>
        )}

        {activeTab === 'packages' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PACKAGES.map(pkg => (
              <div
                key={pkg.gems}
                className="relative flex flex-col justify-between p-4 rounded-xl bg-[var(--theme-bg-main)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] transition-all"
              >
                {pkg.badge && (
                  <span className="absolute -top-2 right-3 text-[10px] font-extrabold uppercase tracking-wider bg-[var(--theme-accent)] text-[var(--theme-accent-text)] px-2 py-0.5 rounded-full shadow">
                    {pkg.badge}
                  </span>
                )}
                <div className="text-center mb-3">
                  <span className="text-3xl mb-1 block">{pkg.icon}</span>
                  <h3 className="font-display font-extrabold text-base text-[var(--theme-text-primary)]">
                    {pkg.name}
                  </h3>
                  <div className="font-display font-black text-2xl text-[var(--theme-accent)] my-1">
                    +{pkg.gems}
                  </div>
                  <span className="text-[10px] text-[var(--theme-text-muted)]">Gems</span>
                </div>

                <div className="pt-2 border-t border-[var(--theme-border)] text-center">
                  <div className="text-[11px] text-[var(--theme-text-muted)] mb-2">
                    Simulated <span className="line-through">{pkg.priceTag}</span> (DEMO Free)
                  </div>
                  <button
                    onClick={() => handleDemoBuy(pkg)}
                    className="w-full py-2 px-3 rounded-lg bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Claim Free Demo
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
