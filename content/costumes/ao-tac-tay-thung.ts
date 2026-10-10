import type { Costume } from '../../shared/types.ts';

export const aoTacTayThung: Costume = {
  "id": "cos-ao-tac",
  "name": "Áo Tấc (Áo Ngũ Thân Tay Thụng)",
  "slug": "ao-tac-tay-thung",
  "era": "Triều Nguyễn (Thế kỷ 19 - 20)",
  "region": "Toàn quốc (Kế thừa từ Cố đô Huế)",
  "gender": "unisex",
  "formality": "formal",
  "coverImage": "/assets/costumes/ao-tac-bat-bao.jpeg",
  "lineageCategory": "lap-linh",
  "lineageSubcategory": "ao-tac",
  "lineageLabel": "Áo Lập Lĩnh • Tay rộng (Lễ phục)",
  "shortDescription": "Dạng áo ngũ thân tay rộng, cổ đứng và cài bên phải, thường được chọn cho dịp trang trọng; dùng cho cả nam và nữ.",
  "historicalContext": "Áo Tấc trong danh mục này là dạng áo ngũ thân tay rộng dùng cho dịp trang trọng. Nó nằm trong quá trình phát triển của áo dài cổ đứng từ Đàng Trong thế kỷ XVIII đến thời Nguyễn. Chưa có căn cứ ở đây để chốt một năm chuẩn hóa riêng hoặc kích thước từ tên “tấc”.",
  "culturalSignificance": "Phom tay rộng tạo vẻ trang trọng và cần không gian cử động. Các diễn giải về năm thân, năm cúc và đạo đức Nho giáo là cách lý giải biểu tượng, không thay thế tư liệu về cách cắt may.",
  "isVerifiedHistoricalData": false,
  "verificationNote": "Đã đối chiếu các thông tin chính trong phạm vi nguồn bên dưới; phụ kiện và màu phối là gợi ý biên tập.",
  "components": [
    {
      "id": "cmp-at-model",
      "name": "Người mẫu Nam hoặc Nữ",
      "layerOrder": 1,
      "isRequired": true,
      "type": "inner",
      "description": "Tư thế đứng tự nhiên hoặc chắp tay khi tạo dáng.",
      "defaultColor": "#f7ede2"
    },
    {
      "id": "cmp-at-inner",
      "name": "Áo lót cánh trắng cổ đứng",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Áo mỏng lót bên trong giữ cổ đứng ngay ngắn",
      "defaultColor": "#ffffff"
    },
    {
      "id": "cmp-at-pants",
      "name": "Quần lụa trắng ống thụng",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Quần dài ống rộng; gấu vừa tầm giày để không vướng bước chân.",
      "defaultColor": "#f8f9fa"
    },
    {
      "id": "cmp-at-main",
      "name": "Thân áo Tấc ngũ thân rộng",
      "layerOrder": 3,
      "isRequired": true,
      "type": "main",
      "description": "Dáng áo thụng thả tự nhiên, vạt áo phủ qua đầu gối",
      "defaultColor": "#2b4162"
    },
    {
      "id": "cmp-at-sleeves",
      "name": "Tay áo thụng rộng",
      "layerOrder": 4,
      "isRequired": true,
      "type": "main",
      "description": "Ống tay rộng, buông theo cử động; không suy kích thước từ tên áo Tấc.",
      "defaultColor": "#2b4162"
    },
    {
      "id": "cmp-at-buttons",
      "name": "Hàng 5 khuy cài xà cừ / đồng",
      "layerOrder": 4,
      "isRequired": true,
      "type": "main",
      "description": "Hàng năm khuy cài từ cổ xuống phía thân phải.",
      "defaultColor": "#e0a96d"
    },
    {
      "id": "cmp-at-khan",
      "name": "Khăn đóng xếp nếp truyền thống",
      "layerOrder": 5,
      "isRequired": false,
      "type": "headwear",
      "description": "Khăn xếp chữ Nhân hoặc chữ Nhất tề chỉnh",
      "defaultColor": "#1a1a1a"
    },
    {
      "id": "cmp-at-quat",
      "name": "Quạt nan gấm hoặc quạt giấy dó",
      "layerOrder": 6,
      "isRequired": false,
      "type": "accessory",
      "description": "Cầm ở tay khi đi lại tạo phong thái nho nhã",
      "defaultColor": "#f4a261"
    },
    {
      "id": "cmp-at-guoc",
      "name": "Guốc mộc hoặc giày vải truyền thống",
      "layerOrder": 7,
      "isRequired": false,
      "type": "footwear",
      "description": "Guốc gõ thanh nhẹ hoặc giày vải đen",
      "defaultColor": "#382212"
    }
  ],
  "colorVariants": [
    {
      "id": "col-at-navy",
      "name": "Lam thẫm / Xanh navy",
      "hex": "#1d3557",
      "meaning": "Sắc trầm, dễ phối quần trắng hoặc sáng màu.",
      "popularity": "Gợi ý dịp trang trọng"
    },
    {
      "id": "col-at-maroon",
      "name": "Đỏ mận / Huyết dụ",
      "hex": "#6b1d2f",
      "meaning": "Hân hoan, cát tường và thịnh vượng",
      "popularity": "Lễ cưới & Tết"
    },
    {
      "id": "col-at-olive",
      "name": "Xanh lục rêu",
      "hex": "#386641",
      "meaning": "Thanh bình, hòa hợp với đất trời mùa xuân",
      "popularity": "Du xuân, kỷ yếu"
    },
    {
      "id": "col-at-cream",
      "name": "Màu trắng ngà / Màu mỡ gà",
      "hex": "#f4ede2",
      "meaning": "Thanh bạch, nho nhã và tinh tế",
      "popularity": "Thanh lịch mùa hè"
    }
  ],
  "materials": [
    {
      "id": "mat-at-to-tam",
      "name": "Lụa tơ tằm dệt trơn",
      "textureType": "silk",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Mềm mát, độ bóng mờ quý phái, tà bay bổng"
    },
    {
      "id": "mat-at-gam-hoa",
      "name": "Gấm dệt vân mây chữ Thọ",
      "textureType": "brocade",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Đứng form áo, hoa văn ẩn hiện tôn vẻ bề thế"
    },
    {
      "id": "mat-at-dui",
      "name": "Đũi tơ tằm dệt thô thủ công",
      "textureType": "linen_silk",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Mộc mạc, gần gũi thiên nhiên, thoát nhiệt tốt"
    }
  ],
  "accessories": [
    {
      "id": "acc-at-khandong",
      "name": "Khăn đóng gấm đen 7 nếp",
      "category": "headwear",
      "layerOrder": 5,
      "description": "Đội ngay ngắn phía trên trán hình chữ Nhân",
      "traditionalMeaning": "Điểm nhấn ở đầu và giữ tóc gọn trong bộ phối.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-at-thebai",
      "name": "Thẻ bài gỗ mun khắc chữ nho",
      "category": "waist",
      "layerOrder": 6,
      "description": "Đạo cụ thẻ bài tạo hình; cần nguồn riêng để gắn với quan chức hoặc nhân vật cụ thể.",
      "traditionalMeaning": "Đạo cụ tạo hình; không tự xác nhận danh phận của người mặc.",
      "isRecommended": false,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-at-quat",
      "name": "Quạt giấy dó viết thư pháp",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Cầm tay nho nhã thi vị",
      "traditionalMeaning": "Phụ kiện cầm tay và tạo dáng.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-at-giay",
      "name": "Giày vải đen đế bọc vải hoặc guốc mộc",
      "category": "footwear",
      "layerOrder": 7,
      "description": "Chọn giày hoặc guốc vừa chân, thuận tiện di chuyển.",
      "traditionalMeaning": "Hoàn thiện bộ phối và hỗ trợ di chuyển.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    }
  ],
  "details": [
    {
      "id": "dtl-at-co",
      "name": "Cổ đứng lập lĩnh",
      "type": "collar",
      "description": "Chiều cao cổ chọn theo số đo và mẫu áo, không có một mức cố định cho mọi người."
    },
    {
      "id": "dtl-at-tay",
      "name": "Tay áo thụng rộng buông tự nhiên",
      "type": "sleeve",
      "description": "Độ dài và độ rộng chọn theo mẫu; cần đủ khoảng trống cho cử động."
    }
  ],
  "suitability": [
    {
      "eventId": "evt-tet",
      "score": 96,
      "label": "Hoàn hảo",
      "reason": "Phom tay rộng tạo vẻ trang trọng khi chúc Tết hoặc chụp ảnh."
    },
    {
      "eventId": "evt-wedding",
      "score": 95,
      "label": "Hoàn hảo",
      "reason": "Có thể phối cho chú rể, người thân hoặc đội lễ theo yêu cầu của gia đình."
    },
    {
      "eventId": "evt-yearbook",
      "score": 92,
      "label": "Rất phù hợp",
      "reason": "Gợi ý bộ ảnh theo phong cách ngũ thân tay rộng."
    },
    {
      "eventId": "evt-formal",
      "score": 94,
      "label": "Hoàn hảo",
      "reason": "Có thể chọn cho sự kiện trang trọng nếu phù hợp quy định trang phục của nơi tổ chức."
    },
    {
      "eventId": "evt-festival",
      "score": 89,
      "label": "Rất phù hợp",
      "reason": "Gợi ý dự lễ hội; giữ tay và gấu áo không vướng khi đi lại."
    },
    {
      "eventId": "evt-street",
      "score": 55,
      "label": "Phù hợp",
      "reason": "Tay rộng có thể vướng khi hoạt động nhiều; chọn độ dài và địa điểm phù hợp."
    }
  ],
  "usageConsiderations": [
    "Cài hàng khuy bên phải để cổ và vạt áo nằm ngay ngắn khi mặc theo phom truyền thống.",
    "Tay áo rộng cần khoảng trống khi cử động; giữ tay áo tránh đồ ăn, nến và vật dễ mắc.",
    "Khăn đóng hoặc khăn vấn là lựa chọn phối. Chắp tay là một tư thế tạo dáng, không phải tư thế bắt buộc suốt buổi."
  ],
  "stylingGuide": {
    "accessories": [
      "Khăn đóng (khăn xếp)",
      "Quạt cầm tay thư pháp",
      "Túi gấm đeo thắt lưng",
      "Kính gọng tròn cổ điển"
    ],
    "hairstyles": [
      "Tóc búi gọn đội khăn xếp",
      "Tóc ngắn rẽ ngôi 7/3 vuốt nếp"
    ],
    "footwear": [
      "Giày da trơn đen",
      "Giày lười da lộn tối màu",
      "Guốc mộc truyền thống"
    ],
    "recommendedColors": [
      "Xanh lam thẫm",
      "Đỏ huyết dụ",
      "Xanh lục rêu",
      "Trắng ngà"
    ],
    "materialsAndMotifs": [
      "Lụa tơ tằm trơn",
      "Gấm vân hoa mây",
      "Chữ Thọ dệt chìm"
    ],
    "traditionalStyling": "Giữ kết cấu ngũ thân, cổ đứng, hàng năm khuy bên phải và tay rộng; phối quần dài ống rộng. Quần trắng và khăn vấn/khăn đóng là cách phối thường được nhắc tới cùng ngũ thân. Chọn giày vừa chân và độ dài áo phù hợp hoạt động; phụ kiện nghi lễ cần tư liệu riêng.",
    "modernRemixAdvice": "Gợi ý cách tân: giữ cổ đứng, năm thân và tay rộng, phối quần âu suông, giày da hoặc giày hiện đại phù hợp sự kiện; có thể thử màu và chất liệu nhẹ hơn. Không cần xắn tay để tạo vẻ hiện đại. Nếu thu tay thành tay chẽn thì đó là biến thể ngũ thân tay chẽn, không còn mẫu tay thụng này.",
    "avoidCombinations": [
      "Tránh chiết eo bó sát hoặc thu hẹp tay đến mức mất phom ngũ thân tay rộng.",
      "Tránh chọn gấu áo, ống quần hoặc tay áo dài đến mức vướng bước chân và thao tác.",
      "Khi dự lễ, vào nơi thờ tự hoặc tham gia hoạt động học đường, chọn độ kín và độ dài phù hợp nội quy nơi đến; kiểm tra áo khi ngồi, cúi và giơ tay để tránh lộ ngoài ý muốn."
    ]
  },
  "aiProfile": {
    "constructionDetails": [
      "Vietnamese Áo Tấc: a five-panel, wide-sleeved robe suitable for a formal traditional-inspired ensemble.",
      "Standing collar (Lập Lĩnh) with a neat right-side closure; proportions follow the selected reference rather than a universal fixed height.",
      "Ngũ Thân 5-panel tailored construction: 2 front panels, 2 back panels, and 1 inner under-panel (vạt con), overlapping securely on the right side.",
      "Five buttons fastening from the standing collar down the right side of the garment.",
      "Wide, loose sleeves (tay thụng) with natural fabric drape; do not force an unverified length or measurement.",
      "Wear over long trousers and an appropriate inner layer; white trousers are a traditional-inspired option, not a required color for every styling."
    ],
    "mandatoryFeatures": [
      "Erect standing Lập Lĩnh collar buttoned on the right.",
      "Extra-wide voluminous draped sleeves (Tay Thụng).",
      "Loose knee-length or calf-length straight 5-panel silhouette."
    ],
    "strictProhibitions": [
      "NO crossed V-neck or open front.",
      "NO modern tight western sleeves.",
      "NO Japanese kimono obi belt or Hanfu wrap sashes."
    ]
  },
  "research": {
    "status": "partially_reviewed",
    "reviewedAt": "2026-10-10",
    "sources": [
      {
        "sourceId": "hue-aodai",
        "scope": "Bối cảnh phát triển áo dài/ngũ thân từ Đàng Trong đến thời Nguyễn; không xác nhận riêng tên gọi áo Tấc."
      },
      {
        "sourceId": "hcmute-2024",
        "scope": "Phân biệt ngũ thân tay rộng (áo tấc/áo thụng) và tay chẽn; không xác nhận nguồn gốc tên gọi.",
        "locator": "Tập san Thời trang và Du lịch, số 1 (2024), mục 3.1.2, tr. 60"
      }
    ],
    "modernUse": "Có thể phối áo Tấc với quần dài, khăn đóng và giày phù hợp lễ cưới hoặc sự kiện văn hóa. Thẻ bài, quạt và kính là lựa chọn tạo hình; cần tư liệu riêng nếu muốn tái hiện một nhân vật lịch sử.",
    "limitations": [
      "Nguồn hiện có chưa xác nhận nguồn gốc tên “tấc”, kích thước tay áo hay quy định phụ kiện cho từng nghi lễ."
    ]
  }
};
