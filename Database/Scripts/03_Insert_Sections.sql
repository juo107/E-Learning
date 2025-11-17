-- =============================================
-- Script: Insert Sample Sections
-- Description: Insert sample sections for courses
-- All IDs are auto-generated using NEWID()
-- Note: Course IDs are retrieved by CourseCode
-- =============================================

-- Sections for React Course
INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Giới thiệu về React', N'Tổng quan về React, cài đặt môi trường, và tạo ứng dụng React đầu tiên', 1, 1, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'REACT-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'JSX và Components', N'Học về JSX syntax, cách tạo và sử dụng Components trong React', 2, 1, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'REACT-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'State và Props', N'Quản lý state và props trong React components', 3, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'REACT-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'React Hooks', N'Học về useState, useEffect, useContext và các hooks khác', 4, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'REACT-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Routing với React Router', N'Thiết lập routing và navigation trong ứng dụng React', 5, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'REACT-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'State Management với Redux', N'Quản lý state toàn cục với Redux và Redux Toolkit', 6, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'REACT-001' AND IsDeleted = 0;

-- Sections for Node.js Course
INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Giới thiệu Node.js', N'Tổng quan về Node.js, npm, và môi trường phát triển', 1, 1, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'NODE-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Express.js Framework', N'Xây dựng RESTful API với Express.js', 2, 1, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'NODE-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Database Integration', N'Kết nối và làm việc với MongoDB và MySQL', 3, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'NODE-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Authentication & Authorization', N'Xây dựng hệ thống xác thực với JWT', 4, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'NODE-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Testing & Deployment', N'Viết tests và deploy ứng dụng Node.js', 5, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'NODE-001' AND IsDeleted = 0;

-- Sections for Vue.js Course
INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Vue.js Basics', N'Giới thiệu Vue.js và các khái niệm cơ bản', 1, 1, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'VUE-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Vue 3 Composition API', N'Học Composition API và cách sử dụng trong Vue 3', 2, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'VUE-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Vue Router & Vuex', N'Routing và state management trong Vue', 3, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'VUE-001' AND IsDeleted = 0;

-- Sections for Flutter Course
INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Flutter Introduction', N'Giới thiệu Flutter và Dart programming language', 1, 1, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'FLUTTER-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Widgets & Layouts', N'Học về Flutter widgets và cách xây dựng layouts', 2, 1, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'FLUTTER-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'State Management', N'Quản lý state với Provider, Bloc, và Riverpod', 3, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'FLUTTER-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'API Integration', N'Kết nối với REST API và xử lý dữ liệu', 4, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'FLUTTER-001' AND IsDeleted = 0;

-- Sections for Python Data Science Course
INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Python Fundamentals', N'Ôn tập Python cơ bản cho Data Science', 1, 1, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'PYTHON-DS-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'NumPy & Pandas', N'Xử lý dữ liệu với NumPy và Pandas', 2, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'PYTHON-DS-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Data Visualization', N'Trực quan hóa dữ liệu với Matplotlib và Seaborn', 3, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'PYTHON-DS-001' AND IsDeleted = 0;

INSERT INTO Sections (Id, CourseId, Title, Description, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), Id, N'Machine Learning Basics', N'Giới thiệu Machine Learning với scikit-learn', 4, 0, GETUTCDATE(), 0
FROM Courses WHERE CourseCode = 'PYTHON-DS-001' AND IsDeleted = 0;

GO
