use mydatabase;

CREATE TABLE [dbo].[Cart] (
    CartId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    UserID INT NULL, -- NULL means guest user
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (UserID) REFERENCES Users (UserID)
);