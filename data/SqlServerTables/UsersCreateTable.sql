USE [mydatabase]
GO

/****** Object:  Table [dbo].[Users]    Script Date: 12/7/2025 1:49:05 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Users](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [nvarchar](100) NULL,
	[Email] [nvarchar](255) NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[FirstName] [nvarchar](100) NULL,
	[PhoneNumber] [nvarchar](20) NULL,
	[UpdatedAt] [datetime] NULL,
	[reset_token] [nvarchar](255) NULL,
	[reset_token_expiry] [datetime] NULL,
	[Role] [nvarchar](255) NULL,
	[CreatedAt] [datetime] NULL,
	[LastName] [nvarchar](100) NULL,
	[BirthDay] [int] NULL,
	[BirthMonth] [int] NULL,
	[BirthYear] [int] NULL,
	[NationalCode] [nvarchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO

ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [CK_Users_ValidEmail] CHECK  (([Email] IS NULL OR [Email] like '%_@_%._%'))
GO

ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [CK_Users_ValidEmail]
GO