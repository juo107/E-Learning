-- =============================================
-- Script: Insert Sample Resources
-- Description: Insert sample resources for lectures
-- All IDs are auto-generated using NEWID()
-- Note: Lecture IDs are retrieved by CourseCode, Section Title, and Lecture Title
-- ResourceType: 0=Pdf, 1=Zip, 2=Code, 3=Image, 4=Link
-- =============================================

-- Resources for React Lectures
INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'React_Cheat_Sheet.pdf', 'https://example.com/resources/react-cheat-sheet.pdf', 0, 250, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'Giới thiệu về React' AND l.Title = N'React là gì?' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'React_Official_Documentation', 'https://react.dev', 4, NULL, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'Giới thiệu về React' AND l.Title = N'React là gì?' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'starter-template.zip', 'https://example.com/resources/react-starter.zip', 1, 5120, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'Giới thiệu về React' AND l.Title = N'Cài đặt môi trường phát triển' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'package.json.example', 'https://example.com/resources/package-json-example.txt', 2, 5, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'Giới thiệu về React' AND l.Title = N'Cài đặt môi trường phát triển' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'JSX_Reference_Guide.pdf', 'https://example.com/resources/jsx-reference.pdf', 0, 180, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'JSX và Components' AND l.Title = N'JSX Syntax cơ bản' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'jsx-examples.zip', 'https://example.com/resources/jsx-examples.zip', 1, 2048, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'JSX và Components' AND l.Title = N'JSX Syntax cơ bản' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'component-library-starter.zip', 'https://example.com/resources/component-library.zip', 1, 10240, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'JSX và Components' AND l.Title = N'Component Composition' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'Component_Design_Patterns.pdf', 'https://example.com/resources/component-patterns.pdf', 0, 320, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'JSX và Components' AND l.Title = N'Component Composition' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'State_Management_Guide.pdf', 'https://example.com/resources/state-management.pdf', 0, 450, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'State và Props' AND l.Title = N'Hiểu về Props' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'state-examples.zip', 'https://example.com/resources/state-examples.zip', 1, 3072, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'State và Props' AND l.Title = N'State trong React' AND l.IsDeleted = 0;

-- Resources for Node.js Lectures
INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'Node.js_Documentation', 'https://nodejs.org/docs', 4, NULL, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Giới thiệu Node.js' AND l.Title = N'Node.js là gì?' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'Node.js_Best_Practices.pdf', 'https://example.com/resources/nodejs-best-practices.pdf', 0, 280, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Giới thiệu Node.js' AND l.Title = N'Node.js là gì?' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'NPM_Command_Reference.pdf', 'https://example.com/resources/npm-commands.pdf', 0, 150, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Giới thiệu Node.js' AND l.Title = N'NPM và Package Management' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'package.json.template', 'https://example.com/resources/package-json-template.json', 2, 3, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Giới thiệu Node.js' AND l.Title = N'NPM và Package Management' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'Express.js_Documentation', 'https://expressjs.com', 4, NULL, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Express.js Framework' AND l.Title = N'Giới thiệu Express.js' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'express-starter.zip', 'https://example.com/resources/express-starter.zip', 1, 4096, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Express.js Framework' AND l.Title = N'Giới thiệu Express.js' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'REST_API_Design_Guide.pdf', 'https://example.com/resources/rest-api-design.pdf', 0, 380, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Express.js Framework' AND l.Title = N'Xây dựng RESTful API' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'api-examples.zip', 'https://example.com/resources/api-examples.zip', 1, 6144, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Express.js Framework' AND l.Title = N'Xây dựng RESTful API' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'Postman_Collection.json', 'https://example.com/resources/postman-collection.json', 2, 25, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Express.js Framework' AND l.Title = N'Xây dựng RESTful API' AND l.IsDeleted = 0;

-- Resources for Vue.js Lectures
INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'Vue.js_Documentation', 'https://vuejs.org', 4, NULL, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'VUE-001' AND s.Title = N'Vue.js Basics' AND l.Title = N'Vue.js Overview' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'Vue_Quick_Start_Guide.pdf', 'https://example.com/resources/vue-quick-start.pdf', 0, 200, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'VUE-001' AND s.Title = N'Vue.js Basics' AND l.Title = N'Vue.js Overview' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'vue-starter-template.zip', 'https://example.com/resources/vue-starter.zip', 1, 3584, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'VUE-001' AND s.Title = N'Vue.js Basics' AND l.Title = N'Template Syntax' AND l.IsDeleted = 0;

-- Resources for Flutter Lectures
INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'Flutter_Documentation', 'https://flutter.dev/docs', 4, NULL, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'FLUTTER-001' AND s.Title = N'Flutter Introduction' AND l.Title = N'Flutter là gì?' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'Flutter_Installation_Guide.pdf', 'https://example.com/resources/flutter-installation.pdf', 0, 350, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'FLUTTER-001' AND s.Title = N'Flutter Introduction' AND l.Title = N'Flutter là gì?' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'Dart_Language_Tour.pdf', 'https://example.com/resources/dart-language-tour.pdf', 0, 420, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'FLUTTER-001' AND s.Title = N'Flutter Introduction' AND l.Title = N'Dart Programming Basics' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'flutter-first-app.zip', 'https://example.com/resources/flutter-first-app.zip', 1, 8192, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'FLUTTER-001' AND s.Title = N'Flutter Introduction' AND l.Title = N'Tạo Flutter App đầu tiên' AND l.IsDeleted = 0;

-- Image Resources
INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'react-logo.png', 'https://example.com/resources/images/react-logo.png', 3, 45, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'REACT-001' AND s.Title = N'Giới thiệu về React' AND l.Title = N'React là gì?' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'nodejs-architecture.png', 'https://example.com/resources/images/nodejs-architecture.png', 3, 120, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'NODE-001' AND s.Title = N'Giới thiệu Node.js' AND l.Title = N'Node.js là gì?' AND l.IsDeleted = 0;

INSERT INTO Resources (Id, LectureId, FileName, FileUrl, ResourceType, FileSizeKB, CreatedAt, IsDeleted)
SELECT NEWID(), l.Id, N'vue-logo.png', 'https://example.com/resources/images/vue-logo.png', 3, 38, GETUTCDATE(), 0
FROM Lectures l
INNER JOIN Sections s ON l.SectionId = s.Id
INNER JOIN Courses c ON s.CourseId = c.Id
WHERE c.CourseCode = 'VUE-001' AND s.Title = N'Vue.js Basics' AND l.Title = N'Vue.js Overview' AND l.IsDeleted = 0;

GO
