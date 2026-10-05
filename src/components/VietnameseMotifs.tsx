import React from 'react';

/**
 * Vietnamese Cultural Motifs SVG Library
 * Designed with restrained, lightweight vectors that harmonize with modern typography.
 */

// 1. Chim Lạc (Dong Son Crane in Flight)
export const ChimLacIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 32"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Stylized Dong Son Flying Crane Silhouette */}
    <path d="M4 14C10 14 18 10 24 6C28 3.5 34 2 42 2C38 6 34 8 30 11L46 15C40 17 34 18 28 18C22 18 16 22 10 28C10 24 11 20 13 17C9 17 6 16 4 14Z" />
    <path d="M26 12C28 10 32 8 38 6C34 9 30 11 27 13L26 12Z" opacity="0.6" />
    <circle cx="43" cy="4" r="1.2" fill="currentColor" />
  </svg>
);

// 2. Trống Đồng Radial Accent (Subtle Watermark)
export const TrongDongWatermark: React.FC<{ className?: string }> = ({
  className = 'w-72 h-72'
}) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Center 14-ray Sun */}
    <circle cx="100" cy="100" r="14" stroke="currentColor" strokeWidth="1" />
    <path
      d="M100 82L102 96L100 100L98 96Z M100 118L102 104L100 100L98 104Z M82 100L96 102L100 100L96 98Z M118 100L104 102L100 100L104 98Z
         M87 87L98 98M113 113L102 102M87 113L98 102M113 87L102 98"
      stroke="currentColor"
      strokeWidth="1"
    />
    {/* Concentric Decorative Rings */}
    <circle cx="100" cy="100" r="28" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
    <circle cx="100" cy="100" r="38" stroke="currentColor" strokeWidth="1" />
    <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.8" />
    {/* Geometric Flying Birds / Tangent Chevrons */}
    <circle cx="100" cy="100" r="64" stroke="currentColor" strokeWidth="1" strokeDasharray="5 3" />
    <circle cx="100" cy="100" r="78" stroke="currentColor" strokeWidth="0.8" />
    <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 2" />
  </svg>
);

// 3. Hoa Sen Delicate Divider
export const HoaSenDivider: React.FC<{ className?: string; label?: string }> = ({
  className = 'my-8',
  label
}) => (
  <div className={`flex items-center justify-center gap-4 ${className}`}>
    <div className="h-px bg-gradient-to-r from-transparent via-[#C29B38]/40 to-[#C29B38]/70 flex-1 max-w-xs" />
    <div className="flex items-center gap-2 text-[#9B2C2C]">
      <svg
        viewBox="0 0 32 24"
        fill="currentColor"
        className="w-5 h-4"
        aria-hidden="true"
      >
        {/* Stylized Lotus Center & Petals */}
        <path d="M16 2C15 6 13 12 16 18C19 12 17 6 16 2Z" />
        <path d="M16 18C11 15 7 10 9 6C11 11 14 16 16 18Z" opacity="0.8" />
        <path d="M16 18C21 15 25 10 23 6C21 11 18 16 16 18Z" opacity="0.8" />
        <path d="M16 20C9 20 5 18 3 14C6 17 11 18 16 20Z" opacity="0.6" />
        <path d="M16 20C23 20 27 18 29 14C26 17 21 18 16 20Z" opacity="0.6" />
      </svg>
      {label && (
        <span className="font-serif italic text-xs tracking-widest text-[#5C4838] uppercase">
          {label}
        </span>
      )}
    </div>
    <div className="h-px bg-gradient-to-l from-transparent via-[#C29B38]/40 to-[#C29B38]/70 flex-1 max-w-xs" />
  </div>
);

// 4. Mây Thời Lý (Ly Dynasty Cloud Scroll)
export const MayThoiLy: React.FC<{ className?: string }> = ({ className = 'w-16 h-8' }) => (
  <svg
    viewBox="0 0 64 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M4 22C4 22 10 16 16 18C22 20 24 24 30 22C36 20 38 12 46 14C54 16 56 22 60 18M18 18C18 12 26 8 32 10C38 12 42 16 46 14M28 10C28 6 36 2 42 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// 5. Triện Son (Traditional Vietnamese Seal / Stamp)
export const TrienSonSeal: React.FC<{
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ text = 'Việt Phục', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-[9px] border',
    md: 'w-9 h-9 text-[11px] border-[1.5px]',
    lg: 'w-12 h-12 text-xs border-2'
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-sm font-serif font-bold text-center leading-none tracking-tighter uppercase select-none border-[#9B2C2C] text-[#9B2C2C] bg-[#9B2C2C]/5 shadow-xs ${sizeClasses} ${className}`}
      style={{
        boxShadow: 'inset 0 0 4px rgba(155, 44, 44, 0.15)'
      }}
      title="Dấu triện văn hóa Việt"
    >
      <div className="absolute inset-0.5 border border-[#9B2C2C]/40 pointer-events-none rounded-[1px]" />
      <span className="font-black rotate-[-2deg] transform scale-90">
        {text}
      </span>
    </div>
  );
};

// 6. Triện Dấu Xác Thực (Verified Heritage Seal)
export const TrienXacThuc: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-[#9B2C2C]/50 bg-[#9B2C2C]/8 text-[#9B2C2C] text-[11px] font-serif font-semibold tracking-wider ${className}`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-[#9B2C2C]" />
    <span>Chính sử đối chiếu</span>
  </div>
);

// 7. Họa Tiết Thủy Ba Sóng Nước (Layered Water Waves of Imperial Nguyen & Cánh Sen Motif)
export const ThuyBaWaveRibbon: React.FC<{ className?: string; height?: number }> = ({
  className = 'w-full',
  height = 36
}) => (
  <svg
    viewBox="0 0 1200 48"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ height: `${height}px` }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="thuyBaCanhSenGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C84B69" stopOpacity="0.8" />
        <stop offset="25%" stopColor="#E57390" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#C84B69" stopOpacity="0.85" />
        <stop offset="75%" stopColor="#E57390" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#C84B69" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="thuyBaGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C29B38" stopOpacity="0.6" />
        <stop offset="50%" stopColor="#E2BD58" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#C29B38" stopOpacity="0.6" />
      </linearGradient>
    </defs>

    {/* Layer 1: Deep Wavy Base in Lotus Rose */}
    <path
      d="M0 48L0 28C100 12 200 36 300 24C400 12 500 36 600 24C700 12 800 36 900 24C1000 12 1100 36 1200 24L1200 48Z"
      fill="url(#thuyBaCanhSenGrad1)"
    />

    {/* Layer 2: Gold Filigree Crest Lines */}
    <path
      d="M0 24C100 8 200 32 300 20C400 8 500 32 600 20C700 8 800 32 900 20C1000 8 1100 32 1200 20"
      stroke="url(#thuyBaGoldGrad)"
      strokeWidth="2"
      fill="none"
    />

    {/* Layer 3: Concentric Wave Ripples (Sóng Cuốn Thủy Ba) */}
    <g opacity="0.75" stroke="#FFFFFF" strokeWidth="1.2" fill="none">
      <path d="M50 34C80 20 120 20 150 34 M200 34C230 20 270 20 300 34 M350 34C380 20 420 20 450 34 M500 34C530 20 570 20 600 34 M650 34C680 20 720 20 750 34 M800 34C830 20 870 20 900 34 M950 34C980 20 1020 20 1050 34 M1100 34C1130 20 1170 20 1200 34" />
      <path d="M60 40C85 28 115 28 140 40 M210 40C235 28 265 28 290 40 M360 40C385 28 415 28 440 40 M510 40C535 28 565 28 590 40 M660 40C685 28 715 28 740 40 M810 40C835 28 865 28 890 40 M960 40C985 28 1015 28 1040 40 M1110 40C1135 28 1165 28 1190 40" />
    </g>
  </svg>
);

