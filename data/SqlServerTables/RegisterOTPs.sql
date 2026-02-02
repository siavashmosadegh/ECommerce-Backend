USE [mydatabase]
GO

/****** Object:  Table [dbo].[RegisterOTPs]    Script Date: 2/2/2026 12:19:30 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RegisterOTPs](
	[RegisterOTPsId] [int] IDENTITY(1,1) NOT NULL,
	[otpCode] [nvarchar](10) NOT NULL,
	[PhoneNumber] [nvarchar](100) NOT NULL,
	[FirstName] [nvarchar](100) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[createdAt] [datetime] NOT NULL,
	[expiresAt] [datetime] NOT NULL,
	[isUsed] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[RegisterOTPsId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[RegisterOTPs] ADD  DEFAULT (getdate()) FOR [createdAt]
GO

ALTER TABLE [dbo].[RegisterOTPs] ADD  DEFAULT ((0)) FOR [isUsed]
GO