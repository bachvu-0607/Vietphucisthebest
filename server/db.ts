import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface EventItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon: string;
  description: string;
  recommendedDressCode: string;
  badge: string;
  imageUrl?: string;
  formalityLevel?: string;
  seasonWeather?: string;
}

export interface CostumeComponent {
  id: string;
  name: string;
  layerOrder: number; // 1: Model, 2: Inner, 3: Main body, 4: Outer, 5: Headwear/Hair, 6: Accessories, 7: Footwear
  isRequired: boolean;
  type: 'inner' | 'main' | 'outer' | 'headwear' | 'accessory' | 'footwear';
  description: string;
  defaultColor: string;
}

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  meaning: string;
  popularity: string;
}

export interface MaterialOption {
  id: string;
  name: string;
  textureType: string;
  origin: string;
  description: string;
}

export interface AccessoryOption {
  id: string;
  name: string;
  category: 'headwear' | 'jewelry' | 'handheld' | 'waist' | 'footwear';
  layerOrder: number;
  description: string;
  traditionalMeaning: string;
  isRecommended: boolean;
}

export interface DetailOption {
  id: string;
  name: string;
  type: 'collar' | 'sleeve' | 'button' | 'hem';
  description: string;
}

export interface BackgroundSetting {
  id: string;
  name: string;
  description: string;
  aesthetic: string;
  promptDescription: string;
}

export interface StylingGuide {
  accessories: string[];
  hairstyles: string[];
  footwear: string[];
  recommendedColors: string[];
  materialsAndMotifs: string[];
  traditionalStyling: string;
  modernRemixAdvice: string;
  avoidCombinations: string[];
}

export interface SuitabilityMapping {
  eventId: string;
  score: number; // 1 - 100
  label: 'Hoàn hảo' | 'Rất phù hợp' | 'Phù hợp' | 'Cách tân độc đáo';
  reason: string;
}

export interface Costume {
  id: string;
  name: string;
  slug: string;
  era: string; // Triều Nguyễn, Triều Lê, Triều Lý - Trần, etc.
  region: string; // Bắc Bộ, Trung Bộ (Cố đô Huế), Nam Bộ, Toàn quốc
  gender: 'male' | 'female' | 'unisex';
  formality: 'ceremonial' | 'formal' | 'casual_refined' | 'everyday';
  coverImage: string;
  lineageCategory?: 'giao-linh' | 'vien-linh' | 'lap-linh' | 'dich-chuyen';
  lineageSubcategory?: 'ao-tac' | 'tay-chen' | 'nhat-binh' | 'tu-than' | 'ba-ba' | 'giao-linh' | 'vien-linh';
  lineageLabel?: string;
  shortDescription: string;
  historicalContext: string;
  culturalSignificance: string;
  isVerifiedHistoricalData: boolean; // Flag to indicate verified vs sample editorial data
  verificationNote: string;
  components: CostumeComponent[];
  colorVariants: ColorVariant[];
  materials: MaterialOption[];
  accessories: AccessoryOption[];
  details: DetailOption[];
  suitability: SuitabilityMapping[];
  usageConsiderations: string[];
  stylingGuide: StylingGuide;
}

export interface FittingDraft {
  id: string;
  title: string;
  eventId: string;
  costumeId: string;
  modelGender: 'male' | 'female';
  modelPose: string;
  selectedColorId: string;
  selectedMaterialId: string;
  selectedAccessories: string[];
  selectedHairstyle: string;
  selectedFootwear: string;
  selectedDetails: Record<string, string>;
  selectedBackgroundId: string;
  remixStyle: 'traditional' | 'subtle_modern' | 'remix_fusion';
  customPrompt: string;
  visibleLayers: Record<string, boolean>;
  sketchDataUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIJob {
  id: string;
  draftId?: string;
  status: 'draft' | 'queued' | 'processing' | 'completed' | 'failed';
  costumeId: string;
  costumeName: string;
  eventName: string;
  remixStyle: string;
  sketchDataUrl: string;
  resultImageUrl?: string;
  promptUsed: string;
  errorMessage?: string;
  progress: number; // 0 - 100
  createdAt: string;
  completedAt?: string;
}

// Initial Seeding Data
export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-tet',
    name: 'Tết & Du Xuân',
    slug: 'tet-du-xuan',
    category: 'seasonal',
    icon: 'Sparkles',
    description: 'Chào đón năm mới, viếng đền chùa linh thiêng và chụp ảnh phố xuân ấm áp sum vầy.',
    recommendedDressCode: 'Áo Tấc tươi sáng, Áo Ngũ Thân tay chẽn hoặc Áo Dài cổ phục thanh tao.',
    badge: 'Phổ biến nhất',
    imageUrl: '/assets/events/tet-du-xuan.jpg',
    formalityLevel: 'Trang trọng & Hân hoan lễ hội',
    seasonWeather: 'Mùa Xuân • Se lạnh hoặc mát mẻ (18°C - 24°C)'
  },
  {
    id: 'evt-wedding',
    name: 'Lễ Cưới - Hôn Lễ Cổ Truyền',
    slug: 'le-cuoi-co-truyen',
    category: 'life_milestone',
    icon: 'HeartHandshake',
    description: 'Nghi thức dạm ngõ, rước dâu, lễ thành hôn gia tiên tôn vinh nét đẹp văn hóa gia đình Việt.',
    recommendedDressCode: 'Áo Nhật Bình sắc đỏ/hoàng yến cho cô dâu, Áo Tấc hoặc Áo Ngũ Thân lục/xanh thẫm cho chú rể.',
    badge: 'Nghi lễ đặc biệt',
    imageUrl: '/assets/events/le-cuoi.jpg',
    formalityLevel: 'Trang nghiêm tối thượng gia tiên',
    seasonWeather: 'Quanh năm • Không gian trong nhà & ngoài trời'
  },
  {
    id: 'evt-formal',
    name: 'Sự Kiện Ngoại Giao - Trang Trọng',
    slug: 'su-kien-trang-trong',
    category: 'state_formal',
    icon: 'Award',
    description: 'Gặp gỡ quốc tế, hội nghị ngoại giao văn hóa, quốc yến và tiếp đãi quan khách danh dự.',
    recommendedDressCode: 'Áo Tấc chuẩn quy chế triều Nguyễn, may bằng gấm thượng hạng, khăn đóng chỉnh tề.',
    badge: 'Đẳng cấp quốc phục',
    imageUrl: '/assets/events/ngoai-giao.jpg',
    formalityLevel: 'Quốc lễ & Ngoại giao đỉnh cao',
    seasonWeather: 'Quanh năm • Hội trường & Sảnh khánh tiết máy lạnh'
  },
  {
    id: 'evt-art',
    name: 'Biểu Diễn Nghệ Thuật & Sân Khấu',
    slug: 'bieu-dien-nghe-thuat',
    category: 'performance',
    icon: 'Drama',
    description: 'Trình diễn nhã nhạc, ca trù, chèo, tuồng, múa cổ hoặc các liên hoan âm nhạc dân tộc.',
    recommendedDressCode: 'Trang phục hoa văn thêu tinh xảo, tà áo bay bổng, phụ kiện nổi bật trên sân khấu.',
    badge: 'Nghệ thuật thính phòng',
    imageUrl: '/assets/events/bieu-dien.jpg',
    formalityLevel: 'Trang trọng & Bay bổng nghệ thuật',
    seasonWeather: 'Quanh năm • Ánh sáng sân khấu biểu diễn'
  },
  {
    id: 'evt-festival',
    name: 'Lễ Hội Truyền Thống Khác',
    slug: 'le-hoi-truyen-thong',
    category: 'cultural',
    icon: 'Landmark',
    description: 'Tham dự hội đền Hùng, hội Gióng, hội Lim, các lễ hội dân gian và nghi thức cung đình.',
    recommendedDressCode: 'Áo Giao Lĩnh, Áo Đối Khâm, Áo Tấc trang nghiêm đúng lễ tiết phụng tự.',
    badge: 'Lễ hội dân gian',
    imageUrl: '/assets/events/hoi-truyen-thong.jpg',
    formalityLevel: 'Tôn nghiêm đình đền miếu mạo',
    seasonWeather: 'Mùa Xuân - Thu • Tiết trời khô ráo ngoài trời'
  },
  {
    id: 'evt-yearbook',
    name: 'Chụp Ảnh Kỷ Yếu & Tốt Nghiệp',
    slug: 'chup-anh-ky-yeu',
    category: 'academic',
    icon: 'GraduationCap',
    description: 'Lưu giữ khoảnh khắc thanh xuân rực rỡ bên bạn bè tại Văn Miếu, Hoàng thành hay trường học.',
    recommendedDressCode: 'Áo Tấc ngũ thân tay thụng, Áo Ngũ Thân chẽn tay tone màu nhã nhặn hoài niệm.',
    badge: 'Thanh xuân học đường',
    imageUrl: '/assets/events/ky-yeu.jpg',
    formalityLevel: 'Thanh lịch & Hoài niệm học trò',
    seasonWeather: 'Mùa Thu - Hè • Ban ngày nắng nhẹ di tích cổ'
  },
  {
    id: 'evt-street',
    name: 'Dạo Phố & Việt Phục Cách Tân',
    slug: 'dao-pho-cach-tan',
    category: 'lifestyle',
    icon: 'Compass',
    description: 'Cà phê cuối tuần, triển lãm bảo tàng, phong cách thường nhật kết hợp phụ kiện hiện đại trẻ trung.',
    recommendedDressCode: 'Áo Ngũ Thân chẽn vạt ngắn, phối cùng quần suông, giày sneaker hoặc túi tote hiện đại.',
    badge: 'Xu hướng mới',
    imageUrl: '/assets/events/cach-tan.jpg',
    formalityLevel: 'Năng động & Trẻ trung thường nhật',
    seasonWeather: 'Thời tiết mát mẻ cuối tuần dạo phố'
  }
];

export const INITIAL_COSTUMES: Costume[] = [
  {
    id: 'cos-nhat-binh',
    name: 'Áo Nhật Bình',
    slug: 'ao-nhat-binh',
    era: 'Triều Nguyễn (1802 - 1945)',
    region: 'Cố đô Huế (Trung Bộ)',
    gender: 'female',
    formality: 'ceremonial',
    coverImage: '/assets/costumes/ao-nhat-binh-cong-chua.jpg',
    lineageCategory: 'dich-chuyen',
    lineageSubcategory: 'nhat-binh',
    lineageLabel: 'Hệ Dịch Chuyển • Lễ phục cung đình nữ',
    shortDescription: 'Thường phục trang trọng của bậc Hậu phi, Công chúa và Cung tần triều Nguyễn, nổi bật với cổ áo hình chữ nhật viền hoa văn tinh xảo.',
    historicalContext: 'Áo Nhật Bình có nguồn gốc từ áo Phi Phong thời nhà Minh, được định chế rõ ràng trong sách Khâm Định Đại Nam Hội Điển Sự Lệ vào năm Gia Long thứ 6 (1807). Tên gọi Nhật Bình bắt nguồn từ đặc trưng cổ áo hình chữ nhật phẳng phía trước ngực.',
    culturalSignificance: 'Biểu trưng cho đỉnh cao thẩm mỹ cung đình triều Nguyễn. Màu sắc áo phản ánh phẩm trật nghiêm ngặt: Hoàng hậu dùng màu vàng chính sắc, Công chúa dùng màu đỏ, Cung tần các bậc dùng sắc tím, thanh thiên hoặc lục.',
    isVerifiedHistoricalData: true,
    verificationNote: 'Tư liệu đối chiếu theo Khâm Định Đại Nam Hội Điển Sự Lệ và hiện vật phục dựng tại Bảo tàng Cổ vật Cung đình Huế.',
    components: [
      { id: 'cmp-nb-model', name: 'Hình thể người mẫu Nữ', layerOrder: 1, isRequired: true, type: 'inner', description: 'Khuôn mặt thanh tú, thần thái đoan trang cung đình', defaultColor: '#f5ebe0' },
      { id: 'cmp-nb-inner', name: 'Áo lót cánh trắng (Lớp trong)', layerOrder: 2, isRequired: true, type: 'inner', description: 'Áo trắng mỏng may sát cổ giữ vẻ kín đáo', defaultColor: '#ffffff' },
      { id: 'cmp-nb-pants', name: 'Quần lụa trắng hoặc ngũ sắc', layerOrder: 2, isRequired: true, type: 'inner', description: 'Quần sa/lụa ống rộng mềm mại', defaultColor: '#faf8f5' },
      { id: 'cmp-nb-main', name: 'Thân áo Nhật Bình chính', layerOrder: 3, isRequired: true, type: 'main', description: 'Thân áo gấm dệt hoa tròn, vạt cài dải cúc ngọc', defaultColor: '#9e1b22' },
      { id: 'cmp-nb-collar', name: 'Cổ áo Nhật Bình chữ nhật', layerOrder: 4, isRequired: true, type: 'main', description: 'Viền cổ chữ nhật thêu ngũ sắc, hồi văn kim tuyến', defaultColor: '#d4af37' },
      { id: 'cmp-nb-sleeves', name: 'Tay áo dải ngũ hành', layerOrder: 4, isRequired: true, type: 'main', description: 'Viền 5 dải màu ngũ hành (xanh, đỏ, vàng, trắng, đen) ở cổ tay', defaultColor: '#c5a059' },
      { id: 'cmp-nb-head', name: 'Khăn vành dây Huế', layerOrder: 5, isRequired: false, type: 'headwear', description: 'Khăn vành dệt sa màu lam, tím hoặc vàng quấn nhiều nếp quanh đầu', defaultColor: '#1d3557' },
      { id: 'cmp-nb-kimboi', name: 'Kim bội / Ngọc bội thắt dải lụa', layerOrder: 6, isRequired: false, type: 'accessory', description: 'Dây ngọc bội đeo trước ngực tạo âm thanh trang nhã khi cử động', defaultColor: '#e9c46a' },
      { id: 'cmp-nb-fan', name: 'Quạt xếp trầm hương vẽ cảnh Huế', layerOrder: 6, isRequired: false, type: 'accessory', description: 'Quạt nan gỗ trầm bọc lụa thanh tao', defaultColor: '#d8b4e2' },
      { id: 'cmp-nb-shoes', name: 'Hài thêu phụng hoàng mũi cong', layerOrder: 7, isRequired: false, type: 'footwear', description: 'Đôi hài mũi vểnh thêu chỉ vàng chỉ bạc cung quyến', defaultColor: '#8a1c14' }
    ],
    colorVariants: [
      { id: 'col-nb-red', name: 'Đỏ son cung đình', hex: '#a61c1c', meaning: 'Tượng trưng cho hỷ sự, tôn nghiêm và phẩm giá Công chúa', popularity: 'Rất chuộng lễ cưới' },
      { id: 'col-nb-ivory', name: 'Trắng ngà lụa bạch', hex: '#FAF7F0', meaning: 'Sắc trắng ngà thuần khiết, thanh thoát, phong cách cách tân cưới hoàng gia hiện đại', popularity: 'Hot cách tân cưới' },
      { id: 'col-nb-pink', name: 'Hồng phấn pastel', hex: '#FBCFE8', meaning: 'Ngọt ngào, tươi trẻ của thiếu nữ đương đại nhưng vẫn giữ trọn nét đài các', popularity: 'Hot chụp ảnh xuân' },
      { id: 'col-nb-yellow', name: 'Hoàng yến quý phái', hex: '#d4af37', meaning: 'Sắc vàng quyền quý, ấm áp và vinh quang', popularity: 'Rất trang trọng' },
      { id: 'col-nb-teal', name: 'Xanh ngọc bích', hex: '#1b6b68', meaning: 'Thanh lịch, điềm tĩnh của bậc cung tần hiền thục', popularity: 'Chụp ảnh xuân' },
      { id: 'col-nb-purple', name: 'Tím hoa cà xứ Huế', hex: '#63326e', meaning: 'Nét trầm mặc, thủy chung của văn hóa sông Hương', popularity: 'Cổ điển đặc sắc' }
    ],
    materials: [
      { id: 'mat-gam-hue', name: 'Gấm dệt tơ tằm cổ điển', textureType: 'damask', origin: 'Vạn Phúc & Huế', description: 'Dệt hoa văn bát bửu ẩn hiện sang trọng' },
      { id: 'mat-lua-to-tam', name: 'Lụa tơ tằm mềm tự nhiên', textureType: 'silk', origin: 'Làng dệt Nha Xá', description: 'Rũ tự nhiên, nhẹ thoáng và mát vào mùa hè' },
      { id: 'mat-sa-nam-nha', name: 'Sa Nam Nhã gấm mỏng', textureType: 'gauze', origin: 'Phục dựng theo mẫu cổ', description: 'Chất liệu xuyên thấu tinh tế mặc vào dịp lễ tiết cung đình' }
    ],
    accessories: [
      { id: 'acc-nb-khanvanh', name: 'Khăn vành dây xanh lam thẫm', category: 'headwear', layerOrder: 5, description: 'Quấn tỉ mỉ theo kỹ thuật cung đình Huế', traditionalMeaning: 'Giữ nếp tóc gọn gàng tôn gương mặt đoan trang', isRecommended: true },
      { id: 'acc-nb-tram', name: 'Trâm bạc cài hoa sen cẩn ngọc', category: 'headwear', layerOrder: 5, description: 'Cài ngang giấu thân trâm sau búi tóc, chỉ để lộ đầu trâm hoa sen cẩn ngọc và chuỗi tua rua buông rủ thanh nhã', traditionalMeaning: 'Bình an, đoan trang và tiết hạnh', isRecommended: true },
      { id: 'acc-nb-kimboi', name: 'Kim bội hoàng gia rủ tua rua đỏ', category: 'jewelry', layerOrder: 6, description: 'Khóa ngọc bội vàng buông dải tua rua đỏ rủ qua vạt áo', traditionalMeaning: 'Phước lộc, quyền quý và thanh khiết', isRecommended: true },
      { id: 'acc-nb-quat-doan-phien', name: 'Quạt đoàn phiến lụa tơ thêu mẫu đơn đính ngọc', category: 'handheld', layerOrder: 6, description: 'Quạt tròn lụa tơ tằm thêu hoa mẫu đơn, chuôi gỗ quý đính hạt ngọc và dải tua rua tơ tằm rủ mềm', traditionalMeaning: 'Đoan trang, viên mãn và phú quý', isRecommended: true },
      { id: 'acc-nb-quat-nan-nga', name: 'Quạt xếp nan ngà chạm lộng thếp vàng', category: 'handheld', layerOrder: 6, description: 'Quạt nan xếp gấp ngà voi chạm khắc hoa văn thủng lộng lẫy, nan quạt dát vàng lá cung đình', traditionalMeaning: 'Đài các, uy quyền chốn hoàng cung', isRecommended: true },
      { id: 'acc-nb-sen', name: 'Búp sen bách diệp hồng tươi', category: 'handheld', layerOrder: 6, description: 'Nâng niu đóa sen hồng Tây Hồ nhiều cánh tỏa hương thanh tao', traditionalMeaning: 'Thuần khiết, thoát tục', isRecommended: false },
      { id: 'acc-nb-hai', name: 'Hài thêu hoa sen mũi nhọn', category: 'footwear', layerOrder: 7, description: 'Đế lót lụa mềm mại truyền thống', traditionalMeaning: 'Bước đi thanh thoát nhẹ nhàng', isRecommended: true }
    ],
    details: [
      { id: 'dtl-nb-cuc', name: 'Khuy ngọc cẩm thạch bọc bạc', type: 'button', description: 'Cài ở vạt trước ngực' },
      { id: 'dtl-nb-vien', name: 'Dải ngũ sắc viền tay áo', type: 'sleeve', description: 'Ngũ hành tương sinh tương khắc' },
      { id: 'dtl-nb-hoa-van', name: 'Họa tiết Bát Bửu triều Nguyễn', type: 'hem', description: 'Tượng trưng cho sự may mắn và trường thọ' }
    ],
    suitability: [
      { eventId: 'evt-wedding', score: 98, label: 'Hoàn hảo', reason: 'Áo Nhật Bình sắc đỏ son hoặc hoàng yến là trang phục cưới danh giá, vừa tôn vinh văn hóa cội nguồn vừa cực kỳ lộng lẫy.' },
      { eventId: 'evt-tet', score: 92, label: 'Rất phù hợp', reason: 'Rực rỡ không khí tân niên, thích hợp chụp ảnh tại di tích, cung điện hoặc chùa cổ đầu năm.' },
      { eventId: 'evt-festival', score: 88, label: 'Rất phù hợp', reason: 'Tham gia các lễ hội truyền thống, đại lễ rước thánh và ngày hội văn hóa cổ phong.' },
      { eventId: 'evt-yearbook', score: 85, label: 'Phù hợp', reason: 'Tạo nên bộ ảnh tốt nghiệp đậm chất cổ phong quý tộc khác biệt với số đông.' },
      { eventId: 'evt-art', score: 90, label: 'Rất phù hợp', reason: 'Họa tiết rực rỡ và dải ngũ sắc bắt đèn sân khấu hoàn hảo.' },
      { eventId: 'evt-street', score: 40, label: 'Cách tân độc đáo', reason: 'Bản gốc khá nặng và trang trọng, chỉ nên mặc phiên bản Nhật Bình vạt ngắn khi dạo phố.' }
    ],
    usageConsiderations: [
      'Cần mặc áo lót kín cổ bên trong; không để lộ áo hiện đại ở phần cổ chữ nhật.',
      'Khi bước đi, nhấc nhẹ vạt trước hoặc bước ngắn khoan thai để giữ dáng áo trang trọng.',
      'Khăn vành dây nên quấn đều tay, từ 7 đến 9 lớp tùy dịp lễ.',
      'Tránh kết hợp với trang sức tây phương kim loại to bản hầm hố.'
    ],
    stylingGuide: {
      accessories: ['Khăn vành sa', 'Kim bội ngọc', 'Trâm cài bạc', 'Quạt lụa cầm tay'],
      hairstyles: ['Búi tóc sau đội khăn vành', 'Búi tóc bánh lái cổ truyền cài trâm'],
      footwear: ['Hài mũi cong thêu hoa', 'Guốc mộc mũi nhung truyền thống'],
      recommendedColors: ['Đỏ thắm kết hợp viền vàng', 'Vàng hoàng yến viền lam', 'Xanh ngọc bích viền ngũ sắc'],
      materialsAndMotifs: ['Gấm tơ tằm dệt hoa tròn', 'Hoa văn Bát Bửu', 'Thêu chim Phượng và mây lành'],
      traditionalStyling: 'Phối chuẩn theo Khâm Định Hội Điển: Áo Nhật Bình thân đỏ hoặc hoàng yến, trong mặc áo cánh trắng, quần lụa trắng, đầu đội khăn vành xanh lam, tay cầm quạt trầm hương.',
      modernRemixAdvice: 'Remix phong cách đương đại: Giữ lại cổ áo hình chữ nhật đặc trưng nhưng rút ngắn thân áo qua hông một chút, phối cùng quần culottes lụa ống suông hoặc chân váy xếp ly đơn sắc.',
      avoidCombinations: [
        'Tránh mặc cùng quần jean bó hoặc đi giày sneaker thể thao thô kệch.',
        'Tránh đeo vòng cổ chocker hiện đại làm rối phần cổ áo chữ nhật thiêng liêng.',
        'Tuyệt đối không xẻ vạt hoặc khoét ngực sâu làm biến dạng form áo cung đình.'
      ]
    }
  },
  {
    id: 'cos-ao-tac',
    name: 'Áo Tấc (Áo Ngũ Thân Tay Thụng)',
    slug: 'ao-tac-tay-thung',
    era: 'Triều Nguyễn (Thế kỷ 19 - 20)',
    region: 'Toàn quốc (Kế thừa từ Cố đô Huế)',
    gender: 'unisex',
    formality: 'formal',
    coverImage: '/assets/costumes/ao-tac-bat-bao.jpeg',
    lineageCategory: 'lap-linh',
    lineageSubcategory: 'ao-tac',
    lineageLabel: 'Áo Lập Lĩnh • Tay rộng (Lễ phục)',
    shortDescription: 'Lễ phục trang trọng của cả nam và nữ thời Nguyễn, có ống tay áo rộng thụng dài một tấc, tượng trưng cho sự đĩnh đạc và lễ độ.',
    historicalContext: 'Áo Tấc là biến thể lễ phục của áo Ngũ Thân, bắt đầu từ cải cách trang phục của chúa Nguyễn Phúc Khoát (1744) và chính thức chuẩn hóa dưới triều vua Minh Mạng (1827). Tên gọi “Tấc” xuất phát từ phần viền tay thụng rộng dài chừng một tấc ta (khoảng 40cm).',
    culturalSignificance: 'Năm thân áo tượng trưng cho tứ thân phụ mẫu (cha mẹ hai bên) và chính người mặc ở giữa. Năm cúc áo đại diện cho Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín) - chuẩn mực đạo đức cốt lõi của người Việt.',
    isVerifiedHistoricalData: true,
    verificationNote: 'Dựa trên sách Đại Nam Thực Lục, nghiên cứu của Hội Cổ phong và các nhà nghiên cứu trang phục Việt Nam.',
    components: [
      { id: 'cmp-at-model', name: 'Người mẫu Nam hoặc Nữ', layerOrder: 1, isRequired: true, type: 'inner', description: 'Tư thế chắp tay hoặc đứng nghiêm trang', defaultColor: '#f7ede2' },
      { id: 'cmp-at-inner', name: 'Áo lót cánh trắng cổ đứng', layerOrder: 2, isRequired: true, type: 'inner', description: 'Áo mỏng lót bên trong giữ cổ đứng ngay ngắn', defaultColor: '#ffffff' },
      { id: 'cmp-at-pants', name: 'Quần lụa trắng ống thụng', layerOrder: 2, isRequired: true, type: 'inner', description: 'Quần lụa dài quét nhẹ gót chân', defaultColor: '#f8f9fa' },
      { id: 'cmp-at-main', name: 'Thân áo Tấc ngũ thân rộng', layerOrder: 3, isRequired: true, type: 'main', description: 'Dáng áo thụng thả tự nhiên, vạt áo phủ qua đầu gối', defaultColor: '#2b4162' },
      { id: 'cmp-at-sleeves', name: 'Tay áo thụng dài 1 tấc', layerOrder: 4, isRequired: true, type: 'main', description: 'Tay áo rộng xòe, khi chắp tay tạo thế trang nghiêm', defaultColor: '#2b4162' },
      { id: 'cmp-at-buttons', name: 'Hàng 5 khuy cài xà cừ / đồng', layerOrder: 4, isRequired: true, type: 'main', description: 'Biểu trưng cho Ngũ Thường (Nhân Lễ Nghĩa Trí Tín)', defaultColor: '#e0a96d' },
      { id: 'cmp-at-khan', name: 'Khăn đóng xếp nếp truyền thống', layerOrder: 5, isRequired: false, type: 'headwear', description: 'Khăn xếp chữ Nhân hoặc chữ Nhất tề chỉnh', defaultColor: '#1a1a1a' },
      { id: 'cmp-at-quat', name: 'Quạt nan gấm hoặc quạt giấy dó', layerOrder: 6, isRequired: false, type: 'accessory', description: 'Cầm ở tay khi đi lại tạo phong thái nho nhã', defaultColor: '#f4a261' },
      { id: 'cmp-at-guoc', name: 'Guốc mộc hoặc giày vải truyền thống', layerOrder: 7, isRequired: false, type: 'footwear', description: 'Guốc gõ thanh nhẹ hoặc giày vải đen', defaultColor: '#382212' }
    ],
    colorVariants: [
      { id: 'col-at-navy', name: 'Lam thẫm (Xanh navy cung đình)', hex: '#1d3557', meaning: 'Điềm đạm, trí tuệ và sự chuẩn mực của bậc trí thức', popularity: 'Rất phổ biến cho nam' },
      { id: 'col-at-maroon', name: 'Đỏ mận / Huyết dụ', hex: '#6b1d2f', meaning: 'Hân hoan, cát tường và thịnh vượng', popularity: 'Lễ cưới & Tết' },
      { id: 'col-at-olive', name: 'Xanh lục rêu', hex: '#386641', meaning: 'Thanh bình, hòa hợp với đất trời mùa xuân', popularity: 'Du xuân, kỷ yếu' },
      { id: 'col-at-cream', name: 'Màu trắng ngà / Màu mỡ gà', hex: '#f4ede2', meaning: 'Thanh bạch, nho nhã và tinh tế', popularity: 'Thanh lịch mùa hè' }
    ],
    materials: [
      { id: 'mat-at-to-tam', name: 'Lụa tơ tằm dệt trơn Bảo Lộc', textureType: 'silk', origin: 'Lâm Đồng & Hà Đông', description: 'Mềm mát, độ bóng mờ quý phái, tà bay bổng' },
      { id: 'mat-at-gam-hoa', name: 'Gấm dệt vân mây chữ Thọ', textureType: 'brocade', origin: 'Vạn Phúc, Hà Đông', description: 'Đứng form áo, hoa văn ẩn hiện tôn vẻ bề thế' },
      { id: 'mat-at-dui', name: 'Đũi tơ tằm dệt thô thủ công', textureType: 'linen_silk', origin: 'Nam Định', description: 'Mộc mạc, gần gũi thiên nhiên, thoát nhiệt tốt' }
    ],
    accessories: [
      { id: 'acc-at-khandong', name: 'Khăn đóng gấm đen 7 nếp', category: 'headwear', layerOrder: 5, description: 'Đội ngay ngắn phía trên trán hình chữ Nhân', traditionalMeaning: 'Đầu đội trời, tâm ngay thẳng', isRecommended: true },
      { id: 'acc-at-thebai', name: 'Thẻ bài gỗ mun khắc chữ nho', category: 'waist', layerOrder: 6, description: 'Đeo bên hông như quan lại và danh gia vọng tộc xưa', traditionalMeaning: 'Danh dự và chức phận', isRecommended: false },
      { id: 'acc-at-quat', name: 'Quạt giấy dó viết thư pháp', category: 'handheld', layerOrder: 6, description: 'Cầm tay nho nhã thi vị', traditionalMeaning: 'Gió lành đức độ', isRecommended: true },
      { id: 'acc-at-giay', name: 'Giày vải đen đế bọc vải hoặc guốc mộc', category: 'footwear', layerOrder: 7, description: 'Đi êm chân, không phát ra tiếng kêu thất lễ', traditionalMeaning: 'Bước đi chừng mực', isRecommended: true }
    ],
    details: [
      { id: 'dtl-at-co', name: 'Cổ đứng lập lĩnh cao 3-4cm', type: 'collar', description: 'Kín đáo và giữ đầu luôn ngay ngắn' },
      { id: 'dtl-at-tay', name: 'Tay áo thụng dài che kín mu bàn tay', type: 'sleeve', description: 'Khi chắp tay tạo sự kính cẩn tột cùng' }
    ],
    suitability: [
      { eventId: 'evt-tet', score: 96, label: 'Hoàn hảo', reason: 'Áo Tấc là biểu tượng tuyệt hảo cho ngày mùng 1 Tết đi chúc thọ ông bà cha mẹ và vãn cảnh chùa.' },
      { eventId: 'evt-wedding', score: 95, label: 'Hoàn hảo', reason: 'Lễ phục chuẩn mực cho chú rể, đội bê tráp hoặc hai họ trong nghi thức hôn phối trang trọng.' },
      { eventId: 'evt-yearbook', score: 92, label: 'Rất phù hợp', reason: 'Rất được học sinh sinh viên lựa chọn vì phom dáng nho nhã, uyên bác và thanh lịch.' },
      { eventId: 'evt-formal', score: 94, label: 'Hoàn hảo', reason: 'Đại diện tiêu biểu cho quốc phục Việt Nam tiếp đón quan khách ngoại giao.' },
      { eventId: 'evt-festival', score: 89, label: 'Rất phù hợp', reason: 'Đoan trang, kính cẩn bước vào không gian đình làng và đền thánh.' },
      { eventId: 'evt-street', score: 55, label: 'Phù hợp', reason: 'Tay thụng hơi vướng khi vận động dạo phố nhiều, nhưng chụp hình thì tuyệt đẹp.' }
    ],
    usageConsiderations: [
      'Khi làm lễ hoặc chụp ảnh trang nghiêm, cần giữ tư thế chắp hai tay lại với nhau (tay áo buông dài tạo hình chữ V ngược).',
      'Luôn cài đủ 5 khuy từ cổ xuống nách và hông phải; không buông cúc cổ.',
      'Khăn đóng đội thẳng, không lệch quá nhiều về sau gáy.'
    ],
    stylingGuide: {
      accessories: ['Khăn đóng (khăn xếp)', 'Quạt cầm tay thư pháp', 'Túi gấm đeo thắt lưng', 'Kính gọng tròn cổ điển'],
      hairstyles: ['Tóc búi gọn đội khăn xếp', 'Tóc ngắn rẽ ngôi 7/3 vuốt nếp'],
      footwear: ['Giày da trơn đen', 'Giày lười da lộn tối màu', 'Guốc mộc truyền thống'],
      recommendedColors: ['Xanh lam thẫm', 'Đỏ huyết dụ', 'Xanh lục rêu', 'Trắng ngà'],
      materialsAndMotifs: ['Lụa tơ tằm trơn', 'Gấm vân hoa mây', 'Chữ Thọ dệt chìm'],
      traditionalStyling: 'Áo Tấc lụa tơ tằm đơn sắc, bên trong lót áo cánh trắng, quần lụa trắng ống rộng, đầu đội khăn đóng đen chữ Nhân, chân đi giày đen hoặc guốc mộc.',
      modernRemixAdvice: 'Remix hiện đại: Thay quần lụa trắng dài bằng quần âu tây dáng đứng (tapered trousers), phối với giày da Oxford đen bóng hoặc bốt da cổ thấp, tay áo có thể xắn gọn một nếp khi dạo phố.',
      avoidCombinations: [
        'Tránh mang dép lê, dép tổ ong xỏ ngón khi mặc Áo Tấc.',
        'Tránh mặc quần đùi hoặc quần lửng lộ ra dưới tà áo.',
        'Tránh thả cúc áo ngực lôi thôi làm mất đi tinh thần Ngũ Thường.'
      ]
    }
  },
  {
    id: 'cos-ngu-than-tay-chen',
    name: 'Áo Ngũ Thân Tay Chẽn',
    slug: 'ao-ngu-than-tay-chen',
    era: 'Triều Nguyễn - Hiện đại',
    region: 'Toàn quốc',
    gender: 'unisex',
    formality: 'casual_refined',
    coverImage: '/assets/costumes/ao-ngu-than-vnp.jpg',
    lineageCategory: 'lap-linh',
    lineageSubcategory: 'tay-chen',
    lineageLabel: 'Áo Lập Lĩnh • Tay gọn (Thường phục)',
    shortDescription: 'Biến thể tiện dụng thường nhật của áo Ngũ Thân, với ống tay ôm vừa vặn vào cổ tay, năng động, thoải mái nhưng vẫn bảo toàn trọn vẹn nét tôn nghiêm.',
    historicalContext: 'Cùng chung định chế với Áo Tấc năm 1744 - 1827, nhưng nếu Áo Tấc là lễ phục tay rộng thì Ngũ Thân Tay Chẽn là thường phục của quan viên, học sĩ và thứ dân khi làm việc, đi đường hay giao tế hàng ngày.',
    culturalSignificance: 'Là tiền thân trực tiếp của chiếc Áo Dài hiện đại ngày nay. Tượng trưng cho sự khiêm nhường, tháo vát và linh hoạt của người Việt trong đời sống lao động.',
    isVerifiedHistoricalData: true,
    verificationNote: 'Tư liệu khảo cứu y phục người Việt thế kỷ 19 - đầu thế kỷ 20 qua ảnh tư liệu của Viện Viễn Đông Bác Cổ (EFEO).',
    components: [
      { id: 'cmp-tc-model', name: 'Người mẫu Nam / Nữ', layerOrder: 1, isRequired: true, type: 'inner', description: 'Dáng đứng trẻ trung, hiện đại', defaultColor: '#f7ede2' },
      { id: 'cmp-tc-inner', name: 'Áo lót trắng cổ viền', layerOrder: 2, isRequired: true, type: 'inner', description: 'Lớp lót giữ vệ sinh áo chính và bảo đảm phom cổ đứng', defaultColor: '#ffffff' },
      { id: 'cmp-tc-pants', name: 'Quần âu suông hoặc quần lụa', layerOrder: 2, isRequired: true, type: 'inner', description: 'Ống đứng gọn gàng hiện đại', defaultColor: '#1c1c1c' },
      { id: 'cmp-tc-main', name: 'Thân áo Ngũ Thân gọn gàng', layerOrder: 3, isRequired: true, type: 'main', description: 'Vạt áo lượn cong nhẹ nhàng ôm lấy vóc dáng', defaultColor: '#457b9d' },
      { id: 'cmp-tc-sleeves', name: 'Tay áo chẽn bó cổ tay', layerOrder: 4, isRequired: true, type: 'main', description: 'Ống tay thu nhỏ từ bắp tay xuống cổ tay thuận tiện cử động', defaultColor: '#457b9d' },
      { id: 'cmp-tc-buttons', name: '5 khuy xà cừ hoặc kim loại đúc', layerOrder: 4, isRequired: true, type: 'main', description: 'Cài chắc chắn dọc nách và mạn sườn phải', defaultColor: '#e0a96d' },
      { id: 'cmp-tc-acc', name: 'Đồng hồ quả quýt hoặc túi xách lụa', layerOrder: 6, isRequired: false, type: 'accessory', description: 'Tạo điểm nhấn giao thoa Đông Tây', defaultColor: '#d4af37' },
      { id: 'cmp-tc-shoes', name: 'Giày sneaker da tối giản hoặc Derby', layerOrder: 7, isRequired: false, type: 'footwear', description: 'Bước đi năng động hiện đại', defaultColor: '#2b2d42' }
    ],
    colorVariants: [
      { id: 'col-tc-emerald', name: 'Xanh lam hoa râm', hex: '#264653', meaning: 'Hài hòa, trẻ trung và tràn đầy sinh khí', popularity: 'Bán chạy nhất' },
      { id: 'col-tc-charcoal', name: 'Xám than chì / Đen tuyền', hex: '#2b2d42', meaning: 'Chững chạc, bí ẩn và tôn dáng', popularity: 'Rất chuộng dạo phố' },
      { id: 'col-tc-sand', name: 'Vàng cát phù sa', hex: '#e9c46a', meaning: 'Ấm áp, hoài niệm sông nước quê hương', popularity: 'Chụp kỷ yếu' },
      { id: 'col-tc-burgundy', name: 'Đỏ rượu vang', hex: '#7f1d1d', meaning: 'Cuốn hút, tự tin nổi bật trong lễ hội', popularity: 'Sự kiện trang trọng' }
    ],
    materials: [
      { id: 'mat-tc-linen', name: 'Vải Linen tơ tằm dệt thoáng khí', textureType: 'linen', origin: 'Việt Nam', description: 'Thoát mồ hôi cực tốt, phom vải đứng cứng cáp' },
      { id: 'mat-tc-cotton-silk', name: 'Cotton pha tơ tằm dệt hoa chìm', textureType: 'cotton_silk', origin: 'Bảo Lộc', description: 'Co giãn nhẹ, thân thiện với làn da khi hoạt động cả ngày' }
    ],
    accessories: [
      { id: 'acc-tc-dongho', name: 'Đồng hồ dây da phong cách cổ điển', category: 'jewelry', layerOrder: 6, description: 'Đeo cổ tay tạo phong thái tri thức thế kỷ 20', traditionalMeaning: 'Giao thoa thời đại', isRecommended: true },
      { id: 'acc-tc-tui', name: 'Túi tote vải dệt hoa văn Đông Sơn', category: 'handheld', layerOrder: 6, description: 'Phụ kiện dạo phố tiện ích', traditionalMeaning: 'Hơi thở dân gian đương đại', isRecommended: true },
      { id: 'acc-tc-giay', name: 'Giày da Dr. Martens hoặc Sneaker trắng', category: 'footwear', layerOrder: 7, description: 'Remix phong cách đường phố cá tính', traditionalMeaning: 'Tự do bước tiến', isRecommended: true }
    ],
    details: [
      { id: 'dtl-tc-cuc', name: 'Khuy ngọc trai ánh xà cừ', type: 'button', description: 'Ánh lấp lánh nhẹ nhàng dưới ánh nắng' },
      { id: 'dtl-tc-xe', name: 'Đường xẻ tà cao vừa phải', type: 'hem', description: 'Dễ dàng ngồi xe máy hoặc di chuyển linh hoạt' }
    ],
    suitability: [
      { eventId: 'evt-street', score: 99, label: 'Hoàn hảo', reason: 'Đây chính là trang phục lý tưởng nhất để mặc dạo phố, đi cà phê, bảo tàng cuối tuần.' },
      { eventId: 'evt-yearbook', score: 94, label: 'Hoàn hảo', reason: 'Trẻ trung, thuận tiện chạy nhảy chụp ảnh tập thể ngoài trời suốt cả ngày.' },
      { eventId: 'evt-tet', score: 91, label: 'Rất phù hợp', reason: 'Đi chúc Tết bạn bè, dạo đường hoa vô cùng thoải mái và chỉn chu.' },
      { eventId: 'evt-art', score: 86, label: 'Rất phù hợp', reason: 'Biểu diễn nhạc acoustic hoặc nghệ thuật đương đại.' },
      { eventId: 'evt-formal', score: 78, label: 'Phù hợp', reason: 'Nên chọn màu trầm và chất liệu gấm để tăng tính trang trọng.' }
    ],
    usageConsiderations: [
      'Ống tay may chẽn vừa vặn, không nên may quá chật làm khó gập khuỷu tay.',
      'Dễ kết hợp với trang phục hiện đại nhưng cần giữ phom cổ đứng và nếp khuy ngũ thân.'
    ],
    stylingGuide: {
      accessories: ['Đồng hồ cổ điển', 'Kính mắt tròn gọng kim loại', 'Túi chéo da nâu', 'Khăn rằn cách điệu'],
      hairstyles: ['Tóc layer hiện đại', 'Tóc búi nửa đầu cá tính'],
      footwear: ['Giày da lười (Loafers)', 'Sneaker da trắng đế bệt', 'Giày Oxford cổ điển'],
      recommendedColors: ['Xanh navy phối quần xám', 'Xanh rêu phối quần be', 'Trắng ngà phối quần đen'],
      materialsAndMotifs: ['Linen cao cấp', 'Lụa pha cotton', 'Hoa văn kỷ hà tối giản'],
      traditionalStyling: 'Mặc cùng quần lụa trắng, khăn đóng đen, giày da đen trơn thanh lịch.',
      modernRemixAdvice: 'Remix đường phố: Mặc áo Ngũ Thân tay chẽn màu trơn cùng quần tây âu suông xếp ly, mang giày Loafer hoặc sneaker trắng tối giản, khoác thêm túi da đeo chéo.',
      avoidCombinations: [
        'Tránh mặc cùng quần short ngắn trên gối gây phản cảm.',
        'Tránh mang dép tông lê cao su khi dự sự kiện.'
      ]
    }
  },
  {
    id: 'cos-giao-linh',
    name: 'Áo Giao Lĩnh (Việt Phục Thời Lê)',
    slug: 'ao-giao-linh-thoi-le',
    era: 'Triều Lê Sơ - Lê Trung Hưng (Thế kỷ 15 - 18)',
    region: 'Bắc Bộ (Kinh thành Thăng Long)',
    gender: 'unisex',
    formality: 'ceremonial',
    coverImage: '/assets/costumes/ao-giao-linh.jpg',
    lineageCategory: 'giao-linh',
    lineageSubcategory: 'giao-linh',
    lineageLabel: 'Áo Giao Lĩnh • Cổ chéo',
    shortDescription: 'Cổ phục cổ xưa với thiết kế cổ áo bắt chéo trước ngực (vạt trái đè lên vạt phải), tay áo thụng dài bay bổng uy nghiêm.',
    historicalContext: 'Áo Giao Lĩnh (còn gọi là Trực Lĩnh) là kiểu áo phổ biến nhất của các triều đại Lý, Trần, Lê trước khi triều Nguyễn phổ cập áo Ngũ Thân cổ đứng. Được ghi nhận trong tranh vẽ cổ, tượng thờ thời Hậu Lê và khai quật lăng mộ quan lại.',
    culturalSignificance: 'Vạt trái đè lên vạt phải thể hiện quy luật Trời Đất (Dương đè lên Âm). Tay áo rộng như mây trôi biểu trưng cho khí phách thanh cao, phong thái thần tiên của bậc đại nhân quân tử.',
    isVerifiedHistoricalData: true,
    verificationNote: 'Dựa trên tượng hậu chùa Dâu, tượng hoàng hậu thời Lê Mạt và khảo cổ học mộ hợp chất thời Lê.',
    components: [
      { id: 'cmp-gl-model', name: 'Người mẫu Thần thái Cổ điển', layerOrder: 1, isRequired: true, type: 'inner', description: 'Thần thái nho nhã trầm mặc ngàn năm', defaultColor: '#f7ede2' },
      { id: 'cmp-gl-inner', name: 'Áo trung đơn trắng', layerOrder: 2, isRequired: true, type: 'inner', description: 'Áo lót trắng có cổ giao lĩnh lộ ra lớp trong', defaultColor: '#ffffff' },
      { id: 'cmp-gl-skirt', name: 'Thường / Váy dài quét đất', layerOrder: 2, isRequired: true, type: 'inner', description: 'Váy xếp ly bên dưới tạo dáng uy nghi khi di chuyển', defaultColor: '#2b2d42' },
      { id: 'cmp-gl-main', name: 'Áo Giao Lĩnh vạt chéo rộng', layerOrder: 3, isRequired: true, type: 'main', description: 'Cổ áo giao chéo viền màu tương phản thanh nhã', defaultColor: '#1b4965' },
      { id: 'cmp-gl-belt', name: 'Đại đai thắt lưng lụa buông dải', layerOrder: 4, isRequired: true, type: 'accessory', description: 'Dải lụa thắt ngang eo giữ vạt áo và buông dài duyên dáng', defaultColor: '#c1121f' },
      { id: 'cmp-gl-head', name: 'Mũ Đinh Tự hoặc Khăn vấn tóc', layerOrder: 5, isRequired: false, type: 'headwear', description: 'Đầu đội mũ chữ Đinh hoặc vấn khăn vải mộc', defaultColor: '#000000' },
      { id: 'cmp-gl-ngoc', name: 'Ngọc bội treo ngang hông', layerOrder: 6, isRequired: false, type: 'accessory', description: 'Ngọc bội chạm hình rồng hoặc hoa cúc', defaultColor: '#bee1e6' },
      { id: 'cmp-gl-shoes', name: 'Hài mây hoặc giày vải đế dày', layerOrder: 7, isRequired: false, type: 'footwear', description: 'Hài cổ đi êm trên gạch Bát Tràng', defaultColor: '#495057' }
    ],
    colorVariants: [
      { id: 'col-gl-indigo', name: 'Chàm thẫm Thăng Long', hex: '#1d3557', meaning: 'Đậm nét Bắc Bộ ngàn năm văn hiến', popularity: 'Rất trang trọng' },
      { id: 'col-gl-crimson', name: 'Đỏ gạch nung cổ kính', hex: '#9d0208', meaning: 'Hào khí Đại Việt thời Lê Sơ', popularity: 'Biểu diễn & Lễ hội' },
      { id: 'col-gl-cloud', name: 'Trắng mây sương khói', hex: '#edf2f4', meaning: 'Thoát tục, thanh khiết của thi nhân xưa', popularity: 'Chụp ảnh nghệ thuật' }
    ],
    materials: [
      { id: 'mat-gl-to-tam', name: 'Tơ tằm dệt sa hạt lựu', textureType: 'silk_gauze', origin: 'Làng dệt Cổ Đô', description: 'Bay bổng phiêu dật trong gió' },
      { id: 'mat-gl-gam-the', name: 'Thao sa gấm mỏng thời Lê', textureType: 'damask', origin: 'Phục dựng theo tượng chùa', description: 'Dày dặn, giữ nếp cổ áo giao chéo thẳng tắp' }
    ],
    accessories: [
      { id: 'acc-gl-dai', name: 'Dải lụa thắt đại đai thêu hoa cúc', category: 'waist', layerOrder: 4, description: 'Buông dài hai dải phía trước ngực', traditionalMeaning: 'Khí khái và trật tự', isRecommended: true },
      { id: 'acc-gl-kiem', name: 'Kiếm cổ bao da hoặc Tiêu trúc', category: 'handheld', layerOrder: 6, description: 'Phụ kiện chụp ảnh cổ trang', traditionalMeaning: 'Văn võ toàn tài', isRecommended: false }
    ],
    details: [
      { id: 'dtl-gl-co', name: 'Viền cổ áo màu tương phản (Tố lĩnh)', type: 'collar', description: 'Làm nổi bật đường chéo giao hòa âm dương' }
    ],
    suitability: [
      { eventId: 'evt-festival', score: 98, label: 'Hoàn hảo', reason: 'Hoàn hảo cho các lễ hội tưởng niệm vua Lê, đền Hùng, chùa cổ Bắc Bộ.' },
      { eventId: 'evt-art', score: 96, label: 'Hoàn hảo', reason: 'Rất ăn ảnh, tà áo và dải đai bay bổng cực kỳ ấn tượng trên sân khấu nghệ thuật.' },
      { eventId: 'evt-yearbook', score: 88, label: 'Rất phù hợp', reason: 'Mang đến bộ ảnh phong cách cổ phong Thăng Long khác biệt và đậm chất điện ảnh.' },
      { eventId: 'evt-tet', score: 80, label: 'Phù hợp', reason: 'Thích hợp đi lễ đền chùa trang nghiêm ngày đầu năm.' },
      { eventId: 'evt-street', score: 35, label: 'Cách tân độc đáo', reason: 'Tà áo quá dài và quét đất, chỉ nên mặc khi chụp ảnh có hỗ trợ viên.' }
    ],
    usageConsiderations: [
      'Bắt buộc vạt bên TRÁI đè lên vạt bên PHẢI; vạt phải đè lên vạt trái trong văn hóa xưa là quy cách mặc cho người đã khuất.',
      'Cần có áo lót trung đơn màu trắng bên trong để tôn viền cổ áo.'
    ],
    stylingGuide: {
      accessories: ['Đại đai lụa thắt eo', 'Ngọc bội treo hông', 'Quạt nan tròn thêu sen', 'Mũ chữ Đinh'],
      hairstyles: ['Tóc búi cao cài trâm gỗ', 'Tóc xõa tự nhiên buông dải lụa'],
      footwear: ['Hài vải đế mây', 'Guốc mộc Bắc Bộ quai ngang'],
      recommendedColors: ['Xanh chàm phối đai đỏ son', 'Trắng ngà phối đai xanh lam'],
      materialsAndMotifs: ['Sa dệt hoa cúc dây thời Lê', 'Họa tiết mây cuộn Đại Việt'],
      traditionalStyling: 'Áo Giao Lĩnh phủ ngoài thường xếp ly, thắt đai lụa ngang eo, đầu búi tóc cài trâm sừng hoặc kim loại, chân mang hài mây.',
      modernRemixAdvice: 'Remix sân khấu: Sử dụng áo Giao Lĩnh ngắn vạt như một chiếc áo khoác Haori/Kimono hiện đại, khoác ngoài áo thun trơn và quần suông tối màu.',
      avoidCombinations: [
        'Tuyệt đối không bắt chéo vạt phải đè vạt trái (phạm đại kỵ táng lễ).',
        'Tránh mang phụ kiện đồ nhựa phát sáng hay kính râm tráng gương.'
      ]
    }
  },
  {
    id: 'cos-doi-kham',
    name: 'Áo Đối Khâm (Cổ Phục Quý Tộc)',
    slug: 'ao-doi-kham',
    era: 'Triều Lý - Trần - Lê',
    region: 'Bắc Bộ & Trung Bộ',
    gender: 'unisex',
    formality: 'formal',
    coverImage: '/assets/costumes/ao-nhat-binh-tu-cung.jpg',
    lineageCategory: 'dich-chuyen',
    lineageSubcategory: 'nhat-binh',
    lineageLabel: 'Áo Đối Khâm • Song song (Hệ Dịch Chuyển)',
    shortDescription: 'Chiếc áo khoác cổ dài với hai vạt song song buông thẳng trước ngực, phô diễn trọn vẹn lớp áo ngực thêu hoa bên trong lộng lẫy.',
    historicalContext: 'Áo Đối Khâm có lịch sử lâu đời từ thời Lý - Trần đến tận thời Nguyễn, thường được mặc như một lớp áo khoác lộng lẫy bên ngoài yếm hoặc áo lót của giới quý tộc xưa.',
    culturalSignificance: 'Biểu trưng cho sự phóng khoáng, thanh nhã và vẻ đẹp tự do của phụ nữ quý tộc thời Đại Việt. Hai vạt buông song song tượng trưng cho sự ngay thẳng và chính trực.',
    isVerifiedHistoricalData: true,
    verificationNote: 'Tư liệu đối chiếu qua điêu khắc tượng chùa Phật Tích thời Lý và tranh cúng Phật giáo thời Lê.',
    components: [
      { id: 'cmp-dk-model', name: 'Người mẫu Nữ dịu dàng', layerOrder: 1, isRequired: true, type: 'inner', description: 'Vóc dáng thanh tú truyền thống', defaultColor: '#f7ede2' },
      { id: 'cmp-dk-inner', name: 'Yếm lụa hoặc áo ôm ngực thêu sen', layerOrder: 2, isRequired: true, type: 'inner', description: 'Lớp yếm mặc bên trong tạo điểm nhấn màu sắc', defaultColor: '#c1121f' },
      { id: 'cmp-dk-skirt', name: 'Váy lụa dài xếp nếp rộng', layerOrder: 2, isRequired: true, type: 'inner', description: 'Váy quét đất nhẹ nhàng', defaultColor: '#fdf0d5' },
      { id: 'cmp-dk-main', name: 'Áo khoác Đối Khâm hai vạt thẳng', layerOrder: 3, isRequired: true, type: 'outer', description: 'Hai vạt áo buông song song không cài khuy', defaultColor: '#588157' },
      { id: 'cmp-dk-acc', name: 'Chuỗi kiềng bạc hoặc ngọc đeo cổ', layerOrder: 6, isRequired: false, type: 'accessory', description: 'Tôn vinh khoảng ngực thanh tao', defaultColor: '#e0e1dd' },
      { id: 'cmp-dk-shoes', name: 'Hài thêu cánh sen', layerOrder: 7, isRequired: false, type: 'footwear', description: 'Hài mũi nhọn đính ngọc trai', defaultColor: '#780001' }
    ],
    colorVariants: [
      { id: 'col-dk-moss', name: 'Xanh rêu ngọc bích', hex: '#3a5a40', meaning: 'Hài hòa với cỏ cây thiên nhiên, nét thanh lịch cổ xưa', popularity: 'Rất thanh tao' },
      { id: 'col-dk-crimson', name: 'Đỏ hồng đào', hex: '#b5179e', meaning: 'Duyên dáng, tươi trẻ của tiểu thư khuê các', popularity: 'Mùa xuân' },
      { id: 'col-dk-ivory', name: 'Trắng ngà lụa nõn', hex: '#f8f9fa', meaning: 'Thuần khiết và siêu thực', popularity: 'Chụp concept' }
    ],
    materials: [
      { id: 'mat-dk-sa', name: 'Sa mỏng dệt tơ bóng mờ', textureType: 'gauze', origin: 'Vạn Phúc', description: 'Mỏng nhẹ, phất phơ theo làn gió' },
      { id: 'mat-dk-gam', name: 'Gấm dệt vân mây hoa lá', textureType: 'brocade', origin: 'Hà Đông', description: 'Sang trọng cho ngày lễ hội lớn' }
    ],
    accessories: [
      { id: 'acc-dk-kieng', name: 'Kiềng bạc chạm hoa mai', category: 'jewelry', layerOrder: 6, description: 'Đeo vừa vặn ôm cổ', traditionalMeaning: 'Vẻ đẹp tròn đầy viên mãn', isRecommended: true },
      { id: 'acc-dk-quat', name: 'Quạt tròn lụa dệt hoa phù dung', category: 'handheld', layerOrder: 6, description: 'Phụ kiện che nghiêng nụ cười duyên', traditionalMeaning: 'Khuê các e ấp', isRecommended: true }
    ],
    details: [
      { id: 'dtl-dk-nep', name: 'Nẹp cổ áo viền thêu hoa dây', type: 'collar', description: 'Chạy dài suốt từ gáy xuống tận gấu áo' }
    ],
    suitability: [
      { eventId: 'evt-art', score: 95, label: 'Hoàn hảo', reason: 'Tạo hình bay bổng, lãng mạn rất thích hợp cho các video ca nhạc cổ phong và múa dân tộc.' },
      { eventId: 'evt-yearbook', score: 90, label: 'Rất phù hợp', reason: 'Rất tôn dáng nữ sinh, chụp ảnh nhóm nữ vô cùng ăn ý và thơ mộng.' },
      { eventId: 'evt-tet', score: 86, label: 'Rất phù hợp', reason: 'Sắc xuân ngập tràn khi kết hợp cùng yếm đào rực rỡ.' },
      { eventId: 'evt-wedding', score: 82, label: 'Phù hợp', reason: 'Lựa chọn ngọt ngào cho dàn phù dâu hoặc tiệc cưới phong cách cổ truyền.' }
    ],
    usageConsiderations: [
      'Áo khoác đối khâm không có khuy cài trước, cần buộc dải yếm lót bên trong thật cẩn thận và kín đáo.',
      'Nên chọn màu áo khoác ngoài tương phản hài hòa với màu yếm lót bên trong.'
    ],
    stylingGuide: {
      accessories: ['Kiềng bạc cổ', 'Trâm cài tóc hoa lưu ly', 'Quạt tròn lụa thêu hoa'],
      hairstyles: ['Tóc búi cao lộ gáy thanh tú', 'Tóc tết vương miện đính hoa nhài'],
      footwear: ['Hài gấm mũi sen', 'Guốc gỗ sơn son thếp vàng'],
      recommendedColors: ['Áo xanh rêu phối yếm đỏ son', 'Áo trắng ngà phối yếm hồng cánh sen'],
      materialsAndMotifs: ['Sa tơ tằm mềm', 'Thêu hoa phù dung', 'Hoa cúc thời Lý'],
      traditionalStyling: 'Yếm thêu hoa lót trong, váy lụa trắng dài xếp ly, khoác áo Đối Khâm buông thả tự nhiên, cổ đeo kiềng bạc.',
      modernRemixAdvice: 'Remix tiệc tối: Sử dụng áo Đối Khâm sa mỏng như một chiếc áo Kimono-cardigan khoác ngoài đầm lụa hai dây hiện đại (slip dress).',
      avoidCombinations: [
        'Tránh để lộ áo lót hiện đại (dây áo nịt ngực) khi mặc yếm.',
        'Tránh phối cùng ba lô thể thao nặng nề.'
      ]
    }
  },
  {
    id: 'cos-ao-dai',
    name: 'Áo Dài Việt Nam',
    slug: 'ao-dai-viet-nam',
    era: 'Thế kỷ 18 - Đương đại (1744 - nay)',
    region: 'Toàn quốc (Hà Nội, Huế, Sài Gòn)',
    gender: 'unisex',
    formality: 'formal',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/%C3%81o_d%C3%A0i_%286405924827%29.jpg',
    lineageCategory: 'lap-linh',
    lineageSubcategory: 'tay-chen',
    lineageLabel: 'Áo Dài ngũ thân cách tân • Hệ Lập Lĩnh',
    shortDescription: 'Quốc phục biểu tượng của văn hóa Việt Nam với hai tà trước - sau buông rủ thướt tha, xẻ sườn và mặc cùng quần lụa dài.',
    historicalContext: 'Bắt nguồn từ áo ngũ thân lập lĩnh thời chúa Nguyễn Phúc Khoát (1744) và vua Minh Mạng (1827), chuyển biến qua các mốc thời trang rực rỡ: Áo dài Lemur Cát Tường (1934), Áo dài Lê Phổ (1935), Áo dài Raglan Sài Gòn (1960) và Áo dài truyền thống đương đại.',
    culturalSignificance: 'Biểu trưng của vẻ đẹp thanh tao, kín đáo nhưng tôn vinh đường nét cơ thể. Quy chuẩn bất di bất dịch của áo dài là luôn luôn mặc cùng quần dài.',
    isVerifiedHistoricalData: true,
    verificationNote: 'Tư liệu đối chiếu từ Bảo tàng Phụ nữ Việt Nam, sách Ngàn năm áo mũ (Trần Quang Đức) và tuần báo Phong Hóa (1934).',
    components: [
      { id: 'cmp-ad-model', name: 'Người mẫu Nữ / Nam', layerOrder: 1, isRequired: true, type: 'inner', description: 'Vóc dáng thanh thoát, thần thái duyên dáng', defaultColor: '#f7ede2' },
      { id: 'cmp-ad-inner', name: 'Lớp lót & Quần lụa dài', layerOrder: 2, isRequired: true, type: 'inner', description: 'Quần lụa ống suông quét đất giữ vẻ kín đáo', defaultColor: '#ffffff' },
      { id: 'cmp-ad-main', name: 'Thân áo dài hai tà xẻ sườn', layerOrder: 3, isRequired: true, type: 'main', description: 'Hai tà trước - sau buông rủ thướt tha', defaultColor: '#c92a2a' },
      { id: 'cmp-ad-collar', name: 'Cổ đứng / Cổ thuyền / Tay raglan', layerOrder: 4, isRequired: true, type: 'main', description: 'Cổ đứng cao ôm thanh mảnh hoặc cổ thuyền thoáng', defaultColor: '#c92a2a' },
      { id: 'cmp-ad-head', name: 'Nón lá bài thơ hoặc Khăn vấn', layerOrder: 5, isRequired: false, type: 'headwear', description: 'Nón lá bài thơ quai lụa hoặc khăn vấn nhung', defaultColor: '#fef3c7' },
      { id: 'cmp-ad-acc', name: 'Kiềng bạc / Chuỗi ngọc trai', layerOrder: 6, isRequired: false, type: 'accessory', description: 'Trang sức tôn vinh nét đài các', defaultColor: '#e0e1dd' },
      { id: 'cmp-ad-shoes', name: 'Guốc mộc hoặc Giày gót nhọn', layerOrder: 7, isRequired: false, type: 'footwear', description: 'Bước đi uyển chuyển nhẹ nhàng', defaultColor: '#382212' }
    ],
    colorVariants: [
      { id: 'col-ad-white', name: 'Trắng ngọc tinh khôi (Nữ sinh)', hex: '#ffffff', meaning: 'Thuần khiết, trong sáng của tuổi học trò', popularity: 'Kỷ yếu & Học đường' },
      { id: 'col-ad-red', name: 'Đỏ thắm hỷ sự', hex: '#c92a2a', meaning: 'Hân hoan, may mắn và hạnh phúc lứa đôi', popularity: 'Lễ cưới & Ngày Tết' },
      { id: 'col-ad-yellow', name: 'Vàng mù tạt Sài Gòn Retro 1968', hex: '#d97706', meaning: 'Hoài niệm thập niên 60-70 rực rỡ', popularity: 'Du xuân dạo phố' },
      { id: 'col-ad-teal', name: 'Xanh cổ vịt hoàng thành', hex: '#0f766e', meaning: 'Quý phái, trầm mặc và sang trọng', popularity: 'Dạ tiệc & Ngoại giao' },
      { id: 'col-ad-purple', name: 'Tím huế mộng mơ', hex: '#7e22ce', meaning: 'Nét thơ mộng, thủy chung xứ kinh kỳ', popularity: 'Cổ điển' },
      { id: 'col-ad-black', name: 'Đen tuyền nhung mờ (Modern Chic)', hex: '#18181b', meaning: 'Tối giản, quyền lực và bí ẩn', popularity: 'Nghệ thuật đương đại' }
    ],
    materials: [
      { id: 'mat-ad-to-tam', name: 'Lụa Vạn Phúc Hà Đông', textureType: 'silk', origin: 'Hà Đông, Hà Nội', description: 'Mềm mát, độ rủ tự nhiên bay bổng' },
      { id: 'mat-ad-gam-hoa', name: 'Gấm dệt tơ hoa chìm', textureType: 'brocade', origin: 'Bảo Lộc', description: 'Đứng phom, hoa văn ẩn hiện sang trọng' },
      { id: 'mat-ad-nhung', name: 'Nhung the tuyết', textureType: 'velvet', origin: 'Việt Nam', description: 'Ấm áp, quý phái cho mùa đông và dạ tiệc' },
      { id: 'mat-ad-dui', name: 'Đũi tơ tằm thoáng khí', textureType: 'linen_silk', origin: 'Nam Định', description: 'Mộc mạc, thấm hút tốt cho ngày nắng nóng' }
    ],
    accessories: [
      { id: 'acc-ad-nonla', name: 'Nón lá bài thơ quai lụa', category: 'headwear', layerOrder: 5, description: 'Che nghiêng nụ cười e ấp', traditionalMeaning: 'Nét duyên thuần khiết', isRecommended: true },
      { id: 'acc-ad-kieng', name: 'Kiềng bạc chạm hoa cúc', category: 'jewelry', layerOrder: 6, description: 'Ôm vừa vặn cổ áo dài trơn', traditionalMeaning: 'Hồi môn hạnh phúc', isRecommended: true },
      { id: 'acc-ad-ngoc-trai', name: 'Chuỗi ngọc trai tự nhiên', category: 'jewelry', layerOrder: 6, description: 'Phối cùng áo dài cổ thuyền thập niên 60', traditionalMeaning: 'Đài các quý phái', isRecommended: true },
      { id: 'acc-ad-quat', name: 'Quạt lụa thêu hoa sen', category: 'handheld', layerOrder: 6, description: 'Cầm tay tạo dáng thanh tao', traditionalMeaning: 'Hương sen thuần tịnh', isRecommended: true },
      { id: 'acc-ad-guoc', name: 'Guốc mộc quai nhung đỏ', category: 'footwear', layerOrder: 7, description: 'Tiếng guốc lách cách hoài niệm', traditionalMeaning: 'Bước đi thanh thoát', isRecommended: true }
    ],
    details: [
      { id: 'dtl-ad-co', name: 'Cổ đứng lập lĩnh hoặc cổ thuyền', type: 'collar', description: 'Tôn vinh cần cổ kiêu sa' },
      { id: 'dtl-ad-raglan', name: 'Tay áo nối raglan 1960', type: 'sleeve', description: 'Triệt tiêu nếp nhăn nách, phẳng phiu' },
      { id: 'dtl-ad-xe', name: 'Đường xẻ tà hai bên sườn', type: 'hem', description: 'Tà áo trước và sau bay theo từng bước chân' }
    ],
    suitability: [
      { eventId: 'evt-tet', score: 99, label: 'Hoàn hảo', reason: 'Áo dài là quốc phục không thể thiếu trong ngày mùng 1 Tết du xuân và lễ chùa cầu may.' },
      { eventId: 'evt-wedding', score: 96, label: 'Hoàn hảo', reason: 'Áo dài cô dâu chú rể là biểu tượng thiêng liêng nhất trong hôn lễ gia tiên Việt Nam.' },
      { eventId: 'evt-yearbook', score: 100, label: 'Hoàn hảo', reason: 'Áo dài trắng nữ sinh là biểu tượng trường tồn của tuổi thanh xuân học trò.' },
      { eventId: 'evt-formal', score: 95, label: 'Hoàn hảo', reason: 'Trang phục đại diện quốc gia trong các sự kiện ngoại giao và khánh tiết quốc tế.' },
      { eventId: 'evt-street', score: 92, label: 'Hoàn hảo', reason: 'Biến thể tà lửng cách tân cực kỳ được giới trẻ ưa chuộng dạo phố cuối tuần.' }
    ],
    usageConsiderations: [
      'Bắt buộc mặc cùng quần dài ống suông, tuyệt đối không mặc như váy đơn lẻ.',
      'Nếu vải mỏng xuyên thấu, bắt buộc có lớp lót kín đáo hoặc áo lót tệp màu da.',
      'Khi bước đi, giữ lưng thẳng, tà áo buông thả tự nhiên khoan thai.'
    ],
    stylingGuide: {
      accessories: ['Nón lá bài thơ', 'Kiềng bạc cổ', 'Chuỗi ngọc trai', 'Guốc mộc quai nhung'],
      hairstyles: ['Tóc xõa dài tự nhiên', 'Tóc búi nửa đầu kẹp ruy băng', 'Búi tóc retro đội khăn vấn'],
      footwear: ['Giày cao gót mũi nhọn bọc lụa', 'Guốc mộc gót cong', 'Giày búp bê đế bệt'],
      recommendedColors: ['Trắng ngọc phối quần đen', 'Đỏ son phối quần vàng đồng', 'Xanh cổ vịt phối quần be'],
      materialsAndMotifs: ['Lụa Vạn Phúc', 'Gấm hoa chìm', 'Nhung the', 'Hoa sen thêu tay'],
      traditionalStyling: 'Áo dài lụa trắng hoặc đỏ cổ đứng 3cm, quần lụa suông dài chạm đất, đầu đội nón lá quai lụa, cổ đeo kiềng bạc.',
      modernRemixAdvice: 'Remix dạo phố: Áo dài tà lửng hoa nhí hoặc trơn màu pastel, phối quần ống lửng và giày Mary Jane hoặc sneaker trắng, mang túi cói.',
      avoidCombinations: [
        'Tuyệt đối không mặc áo dài mà không có quần dài bên dưới.',
        'Tránh mặc quần short lộ đùi dưới tà áo.',
        'Tránh mang dép lê cao su xỏ ngón làm mất đi vẻ tôn nghiêm.'
      ]
    }
  },
  {
    id: 'cos-vien-linh',
    name: 'Áo Viên Lĩnh (Cổ Tròn Cung Đình)',
    slug: 'ao-vien-linh',
    era: 'Triều Lý - Trần - Lê (Thế kỷ 11 - 18)',
    region: 'Kinh thành Thăng Long',
    gender: 'unisex',
    formality: 'ceremonial',
    coverImage: '/assets/costumes/ao-vien-linh.jpg',
    lineageCategory: 'vien-linh',
    lineageSubcategory: 'vien-linh',
    lineageLabel: 'Áo Viên Lĩnh • Cổ tròn cung đình',
    shortDescription: 'Cổ phục cổ tròn cài khuy chéo bên vai hoặc cổ áo, thường dùng làm quan phục triều đình, bào phục hoàng gia uy nghi tôn quý.',
    historicalContext: 'Áo Viên Lĩnh là một trong những dạng thức y phục trang trọng nhất thời Lý - Trần - Lê sơ, được quy định chặt chẽ cho hoàng gia và quan viên khi thiết triều hoặc tế lễ quốc gia.',
    culturalSignificance: 'Cổ tròn tượng trưng cho Trời (Trời tròn đất vuông), viền cổ khép kín thể hiện sự viên mãn, trọn vẹn và quyền uy tối thượng của vương triều.',
    isVerifiedHistoricalData: true,
    verificationNote: 'Tư liệu qua các bức tượng quan hầu chùa Phật Tích, bia đá thời Lý và tranh vẽ quan lại thời Hậu Lê.',
    components: [
      { id: 'cmp-vl-model', name: 'Người mẫu uy nghi', layerOrder: 1, isRequired: true, type: 'inner', description: 'Thần thái đĩnh đạc quyền uy', defaultColor: '#f7ede2' },
      { id: 'cmp-vl-inner', name: 'Áo trung đơn lót trắng', layerOrder: 2, isRequired: true, type: 'inner', description: 'Lớp áo lót trong giữ cổ áo ngay ngắn', defaultColor: '#ffffff' },
      { id: 'cmp-vl-main', name: 'Bào phục Viên Lĩnh thêu long phụng', layerOrder: 3, isRequired: true, type: 'main', description: 'Cổ tròn cài khuy vai vạt áo buông rộng bề thế', defaultColor: '#9e2a2b' },
      { id: 'cmp-vl-belt', name: 'Đai ngọc hoặc đai sừng chạm khắc', layerOrder: 4, isRequired: true, type: 'accessory', description: 'Đai thắt vòng cung quyền quý', defaultColor: '#d4af37' }
    ],
    colorVariants: [
      { id: 'col-vl-crimson', name: 'Đỏ son triều nghi', hex: '#9e2a2b', meaning: 'Phẩm hàm cao cấp, quyền quý', popularity: 'Rất trang trọng' },
      { id: 'col-vl-purple', name: 'Tím quan phẩm', hex: '#5c2d91', meaning: 'Thanh nhã và quyền thế', popularity: 'Lễ hội lớn' }
    ],
    materials: [
      { id: 'mat-vl-gam', name: 'Gấm dệt vân mây thời Lý', textureType: 'brocade', origin: 'Thăng Long xưa', description: 'Dày dặn, giữ phom cổ tròn uy nghiêm' }
    ],
    accessories: [
      { id: 'acc-vl-mu', name: 'Mũ Phác Đầu hoặc Mũ Ô Sa', category: 'headwear', layerOrder: 5, description: 'Mũ quan có cánh chuồn hai bên', traditionalMeaning: 'Quan tước triều đình', isRecommended: true }
    ],
    details: [
      { id: 'dtl-vl-co', name: 'Cổ áo hình tròn ôm sát cổ', type: 'collar', description: 'Đặc trưng Viên Lĩnh cài khuy lệch' }
    ],
    suitability: [
      { eventId: 'evt-formal', score: 98, label: 'Hoàn hảo', reason: 'Quan phục cổ tròn trang trọng bậc nhất đại diện cho lịch sử Thăng Long ngàn năm.' },
      { eventId: 'evt-art', score: 94, label: 'Hoàn hảo', reason: 'Rất uy quyền và ấn tượng khi tái hiện lịch sử trên sân khấu.' }
    ],
    usageConsiderations: ['Cần kết hợp cùng mũ quan và đai triều đúng quy cách lịch sử.'],
    stylingGuide: {
      accessories: ['Mũ ô sa', 'Đai ngọc', 'Hài mũi cong'],
      hairstyles: ['Búi tóc đội mũ quan'],
      footwear: ['Ủng quan triều đình hoặc hài'],
      recommendedColors: ['Đỏ son', 'Tím thẫm'],
      materialsAndMotifs: ['Gấm rồng mây Lý - Trần'],
      traditionalStyling: 'Áo Viên Lĩnh kết hợp đai ngọc và mũ ô sa.',
      modernRemixAdvice: 'Sử dụng họa tiết cổ tròn cách điệu vào áo khoác dạ tiệc.',
      avoidCombinations: ['Tránh phối cùng trang phục dân dã đường phố.']
    }
  },
  {
    id: 'cos-tu-than',
    name: 'Áo Tứ Thân (Dân Gian Kinh Bắc)',
    slug: 'ao-tu-than',
    era: 'Thế kỷ 12 - 20 (Đặc trưng Bắc Bộ)',
    region: 'Đồng bằng Bắc Bộ (Kinh Bắc)',
    gender: 'female',
    formality: 'casual_refined',
    coverImage: '/assets/costumes/ao-tu-than.jpg',
    lineageCategory: 'dich-chuyen',
    lineageSubcategory: 'tu-than',
    lineageLabel: 'Hệ Dịch Chuyển • Dân gian miền Bắc',
    shortDescription: 'Trang phục duyên dáng gồm bốn vạt áo, thường mặc buông vạt hoặc buộc chéo trước bụng, phối yếm đào, nón quai thao và bao tượng lụa.',
    historicalContext: 'Áo Tứ Thân gắn bó mật thiết với người phụ nữ lao động nông nghiệp và văn hóa Quan họ vùng Kinh Bắc. Bốn vạt áo tượng trưng cho tứ thân phụ mẫu che chở cho người mặc.',
    culturalSignificance: 'Biểu tượng cho đức tính cần cù, tháo vát nhưng vô cùng đằm thắm, tình tứ của người con gái Bắc Bộ trong các dịp trẩy hội dân gian.',
    isVerifiedHistoricalData: true,
    verificationNote: 'Tư liệu dân tộc học vùng văn hóa Kinh Bắc và trang phục Quan họ truyền thống.',
    components: [
      { id: 'cmp-tt-model', name: 'Người mẫu Liền chị Kinh Bắc', layerOrder: 1, isRequired: true, type: 'inner', description: 'Nụ cười duyên e ấp', defaultColor: '#f7ede2' },
      { id: 'cmp-tt-yem', name: 'Yếm đào cổ xây', layerOrder: 2, isRequired: true, type: 'inner', description: 'Yếm lụa đào tôn vẻ thon thả', defaultColor: '#e63946' },
      { id: 'cmp-tt-vay', name: 'Váy đũi lụa đen chấm gót', layerOrder: 2, isRequired: true, type: 'inner', description: 'Váy suông đen tuyền đằm thắm', defaultColor: '#1a1a1a' },
      { id: 'cmp-tt-main', name: 'Áo tứ thân 4 vạt nâu/hạt dẻ', layerOrder: 3, isRequired: true, type: 'main', description: 'Bốn vạt áo bay bổng buộc eo trước ngực', defaultColor: '#582f0e' },
      { id: 'cmp-tt-thatlung', name: 'Bao tượng lụa xanh/hồng thắt eo', layerOrder: 4, isRequired: true, type: 'accessory', description: 'Dải lụa mềm mại rủ nhẹ bên hông', defaultColor: '#2a9d8f' }
    ],
    colorVariants: [
      { id: 'col-tt-brown', name: 'Nâu non đồng nội', hex: '#6f4e37', meaning: 'Cần cù mộc mạc', popularity: 'Dân gian truyền thống' },
      { id: 'col-tt-plum', name: 'Mận chín trẩy hội', hex: '#800e13', meaning: 'Tươi tắn ngày hội Lim', popularity: 'Hát quan họ' }
    ],
    materials: [
      { id: 'mat-tt-dui', name: 'Đũi tơ tằm thô', textureType: 'raw_silk', origin: 'Làng dệt Bắc Ninh', description: 'Bền chắc, đượm màu thiên nhiên' }
    ],
    accessories: [
      { id: 'acc-tt-non', name: 'Nón quai thao ba tầm', category: 'headwear', layerOrder: 5, description: 'Nón tròn lớn quai thao dệt tơ buông dài', traditionalMeaning: 'Che nắng mưa và e ấp nụ cười duyên', isRecommended: true }
    ],
    details: [
      { id: 'dtl-tt-vat', name: 'Hai vạt trước buộc chéo', type: 'hem', description: 'Đặc trưng thắt vạt duyên dáng' }
    ],
    suitability: [
      { eventId: 'evt-festival', score: 100, label: 'Hoàn hảo', reason: 'Trang phục trứ danh của lễ hội Lim và không gian dân gian truyền thống Bắc Bộ.' },
      { eventId: 'evt-art', score: 96, label: 'Hoàn hảo', reason: 'Rực rỡ sắc màu và rất có hồn dân ca trên sân khấu biểu diễn.' }
    ],
    usageConsiderations: ['Mặc cùng yếm đào lót trong và nón quai thao để hoàn chỉnh dáng hình liền chị.'],
    stylingGuide: {
      accessories: ['Nón quai thao', 'Bao tượng lụa', 'Khăn mỏ quạ'],
      hairstyles: ['Tóc vấn khăn mỏ quạ đen'],
      footwear: ['Guốc mộc quai cong'],
      recommendedColors: ['Nâu non phối yếm đỏ', 'Đen tuyền phối bao tượng xanh'],
      materialsAndMotifs: ['Đũi dệt thô', 'Lụa tơ tằm mềm'],
      traditionalStyling: 'Áo Tứ Thân khoác ngoài yếm đào, thắt bao tượng lụa, đầu vấn khăn mỏ quạ đội nón quai thao.',
      modernRemixAdvice: 'Remix chụp ảnh: Kết hợp áo Tứ Thân vạt ngắn cùng chân váy đen xếp ly hiện đại.',
      avoidCombinations: ['Tránh phối với phụ kiện kim loại tây âu to bản.']
    }
  },
  {
    id: 'cos-ba-ba',
    name: 'Áo Bà Ba (Dân Gian Nam Bộ)',
    slug: 'ao-ba-ba',
    era: 'Thế kỷ 19 - Hiện đại',
    region: 'Đồng bằng Sông Cửu Long (Nam Bộ)',
    gender: 'unisex',
    formality: 'everyday',
    coverImage: '/assets/costumes/ao-ba-ba.jpg',
    lineageCategory: 'dich-chuyen',
    lineageSubcategory: 'ba-ba',
    lineageLabel: 'Hệ Dịch Chuyển • Dân gian miền Nam',
    shortDescription: 'Chiếc áo cánh cổ tròn thanh thoát, xẻ tà hai bên hông với hai túi phía trước, gắn liền với vẻ đẹp bình dị phóng khoáng miền Tây sông nước.',
    historicalContext: 'Xuất hiện phổ biến từ nửa cuối thế kỷ 19 tại Nam Bộ, được cho là cách tân từ trang phục của người Mã Lai - Baba Nyonya hoặc trang phục lao động bản địa để phù hợp với khí hậu nóng ẩm kênh rạch.',
    culturalSignificance: 'Biểu tượng của tính cách chân chất, hiếu khách, bộc trực và hào sảng của con người phương Nam, gắn liền với chiếc khăn rằn và nón lá duyên dáng.',
    isVerifiedHistoricalData: true,
    verificationNote: 'Tư liệu văn hóa dân gian Nam Bộ và hiện vật Bảo tàng Phụ nữ Nam Bộ TP.HCM.',
    components: [
      { id: 'cmp-bb-model', name: 'Người mẫu Nam Bộ mộc mạc', layerOrder: 1, isRequired: true, type: 'inner', description: 'Vẻ đẹp khỏe khoắn chân chất', defaultColor: '#f7ede2' },
      { id: 'cmp-bb-main', name: 'Áo bà ba xẻ tà 2 túi trước', layerOrder: 3, isRequired: true, type: 'main', description: 'Thân áo ôm nhẹ vừa vặn xẻ tà 2 bên hông thoáng mát', defaultColor: '#2a9d8f' },
      { id: 'cmp-bb-pants', name: 'Quần lụa đen ống suông', layerOrder: 2, isRequired: true, type: 'inner', description: 'Quần lụa đen mềm dễ lội nước di chuyển', defaultColor: '#1a1a1a' },
      { id: 'cmp-bb-khan', name: 'Khăn rằn caro đen trắng quấn cổ', layerOrder: 4, isRequired: true, type: 'accessory', description: 'Khăn rằn che nắng thấm mồ hôi đặc trưng', defaultColor: '#2b2d42' }
    ],
    colorVariants: [
      { id: 'col-bb-black', name: 'Đen tuyền miệt vườn', hex: '#1c1917', meaning: 'Chất phác, chịu thương chịu khó', popularity: 'Rất truyền thống' },
      { id: 'col-bb-sky', name: 'Xanh lơ sông nước', hex: '#48cae4', meaning: 'Tươi tắn, phóng khoáng', popularity: 'Du xuân sông nước' }
    ],
    materials: [
      { id: 'mat-bb-lua', name: 'Lụa tơ tằm Nam Bộ & Vải ú', textureType: 'cotton_silk', origin: 'Tân Châu, An Giang', description: 'Lụa lãnh Mỹ A hoặc vải mát lạnh' }
    ],
    accessories: [
      { id: 'acc-bb-nonla', name: 'Nón lá Nam Bộ', category: 'headwear', layerOrder: 5, description: 'Nón lá chóp tròn che nắng', traditionalMeaning: 'Gần gũi mộc mạc', isRecommended: true }
    ],
    details: [
      { id: 'dtl-bb-tui', name: 'Hai túi vuông vạt trước', type: 'hem', description: 'Tiện lợi đựng vật dụng thường ngày' }
    ],
    suitability: [
      { eventId: 'evt-festival', score: 92, label: 'Rất phù hợp', reason: 'Lễ hội sông nước Nam Bộ, đờn ca tài tử và chợ nổi.' },
      { eventId: 'evt-street', score: 90, label: 'Rất phù hợp', reason: 'Mộc mạc, thoải mái khi dạo phố cuối tuần hoặc về miền quê.' }
    ],
    usageConsiderations: ['Mặc cùng quần lụa đen ống suông và quấn khăn rằn ở cổ hoặc đầu.'],
    stylingGuide: {
      accessories: ['Khăn rằn Nam Bộ', 'Nón lá', 'Guốc gỗ'],
      hairstyles: ['Tóc xõa tự nhiên hoặc thắt bím'],
      footwear: ['Guốc mộc hoặc dép quai xuồng'],
      recommendedColors: ['Đen lãnh Mỹ A', 'Xanh ngọc sông Tiền', 'Hồng cánh sen'],
      materialsAndMotifs: ['Lụa Lãnh Mỹ A', 'Vải ú mát mịn'],
      traditionalStyling: 'Áo Bà Ba mặc cùng quần đen, quấn khăn rằn cổ, đội nón lá.',
      modernRemixAdvice: 'Remix dạo phố: Áo Bà Ba lụa màu pastel phối cùng quần culottes trắng và túi cói.',
      avoidCombinations: ['Tránh phối với trang sức vàng kim cương quá rườm rà.']
    }
  }
];

export const INITIAL_BACKGROUNDS: BackgroundSetting[] = [
  {
    id: 'bg-hoang-thanh',
    name: 'Sân đình Hoàng thành Thăng Long',
    description: 'Cửa Đoan Môn gạch vồ rêu phong, mái ngói lưu ly cổ kính ngập ánh bình minh.',
    aesthetic: 'Trang nghiêm & Cổ kính',
    promptDescription: 'ancient Vietnamese imperial palace courtyard with mossy brick gate and classic red curved roof, soft morning golden sunlight, cinematic heritage atmosphere'
  },
  {
    id: 'bg-hue-garden',
    name: 'Nhà vườn & Cố đô Huế',
    description: 'Bình phong chạm rồng, hồ sen ngát hương, cây xanh tĩnh mịch xứ thần kinh.',
    aesthetic: 'Trầm mặc & Quý tộc',
    promptDescription: 'Hue traditional garden house with carved dragon screen, quiet lotus pond, green bonsai trees, gentle misty light, royal Vietnamese tranquil ambiance'
  },
  {
    id: 'bg-hoi-an',
    name: 'Phố cổ Hội An đèn lồng',
    description: 'Tường vàng rực rỡ hoa giấy, đèn lồng ngũ sắc lung linh khi hoàng hôn buông xuống.',
    aesthetic: 'Thơ mộng & Ấm áp',
    promptDescription: 'Hoi An ancient town yellow textured walls, blooming pink bougainvillea flowers, colorful traditional silk lanterns glowing softly at twilight'
  },
  {
    id: 'bg-chua-bac-bo',
    name: 'Chùa cổ Bắc Bộ thanh tịnh',
    description: 'Cây đa, giếng nước, sân đình lát gạch Bát Tràng, khói trầm lan tỏa nhẹ.',
    aesthetic: 'Thanh tịnh & Hoài niệm',
    promptDescription: 'Northern Vietnamese ancient Buddhist temple with aged banyan tree, red brick courtyard, gentle wafts of incense smoke, peaceful cultural sanctuary'
  },
  {
    id: 'bg-studio-modern',
    name: 'Studio Ánh sáng Nghệ thuật',
    description: 'Phông nền màu be tối giản, đổ bóng mềm mại tôn trọn vẹn chất liệu gấm lụa.',
    aesthetic: 'Hiện đại & Tối giản',
    promptDescription: 'contemporary high-end studio portrait background, warm beige textured backdrop, soft diffused fashion studio lighting highlighting silk drapery'
  },
  {
    id: 'bg-street-remix',
    name: 'Giao lộ phố thị hiện đại',
    description: 'Quán cà phê cổ điển giữa lòng phố thị Hà Nội / Sài Gòn rợp bóng xà cừ.',
    aesthetic: 'Năng động & Giao thoa',
    promptDescription: 'stylish modern Vietnamese urban street cafe corner under shady trees, blend of French colonial architecture and contemporary vibrant city vibe'
  }
];

// Persistent Database Management
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'vietphucremix.json');

interface DatabaseSchema {
  events: EventItem[];
  costumes: Costume[];
  backgrounds: BackgroundSetting[];
  drafts: FittingDraft[];
  aiJobs: AIJob[];
}

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      events: INITIAL_EVENTS,
      costumes: INITIAL_COSTUMES,
      backgrounds: INITIAL_BACKGROUNDS,
      drafts: [],
      aiJobs: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const dbData = JSON.parse(content) as DatabaseSchema;
    
    // Always sync canonical costumes, events, backgrounds with latest definitions in codebase while preserving user drafts and aiJobs
    dbData.costumes = INITIAL_COSTUMES;
    dbData.events = INITIAL_EVENTS;
    dbData.backgrounds = INITIAL_BACKGROUNDS;

    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
    return dbData;
  } catch (err) {
    console.error('Error reading database file, recreating initial state:', err);
    const initialDb: DatabaseSchema = {
      events: INITIAL_EVENTS,
      costumes: INITIAL_COSTUMES,
      backgrounds: INITIAL_BACKGROUNDS,
      drafts: [],
      aiJobs: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
}

function saveDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database:', err);
  }
}

export const db = {
  getEvents: (): EventItem[] => ensureDb().events,
  getEventById: (id: string): EventItem | undefined => ensureDb().events.find(e => e.id === id || e.slug === id),

  getCostumes: (eventId?: string, gender?: string, era?: string): Costume[] => {
    let list = ensureDb().costumes;
    if (eventId) {
      list = list.filter(c => c.suitability.some(s => s.eventId === eventId));
    }
    if (gender && gender !== 'all') {
      list = list.filter(c => c.gender === gender || c.gender === 'unisex');
    }
    if (era && era !== 'all') {
      list = list.filter(c => c.era.toLowerCase().includes(era.toLowerCase()));
    }
    return list;
  },

  getCostumeById: (id: string): Costume | undefined => {
    return ensureDb().costumes.find(c => c.id === id || c.slug === id);
  },

  getBackgrounds: (): BackgroundSetting[] => ensureDb().backgrounds,

  getDrafts: (): FittingDraft[] => {
    return ensureDb().drafts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  getDraftById: (id: string): FittingDraft | undefined => {
    return ensureDb().drafts.find(d => d.id === id);
  },

  saveDraft: (draftInput: Partial<FittingDraft>): FittingDraft => {
    const current = ensureDb();
    const now = new Date().toISOString();

    let draft: FittingDraft;
    if (draftInput.id) {
      const idx = current.drafts.findIndex(d => d.id === draftInput.id);
      if (idx >= 0) {
        draft = {
          ...current.drafts[idx],
          ...draftInput,
          updatedAt: now
        } as FittingDraft;
        current.drafts[idx] = draft;
      } else {
        draft = {
          id: draftInput.id,
          title: draftInput.title || 'Bản phác thảo Việt phục mới',
          eventId: draftInput.eventId || 'evt-tet',
          costumeId: draftInput.costumeId || 'cos-nhat-binh',
          modelGender: draftInput.modelGender || 'female',
          modelPose: draftInput.modelPose || 'standing_formal',
          selectedColorId: draftInput.selectedColorId || 'col-nb-red',
          selectedMaterialId: draftInput.selectedMaterialId || 'mat-gam-hue',
          selectedAccessories: draftInput.selectedAccessories || [],
          selectedHairstyle: draftInput.selectedHairstyle || 'Búi tóc đội khăn',
          selectedFootwear: draftInput.selectedFootwear || 'Hài thêu hoa',
          selectedDetails: draftInput.selectedDetails || {},
          selectedBackgroundId: draftInput.selectedBackgroundId || 'bg-hoang-thanh',
          remixStyle: draftInput.remixStyle || 'traditional',
          customPrompt: draftInput.customPrompt || '',
          visibleLayers: draftInput.visibleLayers || {},
          sketchDataUrl: draftInput.sketchDataUrl || '',
          createdAt: now,
          updatedAt: now
        };
        current.drafts.unshift(draft);
      }
    } else {
      draft = {
        id: 'draft-' + crypto.randomUUID().slice(0, 8),
        title: draftInput.title || 'Bản phác thảo Việt phục mới',
        eventId: draftInput.eventId || 'evt-tet',
        costumeId: draftInput.costumeId || 'cos-nhat-binh',
        modelGender: draftInput.modelGender || 'female',
        modelPose: draftInput.modelPose || 'standing_formal',
        selectedColorId: draftInput.selectedColorId || 'col-nb-red',
        selectedMaterialId: draftInput.selectedMaterialId || 'mat-gam-hue',
        selectedAccessories: draftInput.selectedAccessories || [],
        selectedHairstyle: draftInput.selectedHairstyle || 'Búi tóc đội khăn',
        selectedFootwear: draftInput.selectedFootwear || 'Hài thêu hoa',
        selectedDetails: draftInput.selectedDetails || {},
        selectedBackgroundId: draftInput.selectedBackgroundId || 'bg-hoang-thanh',
        remixStyle: draftInput.remixStyle || 'traditional',
        customPrompt: draftInput.customPrompt || '',
        visibleLayers: draftInput.visibleLayers || {},
        sketchDataUrl: draftInput.sketchDataUrl || '',
        createdAt: now,
        updatedAt: now
      };
      current.drafts.unshift(draft);
    }

    saveDb(current);
    return draft;
  },

  deleteDraft: (id: string): boolean => {
    const current = ensureDb();
    const initialLen = current.drafts.length;
    current.drafts = current.drafts.filter(d => d.id !== id);
    if (current.drafts.length !== initialLen) {
      saveDb(current);
      return true;
    }
    return false;
  },

  getAIJobs: (): AIJob[] => {
    return ensureDb().aiJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getAIJobById: (id: string): AIJob | undefined => {
    return ensureDb().aiJobs.find(j => j.id === id);
  },

  createAIJob: (jobInput: Omit<AIJob, 'id' | 'status' | 'progress' | 'createdAt'>): AIJob => {
    const current = ensureDb();
    const newJob: AIJob = {
      ...jobInput,
      id: 'job-' + crypto.randomUUID().slice(0, 8),
      status: 'queued',
      progress: 5,
      createdAt: new Date().toISOString()
    };
    current.aiJobs.unshift(newJob);
    saveDb(current);
    return newJob;
  },

  updateAIJob: (id: string, updates: Partial<AIJob>): AIJob | undefined => {
    const current = ensureDb();
    const idx = current.aiJobs.findIndex(j => j.id === id);
    if (idx >= 0) {
      const updated = { ...current.aiJobs[idx], ...updates };
      current.aiJobs[idx] = updated;
      saveDb(current);
      return updated;
    }
    return undefined;
  }
};
