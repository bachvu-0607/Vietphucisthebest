import React, { useState, useMemo } from 'react';
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

interface AoDaiRecommenderProps {
  onStartRemix: (costume: Costume, preset?: Partial<FittingDraft>) => void;
  aoDaiCostume?: Costume;
}

export type OccasionKey = 'tet' | 'wedding' | 'yearbook' | 'street' | 'temple';
export type WeatherKey = 'hot' | 'mild' | 'cold' | 'rainy';
export type VibeKey = 'traditional' | 'elegant' | 'minimal' | 'vintage' | 'genz' | 'contemporary' | 'streetwear';

interface StyleLookbookItem {
  id: VibeKey;
  name: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  photoCredit: string;
  licenseText: string;
  topDesc: string;
  bottomDesc: string;
  accDesc: string;
  culturalNote: string;
  factBite: string;
  safetyLevel: 'PRESERVE' | 'CAUTION' | 'SAFE';
  safetyLabel: string;
  safetyTip: string;
  recommendedHex: string;
  recommendedTrouserHex: string;
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

  // 7 Verified Style Lookbook Presets
  const styleMatrix: Record<VibeKey, StyleLookbookItem> = {
    traditional: {
      id: 'traditional',
      name: 'Truyền Thống Chuẩn Mực',
      subtitle: 'Thướt tha, trang trọng, đậm cốt cách Việt',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/%C3%81o_d%C3%A0i_%286405924827%29.jpg',
      imageAlt: 'Thiếu nữ bên hoa sen trong tà Áo dài truyền thống',
      photoCredit: 'Trần Hải Nam (Flickr: trunghainam)',
      licenseText: 'CC BY 2.0 (Wikimedia Commons)',
      topDesc: 'Áo dài lụa tơ tằm Vạn Phúc cổ đứng 3cm, tay dài ôm raglan, tà dài chấm mắt cá',
      bottomDesc: 'Quần lụa trắng hoặc đen ống suông rộng chạm đất',
      accDesc: 'Nón lá bài thơ quai lụa + Kiềng bạc chạm hoa cúc + Guốc mộc quai nhung',
      culturalNote: 'Chuẩn mực di sản ngàn đời của phụ nữ Việt, trang nhã tuyệt đối trước gia tiên và nghi lễ.',
      factBite: 'Chiếc áo dài hai tà xẻ sườn là sự giao thoa mỹ học giữa triều Nguyễn và trường Mỹ thuật Đông Dương thập niên 1930.',
      safetyLevel: 'PRESERVE',
      safetyLabel: '✓ Chuẩn mực di sản tuyệt đối',
      safetyTip: 'Bắt buộc mặc cùng quần dài suông; tà áo phủ qua gối chạm mu bàn chân.',
      recommendedHex: '#C92A2A', // Đỏ son
      recommendedTrouserHex: '#D97706' // Vàng đồng
    },
    elegant: {
      id: 'elegant',
      name: 'Quý Phái & Trưởng Thành',
      subtitle: 'Nét kiêu sa, đài các của quý cô dự tiệc',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/%C3%81o_d%C3%A0i_Saigon_1960.jpg',
      imageAlt: 'Áo dài Sài Gòn 1960 thanh lịch quý phái',
      photoCredit: 'Vietcuongdao (Wikimedia Commons)',
      licenseText: 'CC BY-SA 4.0',
      topDesc: 'Áo dài nhung the hoặc gấm lụa thêu hoa, cổ thuyền tôn xương quai xanh',
      bottomDesc: 'Quần lụa Tây Thi ống rộng đen tuyền hoặc be ngà',
      accDesc: 'Chuỗi ngọc trai tự nhiên + Túi cầm tay (clutch) thêu hoa + Giày gót nhọn',
      culturalNote: 'Kế thừa phong cách Áo dài Cổ Thuyền do bà Trần Lệ Xuân khởi xướng năm 1958.',
      factBite: 'Biến thể cổ thuyền năm 1958 từng gây sốt vì giải phóng sự gò bó của vùng cổ, mở ra kỷ nguyên thời trang hiện đại.',
      safetyLevel: 'SAFE',
      safetyLabel: '✓ Thanh lịch & Hợp chuẩn dạ tiệc',
      safetyTip: 'Cổ khoét thuyền nhẹ nhàng, không xẻ ngực sâu để giữ nét quý phái.',
      recommendedHex: '#0F766E', // Xanh cổ vịt
      recommendedTrouserHex: '#FAF5FF' // Be ngọc trai
    },
    minimal: {
      id: 'minimal',
      name: 'Tối Giản Đương Đại',
      subtitle: 'Trơn mờ, thuần khiết, thanh thoát nhẹ nhàng',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Highschool_students_in_ao_dai.jpg',
      imageAlt: 'Áo dài trắng thanh thuần',
      photoCredit: 'User Tieumocquan (Wikimedia Commons)',
      licenseText: 'CC0 Public Domain',
      topDesc: 'Áo dài đũi tơ hoặc lanh lụa trơn một màu, cổ đứng thanh mảnh, phom suông nhẹ',
      bottomDesc: 'Quần đũi tơ tệp màu áo hoặc quần lụa đen tối giản',
      accDesc: 'Khuyên tai bạc điêu khắc hình học + Túi da trơn phom hộp + Sandal quai mảnh',
      culturalNote: 'Phù hợp người yêu thích lối sống tối giản (Minimalism) nhưng vẫn giữ hồn cốt áo dài.',
      factBite: 'Lược bỏ toàn bộ hạt cườm hay hoa văn sặc sỡ, vẻ đẹp của áo dài tối giản đến từ độ rủ tự nhiên của tơ lụa.',
      safetyLevel: 'SAFE',
      safetyLabel: '✓ Thuần khiết & Duyên dáng',
      safetyTip: 'Vải trơn cần chọn chất liệu có độ rủ tốt để tránh bị phồng cứng mất dáng.',
      recommendedHex: '#F5F5F4', // Trắng giấy
      recommendedTrouserHex: '#1C1917' // Đen tuyền
    },
    vintage: {
      id: 'vintage',
      name: 'Sài Gòn Retro 1968',
      subtitle: 'Hơi thở thanh xuân rực rỡ thập niên 60-70',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Female_students_wearing_%C3%A1o_d%C3%A0i_%28cropped%29.jpg',
      imageAlt: 'Áo dài hoa Sài Gòn vintage',
      photoCredit: 'Hoàng Duy Khang (Flickr/Wikimedia)',
      licenseText: 'CC BY 2.0',
      topDesc: 'Áo dài hoa nhí hoặc chấm bi phom Raglan Đakao, eo chít con kiến tôn ngực',
      bottomDesc: 'Quần lụa đen ống rộng patte hơi vẩy nhẹ',
      accDesc: 'Băng đô tóc retro vải hoa cùng tone + Kính mắt mèo + Guốc gỗ gót cong',
      culturalNote: 'Dấu ấn rực rỡ của thời trang Sài Gòn trước 1975, tươi vui và đầy sức sống thanh xuân.',
      factBite: 'Kỹ thuật tay Raglan do nhà may Dũng ở Đakao sáng chế năm 1958 đã giải quyết triệt để vết nhăn nhúm ở nách áo.',
      safetyLevel: 'SAFE',
      safetyLabel: '✦ Dấu ấn hoài niệm 1960s',
      safetyTip: 'Phom chít eo khá ôm, nên chọn vải có độ co giãn nhẹ để dễ thở.',
      recommendedHex: '#D97706', // Vàng mù tạt
      recommendedTrouserHex: '#18181B' // Quần đen
    },
    genz: {
      id: 'genz',
      name: 'Gen Z Phá Cách',
      subtitle: 'Tà lửng, tay bồng, năng động dạo phố',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Female_students_wearing_%C3%A1o_d%C3%A0i.jpg',
      imageAlt: 'Áo dài cách tân hoa tươi trẻ',
      photoCredit: 'Hoàng Duy Khang (Wikimedia Commons)',
      licenseText: 'CC BY 2.0',
      topDesc: 'Áo dài gấm xốp tà lửng ngang bắp chân, tay bồng nhẹ tiểu thư, cổ tròn thoáng',
      bottomDesc: 'Quần lụa ống lửng hoặc chân váy xòe xếp ly nhẹ nhàng',
      accDesc: 'Giày Mary Jane đế bệt hoặc Sneaker trắng + Kẹp tóc ruy băng lụa + Túi cói mini',
      culturalNote: 'Dành cho thế hệ trẻ dạo phố cà phê cuối tuần, dễ bước đi và ngồi xe máy.',
      factBite: 'Áo dài tà lửng xuất hiện từ trào lưu mini-ao-dai cuối thập niên 60 và bùng nổ mạnh mẽ trong thập niên 2010.',
      safetyLevel: 'CAUTION',
      safetyLabel: '✦ Biến thể cách tân trẻ trung',
      safetyTip: 'Thích hợp dạo phố, chụp ảnh cà phê. Không mặc vào các nghi lễ trang nghiêm như viếng đền miếu.',
      recommendedHex: '#10B981', // Xanh bơ pastel
      recommendedTrouserHex: '#FFFFFF' // Quần trắng
    },
    contemporary: {
      id: 'contemporary',
      name: 'Đương Đại Nghệ Thuật',
      subtitle: 'Dập ly, loang màu, giao thoa hội họa',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Ao_Dai.jpg',
      imageAlt: 'Áo dài nghệ thuật đương đại',
      photoCredit: 'Stephen Shephard (Flickr/Wikimedia)',
      licenseText: 'CC BY 2.0',
      topDesc: 'Áo dài tơ dập ly hoặc loang màu ombré, vạt áo nhiều tầng xếp lớp bay bổng',
      bottomDesc: 'Quần lụa ống suông rộng đen mờ xếp nếp',
      accDesc: 'Trang sức bạc thủ công đương đại + Ankle boots da mềm',
      culturalNote: 'Ngôn ngữ thời trang cao cấp (haute couture) giao lưu quốc tế.',
      factBite: 'Kỹ thuật dập ly trên tơ tằm đem lại độ phồng tự nhiên mà không cần khung độn cứng nhắc.',
      safetyLevel: 'SAFE',
      safetyLabel: '✦ Nghệ thuật biểu đạt đương đại',
      safetyTip: 'Tạo cảm giác bay bổng khi di chuyển trong không gian triển lãm nghệ thuật.',
      recommendedHex: '#7C3AED', // Tím thạch anh
      recommendedTrouserHex: '#1F2937' // Xám than
    },
    streetwear: {
      id: 'streetwear',
      name: 'Streetwear Fusion (Nam & Nữ)',
      subtitle: 'Áo dài vạt ngắn kết hợp phong cách đường phố',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/%C3%81o_d%C3%A0i_%26_kh%C4%83n_%C4%91%C3%B3ng2.jpg',
      imageAlt: 'Áo dài nam truyền thống phối hợp phong cách',
      photoCredit: 'Phan Ba (Wikimedia Commons)',
      licenseText: 'CC BY-SA 3.0',
      topDesc: 'Áo dài nam vạt lửng vải linen thô hoặc cotton tơ, cổ đứng khuy ngực chắc chắn',
      bottomDesc: 'Quần âu xếp ly ống rộng (wide-leg trousers) màu xám khói',
      accDesc: 'Giày chunky sneaker + Túi đeo chéo canvas + Kính râm gọng tròn',
      culturalNote: 'Đưa áo dài trở lại đời sống thường nhật của nam giới thế kỷ 21.',
      factBite: 'Trước năm 1945, áo dài ngũ thân là trang phục mặc định mỗi ngày của nam giới từ tri thức đến công sở.',
      safetyLevel: 'CAUTION',
      safetyLabel: '✦ Giao thoa văn hóa đường phố',
      safetyTip: 'Vẫn giữ khuy cài ngay ngắn và quần dài, tránh mặc cùng quần đùi lộ gối.',
      recommendedHex: '#1E293B', // Xanh than navy
      recommendedTrouserHex: '#475569' // Xám đá
    }
  };

  // 5 Heritage Color Presets
  const heritagePresets = [
    {
      id: 'nu-sinh',
      name: 'Nữ Sinh Hà Thành',
      badge: 'Thuần Khiết',
      topHex: '#FFFFFF',
      trouserHex: '#18181B',
      desc: 'Áo trắng ngọc lụa nõn + Quần lụa đen tuyền'
    },
    {
      id: 'khai-xuan',
      name: 'Khai Xuân Đắc Lộc',
      badge: 'Tết May Mắn',
      topHex: '#C92A2A',
      trouserHex: '#D97706',
      desc: 'Áo đỏ son thêu hoa + Quần lụa vàng đồng'
    },
    {
      id: 'retro-saigon',
      name: 'Sài Gòn 1968',
      badge: 'Vintage',
      topHex: '#D97706',
      trouserHex: '#18181B',
      desc: 'Áo vàng mù tạt hoa nhí + Quần đen ống suông'
    },
    {
      id: 'cung-dinh',
      name: 'Cung Đình Trầm Mặc',
      badge: 'Quý Phái',
      topHex: '#0F766E',
      trouserHex: '#FEF3C7',
      desc: 'Áo xanh cổ vịt gấm hoa + Quần vàng mỡ gà'
    },
    {
      id: 'modern-chic',
      name: 'Modern Chic',
      badge: 'Tối Giản',
      topHex: '#18181B',
      trouserHex: '#64748B',
      desc: 'Áo đen tuyền nhung mờ + Quần xám khói'
    }
  ];

  // Dynamic Weather Impact Rules
  const weatherRecommendation = useMemo(() => {
    switch (selectedWeather) {
      case 'hot':
        return {
          title: 'Thời tiết Nắng Nóng (> 30°C)',
          tag: '☀️ Ưu tiên thoáng mát',
          fabricTip: 'Khuyên dùng: Lụa tơ tằm dệt thưa, Đũi tơ, Voan cát mềm. Tránh nhung dày, gấm xốp ép.',
          cutTip: 'Cổ đứng thấp 2cm hoặc cổ tròn, tay lỡ 3/4 nhẹ nhàng.'
        };
      case 'cold':
        return {
          title: 'Thời tiết Se Lạnh (< 18°C)',
          tag: '❄️ Giữ ấm thanh lịch',
          fabricTip: 'Khuyên dùng: Nhung tuyết cao cấp, Gấm dệt chỉ vàng, Lụa trần bông nhẹ.',
          cutTip: 'Khoác thêm áo măng tô dạ dáng dài hoặc choàng khăn len cashmere màu tương phản.'
        };
      case 'rainy':
        return {
          title: 'Thời tiết Mưa & Ẩm',
          tag: '🌧️ Chống vấy bẩn',
          fabricTip: 'Khuyên dùng: Lụa nhân tạo mau khô, phối Quần lụa đen tối màu để tránh bùn bẩn.',
          cutTip: 'Nên chọn tà áo lửng cách tân hoặc nâng gấu áo cách đất khi di chuyển.'
        };
      default:
        return {
          title: 'Thời tiết Mát Mẻ (20°C - 28°C)',
          tag: '🍃 Thời tiết lý tưởng nhất',
          fabricTip: 'Phù hợp với 100% các loại chất liệu: Lụa Vạn Phúc, Gấm hoa, Tơ sống, Lãnh Mỹ A.',
          cutTip: 'Phô diễn trọn vẹn tà áo dài truyền thống thướt tha chạm mắt cá chân.'
        };
    }
  }, [selectedWeather]);

  // Dynamic Occasion Guidance
  const occasionGuidance = useMemo(() => {
    switch (selectedOccasion) {
      case 'temple':
        return {
          name: 'Đi Lễ Chùa & Nghi Lễ',
          badge: 'Trang nghiêm',
          note: 'Bắt buộc chọn cổ đứng cao kín đáo, tay dài, tuyệt đối không mặc áo không tay hoặc tà quá ngắn.',
          isStrict: true
        };
      case 'wedding':
        return {
          name: 'Lễ Cưới & Gia Tiên',
          badge: 'Hỷ sự long trọng',
          note: 'Sắc đỏ son hoặc trắng kem thanh tao, phối kiềng bạc hoặc khăn vấn để tôn vẻ đẹp ngày trọng đại.',
          isStrict: false
        };
      case 'yearbook':
        return {
          name: 'Kỷ Yếu & Tốt Nghiệp',
          badge: 'Tuổi thanh xuân',
          note: 'Màu trắng ngọc kinh điển phối quần đen hoặc quần trắng, kết hợp nón lá hoặc bó hoa cúc họa mi.',
          isStrict: false
        };
      case 'street':
        return {
          name: 'Dạo Phố & Cà Phê',
          badge: 'Trẻ trung tự do',
          note: 'Thoải mái thử nghiệm các biến thể tà lửng, tay phồng, phối cùng giày búp bê, sneaker hoặc túi cói.',
          isStrict: false
        };
      default:
        return {
          name: 'Tết & Du Xuân',
          badge: 'Đón tân niên may mắn',
          note: 'Sắc màu rực rỡ (Đỏ, Vàng, Xanh lá non), mang lại hỷ khí và tài lộc khi chúc Tết họ hàng.',
          isStrict: false
        };
    }
  }, [selectedOccasion]);

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
      <div className="bg-gradient-to-r from-[#FAF7F2] via-[#F4EFEA] to-[#FAF7F2] border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 opacity-10 pointer-events-none">
          <TrienSonSeal text="Áo Dài" size="lg" />
        </div>

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9B2C2C]/10 border border-[#9B2C2C]/20 text-[#9B2C2C] text-xs font-serif font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Việt Phục Remix Engine • Cỗ Máy Gợi Ý Áo Dài</span>
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
        <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl p-4.5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
            <span className="text-xs font-serif font-bold text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#9B2C2C] text-white flex items-center justify-center text-[10px]">1</span>
              Dịp Bạn Tham Gia?
            </span>
            <span className="text-[10px] text-[#9B2C2C] font-semibold">{occasionGuidance.badge}</span>
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
                    ? 'bg-[#9B2C2C] text-white font-medium shadow-xs'
                    : 'bg-[#FAF7F2] hover:bg-[#F0EBE3] text-[#44403C]'
                }`}
              >
                <span>{occ.label}</span>
                {selectedOccasion === occ.id && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Thời tiết thế nào? */}
        <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl p-4.5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
            <span className="text-xs font-serif font-bold text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#9B2C2C] text-white flex items-center justify-center text-[10px]">2</span>
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
                      ? 'bg-[#9B2C2C]/10 border-[#9B2C2C] text-[#9B2C2C] font-semibold'
                      : 'bg-[#FAF7F2] border-[#E8E2D8] hover:bg-[#F5EFEA] text-[#57534E]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-[#9B2C2C]' : w.color}`} />
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#9B2C2C]" />}
                  </div>
                  <span className="text-xs font-medium">{w.label}</span>
                  <span className="text-[10px] text-[#A8A29E] font-light">{w.sub}</span>
                </button>
              );
            })}
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] text-[11px] text-[#78716C] leading-relaxed">
            <span className="font-semibold text-[#1C1917]">Khuyên dùng: </span>
            {weatherRecommendation.fabricTip}
          </div>
        </div>

        {/* Step 3: Gu của bạn là gì? */}
        <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl p-4.5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
            <span className="text-xs font-serif font-bold text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#9B2C2C] text-white flex items-center justify-center text-[10px]">3</span>
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
                    : 'bg-[#FAF7F2] hover:bg-[#F0EBE3] text-[#44403C]'
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
      <div className="bg-[#FFFFFF] border-2 border-[#E8E2D8] rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Visual Verified Lookbook Photo */}
        <div className="lg:col-span-5 relative group">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8E2D8] shadow-md">
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
              {activeVibe.photoCredit} • {activeVibe.licenseText}
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
          <div className="space-y-3 bg-[#FAF7F2] p-4.5 rounded-xl border border-[#E8E2D8]">
            <span className="text-xs font-serif font-bold text-[#9B2C2C] uppercase tracking-wider block">
              ✦ Công thức phối đồ đề xuất:
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#9B2C2C]/10 text-[#9B2C2C] font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
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
              className="inline-flex items-center gap-1.5 text-xs text-[#9B2C2C] hover:text-[#782020] font-medium transition-colors"
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
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#9B2C2C] hover:bg-[#832424] text-[#FAF7F2] font-medium text-sm tracking-wide shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Layers className="w-4 h-4" />
              <span>Mở Trong Phối Thử Studio 2D</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5 Heritage Color Presets: 1-Chạm Đổi Phong Cách */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE3]">
          <div>
            <h3 className="text-sm sm:text-base font-serif font-bold text-[#1C1917] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#9B2C2C]" />
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
                    ? 'bg-[#9B2C2C]/5 border-[#9B2C2C] shadow-xs'
                    : 'bg-[#FAF7F2] border-[#E8E2D8] hover:bg-[#F5EFEA]'
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
