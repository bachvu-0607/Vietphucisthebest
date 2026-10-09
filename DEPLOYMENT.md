# Chạy và lưu dữ liệu Việt Phục Remix

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
