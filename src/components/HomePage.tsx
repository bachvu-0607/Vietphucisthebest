import React, { useState, useEffect, useRef } from 'react';
import { EventItem, Costume } from '../types';
import {
  Sparkles,
  Calendar,
  HeartHandshake,
  GraduationCap,
  Drama,
  Compass,
  ArrowRight,
  CheckCircle2,
  Layers,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  ShieldCheck,
  Tag,
  Star,
  Shirt,
  Flame,
  Check
} from 'lucide-react';
import {
  ChimLacIcon,
  TrongDongWatermark,
  HoaSenDivider,
  TrienSonSeal,
  TrienXacThuc,
  ThuyBaWaveRibbon
} from './VietnameseMotifs';
import { DongSonDrumGenealogy, type GenealogyNodeId } from './DongSonDrumGenealogy';
import { CostumeQuickViewModal } from './CostumeQuickViewModal';

interface HomePageProps {
  events: EventItem[];
  costumes: Costume[];
  selectedEvent?: EventItem;
  onSelectEvent: (event: EventItem) => void;
  onSelectCostume: (costume: Costume) => void;
  onStartStudio?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  events,
  costumes,
  selectedEvent,
  onSelectEvent,
  onSelectCostume,
  onStartStudio
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'intro' | 'events' | 'costumes'>('intro');
  const [justSelectedEvent, setJustSelectedEvent] = useState<EventItem | null>(null);
  const [activeGenealogyNode, setActiveGenealogyNode] = useState<GenealogyNodeId>('all');
  const [quickViewCostume, setQuickViewCostume] = useState<Costume | null>(null);
  const [isDrumCollapsedMobile, setIsDrumCollapsedMobile] = useState<boolean>(false);

  // Horizontal scroll state & controls for Event Carousel
  const eventsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const updateEventsScrollState = () => {
    if (!eventsScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = eventsScrollRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    // Approximate active card index for indicator dots
    const cardWidth = 360;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveEventIndex(Math.min(Math.max(0, index), events.length - 1));
  };

  useEffect(() => {
    const el = eventsScrollRef.current;
    if (!el) return;
    updateEventsScrollState();
    el.addEventListener('scroll', updateEventsScrollState, { passive: true });
    window.addEventListener('resize', updateEventsScrollState);
    return () => {
      el.removeEventListener('scroll', updateEventsScrollState);
      window.removeEventListener('resize', updateEventsScrollState);
    };
  }, [events.length]);

  const scrollEvents = (direction: 'left' | 'right') => {
    if (eventsScrollRef.current) {
      const { scrollLeft, clientWidth } = eventsScrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      eventsScrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToEventByIndex = (index: number) => {
    if (!eventsScrollRef.current) return;
    const children = eventsScrollRef.current.children;
    if (children && children[index]) {
      (children[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  };

  // Smooth scroll handler for sub-tabs
  const scrollToSection = (sectionId: 'intro' | 'events' | 'costumes') => {
    setActiveSubTab(sectionId);
    const element = document.getElementById(`${sectionId}-section`);
    if (element) {
      const navOffset = 130;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth'
      });
    }
  };

  // Handler when clicking "Khám phá trang phục phù hợp" on an event card
  const handleExploreCostumesForEvent = (event: EventItem) => {
    onSelectEvent(event);
    setJustSelectedEvent(event);
    scrollToSection('costumes');
  };

  // Sort and calculate suitability scores for costumes when an event is selected
  const sortedCostumes = [...costumes].sort((a, b) => {
    if (!selectedEvent) return 0;
    const suitA = a.suitability.find((s) => s.eventId === selectedEvent.id)?.score || 0;
    const suitB = b.suitability.find((s) => s.eventId === selectedEvent.id)?.score || 0;
    return suitB - suitA;
  });

  // Calculate counts for genealogy tree badges
  const costumeCounts = React.useMemo(() => {
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

  // Filter costumes based on active tree node
  const filteredCostumesByTree = React.useMemo(() => {
    if (activeGenealogyNode === 'all') return sortedCostumes;
    if (activeGenealogyNode === 'giao-linh') {
      return sortedCostumes.filter(c => c.lineageCategory === 'giao-linh' || c.id === 'cos-giao-linh');
    }
    if (activeGenealogyNode === 'vien-linh') {
      return sortedCostumes.filter(c => c.lineageCategory === 'vien-linh' || c.id === 'cos-vien-linh');
    }
    if (activeGenealogyNode === 'lap-linh') {
      return sortedCostumes.filter(c => c.lineageCategory === 'lap-linh' || c.id === 'cos-ao-tac' || c.id === 'cos-ngu-than-tay-chen' || c.id === 'cos-ao-dai');
    }
    if (activeGenealogyNode === 'ao-tac') {
      return sortedCostumes.filter(c => c.lineageSubcategory === 'ao-tac' || c.id === 'cos-ao-tac');
    }
    if (activeGenealogyNode === 'tay-chen') {
      return sortedCostumes.filter(c => c.lineageSubcategory === 'tay-chen' || c.id === 'cos-ngu-than-tay-chen' || c.id === 'cos-ao-dai');
    }
    if (activeGenealogyNode === 'dich-chuyen') {
      return sortedCostumes.filter(c => c.lineageCategory === 'dich-chuyen' || c.id === 'cos-nhat-binh' || c.id === 'cos-doi-kham' || c.id === 'cos-tu-than' || c.id === 'cos-ba-ba');
    }
    if (activeGenealogyNode === 'nhat-binh') {
      return sortedCostumes.filter(c => c.lineageSubcategory === 'nhat-binh' || c.id === 'cos-nhat-binh' || c.id === 'cos-doi-kham');
    }
    if (activeGenealogyNode === 'tu-than') {
      return sortedCostumes.filter(c => c.lineageSubcategory === 'tu-than' || c.id === 'cos-tu-than');
    }
    if (activeGenealogyNode === 'ba-ba') {
      return sortedCostumes.filter(c => c.lineageSubcategory === 'ba-ba' || c.id === 'cos-ba-ba');
    }
    return sortedCostumes;
  }, [sortedCostumes, activeGenealogyNode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F7] via-[#FDF0F3] to-[#FFF5F7] text-[#1C1917] relative">
      {/* Background Subtle Watermark (Trống Đồng Đông Sơn) */}
      <div className="absolute top-12 -right-20 text-[#D84B6F]/5 pointer-events-none select-none">
        <TrongDongWatermark className="w-[600px] h-[600px]" />
      </div>

      {/* SUB-TABS: GIAO DIỆN NỀN CÁNH SEN + LỚP SÓNG THỦY BA */}
      <div className="sticky top-20 z-30 w-full backdrop-blur-md bg-[#FFF5F7]/95 border-b border-[#F7D6DE] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 sm:py-3">
            {/* 3 Mini-tabs styled with Thủy Ba Lotus Waves */}
            <div className="flex items-center gap-1.5 sm:gap-3 bg-[#FCE7EC] p-1.5 rounded-full border border-[#F4C2CE] shadow-inner">
              <button
                onClick={() => scrollToSection('intro')}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeSubTab === 'intro'
                    ? 'bg-[#C84B69] text-white shadow-sm font-semibold'
                    : 'text-[#6E2E3E] hover:text-[#C84B69] hover:bg-[#F9D6DF]'
                }`}
              >
                <span>🌸</span>
                <span className="font-serif">Trang giới thiệu</span>
              </button>

              <button
                onClick={() => scrollToSection('events')}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeSubTab === 'events'
                    ? 'bg-[#C84B69] text-white shadow-sm font-semibold'
                    : 'text-[#6E2E3E] hover:text-[#C84B69] hover:bg-[#F9D6DF]'
                }`}
              >
                <span>🏮</span>
                <span className="font-serif">Sự kiện</span>
              </button>

              <button
                onClick={() => scrollToSection('costumes')}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeSubTab === 'costumes'
                    ? 'bg-[#C84B69] text-white shadow-sm font-semibold'
                    : 'text-[#6E2E3E] hover:text-[#C84B69] hover:bg-[#F9D6DF]'
                }`}
              >
                <span>👘</span>
                <span className="font-serif">Loại trang phục</span>
              </button>
            </div>

            {/* Event selected status pill */}
            {selectedEvent && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C84B69]/10 border border-[#C84B69]/30 text-[#C84B69] text-xs">
                <span className="font-serif font-bold">Đang chọn:</span>
                <span>{selectedEvent.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Wave Ribbon under Sub-Tabs */}
        <ThuyBaWaveRibbon height={14} className="w-full opacity-80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-20 relative z-10">

        {/* ========================================================
            3. TRANG GIỚI THIỆU CÓ HÌNH ẢNH
            - Hero lớn giới thiệu ứng dụng
            - Khu vực giải thích quy trình 3 bước
            ======================================================== */}
        <section id="intro-section" className="space-y-12 pt-4">
          {/* Hero Lớn Giới Thiệu Ứng Dụng */}
          <div className="bg-gradient-to-br from-[#FFFFFF] via-[#FFF7F9] to-[#FDEBF0] border border-[#F4C2CE] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
            {/* Subtle decorative wave pattern */}
            <div className="absolute bottom-0 left-0 right-0 opacity-15 pointer-events-none">
              <ThuyBaWaveRibbon height={36} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Châm ngôn, tính năng & mô tả */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#C84B69]/10 border border-[#C84B69]/25 text-[#C84B69] text-xs font-serif font-bold tracking-wider uppercase">
                  <ChimLacIcon className="w-4 h-3.5 text-[#C84B69]" />
                  <span>Việt Phục Remix • Tôn Vinh Di Sản</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight leading-[1.2]">
                  Mặc đúng lễ nghi, <br />
                  <span className="italic font-normal text-[#C84B69]">hòa hợp cùng thời khắc</span>
                </h1>

                <p className="text-sm sm:text-base text-[#57534E] font-light leading-relaxed">
                  <strong>Việt Phục Remix</strong> là nền tảng số hóa di sản trang phục truyền thống Việt Nam. Ứng dụng giúp bạn tra cứu chuẩn mực lịch sử các triều đại (Nguyễn, Lê, Lý, Trần), đối chiếu bối cảnh sự kiện thực tế, gợi ý chất liệu theo thời tiết và tự do phối thử trang phục trên Studio 2D hiện đại.
                </p>

                {/* Core Feature Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/80 border border-[#F4C2CE]">
                    <span className="w-6 h-6 rounded-full bg-[#C84B69]/10 text-[#C84B69] flex items-center justify-center text-xs shrink-0 font-bold">1</span>
                    <div className="text-xs">
                      <span className="font-serif font-bold text-[#1C1917] block">Đối Chiếu Chuẩn Mực</span>
                      <span className="text-[#78716C] font-light">Tư liệu chính sử Khâm Định Đại Nam, bảo tàng cổ vật</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/80 border border-[#F4C2CE]">
                    <span className="w-6 h-6 rounded-full bg-[#C29B38]/20 text-[#C29B38] flex items-center justify-center text-xs shrink-0 font-bold">2</span>
                    <div className="text-xs">
                      <span className="font-serif font-bold text-[#1C1917] block">Phối Đồ Theo Bối Cảnh</span>
                      <span className="text-[#78716C] font-light">Gợi ý theo mùa, thời tiết, tính trang nghiêm của sự kiện</span>
                    </div>
                  </div>
                </div>

                {/* Call to Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => scrollToSection('events')}
                    className="px-6 py-3 rounded-md bg-[#C84B69] hover:bg-[#B33B57] text-white font-medium text-xs sm:text-sm tracking-wide shadow-sm hover:shadow-md transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span>Khám phá sự kiện</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => scrollToSection('costumes')}
                    className="px-6 py-3 rounded-md bg-white hover:bg-[#FFF0F4] text-[#C84B69] border border-[#F4C2CE] font-medium text-xs sm:text-sm tracking-wide transition-all"
                  >
                    <span>Xem kho cổ phục</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Hero Visual Image Collage with Thủy Ba Filigree */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-[#FAF7F2]">
                  <img
                    src="/assets/costumes/ao-nhat-binh-nam-phuong.jpg"
                    alt="Áo Nhật Bình cung đình rực rỡ sắc màu"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  {/* Decorative Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                  {/* Corner Triện Seal Badge */}
                  <div className="absolute top-4 left-4">
                    <TrienSonSeal text="PUB" size="sm" className="bg-white/90 shadow-md" />
                  </div>

                  {/* Caption Tag */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-[#F4C2CE] shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C84B69] block">
                      Di Sản Cung Đình
                    </span>
                    <span className="font-serif font-bold text-sm text-[#1C1917] block">
                      Áo Nhật Bình & Dải Ngũ Hành
                    </span>
                    <span className="text-[11px] text-[#78716C] font-light">
                      Màu sắc phục dựng nguyên bản theo quy chế Hội Điển triều Nguyễn
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Khu Vực Giải Thích Quy Trình Ba Bước */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#C84B69] flex items-center justify-center gap-1.5">
                <span>✦</span>
                Quy Trình Ba Bước Tiếp Cận Di Sản
                <span>✦</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
                Ba Bước Để Tự Tin Khoác Lên Mình Việt Phục
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] font-light">
                Hệ thống hướng dẫn bạn từng bước từ khâu nhận diện hoàn cảnh đến định hình phong cách cá nhân
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bước 1 */}
              <div className="bg-white/90 border border-[#F4C2CE] rounded-2xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
                <div className="w-10 h-10 rounded-full bg-[#C84B69]/10 text-[#C84B69] font-serif font-bold text-base flex items-center justify-center border border-[#F4C2CE]">
                  01
                </div>
                <h3 className="text-lg font-serif font-bold text-[#1C1917] group-hover:text-[#C84B69] transition-colors">
                  Chọn Bối Cảnh Sự Kiện
                </h3>
                <p className="text-xs text-[#57534E] font-light leading-relaxed">
                  Xác định rõ bạn sắp tham gia sự kiện gì: Lễ cưới truyền thống, chúc Tết đầu xuân, sự kiện ngoại giao, chụp ảnh kỷ yếu hay dạo phố cà phê cuối tuần.
                </p>
                <div className="pt-2 text-[11px] text-[#C84B69] font-medium flex items-center gap-1">
                  <span>Mức độ trang trọng & mùa thời tiết</span>
                </div>
              </div>

              {/* Bước 2 */}
              <div className="bg-white/90 border border-[#F4C2CE] rounded-2xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
                <div className="w-10 h-10 rounded-full bg-[#C29B38]/15 text-[#C29B38] font-serif font-bold text-base flex items-center justify-center border border-[#E5C978]">
                  02
                </div>
                <h3 className="text-lg font-serif font-bold text-[#1C1917] group-hover:text-[#C29B38] transition-colors">
                  Đối Chiếu Cổ Phục Chuẩn Mực
                </h3>
                <p className="text-xs text-[#57534E] font-light leading-relaxed">
                  Hệ thống tự động chấm điểm độ tương thích, phân tích vì sao Áo Nhật Bình hợp ngày cưới, Áo Tấc hợp đón Tết, và cảnh báo những kết hợp sai lệch văn hóa.
                </p>
                <div className="pt-2 text-[11px] text-[#C29B38] font-medium flex items-center gap-1">
                  <span>Chấm điểm độ thích hợp tự động</span>
                </div>
              </div>

              {/* Bước 3 */}
              <div className="bg-white/90 border border-[#F4C2CE] rounded-2xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
                <div className="w-10 h-10 rounded-full bg-[#0F766E]/15 text-[#0F766E] font-serif font-bold text-base flex items-center justify-center border border-[#6EE7B7]">
                  03
                </div>
                <h3 className="text-lg font-serif font-bold text-[#1C1917] group-hover:text-[#0F766E] transition-colors">
                  Phối Lớp & Trải Nghiệm Studio
                </h3>
                <p className="text-xs text-[#57534E] font-light leading-relaxed">
                  Tự do thay đổi màu sắc, thử nghiệm chất liệu lụa/gấm/nhung, phối phụ kiện khăn vấn, nón lá, kiềng bạc trên Studio 2D và lưu lại bản phối của riêng bạn.
                </p>
                <div className="pt-2 text-[11px] text-[#0F766E] font-medium flex items-center gap-1">
                  <span>Remix phong cách & Xuất hình ảnh</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HoaSenDivider label="Chọn Hoàn Cảnh Sử Dụng" />

        {/* ========================================================
            4. TRANG CHỌN SỰ KIỆN (NẰM TRONG TRANG CHỦ)
            Mỗi sự kiện có:
            - Ảnh minh họa (cả khung ảnh nổi bật như trong hình vẽ tay của user)
            - Tên và mô tả ngắn
            - Mức độ trang trọng
            - Thông tin mùa/thời tiết
            - Nút “Khám phá trang phục phù hợp”
            ======================================================== */}
        <section id="events-section" className="space-y-6 scroll-mt-32">
          {/* Header Khu Vực Sự Kiện với Nút Điều Hướng Trái / Phải */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-[#F4C2CE]">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-serif font-bold text-[#C84B69] uppercase tracking-wider mb-1">
                <span>🏮 Khu Vực 2</span>
                <span>•</span>
                <span>Chọn Hoàn Cảnh Sự Kiện</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
                Bạn Đang Chuẩn Bị Cho Dịp Nào?
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] font-light mt-1">
                Lướt ngang để chọn sự kiện, hệ thống sẽ tự động lọc và chấm điểm cổ phục tương thích ở phần bên dưới.
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {selectedEvent && (
                <button
                  onClick={() => onSelectEvent(events[0])}
                  className="text-xs text-[#C84B69] hover:underline flex items-center gap-1 font-medium bg-[#FFF0F4] px-3 py-1.5 rounded-full border border-[#F4C2CE]"
                >
                  <span>Đang chọn: <strong>{selectedEvent.name}</strong></span>
                </button>
              )}

              {/* Nút bấm trượt ngang Trái / Phải */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollEvents('left')}
                  disabled={!canScrollLeft}
                  aria-label="Sự kiện trước"
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#FFF0F4] text-[#C84B69] border border-[#F4C2CE] shadow-xs hover:shadow-md transition-all flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                  title="Cuộn sang trái"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollEvents('right')}
                  disabled={!canScrollRight}
                  aria-label="Sự kiện tiếp theo"
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#FFF0F4] text-[#C84B69] border border-[#F4C2CE] shadow-xs hover:shadow-md transition-all flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                  title="Cuộn sang phải"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Cửa Sổ Trượt Ngang Sự Kiện (Horizontal Snap Carousel) */}
          <div
            ref={eventsScrollRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-2 px-1 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {events.map((evt) => {
              const isSelected = selectedEvent?.id === evt.id;

              return (
                <div
                  key={evt.id}
                  className={`snap-start shrink-0 w-[290px] sm:w-[330px] md:w-[350px] lg:w-[370px] min-h-[430px] sm:min-h-[460px] group relative rounded-2xl overflow-hidden border transition-all duration-500 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1.5 ${
                    isSelected
                      ? 'border-[#C84B69] ring-4 ring-[#C84B69]/30 shadow-xl scale-[1.01]'
                      : 'border-white/20 hover:border-[#C84B69]/60'
                  }`}
                >
                  {/* Toàn bộ khung là ảnh lớn tràn viền */}
                  <img
                    src={evt.imageUrl || '/assets/events/tet-du-xuan.jpg'}
                    alt={evt.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/costumes/ao-tac-bat-bao.jpeg';
                    }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Lớp gradient bảo vệ độ tương phản: Trong trẻo ở giữa để ngắm ảnh, đậm dần ở đáy để chữ và nút nổi bật 100% */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 via-50% to-black/25 pointer-events-none" />

                  {/* Header trên ảnh: Badge phân loại & Trạng thái chọn */}
                  <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-white/95 text-[#9E2A47] shadow-sm backdrop-blur-md border border-white/60">
                      {evt.badge}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#C84B69] text-white shadow-md border border-white/30 backdrop-blur-sm animate-pulse">
                        <Check className="w-3.5 h-3.5" />
                        <span>Đang chọn</span>
                      </span>
                    )}
                  </div>

                  {/* Footer đè trực tiếp lên ảnh: Tên sự kiện + Mô tả + Nút khám phá */}
                  <div className="relative z-10 p-5 sm:p-6 space-y-3">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight drop-shadow-md group-hover:text-[#FCD5DE] transition-colors leading-snug line-clamp-1">
                      {evt.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-200/95 font-light leading-relaxed line-clamp-3 drop-shadow-xs">
                      {evt.description}
                    </p>

                    {/* Nút bấm Khám phá trang phục phù hợp */}
                    <div className="pt-1.5">
                      <button
                        onClick={() => handleExploreCostumesForEvent(evt)}
                        className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#C84B69] to-[#9E2A47] text-white shadow-[#C84B69]/40 ring-2 ring-white/40'
                            : 'bg-white/95 hover:bg-[#C84B69] text-[#9E2A47] hover:text-white hover:shadow-xl hover:shadow-[#C84B69]/30 backdrop-blur-sm'
                        }`}
                      >
                        <span>Khám phá trang phục phù hợp</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Thanh Chỉ Báo Tiến Trình & Chuyển Trang Bằng Nút Tròn Nhỏ */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 px-1">
            <span className="text-[11px] text-[#78716C] font-light hidden sm:inline-block">
              ← Vuốt ngang hoặc dùng nút mũi tên để xem tất cả {events.length} hoàn cảnh sự kiện →
            </span>

            <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
              {events.map((evt, idx) => (
                <button
                  key={evt.id}
                  onClick={() => scrollToEventByIndex(idx)}
                  aria-label={`Chuyển tới ${evt.name}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeEventIndex === idx
                      ? 'w-7 h-2 bg-[#C84B69]'
                      : 'w-2 h-2 bg-[#F4C2CE] hover:bg-[#C84B69]/60'
                  }`}
                  title={evt.name}
                />
              ))}
            </div>

            <span className="text-xs font-serif font-bold text-[#C84B69] tracking-wider">
              {activeEventIndex + 1} / {events.length} Sự kiện
            </span>
          </div>
        </section>

        <HoaSenDivider label="Khám Phá Kho Cổ Phục" />

        {/* ========================================================
            5. TRANG KHÁM PHÁ CỔ PHỤC (NẰM TRONG TRANG CHỦ)
            Phải có:
            - Liệt kê các loại cổ phục + hình ảnh minh hoạ có màu sắc (không phải ảnh cũ)
            - Nếu đã chọn sự kiện thì kéo xuống trang này + hiển thị độ thích hợp của cổ phục
            - Sau khi bấm chọn trang phục -> chuyển sang tab cổ phục cùng mức với trang chủ
            ======================================================== */}
        <section id="costumes-section" className="space-y-8 scroll-mt-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#F4C2CE]">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-serif font-bold text-[#C84B69] uppercase tracking-wider mb-1">
                <span>👘 Khu Vực 3</span>
                <span>•</span>
                <span>Khám Phá Kho Cổ Phục Việt</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
                Danh Mục Cổ Phục & Độ Tương Thích
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] font-light mt-1">
                {selectedEvent
                  ? `Đang hiển thị đánh giá độ phù hợp với sự kiện: "${selectedEvent.name}"`
                  : 'Bấm chọn một bộ cổ phục để chuyển sang tab Chi tiết Cổ Phục.'}
              </p>
            </div>

            {selectedEvent && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FFF0F4] border border-[#F4C2CE] text-xs">
                <span className="text-[11px] text-[#78716C]">Đang đối chiếu sự kiện:</span>
                <span className="font-serif font-bold text-[#C84B69]">{selectedEvent.name}</span>
              </div>
            )}
          </div>

          {/* ========================================================
              BỐ CỤC 2 CỘT: TRỐNG ĐỒNG BÊN TRÁI & KHO CỔ PHỤC BÊN PHẢI
              ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Cột Trái: Trống Đồng Đông Sơn Tương Tác */}
            <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-28 space-y-3">
              {/* Thanh Thu Gọn / Mở Rộng Trống Đồng - CHỈ DÀNH CHO MOBILE (< lg) */}
              <div className="lg:hidden flex items-center justify-between p-3 rounded-2xl bg-white border border-[#F4C2CE] shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">🥁</span>
                  <div>
                    <span className="font-serif font-bold text-xs text-[#1C1917] block">
                      Sơ Đồ Phân Nhánh Trống Đồng
                    </span>
                    <span className="text-[10px] text-[#78716C]">
                      {activeGenealogyNode === 'all'
                        ? 'Đang xem: Tất cả các hệ cổ phục'
                        : `Đang lọc: ${activeGenealogyNode}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsDrumCollapsedMobile(!isDrumCollapsedMobile)}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#FFF0F4] hover:bg-[#FCE7EC] text-[#C84B69] font-medium transition-colors border border-[#F4C2CE] flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>{isDrumCollapsedMobile ? 'Mở sơ đồ trống ▾' : 'Thu gọn trống ▴'}</span>
                </button>
              </div>

              {/* Component Trống Đồng (Người dùng có thể bấm nút thu gọn trên mobile khi cần, không tự ý giật màn hình khi click) */}
              <div className={`${isDrumCollapsedMobile ? 'hidden lg:block' : 'block'}`}>
                <DongSonDrumGenealogy
                  activeNode={activeGenealogyNode}
                  onSelectNode={(nodeId) => {
                    setActiveGenealogyNode(nodeId);
                  }}
                  costumeCounts={costumeCounts}
                />
              </div>
            </div>

            {/* Cột Phải: Danh Sách Thẻ Cổ Phục (Thu nhỏ gọn gàng, giữ chiều cao ổn định không giật trang) */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-4 min-h-[680px] sm:min-h-[740px] flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header Cột Phải: Tiêu đề, số lượng & nút xóa lọc */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/90 border border-[#F4C2CE] shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#C84B69] animate-pulse" />
                    <div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#1C1917]">
                        Danh Sách Cổ Phục ({filteredCostumesByTree.length} mẫu)
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-[#78716C] font-light">
                        Bấm vào thẻ để mở xem chi tiết & toàn bộ cấu tạo trang phục
                      </p>
                    </div>
                  </div>

                  {activeGenealogyNode !== 'all' && (
                    <button
                      onClick={() => setActiveGenealogyNode('all')}
                      className="text-[11px] px-3 py-1 rounded-full bg-[#FCE7EC] hover:bg-[#F8D2DC] text-[#C84B69] font-medium transition-colors border border-[#F4C2CE] cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                    >
                      <span>Xem tất cả ({costumes.length})</span>
                    </button>
                  )}
                </div>

                {/* Grid Thẻ Cổ Phục Bên Phải: Kích thước nhỏ gọn (Compact Grid) */}
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {filteredCostumesByTree.map((costume) => {
                    // Find suitability mapping for selected event
                    const matchSuitability = selectedEvent
                      ? costume.suitability.find((s) => s.eventId === selectedEvent.id)
                      : null;

                    return (
                      <div
                        key={costume.id}
                        onClick={() => setQuickViewCostume(costume)}
                        className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-[#F4C2CE] bg-white shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                      >
                        {/* Khung Ảnh Gọn Gàng: Dùng object-contain để KHÔNG BỊ ZOOM LÀM MẤT PHỤ KIỆN BÊN TRONG */}
                        <div className="relative aspect-[4/5] sm:aspect-[1/1] xl:aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#FAF7F2] to-[#F5ECE1] flex items-center justify-center p-2 rounded-t-xl">
                          <img
                            src={costume.coverImage || '/assets/costumes/ao-tac-bat-bao.jpeg'}
                            alt={costume.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/assets/costumes/ao-tac-bat-bao.jpeg';
                            }}
                            className="w-full h-full object-contain object-center drop-shadow-sm group-hover:scale-103 transition-transform duration-300"
                          />

                          {/* Top Era Tag & Suitability Score */}
                          <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 z-10 pointer-events-none">
                            <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/95 text-[#1C1917] backdrop-blur-xs shadow-xs truncate max-w-[85px] sm:max-w-[100px] border border-stone-200">
                              {costume.era.split('(')[0].trim()}
                            </span>

                            {/* Suitability Score Badge */}
                            {matchSuitability && (
                              <span
                                className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white shadow-xs flex items-center gap-0.5 ${
                                  matchSuitability.score >= 90
                                    ? 'bg-emerald-600'
                                    : matchSuitability.score >= 80
                                    ? 'bg-amber-600'
                                    : 'bg-blue-600'
                                }`}
                              >
                                <Star className="w-2 h-2 fill-current" />
                                <span>{matchSuitability.score}%</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Thông Tin Tinh Gọn Trên Thẻ */}
                        <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between space-y-1 bg-white">
                          <div>
                            {costume.lineageLabel && (
                              <span className="text-[8px] sm:text-[9px] text-[#C84B69] uppercase tracking-wider block font-semibold truncate">
                                {costume.lineageLabel.split('•')[0]}
                              </span>
                            )}
                            <h4 className="text-xs sm:text-sm font-serif font-bold text-[#1C1917] tracking-tight group-hover:text-[#C84B69] transition-colors truncate">
                              {costume.name}
                            </h4>
                            <p className="text-[10px] text-[#57534E] font-light leading-snug line-clamp-1 mt-0.5">
                              {costume.shortDescription}
                            </p>
                          </div>

                          <div className="pt-1.5 border-t border-[#F8E5EB] flex items-center justify-between text-[10px]">
                            <span className="text-[#C84B69] font-medium flex items-center gap-0.5 group-hover:underline">
                              <span>Chi tiết</span>
                              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                            <span className="text-[9px] text-stone-400 font-light truncate max-w-[70px]">
                              {costume.region.split('(')[0].trim()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gợi ý tinh tế khi đang lọc nhánh để khung bên phải luôn cân đối */}
              {activeGenealogyNode !== 'all' && (
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between gap-2 mt-4">
                  <span>✦ Đang lọc theo hệ phân nhánh: <strong>{activeGenealogyNode}</strong></span>
                  <button
                    onClick={() => setActiveGenealogyNode('all')}
                    className="text-[#C84B69] font-semibold hover:underline cursor-pointer"
                  >
                    Xem lại toàn bộ kho (9 mẫu)
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <HoaSenDivider label="Trải Nghiệm Studio Phối Đồ" />

        {/* ========================================================
            KHỐI CALL-TO-ACTION (CTA) DẪN SANG STUDIO 2D Ở CUỐI TRANG CHỦ
            ======================================================== */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#9E2A47] via-[#C84B69] to-[#881337] text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-[#F4C2CE]/40">
          {/* Background decorative watermark */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none select-none">
            <TrongDongWatermark className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-serif font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Trải Nghiệm Trực Quan • Sáng Tạo Di Sản</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-snug">
              Sẵn Sàng Định Hình Phong Cách Di Sản Cho Riêng Bạn?
            </h2>

            <p className="text-xs sm:text-sm text-rose-100 font-light leading-relaxed max-w-2xl">
              Sau khi khám phá các kiểu cổ phục, hãy bước vào <strong>Studio Phối Đồ 2D</strong> để tự tay đổi màu sắc, thử nghiệm chất liệu lụa/gấm, chọn phụ kiện (khăn vấn, nón ba tầm, kiềng bạc, hài thêu) và xuất bản phối Lookbook độc bản của chính bạn.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartStudio || (() => scrollToSection('costumes'))}
                className="px-6 py-3 rounded-xl bg-white hover:bg-[#FFF0F4] text-[#9E2A47] font-semibold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Shirt className="w-4 h-4 text-[#C84B69]" />
                <span>Bắt đầu phối thử trên Studio 2D</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => scrollToSection('events')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 font-medium text-xs sm:text-sm tracking-wide transition-all cursor-pointer backdrop-blur-sm"
              >
                <span>Xem lại các sự kiện</span>
              </button>
            </div>
          </div>
        </section>

        {/* Modal Xem Nhanh Khi Tương Tác Vào Thẻ Cổ Phục */}
        <CostumeQuickViewModal
          costume={quickViewCostume}
          selectedEvent={selectedEvent}
          onClose={() => setQuickViewCostume(null)}
          onViewDeepDetails={onSelectCostume}
        />

      </div>
    </div>
  );
};
