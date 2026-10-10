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
  "shortDescription": "Áo nữ cung đình triều Nguyễn, có hai vạt đối nhau, nẹp cổ rộng tạo khung chữ nhật trước ngực, thân và tay áo rộng.",
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
      "name": "Quần dài ống rộng trong mẫu phối",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Quần trắng là gợi ý phối; không đồng nhất dải ngũ sắc tay áo với màu quần.",
      "defaultColor": "#faf8f5"
    },
    {
      "id": "cmp-nb-main",
      "name": "Thân áo Nhật Bình chính",
      "layerOrder": 3,
      "isRequired": true,
      "type": "main",
      "description": "Thân áo rộng có hoa văn; hai vạt cố định theo cách buộc/cài của mẫu.",
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
      "name": "Tay áo rộng với dải ngũ sắc",
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
      "description": "Trang sức cài/đeo theo lựa chọn trong mẫu phối; không phải khóa áo bắt buộc.",
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
      "meaning": "Sắc đỏ nổi bật cho bộ phối lễ cưới hoặc lễ hội hiện nay; không tự xác nhận phẩm cấp.",
      "popularity": "Rất chuộng lễ cưới"
    },
    {
      "id": "col-nb-ivory",
      "name": "Trắng ngà lụa bạch",
      "hex": "#FAF7F0",
      "meaning": "Sắc sáng nhẹ trong bộ phối đương đại.",
      "popularity": "Gợi ý phối lễ cưới"
    },
    {
      "id": "col-nb-pink",
      "name": "Hồng phấn pastel",
      "hex": "#FBCFE8",
      "meaning": "Ngọt ngào, tươi trẻ của thiếu nữ đương đại nhưng vẫn giữ trọn nét đài các",
      "popularity": "Gợi ý chụp ảnh"
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
      "meaning": "Sắc xanh trầm, tạo tương phản với nẹp sáng màu.",
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
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Dệt hoa văn bát bửu ẩn hiện sang trọng"
    },
    {
      "id": "mat-lua-to-tam",
      "name": "Lụa tơ tằm mềm tự nhiên",
      "textureType": "silk",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Rũ tự nhiên, nhẹ thoáng và mát vào mùa hè"
    },
    {
      "id": "mat-sa-nam-nha",
      "name": "Sa mỏng dệt tơ",
      "textureType": "gauze",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Vải mỏng cần lớp trong phù hợp; đây là lựa chọn chất liệu minh họa."
    }
  ],
  "accessories": [
    {
      "id": "acc-nb-khanvanh",
      "name": "Khăn vành dây xanh lam thẫm",
      "category": "headwear",
      "layerOrder": 5,
      "description": "Quấn tỉ mỉ theo kỹ thuật cung đình Huế",
      "traditionalMeaning": "Giữ tóc gọn và tạo bố cục quanh gương mặt.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-nb-tram",
      "name": "Trâm bạc cài hoa sen cẩn ngọc",
      "category": "headwear",
      "layerOrder": 5,
      "description": "Cài ngang giấu thân trâm sau búi tóc, chỉ để lộ đầu trâm hoa sen cẩn ngọc và chuỗi tua rua buông rủ thanh nhã",
      "traditionalMeaning": "Trang trí búi tóc; chọn kiểu trâm theo bộ phối.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-nb-kimboi",
      "name": "Kim bội hoàng gia rủ tua rua đỏ",
      "category": "jewelry",
      "layerOrder": 6,
      "description": "Trang sức cài ngực rủ tua rua đỏ theo mẫu phối; không bắt buộc cho mọi áo Nhật Bình.",
      "traditionalMeaning": "Điểm nhấn trang sức ở trước ngực trong mẫu phối.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-nb-quat-doan-phien",
      "name": "Quạt đoàn phiến lụa tơ thêu mẫu đơn đính ngọc",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Quạt tròn lụa tơ tằm thêu hoa mẫu đơn, chuôi gỗ quý đính hạt ngọc và dải tua rua tơ tằm rủ mềm",
      "traditionalMeaning": "Đạo cụ cầm tay làm rõ hoa văn và màu của bộ phối.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-nb-quat-nan-nga",
      "name": "Quạt xếp nan màu ngà chạm lộng thếp vàng",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Quạt gỗ sáng màu hoặc vật liệu giả ngà, chạm hoa văn; gợi ý tạo hình hiện nay.",
      "traditionalMeaning": "Điểm nhấn cầm tay; không tự xác định quyền vị hoàng gia.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-nb-sen",
      "name": "Búp sen bách diệp hồng tươi",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Nâng niu đóa sen hồng Tây Hồ nhiều cánh tỏa hương thanh tao",
      "traditionalMeaning": "Chi tiết hoa cầm tay trong bộ ảnh.",
      "isRecommended": false,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-nb-hai",
      "name": "Hài thêu hoa sen mũi nhọn",
      "category": "footwear",
      "layerOrder": 7,
      "description": "Đế lót lụa mềm mại truyền thống",
      "traditionalMeaning": "Hoàn thiện phần chân của bộ phối.",
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
      "description": "Dải năm màu thường gặp trên tay; chọn theo mẫu và phẩm cấp khi phục dựng."
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
      "reason": "Thân rộng và hoa văn tạo điểm nhấn cho lễ cưới; chọn bộ phối theo vai trò và yêu cầu gia đình."
    },
    {
      "eventId": "evt-tet",
      "score": 92,
      "label": "Rất phù hợp",
      "reason": "Có thể dùng cho du xuân và chụp ảnh di tích; chọn độ dài thuận tiện đi bộ."
    },
    {
      "eventId": "evt-festival",
      "score": 88,
      "label": "Rất phù hợp",
      "reason": "Gợi ý cho sự kiện văn hóa; phục trang nghi lễ cụ thể cần theo ban tổ chức."
    },
    {
      "eventId": "evt-yearbook",
      "score": 85,
      "label": "Phù hợp",
      "reason": "Phù hợp bộ ảnh có chủ đề cổ phục; cần dự tính thời gian và không gian thay đồ."
    },
    {
      "eventId": "evt-art",
      "score": 90,
      "label": "Rất phù hợp",
      "reason": "Khung cổ và tay rộng giúp nhận diện trên sân khấu; chọn lớp trong ổn định khi cử động."
    },
    {
      "eventId": "evt-street",
      "score": 40,
      "label": "Cách tân độc đáo",
      "reason": "Có thể mặc nguyên dáng rộng khi dạo phố; ưu tiên vải và độ dài thuận tiện, không bắt buộc cắt ngắn áo."
    }
  ],
  "usageConsiderations": [
    "Giữ thân áo buông rộng, nẹp cổ ngay ngắn và hai vạt ổn định; không siết eo nếu muốn giữ phom Nhật Bình truyền thống.",
    "Chọn lớp trong phù hợp độ mở của áo; khi dự lễ cần bảo đảm kín đáo cả lúc ngồi và cúi người.",
    "Khăn vành là một lựa chọn phối; màu áo, dải ngũ sắc và đồ đội đầu của bộ phục dựng phải theo thời kỳ, phẩm cấp cụ thể.",
    "Giữ gấu áo và tay áo không vướng khi bước đi hoặc cầm đồ."
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
    "traditionalStyling": "Giữ thân rộng, tay rộng và nẹp cổ tạo khung chữ nhật; cố định hai vạt bằng cách buộc/cài của mẫu áo. Quần trắng và khăn vành là cách phối được ghi nhận ở giai đoạn muộn thời Nguyễn; không áp cho mọi thời kỳ. Lớp trong, hoa văn và đồ đội đầu của bộ phục dựng cần theo tư liệu cụ thể.",
    "modernRemixAdvice": "Gợi ý cách tân: giữ khung cổ chữ nhật, thân buông rộng và tay rộng; thử màu mới, giảm mật độ hoa văn hoặc phối quần suông, giày và trang sức hiện đại. Choker có thể dùng nếu vừa cổ, không kéo lệch nẹp hoặc che mất khung cổ. Khi thay hẳn phom thân hay kiểu cổ, gọi rõ là thiết kế lấy cảm hứng từ Nhật Bình.",
    "avoidCombinations": [
      "Tránh bó sát thân hoặc siết eo bằng đai nếu muốn giữ phom Nhật Bình; nếp kéo căng làm mất dáng áo buông rộng.",
      "Tránh khoét hoặc sửa nẹp làm mất khung chữ nhật khi vẫn giới thiệu là Nhật Bình theo phom truyền thống.",
      "Khi dự lễ, vào nơi thờ tự hoặc tham gia hoạt động học đường, chọn độ kín và độ dài phù hợp nội quy nơi đến; kiểm tra áo khi ngồi, cúi và giơ tay để tránh lộ ngoài ý muốn."
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
        "scope": "Quy chế năm 1807; cổ áo, phẩm cấp, ngoại lệ dải ngũ sắc và thay đổi đồ phối.",
        "locator": "Các đoạn quy chế 1807, ngoại lệ dải ngũ sắc và cách phối thay đổi theo thời kỳ."
      },
      {
        "sourceId": "nhat-binh-modern",
        "scope": "Ứng dụng và cách tân Nhật Bình trong thời trang hiện nay."
      },
      {
        "sourceId": "nhat-binh-fitting",
        "scope": "Phom thân rộng, không chiết eo và một bộ phối hiện nay của đơn vị cung cấp; không xác nhận quy chế cho mọi thời kỳ.",
        "locator": "Đoạn mô tả phom áo và mục Hướng dẫn mặc áo."
      }
    ],
    "modernUse": "Ngày nay có thể mặc Nhật Bình trong lễ cưới, chụp ảnh hoặc sự kiện văn hóa. Khăn vành, trâm, quạt và màu pastel là lựa chọn phối đồ; không mặc định mọi bộ đều tái hiện một phẩm cấp cung đình.",
    "limitations": [
      "Chưa đối chiếu từng hoa văn, kim bội, quạt và hài với một hiện vật cụ thể.",
      "Ảnh minh họa và lớp vẽ 2D không phải bằng chứng về độ chính xác của bản phục dựng."
    ]
  }
};
