import React, { useState } from 'react';
import { Costume, EventItem, FittingDraft } from '../types';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Info,
  Sun,
  Wind,
  Snowflake,
  CloudRain,
  Compass,
  Check,
  ArrowRight,
  BookOpen,
  Palette,
  Eye,
  Layers,
  Heart
} from 'lucide-react';
import { TrienSonSeal } from './VietnameseMotifs';
import { styleMatrix, heritagePresets, weatherGuidance, occasionGuidanceByKey } from '../../content/lookbooks/ao-dai.ts';
import type { OccasionKey, WeatherKey, VibeKey } from '../../content/lookbooks/ao-dai.ts';
export type { OccasionKey, WeatherKey, VibeKey } from '../../content/lookbooks/ao-dai.ts';

interface AoDaiRecommenderProps {
  onStartRemix: (costume: Costume, preset?: Partial<FittingDraft>) => void;
  aoDaiCostume?: Costume;
}

export const AoDaiRecommender: React.FC<AoDaiRecommenderProps> = ({
  onStartRemix,
  aoDaiCostume
}) => {
  // 3-Step Filter States
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionKey>('tet');
  const [selectedWeather, setSelectedWeather] = useState<WeatherKey>('mild');
  const [selectedVibe, setSelectedVibe] = useState<VibeKey>('traditional');
  const [showFactModal, setShowFactModal] = useState<boolean>(false);
  const [customColor, setCustomColor] = useState<string | null>(null);
  const [customTrouserColor, setCustomTrouserColor] = useState<string | null>(null);

  const weatherRecommendation = weatherGuidance[selectedWeather];
  const occasionGuidance = occasionGuidanceByKey[selectedOccasion];

  const activeVibe = styleMatrix[selectedVibe];
  const activeColorHex = customColor || activeVibe.recommendedHex;
  const activeTrouserHex = customTrouserColor || activeVibe.recommendedTrouserHex;

  // Handle Preset Click
  const handleApplyPreset = (p: typeof heritagePresets[0]) => {
    setCustomColor(p.topHex);
    setCustomTrouserColor(p.trouserHex);
  };

  // Launch into Studio
  const handleLaunchStudio = () => {
    if (aoDaiCostume) {
      onStartRemix(aoDaiCostume, {
        remixStyle: selectedVibe === 'traditional' ? 'traditional' : selectedVibe === 'vintage' ? 'subtle_modern' : 'remix_fusion',
        selectedColorId: activeColorHex,
        customPrompt: `Áo dài phong cách ${activeVibe.name}, thời tiết ${weatherRecommendation.title}, dịp ${occasionGuidance.name}`
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Header: Tinh thần Tảng Băng Chìm */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-[#F4EFEA] to-[#FFF5F7] border border-[#F4C2CE] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 opacity-10 pointer-events-none">
          <TrienSonSeal text="Áo Dài" size="lg" />
        </div>

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C84B69]/10 border border-[#C84B69]/20 text-[#C84B69] text-xs font-serif font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Việt Phục Discovery Engine • Cỗ Máy Gợi Ý Áo Dài</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1C1917] tracking-tight leading-tight">
            Gợi Ý Phối Áo Dài Chuẩn Văn Hóa & Thời Thượng
          </h1>
          <p className="text-sm text-[#57534E] font-light leading-relaxed">
            Hệ tri thức thông minh chắt lọc từ di sản thế kỷ 18 đến nay. Chỉ cần 3 chạm đơn giản để nhận gợi ý set đồ hoàn chỉnh, chuẩn thời tiết và an toàn văn hóa.
          </p>
        </div>
      </div>

      {/* 3-Step Filter Panel: Tinh gọn, trực quan, không chữ thừa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Dịp đi đâu? */}
        <div className="bg-[#FFFFFF] border border-[#F4C2CE] rounded-xl p-4.5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
            <span className="text-xs font-serif font-bold text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#C84B69] text-white flex items-center justify-center text-[10px]">1</span>
              Dịp Bạn Tham Gia?
            </span>
            <span className="text-[10px] text-[#C84B69] font-semibold">{occasionGuidance.badge}</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {[
              { id: 'tet', label: '🧧 Tết & Du Xuân', desc: 'Rực rỡ, may mắn đầu năm' },
              { id: 'wedding', label: '💒 Lễ Cưới & Gia Tiên', desc: 'Trọng thể, linh thiêng hôn lễ' },
              { id: 'yearbook', label: '🎓 Kỷ Yếu & Tốt Nghiệp', desc: 'Thanh xuân học đường' },
              { id: 'street', label: '☕ Dạo Phố & Cà Phê', desc: 'Trẻ trung, thoải mái vận động' },
              { id: 'temple', label: '🏛️ Đi Lễ Chùa & Nghi Lễ', desc: 'Kín đáo, tôn nghiêm' }
            ].map((occ) => (
              <button
                key={occ.id}
                onClick={() => setSelectedOccasion(occ.id as OccasionKey)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                  selectedOccasion === occ.id
                    ? 'bg-[#C84B69] text-white font-medium shadow-xs'
                    : 'bg-[#FFF5F7] hover:bg-[#F0EBE3] text-[#44403C]'
                }`}
              >
                <span>{occ.label}</span>
                {selectedOccasion === occ.id && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Thời tiết thế nào? */}
        <div className="bg-[#FFFFFF] border border-[#F4C2CE] rounded-xl p-4.5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
            <span className="text-xs font-serif font-bold text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#C84B69] text-white flex items-center justify-center text-[10px]">2</span>
              Thời Tiết Hôm Nay?
            </span>
            <span className="text-[10px] text-[#0F766E] font-semibold">{weatherRecommendation.tag}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'mild', label: 'Mát Mẻ', sub: '20°C - 28°C', icon: Wind, color: 'text-teal-600' },
              { id: 'hot', label: 'Nắng Nóng', sub: '> 30°C', icon: Sun, color: 'text-amber-500' },
              { id: 'cold', label: 'Se Lạnh', sub: '< 18°C', icon: Snowflake, color: 'text-blue-500' },
              { id: 'rainy', label: 'Mưa & Ẩm', sub: 'Chống bẩn', icon: CloudRain, color: 'text-slate-600' }
            ].map((w) => {
              const IconComp = w.icon;
              const isSelected = selectedWeather === w.id;
              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedWeather(w.id as WeatherKey)}
                  className={`p-2.5 rounded-lg border text-left transition-all flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-[#C84B69]/10 border-[#C84B69] text-[#C84B69] font-semibold'
                      : 'bg-[#FFF5F7] border-[#F4C2CE] hover:bg-[#F5EFEA] text-[#57534E]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-[#C84B69]' : w.color}`} />
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#C84B69]" />}
                  </div>
                  <span className="text-xs font-medium">{w.label}</span>
                  <span className="text-[10px] text-[#A8A29E] font-light">{w.sub}</span>
                </button>
              );
            })}
          </div>

          <div className="p-2.5 rounded-lg bg-[#FFF5F7] border border-[#F4C2CE] text-[11px] text-[#78716C] leading-relaxed">
            <span className="font-semibold text-[#1C1917]">Khuyên dùng: </span>
            {weatherRecommendation.fabricTip}
          </div>
        </div>

        {/* Step 3: Gu của bạn là gì? */}
        <div className="bg-[#FFFFFF] border border-[#F4C2CE] rounded-xl p-4.5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
            <span className="text-xs font-serif font-bold text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#C84B69] text-white flex items-center justify-center text-[10px]">3</span>
              Gu / Phong Cách?
            </span>
            <span className="text-[10px] text-[#C29B38] font-semibold">{activeVibe.name}</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 max-h-[195px] overflow-y-auto pr-1">
            {[
              { id: 'traditional', label: '🏛️ Truyền Thống Chuẩn Mực' },
              { id: 'elegant', label: '👑 Quý Phái & Trưởng Thành' },
              { id: 'minimal', label: '🤍 Tối Giản Đương Đại' },
              { id: 'vintage', label: '📻 Sài Gòn Retro 1968' },
              { id: 'genz', label: '⚡ Gen Z Phá Cách' },
              { id: 'contemporary', label: '🎨 Đương Đại Nghệ Thuật' },
              { id: 'streetwear', label: '🛹 Streetwear Fusion' }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVibe(v.id as VibeKey);
                  setCustomColor(null);
                  setCustomTrouserColor(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                  selectedVibe === v.id
                    ? 'bg-[#1C1917] text-white font-medium shadow-xs'
                    : 'bg-[#FFF5F7] hover:bg-[#F0EBE3] text-[#44403C]'
                }`}
              >
                <span>{v.label}</span>
                {selectedVibe === v.id && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Result: The Outfit Recommendation Card */}
      <div className="bg-[#FFFFFF] border-2 border-[#F4C2CE] rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Illustrative lookbook photo */}
        <div className="lg:col-span-5 relative group">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#FFF5F7] border border-[#F4C2CE] shadow-md">
            <img
              src={activeVibe.imageUrl}
              alt={activeVibe.imageAlt}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Color Overlay Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C1917]/80 backdrop-blur-md text-white text-xs font-serif shadow-sm">
              <span className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: activeColorHex }} />
              <span>Phối màu: {activeVibe.name}</span>
            </div>

            {/* License attribution tiny tag */}
            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs px-2 py-1 rounded text-[10px] text-white/80 font-mono text-center truncate">
              {activeVibe.photoCredit} • {activeVibe.licenseText} • Hồ sơ chưa đối chiếu đầy đủ
            </div>
          </div>
        </div>

        {/* Right: Outfit Formula & Cultural Safety */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Cultural Safety Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  activeVibe.safetyLevel === 'PRESERVE'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : activeVibe.safetyLevel === 'SAFE'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{activeVibe.safetyLabel}</span>
              </div>

              <span className="text-xs text-[#78716C] px-2.5 py-1 rounded-full bg-[#F5F2EB]">
                {occasionGuidance.name}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
              {activeVibe.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] font-light">
              {activeVibe.subtitle}
            </p>
          </div>

          {/* Công Thức Phối 3 Món Chuẩn */}
          <div className="space-y-3 bg-[#FFF5F7] p-4.5 rounded-xl border border-[#F4C2CE]">
            <span className="text-xs font-serif font-bold text-[#C84B69] uppercase tracking-wider block">
              ✦ Công thức phối đồ đề xuất:
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#C84B69]/10 text-[#C84B69] font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                  Áo
                </span>
                <span className="text-[#1C1917] leading-relaxed">
                  {activeVibe.topDesc}
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#C29B38]/15 text-[#C29B38] font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                  Quần
                </span>
                <span className="text-[#1C1917] leading-relaxed">
                  {activeVibe.bottomDesc}
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#0F766E]/15 text-[#0F766E] font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                  Phụ kiện
                </span>
                <span className="text-[#57534E] leading-relaxed">
                  {activeVibe.accDesc}
                </span>
              </div>
            </div>
          </div>

          {/* Cultural Safety Explanation */}
          <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold block">Lời khuyên an toàn văn hóa:</span>
              <p className="font-light text-[11px] leading-relaxed">{activeVibe.safetyTip}</p>
            </div>
          </div>

          {/* Chuyện của áo (Fact Bite Button) */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setShowFactModal(!showFactModal)}
              className="inline-flex items-center gap-1.5 text-xs text-[#C84B69] hover:text-[#B33B58] font-medium transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showFactModal ? 'Thu gọn chuyện của áo' : '💡 Đọc chuyện của chiếc áo này'}</span>
            </button>
          </div>

          {showFactModal && (
            <div className="p-3.5 rounded-lg bg-[#FAF5EE] border border-[#E8DFC8] text-xs text-[#57534E] space-y-1 animate-fade-in">
              <span className="font-serif font-bold text-[#1C1917] block">Chi tiết lịch sử:</span>
              <p className="font-light leading-relaxed">{activeVibe.factBite}</p>
            </div>
          )}

          {/* Launch into Studio Button */}
          <div className="pt-2">
            <button
              onClick={handleLaunchStudio}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#C84B69] hover:bg-[#B33B58] text-[#FFF5F7] font-medium text-sm tracking-wide shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Layers className="w-4 h-4" />
              <span>Mở Trong Phối Thử Studio 2D</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5 Heritage Color Presets: 1-Chạm Đổi Phong Cách */}
      <div className="bg-[#FFFFFF] border border-[#F4C2CE] rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
          <div>
            <h3 className="text-sm sm:text-base font-serif font-bold text-[#1C1917] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#C84B69]" />
              <span>Cỗ Máy Phối Màu 1-Chạm (5 Heritage Presets)</span>
            </h3>
            <p className="text-xs text-[#78716C] font-light">
              Bấm để áp dụng ngay bảng màu kinh điển không bao giờ lỗi mốt
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {heritagePresets.map((preset) => {
            const isApplied = activeColorHex.toUpperCase() === preset.topHex.toUpperCase();
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all space-y-2 flex flex-col justify-between ${
                  isApplied
                    ? 'bg-[#C84B69]/5 border-[#C84B69] shadow-xs'
                    : 'bg-[#FFF5F7] border-[#F4C2CE] hover:bg-[#F5EFEA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#1C1917]/10 text-[#1C1917] font-semibold">
                    {preset.badge}
                  </span>
                  {/* Two-Tone Color Swatches */}
                  <div className="flex items-center -space-x-1">
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: preset.topHex }}
                      title="Màu áo"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: preset.trouserHex }}
                      title="Màu quần"
                    />
                  </div>
                </div>

                <div>
                  <span className="font-serif font-bold text-xs text-[#1C1917] block">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-[#78716C] font-light line-clamp-1">
                    {preset.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
