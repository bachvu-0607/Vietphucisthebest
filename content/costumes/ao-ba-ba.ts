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
  "verificationNote": "Có tư liệu tham khảo về kiểu áo và biến thể tại Hội An; nguồn gốc chung và nguyên bộ Nam Bộ còn cần đối chiếu.",
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
      "description": "Quần dài ống suông, đủ rộng để ngồi và bước đi.",
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
      "meaning": "Màu tối, dễ phối với quần cùng màu hoặc màu sáng.",
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
      "name": "Lụa hoặc cotton dệt trơn",
      "textureType": "cotton_silk",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Chọn độ dày, độ thoáng và độ rủ phù hợp hoạt động; mẫu minh họa không xác nhận là lãnh Mỹ A."
    }
  ],
  "accessories": [
    {
      "id": "acc-bb-nonla",
      "name": "Nón lá Nam Bộ",
      "category": "headwear",
      "layerOrder": 5,
      "description": "Nón lá chóp tròn che nắng",
      "traditionalMeaning": "Phụ kiện che nắng hoặc tạo hình cùng áo bà ba.",
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
      "reason": "Gợi ý cho hoạt động văn hóa Nam Bộ hoặc chụp ảnh sông nước; chọn theo chương trình cụ thể."
    },
    {
      "eventId": "evt-street",
      "score": 90,
      "label": "Rất phù hợp",
      "reason": "Dáng áo gọn với quần thoải mái phù hợp sinh hoạt và dạo phố."
    }
  ],
  "usageConsiderations": [
    "Chọn thân áo, cổ và tay vừa người; hàng cúc không kéo căng khi ngồi hoặc giơ tay.",
    "Quần dài ống suông là một cách phối thông dụng; khăn rằn và nón lá là tùy chọn."
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
      "Đen tuyền",
      "Xanh ngọc",
      "Hồng cánh sen"
    ],
    "materialsAndMotifs": [
      "Lụa hoặc cotton dệt trơn",
      "Họa tiết nhỏ theo mẫu phối"
    ],
    "traditionalStyling": "Phối áo bà ba cài giữa với quần dài thoải mái, giữ độ vừa để thuận tiện sinh hoạt. Khăn rằn và nón lá có thể thêm theo nhu cầu. Kiểu cổ, độ dài áo, màu và vật liệu có nhiều biến thể; không mặc định tất cả phải là áo đen hoặc cùng một kiểu cổ.",
    "modernRemixAdvice": "Gợi ý cách tân: thử màu pastel, họa tiết nhỏ hoặc thay chi tiết cổ/tay, phối quần culottes hay quần suông và túi hiện đại. Giữ hàng cài giữa cùng dáng áo gọn để còn nhận diện bà ba. Trang sức có thể chọn theo sở thích và hoạt động.",
    "avoidCombinations": [
      "Tránh áo quá chật làm hở khe giữa hàng cúc hoặc hạn chế cử động.",
      "Tránh vải quá mỏng không có lớp che phủ phù hợp, hoặc đường xẻ gây lộ ngoài ý muốn.",
      "Khi dự lễ, vào nơi thờ tự hoặc tham gia hoạt động học đường, chọn độ kín và độ dài phù hợp nội quy nơi đến; kiểm tra áo khi ngồi, cúi và giơ tay để tránh lộ ngoài ý muốn."
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
    "sources": [
      {
        "sourceId": "hoi-an-ba-ba",
        "scope": "Áo cài giữa, hai túi và các biến thể cổ, độ dài trong ghi chép tại Hội An; không đủ kết luận nguồn gốc chung của áo bà ba Nam Bộ.",
        "locator": "Trang PDF 2, đoạn mô tả kiểu cổ, hai túi và vật liệu."
      }
    ],
    "modernUse": "Mặc với quần dài thoải mái, chọn chất liệu theo hoạt động và thời tiết. Màu pastel, quần culottes, túi cói và khăn rằn là các lựa chọn phối đương đại.",
    "limitations": [
      "Cần bổ sung nguồn bảo tàng hoặc nghiên cứu về niên đại và nguồn gốc tên gọi; chưa đánh dấu phần này là đã kiểm chứng."
    ]
  }
};
