import type { Costume } from '../../shared/types.ts';

export const aoDaiVietNam: Costume = {
  "id": "cos-ao-dai",
  "name": "Áo Dài Việt Nam",
  "slug": "ao-dai-viet-nam",
  "era": "Thế kỷ XX - Đương đại; kế thừa ngũ thân",
  "region": "Toàn quốc (Hà Nội, Huế, Sài Gòn)",
  "gender": "unisex",
  "formality": "formal",
  "coverImage": "/assets/costumes/ao-dai-viet-nam.jpg",
  "lineageCategory": "lap-linh",
  "lineageSubcategory": "tay-chen",
  "lineageLabel": "Áo dài hiện đại • Nhiều kiểu cổ và tay",
  "shortDescription": "Trang phục tiêu biểu của văn hóa Việt Nam, với hai tà trước và sau, đường xẻ sườn và thường phối cùng quần dài; cổ, tay và độ ôm có nhiều biến thể.",
  "historicalContext": "Áo dài hiện đại kế thừa ngũ thân và trải qua nhiều thay đổi trong thế kỷ XX, trong đó có thiết kế Lemur của Cát Tường vào nửa đầu thế kỷ XX. Cổ, tay, phom thân và độ dài tà ngày nay đa dạng; áo dài hai tà không mặc định có kết cấu năm thân, năm cúc.",
  "culturalSignificance": "Áo dài được sử dụng trong lễ cưới, học đường, giao tiếp và biểu diễn. Mặc với quần dài là cách phối quen thuộc; các biến thể cách tân cần được mô tả theo thiết kế và hoàn cảnh sử dụng, không áp một tiêu chuẩn cung đình cho mọi mẫu.",
  "isVerifiedHistoricalData": false,
  "verificationNote": "Đã đối chiếu các thông tin chính trong phạm vi nguồn bên dưới; phụ kiện và màu phối là gợi ý biên tập.",
  "components": [
    {
      "id": "cmp-ad-model",
      "name": "Người mẫu Nữ / Nam",
      "layerOrder": 1,
      "isRequired": true,
      "type": "inner",
      "description": "Vóc dáng thanh thoát, thần thái duyên dáng",
      "defaultColor": "#f7ede2"
    },
    {
      "id": "cmp-ad-inner",
      "name": "Lớp lót & Quần lụa dài",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Quần dài ống suông; gấu vừa tầm giày để không chạm đất.",
      "defaultColor": "#ffffff"
    },
    {
      "id": "cmp-ad-main",
      "name": "Thân áo dài hai tà xẻ sườn",
      "layerOrder": 3,
      "isRequired": true,
      "type": "main",
      "description": "Hai tà trước - sau buông rủ thướt tha",
      "defaultColor": "#c92a2a"
    },
    {
      "id": "cmp-ad-collar",
      "name": "Cổ đứng / Cổ thuyền / Tay raglan",
      "layerOrder": 4,
      "isRequired": true,
      "type": "main",
      "description": "Cổ đứng cao ôm thanh mảnh hoặc cổ thuyền thoáng",
      "defaultColor": "#c92a2a"
    },
    {
      "id": "cmp-ad-head",
      "name": "Nón lá bài thơ hoặc Khăn vấn",
      "layerOrder": 5,
      "isRequired": false,
      "type": "headwear",
      "description": "Nón lá bài thơ quai lụa hoặc khăn vấn nhung",
      "defaultColor": "#fef3c7"
    },
    {
      "id": "cmp-ad-acc",
      "name": "Kiềng bạc / Chuỗi ngọc trai",
      "layerOrder": 6,
      "isRequired": false,
      "type": "accessory",
      "description": "Trang sức tôn vinh nét đài các",
      "defaultColor": "#e0e1dd"
    },
    {
      "id": "cmp-ad-shoes",
      "name": "Guốc mộc hoặc Giày gót nhọn",
      "layerOrder": 7,
      "isRequired": false,
      "type": "footwear",
      "description": "Bước đi uyển chuyển nhẹ nhàng",
      "defaultColor": "#382212"
    }
  ],
  "colorVariants": [
    {
      "id": "col-ad-white",
      "name": "Trắng ngọc tinh khôi (Nữ sinh)",
      "hex": "#ffffff",
      "meaning": "Thuần khiết, trong sáng của tuổi học trò",
      "popularity": "Kỷ yếu & Học đường"
    },
    {
      "id": "col-ad-red",
      "name": "Đỏ thắm hỷ sự",
      "hex": "#c92a2a",
      "meaning": "Hân hoan, may mắn và hạnh phúc lứa đôi",
      "popularity": "Lễ cưới & Ngày Tết"
    },
    {
      "id": "col-ad-yellow",
      "name": "Vàng mù tạt (Cảm hứng retro)",
      "hex": "#d97706",
      "meaning": "Hoài niệm thập niên 60-70 rực rỡ",
      "popularity": "Du xuân dạo phố"
    },
    {
      "id": "col-ad-teal",
      "name": "Xanh cổ vịt hoàng thành",
      "hex": "#0f766e",
      "meaning": "Quý phái, trầm mặc và sang trọng",
      "popularity": "Dạ tiệc & Ngoại giao"
    },
    {
      "id": "col-ad-purple",
      "name": "Tím huế mộng mơ",
      "hex": "#7e22ce",
      "meaning": "Nét thơ mộng, thủy chung xứ kinh kỳ",
      "popularity": "Cổ điển"
    },
    {
      "id": "col-ad-black",
      "name": "Đen tuyền nhung mờ (Modern Chic)",
      "hex": "#18181b",
      "meaning": "Tối giản, quyền lực và bí ẩn",
      "popularity": "Nghệ thuật đương đại"
    }
  ],
  "materials": [
    {
      "id": "mat-ad-to-tam",
      "name": "Lụa tơ tằm",
      "textureType": "silk",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Mềm mát, độ rủ tự nhiên bay bổng"
    },
    {
      "id": "mat-ad-gam-hoa",
      "name": "Gấm dệt tơ hoa chìm",
      "textureType": "brocade",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Đứng phom, hoa văn ẩn hiện sang trọng"
    },
    {
      "id": "mat-ad-nhung",
      "name": "Nhung the tuyết",
      "textureType": "velvet",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Ấm áp, quý phái cho mùa đông và dạ tiệc"
    },
    {
      "id": "mat-ad-dui",
      "name": "Đũi tơ tằm thoáng khí",
      "textureType": "linen_silk",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Mộc mạc, thấm hút tốt cho ngày nắng nóng"
    }
  ],
  "accessories": [
    {
      "id": "acc-ad-nonla",
      "name": "Nón lá bài thơ quai lụa",
      "category": "headwear",
      "layerOrder": 5,
      "description": "Che nghiêng nụ cười e ấp",
      "traditionalMeaning": "Phụ kiện đội hoặc cầm tay theo bộ phối.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-ad-kieng",
      "name": "Kiềng bạc chạm hoa cúc",
      "category": "jewelry",
      "layerOrder": 6,
      "description": "Ôm vừa vặn cổ áo dài trơn",
      "traditionalMeaning": "Trang sức phối quanh cổ; không mặc định là hồi môn.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-ad-ngoc-trai",
      "name": "Chuỗi ngọc trai tự nhiên",
      "category": "jewelry",
      "layerOrder": 6,
      "description": "Có thể phối với áo dài cổ thuyền hoặc mẫu áo phù hợp.",
      "traditionalMeaning": "Điểm nhấn quanh cổ trong bộ phối hiện đại.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-ad-quat",
      "name": "Quạt lụa thêu hoa sen",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Cầm tay tạo dáng thanh tao",
      "traditionalMeaning": "Đạo cụ cầm tay dùng khi tạo dáng.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-ad-guoc",
      "name": "Guốc mộc quai nhung đỏ",
      "category": "footwear",
      "layerOrder": 7,
      "description": "Tiếng guốc lách cách hoài niệm",
      "traditionalMeaning": "Giày dép theo phong cách bộ phối.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    }
  ],
  "details": [
    {
      "id": "dtl-ad-co",
      "name": "Cổ đứng lập lĩnh hoặc cổ thuyền",
      "type": "collar",
      "description": "Tôn vinh cần cổ kiêu sa"
    },
    {
      "id": "dtl-ad-raglan",
      "name": "Tay áo nối raglan",
      "type": "sleeve",
      "description": "Đường ráp từ cổ xuống nách; độ phẳng và độ vừa còn phụ thuộc rập, số đo và vải."
    },
    {
      "id": "dtl-ad-xe",
      "name": "Đường xẻ tà hai bên sườn",
      "type": "hem",
      "description": "Tà áo trước và sau bay theo từng bước chân"
    }
  ],
  "suitability": [
    {
      "eventId": "evt-tet",
      "score": 99,
      "label": "Hoàn hảo",
      "reason": "Có thể chọn cho chúc Tết, du xuân hoặc chụp ảnh; không bắt buộc một màu hoặc một kiểu cổ."
    },
    {
      "eventId": "evt-wedding",
      "score": 96,
      "label": "Hoàn hảo",
      "reason": "Lựa chọn cho lễ cưới và gia tiên theo vai trò người mặc và yêu cầu của gia đình."
    },
    {
      "eventId": "evt-yearbook",
      "score": 100,
      "label": "Hoàn hảo",
      "reason": "Gợi ý bộ ảnh học đường; chọn màu và kiểu áo theo quy định trường nếu có."
    },
    {
      "eventId": "evt-formal",
      "score": 95,
      "label": "Hoàn hảo",
      "reason": "Có thể chọn cho sự kiện trang trọng theo quy định của nơi tổ chức."
    },
    {
      "eventId": "evt-street",
      "score": 92,
      "label": "Hoàn hảo",
      "reason": "Tà lửng và giày bệt là gợi ý cách tân thuận tiện đi bộ."
    }
  ],
  "usageConsiderations": [
    "Chọn áo vừa người: có thể ôm dáng nhưng không kéo căng đường may, cổ hoặc nách; thử ngồi và bước lên bậc trước khi mặc.",
    "Với vải mỏng hoặc đường xẻ cao, chọn lớp lót và quần phù hợp để tránh lộ ngoài ý muốn.",
    "Khi dự lễ, vào nơi thờ tự hoặc tham gia hoạt động học đường, chọn độ kín và độ dài phù hợp nội quy nơi đến; kiểm tra áo khi ngồi, cúi và giơ tay để tránh lộ ngoài ý muốn."
  ],
  "stylingGuide": {
    "accessories": [
      "Nón lá bài thơ",
      "Kiềng bạc cổ",
      "Chuỗi ngọc trai",
      "Guốc mộc quai nhung"
    ],
    "hairstyles": [
      "Tóc xõa dài tự nhiên",
      "Tóc búi nửa đầu kẹp ruy băng",
      "Búi tóc retro đội khăn vấn"
    ],
    "footwear": [
      "Giày cao gót mũi nhọn bọc lụa",
      "Guốc mộc gót cong",
      "Giày búp bê đế bệt"
    ],
    "recommendedColors": [
      "Trắng ngọc phối quần đen",
      "Đỏ son phối quần vàng đồng",
      "Xanh cổ vịt phối quần be"
    ],
    "materialsAndMotifs": [
      "Lụa Vạn Phúc",
      "Gấm hoa chìm",
      "Nhung the",
      "Hoa sen thêu tay"
    ],
    "traditionalStyling": "Một cách phối quen thuộc là áo dài hai tà với quần dài ống suông, gấu quần vừa tầm giày. Cổ đứng, cổ thuyền và tay raglan là các lựa chọn thiết kế; không có một chiều cao cổ cố định cho mọi áo. Nón, khăn vấn, kiềng và ngọc trai đều là phụ kiện tùy chọn.",
    "modernRemixAdvice": "Gợi ý cách tân: đổi màu, chất liệu, họa tiết, kiểu cổ hoặc tay; thử tà lửng với quần suông và giày bệt/sneaker. Chân váy có thể dùng trong bộ phối đương đại, nhưng nên ghi rõ là cách tân. Chọn độ ôm, độ mở cổ và độ xẻ theo hoạt động và quy định sự kiện.",
    "avoidCombinations": [
      "Tránh áo quá chật làm căng khuy hoặc đường may; độ ôm vừa vặn của áo dài hiện đại không đồng nghĩa với sai cách mặc.",
      "Tránh để đường xẻ, vải xuyên thấu hoặc quần quá ngắn gây lộ ngoài ý muốn khi ngồi và di chuyển.",
      "Khi dự lễ, vào nơi thờ tự hoặc tham gia hoạt động học đường, chọn độ kín và độ dài phù hợp nội quy nơi đến; kiểm tra áo khi ngồi, cúi và giơ tay để tránh lộ ngoài ý muốn."
    ]
  },
  "aiProfile": {
    "constructionDetails": [
      "Contemporary Vietnamese Áo Dài with distinct long front and back panels, separated by side slits.",
      "Worn over trousers for this suggested ensemble. Keep realistic fabric drape and a comfortable tailored silhouette.",
      "Collar, sleeve style and length may follow the selected contemporary design; raglan sleeves, boat necks and standing collars are valid variants.",
      "Do not automatically replace this modern two-panel garment with a five-panel Ngũ Thân robe."
    ],
    "mandatoryFeatures": [
      "Distinct front and back flowing panels with side slits.",
      "Preserve the chosen contemporary collar and sleeve style."
    ],
    "strictProhibitions": [
      "Do not force five-panel construction, five buttons or a standing collar onto every contemporary Áo Dài.",
      "Do not add unselected ceremonial crowns or court insignia."
    ]
  },
  "research": {
    "status": "partially_reviewed",
    "reviewedAt": "2026-10-10",
    "sources": [
      {
        "sourceId": "hue-aodai",
        "scope": "Mối liên hệ giữa ngũ thân và áo dài; di sản may, mặc trong đời sống hiện nay."
      },
      {
        "sourceId": "si-hoang-lemur",
        "scope": "Nhận định của nhà thiết kế Sĩ Hoàng về thay đổi của áo dài Lemur."
      }
    ],
    "modernUse": "Lựa chọn cổ đứng, cổ thuyền hoặc tay raglan theo nhu cầu. Nón lá, kiềng, ngọc trai, quạt và giày đều là tùy chọn. Màu gợi ý trong lookbook phục vụ phối đồ hiện nay, không chứng nhận bản phục dựng.",
    "limitations": [
      "Chưa xác minh các mốc năm riêng của Lê Phổ, cổ thuyền và raglan; không hiển thị chúng như niên biểu đã kết luận.",
      "Ảnh lookbook là minh họa phong cách; chưa kiểm tra đầy đủ hồ sơ tác giả và giấy phép từng ảnh."
    ]
  }
};
