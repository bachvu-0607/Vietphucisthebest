import type { Costume } from '../../shared/types.ts';

export const aoTuThan: Costume = {
  "id": "cos-tu-than",
  "name": "Áo Tứ Thân (Dân Gian Kinh Bắc)",
  "slug": "ao-tu-than",
  "era": "Thế kỷ 12 - 20 (Đặc trưng Bắc Bộ)",
  "region": "Đồng bằng Bắc Bộ (Kinh Bắc)",
  "gender": "female",
  "formality": "casual_refined",
  "coverImage": "/assets/costumes/ao-tu-than.jpg",
  "lineageCategory": "dich-chuyen",
  "lineageSubcategory": "tu-than",
  "lineageLabel": "Hệ Dịch Chuyển • Dân gian miền Bắc",
  "shortDescription": "Trang phục duyên dáng gồm bốn vạt áo, thường mặc buông vạt hoặc buộc chéo trước bụng, phối yếm đào, nón quai thao và bao tượng lụa.",
  "historicalContext": "Áo Tứ Thân gắn với văn hóa mặc của phụ nữ Bắc Bộ. Trong sinh hoạt Quan họ và Hội Lim, áo tứ thân thường xuất hiện cùng nón quai thao. Bộ phối lễ hội hiện nay không đại diện mọi dạng thường phục xưa.",
  "culturalSignificance": "Trang phục góp phần tạo hình ảnh quen thuộc của liền chị Quan họ. Cách hiểu bốn thân tượng trưng “tứ thân phụ mẫu” là diễn giải biểu tượng, chưa được xác minh là nguồn gốc của kiểu may.",
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
      "description": "Bốn vạt áo bay bổng buộc eo trước ngực",
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
      "meaning": "Cần cù mộc mạc",
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
      "origin": "Làng dệt Bắc Ninh",
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
      "traditionalMeaning": "Che nắng mưa và e ấp nụ cười duyên",
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
      "reason": "Trang phục trứ danh của lễ hội Lim và không gian dân gian truyền thống Bắc Bộ."
    },
    {
      "eventId": "evt-art",
      "score": 96,
      "label": "Hoàn hảo",
      "reason": "Rực rỡ sắc màu và rất có hồn dân ca trên sân khấu biểu diễn."
    }
  ],
  "usageConsiderations": [
    "Mặc cùng yếm đào lót trong và nón quai thao để hoàn chỉnh dáng hình liền chị.",
    "Màu, vật liệu, phụ kiện và điểm phù hợp sự kiện trong ứng dụng là gợi ý phối hiện nay; không chứng nhận một bộ phục dựng lịch sử."
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
    "traditionalStyling": "Áo Tứ Thân khoác ngoài yếm đào, thắt bao tượng lụa, đầu vấn khăn mỏ quạ đội nón quai thao.",
    "modernRemixAdvice": "Remix chụp ảnh: Kết hợp áo Tứ Thân vạt ngắn cùng chân váy đen xếp ly hiện đại.",
    "avoidCombinations": [
      "Tránh phối với phụ kiện kim loại tây âu to bản."
    ]
  },
  "aiProfile": {
    "constructionDetails": [
      "Authentic Northern Vietnamese folk attire Áo Tứ Thân (Kinh Bắc region).",
      "4-panel open outer robe where the two long front panels are tied gracefully in front at the waist.",
      "Worn over an inner red/pink halter top (Yếm đào), a white shirt, and flowing black silk skirt (váy đụp / váy lụa đen) with a contrasting green/pink silk waist sash (bao tượng / thắt lưng lụa).",
      "Accompanied by Nón Ba Tầm (large flat palm hat with silk chin straps) or Khăn Mỏ Quạ headscarf."
    ],
    "mandatoryFeatures": [
      "4 panels with tied front tails at the waist.",
      "Inner Yếm đào halter top.",
      "Flowing black silk skirt and colorful waist sash."
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
