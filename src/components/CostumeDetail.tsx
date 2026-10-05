import React from 'react';
import { Costume, EventItem } from '../types';
import { TrienXacThuc, HoaSenDivider, ChimLacIcon } from './VietnameseMotifs';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  MapPin,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shirt,
  Info,
  Quote,
  Clock,
  Compass
} from 'lucide-react';

interface CostumeDetailProps {
  costume: Costume;
  selectedEvent?: EventItem;
  onBack: () => void;
  onTryRemix: (costume: Costume) => void;
}

export const CostumeDetail: React.FC<CostumeDetailProps> = ({
  costume,
  selectedEvent,
  onBack,
  onTryRemix
}) => {
  return (
    <article className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Back Navigation */}
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-xs font-serif font-semibold text-[#57534E] hover:text-[#9B2C2C] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Trở về bộ sưu tập trang phục</span>
      </button>

      {/* Hero Editorial Header */}
      <div className="relative rounded-3xl overflow-hidden bg-[#FFFFFF] border border-[#E8E2D8] shadow-sm mb-12">
        <div className="h-[440px] w-full relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F5ECE1] to-[#FAF7F2] flex items-center justify-center p-6">
          <img
            src={costume.coverImage}
            alt={costume.name}
            className="max-h-[380px] w-auto max-w-full object-contain drop-shadow-md"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/90 via-[#1C1917]/20 to-transparent pointer-events-none" />

          {/* Hero Content Overlay */}
          <div className="absolute bottom-8 left-6 sm:left-10 right-6 sm:right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <TrienXacThuc className="bg-white/95" />
                <span className="text-xs px-3 py-1 rounded-sm bg-white/90 text-[#1C1917] font-serif border border-[#E8E2D8]">
                  {costume.era}
                </span>
                <span className="text-xs px-3 py-1 rounded-sm bg-white/90 text-[#1C1917] font-serif border border-[#E8E2D8]">
                  {costume.region}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-md">
                {costume.name}
              </h1>

              <p className="text-[#FAF7F2]/90 text-sm sm:text-base max-w-2xl font-light line-clamp-2">
                {costume.shortDescription}
              </p>
            </div>

            {/* Primary Action Button: "Phối thử bộ này" */}
            <button
              onClick={() => onTryRemix(costume)}
              className="shrink-0 flex items-center justify-center gap-2.5 px-8 py-4 rounded-sm bg-[#9B2C2C] hover:bg-[#832424] text-[#FAF7F2] font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all hover:scale-102 active:scale-98"
            >
              <ChimLacIcon className="w-4 h-4 text-[#FAF7F2]" />
              <span>Phối thử bộ này</span>
            </button>
          </div>
        </div>
      </div>

      {/* Historical Verification Banner */}
      <div
        className={`p-5 rounded-xl border mb-12 flex items-start gap-4 text-xs ${
          costume.isVerifiedHistoricalData
            ? 'bg-[#FAF7F2] border-[#E8E2D8] text-[#57534E]'
            : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-[#9B2C2C]/10 flex items-center justify-center shrink-0 mt-0.5">
          {costume.isVerifiedHistoricalData ? (
            <Quote className="w-4 h-4 text-[#9B2C2C]" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
          )}
        </div>
        <div className="space-y-1">
          <div className="font-serif font-bold text-sm text-[#1C1917]">
            {costume.isVerifiedHistoricalData
              ? 'Tư liệu lịch sử đối chiếu chính sử'
              : 'Nội dung mẫu đang trong quá trình thẩm định'}
          </div>
          <p className="leading-relaxed font-light text-[#57534E]">
            {costume.verificationNote}
          </p>
        </div>
      </div>

      {/* Grid: 2 Columns (Content & Styling Guide) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column (7 cols): History, Meaning, Components */}
        <div className="lg:col-span-7 space-y-10">
          {/* Lịch sử & Nguồn gốc (Presented as Narrative Milestones) */}
          <section className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-7 sm:p-8">
            <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#9B2C2C]" />
              Nguồn gốc và bối cảnh lịch sử
            </h2>
            <div className="relative pl-6 border-l-2 border-[#C29B38]/30 space-y-4">
              <div className="text-xs font-serif italic text-[#C29B38] font-bold">
                Quy chế định hình
              </div>
              <p className="text-sm text-[#57534E] leading-relaxed font-light text-justify">
                {costume.historicalContext}
              </p>
            </div>
          </section>

          {/* Ý nghĩa văn hóa */}
          <section className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-7 sm:p-8">
            <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2 mb-4">
              <Compass className="w-5 h-5 text-[#9B2C2C]" />
              Ý nghĩa văn hóa & Triết lý phục sức
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed font-light text-justify">
              {costume.culturalSignificance}
            </p>
          </section>

          {/* Bộ trang phục gồm (Thành phần quản lý layer) */}
          <section className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-7 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#9B2C2C]" />
                Bộ trang phục gồm ({costume.components.length} thành phần)
              </h2>
              <span className="text-xs text-[#78716C] font-serif">Theo thứ tự layer</span>
            </div>

            <p className="text-xs text-[#57534E] mb-6 font-light">
              Trang phục được quản lý nguyên bộ. Các thành phần dưới đây được định nghĩa rõ ràng về trật tự xếp chồng và tính bắt buộc:
            </p>

            <div className="space-y-3">
              {costume.components.map((comp) => (
                <div
                  key={comp.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-sm bg-[#FFFFFF] border border-[#E8E2D8] text-[#9B2C2C] flex items-center justify-center font-serif font-bold text-xs">
                      {comp.layerOrder}
                    </span>
                    <div>
                      <div className="font-semibold text-[#1C1917] flex items-center gap-2">
                        {comp.name}
                        {comp.isRequired ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#9B2C2C]/10 text-[#9B2C2C] border border-[#9B2C2C]/25">
                            Bắt buộc
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#FAF7F2] text-[#78716C] border border-[#E8E2D8]">
                            Tùy chọn
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#78716C] mt-0.5 font-light">
                        {comp.description}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#78716C] font-serif uppercase tracking-wider">
                    Lớp {comp.layerOrder}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Lưu ý lễ nghi */}
          <section className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-7 sm:p-8">
            <h2 className="text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-[#9B2C2C]" />
              Lưu ý lễ nghi khi sử dụng
            </h2>
            <ul className="space-y-3 text-xs text-[#57534E]">
              {costume.usageConsiderations.map((note, index) => (
                <li key={index} className="flex items-start gap-3 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9B2C2C] mt-2 shrink-0" />
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column (5 cols): Styling Guide ("Cách phối đồ") */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 text-xl font-serif font-bold text-[#1C1917] mb-6">
              <Shirt className="w-5 h-5 text-[#9B2C2C]" />
              Cẩm nang phối đồ chuẩn mực
            </div>

            <div className="space-y-6 text-xs">
              {/* Phụ kiện */}
              <div>
                <span className="font-serif font-bold text-[#1C1917] block mb-2">
                  Phụ kiện phù hợp:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {costume.stylingGuide.accessories.map((acc, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-sm bg-[#FAF7F2] border border-[#E8E2D8] text-[#57534E]"
                    >
                      {acc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Kiểu tóc & Khăn */}
              <div>
                <span className="font-serif font-bold text-[#1C1917] block mb-2">
                  Kiểu tóc & Khăn đội đầu:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {costume.stylingGuide.hairstyles.map((hair, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-sm bg-[#FAF7F2] border border-[#E8E2D8] text-[#57534E]"
                    >
                      {hair}
                    </span>
                  ))}
                </div>
              </div>

              {/* Giày dép */}
              <div>
                <span className="font-serif font-bold text-[#1C1917] block mb-2">
                  Giày dép:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {costume.stylingGuide.footwear.map((shoe, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-sm bg-[#FAF7F2] border border-[#E8E2D8] text-[#57534E]"
                    >
                      {shoe}
                    </span>
                  ))}
                </div>
              </div>

              {/* Màu sắc đề xuất */}
              <div>
                <span className="font-serif font-bold text-[#1C1917] block mb-2">
                  Màu sắc được đề xuất:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {costume.stylingGuide.recommendedColors.map((color, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-sm bg-[#9B2C2C]/8 text-[#9B2C2C] border border-[#9B2C2C]/20 font-medium"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chất liệu và hoa văn */}
              <div>
                <span className="font-serif font-bold text-[#1C1917] block mb-2">
                  Chất liệu & Hoa văn:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {costume.stylingGuide.materialsAndMotifs.map((mat, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-sm bg-[#FAF7F2] border border-[#E8E2D8] text-[#57534E]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Phối truyền thống */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8]">
                <div className="font-serif font-semibold text-[#9B2C2C] mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#9B2C2C]" />
                  Cách phối truyền thống:
                </div>
                <p className="text-[#57534E] text-[11px] leading-relaxed font-light">
                  {costume.stylingGuide.traditionalStyling}
                </p>
              </div>

              {/* Gợi ý cách tân */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8]">
                <div className="font-serif font-semibold text-[#246A5E] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#246A5E]" />
                  Gợi ý Remix hiện đại:
                </div>
                <p className="text-[#57534E] text-[11px] leading-relaxed font-light">
                  {costume.stylingGuide.modernRemixAdvice}
                </p>
              </div>

              {/* Những kết hợp nên tránh */}
              <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5]/40">
                <div className="font-serif font-semibold text-[#991B1B] mb-1.5 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-[#991B1B]" />
                  Những kết hợp nên tránh:
                </div>
                <ul className="list-disc list-inside space-y-1 text-[#7F1D1D] text-[11px] leading-relaxed font-light">
                  {costume.stylingGuide.avoidCombinations.map((avoid, i) => (
                    <li key={i}>{avoid}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Sticky CTA Bottom on Mobile */}
          <div className="pt-2">
            <button
              onClick={() => onTryRemix(costume)}
              className="w-full py-4 rounded-sm bg-[#9B2C2C] hover:bg-[#832424] text-[#FAF7F2] font-semibold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ChimLacIcon className="w-4 h-4 text-[#FAF7F2]" />
              <span>Phối thử bộ trang phục này</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
