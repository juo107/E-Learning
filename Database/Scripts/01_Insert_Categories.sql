-- =============================================
-- Script: Insert Sample Categories
-- Description: Insert sample categories for the E-Learning platform
-- All IDs are auto-generated using NEWID()
-- =============================================

-- Declare variables to store category IDs
DECLARE @CategoryProgramming UNIQUEIDENTIFIER = NEWID();
DECLARE @CategoryDesign UNIQUEIDENTIFIER = NEWID();
DECLARE @CategoryBusiness UNIQUEIDENTIFIER = NEWID();
DECLARE @CategoryLanguage UNIQUEIDENTIFIER = NEWID();

DECLARE @CategoryWebDev UNIQUEIDENTIFIER = NEWID();
DECLARE @CategoryMobileDev UNIQUEIDENTIFIER = NEWID();
DECLARE @CategoryBackendDev UNIQUEIDENTIFIER = NEWID();
DECLARE @CategoryFrontendDev UNIQUEIDENTIFIER = NEWID();
DECLARE @CategoryDataScience UNIQUEIDENTIFIER = NEWID();

DECLARE @CategoryUIUX UNIQUEIDENTIFIER = NEWID();
DECLARE @CategoryGraphicDesign UNIQUEIDENTIFIER = NEWID();
DECLARE @Category3DDesign UNIQUEIDENTIFIER = NEWID();

DECLARE @CategoryDigitalMarketing UNIQUEIDENTIFIER = NEWID();
DECLARE @CategoryBusinessStrategy UNIQUEIDENTIFIER = NEWID();
DECLARE @CategoryEntrepreneurship UNIQUEIDENTIFIER = NEWID();

DECLARE @CategoryEnglish UNIQUEIDENTIFIER = NEWID();
DECLARE @CategoryJapanese UNIQUEIDENTIFIER = NEWID();
DECLARE @CategoryChinese UNIQUEIDENTIFIER = NEWID();

-- Insert main categories
INSERT INTO Categories (Id, Name, Description, ParentCategoryId, CreatedAt, IsDeleted)
VALUES
    (@CategoryProgramming, N'Lập trình', N'Các khóa học về lập trình và phát triển phần mềm', NULL, GETUTCDATE(), 0),
    (@CategoryDesign, N'Thiết kế', N'Các khóa học về thiết kế đồ họa và UI/UX', NULL, GETUTCDATE(), 0),
    (@CategoryBusiness, N'Kinh doanh', N'Các khóa học về kinh doanh và marketing', NULL, GETUTCDATE(), 0),
    (@CategoryLanguage, N'Ngôn ngữ', N'Các khóa học về ngôn ngữ và giao tiếp', NULL, GETUTCDATE(), 0);

-- Insert sub-categories for Programming
INSERT INTO Categories (Id, Name, Description, ParentCategoryId, CreatedAt, IsDeleted)
VALUES
    (@CategoryWebDev, N'Web Development', N'Phát triển ứng dụng web', @CategoryProgramming, GETUTCDATE(), 0),
    (@CategoryMobileDev, N'Mobile Development', N'Phát triển ứng dụng di động', @CategoryProgramming, GETUTCDATE(), 0),
    (@CategoryBackendDev, N'Backend Development', N'Phát triển backend và API', @CategoryProgramming, GETUTCDATE(), 0),
    (@CategoryFrontendDev, N'Frontend Development', N'Phát triển giao diện người dùng', @CategoryProgramming, GETUTCDATE(), 0),
    (@CategoryDataScience, N'Data Science', N'Khoa học dữ liệu và Machine Learning', @CategoryProgramming, GETUTCDATE(), 0);

-- Insert sub-categories for Design
INSERT INTO Categories (Id, Name, Description, ParentCategoryId, CreatedAt, IsDeleted)
VALUES
    (@CategoryUIUX, N'UI/UX Design', N'Thiết kế giao diện và trải nghiệm người dùng', @CategoryDesign, GETUTCDATE(), 0),
    (@CategoryGraphicDesign, N'Graphic Design', N'Thiết kế đồ họa và branding', @CategoryDesign, GETUTCDATE(), 0),
    (@Category3DDesign, N'3D Design', N'Thiết kế 3D và modeling', @CategoryDesign, GETUTCDATE(), 0);

-- Insert sub-categories for Business
INSERT INTO Categories (Id, Name, Description, ParentCategoryId, CreatedAt, IsDeleted)
VALUES
    (@CategoryDigitalMarketing, N'Digital Marketing', N'Marketing số và quảng cáo online', @CategoryBusiness, GETUTCDATE(), 0),
    (@CategoryBusinessStrategy, N'Business Strategy', N'Chiến lược kinh doanh và quản lý', @CategoryBusiness, GETUTCDATE(), 0),
    (@CategoryEntrepreneurship, N'Entrepreneurship', N'Khởi nghiệp và startup', @CategoryBusiness, GETUTCDATE(), 0);

-- Insert sub-categories for Language
INSERT INTO Categories (Id, Name, Description, ParentCategoryId, CreatedAt, IsDeleted)
VALUES
    (@CategoryEnglish, N'Tiếng Anh', N'Học tiếng Anh từ cơ bản đến nâng cao', @CategoryLanguage, GETUTCDATE(), 0),
    (@CategoryJapanese, N'Tiếng Nhật', N'Học tiếng Nhật cho người mới bắt đầu', @CategoryLanguage, GETUTCDATE(), 0),
    (@CategoryChinese, N'Tiếng Trung', N'Học tiếng Trung Quốc', @CategoryLanguage, GETUTCDATE(), 0);

GO

