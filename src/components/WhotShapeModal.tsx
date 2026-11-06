import React, { useState } from 'react';
import { CardShape } from '../game/types';
import { ShapeIcon } from './CardView';
import { X } from 'lucide-react';

interface WhotShapeModalProps {
  isOpen: boolean;
  onConfirmShape: (shape: CardShape) => void;
  onCancel: () => void;
  initialShape?: CardShape;
}

const AVAILABLE_SHAPES: Array<{ shape: CardShape; label: string; nick: string }> = [
  { shape: 'CIRCLE', label: 'Circle', nick: 'Ball' },
  { shape: 'TRIANGLE', label: 'Triangle', nick: 'Angle' },
  { shape: 'CROSS', label: 'Cross', nick: 'Cross' },
  { shape: 'SQUARE', label: 'Square', nick: 'Carpet' },
  { shape: 'STAR', label: 'Star', nick: 'Star' },
];

export const WhotShapeModal: React.FC<WhotShapeModalProps> = ({
  isOpen,
  onConfirmShape,
  onCancel,
  initialShape = 'CIRCLE',
}) => {
  const [selectedShape, setSelectedShape] = useState<CardShape>(initialShape);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirmShape(selectedShape);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-sm sm:max-w-md bg-[var(--theme-bg-surface)] border-2 border-[var(--theme-gold)] rounded-2xl shadow-2xl p-4 sm:p-6 text-center text-[var(--theme-text-primary)]">
        
        {/* Header with Close / Cancel 'X' only */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--theme-border)]/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)] flex items-center justify-center text-[var(--theme-accent)] font-serif font-black text-sm">
              W
            </div>
            <h2 className="font-display font-black text-lg sm:text-xl text-[var(--theme-text-primary)]">
              Call Your Shape
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] rounded-lg hover:bg-[var(--theme-bg-main)] cursor-pointer transition-colors"
            title="Cancel"
            aria-label="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[var(--theme-text-muted)] mb-4 text-left">
          Select the shape the next player must follow, then tap <strong>Confirm</strong>. Or tap <strong>✕</strong> if you don't want to use it yet.
        </p>

        {/* 5 Shapes grid with single-tap selection */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-5">
          {AVAILABLE_SHAPES.map(({ shape, label, nick }) => {
            const isSelected = selectedShape === shape;
            return (
              <button
                key={shape}
                type="button"
                onClick={() => setSelectedShape(shape)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 cursor-pointer text-center ${
                  isSelected
                    ? 'border-[var(--theme-accent)] bg-[var(--theme-bg-elevated)] ring-2 ring-[var(--theme-accent)] shadow-lg scale-105'
                    : 'border-[var(--theme-border)] bg-[var(--theme-bg-main)] hover:border-[var(--theme-accent)]/60'
                }`}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 text-[#B91C1C] bg-[#FDFBF7] p-1 rounded-lg border border-[#B91C1C]/20 shadow-sm flex items-center justify-center mb-1">
                  <ShapeIcon shape={shape} className="w-full h-full" />
                </div>
                <span className="font-display font-bold text-[10px] sm:text-xs text-[var(--theme-text-primary)] block truncate w-full">
                  {label}
                </span>
                <span className="text-[9px] text-[var(--theme-accent)] block truncate w-full">
                  ({nick})
                </span>
              </button>
            );
          })}
        </div>

        {/* Centralized Confirm Button */}
        <div className="flex items-center justify-center pt-1">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full max-w-[200px] py-2.5 px-6 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-text)] font-display font-extrabold text-sm shadow-lg transition-all active:scale-95 cursor-pointer min-h-[44px]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
