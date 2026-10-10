// Editorial styling suggestions for contemporary use; not period reconstructions.
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

export const styleMatrix: Record<VibeKey, StyleLookbookItem> = {
    traditional: {
      id: 'traditional',
      name: 'Phong cách truyền thống',
      subtitle: 'Thướt tha, trang trọng, đậm cốt cách Việt',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/%C3%81o_d%C3%A0i_%286405924827%29.jpg',
      imageAlt: 'Thiếu nữ bên hoa sen trong tà Áo dài truyền thống',
      photoCredit: 'Trần Hải Nam (Flickr: trunghainam)',
      licenseText: 'CC BY 2.0 (Wikimedia Commons)',
      topDesc: 'Áo dài cổ đứng, tay dài, thân ôm vừa; chọn độ dài tà và độ rủ của vải theo vóc dáng',
      bottomDesc: 'Quần trắng hoặc đen ống suông, gấu không quét đất',
      accDesc: 'Nón lá bài thơ quai lụa + Kiềng bạc chạm hoa cúc + Guốc mộc quai nhung',
      culturalNote: 'Gợi ý phối áo dài hiện đại cho dịp trang trọng; điều chỉnh theo yêu cầu của gia đình và nơi tổ chức.',
      factBite: 'Áo dài hiện đại trải qua nhiều thay đổi trong thế kỷ XX; mẫu hai tà này không mặc định có kết cấu ngũ thân.',
      safetyLevel: 'PRESERVE',
      safetyLabel: '✓ Gợi ý phong cách truyền thống',
      safetyTip: 'Nên phối quần dài khi dự lễ; chọn độ dài tà đủ để bước đi và tránh vấp.',
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
      culturalNote: 'Gợi ý áo dài cổ thuyền kết hợp phụ kiện dạ tiệc hiện nay.',
      factBite: 'Cổ thuyền là một biến thể thiết kế áo dài hiện đại; danh mục chưa xác minh riêng niên đại và tác giả của kiểu cổ này.',
      safetyLevel: 'SAFE',
      safetyLabel: '✓ Gợi ý phối dạ tiệc',
      safetyTip: 'Chọn độ mở cổ và lớp trong phù hợp buổi tiệc; kiểm tra độ che phủ khi cúi, ngồi và giơ tay.',
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
      name: 'Sài Gòn Retro 60–70',
      subtitle: 'Hơi thở thanh xuân rực rỡ thập niên 60-70',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Female_students_wearing_%C3%A1o_d%C3%A0i_%28cropped%29.jpg',
      imageAlt: 'Áo dài hoa Sài Gòn vintage',
      photoCredit: 'Hoàng Duy Khang (Flickr/Wikimedia)',
      licenseText: 'CC BY 2.0',
      topDesc: 'Áo dài hoa nhí hoặc chấm bi, tay raglan, thân ôm vừa theo số đo',
      bottomDesc: 'Quần lụa đen ống rộng patte hơi vẩy nhẹ',
      accDesc: 'Băng đô tóc retro vải hoa cùng tone + Kính mắt mèo + Guốc gỗ gót cong',
      culturalNote: 'Gợi ý phối hiện nay lấy cảm hứng từ thời trang Sài Gòn thập niên 1960–1970; không phải bản phục dựng đã xác minh.',
      factBite: 'Tay raglan có đường ráp từ cổ xuống nách; vẻ đẹp và độ vừa vặn còn phụ thuộc cách cắt may, không chỉ tên kiểu tay.',
      safetyLevel: 'SAFE',
      safetyLabel: '✦ Dấu ấn hoài niệm 1960s',
      safetyTip: 'Thân áo có thể ôm vừa nhưng không siết eo hoặc kéo căng đường may; thử ngồi và nâng tay trước khi chọn độ ôm.',
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
      culturalNote: 'Gợi ý phối cho dạo phố, cà phê hoặc chụp ảnh; kiểm tra tà áo không mắc vào phương tiện khi di chuyển.',
      factBite: 'Tà lửng và tay bồng ở đây là gợi ý cách tân; không dùng làm mẫu phục dựng một giai đoạn lịch sử.',
      safetyLevel: 'CAUTION',
      safetyLabel: '✦ Biến thể cách tân trẻ trung',
      safetyTip: 'Thích hợp dạo phố, chụp ảnh cà phê. Khi đi lễ, chọn độ dài và độ kín phù hợp quy định nơi đến.',
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
      culturalNote: 'Gợi ý thử nghiệm màu loang, nếp gấp và lớp vạt trong thiết kế hiện nay.',
      factBite: 'Hiệu ứng dập ly và độ rủ phụ thuộc cấu trúc vải; nên kiểm tra khả năng giữ nếp của chất liệu thực tế.',
      safetyLevel: 'SAFE',
      safetyLabel: '✦ Nghệ thuật biểu đạt đương đại',
      safetyTip: 'Kiểm tra các lớp vạt không mắc vào giày, ghế hoặc phụ kiện khi di chuyển.',
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
      factBite: 'Ngũ thân từng phổ biến trong xã hội thời Nguyễn; cách mặc khác nhau theo vùng, nghề nghiệp và hoàn cảnh.',
      safetyLevel: 'CAUTION',
      safetyLabel: '✦ Giao thoa văn hóa đường phố',
      safetyTip: 'Chọn phần mặc dưới phù hợp độ mở hai tà; khi dự lễ hoặc vào di tích, theo nội quy nơi đến.',
      recommendedHex: '#1E293B', // Xanh than navy
      recommendedTrouserHex: '#475569' // Xám đá
    }
  };

export const heritagePresets = [
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
      name: 'Cảm hứng Sài Gòn 60–70',
      badge: 'Vintage',
      topHex: '#D97706',
      trouserHex: '#18181B',
      desc: 'Áo vàng mù tạt hoa nhí + Quần đen ống suông'
    },
    {
      id: 'cung-dinh',
      name: 'Cảm hứng màu cung đình',
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

export const weatherGuidance = {
hot: {
          title: 'Thời tiết Nắng Nóng (> 30°C)',
          tag: '☀️ Ưu tiên thoáng mát',
          fabricTip: 'Ưu tiên vải mỏng, nhẹ và thoáng; kiểm tra độ xuyên thấu cùng lớp trong. Độ thoáng phụ thuộc kiểu dệt và độ dày, không chỉ tên chất liệu.',
          cutTip: 'Có thể chọn cổ thấp, cổ tròn hoặc tay lỡ cho áo dài hiện đại; điều chỉnh độ vừa để cử động thoải mái.'
        },
cold: {
          title: 'Thời tiết Se Lạnh (< 18°C)',
          tag: '❄️ Giữ ấm thanh lịch',
          fabricTip: 'Chọn vải dày hơn hoặc thêm lớp mặc trong, áo khoác; không mặc định gấm dệt chỉ vàng giữ ấm tốt hơn các loại vải khác.',
          cutTip: 'Khoác thêm áo măng tô dạ dáng dài hoặc choàng khăn len cashmere màu tương phản.'
        },
rainy: {
          title: 'Thời tiết Mưa & Ẩm',
          tag: '🌧️ Chống vấy bẩn',
          fabricTip: 'Chọn vải dễ chăm sóc và kiểm tra hướng dẫn giặt, khả năng khô của mẫu thực tế; quần tối màu chỉ giúp vết bẩn ít nổi bật hơn.',
          cutTip: 'Nên chọn tà áo lửng cách tân hoặc nâng gấu áo cách đất khi di chuyển.'
        },
mild: {
          title: 'Thời tiết Mát Mẻ (20°C - 28°C)',
          tag: '🍃 Linh hoạt chọn chất liệu',
          fabricTip: 'Có thể chọn lụa, gấm hoặc đũi theo độ dày, độ rủ và hoạt động; nhiệt độ chỉ là một yếu tố.',
          cutTip: 'Có thể giữ tà dài nếu không vướng; chọn độ dài theo vóc dáng, giày và hoạt động.'
        }
} satisfies Record<WeatherKey, { title: string; tag: string; fabricTip: string; cutTip: string }>;

export const occasionGuidanceByKey = {
temple: {
          name: 'Đi Lễ Chùa & Nghi Lễ',
          badge: 'Trang nghiêm',
          note: 'Ưu tiên trang phục kín đáo, thuận tiện di chuyển; xem quy định cụ thể của chùa, đền hoặc nơi tổ chức nghi lễ.',
          isStrict: true
        },
wedding: {
          name: 'Lễ Cưới & Gia Tiên',
          badge: 'Hỷ sự long trọng',
          note: 'Sắc đỏ son hoặc trắng kem thanh tao, phối kiềng bạc hoặc khăn vấn để tôn vẻ đẹp ngày trọng đại.',
          isStrict: false
        },
yearbook: {
          name: 'Kỷ Yếu & Tốt Nghiệp',
          badge: 'Tuổi thanh xuân',
          note: 'Màu trắng ngọc kinh điển phối quần đen hoặc quần trắng, kết hợp nón lá hoặc bó hoa cúc họa mi.',
          isStrict: false
        },
street: {
          name: 'Dạo Phố & Cà Phê',
          badge: 'Trẻ trung tự do',
          note: 'Thoải mái thử nghiệm các biến thể tà lửng, tay phồng, phối cùng giày búp bê, sneaker hoặc túi cói.',
          isStrict: false
        },
tet: {
          name: 'Tết & Du Xuân',
          badge: 'Đón tân niên may mắn',
          note: 'Có thể thử đỏ, vàng hoặc xanh lá để gợi sắc xuân; màu sắc là lựa chọn phối đồ, không quyết định may mắn.',
          isStrict: false
        }
} satisfies Record<OccasionKey, { name: string; badge: string; note: string; isStrict: boolean }>;
