import type { EventItem } from '../shared/types.ts';

export const EVENTS: EventItem[] = [
  {
    "id": "evt-tet",
    "name": "Tết & Du Xuân",
    "slug": "tet-du-xuan",
    "category": "seasonal",
    "icon": "Sparkles",
    "description": "Chào đón năm mới, viếng đền chùa linh thiêng và chụp ảnh phố xuân ấm áp sum vầy.",
    "recommendedDressCode": "Áo Tấc tươi sáng, Áo Ngũ Thân tay chẽn hoặc Áo Dài cổ phục thanh tao.",
    "badge": "Phổ biến nhất",
    "imageUrl": "/assets/events/tet-du-xuan.jpg",
    "formalityLevel": "Trang trọng & Hân hoan lễ hội",
    "seasonWeather": "Mùa Xuân • Se lạnh hoặc mát mẻ (18°C - 24°C)"
  },
  {
    "id": "evt-wedding",
    "name": "Lễ Cưới - Hôn Lễ Cổ Truyền",
    "slug": "le-cuoi-co-truyen",
    "category": "life_milestone",
    "icon": "HeartHandshake",
    "description": "Nghi thức dạm ngõ, rước dâu, lễ thành hôn gia tiên tôn vinh nét đẹp văn hóa gia đình Việt.",
    "recommendedDressCode": "Áo Nhật Bình sắc đỏ/hoàng yến cho cô dâu, Áo Tấc hoặc Áo Ngũ Thân lục/xanh thẫm cho chú rể.",
    "badge": "Nghi lễ đặc biệt",
    "imageUrl": "/assets/events/le-cuoi.jpg",
    "formalityLevel": "Trang nghiêm tối thượng gia tiên",
    "seasonWeather": "Quanh năm • Không gian trong nhà & ngoài trời"
  },
  {
    "id": "evt-formal",
    "name": "Sự Kiện Ngoại Giao - Trang Trọng",
    "slug": "su-kien-trang-trong",
    "category": "state_formal",
    "icon": "Award",
    "description": "Gặp gỡ quốc tế, hội nghị ngoại giao văn hóa, quốc yến và tiếp đãi quan khách danh dự.",
    "recommendedDressCode": "Áo Tấc chuẩn quy chế triều Nguyễn, may bằng gấm thượng hạng, khăn đóng chỉnh tề.",
    "badge": "Đẳng cấp quốc phục",
    "imageUrl": "/assets/events/ngoai-giao.jpg",
    "formalityLevel": "Quốc lễ & Ngoại giao đỉnh cao",
    "seasonWeather": "Quanh năm • Hội trường & Sảnh khánh tiết máy lạnh"
  },
  {
    "id": "evt-art",
    "name": "Biểu Diễn Nghệ Thuật & Sân Khấu",
    "slug": "bieu-dien-nghe-thuat",
    "category": "performance",
    "icon": "Drama",
    "description": "Trình diễn nhã nhạc, ca trù, chèo, tuồng, múa cổ hoặc các liên hoan âm nhạc dân tộc.",
    "recommendedDressCode": "Trang phục hoa văn thêu tinh xảo, tà áo bay bổng, phụ kiện nổi bật trên sân khấu.",
    "badge": "Nghệ thuật thính phòng",
    "imageUrl": "/assets/events/bieu-dien.jpg",
    "formalityLevel": "Trang trọng & Bay bổng nghệ thuật",
    "seasonWeather": "Quanh năm • Ánh sáng sân khấu biểu diễn"
  },
  {
    "id": "evt-festival",
    "name": "Lễ Hội Truyền Thống Khác",
    "slug": "le-hoi-truyen-thong",
    "category": "cultural",
    "icon": "Landmark",
    "description": "Tham dự hội đền Hùng, hội Gióng, hội Lim, các lễ hội dân gian và nghi thức cung đình.",
    "recommendedDressCode": "Áo Giao Lĩnh, Áo Đối Khâm, Áo Tấc trang nghiêm đúng lễ tiết phụng tự.",
    "badge": "Lễ hội dân gian",
    "imageUrl": "/assets/events/hoi-truyen-thong.jpg",
    "formalityLevel": "Tôn nghiêm đình đền miếu mạo",
    "seasonWeather": "Mùa Xuân - Thu • Tiết trời khô ráo ngoài trời"
  },
  {
    "id": "evt-yearbook",
    "name": "Chụp Ảnh Kỷ Yếu & Tốt Nghiệp",
    "slug": "chup-anh-ky-yeu",
    "category": "academic",
    "icon": "GraduationCap",
    "description": "Lưu giữ khoảnh khắc thanh xuân rực rỡ bên bạn bè tại Văn Miếu, Hoàng thành hay trường học.",
    "recommendedDressCode": "Áo Tấc ngũ thân tay thụng, Áo Ngũ Thân chẽn tay tone màu nhã nhặn hoài niệm.",
    "badge": "Thanh xuân học đường",
    "imageUrl": "/assets/events/ky-yeu.jpg",
    "formalityLevel": "Thanh lịch & Hoài niệm học trò",
    "seasonWeather": "Mùa Thu - Hè • Ban ngày nắng nhẹ di tích cổ"
  },
  {
    "id": "evt-street",
    "name": "Dạo Phố & Việt Phục Cách Tân",
    "slug": "dao-pho-cach-tan",
    "category": "lifestyle",
    "icon": "Compass",
    "description": "Cà phê cuối tuần, triển lãm bảo tàng, phong cách thường nhật kết hợp phụ kiện hiện đại trẻ trung.",
    "recommendedDressCode": "Áo Ngũ Thân chẽn vạt ngắn, phối cùng quần suông, giày sneaker hoặc túi tote hiện đại.",
    "badge": "Xu hướng mới",
    "imageUrl": "/assets/events/cach-tan.jpg",
    "formalityLevel": "Năng động & Trẻ trung thường nhật",
    "seasonWeather": "Thời tiết mát mẻ cuối tuần dạo phố"
  }
];
