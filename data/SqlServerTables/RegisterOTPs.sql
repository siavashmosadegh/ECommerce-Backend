use mydatabase;

CREATE TABLE [dbo].[RegisterOTPs] (
	RegisterOTPsId INT IDENTITY(1,1) PRIMARY KEY,
	otpCode nvarchar(10) NOT NULL,
	PhoneNumber nvarchar(100) NOT NULL,
	FirstName nvarchar(100) NOT NULL,
	LastName nvarchar(100) NOT NULL,
	PasswordHash nvarchar(255) NOT NULL,
	createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    expiresAt DATETIME NOT NULL,
    isUsed BIT DEFAULT 0,
)