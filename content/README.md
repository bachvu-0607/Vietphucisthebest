# Dữ liệu nội dung Việt Phục Remix

Nội dung tra cứu và phối đồ được lưu ở đây; tài khoản, bản phối và ảnh người dùng vẫn do backend quản lý trong SQLite/Volume.

```text
content/
  costumes/          Một hồ sơ cho mỗi trang phục; index.ts tổng hợp 9 mẫu
  guides/            Sổ tay tham chiếu hồ sơ trang phục
  lookbooks/         Gợi ý áo dài theo dịp, thời tiết, phong cách
  styling/           Nhóm phụ kiện phối trên Studio
  sources.ts         Danh mục nguồn và ghi chú phạm vi phối đồ
  events.ts         Các dịp sử dụng
  backgrounds.ts    Không gian phối/chụp ảnh
shared/types.ts     Kiểu dữ liệu dùng chung frontend và backend
```

## Cập nhật nội dung

- Sửa hồ sơ tương ứng trong `costumes/`. Frontend nhận dữ liệu qua API; sổ tay và AI dùng cùng hồ sơ. `server/ai-prompt.ts` chỉ xây prompt, không chứa một bản lịch sử riêng.
- `historicalContext` là bối cảnh có căn cứ; `culturalSignificance` phân biệt ý nghĩa văn hóa với diễn giải biên tập; `research.modernUse` và `stylingGuide` là ứng dụng hiện nay.
- Thêm nguồn vào `sources.ts`, rồi ghi `sourceId`, `scope` và vị trí đoạn/trang đã đọc trong hồ sơ. Một nguồn về cổ áo không xác nhận luôn mọi màu, mũ, trang sức và giày trong bộ phối.
- `partially_reviewed` nghĩa là đã đối chiếu phạm vi ghi kèm. `needs_review` nghĩa là còn thiếu căn cứ. Đợt rà soát 10/10/2026 chưa chứng nhận một hồ sơ nguyên bộ; `isVerifiedHistoricalData` được giữ để tương thích nhưng không bật nhãn kiểm chứng toàn bộ.
- AI profile giữ đặc điểm nhận diện của mẫu; ảnh do AI tạo không phải nguồn nghiên cứu. `aiProfile` không được trả trong API danh mục để tránh gửi chỉ dẫn tạo ảnh cho mọi lượt đọc.
- Chưa xác minh đầy đủ nguồn gốc áo bà ba, từng nguyên bộ phục dựng, xuất xứ mỗi mẫu vải và hồ sơ giấy phép từng ảnh lookbook. Giao diện ghi phạm vi này, không coi gợi ý phối đồ là quy chế lịch sử.
- Viết cách mặc theo kết cấu và mẫu tham chiếu; tách gợi ý cách tân khỏi bằng chứng phục dựng. Không cấm choker, sneaker hoặc trang sức hiện đại chỉ vì khác phong cách. Mỗi lưu ý cần nêu vấn đề cụ thể về phom, độ vừa, che phủ, cử động hoặc nội quy nơi mặc; không dùng “thuần phong mỹ tục” làm nhãn phán xét chung.
- Không gán xuất xứ vải, phẩm cấp, ý nghĩa đạo đức hoặc số đo cố định khi chưa có căn cứ. Thay đổi kết cấu lớn cần ghi rõ là thiết kế lấy cảm hứng. Xem [ghi chú rà soát cách mặc và cách tân](REVIEW-2026-10-10.md).

## Giữ tương thích

Không đổi `id`, `slug`, ID màu/chất liệu/phụ kiện/chi tiết, thứ tự lớp hoặc ánh xạ sự kiện khi chỉnh văn bản. Bản phối cũ tham chiếu những giá trị này. Studio còn lưu tên phụ kiện dưới dạng chuỗi: giữ chuỗi cũ trong `styling/accessories.ts`, dùng nhãn hiển thị nếu cần diễn đạt lại. Phụ kiện của từng trang phục được bổ sung vào nhóm sẵn có; khi tạo mẫu mới, gợi ý đồ đội đầu lấy từ hồ sơ trang phục.

`src/types/index.ts` và `server/db.ts` là các điểm xuất tương thích, không còn một bộ dữ liệu hoặc kho JSON hoạt động thứ hai. Việc đổi nội dung không ghi lại hay xóa bản phối của người dùng.

Chạy `npm run lint`, `npm run build`, `npm test`. Kiểm tra danh mục so với fixture trước khi tách đảm bảo các liên kết bản phối cũ vẫn còn.
