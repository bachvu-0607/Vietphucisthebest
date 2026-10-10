import type { Costume } from '../../shared/types.ts';

export const aoDoiKham: Costume = {
  "id": "cos-doi-kham",
  "name": "Áo Đối Khâm (Cổ Phục Quý Tộc)",
  "slug": "ao-doi-kham",
  "era": "Tư liệu thời Lê; kiểu áo có nhiều biến thể",
  "region": "Bắc Bộ & Trung Bộ",
  "gender": "unisex",
  "formality": "formal",
  "coverImage": "/assets/costumes/ao-nhat-binh-tu-cung.jpg",
  "lineageCategory": "dich-chuyen",
  "lineageSubcategory": "nhat-binh",
  "lineageLabel": "Áo Đối Khâm • Song song (Hệ Dịch Chuyển)",
  "shortDescription": "Chiếc áo khoác cổ dài với hai vạt song song buông thẳng trước ngực, phô diễn trọn vẹn lớp áo ngực thêu hoa bên trong lộng lẫy.",
  "historicalContext": "Đối khâm mô tả hai vạt áo đối nhau ở phía trước. Khảo cứu về tượng thời Lê Trung Hưng ghi nhận áo khoác đối khâm cùng trang phục bên trong. Không thể suy từ một mẫu thành bộ y phục chung cho toàn thời Lý–Trần–Lê.",
  "culturalSignificance": "Hai vạt mở tạo không gian cho lớp áo bên trong và màu phối. Ý nghĩa “ngay thẳng, chính trực” là diễn giải thẩm mỹ của ứng dụng, chưa phải kết luận lịch sử.",
  "isVerifiedHistoricalData": false,
  "verificationNote": "Đã đối chiếu các thông tin chính trong phạm vi nguồn bên dưới; phụ kiện và màu phối là gợi ý biên tập.",
  "components": [
    {
      "id": "cmp-dk-model",
      "name": "Người mẫu Nữ dịu dàng",
      "layerOrder": 1,
      "isRequired": true,
      "type": "inner",
      "description": "Vóc dáng thanh tú truyền thống",
      "defaultColor": "#f7ede2"
    },
    {
      "id": "cmp-dk-inner",
      "name": "Yếm lụa hoặc áo ôm ngực thêu sen",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Lớp yếm mặc bên trong tạo điểm nhấn màu sắc",
      "defaultColor": "#c1121f"
    },
    {
      "id": "cmp-dk-skirt",
      "name": "Váy lụa dài xếp nếp rộng",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Váy quét đất nhẹ nhàng",
      "defaultColor": "#fdf0d5"
    },
    {
      "id": "cmp-dk-main",
      "name": "Áo khoác Đối Khâm hai vạt thẳng",
      "layerOrder": 3,
      "isRequired": true,
      "type": "outer",
      "description": "Hai vạt áo buông song song không cài khuy",
      "defaultColor": "#588157"
    },
    {
      "id": "cmp-dk-acc",
      "name": "Chuỗi kiềng bạc hoặc ngọc đeo cổ",
      "layerOrder": 6,
      "isRequired": false,
      "type": "accessory",
      "description": "Tôn vinh khoảng ngực thanh tao",
      "defaultColor": "#e0e1dd"
    },
    {
      "id": "cmp-dk-shoes",
      "name": "Hài thêu cánh sen",
      "layerOrder": 7,
      "isRequired": false,
      "type": "footwear",
      "description": "Hài mũi nhọn đính ngọc trai",
      "defaultColor": "#780001"
    }
  ],
  "colorVariants": [
    {
      "id": "col-dk-moss",
      "name": "Xanh rêu ngọc bích",
      "hex": "#3a5a40",
      "meaning": "Hài hòa với cỏ cây thiên nhiên, nét thanh lịch cổ xưa",
      "popularity": "Rất thanh tao"
    },
    {
      "id": "col-dk-crimson",
      "name": "Đỏ hồng đào",
      "hex": "#b5179e",
      "meaning": "Duyên dáng, tươi trẻ của tiểu thư khuê các",
      "popularity": "Mùa xuân"
    },
    {
      "id": "col-dk-ivory",
      "name": "Trắng ngà lụa nõn",
      "hex": "#f8f9fa",
      "meaning": "Thuần khiết và siêu thực",
      "popularity": "Chụp concept"
    }
  ],
  "materials": [
    {
      "id": "mat-dk-sa",
      "name": "Sa mỏng dệt tơ bóng mờ",
      "textureType": "gauze",
      "origin": "Vạn Phúc",
      "description": "Mỏng nhẹ, phất phơ theo làn gió"
    },
    {
      "id": "mat-dk-gam",
      "name": "Gấm dệt vân mây hoa lá",
      "textureType": "brocade",
      "origin": "Hà Đông",
      "description": "Sang trọng cho ngày lễ hội lớn"
    }
  ],
  "accessories": [
    {
      "id": "acc-dk-kieng",
      "name": "Kiềng bạc chạm hoa mai",
      "category": "jewelry",
      "layerOrder": 6,
      "description": "Đeo vừa vặn ôm cổ",
      "traditionalMeaning": "Vẻ đẹp tròn đầy viên mãn",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-dk-quat",
      "name": "Quạt tròn lụa dệt hoa phù dung",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Phụ kiện che nghiêng nụ cười duyên",
      "traditionalMeaning": "Khuê các e ấp",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    }
  ],
  "details": [
    {
      "id": "dtl-dk-nep",
      "name": "Nẹp cổ áo viền thêu hoa dây",
      "type": "collar",
      "description": "Chạy dài suốt từ gáy xuống tận gấu áo"
    }
  ],
  "suitability": [
    {
      "eventId": "evt-art",
      "score": 95,
      "label": "Hoàn hảo",
      "reason": "Tạo hình bay bổng, lãng mạn rất thích hợp cho các video ca nhạc cổ phong và múa dân tộc."
    },
    {
      "eventId": "evt-yearbook",
      "score": 90,
      "label": "Rất phù hợp",
      "reason": "Rất tôn dáng nữ sinh, chụp ảnh nhóm nữ vô cùng ăn ý và thơ mộng."
    },
    {
      "eventId": "evt-tet",
      "score": 86,
      "label": "Rất phù hợp",
      "reason": "Sắc xuân ngập tràn khi kết hợp cùng yếm đào rực rỡ."
    },
    {
      "eventId": "evt-wedding",
      "score": 82,
      "label": "Phù hợp",
      "reason": "Lựa chọn ngọt ngào cho dàn phù dâu hoặc tiệc cưới phong cách cổ truyền."
    }
  ],
  "usageConsiderations": [
    "Áo khoác đối khâm không có khuy cài trước, cần buộc dải yếm lót bên trong thật cẩn thận và kín đáo.",
    "Nên chọn màu áo khoác ngoài tương phản hài hòa với màu yếm lót bên trong.",
    "Màu, vật liệu, phụ kiện và điểm phù hợp sự kiện trong ứng dụng là gợi ý phối hiện nay; không chứng nhận một bộ phục dựng lịch sử."
  ],
  "stylingGuide": {
    "accessories": [
      "Kiềng bạc cổ",
      "Trâm cài tóc hoa lưu ly",
      "Quạt tròn lụa thêu hoa"
    ],
    "hairstyles": [
      "Tóc búi cao lộ gáy thanh tú",
      "Tóc tết vương miện đính hoa nhài"
    ],
    "footwear": [
      "Hài gấm mũi sen",
      "Guốc gỗ sơn son thếp vàng"
    ],
    "recommendedColors": [
      "Áo xanh rêu phối yếm đỏ son",
      "Áo trắng ngà phối yếm hồng cánh sen"
    ],
    "materialsAndMotifs": [
      "Sa tơ tằm mềm",
      "Thêu hoa phù dung",
      "Hoa cúc thời Lý"
    ],
    "traditionalStyling": "Yếm thêu hoa lót trong, váy lụa trắng dài xếp ly, khoác áo Đối Khâm buông thả tự nhiên, cổ đeo kiềng bạc.",
    "modernRemixAdvice": "Remix tiệc tối: áo đối khâm sa mỏng khoác ngoài đầm lụa hiện đại. Đây là phối đồ đương đại, không phải một bộ y phục lịch sử đã xác minh.",
    "avoidCombinations": [
      "Tránh để lộ áo lót hiện đại (dây áo nịt ngực) khi mặc yếm.",
      "Tránh phối cùng ba lô thể thao nặng nề."
    ]
  },
  "aiProfile": {
    "constructionDetails": [
      "Vietnamese Đối Khâm-inspired outer robe with two opposing, open front edges.",
      "Keep the front edges parallel, without a crossed Y-collar.",
      "Wear an appropriate inner layer and a long lower garment; use the selected styling rather than claiming one fixed historical ensemble."
    ],
    "mandatoryFeatures": [
      "Two opposing open front panels.",
      "Visible, adequately covered inner layer."
    ],
    "strictProhibitions": [
      "Do not convert the robe into a crossed-collar closure.",
      "Do not invent period-specific court insignia or add unselected accessories."
    ]
  },
  "research": {
    "status": "partially_reviewed",
    "reviewedAt": "2026-10-10",
    "sources": [
      {
        "sourceId": "ngan-nam-ao-mu",
        "scope": "Áo đối khâm trên một số tượng hậu phi thời Lê Trung Hưng.",
        "locator": "Chương III, Trang phục hậu cung, tr. 229–232 (bản 2013)"
      }
    ],
    "modernUse": "Có thể dùng áo đối khâm như lớp khoác khi chụp ảnh hoặc phối cùng trang phục hiện đại. Bộ yếm–váy–kiềng đang có là gợi ý tạo hình; lựa chọn kín đáo và độ dài phù hợp hoàn cảnh.",
    "limitations": [
      "Chưa xác minh bộ phối hiện tại là nguyên bộ y phục quý tộc thời Lý hoặc Trần."
    ]
  }
};
