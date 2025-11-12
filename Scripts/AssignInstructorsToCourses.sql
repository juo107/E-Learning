-- Script để gán instructor cho các courses
-- Lấy tất cả instructor profiles
DECLARE @InstructorProfiles TABLE (
    InstructorProfileId INT,
    UserId NVARCHAR(450),
    FullName NVARCHAR(MAX),
    RowNum INT
);

-- Lấy danh sách instructor profiles với ApplicationUser
INSERT INTO @InstructorProfiles (InstructorProfileId, UserId, FullName, RowNum)
SELECT 
    ip.Id AS InstructorProfileId,
    ip.ApplicationUserId AS UserId,
    u.FullName,
    ROW_NUMBER() OVER (ORDER BY ip.Id) AS RowNum
FROM InstructorProfiles ip
INNER JOIN AspNetUsers u ON ip.ApplicationUserId = u.Id
WHERE ip.IsDeleted = 0;

-- Lấy tất cả courses chưa có instructor
DECLARE @CoursesWithoutInstructor TABLE (
    CourseId UNIQUEIDENTIFIER,
    CourseCode NVARCHAR(50),
    Title NVARCHAR(MAX),
    RowNum INT
);

INSERT INTO @CoursesWithoutInstructor (CourseId, CourseCode, Title, RowNum)
SELECT 
    Id AS CourseId,
    CourseCode,
    Title,
    ROW_NUMBER() OVER (ORDER BY CreatedAt) AS RowNum
FROM Courses
WHERE IsDeleted = 0 
    AND (InstructorProfileId IS NULL OR InstructorProfileId = 0);

-- Đếm số lượng
DECLARE @TotalInstructors INT;
DECLARE @TotalCourses INT;
DECLARE @CoursesWithInstructors INT;

SELECT @TotalInstructors = COUNT(*) FROM @InstructorProfiles;
SELECT @TotalCourses = COUNT(*) FROM @CoursesWithoutInstructor;

-- Gán instructor cho courses (round-robin)
UPDATE c
SET 
    c.InstructorProfileId = ip.InstructorProfileId,
    c.UpdatedAt = GETUTCDATE(),
    c.UpdatedBy = 'System'
FROM Courses c
INNER JOIN @CoursesWithoutInstructor cwoi ON c.Id = cwoi.CourseId
INNER JOIN @InstructorProfiles ip ON (cwoi.RowNum - 1) % @TotalInstructors + 1 = ip.RowNum
WHERE c.IsDeleted = 0 
    AND (c.InstructorProfileId IS NULL OR c.InstructorProfileId = 0);

SELECT @CoursesWithInstructors = @@ROWCOUNT;

-- Hiển thị kết quả
PRINT '========================================';
PRINT 'Kết quả gán instructor cho courses:';
PRINT '========================================';
PRINT 'Tổng số instructors: ' + CAST(@TotalInstructors AS NVARCHAR(10));
PRINT 'Tổng số courses cần gán: ' + CAST(@TotalCourses AS NVARCHAR(10));
PRINT 'Số courses đã được gán: ' + CAST(@CoursesWithInstructors AS NVARCHAR(10));
PRINT '========================================';

-- Hiển thị danh sách courses đã được gán
SELECT 
    c.CourseCode,
    c.Title,
    ip.Id AS InstructorProfileId,
    u.FullName AS InstructorName,
    u.Email AS InstructorEmail
FROM Courses c
INNER JOIN InstructorProfiles ip ON c.InstructorProfileId = ip.Id
INNER JOIN AspNetUsers u ON ip.ApplicationUserId = u.Id
WHERE c.IsDeleted = 0 
    AND c.InstructorProfileId IS NOT NULL
ORDER BY c.CreatedAt DESC;

