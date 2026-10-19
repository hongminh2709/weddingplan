# Triển khai lên Netlify

Đây là bản sao tĩnh của website, không cần cài đặt package. Kết nối repository với Netlify; cấu hình trong `netlify.toml` sẽ chạy `bash build.sh` và xuất bản thư mục `dist`.

Có thể chạy `bash build.sh` ở máy để tạo bản triển khai và dùng một máy chủ HTTP tĩnh để xem thư mục `dist` (ví dụ `python3 -m http.server --directory dist`). Trang gốc sẽ chuyển đến thiệp cưới.

Để bật sổ lưu bút, thiết lập `SUPABASE_URL` và `SUPABASE_ANON_KEY` trong Environment variables của Netlify, với phạm vi Functions, rồi triển khai lại. Dùng khóa publishable/anon, không dùng service role; thiết lập bảng và chính sách truy cập theo `supabase/guestbook.sql`. Hàm Netlify gọi Supabase ở phía máy chủ, không đưa khóa vào website. Chạy website tĩnh tại máy không cung cấp hàm này; cần môi trường Netlify Functions để dùng sổ lưu bút.

Có thể điền các giá trị vào `.env` theo mẫu `.env.example` để lưu cấu hình cục bộ. Tệp `.env` được Git bỏ qua; hãy nhập các giá trị tương ứng vào phần Environment variables trên Netlify để Functions sử dụng khi triển khai.

Bản đồ dùng chế độ nhúng không cần khóa Google Maps. Nhạc và một số dịch vụ bên ngoài vẫn cần kết nối mạng.
