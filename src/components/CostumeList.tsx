import React, { useState } from 'react';
import { Costume, EventItem } from '../types';
import { TrienXacThuc, ChimLacIcon } from './VietnameseMotifs';
import {
  Calendar,
  MapPin,
  Filter,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';

interface CostumeListProps {
  costumes: Costume[];
  selectedEvent?: EventItem;
  onSelectCostume: (costume: Costume) => void;
  onChangeEvent: () => void;
}

export const CostumeList: React.FC<CostumeListProps> = ({
  costumes,
  selectedEvent,
  onSelectCostume,
  onChangeEvent
}) => {
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [eraFilter, setEraFilter] = useState<string>('all');

  const filteredCostumes = costumes.filter((c) => {
    if (genderFilter !== 'all' && c.gender !== genderFilter && c.gender !== 'unisex') return false;
    if (eraFilter !== 'all' && !c.era.toLowerCase().includes(eraFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Editorial Header / Selected Event Context */}
      <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-serif tracking-wider uppercase text-[#9B2C2C] font-semibold">
            <ChimLacIcon className="w-4 h-3 text-[#9B2C2C]" />
            Bộ sưu tập gợi ý cho dịp
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] flex items-center gap-3">
            {selectedEvent?.name || 'Tất cả sự kiện'}
            <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-[#9B2C2C]/10 text-[#9B2C2C] border border-[#9B2C2C]/20">
              {selectedEvent?.badge || 'Đề xuất'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] max-w-2xl font-light">
            {selectedEvent?.description || 'Những bộ Việt phục hoàn chỉnh đã được định hình quy chuẩn theo tư liệu lịch sử.'}
          </p>
        </div>

        {selectedEvent && (
          <button
            onClick={onChangeEvent}
            className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#FAF7F2] hover:bg-[#F4EFEA] border border-[#E8E2D8] text-xs font-medium text-[#1C1917] transition-colors"
          >
            <span>Đổi sự kiện khác</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9B2C2C]" />
          </button>
        )}
      </div>

      {/* Understated Secondary Filter Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] text-xs text-[#57534E]">
        <div className="flex items-center gap-2 font-medium text-[#1C1917]">
          <Filter className="w-3.5 h-3.5 text-[#9B2C2C]" />
          <span>Lọc nhanh:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Gender Filter */}
          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-md border border-[#E8E2D8]">
            <button
              onClick={() => setGenderFilter('all')}
              className={`px-3 py-1 rounded-xs transition-colors ${
                genderFilter === 'all'
                  ? 'bg-[#9B2C2C] text-[#FAF7F2] font-semibold'
                  : 'hover:text-[#1C1917]'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setGenderFilter('female')}
              className={`px-3 py-1 rounded-xs transition-colors ${
                genderFilter === 'female'
                  ? 'bg-[#9B2C2C] text-[#FAF7F2] font-semibold'
                  : 'hover:text-[#1C1917]'
              }`}
            >
              Y phục Nữ
            </button>
            <button
              onClick={() => setGenderFilter('male')}
              className={`px-3 py-1 rounded-xs transition-colors ${
                genderFilter === 'male'
                  ? 'bg-[#9B2C2C] text-[#FAF7F2] font-semibold'
                  : 'hover:text-[#1C1917]'
              }`}
            >
              Y phục Nam
            </button>
          </div>

          {/* Era Filter */}
          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-md border border-[#E8E2D8]">
            <button
              onClick={() => setEraFilter('all')}
              className={`px-3 py-1 rounded-xs transition-colors ${
                eraFilter === 'all'
                  ? 'bg-[#9B2C2C] text-[#FAF7F2] font-semibold'
                  : 'hover:text-[#1C1917]'
              }`}
            >
              Mọi thời kỳ
            </button>
            <button
              onClick={() => setEraFilter('nguyễn')}
              className={`px-3 py-1 rounded-xs transition-colors ${
                eraFilter === 'nguyễn'
                  ? 'bg-[#9B2C2C] text-[#FAF7F2] font-semibold'
                  : 'hover:text-[#1C1917]'
              }`}
            >
              Triều Nguyễn
            </button>
            <button
              onClick={() => setEraFilter('lê')}
              className={`px-3 py-1 rounded-xs transition-colors ${
                eraFilter === 'lê'
                  ? 'bg-[#9B2C2C] text-[#FAF7F2] font-semibold'
                  : 'hover:text-[#1C1917]'
              }`}
            >
              Thời Lê
            </button>
          </div>
        </div>

        <div className="text-[#78716C] font-serif">
          Gợi ý <span className="font-bold text-[#1C1917]">{filteredCostumes.length}</span> bộ trang phục
        </div>
      </div>

      {/* Curated Costumes Grid */}
      {filteredCostumes.length === 0 ? (
        <div className="text-center py-20 bg-[#FFFFFF] rounded-2xl border border-[#E8E2D8] p-8">
          <p className="text-[#57534E] text-sm mb-4">
            Không tìm thấy bộ Việt phục nào phù hợp với bộ lọc đã chọn.
          </p>
          <button
            onClick={() => {
              setGenderFilter('all');
              setEraFilter('all');
            }}
            className="px-4 py-2 bg-[#9B2C2C] text-[#FAF7F2] rounded-md text-xs font-semibold"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCostumes.map((costume) => {
            const suitInfo = selectedEvent
              ? costume.suitability.find((s) => s.eventId === selectedEvent.id)
              : costume.suitability[0];

            return (
              <article
                key={costume.id}
                onClick={() => onSelectCostume(costume)}
                className="group relative rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] overflow-hidden flex flex-col justify-between hover:border-[#9B2C2C]/60 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {/* Visual Thumbnail */}
                <div className="relative h-72 overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={costume.coverImage}
                    alt={costume.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-[#1C1917]/20 to-transparent" />

                  {/* Top Seal & Match Badge */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    {costume.isVerifiedHistoricalData ? (
                      <TrienXacThuc className="shadow-xs bg-[#FFFFFF]/90 backdrop-blur-xs" />
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-sm bg-[#FFFFFF]/90 text-[#78716C] border border-[#E8E2D8]">
                        Dữ liệu mẫu
                      </span>
                    )}

                    {suitInfo && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-sm bg-[#FAF7F2]/95 backdrop-blur-xs text-[#9B2C2C] text-xs font-serif font-bold shadow-xs border border-[#C29B38]/30">
                        <Sparkles className="w-3 h-3 text-[#C29B38]" />
                        {suitInfo.label} ({suitInfo.score}%)
                      </span>
                    )}
                  </div>

                  {/* Cover Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-serif font-bold group-hover:text-[#F3E8D8] transition-colors drop-shadow-sm">
                      {costume.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-stone-200 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C29B38]" />
                        {costume.era}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C29B38]" />
                        {costume.region}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2 mb-4 font-light">
                    {costume.shortDescription}
                  </p>

                  {/* Why it matches this occasion */}
                  {suitInfo && (
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-xs mb-5">
                      <div className="font-serif font-semibold text-[#9B2C2C] mb-1">
                        Vì sao hòa hợp với dịp này:
                      </div>
                      <p className="text-[11px] text-[#57534E] leading-relaxed">
                        {suitInfo.reason}
                      </p>
                    </div>
                  )}

                  {/* Components count & CTA */}
                  <div className="pt-4 border-t border-[#F0EBE3] flex items-center justify-between text-xs">
                    <span className="text-[#78716C] flex items-center gap-1 font-serif">
                      <Layers className="w-3.5 h-3.5 text-[#C29B38]" />
                      <span>{costume.components.length} thành phần</span>
                    </span>

                    <span className="flex items-center gap-1 font-semibold text-[#9B2C2C] group-hover:translate-x-1 transition-transform">
                      <span>Xem chi tiết & Phối đồ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
