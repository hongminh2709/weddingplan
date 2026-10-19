# Triển khai lên Netlify

Đây là bản sao tĩnh của website, không cần cài đặt package. Kết nối repository với Netlify; cấu hình trong `netlify.toml` sẽ chạy `bash build.sh` và xuất bản thư mục `dist`.

Có thể chạy `bash build.sh` ở máy để tạo bản triển khai và dùng một máy chủ HTTP tĩnh để xem thư mục `dist` (ví dụ `python3 -m http.server --directory dist`). Trang gốc sẽ chuyển đến thiệp cưới.

Sổ lưu bút hiện không khả dụng vì dự án không còn cấu hình khóa API Supabase. Nhạc và một số dịch vụ bên ngoài vẫn cần kết nối mạng.
