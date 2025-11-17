-- =============================================
-- Script: Insert Sample Courses
-- Description: Insert sample courses for the E-Learning platform
-- All IDs are auto-generated using NEWID()
-- Note: InstructorProfileId is set to NULL. Update later using:
-- UPDATE Courses SET InstructorProfileId = [YOUR_INSTRUCTOR_ID] WHERE CourseCode = 'REACT-001';
-- =============================================

-- Declare variables to store course IDs
DECLARE @CourseReact UNIQUEIDENTIFIER = NEWID();
DECLARE @CourseNodejs UNIQUEIDENTIFIER = NEWID();
DECLARE @CourseVuejs UNIQUEIDENTIFIER = NEWID();
DECLARE @CourseAngular UNIQUEIDENTIFIER = NEWID();
DECLARE @CourseFlutter UNIQUEIDENTIFIER = NEWID();
DECLARE @CourseReactNative UNIQUEIDENTIFIER = NEWID();
DECLARE @CoursePythonDS UNIQUEIDENTIFIER = NEWID();
DECLARE @CourseUIUX UNIQUEIDENTIFIER = NEWID();
DECLARE @CourseDigitalMarketing UNIQUEIDENTIFIER = NEWID();
DECLARE @CourseEnglish UNIQUEIDENTIFIER = NEWID();
DECLARE @CourseDraft UNIQUEIDENTIFIER = NEWID();

-- Insert Web Development Courses
INSERT INTO Courses (Id, CourseCode, Title, Description, Price, DurationInMinutes, Level, Language, CategoryId, InstructorProfileId, IsPublished, PublishedAt, CreatedAt, IsDeleted)
VALUES
    -- React Course
    (@CourseReact, 'REACT-001', N'React.js từ Zero đến Hero', 
     N'Khóa học toàn diện về React.js, từ cơ bản đến nâng cao. Học cách xây dựng ứng dụng web hiện đại với React, Hooks, Redux, và nhiều công nghệ khác.', 
     499000, 1200, 0, 0, (SELECT Id FROM Categories WHERE Name = N'Web Development' AND IsDeleted = 0), NULL, 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- Node.js Course
    (@CourseNodejs, 'NODE-001', N'Node.js Backend Development', 
     N'Học cách xây dựng API và server-side applications với Node.js, Express, MongoDB. Khóa học phù hợp cho người muốn trở thành Backend Developer.', 
     599000, 1500, 1, 0, (SELECT Id FROM Categories WHERE Name = N'Backend Development' AND IsDeleted = 0), NULL, 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- Vue.js Course
    (@CourseVuejs, 'VUE-001', N'Vue.js Complete Guide', 
     N'Khóa học Vue.js từ cơ bản đến nâng cao. Học Vue 3, Composition API, Vuex, Vue Router và cách xây dựng ứng dụng thực tế.', 
     449000, 1000, 0, 0, (SELECT Id FROM Categories WHERE Name = N'Web Development' AND IsDeleted = 0), NULL, 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- Angular Course
    (@CourseAngular, 'ANGULAR-001', N'Angular Framework Mastery', 
     N'Làm chủ Angular framework, học TypeScript, RxJS, Angular CLI và xây dựng ứng dụng enterprise-level.', 
     699000, 1800, 1, 0, (SELECT Id FROM Categories WHERE Name = N'Web Development' AND IsDeleted = 0), NULL, 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- Flutter Course
    (@CourseFlutter, 'FLUTTER-001', N'Flutter Mobile Development', 
     N'Học Flutter để xây dựng ứng dụng mobile đa nền tảng (iOS & Android) với một codebase duy nhất.', 
     549000, 1400, 1, 0, (SELECT Id FROM Categories WHERE Name = N'Mobile Development' AND IsDeleted = 0), NULL, 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- React Native Course
    (@CourseReactNative, 'RN-001', N'React Native Mobile App Development', 
     N'Xây dựng ứng dụng mobile native với React Native. Học cách sử dụng React Native CLI, Navigation, và tích hợp API.', 
     599000, 1600, 1, 0, (SELECT Id FROM Categories WHERE Name = N'Mobile Development' AND IsDeleted = 0), NULL, 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- Python Data Science Course
    (@CoursePythonDS, 'PYTHON-DS-001', N'Python cho Data Science', 
     N'Khóa học Python chuyên sâu cho Data Science. Học Pandas, NumPy, Matplotlib, và Machine Learning với scikit-learn.', 
     799000, 2000, 2, 0, (SELECT Id FROM Categories WHERE Name = N'Data Science' AND IsDeleted = 0), NULL, 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- UI/UX Design Course
    (@CourseUIUX, 'UIUX-001', N'UI/UX Design Fundamentals', 
     N'Học nguyên tắc thiết kế UI/UX, wireframing, prototyping với Figma, và tạo ra những sản phẩm digital tuyệt đẹp.', 
     399000, 900, 0, 0, (SELECT Id FROM Categories WHERE Name = N'UI/UX Design' AND IsDeleted = 0), NULL, 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- Digital Marketing Course
    (@CourseDigitalMarketing, 'DM-001', N'Digital Marketing Mastery', 
     N'Khóa học Digital Marketing toàn diện: SEO, Google Ads, Facebook Ads, Content Marketing, và Social Media Marketing.', 
     349000, 800, 0, 0, (SELECT Id FROM Categories WHERE Name = N'Digital Marketing' AND IsDeleted = 0), NULL, 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- English Course
    (@CourseEnglish, 'ENG-001', N'Tiếng Anh Giao Tiếp Cơ Bản', 
     N'Khóa học tiếng Anh giao tiếp cho người mới bắt đầu. Học phát âm, từ vựng, ngữ pháp và thực hành giao tiếp hàng ngày.', 
     299000, 600, 0, 0, (SELECT Id FROM Categories WHERE Name = N'Tiếng Anh' AND IsDeleted = 0), NULL, 1, GETUTCDATE(), GETUTCDATE(), 0),
    
    -- Draft Course (Not Published)
    (@CourseDraft, 'DRAFT-001', N'Advanced React Patterns', 
     N'Khóa học về các pattern nâng cao trong React. Dành cho developers đã có kinh nghiệm với React.', 
     699000, 1500, 2, 0, (SELECT Id FROM Categories WHERE Name = N'Web Development' AND IsDeleted = 0), NULL, 0, NULL, GETUTCDATE(), 0);

GO
