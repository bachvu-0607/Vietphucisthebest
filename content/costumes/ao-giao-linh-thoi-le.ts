import type { Costume } from '../../shared/types.ts';

export const aoGiaoLinhThoiLe: Costume = {
  "id": "cos-giao-linh",
  "name": "Áo Giao Lĩnh (Việt Phục Thời Lê)",
  "slug": "ao-giao-linh-thoi-le",
  "era": "Triều Lê Sơ - Lê Trung Hưng (Thế kỷ 15 - 18)",
  "region": "Bắc Bộ (Kinh thành Thăng Long)",
  "gender": "unisex",
  "formality": "ceremonial",
  "coverImage": "/assets/costumes/ao-giao-linh.jpg",
  "lineageCategory": "giao-linh",
  "lineageSubcategory": "giao-linh",
  "lineageLabel": "Áo Giao Lĩnh • Cổ chéo",
  "shortDescription": "Cổ phục cổ xưa với thiết kế cổ áo bắt chéo trước ngực (vạt trái đè lên vạt phải), tay áo thụng dài bay bổng uy nghiêm.",
  "historicalContext": "Giao lĩnh chỉ kiểu cổ giao chéo. Khảo cứu của Trần Quang Đức ghi nhận nhiều dạng áo này trong y phục thời Lê. Mẫu tay rộng trong ứng dụng là một lựa chọn tạo hình, không đại diện mọi tầng lớp và thời kỳ.",
  "culturalSignificance": "Cổ chéo là đặc điểm nhận diện của mẫu này. Những diễn giải về âm dương và phẩm chất người mặc chưa được xác minh thành ý nghĩa bắt buộc của kết cấu áo.",
  "isVerifiedHistoricalData": false,
  "verificationNote": "Đã đối chiếu các thông tin chính trong phạm vi nguồn bên dưới; phụ kiện và màu phối là gợi ý biên tập.",
  "components": [
    {
      "id": "cmp-gl-model",
      "name": "Người mẫu Thần thái Cổ điển",
      "layerOrder": 1,
      "isRequired": true,
      "type": "inner",
      "description": "Thần thái nho nhã trầm mặc ngàn năm",
      "defaultColor": "#f7ede2"
    },
    {
      "id": "cmp-gl-inner",
      "name": "Áo trung đơn trắng",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Áo lót trắng có cổ giao lĩnh lộ ra lớp trong",
      "defaultColor": "#ffffff"
    },
    {
      "id": "cmp-gl-skirt",
      "name": "Thường / Váy dài quét đất",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Váy xếp ly bên dưới tạo dáng uy nghi khi di chuyển",
      "defaultColor": "#2b2d42"
    },
    {
      "id": "cmp-gl-main",
      "name": "Áo Giao Lĩnh vạt chéo rộng",
      "layerOrder": 3,
      "isRequired": true,
      "type": "main",
      "description": "Cổ áo giao chéo viền màu tương phản thanh nhã",
      "defaultColor": "#1b4965"
    },
    {
      "id": "cmp-gl-belt",
      "name": "Đại đai thắt lưng lụa buông dải",
      "layerOrder": 4,
      "isRequired": true,
      "type": "accessory",
      "description": "Dải lụa thắt ngang eo giữ vạt áo và buông dài duyên dáng",
      "defaultColor": "#c1121f"
    },
    {
      "id": "cmp-gl-head",
      "name": "Mũ Đinh Tự hoặc Khăn vấn tóc",
      "layerOrder": 5,
      "isRequired": false,
      "type": "headwear",
      "description": "Đầu đội mũ chữ Đinh hoặc vấn khăn vải mộc",
      "defaultColor": "#000000"
    },
    {
      "id": "cmp-gl-ngoc",
      "name": "Ngọc bội treo ngang hông",
      "layerOrder": 6,
      "isRequired": false,
      "type": "accessory",
      "description": "Ngọc bội chạm hình rồng hoặc hoa cúc",
      "defaultColor": "#bee1e6"
    },
    {
      "id": "cmp-gl-shoes",
      "name": "Hài mây hoặc giày vải đế dày",
      "layerOrder": 7,
      "isRequired": false,
      "type": "footwear",
      "description": "Hài cổ đi êm trên gạch Bát Tràng",
      "defaultColor": "#495057"
    }
  ],
  "colorVariants": [
    {
      "id": "col-gl-indigo",
      "name": "Chàm thẫm Thăng Long",
      "hex": "#1d3557",
      "meaning": "Đậm nét Bắc Bộ ngàn năm văn hiến",
      "popularity": "Rất trang trọng"
    },
    {
      "id": "col-gl-crimson",
      "name": "Đỏ gạch nung cổ kính",
      "hex": "#9d0208",
      "meaning": "Hào khí Đại Việt thời Lê Sơ",
      "popularity": "Biểu diễn & Lễ hội"
    },
    {
      "id": "col-gl-cloud",
      "name": "Trắng mây sương khói",
      "hex": "#edf2f4",
      "meaning": "Thoát tục, thanh khiết của thi nhân xưa",
      "popularity": "Chụp ảnh nghệ thuật"
    }
  ],
  "materials": [
    {
      "id": "mat-gl-to-tam",
      "name": "Tơ tằm dệt sa hạt lựu",
      "textureType": "silk_gauze",
      "origin": "Làng dệt Cổ Đô",
      "description": "Bay bổng phiêu dật trong gió"
    },
    {
      "id": "mat-gl-gam-the",
      "name": "Thao sa gấm mỏng thời Lê",
      "textureType": "damask",
      "origin": "Phục dựng theo tượng chùa",
      "description": "Dày dặn, giữ nếp cổ áo giao chéo thẳng tắp"
    }
  ],
  "accessories": [
    {
      "id": "acc-gl-dai",
      "name": "Dải lụa thắt đại đai thêu hoa cúc",
      "category": "waist",
      "layerOrder": 4,
      "description": "Buông dài hai dải phía trước ngực",
      "traditionalMeaning": "Khí khái và trật tự",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-gl-kiem",
      "name": "Kiếm cổ bao da hoặc Tiêu trúc",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Phụ kiện chụp ảnh cổ trang",
      "traditionalMeaning": "Văn võ toàn tài",
      "isRecommended": false,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    }
  ],
  "details": [
    {
      "id": "dtl-gl-co",
      "name": "Viền cổ áo màu tương phản (Tố lĩnh)",
      "type": "collar",
      "description": "Làm nổi bật đường chéo giao hòa âm dương"
    }
  ],
  "suitability": [
    {
      "eventId": "evt-festival",
      "score": 98,
      "label": "Hoàn hảo",
      "reason": "Hoàn hảo cho các lễ hội tưởng niệm vua Lê, đền Hùng, chùa cổ Bắc Bộ."
    },
    {
      "eventId": "evt-art",
      "score": 96,
      "label": "Hoàn hảo",
      "reason": "Rất ăn ảnh, tà áo và dải đai bay bổng cực kỳ ấn tượng trên sân khấu nghệ thuật."
    },
    {
      "eventId": "evt-yearbook",
      "score": 88,
      "label": "Rất phù hợp",
      "reason": "Mang đến bộ ảnh phong cách cổ phong Thăng Long khác biệt và đậm chất điện ảnh."
    },
    {
      "eventId": "evt-tet",
      "score": 80,
      "label": "Phù hợp",
      "reason": "Thích hợp đi lễ đền chùa trang nghiêm ngày đầu năm."
    },
    {
      "eventId": "evt-street",
      "score": 35,
      "label": "Cách tân độc đáo",
      "reason": "Tà áo quá dài và quét đất, chỉ nên mặc khi chụp ảnh có hỗ trợ viên."
    }
  ],
  "usageConsiderations": [
    "Mẫu Studio sử dụng vạt trái phủ vạt phải. Khi phục dựng cần đối chiếu cách mặc trong tư liệu cụ thể, không suy diễn ý nghĩa tang lễ cho mọi trường hợp.",
    "Cần có áo lót trung đơn màu trắng bên trong để tôn viền cổ áo.",
    "Màu, vật liệu, phụ kiện và điểm phù hợp sự kiện trong ứng dụng là gợi ý phối hiện nay; không chứng nhận một bộ phục dựng lịch sử."
  ],
  "stylingGuide": {
    "accessories": [
      "Đại đai lụa thắt eo",
      "Ngọc bội treo hông",
      "Quạt nan tròn thêu sen",
      "Mũ chữ Đinh"
    ],
    "hairstyles": [
      "Tóc búi cao cài trâm gỗ",
      "Tóc xõa tự nhiên buông dải lụa"
    ],
    "footwear": [
      "Hài vải đế mây",
      "Guốc mộc Bắc Bộ quai ngang"
    ],
    "recommendedColors": [
      "Xanh chàm phối đai đỏ son",
      "Trắng ngà phối đai xanh lam"
    ],
    "materialsAndMotifs": [
      "Sa dệt hoa cúc dây thời Lê",
      "Họa tiết mây cuộn Đại Việt"
    ],
    "traditionalStyling": "Áo Giao Lĩnh phủ ngoài thường xếp ly, thắt đai lụa ngang eo, đầu búi tóc cài trâm sừng hoặc kim loại, chân mang hài mây.",
    "modernRemixAdvice": "Remix sân khấu: áo giao lĩnh ngắn vạt khoác ngoài áo thun trơn và quần suông tối màu. Ghi rõ đây là cách tân, không dùng làm mẫu phục dựng.",
    "avoidCombinations": [
      "Giữ hướng cổ chéo nhất quán với mẫu phối đã chọn; ảnh bị lật gương có thể gây nhầm hướng vạt.",
      "Tránh mang phụ kiện đồ nhựa phát sáng hay kính râm tráng gương."
    ]
  },
  "aiProfile": {
    "constructionDetails": [
      "Authentic Vietnamese historical Áo Giao Lĩnh (Lý, Trần, Lê Dynasty crossed-collar robe).",
      "Crossed Y-shaped collar construction where the left lapel wraps over the right (vạt trái đè vạt phải).",
      "Tied at the right waist with a traditional soft fabric sash (dây bao / thắt lưng lụa).",
      "Flowing wide sleeves and historical layered under-robes with delicate silk drape."
    ],
    "mandatoryFeatures": [
      "Crossed Y-collar wrapping left over right.",
      "Fabric waist sash.",
      "Flowing historical silhouette."
    ],
    "strictProhibitions": [
      "DO NOT give it a Japanese kimono printed pattern or samurai hakama pants.",
      "Must strictly preserve Vietnamese historical textile patterns and cut."
    ]
  },
  "research": {
    "status": "partially_reviewed",
    "reviewedAt": "2026-10-10",
    "sources": [
      {
        "sourceId": "ngan-nam-ao-mu",
        "scope": "Các dạng giao lĩnh trong y phục thời Lê.",
        "locator": "Chương III, phần Trang phục dân gian, tr. 240–243 (bản 2013)"
      }
    ],
    "modernUse": "Mẫu phối có thể dùng để chụp ảnh hoặc trình diễn. Đai, ngọc bội, kiếm/tiêu và mũ hiện có là tùy chọn; cần chọn tư liệu cụ thể trước khi gọi bộ phối là phục dựng thời Lê.",
    "limitations": [
      "Chưa đối chiếu từng mẫu mũ, kiếm, đai và hoa văn với một hiện vật hoặc tranh cụ thể."
    ]
  }
};
