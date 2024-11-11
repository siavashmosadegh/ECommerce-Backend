CREATE TABLE [dbo].[ProductType] (
    [productTypeID]        INT           IDENTITY (1, 1) NOT NULL,
    [categoryID]           INT           NOT NULL,
    [productTypeName]      NVARCHAR (50) NOT NULL,
    [productTypeNameFarsi] NVARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([productTypeID] ASC),
    FOREIGN KEY ([categoryID]) REFERENCES [dbo].[Category] ([CategoryID])
);