CREATE TABLE [dbo].[Category] (
    [CategoryID]        INT            IDENTITY (1, 1) NOT NULL,
    [CategoryName]      NVARCHAR (100) NOT NULL,
    [Description]       NVARCHAR (255) NULL,
    [CreatedDate]       DATETIME       DEFAULT (getdate()) NULL,
    [FarsiCategoryName] NVARCHAR (100) NOT NULL,
    PRIMARY KEY CLUSTERED ([CategoryID] ASC)
);