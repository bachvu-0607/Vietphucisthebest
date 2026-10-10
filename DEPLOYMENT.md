# Chạy và lưu dữ liệu Việt Phục Discovery

Bản này giữ React + Express + SQLite. Chỉ chạy **một tiến trình máy chủ trên một ổ đĩa bền vững**. Không chạy nhiều container với database riêng rồi coi chúng là cùng một hệ thống.

## Cài và chạy

Dùng Node từ 22.18 trở lên (đã kiểm tra trên Node 26.5), npm và lockfile npm:

```
npm ci
npm run lint
npm run build
npm test
npm start
```

Khi triển khai, đặt `NODE_ENV=production`, `JWT_SECRET` là chuỗi bí mật ngẫu nhiên ít nhất 32 ký tự và `APP_URL` là URL HTTPS chính xác của website, không có dấu `/` cuối. Không commit `.env` hoặc khóa thật. Production thiếu khóa sẽ dừng thay vì dùng khóa công khai mặc định.

Đặt `DATA_DIR` vào ổ đĩa bền vững bên ngoài thư mục mã nguồn có thể bị thay khi deploy. Thư mục này chứa database và `results/`. Đặt `BACKUPS_DIR` vào nơi lưu backup riêng. Máy chủ cần quyền đọc/ghi các thư mục đó. Sao lưu database tự động lúc khởi động và mỗi giờ, giữ 10 bản gần nhất; lỗi backup được ghi log.

**Cloud Run:** filesystem mặc định không đủ để giữ file SQLite và ảnh qua các lần thay container. Code sẽ từ chối chạy trên Cloud Run nếu chưa xác nhận cấu hình lưu trữ bằng `SQLITE_PERSISTENT_STORAGE=true`. Biến này chỉ là xác nhận của người vận hành, không tự tạo hay chứng minh ổ đĩa bền vững. Với kiến trúc SQLite này, phương án đơn giản là một VPS/máy chủ có ổ bền vững. Nếu giữ Cloud Run cần thiết kế dịch vụ database/lưu trữ phù hợp; chưa có cấu hình đó trong repo. Không coi bucket Cloud Storage/FUSE là một ổ SQLite thông thường.

**Preview trong AI Studio:** `npm run dev` cho phép thử giao diện và backend trên môi trường có `K_SERVICE`, với dữ liệu tạm riêng tại `<thư mục tạm>/vietphuc-preview`. Không cần thêm biến lưu trữ. Chỉ dùng tài khoản/bản phối/ảnh thử; dữ liệu này không đồng bộ với Railway và có thể mất khi container bị thay. Để `NODE_ENV` trống hoặc `development` trong preview. Không đặt `SQLITE_PERSISTENT_STORAGE=true` để bỏ qua lỗi khi chưa có ổ bền vững. `npm start` và mọi tiến trình có `NODE_ENV=production` vẫn bị chặn trên Cloud Run nếu chưa xác nhận lưu trữ; trên Railway có Volume, cấu hình và đường dẫn dữ liệu giữ nguyên.

Ảnh mới nằm trong `DATA_DIR/results`, không được copy vào bundle frontend. Ảnh cũ có bản ghi sở hữu vẫn đọc được từ `public/assets/results` qua route bảo vệ; ảnh không có chủ bị từ chối. Ảnh từng commit trên GitHub vẫn có thể tồn tại trong lịch sử Git: chặn truy cập web không xóa được các bản đã công khai đó.

## Đăng nhập và khôi phục tài khoản

JWT được lưu trong cookie HttpOnly (Secure ở production), hết hạn sau 7 ngày; máy chủ kiểm tra phiên trong SQLite ở mỗi request. Frontend chỉ giữ bearer token trong bộ nhớ, không lưu token vào localStorage hoặc URL ảnh. Đăng xuất/đổi/đặt lại mật khẩu thu hồi phiên.

Do chưa cấu hình dịch vụ email, khôi phục dùng **mã ngẫu nhiên dài** cấp một lần lúc đăng ký; database chỉ giữ bản băm. Người dùng phải lưu mã riêng. Tài khoản cũ có mã yếu/shared sẽ bị vô hiệu mã cũ; đăng nhập bằng mật khẩu hiện tại rồi chọn “Tạo mã khôi phục mới”. Không có mã và quên mật khẩu thì không thể tự reset chỉ bằng email. Chưa triển khai gửi email khôi phục.

Kho JSON cũ được chuyển vào tài khoản lưu trữ bị khóa; không tự gán cho người đăng nhập đầu tiên. File JSON gốc giữ nguyên. Khi cần gán dữ liệu cũ, người vận hành phải xác minh chủ sở hữu trước.

## Hạn mức và AI

Các biến: `AI_DAILY_LIMIT=5`, `AI_ACCOUNT_TOTAL_LIMIT=20`, `AI_GLOBAL_DAILY_LIMIT=100`. Đây là giới hạn lượt, **không bảo đảm một ngân sách tiền chính xác** vì giá/nhánh model có thể khác nhau. Đặt thêm hạn mức/cảnh báo tại nhà cung cấp. `AI_ENABLED=false` chặn yêu cầu AI mới và retry; không hủy lượt đã được gửi đến nhà cung cấp.

Mỗi tài khoản 1 job đang chạy, toàn hệ thống tối đa 5 job đồng thời. Retry tính lượt, xóa job không xóa lịch sử lượt. Job dang dở khi server khởi động lại được đánh dấu thất bại; không tự gửi lại tránh phát sinh phí trùng. Một lượt đã được chấp nhận vẫn tính hạn mức kể cả khi provider thất bại. Không có khóa hoặc không sinh được ảnh thì trả failed, không trả ảnh ghép giả thành AI thành công.

Chống dò mật khẩu/đăng ký/reset giới hạn theo địa chỉ kết nối, lưu bộ đếm trong SQLite. Nếu dùng reverse proxy, cần cấu hình hạ tầng giới hạn thêm theo IP người dùng; code không tin X-Forwarded-For do client tự gửi. Việc tạo nhiều tài khoản vẫn cần kiểm soát vận hành, hạn mức tổng giúp giới hạn số lượt chung.

## Backup và khôi phục thật

```
npm run backup
```

Lệnh sử dụng snapshot SQLite nhất quán, không chỉ copy file đang dùng WAL. Phải sao lưu **cả ảnh trong DATA_DIR/results** sang nơi độc lập, và chuyển bản database backup ra khỏi ổ lưu chính. Backup cùng ổ không bảo vệ khỏi mất cả ổ.

Để restore: dừng máy chủ, lưu riêng database/ảnh hiện tại, sau đó:

```
npm run restore -- /duong/dan/tuyet/doi/ban-backup.sqlite
```

Lệnh kiểm tra file trước khi thay database, tạo snapshot trước restore, từ chối nếu server đang chạy và thu hồi phiên cũ sau restore. Khôi phục ảnh từ bộ sao lưu tương ứng nếu cần, rồi khởi động lại website. HTTP API không cho phép restore. Nên thử restore trên bản sao cô lập trước khi dùng dữ liệu thật.

`npm test` dùng dữ liệu giả trong thư mục tạm, khóa AI trống; kiểm tra hai tài khoản, ảnh riêng tư, reset, quota, ghi thất bại, backup/restore và entrypoint production. Không kiểm chứng cấu hình deployment thực tế hay chất lượng ảnh từ model có phí.

## Vercel giao diện + Railway backend

`vercel.json` chuyển `/api/*`, `/assets/results/*`, `/assets/costumes/*`, `/assets/events/*` và `/healthz` đến `https://vietphucisthebest-production.up.railway.app`. Giao diện vẫn gọi `/api` trên domain Vercel. Cookie HttpOnly ở cùng domain giao diện, nên tải lại trang và ảnh riêng tư không phụ thuộc cookie bên thứ ba. API và ảnh riêng tư không được cache. Không đưa API key vào biến có tiền tố VITE_.

- Vercel: Root Directory là gốc repo; Vite, build `npm run build`, output `dist` được khai báo trong file cấu hình. Biến `VITE_API_URL` không được sử dụng và có thể xóa.
- Railway: giữ Volume `/app/data`, đặt `NODE_ENV=production` và khóa bí mật như phần trên. Domain công khai phải hoạt động; `/healthz` trả JSON `{ "ok": true }`.
- Backend mặc định cho phép cookie request từ đúng `https://vietphucisthebest.vercel.app`. Khi đổi domain frontend, đặt `FRONTEND_ORIGIN` trên Railway thành origin HTTPS mới (không có đường dẫn). `APP_URL` vẫn là origin khi mở ứng dụng trực tiếp. Không tự cho phép mọi domain preview.
- Khi đổi domain Railway, sửa các destination trong `vercel.json` và deploy lại Vercel.
- Sau khi cả hai deploy xong, kiểm tra `/healthz`, `/api/events` trên domain Vercel; đăng nhập, tải lại trang, lưu/xóa bản phối và xem ảnh đã có. Không cần tạo ảnh AI có phí để kiểm tra kết nối.

## Ảnh hiển thị

Ảnh công khai trong costumes/events được phục vụ bằng WebP chất lượng 85, cạnh dài tối đa 1600px; `?size=thumb` dùng 640px. `?original=1` lấy nguyên bản. Ảnh AI chỉ nén khi gọi `?preview=1` (640px cho tủ đồ, 1600px cho xem chi tiết); tải về vẫn lấy file gốc. Ảnh nhỏ không được phóng lớn và chỉ dùng bản nén khi nhẹ hơn. Không sửa file gốc, kể cả ảnh đầu vào AI. Cache nén nằm trong RAM tối đa 32MB; tối đa 2 tác vụ nén đồng thời, còn lại trả bản gốc. Quyền sở hữu ảnh được kiểm tra trước khi truy cập cache, ảnh riêng tư vẫn có Cache-Control private, no-store.

## Khóa tiến trình khi deploy

Máy chủ lấy khóa `.server.lock` trong DATA_DIR trước khi mở SQLite. Khóa được cập nhật mỗi 5 giây, hết hạn sau 30 giây nếu container chết; khởi động mới chờ tối đa khoảng 40 giây. Không dùng file `server.pid` cũ vì PID có thể trùng trong container mới. Restore dùng cùng khóa và từ chối khi máy chủ còn chạy. Vẫn chỉ triển khai một replica; không xóa khóa thủ công khi máy chủ đang hoạt động.

## Giám sát nhẹ và giới hạn lưu giữ

Trong **Tủ đồ**, tài khoản admin có bảng Theo dõi hệ thống. Đăng ký tài khoản của chủ website trước, rồi trên terminal/SSH của service Railway chạy `npm run admin -- email-cua-chu-website`. Lệnh chỉ nâng quyền tài khoản đã tồn tại, không tự cấp quyền cho người đăng ký đầu tiên. Không đưa lệnh hoặc quyền này ra HTTP công khai. Reload trang sau khi cấp quyền.

- `DATA_DIR/monitor.sqlite` chỉ chứa bộ đếm theo phút và mã sự kiện cố định; không chứa email, token, cookie, mật khẩu, prompt, ảnh base64 hay nội dung lỗi thô của provider. Log JSON cũng xuất ra Railway Logs.
- Request bình thường chỉ tăng bộ đếm trong RAM. Ghi gộp mỗi phút; tối đa 60 phút đang chờ trong RAM nếu ổ đĩa hỏng. Khi tiến trình bị kill đột ngột có thể mất thống kê chưa flush. Bộ đếm phục vụ quan sát, không dùng để tính phí hoặc thực thi quota.
- Giữ 7 ngày, tối đa 1.000 sự kiện, API trả tối đa 50 dòng. Mỗi mã sự kiện in tối đa một lần/phút; các dòng log được giảm lặp nên không dùng số dòng làm tổng số lỗi. Tổng số nằm ở bảng thống kê. File thống kê giới hạn 4.096 page (mặc định 16MiB) và dùng rollback journal; SQLite tái sử dụng page đã xóa, file có thể không co ngay. Không ghi log request thành công, payload, stack hoặc từng bước tiến độ.
- Cảnh báo khi filesystem dùng >=80%, backup database cũ hơn 2 giờ, AI thất bại >=3 và >=50% kết quả trong 15 phút, HTTP 5xx >=5/15 phút, lượt AI chạm 80% quota ngày, hoặc bộ lưu thống kê lỗi. Chỉ log lúc chuyển trạng thái cảnh báo/khôi phục; không gửi lặp mỗi phút. 429 và 503 do chủ động giới hạn AI không bị tính là lỗi máy chủ.
- Ngày quota theo mốc đang dùng trong backend; kết quả là cửa sổ 24 giờ, không phải cùng khái niệm. Kết quả được đếm độc lập, xóa job không xóa số liệu. Lượt gọi OpenAI/Google có thể nhiều hơn job do fallback; chưa có thống kê chi phí. Dữ liệu trước khi bật giám sát không được dựng lại.
- Dung lượng dùng `statfs`: có thể phản ánh filesystem lớn hơn quota Volume Railway, cần đối chiếu dashboard Railway. Không quét tất cả ảnh mỗi phút. Backup gần nhất chỉ xác minh file snapshot database có mặt, không bao gồm ảnh, không chứng minh restore thành công.
- Giữ nguyên `ai_usage_log`: đây là sổ thực thi quota toàn thời gian, KHÔNG xóa theo hạn 7 ngày của thống kê. Không có request AI phát sinh từ dashboard.
- Backend chết hoàn toàn không thể tự gửi cảnh báo. Cần thêm dịch vụ uptime ngoài ứng dụng kiểm tra `https://vietphucisthebest-production.up.railway.app/healthz` mỗi 1–5 phút và kênh nhận cảnh báo của chủ website. Phần đó chưa được kết nối; hiện cảnh báo chỉ ở dashboard và Railway Logs. Trang sẽ báo lỗi đọc thống kê khi backend không trả lời, nhưng chỉ khi người dùng đang mở trang.
