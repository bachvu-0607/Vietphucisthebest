import type { EventItem } from '../shared/types.ts';

export const EVENTS: EventItem[] = [
  {
    "id": "evt-tet",
    "name": "Tết & Du Xuân",
    "slug": "tet-du-xuan",
    "category": "seasonal",
    "icon": "Sparkles",
    "description": "Chào đón năm mới, viếng đền chùa linh thiêng và chụp ảnh phố xuân ấm áp sum vầy.",
    "recommendedDressCode": "Có thể chọn áo ngũ thân tay chẽn, áo tấc hoặc áo dài hiện đại; khi đi lễ, xem nội quy nơi đến.",
    "badge": "Phổ biến nhất",
    "imageUrl": "/assets/events/tet-du-xuan.jpg",
    "formalityLevel": "Trang trọng & Hân hoan lễ hội",
    "seasonWeather": "Đầu năm • Kiểm tra thời tiết địa phương trước khi chọn vải và lớp mặc trong."
  },
  {
    "id": "evt-wedding",
    "name": "Lễ Cưới - Hôn Lễ Cổ Truyền",
    "slug": "le-cuoi-co-truyen",
    "category": "life_milestone",
    "icon": "HeartHandshake",
    "description": "Nghi thức dạm ngõ, rước dâu, lễ thành hôn gia tiên tôn vinh nét đẹp văn hóa gia đình Việt.",
    "recommendedDressCode": "Có thể chọn Nhật Bình, áo tấc, ngũ thân hoặc áo dài hiện đại; thống nhất bộ phối và màu sắc với gia đình, người tổ chức.",
    "badge": "Nghi lễ đặc biệt",
    "imageUrl": "/assets/events/le-cuoi.jpg",
    "formalityLevel": "Trang trọng theo nghi thức gia đình",
    "seasonWeather": "Quanh năm • Không gian trong nhà & ngoài trời"
  },
  {
    "id": "evt-formal",
    "name": "Sự Kiện Ngoại Giao - Trang Trọng",
    "slug": "su-kien-trang-trong",
    "category": "state_formal",
    "icon": "Award",
    "description": "Gặp gỡ quốc tế, hội nghị ngoại giao văn hóa, quốc yến và tiếp đãi quan khách danh dự.",
    "recommendedDressCode": "Áo dài hiện đại hoặc ngũ thân có thể là lựa chọn; theo quy định trang phục của ban tổ chức, không mặc định áp quy chế cung đình.",
    "badge": "Sự kiện trang trọng",
    "imageUrl": "/assets/events/ngoai-giao.jpg",
    "formalityLevel": "Theo yêu cầu ban tổ chức",
    "seasonWeather": "Quanh năm • Tính đến nhiệt độ trong hội trường và thời gian di chuyển ngoài trời."
  },
  {
    "id": "evt-art",
    "name": "Biểu Diễn Nghệ Thuật & Sân Khấu",
    "slug": "bieu-dien-nghe-thuat",
    "category": "performance",
    "icon": "Drama",
    "description": "Trình diễn nhã nhạc, ca trù, chèo, tuồng, múa cổ hoặc các liên hoan âm nhạc dân tộc.",
    "recommendedDressCode": "Chọn phục trang theo loại hình, vai diễn và tiết mục; kiểm tra tay áo, tà và phụ kiện khi tập động tác.",
    "badge": "Phục trang biểu diễn",
    "imageUrl": "/assets/events/bieu-dien.jpg",
    "formalityLevel": "Trang trọng & Bay bổng nghệ thuật",
    "seasonWeather": "Quanh năm • Tính đến nhiệt độ, ánh đèn và mức vận động trên sân khấu."
  },
  {
    "id": "evt-festival",
    "name": "Lễ Hội Truyền Thống Khác",
    "slug": "le-hoi-truyen-thong",
    "category": "cultural",
    "icon": "Landmark",
    "description": "Tham dự hội đền Hùng, hội Gióng, hội Lim, các lễ hội dân gian và nghi thức cung đình.",
    "recommendedDressCode": "Chọn bộ phối theo lễ hội và vai trò tham gia; nghi thức cụ thể cần theo hướng dẫn của nơi tổ chức.",
    "badge": "Lễ hội dân gian",
    "imageUrl": "/assets/events/hoi-truyen-thong.jpg",
    "formalityLevel": "Tôn nghiêm đình đền miếu mạo",
    "seasonWeather": "Theo lịch lễ hội • Kiểm tra nắng, mưa và đường đi ngoài trời."
  },
  {
    "id": "evt-yearbook",
    "name": "Chụp Ảnh Kỷ Yếu & Tốt Nghiệp",
    "slug": "chup-anh-ky-yeu",
    "category": "academic",
    "icon": "GraduationCap",
    "description": "Lưu giữ khoảnh khắc thanh xuân rực rỡ bên bạn bè tại Văn Miếu, Hoàng thành hay trường học.",
    "recommendedDressCode": "Áo dài, áo tấc hoặc ngũ thân tay chẽn là những lựa chọn; thống nhất chủ đề và yêu cầu của trường, địa điểm chụp.",
    "badge": "Thanh xuân học đường",
    "imageUrl": "/assets/events/ky-yeu.jpg",
    "formalityLevel": "Thanh lịch & Hoài niệm học trò",
    "seasonWeather": "Theo lịch chụp • Chuẩn bị cho nắng, mưa và thời gian đứng ngoài trời."
  },
  {
    "id": "evt-street",
    "name": "Dạo Phố & Việt Phục Cách Tân",
    "slug": "dao-pho-cach-tan",
    "category": "lifestyle",
    "icon": "Compass",
    "description": "Cà phê cuối tuần, triển lãm bảo tàng, phong cách thường nhật kết hợp phụ kiện hiện đại trẻ trung.",
    "recommendedDressCode": "Ngũ thân tay chẽn hoặc áo dài hiện đại phối quần suông; có thể chọn sneaker, túi tote và phụ kiện phù hợp hoạt động.",
    "badge": "Xu hướng mới",
    "imageUrl": "/assets/events/cach-tan.jpg",
    "formalityLevel": "Năng động & Trẻ trung thường nhật",
    "seasonWeather": "Quanh năm • Chọn độ dày vải và lớp mặc trong theo thời tiết thực tế."
  }
];
