import React, { useState, useMemo } from 'react';
import { Costume, EventItem } from '../types';
import { TrienXacThuc, ChimLacIcon, TrienSonSeal } from './VietnameseMotifs';
import { DongSonDrumGenealogy, GenealogyNodeId } from './DongSonDrumGenealogy';
import {
  Calendar,
  MapPin,
  Filter,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Layers,
  Star,
  User,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CostumeListProps {
  costumes: Costume[];
  selectedEvent?: EventItem;
  onSelectCostume: (costume: Costume) => void;
  onTryRemix?: (costume: Costume) => void;
  onChangeEvent: () => void;
}

export const CostumeList: React.FC<CostumeListProps> = ({
  costumes,
  selectedEvent,
  onSelectCostume,
  onTryRemix,
  onChangeEvent
}) => {
  // 1. Phân nhánh phả hệ Trống Đồng Đông Sơn
  const [activeGenealogyNode, setActiveGenealogyNode] = useState<GenealogyNodeId>('all');
  const [isDrumCollapsedMobile, setIsDrumCollapsedMobile] = useState<boolean>(true);

  // 2. Bộ lọc Giới tính & Thời kỳ
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [eraFilter, setEraFilter] = useState<string>('all');

  // 3. Trạng thái click mở rộng chi tiết nhanh trên thẻ
  const [expandedCostumeId, setExpandedCostumeId] = useState<string | null>(null);

  // Tính số lượng trang phục cho từng nhánh trống đồng
  const costumeCounts = useMemo(() => {
    return {
      all: costumes.length,
      'giao-linh': costumes.filter(c => c.lineageCategory === 'giao-linh' || c.id === 'cos-giao-linh').length,
      'vien-linh': costumes.filter(c => c.lineageCategory === 'vien-linh' || c.id === 'cos-vien-linh').length,
      'lap-linh': costumes.filter(c => c.lineageCategory === 'lap-linh' || c.id === 'cos-ao-tac' || c.id === 'cos-ngu-than-tay-chen' || c.id === 'cos-ao-dai').length,
      'ao-tac': costumes.filter(c => c.lineageSubcategory === 'ao-tac' || c.id === 'cos-ao-tac').length,
      'tay-chen': costumes.filter(c => c.lineageSubcategory === 'tay-chen' || c.id === 'cos-ngu-than-tay-chen' || c.id === 'cos-ao-dai').length,
      'dich-chuyen': costumes.filter(c => c.lineageCategory === 'dich-chuyen' || c.id === 'cos-nhat-binh' || c.id === 'cos-doi-kham' || c.id === 'cos-tu-than' || c.id === 'cos-ba-ba').length,
      'nhat-binh': costumes.filter(c => c.lineageSubcategory === 'nhat-binh' || c.id === 'cos-nhat-binh' || c.id === 'cos-doi-kham').length,
      'tu-than': costumes.filter(c => c.lineageSubcategory === 'tu-than' || c.id === 'cos-tu-than').length,
      'ba-ba': costumes.filter(c => c.lineageSubcategory === 'ba-ba' || c.id === 'cos-ba-ba').length,
    };
  }, [costumes]);

  // Lọc trang phục kết hợp Trống Đồng + Giới tính + Thời kỳ
  const filteredCostumes = useMemo(() => {
    return costumes.filter((c) => {
      // 1. Lọc theo phả hệ Trống Đồng
      if (activeGenealogyNode !== 'all') {
        let matchTree = false;
        if (activeGenealogyNode === 'giao-linh') {
          matchTree = c.lineageCategory === 'giao-linh' || c.id === 'cos-giao-linh';
        } else if (activeGenealogyNode === 'vien-linh') {
          matchTree = c.lineageCategory === 'vien-linh' || c.id === 'cos-vien-linh';
        } else if (activeGenealogyNode === 'lap-linh') {
          matchTree = c.lineageCategory === 'lap-linh' || c.id === 'cos-ao-tac' || c.id === 'cos-ngu-than-tay-chen' || c.id === 'cos-ao-dai';
        } else if (activeGenealogyNode === 'ao-tac') {
          matchTree = c.lineageSubcategory === 'ao-tac' || c.id === 'cos-ao-tac';
        } else if (activeGenealogyNode === 'tay-chen') {
          matchTree = c.lineageSubcategory === 'tay-chen' || c.id === 'cos-ngu-than-tay-chen' || c.id === 'cos-ao-dai';
        } else if (activeGenealogyNode === 'dich-chuyen') {
          matchTree = c.lineageCategory === 'dich-chuyen' || c.id === 'cos-nhat-binh' || c.id === 'cos-doi-kham' || c.id === 'cos-tu-than' || c.id === 'cos-ba-ba';
        } else if (activeGenealogyNode === 'nhat-binh') {
          matchTree = c.lineageSubcategory === 'nhat-binh' || c.id === 'cos-nhat-binh' || c.id === 'cos-doi-kham';
        } else if (activeGenealogyNode === 'tu-than') {
          matchTree = c.lineageSubcategory === 'tu-than' || c.id === 'cos-tu-than';
        } else if (activeGenealogyNode === 'ba-ba') {
          matchTree = c.lineageSubcategory === 'ba-ba' || c.id === 'cos-ba-ba';
        }
        if (!matchTree) return false;
      }

      // 2. Lọc theo Giới tính
      if (genderFilter !== 'all') {
        if (genderFilter === 'female' && c.gender !== 'female' && c.gender !== 'unisex') return false;
        if (genderFilter === 'male' && c.gender !== 'male' && c.gender !== 'unisex') return false;
        if (genderFilter === 'unisex' && c.gender !== 'unisex') return false;
      }

      // 3. Lọc theo Thời kỳ
      if (eraFilter !== 'all' && !c.era.toLowerCase().includes(eraFilter.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [costumes, activeGenealogyNode, genderFilter, eraFilter]);

  const handleResetFilters = () => {
    setActiveGenealogyNode('all');
    setGenderFilter('all');
    setEraFilter('all');
  };

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
      {/* 🌟 1. BANNER TIÊU ĐỀ THEME HỒNG DI SẢN THANH LỊCH */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF5F7] via-[#FFFFFF] to-[#FCE7EC] border border-[#F4C2CE] p-6 sm:p-8 md:p-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F4] border border-[#F4C2CE] text-[#C84B69] text-xs font-serif font-bold">
            <ChimLacIcon className="w-3.5 h-3 text-[#C84B69]" />
            <span>Kho Tàng Cổ Phục Việt Nam</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1C1917] tracking-tight">
            Di Sản Y Phục Dân Tộc
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] font-light leading-relaxed">
            {selectedEvent
              ? `Hệ thống gợi ý các mẫu trang phục theo dịp "${selectedEvent.name}". Bấm vào thẻ để tìm hiểu chi tiết hoặc vào Studio phối thử.`
              : 'Khám phá phả hệ cổ phục ngàn năm văn hiến được phục dựng chuẩn xác theo tư liệu khảo cổ và điển chế triều đình.'}
          </p>
        </div>

        {selectedEvent && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-white border border-[#F4C2CE] shadow-2xs">
              <span className="text-[10px] text-[#78716C] uppercase tracking-wider block font-serif">Đang gắn sự kiện:</span>
              <span className="text-sm font-serif font-bold text-[#C84B69]">{selectedEvent.name}</span>
            </div>
            <button
              onClick={onChangeEvent}
              className="px-4 py-2.5 rounded-xl bg-[#FFF0F4] hover:bg-[#FCE7EC] border border-[#F4C2CE] text-xs font-serif font-bold text-[#C84B69] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>Đổi sự kiện</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 🌟 2. BỐ CỤC 2 CỘT: SƠ ĐỒ TRỐNG ĐỒNG BÊN TRÁI & DANH SÁCH THẺ BÊN PHẢI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* CỘT TRÁI (5 Cột): SƠ ĐỒ PHÂN NHÁNH TRỐNG ĐỒNG ĐÔNG SƠN + BỘ LỌC NAM/NỮ */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          {/* Thanh thu gọn Trống Đồng trên Mobile */}
          <div className="lg:hidden flex items-center justify-between p-3 rounded-2xl bg-white border border-[#F4C2CE] shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">🥁</span>
              <div>
                <span className="font-serif font-bold text-xs text-[#1C1917] block">
                  Sơ Đồ Phân Nhánh Trống Đồng
                </span>
                <span className="text-[10px] text-[#78716C]">
                  {activeGenealogyNode === 'all'
                    ? 'Đang xem: Tất cả các hệ cổ phục'
                    : `Nhánh đang chọn: ${activeGenealogyNode}`}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsDrumCollapsedMobile(!isDrumCollapsedMobile)}
              className="text-xs px-3 py-1.5 rounded-full bg-[#FFF0F4] hover:bg-[#FCE7EC] text-[#C84B69] font-medium transition-colors border border-[#F4C2CE] flex items-center gap-1 cursor-pointer"
            >
              <span>{isDrumCollapsedMobile ? 'Mở sơ đồ ▾' : 'Thu gọn ▴'}</span>
            </button>
          </div>

          {/* Khối Trống Đồng */}
          <div className={`${isDrumCollapsedMobile ? 'hidden lg:block' : 'block'}`}>
            <DongSonDrumGenealogy
              activeNode={activeGenealogyNode}
              onSelectNode={(nodeId) => setActiveGenealogyNode(nodeId)}
              costumeCounts={costumeCounts}
            />
          </div>

          {/* Khối Lọc Nam / Nữ & Thời kỳ (Tích hợp ngay dưới trống đồng) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#F4C2CE] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-serif font-bold text-xs text-[#1C1917]">
                <Filter className="w-3.5 h-3.5 text-[#C84B69]" />
                <span>Bộ lọc phân loại:</span>
              </div>
              {(activeGenealogyNode !== 'all' || genderFilter !== 'all' || eraFilter !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#C84B69] hover:underline flex items-center gap-1 cursor-pointer font-serif"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đặt lại</span>
                </button>
              )}
            </div>

            {/* Lọc Giới tính: Nam / Nữ / Unisex */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#78716C] font-serif block">Giới tính người mặc:</label>
              <div className="grid grid-cols-4 gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8E2D8]">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'female', label: 'Nữ' },
                  { id: 'male', label: 'Nam' },
                  { id: 'unisex', label: 'Cả hai' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGenderFilter(g.id)}
                    className={`py-1.5 text-center text-[11px] rounded-lg transition-all font-medium cursor-pointer ${
                      genderFilter === g.id
                        ? 'bg-[#C84B69] text-white font-bold shadow-2xs'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lọc Thời kỳ */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#78716C] font-serif block">Thời kỳ & Triều đại:</label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8E2D8]">
                {[
                  { id: 'all', label: 'Mọi thời kỳ' },
                  { id: 'nguyễn', label: 'Triều Nguyễn' },
                  { id: 'lê', label: 'Thời Lê' }
                ].map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setEraFilter(e.id)}
                    className={`py-1.5 text-center text-[11px] rounded-lg transition-all font-medium cursor-pointer ${
                      eraFilter === e.id
                        ? 'bg-[#C84B69] text-white font-bold shadow-2xs'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (7 Cột): DANH SÁCH THẺ CỔ PHỤC THIẾT KẾ ĐỒNG ĐIỆU NHƯ TRANG CHỦ */}
        <div className="lg:col-span-7 space-y-5">
          {/* Header kết quả */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-[#F4C2CE] shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C84B69] animate-pulse" />
              <div>
                <h2 className="font-serif font-bold text-sm sm:text-base text-[#1C1917]">
                  Danh Sách Cổ Phục ({filteredCostumes.length} mẫu)
                </h2>
                <p className="text-[10px] sm:text-[11px] text-[#78716C] font-light">
                  Bấm "Chi tiết" để tìm hiểu lịch sử nguồn gốc hoặc "Phối thử" để vào Studio
                </p>
              </div>
            </div>

            {activeGenealogyNode !== 'all' && (
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#FFF0F4] text-[#C84B69] font-medium border border-[#F4C2CE]">
                Đang lọc: {activeGenealogyNode}
              </span>
            )}
          </div>

          {/* Danh sách thẻ cổ phục dàn trải phong cách Editorial Card */}
          {filteredCostumes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#F4C2CE] p-8 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF0F4] text-[#C84B69] mx-auto flex items-center justify-center text-xl">
                👘
              </div>
              <h3 className="font-serif font-bold text-base text-[#1C1917]">
                Không tìm thấy trang phục phù hợp
              </h3>
              <p className="text-xs text-[#78716C] max-w-md mx-auto font-light">
                Vui lòng thử bỏ chọn các nhánh phân loại hoặc đặt lại bộ lọc để xem toàn bộ kho di sản.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#C84B69] hover:bg-[#B33B58] text-white rounded-xl text-xs font-serif font-bold transition-all shadow-sm cursor-pointer"
              >
                Đặt lại tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {filteredCostumes.map((costume) => {
                const suitInfo = selectedEvent
                  ? costume.suitability.find((s) => s.eventId === selectedEvent.id)
                  : costume.suitability[0];

                const isExpanded = expandedCostumeId === costume.id;

                return (
                  <article
                    key={costume.id}
                    className="group relative rounded-2xl sm:rounded-3xl bg-white border border-[#F4C2CE] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Phần Ảnh: Khung lớn tràn thoáng, căn giữa trang trọng */}
                    <div
                      onClick={() => setExpandedCostumeId(isExpanded ? null : costume.id)}
                      className="relative h-64 sm:h-72 overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#FFF5F7] to-[#FAF7F2] flex items-center justify-center p-3 cursor-pointer"
                      title="Bấm để mở rộng xem nhanh chi tiết"
                    >
                      <img
                        src={costume.coverImage}
                        alt={costume.name}
                        className="max-h-full w-auto object-contain object-center drop-shadow-md group-hover:scale-104 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 pointer-events-none">
                        <span className="text-[10px] font-serif font-semibold px-2.5 py-1 rounded-full bg-white/95 text-[#1C1917] backdrop-blur-xs shadow-xs border border-stone-200">
                          {costume.era.split('(')[0].trim()}
                        </span>

                        {suitInfo && (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#C84B69] text-white shadow-xs flex items-center gap-1 border border-white/40">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span>{suitInfo.score}% phù hợp</span>
                          </span>
                        )}
                      </div>

                      {/* Lineage label at bottom of image */}
                      <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none">
                        {costume.lineageLabel && (
                          <span className="text-[9px] uppercase tracking-wider text-[#FCD5DE] font-semibold block drop-shadow-xs">
                            {costume.lineageLabel}
                          </span>
                        )}
                        <span className="text-xs text-stone-200 font-light flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#FCD5DE]" />
                          <span>{costume.region}</span>
                          <span>•</span>
                          <span>{costume.gender === 'female' ? 'Dành cho Nữ' : costume.gender === 'male' ? 'Dành cho Nam' : 'Nam & Nữ'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Phần Nội Dung & Các Nút Hành Động */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            onClick={() => onSelectCostume(costume)}
                            className="text-lg sm:text-xl font-serif font-bold text-[#1C1917] hover:text-[#C84B69] transition-colors cursor-pointer leading-snug"
                          >
                            {costume.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setExpandedCostumeId(isExpanded ? null : costume.id)}
                            className="text-[11px] text-[#C84B69] hover:underline font-medium shrink-0 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>{isExpanded ? 'Thu gọn' : 'Xem nhanh'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </div>

                        <p className="text-xs text-[#57534E] font-light leading-relaxed line-clamp-2 mt-1.5">
                          {costume.shortDescription}
                        </p>
                      </div>

                      {/* Ghi chú vì sao phù hợp với dịp này (nếu có) */}
                      {suitInfo && selectedEvent && (
                        <div className="p-2.5 rounded-xl bg-[#FFF5F7] border border-[#F4C2CE] text-[11px] text-[#57534E] leading-relaxed font-light">
                          <span className="font-serif font-bold text-[#C84B69] block mb-0.5">
                            Vì sao hợp với {selectedEvent.name}:
                          </span>
                          <span className="line-clamp-2">{suitInfo.reason}</span>
                        </div>
                      )}

                      {/* PHẦN CLICK MỞ RỘNG CHI TIẾT NHƯ TRANG CHỦ (INLINE ACCORDION) */}
                      {isExpanded && (
                        <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#F4C2CE] space-y-3 text-xs animate-in fade-in-50 duration-200">
                          {/* 1. Cấu tạo các lớp Layer */}
                          <div>
                            <span className="font-serif font-bold text-[#9E2A47] text-[11px] block mb-1.5">
                              👘 Cấu tạo các lớp ({costume.components.length} lớp):
                            </span>
                            <div className="space-y-1">
                              {costume.components.map((comp) => (
                                <div key={comp.id} className="flex items-center justify-between text-[11px] text-[#57534E]">
                                  <span className="font-medium">• {comp.name}</span>
                                  <span className="text-[10px] text-[#78716C]">Lớp {comp.layerOrder} {comp.isRequired ? '(Bắt buộc)' : ''}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 2. Phụ kiện & Màu sắc */}
                          <div className="pt-2 border-t border-[#F7D6DE]">
                            <span className="font-serif font-bold text-[#9E2A47] text-[11px] block mb-1">
                              💎 Phụ kiện khuyên dùng:
                            </span>
                            <p className="text-[11px] text-[#57534E] font-light">
                              {costume.stylingGuide.accessories.slice(0, 3).join(', ')}
                            </p>
                          </div>

                          {/* 3. Bối cảnh sử dụng */}
                          <div className="pt-2 border-t border-[#F7D6DE]">
                            <span className="font-serif font-bold text-[#9E2A47] text-[11px] block mb-1">
                              📜 Bối cảnh sử dụng:
                            </span>
                            <p className="text-[11px] text-[#57534E] font-light leading-relaxed line-clamp-2">
                              {costume.historicalContext}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Cụm 2 nút hành động: "Tìm hiểu thêm" -> mở tab chi tiết, "Phối thử" -> vào Studio */}
                      <div className="pt-2 border-t border-[#F8E5EB] grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectCostume(costume)}
                          className="py-2.5 px-3 rounded-xl border border-[#F4C2CE] bg-[#FFF0F4] hover:bg-[#FCE7EC] text-[#C84B69] text-xs font-serif font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                          title="Mở tab chi tiết nguồn gốc & cẩm nang phối đồ"
                        >
                          <span>Tìm hiểu thêm</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onTryRemix ? onTryRemix(costume) : onSelectCostume(costume)}
                          className="py-2.5 px-3 rounded-xl bg-[#C84B69] hover:bg-[#B33B58] text-white text-xs font-serif font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <ChimLacIcon className="w-3.5 h-3 text-white" />
                          <span>Phối thử</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

