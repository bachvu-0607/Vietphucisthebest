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
  "shortDescription": "Áo có cổ giao chéo; mẫu Studio dùng vạt trái phủ vạt phải, tay rộng và lớp mặc bên trong, gợi phong cách trang phục thời Lê.",
  "historicalContext": "Giao lĩnh chỉ kiểu cổ giao chéo. Khảo cứu của Trần Quang Đức ghi nhận nhiều dạng áo này trong y phục thời Lê. Mẫu tay rộng trong ứng dụng là một lựa chọn tạo hình, không đại diện mọi tầng lớp và thời kỳ.",
  "culturalSignificance": "Cổ giao chéo giúp nhận diện kết cấu áo. Giao lĩnh xuất hiện trong nhiều cách xếp lớp và bộ phối; cần tư liệu cụ thể để xác định người mặc, niên đại và phụ kiện.",
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
      "name": "Thường / Váy dài trong mẫu phối",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Lớp mặc dưới; độ dài chọn để không giẫm lên gấu.",
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
      "meaning": "Sắc xanh trầm, tạo tương phản với lớp trong sáng màu.",
      "popularity": "Rất trang trọng"
    },
    {
      "id": "col-gl-crimson",
      "name": "Đỏ gạch nung cổ kính",
      "hex": "#9d0208",
      "meaning": "Sắc đỏ đậm, làm nổi bật nẹp hoặc đai khác màu.",
      "popularity": "Biểu diễn & Lễ hội"
    },
    {
      "id": "col-gl-cloud",
      "name": "Trắng mây sương khói",
      "hex": "#edf2f4",
      "meaning": "Sắc sáng nhẹ, dễ phối với đai hoặc lớp áo trầm.",
      "popularity": "Chụp ảnh nghệ thuật"
    }
  ],
  "materials": [
    {
      "id": "mat-gl-to-tam",
      "name": "Tơ tằm dệt sa hạt lựu",
      "textureType": "silk_gauze",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Bay bổng phiêu dật trong gió"
    },
    {
      "id": "mat-gl-gam-the",
      "name": "Vải dệt hoa chìm",
      "textureType": "damask",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Gợi ý bề mặt hoa chìm; chọn độ dày theo dáng áo."
    }
  ],
  "accessories": [
    {
      "id": "acc-gl-dai",
      "name": "Dải lụa thắt đại đai thêu hoa cúc",
      "category": "waist",
      "layerOrder": 4,
      "description": "Buông dài hai dải phía trước ngực",
      "traditionalMeaning": "Dải đai làm rõ bố cục eo và các lớp áo.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-gl-kiem",
      "name": "Kiếm cổ bao da hoặc Tiêu trúc",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Phụ kiện chụp ảnh cổ trang",
      "traditionalMeaning": "Đạo cụ theo ý tưởng bộ ảnh; cần tư liệu nếu gắn với nhân vật lịch sử.",
      "isRecommended": false,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    }
  ],
  "details": [
    {
      "id": "dtl-gl-co",
      "name": "Viền cổ áo màu tương phản",
      "type": "collar",
      "description": "Nẹp làm rõ đường cổ giao chéo."
    }
  ],
  "suitability": [
    {
      "eventId": "evt-festival",
      "score": 98,
      "label": "Hoàn hảo",
      "reason": "Gợi ý tạo hình cổ phục trong lễ hội; phục trang nghi lễ phải theo yêu cầu của ban tổ chức."
    },
    {
      "eventId": "evt-art",
      "score": 96,
      "label": "Hoàn hảo",
      "reason": "Cổ chéo, tay rộng và các lớp áo tạo điểm nhấn sân khấu; kiểm tra độ vướng theo động tác."
    },
    {
      "eventId": "evt-yearbook",
      "score": 88,
      "label": "Rất phù hợp",
      "reason": "Có thể dùng cho bộ ảnh chủ đề cổ phục thời Lê; ghi rõ phạm vi phục dựng."
    },
    {
      "eventId": "evt-tet",
      "score": 80,
      "label": "Phù hợp",
      "reason": "Có thể phối cho du xuân; chọn lớp trong và độ dài phù hợp nơi đến."
    },
    {
      "eventId": "evt-street",
      "score": 35,
      "label": "Cách tân độc đáo",
      "reason": "Mẫu tay rộng và thường dài có thể vướng khi đi bộ; điều chỉnh bộ phối theo hoạt động."
    }
  ],
  "usageConsiderations": [
    "Mẫu Studio dùng vạt trái của người mặc phủ vạt phải; cố định vạt theo dây buộc/cách cài của áo. Ảnh lật gương có thể làm nhầm hướng.",
    "Chọn lớp trong và quần/thường theo bộ phối; áo lót trắng trong Studio là một lựa chọn minh họa, không bắt buộc cho mọi mẫu.",
    "Giữ tay áo, dải đai và gấu áo không mắc vào vật xung quanh khi di chuyển."
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
      "Sa hoặc vải dệt hoa chìm",
      "Hoa văn theo mẫu tham chiếu khi phục dựng"
    ],
    "traditionalStyling": "Giữ cổ giao chéo và cố định vạt để cổ nằm ổn định. Mẫu này dùng vạt trái phủ vạt phải, lớp áo trong và thường dài; quần, thường, đai và đồ đội đầu của một bộ phục dựng phải chọn theo tư liệu thời kỳ cụ thể, không ghép tùy ý thành quan phục.",
    "modernRemixAdvice": "Gợi ý cách tân: giữ đường cổ chéo, thử màu trơn hoặc họa tiết nhẹ, phối quần suông và giày hiện đại. Có thể điều chỉnh độ dài áo hoặc tay cho sinh hoạt thường ngày; nếu biến thành áo khoác mở hoàn toàn thì ghi rõ là thiết kế lấy cảm hứng từ giao lĩnh.",
    "avoidCombinations": [
      "Tránh vạt tuột hoặc đai quá chặt kéo lệch cổ chéo; kiểm tra độ che phủ khi ngồi và cúi.",
      "Không ghép mũ, phù hiệu hoặc hoa văn từ nhiều thời kỳ rồi giới thiệu là một bộ phục dựng đã xác minh.",
      "Khi dự lễ, vào nơi thờ tự hoặc tham gia hoạt động học đường, chọn độ kín và độ dài phù hợp nội quy nơi đến; kiểm tra áo khi ngồi, cúi và giơ tay để tránh lộ ngoài ý muốn."
    ]
  },
  "aiProfile": {
    "constructionDetails": [
      "Vietnamese Giao Lĩnh-inspired crossed-collar robe; this catalogue suggests a Lê-period visual reference, not one verified outfit for all dynasties.",
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
      },
      {
        "sourceId": "mat-son-costumes",
        "scope": "Áo cổ giao chéo như một lớp trong một số bộ trang phục nữ thế kỷ XVII.",
        "locator": "Tr. 28, phần Trang phục."
      },
      {
        "sourceId": "hoang-thanh-layering",
        "scope": "Bộ phối giao lĩnh, quần và thường tại đơn vị cung cấp hiện nay; không xác nhận mọi biến thể lịch sử.",
        "locator": "Mục Hướng dẫn mặc áo Giao Lĩnh dáng dài."
      }
    ],
    "modernUse": "Mẫu phối có thể dùng để chụp ảnh hoặc trình diễn. Đai, ngọc bội, kiếm/tiêu và mũ hiện có là tùy chọn; cần chọn tư liệu cụ thể trước khi gọi bộ phối là phục dựng thời Lê.",
    "limitations": [
      "Chưa đối chiếu từng mẫu mũ, kiếm, đai và hoa văn với một hiện vật hoặc tranh cụ thể."
    ]
  }
};
