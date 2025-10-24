# Student Dashboard - Hướng dẫn sử dụng

## Tổng quan
Trang Student Dashboard cung cấp giao diện quản lý khóa học chuyên nghiệp dành cho học viên với các tính năng:

- 📊 **Thống kê học tập**: Tổng quan về tiến độ, thành tích
- 📈 **Heatmap thời gian học**: Theo dõi lịch sử học tập giống GitHub
- 🎯 **Tiến độ khóa học**: Hiển thị chi tiết từng khóa học
- 🔥 **Chuỗi ngày học**: Theo dõi streak học tập
- 📝 **Hoạt động gần đây**: Lịch sử hoạt động học tập

## Cấu trúc Components

### 1. StudentDashboard (Trang chính)
- **File**: `src/pages/StudentDashboard.tsx`
- **Chức năng**: Trang dashboard chính tích hợp tất cả components
- **Route**: `/dashboard`

### 2. CourseProgressCard
- **File**: `src/components/student/CourseProgressCard.tsx`
- **Chức năng**: Hiển thị thông tin và tiến độ từng khóa học
- **Features**:
  - Progress bar với màu sắc động
  - Thông tin giáo viên và ngày đăng ký
  - Button "Tiếp tục học" hoặc "Xem chứng chỉ"

### 3. LearningHeatmap
- **File**: `src/components/student/LearningHeatmap.tsx`
- **Chức năng**: Heatmap theo dõi thời gian học giống GitHub
- **Features**:
  - Grid 53 tuần trong năm
  - Màu sắc theo cường độ học tập
  - Tooltip hiển thị chi tiết
  - Chuyển đổi năm
  - Responsive design

### 4. StatisticsCards
- **File**: `src/components/student/StatisticsCards.tsx`
- **Chức năng**: Hiển thị thống kê tổng quan
- **Metrics**:
  - Tổng khóa học
  - Đã hoàn thành
  - Đang học
  - Thời gian học
  - Chuỗi ngày học
  - Điểm trung bình

### 5. RecentActivityList
- **File**: `src/components/student/RecentActivityList.tsx`
- **Chức năng**: Hiển thị hoạt động gần đây
- **Activity Types**:
  - `enrollment`: Đăng ký khóa học
  - `completion`: Hoàn thành khóa học
  - `lesson_completed`: Hoàn thành bài học
  - `quiz_taken`: Làm bài quiz

### 6. LearningStreak
- **File**: `src/components/student/LearningStreak.tsx`
- **Chức năng**: Hiển thị chuỗi ngày học
- **Features**:
  - Chuỗi hiện tại và dài nhất
  - Màu sắc theo cường độ
  - Thông báo động viên

## API Endpoints

### Backend APIs (Cần implement)
```
GET /api/Student/stats - Thống kê học viên
GET /api/Student/activities?year=2024 - Hoạt động học tập theo năm
GET /api/Student/recent-activities?limit=10 - Hoạt động gần đây
GET /api/Student/streak - Chuỗi ngày học
GET /api/Courses/my-enrollments - Khóa học đã đăng ký
PUT /api/Courses/{id}/progress - Cập nhật tiến độ
```

### Frontend Services
- **File**: `src/services/student.ts`
- **Functions**:
  - `getMyEnrollments()`: Lấy danh sách khóa học đã đăng ký
  - `getStudentStats()`: Lấy thống kê học viên
  - `getLearningActivities()`: Lấy hoạt động học tập
  - `getRecentActivities()`: Lấy hoạt động gần đây
  - `getLearningStreak()`: Lấy chuỗi ngày học
  - `updateCourseProgress()`: Cập nhật tiến độ khóa học

## Cách sử dụng

### 1. Truy cập Dashboard
- Đăng nhập với tài khoản học viên
- Tự động redirect đến `/dashboard`
- Hoặc click "Dashboard" trong header

### 2. Test Components
- Truy cập `/test-dashboard` để xem demo với mock data
- Kiểm tra responsive design trên mobile

### 3. Customization
- Thay đổi màu sắc trong Tailwind classes
- Thêm metrics mới trong StatisticsCards
- Customize heatmap colors trong LearningHeatmap

## Responsive Design

### Desktop (lg+)
- Layout 3 cột: 2 cột chính + 1 cột sidebar
- Heatmap hiển thị đầy đủ 53 tuần
- Statistics cards 6 cột

### Tablet (md)
- Layout 2 cột
- Statistics cards 3 cột
- Heatmap responsive

### Mobile (sm)
- Layout 1 cột
- Statistics cards 2 cột
- Heatmap compact

## Styling

### Color Scheme
- **Primary**: Indigo (600, 700)
- **Success**: Green (500, 600)
- **Warning**: Orange (500, 600)
- **Info**: Blue (500, 600)
- **Purple**: Purple (500, 600)

### Dark Mode
- Tự động detect system preference
- Toggle trong header
- Consistent với design system

## Dependencies

### Frontend
- React 18+
- React Router 6+
- Lucide React (icons)
- Tailwind CSS
- TypeScript

### Backend
- .NET 9
- Entity Framework Core
- SQL Server
- JWT Authentication

## Development

### Setup
```bash
# Frontend
cd Frontend
npm install
npm run dev

# Backend
cd E-learning
dotnet run
```

### Testing
- Truy cập `/test-dashboard` để test components
- Sử dụng mock data để development
- Test responsive design trên các breakpoints

## Future Enhancements

### Planned Features
- [ ] Real-time notifications
- [ ] Study goals setting
- [ ] Social features (study groups)
- [ ] Advanced analytics
- [ ] Mobile app integration
- [ ] Offline support

### Performance Optimizations
- [ ] Virtual scrolling cho large datasets
- [ ] Lazy loading cho components
- [ ] Caching strategies
- [ ] Image optimization




