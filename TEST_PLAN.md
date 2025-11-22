## Test Plan - E-Learning Platform

### 1. Phạm vi & mục tiêu
- **Mục tiêu**: Đảm bảo các luồng chính (học viên, giảng viên, admin, thanh toán) hoạt động đúng theo yêu cầu trong `QUY_TRINH_PHAT_TRIEN.md`.
- **Phạm vi**:
  - Đăng ký / đăng nhập / quên mật khẩu.
  - Khóa học (danh sách, chi tiết, ghi danh, tiến độ).
  - Quiz & lưu lịch sử.
  - Giỏ hàng & thanh toán (VNPay).
  - User/Profile.
  - Admin (duyệt khóa, quản lý user, dashboard thống kê).

### 2. Môi trường & dữ liệu test (mapping với 5.1)
- **Môi trường**: `staging.elearning.local` (ví dụ), cấu hình tương tự production.
- **Dữ liệu mẫu**:
  - 3 tài khoản học viên (A/B/C).
  - 1 tài khoản giảng viên.
  - 1 tài khoản admin.
  - 5 khóa học mẫu với các trạng thái khác nhau (mới, đang mở bán, đã khóa).
  - Cấu hình sandbox VNPay.

### 3. Thiết kế test case (mapping với 5.2)

#### 3.1 Nhóm Đăng ký / Đăng nhập / Bảo mật
- **TC01 - Đăng ký tài khoản hợp lệ**
  - Bước: nhập email mới, password hợp lệ, xác nhận.
  - Kỳ vọng: tài khoản được tạo, email xác nhận (nếu có), tự động login hoặc chuyển sang trang login.
- **TC02 - Đăng ký trùng email / password yếu**
  - Kỳ vọng: hiển thị lỗi rõ ràng, không tạo tài khoản mới.
- **TC03 - Đăng nhập**
  - Case đúng: vào được trang dashboard.
  - Case sai mật khẩu / tài khoản khóa: hiển thị thông báo lỗi phù hợp, không cấp token.
- **TC04 - Refresh token & hết hạn**
  - Kỳ vọng: khi access token hết hạn, refresh token hoạt động; hết hạn cả hai thì yêu cầu login lại.

#### 3.2 Nhóm Khóa học & quá trình học
- **TC10 - Xem danh sách khóa học**
  - Lọc theo category, mức độ; kiểm tra phân trang.
- **TC11 - Xem chi tiết khóa học**
  - Thông tin cơ bản, list module/bài học, rating, giảng viên.
- **TC12 - Ghi danh & tiến độ**
  - Enroll khóa học, xem % hoàn thành tăng khi hoàn thành bài giảng; dừng giữa chừng rồi tiếp tục đúng vị trí.

#### 3.3 Nhóm Quiz & lịch sử
- **TC20 - Làm quiz**
  - Bắt đầu quiz, đếm giờ, chuyển câu, nộp bài.
- **TC21 - Tính điểm & hiển thị kết quả**
  - Kỳ vọng: điểm tính đúng theo đáp án; hiển thị số câu đúng/sai.
- **TC22 - Lưu lịch sử quiz**
  - Có thể xem lại lịch sử các lần làm, thời gian, điểm số.

#### 3.4 Nhóm Giỏ hàng & Thanh toán
- **TC30 - Thêm/xóa khóa học vào giỏ**
  - Thêm 1–n khóa học; xóa; không cho trùng khóa đã mua.
- **TC31 - Thanh toán thành công (VNPay)**
  - Luồng redirect sang VNPay, thanh toán, callback về hệ thống.
  - Kỳ vọng: order = Paid, payment = Success, khóa học xuất hiện trong danh sách đã mua.
- **TC32 - Thanh toán thất bại / cancel**
  - Kỳ vọng: order = Canceled/Failed, không cấp quyền học.

#### 3.5 Nhóm User/Profile
- **TC40 - Xem và cập nhật profile**
  - Cập nhật tên, avatar, thông tin liên hệ.
- **TC41 - Đổi mật khẩu**
  - Kỳ vọng: yêu cầu mật khẩu cũ, kiểm tra mạnh mật khẩu mới, login lại bằng mật khẩu mới.

#### 3.6 Nhóm Admin
- **TC50 - Duyệt khóa học**
  - Admin approve/reject khóa mới; khóa chỉ hiển thị khi approve.
- **TC51 - Quản lý user**
  - Khóa/mở khóa tài khoản, đổi role (nếu được phép).
- **TC52 - Dashboard thống kê**
  - Kiểm tra số lượng học viên, số khóa, doanh thu, top khóa học.

### 4. Thực thi test & báo cáo (mapping với 5.3)
- **Thực thi**:
  - Manual cho toàn bộ test case ở trên.
  - Automation (nếu có): ưu tiên các luồng critical: Đăng nhập → Mua khóa học → Học → Làm quiz → Xem tiến độ.
- **Báo cáo**:
  - Ghi nhận kết quả từng TC (Pass/Fail).
  - Thống kê defect theo mức độ (Critical/High/Medium/Low).
  - Báo cáo QA tổng hợp + đề xuất sign-off khi tất cả critical/high đã được fix và retest pass.


