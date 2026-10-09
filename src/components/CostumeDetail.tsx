import React from 'react';
import { Costume, EventItem } from '../types';
import { TrienXacThuc, HoaSenDivider, ChimLacIcon, TrongDongWatermark, TrienSonSeal } from './VietnameseMotifs';
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
  Compass,
  ArrowRight,
  ShieldCheck,
  Star
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
  const matchSuitability = selectedEvent
    ? costume.suitability.find((s) => s.eventId === selectedEvent.id)
    : costume.suitability[0];

  return (
    <article className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Nút Điều Hướng Trở Về & Chỉ Báo Bối Cảnh */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FFF0F4] border border-[#F4C2CE] text-xs font-serif font-bold text-[#C84B69] hover:text-[#9E2A47] transition-all cursor-pointer shadow-2xs group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Trở về bộ sưu tập cổ phục</span>
        </button>

        {selectedEvent && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F4] border border-[#F4C2CE] text-xs">
            <span className="text-[11px] text-[#78716C]">Đang đối chiếu sự kiện:</span>
            <span className="font-serif font-bold text-[#C84B69]">{selectedEvent.name}</span>
          </div>
        )}
      </div>

      {/* 2. Hero Editorial Banner: Nền Cánh Sen Hồng Trang Nhã */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFF5F7] via-[#FFFFFF] to-[#FCE7EC] border border-[#F4C2CE] shadow-sm">
        {/* Subtle decorative watermark */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 opacity-10 pointer-events-none select-none">
          <TrongDongWatermark className="w-96 h-96 text-[#C84B69]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12 relative z-10">
          {/* Cột Trái: Trưng Bày Y Phục Chuẩn Mực */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-b from-white via-[#FFF5F7] to-[#FAF7F2] p-4 flex items-center justify-center border border-[#F4C2CE] shadow-md group">
              <img
                src={costume.coverImage}
                alt={costume.name}
                className="max-h-full max-w-full object-contain object-center drop-shadow-lg group-hover:scale-104 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <TrienXacThuc className="bg-white/95" />
              </div>
              {matchSuitability && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#C84B69] text-white shadow-xs">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{matchSuitability.score}% Phù hợp</span>
                </div>
              )}
            </div>
          </div>

          {/* Cột Phải: Thông Điệp Di Sản & Nút Bấm Vào Studio */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-[#FFF0F4] text-[#C84B69] font-serif font-bold border border-[#F4C2CE]">
                {costume.era}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-white text-[#57534E] font-serif border border-[#F4C2CE]">
                {costume.region}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-white text-[#57534E] font-serif border border-[#F4C2CE]">
                {costume.gender === 'female' ? 'Dành cho Nữ' : costume.gender === 'male' ? 'Dành cho Nam' : 'Nam & Nữ'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight leading-tight">
              {costume.name}
            </h1>

            {costume.lineageLabel && (
              <span className="text-xs font-serif font-semibold uppercase tracking-wider text-[#C84B69] block">
                Phả hệ: {costume.lineageLabel}
              </span>
            )}

            <p className="text-[#57534E] text-sm sm:text-base leading-relaxed font-light text-justify">
              {costume.shortDescription}
            </p>

            {/* Nút Hành Động Trọng Tâm: Chuyển Sang Studio Phối Đồ */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onTryRemix(costume)}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#C84B69] to-[#9E2A47] hover:from-[#B33B58] hover:to-[#881337] text-white font-serif font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <ChimLacIcon className="w-4 h-3.5 text-white" />
                <span>Phối thử bộ này trên Studio 2D</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onBack}
                className="px-5 py-3.5 rounded-xl bg-white hover:bg-[#FFF0F4] border border-[#F4C2CE] text-xs font-serif font-bold text-[#C84B69] transition-all cursor-pointer shadow-2xs"
              >
                <span>Xem các mẫu khác</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Thẩm Định Lịch Sử & Tính Xác Thực */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 text-xs ${
          costume.isVerifiedHistoricalData
            ? 'bg-[#FFF9FA] border-[#F4C2CE] text-[#57534E]'
            : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-[#FFF0F4] border border-[#F4C2CE] flex items-center justify-center shrink-0 mt-0.5 text-[#C84B69]">
          {costume.isVerifiedHistoricalData ? (
            <Quote className="w-4 h-4 text-[#C84B69]" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
          )}
        </div>
        <div className="space-y-1">
          <div className="font-serif font-bold text-sm text-[#1C1917] flex items-center gap-2">
            <span>
              {costume.isVerifiedHistoricalData
                ? 'Tư liệu lịch sử đối chiếu chính sử & Khảo cổ học'
                : 'Nội dung mẫu đang trong quá trình thẩm định'}
            </span>
            {costume.isVerifiedHistoricalData && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C84B69]/10 text-[#C84B69] font-medium">
                Đã chuẩn hóa
              </span>
            )}
          </div>
          <p className="leading-relaxed font-light text-[#57534E]">
            {costume.verificationNote}
          </p>
        </div>
      </div>

      {/* 4. Bố Cục 2 Cột Hài Hòa, Đơn Giản & Tinh Tế */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI (7 CỘT): CĂN CỐT DI SẢN, NGUỒN GỐC & CẤU TẠO LỚP ÁO */}
        <div className="lg:col-span-7 space-y-6">
          {/* Lịch Sử, Nguồn Gốc & Bối Cảnh Sử Dụng */}
          <section className="bg-white border border-[#F4C2CE] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#C84B69]" />
              <span>Nguồn gốc & Bối cảnh sử dụng</span>
            </h2>

            <div className="relative pl-5 border-l-2 border-[#C84B69]/40 space-y-2">
              <div className="text-xs font-serif font-bold text-[#C84B69] uppercase tracking-wider">
                Quy chế định hình qua các triều đại
              </div>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-light text-justify">
                {costume.historicalContext}
              </p>
            </div>
          </section>

          {/* Ý Nghĩa Văn Hóa & Triết Lý Phục Sức */}
          <section className="bg-white border border-[#F4C2CE] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-[#C84B69]" />
              <span>Ý nghĩa văn hóa & Triết lý phục sức</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-light text-justify">
              {costume.culturalSignificance}
            </p>
          </section>

          {/* Chi Tiết Truyền Thống: Cấu Tạo {costume.components.length} Thành Phần Layer */}
          <section className="bg-white border border-[#F4C2CE] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-[#C84B69]" />
                <span>Cấu tạo bộ trang phục ({costume.components.length} lớp)</span>
              </h2>
              <span className="text-xs text-[#78716C] font-serif">Theo thứ tự layer</span>
            </div>

            <p className="text-xs text-[#57534E] font-light">
              Y phục được thiết kế nguyên bộ, tuân thủ thứ tự mặc từ trong ra ngoài theo điển chế:
            </p>

            <div className="space-y-2.5 pt-1">
              {costume.components.map((comp) => (
                <div
                  key={comp.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#F4C2CE] text-xs hover:border-[#C84B69]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-white border border-[#F4C2CE] text-[#C84B69] flex items-center justify-center font-serif font-bold text-xs shrink-0 shadow-2xs">
                      {comp.layerOrder}
                    </span>
                    <div>
                      <div className="font-semibold text-[#1C1917] flex items-center gap-2">
                        <span>{comp.name}</span>
                        {comp.isRequired ? (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#FFF0F4] text-[#C84B69] border border-[#F4C2CE] font-bold">
                            Bắt buộc
                          </span>
                        ) : (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-white text-[#78716C] border border-stone-200">
                            Tùy chọn
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#78716C] mt-0.5 font-light">
                        {comp.description}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#78716C] font-serif uppercase tracking-wider shrink-0 hidden sm:inline-block">
                    Lớp {comp.layerOrder}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Lưu Ý Lễ Nghi Khi Sử Dụng */}
          <section className="bg-white border border-[#F4C2CE] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917] flex items-center gap-2.5">
              <Info className="w-5 h-5 text-[#C84B69]" />
              <span>Lưu ý lễ nghi khi sử dụng</span>
            </h2>

            <ul className="space-y-2.5 text-xs text-[#57534E]">
              {costume.usageConsiderations.map((note, index) => (
                <li key={index} className="flex items-start gap-2.5 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C84B69] mt-2 shrink-0" />
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* CỘT PHẢI (5 CỘT): CẨM NANG PHỐI ĐỒ & STUDIO CTA */}
        <div className="lg:col-span-5 space-y-6">
          {/* Cẩm Nang Phối Đồ Chuẩn Mực */}
          <section className="bg-white border border-[#F4C2CE] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 text-lg sm:text-xl font-serif font-bold text-[#1C1917] pb-3 border-b border-[#F7D6DE]">
              <Shirt className="w-5 h-5 text-[#C84B69]" />
              <span>Cẩm nang phối đồ chuẩn mực</span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Phụ kiện */}
              <div>
                <span className="font-serif font-bold text-[#1C1917] block mb-1.5">
                  Phụ kiện phù hợp:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {costume.stylingGuide.accessories.map((acc, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-[#FFF9FA] border border-[#F4C2CE] text-[#57534E]"
                    >
                      {acc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Kiểu tóc & Khăn */}
              <div>
                <span className="font-serif font-bold text-[#1C1917] block mb-1.5">
                  Kiểu tóc & Khăn đội đầu:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {costume.stylingGuide.hairstyles.map((hair, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-[#FFF9FA] border border-[#F4C2CE] text-[#57534E]"
                    >
                      {hair}
                    </span>
                  ))}
                </div>
              </div>

              {/* Giày dép */}
              <div>
                <span className="font-serif font-bold text-[#1C1917] block mb-1.5">
                  Giày dép:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {costume.stylingGuide.footwear.map((shoe, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-[#FFF9FA] border border-[#F4C2CE] text-[#57534E]"
                    >
                      {shoe}
                    </span>
                  ))}
                </div>
              </div>

              {/* Màu sắc đề xuất */}
              <div>
                <span className="font-serif font-bold text-[#1C1917] block mb-1.5">
                  Màu sắc được đề xuất:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {costume.stylingGuide.recommendedColors.map((color, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-[#FFF0F4] text-[#C84B69] border border-[#F4C2CE] font-medium"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chất liệu & Hoa văn */}
              <div>
                <span className="font-serif font-bold text-[#1C1917] block mb-1.5">
                  Chất liệu & Hoa văn:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {costume.stylingGuide.materialsAndMotifs.map((mat, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-[#FFF9FA] border border-[#F4C2CE] text-[#57534E]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Phối truyền thống */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#F4C2CE] space-y-1">
                <div className="font-serif font-semibold text-[#C84B69] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C84B69]" />
                  <span>Cách phối truyền thống:</span>
                </div>
                <p className="text-[#57534E] text-[11px] leading-relaxed font-light">
                  {costume.stylingGuide.traditionalStyling}
                </p>
              </div>

              {/* Gợi ý remix hiện đại */}
              <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-1">
                <div className="font-serif font-semibold text-[#15803D] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#15803D]" />
                  <span>Gợi ý Remix hiện đại:</span>
                </div>
                <p className="text-[#166534] text-[11px] leading-relaxed font-light">
                  {costume.stylingGuide.modernRemixAdvice}
                </p>
              </div>

              {/* Những kết hợp nên tránh */}
              <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] space-y-1">
                <div className="font-serif font-semibold text-[#B91C1C] flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-[#B91C1C]" />
                  <span>Những kết hợp nên tránh:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[#991B1B] text-[11px] leading-relaxed font-light">
                  {costume.stylingGuide.avoidCombinations.map((avoid, i) => (
                    <li key={i}>{avoid}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Khối Kêu Gọi Hành Động (CTA) Vào Studio Phối Đồ */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#9E2A47] via-[#C84B69] to-[#881337] text-white shadow-lg space-y-3.5 border border-[#F4C2CE]/40">
            <div className="flex items-center gap-2">
              <TrienSonSeal text="Remix" size="sm" />
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-rose-200">
                Sáng Tạo Trực Quan 2D
              </span>
            </div>

            <h3 className="font-serif font-bold text-lg text-white leading-snug">
              Bắt Đầu Phối Thử Mẫu {costume.name}
            </h3>

            <p className="text-xs text-rose-100 font-light leading-relaxed">
              Tùy biến màu áo (Đỏ, Hoàng Yến, Trắng Ngà, Hồng Phấn...), thay đổi trang sức kiềng bạc, trâm hoa sen và xuất ảnh Lookbook cá nhân.
            </p>

            <button
              type="button"
              onClick={() => onTryRemix(costume)}
              className="w-full py-3.5 rounded-xl bg-white hover:bg-[#FFF0F4] text-[#9E2A47] font-serif font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ChimLacIcon className="w-4 h-3.5 text-[#9E2A47]" />
              <span>Mở Studio phối bộ này ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
