use mydatabase;

CREATE TABLE [dbo].[OTPs] (
    otpId INT IDENTITY(1,1) PRIMARY KEY,
    phoneNumber NVARCHAR(20) NOT NULL,
    otpCode NVARCHAR(10) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    expiresAt DATETIME NOT NULL,
    isUsed BIT NOT NULL DEFAULT 0
);