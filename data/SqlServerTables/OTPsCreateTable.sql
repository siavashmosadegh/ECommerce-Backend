use mydatabase;

CREATE TABLE [dbo].[OTPs] (
    otpId INT PRIMARY KEY IDENTITY,
    userId INT,
    otpCode NVARCHAR(10) NOT NULL,
    phoneNumber NVARCHAR(20) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    expiresAt DATETIME NOT NULL,
    isUsed BIT DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES Users(UserID)
);