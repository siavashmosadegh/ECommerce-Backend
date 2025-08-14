use mydatabase;

CREATE TABLE [dbo].[GuestUsers] (
    GuestID INT PRIMARY KEY IDENTITY,
    Email NVARCHAR(255) NULL,
    Phone NVARCHAR(20) NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);