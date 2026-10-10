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
  "shortDescription": "Lễ phục trang trọng của cả nam và nữ thời Nguyễn, có ống tay áo rộng thụng dài một tấc, tượng trưng cho sự đĩnh đạc và lễ độ.",
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
      "description": "Tư thế chắp tay hoặc đứng nghiêm trang",
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
      "description": "Quần lụa dài quét nhẹ gót chân",
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
      "name": "Tay áo thụng dài 1 tấc",
      "layerOrder": 4,
      "isRequired": true,
      "type": "main",
      "description": "Tay áo rộng xòe, khi chắp tay tạo thế trang nghiêm",
      "defaultColor": "#2b4162"
    },
    {
      "id": "cmp-at-buttons",
      "name": "Hàng 5 khuy cài xà cừ / đồng",
      "layerOrder": 4,
      "isRequired": true,
      "type": "main",
      "description": "Biểu trưng cho Ngũ Thường (Nhân Lễ Nghĩa Trí Tín)",
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
      "name": "Lam thẫm (Xanh navy cung đình)",
      "hex": "#1d3557",
      "meaning": "Điềm đạm, trí tuệ và sự chuẩn mực của bậc trí thức",
      "popularity": "Rất phổ biến cho nam"
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
      "name": "Lụa tơ tằm dệt trơn Bảo Lộc",
      "textureType": "silk",
      "origin": "Lâm Đồng & Hà Đông",
      "description": "Mềm mát, độ bóng mờ quý phái, tà bay bổng"
    },
    {
      "id": "mat-at-gam-hoa",
      "name": "Gấm dệt vân mây chữ Thọ",
      "textureType": "brocade",
      "origin": "Vạn Phúc, Hà Đông",
      "description": "Đứng form áo, hoa văn ẩn hiện tôn vẻ bề thế"
    },
    {
      "id": "mat-at-dui",
      "name": "Đũi tơ tằm dệt thô thủ công",
      "textureType": "linen_silk",
      "origin": "Nam Định",
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
      "traditionalMeaning": "Đầu đội trời, tâm ngay thẳng",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-at-thebai",
      "name": "Thẻ bài gỗ mun khắc chữ nho",
      "category": "waist",
      "layerOrder": 6,
      "description": "Đạo cụ thẻ bài tạo hình; cần nguồn riêng để gắn với quan chức hoặc nhân vật cụ thể.",
      "traditionalMeaning": "Danh dự và chức phận",
      "isRecommended": false,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-at-quat",
      "name": "Quạt giấy dó viết thư pháp",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Cầm tay nho nhã thi vị",
      "traditionalMeaning": "Gió lành đức độ",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-at-giay",
      "name": "Giày vải đen đế bọc vải hoặc guốc mộc",
      "category": "footwear",
      "layerOrder": 7,
      "description": "Đi êm chân, không phát ra tiếng kêu thất lễ",
      "traditionalMeaning": "Bước đi chừng mực",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    }
  ],
  "details": [
    {
      "id": "dtl-at-co",
      "name": "Cổ đứng lập lĩnh cao 3-4cm",
      "type": "collar",
      "description": "Kín đáo và giữ đầu luôn ngay ngắn"
    },
    {
      "id": "dtl-at-tay",
      "name": "Tay áo thụng dài che kín mu bàn tay",
      "type": "sleeve",
      "description": "Khi chắp tay tạo sự kính cẩn tột cùng"
    }
  ],
  "suitability": [
    {
      "eventId": "evt-tet",
      "score": 96,
      "label": "Hoàn hảo",
      "reason": "Áo Tấc là biểu tượng tuyệt hảo cho ngày mùng 1 Tết đi chúc thọ ông bà cha mẹ và vãn cảnh chùa."
    },
    {
      "eventId": "evt-wedding",
      "score": 95,
      "label": "Hoàn hảo",
      "reason": "Lễ phục chuẩn mực cho chú rể, đội bê tráp hoặc hai họ trong nghi thức hôn phối trang trọng."
    },
    {
      "eventId": "evt-yearbook",
      "score": 92,
      "label": "Rất phù hợp",
      "reason": "Rất được học sinh sinh viên lựa chọn vì phom dáng nho nhã, uyên bác và thanh lịch."
    },
    {
      "eventId": "evt-formal",
      "score": 94,
      "label": "Hoàn hảo",
      "reason": "Đại diện tiêu biểu cho quốc phục Việt Nam tiếp đón quan khách ngoại giao."
    },
    {
      "eventId": "evt-festival",
      "score": 89,
      "label": "Rất phù hợp",
      "reason": "Đoan trang, kính cẩn bước vào không gian đình làng và đền thánh."
    },
    {
      "eventId": "evt-street",
      "score": 55,
      "label": "Phù hợp",
      "reason": "Tay thụng hơi vướng khi vận động dạo phố nhiều, nhưng chụp hình thì tuyệt đẹp."
    }
  ],
  "usageConsiderations": [
    "Khi làm lễ hoặc chụp ảnh trang nghiêm, cần giữ tư thế chắp hai tay lại với nhau (tay áo buông dài tạo hình chữ V ngược).",
    "Luôn cài đủ 5 khuy từ cổ xuống nách và hông phải; không buông cúc cổ.",
    "Khăn đóng đội thẳng, không lệch quá nhiều về sau gáy.",
    "Màu, vật liệu, phụ kiện và điểm phù hợp sự kiện trong ứng dụng là gợi ý phối hiện nay; không chứng nhận một bộ phục dựng lịch sử."
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
    "traditionalStyling": "Áo Tấc lụa tơ tằm đơn sắc, bên trong lót áo cánh trắng, quần lụa trắng ống rộng, đầu đội khăn đóng đen chữ Nhân, chân đi giày đen hoặc guốc mộc.",
    "modernRemixAdvice": "Remix hiện đại: Thay quần lụa trắng dài bằng quần âu tây dáng đứng (tapered trousers), phối với giày da Oxford đen bóng hoặc bốt da cổ thấp, tay áo có thể xắn gọn một nếp khi dạo phố.",
    "avoidCombinations": [
      "Tránh mang dép lê, dép tổ ong xỏ ngón khi mặc Áo Tấc.",
      "Tránh mặc quần đùi hoặc quần lửng lộ ra dưới tà áo.",
      "Khi dự lễ, nên cài áo gọn gàng và giữ tay áo không vướng hoạt động."
    ]
  },
  "aiProfile": {
    "constructionDetails": [
      "Vietnamese Áo Tấc: a five-panel, wide-sleeved robe suitable for a formal traditional-inspired ensemble.",
      "Standing collar (Lập Lĩnh) with a neat right-side closure; proportions follow the selected reference rather than a universal fixed height.",
      "Ngũ Thân 5-panel tailored construction: 2 front panels, 2 back panels, and 1 inner under-panel (vạt con), overlapping securely on the right side.",
      "Five traditional buttons (Ngũ thường buttons) curving gracefully from the neck collar across the right clavicle and down the right side seam.",
      "Wide, loose sleeves (tay thụng) with natural fabric drape; do not force an unverified length or measurement.",
      "Worn over pristine white inner silk pants (quần bạch quy) and an inner high-collar white undergarment."
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
