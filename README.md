# JobHunter - Nền tảng tuyển dụng và tìm kiếm việc làm

JobHunter là một hệ thống ứng dụng tuyển dụng toàn diện, kết nối ứng viên với các công ty hàng đầu. Hệ thống được thiết kế với giao diện hiện đại, tối ưu trải nghiệm người dùng và cung cấp đầy đủ các công cụ quản lý cho cả Nhà tuyển dụng lẫn Quản trị viên.

## 👥 Phân quyền (Roles)

Hệ thống được chia làm 3 vai trò (role) chính, mỗi vai trò có các chức năng chuyên biệt:

### 1. Ứng viên (User / Candidate)
- **Tìm kiếm việc làm:** Tìm kiếm theo từ khóa, kỹ năng (Skills), địa điểm, và mức lương.
- **Quản lý hồ sơ:** Upload CV (file PDF) và cập nhật thông tin cá nhân.
- **Ứng tuyển (Apply):** Nộp CV trực tiếp cho các công việc đang mở.
- **Đăng ký nhận thông báo (Subscribe):** Chọn các kỹ năng quan tâm. Hệ thống sẽ tự động quét và gửi email thông báo khi có công việc mới phù hợp (Cron Job chạy tự động vào 7h sáng mỗi ngày).
- **Theo dõi lịch sử:** Xem lại danh sách các công việc đã ứng tuyển và trạng thái của chúng.

### 2. Nhà tuyển dụng (Recruiter / HR)
- **Quản lý Công ty:** Cập nhật thông tin, logo, địa chỉ của công ty mình.
- **Quản lý Việc làm (Jobs):** Đăng tin tuyển dụng mới, chỉnh sửa, ẩn/hiện hoặc xóa các công việc do công ty mình đăng tải.
- **Quản lý Hồ sơ ứng tuyển (Resumes):** Xem danh sách các CV đã nộp vào các công việc của công ty. Đánh giá và cập nhật trạng thái hồ sơ của ứng viên (Đang chờ, Đã xem xét, Từ chối, Đã tuyển).

### 3. Quản trị viên (Admin)
- **Quản lý hệ thống toàn diện:** Có toàn quyền truy cập (Full Access) vào tất cả các module.
- **Quản lý Người dùng & Phân quyền:** Quản lý Users, phân quyền linh hoạt thông qua Roles và Permissions chi tiết.
- **Quản lý Dữ liệu chung:** Quản lý danh sách toàn bộ Công ty, danh mục Kỹ năng (Skills), và tất cả Công việc trên toàn hệ thống.

---

## 🛠 Tổng quan về Kiến trúc Kỹ thuật (Tech Stack)

### Backend (Hệ thống máy chủ)
- **Công nghệ chính:** Nestjs, TypeORM, PostgreSQL.
- **Quản lý File Cloud:** Tích hợp **Cloudinary** để upload và lưu trữ trực tuyến ảnh (Logo công ty) và file (CV ứng viên).
- **Bảo mật:** Xác thực bằng JWT (Access/Refresh Token), mã hóa Bcrypt và validate dữ liệu chặt chẽ qua DTO.
- **Phân quyền:** Quản lý quyền hạn động (RBAC) kết hợp Caching bằng Redis và Custom Guards.
- **Xử lý bất đồng bộ:** Tích hợp Redis và BullMQ (Message Queue) để xử lý các tác vụ nặng như gửi email mà không nghẽn API.
- **Tự động hóa (Cron Jobs):** Gửi email gợi ý việc làm mỗi 7h sáng.
- **Dịch vụ Email (Mailer):** Tích hợp Nodemailer và Mailtrap để xử lý template và gửi thông báo tự động.

### Frontend (Giao diện người dùng)
- **Công nghệ chính:** React, TypeScript.
- **Styling:** Tailwind CSS, kết hợp với các component từ thư viện Radix UI (thông qua kiến trúc shadcn/ui) cho một giao diện nhất quán, linh hoạt và đẹp mắt.
- **UI/UX:** Sử dụng Lucide React cho hệ thống icon. Tối ưu hóa trải nghiệm người dùng với các hiệu ứng (micro-animations), màu sắc chủ đạo xanh lá (Green theme) tạo cảm giác thân thiện, tin cậy.
- **State Management & Data Fetching:** Sử dụng Redux Toolkit, gọi API chuẩn RESTful.
- **Hiệu năng:** Xử lý form mượt mà, validation chặt chẽ dữ liệu đầu vào.


---

## ⚙️ Cấu hình Biến môi trường (.env mẫu)

Dưới đây là các biến môi trường cần thiết để chạy dự án. Bạn cần tạo file `.env` tương ứng trong từng thư mục.

### Backend (`backend/.env`)
```env
# Database Configuration (PostgreSQL/MySQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=secret
DB_DATABASE=jobhunter
DATABASE_SYNC=true

# JWT Authentication
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=3600
JWT_REFRESH_EXPIRES_IN=604800

# Redis (Dành cho BullMQ & Caching)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Mailtrap SMTP (Gửi Email)
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_user
MAIL_PASS=your_mailtrap_password

# Cloudinary (Quản lý File ảnh/CV)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

```
