import type { Costume } from '../../shared/types.ts';

export const aoNguThanTayChen: Costume = {
  "id": "cos-ngu-than-tay-chen",
  "name": "Áo Ngũ Thân Tay Chẽn",
  "slug": "ao-ngu-than-tay-chen",
  "era": "Triều Nguyễn - Hiện đại",
  "region": "Toàn quốc",
  "gender": "unisex",
  "formality": "casual_refined",
  "coverImage": "/assets/costumes/ao-ngu-than-vnp.jpg",
  "lineageCategory": "lap-linh",
  "lineageSubcategory": "tay-chen",
  "lineageLabel": "Áo Lập Lĩnh • Tay gọn (Thường phục)",
  "shortDescription": "Biến thể tiện dụng thường nhật của áo Ngũ Thân, với ống tay ôm vừa vặn vào cổ tay, năng động, thoải mái nhưng vẫn bảo toàn trọn vẹn nét tôn nghiêm.",
  "historicalContext": "Áo ngũ thân có năm thân vải, cổ đứng và hàng cúc lệch; dạng tay chẽn thu gọn ống tay để thuận tiện cử động. Áo ngũ thân phát triển ở Đàng Trong từ thế kỷ XVIII và được phổ biến dưới triều Nguyễn; không chỉ dành cho nam giới hay quan lại.",
  "culturalSignificance": "Ngũ thân là một tiền đề của áo dài hiện đại. Dạng tay chẽn trong danh mục nhấn mạnh phom truyền thống gọn gàng; không đồng nhất nó với tất cả kiểu áo dài hai tà hiện nay.",
  "isVerifiedHistoricalData": false,
  "verificationNote": "Đã đối chiếu các thông tin chính trong phạm vi nguồn bên dưới; phụ kiện và màu phối là gợi ý biên tập.",
  "components": [
    {
      "id": "cmp-tc-model",
      "name": "Người mẫu Nam / Nữ",
      "layerOrder": 1,
      "isRequired": true,
      "type": "inner",
      "description": "Dáng đứng trẻ trung, hiện đại",
      "defaultColor": "#f7ede2"
    },
    {
      "id": "cmp-tc-inner",
      "name": "Áo lót trắng cổ viền",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Lớp lót giữ vệ sinh áo chính và bảo đảm phom cổ đứng",
      "defaultColor": "#ffffff"
    },
    {
      "id": "cmp-tc-pants",
      "name": "Quần âu suông hoặc quần lụa",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Ống đứng gọn gàng hiện đại",
      "defaultColor": "#1c1c1c"
    },
    {
      "id": "cmp-tc-main",
      "name": "Thân áo Ngũ Thân gọn gàng",
      "layerOrder": 3,
      "isRequired": true,
      "type": "main",
      "description": "Vạt áo lượn cong nhẹ nhàng ôm lấy vóc dáng",
      "defaultColor": "#457b9d"
    },
    {
      "id": "cmp-tc-sleeves",
      "name": "Tay áo chẽn bó cổ tay",
      "layerOrder": 4,
      "isRequired": true,
      "type": "main",
      "description": "Ống tay thu nhỏ từ bắp tay xuống cổ tay thuận tiện cử động",
      "defaultColor": "#457b9d"
    },
    {
      "id": "cmp-tc-buttons",
      "name": "5 khuy xà cừ hoặc kim loại đúc",
      "layerOrder": 4,
      "isRequired": true,
      "type": "main",
      "description": "Cài chắc chắn dọc nách và mạn sườn phải",
      "defaultColor": "#e0a96d"
    },
    {
      "id": "cmp-tc-acc",
      "name": "Đồng hồ quả quýt hoặc túi xách lụa",
      "layerOrder": 6,
      "isRequired": false,
      "type": "accessory",
      "description": "Tạo điểm nhấn giao thoa Đông Tây",
      "defaultColor": "#d4af37"
    },
    {
      "id": "cmp-tc-shoes",
      "name": "Giày sneaker da tối giản hoặc Derby",
      "layerOrder": 7,
      "isRequired": false,
      "type": "footwear",
      "description": "Bước đi năng động hiện đại",
      "defaultColor": "#2b2d42"
    }
  ],
  "colorVariants": [
    {
      "id": "col-tc-emerald",
      "name": "Xanh lam hoa râm",
      "hex": "#264653",
      "meaning": "Hài hòa, trẻ trung và tràn đầy sinh khí",
      "popularity": "Bán chạy nhất"
    },
    {
      "id": "col-tc-charcoal",
      "name": "Xám than chì / Đen tuyền",
      "hex": "#2b2d42",
      "meaning": "Chững chạc, bí ẩn và tôn dáng",
      "popularity": "Rất chuộng dạo phố"
    },
    {
      "id": "col-tc-sand",
      "name": "Vàng cát phù sa",
      "hex": "#e9c46a",
      "meaning": "Ấm áp, hoài niệm sông nước quê hương",
      "popularity": "Chụp kỷ yếu"
    },
    {
      "id": "col-tc-burgundy",
      "name": "Đỏ rượu vang",
      "hex": "#7f1d1d",
      "meaning": "Cuốn hút, tự tin nổi bật trong lễ hội",
      "popularity": "Sự kiện trang trọng"
    }
  ],
  "materials": [
    {
      "id": "mat-tc-linen",
      "name": "Vải Linen tơ tằm dệt thoáng khí",
      "textureType": "linen",
      "origin": "Việt Nam",
      "description": "Thoát mồ hôi cực tốt, phom vải đứng cứng cáp"
    },
    {
      "id": "mat-tc-cotton-silk",
      "name": "Cotton pha tơ tằm dệt hoa chìm",
      "textureType": "cotton_silk",
      "origin": "Bảo Lộc",
      "description": "Co giãn nhẹ, thân thiện với làn da khi hoạt động cả ngày"
    }
  ],
  "accessories": [
    {
      "id": "acc-tc-dongho",
      "name": "Đồng hồ dây da phong cách cổ điển",
      "category": "jewelry",
      "layerOrder": 6,
      "description": "Đeo cổ tay tạo phong thái tri thức thế kỷ 20",
      "traditionalMeaning": "Giao thoa thời đại",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-tc-tui",
      "name": "Túi tote vải dệt hoa văn Đông Sơn",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Phụ kiện dạo phố tiện ích",
      "traditionalMeaning": "Hơi thở dân gian đương đại",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-tc-giay",
      "name": "Giày da Dr. Martens hoặc Sneaker trắng",
      "category": "footwear",
      "layerOrder": 7,
      "description": "Remix phong cách đường phố cá tính",
      "traditionalMeaning": "Tự do bước tiến",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    }
  ],
  "details": [
    {
      "id": "dtl-tc-cuc",
      "name": "Khuy ngọc trai ánh xà cừ",
      "type": "button",
      "description": "Ánh lấp lánh nhẹ nhàng dưới ánh nắng"
    },
    {
      "id": "dtl-tc-xe",
      "name": "Đường xẻ tà cao vừa phải",
      "type": "hem",
      "description": "Dễ dàng ngồi xe máy hoặc di chuyển linh hoạt"
    }
  ],
  "suitability": [
    {
      "eventId": "evt-street",
      "score": 99,
      "label": "Hoàn hảo",
      "reason": "Đây chính là trang phục lý tưởng nhất để mặc dạo phố, đi cà phê, bảo tàng cuối tuần."
    },
    {
      "eventId": "evt-yearbook",
      "score": 94,
      "label": "Hoàn hảo",
      "reason": "Trẻ trung, thuận tiện chạy nhảy chụp ảnh tập thể ngoài trời suốt cả ngày."
    },
    {
      "eventId": "evt-tet",
      "score": 91,
      "label": "Rất phù hợp",
      "reason": "Đi chúc Tết bạn bè, dạo đường hoa vô cùng thoải mái và chỉn chu."
    },
    {
      "eventId": "evt-art",
      "score": 86,
      "label": "Rất phù hợp",
      "reason": "Biểu diễn nhạc acoustic hoặc nghệ thuật đương đại."
    },
    {
      "eventId": "evt-formal",
      "score": 78,
      "label": "Phù hợp",
      "reason": "Nên chọn màu trầm và chất liệu gấm để tăng tính trang trọng."
    }
  ],
  "usageConsiderations": [
    "Ống tay may chẽn vừa vặn, không nên may quá chật làm khó gập khuỷu tay.",
    "Dễ kết hợp với trang phục hiện đại nhưng cần giữ phom cổ đứng và nếp khuy ngũ thân.",
    "Màu, vật liệu, phụ kiện và điểm phù hợp sự kiện trong ứng dụng là gợi ý phối hiện nay; không chứng nhận một bộ phục dựng lịch sử."
  ],
  "stylingGuide": {
    "accessories": [
      "Đồng hồ cổ điển",
      "Kính mắt tròn gọng kim loại",
      "Túi chéo da nâu",
      "Khăn rằn cách điệu"
    ],
    "hairstyles": [
      "Tóc layer hiện đại",
      "Tóc búi nửa đầu cá tính"
    ],
    "footwear": [
      "Giày da lười (Loafers)",
      "Sneaker da trắng đế bệt",
      "Giày Oxford cổ điển"
    ],
    "recommendedColors": [
      "Xanh navy phối quần xám",
      "Xanh rêu phối quần be",
      "Trắng ngà phối quần đen"
    ],
    "materialsAndMotifs": [
      "Linen cao cấp",
      "Lụa pha cotton",
      "Hoa văn kỷ hà tối giản"
    ],
    "traditionalStyling": "Mặc cùng quần lụa trắng, khăn đóng đen, giày da đen trơn thanh lịch.",
    "modernRemixAdvice": "Remix đường phố: Mặc áo Ngũ Thân tay chẽn màu trơn cùng quần tây âu suông xếp ly, mang giày Loafer hoặc sneaker trắng tối giản, khoác thêm túi da đeo chéo.",
    "avoidCombinations": [
      "Tránh mặc cùng quần short ngắn trên gối gây phản cảm.",
      "Tránh mang dép tông lê cao su khi dự sự kiện."
    ]
  },
  "aiProfile": {
    "constructionDetails": [
      "Authentic Vietnamese Áo Ngũ Thân Tay Chẽn (Classic 5-panel tailored Vietnamese tunic).",
      "Lập Lĩnh erect standing collar (cổ đứng) with rounded tips, fastening neatly at the neck.",
      "5-panel construction (Ngũ thân) with right-side button closure using 5 traditional fabric/metal buttons.",
      "Tailored, slim-fitted sleeves (Tay chẽn) cleanly hugging the forearms down to the wrists.",
      "A modest, slightly flared five-panel silhouette over trousers. The side openings must not expose the waist or hips like a tight contemporary Áo Dài."
    ],
    "mandatoryFeatures": [
      "Standing collar (Lập Lĩnh).",
      "5 buttons curved along the right collarbone and ribcage.",
      "Fitted tailored sleeves (Tay chẽn)."
    ],
    "strictProhibitions": [
      "NO crossed wrap closure.",
      "NO oversized fantasy shoulder pads.",
      "Do not use high waist-exposing slits or a skin-tight contemporary Áo Dài silhouette."
    ]
  },
  "research": {
    "status": "partially_reviewed",
    "reviewedAt": "2026-10-10",
    "sources": [
      {
        "sourceId": "hue-aodai",
        "scope": "Quá trình phổ biến ngũ thân và vai trò trong di sản áo dài Huế."
      },
      {
        "sourceId": "hcmute-2024",
        "scope": "Giới thiệu cấu trúc ngũ thân, tay chẽn và cách mặc.",
        "locator": "Tập san Thời trang và Du lịch, số 1 (2024), mục 3.2, tr. 60–61"
      }
    ],
    "modernUse": "Giữ cổ đứng và kết cấu ngũ thân khi chọn phong cách truyền thống. Quần âu, đồng hồ, túi tote và sneaker là gợi ý phối hiện đại, phù hợp dạo phố hoặc sự kiện theo quy định của nơi tổ chức.",
    "limitations": [
      "Phụ kiện hiện đại và màu phối không phải quy chuẩn y phục Nguyễn."
    ]
  }
};
