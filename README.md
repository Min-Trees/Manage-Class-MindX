# Manage-Class-MindX

Ứng dụng quản lý lớp học cho phép:

- Phân loại lớp học theo hai nhóm **Coding** và **Robotic**.
- Thêm nhận xét chung cho từng lớp và nhận xét theo mẫu cho từng học viên mỗi buổi học.
- Xem nhanh lịch sử nhận xét của từng học viên theo từng buổi học.
- Xem tổng hợp nhận xét của toàn bộ học viên trong lớp và thêm/sửa nhận xét từng buổi trực tiếp.
- Nhận xét từng buổi được chia theo các tiêu chí chuẩn kèm các mẫu nhận xét để đánh giá nhanh.
- Giao diện form nhập liệu được mở rộng, tự động xuống dòng với dữ liệu dài.
- Mã nguồn được tách thành các file `index.html`, `style.css` và `app.js` để dễ quản lý.
- Đăng nhập bằng Firebase Authentication để chỉ admin được chỉnh sửa, người xem không cần đăng nhập.
- Dữ liệu được lưu cục bộ qua LocalStorage và đồng bộ lên Firebase Firestore.

## Phát triển

- Toàn bộ logic nằm trong `app.js` sử dụng module ES.
- Sửa thông tin Firebase trong phần cấu hình nếu cần.

## Testing

Do dự án là ứng dụng thuần trình duyệt, không có bài kiểm thử tự động. Chạy `npm test` sẽ báo thiếu `package.json`.
