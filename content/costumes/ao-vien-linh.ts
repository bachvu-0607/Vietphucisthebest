import type { Costume } from '../../shared/types.ts';

export const aoVienLinh: Costume = {
  "id": "cos-vien-linh",
  "name": "Áo Viên Lĩnh (Cổ Tròn)",
  "slug": "ao-vien-linh",
  "era": "Chưa xác định niên đại của mẫu phối",
  "region": "Kinh thành Thăng Long",
  "gender": "unisex",
  "formality": "ceremonial",
  "coverImage": "/assets/costumes/ao-vien-linh.jpg",
  "lineageCategory": "vien-linh",
  "lineageSubcategory": "vien-linh",
  "lineageLabel": "Áo Viên Lĩnh • Cổ tròn",
  "shortDescription": "Áo cổ tròn, mẫu Studio cài lệch phía vai phải; mũ, đai và hoa văn cần chọn theo từng bộ phối, không phải mọi viên lĩnh đều là quan phục.",
  "historicalContext": "Viên lĩnh, còn gọi đoàn lĩnh, chỉ áo cổ tròn; khảo cứu nêu kiểu cài phía vai phải. Mũ, đai và đồ án trang trí của quan phục phụ thuộc triều đại, chức phận và nghi lễ.",
  "culturalSignificance": "Viên lĩnh gọi theo kiểu cổ tròn. Tính chất quan phục hay thường phục phải xét cả bộ y phục và tư liệu; kiểu cổ tự nó không xác định địa vị hoặc nghi lễ.",
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
      "name": "Thân áo viên lĩnh cổ tròn",
      "layerOrder": 3,
      "isRequired": true,
      "type": "main",
      "description": "Cổ tròn cài lệch; hoa văn trong Studio là minh họa, không xác nhận quan phẩm.",
      "defaultColor": "#9e2a2b"
    },
    {
      "id": "cmp-vl-belt",
      "name": "Đai ngọc hoặc đai sừng chạm khắc",
      "layerOrder": 4,
      "isRequired": true,
      "type": "accessory",
      "description": "Đai trong mẫu phối; tránh siết làm dúm thân áo.",
      "defaultColor": "#d4af37"
    }
  ],
  "colorVariants": [
    {
      "id": "col-vl-crimson",
      "name": "Đỏ son",
      "hex": "#9e2a2b",
      "meaning": "Sắc đỏ nổi bật; quan phẩm không xác định chỉ bằng màu này.",
      "popularity": "Rất trang trọng"
    },
    {
      "id": "col-vl-purple",
      "name": "Tím thẫm",
      "hex": "#5c2d91",
      "meaning": "Sắc tím trầm, có thể phối với đai sáng màu.",
      "popularity": "Lễ hội lớn"
    }
  ],
  "materials": [
    {
      "id": "mat-vl-gam",
      "name": "Gấm dệt vân mây",
      "textureType": "brocade",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
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
      "traditionalMeaning": "Đồ đội đầu trong mẫu phối; tên mũ không đủ xác định một bộ quan phục.",
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
      "reason": "Mẫu cổ tròn có thể tạo vẻ trang trọng; không mặc định phải mặc quan phục cho sự kiện ngoại giao."
    },
    {
      "eventId": "evt-art",
      "score": 94,
      "label": "Hoàn hảo",
      "reason": "Có thể dùng khi tạo hình sân khấu; nhân vật lịch sử cần bộ mũ–áo–đai theo tư liệu."
    }
  ],
  "usageConsiderations": [
    "Giữ cổ tròn và vị trí cài của mẫu áo ngay ngắn; đai không nên kéo dúm thân áo.",
    "Mũ quan, đai và đồ án phẩm cấp chỉ cần khi dựng một bộ quan phục cụ thể; kiểu cổ tròn tự nó không xác định chức tước."
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
      "Gấm vân mây hoặc vải trơn; đồ án quan phục cần mẫu tham chiếu"
    ],
    "traditionalStyling": "Giữ cổ tròn, cách cài lệch và thân áo theo mẫu tham chiếu; chọn lớp trong và quần/thường đi kèm. Nếu dựng quan phục, mũ, đai, màu và đồ án trang trí phải thuộc cùng thời kỳ và chức phận. Không mặc định mọi áo viên lĩnh đều phối mũ ô sa hoặc thêu rồng.",
    "modernRemixAdvice": "Gợi ý cách tân: giữ cổ tròn và cách cài lệch của mẫu, giảm hoa văn, phối quần suông hoặc chân váy và phụ kiện hiện đại. Không cần thêm mũ quan. Nếu biến kết cấu thành áo khoác dạ tiệc, mô tả rõ là thiết kế lấy cảm hứng từ viên lĩnh.",
    "avoidCombinations": [
      "Tránh cổ quá chật hoặc đai siết mạnh làm mất dáng áo và khó cử động.",
      "Không gắn mũ, bổ tử hay đồ án rồng bất kỳ rồi khẳng định đó là quan phục đúng triều đại.",
      "Khi dự lễ, vào nơi thờ tự hoặc tham gia hoạt động học đường, chọn độ kín và độ dài phù hợp nội quy nơi đến; kiểm tra áo khi ngồi, cúi và giơ tay để tránh lộ ngoài ý muốn."
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
      },
      {
        "sourceId": "hoang-thanh-layering",
        "scope": "Một cách phối viên lĩnh hiện nay với lớp giao lĩnh trong và áo đối khâm ngoài; không xác nhận phẩm cấp.",
        "locator": "Mục Hướng dẫn mặc áo Giao Lĩnh/Viên Lĩnh x Đối khâm."
      }
    ],
    "modernUse": "Mẫu hiện có phù hợp tạo hình sân khấu và chụp ảnh. Mũ phác đầu/ô sa, đai và hoa văn trong Studio là tùy chọn minh họa; cần tư liệu đúng thời kỳ khi dựng nhân vật lịch sử.",
    "limitations": [
      "Chưa đối chiếu bộ mũ–áo–đai trong danh mục với một quy chế quan phục cụ thể."
    ]
  }
};
