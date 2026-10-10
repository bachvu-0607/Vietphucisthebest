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
};

export const STYLING_CONTEXT = 'Các màu, chất liệu và phụ kiện dưới đây là lựa chọn phối đồ hiện nay. Ý nghĩa kèm theo là gợi ý diễn giải; bộ phục dựng cần tư liệu về thời kỳ và người mặc cụ thể.';
