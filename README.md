# Việt Phục Discovery

Ứng dụng web giúp người dùng tìm hiểu trang phục Việt, chọn bộ phối theo dịp sử dụng, phối thử trên Studio 2D và tạo ảnh minh họa bằng AI.

- Giao diện: https://vietphucisthebest.vercel.app
- Backend: Railway (`/healthz` trả `{ "ok": true }` khi hoạt động)

## Chức năng chính

- **Danh mục 9 mẫu trang phục**: Nhật Bình, áo tấc tay thụng, ngũ thân tay chẽn, giao lĩnh, đối khâm, viên lĩnh, tứ thân, bà ba, áo dài hiện đại. Có sơ đồ phân loại theo bố cục trống đồng, lọc theo giới tính và thời kỳ.
- **Trang chi tiết**: bối cảnh lịch sử, ý nghĩa văn hóa, cấu tạo theo lớp, cách mặc truyền thống và cách tân, nguồn tham khảo. Kèm Sổ tay trang phục Việt.
- **Gợi ý theo dịp**: 7 nhóm dịp (Tết, cưới, sự kiện trang trọng, biểu diễn, lễ hội, kỷ yếu, dạo phố), có điểm và lý do gợi ý.
- **Gợi ý áo dài**: theo dịp, thời tiết và phong cách, kèm bảng màu.
- **Studio 2D**: chọn hướng phối (truyền thống, cách tân nhẹ, remix hiện đại), màu, chất liệu, phụ kiện theo vị trí, bật/tắt từng lớp.
- **Tạo ảnh AI**: chọn bối cảnh, tư thế, chỉ dẫn và ảnh tham khảo; theo dõi tiến trình, thử lại khi lỗi; so sánh phác thảo với kết quả và tải ảnh.
- **Tủ đồ cá nhân**: lưu, mở lại và xóa bản phối; xem tác phẩm AI và tiến trình.

## Phân quyền

| Chức năng | Khách | Người dùng | Admin |
|---|:-:|:-:|:-:|
| Xem danh mục, chi tiết, gợi ý, sổ tay | ✅ | ✅ | ✅ |
| Phối thử trên Studio 2D | ✅ | ✅ | ✅ |
| Lưu, mở lại, xóa bản phối | ❌ | ✅ | ✅ |
| Tạo ảnh AI, xem/xóa tác phẩm của mình | ❌ | ✅ | ✅ |
| Bảng Theo dõi hệ thống, danh sách backup | ❌ | ❌ | ✅ |

Mỗi người chỉ xem được bản phối và ảnh AI của chính mình, kể cả admin.

**Hạn mức AI** (áp dụng cả admin), chỉnh bằng biến môi trường:

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `AI_DAILY_LIMIT` | 5 | Lượt mỗi tài khoản mỗi ngày (tính lại lúc 0h giờ Việt Nam) |
| `AI_ACCOUNT_TOTAL_LIMIT` | 20 | Tổng lượt mỗi tài khoản |
| `AI_GLOBAL_DAILY_LIMIT` | 100 | Lượt toàn hệ thống mỗi ngày |
| `AI_ENABLED` | `true` | Đặt `false` để tắt tạo ảnh AI |

Mỗi tài khoản chạy tối đa 1 yêu cầu AI cùng lúc. Lượt được tính khi gửi yêu cầu hoặc thử lại, kể cả khi yêu cầu thất bại.

## Đăng nhập và bảo mật

- Đăng ký bằng email, họ tên, mật khẩu 8 ký tự đến 72 byte. Khi đăng ký, người dùng nhận **mã khôi phục** hiển thị một lần.
- Quên mật khẩu cần **email và mã khôi phục**; chưa có gửi email. Mã đặt lại mật khẩu có hiệu lực 60 phút.
- Mật khẩu băm bằng bcrypt. Phiên là JWT trong cookie HttpOnly, hạn 7 ngày, được lưu trong database nên đăng xuất là thu hồi ngay. Quyền được đọc lại từ database ở mỗi request.
- Giới hạn số lần thử các thao tác đăng nhập/khôi phục theo IP trong 15 phút; chặn request ghi dữ liệu không đến từ đúng domain website; API và ảnh riêng tư không cache.
- Production bắt buộc `JWT_SECRET` từ 32 ký tự.

### Cấp quyền admin

Không có đăng ký admin qua web. Đăng ký tài khoản bình thường, rồi chạy trên server Railway:

```bash
railway ssh --project=<project-id> --environment=<environment-id> --service=<service-id> \
  npm run admin -- email-cua-ban@example.com
```

Lần đầu cần có SSH key (`ssh-keygen -t ed25519`) và đăng ký nó với Railway (`railway ssh keys add`). Tải lại trang là có hiệu lực; bảng Theo dõi hệ thống nằm trong **Tủ đồ**.

## Công nghệ

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Motion. Bản phác thảo 2D vẽ bằng Canvas trên trình duyệt.
- **Backend**: Node.js (≥ 22.18), Express, SQLite (`node:sqlite`), sharp.
- **AI**: OpenAI Images (ưu tiên), Google Gemini/Imagen (dự phòng).
- **Triển khai**: giao diện trên Vercel, chuyển tiếp `/api` và ảnh sang backend Railway (`vercel.json`). Dữ liệu và ảnh lưu trên Railway Volume.

## Chạy ở máy

```bash
npm install
cp .env.example .env   # điền GEMINI_API_KEY và/hoặc OPENAI_API_KEY nếu cần AI
npm run dev            # http://localhost:3000
```

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy server kèm Vite ở chế độ phát triển |
| `npm run build` | Build giao diện vào `dist/` |
| `npm start` | Chạy production (cần build trước, `NODE_ENV=production`) |
| `npm test` | Chạy test |
| `npm run lint` | Kiểm tra kiểu TypeScript |
| `npm run backup` / `npm run restore` | Sao lưu / khôi phục database (khôi phục khi server đã dừng) |
| `npm run admin -- <email>` | Cấp quyền admin cho tài khoản đã tồn tại |

Không đưa API key vào biến có tiền tố `VITE_`, và không commit file `.env`.

## Cấu trúc thư mục

```text
src/            Giao diện React (components, services/api.ts)
server.ts       Khởi tạo Express, phục vụ ảnh riêng tư và giao diện
server/         API, đăng nhập, SQLite, AI, giám sát, lưu trữ
content/        Hồ sơ trang phục, sổ tay, gợi ý áo dài, phụ kiện, dịp, bối cảnh
shared/         Kiểu dữ liệu dùng chung frontend và backend
public/assets/  Ảnh trang phục và sự kiện
scripts/        Công cụ sao lưu/khôi phục và cấp quyền admin
tests/          Test bảo mật, lưu trữ, danh mục, giám sát
```

## Tài liệu khác

- [DEPLOYMENT.md](DEPLOYMENT.md): triển khai Vercel + Railway, biến môi trường, sao lưu, giám sát.
- [content/README.md](content/README.md): cách cập nhật nội dung trang phục.
