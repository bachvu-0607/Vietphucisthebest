import type { Costume } from '../../shared/types.ts';

export const aoVienLinh: Costume = {
  "id": "cos-vien-linh",
  "name": "Áo Viên Lĩnh (Cổ Tròn Cung Đình)",
  "slug": "ao-vien-linh",
  "era": "Triều Lý - Trần - Lê (Thế kỷ 11 - 18)",
  "region": "Kinh thành Thăng Long",
  "gender": "unisex",
  "formality": "ceremonial",
  "coverImage": "/assets/costumes/ao-vien-linh.jpg",
  "lineageCategory": "vien-linh",
  "lineageSubcategory": "vien-linh",
  "lineageLabel": "Áo Viên Lĩnh • Cổ tròn cung đình",
  "shortDescription": "Cổ phục cổ tròn cài khuy chéo bên vai hoặc cổ áo, thường dùng làm quan phục triều đình, bào phục hoàng gia uy nghi tôn quý.",
  "historicalContext": "Viên lĩnh, còn gọi đoàn lĩnh, chỉ áo cổ tròn; khảo cứu nêu kiểu cài phía vai phải. Mũ, đai và đồ án trang trí của quan phục phụ thuộc triều đại, chức phận và nghi lễ.",
  "culturalSignificance": "Cổ tròn là đặc điểm kết cấu. Ý nghĩa “Trời tròn” và tính trang trọng của từng bộ phối cần phân biệt với bằng chứng về chế độ y phục; không phải mọi áo cổ tròn đều là lễ phục hoàng gia.",
  "isVerifiedHistoricalData": false,
  "verificationNote": "Đã đối chiếu các thông tin chính trong phạm vi nguồn bên dưới; phụ kiện và màu phối là gợi ý biên tập.",
  "components": [
    {
      "id": "cmp-vl-model",
      "name": "Người mẫu uy nghi",
      "layerOrder": 1,
      "isRequired": true,
      "type": "inner",
      "description": "Thần thái đĩnh đạc quyền uy",
      "defaultColor": "#f7ede2"
    },
    {
      "id": "cmp-vl-inner",
      "name": "Áo trung đơn lót trắng",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Lớp áo lót trong giữ cổ áo ngay ngắn",
      "defaultColor": "#ffffff"
    },
    {
      "id": "cmp-vl-main",
      "name": "Bào phục Viên Lĩnh thêu long phụng",
      "layerOrder": 3,
      "isRequired": true,
      "type": "main",
      "description": "Cổ tròn cài khuy vai vạt áo buông rộng bề thế",
      "defaultColor": "#9e2a2b"
    },
    {
      "id": "cmp-vl-belt",
      "name": "Đai ngọc hoặc đai sừng chạm khắc",
      "layerOrder": 4,
      "isRequired": true,
      "type": "accessory",
      "description": "Đai thắt vòng cung quyền quý",
      "defaultColor": "#d4af37"
    }
  ],
  "colorVariants": [
    {
      "id": "col-vl-crimson",
      "name": "Đỏ son triều nghi",
      "hex": "#9e2a2b",
      "meaning": "Phẩm hàm cao cấp, quyền quý",
      "popularity": "Rất trang trọng"
    },
    {
      "id": "col-vl-purple",
      "name": "Tím quan phẩm",
      "hex": "#5c2d91",
      "meaning": "Thanh nhã và quyền thế",
      "popularity": "Lễ hội lớn"
    }
  ],
  "materials": [
    {
      "id": "mat-vl-gam",
      "name": "Gấm dệt vân mây thời Lý",
      "textureType": "brocade",
      "origin": "Gợi ý gấm vân mây; chưa xác minh một mẫu dệt thời Lý",
      "description": "Dày dặn, giữ phom cổ tròn uy nghiêm"
    }
  ],
  "accessories": [
    {
      "id": "acc-vl-mu",
      "name": "Mũ Phác Đầu hoặc Mũ Ô Sa",
      "category": "headwear",
      "layerOrder": 5,
      "description": "Mũ quan có cánh chuồn hai bên",
      "traditionalMeaning": "Quan tước triều đình",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    }
  ],
  "details": [
    {
      "id": "dtl-vl-co",
      "name": "Cổ áo hình tròn ôm sát cổ",
      "type": "collar",
      "description": "Đặc trưng Viên Lĩnh cài khuy lệch"
    }
  ],
  "suitability": [
    {
      "eventId": "evt-formal",
      "score": 98,
      "label": "Hoàn hảo",
      "reason": "Quan phục cổ tròn trang trọng bậc nhất đại diện cho lịch sử Thăng Long ngàn năm."
    },
    {
      "eventId": "evt-art",
      "score": 94,
      "label": "Hoàn hảo",
      "reason": "Rất uy quyền và ấn tượng khi tái hiện lịch sử trên sân khấu."
    }
  ],
  "usageConsiderations": [
    "Cần kết hợp cùng mũ quan và đai triều đúng quy cách lịch sử.",
    "Màu, vật liệu, phụ kiện và điểm phù hợp sự kiện trong ứng dụng là gợi ý phối hiện nay; không chứng nhận một bộ phục dựng lịch sử."
  ],
  "stylingGuide": {
    "accessories": [
      "Mũ ô sa",
      "Đai ngọc",
      "Hài mũi cong"
    ],
    "hairstyles": [
      "Búi tóc đội mũ quan"
    ],
    "footwear": [
      "Ủng quan triều đình hoặc hài"
    ],
    "recommendedColors": [
      "Đỏ son",
      "Tím thẫm"
    ],
    "materialsAndMotifs": [
      "Gấm rồng mây Lý - Trần"
    ],
    "traditionalStyling": "Áo Viên Lĩnh kết hợp đai ngọc và mũ ô sa.",
    "modernRemixAdvice": "Sử dụng họa tiết cổ tròn cách điệu vào áo khoác dạ tiệc.",
    "avoidCombinations": [
      "Tránh phối cùng trang phục dân dã đường phố."
    ]
  },
  "aiProfile": {
    "constructionDetails": [
      "Vietnamese Viên Lĩnh / Đoàn Lĩnh-inspired robe with a round neckline.",
      "Keep a plausible side/shoulder fastening and a flowing robe silhouette.",
      "Use only selected headwear and motifs; their period and rank require a specific reference."
    ],
    "mandatoryFeatures": [
      "Circular round collar (Viên Lĩnh).",
      "Right shoulder button fastening."
    ],
    "strictProhibitions": [
      "NO V-neck or crossed collar."
    ]
  },
  "research": {
    "status": "partially_reviewed",
    "reviewedAt": "2026-10-10",
    "sources": [
      {
        "sourceId": "ngan-nam-ao-mu",
        "scope": "Định nghĩa đoàn lĩnh/viên lĩnh và cấu trúc cổ tròn.",
        "locator": "Tiểu từ điển trang phục Việt Nam, mục Đoàn lĩnh / Viên lĩnh"
      }
    ],
    "modernUse": "Mẫu hiện có phù hợp tạo hình sân khấu và chụp ảnh. Mũ phác đầu/ô sa, đai và hoa văn trong Studio là tùy chọn minh họa; cần tư liệu đúng thời kỳ khi dựng nhân vật lịch sử.",
    "limitations": [
      "Chưa đối chiếu bộ mũ–áo–đai trong danh mục với một quy chế quan phục cụ thể."
    ]
  }
};
