import React, { useState } from 'react';
import { RotateCw, Check } from 'lucide-react';

export type GenealogyNodeId =
  | 'all'
  | 'giao-linh'
  | 'vien-linh'
  | 'lap-linh'
  | 'ao-tac'
  | 'tay-chen'
  | 'dich-chuyen'
  | 'nhat-binh'
  | 'tu-than'
  | 'ba-ba';

interface DongSonDrumGenealogyProps {
  activeNode: GenealogyNodeId;
  onSelectNode: (nodeId: GenealogyNodeId) => void;
  costumeCounts: Record<string, number>;
}

// Convert polar coordinates to Cartesian (0 deg is top/North, clockwise)
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

// Draw an annular sector (pie slice with hole)
function describeArcSector(
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
) {
  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, startAngle);
  const endInner = polarToCartesian(x, y, innerRadius, endAngle);

  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', startOuter.x, startOuter.y,
    'A', outerRadius, outerRadius, 0, arcSweep, 0, endOuter.x, endOuter.y,
    'L', startInner.x, startInner.y,
    'A', innerRadius, innerRadius, 0, arcSweep, 1, endInner.x, endInner.y,
    'Z'
  ].join(' ');
}

export const DongSonDrumGenealogy: React.FC<DongSonDrumGenealogyProps> = ({
  activeNode,
  onSelectNode,
  costumeCounts
}) => {
  const [hoveredNode, setHoveredNode] = useState<GenealogyNodeId | null>(null);

  // SVG Center & Radii
  const cx = 260;
  const cy = 260;
  const r0 = 62;   // Center circle (Áo Cổ Truyền)
  const r1 = 66;   // Inner Ring start
  const r2 = 145;  // Inner Ring end / Outer Ring start
  const r3 = 238;  // Outer Ring end
  const gap = 1.2; // Tiny gap between sectors for sharp precision

  const isSelected = (id: GenealogyNodeId) => activeNode === id;
  const isHovered = (id: GenealogyNodeId) => hoveredNode === id;

  // Active or hovered style generator: Đổi sang màu vàng hoàng kim (Imperial Gold / Vàng Đồng Đông Sơn)
  const getSectorFill = (id: GenealogyNodeId, isBlank = false) => {
    if (isBlank) return '#F7F4EE';
    if (isSelected(id)) return '#D97706'; // Vàng Hoàng Kim rực rỡ khi được chọn
    if (isHovered(id)) return '#FEF3C7';  // Màu vàng kem ấm áp khi rê chuột
    return '#FFFFFF';                     // Clean Ivory White
  };

  const getSectorStroke = (id: GenealogyNodeId, isBlank = false) => {
    if (isBlank) return '#E2D9C8';
    if (isSelected(id)) return '#B45309'; // Viền đồng thau / hổ phách đậm
    if (isHovered(id)) return '#D97706';
    return '#C29B38'; // Dong Son Bronze Gold
  };

  const getTextColor = (id: GenealogyNodeId) => {
    if (isSelected(id)) return '#FFFFFF';
    return '#1C1917';
  };

  const getSubTextColor = (id: GenealogyNodeId) => {
    if (isSelected(id)) return '#FEF3C7';
    return '#78716C';
  };

  // Node label map - Rút gọn tên gọn gàng để không bao giờ bị rớt dòng đẩy trống đồng
  const activeLabelMap: Record<GenealogyNodeId, string> = {
    all: 'Tất cả cổ phục',
    'giao-linh': 'Áo Giao Lĩnh',
    'vien-linh': 'Áo Viên Lĩnh',
    'lap-linh': 'Áo Lập Lĩnh',
    'ao-tac': 'Áo Tấc',
    'tay-chen': 'Áo Tay Chẽn',
    'dich-chuyen': 'Hệ Dịch Chuyển',
    'nhat-binh': 'Áo Nhật Bình',
    'tu-than': 'Áo Tứ Thân',
    'ba-ba': 'Áo Bà Ba'
  };

  return (
    <div className="relative rounded-3xl bg-white text-[#1C1917] p-5 sm:p-7 shadow-sm border border-[#F4C2CE] overflow-hidden flex flex-col items-center">
      {/* Background Subtle Watermark */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C84B69]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Status & Reset Bar - Chiều cao cố định chuẩn h-10, ngăn tuyệt đối việc rớt dòng làm thụt trống đồng */}
      <div className="w-full max-w-xl h-10 min-h-[40px] flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#F5E6EA] text-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] shrink-0 animate-pulse" />
          <span className="text-[#78716C] shrink-0">Đang chọn:</span>
          <span className="font-serif font-bold text-[#B45309] text-sm truncate">
            {activeLabelMap[activeNode]}
          </span>
        </div>

        {activeNode !== 'all' && (
          <button
            onClick={() => onSelectNode('all')}
            className="text-[11px] px-2.5 py-1 rounded-full bg-[#FEF3C7] hover:bg-[#D97706] text-[#B45309] hover:text-white border border-[#FDE68A] transition-all flex items-center gap-1 cursor-pointer font-medium shrink-0 shadow-2xs"
            title="Xem toàn bộ cổ phục"
          >
            <RotateCw className="w-3 h-3" />
            <span>Xem tất cả</span>
          </button>
        )}
      </div>

      {/* Sơ Đồ Trống Đồng Tối Giản & Đối Xứng (Symmetrical Minimalist Bronze Drum Wheel) */}
      <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center select-none py-2">
        <svg
          className="w-full h-full drop-shadow-md"
          viewBox="0 0 520 520"
        >
          {/* VÀNH NGOÀI CÙNG: Đường tròn viền trống đồng */}
          <circle
            cx={cx}
            cy={cy}
            r="248"
            fill="none"
            stroke="#C29B38"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.5"
          />
          <circle
            cx={cx}
            cy={cy}
            r="243"
            fill="none"
            stroke="#C29B38"
            strokeWidth="1"
            opacity="0.7"
          />

          {/* ========================================================
              VÀNH NGOÀI (r: 148 -> 238) - ĐỐI XỨNG 4 GÓC
              ======================================================== */}

          {/* --- GÓC PHẢI DƯỚI (90° -> 180°): Áo Lập Lĩnh rẽ thành 2 ô --- */}
          {/* Ô 1: Áo Tấc (90° -> 135°) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectNode('ao-tac')}
            onMouseEnter={() => setHoveredNode('ao-tac')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <path
              d={describeArcSector(cx, cy, 148, r3, 90 + gap, 135 - gap)}
              fill={getSectorFill('ao-tac')}
              stroke={getSectorStroke('ao-tac')}
              strokeWidth={isSelected('ao-tac') ? 2.5 : 1.2}
            />
            {/* Tọa độ tâm cung: angle = 112.5°, r = 193 */}
            {(() => {
              const pt = polarToCartesian(cx, cy, 193, 112.5);
              return (
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-serif font-bold text-xs pointer-events-none"
                  fill={getTextColor('ao-tac')}
                >
                  <tspan x={pt.x} dy="-6">Áo Tấc</tspan>
                  <tspan x={pt.x} dy="13" fontSize="9" fontWeight="normal" fill={getSubTextColor('ao-tac')}>
                    (Tay rộng)
                  </tspan>
                </text>
              );
            })()}
          </g>

          {/* Ô 2: Áo Tay Chẽn (135° -> 180°) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectNode('tay-chen')}
            onMouseEnter={() => setHoveredNode('tay-chen')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <path
              d={describeArcSector(cx, cy, 148, r3, 135 + gap, 180 - gap)}
              fill={getSectorFill('tay-chen')}
              stroke={getSectorStroke('tay-chen')}
              strokeWidth={isSelected('tay-chen') ? 2.5 : 1.2}
            />
            {/* Tọa độ tâm cung: angle = 157.5°, r = 193 */}
            {(() => {
              const pt = polarToCartesian(cx, cy, 193, 157.5);
              return (
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-serif font-bold text-xs pointer-events-none"
                  fill={getTextColor('tay-chen')}
                >
                  <tspan x={pt.x} dy="-6">Áo Tay Chẽn</tspan>
                  <tspan x={pt.x} dy="13" fontSize="9" fontWeight="normal" fill={getSubTextColor('tay-chen')}>
                    (Tay gọn)
                  </tspan>
                </text>
              );
            })()}
          </g>

          {/* --- GÓC TRÁI DƯỚI (180° -> 270°): Hệ Dịch Chuyển rẽ thành 3 ô --- */}
          {/* Ô 1: Áo Nhật Bình (180° -> 210°) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectNode('nhat-binh')}
            onMouseEnter={() => setHoveredNode('nhat-binh')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <path
              d={describeArcSector(cx, cy, 148, r3, 180 + gap, 210 - gap)}
              fill={getSectorFill('nhat-binh')}
              stroke={getSectorStroke('nhat-binh')}
              strokeWidth={isSelected('nhat-binh') ? 2.5 : 1.2}
            />
            {(() => {
              const pt = polarToCartesian(cx, cy, 193, 195);
              return (
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-serif font-bold text-[11px] pointer-events-none"
                  fill={getTextColor('nhat-binh')}
                >
                  <tspan x={pt.x} dy="-5">Nhật Bình</tspan>
                  <tspan x={pt.x} dy="12" fontSize="8.5" fontWeight="normal" fill={getSubTextColor('nhat-binh')}>
                    (Cung đình)
                  </tspan>
                </text>
              );
            })()}
          </g>

          {/* Ô 2: Áo Tứ Thân (210° -> 240°) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectNode('tu-than')}
            onMouseEnter={() => setHoveredNode('tu-than')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <path
              d={describeArcSector(cx, cy, 148, r3, 210 + gap, 240 - gap)}
              fill={getSectorFill('tu-than')}
              stroke={getSectorStroke('tu-than')}
              strokeWidth={isSelected('tu-than') ? 2.5 : 1.2}
            />
            {(() => {
              const pt = polarToCartesian(cx, cy, 193, 225);
              return (
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-serif font-bold text-[11px] pointer-events-none"
                  fill={getTextColor('tu-than')}
                >
                  <tspan x={pt.x} dy="-5">Tứ Thân</tspan>
                  <tspan x={pt.x} dy="12" fontSize="8.5" fontWeight="normal" fill={getSubTextColor('tu-than')}>
                    (Bắc Bộ)
                  </tspan>
                </text>
              );
            })()}
          </g>

          {/* Ô 3: Áo Bà Ba (240° -> 270°) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectNode('ba-ba')}
            onMouseEnter={() => setHoveredNode('ba-ba')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <path
              d={describeArcSector(cx, cy, 148, r3, 240 + gap, 270 - gap)}
              fill={getSectorFill('ba-ba')}
              stroke={getSectorStroke('ba-ba')}
              strokeWidth={isSelected('ba-ba') ? 2.5 : 1.2}
            />
            {(() => {
              const pt = polarToCartesian(cx, cy, 193, 255);
              return (
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-serif font-bold text-[11px] pointer-events-none"
                  fill={getTextColor('ba-ba')}
                >
                  <tspan x={pt.x} dy="-5">Bà Ba</tspan>
                  <tspan x={pt.x} dy="12" fontSize="8.5" fontWeight="normal" fill={getSubTextColor('ba-ba')}>
                    (Nam Bộ)
                  </tspan>
                </text>
              );
            })()}
          </g>

          {/* --- GÓC TRÁI TRÊN (270° -> 360°): Áo Giao Lĩnh (Các ô trống tối giản đối xứng) --- */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectNode('giao-linh')}
            onMouseEnter={() => setHoveredNode('giao-linh')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Slot 1: 270° -> 315° */}
            <path
              d={describeArcSector(cx, cy, 148, r3, 270 + gap, 315 - gap)}
              fill={isSelected('giao-linh') ? '#FEF3C7' : getSectorFill('giao-linh', true)}
              stroke={isSelected('giao-linh') ? '#D97706' : getSectorStroke('giao-linh', true)}
              strokeWidth={1}
            />
            {/* Slot 2: 315° -> 360° */}
            <path
              d={describeArcSector(cx, cy, 148, r3, 315 + gap, 360 - gap)}
              fill={isSelected('giao-linh') ? '#FEF3C7' : getSectorFill('giao-linh', true)}
              stroke={isSelected('giao-linh') ? '#D97706' : getSectorStroke('giao-linh', true)}
              strokeWidth={1}
            />
            {/* Subtle empty marker */}
            {(() => {
              const pt = polarToCartesian(cx, cy, 193, 315);
              return (
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-serif text-[10px] pointer-events-none"
                  fill="#A89F91"
                >
                  (Hệ Giao Lĩnh)
                </text>
              );
            })()}
          </g>

          {/* --- GÓC PHẢI TRÊN (0° -> 90°): Áo Viên Lĩnh (Các ô trống tối giản đối xứng) --- */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectNode('vien-linh')}
            onMouseEnter={() => setHoveredNode('vien-linh')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Slot 1: 0° -> 45° */}
            <path
              d={describeArcSector(cx, cy, 148, r3, 0 + gap, 45 - gap)}
              fill={isSelected('vien-linh') ? '#FEF3C7' : getSectorFill('vien-linh', true)}
              stroke={isSelected('vien-linh') ? '#D97706' : getSectorStroke('vien-linh', true)}
              strokeWidth={1}
            />
            {/* Slot 2: 45° -> 90° */}
            <path
              d={describeArcSector(cx, cy, 148, r3, 45 + gap, 90 - gap)}
              fill={isSelected('vien-linh') ? '#FEF3C7' : getSectorFill('vien-linh', true)}
              stroke={isSelected('vien-linh') ? '#D97706' : getSectorStroke('vien-linh', true)}
              strokeWidth={1}
            />
            {/* Subtle empty marker */}
            {(() => {
              const pt = polarToCartesian(cx, cy, 193, 45);
              return (
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-serif text-[10px] pointer-events-none"
                  fill="#A89F91"
                >
                  (Hệ Viên Lĩnh)
                </text>
              );
            })()}
          </g>

          {/* ========================================================
              VÀNH TRONG (r: 68 -> 144) - ĐỐI XỨNG CHUẨN 4 CUNG 90°
              ======================================================== */}

          {/* Cung 1: Áo Viên Lĩnh (Đông Bắc: 0° -> 90°) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectNode('vien-linh')}
            onMouseEnter={() => setHoveredNode('vien-linh')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <path
              d={describeArcSector(cx, cy, r1, r2, 0 + gap, 90 - gap)}
              fill={getSectorFill('vien-linh')}
              stroke={getSectorStroke('vien-linh')}
              strokeWidth={isSelected('vien-linh') ? 2.5 : 1.5}
            />
            {(() => {
              const pt = polarToCartesian(cx, cy, 106, 45);
              return (
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-serif font-bold text-xs pointer-events-none"
                  fill={getTextColor('vien-linh')}
                >
                  <tspan x={pt.x} dy="-6">Áo Viên Lĩnh</tspan>
                  <tspan x={pt.x} dy="13" fontSize="9" fontWeight="normal" fill={getSubTextColor('vien-linh')}>
                    (Cổ tròn)
                  </tspan>
                </text>
              );
            })()}
          </g>

          {/* Cung 2: Áo Lập Lĩnh (Đông Nam: 90° -> 180°) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectNode('lap-linh')}
            onMouseEnter={() => setHoveredNode('lap-linh')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <path
              d={describeArcSector(cx, cy, r1, r2, 90 + gap, 180 - gap)}
              fill={['lap-linh', 'ao-tac', 'tay-chen'].includes(activeNode) || hoveredNode === 'lap-linh' ? (activeNode === 'lap-linh' ? '#D97706' : '#FEF3C7') : getSectorFill('lap-linh')}
              stroke={getSectorStroke('lap-linh')}
              strokeWidth={isSelected('lap-linh') ? 2.5 : 1.5}
            />
            {(() => {
              const pt = polarToCartesian(cx, cy, 106, 135);
              const isActive = activeNode === 'lap-linh';
              return (
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-serif font-bold text-xs pointer-events-none"
                  fill={isActive ? '#FFFFFF' : '#1C1917'}
                >
                  <tspan x={pt.x} dy="-6">Áo Lập Lĩnh</tspan>
                  <tspan x={pt.x} dy="13" fontSize="9" fontWeight="normal" fill={isActive ? '#FDEBF0' : '#78716C'}>
                    (Cổ đứng)
                  </tspan>
                </text>
              );
            })()}
          </g>

          {/* Cung 3: Hệ Dịch Chuyển (Tây Nam: 180° -> 270°) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectNode('dich-chuyen')}
            onMouseEnter={() => setHoveredNode('dich-chuyen')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <path
              d={describeArcSector(cx, cy, r1, r2, 180 + gap, 270 - gap)}
              fill={['dich-chuyen', 'nhat-binh', 'tu-than', 'ba-ba'].includes(activeNode) || hoveredNode === 'dich-chuyen' ? (activeNode === 'dich-chuyen' ? '#D97706' : '#FEF3C7') : getSectorFill('dich-chuyen')}
              stroke={getSectorStroke('dich-chuyen')}
              strokeWidth={isSelected('dich-chuyen') ? 2.5 : 1.5}
            />
            {(() => {
              const pt = polarToCartesian(cx, cy, 106, 225);
              const isActive = activeNode === 'dich-chuyen';
              return (
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-serif font-bold text-xs pointer-events-none"
                  fill={isActive ? '#FFFFFF' : '#1C1917'}
                >
                  <tspan x={pt.x} dy="-6">Hệ Dịch Chuyển</tspan>
                  <tspan x={pt.x} dy="13" fontSize="9" fontWeight="normal" fill={isActive ? '#FDEBF0' : '#78716C'}>
                    (Phát triển)
                  </tspan>
                </text>
              );
            })()}
          </g>

          {/* Cung 4: Áo Giao Lĩnh (Tây Bắc: 270° -> 360°) */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectNode('giao-linh')}
            onMouseEnter={() => setHoveredNode('giao-linh')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <path
              d={describeArcSector(cx, cy, r1, r2, 270 + gap, 360 - gap)}
              fill={getSectorFill('giao-linh')}
              stroke={getSectorStroke('giao-linh')}
              strokeWidth={isSelected('giao-linh') ? 2.5 : 1.5}
            />
            {(() => {
              const pt = polarToCartesian(cx, cy, 106, 315);
              return (
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-serif font-bold text-xs pointer-events-none"
                  fill={getTextColor('giao-linh')}
                >
                  <tspan x={pt.x} dy="-6">Áo Giao Lĩnh</tspan>
                  <tspan x={pt.x} dy="13" fontSize="9" fontWeight="normal" fill={getSubTextColor('giao-linh')}>
                    (Cổ chéo)
                  </tspan>
                </text>
              );
            })()}
          </g>

          {/* ========================================================
              TÂM TRỐNG: ÁO CỔ TRUYỀN (Mặt trời Đông Sơn 14 tia)
              ======================================================== */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => onSelectNode('all')}
            onMouseEnter={() => setHoveredNode('all')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Vòng nền tâm */}
            <circle
              cx={cx}
              cy={cy}
              r={r0}
              fill={activeNode === 'all' ? '#D97706' : '#FFFDF9'}
              stroke={activeNode === 'all' ? '#B45309' : '#C29B38'}
              strokeWidth={activeNode === 'all' ? 2.5 : 1.5}
            />

            {/* 14 tia mặt trời Đông Sơn mảnh mai thanh thoát */}
            {Array.from({ length: 14 }).map((_, i) => {
              const angle = (i * 360) / 14;
              return (
                <polygon
                  key={i}
                  points={`${cx},${cy - r0 + 4} ${cx - 5},${cy - 28} ${cx + 5},${cy - 28}`}
                  transform={`rotate(${angle} ${cx} ${cy})`}
                  fill={activeNode === 'all' ? '#FEF3C7' : '#C29B38'}
                  opacity={activeNode === 'all' ? 0.95 : 0.45}
                />
              );
            })}

            {/* Vòng tròn trung tâm */}
            <circle
              cx={cx}
              cy={cy}
              r="28"
              fill={activeNode === 'all' ? '#B45309' : '#FAF5ED'}
              stroke="#C29B38"
              strokeWidth="1.2"
            />

            {/* Text Tâm Trống: Áo Cổ Truyền */}
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              className="font-serif font-bold text-[11px] pointer-events-none"
              fill={activeNode === 'all' ? '#FFFFFF' : '#8A5D19'}
            >
              <tspan x={cx} dy="-5">Áo Cổ</tspan>
              <tspan x={cx} dy="12">Truyền</tspan>
            </text>
          </g>
        </svg>
      </div>

      {/* Footer gợi ý bấm */}
      <div className="text-center pt-2 text-[11px] text-[#78716C] font-light">
        Bấm vào bất kỳ ô nào trên vòng trống để lọc danh mục trang phục tương ứng
      </div>
    </div>
  );
};
