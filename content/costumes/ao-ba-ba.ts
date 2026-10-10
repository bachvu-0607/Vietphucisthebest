import type { Costume } from '../../shared/types.ts';

export const aoBaBa: Costume = {
  "id": "cos-ba-ba",
  "name": "Áo Bà Ba (Dân Gian Nam Bộ)",
  "slug": "ao-ba-ba",
  "era": "Nam Bộ truyền thống - Đương đại",
  "region": "Đồng bằng Sông Cửu Long (Nam Bộ)",
  "gender": "unisex",
  "formality": "everyday",
  "coverImage": "/assets/costumes/ao-ba-ba.jpg",
  "lineageCategory": "dich-chuyen",
  "lineageSubcategory": "ba-ba",
  "lineageLabel": "Hệ Dịch Chuyển • Dân gian miền Nam",
  "shortDescription": "Chiếc áo cánh cổ tròn thanh thoát, xẻ tà hai bên hông với hai túi phía trước, gắn liền với vẻ đẹp bình dị phóng khoáng miền Tây sông nước.",
  "historicalContext": "Áo Bà Ba gắn với đời sống Nam Bộ, có hàng cúc trước và phom gọn thuận tiện cử động. Nguồn gốc tên gọi và mốc xuất hiện còn có nhiều cách giải thích; danh mục chưa đủ chứng cứ để chốt giả thuyết Penang hay Baba–Nyonya.",
  "culturalSignificance": "Trong văn hóa hiện nay, áo bà ba thường gợi sự gần gũi với đời sống phương Nam. Khăn rằn và nón lá có thể phối kèm, không phải thành phần bắt buộc của mọi bộ.",
  "isVerifiedHistoricalData": false,
  "verificationNote": "Mô tả khái quát phục vụ phối đồ; phần nguồn gốc cần bổ sung tư liệu.",
  "components": [
    {
      "id": "cmp-bb-model",
      "name": "Người mẫu Nam Bộ mộc mạc",
      "layerOrder": 1,
      "isRequired": true,
      "type": "inner",
      "description": "Vẻ đẹp khỏe khoắn chân chất",
      "defaultColor": "#f7ede2"
    },
    {
      "id": "cmp-bb-main",
      "name": "Áo bà ba xẻ tà 2 túi trước",
      "layerOrder": 3,
      "isRequired": true,
      "type": "main",
      "description": "Thân áo ôm nhẹ vừa vặn xẻ tà 2 bên hông thoáng mát",
      "defaultColor": "#2a9d8f"
    },
    {
      "id": "cmp-bb-pants",
      "name": "Quần lụa đen ống suông",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Quần lụa đen mềm dễ lội nước di chuyển",
      "defaultColor": "#1a1a1a"
    },
    {
      "id": "cmp-bb-khan",
      "name": "Khăn rằn caro đen trắng quấn cổ",
      "layerOrder": 4,
      "isRequired": true,
      "type": "accessory",
      "description": "Khăn rằn che nắng thấm mồ hôi đặc trưng",
      "defaultColor": "#2b2d42"
    }
  ],
  "colorVariants": [
    {
      "id": "col-bb-black",
      "name": "Đen tuyền miệt vườn",
      "hex": "#1c1917",
      "meaning": "Chất phác, chịu thương chịu khó",
      "popularity": "Rất truyền thống"
    },
    {
      "id": "col-bb-sky",
      "name": "Xanh lơ sông nước",
      "hex": "#48cae4",
      "meaning": "Tươi tắn, phóng khoáng",
      "popularity": "Du xuân sông nước"
    }
  ],
  "materials": [
    {
      "id": "mat-bb-lua",
      "name": "Lụa tơ tằm Nam Bộ & Vải ú",
      "textureType": "cotton_silk",
      "origin": "Tân Châu, An Giang",
      "description": "Lụa lãnh Mỹ A hoặc vải mát lạnh"
    }
  ],
  "accessories": [
    {
      "id": "acc-bb-nonla",
      "name": "Nón lá Nam Bộ",
      "category": "headwear",
      "layerOrder": 5,
      "description": "Nón lá chóp tròn che nắng",
      "traditionalMeaning": "Gần gũi mộc mạc",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    }
  ],
  "details": [
    {
      "id": "dtl-bb-tui",
      "name": "Hai túi vuông vạt trước",
      "type": "hem",
      "description": "Tiện lợi đựng vật dụng thường ngày"
    }
  ],
  "suitability": [
    {
      "eventId": "evt-festival",
      "score": 92,
      "label": "Rất phù hợp",
      "reason": "Lễ hội sông nước Nam Bộ, đờn ca tài tử và chợ nổi."
    },
    {
      "eventId": "evt-street",
      "score": 90,
      "label": "Rất phù hợp",
      "reason": "Mộc mạc, thoải mái khi dạo phố cuối tuần hoặc về miền quê."
    }
  ],
  "usageConsiderations": [
    "Mặc cùng quần lụa đen ống suông và quấn khăn rằn ở cổ hoặc đầu.",
    "Màu, vật liệu, phụ kiện và điểm phù hợp sự kiện trong ứng dụng là gợi ý phối hiện nay; không chứng nhận một bộ phục dựng lịch sử."
  ],
  "stylingGuide": {
    "accessories": [
      "Khăn rằn Nam Bộ",
      "Nón lá",
      "Guốc gỗ"
    ],
    "hairstyles": [
      "Tóc xõa tự nhiên hoặc thắt bím"
    ],
    "footwear": [
      "Guốc mộc hoặc dép quai xuồng"
    ],
    "recommendedColors": [
      "Đen lãnh Mỹ A",
      "Xanh ngọc sông Tiền",
      "Hồng cánh sen"
    ],
    "materialsAndMotifs": [
      "Lụa Lãnh Mỹ A",
      "Vải ú mát mịn"
    ],
    "traditionalStyling": "Áo Bà Ba mặc cùng quần đen, quấn khăn rằn cổ, đội nón lá.",
    "modernRemixAdvice": "Remix dạo phố: Áo Bà Ba lụa màu pastel phối cùng quần culottes trắng và túi cói.",
    "avoidCombinations": [
      "Tránh phối với trang sức vàng kim cương quá rườm rà."
    ]
  },
  "aiProfile": {
    "constructionDetails": [
      "Authentic Southern Vietnamese traditional Áo Bà Ba.",
      "Simple collarless round neck, buttoned straight down the center front with delicate fabric or pearl buttons.",
      "Tailored side slits at the waist, two small lower front pockets.",
      "Worn over comfortable trousers. Add Khăn rằn or a nón lá only when included in the selected styling."
    ],
    "mandatoryFeatures": [
      "Center-front button opening.",
      "Simple neckline and a practical, comfortable silhouette."
    ],
    "strictProhibitions": [
      "NO royal court headdress."
    ]
  },
  "research": {
    "status": "needs_review",
    "reviewedAt": "2026-10-10",
    "sources": [],
    "modernUse": "Mặc với quần dài thoải mái, chọn chất liệu theo hoạt động và thời tiết. Màu pastel, quần culottes, túi cói và khăn rằn là các lựa chọn phối đương đại.",
    "limitations": [
      "Cần bổ sung nguồn bảo tàng hoặc nghiên cứu về niên đại và nguồn gốc tên gọi; chưa đánh dấu phần này là đã kiểm chứng."
    ]
  }
};
