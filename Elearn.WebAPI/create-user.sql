CREATE LOGIN [3698] WITH PASSWORD = 'Password123!';
GO

CREATE DATABASE [ElearnDb];
GO

USE [ElearnDb];
GO

CREATE USER [3698] FOR LOGIN [3698];
GO

ALTER ROLE db_owner ADD MEMBER [3698];
GO

PRINT 'User 3698 created successfully with db_owner permissions';
