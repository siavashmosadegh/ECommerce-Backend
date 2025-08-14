SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
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
	[NationalCode] [nvarchar](10) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Users] ADD PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
