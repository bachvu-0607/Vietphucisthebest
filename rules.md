# CRITICAL INSTRUCTION

Đọc file trước khi thay đổi hoặc làm bất kỳ đièu gì

1. Đọc toàn bộ file này.

2. Đối chiếu yêu cầu mới với các quy tắc trong file.

3. Chỉ sửa những phần liên quan đến yêu cầu của người dùng.

4. Không tự ý sửa, xóa hoặc thiết kế lại các chức năng đang hoạt động.

5. Yêu cầu mới nhất của người dùng được ưu tiên nếu mâu thuẫn với file này.

6. Không được tự ý sửa file PROJECT_RULES.md.

## 1. MỤC TIÊU SẢN PHẨM

Việt Phục Remix là ứng dụng giúp người dùng:

- Khám phá Việt phục.

- Tìm hiểu ngắn gọn về nguồn gốc và đặc điểm văn hóa.

- Phối trang phục theo dịp, phong cách, màu sắc và thời tiết.

- Nhận gợi ý phụ kiện phù hợp.

- Tạo và lưu Lookbook.

Ứng dụng KHÔNG phải:

- website thương mại điện tử;

- dashboard AI;

- ứng dụng thiết kế/cắt may trang phục.



## 2. DỮ LIỆU VĂN HÓA

- Không tự bịa thông tin lịch sử.

- Ưu tiên dữ liệu đã được cung cấp trong dataset của dự án.

- Không tự ý thay đổi các quy tắc PRESERVE.

- Phân biệt rõ:

  - thông tin lịch sử/văn hóa;

  - quy tắc bảo tồn đặc trưng;

  - đề xuất phối đồ hiện đại.

- Không biến đề xuất thời trang thành sự thật lịch sử.

## 3. HÌNH ẢNH

- Không tự tạo URL ảnh giả.

- Không sử dụng ảnh bị lỗi.

- Không lặp lại cùng một ảnh cho nhiều nội dung nếu không cần thiết.

- Nếu ảnh không tải được, phải có fallback.
## 5. KHI CHỈNH SỬA CODE

Khi người dùng yêu cầu sửa A:

CHỈ sửa A và những dependency thực sự cần thiết.

Không được coi yêu cầu sửa A là quyền:

- redesign toàn bộ trang;

- sửa B, C, D;

- xóa chức năng khác;

- thay dữ liệu khác;

- thay đổi navigation;

- thay đổi design system.

Luôn giữ nguyên các chức năng đang hoạt động nếu chúng không liên quan đến yêu cầu mới.
