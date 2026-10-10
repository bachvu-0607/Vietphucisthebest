import type { Costume } from '../../shared/types.ts';

export const aoDoiKham: Costume = {
  "id": "cos-doi-kham",
  "name": "Áo Đối Khâm (Cổ Phục Quý Tộc)",
  "slug": "ao-doi-kham",
  "era": "Tư liệu thời Lê; kiểu áo có nhiều biến thể",
  "region": "Bắc Bộ & Trung Bộ",
  "gender": "unisex",
  "formality": "formal",
  "coverImage": "/assets/costumes/ao-nhat-binh-tu-cung.jpg",
  "lineageCategory": "dich-chuyen",
  "lineageSubcategory": "nhat-binh",
  "lineageLabel": "Áo Đối Khâm • Song song (Hệ Dịch Chuyển)",
  "shortDescription": "Áo khoác có hai vạt đối nhau phía trước, để thấy lớp mặc bên trong; mẫu yếm và váy trong Studio là một gợi ý tạo hình.",
  "historicalContext": "Đối khâm mô tả hai vạt áo đối nhau ở phía trước. Khảo cứu về tượng thời Lê Trung Hưng ghi nhận áo khoác đối khâm cùng trang phục bên trong. Không thể suy từ một mẫu thành bộ y phục chung cho toàn thời Lý–Trần–Lê.",
  "culturalSignificance": "Hai vạt đối nhau cho thấy lớp mặc bên trong và tạo bố cục màu khi xếp lớp. Cách phối còn phụ thuộc đối tượng, thời kỳ và sinh hoạt; kiểu vạt mở không tự xác định một bộ y phục quý tộc.",
  "isVerifiedHistoricalData": false,
  "verificationNote": "Đã đối chiếu các thông tin chính trong phạm vi nguồn bên dưới; phụ kiện và màu phối là gợi ý biên tập.",
  "components": [
    {
      "id": "cmp-dk-model",
      "name": "Người mẫu Nữ dịu dàng",
      "layerOrder": 1,
      "isRequired": true,
      "type": "inner",
      "description": "Vóc dáng thanh tú truyền thống",
      "defaultColor": "#f7ede2"
    },
    {
      "id": "cmp-dk-inner",
      "name": "Lớp áo trong hoặc yếm theo mẫu phối",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Chọn lớp trong ổn định, đủ độ che phủ qua hai vạt mở.",
      "defaultColor": "#c1121f"
    },
    {
      "id": "cmp-dk-skirt",
      "name": "Váy lụa dài xếp nếp rộng",
      "layerOrder": 2,
      "isRequired": true,
      "type": "inner",
      "description": "Váy dài xếp nếp; gấu không vướng khi di chuyển.",
      "defaultColor": "#fdf0d5"
    },
    {
      "id": "cmp-dk-main",
      "name": "Áo khoác Đối Khâm hai vạt thẳng",
      "layerOrder": 3,
      "isRequired": true,
      "type": "outer",
      "description": "Hai vạt áo buông song song không cài khuy",
      "defaultColor": "#588157"
    },
    {
      "id": "cmp-dk-acc",
      "name": "Chuỗi kiềng bạc hoặc ngọc đeo cổ",
      "layerOrder": 6,
      "isRequired": false,
      "type": "accessory",
      "description": "Tôn vinh khoảng ngực thanh tao",
      "defaultColor": "#e0e1dd"
    },
    {
      "id": "cmp-dk-shoes",
      "name": "Hài thêu cánh sen",
      "layerOrder": 7,
      "isRequired": false,
      "type": "footwear",
      "description": "Hài mũi nhọn đính ngọc trai",
      "defaultColor": "#780001"
    }
  ],
  "colorVariants": [
    {
      "id": "col-dk-moss",
      "name": "Xanh rêu ngọc bích",
      "hex": "#3a5a40",
      "meaning": "Hài hòa với cỏ cây thiên nhiên, nét thanh lịch cổ xưa",
      "popularity": "Rất thanh tao"
    },
    {
      "id": "col-dk-crimson",
      "name": "Đỏ hồng đào",
      "hex": "#b5179e",
      "meaning": "Sắc hồng tím nổi bật trong bộ phối hiện nay.",
      "popularity": "Mùa xuân"
    },
    {
      "id": "col-dk-ivory",
      "name": "Trắng ngà lụa nõn",
      "hex": "#f8f9fa",
      "meaning": "Thuần khiết và siêu thực",
      "popularity": "Chụp concept"
    }
  ],
  "materials": [
    {
      "id": "mat-dk-sa",
      "name": "Sa mỏng dệt tơ bóng mờ",
      "textureType": "gauze",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Mỏng nhẹ, phất phơ theo làn gió"
    },
    {
      "id": "mat-dk-gam",
      "name": "Gấm dệt vân mây hoa lá",
      "textureType": "brocade",
      "origin": "Mẫu chất liệu tham khảo; chưa xác nhận xuất xứ.",
      "description": "Sang trọng cho ngày lễ hội lớn"
    }
  ],
  "accessories": [
    {
      "id": "acc-dk-kieng",
      "name": "Kiềng bạc chạm hoa mai",
      "category": "jewelry",
      "layerOrder": 6,
      "description": "Đeo vừa vặn ôm cổ",
      "traditionalMeaning": "Điểm nhấn quanh cổ trong bộ phối.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    },
    {
      "id": "acc-dk-quat",
      "name": "Quạt tròn lụa dệt hoa phù dung",
      "category": "handheld",
      "layerOrder": 6,
      "description": "Phụ kiện che nghiêng nụ cười duyên",
      "traditionalMeaning": "Phụ kiện cầm tay tạo bố cục cho ảnh.",
      "isRecommended": true,
      "contextNote": "Lựa chọn phối đồ của ứng dụng; chưa xác nhận thuộc một bộ phục dựng cụ thể."
    }
  ],
  "details": [
    {
      "id": "dtl-dk-nep",
      "name": "Nẹp cổ áo viền thêu hoa dây",
      "type": "collar",
      "description": "Chạy dài suốt từ gáy xuống tận gấu áo"
    }
  ],
  "suitability": [
    {
      "eventId": "evt-art",
      "score": 95,
      "label": "Hoàn hảo",
      "reason": "Hai vạt mở và lớp trong tạo hiệu ứng khi di chuyển; chọn trang phục theo tiết mục."
    },
    {
      "eventId": "evt-yearbook",
      "score": 90,
      "label": "Rất phù hợp",
      "reason": "Gợi ý ảnh nhóm với các lớp áo và màu tương phản."
    },
    {
      "eventId": "evt-tet",
      "score": 86,
      "label": "Rất phù hợp",
      "reason": "Có thể thử màu tươi sáng cho du xuân; bảo đảm lớp trong phù hợp nơi đến."
    },
    {
      "eventId": "evt-wedding",
      "score": 82,
      "label": "Phù hợp",
      "reason": "Gợi ý bộ phối cho tiệc cưới theo yêu cầu gia đình; không mặc định là lễ phục cưới lịch sử."
    }
  ],
  "usageConsiderations": [
    "Hai vạt mở nên chọn lớp trong đủ ổn định và kín đáo theo hoàn cảnh; có thể dùng yếm, áo trong hoặc đầm phù hợp.",
    "Chọn độ dài áo và váy để không giẫm lên gấu; kiểm tra lớp trong khi giơ tay hoặc cúi người."
  ],
  "stylingGuide": {
    "accessories": [
      "Kiềng bạc cổ",
      "Trâm cài tóc hoa lưu ly",
      "Quạt tròn lụa thêu hoa"
    ],
    "hairstyles": [
      "Tóc búi cao lộ gáy thanh tú",
      "Tóc tết vương miện đính hoa nhài"
    ],
    "footwear": [
      "Hài gấm mũi sen",
      "Guốc gỗ sơn son thếp vàng"
    ],
    "recommendedColors": [
      "Áo xanh rêu phối yếm đỏ son",
      "Áo trắng ngà phối yếm hồng cánh sen"
    ],
    "materialsAndMotifs": [
      "Sa tơ tằm",
      "Hoa lá thêu theo mẫu phối"
    ],
    "traditionalStyling": "Giữ hai vạt đối nhau, khoác ngoài lớp áo trong và phần mặc dưới phù hợp bộ phối. Tư liệu tượng thời Lê có nhiều cách xếp lớp; không mặc định áo đối khâm luôn chỉ khoác trực tiếp ngoài yếm. Bộ yếm–váy–kiềng trong Studio là gợi ý, không phải nguyên bộ đã được xác minh.",
    "modernRemixAdvice": "Gợi ý cách tân: dùng áo đối khâm làm lớp khoác ngoài đầm lụa, áo trơn với quần suông hoặc chân váy. Có thể đổi độ dài và chất liệu, giữ hai vạt đối nhau làm điểm nhận diện. Túi, choker hoặc trang sức hiện đại có thể phối nếu không làm vạt áo lệch hoặc vướng.",
    "avoidCombinations": [
      "Tránh lớp trong quá lỏng, quá ngắn hoặc xuyên thấu gây lộ ngoài ý muốn qua hai vạt mở.",
      "Khi giữ mẫu đối khâm, tránh buộc chéo hai vạt thành cổ giao lĩnh rồi vẫn gọi là cùng một kết cấu.",
      "Khi dự lễ, vào nơi thờ tự hoặc tham gia hoạt động học đường, chọn độ kín và độ dài phù hợp nội quy nơi đến; kiểm tra áo khi ngồi, cúi và giơ tay để tránh lộ ngoài ý muốn."
    ]
  },
  "aiProfile": {
    "constructionDetails": [
      "Vietnamese Đối Khâm-inspired outer robe with two opposing, open front edges.",
      "Keep the front edges parallel, without a crossed Y-collar.",
      "Wear an appropriate inner layer and a long lower garment; use the selected styling rather than claiming one fixed historical ensemble."
    ],
    "mandatoryFeatures": [
      "Two opposing open front panels.",
      "Visible, adequately covered inner layer."
    ],
    "strictProhibitions": [
      "Do not convert the robe into a crossed-collar closure.",
      "Do not invent period-specific court insignia or add unselected accessories."
    ]
  },
  "research": {
    "status": "partially_reviewed",
    "reviewedAt": "2026-10-10",
    "sources": [
      {
        "sourceId": "ngan-nam-ao-mu",
        "scope": "Áo đối khâm trên một số tượng hậu phi thời Lê Trung Hưng.",
        "locator": "Chương III, Trang phục hậu cung, tr. 229–232 (bản 2013)"
      },
      {
        "sourceId": "mat-son-costumes",
        "scope": "Các lớp yếm, áo cổ chéo và áo choàng mở trên một số tượng nữ quý tộc thế kỷ XVII; không áp thành nguyên bộ cho mọi đối khâm.",
        "locator": "Tr. 28, phần Trang phục."
      },
      {
        "sourceId": "hoang-thanh-layering",
        "scope": "Ví dụ bộ phối hiện nay có áo giao lĩnh/viên lĩnh bên trong áo đối khâm; đây là hướng dẫn của đơn vị cung cấp, không phải quy chế lịch sử.",
        "locator": "Mục Hướng dẫn mặc áo Giao Lĩnh/Viên Lĩnh x Đối khâm."
      }
    ],
    "modernUse": "Có thể dùng áo đối khâm như lớp khoác khi chụp ảnh hoặc phối cùng trang phục hiện đại. Bộ yếm–váy–kiềng đang có là gợi ý tạo hình; lựa chọn kín đáo và độ dài phù hợp hoàn cảnh.",
    "limitations": [
      "Chưa xác minh bộ phối hiện tại là nguyên bộ y phục quý tộc thời Lý hoặc Trần.",
      "Ảnh minh họa chưa được xác nhận là mẫu đối khâm tương ứng với hồ sơ này."
    ]
  }
};
