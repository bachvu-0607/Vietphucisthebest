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
  "shortDescription": "Áo ngũ thân cổ đứng, hàng năm khuy cài bên phải; tay thu nhỏ dần về cổ tay, thân và nách vẫn có độ rộng để cử động.",
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
      "description": "Thân và nách có độ rộng; tà xòe nhẹ, vạt con giúp che kín phần eo và hông.",
      "defaultColor": "#457b9d"
    },
    {
      "id": "cmp-tc-sleeves",
      "name": "Tay áo chẽn vừa cổ tay",
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
      "popularity": "Gợi ý phối dạo phố"
    },
    {
      "id": "col-tc-charcoal",
      "name": "Xám than chì / Đen tuyền",
      "hex": "#2b2d42",
      "meaning": "Chững chạc, bí ẩn và tôn dáng",
      "popularity": "Gợi ý phối dạo phố"
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
      "name": "Vải linen dệt trơn",
      "textureType": "linen",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Chọn độ dày và độ mềm phù hợp; linen không mặc định là tơ tằm."
    },
    {
      "id": "mat-tc-cotton-silk",
      "name": "Cotton pha tơ tằm dệt hoa chìm",
      "textureType": "cotton_silk",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Độ co giãn và độ thoáng tùy tỉ lệ sợi, kiểu dệt và hoàn tất vải."
    }
  ],
  "accessories": [
    {
      "id": "acc-tc-dongho",
      "name": "Đồng hồ dây da phong cách cổ điển",
      "category": "jewelry",
      "layerOrder": 6,
      "description": "Đeo cổ tay tạo phong thái tri thức thế kỷ 20",
      "traditionalMeaning": "Phụ kiện hiện đại đi cùng phom ngũ thân.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-tc-tui",
      "name": "Túi tote vải dệt hoa văn Đông Sơn",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Phụ kiện dạo phố tiện ích",
      "traditionalMeaning": "Đưa họa tiết trang trí vào túi dùng hằng ngày.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-tc-giay",
      "name": "Giày da Dr. Martens hoặc Sneaker trắng",
      "category": "footwear",
      "layerOrder": 7,
      "description": "Remix phong cách đường phố cá tính",
      "traditionalMeaning": "Giày hiện đại dùng trong bộ phối đường phố.",
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
      "name": "Đường xẻ sườn và vạt con",
      "type": "hem",
      "description": "Vạt con che phần eo và hông; độ xẻ không làm mất phom ngũ thân."
    }
  ],
  "suitability": [
    {
      "eventId": "evt-street",
      "score": 99,
      "label": "Hoàn hảo",
      "reason": "Tay gọn thuận tiện hơn cho sinh hoạt và đi bộ; chọn áo vừa người."
    },
    {
      "eventId": "evt-yearbook",
      "score": 94,
      "label": "Hoàn hảo",
      "reason": "Phom ngũ thân tay gọn phù hợp bộ ảnh nhóm theo chủ đề Việt phục."
    },
    {
      "eventId": "evt-tet",
      "score": 91,
      "label": "Rất phù hợp",
      "reason": "Có thể phối cho chúc Tết và dạo đường hoa."
    },
    {
      "eventId": "evt-art",
      "score": 86,
      "label": "Rất phù hợp",
      "reason": "Gợi ý cho tiết mục dùng hình ảnh ngũ thân; chọn độ vừa theo động tác."
    },
    {
      "eventId": "evt-formal",
      "score": 78,
      "label": "Phù hợp",
      "reason": "Có thể phối cho sự kiện trang trọng; kiểm tra quy định trang phục của nơi tổ chức."
    }
  ],
  "usageConsiderations": [
    "Tay chẽn ôm vừa cổ tay; thân và nách không bó như áo dài ôm sát. Thử gập khuỷu, giơ tay và ngồi để kiểm tra độ vừa.",
    "Cài hàng khuy bên phải, giữ cổ đứng và vạt con nằm ổn định khi phối theo phom truyền thống."
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
    "traditionalStyling": "Giữ năm thân, vạt con, cổ đứng và hàng năm khuy bên phải. Tay thu nhỏ về cổ tay nhưng thân và nách còn rộng, tà không để hở eo/hông như áo dài tân thời. Có thể phối quần dài trắng ống rộng và khăn vấn/khăn đóng; giày và phụ kiện chọn theo bộ phối cụ thể.",
    "modernRemixAdvice": "Gợi ý cách tân: giữ kết cấu ngũ thân và tay chẽn vừa vặn, thử vải trơn hoặc họa tiết nhỏ, phối quần âu suông, jeans không quá chật, loafer hoặc sneaker. Đồng hồ, kính, túi và trang sức là lựa chọn hiện đại; chú ý dây túi không kéo lệch cổ hoặc vạt áo.",
    "avoidCombinations": [
      "Tránh may thân, nách hoặc tay quá chật làm căng hàng khuy, hạn chế cử động và mất phom ngũ thân.",
      "Tránh xẻ sườn để hở eo/hông khi muốn giữ kết cấu ngũ thân truyền thống.",
      "Khi dự lễ, vào nơi thờ tự hoặc tham gia hoạt động học đường, chọn độ kín và độ dài phù hợp nội quy nơi đến; kiểm tra áo khi ngồi, cúi và giơ tay để tránh lộ ngoài ý muốn."
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
        "locator": "Mục 3.1.2 và 3.2, tr. 60–61; dùng mô tả cấu trúc, không dùng lỗi mốc năm trong phần lịch sử."
      }
    ],
    "modernUse": "Giữ cổ đứng và kết cấu ngũ thân khi chọn phong cách truyền thống. Quần âu, đồng hồ, túi tote và sneaker là gợi ý phối hiện đại, phù hợp dạo phố hoặc sự kiện theo quy định của nơi tổ chức.",
    "limitations": [
      "Phụ kiện hiện đại và màu phối không phải quy chuẩn y phục Nguyễn."
    ]
  }
};
