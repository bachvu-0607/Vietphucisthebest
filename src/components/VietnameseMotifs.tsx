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

// 8. Dấu Ấn PUB (PTIT - UET - BKA Vintage Heritage Stamp)
export const PubSeal: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeConfig = {
    sm: { container: 'p-[2px] rounded-[5px]', inner: 'px-1.5 py-0.5 rounded-[3px] border', text: 'text-[10px] tracking-wider' },
    md: { container: 'p-[2.5px] rounded-[6px]', inner: 'px-2 py-0.5 rounded-[4px] border-[1.2px]', text: 'text-xs tracking-wider' },
    lg: { container: 'p-[3px] rounded-lg', inner: 'px-3 py-1 rounded-[5px] border-[1.5px]', text: 'text-sm tracking-widest' },
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center border border-[#991B1B] bg-[#FFFBF8] select-none shadow-2xs ${sizeConfig.container} ${className}`}
      title="PUB: Liên minh sinh viên PTIT - UET - BKA"
    >
      <div className={`flex items-center justify-center border-[#991B1B] bg-white/80 ${sizeConfig.inner}`}>
        <span className={`font-serif font-black text-[#991B1B] leading-none ${sizeConfig.text}`}>
          PUB
        </span>
      </div>
    </div>
  );
};

// 9. Ba biểu tượng văn hóa tiêu biểu nhất của Việt Nam (Mini Icons theo đúng 3 ảnh tư liệu tham chiếu)
// 1. Hoa Sen (Mạ vàng đường nét tối giản sang trọng - Chuẩn 100% Ảnh 2)
export const HoaSenMiniIcon: React.FC<{ className?: string; active?: boolean }> = ({
  className = 'w-5 h-5',
  active = false
}) => (
  <svg
    viewBox="0 0 48 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="lotusGoldGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#FACC15" />
      </linearGradient>
      <linearGradient id="lotusGoldGradNormal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    </defs>
    {/* Cánh sen trung tâm vươn cao */}
    <path
      d="M24 4.5 C20.5 10 20.5 17.5 24 23.5 C27.5 17.5 27.5 10 24 4.5 Z"
      stroke={active ? 'url(#lotusGoldGradActive)' : 'url(#lotusGoldGradNormal)'}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Cánh sen bên trái ôm vòm */}
    <path
      d="M14.5 10.5 C12.5 16 15 21 21 24 C19 18 17.5 13 22 7.5"
      stroke={active ? 'url(#lotusGoldGradActive)' : 'url(#lotusGoldGradNormal)'}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Cánh sen bên phải ôm vòm đối xứng */}
    <path
      d="M33.5 10.5 C35.5 16 33 21 27 24 C29 18 30.5 13 26 7.5"
      stroke={active ? 'url(#lotusGoldGradActive)' : 'url(#lotusGoldGradNormal)'}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Hai cánh sen đáy uốn lượn hình dải lụa mạ vàng vô cực (Đặc trưng chuẩn 100% Ảnh 2) */}
    <path
      d="M7 23 C15 19 21.5 24 24 28 C26.5 24 33 19 41 23 C43.5 24.5 41 28 36 30 C30 32 26 29 24 28 C22 29 18 32 12 30 C7 28 4.5 24.5 7 23 Z"
      stroke={active ? 'url(#lotusGoldGradActive)' : 'url(#lotusGoldGradNormal)'}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 2. Trống Đồng Đông Sơn (Mề đay vàng kim mặt trời 14 cánh & chim Lạc - Chuẩn 100% Ảnh 1)
export const TrongDongMiniIcon: React.FC<{ className?: string; active?: boolean }> = ({
  className = 'w-5 h-5',
  active = false
}) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="drumBronzeGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="45%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#FACC15" />
      </linearGradient>
      <linearGradient id="drumBronzeGradNormal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    </defs>
    {/* Vành ngoài đĩa Trống Đồng */}
    <circle
      cx="20"
      cy="20"
      r="18.5"
      stroke={active ? 'url(#drumBronzeGradActive)' : 'url(#drumBronzeGradNormal)'}
      strokeWidth="1.6"
    />
    <circle
      cx="20"
      cy="20"
      r="16.5"
      stroke={active ? 'url(#drumBronzeGradActive)' : 'url(#drumBronzeGradNormal)'}
      strokeWidth="0.8"
      strokeDasharray="1.5 1"
    />
    {/* Vành vòng tròn chim Lạc bay ngược chiều kim đồng hồ (Chuẩn Ảnh 1) */}
    <circle
      cx="20"
      cy="20"
      r="13.5"
      stroke={active ? 'url(#drumBronzeGradActive)' : 'url(#drumBronzeGradNormal)'}
      strokeWidth="0.8"
    />
    {/* 4 cánh chim Lạc cách điệu trên vòng tròn */}
    <path
      d="M20 7C22 7 24 5.5 25 5L24 7.5L26 8M33 20C33 22 34.5 24 35 25L32.5 24L32 26M20 33C18 33 16 34.5 15 35L16 32.5L14 32M7 20C7 18 5.5 16 5 15L7.5 16L8 14"
      stroke={active ? 'url(#drumBronzeGradActive)' : 'url(#drumBronzeGradNormal)'}
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Vành trong và tâm sao mặt trời 14 cánh */}
    <circle
      cx="20"
      cy="20"
      r="9.5"
      stroke={active ? 'url(#drumBronzeGradActive)' : 'url(#drumBronzeGradNormal)'}
      strokeWidth="0.8"
      strokeDasharray="1 1"
    />
    <circle
      cx="20"
      cy="20"
      r="3.8"
      fill={active ? 'url(#drumBronzeGradActive)' : 'url(#drumBronzeGradNormal)'}
    />
    {/* 14 tia sao mặt trời Đông Sơn chiếu tỏa */}
    <path
      d="M20 10.5L20.8 17.2L24 11.5L22.5 17.8L27 14.5L23.5 18.8L29 19.5L24 21L28 24.2L23 23L25 27.2L21.5 24L20.5 29.5L19.5 24L16 27.2L17.5 23L12.5 24.2L16.5 21L11.5 19.5L17 18.8L13.5 14.5L18 17.8L16.5 11.5L19.5 17.2Z"
      fill={active ? 'url(#drumBronzeGradActive)' : 'url(#drumBronzeGradNormal)'}
    />
  </svg>
);

// 3. Áo Dài truyền thống (Nón lá vàng kim & tà áo hoa sen hồng thướt tha - Chuẩn 100% Ảnh 3)
export const AoDaiMiniIcon: React.FC<{ className?: string; active?: boolean }> = ({
  className = 'w-5 h-5',
  active = false
}) => (
  <svg
    viewBox="0 0 32 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      {/* Gradient cho Nón Lá vàng kim */}
      <linearGradient id="nonLaGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>

      {/* Gradient cho các vạt Áo Dài cánh sen màu hồng thắm (Chuẩn 100% Ảnh 3) */}
      <linearGradient id="aoDaiPetalPink1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="50%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
      <linearGradient id="aoDaiPetalPink2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="50%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
      <linearGradient id="aoDaiPetalPink3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#9D174D" />
      </linearGradient>

      {/* Khi active: viền sáng bóng để nổi bật trên nền đỏ */}
      <linearGradient id="aoDaiActiveWhite" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#FCE7F3" />
        <stop offset="100%" stopColor="#F472B6" />
      </linearGradient>
    </defs>

    {/* 1. NÓN LÁ VÀNG KIM BAY PHÍA TRÊN (Chuẩn Ảnh 3) */}
    <path
      d="M16 2 L22.5 8.5 C19 10 13 10 9.5 8.5 Z"
      fill="url(#nonLaGold)"
      filter="drop-shadow(0 1px 1px rgba(0,0,0,0.18))"
    />

    {/* 2. DÁNG ÁO DÀI CÁNH HOA SEN THƯỚT THA (Chuẩn 100% Ảnh 3) */}
    {/* Vạt áo sau uốn cong sang phải */}
    <path
      d="M17 18 C19 22 24 25 28 33 C23 35 18 31 16 28 Z"
      fill={active ? '#BE185D' : 'url(#aoDaiPetalPink3)'}
    />

    {/* Thân áo trên và vạt trước uốn lượn thướt tha */}
    <path
      d="M17.5 10 C15 11 13.5 13.5 14.5 17 C15.5 21 16 24 16.5 29 C15 32 12 34 8 32 C13 27 15 22 15 17 C15 13.5 17 11 17.5 10 Z"
      fill={active ? 'url(#aoDaiActiveWhite)' : 'url(#aoDaiPetalPink1)'}
    />

    {/* Vạt cánh hoa bung xòe phía trước bồng bềnh */}
    <path
      d="M14.5 17 C16 20 18 24 17.5 29 C17 33 13 35 10 33 C7 31 9 26 12 23 C13.5 21 14 18.5 14.5 17 Z"
      fill={active ? '#FDA4AF' : 'url(#aoDaiPetalPink2)'}
    />

    {/* Đuôi tà áo xẻ lượn sóng nhọn mềm mại ở đáy */}
    <path
      d="M10 33 C8.5 35 7.5 38 8 39 C9 37 11 35 12 34 Z"
      fill={active ? '#FEF08A' : '#BE185D'}
    />
  </svg>
);



