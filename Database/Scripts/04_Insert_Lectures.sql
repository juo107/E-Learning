-- =============================================
-- Script: Insert Sample Lectures
-- Description: Insert sample lectures for sections
-- All IDs are auto-generated using NEWID()
-- Note: Section IDs are retrieved by CourseCode and Section Title
-- LectureType: 0=Video, 1=Text, 2=Quiz, 3=Assignment
-- =============================================

-- Lectures for React Course - Section 1: Giới thiệu về React
INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'React là gì?', 0, 600, 'https://example.com/videos/react-intro.mp4', NULL, 1, 1, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'Giới thiệu về React' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Cài đặt môi trường phát triển', 0, 900, 'https://example.com/videos/react-setup.mp4', NULL, 2, 1, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'Giới thiệu về React' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Tạo ứng dụng React đầu tiên', 0, 1200, 'https://example.com/videos/react-first-app.mp4', NULL, 3, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'Giới thiệu về React' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Quiz: Kiểm tra kiến thức React cơ bản', 2, NULL, NULL, NULL, 4, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'Giới thiệu về React' AND s.IsDeleted = 0;

-- Lectures for React Course - Section 2: JSX và Components
INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'JSX Syntax cơ bản', 0, 800, 'https://example.com/videos/jsx-basics.mp4', NULL, 1, 1, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'JSX và Components' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Tạo Functional Components', 0, 1000, 'https://example.com/videos/functional-components.mp4', NULL, 2, 1, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'JSX và Components' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Component Composition', 0, 900, 'https://example.com/videos/component-composition.mp4', NULL, 3, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'JSX và Components' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Assignment: Xây dựng Component Library', 3, NULL, NULL, N'Tạo một thư viện components đơn giản với Button, Card, và Modal', 4, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'JSX và Components' AND s.IsDeleted = 0;

-- Lectures for React Course - Section 3: State và Props
INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Hiểu về Props', 0, 700, 'https://example.com/videos/react-props.mp4', NULL, 1, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'State và Props' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'State trong React', 0, 1000, 'https://example.com/videos/react-state.mp4', NULL, 2, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'State và Props' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Lifting State Up', 0, 850, 'https://example.com/videos/lifting-state.mp4', NULL, 3, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'State và Props' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Quiz: State và Props', 2, NULL, NULL, NULL, 4, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'State và Props' AND s.IsDeleted = 0;

-- Lectures for Node.js Course - Section 1: Giới thiệu Node.js
INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Node.js là gì?', 0, 600, 'https://example.com/videos/nodejs-intro.mp4', NULL, 1, 1, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Giới thiệu Node.js' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'NPM và Package Management', 0, 800, 'https://example.com/videos/npm-basics.mp4', NULL, 2, 1, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Giới thiệu Node.js' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Node.js Modules và require()', 0, 700, 'https://example.com/videos/nodejs-modules.mp4', NULL, 3, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Giới thiệu Node.js' AND s.IsDeleted = 0;

-- Lectures for Node.js Course - Section 2: Express.js Framework
INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Giới thiệu Express.js', 0, 500, 'https://example.com/videos/express-intro.mp4', NULL, 1, 1, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Express.js Framework' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Routing trong Express', 0, 900, 'https://example.com/videos/express-routing.mp4', NULL, 2, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Express.js Framework' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Middleware trong Express', 0, 1000, 'https://example.com/videos/express-middleware.mp4', NULL, 3, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Express.js Framework' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Xây dựng RESTful API', 0, 1200, 'https://example.com/videos/restful-api.mp4', NULL, 4, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Express.js Framework' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Assignment: Tạo API cho Todo App', 3, NULL, NULL, N'Xây dựng RESTful API đầy đủ cho ứng dụng Todo với CRUD operations', 5, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Express.js Framework' AND s.IsDeleted = 0;

-- Lectures for Vue.js Course - Section 1: Vue.js Basics
INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Vue.js Overview', 0, 600, 'https://example.com/videos/vue-overview.mp4', NULL, 1, 1, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'VUE-001' AND s.Title = N'Vue.js Basics' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Template Syntax', 0, 800, 'https://example.com/videos/vue-template.mp4', NULL, 2, 1, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'VUE-001' AND s.Title = N'Vue.js Basics' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Directives và Data Binding', 0, 900, 'https://example.com/videos/vue-directives.mp4', NULL, 3, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'VUE-001' AND s.Title = N'Vue.js Basics' AND s.IsDeleted = 0;

-- Lectures for Flutter Course - Section 1: Flutter Introduction
INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Flutter là gì?', 0, 500, 'https://example.com/videos/flutter-intro.mp4', NULL, 1, 1, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'FLUTTER-001' AND s.Title = N'Flutter Introduction' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Dart Programming Basics', 0, 1200, 'https://example.com/videos/dart-basics.mp4', NULL, 2, 1, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'FLUTTER-001' AND s.Title = N'Flutter Introduction' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Cài đặt Flutter SDK', 0, 600, 'https://example.com/videos/flutter-setup.mp4', NULL, 3, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'FLUTTER-001' AND s.Title = N'Flutter Introduction' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Tạo Flutter App đầu tiên', 0, 900, 'https://example.com/videos/flutter-first-app.mp4', NULL, 4, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'FLUTTER-001' AND s.Title = N'Flutter Introduction' AND s.IsDeleted = 0;

-- Text-based Lectures (Type = 1)
INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Tài liệu: Best Practices cho State Management', 1, NULL, NULL, 
N'# Best Practices cho State Management trong React

## 1. Khi nào nên dùng State?
- State nên được sử dụng cho dữ liệu thay đổi trong component
- Không nên dùng state cho dữ liệu có thể tính toán từ props

## 2. State Structure
- Giữ state structure đơn giản và phẳng
- Tránh nested state objects phức tạp

## 3. State Updates
- Luôn sử dụng functional updates khi state phụ thuộc vào state trước đó
- Batch multiple state updates khi có thể', 5, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'State và Props' AND s.IsDeleted = 0;

INSERT INTO Lectures (Id, SectionId, Title, Type, Duration, VideoUrl, Content, OrderIndex, IsPreviewable, CreatedAt, IsDeleted)
SELECT NEWID(), s.Id, N'Tài liệu: MongoDB Connection Guide', 1, NULL, NULL, 
N'# Hướng dẫn kết nối MongoDB với Node.js

## 1. Cài đặt Mongoose
```bash
npm install mongoose
```

## 2. Kết nối Database
```javascript
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/mydb");
```

## 3. Tạo Schema và Model
```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});
const User = mongoose.model("User", userSchema);
```', 1, 0, GETUTCDATE(), 0
FROM Sections s
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Database Integration' AND s.IsDeleted = 0;

GO
