import type { Costume } from '../../shared/types.ts';

export const aoTuThan: Costume = {
  "id": "cos-tu-than",
  "name": "Áo Tứ Thân (Dân Gian Kinh Bắc)",
  "slug": "ao-tu-than",
  "era": "Trang phục dân gian Bắc Bộ; có nhiều biến thể theo thời kỳ",
  "region": "Đồng bằng Bắc Bộ (Kinh Bắc)",
  "gender": "female",
  "formality": "casual_refined",
  "coverImage": "/assets/costumes/ao-tu-than.jpg",
  "lineageCategory": "dich-chuyen",
  "lineageSubcategory": "tu-than",
  "lineageLabel": "Hệ Dịch Chuyển • Dân gian miền Bắc",
  "shortDescription": "Trang phục duyên dáng gồm bốn vạt áo, thường mặc buông vạt hoặc buộc chéo trước bụng, phối yếm đào, nón quai thao và bao tượng lụa.",
  "historicalContext": "Áo Tứ Thân gắn với văn hóa mặc của phụ nữ Bắc Bộ. Trong sinh hoạt Quan họ và Hội Lim, áo tứ thân thường xuất hiện cùng nón quai thao. Bộ phối lễ hội hiện nay không đại diện mọi dạng thường phục xưa.",
  "culturalSignificance": "Áo tứ thân gắn với hình ảnh liền chị Quan họ trong sinh hoạt lễ hội hiện nay. Bộ yếm, váy, bao tượng và nón quai thao trong Studio là một cách tạo hình lễ hội, không đại diện mọi cách mặc của phụ nữ Bắc Bộ.",
  "isVerifiedHistoricalData": false,
  "verificationNote": "Đã đối chiếu các thông tin chính trong phạm vi nguồn bên dưới; phụ kiện và màu phối là gợi ý biên tập.",
  "components": [
    {
      "id": "cmp-tt-model",
      "name": "Người mẫu Liền chị Kinh Bắc",
      "layerOrder": 1,
      "isRequired": true,
      "type": "inner",
      "description": "Nụ cười duyên e ấp",
      "defaultColor": "#f7ede2"
    },
    {
      "id": "cmp-tt-yem",
      "name": "Yếm đào cổ xây",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Yếm lụa đào tôn vẻ thon thả",
      "defaultColor": "#e63946"
    },
    {
      "id": "cmp-tt-vay",
      "name": "Váy đũi lụa đen chấm gót",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Váy suông đen tuyền đằm thắm",
      "defaultColor": "#1a1a1a"
    },
    {
      "id": "cmp-tt-main",
      "name": "Áo tứ thân 4 vạt nâu/hạt dẻ",
      "layerOrder": 3,
      "isRequired": true,
      "type": "main",
      "description": "Hai vạt trước buông hoặc buộc ở eo theo mẫu.",
      "defaultColor": "#582f0e"
    },
    {
      "id": "cmp-tt-thatlung",
      "name": "Bao tượng lụa xanh/hồng thắt eo",
      "layerOrder": 4,
      "isRequired": true,
      "type": "accessory",
      "description": "Dải lụa mềm mại rủ nhẹ bên hông",
      "defaultColor": "#2a9d8f"
    }
  ],
  "colorVariants": [
    {
      "id": "col-tt-brown",
      "name": "Nâu non đồng nội",
      "hex": "#6f4e37",
      "meaning": "Sắc nâu trầm, nổi bật khi đi cùng yếm hoặc bao tượng sáng màu.",
      "popularity": "Dân gian truyền thống"
    },
    {
      "id": "col-tt-plum",
      "name": "Mận chín trẩy hội",
      "hex": "#800e13",
      "meaning": "Tươi tắn ngày hội Lim",
      "popularity": "Hát quan họ"
    }
  ],
  "materials": [
    {
      "id": "mat-tt-dui",
      "name": "Đũi tơ tằm thô",
      "textureType": "raw_silk",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Bền chắc, đượm màu thiên nhiên"
    }
  ],
  "accessories": [
    {
      "id": "acc-tt-non",
      "name": "Nón quai thao ba tầm",
      "category": "headwear",
      "layerOrder": 5,
      "description": "Nón tròn lớn quai thao dệt tơ buông dài",
      "traditionalMeaning": "Đồ đội/cầm tay trong tạo hình Quan họ, Hội Lim.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    }
  ],
  "details": [
    {
      "id": "dtl-tt-vat",
      "name": "Hai vạt trước buộc chéo",
      "type": "hem",
      "description": "Đặc trưng thắt vạt duyên dáng"
    }
  ],
  "suitability": [
    {
      "eventId": "evt-festival",
      "score": 100,
      "label": "Hoàn hảo",
      "reason": "Gắn với hình ảnh liền chị Quan họ và Hội Lim; không đại diện mọi lễ hội Bắc Bộ."
    },
    {
      "eventId": "evt-art",
      "score": 96,
      "label": "Hoàn hảo",
      "reason": "Gợi ý cho biểu diễn dân ca; cố định yếm, vạt và bao tượng theo động tác."
    }
  ],
  "usageConsiderations": [
    "Mẫu lễ hội có thể phối yếm, váy dài và bao tượng; nón quai thao, khăn mỏ quạ là lựa chọn theo bộ phối, không bắt buộc cho mọi cách mặc.",
    "Cố định yếm và hai vạt trước, giữ dải thắt lưng không vướng chân khi di chuyển."
  ],
  "stylingGuide": {
    "accessories": [
      "Nón quai thao",
      "Bao tượng lụa",
      "Khăn mỏ quạ"
    ],
    "hairstyles": [
      "Tóc vấn khăn mỏ quạ đen"
    ],
    "footwear": [
      "Guốc mộc quai cong"
    ],
    "recommendedColors": [
      "Nâu non phối yếm đỏ",
      "Đen tuyền phối bao tượng xanh"
    ],
    "materialsAndMotifs": [
      "Đũi dệt thô",
      "Lụa tơ tằm mềm"
    ],
    "traditionalStyling": "Giữ bốn thân áo và hai vạt trước buông hoặc buộc theo mẫu. Cách phối lễ hội trong Studio dùng yếm, váy dài và bao tượng; có thể chọn khăn mỏ quạ, nón quai thao. Khi tái hiện một sinh hoạt hoặc thời kỳ cụ thể cần đối chiếu tư liệu thay vì áp bộ lễ hội cho mọi trường hợp.",
    "modernRemixAdvice": "Gợi ý cách tân: thay bảng màu, chất liệu hoặc phối chân váy hiện đại, giữ hai vạt trước và điểm thắt làm nhận diện. Có thể thử độ dài ngắn hơn nhưng vẫn cần lớp trong ổn định. Trang sức và túi hiện đại là tùy chọn, không bị loại chỉ vì khác phong cách truyền thống.",
    "avoidCombinations": [
      "Tránh yếm hoặc vạt buộc dễ tuột, gây lộ ngoài ý muốn khi biểu diễn và cúi người.",
      "Tránh dải bao tượng và gấu váy quá dài làm vướng bước chân.",
      "Khi dự lễ, vào nơi thờ tự hoặc tham gia hoạt động học đường, chọn độ kín và độ dài phù hợp nội quy nơi đến; kiểm tra áo khi ngồi, cúi và giơ tay để tránh lộ ngoài ý muốn."
    ]
  },
  "aiProfile": {
    "constructionDetails": [
      "Authentic Northern Vietnamese folk attire Áo Tứ Thân (Kinh Bắc region).",
      "4-panel open outer robe where the two long front panels are tied gracefully in front at the waist.",
      "Wear an inner yếm or appropriate inner layer with a long lower garment and waist sash for this suggested ensemble; follow selected colors rather than forcing red, black or green.",
      "Add Nón Ba Tầm or Khăn Mỏ Quạ only when selected; do not add unselected headwear."
    ],
    "mandatoryFeatures": [
      "4 panels with tied front tails at the waist.",
      "Inner Yếm đào halter top.",
      "Long lower garment and waist sash for the selected ensemble; do not force a fixed color."
    ],
    "strictProhibitions": [
      "NO single-piece modern dress.",
      "NO imperial dragon motifs on folk dress."
    ]
  },
  "research": {
    "status": "partially_reviewed",
    "reviewedAt": "2026-10-10",
    "sources": [
      {
        "sourceId": "hoi-lim",
        "scope": "Áo tứ thân và nón quai thao trong sinh hoạt Hội Lim hiện nay."
      }
    ],
    "modernUse": "Phối yếm, bao tượng, khăn mỏ quạ và nón quai thao theo nhu cầu biểu diễn hoặc chụp ảnh. Có thể thử màu và độ dài hiện đại; ghi rõ là cách tân khi thay đổi phom.",
    "limitations": [
      "Chưa có hồ sơ cắt may và nguồn niên đại cho từng biến thể trong danh mục."
    ]
  }
};
