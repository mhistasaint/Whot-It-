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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#123D2B] border border-[#D7B45A] rounded-2xl shadow-2xl p-6 text-[#F7F3E8] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#176B45] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💎</span>
            <h2 className="font-display font-extrabold text-xl text-[#F7F3E8]">
              Gem Shop
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#F7F3E8]/60 hover:text-[#F7F3E8] p-1.5"
          >
            ✕ Close
          </button>
        </div>

        {/* DEMO Disclaimer Banner */}
        <div className="p-3 rounded-xl bg-amber-950/60 border border-[#D7B45A]/40 mb-4 text-xs text-amber-200">
          <span className="font-bold">⚠️ SIMULATED DEMO SHOP ONLY:</span> No real payment gateway is integrated, and no real money is ever charged or collected. All purchases are instant simulated credits.
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'packages'
                ? 'bg-[#D7B45A] text-[#08291F]'
                : 'bg-[#08291F] text-[#F7F3E8]/70 hover:text-[#F7F3E8]'
            }`}
          >
            Packages
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-[#D7B45A] text-[#08291F]'
                : 'bg-[#08291F] text-[#F7F3E8]/70 hover:text-[#F7F3E8]'
            }`}
          >
            Demo History ({purchases.length})
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-[#176B45] border border-[#7CCB75] text-[#7CCB75] text-xs font-bold text-center">
            {successMsg}
          </div>
        )}

        {activeTab === 'packages' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PACKAGES.map(pkg => (
              <div
                key={pkg.gems}
                className="relative flex flex-col justify-between p-4 rounded-xl bg-[#08291F] border border-[#176B45] hover:border-[#D7B45A] transition-all"
              >
                {pkg.badge && (
                  <span className="absolute -top-2 right-3 text-[10px] font-extrabold uppercase tracking-wider bg-[#D7B45A] text-[#08291F] px-2 py-0.5 rounded-full shadow">
                    {pkg.badge}
                  </span>
                )}
                <div className="text-center mb-3">
                  <span className="text-3xl mb-1 block">{pkg.icon}</span>
                  <h3 className="font-display font-extrabold text-base text-[#F7F3E8]">
                    {pkg.name}
                  </h3>
                  <div className="font-display font-black text-2xl text-[#7CCB75] my-1">
                    +{pkg.gems}
                  </div>
                  <span className="text-[10px] text-[#F7F3E8]/60">Gems</span>
                </div>

                <div className="pt-2 border-t border-[#176B45] text-center">
                  <div className="text-[11px] text-[#F7F3E8]/70 mb-2">
                    Simulated <span className="line-through">{pkg.priceTag}</span> (DEMO Free)
                  </div>
                  <button
                    onClick={() => handleDemoBuy(pkg)}
                    className="w-full py-2 px-3 rounded-lg bg-[#176B45] hover:bg-[#123D2B] text-[#F7F3E8] border border-[#7CCB75]/40 text-xs font-bold shadow-md transition-all active:scale-95"
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
              <p className="text-xs text-[#F7F3E8]/60 text-center py-6">
                No simulated purchases recorded yet.
              </p>
            ) : (
              purchases.map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#08291F] border border-[#176B45] text-xs"
                >
                  <div>
                    <span className="font-bold text-[#F7F3E8]">{p.packageName}</span>
                    <span className="text-[10px] text-[#D7B45A] ml-2 font-mono">DEMO</span>
                    <div className="text-[10px] text-[#F7F3E8]/50">
                      {new Date(p.timestamp).toLocaleDateString()} {new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <span className="font-display font-extrabold text-[#7CCB75] text-sm">
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
