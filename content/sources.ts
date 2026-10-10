import type { ContentSource } from '../shared/types.ts';

// A source validates only the scope named in a garment's research.sources.
// Book links point to bibliographic records; locator points to the passage consulted.
export const CONTENT_SOURCES: Record<string, ContentSource> = {
  'nhat-binh-hai': {
    id: 'nhat-binh-hai',
    title: 'Áo Nhật bình – Di sản văn hóa quý của Cố đô Huế (2022)',
    author: 'TS. Phan Thanh Hải',
    publisher: 'Tạp chí Thế giới Di sản',
    url: 'https://thegioidisan.vn/vi/ao-nhat-binh-di-san-van-hoa-quy-cua-co-do-hue.html',
  },
  'nhat-binh-modern': {
    id: 'nhat-binh-modern',
    title: 'Di sản văn hóa và sự phục hưng trong đời sống hiện đại của áo Nhật Bình',
    author: 'Trần Ngọc Diễm Hằng',
    publisher: 'Trường Đại học Sư phạm Nghệ thuật Trung ương',
    url: 'https://spnttw.edu.vn/dao-tao/di-san-van-hoa-va-su-phuc-hung-trong-doi-song-hien-dai-cua-ao-nhat-binh/',
  },
  'hue-aodai': {
    id: 'hue-aodai',
    title: 'Di sản văn hóa phi vật thể quốc gia “Tri thức may, mặc Áo dài Huế” (2024)',
    author: 'Sở Văn hóa và Thể thao Thừa Thiên Huế',
    publisher: 'Cổng thông tin Sở Văn hóa và Thể thao Huế',
    url: 'https://svhttdl.hue.gov.vn/tin-trong-tinh/le-don-nhan-danh-hieu-di-san-van-hoa-phi-vat-the-quoc-gia-tri-thuc-may-mac-ao-dai-hue.html',
  },
  'hcmute-2024': {
    id: 'hcmute-2024',
    title: 'Nghiên cứu và thiết kế áo ngũ thân tay chẽn cho nữ (2024)',
    author: 'Nguyễn Thị Tuyết Trinh',
    publisher: 'Trường Đại học Sư phạm Kỹ thuật TP.HCM',
    url: 'https://fgtfd.hcmute.edu.vn/Resources/Docs/SubDomain/fgtfd/T%E1%BA%ADp%20san%20FFT/Issue%201%20%282024%29.pdf',
  },
  'ngan-nam-ao-mu': {
    id: 'ngan-nam-ao-mu',
    title: 'Ngàn năm áo mũ (2013) – thông tin sách',
    author: 'Trần Quang Đức',
    publisher: 'NXB Thế giới / Nhã Nam; hồ sơ sách tại Bảo tàng Lịch sử Quốc gia',
    url: 'https://baotanglichsu.vn/VI/Articles/3129/14969/ngan-nam-ao-mu.html',
  },
  'si-hoang-lemur': {
    id: 'si-hoang-lemur',
    title: 'Sĩ Hoàng: “Áo dài Le Mur từng là cách tân ngoạn mục” (2019)',
    author: 'Nhà thiết kế Sĩ Hoàng (phỏng vấn)',
    publisher: 'VnExpress',
    url: 'https://vnexpress.net/si-hoang-ao-dai-le-mur-tung-la-cach-tan-ngoan-muc-3861947.html',
  },
  'hoi-lim': {
    id: 'hoi-lim',
    title: 'Du khách nhộn nhịp trẩy hội Lim vùng Kinh Bắc ngày đầu năm mới (2016)',
    author: 'VTV',
    publisher: 'Đài Truyền hình Việt Nam',
    url: 'https://vtv.vn/trong-nuoc/du-khach-nhon-nhip-tray-hoi-lim-vung-kinh-bac-ngay-dau-nam-moi-20160220143353108.htm',
  },
  'mat-son-costumes': {
    id: 'mat-son-costumes',
    title: 'Trang phục hoàng hậu – phi tần trên nhóm tượng cổ chùa Mật Sơn – Thanh Hóa (2014)',
    author: 'Nguyễn Thị Thu Hà',
    publisher: 'Tạp chí Di sản văn hóa, số 3 (48), tr. 27–30',
    url: 'https://dsvh.gov.vn/Upload/files/Tap%20chi%20DSVH/So%2048/4806_Trang%20phuc%20hoang%20hau%20phi%20tan%20tren%20nhom%20tuong%20co%20chua%20Mat%20Son.pdf',
  },
  'hoang-thanh-layering': {
    id: 'hoang-thanh-layering',
    title: 'Hướng dẫn mặc Giao lĩnh – Viên lĩnh – Đối khâm',
    author: 'Việt Phục Hoàng Thành',
    publisher: 'Đơn vị cung cấp trang phục Việt Phục Hoàng Thành',
    url: 'https://vietphuchoangthanh.com/vien-linh-giao-linh/',
  },
  'nhat-binh-fitting': {
    id: 'nhat-binh-fitting',
    title: 'Nhật Bình: phom áo và bộ phối tại Việt Phục Hoàng Thành',
    author: 'Việt Phục Hoàng Thành',
    publisher: 'Đơn vị cung cấp trang phục Việt Phục Hoàng Thành',
    url: 'https://vietphuchoangthanh.com/nhat-binh/',
  },
  'hoi-an-ba-ba': {
    id: 'hoi-an-ba-ba',
    title: 'Quần chân con và áo bà ba (2014)',
    author: 'Lê Thị Tuấn',
    publisher: 'Bản tin Bảo tồn Di sản Hội An, số 03 (27)',
    url: 'https://hoianheritage.net/uploads/download/thi-tuan-quan-chan-con-va-ao-ba-ba.pdf',
  },
};

export const STYLING_CONTEXT = 'Phối theo phom truyền thống chú trọng kết cấu và cách mặc của mẫu áo. Gợi ý cách tân dưới đây là đề xuất biên tập, có thể đổi màu, chất liệu và phụ kiện; khi thay đổi kết cấu cần nói rõ là thiết kế lấy cảm hứng. Lưu ý dựa trên độ vừa, độ che phủ, khả năng cử động và hoàn cảnh sử dụng, không cấm chung một loại trang sức hay giày.';
