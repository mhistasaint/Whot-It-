import React from 'react';
import { PlayerAvatar } from '../game/types';

interface AvatarViewProps {
  avatar: PlayerAvatar;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  isCurrentTurn?: boolean;
}

export const AvatarView: React.FC<AvatarViewProps> = ({
  avatar,
  name,
  size = 'md',
  isCurrentTurn = false,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 md:w-16 md:h-16',
    lg: 'w-20 h-20 md:w-24 md:h-24',
  }[size];

  const { skinTone, hairStyle, clothPattern } = avatar;

  // Pattern colors for clothing
  const clothColors: Record<string, { base: string; pattern: string }> = {
    ankara_gold: { base: '#B45309', pattern: '#FDE047' },
    ankara_emerald: { base: '#047857', pattern: '#6EE7B7' },
    ankara_ruby: { base: '#991B1B', pattern: '#FCA5A5' },
    dashiki_indigo: { base: '#1E3A8A', pattern: '#93C5FD' },
    white_agbada: { base: '#F8FAFC', pattern: '#D7B45A' },
  };

  const cloth = clothColors[clothPattern] || clothColors.ankara_gold;

  return (
    <div
      className={`relative ${sizeClasses} rounded-full overflow-hidden border-2 transition-all duration-300 ${
        isCurrentTurn
          ? 'border-[#7CCB75] shadow-[0_0_15px_rgba(124,203,117,0.6)] scale-105'
          : 'border-[#D7B45A]/40 shadow-md'
      } bg-[#123D2B]`}
      title={name}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background Radial */}
        <circle cx="50" cy="50" r="50" fill="#0c3222" />

        {/* Neck */}
        <rect x="42" y="55" width="16" height="18" fill={skinTone} rx="2" />

        {/* Traditional Garment / Ankara Collar */}
        <path
          d="M20,100 C20,74 36,66 50,68 C64,66 80,74 80,100 Z"
          fill={cloth.base}
        />
        {/* Embroidery details */}
        <path
          d="M44,68 L50,84 L56,68 Z"
          fill={cloth.pattern}
          opacity="0.85"
        />
        <circle cx="50" cy="74" r="2.5" fill="#FFFFFF" />

        {/* Head / Face */}
        <ellipse cx="50" cy="46" rx="20" ry="24" fill={skinTone} />

        {/* Ears */}
        <circle cx="29" cy="47" r="4.5" fill={skinTone} />
        <circle cx="71" cy="47" r="4.5" fill={skinTone} />

        {/* Eyes & Eyebrows */}
        <ellipse cx="43" cy="45" rx="2.5" ry="1.5" fill="#1C1917" />
        <ellipse cx="57" cy="45" rx="2.5" ry="1.5" fill="#1C1917" />
        <path d="M40,41 Q43,39 46,41" stroke="#1C1917" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M54,41 Q57,39 60,41" stroke="#1C1917" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <path d="M48,47 Q50,51 52,47" stroke="#372013" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Smile */}
        <path d="M45,56 Q50,60 55,56" stroke="#451A03" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Hair Styles & Headgear */}
        {hairStyle === 'afro' && (
          <path
            d="M27,42 C23,30 32,18 50,18 C68,18 77,30 73,42 C70,30 30,30 27,42 Z"
            fill="#171717"
          />
        )}

        {hairStyle === 'lowcut' && (
          <path
            d="M30,38 C32,24 40,22 50,22 C60,22 68,24 70,38 C65,30 35,30 30,38 Z"
            fill="#1F2937"
          />
        )}

        {hairStyle === 'braids' && (
          <g fill="#171717">
            <path d="M30,36 C34,22 45,20 50,20 C55,20 66,22 70,36 C64,28 36,28 30,36 Z" />
            {/* Hanging neat braids */}
            <rect x="28" y="38" width="3" height="20" rx="1.5" />
            <rect x="69" y="38" width="3" height="20" rx="1.5" />
            <circle cx="29.5" cy="58" r="2" fill="#D7B45A" />
            <circle cx="70.5" cy="58" r="2" fill="#D7B45A" />
          </g>
        )}

        {hairStyle === 'gele' && (
          <g>
            {/* Regal pleated Gele Headwrap */}
            <path
              d="M20,38 C20,16 40,12 50,12 C60,12 80,16 80,38 C84,32 78,22 50,16 C22,22 16,32 20,38 Z"
              fill="#991B1B"
            />
            {/* Gele Folds & Crown Wings */}
            <path
              d="M16,30 Q30,14 50,16 Q70,14 84,30 Q70,24 50,25 Q30,24 16,30 Z"
              fill="#DC2626"
            />
            <circle cx="50" cy="24" r="2.5" fill="#D7B45A" />
            {/* Gold earrings */}
            <circle cx="28" cy="51" r="2" fill="#D7B45A" />
            <circle cx="72" cy="51" r="2" fill="#D7B45A" />
          </g>
        )}

        {hairStyle === 'fila' && (
          <g>
            {/* Traditional embroidered Fila cap folded to side */}
            <path
              d="M28,34 C30,18 48,15 65,16 C76,16 78,28 72,36 C64,26 36,26 28,34 Z"
              fill="#0F766E"
            />
            <path
              d="M32,30 Q50,22 68,26"
              stroke="#D7B45A"
              strokeWidth="2"
              fill="none"
              strokeDasharray="2,2"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
