import type { Costume } from '../../shared/types.ts';

export const aoNhatBinh: Costume = {
  "id": "cos-nhat-binh",
  "name": "Áo Nhật Bình",
  "slug": "ao-nhat-binh",
  "era": "Triều Nguyễn (1802 - 1945)",
  "region": "Cố đô Huế (Trung Bộ)",
  "gender": "female",
  "formality": "ceremonial",
  "coverImage": "/assets/costumes/ao-nhat-binh-cong-chua.jpg",
  "lineageCategory": "dich-chuyen",
  "lineageSubcategory": "nhat-binh",
  "lineageLabel": "Hệ Dịch Chuyển • Lễ phục cung đình nữ",
  "shortDescription": "Thường phục trang trọng của bậc Hậu phi, Công chúa và Cung tần triều Nguyễn, nổi bật với cổ áo hình chữ nhật viền hoa văn tinh xảo.",
  "historicalContext": "Nhật Bình thuộc hệ trang phục nữ cung đình Nguyễn, với quy định được ghi nhận từ năm 1807. Áo có hai vạt đối nhau và nẹp cổ rộng tạo khung chữ nhật trước ngực. Cách phối xiêm, quần và đồ đội đầu thay đổi theo thời kỳ.",
  "culturalSignificance": "Màu áo, hoa văn và trang sức từng phân biệt phẩm cấp. Dải ngũ sắc thường gặp ở tay áo nhưng có ngoại lệ, như áo hoàng hậu. Khi phục dựng cần chọn một thời kỳ và đối tượng cụ thể; màu trong Studio là bảng phối tham khảo.",
  "isVerifiedHistoricalData": false,
  "verificationNote": "Đã đối chiếu các thông tin chính trong phạm vi nguồn bên dưới; phụ kiện và màu phối là gợi ý biên tập.",
  "components": [
    {
      "id": "cmp-nb-model",
      "name": "Hình thể người mẫu Nữ",
      "layerOrder": 1,
      "isRequired": true,
      "type": "inner",
      "description": "Khuôn mặt thanh tú, thần thái đoan trang cung đình",
      "defaultColor": "#f5ebe0"
    },
    {
      "id": "cmp-nb-inner",
      "name": "Áo lót cánh trắng (Lớp trong)",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Áo trắng mỏng may sát cổ giữ vẻ kín đáo",
      "defaultColor": "#ffffff"
    },
    {
      "id": "cmp-nb-pants",
      "name": "Quần lụa trắng hoặc ngũ sắc",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Quần sa/lụa ống rộng mềm mại",
      "defaultColor": "#faf8f5"
    },
    {
      "id": "cmp-nb-main",
      "name": "Thân áo Nhật Bình chính",
      "layerOrder": 3,
      "isRequired": true,
      "type": "main",
      "description": "Thân áo gấm dệt hoa tròn, vạt cài dải cúc ngọc",
      "defaultColor": "#9e1b22"
    },
    {
      "id": "cmp-nb-collar",
      "name": "Cổ áo Nhật Bình chữ nhật",
      "layerOrder": 4,
      "isRequired": true,
      "type": "main",
      "description": "Viền cổ chữ nhật thêu ngũ sắc, hồi văn kim tuyến",
      "defaultColor": "#d4af37"
    },
    {
      "id": "cmp-nb-sleeves",
      "name": "Tay áo dải ngũ hành",
      "layerOrder": 4,
      "isRequired": true,
      "type": "main",
      "description": "Dải ngũ sắc thường gặp gồm lục, vàng, xanh, trắng, đỏ; không áp dụng cho mọi phẩm cấp. Studio minh họa một mẫu phối.",
      "defaultColor": "#c5a059"
    },
    {
      "id": "cmp-nb-head",
      "name": "Khăn vành dây Huế",
      "layerOrder": 5,
      "isRequired": false,
      "type": "headwear",
      "description": "Khăn vành dệt sa màu lam, tím hoặc vàng quấn nhiều nếp quanh đầu",
      "defaultColor": "#1d3557"
    },
    {
      "id": "cmp-nb-kimboi",
      "name": "Kim bội / Ngọc bội thắt dải lụa",
      "layerOrder": 6,
      "isRequired": false,
      "type": "accessory",
      "description": "Dây ngọc bội đeo trước ngực tạo âm thanh trang nhã khi cử động",
      "defaultColor": "#e9c46a"
    },
    {
      "id": "cmp-nb-fan",
      "name": "Quạt xếp trầm hương vẽ cảnh Huế",
      "layerOrder": 6,
      "isRequired": false,
      "type": "accessory",
      "description": "Quạt nan gỗ trầm bọc lụa thanh tao",
      "defaultColor": "#d8b4e2"
    },
    {
      "id": "cmp-nb-shoes",
      "name": "Hài thêu phụng hoàng mũi cong",
      "layerOrder": 7,
      "isRequired": false,
      "type": "footwear",
      "description": "Đôi hài mũi vểnh thêu chỉ vàng chỉ bạc cung quyến",
      "defaultColor": "#8a1c14"
    }
  ],
  "colorVariants": [
    {
      "id": "col-nb-red",
      "name": "Đỏ son cung đình",
      "hex": "#a61c1c",
      "meaning": "Tượng trưng cho hỷ sự, tôn nghiêm và phẩm giá Công chúa",
      "popularity": "Rất chuộng lễ cưới"
    },
    {
      "id": "col-nb-ivory",
      "name": "Trắng ngà lụa bạch",
      "hex": "#FAF7F0",
      "meaning": "Sắc trắng ngà thuần khiết, thanh thoát, phong cách cách tân cưới hoàng gia hiện đại",
      "popularity": "Hot cách tân cưới"
    },
    {
      "id": "col-nb-pink",
      "name": "Hồng phấn pastel",
      "hex": "#FBCFE8",
      "meaning": "Ngọt ngào, tươi trẻ của thiếu nữ đương đại nhưng vẫn giữ trọn nét đài các",
      "popularity": "Hot chụp ảnh xuân"
    },
    {
      "id": "col-nb-yellow",
      "name": "Hoàng yến quý phái",
      "hex": "#d4af37",
      "meaning": "Sắc vàng quyền quý, ấm áp và vinh quang",
      "popularity": "Rất trang trọng"
    },
    {
      "id": "col-nb-teal",
      "name": "Xanh ngọc bích",
      "hex": "#1b6b68",
      "meaning": "Thanh lịch, điềm tĩnh của bậc cung tần hiền thục",
      "popularity": "Chụp ảnh xuân"
    },
    {
      "id": "col-nb-purple",
      "name": "Tím hoa cà xứ Huế",
      "hex": "#63326e",
      "meaning": "Nét trầm mặc, thủy chung của văn hóa sông Hương",
      "popularity": "Cổ điển đặc sắc"
    }
  ],
  "materials": [
    {
      "id": "mat-gam-hue",
      "name": "Gấm dệt tơ tằm cổ điển",
      "textureType": "damask",
      "origin": "Vạn Phúc & Huế",
      "description": "Dệt hoa văn bát bửu ẩn hiện sang trọng"
    },
    {
      "id": "mat-lua-to-tam",
      "name": "Lụa tơ tằm mềm tự nhiên",
      "textureType": "silk",
      "origin": "Làng dệt Nha Xá",
      "description": "Rũ tự nhiên, nhẹ thoáng và mát vào mùa hè"
    },
    {
      "id": "mat-sa-nam-nha",
      "name": "Sa Nam Nhã gấm mỏng",
      "textureType": "gauze",
      "origin": "Phục dựng theo mẫu cổ",
      "description": "Chất liệu xuyên thấu tinh tế mặc vào dịp lễ tiết cung đình"
    }
  ],
  "accessories": [
    {
      "id": "acc-nb-khanvanh",
      "name": "Khăn vành dây xanh lam thẫm",
      "category": "headwear",
      "layerOrder": 5,
      "description": "Quấn tỉ mỉ theo kỹ thuật cung đình Huế",
      "traditionalMeaning": "Giữ nếp tóc gọn gàng tôn gương mặt đoan trang",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-nb-tram",
      "name": "Trâm bạc cài hoa sen cẩn ngọc",
      "category": "headwear",
      "layerOrder": 5,
      "description": "Cài ngang giấu thân trâm sau búi tóc, chỉ để lộ đầu trâm hoa sen cẩn ngọc và chuỗi tua rua buông rủ thanh nhã",
      "traditionalMeaning": "Bình an, đoan trang và tiết hạnh",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-nb-kimboi",
      "name": "Kim bội hoàng gia rủ tua rua đỏ",
      "category": "jewelry",
      "layerOrder": 6,
      "description": "Trang sức cài ngực rủ tua rua đỏ theo mẫu phối; không bắt buộc cho mọi áo Nhật Bình.",
      "traditionalMeaning": "Phước lộc, quyền quý và thanh khiết",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-nb-quat-doan-phien",
      "name": "Quạt đoàn phiến lụa tơ thêu mẫu đơn đính ngọc",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Quạt tròn lụa tơ tằm thêu hoa mẫu đơn, chuôi gỗ quý đính hạt ngọc và dải tua rua tơ tằm rủ mềm",
      "traditionalMeaning": "Đoan trang, viên mãn và phú quý",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-nb-quat-nan-nga",
      "name": "Quạt xếp nan màu ngà chạm lộng thếp vàng",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Quạt gỗ sáng màu hoặc vật liệu giả ngà, chạm hoa văn; gợi ý tạo hình hiện nay.",
      "traditionalMeaning": "Đài các, uy quyền chốn hoàng cung",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-nb-sen",
      "name": "Búp sen bách diệp hồng tươi",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Nâng niu đóa sen hồng Tây Hồ nhiều cánh tỏa hương thanh tao",
      "traditionalMeaning": "Thuần khiết, thoát tục",
      "isRecommended": false,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-nb-hai",
      "name": "Hài thêu hoa sen mũi nhọn",
      "category": "footwear",
      "layerOrder": 7,
      "description": "Đế lót lụa mềm mại truyền thống",
      "traditionalMeaning": "Bước đi thanh thoát nhẹ nhàng",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    }
  ],
  "details": [
    {
      "id": "dtl-nb-cuc",
      "name": "Khuy ngọc cẩm thạch bọc bạc",
      "type": "button",
      "description": "Cài ở vạt trước ngực"
    },
    {
      "id": "dtl-nb-vien",
      "name": "Dải ngũ sắc viền tay áo",
      "type": "sleeve",
      "description": "Ngũ hành tương sinh tương khắc"
    },
    {
      "id": "dtl-nb-hoa-van",
      "name": "Họa tiết Bát Bửu triều Nguyễn",
      "type": "hem",
      "description": "Tượng trưng cho sự may mắn và trường thọ"
    }
  ],
  "suitability": [
    {
      "eventId": "evt-wedding",
      "score": 98,
      "label": "Hoàn hảo",
      "reason": "Áo Nhật Bình sắc đỏ son hoặc hoàng yến là trang phục cưới danh giá, vừa tôn vinh văn hóa cội nguồn vừa cực kỳ lộng lẫy."
    },
    {
      "eventId": "evt-tet",
      "score": 92,
      "label": "Rất phù hợp",
      "reason": "Rực rỡ không khí tân niên, thích hợp chụp ảnh tại di tích, cung điện hoặc chùa cổ đầu năm."
    },
    {
      "eventId": "evt-festival",
      "score": 88,
      "label": "Rất phù hợp",
      "reason": "Tham gia các lễ hội truyền thống, đại lễ rước thánh và ngày hội văn hóa cổ phong."
    },
    {
      "eventId": "evt-yearbook",
      "score": 85,
      "label": "Phù hợp",
      "reason": "Tạo nên bộ ảnh tốt nghiệp đậm chất cổ phong quý tộc khác biệt với số đông."
    },
    {
      "eventId": "evt-art",
      "score": 90,
      "label": "Rất phù hợp",
      "reason": "Họa tiết rực rỡ và dải ngũ sắc bắt đèn sân khấu hoàn hảo."
    },
    {
      "eventId": "evt-street",
      "score": 40,
      "label": "Cách tân độc đáo",
      "reason": "Bản gốc khá nặng và trang trọng, chỉ nên mặc phiên bản Nhật Bình vạt ngắn khi dạo phố."
    }
  ],
  "usageConsiderations": [
    "Cần mặc áo lót kín cổ bên trong; không để lộ áo hiện đại ở phần cổ chữ nhật.",
    "Khi bước đi, nhấc nhẹ vạt trước hoặc bước ngắn khoan thai để giữ dáng áo trang trọng.",
    "Khăn vành dây là một lựa chọn phối theo phong cách Huế; không quy định chung số vòng quấn cho mọi thời kỳ.",
    "Tránh kết hợp với trang sức tây phương kim loại to bản hầm hố.",
    "Màu, vật liệu, phụ kiện và điểm phù hợp sự kiện trong ứng dụng là gợi ý phối hiện nay; không chứng nhận một bộ phục dựng lịch sử."
  ],
  "stylingGuide": {
    "accessories": [
      "Khăn vành sa",
      "Kim bội ngọc",
      "Trâm cài bạc",
      "Quạt lụa cầm tay"
    ],
    "hairstyles": [
      "Búi tóc sau đội khăn vành",
      "Búi tóc bánh lái cổ truyền cài trâm"
    ],
    "footwear": [
      "Hài mũi cong thêu hoa",
      "Guốc mộc mũi nhung truyền thống"
    ],
    "recommendedColors": [
      "Đỏ thắm kết hợp viền vàng",
      "Vàng hoàng yến viền lam",
      "Xanh ngọc bích viền ngũ sắc"
    ],
    "materialsAndMotifs": [
      "Gấm tơ tằm dệt hoa tròn",
      "Hoa văn Bát Bửu",
      "Thêu chim Phượng và mây lành"
    ],
    "traditionalStyling": "Gợi ý phối theo phong cách truyền thống: áo Nhật Bình, quần lụa và khăn vành. Khi phục dựng cung đình cần xác định phẩm cấp và thời kỳ trước khi chọn màu, hoa văn và đồ đội đầu.",
    "modernRemixAdvice": "Remix phong cách đương đại: Giữ lại cổ áo hình chữ nhật đặc trưng nhưng rút ngắn thân áo qua hông một chút, phối cùng quần culottes lụa ống suông hoặc chân váy xếp ly đơn sắc.",
    "avoidCombinations": [
      "Tránh mặc cùng quần jean bó hoặc đi giày sneaker thể thao thô kệch.",
      "Tránh đeo vòng cổ chocker hiện đại làm rối phần cổ áo chữ nhật thiêng liêng.",
      "Tuyệt đối không xẻ vạt hoặc khoét ngực sâu làm biến dạng form áo cung đình."
    ]
  },
  "aiProfile": {
    "constructionDetails": [
      "Authentic Vietnamese Nguyễn-Dynasty Áo Nhật Bình (Imperial court ceremonial robe).",
      "Phi phong / Đối khâm construction with two symmetrical, parallel vertical front edges (NOT a crossed wrap).",
      "A broad, highly distinctive rectangular collar and front-border band (Nẹp cổ chữ nhật / Nẹp vạt Nhật Bình) framing the neck and upper chest.",
      "When viewed from the front, the collar and front borders MUST form the characteristic rectangular visual frame uniquely associated with Áo Nhật Bình.",
      "Loose silhouette and wide sleeves. Five-color cuff bands occur on many examples, with rank-specific exceptions; do not force bands onto every design.",
      "Keep the front fastening discreet. Add Kim Bội jewelry only when selected; it is not a universal mandatory chest clasp.",
      "Two symmetrical front panels fall naturally and visibly straight down across the lower body and thighs while seated or standing."
    ],
    "mandatoryFeatures": [
      "Rectangular collar/front-border frame.",
      "Two opposing front panels and a loose, wide-sleeved silhouette."
    ],
    "strictProhibitions": [
      "NO crossed white V-shaped lapel or kimono-style wrap closure.",
      "NO Hanbok-style short jacket or high-waisted empire skirt.",
      "NO generic Hanfu crossed-collar wrap robe.",
      "NO large square Mandarin rank badge (Bổ tử) centered on the chest that hides the characteristic Nhật Bình rectangular collar.",
      "NO fantasy Chinese imperial dragon robe elements or oversized fantasy armor."
    ]
  },
  "research": {
    "status": "partially_reviewed",
    "reviewedAt": "2026-10-10",
    "sources": [
      {
        "sourceId": "nhat-binh-hai",
        "scope": "Quy chế năm 1807; cổ áo, phẩm cấp, ngoại lệ dải ngũ sắc và thay đổi đồ phối."
      },
      {
        "sourceId": "nhat-binh-modern",
        "scope": "Ứng dụng và cách tân Nhật Bình trong thời trang hiện nay."
      }
    ],
    "modernUse": "Ngày nay có thể mặc Nhật Bình trong lễ cưới, chụp ảnh hoặc sự kiện văn hóa. Khăn vành, trâm, quạt và màu pastel là lựa chọn phối đồ; không mặc định mọi bộ đều tái hiện một phẩm cấp cung đình.",
    "limitations": [
      "Chưa đối chiếu từng hoa văn, kim bội, quạt và hài với một hiện vật cụ thể.",
      "Ảnh minh họa và lớp vẽ 2D không phải bằng chứng về độ chính xác của bản phục dựng."
    ]
  }
};
