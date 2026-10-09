import React from 'react';
import { EventItem } from '../types';
import {
  ChimLacIcon,
  TrongDongWatermark,
  HoaSenDivider
} from './VietnameseMotifs';
import {
  Sparkles,
  Calendar,
  HeartHandshake,
  GraduationCap,
  Drama,
  Award,
  Compass,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface EventSelectorProps {
  events: EventItem[];
  selectedEventId?: string;
  onSelectEvent: (event: EventItem) => void;
  onOpenAoDaiRecommender?: () => void;
}

// Distinctive cultural graphic details for each event category
const EVENT_GRAPHIC_DETAILS: Record<
  string,
  { icon: React.ReactNode; motifTag: string; accentColor: string }
> = {
  'evt-tet': {
    icon: <Sparkles className="w-5 h-5 text-[#C84B69]" />,
    motifTag: 'Hoa Đào • Phố Xuân',
    accentColor: '#C84B69'
  },
  'evt-festival': {
    icon: <Calendar className="w-5 h-5 text-[#C29B38]" />,
    motifTag: 'Trống Hội • Đền Thánh',
    accentColor: '#C29B38'
  },
  'evt-wedding': {
    icon: <HeartHandshake className="w-5 h-5 text-[#C84B69]" />,
    motifTag: 'Hỷ Sự • Trầu Cau',
    accentColor: '#C84B69'
  },
  'evt-yearbook': {
    icon: <GraduationCap className="w-5 h-5 text-[#1E3A4A]" />,
    motifTag: 'Khuê Văn Các • Kỷ Niệm',
    accentColor: '#1E3A4A'
  },
  'evt-art': {
    icon: <Drama className="w-5 h-5 text-[#6D28D9]" />,
    motifTag: 'Nhã Nhạc • Sân Khấu',
    accentColor: '#6D28D9'
  },
  'evt-formal': {
    icon: <Award className="w-5 h-5 text-[#C29B38]" />,
    motifTag: 'Nghi Lễ • Quốc Khách',
    accentColor: '#C29B38'
  },
  'evt-street': {
    icon: <Compass className="w-5 h-5 text-[#246A5E]" />,
    motifTag: 'Đương Đại • Dạo Phố',
    accentColor: '#246A5E'
  }
};

export const EventSelector: React.FC<EventSelectorProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
  onOpenAoDaiRecommender
}) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-20">
      {/* Background Subtle Watermark (Trống Đồng Đông Sơn) */}
      <div className="absolute -top-16 -right-16 text-[#C29B38]/6 pointer-events-none select-none">
        <TrongDongWatermark className="w-[520px] h-[520px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Hero Intro */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C84B69]/8 border border-[#C84B69]/20 text-[#C84B69] text-xs font-serif font-semibold tracking-wider uppercase mb-5">
            <ChimLacIcon className="w-3.5 h-3 text-[#C84B69]" />
            Khởi đầu từ hoàn cảnh sử dụng
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1917] tracking-tight leading-tight mb-5">
            Mặc đúng lễ nghi, <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#C84B69]">hòa hợp cùng thời khắc</span>
          </h1>

          <p className="text-base sm:text-lg text-[#57534E] font-light leading-relaxed max-w-2xl mx-auto">
            Mỗi nếp áo Việt đều mang theo chuẩn mực của lễ tiết và đạo làm người. Hãy chọn sự kiện
            bạn dự định tham gia, để hệ thống đối chiếu và gợi ý những bộ trang phục nguyên bản phù hợp nhất.
          </p>
        </div>

        {/* Banner Quick Link to Áo Dài Recommender */}
        {onOpenAoDaiRecommender && (
          <div
            onClick={onOpenAoDaiRecommender}
            className="max-w-4xl mx-auto mb-12 bg-gradient-to-r from-[#C84B69] via-[#851E1E] to-[#6E1616] text-white rounded-xl p-4.5 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer shadow-md hover:shadow-lg transition-all group border border-[#D4AF37]/30"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base sm:text-lg">
                    Cỗ Máy Gợi Ý Áo Dài Thông Minh
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-400 text-stone-900 rounded-xs font-bold uppercase tracking-wider">
                    Mới Ra Mắt
                  </span>
                </div>
                <p className="text-xs text-white/85 font-light mt-0.5">
                  Chỉ 3 chạm (Dịp • Thời tiết • Gu phong cách) để nhận ngay set đồ chuẩn mực văn hóa & thời trang!
                </p>
              </div>
            </div>
            <button className="px-4.5 py-2 rounded-md bg-white text-[#C84B69] font-semibold text-xs shrink-0 group-hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-sm">
              <span>Trải nghiệm ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => {
            const isSelected = selectedEventId === evt.id;
            const graphic = EVENT_GRAPHIC_DETAILS[evt.id] || {
              icon: <Sparkles className="w-5 h-5 text-[#C84B69]" />,
              motifTag: 'Văn hóa cổ truyền',
              accentColor: '#C84B69'
            };

            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className={`group relative rounded-xl p-6 sm:p-7 cursor-pointer transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-[#C84B69] shadow-lg shadow-[#C84B69]/8 ring-1 ring-[#C84B69]'
                    : 'bg-[#FFFFFF] border-[#F4C2CE] hover:border-[#C29B38]/80 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <div>
                  {/* Top Bar with Icon & Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-[#FFF5F7] border border-[#F4C2CE] flex items-center justify-center group-hover:border-[#C84B69]/40 transition-colors">
                        {graphic.icon}
                      </div>
                      <span className="text-[11px] font-medium tracking-wider text-[#78716C] uppercase font-serif">
                        {graphic.motifTag}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-xs bg-[#FFF5F7] text-[#57534E] border border-[#F4C2CE]">
                        {evt.badge}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#C84B69]" />
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-serif font-bold text-[#1C1917] group-hover:text-[#C84B69] transition-colors mb-2.5">
                    {evt.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-6 font-light">
                    {evt.description}
                  </p>
                </div>

                {/* Bottom Recommendation */}
                <div className="pt-4 border-t border-[#F0EBE3] flex flex-col gap-2.5">
                  <div className="text-xs text-[#78716C]">
                    <span className="font-semibold text-[#1C1917]">Gợi ý quy cách: </span>
                    {evt.recommendedDressCode}
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-[#C84B69] pt-2">
                    <span className="group-hover:underline">Khám phá các bộ phù hợp</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* How It Works Editorial Banner */}
        <div className="mt-20 p-8 rounded-2xl bg-[#FFFFFF] border border-[#F4C2CE] shadow-xs">
          <HoaSenDivider label="Quy trình trải nghiệm" className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex flex-col gap-2">
              <span className="font-serif italic text-2xl text-[#C84B69] font-bold">01.</span>
              <h4 className="font-serif font-bold text-base text-[#1C1917]">
                Chọn sự kiện phù hợp
              </h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Hệ thống định tuyến trang phục dựa trên bối cảnh sử dụng trang trọng, đời thường hay lễ hội dân gian.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-serif italic text-2xl text-[#C29B38] font-bold">02.</span>
              <h4 className="font-serif font-bold text-base text-[#1C1917]">
                Khám phá lớp áo & Lịch sử
              </h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Đọc tư liệu đối chiếu chính sử, quy cách phối phụ kiện truyền thống và những lưu ý tránh phạm đại kỵ.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-serif italic text-2xl text-[#1E3A4A] font-bold">03.</span>
              <h4 className="font-serif font-bold text-base text-[#1C1917]">
                Phối thử & Hoàn thiện AI
              </h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Xem phác thảo lớp canvas tức thời, lưu cấu trúc trang phục và yêu cầu AI hoàn thiện thành tác phẩm nghệ thuật.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
