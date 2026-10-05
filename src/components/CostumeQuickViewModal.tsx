import React from 'react';
import { Costume, EventItem } from '../types';
import {
  X,
  Star,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck,
  Tag,
  Layers,
  Sparkles
} from 'lucide-react';

interface CostumeQuickViewModalProps {
  costume: Costume | null;
  selectedEvent?: EventItem;
  onClose: () => void;
  onViewDeepDetails: (costume: Costume) => void;
}

export const CostumeQuickViewModal: React.FC<CostumeQuickViewModalProps> = ({
  costume,
  selectedEvent,
  onClose,
  onViewDeepDetails
}) => {
  if (!costume) return null;

  const matchSuitability = selectedEvent
    ? costume.suitability.find((s) => s.eventId === selectedEvent.id)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm transition-all duration-300">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#F4C2CE] flex flex-col md:flex-row max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Clean Full-View Image Showcase (Không bị zoom hay cắt xén phụ kiện) */}
        <div className="md:w-1/2 relative bg-gradient-to-b from-[#FAF7F2] via-[#F4ECE1] to-[#FAF7F2] flex flex-col justify-between p-4 sm:p-6 border-b md:border-b-0 md:border-r border-[#F4C2CE] overflow-hidden min-h-[340px] md:min-h-[500px]">
          {/* Top Tag Bar */}
          <div className="w-full flex items-center justify-between gap-2 z-10">
            <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-white text-[#9E2A47] border border-[#F4C2CE] shadow-xs">
              {costume.era}
            </span>
            <span className="text-[11px] text-stone-600 font-medium bg-white/80 px-2.5 py-0.5 rounded-full border border-stone-200">
              {costume.region}
            </span>
          </div>

          {/* Image Container with object-contain: 100% Full View of Costume and Accessories */}
          <div className="relative w-full flex-1 flex items-center justify-center py-3 my-auto">
            <img
              src={costume.coverImage || '/assets/costumes/ao-tac-bat-bao.jpeg'}
              alt={costume.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/costumes/ao-tac-bat-bao.jpeg';
              }}
              className="max-h-[360px] md:max-h-[460px] w-auto max-w-full object-contain object-center drop-shadow-md"
            />
          </div>

          {/* Bottom Footnote: Toàn cảnh phục dựng */}
          <div className="w-full pt-2 border-t border-[#E8DFC8] flex items-center justify-between text-[11px] text-[#78716C]">
            <span className="font-serif italic">Toàn bộ chi tiết & phụ kiện</span>
            <span className="text-[10px] text-[#C84B69] font-medium bg-white px-2 py-0.5 rounded-full border border-[#F4C2CE]">
              Ảnh nguyên bản
            </span>
          </div>
        </div>

        {/* Right Side: Structured Information & Actions */}
        <div className="md:w-1/2 p-5 sm:p-7 overflow-y-auto space-y-4 flex flex-col justify-between bg-[#FFFDFB]">
          <div className="space-y-3.5">
            {/* Tiêu đề trang phục & Phả hệ */}
            <div className="space-y-1 pb-1 border-b border-[#F8E5EB]">
              {costume.lineageLabel && (
                <div className="flex items-center gap-1.5 text-xs text-[#C84B69] font-semibold uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{costume.lineageLabel}</span>
                </div>
              )}
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] tracking-tight">
                {costume.name}
              </h3>
            </div>

            {/* Phả Hệ Breadcrumb */}
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-sky-900 font-medium truncate">
                <span className="text-[11px] text-sky-600">Phả hệ:</span>
                <span className="font-semibold truncate">
                  {costume.lineageLabel || 'Áo cổ truyền Việt Nam'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-200/70 text-sky-800 font-bold shrink-0">
                Chuẩn di sản
              </span>
            </div>

            {/* Mô tả cốt lõi */}
            <div className="space-y-1.5">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#C84B69]">
                Đặc Điểm & Bối Cảnh Lịch Sử
              </h4>
              <p className="text-xs sm:text-sm text-[#44403C] font-light leading-relaxed">
                {costume.shortDescription}
              </p>
            </div>

            {/* Ý nghĩa văn hóa & cấu trúc */}
            {costume.culturalSignificance && (
              <div className="p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#F8D2DC] text-xs text-[#701A2D] space-y-1">
                <span className="font-serif font-bold text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C84B69]" />
                  Ý Nghĩa Biểu Trưng & Triết Lý May Mặc:
                </span>
                <p className="text-xs font-light leading-relaxed">
                  {costume.culturalSignificance}
                </p>
              </div>
            )}

            {/* Đánh giá độ phù hợp với sự kiện đang chọn (nếu có) */}
            {matchSuitability && (
              <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#166534] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Độ Tương Thích Với: {selectedEvent?.name}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xs">
                    {matchSuitability.label} ({matchSuitability.score}%)
                  </span>
                </div>
                <p className="text-[11px] text-[#14532D] font-light leading-relaxed">
                  {matchSuitability.reason}
                </p>
              </div>
            )}

            {/* Bảng Màu Sắc Tiêu Biểu */}
            {costume.colorVariants && costume.colorVariants.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#F5E6EA]">
                <span className="text-[11px] font-semibold text-[#57534E]">
                  Màu sắc truyền thống tiêu biểu:
                </span>
                <div className="flex flex-wrap gap-2">
                  {costume.colorVariants.map((col) => (
                    <div
                      key={col.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-xs shadow-xs"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-stone-300"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-[11px] font-medium text-[#1C1917]">{col.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#F5E6EA] flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onViewDeepDetails(costume);
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide bg-[#C84B69] hover:bg-[#A3324C] text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Xem Nghiên Cứu Chi Tiết & Phối Đồ</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl text-xs font-semibold text-[#57534E] hover:text-[#1C1917] bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
